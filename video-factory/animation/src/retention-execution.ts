import type {Scene} from './model';

export const RETENTION_BEAT_PURPOSES = ['ESTABLISH','HOOK','FOCUS','QUESTION','REVEAL','CONTRAST','PROOF','TRANSFORM','PAYOFF','BRIDGE','BREATHE'] as const;
export type RetentionBeatPurpose = typeof RETENTION_BEAT_PURPOSES[number];
export type MotionPurposeV2 = 'FOCUS'|'REVEAL'|'ESCALATE'|'CONNECT'|'BREAK'|'TRANSFORM'|'RESET'|'BREATHE';
export type ProgressionKind = 'MEANING'|'EXPECTATION'|'FOCAL_RELATIONSHIP'|'PROOF'|'UNCERTAINTY'|'CONTRAST'|'OPEN_LOOP'|'PAYOFF';
export type PerceptualChangeLevel = 1|2|3;
export type PerceptualDimension = 'VISUAL_STATE'|'SEMANTIC_MEANING'|'FOCAL_ATTENTION'|'EXPECTATION'|'PROOF'|'CONTRADICTION'|'PAYOFF';
export type PauseJustification = 'TENSION'|'COMPREHENSION'|'REVEAL'|'PROOF_READING'|'PAYOFF_LANDING'|'EMOTIONAL_BREATH';

export type RetentionExecutionBeat = {
  beat_id: string;
  start: number;
  end: number;
  purpose: RetentionBeatPurpose;
  semantic_event: string;
  visual_state: string;
  visual_state_change: string;
  motion_purpose: MotionPurposeV2;
  required_progression: ProgressionKind;
  perceptual_target: {
    minimum_change_level: PerceptualChangeLevel;
    dimensions: PerceptualDimension[];
    dominant_state_key: string;
  };
};

export type RetentionExecutionContract = {
  version: 1;
  scene_id: string;
  duration_target: number;
  beats: RetentionExecutionBeat[];
  pause_budget: {max_unmotivated_pause: number; justified_pauses: Array<{start:number;end:number;justification:PauseJustification;basis:string}>};
  exit_condition: string;
};

export const SEMANTIC_MECHANISM_FAMILIES = ['causal_chain','missing_causal_link','hypothesis_branching','evidence_accumulation','fact_vs_inference','contradiction','comparison','before_after','timeline','filtering','elimination','convergence','divergence','hierarchy','confidence_uncertainty','incomplete_chain','hidden_variable_reveal','state_transition'] as const;
export type SemanticMechanismFamily = typeof SEMANTIC_MECHANISM_FAMILIES[number];
export type SemanticMechanismPlan = {
  version: 1;
  scene_id: string;
  family: SemanticMechanismFamily;
  viewer_question: string;
  entities: string[];
  relationships: string[];
  initial_state: string;
  transformation: string;
  final_state: string;
  insight_revealed: string;
  typography_first: boolean;
  typography_exception_basis: string | null;
};

const close=(a:number,b:number)=>Math.abs(a-b)<=.002;

export const validateRetentionExecution = (scene: Scene): string[] => {
  const contract=scene.retentionExecution; if(!contract)return ['RETENTION_PLAN_EXECUTION_MISMATCH: retention execution contract is missing'];
  const duration=scene.endSeconds-scene.startSeconds; const errors:string[]=[];
  if(contract.scene_id!==scene.id||!close(contract.duration_target,duration))errors.push('RETENTION_PLAN_EXECUTION_MISMATCH: scene identity/duration is stale');
  if(!contract.beats.length||!close(contract.beats[0]!.start,0)||!close(contract.beats.at(-1)!.end,duration))errors.push('RETENTION_PLAN_EXECUTION_MISMATCH: beats must cover the complete scene');
  contract.beats.forEach((beat,index)=>{
    if(beat.end<=beat.start||beat.start<0||beat.end>duration+.002)errors.push(`RETENTION_PLAN_EXECUTION_MISMATCH: ${beat.beat_id} timing is invalid`);
    if(index&& !close(contract.beats[index-1]!.end,beat.start))errors.push(`RETENTION_PLAN_EXECUTION_MISMATCH: ${beat.beat_id} is not contiguous`);
    if(!beat.semantic_event.trim()||!beat.visual_state.trim()||!beat.visual_state_change.trim())errors.push(`MISSING_SEMANTIC_TRANSFORMATION: ${beat.beat_id} lacks an inspectable state change`);
    if(!beat.perceptual_target||beat.perceptual_target.minimum_change_level<2||!beat.perceptual_target.dimensions.length||!beat.perceptual_target.dominant_state_key.trim())errors.push(`BEAT_EXECUTED_BUT_NOT_PERCEPTUALLY_DISTINCT: ${beat.beat_id} lacks a Level 2/3 perceptual target`);
    const span=beat.end-beat.start;if(span>4&&!contract.pause_budget.justified_pauses.some((pause)=>pause.start<=beat.start+.01&&pause.end>=beat.end-.01))errors.push(`COSMETIC_MOTION_ONLY: ${beat.beat_id} holds one semantic state for ${span.toFixed(2)}s`);
  });
  return errors;
};

export const validateSemanticMechanism = (scene: Scene): string[] => {
  if(scene.hybridSource?.choice!=='CODE_NATIVE')return [];
  const mechanism=scene.semanticMechanism; if(!mechanism)return ['CODE_NATIVE_NOT_EXPRESSIVE_ENOUGH: semantic mechanism is missing'];
  const errors:string[]=[];
  if(!mechanism.entities.length||!mechanism.relationships.length)errors.push('GENERIC_PRIMITIVE_FALLBACK: entities and relationships are not encoded');
  if(!mechanism.initial_state.trim()||!mechanism.transformation.trim()||!mechanism.final_state.trim())errors.push('MISSING_SEMANTIC_TRANSFORMATION: STATE A → semantic event → STATE B is incomplete');
  if(mechanism.typography_first&&!mechanism.typography_exception_basis?.trim())errors.push('SPOKEN_COPY_AS_DISPLAY_COPY_FALLBACK: typography-first requires an editorial basis');
  if(!mechanism.typography_first&&scene.displayCopy&&mechanism.entities.join(' ').replace(/\s+/gu,' ').trim()===scene.displayCopy.replace(/\s+/gu,' ').trim())errors.push('TEXT_DEPENDENT_VISUAL_FAILURE: mechanism collapses to Display Copy');
  return errors;
};
