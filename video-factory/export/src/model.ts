import type {CaptionMode, FinalReviewManifest, OptionalAudioMode, ReviewRuntimeInput} from '../../review/src/model';

export type ExportMode = 'production' | 'reverse-audit-proof';
export type ExportCheck = 'pending' | 'PASS' | 'BLOCKED';

export type DeliveryProfile = {
  id: 'CKAI_VERTICAL_MASTER_V1';
  version: 1;
  container: 'mp4';
  videoCodec: 'h264';
  videoEncoder: 'libx264';
  pixelFormat: 'yuv420p';
  width: 1080;
  height: 1920;
  aspectRatio: '9:16';
  fps: 30;
  crf: 18;
  preset: 'medium';
  audioCodec: 'aac';
  audioSampleRate: 48000;
  audioChannels: 2;
  audioBitrateKbps: 192;
  fastStart: true;
  maximumDurationSeconds: 60;
  durationToleranceSeconds: 0.12;
};

export type ExportMediaInspection = {
  formatName: string;
  durationSeconds: number;
  sizeBytes: number;
  overallBitrate: number;
  videoCodec: string;
  videoProfile: string;
  pixelFormat: string;
  width: number;
  height: number;
  sampleAspectRatio: string;
  displayAspectRatio: string;
  fps: number;
  videoBitrate: number;
  audioCodec: string;
  audioProfile: string;
  audioSampleRate: number;
  audioChannels: number;
  audioChannelLayout: string;
  audioBitrate: number;
  decodeCheck: ExportCheck;
};

export type DecodedMediaEquivalence = {
  comparisonScope: 'full-video';
  normalization: '1080x1920-yuv420p-tv-cfr30-common-timebase';
  comparedFrames: number;
  visualSsimAll: number;
  visualSsimY: number;
  visualSsimU: number;
  visualSsimV: number;
  visualThresholdAll: number;
  visualThresholdChannel: number;
  sourceAudioDurationSeconds: number;
  sourceAudioChannels: number;
  outputAudioDurationSeconds: number;
  outputAudioChannels: number;
  audioDurationDeltaSeconds: number;
  sourceMeanVolumeDb: number;
  outputMeanVolumeDb: number;
  audioMeanLevelDeltaDb: number;
  sourceMaxVolumeDb: number;
  outputMaxVolumeDb: number;
  audioMaxLevelDeltaDb: number;
  sourceLongestSilenceSeconds: number;
  outputLongestSilenceSeconds: number;
  audioLongestSilenceIncreaseSeconds: number;
};

export type CreativeQualityGovernanceStatus = {
  standardId: string | null;
  architectureStatus: 'PASS' | 'FAIL' | 'PENDING';
  integrationStatus: 'PASS' | 'FAIL' | 'PENDING';
  machineTechnicalStatus: 'PASS' | 'FAIL' | 'PENDING';
  creativeQualityStatus: 'PRODUCT_FAILURE' | 'MARKET_READY' | 'PENDING_HUMAN_REVIEW';
  marketReadinessScore: number | null;
  tasteGate: 'PASS' | 'FAIL' | 'PENDING';
  goldenCandidate: boolean;
  releaseCandidateEligible: boolean;
  humanCreativeDirectorVerdict: 'APPROVED' | 'REJECTED' | 'PENDING';
};

export type ExportManifest = {
  id: string;
  contentId: string;
  inputEligibility: 'production' | 'legacy-approved-reverse-audit';
  sourceReviewArtifact: string;
  sourceReviewArtifactSha256: string;
  sourceReviewSnapshot: string;
  sourceReviewSnapshotSha256: string;
  sourceReviewPreview: string;
  sourceReviewPreviewSha256: string;
  sourceTranscript: string;
  deliveryMode: 'animated-voice' | 'manual-human' | 'other';
  deliveryProfile: DeliveryProfile;
  releaseVersion: number;
  outputFilename: string;
  outputPath: string;
  captionMode: CaptionMode;
  musicMode: OptionalAudioMode;
  sfxMode: OptionalAudioMode;
  reviewedDurationSeconds: number;
  timelineDigestSha256: string;
  captionDigestSha256: string;
  finishingDigestSha256: string;
  inputVerificationCheck: ExportCheck;
  deliveryProfileCheck: ExportCheck;
  sourceEquivalenceCheck: ExportCheck;
  decodedVisualEquivalenceCheck: ExportCheck;
  decodedAudioEquivalenceCheck: ExportCheck;
  dimensionsCheck: ExportCheck;
  aspectRatioCheck: ExportCheck;
  fpsCheck: ExportCheck;
  durationCheck: ExportCheck;
  videoFormatCheck: ExportCheck;
  audioFormatCheck: ExportCheck;
  decodeCheck: ExportCheck;
  audioPresenceCheck: ExportCheck;
  captionPreservationCheck: ExportCheck;
  finishingPreservationCheck: ExportCheck;
  checksumCheck: ExportCheck;
  mediaInspection?: ExportMediaInspection;
  decodedMediaEquivalence?: DecodedMediaEquivalence;
  outputSha256?: string;
  qualityGovernance: CreativeQualityGovernanceStatus;
  exportReview: 'pending' | 'pass' | 'revise' | 'reject';
  humanDecision: 'pending' | 'approved' | 'rejected' | 'needs-changes' | 'not-applicable';
  publishHandoffStatus: 'READY' | 'BLOCKED';
  unresolvedBlockers: string[];
};

export type ExportRuntimeInput = {
  exportManifest: ExportManifest;
  reviewInput: ReviewRuntimeInput;
};

export type ReleaseManifest = ExportManifest & {
  sourceReview: FinalReviewManifest;
  generatedAt: string;
};
