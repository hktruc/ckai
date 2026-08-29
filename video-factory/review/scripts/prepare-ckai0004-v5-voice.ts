import {existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import {dirname, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {parseFrontmatter} from '../../animation/src/engine/upstream';
import {runTechnicalQa} from '../../animation/src/engine/qa';
import type {AnimationManifest} from '../../animation/src/model';
import {assembleVoiceTimeline} from '../../voice/src/assembly';
import {createGenericVoiceDraft} from '../../voice/src/manifest/generic';
import {probeAudio, probeAudioLevels} from '../../voice/src/media';
import type {VoicePlan} from '../../voice/src/model';
import {runVoiceQa} from '../../voice/src/qa';
import {sha256} from '../../voice/src/segment';

const root=process.cwd();
const contentId='CKAI-0004';
const acceptedAnimationSha='8848D754849B7F554234B0BC65F776720C96C3C9064F3D72B6C4BB557039AA1D';
const acceptedPriorVoiceSha='A8D065FF1D1A18DFC6612848EC0B01A434D85BD170A3893E96EB817C76ECA110';
const acceptedPriorPreviewSha='9F1B01323A502954EB1D8BB343E5B1E8F3372628B26C3ADB0FB6B2445D0EADCD';
const rel=(path:string)=>relative(root,path).replaceAll('\\','/');
const ownerRel=(owner:string,path:string)=>relative(dirname(owner),path).replaceAll('\\','/');
const hash=(path:string)=>sha256(readFileSync(path));
const atomicWrite=(path:string,value:string)=>{mkdirSync(dirname(path),{recursive:true});const temporary=`${path}.${process.pid}.tmp`;writeFileSync(temporary,value,'utf8');renameSync(temporary,path);};
const atomicJson=(path:string,value:unknown)=>atomicWrite(path,`${JSON.stringify(value,null,2)}\n`);
const run=(command:string,args:string[],code:string)=>{const result=spawnSync(command,args,{cwd:root,encoding:'utf8',timeout:600_000});if(result.status!==0)throw new Error(`${code}: ${(result.stderr||result.stdout).slice(-3000)}`);};

const animationSnapshotPath=resolve('generated/production/CKAI-0004/v5/animation-manifest.pending.json');
const animationArtifactPath=resolve('content/animations/CKAI-0004_tach-du-kien-suy-luan-chua-biet_animation-v5.md');
const priorVoiceSnapshotPath=resolve('generated/voice/CKAI-0004/v3/voice-plan.generated.json');
const priorVoiceArtifactPath=resolve('content/voices/CKAI-0004_tach-du-kien-suy-luan-chua-biet_voice-plan-v3.md');
const priorVoicePreviewPath=resolve('generated/previews/CKAI-0004-voice-v3.mp4');
for(const path of [animationSnapshotPath,animationArtifactPath,priorVoiceSnapshotPath,priorVoiceArtifactPath,priorVoicePreviewPath])if(!existsSync(path))throw new Error(`Required canonical source missing: ${rel(path)}`);

if(hash(animationSnapshotPath)!==acceptedAnimationSha)throw new Error('Accepted STEP 05 snapshot is stale');
const animationFields=parseFrontmatter(readFileSync(animationArtifactPath,'utf8'));
const expectedAnimation:Record<string,string>={input_eligibility:'production',upstream_animation_handoff_status:'READY',technical_qa:'PASS',animation_review:'pass',human_decision:'approved',voice_handoff_status:'READY',unresolved_blockers:'none',operator_acceptance_by:'chatgpt-work'};
for(const [field,value] of Object.entries(expectedAnimation))if(animationFields[field]!==value)throw new Error(`Canonical STEP 05 acceptance requires ${field}=${value}`);
if(String(animationFields.executable_manifest_sha256??'').toUpperCase()!==acceptedAnimationSha||String(animationFields.operator_acceptance_source_sha256??'').toUpperCase()!==acceptedAnimationSha||!Number.isFinite(Date.parse(String(animationFields.operator_acceptance_at??'')))||!String(animationFields.operator_acceptance_basis??'').toUpperCase().includes(acceptedAnimationSha))throw new Error('Canonical STEP 05 delegated acceptance provenance is invalid or stale');

const animation=JSON.parse(readFileSync(animationSnapshotPath,'utf8')) as AnimationManifest;
animation.technicalQa='PASS';animation.animationReview='pass';animation.humanDecision='approved';animation.unresolvedBlockers=[];animation.voiceHandoffStatus='READY';
const animationQa=runTechnicalQa(animation,false);if(!animationQa.pass)throw new Error(`ACCEPTED_ANIMATION_QA_BLOCKED:\n${animationQa.errors.join('\n')}`);

if(hash(priorVoiceSnapshotPath)!==acceptedPriorVoiceSha||hash(priorVoicePreviewPath)!==acceptedPriorPreviewSha)throw new Error('Previously accepted Voice source or preview is stale');
const priorFields=parseFrontmatter(readFileSync(priorVoiceArtifactPath,'utf8'));
if(priorFields.voice_review!=='pass'||priorFields.human_decision!=='approved'||priorFields.final_review_input_status!=='READY'||priorFields.operator_acceptance_by!=='chatgpt-work'||String(priorFields.operator_acceptance_source_sha256??'').toUpperCase()!==acceptedPriorVoiceSha||!String(priorFields.operator_acceptance_basis??'').toUpperCase().includes(acceptedPriorPreviewSha))throw new Error('Prior canonical Voice acceptance is incomplete or stale');
const prior=JSON.parse(readFileSync(priorVoiceSnapshotPath,'utf8')) as VoicePlan;

const voiceSnapshotPath=resolve('generated/voice/CKAI-0004/v5/voice-plan.pending.json');
const voiceMasterPath=resolve('generated/voice/CKAI-0004/v5/master.wav');
const voicePreviewPath=resolve('generated/previews/CKAI-0004-voice-v5.mp4');
const voiceArtifactPath=resolve('content/voices/CKAI-0004_tach-du-kien-suy-luan-chua-biet_voice-plan-v5.md');
const propsPath=resolve('generated/production/CKAI-0004/v5/voice-props.json');
const plan=createGenericVoiceDraft({contentId,animation,sourceAnimationArtifact:rel(animationArtifactPath),sourceAnimationArtifactSha256:hash(animationArtifactPath),sourceAnimationManifest:rel(animationSnapshotPath),sourceAnimationManifestSha256:acceptedAnimationSha,assembledAudioPath:rel(voiceMasterPath),previewPath:rel(voicePreviewPath)});
const priorByKey=new Map(prior.segments.map((segment)=>[segment.cacheKey,segment]));
for(const segment of plan.segments){
  const cached=priorByKey.get(segment.cacheKey);
  if(!cached||cached.originalText!==segment.originalText||cached.synthesisText!==segment.synthesisText||cached.speakerAlias!==segment.speakerAlias||!cached.providerMetadata||!existsSync(segment.generatedAudioPath))throw new Error(`${segment.id} has no byte-identical accepted cached narration source`);
  const media=probeAudio(segment.generatedAudioPath);const levels=probeAudioLevels(segment.generatedAudioPath);
  if(levels.meanVolumeDb<-60||levels.maxVolumeDb<-60)throw new Error(`${segment.id} cached narration is effectively silent`);
  segment.measuredDurationSeconds=Number(media.duration.toFixed(3));segment.fitDeltaSeconds=Number((segment.slotEndSeconds-segment.slotStartSeconds-media.duration).toFixed(3));segment.fitStatus=segment.fitDeltaSeconds>=0?'PASS':'REVISE';
  segment.providerMetadata={...cached.providerMetadata,outputPath:segment.generatedAudioPath,cacheHit:true};
}
if(plan.segments.some((segment)=>segment.fitStatus!=='PASS'))throw new Error('Cached narration does not fit the accepted retention timeline');
plan.segmentsGeneratedCheck='PASS';plan.audioTechnicalQa='PASS';plan.timingFitCheck='PASS';plan.pronunciationCheck='PASS';plan.voiceReview='pending';plan.humanDecision='pending';plan.unresolvedBlockers=['canonical delegated Voice acceptance pending'];plan.finalReviewInputStatus='BLOCKED';
assembleVoiceTimeline(plan,animation.totalSeconds);
const sourceQa=runVoiceQa({plan,animation},'production',true,false);if(!sourceQa.pass)throw new Error(`V5_VOICE_SOURCE_QA_BLOCKED:\n${sourceQa.errors.join('\n')}`);

atomicJson(propsPath,{manifest:animation,audioPublicPath:relative(resolve('generated'),voiceMasterPath).replaceAll('\\','/'),captions:[],stage:'voice',finishingAudioAssets:[],voiceWindows:[]});
mkdirSync(dirname(voicePreviewPath),{recursive:true});
run(process.execPath,[resolve('node_modules/@remotion/cli/remotion-cli.js'),'render','video-factory/animation/src/index.ts','CKAI-Generic-Pipeline',voicePreviewPath,`--props=${rel(propsPath)}`,'--public-dir=generated','--codec=h264','--concurrency=2'],'REMOTION_V5_VOICE_PREVIEW_FAILED');
const preview=probeAudio(voicePreviewPath);const previewLevels=probeAudioLevels(voicePreviewPath);
plan.previewMediaQa={sha256:hash(voicePreviewPath),codec:preview.codec,sampleRate:preview.sampleRate,channels:preview.channels,meanVolumeDb:previewLevels.meanVolumeDb,maxVolumeDb:previewLevels.maxVolumeDb,zeroDbSampleRatio:previewLevels.zeroDbSampleRatio};
const muxedQa=runVoiceQa({plan,animation},'production',true,true);if(!muxedQa.pass)throw new Error(`V5_VOICE_MUXED_QA_BLOCKED:\n${muxedQa.errors.join('\n')}`);
atomicJson(voiceSnapshotPath,plan);const voiceSnapshotSha=hash(voiceSnapshotPath);
atomicWrite(voiceArtifactPath,`---\nid: ${contentId}\ntype: short-form-voice-plan\nsource_animation_artifact: ${ownerRel(voiceArtifactPath,animationArtifactPath)}\nsource_animation_artifact_sha256: ${plan.sourceAnimationArtifactSha256}\nsource_animation_manifest: ${plan.sourceAnimationManifest}\nsource_animation_manifest_sha256: ${plan.sourceAnimationManifestSha256}\nsource_animation_voice_handoff_sha256: ${plan.sourceAnimationVoiceHandoffSha256}\nsource_script: ${plan.sourceScript}\ninput_eligibility: production\npreferred_provider: vbee\nproduction_approved_voice_mapping: true\nvoice_selection_check: PASS\nprovider_input_check: PASS\nsegments_generated_check: PASS\naudio_technical_qa: PASS\ntiming_fit_check: PASS\npronunciation_check: PASS\nproof_caveat_check: PASS\nvoice_review: pending\nhuman_decision: pending\nfinal_review_input_status: BLOCKED\nunresolved_blockers: canonical delegated Voice acceptance pending\noperator_acceptance_by: pending\noperator_acceptance_at: pending\noperator_acceptance_basis: pending\noperator_acceptance_source_sha256: pending\n---\n\n# CKAI-0004 V5 Voice Plan\n\nByte-identical accepted HN - Minh Quân narration segments were reassembled on the accepted V5 timeline. No Vbee request was made. STEP 07 remains blocked until delegated Voice acceptance is bound to snapshot ${voiceSnapshotSha} and preview ${plan.previewMediaQa.sha256}.\n`);
console.log(JSON.stringify({status:'BLOCKED',errorCode:'VOICE_DELEGATED_ACCEPTANCE_REQUIRED',voiceSnapshot:rel(voiceSnapshotPath),voiceSnapshotSha256:voiceSnapshotSha,voicePreview:rel(voicePreviewPath),voicePreviewSha256:plan.previewMediaQa.sha256,meanVolumeDb:plan.previewMediaQa.meanVolumeDb,maxVolumeDb:plan.previewMediaQa.maxVolumeDb,sampleRate:plan.previewMediaQa.sampleRate,channels:plan.previewMediaQa.channels,spokenCopyIntegrity:plan.segments.every((segment,index)=>segment.originalText===prior.segments[index]?.originalText)?'PASS':'FAIL',cacheReuse:plan.segments.every((segment)=>segment.providerMetadata?.cacheHit)?'PASS':'FAIL',vbeeCalls:0,vbeeCharacters:0,step07:'NOT_STARTED',step08:'NOT_RUN'},null,2));
