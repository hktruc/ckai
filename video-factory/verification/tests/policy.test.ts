import assert from 'node:assert/strict';
import test from 'node:test';
import {evaluateVerificationBasis, type ClaimRisk} from '../src/policy';

const trusted = (risk: ClaimRisk = 'LOW_RISK_FAMILIAR') => evaluateVerificationBasis({basis:'product-owner-confirmed',risk,productOwnerConfirmed:true,contradictoryEvidence:false,knownFalse:false,familiar:true,nonControversial:true});

test('direct Product Owner confirmation passes only a familiar low-risk non-controversial capability claim', () => {
  assert.deepEqual(trusted(), {pass:true,basisAccepted:true,independentVerificationRequired:false,reason:'Direct Product Owner confirmation is sufficient for this low-risk familiar capability claim.'});
});

test('pricing, quota, access, rollout, statistics, benchmarks, new/time-sensitive and high-impact claims still require independent verification', () => {
  for (const risk of ['PRICING','QUOTA','ACCESS_OR_ROLLOUT','STATISTIC','BENCHMARK','NEW_OR_TIME_SENSITIVE','MEDICAL','LEGAL','FINANCIAL','HIGH_IMPACT','DIRECT_VISUAL_PROOF'] as ClaimRisk[]) {
    const result = trusted(risk); assert.equal(result.pass, false, risk); assert.equal(result.independentVerificationRequired, true, risk);
  }
});

test('Product Owner confirmation cannot override contradiction or known falsehood', () => {
  assert.equal(evaluateVerificationBasis({basis:'product-owner-confirmed',risk:'LOW_RISK_FAMILIAR',productOwnerConfirmed:true,contradictoryEvidence:true,knownFalse:false,familiar:true,nonControversial:true}).pass, false);
  assert.equal(evaluateVerificationBasis({basis:'product-owner-confirmed',risk:'LOW_RISK_FAMILIAR',productOwnerConfirmed:true,contradictoryEvidence:false,knownFalse:true,familiar:true,nonControversial:true}).pass, false);
});

test('self-declared basis without direct Product Owner confirmation cannot promote', () => {
  const result = evaluateVerificationBasis({basis:'product-owner-confirmed',risk:'LOW_RISK_FAMILIAR',productOwnerConfirmed:false,contradictoryEvidence:false,knownFalse:false,familiar:true,nonControversial:true});
  assert.equal(result.pass, false); assert.equal(result.basisAccepted, false);
});
