import {copyFileSync,existsSync,mkdirSync,readFileSync,renameSync,writeFileSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import type {AnimationManifest} from '../../animation/src/model';
import {runTechnicalQa} from '../../animation/src/engine/qa';
import {validateRetentionExecution,validateSemanticMechanism} from '../../animation/src/retention-execution';
import type {VoicePlan} from '../../voice/src/model';
import {resolveFfmpeg} from '../../shared/media-tools';
import {validateSourceDecision} from '../src/planning';
import {applyPerceptualProgressionToTimeline,analyzeActualRetentionV2,evaluateCreativeContinuity} from '../src/retention-v2';
import {createOpenAiClient,loadLocalEnv} from '../src/openai-service';
import {runPerceptualProgressionQa,type PerceptualProgressionQa} from '../src/perceptual-qa';
import {createCreativeReviewEscalation,diagnoseVisualFailures,executeAutomaticReplanLoop,type RecoveryPlan,type RecoveryRoundResult,type ReplanAttempt} from '../src/recovery';

const root=process.cwd();const out=resolve('generated/probes/phase1h6');
const atomicJson=(path:string,value:unknown)=>{mkdirSync(dirname(path),{recursive:true});const temp=`${path}.${process.pid}.${Date.now()}.tmp`;writeFileSync(temp,`${JSON.stringify(value,null,2)}\n`,'utf8');renameSync(temp,path);};
const run=(command:string,args:string[])=>{const result=spawnSync(command,args,{cwd:root,encoding:'utf8',timeout:600_000});if(result.status!==0)throw new Error((result.stderr||result.stdout||'command failed').slice(-4000));};
const rel=(path:string)=>relative(root,path).replaceAll('\\','/');
const unique=<T>(values:T[])=>[...new Set(values)];

const initialManifestPath=resolve('generated/probes/phase1h/animation.json');
const voicePath=resolve('generated/probes/phase1h/voice.json');
const initialPerceptualPath=resolve('generated/facebook-packages/CKAI-0004/phase1-visual-trial/perceptual-beat-qa.json');
const initialRetentionPath=resolve('generated/facebook-packages/CKAI-0004/phase1-visual-trial/actual-retention-timeline.json');
const initialContinuityPath=resolve('generated/facebook-packages/CKAI-0004/phase1-visual-trial/creative-continuity-qa.json');
const main=async()=>{
for(const path of [initialManifestPath,voicePath,initialPerceptualPath,initialRetentionPath,initialContinuityPath])if(!existsSync(path))throw new Error(`Required 1H.5 probe artifact missing: ${rel(path)}`);

const initialManifest=JSON.parse(readFileSync(initialManifestPath,'utf8')) as AnimationManifest;
const voice=JSON.parse(readFileSync(voicePath,'utf8')) as VoicePlan;
const initialPerceptual=JSON.parse(readFileSync(initialPerceptualPath,'utf8')) as PerceptualProgressionQa;
const initialRetention=JSON.parse(readFileSync(initialRetentionPath,'utf8')) as {verdict:'PASS'|'FAIL';failure_classes:string[]};
const initialContinuity=JSON.parse(readFileSync(initialContinuityPath,'utf8')) as {verdict:'PASS'|'FAIL';failure_classes:string[]};
mkdirSync(out,{recursive:true});
atomicJson(join(out,'initial-failure-diagnosis.json'),diagnoseVisualFailures(initialPerceptual,initialRetention.failure_classes,initialContinuity.failure_classes));
atomicJson(join(out,'failure-recovery-registry-snapshot.json'),{note:'Canonical registry is code; this snapshot records the rules exercised by the probe.',failures:unique(initialPerceptual.failure_classes).map(failure_class=>({failure_class}))});

const attemptsFrom=(manifest:AnimationManifest,perceptual:PerceptualProgressionQa,round:number):ReplanAttempt[]=>perceptual.scenes.map(scene=>{const source=manifest.scenes.find(item=>item.id===scene.scene_id);return {round,scene_id:scene.scene_id,source:source?.hybridSource?.choice??'unknown',concept:source?.visualRecovery?.variant??source?.artDirection?.primaryVisualConcept??'initial',mechanism:source?.semanticMechanism?.family??'none',visual_states:scene.beats.map(beat=>beat.dominant_state),failures:scene.failure_classes,qa_evidence:scene.beats.flatMap(beat=>beat.failure_reasons).slice(0,8)};});
const initial:RecoveryRoundResult={manifest:initialManifest,diagnoses:diagnoseVisualFailures(initialPerceptual,initialRetention.failure_classes,initialContinuity.failure_classes),machine_pass:false,qa:{perceptual:initialPerceptual,retention:initialRetention,continuity:initialContinuity},attempts:attemptsFrom(initialManifest,initialPerceptual,0)};

if(existsSync(resolve('.env')))loadLocalEnv(resolve('.env'));
const client=createOpenAiClient();const cli=resolve('node_modules/@remotion/cli/remotion-cli.js');if(!existsSync(cli))throw new Error('Remotion CLI missing');

const renderAndQa=async(manifest:AnimationManifest,plan:RecoveryPlan):Promise<RecoveryRoundResult>=>{
  const roundDir=join(out,`round-${plan.round}`);mkdirSync(roundDir,{recursive:true});const props=join(roundDir,'props.json');const video=join(roundDir,`CKAI-0004-phase1h6-round-${plan.round}.mp4`);
  atomicJson(join(roundDir,'replan.json'),plan);atomicJson(join(roundDir,'do-not-repeat-memory.json'),plan.contexts.map(context=>({scene_id:context.scene_id,do_not_repeat:context.do_not_repeat,required_improvement:context.required_improvement})));
  atomicJson(join(roundDir,'animation.json'),manifest);atomicJson(props,{manifest,audioPublicPath:'probes/phase1h/voice-retimed.wav',captions:[],stage:'voice',finishingAudioAssets:[],voiceWindows:[]});
  run(process.execPath,[cli,'render','video-factory/animation/src/index.ts','CKAI-Generic-Pipeline',video,`--props=${props}`,'--public-dir=generated','--codec=h264','--concurrency=2']);
  let retention=analyzeActualRetentionV2(video,manifest,voice);const perceptualResult=await runPerceptualProgressionQa({client,model:'gpt-5.6-terra',videoPath:video,manifest,outputDir:join(roundDir,'perceptual-state-samples')});const perceptual=perceptualResult.qa;retention=applyPerceptualProgressionToTimeline(retention,perceptual);const continuity=evaluateCreativeContinuity(manifest,retention);
  const technical=runTechnicalQa(manifest,false);const semanticErrors=manifest.scenes.flatMap(scene=>[...validateRetentionExecution(scene),...validateSemanticMechanism(scene)]);const sourceErrors=manifest.scenes.flatMap(scene=>{const source=scene.hybridSource?.choice;const evidenceRequired=scene.artDirection?.proof.classification==='actual-proof'||scene.artDirection?.proof.classification==='visual-representation';return source?[...validateSourceDecision({scene_id:scene.id,visual_source:source==='CURATED_OR_GENERATED_KEY_VISUAL'?'GENERATED_KEY_VISUAL':source,source_reason:scene.hybridSource?.rationale??'',evidence_required:evidenceRequired,generation_allowed:(source==='GENERATED_KEY_VISUAL'||source==='CURATED_OR_GENERATED_KEY_VISUAL')&&!evidenceRequired})]:[];});
  atomicJson(join(roundDir,'semantic-safety-qa.json'),{meaning_gate:technical.pass&&semanticErrors.length===0?'PASS':'FAIL',evidence_gate:sourceErrors.length===0?'PASS':'FAIL',technical_errors:technical.errors,semantic_errors:semanticErrors,source_errors:sourceErrors});atomicJson(join(roundDir,'perceptual-beat-qa.json'),perceptual);atomicJson(join(roundDir,'actual-retention-timeline.json'),retention);atomicJson(join(roundDir,'creative-continuity-qa.json'),continuity);atomicJson(join(roundDir,'qa-summary.json'),{video:rel(video),vision_calls:perceptual.vision_calls,retention:retention.verdict,perceptual:perceptual.verdict,continuity:continuity.verdict,meaning:technical.pass&&semanticErrors.length===0?'PASS':'FAIL',evidence:sourceErrors.length===0?'PASS':'FAIL'});
  const machinePass=technical.pass&&semanticErrors.length===0&&sourceErrors.length===0&&retention.verdict==='PASS'&&perceptual.verdict==='PASS'&&continuity.verdict==='PASS';return {manifest,diagnoses:diagnoseVisualFailures(perceptual,retention.failure_classes,continuity.failure_classes),machine_pass:machinePass,qa:{video:rel(video),retention,perceptual,continuity,semanticErrors,sourceErrors},attempts:attemptsFrom(manifest,perceptual,plan.round)};
};

const result=await executeAutomaticReplanLoop({initial,max_rounds:2,runRound:renderAndQa});
atomicJson(join(out,'automatic-replan-result.json'),result);const finalRound=result.rounds.at(-1);if(!finalRound)throw new Error('Initial 1H.5 probe failed but no automatic recovery round ran');
const finalQa=finalRound.result.qa as {video:string;retention:unknown;perceptual:PerceptualProgressionQa;continuity:unknown};const finalVideo=resolve(finalQa.video);copyFileSync(finalVideo,join(out,'CKAI-0004-phase1h6-final.mp4'));atomicJson(join(out,'final-perceptual-qa.json'),finalQa.perceptual);atomicJson(join(out,'final-actual-retention-timeline.json'),finalQa.retention);atomicJson(join(out,'final-creative-continuity-qa.json'),finalQa.continuity);
const learning=result.rounds.flatMap(({plan:roundPlan,result:roundResult})=>roundPlan.actions.map(action=>({failure:action.failures,failed_pattern:action.do_not_repeat,recovery:action.variant,recovery_result:roundResult.machine_pass?'SUCCESS':'FAILED',context:'automatic visual recovery probe',source_before:action.source_before,source_after:action.source_after,mechanism_before:action.mechanism_before,mechanism_after:action.mechanism_after})));
atomicJson(join(out,'production-learning.json'),learning);
if(result.status==='NEEDS_CHATGPT_CREATIVE_REVIEW')atomicJson(join(out,'needs-chatgpt-creative-review.json'),createCreativeReviewEscalation('CKAI-0004',result));
const packageDir=join(out,'review-package');mkdirSync(packageDir,{recursive:true});copyFileSync(join(out,'CKAI-0004-phase1h6-final.mp4'),join(packageDir,'CKAI-0004_phase1h6_visual-review.mp4'));atomicJson(join(packageDir,'package-manifest.json'),{contentId:'CKAI-0004',packageState:'PHASE1H6_VISUAL_REVIEW_PACKAGE',machineAcceptance:result.status==='MACHINE_VISUAL_ACCEPTANCE'?'PASS':'NOT_YET_PASS',humanProductOwnerAcceptance:'PENDING',releaseState:'PENDING_RELEASE_APPROVAL',automaticReplanRoundsUsed:result.rounds_used,video:rel(join(packageDir,'CKAI-0004_phase1h6_visual-review.mp4')),finalPerceptualQa:rel(join(out,'final-perceptual-qa.json')),finalRetentionTimeline:rel(join(out,'final-actual-retention-timeline.json')),finalContinuityQa:rel(join(out,'final-creative-continuity-qa.json')),escalation:result.status==='NEEDS_CHATGPT_CREATIVE_REVIEW'?rel(join(out,'needs-chatgpt-creative-review.json')):null,note:'Machine visual result only; no Release Approval is conferred.'});
process.stdout.write(`${JSON.stringify({status:result.status,rounds_used:result.rounds_used,vision_calls:result.rounds.reduce((sum,item)=>sum+((item.result.qa as {perceptual:PerceptualProgressionQa}).perceptual.vision_calls??0),0),image_generation_calls:0,vbee_calls:0,video:rel(join(out,'CKAI-0004-phase1h6-final.mp4')),package:rel(packageDir)},null,2)}\n`);
};
main().catch((error)=>{process.stderr.write(`${error instanceof Error?error.stack:error}\n`);process.exitCode=1;});
