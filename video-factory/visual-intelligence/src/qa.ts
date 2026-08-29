import type {FailureClass, RetentionDirectorPlan, SemanticVisionQa} from './model';
import type {VisualIntelligenceConfig} from './config';
import type {ActualBinaryExperience} from '../../review/src/experience';

export const failureRoute = (failure: FailureClass): string => ({
  GENERATION_EXECUTION_FAILURE: 'Image Asset Service',
  SEMANTIC_ASSET_MISMATCH: 'Key Visual Brief',
  WRONG_VISUAL_SOURCE: 'Visual Source Router',
  RETENTION_DEAD_ZONE: 'Retention Director',
  SCRIPT_NOT_VISUALIZABLE: 'Editorial/Script Review',
  FAKE_OR_PSEUDO_EVIDENCE: 'Evidence/Source Review',
  COMPOSED_FRAME_FAILURE: 'Remotion Composition',
  VIDEO_RETENTION_FAILURE: 'Retention Director',
}[failure]);

export const enforceVisionHardGates = (qa: SemanticVisionQa, config: VisualIntelligenceConfig): SemanticVisionQa => {
  const reasons = [...qa.failure_reasons];
  let verdict = qa.verdict;
  let failure = qa.failure_class;
  if (qa.factual_integrity === 'FAIL') {
    verdict = 'REJECT'; failure = 'FAKE_OR_PSEUDO_EVIDENCE'; reasons.push('Factual integrity failed; generated imagery cannot imitate evidence.');
  } else if (qa.semantic_relevance < config.semanticRelevanceMin) {
    verdict = qa.semantic_relevance <= 5 ? 'REJECT' : 'RETRY'; failure = 'SEMANTIC_ASSET_MISMATCH'; reasons.push(`Semantic relevance ${qa.semantic_relevance} is below ${config.semanticRelevanceMin}.`);
  } else if (qa.semantic_specificity < config.semanticSpecificityMin || qa.visual_magnetism < config.visualMagnetismMin || qa.video_usability < config.videoUsabilityMin) {
    verdict = 'RETRY'; failure = 'SEMANTIC_ASSET_MISMATCH';
    if (qa.semantic_specificity < config.semanticSpecificityMin) reasons.push(`Semantic specificity ${qa.semantic_specificity} is below ${config.semanticSpecificityMin}.`);
    if (qa.visual_magnetism < config.visualMagnetismMin) reasons.push(`Visual magnetism ${qa.visual_magnetism} is below ${config.visualMagnetismMin}.`);
    if (qa.video_usability < config.videoUsabilityMin) reasons.push(`Video usability ${qa.video_usability} is below ${config.videoUsabilityMin}.`);
  } else verdict = 'PASS';
  return {...qa, verdict, failure_reasons: [...new Set(reasons)], failure_class: verdict === 'PASS' ? null : failure || 'SEMANTIC_ASSET_MISMATCH', recommended_return_layer: verdict === 'PASS' ? null : failureRoute(failure || 'SEMANTIC_ASSET_MISMATCH')};
};

export type RetentionQa = {
  hook_strength: number;
  curiosity_continuity: number;
  pattern_interrupt_quality: number;
  rhythm_variation: number;
  payoff_strength: number;
  dead_zone_detected: boolean;
  predictability_risk: number;
  verdict: 'PASS' | 'RETRY';
  failure_class: FailureClass | null;
  reasons: string[];
};

export const evaluateRetentionPlan = (plan: RetentionDirectorPlan): RetentionQa => {
  const uniqueIntensity = new Set(plan.intensity_curve.map((item) => item.intensity)).size;
  const hook = plan.hook.tension.trim() && plan.hook.promise.trim() ? 8 : 4;
  const payoff = plan.payoff.closure.trim() && plan.open_loops.some((loop) => loop.closed_scene === plan.payoff.scene_id) ? 8 : 5;
  const dead = plan.dead_zone_risks.length > 0;
  const qa: RetentionQa = {
    hook_strength: hook,
    curiosity_continuity: plan.open_loops.length && plan.semantic_beats.every((beat) => beat.reason_to_continue.trim()) ? 8 : 5,
    pattern_interrupt_quality: plan.pattern_interrupts.every((item) => !/effect|glow|zoom only/i.test(item.kind + item.purpose)) ? 8 : 5,
    rhythm_variation: uniqueIntensity >= 3 ? 8 : 6,
    payoff_strength: payoff,
    dead_zone_detected: dead,
    predictability_risk: uniqueIntensity >= 3 ? 3 : 7,
    verdict: hook < 8 || payoff < 8 || dead ? 'RETRY' : 'PASS',
    failure_class: hook < 8 || payoff < 8 || dead ? 'RETENTION_DEAD_ZONE' : null,
    reasons: [],
  };
  if (hook < 8) qa.reasons.push('Hook does not establish both tension and payoff promise.');
  if (payoff < 8) qa.reasons.push('Payoff does not close the primary open loop.');
  if (dead) qa.reasons.push('At least one scene lacks semantic or visual progression.');
  return qa;
};

export const evaluateActualRenderedVideo = (plan: RetentionDirectorPlan, actual: ActualBinaryExperience): RetentionQa & {actual_binary: true; measured_dead_air_seconds: number; measured_freeze_seconds: number} => {
  const planned = evaluateRetentionPlan(plan);
  const actualDeadZone = actual.nonSemanticDeadAirSpans.length > 0 || !actual.pass;
  const reasons = [...planned.reasons, ...actual.errors];
  if (actualDeadZone && !reasons.some((reason) => /dead|static|silence/i.test(reason))) reasons.push('Actual rendered binary contains a non-semantic dead zone.');
  return {...planned, dead_zone_detected: planned.dead_zone_detected || actualDeadZone, verdict: planned.verdict === 'PASS' && !actualDeadZone ? 'PASS' : 'RETRY', failure_class: planned.verdict === 'PASS' && !actualDeadZone ? null : 'VIDEO_RETENTION_FAILURE', reasons, actual_binary: true, measured_dead_air_seconds: actual.longestNonSemanticDeadAirSeconds, measured_freeze_seconds: actual.longestFreezeSeconds};
};

export const retryInstruction = (qa: SemanticVisionQa) => {
  const diagnosis = qa.failure_reasons[0]?.trim();
  if (!diagnosis || /try again|make it better|more cinematic/i.test(diagnosis)) throw new Error('QA-directed retry requires a concrete diagnosed failure');
  return `Correct only this diagnosed failure: ${diagnosis}\nPreserve every must-show, must-not-show, evidence and crop constraint from the approved brief.`;
};

export const redactSecrets = (value: string, secrets: Array<string | undefined>) => secrets.reduce<string>((current, secret) => secret && secret.length >= 8 ? current.split(secret).join('[REDACTED]') : current, value).replace(/sk-[A-Za-z0-9_-]{12,}/g, '[REDACTED]');
