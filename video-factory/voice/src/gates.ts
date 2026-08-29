import type {VoicePlan} from './model';
import type {VoiceUpstreamVerification} from './upstream';

export const isFinalReviewInputReady = (plan: VoicePlan, upstream: VoiceUpstreamVerification): boolean =>
  plan.inputEligibility === 'production' && upstream.pass && upstream.derivedVoiceInputStatus === 'READY' &&
  plan.voiceSelectionCheck === 'PASS' && plan.voiceSelection.productionApprovedMapping &&
  plan.providerInputCheck === 'PASS' && plan.segmentsGeneratedCheck === 'PASS' && plan.audioTechnicalQa === 'PASS' &&
  plan.timingFitCheck === 'PASS' && plan.pronunciationCheck === 'PASS' && plan.proofCaveatCheck === 'PASS' &&
  plan.voiceReview === 'pass' && plan.humanDecision === 'approved' && plan.unresolvedBlockers.length === 0;

export const assertFinalGate = (plan: VoicePlan, upstream: VoiceUpstreamVerification): void => {
  const expected = isFinalReviewInputReady(plan, upstream) ? 'READY' : 'BLOCKED';
  if (plan.finalReviewInputStatus !== expected) throw new Error(`finalReviewInputStatus must be ${expected}`);
};
