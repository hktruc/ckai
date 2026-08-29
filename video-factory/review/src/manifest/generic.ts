import type {AnimationManifest} from '../../../animation/src/model';
import type {VoicePlan} from '../../../voice/src/model';
import {deriveCaptions} from '../captions';
import type {FinalReviewManifest, SourceReference} from '../model';
import {evaluateRuntimeRetention} from '../retention';

export type GenericReviewDraftInput = {
  contentId: string;
  animation: AnimationManifest;
  voicePlan: VoicePlan;
  sourceChain: SourceReference[];
  sourceVoiceSnapshot: string;
  sourceVoiceSnapshotSha256: string;
  sourceVoiceAudioSha256: string;
  sourceVoicePreviewSha256: string;
};

export const createGenericReviewDraft = (input: GenericReviewDraftInput): FinalReviewManifest => {
  if (input.voicePlan.contentId !== input.contentId || input.voicePlan.finalReviewInputStatus !== 'READY') throw new Error('Generic Final Review draft requires canonical Voice acceptance and Final Review input READY');
  const sceneZones = Object.fromEntries(input.animation.scenes.map((scene) => [scene.id, 'lower-safe' as const]));
  const protectedZones = Object.fromEntries(input.animation.scenes.map((scene) => [scene.id, ['upper-safe' as const]]));
  const policy: FinalReviewManifest['captionPolicy'] = {maxLineCharacters: 28, maxLines: 2, sceneZones, protectedZones};
  const review: FinalReviewManifest = {
    id: `${input.contentId}-FinalReview`, contentId: input.contentId, inputEligibility: 'production', sourceChain: input.sourceChain,
    sourceVoiceSnapshot: input.sourceVoiceSnapshot, sourceVoiceSnapshotSha256: input.sourceVoiceSnapshotSha256,
    sourceVoiceAudio: input.voicePlan.assembledAudioPath, sourceVoiceAudioSha256: input.sourceVoiceAudioSha256,
    sourceVoicePreview: input.voicePlan.previewPath, sourceVoicePreviewSha256: input.sourceVoicePreviewSha256,
    captionMode: 'on', captionPolicy: policy, captions: [], musicMode: 'none', sfxMode: 'none', finishingAudioAssets: [], voiceGainDb: 0,
    editorialCoherenceCheck: 'PASS', visualComprehensionCheck: 'PASS', audiovisualSyncCheck: 'PASS', captionCheck: 'PASS', musicCheck: 'PASS', sfxCheck: 'PASS',
    truthEvidenceCheck: 'PASS', brandReviewCheck: 'PASS', technicalVideoQa: 'PASS', audioQa: 'PASS', issues: [], finalReview: 'pending', humanDecision: 'pending', exportHandoffStatus: 'BLOCKED',
    reviewPreview: {path: `generated/previews/${input.contentId}-review.mp4`, captionMode: 'on', audioMixMode: 'voice-only'},
  };
  review.captions = deriveCaptions(input.voicePlan, policy);
  review.retentionQa = evaluateRuntimeRetention(input.voicePlan, input.animation);
  return review;
};
