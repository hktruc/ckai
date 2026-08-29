import {readFile} from 'node:fs/promises';

export const loadCreativeQualityRegistry = async (path) => JSON.parse(await readFile(path, 'utf8'));

export const getActiveStandard = (registry) => {
  const standard = registry?.standards?.[registry.active_standard];
  if (!standard) throw new Error(`Unknown active creative-quality standard: ${registry?.active_standard ?? 'missing'}`);
  return standard;
};

export const validateCreativeQualityRegistry = (registry) => {
  const errors = [];
  if (registry?.schema_version !== 1) errors.push('SCHEMA_VERSION_UNSUPPORTED');
  let standard;
  try {
    standard = getActiveStandard(registry);
  } catch {
    return [...errors, 'ACTIVE_STANDARD_MISSING'];
  }

  for (const field of ['standard_version', 'effective_date', 'change_notes', 'thresholds', 'score_scale', 'dimensions', 'human_taste_authority', 'release_eligibility']) {
    if (standard[field] === undefined || standard[field] === null) errors.push(`STANDARD_FIELD_MISSING:${field}`);
  }

  const thresholds = standard.thresholds ?? {};
  const ordered = [thresholds.market_ready_minimum, thresholds.ckai_golden_target, thresholds.aspirational_target];
  if (ordered.some((value) => !Number.isFinite(value))) errors.push('THRESHOLDS_INVALID');
  if (!(ordered[0] <= ordered[1] && ordered[1] <= ordered[2])) errors.push('THRESHOLDS_NOT_MONOTONIC');
  if (!Number.isFinite(thresholds.critical_dimension_floor)) errors.push('CRITICAL_DIMENSION_FLOOR_INVALID');

  for (let score = 0; score <= 10; score += 1) {
    const entry = standard.score_scale?.[String(score)];
    if (!entry?.label || typeof entry.market_ready !== 'boolean' || !entry.definition) errors.push(`SCORE_DEFINITION_INVALID:${score}`);
    if (entry && entry.market_ready !== (score >= thresholds.market_ready_minimum)) errors.push(`MARKET_READY_SCALE_MISMATCH:${score}`);
  }

  const dimensions = Object.entries(standard.dimensions ?? {});
  if (!dimensions.length) errors.push('DIMENSIONS_MISSING');
  for (const [id, dimension] of dimensions) {
    if (!Number.isFinite(dimension.weight) || dimension.weight <= 0) errors.push(`DIMENSION_WEIGHT_INVALID:${id}`);
    if (typeof dimension.critical !== 'boolean') errors.push(`DIMENSION_CRITICAL_FLAG_INVALID:${id}`);
    if (!['ALL_VISUAL', 'REAL_EVIDENCE'].includes(dimension.applies_to)) errors.push(`DIMENSION_APPLICABILITY_INVALID:${id}`);
  }

  if (standard.human_taste_authority?.machine_may_authoritatively_award_7_plus !== false) errors.push('MACHINE_TASTE_AUTHORITY_NOT_BLOCKED');
  if (!standard.release_eligibility?.all_required?.includes('MARKET_TASTE_GATE_PASS')) errors.push('RELEASE_TASTE_GATE_MISSING');
  if (!standard.release_eligibility?.all_required?.includes('HUMAN_APPROVAL')) errors.push('RELEASE_HUMAN_APPROVAL_MISSING');
  if (standard.release_eligibility?.never_auto_publish !== true) errors.push('AUTO_PUBLISH_NOT_BLOCKED');
  return [...new Set(errors)];
};

const weightedScore = (dimensions, scores) => {
  const scored = dimensions.filter(([id]) => Number.isFinite(scores?.[id]));
  if (scored.length !== dimensions.length) return null;
  const totalWeight = scored.reduce((sum, [, dimension]) => sum + dimension.weight, 0);
  return Number((scored.reduce((sum, [id, dimension]) => sum + scores[id] * dimension.weight, 0) / totalWeight).toFixed(3));
};

export const evaluateCreativeGovernance = ({
  standard,
  architecture_status,
  integration_status,
  machine_technical_status,
  dimension_scores = {},
  content_mode = 'ALL_VISUAL',
  score_authority = 'MACHINE_DIAGNOSTIC',
  human_creative_director_verdict = 'PENDING'
}) => {
  const applicableDimensions = Object.entries(standard.dimensions).filter(([, dimension]) => dimension.applies_to === 'ALL_VISUAL' || content_mode === 'REAL_EVIDENCE');
  const diagnosticScore = weightedScore(applicableDimensions, dimension_scores);
  const authoritative = score_authority === standard.human_taste_authority.required_score_authority;
  const marketReadinessScore = authoritative ? diagnosticScore : null;
  const criticalScores = applicableDimensions.filter(([, dimension]) => dimension.critical).map(([id]) => dimension_scores[id]);
  const criticalFloorPass = criticalScores.length > 0 && criticalScores.every((score) => Number.isFinite(score) && score >= standard.thresholds.critical_dimension_floor);
  const completeAuthoritativeReview = authoritative && marketReadinessScore !== null && human_creative_director_verdict !== 'PENDING';
  const tasteGate = !completeAuthoritativeReview
    ? 'PENDING'
    : human_creative_director_verdict === 'APPROVED' && marketReadinessScore >= standard.thresholds.market_ready_minimum && criticalFloorPass
      ? 'PASS'
      : 'FAIL';
  const goldenCandidate = tasteGate === 'PASS' && marketReadinessScore >= standard.thresholds.ckai_golden_target && criticalFloorPass;
  const technicalPass = [architecture_status, integration_status, machine_technical_status].every((status) => status === 'PASS');
  const releaseCandidateEligible = technicalPass && tasteGate === 'PASS' && human_creative_director_verdict === 'APPROVED';
  const creativeQualityStatus = tasteGate === 'FAIL' ? 'PRODUCT_FAILURE' : tasteGate === 'PASS' ? 'MARKET_READY' : 'PENDING_HUMAN_REVIEW';

  return {
    architecture_status,
    integration_status,
    machine_technical_status,
    creative_quality_status: creativeQualityStatus,
    diagnostic_market_readiness_score: diagnosticScore,
    market_readiness_score: marketReadinessScore,
    taste_gate: tasteGate,
    golden_candidate: goldenCandidate,
    release_candidate_eligible: releaseCandidateEligible,
    human_creative_director_verdict,
    critical_dimension_floor_pass: criticalFloorPass,
    score_authority
  };
};
