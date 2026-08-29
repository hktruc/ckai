import type { AnimationManifest } from "../../animation/src/model";
import type {
  FailureOrigin,
  SpatialDeltaLevel,
} from "../../animation/src/spatial-motion";
import type { PerceptualProgressionQa } from "./perceptual-qa";
import { diagnoseFailureOrigin, repairSpatialMotion } from "./spatial-motion";

export const MOTION_SPATIAL_FAILURE_CLASSES = [
  "SEMANTIC_MOTION_NOT_REALIZED",
  "BREAK_NOT_STRUCTURALLY_REALIZED",
  "TOPOLOGY_CHANGE_NOT_PERCEPTIBLE",
  "SPATIAL_EVENT_TOO_WEAK",
  "SPATIAL_CHANGE_SEMANTICALLY_UNJUSTIFIED",
  "TRAJECTORY_SEMANTIC_MISMATCH",
  "SETTLE_STATE_NOT_READABLE",
  "COMPREHENSION_WINDOW_INSUFFICIENT",
  "MOTION_CAUSALITY_UNCLEAR",
  "GENERIC_MOTION_ANATOMY_REUSE",
  "GENERIC_CENTERED_COMPOSITION_REUSE",
  "RELATIONSHIP_SPATIAL_LEGIBILITY_FAILURE",
  "FOCAL_HIERARCHY_UNCLEAR",
  "SPATIAL_DENSITY_OVERLOAD",
  "CARDLESS_CARD_LAYOUT",
  "SOURCE_VIEWPORT_NOT_TRAVERSING",
  "PAYOFF_SPATIAL_COMPLEXITY_NOT_REDUCED",
  "PLAN_DESCRIPTION_COMPENSATING_FOR_VISUAL",
  "DIAGNOSTIC_OVERLAY_LEAKED_TO_PRODUCTION",
  "EVIDENCE_CAMERA_MOVE_WITHOUT_SEMANTIC_PURPOSE",
  "EVIDENCE_FOCAL_REGION_UNCLEAR",
  "EVIDENCE_ZOOM_CONTEXT_BREAK",
  "EVIDENCE_SPATIAL_ORIENTATION_LOST",
  "ANNOTATION_COVERS_EVIDENCE",
  "EVIDENCE_REGION_SEQUENCE_MISMATCH",
  "EVIDENCE_LIMITATION_NOT_DIRECTED",
  "EVIDENCE_CAMERA_OUT_OF_SYNC_WITH_SPOKEN_BEAT",
  "EVIDENCE_PAYLOAD_COMPLETE_BUT_VIEWPORT_LINGERS",
  "HOOK_EVENT_NOT_PERCEPTUALLY_REALIZED",
  "HOOK_BODY_MOTION_FALLBACK",
  "PAYOFF_RESOLUTION_NOT_PERCEPTUALLY_REALIZED",
] as const;
export type MotionSpatialFailureClass =
  (typeof MOTION_SPATIAL_FAILURE_CLASSES)[number];
export type EventRealization = {
  event_id: string;
  event_type: string;
  planned: {
    topology_change: string;
    spatial_change: SpatialDeltaLevel;
    relationship_change: string;
    focal_change: string;
    object_state_change: string;
    viewer_should_notice: string;
  };
  executed: { renderer_event_present: boolean };
  observed: {
    topology_change: number;
    spatial_change: number;
    relationship_change: number;
    focal_change: number;
    object_state_change: number;
    semantic_readability: number;
  };
  verdict: "PASS" | "FAIL";
  failure_origin: FailureOrigin;
};
export type MotionSpatialSceneQa = {
  scene_id: string;
  render_mode: string;
  production_cleanliness: "PASS" | "FAIL";
  motion_realization: "PASS" | "FAIL";
  spatial_realization: "PASS" | "FAIL";
  topology_realization: "PASS" | "FAIL";
  events: EventRealization[];
  failures: MotionSpatialFailureClass[];
  origins: Array<{
    failure_class: MotionSpatialFailureClass;
    origin: FailureOrigin;
    repair_layer: string;
  }>;
};
export type MotionSpatialQa = {
  version: 1;
  actual_binary: true;
  verdict: "PASS" | "FAIL";
  production_cleanliness: "PASS" | "FAIL";
  scenes: MotionSpatialSceneQa[];
  spatial_rhythm: string[];
  silhouette_variety: string[];
  motion_anatomy_sequence: string[];
  failures: MotionSpatialFailureClass[];
};
const repairLayer = (origin: FailureOrigin) =>
  origin === "PLAN"
    ? "Representation / Process Planner"
    : origin === "CAPABILITY"
      ? "Renderer Capability / alternate renderer"
      : origin === "TIMING"
        ? "Retention / timeline / spoken-anchor binding"
        : origin === "EVIDENCE_CAMERA"
          ? "Evidence Viewport Director"
          : origin === "WHOLE_VIDEO_REPETITION"
            ? "Whole-video Motion/Spatial Director"
            : "Motion + Spatial Realization Engine";
const unique = <T>(values: T[]) => [...new Set(values)];
export const evaluateMotionSpatialQa = (
  manifest: AnimationManifest,
  perceptual: PerceptualProgressionQa,
): MotionSpatialQa => {
  const scenes = manifest.scenes.map((scene, index) => {
    const representation = scene.representationPlan,
      plan = representation?.spatial_motion,
      pixel = perceptual.scenes.find((item) => item.scene_id === scene.id),
      observed = pixel?.motion_spatial;
    const failures: MotionSpatialFailureClass[] = [];
    if (!plan || plan.compile_failures.length)
      failures.push("SEMANTIC_MOTION_NOT_REALIZED");
    const fallback = {
      topology_change: 0,
      spatial_change: 0,
      relationship_change: 0,
      focal_change: 0,
      object_state_change: 0,
      semantic_readability: 0,
      centered_composition: true,
      cardless_card: true,
      generic_motion_anatomy: true,
      source_viewport_traversed: false,
      source_orientation_preserved: false,
      limitation_directed: false,
      payoff_complexity_reduced: false,
      diagnostic_overlay_text: [] as string[],
      motion_summary: "No structured motion/spatial observation.",
    };
    const vision = observed ?? fallback;
    const events = (plan?.events ?? []).map((event) => {
      const structural =
        event.intended_realization.spatial_delta === "STRUCTURAL";
      const score = Math.max(
        vision.topology_change,
        vision.spatial_change,
        vision.relationship_change,
        vision.object_state_change,
      );
      const pass =
        score >= (structural ? 6 : 5) && vision.semantic_readability >= 5;
      return {
        event_id: event.event_id,
        event_type: event.event_type,
        planned: {
          topology_change: event.intended_realization.topology_delta,
          spatial_change: event.intended_realization.spatial_delta,
          relationship_change: event.intended_realization.relationship_delta,
          focal_change: event.intended_realization.focal_hierarchy_delta,
          object_state_change: event.intended_realization.object_state_delta,
          viewer_should_notice: event.intended_realization.viewer_should_notice,
        },
        executed: { renderer_event_present: true },
        observed: {
          topology_change: vision.topology_change,
          spatial_change: vision.spatial_change,
          relationship_change: vision.relationship_change,
          focal_change: vision.focal_change,
          object_state_change: vision.object_state_change,
          semantic_readability: vision.semantic_readability,
        },
        verdict: pass ? ("PASS" as const) : ("FAIL" as const),
        failure_origin: pass
          ? ("QA_MISMATCH" as const)
          : ("REALIZATION" as const),
      };
    });
    if (events.some((event) => event.verdict === "FAIL"))
      failures.push("SEMANTIC_MOTION_NOT_REALIZED");
    if (
      events.some(
        (event) =>
          event.planned.spatial_change === "STRUCTURAL" &&
          event.observed.topology_change < 6,
      )
    )
      failures.push("TOPOLOGY_CHANGE_NOT_PERCEPTIBLE");
    if (
      events.some(
        (event) =>
          event.planned.spatial_change !== "MICRO" &&
          event.observed.spatial_change < 5,
      )
    )
      failures.push("SPATIAL_EVENT_TOO_WEAK");
    if (
      plan?.events.some((event) => event.event_type === "BREAK") &&
      vision.relationship_change < 6
    )
      failures.push("BREAK_NOT_STRUCTURALLY_REALIZED");
    if (
      (plan?.topology.active_relationships.length ?? 0) > 0 &&
      vision.relationship_change < 5
    )
      failures.push("RELATIONSHIP_SPATIAL_LEGIBILITY_FAILURE");
    if (vision.focal_change < 4) failures.push("FOCAL_HIERARCHY_UNCLEAR");
    if (
      (plan?.density.occupied_area ?? 0) > 0.78 &&
      (plan?.density.simultaneous_labels ?? 0) > 1 &&
      vision.semantic_readability < 6
    )
      failures.push("SPATIAL_DENSITY_OVERLOAD");
    if (vision.cardless_card) failures.push("CARDLESS_CARD_LAYOUT");
    if (vision.generic_motion_anatomy)
      failures.push("GENERIC_MOTION_ANATOMY_REUSE");
    if (
      vision.centered_composition &&
      index > 0 &&
      index < manifest.scenes.length - 1
    )
      failures.push("GENERIC_CENTERED_COMPOSITION_REUSE");
    if ((pixel?.long_same_state_seconds ?? 0) > 3)
      failures.push("SETTLE_STATE_NOT_READABLE");
    if (
      pixel?.beats.some((beat) =>
        beat.failure_reasons.some((reason) =>
          /too fast|insufficient|not readable/i.test(reason),
        ),
      )
    )
      failures.push("COMPREHENSION_WINDOW_INSUFFICIENT");
    if (representation?.retention_role === "HOOK" && !pixel?.hook_strong_event)
      failures.push("HOOK_EVENT_NOT_PERCEPTUALLY_REALIZED");
    if (
      representation?.retention_role === "PAYOFF" &&
      !vision.payoff_complexity_reduced
    )
      failures.push(
        "PAYOFF_SPATIAL_COMPLEXITY_NOT_REDUCED",
        "PAYOFF_RESOLUTION_NOT_PERCEPTUALLY_REALIZED",
      );
    if (plan?.camera_plan) {
      if (
        !vision.source_viewport_traversed &&
        plan.camera_plan.moves.length > 1
      )
        failures.push("SOURCE_VIEWPORT_NOT_TRAVERSING");
      if (!vision.source_orientation_preserved)
        failures.push("EVIDENCE_SPATIAL_ORIENTATION_LOST");
      if (!vision.limitation_directed)
        failures.push("EVIDENCE_LIMITATION_NOT_DIRECTED");
      if (!pixel?.evidence_payload_complete_at_beat)
        failures.push("EVIDENCE_FOCAL_REGION_UNCLEAR");
      if (pixel?.post_information_linger)
        failures.push("EVIDENCE_PAYLOAD_COMPLETE_BUT_VIEWPORT_LINGERS");
    }
    const diagnosticPattern =
      /CausalRelationshipRenderer|FilterClassificationRenderer|HypothesisBranchRenderer|ConfidenceStateRenderer|EvidenceNativeRenderer|ConvergenceTransformationRenderer|TRANSFORMATION STATE CHANGE|HYPOTHESIS BRANCHING|PROCESS EVENT|TOPOLOGY LABEL|OBJECT ID|INTERNAL NOTE/i;
    const diagnosticTerms = vision.diagnostic_overlay_text.filter((term) =>
      diagnosticPattern.test(term),
    );
    if (
      plan?.render_mode !== "PRODUCTION" ||
      diagnosticTerms.length ||
      diagnosticPattern.test(pixel?.summary ?? "")
    )
      failures.push("DIAGNOSTIC_OVERLAY_LEAKED_TO_PRODUCTION");
    if (
      /description|caption explains|internal note/i.test(
        vision.motion_summary,
      ) &&
      vision.semantic_readability < 6
    )
      failures.push("PLAN_DESCRIPTION_COMPENSATING_FOR_VISUAL");
    const clean = failures.includes("DIAGNOSTIC_OVERLAY_LEAKED_TO_PRODUCTION")
      ? ("FAIL" as const)
      : ("PASS" as const);
    const origins = unique(failures).map((failure_class) => {
      const origin = diagnoseFailureOrigin(failure_class);
      return { failure_class, origin, repair_layer: repairLayer(origin) };
    });
    return {
      scene_id: scene.id,
      render_mode: plan?.render_mode ?? "MISSING",
      production_cleanliness: clean,
      motion_realization: failures.includes("SEMANTIC_MOTION_NOT_REALIZED")
        ? ("FAIL" as const)
        : ("PASS" as const),
      spatial_realization: failures.some((failure) =>
        /SPATIAL|CENTERED|CARDLESS|FOCAL|DENSITY/.test(failure),
      )
        ? ("FAIL" as const)
        : ("PASS" as const),
      topology_realization: failures.some((failure) =>
        /TOPOLOGY|BREAK|RELATIONSHIP/.test(failure),
      )
        ? ("FAIL" as const)
        : ("PASS" as const),
      events,
      failures: unique(failures),
      origins,
    };
  });
  const anatomy = manifest.scenes.map((scene) =>
    Object.values(
      scene.representationPlan?.spatial_motion?.motion_anatomy ?? {},
    ).join("|"),
  );
  for (let i = 2; i < anatomy.length; i++)
    if (
      anatomy[i] === anatomy[i - 1] &&
      anatomy[i] === anatomy[i - 2] &&
      !scenes[i]!.failures.includes("GENERIC_MOTION_ANATOMY_REUSE")
    )
      scenes[i]!.failures.push("GENERIC_MOTION_ANATOMY_REUSE");
  const failures = unique(scenes.flatMap((scene) => scene.failures));
  return {
    version: 1,
    actual_binary: true,
    verdict: failures.length ? "FAIL" : "PASS",
    production_cleanliness: scenes.every(
      (scene) => scene.production_cleanliness === "PASS",
    )
      ? "PASS"
      : "FAIL",
    scenes,
    spatial_rhythm: manifest.scenes.map(
      (scene) =>
        scene.representationPlan?.spatial_motion?.geometry.silhouette ??
        "MISSING",
    ),
    silhouette_variety: unique(
      manifest.scenes.map(
        (scene) =>
          scene.representationPlan?.spatial_motion?.geometry.silhouette ??
          "MISSING",
      ),
    ),
    motion_anatomy_sequence: anatomy,
    failures,
  };
};

export type RealizationCandidate<T> = {
  label: string;
  creative_round: number;
  repair_pass: 0 | 1;
  manifest: AnimationManifest;
  qa: T;
};
export const executeBoundedRealizationRepair = async <T>(input: {
  initial: RealizationCandidate<T>;
  diagnoses: Array<{ scene_id: string; failure_class: string }>;
  runRepair: (manifest: AnimationManifest) => Promise<RealizationCandidate<T>>;
}) => {
  const eligible = input.diagnoses.filter((item) =>
    [
      "REALIZATION",
      "TIMING",
      "EVIDENCE_CAMERA",
      "WHOLE_VIDEO_REPETITION",
    ].includes(diagnoseFailureOrigin(item.failure_class)),
  );
  if (!eligible.length)
    return { repair_passes_used: 0, candidates: [input.initial] };
  const repaired = repairSpatialMotion(input.initial.manifest, eligible);
  const result = await input.runRepair(repaired);
  if (result.repair_pass !== 1)
    throw new Error("REALIZATION_REPAIR_CONTRACT_INVALID");
  return { repair_passes_used: 1, candidates: [input.initial, result] };
};
