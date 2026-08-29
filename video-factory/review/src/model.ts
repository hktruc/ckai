import type {AnimationManifest} from '../../animation/src/model';
import type {VoicePlan} from '../../voice/src/model';
import type {RetentionQaRecord} from './retention';
import type {AudioProductionContract} from '../../audio/src/model';
import type {MusicBedSegment} from '../../audio/src/model';

export type ReviewMode = 'production' | 'reverse-audit-proof';
export type ReviewCheck = 'pending' | 'PASS' | 'BLOCKED' | 'REVISE';
export type CaptionMode = 'on' | 'off-approved';
export type OptionalAudioMode = 'none' | 'local-approved';
export type ReturnTarget = 'script' | 'storyboard' | 'visual-director' | 'animation' | 'voice' | 'finishing';
export type SfxCueType = 'warning-tension' | 'comparison-shift' | 'thesis-emphasis' | 'proof-reveal' | 'contrast-tension' | 'closing-payoff' | 'transition-accent';

export type SourceReference = {
  stage: 'script' | 'storyboard' | 'visual-direction' | 'animation' | 'voice';
  path: string;
  sha256: string;
};

export type CaptionZone = 'upper-safe' | 'lower-safe';
export type CaptionCue = {
  id: string;
  voiceSegmentId: string;
  sceneId: string;
  sourceText: string;
  lines: string[];
  startSeconds: number;
  endSeconds: number;
  zone: CaptionZone;
};

export type FinishingAudioAsset = {
  id: string;
  type: 'music' | 'sfx';
  localPath: string;
  purpose: string;
  source: string;
  provenance: string;
  licenseStatus: 'approved' | 'unknown' | 'test-only';
  sceneId?: string;
  cueType?: SfxCueType;
  startSeconds: number;
  durationSeconds?: number;
  gainDb: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
  duckUnderVoiceDb?: number;
  bedSegments?: MusicBedSegment[];
  canonicalTrackId?: string;
  canonicalSourceSha256?: string;
  provenanceRef?: string;
  required: boolean;
  sha256: string;
  unresolvedIssue?: string;
};

export type ReviewIssue = {
  id: string;
  severity: 'blocker' | 'major' | 'minor';
  status: 'open' | 'resolved' | 'accepted-minor';
  returnTo: ReturnTarget;
  reason: string;
  affectedSceneId?: string;
  affectedSegmentId?: string;
  requiredCorrection: string;
};

export type ReviewPreview = {
  path: string;
  sha256?: string;
  codec?: string;
  audioCodec?: string;
  width?: number;
  height?: number;
  fps?: number;
  durationSeconds?: number;
  captionMode: CaptionMode;
  audioMixMode: 'voice-only' | 'voice-plus-local';
};

export type FinalReviewManifest = {
  id: string;
  contentId: string;
  inputEligibility: 'production' | 'legacy-approved-reverse-audit';
  sourceChain: SourceReference[];
  sourceVoiceSnapshot: string;
  sourceVoiceSnapshotSha256: string;
  sourceVoiceAudio: string;
  sourceVoiceAudioSha256: string;
  sourceVoicePreview: string;
  sourceVoicePreviewSha256: string;
  captionMode: CaptionMode;
  captionPolicy: {
    maxLineCharacters: number;
    maxLines: number;
    sceneZones: Record<string, CaptionZone>;
    protectedZones: Record<string, CaptionZone[]>;
  };
  captions: CaptionCue[];
  musicMode: OptionalAudioMode;
  sfxMode: OptionalAudioMode;
  finishingAudioAssets: FinishingAudioAsset[];
  audioProduction: AudioProductionContract;
  voiceGainDb: 0;
  editorialCoherenceCheck: ReviewCheck;
  visualComprehensionCheck: ReviewCheck;
  audiovisualSyncCheck: ReviewCheck;
  captionCheck: ReviewCheck;
  musicCheck: ReviewCheck;
  sfxCheck: ReviewCheck;
  truthEvidenceCheck: ReviewCheck;
  brandReviewCheck: ReviewCheck;
  technicalVideoQa: ReviewCheck;
  audioQa: ReviewCheck;
  retentionQa?: RetentionQaRecord;
  issues: ReviewIssue[];
  finalReview: 'pending' | 'pass' | 'revise' | 'reject';
  humanDecision: 'pending' | 'approved' | 'rejected' | 'needs-changes' | 'not-applicable';
  exportHandoffStatus: 'READY' | 'BLOCKED';
  reviewPreview: ReviewPreview;
};

export type ReviewRuntimeInput = {
  review: FinalReviewManifest;
  voicePlan: VoicePlan;
  animation: AnimationManifest;
};
