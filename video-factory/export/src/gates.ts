import {validateDecodedMediaEquivalence} from './equivalence';
import type {ExportManifest} from './model';
import type {ExportUpstreamVerification} from './upstream';

const hardChecksPass = (manifest: ExportManifest): boolean => [
  manifest.inputVerificationCheck, manifest.deliveryProfileCheck, manifest.sourceEquivalenceCheck,
  manifest.decodedVisualEquivalenceCheck, manifest.decodedAudioEquivalenceCheck,
  manifest.dimensionsCheck, manifest.aspectRatioCheck, manifest.fpsCheck, manifest.durationCheck,
  manifest.videoFormatCheck, manifest.audioFormatCheck, manifest.decodeCheck, manifest.audioPresenceCheck,
  manifest.captionPreservationCheck, manifest.finishingPreservationCheck, manifest.checksumCheck,
].every((check) => check === 'PASS');

const releaseManifestComplete = (manifest: ExportManifest): boolean => Boolean(
  manifest.id && manifest.contentId && manifest.sourceReviewArtifact && manifest.sourceReviewArtifactSha256.match(/^[A-F0-9]{64}$/) &&
  manifest.sourceReviewSnapshot && manifest.sourceReviewSnapshotSha256.match(/^[A-F0-9]{64}$/) &&
  manifest.sourceReviewPreview && manifest.sourceReviewPreviewSha256.match(/^[A-F0-9]{64}$/) &&
  manifest.sourceTranscript && manifest.deliveryMode && manifest.deliveryProfile.id && manifest.outputFilename && manifest.outputPath &&
  manifest.mediaInspection && manifest.decodedMediaEquivalence && manifest.outputSha256?.match(/^[A-F0-9]{64}$/) && manifest.qualityGovernance
);

const creativeQualityReady = (manifest: ExportManifest): boolean => {
  const quality = manifest.qualityGovernance;
  return Boolean(quality.standardId) && quality.architectureStatus === 'PASS' && quality.integrationStatus === 'PASS' && quality.machineTechnicalStatus === 'PASS' &&
    quality.creativeQualityStatus === 'MARKET_READY' && Number.isFinite(quality.marketReadinessScore) && quality.tasteGate === 'PASS' &&
    quality.releaseCandidateEligible && quality.humanCreativeDirectorVerdict === 'APPROVED';
};

export const isPublishHandoffReady = (manifest: ExportManifest, upstream: ExportUpstreamVerification): boolean =>
  manifest.inputEligibility === 'production' && upstream.pass && upstream.derivedExportInputStatus === 'READY' &&
  hardChecksPass(manifest) && releaseManifestComplete(manifest) &&
  Boolean(manifest.decodedMediaEquivalence && validateDecodedMediaEquivalence(manifest.decodedMediaEquivalence, manifest.deliveryProfile.durationToleranceSeconds).length === 0) &&
  creativeQualityReady(manifest) && manifest.exportReview === 'pass' && manifest.humanDecision === 'approved' && manifest.unresolvedBlockers.length === 0;

export const assertPublishGate = (manifest: ExportManifest, upstream: ExportUpstreamVerification): void => {
  const expected = isPublishHandoffReady(manifest, upstream) ? 'READY' : 'BLOCKED';
  if (manifest.publishHandoffStatus !== expected) throw new Error(`publishHandoffStatus must be ${expected}`);
};
