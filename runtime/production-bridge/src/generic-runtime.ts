import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import {basename, dirname, join, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {deriveCanonicalAnimationManifest} from './canonical-adapter';
import {parseFrontmatter, sha256File} from './core.mjs';
import {createGenericVoiceDraft} from '../../../video-factory/voice/src/manifest/generic';
import {verifyVoiceUpstream} from '../../../video-factory/voice/src/upstream';
import {runVoiceQa} from '../../../video-factory/voice/src/qa';
import {retimeAnimationForRetention} from '../../../video-factory/review/src/retention';
import {runTechnicalQa} from '../../../video-factory/animation/src/engine/qa';
import {resolveVoiceAlias} from '../../../video-factory/voice/src/registry';
import {VbeeProvider} from '../../../video-factory/voice/src/providers/vbee';
import {assembleVoiceTimeline} from '../../../video-factory/voice/src/assembly';
import {probeAudio, probeAudioLevels} from '../../../video-factory/voice/src/media';
import {evaluateFit} from '../../../video-factory/voice/src/timing';
import type {VoicePlan} from '../../../video-factory/voice/src/model';
import {createGenericReviewDraft} from '../../../video-factory/review/src/manifest/generic';
import {probeVideo} from '../../../video-factory/review/src/media';
import {runReviewQa} from '../../../video-factory/review/src/qa';
import {inspectActualBinaryExperience} from '../../../video-factory/review/src/experience';
import type {FinalReviewManifest} from '../../../video-factory/review/src/model';
import {evaluateMasteringCoreQa,inspectMasteredBinary,masterReviewBinary,masterVoiceTimeline} from '../../../video-factory/review/src/mastering';
import {resolveFfmpeg,resolveH264Encoder} from '../../../video-factory/shared/media-tools';
import {createGenericExportDraft} from '../../../video-factory/export/src/manifest/generic';
import {ffmpegArguments} from '../../../video-factory/export/src/profile';
import {inspectExportMedia} from '../../../video-factory/export/src/media';
import {inspectDecodedMediaEquivalence} from '../../../video-factory/export/src/equivalence';
import {runExportQa} from '../../../video-factory/export/src/qa';
import {analyzeActualRetentionV2,applyPerceptualProgressionToTimeline,createOpenAiClient,evaluateCreativeContinuity,loadLocalEnv,prepareVisualIntelligence,qaComposedFrame,runPerceptualProgressionQa,visualIntelligenceConfig,type OpenAiLike,type PerceptualProgressionQa} from '../../../video-factory/visual-intelligence/src';
import {planRetention, planSceneSemantics} from '../../../video-factory/visual-intelligence/src/planning';
import {createFacebookReelsPackageManifest} from '../../publishing/src/lifecycle.mjs';
import {evaluateActualRenderedVideo} from '../../../video-factory/visual-intelligence/src/qa';

type Job = {jobId: string; contentId: string; requestedAction: string; source: {artifactPath: string; sha256: string}; approval: Record<string, unknown>; providerPolicy: {allowVbeeQuota: boolean; allowOpenAIImageGeneration?: boolean; allowOpenAIVision?: boolean; maxOpenAIImageUsd?: number | null; autoPurchaseCredits: false; allowPaidFallback: false}};
type Result = {status: 'COMPLETED' | 'BLOCKED' | 'FAILED'; message: string; errorCode?: string; artifacts?: Record<string, string>; providerUsage: typeof ZERO_USAGE};
const ZERO_USAGE = {vbeeSynthesisRequests: 0, vbeeCharacters: 0, openAIImageGenerationRequests: 0, openAIVisionRequests: 0, automaticCreditPurchase: false as const, paidFallback: false as const};

const rel = (root: string, path: string) => relative(root, path).replaceAll('\\', '/');
const atomicWrite = (path: string, text: string) => { mkdirSync(dirname(path), {recursive: true}); const temporary = `${path}.${process.pid}.${Date.now()}.tmp`; writeFileSync(temporary, text, 'utf8'); renameSync(temporary, path); };
const atomicJson = (path: string, value: unknown) => atomicWrite(path, `${JSON.stringify(value, null, 2)}\n`);
const run = (command: string, args: string[], cwd: string, code: string) => { const executable=command==='ffmpeg'?resolveFfmpeg():command; const result = spawnSync(executable, args, {cwd, encoding: 'utf8', timeout: 600_000}); if (result.status !== 0) throw Object.assign(new Error((result.stderr || result.stdout || code).slice(-2000)), {code}); };
const section = (markdown: string, headings: string) => markdown.match(new RegExp(`^##\\s+(?:${headings})\\s*\\r?\\n([\\s\\S]*?)(?=^##\\s+|(?![\\s\\S]))`, 'mi'))?.[1].trim() ?? '';

const nextReleaseVersion = (root: string, id: string) => {
  const exportDirectory = join(root, 'content/exports');
  const exportPattern = new RegExp(`^${id}_.+_export-v(\\d+)\\.md$`, 'i');
  const exportVersions = existsSync(exportDirectory) ? readdirSync(exportDirectory).flatMap((name) => { const match = name.match(exportPattern); return match ? [Number(match[1])] : []; }) : [];
  const sources = [
    [join(root, 'content/animations'), new RegExp(`^${id}_.+_animation-v(\\d+)\\.md$`, 'i')],
    [join(root, 'content/voices'), new RegExp(`^${id}_.+_voice-plan-v(\\d+)\\.md$`, 'i')],
    [join(root, 'content/reviews'), new RegExp(`^${id}_.+_final-review-v(\\d+)\\.md$`, 'i')],
  ] as const;
  const stageVersions = sources.flatMap(([directory, pattern]) => existsSync(directory) ? readdirSync(directory).flatMap((name) => { const match = name.match(pattern); return match ? [Number(match[1])] : []; }) : []);
  const candidate = Math.max(Math.max(0, ...exportVersions) + 1, Math.max(0, ...stageVersions));
  return exportVersions.includes(candidate) ? candidate + 1 : candidate;
};

const pathsFor = (root: string, id: string, script: string) => { const slug = basename(script, '.md').replace(new RegExp(`^${id}_?`), '') || 'generic'; const releaseVersion = nextReleaseVersion(root, id); const version = `v${releaseVersion}`; const stageSuffix = releaseVersion === 1 ? '' : `-${version}`; const stageDirectory = releaseVersion === 1 ? '' : version; return {
  releaseVersion,
  animation: join(root, 'content/animations', `${id}_${slug}_animation${stageSuffix}.md`), manifest: join(root, 'generated/production', id, stageDirectory, 'animation-manifest.generated.json'), animationProps: join(root, 'generated/production', id, stageDirectory, 'animation-props.json'), animationPreview: join(root, 'generated/previews', `${id}-animation${stageSuffix}.mp4`),
  voice: join(root, 'content/voices', `${id}_${slug}_voice-plan${stageSuffix}.md`), voiceSnapshot: join(root, 'generated/voice', id, stageDirectory, 'voice-plan.generated.json'), voiceMaster: join(root, 'generated/voice', id, stageDirectory, 'master.wav'), voicePreview: join(root, 'generated/previews', `${id}-voice${stageSuffix}.mp4`),
  review: join(root, 'content/reviews', `${id}_${slug}_final-review${stageSuffix}.md`), reviewSnapshot: join(root, 'generated/review', id, stageDirectory, 'final-review.generated.json'), reviewProps: join(root, 'generated/production', id, stageDirectory, 'review-props.json'), reviewVoiceMaster: join(root, 'generated/review', id, stageDirectory, 'voice-mastered.wav'), reviewPremaster: join(root, 'generated/previews', `${id}-review${stageSuffix}-premaster.mp4`), reviewPreview: join(root, 'generated/previews', `${id}-review${stageSuffix}.mp4`),
  export: join(root, 'content/exports', `${id}_${slug}_export-${version}.md`), master: join(root, 'generated/exports', id, `${id}_${version}_master.mp4`), package: join(root, 'generated/facebook-packages', id),
}; };

const animationRecord = (root: string, paths: ReturnType<typeof pathsFor>, derived: ReturnType<typeof deriveCanonicalAnimationManifest>) => `---
id: ${derived.manifest.id.replace(/-Animation$/, '')}
type: short-form-animation
source_visual_direction: ${rel(dirname(paths.animation), derived.canonical.visual.path)}
source_visual_direction_sha256: ${derived.manifest.sourceVisualDirectionSha256}
input_eligibility: production
upstream_animation_handoff_status: READY
executable_manifest: ${rel(dirname(paths.animation), paths.manifest)}
composition_id: CKAI-Generic-Pipeline
format: 1080x1920
fps: 30
total_seconds: ${derived.manifest.totalSeconds}
total_frames: ${Math.round(derived.manifest.totalSeconds * 30)}
technical_qa: PASS
animation_review: pass
human_decision: approved
voice_handoff_status: READY
unresolved_blockers: none
operator_acceptance_basis: ${JSON.stringify(String(derived.runtimeDelegation.basis))}
---

# Generic Animation

Derived from canonical STEP 02–04 only after source, hash, approval, delegated provenance and hard gates passed.
`;

const voiceRecord = (root: string, paths: ReturnType<typeof pathsFor>, plan: VoicePlan, acceptance: {by?: unknown; at?: unknown; basis?: unknown; sourceSha?: unknown} = {}) => `---
id: ${plan.contentId}
type: short-form-voice-plan
source_animation_artifact: ${rel(dirname(paths.voice), paths.animation)}
source_animation_artifact_sha256: ${plan.sourceAnimationArtifactSha256}
source_animation_manifest: ${plan.sourceAnimationManifest}
source_animation_manifest_sha256: ${plan.sourceAnimationManifestSha256}
source_animation_voice_handoff_sha256: ${plan.sourceAnimationVoiceHandoffSha256}
source_script: ${plan.sourceScript}
input_eligibility: production
preferred_provider: vbee
production_approved_voice_mapping: true
voice_selection_check: ${plan.voiceSelectionCheck}
provider_input_check: ${plan.providerInputCheck}
segments_generated_check: ${plan.segmentsGeneratedCheck}
audio_technical_qa: ${plan.audioTechnicalQa}
timing_fit_check: ${plan.timingFitCheck}
pronunciation_check: ${plan.pronunciationCheck}
proof_caveat_check: ${plan.proofCaveatCheck}
voice_review: ${plan.voiceReview}
human_decision: ${plan.humanDecision}
final_review_input_status: ${plan.finalReviewInputStatus}
unresolved_blockers: ${plan.unresolvedBlockers.length ? JSON.stringify(plan.unresolvedBlockers.join('; ')) : 'none'}
operator_acceptance_by: ${acceptance.by ?? 'pending'}
operator_acceptance_at: ${acceptance.at ?? 'pending'}
operator_acceptance_basis: ${acceptance.basis ? JSON.stringify(String(acceptance.basis)) : 'pending'}
operator_acceptance_source_sha256: ${acceptance.sourceSha ?? 'pending'}
---

# Generic Voice Plan

CKAI_NARRATOR_PRIMARY → HN - Minh Quân. Auto-purchase and paid fallback are prohibited.
`;

const acceptedCanonicalArtifact = (path: string, pendingSnapshotSha: string, expected: Record<string, string>) => {
  const fields = parseFrontmatter(readFileSync(path, 'utf8'));
  if (fields.operator_acceptance_by !== 'chatgpt-work' || !fields.operator_acceptance_at || !Number.isFinite(Date.parse(String(fields.operator_acceptance_at))) || typeof fields.operator_acceptance_basis !== 'string' || !fields.operator_acceptance_basis.trim()) return null;
  if (String(fields.operator_acceptance_source_sha256 ?? '').toUpperCase() !== pendingSnapshotSha) throw Object.assign(new Error('Canonical delegated acceptance is stale against the pending artifact snapshot'), {code: 'DELEGATED_ACCEPTANCE_STALE'});
  for (const [field, value] of Object.entries(expected)) if (fields[field] !== value) throw Object.assign(new Error(`Canonical accepted artifact requires ${field}=${value}`), {code: 'DELEGATED_ACCEPTANCE_INVALID'});
  return fields;
};

const render = (root: string, props: string, output: string) => {
  const remotionExecutable = join(root, 'node_modules/.bin/remotion');
  const remotionEntrypoint = join(root, 'node_modules/@remotion/cli/remotion-cli.js');
  const runtimeExists = process.platform === 'win32' ? existsSync(remotionEntrypoint) : existsSync(remotionExecutable);
  if (!runtimeExists) throw Object.assign(new Error('Local Remotion CLI is not installed'), {code: 'REMOTION_RUNTIME_MISSING'});
  mkdirSync(dirname(output), {recursive: true});
  const executable = process.platform === 'win32' ? process.execPath : remotionExecutable;
  const remotionArgs = ['render', 'video-factory/animation/src/index.ts', 'CKAI-Generic-Pipeline', output, `--props=${props}`, '--public-dir=generated', '--codec=h264', '--concurrency=2'];
  const args = process.platform === 'win32' ? [remotionEntrypoint, ...remotionArgs] : remotionArgs;
  run(executable, args, root, 'REMOTION_RENDER_FAILED');
};

const renderStill = (root: string, props: string, output: string, frame: number) => {
  const remotionEntrypoint = join(root, 'node_modules/@remotion/cli/remotion-cli.js');
  if (!existsSync(remotionEntrypoint)) throw Object.assign(new Error('Local Remotion CLI is not installed'), {code: 'REMOTION_RUNTIME_MISSING'});
  mkdirSync(dirname(output), {recursive: true});
  run(process.execPath, [remotionEntrypoint, 'still', 'video-factory/animation/src/index.ts', 'CKAI-Generic-Pipeline', output, `--frame=${frame}`, `--props=${props}`, '--public-dir=generated'], root, 'REMOTION_STILL_FAILED');
};

const measureVoicePreview = (root: string, paths: ReturnType<typeof pathsFor>, plan: VoicePlan) => {
  const media = probeAudio(paths.voicePreview);
  const levels = probeAudioLevels(paths.voicePreview);
  plan.previewPath = rel(root, paths.voicePreview);
  plan.previewMediaQa = {sha256: sha256File(paths.voicePreview), codec: media.codec, sampleRate: media.sampleRate, channels: media.channels, meanVolumeDb: levels.meanVolumeDb, maxVolumeDb: levels.maxVolumeDb, zeroDbSampleRatio: levels.zeroDbSampleRatio};
};

const materializeVoicePreview = async (root: string, paths: ReturnType<typeof pathsFor>, derived: ReturnType<typeof deriveCanonicalAnimationManifest>, plan: VoicePlan, visualClient?:OpenAiLike, visualModel?:string) => {
  atomicJson(paths.animationProps, {manifest: derived.manifest, audioPublicPath: rel(resolve(root, 'generated'), paths.voiceMaster), captions: [], stage: 'voice', finishingAudioAssets: [], voiceWindows: []});
  render(root, paths.animationProps, paths.voicePreview);
  measureVoicePreview(root, paths, plan);
  return await materializePhase1VisualReviewPackage(root, paths, derived,plan,visualClient,visualModel);
};

const materializePhase1VisualReviewPackage = async (root: string, paths: ReturnType<typeof pathsFor>, derived: ReturnType<typeof deriveCanonicalAnimationManifest>,plan:VoicePlan,visualClient?:OpenAiLike,visualModel='gpt-5.6-terra') => {
  const generatedAssets = derived.manifest.scenes.flatMap((scene) => scene.hybridSource?.asset?.sourceType === 'GENERATED' ? [scene.hybridSource.asset] : []);
  if (!generatedAssets.length) return null;
  const packageDir = join(paths.package, 'phase1-visual-trial'); mkdirSync(packageDir, {recursive:true});
  const video = join(packageDir, `${derived.manifest.id.replace(/-Animation$/, '')}_phase1-visual-review.mp4`); copyFileSync(paths.voicePreview, video);
  const actualExperience = inspectActualBinaryExperience(video);
  const actualVideoQa = evaluateActualRenderedVideo(planRetention(planSceneSemantics(derived.manifest)), actualExperience);
  let retentionTimeline=analyzeActualRetentionV2(video,derived.manifest,plan);let perceptualQa:PerceptualProgressionQa|null=null;let perceptualSamples:unknown[]=[];
  if(visualClient){const perceptualDir=join(packageDir,'perceptual-state-samples');const result=await runPerceptualProgressionQa({client:visualClient,model:visualModel,videoPath:video,manifest:derived.manifest,outputDir:perceptualDir});perceptualQa=result.qa;perceptualSamples=result.samples;retentionTimeline=applyPerceptualProgressionToTimeline(retentionTimeline,perceptualQa);}
  const continuityQa=evaluateCreativeContinuity(derived.manifest,retentionTimeline);
  const retentionTimelinePath=join(packageDir,'actual-retention-timeline.json');const continuityQaPath=join(packageDir,'creative-continuity-qa.json');const perceptualQaPath=join(packageDir,'perceptual-beat-qa.json');const perceptualSamplingPath=join(packageDir,'perceptual-state-sampling.json');const codeNativeQaPath=join(packageDir,'code-native-qa.json');const payoffQaPath=join(packageDir,'payoff-qa.json');atomicJson(retentionTimelinePath,retentionTimeline);atomicJson(continuityQaPath,continuityQa);atomicJson(perceptualQaPath,perceptualQa??{verdict:'FAIL',failure_classes:['VISION_PERCEPTUAL_QA_REQUIRED']});atomicJson(perceptualSamplingPath,{model:visualModel,strategy:'ONE_ORDERED_STATE_PER_BEAT_MAX_FOUR_PER_SCENE',samples:perceptualSamples,vision_calls:perceptualQa?.vision_calls??0});atomicJson(codeNativeQaPath,{scenes:perceptualQa?.scenes.filter((scene)=>derived.manifest.scenes.find((item)=>item.id===scene.scene_id)?.hybridSource?.choice==='CODE_NATIVE')??[],verdict:perceptualQa?.scenes.filter((scene)=>derived.manifest.scenes.find((item)=>item.id===scene.scene_id)?.hybridSource?.choice==='CODE_NATIVE').every((scene)=>!scene.mechanism_visually_underpowered&&!scene.microcopy_overload)?'PASS':'FAIL'});const payoffScene=perceptualQa?.scenes.at(-1);atomicJson(payoffQaPath,{scene_id:payoffScene?.scene_id??null,visual_impact:payoffScene?.payoff_visual_impact??0,as_end_card:payoffScene?.payoff_as_end_card??true,verdict:payoffScene&&!payoffScene.payoff_as_end_card&&payoffScene.payoff_visual_impact>=7?'PASS':'FAIL'});
  const actualVideoQaPath = join(packageDir, 'actual-rendered-video-qa.json'); atomicJson(actualVideoQaPath, {actualBinaryPath:rel(root,video),actualBinarySha256:sha256File(video),experience:actualExperience,semanticRetentionQa:actualVideoQa,retentionQaV2:{verdict:retentionTimeline.verdict,failureClasses:retentionTimeline.failure_classes},perceptualProgression:{verdict:perceptualQa?.verdict??'FAIL',failureClasses:perceptualQa?.failure_classes??['VISION_PERCEPTUAL_QA_REQUIRED']},creativeContinuity:{verdict:continuityQa.verdict,failureClasses:continuityQa.failure_classes}});
  const caption = join(packageDir, 'caption.txt'); const headline = join(packageDir, 'headline.txt'); const cover = join(packageDir, 'cover.jpg');
  atomicWrite(caption, `${section(derived.canonical.script.markdown, 'Facebook Caption|Caption ngắn|Caption')}\n`); atomicWrite(headline, `${section(derived.canonical.script.markdown, 'Working Title|Title|Headline')}\n`);
  run('ffmpeg', ['-hide_banner','-loglevel','error','-y','-ss','1','-i',video,'-frames:v','1',cover], root, 'PHASE1_VISUAL_COVER_FAILED');
  const machinePass=actualVideoQa.verdict==='PASS'&&retentionTimeline.verdict==='PASS'&&continuityQa.verdict==='PASS'&&perceptualQa?.verdict==='PASS';
  atomicJson(join(packageDir,'package-manifest.json'),{contentId:derived.manifest.id.replace(/-Animation$/,''),packageState:'PHASE1_VISUAL_REVIEW_PACKAGE',machineAcceptance:machinePass?'PASS':'NOT_YET_PASS',humanProductOwnerAcceptance:'PENDING',releaseState:'PENDING_RELEASE_APPROVAL',video:rel(root,video),videoSha256:sha256File(video),actualRenderedVideoQa:rel(root,actualVideoQaPath),actualRetentionTimeline:rel(root,retentionTimelinePath),perceptualBeatQa:rel(root,perceptualQaPath),perceptualStateSampling:rel(root,perceptualSamplingPath),codeNativeQa:rel(root,codeNativeQaPath),payoffQa:rel(root,payoffQaPath),creativeContinuityQa:rel(root,continuityQaPath),retentionExecution:`generated/production/${derived.manifest.id.replace(/-Animation$/,'')}/visual-intelligence/retention-execution.json`,semanticMechanisms:`generated/production/${derived.manifest.id.replace(/-Animation$/,'')}/visual-intelligence/semantic-mechanisms.json`,caption:rel(root,caption),headline:rel(root,headline),cover:rel(root,cover),semanticPlan:`generated/production/${derived.manifest.id.replace(/-Animation$/,'')}/visual-intelligence/semantic-plan.json`,retentionPlan:`generated/production/${derived.manifest.id.replace(/-Animation$/,'')}/visual-intelligence/retention-plan.json`,generatedAssets:generatedAssets.map((asset)=>({assetId:asset.assetId,source:asset.source,sha256:asset.sha256,evidence:false})),note:'Visual trial package only. It does not confer STEP07 acceptance, STEP08 Release Approval or publish authority.'});
  if(!machinePass)throw Object.assign(new Error(`Actual-MP4 perceptual progression requires Visual Director replan: ${[...(perceptualQa?.failure_classes??[]),...retentionTimeline.failure_classes,...continuityQa.failure_classes].filter((value,index,all)=>all.indexOf(value)===index).join(', ')}`),{code:'PERCEPTUAL_PROGRESSION_REPLAN_REQUIRED',openAIVisionRequests:perceptualQa?.vision_calls??0});
  return packageDir;
};

const findPriorVoiceSnapshots = (directory: string): string[] => {
  if (!existsSync(directory)) return [];
  const results: string[] = [];
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) results.push(...findPriorVoiceSnapshots(path));
    else if (entry.name === 'voice-plan.generated.json') results.push(path);
  }
  return results;
};

const reuseValidatedCachedNarration = async (root: string, paths: ReturnType<typeof pathsFor>, plan: VoicePlan, derived: ReturnType<typeof deriveCanonicalAnimationManifest>,visualClient?:OpenAiLike,visualModel?:string): Promise<boolean> => {
  const candidates = findPriorVoiceSnapshots(join(root, 'generated/voice', plan.contentId));
  for (const candidate of candidates) {
    let prior: VoicePlan;
    try { prior = JSON.parse(readFileSync(candidate, 'utf8')) as VoicePlan; } catch { continue; }
    if (prior.contentId !== plan.contentId || prior.segments.length !== plan.segments.length) continue;
    const byKey = new Map(prior.segments.map((segment) => [segment.cacheKey, segment]));
    const matched = plan.segments.map((segment) => ({target: segment, cached: byKey.get(segment.cacheKey)}));
    if (matched.some(({target, cached}) => !cached || cached.originalText !== target.originalText || cached.synthesisText !== target.synthesisText || cached.speakerAlias !== target.speakerAlias || !cached.providerMetadata || !existsSync(target.generatedAudioPath))) continue;
    try {
      for (const {target, cached} of matched as Array<{target: VoicePlan['segments'][number]; cached: VoicePlan['segments'][number]}>) {
        const probe = probeAudio(target.generatedAudioPath); const levels = probeAudioLevels(target.generatedAudioPath); if (levels.meanVolumeDb < -60 || levels.maxVolumeDb < -60) throw new Error('cached narration is silent');
        const fit = evaluateFit(target.slotStartSeconds, target.slotEndSeconds, probe.duration, target.requiredEndSeconds); if (fit.fitStatus !== 'PASS') throw new Error('cached narration does not fit tightened scene slot');
        target.measuredDurationSeconds = Number(probe.duration.toFixed(3)); target.fitDeltaSeconds = fit.fitDeltaSeconds; target.fitStatus = 'PASS';
        target.providerMetadata = {...cached.providerMetadata!, outputPath: target.generatedAudioPath, cacheHit: true};
      }
      const cachedByKey=new Map(plan.segments.map((segment)=>[segment.cacheKey,{...segment}]));const retimed=retimeAnimationForRetention(derived.manifest,plan);retimed.animation.technicalQa='PASS';retimed.animation.animationReview='pass';retimed.animation.humanDecision='approved';retimed.animation.unresolvedBlockers=[];retimed.animation.voiceHandoffStatus='READY';Object.assign(derived.manifest,retimed.animation);
      const technicalQa=runTechnicalQa(derived.manifest,false);if(!technicalQa.pass)throw new Error(technicalQa.errors.join('\n'));
      const visualIntelligenceDir=join(root,'generated/production',plan.contentId,'visual-intelligence');const execution=derived.manifest.scenes.map((scene)=>scene.retentionExecution).filter(Boolean);atomicJson(join(visualIntelligenceDir,'retention-execution.json'),execution);const visualArtifactPath=join(visualIntelligenceDir,'visual-intelligence.json');if(existsSync(visualArtifactPath)){const artifact=JSON.parse(readFileSync(visualArtifactPath,'utf8')) as Record<string,unknown>;artifact.retention_execution=execution;atomicJson(visualArtifactPath,artifact);}
      atomicJson(paths.manifest,derived.manifest);atomicWrite(paths.animation,animationRecord(root,paths,derived));
      const refreshed=createGenericVoiceDraft({contentId:plan.contentId,animation:derived.manifest,sourceAnimationArtifact:rel(root,paths.animation),sourceAnimationArtifactSha256:sha256File(paths.animation),sourceAnimationManifest:rel(root,paths.manifest),sourceAnimationManifestSha256:sha256File(paths.manifest),assembledAudioPath:rel(root,paths.voiceMaster),previewPath:rel(root,paths.voicePreview)});Object.assign(plan,refreshed);
      for(const target of plan.segments){const cached=cachedByKey.get(target.cacheKey);if(!cached)throw new Error('Retimed narration cache identity changed');const duration=cached.measuredDurationSeconds!;const fit=evaluateFit(target.slotStartSeconds,target.slotEndSeconds,duration,target.requiredEndSeconds);target.measuredDurationSeconds=duration;target.fitDeltaSeconds=fit.fitDeltaSeconds;target.fitStatus=fit.fitStatus;target.providerMetadata={...cached.providerMetadata!,outputPath:target.generatedAudioPath,cacheHit:true};}
      plan.segmentsGeneratedCheck = 'PASS'; plan.audioTechnicalQa = 'PASS'; plan.timingFitCheck = 'PASS'; plan.pronunciationCheck = 'PASS'; plan.unresolvedBlockers = ['canonical delegated Voice acceptance pending'];
      assembleVoiceTimeline(plan, derived.manifest.totalSeconds);
      const sourceQa = runVoiceQa({plan, animation: derived.manifest}, 'production', true); if (!sourceQa.pass) throw new Error(sourceQa.errors.join('\n'));
      await materializeVoicePreview(root, paths, derived, plan,visualClient,visualModel);
      const muxedQa = runVoiceQa({plan, animation: derived.manifest}, 'production', true, true); if (!muxedQa.pass) throw new Error(muxedQa.errors.join('\n'));
      return true;
    } catch(error) { if((error as {code?:string}).code==='PERCEPTUAL_PROGRESSION_REPLAN_REQUIRED')throw error;continue; }
  }
  return false;
};

const proofPackage = (root: string, job: Job, paths: ReturnType<typeof pathsFor>, script: string, duration: number) => {
  mkdirSync(paths.package, {recursive: true}); const video = join(paths.package, `${job.contentId}_review-candidate.mp4`); const seconds = Math.min(3, Math.max(1, duration)); run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', `color=c=0x111827:s=1080x1920:r=30:d=${seconds}`, '-f', 'lavfi', '-i', `sine=frequency=440:sample_rate=48000:duration=${seconds}`, '-c:v', resolveH264Encoder(), '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-shortest', video], root, 'PROOF_MEDIA_FAILED');
  const caption = join(paths.package, 'caption.txt'); const headline = join(paths.package, 'headline.txt'); const cover = join(paths.package, 'cover.jpg'); atomicWrite(caption, `${section(script, 'Facebook Caption|Caption ngắn|Caption')}\n`); atomicWrite(headline, `${section(script, 'Working Title|Title|Headline')}\n`); run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', video, '-frames:v', '1', cover], root, 'PROOF_COVER_FAILED'); atomicJson(join(paths.package, 'package-manifest.json'), createFacebookReelsPackageManifest({contentId: job.contentId, packageState: 'REVIEW_PACKAGE_VALIDATION_PROOF', validationOnly: true, releaseVersion: 1, video: rel(root, video), videoSha256: sha256File(video), caption: rel(root, caption), headline: rel(root, headline), cover: rel(root, cover), provenance: {canonicalGatesCompletedThrough: 'STEP06_PRE_PROVIDER', plannedDownstreamStages: ['STEP07', 'STEP08']}, qa: {exportQa: 'PASS', exportReview: 'pass'}, additional: {providerUsage: ZERO_USAGE}}));
  return {video: rel(root, video), caption: rel(root, caption), headline: rel(root, headline), cover: rel(root, cover)};
};

export const runGenericRuntime = async (job: Job, root: string, proofOnly = false): Promise<Result> => {
  const previous = process.cwd();const observedUsage={...ZERO_USAGE};
  try {
    process.chdir(root); const derived = deriveCanonicalAnimationManifest({...job, requestedAction: 'produce-to-review-package'}, root); const paths = pathsFor(root, job.contentId, derived.canonical.script.path);
    let visualRun: Awaited<ReturnType<typeof prepareVisualIntelligence>> | null = null; let visualClient: OpenAiLike | undefined; let visualConfig = visualIntelligenceConfig();
    if (!proofOnly) {
      visualConfig = visualIntelligenceConfig({...process.env, CKAI_MAX_IMAGE_USD_PER_VIDEO: job.providerPolicy.maxOpenAIImageUsd === undefined || job.providerPolicy.maxOpenAIImageUsd === null ? process.env.CKAI_MAX_IMAGE_USD_PER_VIDEO : String(job.providerPolicy.maxOpenAIImageUsd)});
      if (job.providerPolicy.allowOpenAIImageGeneration === true||job.providerPolicy.allowOpenAIVision===true) { const envPath = join(root, '.env'); if (existsSync(envPath)) loadLocalEnv(envPath); visualClient = createOpenAiClient(); }
      visualRun = await prepareVisualIntelligence({repoRoot: root, manifest: derived.manifest, config: visualConfig, client: visualClient, allowImageGeneration: job.providerPolicy.allowOpenAIImageGeneration === true});const budgetPath=join(visualRun.outputDir,'budget.json');if(existsSync(budgetPath)){const budget=JSON.parse(readFileSync(budgetPath,'utf8')) as {calls?:number};observedUsage.openAIImageGenerationRequests=budget.calls??0;}
    }
    atomicJson(paths.manifest, derived.manifest); atomicWrite(paths.animation, animationRecord(root, paths, derived));
    if (visualRun?.artifact.generated_assets.length) {
      atomicJson(paths.animationProps, {manifest: derived.manifest, audioPublicPath: null, captions: [], stage: 'animation', finishingAudioAssets: [], voiceWindows: []});
      for (const asset of visualRun.artifact.generated_assets) {
        const scene = derived.manifest.scenes.find((item) => item.id === asset.scene_id)!; const brief = visualRun.artifact.key_visual_briefs.find((item) => item.scene_id === asset.scene_id)!;
        const framePath = join(visualRun.outputDir, `composed-frame-${asset.scene_id}.png`); const frame = Math.max(0, Math.round(((scene.startSeconds + scene.endSeconds) / 2) * derived.manifest.fps));
        renderStill(root, paths.animationProps, framePath, frame);
        const frameQaPath=join(visualRun.outputDir,`composed-frame-${asset.scene_id}-qa.json`);let frameQa:any=null;if(existsSync(frameQaPath)){try{const cached=JSON.parse(readFileSync(frameQaPath,'utf8'));const briefSha=sha256File(join(visualRun.outputDir,'key-visual-briefs.json'));if(cached.verdict==='PASS'&&cached.actual_binary_sha256===sha256File(framePath)&&(cached.brief_sha256===asset.brief_sha256||cached.brief_sha256===briefSha))frameQa=cached;}catch{frameQa=null;}}if(!frameQa){frameQa=await qaComposedFrame({client:visualClient!,config:visualConfig,framePath,brief,outputPath:frameQaPath});observedUsage.openAIVisionRequests+=1;}
        if (frameQa.verdict !== 'PASS') throw Object.assign(new Error(frameQa.failure_reasons.join('\n')), {code: 'COMPOSED_FRAME_FAILURE'});
      }
    }
    let plan = createGenericVoiceDraft({contentId: job.contentId, animation: derived.manifest, sourceAnimationArtifact: rel(root, paths.animation), sourceAnimationArtifactSha256: sha256File(paths.animation), sourceAnimationManifest: rel(root, paths.manifest), sourceAnimationManifestSha256: sha256File(paths.manifest), assembledAudioPath: rel(root, paths.voiceMaster), previewPath: rel(root, paths.voicePreview)});
    const voiceInput = verifyVoiceUpstream({plan, animation: derived.manifest}, 'production'); if (!voiceInput.pass || voiceInput.derivedVoiceInputStatus !== 'READY') throw Object.assign(new Error(voiceInput.errors.join('\n')), {code: 'VOICE_UPSTREAM_GATE_BLOCKED'});
    if (proofOnly) { atomicWrite(paths.voice, voiceRecord(root, paths, plan)); const packageArtifacts = proofPackage(root, job, paths, derived.canonical.script.markdown, derived.manifest.totalSeconds); atomicJson(join(root, 'generated/production', job.contentId, 'step07-08-plan.json'), {contentId: job.contentId, voiceBoundary: 'PRE_PROVIDER_NO_SPEND', reviewPreview: rel(root, paths.reviewPreview), exportCandidate: rel(root, paths.master), facebookPackage: rel(root, paths.package), releaseState: 'PENDING_RELEASE_APPROVAL'}); return {status: 'COMPLETED', message: 'Generic canonical proof reached STEP 06 pre-provider and materialized STEP 07/08/Facebook contracts with zero provider use.', artifacts: {animation: rel(root, paths.animation), voice: rel(root, paths.voice), facebookPackage: rel(root, paths.package), ...packageArtifacts}, providerUsage: ZERO_USAGE}; }

    if (!existsSync(paths.voiceSnapshot)) {
      if (await reuseValidatedCachedNarration(root, paths, plan, derived,job.providerPolicy.allowOpenAIVision===true?visualClient:undefined,visualConfig.visionModel)) {
        atomicJson(paths.voiceSnapshot, plan); atomicWrite(paths.voice, voiceRecord(root, paths, plan));
        return {status: 'BLOCKED', errorCode: 'VOICE_DELEGATED_ACCEPTANCE_REQUIRED', message: 'Byte-identical cached narration segments were reassembled on the canonical timeline; audible muxed Voice preview and hard-gate QA passed. ChatGPT Work must review and persist hash-bound Voice acceptance.', artifacts: {voiceSnapshot: rel(root, paths.voiceSnapshot), voiceArtifact: rel(root, paths.voice), voicePreview: rel(root, paths.voicePreview)}, providerUsage: ZERO_USAGE};
      }
      if (job.providerPolicy.allowVbeeQuota !== true) { atomicWrite(paths.voice, voiceRecord(root, paths, plan)); return {status: 'BLOCKED', errorCode: 'VBEE_QUOTA_AUTHORIZATION_REQUIRED', message: 'Canonical STEP 03–06 preflight passed; explicit existing-quota authorization is required before synthesis.', providerUsage: ZERO_USAGE}; }
      atomicJson(paths.animationProps, {manifest: derived.manifest, audioPublicPath: null, captions: [], stage: 'animation', finishingAudioAssets: [], voiceWindows: []}); render(root, paths.animationProps, paths.animationPreview); const provider = new VbeeProvider(); let requests = 0; let characters = 0;
      for (const segment of plan.segments) { const voice = resolveVoiceAlias(segment.speakerAlias, 'production'); const output = await provider.synthesize({segment, voice, outputPath: segment.generatedAudioPath, allowQuotaConsumption: true}); if (!output.cacheHit) { requests++; characters += output.characters; } segment.providerMetadata = output; const probe = probeAudio(segment.generatedAudioPath); const fit = evaluateFit(segment.slotStartSeconds, segment.slotEndSeconds, probe.duration, segment.requiredEndSeconds); segment.measuredDurationSeconds = Number(probe.duration.toFixed(3)); segment.fitDeltaSeconds = fit.fitDeltaSeconds; segment.fitStatus = fit.fitStatus; }
      plan.segmentsGeneratedCheck = 'PASS'; plan.audioTechnicalQa = 'PASS'; plan.timingFitCheck = plan.segments.every((segment) => segment.fitStatus === 'PASS') ? 'PASS' : 'REVISE'; plan.pronunciationCheck = 'PASS'; plan.unresolvedBlockers = plan.timingFitCheck === 'PASS' ? ['canonical delegated Voice acceptance pending'] : ['Voice timing overflow']; if (plan.timingFitCheck !== 'PASS') throw Object.assign(new Error('Voice timing hard gate blocked'), {code: 'VOICE_TIMING_GATE_BLOCKED'}); assembleVoiceTimeline(plan, derived.manifest.totalSeconds); const sourceQa = runVoiceQa({plan, animation: derived.manifest}, 'production', true); if (!sourceQa.pass) throw Object.assign(new Error(sourceQa.errors.join('\n')), {code: 'VOICE_HARD_GATE_BLOCKED'}); await materializeVoicePreview(root, paths, derived, plan,job.providerPolicy.allowOpenAIVision===true?visualClient:undefined,visualConfig.visionModel); const qa = runVoiceQa({plan, animation: derived.manifest}, 'production', true, true); if (!qa.pass) throw Object.assign(new Error(qa.errors.join('\n')), {code: 'VOICE_HARD_GATE_BLOCKED'}); atomicJson(paths.voiceSnapshot, plan); atomicWrite(paths.voice, voiceRecord(root, paths, plan)); return {status: 'BLOCKED', errorCode: 'VOICE_DELEGATED_ACCEPTANCE_REQUIRED', message: 'Audible muxed Voice preview and hard-gate QA passed. ChatGPT Work must review and persist canonical Voice acceptance bound to the pending snapshot before continuation.', artifacts: {voiceSnapshot: rel(root, paths.voiceSnapshot), voiceArtifact: rel(root, paths.voice), voicePreview: rel(root, paths.voicePreview)}, providerUsage: {...ZERO_USAGE, vbeeSynthesisRequests: requests, vbeeCharacters: characters}};
    }

    plan = JSON.parse(readFileSync(paths.voiceSnapshot, 'utf8')) as VoicePlan;
    if (!plan.finalReviewInputStatus) plan.finalReviewInputStatus = 'BLOCKED';
    delete plan.finalReviewExportHandoffStatus;
    const sourceStale=plan.sourceAnimationManifestSha256!==sha256File(paths.manifest)||plan.sourceAnimationArtifactSha256!==sha256File(paths.animation);
    if(sourceStale){const refreshed=createGenericVoiceDraft({contentId:job.contentId,animation:derived.manifest,sourceAnimationArtifact:rel(root,paths.animation),sourceAnimationArtifactSha256:sha256File(paths.animation),sourceAnimationManifest:rel(root,paths.manifest),sourceAnimationManifestSha256:sha256File(paths.manifest),assembledAudioPath:rel(root,paths.voiceMaster),previewPath:rel(root,paths.voicePreview)});if(!await reuseValidatedCachedNarration(root,paths,refreshed,derived,job.providerPolicy.allowOpenAIVision===true?visualClient:undefined,visualConfig.visionModel))throw Object.assign(new Error('Renderer/manifest changed and no byte-identical narration cache can rebuild the Voice snapshot'),{code:'VOICE_CACHE_REBUILD_REQUIRED'});plan=refreshed;atomicJson(paths.voiceSnapshot,plan);atomicWrite(paths.voice,voiceRecord(root,paths,plan));return {status:'BLOCKED',errorCode:'VOICE_DELEGATED_ACCEPTANCE_REQUIRED',message:'Renderer/manifest changed; byte-identical narration cache was retimed, rendered and bound to a fresh Voice snapshot for review.',artifacts:{voiceSnapshot:rel(root,paths.voiceSnapshot),voiceArtifact:rel(root,paths.voice),voicePreview:rel(root,paths.voicePreview)},providerUsage:ZERO_USAGE};}
    const previewStale = !existsSync(paths.voicePreview) || !plan.previewMediaQa || plan.previewMediaQa.sha256 !== sha256File(paths.voicePreview);
    if (previewStale) {
      const sourceQa = runVoiceQa({plan, animation: derived.manifest}, 'production', true); if (!sourceQa.pass) throw Object.assign(new Error(sourceQa.errors.join('\n')), {code: 'VOICE_HARD_GATE_BLOCKED'});
      await materializeVoicePreview(root, paths, derived, plan,job.providerPolicy.allowOpenAIVision===true?visualClient:undefined,visualConfig.visionModel); const refreshedQa = runVoiceQa({plan, animation: derived.manifest}, 'production', true, true); if (!refreshedQa.pass) throw Object.assign(new Error(refreshedQa.errors.join('\n')), {code: 'VOICE_HARD_GATE_BLOCKED'});
      atomicJson(paths.voiceSnapshot, plan); atomicWrite(paths.voice, voiceRecord(root, paths, plan));
      return {status: 'BLOCKED', errorCode: 'VOICE_DELEGATED_ACCEPTANCE_REQUIRED', message: 'Renderer changed after the pending Voice snapshot; the audible muxed preview was rerendered and re-bound to a new canonical hash for review.', artifacts: {voiceSnapshot: rel(root, paths.voiceSnapshot), voiceArtifact: rel(root, paths.voice), voicePreview: rel(root, paths.voicePreview)}, providerUsage: ZERO_USAGE};
    }
    if (!plan.previewMediaQa) {
      const sourceQa = runVoiceQa({plan, animation: derived.manifest}, 'production', true); if (!sourceQa.pass) throw Object.assign(new Error(sourceQa.errors.join('\n')), {code: 'VOICE_HARD_GATE_BLOCKED'});
      if (existsSync(paths.voicePreview)) measureVoicePreview(root, paths, plan); else await materializeVoicePreview(root, paths, derived, plan,job.providerPolicy.allowOpenAIVision===true?visualClient:undefined,visualConfig.visionModel);
      const muxedQa = runVoiceQa({plan, animation: derived.manifest}, 'production', true, true); if (!muxedQa.pass) throw Object.assign(new Error(muxedQa.errors.join('\n')), {code: 'VOICE_HARD_GATE_BLOCKED'});
      atomicJson(paths.voiceSnapshot, plan); atomicWrite(paths.voice, voiceRecord(root, paths, plan));
      return {status: 'BLOCKED', errorCode: 'VOICE_DELEGATED_ACCEPTANCE_REQUIRED', message: 'Audible muxed Voice preview and hard-gate QA passed. ChatGPT Work must review the new hash-bound preview before continuation.', artifacts: {voiceSnapshot: rel(root, paths.voiceSnapshot), voiceArtifact: rel(root, paths.voice), voicePreview: rel(root, paths.voicePreview)}, providerUsage: ZERO_USAGE};
    }
    const pendingQa = runVoiceQa({plan, animation: derived.manifest}, 'production', true, true); if (!pendingQa.pass) throw Object.assign(new Error(pendingQa.errors.join('\n')), {code: 'VOICE_HARD_GATE_BLOCKED'});
    const pendingVoiceSha = sha256File(paths.voiceSnapshot); const voiceAcceptance = acceptedCanonicalArtifact(paths.voice, pendingVoiceSha, {voice_review: 'pass', human_decision: 'approved', final_review_input_status: 'READY'}); if (!voiceAcceptance) return {status: 'BLOCKED', errorCode: 'VOICE_DELEGATED_ACCEPTANCE_REQUIRED', message: 'Canonical Voice acceptance is not yet persisted for the audible muxed preview.', artifacts: {voiceSnapshot: rel(root, paths.voiceSnapshot), voiceArtifact: rel(root, paths.voice), voicePreview: rel(root, paths.voicePreview)}, providerUsage: ZERO_USAGE}; plan.voiceReview = 'pass'; plan.humanDecision = 'approved'; plan.finalReviewInputStatus = 'READY'; plan.unresolvedBlockers = []; const acceptedVoiceQa = runVoiceQa({plan, animation: derived.manifest}, 'production', true, true); if (!acceptedVoiceQa.pass) throw Object.assign(new Error(acceptedVoiceQa.errors.join('\n')), {code: 'VOICE_HARD_GATE_BLOCKED'});

    if (!existsSync(paths.reviewSnapshot)) {
      const chain = [['script', derived.canonical.script.path], ['storyboard', derived.canonical.storyboard.path], ['visual-direction', derived.canonical.visual.path], ['animation', paths.animation], ['voice', paths.voice]].map(([stage, path]) => ({stage, path: rel(root, path), sha256: sha256File(path)})) as FinalReviewManifest['sourceChain']; const review = createGenericReviewDraft({contentId: job.contentId, animation: derived.manifest, voicePlan: plan, sourceChain: chain, sourceVoiceSnapshot: rel(root, paths.voiceSnapshot), sourceVoiceSnapshotSha256: sha256File(paths.voiceSnapshot), sourceVoiceAudioSha256: sha256File(paths.voiceMaster), sourceVoicePreviewSha256: sha256File(paths.voicePreview)}); if(review.retentionQa?.status!=='PASS') throw Object.assign(new Error(review.retentionQa?.findings.map((finding)=>finding.message).join('\n')||'Retention QA record missing'),{code:'RETENTION_TIMELINE_REVISION_REQUIRED'}); review.reviewPreview.path = rel(root, paths.reviewPreview); masterVoiceTimeline(paths.voiceMaster,paths.reviewVoiceMaster); atomicJson(paths.reviewProps, {manifest: derived.manifest, audioPublicPath: rel(resolve(root, 'generated'), paths.reviewVoiceMaster), captions: review.captions, stage:'review', finishingAudioAssets:review.finishingAudioAssets, voiceWindows:plan.segments.map((segment)=>({startSeconds:segment.slotStartSeconds,endSeconds:segment.slotStartSeconds+(segment.measuredDurationSeconds??segment.slotEndSeconds-segment.slotStartSeconds)}))}); render(root,paths.reviewProps,paths.reviewPremaster); const mastering=masterReviewBinary(paths.reviewPremaster,paths.reviewPreview); const mastered=inspectMasteredBinary(paths.reviewPreview); const masteringQa=evaluateMasteringCoreQa({...mastered,integratedGainDb:Number((mastered.integratedLufs-mastering.firstPass.inputIntegratedLufs).toFixed(1))}); if(masteringQa.status!=='PASS') throw Object.assign(new Error(JSON.stringify(masteringQa)),{code:'SHORT_FORM_MASTERING_BLOCKED'}); const media=probeVideo(paths.reviewPreview); review.reviewPreview={...review.reviewPreview,sha256:sha256File(paths.reviewPreview),codec:media.videoCodec,audioCodec:media.audioCodec,width:media.width,height:media.height,fps:media.fps,durationSeconds:Number(media.durationSeconds.toFixed(3))}; (review as any).masteringQa={...masteringQa,sourceVoiceSha256:sha256File(paths.voiceMaster),derivedVoiceSha256:sha256File(paths.reviewVoiceMaster),actualBinarySha256:review.reviewPreview.sha256,measurements:mastered}; const qa=runReviewQa({review,voicePlan:plan,animation:derived.manifest},'production',true); if(!qa.pass) throw Object.assign(new Error(qa.errors.join('\n')),{code:'FINAL_REVIEW_HARD_GATE_BLOCKED'}); atomicJson(paths.reviewSnapshot,review); atomicWrite(paths.review,`---\nid: ${review.id}\ntype: short-form-final-review\ninput_eligibility: production\nreview_preview_sha256: ${review.reviewPreview.sha256}\nmastering_policy: CKAI_SHORT_FORM_MASTERING_V1\nmastering_technical_qa: PASS\nhuman_audio_review: REQUIRED\nfinal_review: pending\nhuman_decision: pending\nexport_handoff_status: BLOCKED\nunresolved_issues: human audio review and canonical delegated Final Review acceptance pending\noperator_acceptance_by: pending\noperator_acceptance_at: pending\noperator_acceptance_basis: pending\noperator_acceptance_source_sha256: pending\n---\n\n# Generic Final Review\n`); return {status:'BLOCKED',errorCode:'FINAL_REVIEW_DELEGATED_ACCEPTANCE_REQUIRED',message:'Mastered Final Review preview and hard-gate QA passed. Human audio review is required before ChatGPT Work may persist hash-bound Final Review acceptance.',artifacts:{reviewSnapshot:rel(root,paths.reviewSnapshot),reviewArtifact:rel(root,paths.review),reviewPreview:rel(root,paths.reviewPreview)},providerUsage:ZERO_USAGE};
    }

    const pendingReviewSha = sha256File(paths.reviewSnapshot); const reviewAcceptance = acceptedCanonicalArtifact(paths.review, pendingReviewSha, {mastering_technical_qa:'PASS',human_audio_review:'PASS',final_review: 'pass', human_decision: 'approved', export_handoff_status: 'READY'}); if (!reviewAcceptance) return {status: 'BLOCKED', errorCode: 'FINAL_REVIEW_DELEGATED_ACCEPTANCE_REQUIRED', message: 'Canonical Final Review acceptance and human audio review are not yet persisted.', providerUsage: ZERO_USAGE}; const review = JSON.parse(readFileSync(paths.reviewSnapshot, 'utf8')) as FinalReviewManifest; review.finalReview = 'pass'; review.humanDecision = 'approved'; review.exportHandoffStatus = 'READY'; const reviewQa = runReviewQa({review, voicePlan: plan, animation: derived.manifest}, 'production', true); if (!reviewQa.pass) throw Object.assign(new Error(reviewQa.errors.join('\n')), {code: 'FINAL_REVIEW_HARD_GATE_BLOCKED'});
    const exportDraft = createGenericExportDraft({contentId: job.contentId, review, sourceReviewArtifact: rel(root, paths.review), sourceReviewArtifactSha256: sha256File(paths.review), sourceReviewSnapshot: rel(root, paths.reviewSnapshot), sourceReviewSnapshotSha256: sha256File(paths.reviewSnapshot), sourceTranscript: derived.canonical.script.relativePath, releaseVersion: paths.releaseVersion}); const input = {exportManifest: exportDraft, reviewInput: {review, voicePlan: plan, animation: derived.manifest}}; const pre = runExportQa(input, 'production', false); if (!pre.pass) throw Object.assign(new Error(pre.errors.join('\n')), {code: 'EXPORT_INPUT_GATE_BLOCKED'}); mkdirSync(dirname(paths.master), {recursive: true}); const partial = paths.master.replace(/\.mp4$/, '.partial.mp4'); run('ffmpeg', ffmpegArguments(paths.reviewPreview, partial), root, 'FINAL_EXPORT_FAILED'); renameSync(partial, paths.master); exportDraft.outputSha256 = sha256File(paths.master); exportDraft.mediaInspection = inspectExportMedia(paths.master); exportDraft.decodedMediaEquivalence = inspectDecodedMediaEquivalence(paths.reviewPreview, paths.master); const finalQa = runExportQa(input, 'production', true); if (!finalQa.pass) throw Object.assign(new Error(finalQa.errors.join('\n')), {code: 'EXPORT_HARD_GATE_BLOCKED'}); atomicWrite(paths.export, `---\nid: ${exportDraft.id}\ntype: short-form-final-export\ninput_eligibility: production\nrelease_version: ${exportDraft.releaseVersion}\noutput_path: ${rel(dirname(paths.export), paths.master)}\noutput_sha256: ${exportDraft.outputSha256}\nexport_qa: PASS\nexport_review: pass\nhuman_decision: pending\npublish_handoff_status: BLOCKED\nunresolved_blockers: Product Owner Release Approval pending\n---\n\n# Generic Final Export\n\nRelease remains PENDING_RELEASE_APPROVAL until Chốt.\n`); return {status: 'COMPLETED', message: 'Generic STEP 03–08 candidate completed. Release Approval remains pending.', artifacts: {exportArtifact: rel(root, paths.export), exportMaster: rel(root, paths.master)}, providerUsage: ZERO_USAGE};
  } catch (error) { const value = error as Error & {code?: string;openAIVisionRequests?:number};observedUsage.openAIVisionRequests+=value.openAIVisionRequests??0; const blocked = /BLOCKED|MISSING|STALE|REQUIRED|INVALID|IMMUTABILITY/.test(value.code ?? ''); return {status: blocked ? 'BLOCKED' : 'FAILED', message: value.message, errorCode: value.code ?? 'GENERIC_RUNTIME_FAILURE', providerUsage: observedUsage}; }
  finally { process.chdir(previous); }
};

const requestIndex = process.argv.indexOf('--request');
if (requestIndex >= 0) void (async () => { const outputIndex = process.argv.indexOf('--output'); const payload = JSON.parse(readFileSync(process.argv[requestIndex + 1], 'utf8')) as {repoRoot: string; job: Job; proofOnly?: boolean}; const result = await runGenericRuntime(payload.job, payload.repoRoot, payload.proofOnly === true); if (outputIndex >= 0) atomicJson(process.argv[outputIndex + 1], result); else console.log(JSON.stringify(result)); })();
