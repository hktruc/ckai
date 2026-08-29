import type {AnimationManifest, RenderMode} from '../model';
import type {UpstreamVerification} from './upstream';

export const isVoiceHandoffReady = (manifest: AnimationManifest, upstream?: UpstreamVerification): boolean =>
  upstream?.pass === true &&
  upstream.derivedAnimationHandoffStatus === 'READY' &&
  manifest.inputEligibility === 'production' &&
  manifest.upstreamAnimationHandoffStatus === 'READY' &&
  manifest.technicalQa === 'PASS' &&
  manifest.animationReview === 'pass' &&
  manifest.humanDecision === 'approved' &&
  manifest.unresolvedBlockers.length === 0 &&
  manifest.voiceHandoff.audioGenerated === false &&
  manifest.voiceHandoff.totalDurationSeconds === manifest.totalSeconds &&
  manifest.voiceHandoff.sceneSlots.length === manifest.scenes.length;

export const assertGateConsistency = (manifest: AnimationManifest, upstream: UpstreamVerification): void => {
  const expected = isVoiceHandoffReady(manifest, upstream) ? 'READY' : 'BLOCKED';
  if (manifest.voiceHandoffStatus !== expected) {
    throw new Error(`voiceHandoffStatus must be ${expected}, got ${manifest.voiceHandoffStatus}`);
  }
};

export const assertRenderInput = (manifest: AnimationManifest, mode: RenderMode, upstream: UpstreamVerification): void => {
  if (!upstream.pass) throw new Error('Canonical upstream source verification failed');
  if (mode === 'production') {
    if (manifest.inputEligibility !== 'production' || upstream.derivedAnimationHandoffStatus !== 'READY') {
      throw new Error('Production render requires canonically verified STEP 04 READY source');
    }
    return;
  }
  if (manifest.inputEligibility !== 'legacy-approved-reverse-audit' || upstream.derivedAnimationHandoffStatus !== 'BLOCKED') {
    throw new Error('reverse-audit-proof mode is only for explicitly labeled fixtures');
  }
};
