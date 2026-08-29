import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';
import type {AnimationManifest} from '../../animation/src/model';
import type {VoicePlan} from '../../voice/src/model';
import {analyzeActualRetentionV2,classifySilenceRisk,evaluateCreativeContinuity} from '../src/retention-v2';

test('UNMOTIVATED_SILENCE_POLICY_V1 distinguishes normal, risky, failed and justified pauses',()=>{
  assert.equal(classifySilenceRisk(.5,false,false),'LOW');assert.equal(classifySilenceRisk(1.2,false,false),'MEDIUM');assert.equal(classifySilenceRisk(1.7,false,false),'HIGH');assert.equal(classifySilenceRisk(2.1,false,false),'FAIL');assert.equal(classifySilenceRisk(2.1,true,true),'MEDIUM');
});

const fixtureVideo=resolve('generated/regression/retention/CKAI-0004-phase1G-human-rejected.mp4');
test('human-rejected old production binary is a negative actual-MP4 regression fixture',{skip:!existsSync(fixtureVideo)},()=>{
  const animation=JSON.parse(readFileSync(resolve('generated/regression/retention/CKAI-0004-phase1G-animation.json'),'utf8')) as AnimationManifest;const voice=JSON.parse(readFileSync(resolve('generated/regression/retention/CKAI-0004-phase1G-voice.json'),'utf8')) as VoicePlan;
  const timeline=analyzeActualRetentionV2(fixtureVideo,animation,voice);const continuity=evaluateCreativeContinuity(animation,timeline);
  assert.equal(timeline.actual_binary,true);assert.equal(timeline.verdict,'FAIL');assert.ok(timeline.high_risk_silence_count>0);assert.ok(timeline.failure_classes.includes('LEGACY_VISUAL_BEHAVIOR'));assert.equal(continuity.verdict,'FAIL');
});

test('retention V2 implementation is generic and contains no production Content ID branch',()=>{
  const implementation=`${analyzeActualRetentionV2.toString()}${evaluateCreativeContinuity.toString()}`;assert.doesNotMatch(implementation,/CKAI-0004|contentId\s*===/);
});
