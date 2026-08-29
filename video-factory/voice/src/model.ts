import type {AnimationManifest} from '../../animation/src/model';

export type VoiceMode = 'production' | 'reverse-audit-proof';
export type VoiceQualityTier = 'technical-preview' | 'production-candidate';
export type CheckState = 'pending' | 'PASS' | 'BLOCKED' | 'REVISE';
export type VoiceProviderId = 'vbee' | 'piper';
export type VoiceSelectionStatus = 'candidate' | 'auditioned' | 'selected' | 'production-approved' | 'approved-for-proof';

export type VoiceRegistryEntry = {
  alias: string;
  provider: VoiceProviderId;
  voiceCode?: string;
  displayName?: string;
  languageCode?: string;
  gender: 'male' | 'female' | 'unknown';
  qualityTier: VoiceQualityTier;
  selectionStatus: VoiceSelectionStatus;
  speakerId?: number;
  modelPathEnv?: string;
  license?: string;
  providerMetadata?: {
    voiceOwnership?: 'VBEE' | 'COMMUNITY' | 'PERSONAL';
    demoUrl?: string;
    creditFactor?: number;
    realtimeCompatible?: boolean;
  };
  productionAllowed: boolean;
  productionApprovedMapping?: boolean;
  voiceSelectionCheck?: 'PASS' | 'BLOCKED';
  defaultFor?: 'ckai-production-narration';
};

export type VoiceSegment = {
  id: string;
  sceneId: string;
  speakerAlias: string;
  originalText: string;
  synthesisText: string;
  pronunciationTerms: string[];
  speed: number;
  slotStartSeconds: number;
  slotEndSeconds: number;
  requiredEndSeconds?: number;
  requiredProofCaveatIds: string[];
  cacheKey: string;
  generatedAudioPath: string;
  measuredDurationSeconds?: number;
  fitDeltaSeconds?: number;
  fitStatus: CheckState;
  providerMetadata?: SynthResult;
};

export type VoicePlan = {
  id: string;
  contentId: string;
  inputEligibility: 'production' | 'legacy-approved-reverse-audit';
  sourceAnimationArtifact: string;
  sourceAnimationArtifactSha256: string;
  sourceAnimationManifest: string;
  sourceAnimationManifestSha256: string;
  sourceAnimationVoiceHandoffSha256: string;
  sourceScript: string;
  preferredProvider: 'vbee';
  useExistingQuota: true;
  autoPurchaseExtraCredits: false;
  paidFallbackRequiresProductOwnerApproval: true;
  voiceSelection: {
    candidateAliases: string[];
    auditionedAliases: string[];
    selectedAliases: string[];
    productionApprovedMapping: boolean;
  };
  voiceSelectionCheck: CheckState;
  segments: VoiceSegment[];
  providerInputCheck: CheckState;
  segmentsGeneratedCheck: CheckState;
  audioTechnicalQa: CheckState;
  timingFitCheck: CheckState;
  pronunciationCheck: CheckState;
  proofCaveatCheck: CheckState;
  voiceReview: 'pending' | 'pass' | 'revise' | 'reject';
  humanDecision: 'pending' | 'approved' | 'rejected' | 'needs-changes' | 'not-applicable';
  unresolvedBlockers: string[];
  finalReviewInputStatus: 'READY' | 'BLOCKED';
  /** Legacy data only; ignored by every authority gate. */
  finalReviewExportHandoffStatus?: 'READY' | 'BLOCKED';
  assembledAudioPath: string;
  previewPath: string;
  previewMediaQa?: {
    sha256: string;
    codec: string;
    sampleRate: number;
    channels: number;
    meanVolumeDb: number;
    maxVolumeDb: number;
    zeroDbSampleRatio: number;
  };
};

export type VoiceRuntimeInput = {plan: VoicePlan; animation: AnimationManifest};

export type SynthRequest = {
  segment: VoiceSegment;
  voice: VoiceRegistryEntry;
  outputPath: string;
  allowQuotaConsumption: boolean;
};

export type SynthResult = {
  provider: VoiceProviderId;
  voiceCode: string;
  outputPath: string;
  characters: number;
  requestId?: string;
  cacheHit: boolean;
};

export interface VoiceProvider {
  id: VoiceProviderId;
  synthesize(request: SynthRequest): Promise<SynthResult>;
}
