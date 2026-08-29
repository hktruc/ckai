import {reviewDigests} from '../digests';
import {CKAI_VERTICAL_MASTER_V1} from '../profile';
import type {ExportManifest} from '../model';
import type {FinalReviewManifest} from '../../../review/src/model';

export const createTest0002ExportManifest = (review: FinalReviewManifest): ExportManifest => {
  const digests = reviewDigests(review);
  return {
    id: 'TEST-0002-Export-v1', contentId: 'TEST-0002', inputEligibility: 'legacy-approved-reverse-audit',
    sourceReviewArtifact: 'content/reviews/TEST-0002_prompt-don-markdown_final-review.md', sourceReviewArtifactSha256: 'DA7B442DAC9F43BF595A9711D45D3295DAF8663C589D7E8B816521F5B726F519',
    sourceReviewSnapshot: 'generated/review/TEST-0002/final-review.generated.json', sourceReviewSnapshotSha256: 'DBAE7AC15E9EB770B3DA1C64873FAE03A10EF04121CA09DE73390CFF429B10E7',
    sourceReviewPreview: review.reviewPreview.path, sourceReviewPreviewSha256: review.reviewPreview.sha256!,
    sourceTranscript: 'content/scripts/TEST-0002_prompt-don-markdown-script-contract.md', deliveryMode: 'animated-voice',
    deliveryProfile: structuredClone(CKAI_VERTICAL_MASTER_V1), releaseVersion: 1, outputFilename: 'TEST-0002_v1_master.mp4', outputPath: 'generated/exports/TEST-0002/TEST-0002_v1_master.mp4',
    captionMode: review.captionMode, musicMode: review.musicMode, sfxMode: review.sfxMode, reviewedDurationSeconds: review.reviewPreview.durationSeconds!,
    timelineDigestSha256: digests.timeline, captionDigestSha256: digests.captions, finishingDigestSha256: digests.finishing,
    inputVerificationCheck: 'PASS', deliveryProfileCheck: 'PASS', sourceEquivalenceCheck: 'PASS', decodedVisualEquivalenceCheck: 'PASS', decodedAudioEquivalenceCheck: 'PASS', dimensionsCheck: 'PASS', aspectRatioCheck: 'PASS', fpsCheck: 'PASS', durationCheck: 'PASS',
    videoFormatCheck: 'PASS', audioFormatCheck: 'PASS', decodeCheck: 'PASS', audioPresenceCheck: 'PASS', captionPreservationCheck: 'PASS', finishingPreservationCheck: 'PASS', checksumCheck: 'PASS',
    qualityGovernance: {standardId: null, architectureStatus: 'PASS', integrationStatus: 'PASS', machineTechnicalStatus: 'PASS', creativeQualityStatus: 'PENDING_HUMAN_REVIEW', marketReadinessScore: null, tasteGate: 'PENDING', goldenCandidate: false, releaseCandidateEligible: false, humanCreativeDirectorVerdict: 'PENDING'},
    exportReview: 'pass', humanDecision: 'not-applicable', publishHandoffStatus: 'BLOCKED', unresolvedBlockers: [],
  };
};
