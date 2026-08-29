import type {SceneRole,SemanticObjectType,SourceType} from './representation';

export const EMBODIMENT_LEVELS=['LEVEL_1_REAL_SOURCE','LEVEL_2_RECOGNIZABLE_MATERIAL','LEVEL_3_SEMANTIC_DIAGRAMMATIC','LEVEL_4_ABSTRACT_NODE'] as const;
export type EmbodimentLevel=typeof EMBODIMENT_LEVELS[number];
export const EMBODIMENT_MATERIALS=['SOURCE_FRAGMENT','PROPOSITION_FRAGMENT','STABLE_ANCHOR','DERIVED_TRAIL','BRANCH_CANDIDATE','NEGATIVE_SPACE_GAP','OUTCOME_MARKER','VARIABLE_CONTROL','STABILITY_FIELD','INTERACTIVE_GATE','EARNED_CONCLUSION','TERMINAL_PRINCIPLE','ABSTRACT_NODE'] as const;
export type EmbodimentMaterial=typeof EMBODIMENT_MATERIALS[number];
export const IDENTITY_CHANNELS=['MORPHOLOGY','BEHAVIOR','SPATIAL_ROLE','RELATIONSHIP','SOURCE_PROVENANCE','LINEAGE','LIFECYCLE','TEXT_CONFIRMATION','STABILITY'] as const;
export type IdentityChannel=typeof IDENTITY_CHANNELS[number];
export type IdentityLifecycleStage='ESTABLISH'|'ACT'|'REACT'|'TRANSFORM'|'SETTLE'|'RESOLVE'|'EXIT';
export type IdentityTransitionKind='SAME_OBJECT_STATE_CHANGE'|'OBJECT_REPLACEMENT'|'DERIVED_OBJECT_CREATION';
export type ObjectLineage={derived_from:string[];transformed_from:string|null;preserves_identity:boolean};
export type IdentityRealizationProfile={
  morphology_variant:'BASE'|'ROLE_REINFORCED';
  establishment_emphasis:'STANDARD'|'REINFORCED';
  relationship_attachment:'STANDARD'|'EXPLICIT';
  lineage_visibility:'STANDARD'|'REINFORCED';
  label_dependency:'STANDARD'|'REDUCED';
  repair_claims_viewer_facing_change:boolean;
  repair_reason:string|null;
};
export type SemanticSignature={
  semantic_role:SemanticObjectType;
  embodiment_level:EmbodimentLevel;
  morphology:string;
  spatial_role:string;
  motion_behavior:string;
  relationship_behavior:string;
  lifecycle:IdentityLifecycleStage[];
  stability:'GROUNDED'|'PROVISIONAL'|'UNRESOLVED'|'VARIABLE'|'EARNED';
  source_affordance:string;
  lineage:ObjectLineage;
  text_dependency:'NONE'|'LOW'|'MEDIUM'|'HIGH';
  identity_channels:IdentityChannel[];
  transition_kind:IdentityTransitionKind;
};
export type EmbodimentDecision={
  semantic_role:SemanticObjectType;
  selected_level:EmbodimentLevel;
  selected_material:EmbodimentMaterial;
  identity_channels:IdentityChannel[];
  selection_reason:string;
  rejected_alternatives:Array<{level:EmbodimentLevel;material:EmbodimentMaterial;reason:string}>;
  capability_match:'PASS'|'FAIL';
  abstraction_risk:'LOW'|'MEDIUM'|'HIGH';
  scene_role:SceneRole;
  source_type:SourceType;
  realization_profile:IdentityRealizationProfile;
};
export type EmbodimentPlan={version:1;scene_id:string;decisions:Record<string,EmbodimentDecision>;signatures:Record<string,SemanticSignature>;establish_before_act:boolean;abstract_node_budget:{anonymous_count:number;distinct_roles_using_abstract_node:number;verdict:'PASS'|'FAIL'};compile_failures:string[];repair:{pass:0|1;diagnosis:string[]}};
