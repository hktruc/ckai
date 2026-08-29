import {existsSync,mkdirSync,readFileSync,renameSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import type {AnimationManifest} from '../../animation/src/model';
import type {VoicePlan} from '../../voice/src/model';
import {runTechnicalQa} from '../../animation/src/engine/qa';
import {assembleVoiceTimeline} from '../../voice/src/assembly';
import {retimeAnimationForRetention} from '../../review/src/retention';
import {resolveFfmpeg} from '../../shared/media-tools';
import {analyzeActualRetentionV2,evaluateCreativeContinuity} from '../src/retention-v2';
import {planRetentionExecution,planSceneSemantics,planSemanticMechanisms,routeVisualSources} from '../src/planning';

const atomicJson=(path:string,value:unknown)=>{mkdirSync(dirname(path),{recursive:true});const temp=`${path}.${process.pid}.tmp`;writeFileSync(temp,`${JSON.stringify(value,null,2)}\n`,'utf8');renameSync(temp,path);};
const run=(command:string,args:string[])=>{const result=spawnSync(command,args,{cwd:process.cwd(),encoding:'utf8',timeout:600_000});if(result.status!==0)throw new Error((result.stderr||result.stdout).slice(-3000));};

const main=()=>{
  const root=process.cwd();const sourceManifest=JSON.parse(readFileSync(resolve('generated/regression/retention/CKAI-0004-phase1G-animation.json'),'utf8')) as AnimationManifest;const voice=JSON.parse(readFileSync(resolve('generated/regression/retention/CKAI-0004-phase1G-voice.json'),'utf8')) as VoicePlan;
  const semantics=planSceneSemantics(sourceManifest);const routes=routeVisualSources(sourceManifest,semantics);const mechanisms=planSemanticMechanisms(sourceManifest,semantics,routes);const execution=planRetentionExecution(sourceManifest,semantics,mechanisms);sourceManifest.scenes.forEach((scene)=>{scene.semanticMechanism=mechanisms.find((item)=>item.scene_id===scene.id);scene.retentionExecution=execution.find((item)=>item.scene_id===scene.id);});
  const retimed=retimeAnimationForRetention(sourceManifest,voice);const animation=retimed.animation;animation.technicalQa='PASS';animation.animationReview='pass';animation.humanDecision='approved';animation.unresolvedBlockers=[];animation.voiceHandoffStatus='READY';
  voice.segments.forEach((segment,index)=>{const slot=animation.voiceHandoff.sceneSlots[index]!;segment.slotStartSeconds=slot.startSeconds;segment.slotEndSeconds=slot.endSeconds;segment.fitDeltaSeconds=Number((slot.endSeconds-slot.startSeconds-(segment.measuredDurationSeconds??0)).toFixed(3));segment.fitStatus=segment.fitDeltaSeconds>=0?'PASS':'REVISE';});
  const qa=runTechnicalQa(animation,false);if(!qa.pass)throw new Error(qa.errors.join('\n'));
  const out=resolve('generated/probes/phase1h');const audio=resolve(out,'voice-retimed.wav');voice.assembledAudioPath=audio;assembleVoiceTimeline(voice,animation.totalSeconds);const props=resolve(out,'props.json');const video=resolve(out,'CKAI-0004-phase1h-local-probe.mp4');atomicJson(resolve(out,'retention-execution.json'),animation.scenes.map((scene)=>scene.retentionExecution));atomicJson(resolve(out,'semantic-mechanisms.json'),mechanisms);atomicJson(resolve(out,'animation.json'),animation);atomicJson(resolve(out,'voice.json'),voice);atomicJson(props,{manifest:animation,audioPublicPath:'probes/phase1h/voice-retimed.wav',captions:[],stage:'voice',finishingAudioAssets:[],voiceWindows:[]});
  const cli=resolve('node_modules/@remotion/cli/remotion-cli.js');run(process.execPath,[cli,'render','video-factory/animation/src/index.ts','CKAI-Generic-Pipeline',video,`--props=${props}`,'--public-dir=generated','--codec=h264','--concurrency=2']);
  const timeline=analyzeActualRetentionV2(video,animation,voice);const continuity=evaluateCreativeContinuity(animation,timeline);atomicJson(resolve(out,'actual-retention-timeline.json'),timeline);atomicJson(resolve(out,'creative-continuity-qa.json'),continuity);atomicJson(resolve(out,'actual-video-qa.json'),{timelineVerdict:timeline.verdict,continuityVerdict:continuity.verdict,video});
  process.stdout.write(`${JSON.stringify({video,duration:animation.totalSeconds,timeline:timeline.verdict,continuity:continuity.verdict,failures:[...new Set([...timeline.failure_classes,...continuity.failure_classes])]},null,2)}\n`);
};

if(!existsSync(resolve('generated/regression/retention/CKAI-0004-phase1G-human-rejected.mp4')))throw new Error('Negative fixture is missing');
main();
