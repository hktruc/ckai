import type {FinalReviewManifest} from './model';
import type {ReviewUpstreamVerification} from './upstream';

const hardChecksPass = (review: FinalReviewManifest): boolean => [
  review.editorialCoherenceCheck,
  review.visualComprehensionCheck,
  review.audiovisualSyncCheck,
  review.captionCheck,
  review.musicCheck,
  review.sfxCheck,
  review.truthEvidenceCheck,
  review.brandReviewCheck,
  review.technicalVideoQa,
  review.audioQa,
].every((check) => check === 'PASS');

const issueGatePasses = (review: FinalReviewManifest): boolean => !review.issues.some((issue) =>
  issue.status === 'open' && (issue.severity === 'blocker' || issue.severity === 'major'),
);

export const isExportHandoffReady = (review: FinalReviewManifest, upstream: ReviewUpstreamVerification): boolean =>
  review.inputEligibility === 'production' && upstream.pass && upstream.derivedReviewInputStatus === 'READY' &&
  hardChecksPass(review) && issueGatePasses(review) && review.finalReview === 'pass' &&
  review.humanDecision === 'approved';

export const assertExportGate = (review: FinalReviewManifest, upstream: ReviewUpstreamVerification): void => {
  const expected = isExportHandoffReady(review, upstream) ? 'READY' : 'BLOCKED';
  if (review.exportHandoffStatus !== expected) throw new Error(`exportHandoffStatus must be ${expected}`);
};
