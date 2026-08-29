import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import type {AnimationManifest} from '../../animation/src/model';
import {TEST_0002} from '../../animation/src/manifest/test0002';
import {isFinalReviewInputReady} from '../src/gates';
import {createTest0002VoicePlan} from '../src/manifest/test0002';
import {normalizeVietnamese} from '../src/normalization';
import {runVoiceQa, validateAudibleLevels} from '../src/qa';
import {VbeeProvider} from '../src/providers/vbee';
import {resolveVoiceAlias, validateVoiceRegistry} from '../src/registry';
import {preflightVbeeAudition, summarizeVoiceMappings} from '../src/selection';
import {segmentCacheKey, sha256, voiceHandoffHash} from '../src/segment';
import {evaluateFit} from '../src/timing';
import {verifyVoiceUpstream} from '../src/upstream';

const cloneAnimation = (): AnimationManifest => structuredClone(TEST_0002);

const productionInput = () => {
  const animation = cloneAnimation();
  animation.id = 'CONTRACT-VALID-Animation';
  animation.sourceVisualDirection = 'video-factory/animation/tests/fixtures/valid-visual-direction.md';
  animation.sourceVisualDirectionSha256 = '7995EB2E8674D751263330B7F6E002BF890E91DBF4ADD29A030352E7043775BF';
  animation.inputEligibility = 'production';
  animation.upstreamAnimationHandoffStatus = 'READY';
  animation.humanDecision = 'approved';
  animation.unresolvedBlockers = [];
  animation.voiceHandoffStatus = 'READY';
  animation.voiceHandoff.sourceScript = 'video-factory/animation/tests/fixtures/valid-script.md';
  const plan = createTest0002VoicePlan();
  plan.id = 'CONTRACT-VALID-Voice'; plan.contentId = 'CONTRACT-VALID'; plan.inputEligibility = 'production';
  plan.sourceAnimationArtifact = 'video-factory/voice/tests/fixtures/valid-animation.md';
  plan.sourceAnimationArtifactSha256 = sha256(readFileSync(plan.sourceAnimationArtifact));
  plan.sourceAnimationManifest = 'video-factory/voice/tests/fixtures/valid-animation-manifest.ts';
  plan.sourceAnimationManifestSha256 = sha256(readFileSync(plan.sourceAnimationManifest));
  plan.sourceAnimationVoiceHandoffSha256 = voiceHandoffHash(animation.voiceHandoff);
  plan.sourceScript = animation.voiceHandoff.sourceScript;
  plan.segments.forEach((segment, index) => {
    segment.originalText = animation.voiceHandoff.sceneSlots[index].spokenCopy;
    segment.synthesisText = normalizeVietnamese(segment.originalText).synthesisText;
    segment.cacheKey = segmentCacheKey(segment, resolveVoiceAlias(segment.speakerAlias, 'reverse-audit-proof'));
  });
  return {plan, animation};
};

test('Vietnamese normalization preserves original and centralizes PDF/Markdown/OCR pronunciation', () => {
  const original = 'PDF, Markdown và OCR trong 49s.';
  const result = normalizeVietnamese(original);
  assert.equal(result.originalText, original);
  assert.match(result.synthesisText, /pi đi ép/);
  assert.match(result.synthesisText, /Mác-đao/);
  assert.match(result.synthesisText, /ô si a/);
  assert.match(result.synthesisText, /49 giây/);
});

test('speaker aliases resolve centrally and A-B-A mapping is executable', () => {
  const aliases = ['LOCAL_VI_NARRATOR_PROOF', 'LOCAL_VI_AI_PROOF', 'LOCAL_VI_NARRATOR_PROOF'];
  const voices = aliases.map((alias) => resolveVoiceAlias(alias, 'reverse-audit-proof'));
  assert.deepEqual(voices.map((voice) => voice.voiceCode), ['vi_VN-vais1000-medium', 'vi_VN-vivos-x_low', 'vi_VN-vais1000-medium']);
  assert.notEqual(voices[0].voiceCode, voices[1].voiceCode);
});

test('HN Minh Quan is the single production-approved CKAI default', () => {
  const voice = resolveVoiceAlias('CKAI_NARRATOR_PRIMARY', 'production');
  assert.equal(voice.voiceCode, 'hn_male_minhquan_yt-stable');
  assert.equal(voice.displayName, 'HN - Minh Quân');
  assert.equal(voice.productionApprovedMapping, true);
  assert.equal(voice.voiceSelectionCheck, 'PASS');
  assert.equal(voice.defaultFor, 'ckai-production-narration');
});

test('Selection Scenario A: Vbee shortlist preserves distinct A-B-A provider mapping', () => {
  const aliases = ['VBEE_AUDITION_NGOC_HUYEN', 'VBEE_AUDITION_LAN_TRINH', 'VBEE_AUDITION_NGOC_HUYEN'];
  const summary = preflightVbeeAudition(aliases);
  assert.deepEqual(summary.mappings.map((mapping) => mapping.voiceCode), [
    'hn_female_ngochuyen_full_48k-fhg',
    'sg_female_lantrinh_vdts_48k-fhg',
    'hn_female_ngochuyen_full_48k-fhg',
  ]);
  assert.equal(summary.distinctProviderVoices, 2);
  assert.equal(summary.audiblyDistinct, true);
});

test('Selection Scenario B: unknown alias blocks during preflight before any API call', () => {
  assert.throws(() => preflightVbeeAudition(['UNKNOWN_VBEE_ALIAS']), /Voice alias is not registered/);
});

test('Selection Scenario C: duplicate provider code is reported, not fabricated as two audible voices', () => {
  const first = resolveVoiceAlias('VBEE_AUDITION_NGOC_HUYEN', 'reverse-audit-proof');
  const second = {...first, alias: 'VBEE_DUPLICATE_TEST'};
  const summary = summarizeVoiceMappings([first, second]);
  assert.equal(summary.distinctProviderVoices, 1);
  assert.equal(summary.audiblyDistinct, false);
  assert.deepEqual(summary.duplicateProviderVoices[0].aliases, ['VBEE_AUDITION_NGOC_HUYEN', 'VBEE_DUPLICATE_TEST']);
  assert.deepEqual(validateVoiceRegistry({[first.alias]: first, [second.alias]: second}).errors, []);
});

test('segment cache identity changes with text, voice, or speed', () => {
  const plan = createTest0002VoicePlan();
  const segment = plan.segments[0];
  const voice = resolveVoiceAlias(segment.speakerAlias, 'reverse-audit-proof');
  assert.equal(segment.cacheKey, segmentCacheKey(segment, voice));
  assert.notEqual(segment.cacheKey, segmentCacheKey({...segment, synthesisText: `${segment.synthesisText}!`}, voice));
  assert.notEqual(segment.cacheKey, segmentCacheKey({...segment, speed: 1}, voice));
});

test('timing overflow is REVISE and never stretches Animation', () => {
  assert.deepEqual(evaluateFit(7, 10, 3.2), {slotDurationSeconds: 3, fitDeltaSeconds: -0.2, fitStatus: 'REVISE'});
});

test('paid Vbee call is blocked before credential/network without explicit quota approval', async () => {
  const plan = createTest0002VoicePlan();
  const voice = {...resolveVoiceAlias('VBEE_AUDITION_NGOC_HUYEN', 'reverse-audit-proof')};
  await assert.rejects(new VbeeProvider().synthesize({segment: plan.segments[0], voice, outputPath: 'generated/never.wav', allowQuotaConsumption: false}), /explicit quota-consumption approval/);
});

test('missing audio and missing speaker alias are blocked deterministically', () => {
  const missingAudio = createTest0002VoicePlan();
  missingAudio.segments[0].generatedAudioPath = 'generated/voice/definitely-missing.wav';
  const audioResult = runVoiceQa({plan: missingAudio, animation: TEST_0002}, 'reverse-audit-proof', true);
  assert.equal(audioResult.pass, false);
  assert.match(audioResult.errors.join('\n'), /Audio missing or empty/);

  const missingVoice = createTest0002VoicePlan();
  missingVoice.segments[0].speakerAlias = 'UNKNOWN_SPEAKER';
  const voiceResult = runVoiceQa({plan: missingVoice, animation: TEST_0002}, 'reverse-audit-proof', false);
  assert.equal(voiceResult.pass, false);
  assert.match(voiceResult.errors.join('\n'), /Voice alias is not registered/);
});

test('an existing audio stream is insufficient when the muxed binary is near-silent', () => {
  assert.match(validateAudibleLevels({meanVolumeDb: -91, maxVolumeDb: -91, zeroDbSampleRatio: 0}, 'Muxed Voice preview narration').join('\n'), /effectively silent/);
  assert.deepEqual(validateAudibleLevels({meanVolumeDb: -25.1, maxVolumeDb: -1.9, zeroDbSampleRatio: 0}, 'Muxed Voice preview narration'), []);
});

test('provider credential failure is explicit and does not retry or fabricate success', async () => {
  const oldAppId = process.env.VBEE_APP_ID;
  const oldToken = process.env.VBEE_ACCESS_TOKEN;
  delete process.env.VBEE_APP_ID;
  delete process.env.VBEE_ACCESS_TOKEN;
  try {
    const plan = createTest0002VoicePlan();
    const voice = resolveVoiceAlias('VBEE_AUDITION_LAN_TRINH', 'reverse-audit-proof');
    await assert.rejects(new VbeeProvider().synthesize({segment: plan.segments[0], voice, outputPath: 'generated/never.wav', allowQuotaConsumption: true}), /Missing VBEE_APP_ID or VBEE_ACCESS_TOKEN/);
  } finally {
    if (oldAppId === undefined) delete process.env.VBEE_APP_ID; else process.env.VBEE_APP_ID = oldAppId;
    if (oldToken === undefined) delete process.env.VBEE_ACCESS_TOKEN; else process.env.VBEE_ACCESS_TOKEN = oldToken;
  }
});

test('changed Spoken Copy is blocked by upstream chain-of-custody', () => {
  const plan = createTest0002VoicePlan();
  plan.segments[0].originalText += ' thay đổi';
  const result = verifyVoiceUpstream({plan, animation: TEST_0002}, 'reverse-audit-proof');
  assert.equal(result.pass, false);
  assert.match(result.errors.join('\n'), /changed exact approved Spoken Copy/);
});

test('reverse-audit audio plan has no production authority', () => {
  const plan = createTest0002VoicePlan();
  const upstream = verifyVoiceUpstream({plan, animation: TEST_0002}, 'reverse-audit-proof');
  assert.equal(upstream.pass, true);
  assert.equal(upstream.derivedVoiceInputStatus, 'BLOCKED');
  assert.equal(isFinalReviewInputReady(plan, upstream), false);
});

test('Scenario A: forged STEP05 READY is blocked by canonical Animation state', () => {
  const input = productionInput();
  input.animation.humanDecision = 'pending';
  const upstream = verifyVoiceUpstream(input, 'production');
  assert.equal(upstream.pass, false);
  assert.equal(upstream.derivedVoiceInputStatus, 'BLOCKED');
  assert.match(upstream.errors.join('\n'), /STEP05 Voice handoff invariant is not READY/);
});

test('Scenario C: exact verified STEP05 source plus delegated Voice acceptance opens STEP07 input only', () => {
  const input = productionInput();
  input.plan.voiceSelection.productionApprovedMapping = true;
  Object.assign(input.plan, {voiceSelectionCheck: 'PASS', providerInputCheck: 'PASS', segmentsGeneratedCheck: 'PASS', audioTechnicalQa: 'PASS', timingFitCheck: 'PASS', pronunciationCheck: 'PASS', proofCaveatCheck: 'PASS', voiceReview: 'pass', humanDecision: 'approved', unresolvedBlockers: [], finalReviewInputStatus: 'READY'});
  const upstream = verifyVoiceUpstream(input, 'production');
  assert.equal(upstream.pass, true);
  assert.equal(upstream.derivedVoiceInputStatus, 'READY');
  assert.equal(isFinalReviewInputReady(input.plan, upstream), true);
});
