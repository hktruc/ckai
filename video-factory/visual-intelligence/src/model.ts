export const RETENTION_ROLES = ['HOOK', 'CURIOSITY', 'CONTEXT', 'CONTRAST', 'PROOF', 'ESCALATION', 'REVEAL', 'PAYOFF', 'BREATH'] as const;
export type RetentionRole = typeof RETENTION_ROLES[number];

export const MOTION_PURPOSES = ['FOCUS', 'REVEAL', 'ESCALATE', 'CONNECT', 'BREAK', 'TRANSFORM', 'RESET', 'BREATHE'] as const;
export type MotionPurpose = typeof MOTION_PURPOSES[number];

export type VisualSource = 'CODE_NATIVE' | 'REAL_EVIDENCE' | 'GENERATED_KEY_VISUAL';
export type FailureClass =
  | 'GENERATION_EXECUTION_FAILURE'
  | 'SEMANTIC_ASSET_MISMATCH'
  | 'WRONG_VISUAL_SOURCE'
  | 'RETENTION_DEAD_ZONE'
  | 'SCRIPT_NOT_VISUALIZABLE'
  | 'FAKE_OR_PSEUDO_EVIDENCE'
  | 'COMPOSED_FRAME_FAILURE'
  | 'VIDEO_RETENTION_FAILURE';

export type SceneSemanticPlan = {
  scene_id: string;
  spoken_meaning: string;
  semantic_core: string;
  viewer_should_see: string;
  retention_role: RetentionRole;
  must_show: string[];
  must_not_show: string[];
};

export type RetentionDirectorPlan = {
  hook: {scene_id: string; tension: string; promise: string};
  open_loops: Array<{id: string; opened_scene: string; question: string; closed_scene: string}>;
  semantic_beats: Array<{scene_id: string; beat: string; reason_to_continue: string}>;
  pattern_interrupts: Array<{scene_id: string; kind: string; purpose: string}>;
  intensity_curve: Array<{scene_id: string; intensity: 'HIGH' | 'MEDIUM' | 'BREAK' | 'BREATHE'; rationale: string}>;
  payoff: {scene_id: string; closure: string};
  dead_zone_risks: Array<{scene_id: string; reason: string}>;
};

export type VisualSourceDecision = {
  scene_id: string;
  visual_source: VisualSource;
  source_reason: string;
  evidence_required: boolean;
  generation_allowed: boolean;
};

export type KeyVisualBriefV1 = {
  scene_id: string;
  semantic_core: string;
  viewer_should_see: string;
  primary_visual_idea: string;
  must_show: string[];
  must_not_show: string[];
  composition: {focal_subject: string; subject_position: string; foreground: string; background: string; negative_space: string};
  visual_magnetism: {tension: string; contrast: string; reveal_potential: string; depth: string; focal_strength: string};
  motion_headroom: {push_in: boolean; pan: boolean; parallax: boolean; mask_reveal: boolean; typography_space: string};
  style: {dna: 'CKAI_DARK_PREMIUM_EDITORIAL_V1'; mood: string; realism: string; texture: string};
  output_fit: {target: '9:16'; crop_tolerance: string; safe_zone: string};
};

export type SemanticVisionQa = {
  interpretation: string;
  semantic_relevance: number;
  semantic_specificity: number;
  factual_integrity: 'PASS' | 'FAIL';
  visual_magnetism: number;
  motion_potential: number;
  ckai_dna_fit: number;
  video_usability: number;
  verdict: 'PASS' | 'RETRY' | 'REJECT';
  failure_reasons: string[];
  revision_instructions: string[];
  failure_class: FailureClass | null;
  recommended_return_layer: string | null;
};

export type GeneratedAssetMetadata = {
  asset_id: string;
  content_id: string;
  scene_id: string;
  asset_type: 'GENERATED_KEY_VISUAL';
  provider: 'openai';
  model: string;
  created_at: string;
  brief_version: string;
  prompt_version: string;
  sha256: string;
  attempt: number;
  usage: Record<string, unknown>;
  estimated_cost_usd: number | null;
  semantic_qa: SemanticVisionQa;
  retention_qa: Record<string, unknown>;
  qa_status: 'PASS' | 'RETRY' | 'REJECT';
  evidence: false;
  source_path: string;
  generation_prompt_sha256: string;
  brief_sha256: string;
};

export type VisualIntelligenceArtifact = {
  version: 1;
  content_id: string;
  created_at: string;
  semantic_plan: SceneSemanticPlan[];
  retention_plan: RetentionDirectorPlan;
  retention_execution: import('../../animation/src/retention-execution').RetentionExecutionContract[];
  semantic_mechanisms: import('../../animation/src/retention-execution').SemanticMechanismPlan[];
  source_routes: VisualSourceDecision[];
  key_visual_briefs: KeyVisualBriefV1[];
  generated_assets: GeneratedAssetMetadata[];
  machine_acceptance: 'PASS' | 'NOT_YET_PASS';
  human_acceptance: 'PENDING';
};
