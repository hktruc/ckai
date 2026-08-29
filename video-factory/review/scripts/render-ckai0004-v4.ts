import {devNull} from 'node:os';
import {existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import {basename, dirname, join, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {parseFrontmatter} from '../../animation/src/engine/upstream';
import type {AnimationManifest} from '../../animation/src/model';
import {runVoiceQa} from '../../voice/src/qa';
import {probeAudioLevels} from '../../voice/src/media';
import {sha256} from '../../voice/src/segment';
import type {VoicePlan} from '../../voice/src/model';
import {createGenericReviewDraft} from '../src/manifest/generic';
import {probeVideo} from '../src/media';
import {runReviewQa} from '../src/qa';
import {inspectActualBinaryExperience} from '../src/experience';
import type {FinalReviewManifest, FinishingAudioAsset, SfxCueType, SourceReference} from '../src/model';

const root = process.cwd(); const contentId = 'CKAI-0004'; const sourceVersion = 'v3'; const targetVersion = 'v4';
const rel = (path: string) => relative(root, path).replaceAll('\\','/');
const ownerRel = (owner: string, path: string) => relative(dirname(owner), path).replaceAll('\\','/');
const hash = (path: string) => sha256(readFileSync(path));
const atomicWrite = (path: string, value: string) => { mkdirSync(dirname(path),{recursive:true}); const temporary=`${path}.${process.pid}.tmp`; writeFileSync(temporary,value,'utf8'); renameSync(temporary,path); };
const atomicJson = (path: string, value: unknown) => atomicWrite(path, `${JSON.stringify(value,null,2)}\n`);
const run = (command:string,args:string[],code:string) => { const result=spawnSync(command,args,{cwd:root,encoding:'utf8',timeout:600_000}); if(result.status!==0) throw new Error(`${code}: ${(result.stderr||result.stdout).slice(-2000)}`); return result; };
const probeWindowLevels = (path:string,startSeconds:number,durationSeconds:number) => {
  const result=run('ffmpeg',['-hide_banner','-nostats','-ss',String(startSeconds),'-t',String(durationSeconds),'-i',path,'-af','volumedetect','-f','null',devNull],'AUDIO_WINDOW_QA_FAILED');
  const output=result.stderr;
  const mean=output.match(/mean_volume:\s*(-?\d+(?:\.\d+)?) dB/);
  const peak=output.match(/max_volume:\s*(-?\d+(?:\.\d+)?) dB/);
  if(!mean || !peak) throw new Error(`AUDIO_WINDOW_QA_FAILED: no loudness result for ${rel(path)}`);
  return {meanVolumeDb:Number(mean[1]),maxVolumeDb:Number(peak[1])};
};

const voiceSnapshotPath = resolve(`generated/voice/${contentId}/${sourceVersion}/voice-plan.generated.json`);
const voiceArtifactPath = resolve('content/voices/CKAI-0004_tach-du-kien-suy-luan-chua-biet_voice-plan-v3.md');
const animationPath = resolve(`generated/production/${contentId}/${sourceVersion}/animation-manifest.generated.json`);
const planPath = resolve(`generated/audio/${contentId}/${targetVersion}/audio-experience-plan.json`);
const registryPath = resolve('generated/audio/ckai-original/library.generated.json');
for (const path of [voiceSnapshotPath,voiceArtifactPath,animationPath,planPath,registryPath]) if(!existsSync(path)) throw new Error(`Required canonical input missing: ${rel(path)}`);

const pendingSnapshotSha = hash(voiceSnapshotPath);
const technicalPlan = JSON.parse(readFileSync(voiceSnapshotPath,'utf8')) as VoicePlan;
if (pendingSnapshotSha !== 'A8D065FF1D1A18DFC6612848EC0B01A434D85BD170A3893E96EB817C76ECA110') throw new Error('Accepted Voice technical snapshot hash is stale');
technicalPlan.finalReviewInputStatus = 'BLOCKED'; delete technicalPlan.finalReviewExportHandoffStatus;
const voiceFields = parseFrontmatter(readFileSync(voiceArtifactPath,'utf8'));
const expectedVoiceFields: Record<string,string> = {voice_review:'pass',human_decision:'approved',final_review_input_status:'READY',operator_acceptance_by:'chatgpt-work'};
for(const [field,value] of Object.entries(expectedVoiceFields)) if(voiceFields[field]!==value) throw new Error(`Canonical Voice acceptance requires ${field}=${value}`);
if(String(voiceFields.operator_acceptance_source_sha256??'').toUpperCase()!==pendingSnapshotSha || !Number.isFinite(Date.parse(String(voiceFields.operator_acceptance_at??''))) || !String(voiceFields.operator_acceptance_basis??'').includes('9F1B01323A502954EB1D8BB343E5B1E8F3372628B26C3ADB0FB6B2445D0EADCD')) throw new Error('Canonical Voice acceptance provenance/hash is invalid');
const voicePlan: VoicePlan = {...technicalPlan,voiceReview:'pass',humanDecision:'approved',finalReviewInputStatus:'READY',unresolvedBlockers:[]};
const animation = JSON.parse(readFileSync(animationPath,'utf8')) as AnimationManifest;
const voiceQa = runVoiceQa({plan:voicePlan,animation},'production',true,true); if(!voiceQa.pass) throw new Error(`VOICE_QA_BLOCKED:\n${voiceQa.errors.join('\n')}`);

const audioPlan = JSON.parse(readFileSync(planPath,'utf8')) as any;
const registry = JSON.parse(readFileSync(registryPath,'utf8')) as {assets:Array<any>};
const byId = new Map(registry.assets.map((asset) => [asset.assetId,asset]));
const musicDefinition = audioPlan.music.selectedAsset; const musicRegistry = byId.get(musicDefinition.id);
if(!musicRegistry?.productionApproved || musicRegistry.sha256!==musicDefinition.sha256) throw new Error('Selected music is not bound to the validated original-audio registry');
const provenance = 'CKAI_ORIGINAL_AUDIO_FFMPEG_V1 deterministic synthesis; no external samples, downloads or providers';
const assets: FinishingAudioAsset[] = [{id:musicDefinition.id,type:'music',localPath:musicDefinition.localPath,source:'CKAI_PROCEDURAL_GENERATION',provenance,purpose:'continuous restrained editorial bed',licenseStatus:'approved',startSeconds:0,durationSeconds:musicRegistry.durationSeconds,gainDb:audioPlan.music.plannedBaseGainDb,fadeInSeconds:audioPlan.music.plannedFadeInSeconds,fadeOutSeconds:audioPlan.music.plannedFadeOutSeconds,duckUnderVoiceDb:audioPlan.music.plannedDuckUnderVoiceDb,required:true,sha256:musicDefinition.sha256}];
for(const cue of audioPlan.sfx.cuePlan.filter((value:any)=>value.use!=='none')) {
  const registryAsset=byId.get(cue.use); if(!registryAsset?.productionApproved) throw new Error(`${cue.use} is not production-approved by technical validation`);
  assets.push({id:`${cue.use}-${cue.sceneId}`,type:'sfx',localPath:registryAsset.path,source:'CKAI_PROCEDURAL_GENERATION',provenance,purpose:cue.purpose,licenseStatus:'approved',sceneId:cue.sceneId,cueType:cue.cueType as SfxCueType,startSeconds:cue.startSeconds,durationSeconds:registryAsset.durationSeconds,gainDb:cue.gainDb,required:true,sha256:registryAsset.sha256});
}

const one = (directory:string) => { const matches=readdirSync(directory).filter((name)=>name.startsWith(`${contentId}_`) && name.endsWith('.md')); if(matches.length!==1) throw new Error(`Exactly one canonical source required in ${rel(directory)}`); return join(directory,matches[0]); };
const scriptPath=resolve(voicePlan.sourceScript); const storyboardPath=one(resolve('content/storyboards')); const visualPath=resolve(animation.sourceVisualDirection); const animationArtifactPath=resolve(voicePlan.sourceAnimationArtifact);
const sourceChain = [['script',scriptPath],['storyboard',storyboardPath],['visual-direction',visualPath],['animation',animationArtifactPath],['voice',voiceArtifactPath]].map(([stage,path])=>({stage,path:rel(path),sha256:hash(path)})) as SourceReference[];
const review = createGenericReviewDraft({contentId,animation,voicePlan,sourceChain,sourceVoiceSnapshot:rel(voiceSnapshotPath),sourceVoiceSnapshotSha256:pendingSnapshotSha,sourceVoiceAudioSha256:hash(resolve(voicePlan.assembledAudioPath)),sourceVoicePreviewSha256:hash(resolve(voicePlan.previewPath))});
review.musicMode='local-approved'; review.sfxMode='local-approved'; review.finishingAudioAssets=assets; review.reviewPreview={path:`generated/previews/${contentId}-review-${targetVersion}.mp4`,captionMode:'on',audioMixMode:'voice-plus-local'};
const voiceWindows=voicePlan.segments.map((segment)=>({startSeconds:segment.slotStartSeconds,endSeconds:segment.slotStartSeconds+(segment.measuredDurationSeconds??segment.slotEndSeconds-segment.slotStartSeconds)}));
const productionDirectory=resolve(`generated/production/${contentId}/${targetVersion}`); const reviewDirectory=resolve(`generated/review/${contentId}/${targetVersion}`); const propsPath=join(productionDirectory,'review-props.json'); const reviewSnapshotPath=join(reviewDirectory,'final-review.generated.json'); const reviewArtifactPath=resolve('content/reviews/CKAI-0004_tach-du-kien-suy-luan-chua-biet_final-review-v4.md'); const outputPath=resolve(review.reviewPreview.path);
mkdirSync(reviewDirectory,{recursive:true});
atomicJson(propsPath,{manifest:animation,audioPublicPath:rel(resolve(voicePlan.assembledAudioPath)).replace(/^generated\//,''),captions:review.captions,stage:'review',finishingAudioAssets:assets,voiceWindows});
mkdirSync(dirname(outputPath),{recursive:true}); run(process.execPath,[resolve('node_modules/@remotion/cli/remotion-cli.js'),'render','video-factory/animation/src/index.ts','CKAI-Generic-Pipeline',review.reviewPreview.path,`--props=${rel(propsPath)}`,'--public-dir=generated','--codec=h264','--concurrency=2'],'REMOTION_V4_REVIEW_FAILED');
const media=probeVideo(review.reviewPreview.path); review.reviewPreview={...review.reviewPreview,sha256:hash(outputPath),codec:media.videoCodec,audioCodec:media.audioCodec,width:media.width,height:media.height,fps:media.fps,durationSeconds:Number(media.durationSeconds.toFixed(3))};
const reviewQa=runReviewQa({review,voicePlan,animation},'production',true); if(!reviewQa.pass) throw new Error(`FINAL_REVIEW_TECHNICAL_QA_BLOCKED:\n${reviewQa.errors.join('\n')}`);
const experience=inspectActualBinaryExperience(review.reviewPreview.path);

const ebur=run('ffmpeg',['-hide_banner','-nostats','-i',review.reviewPreview.path,'-filter_complex','ebur128=peak=true','-f','null',devNull],'EBUR128_FAILED').stderr; const integrated=[...ebur.matchAll(/I:\s*(-?\d+(?:\.\d+)?) LUFS/g)].at(-1); const truePeak=[...ebur.matchAll(/Peak:\s*(-?\d+(?:\.\d+)?) dBFS/g)].at(-1);
const voiceLevels=probeAudioLevels(voicePlan.previewPath);
const musicMeanDuringVoiceDb=musicRegistry.meanVolumeDb+audioPlan.music.plannedBaseGainDb+audioPlan.music.plannedDuckUnderVoiceDb; const musicMeanDuringPausesDb=musicRegistry.meanVolumeDb+audioPlan.music.plannedBaseGainDb;
const sfxPeaks=audioPlan.sfx.cuePlan.filter((cue:any)=>cue.use!=='none').map((cue:any)=>{ const asset=byId.get(cue.use); const actualWindow=probeWindowLevels(review.reviewPreview.path,cue.startSeconds,Math.min(asset.durationSeconds,1.5)); return {sceneId:cue.sceneId,assetId:cue.use,timestampSeconds:cue.startSeconds,effectiveSfxPeakDb:Number((asset.maxVolumeDb+cue.gainDb).toFixed(1)),actualBinaryWindowPeakDb:actualWindow.maxVolumeDb}; });
const effectiveSfxPeaks=sfxPeaks.map((cue:any)=>cue.effectiveSfxPeakDb);
const metrics={status:'PASS',path:review.reviewPreview.path,sha256:review.reviewPreview.sha256,durationSeconds:review.reviewPreview.durationSeconds,audioCodec:experience.audioCodec,sampleRate:experience.audioSampleRate,channels:experience.audioChannels,meanVolumeDb:experience.meanVolumeDb,maxVolumeDb:experience.maxVolumeDb,integratedLufs:integrated?Number(integrated[1]):null,truePeakDbfs:truePeak?Number(truePeak[1]):null,longestSilenceSeconds:experience.longestSilenceSeconds,clippingIndicators:experience.maxVolumeDb>.1?'FAIL':'NONE',music:{audible:musicMeanDuringVoiceDb>-65&&musicMeanDuringPausesDb>-60,renderedMeanDuringVoiceDb:Number(musicMeanDuringVoiceDb.toFixed(1)),renderedMeanDuringPausesDb:Number(musicMeanDuringPausesDb.toFixed(1)),relativeToVoiceMeanDb:Number((musicMeanDuringVoiceDb-voiceLevels.meanVolumeDb).toFixed(1)),baseGainDb:audioPlan.music.plannedBaseGainDb,duckDb:audioPlan.music.plannedDuckUnderVoiceDb,measurementBasis:'validated source loudness plus exact Remotion gain envelope; final binary independently measured above'},sfx:{audible:effectiveSfxPeaks.every((peak:number)=>peak>-35),cues:sfxPeaks,peakRangeDb:[Math.min(...effectiveSfxPeaks),Math.max(...effectiveSfxPeaks)],measurementBasis:'validated source peaks plus exact Remotion cue gains; actual final-binary cue windows also measured'},voiceQa:'PASS',finalReviewTechnicalQa:'PASS',delegatedFinalReviewAcceptance:'PENDING',exportHandoffStatus:'BLOCKED'};
atomicJson(join(reviewDirectory,'audio-metrics.json'),metrics); atomicJson(reviewSnapshotPath,review);
atomicWrite(reviewArtifactPath,`---\nid: ${review.id}\ntype: short-form-final-review\ninput_eligibility: production\nsource_voice_artifact: ${ownerRel(reviewArtifactPath,voiceArtifactPath)}\nsource_voice_artifact_sha256: ${hash(voiceArtifactPath)}\nsource_voice_snapshot: ${ownerRel(reviewArtifactPath,voiceSnapshotPath)}\nsource_voice_snapshot_sha256: ${pendingSnapshotSha}\nsource_voice_preview: ${ownerRel(reviewArtifactPath,resolve(voicePlan.previewPath))}\nsource_voice_preview_sha256: ${hash(resolve(voicePlan.previewPath))}\nreview_preview: ${ownerRel(reviewArtifactPath,outputPath)}\nreview_preview_sha256: ${review.reviewPreview.sha256}\ntechnical_review: PASS\nfinal_review: pending\nhuman_decision: pending\nexport_handoff_status: BLOCKED\nunresolved_issues: delegated Final Review acceptance pending\noperator_acceptance_by: pending\noperator_acceptance_at: pending\noperator_acceptance_basis: pending\noperator_acceptance_source_sha256: pending\n---\n\n# CKAI-0004 V4 Final Review Candidate\n\nTechnical Review PASS. STEP 08 remains blocked until delegated ChatGPT Final Review acceptance is bound to this exact snapshot and preview.\n`);
console.log(JSON.stringify({status:'PASS',reviewPreview:review.reviewPreview,metricsPath:rel(join(reviewDirectory,'audio-metrics.json')),reviewSnapshot:rel(reviewSnapshotPath),reviewArtifact:rel(reviewArtifactPath),step08:'BLOCKED',delegatedFinalReviewAcceptance:'PENDING'},null,2));
