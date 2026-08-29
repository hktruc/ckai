export type AudioContentMode = 'THINKING' | 'PRACTICAL';
export type NarrationDensity = 'LOW' | 'MEDIUM' | 'HIGH';
export type GateState = 'PENDING' | 'PASS' | 'BLOCKED' | 'NOT_APPLICABLE';

export type NarrationContext = {
  sourcePath: string;
  sha256: string;
  durationSeconds: number;
  density: NarrationDensity;
};

export type AudioSelectionContext = {
  contentId: string;
  contentMode: AudioContentMode;
  narration: NarrationContext;
  semanticIntent: string[];
  emotionalTrajectory: string[];
  preferredFamilies?: string[];
  priorApprovedTrackIds?: string[];
};

export type CanonicalMusicTrack = {
  library_track_id: string;
  track_title: string;
  creator: string;
  provider: string;
  local_file_path: string;
  download_status: string;
  sha256: string;
  license_evidence_path: string;
  track_evidence_path: string;
  content_id_status: string;
  music_family: string;
  melody_presence: string;
  full_bed_suitability: string;
  reflective_fit: number;
  explainer_fit: number;
  tech_fit: number;
  uplift_fit: number;
  emotional_warmth: number;
  voice_friendliness: string;
  density: string;
  pulse: string;
  darkness_1_to_5: number;
  editability: string;
  loopability: string;
  primary_role: string;
};

export type CanonicalMusicLibrary = {
  schema_version: 'CKAI_MUSIC_LIBRARY_V1';
  library_id: 'CKAI_MUSIC_LIBRARY_V1';
  canonical_location: string;
  current_track_count: number;
  downloaded_audio_count: number;
  tracks: CanonicalMusicTrack[];
};

export type MusicCandidate = {
  rank: number;
  trackId: string;
  supportScore: number;
  rationale: string[];
  warnings: string[];
};

export type NarrationAudition = {
  status: 'REQUIRED' | 'PASS' | 'REVISE';
  narrationSha256: string;
  auditionArtifactPath: string | null;
  auditionArtifactSha256: string | null;
  reviewedBy: 'pending' | 'chatgpt-work' | 'product-owner';
  reviewedAt: string | null;
  observation: string | null;
};

export type MusicSelection = {
  state: 'CANDIDATES_PENDING' | 'TRACK_APPROVED' | 'INTENTIONAL_SILENCE';
  candidates: MusicCandidate[];
  selectedTrackId: string | null;
  selectionRationale: string | null;
  audition: NarrationAudition;
};

export type MusicBedSegment = {
  startSeconds: number;
  endSeconds: number;
  behavior: 'BASE' | 'ATTENUATE' | 'SILENCE';
  gainDeltaDb: number;
  semanticPurpose: string;
};

export type MusicBedPlan = {
  mode: 'PENDING_SELECTION' | 'CONTINUOUS_FULL_BED' | 'INTENTIONAL_SILENCE';
  segments: MusicBedSegment[];
  voicePriority: true;
  arbitraryAutomationAllowed: false;
};

export type SemanticSfxEventType = 'REVEAL' | 'MEANINGFUL_TRANSITION' | 'CONFIRMATION' | 'IMPACT' | 'INTERFACE_ACTION' | 'STRUCTURAL_EMPHASIS';
export type SemanticSfxEvent = {
  id: string;
  eventType: SemanticSfxEventType;
  sceneId: string;
  atSeconds: number;
  semanticPurpose: string;
  assetId: string | null;
};

export type SemanticSfxPlan = {
  state: 'DECISION_PENDING' | 'NO_SFX' | 'CANDIDATES_PENDING' | 'APPROVED';
  events: SemanticSfxEvent[];
  rationale: string;
};

export type AudioProductionContract = {
  schemaVersion: 'CKAI_AUDIO_PRODUCTION_V1';
  contentId: string;
  contentMode: AudioContentMode;
  authority: {
    audioDirection: 'engine/audio-direction-v1.md';
    masteringPolicy: 'engine/short-form-mastering-policy.md';
    musicRegistry: 'content/references/audio/music-library-v1/03_catalog/music-library.json';
  };
  automationBoundary: {
    candidateRanking: 'AUTOMATABLE';
    bedMechanics: 'ASSISTED';
    semanticSfx: 'ASSISTED';
    technicalMastering: 'AUTOMATABLE';
    perceptualApproval: 'HUMAN_GATED';
  };
  narration: NarrationContext;
  semanticIntent: string[];
  emotionalTrajectory: string[];
  music: MusicSelection;
  bed: MusicBedPlan;
  sfx: SemanticSfxPlan;
  mix: {
    policyId: 'CKAI_SHORT_FORM_MASTERING_V1';
    renderState: 'NOT_RENDERED' | 'RENDERED';
    technicalQa: GateState;
  };
  qa: {
    provenance: GateState;
    narrationContextAudition: GateState;
    phoneSpeakerTechnicalProxy: GateState;
    phoneSpeakerHumanListening: GateState;
    perceptualMixReview: GateState;
  };
  humanCreativeApproval: {
    state: 'PENDING' | 'APPROVED' | 'REVISE';
    by: 'pending' | 'chatgpt-work' | 'product-owner';
    at: string | null;
    basis: string | null;
  };
};
