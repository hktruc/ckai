import {TEST_0002} from '../../../animation/src/manifest/test0002';
import type {VoicePlan, VoiceSegment} from '../../../voice/src/model';
import {deriveCaptions} from '../captions';
import type {FinalReviewManifest} from '../model';
import {chooseIntentionalSilence, createAudioProductionDraft, planSemanticSfx} from '../../../audio/src';

const sourceChain: FinalReviewManifest['sourceChain'] = [
  {stage: 'script', path: 'content/scripts/TEST-0002_prompt-don-markdown-script-contract.md', sha256: '2D1279FC87A3E303FCD2B651A5D57FDAFA6D72E034404BDD16566A6A8EC9C82C'},
  {stage: 'storyboard', path: 'content/storyboards/TEST-0002_prompt-don-markdown_storyboard.md', sha256: 'E44DD98A73F4F79F5E00269CA056A762D0A898BA8D639DD8C93651E96A261921'},
  {stage: 'visual-direction', path: 'content/visual-directions/TEST-0002_prompt-don-markdown_visual-direction.md', sha256: 'D1D1BDDB9DA2858D5DFAF5ED159D55D9EFE4593BF0BB674A7700B1D28C877204'},
  {stage: 'animation', path: 'content/animations/TEST-0002_prompt-don-markdown_animation.md', sha256: '71C96491A3E8E622BC15E230A2CAF70DB46CB7B8C87E856B3C77C1DC8BA0CD17'},
  {stage: 'voice', path: 'content/voices/TEST-0002_prompt-don-markdown_voice-plan.md', sha256: '7BDA7E034ED4A314F88CE2A83A482DA20569F0AEF785019C39D687249D29CBC5'},
];

const captionPolicy: FinalReviewManifest['captionPolicy'] = {
  maxLineCharacters: 28,
  maxLines: 2,
  sceneZones: {'SC-01': 'lower-safe', 'SC-02': 'lower-safe', 'SC-03': 'upper-safe', 'SC-04': 'lower-safe', 'SC-05': 'lower-safe'},
  protectedZones: {'SC-01': ['upper-safe'], 'SC-02': ['upper-safe'], 'SC-03': ['lower-safe'], 'SC-04': ['upper-safe'], 'SC-05': ['upper-safe']},
};

export const createTest0002ReviewManifest = (voicePlan: VoicePlan): FinalReviewManifest => {
  const runtimeCaptionPolicy = structuredClone(captionPolicy);
  const audioProduction = planSemanticSfx(chooseIntentionalSilence(createAudioProductionDraft({
    contentId: 'TEST-0002', contentMode: 'PRACTICAL',
    narration: {sourcePath: 'generated/voice/TEST-0002/master.wav', sha256: '0641AB84EBBD485D859F98DC1F84E29FF54411D3D153718F5BD9607D77F6CB5C', durationSeconds: 49, density: 'MEDIUM'},
    semanticIntent: ['reverse-audit proof'], emotionalTrajectory: ['technical verification'],
  }), 'Reverse-audit fixture intentionally exercises the valid no-music path.'), {decision: 'NO_SFX', rationale: 'Reverse-audit fixture intentionally exercises the valid no-SFX path.'});
  audioProduction.mix = {...audioProduction.mix, renderState: 'RENDERED', technicalQa: 'PASS'};
  audioProduction.qa.phoneSpeakerTechnicalProxy = 'PASS';
  const review: FinalReviewManifest = {
    id: 'TEST-0002-FinalReview', contentId: 'TEST-0002', inputEligibility: 'legacy-approved-reverse-audit', sourceChain,
    sourceVoiceSnapshot: 'generated/voice/TEST-0002/voice-plan.generated.json',
    sourceVoiceSnapshotSha256: 'C805D983E9193FF46D6111A333C2550C301DD0A98FEED90F0BD3A57F71037EBF',
    sourceVoiceAudio: 'generated/voice/TEST-0002/master.wav',
    sourceVoiceAudioSha256: '0641AB84EBBD485D859F98DC1F84E29FF54411D3D153718F5BD9607D77F6CB5C',
    sourceVoicePreview: 'generated/previews/TEST-0002-voice.mp4',
    sourceVoicePreviewSha256: '02C98D7BF78BE72D1855EA305938767933BA4C971ECB59F88C07B76ADD9815EF',
    captionMode: 'on', captionPolicy: runtimeCaptionPolicy, captions: [], musicMode: 'none', sfxMode: 'none', finishingAudioAssets: [], audioProduction, voiceGainDb: 0,
    editorialCoherenceCheck: 'PASS', visualComprehensionCheck: 'PASS', audiovisualSyncCheck: 'PASS', captionCheck: 'PASS',
    musicCheck: 'PASS', sfxCheck: 'PASS', truthEvidenceCheck: 'PASS', brandReviewCheck: 'PASS', technicalVideoQa: 'PASS', audioQa: 'PASS',
    issues: [], finalReview: 'pass', humanDecision: 'not-applicable', exportHandoffStatus: 'BLOCKED',
    reviewPreview: {path: 'generated/previews/TEST-0002-review.mp4', captionMode: 'on', audioMixMode: 'voice-only'},
  };
  review.captions = deriveCaptions(voicePlan, runtimeCaptionPolicy);
  return review;
};

const durations = [4.702, 1.683, 13.840, 6.827, 8.336];
const renderSegments = TEST_0002.voiceHandoff.sceneSlots.map((slot, index) => ({
  id: `VO-${String(index + 1).padStart(2, '0')}`, sceneId: slot.sceneId, originalText: slot.spokenCopy,
  slotStartSeconds: slot.startSeconds, slotEndSeconds: slot.endSeconds, measuredDurationSeconds: durations[index],
})) as VoiceSegment[];

export const TEST_0002_REVIEW_RENDER = createTest0002ReviewManifest({segments: renderSegments} as VoicePlan);
