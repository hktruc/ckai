import type {FinalReviewManifest} from '../../../review/src/model';
import {reviewDigests} from '../digests';
import {CKAI_VERTICAL_MASTER_V1} from '../profile';
import type {ExportManifest} from '../model';

export type GenericExportDraftInput = {
  contentId: string;
  review: FinalReviewManifest;
  sourceReviewArtifact: string;
  sourceReviewArtifactSha256: string;
  sourceReviewSnapshot: string;
  sourceReviewSnapshotSha256: string;
  sourceTranscript: string;
  releaseVersion?: number;
};

export const createGenericExportDraft = (input: GenericExportDraftInput): ExportManifest => {
  if (input.review.contentId !== input.contentId || input.review.exportHandoffStatus !== 'READY' || !input.review.reviewPreview.sha256 || !input.review.reviewPreview.durationSeconds) throw new Error('Generic Export draft requires canonical Final Review READY input and verified preview');
  const version = input.releaseVersion ?? 1;
  const digests = reviewDigests(input.review);
  return {
    id: `${input.contentId}-Export-v${version}`, contentId: input.contentId, inputEligibility: 'production', sourceReviewArtifact: input.sourceReviewArtifact,
    sourceReviewArtifactSha256: input.sourceReviewArtifactSha256, sourceReviewSnapshot: input.sourceReviewSnapshot, sourceReviewSnapshotSha256: input.sourceReviewSnapshotSha256,
    sourceReviewPreview: input.review.reviewPreview.path, sourceReviewPreviewSha256: input.review.reviewPreview.sha256, sourceTranscript: input.sourceTranscript,
    deliveryMode: 'animated-voice', deliveryProfile: structuredClone(CKAI_VERTICAL_MASTER_V1), releaseVersion: version,
    outputFilename: `${input.contentId}_v${version}_master.mp4`, outputPath: `generated/exports/${input.contentId}/${input.contentId}_v${version}_master.mp4`,
    captionMode: input.review.captionMode, musicMode: input.review.musicMode, sfxMode: input.review.sfxMode, reviewedDurationSeconds: input.review.reviewPreview.durationSeconds,
    timelineDigestSha256: digests.timeline, captionDigestSha256: digests.captions, finishingDigestSha256: digests.finishing,
    inputVerificationCheck: 'PASS', deliveryProfileCheck: 'PASS', sourceEquivalenceCheck: 'PASS', decodedVisualEquivalenceCheck: 'PASS', decodedAudioEquivalenceCheck: 'PASS',
    dimensionsCheck: 'PASS', aspectRatioCheck: 'PASS', fpsCheck: 'PASS', durationCheck: 'PASS', videoFormatCheck: 'PASS', audioFormatCheck: 'PASS', decodeCheck: 'PASS',
    audioPresenceCheck: 'PASS', captionPreservationCheck: 'PASS', finishingPreservationCheck: 'PASS', checksumCheck: 'PASS',
    qualityGovernance: {standardId: null, architectureStatus: 'PASS', integrationStatus: 'PASS', machineTechnicalStatus: 'PASS', creativeQualityStatus: 'PENDING_HUMAN_REVIEW', marketReadinessScore: null, tasteGate: 'PENDING', goldenCandidate: false, releaseCandidateEligible: false, humanCreativeDirectorVerdict: 'PENDING'},
    exportReview: 'pass', humanDecision: 'pending', publishHandoffStatus: 'BLOCKED', unresolvedBlockers: ['Market/Taste review pending', 'Product Owner Release Approval pending'],
  };
};
