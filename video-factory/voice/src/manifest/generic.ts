import type {AnimationManifest} from '../../../animation/src/model';
import {normalizeVietnamese} from '../normalization';
import {resolveVoiceAlias} from '../registry';
import {segmentCacheKey, voiceHandoffHash} from '../segment';
import type {VoicePlan, VoiceSegment} from '../model';

export type GenericVoiceDraftInput = {
  contentId: string;
  animation: AnimationManifest;
  sourceAnimationArtifact: string;
  sourceAnimationArtifactSha256: string;
  sourceAnimationManifest: string;
  sourceAnimationManifestSha256: string;
  assembledAudioPath?: string;
  previewPath?: string;
};

export const createGenericVoiceDraft = (input: GenericVoiceDraftInput): VoicePlan => {
  if (input.animation.id !== `${input.contentId}-Animation` || input.animation.voiceHandoffStatus !== 'READY') throw new Error('Generic Voice draft requires a verified canonical Animation READY manifest');
  const alias = 'CKAI_NARRATOR_PRIMARY';
  const voice = resolveVoiceAlias(alias, 'production');
  const segments = input.animation.voiceHandoff.sceneSlots.map((slot, index): VoiceSegment => {
    const normalized = normalizeVietnamese(slot.spokenCopy);
    const draft = {id: `VO-${String(index + 1).padStart(2, '0')}`, sceneId: slot.sceneId, speakerAlias: alias, originalText: slot.spokenCopy, synthesisText: normalized.synthesisText, pronunciationTerms: normalized.terms, speed: 1, slotStartSeconds: slot.startSeconds, slotEndSeconds: slot.endSeconds, requiredProofCaveatIds: input.animation.voiceHandoff.proofCaveatTiming.find((item) => item.sceneId === slot.sceneId)?.requirementIds ?? [], cacheKey: '', generatedAudioPath: '', fitStatus: 'pending' as const};
    const cacheKey = segmentCacheKey(draft, voice);
    return {...draft, cacheKey, generatedAudioPath: `generated/voice/${input.contentId}/segments/${cacheKey}.wav`};
  });
  return {
    id: `${input.contentId}-Voice`, contentId: input.contentId, inputEligibility: 'production', sourceAnimationArtifact: input.sourceAnimationArtifact,
    sourceAnimationArtifactSha256: input.sourceAnimationArtifactSha256, sourceAnimationManifest: input.sourceAnimationManifest,
    sourceAnimationManifestSha256: input.sourceAnimationManifestSha256, sourceAnimationVoiceHandoffSha256: voiceHandoffHash(input.animation.voiceHandoff),
    sourceScript: input.animation.voiceHandoff.sourceScript, preferredProvider: 'vbee', useExistingQuota: true, autoPurchaseExtraCredits: false,
    paidFallbackRequiresProductOwnerApproval: true, voiceSelection: {candidateAliases: [alias], auditionedAliases: [alias], selectedAliases: [alias], productionApprovedMapping: true},
    voiceSelectionCheck: 'PASS', segments, providerInputCheck: 'PASS', segmentsGeneratedCheck: 'pending', audioTechnicalQa: 'pending', timingFitCheck: 'pending',
    pronunciationCheck: 'pending', proofCaveatCheck: 'PASS', voiceReview: 'pending', humanDecision: 'pending',
    unresolvedBlockers: ['provider generation, hard-gate review and canonical delegated acceptance pending'], finalReviewInputStatus: 'BLOCKED',
    assembledAudioPath: input.assembledAudioPath ?? `generated/voice/${input.contentId}/master.wav`, previewPath: input.previewPath ?? `generated/previews/${input.contentId}-voice.mp4`,
  };
};
