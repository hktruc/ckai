import {existsSync, readFileSync} from 'node:fs';
import {sha256} from '../../voice/src/segment';
import {probeAudioLevels} from '../../voice/src/media';
import {validateFinishingAudio} from './assets';
import {validateCaptions} from './captions';
import {assertExportGate} from './gates';
import {detectUnintendedBlack, probeVideo} from './media';
import type {ReviewMode, ReviewRuntimeInput} from './model';
import {validateIssues} from './routing';
import {verifyReviewUpstream} from './upstream';
import {inspectActualBinaryExperience} from './experience';
import {evaluateRuntimeRetention, SHORT_FORM_RETENTION_POLICY_V1} from './retention';
import {planRetention, planSceneSemantics} from '../../visual-intelligence/src/planning';
import {evaluateActualRenderedVideo} from '../../visual-intelligence/src/qa';
import {validateAudioProductionContract} from '../../audio/src/qa';

export type ReviewQaResult = {pass: boolean; errors: string[]};

export const runReviewQa = (input: ReviewRuntimeInput, mode: ReviewMode, requirePreview = false): ReviewQaResult => {
  const {review, voicePlan} = input;
  const errors: string[] = [];
  const upstream = verifyReviewUpstream(input, mode);
  errors.push(...upstream.errors);
  errors.push(...validateCaptions(review, voicePlan));
  errors.push(...validateFinishingAudio(review, mode, input.animation.totalSeconds));
  if (review.audioProduction) {
    const audioContractQa = validateAudioProductionContract(review.audioProduction, {requireRender: requirePreview, requireHumanApproval: review.exportHandoffStatus === 'READY'});
    errors.push(...audioContractQa.errors.map((error) => `AUDIO_ENGINE: ${error}`));
  } else if (mode === 'production') errors.push('AUDIO_ENGINE: canonical production requires CKAI_AUDIO_PRODUCTION_V1');
  errors.push(...validateIssues(review.issues));
  if (mode === 'production') {
    const retention = evaluateRuntimeRetention(voicePlan, input.animation);
    if (!review.retentionQa || review.retentionQa.policyId !== SHORT_FORM_RETENTION_POLICY_V1.id || JSON.stringify(review.retentionQa) !== JSON.stringify(retention)) errors.push('Retention QA record is missing or stale against the canonical Voice/Animation timeline');
    errors.push(...retention.findings.map((finding) => `${finding.code}: ${finding.message} (${finding.startSeconds.toFixed(3)}-${finding.endSeconds.toFixed(3)}s)`));
  }
  if (review.captionMode === 'on' && review.captionCheck !== 'PASS') errors.push('Enabled captions require captionCheck PASS');
  if (review.captionMode === 'off-approved' && review.captionCheck !== 'PASS') errors.push('Approved caption-off mode still requires captionCheck PASS');
  if (review.musicMode === 'none' && review.musicCheck !== 'PASS') errors.push('Music none is valid only when explicitly checked PASS');
  if (review.sfxMode === 'none' && review.sfxCheck !== 'PASS') errors.push('SFX none is valid only when explicitly checked PASS');
  if (requirePreview) {
    try {
      if (!existsSync(review.reviewPreview.path)) throw new Error('Review preview is missing');
      if (!review.reviewPreview.sha256 || sha256(readFileSync(review.reviewPreview.path)) !== review.reviewPreview.sha256) errors.push('Review preview checksum is missing or stale');
      const video = probeVideo(review.reviewPreview.path);
      if (video.width !== 1080 || video.height !== 1920) errors.push('Review preview must be 1080×1920');
      if (Math.abs(video.fps - 30) > 0.001) errors.push('Review preview must be 30 fps');
      if (!(video.durationSeconds > 0 && video.durationSeconds < 60)) errors.push('Review preview duration must be >0 and <60 seconds');
      if (video.audioSampleRate < 16000) errors.push('Review preview audio sample rate is invalid');
      const levels = probeAudioLevels(review.reviewPreview.path);
      if (levels.meanVolumeDb < -60) errors.push('Review preview narration is effectively silent');
      if (levels.maxVolumeDb > 0.1 || levels.zeroDbSampleRatio > 0.005) errors.push('Review preview has severe clipping indicators');
      if (detectUnintendedBlack(review.reviewPreview.path) >= 0.5) errors.push('Review preview contains an unintended black/empty interval');
      const experience = inspectActualBinaryExperience(review.reviewPreview.path);
      errors.push(...experience.errors);
      const semanticRetention = evaluateActualRenderedVideo(planRetention(planSceneSemantics(input.animation)), experience);
      (review as FinalReviewManifestWithSemanticRetention).semanticRetentionQa = semanticRetention;
      if (semanticRetention.verdict !== 'PASS') errors.push(...semanticRetention.reasons.map((reason) => `VIDEO_RETENTION_FAILURE: ${reason}`));
    } catch (error) { errors.push((error as Error).message); }
  }
  try { assertExportGate(review, upstream); } catch (error) { errors.push((error as Error).message); }
  return {pass: errors.length === 0, errors};
};

type FinalReviewManifestWithSemanticRetention = ReviewRuntimeInput['review'] & {semanticRetentionQa?: ReturnType<typeof evaluateActualRenderedVideo>};
