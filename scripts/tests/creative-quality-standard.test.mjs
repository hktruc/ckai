import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import test from 'node:test';
import {evaluateCreativeGovernance, getActiveStandard, loadCreativeQualityRegistry, validateCreativeQualityRegistry} from '../lib/creative-quality-standard.mjs';

const registryPath = resolve('config/creative-quality-standard.json');
const allScores = (standard, value) => Object.fromEntries(Object.keys(standard.dimensions).map((id) => [id, value]));

test('V1 is canonical, valid, and carries the exact 7/8/9 thresholds', async () => {
  const registry = await loadCreativeQualityRegistry(registryPath);
  const standard = getActiveStandard(registry);
  assert.equal(registry.active_standard, 'CKAI_MARKET_TASTE_STANDARD_V1');
  assert.deepEqual(validateCreativeQualityRegistry(registry), []);
  assert.deepEqual(standard.thresholds, {market_ready_minimum: 7, ckai_golden_target: 8, aspirational_target: 9, critical_dimension_floor: 7});
});

test('4 and 5 are explicitly not market ready, while market readiness starts at 7', async () => {
  const standard = getActiveStandard(await loadCreativeQualityRegistry(registryPath));
  assert.equal(standard.score_scale['4'].market_ready, false);
  assert.equal(standard.score_scale['5'].market_ready, false);
  assert.equal(standard.score_scale['6'].market_ready, false);
  assert.equal(standard.score_scale['7'].market_ready, true);
});

test('current CKAI-0004 Phase 1K baseline is a Product Owner and ChatGPT 2/10 product failure', async () => {
  const baseline = getActiveStandard(await loadCreativeQualityRegistry(registryPath)).baseline;
  assert.deepEqual(baseline, {...baseline, content_id: 'CKAI-0004', stage: 'PHASE_1K', approximate_market_readiness: 2, authority: 'PRODUCT_OWNER_AND_CHATGPT', product_quality_status: 'PRODUCT_FAILURE'});
});

test('architecture and technical PASS cannot hide a human-scored 2/10 product failure', async () => {
  const standard = getActiveStandard(await loadCreativeQualityRegistry(registryPath));
  const result = evaluateCreativeGovernance({standard, architecture_status: 'PASS', integration_status: 'PASS', machine_technical_status: 'PASS', dimension_scores: allScores(standard, 2), score_authority: 'HUMAN_CHATGPT_CREATIVE_DIRECTOR', human_creative_director_verdict: 'REJECTED'});
  assert.equal(result.market_readiness_score, 2);
  assert.equal(result.creative_quality_status, 'PRODUCT_FAILURE');
  assert.equal(result.taste_gate, 'FAIL');
  assert.equal(result.release_candidate_eligible, false);
});

test('machine diagnostics cannot self-award authoritative 7+ acceptance', async () => {
  const standard = getActiveStandard(await loadCreativeQualityRegistry(registryPath));
  const result = evaluateCreativeGovernance({standard, architecture_status: 'PASS', integration_status: 'PASS', machine_technical_status: 'PASS', dimension_scores: allScores(standard, 10), score_authority: 'MACHINE_DIAGNOSTIC', human_creative_director_verdict: 'PENDING'});
  assert.equal(result.diagnostic_market_readiness_score, 10);
  assert.equal(result.market_readiness_score, null);
  assert.equal(result.taste_gate, 'PENDING');
  assert.equal(result.golden_candidate, false);
  assert.equal(result.release_candidate_eligible, false);
});

test('a collapsed critical dimension defeats average-score gaming', async () => {
  const standard = getActiveStandard(await loadCreativeQualityRegistry(registryPath));
  const scores = allScores(standard, 9);
  scores.SCROLL_STOP_HOOK = 2;
  const result = evaluateCreativeGovernance({standard, architecture_status: 'PASS', integration_status: 'PASS', machine_technical_status: 'PASS', dimension_scores: scores, score_authority: 'HUMAN_CHATGPT_CREATIVE_DIRECTOR', human_creative_director_verdict: 'APPROVED'});
  assert.ok(result.market_readiness_score >= 8);
  assert.equal(result.critical_dimension_floor_pass, false);
  assert.equal(result.taste_gate, 'FAIL');
  assert.equal(result.golden_candidate, false);
});

test('Golden and release eligibility require human authority, score, critical floor, and technical gates', async () => {
  const standard = getActiveStandard(await loadCreativeQualityRegistry(registryPath));
  const result = evaluateCreativeGovernance({standard, architecture_status: 'PASS', integration_status: 'PASS', machine_technical_status: 'PASS', dimension_scores: allScores(standard, 8), score_authority: 'HUMAN_CHATGPT_CREATIVE_DIRECTOR', human_creative_director_verdict: 'APPROVED'});
  assert.equal(result.market_readiness_score, 8);
  assert.equal(result.taste_gate, 'PASS');
  assert.equal(result.golden_candidate, true);
  assert.equal(result.release_candidate_eligible, true);
});

test('a stricter future active version can change thresholds without evaluator changes', async () => {
  const registry = await loadCreativeQualityRegistry(registryPath);
  const v2 = structuredClone(getActiveStandard(registry));
  v2.standard_version = '2.0.0';
  v2.effective_date = '2027-01-01';
  v2.change_notes = 'Synthetic stricter-version regression.';
  v2.thresholds = {...v2.thresholds, market_ready_minimum: 8, ckai_golden_target: 9, aspirational_target: 10, critical_dimension_floor: 8};
  for (let score = 0; score <= 10; score += 1) v2.score_scale[String(score)].market_ready = score >= 8;
  registry.standards.CKAI_MARKET_TASTE_STANDARD_V2 = v2;
  registry.active_standard = 'CKAI_MARKET_TASTE_STANDARD_V2';
  assert.deepEqual(validateCreativeQualityRegistry(registry), []);
  const result = evaluateCreativeGovernance({standard: getActiveStandard(registry), architecture_status: 'PASS', integration_status: 'PASS', machine_technical_status: 'PASS', dimension_scores: allScores(v2, 8), score_authority: 'HUMAN_CHATGPT_CREATIVE_DIRECTOR', human_creative_director_verdict: 'APPROVED'});
  assert.equal(result.taste_gate, 'PASS');
  assert.equal(result.golden_candidate, false);
});

test('Creative North Star exists as an intentionally empty real-reference structure', async () => {
  const board = await readFile(resolve('content/references/creative-north-star/README.md'), 'utf8');
  assert.match(board, /STRUCTURE_READY_REFERENCES_PENDING/);
  assert.match(board, /no reference may be invented/i);
  assert.doesNotMatch(board, /https?:\/\//);
});
