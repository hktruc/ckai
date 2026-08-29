import {resolveVoiceAlias} from '../registry';
import {normalizeVietnamese} from '../normalization';
import {segmentCacheKey, voiceHandoffHash} from '../segment';
import type {VoicePlan, VoiceSegment} from '../model';
import {TEST_0002} from '../../../animation/src/manifest/test0002';

const aliases = ['LOCAL_VI_NARRATOR_PROOF', 'LOCAL_VI_NARRATOR_PROOF', 'LOCAL_VI_AI_PROOF', 'LOCAL_VI_NARRATOR_PROOF', 'LOCAL_VI_NARRATOR_PROOF'];

export const createTest0002VoicePlan = (): VoicePlan => {
  const segments: VoiceSegment[] = TEST_0002.voiceHandoff.sceneSlots.map((slot, index) => {
    const normalized = normalizeVietnamese(slot.spokenCopy);
    const speakerAlias = aliases[index];
    const draft = {
      id: `VO-${String(index + 1).padStart(2, '0')}`, sceneId: slot.sceneId, speakerAlias,
      originalText: slot.spokenCopy, synthesisText: normalized.synthesisText, pronunciationTerms: normalized.terms,
      speed: 1.08, slotStartSeconds: slot.startSeconds, slotEndSeconds: slot.endSeconds,
      requiredEndSeconds: slot.pauseWindows[0]?.startSeconds,
      requiredProofCaveatIds: TEST_0002.voiceHandoff.proofCaveatTiming.find((item) => item.sceneId === slot.sceneId)?.requirementIds ?? [],
      cacheKey: '', generatedAudioPath: '', fitStatus: 'pending' as const
    };
    const cacheKey = segmentCacheKey(draft, resolveVoiceAlias(speakerAlias, 'reverse-audit-proof'));
    return {...draft, cacheKey, generatedAudioPath: `generated/voice/TEST-0002/segments/${cacheKey}.wav`};
  });
  return {
    id: 'TEST-0002-Voice', contentId: 'TEST-0002', inputEligibility: 'legacy-approved-reverse-audit',
    sourceAnimationArtifact: 'content/animations/TEST-0002_prompt-don-markdown_animation.md',
    sourceAnimationArtifactSha256: '71C96491A3E8E622BC15E230A2CAF70DB46CB7B8C87E856B3C77C1DC8BA0CD17',
    sourceAnimationManifest: 'video-factory/animation/src/manifest/test0002.ts',
    sourceAnimationManifestSha256: '3A5DAF88D457E6FEFE4030C7E2D873FC42A969CDFF2302961A84FC15D6940934',
    sourceAnimationVoiceHandoffSha256: voiceHandoffHash(TEST_0002.voiceHandoff),
    sourceScript: TEST_0002.voiceHandoff.sourceScript,
    preferredProvider: 'vbee', useExistingQuota: true, autoPurchaseExtraCredits: false,
    paidFallbackRequiresProductOwnerApproval: true,
    voiceSelection: {
      candidateAliases: ['LOCAL_VI_NARRATOR_PROOF', 'LOCAL_VI_AI_PROOF'],
      auditionedAliases: ['LOCAL_VI_NARRATOR_PROOF', 'LOCAL_VI_AI_PROOF'],
      selectedAliases: ['LOCAL_VI_NARRATOR_PROOF', 'LOCAL_VI_AI_PROOF'],
      productionApprovedMapping: false,
    }, voiceSelectionCheck: 'BLOCKED', segments,
    providerInputCheck: 'PASS', segmentsGeneratedCheck: 'pending', audioTechnicalQa: 'pending', timingFitCheck: 'pending',
    pronunciationCheck: 'pending', proofCaveatCheck: 'PASS', voiceReview: 'pending', humanDecision: 'not-applicable',
    unresolvedBlockers: ['reverse-audit fixture has no production authority', 'pronunciation and voice selection require Product Owner review'],
    finalReviewInputStatus: 'BLOCKED', assembledAudioPath: 'generated/voice/TEST-0002/master.wav',
    previewPath: 'generated/previews/TEST-0002-voice.mp4'
  };
};
