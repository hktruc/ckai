import type {ProcessEventType,SceneRole} from './representation';

export const SEMANTIC_MOTION_PRIMITIVES=['INTRODUCE','CONNECT','DISCONNECT','BREAK','BRANCH','FILTER','VERIFY','QUESTION','DESTABILIZE','REJECT','COLLAPSE','REVEAL','FOCUS','MERGE','CONVERGE','TRANSFORM','RESOLVE'] as const;
export type SemanticMotionPrimitive=typeof SEMANTIC_MOTION_PRIMITIVES[number];
export const SPATIAL_PRIMITIVES=['FIELD','REGION','LANE','PATH','BRANCH','GAP','BRIDGE','GATE','ANCHOR','CLUSTER','SOURCE_VIEWPORT','CONVERGENCE_TARGET','OUTSIDE_FIELD'] as const;
export type SpatialPrimitive=typeof SPATIAL_PRIMITIVES[number];
export type SpatialDeltaLevel='MICRO'|'LOCAL'|'STRUCTURAL';
export type RenderMode='PRODUCTION'|'DIAGNOSTIC';
export type FailureOrigin='PLAN'|'CAPABILITY'|'REALIZATION'|'TIMING'|'QA_MISMATCH'|'EVIDENCE_CAMERA'|'WHOLE_VIDEO_REPETITION';

export type TopologyRegion={id:string;type:SpatialPrimitive;semantic_role:string;members:string[]};
export type TopologyPath={id:string;from:string;to:string;semantic_role:string;state:'POSSIBLE'|'ACTIVE'|'BROKEN'|'VERIFIED'|'REJECTED'};
export type TopologyState={active_objects:string[];active_relationships:string[];regions:TopologyRegion[];paths:TopologyPath[];gaps:string[];anchors:string[];focal_object:string};
export type GeometryPoint={x:number;y:number};
export type SpatialGeometry={object_positions:Record<string,GeometryPoint>;region_bounds:Record<string,{x:number;y:number;width:number;height:number}>;safe_zone:{top:number;right:number;bottom:number;left:number};caption_zone:{top:number;bottom:number};silhouette:'CENTRAL_CLUSTER'|'WIDE_BRANCH'|'VERTICAL_FLOW'|'FULL_SOURCE_VIEWPORT'|'SPLIT_FIELD'|'CONVERGENCE'};
export type IntendedRealization={topology_delta:string;spatial_delta:SpatialDeltaLevel;silhouette_delta:string;relationship_delta:string;focal_hierarchy_delta:string;object_state_delta:string;viewer_should_notice:string};
export type MotionTrajectory={origin:string;path_intent:string;interaction:string;destination:string;settle_state:string};
export type SpokenAnchor={phrase:string;event:string;relation:'BEFORE'|'ON'|'AFTER';at_seconds:number};
export type SemanticMotionEvent={event_id:string;event_type:ProcessEventType|SemanticMotionPrimitive;at:number;role:SceneRole;intended_realization:IntendedRealization;trajectory:MotionTrajectory;motion_causality:{trigger:string;primary_event:string;resulting_events:string[]};spoken_anchor:SpokenAnchor;settle:{duration_seconds:number;comprehension_seconds:number};idle_motion:false};
export type EvidenceCameraMove={from:string;to:string;spoken_anchor:SpokenAnchor;semantic_reason:string;focus_action:'BRACKET'|'UNDERLINE'|'CONTEXT_DIM'|'POINTER'|'TRACE'|'VIEWPORT_CHANGE';settle_duration:number};
export type EvidenceCameraPlan={source_asset_id:string;establish:{viewport:string;purpose:string;context_visibility:number};moves:EvidenceCameraMove[];exit:{payload_complete_at:string;next_semantic_state:string}};
export type MotionAnatomy={entry_pattern:string;trajectory_pattern:string;interaction_pattern:string;settle_pattern:string};
export type SpatialMotionPlan={version:1;scene_id:string;render_mode:RenderMode;topology:TopologyState;geometry:SpatialGeometry;events:SemanticMotionEvent[];focal_hierarchy:{primary:string;secondary:string[];suppressed:string[]};dominant_visual_question:string;density:{object_count:number;relationship_count:number;simultaneous_labels:number;occupied_area:number};motion_anatomy:MotionAnatomy;camera_plan?:EvidenceCameraPlan;repair:{pass:0|1;displacement_multiplier:number;topology_emphasis:number;settle_multiplier:number;camera_travel_multiplier:number;diagnosis:string[]};compile_failures:string[]};
