import assert from 'node:assert/strict';
import test from 'node:test';
import {isVoiceHandoffReady} from '../src/engine/gates';
import {runTechnicalQa} from '../src/engine/qa';
import {getSceneFrames, getTotalFrames, secondsToFrame} from '../src/engine/timeline';
import {verifyCanonicalUpstream} from '../src/engine/upstream';
import {TEST_0002} from '../src/manifest/test0002';
import type {AnimationManifest} from '../src/model';
import {createMotionPlan} from '../src/motion-system';

const clone = (): AnimationManifest => structuredClone(TEST_0002);

const VALID_SOURCE = 'video-factory/animation/tests/fixtures/valid-visual-direction.md';
const VALID_SHA256 = '7995EB2E8674D751263330B7F6E002BF890E91DBF4ADD29A030352E7043775BF';
const FORGED_SOURCE = 'video-factory/animation/tests/fixtures/forged-visual-direction.md';
const FORGED_SHA256 = '7F1F524F3DE75E2C1B885546A4C930886CF7D663B1F96ECF5C0E087DE48069EC';

const productionManifest = (source: string, sourceSha256: string, contentId: string): AnimationManifest => {
  const manifest = clone();
  manifest.id = `${contentId}-Animation`;
  manifest.sourceVisualDirection = source;
  manifest.sourceVisualDirectionSha256 = sourceSha256;
  manifest.inputEligibility = 'production';
  manifest.upstreamAnimationHandoffStatus = 'READY';
  manifest.humanDecision = 'approved';
  manifest.unresolvedBlockers = [];
  manifest.voiceHandoffStatus = 'READY';
  manifest.signatureProfileId = 'CKAI_SIGNATURE_V1';
  manifest.scenes.forEach((scene, index) => { scene.motionPlan = createMotionPlan(scene.endSeconds - scene.startSeconds, scene.purpose, index); });
  return manifest;
};

test('seconds-to-frame math is deterministic and TEST-0002 is 1470 frames', () => {
  assert.equal(secondsToFrame(49, 30), 1470);
  assert.equal(getTotalFrames(TEST_0002), 1470);
  assert.deepEqual(getSceneFrames(TEST_0002).map(({startFrame, endFrame}) => [startFrame, endFrame]), [[0, 210], [210, 300], [300, 780], [780, 1080], [1080, 1470]]);
  assert.deepEqual(TEST_0002.voiceHandoff.sceneSlots.map(({sceneId}) => sceneId), ['SC-01', 'SC-02', 'SC-03', 'SC-04', 'SC-05']);
  assert.deepEqual(TEST_0002.voiceHandoff.sceneSlots[2].pauseWindows, [{startSeconds: 25, endSeconds: 26, sourceMarker: '[pause]'}]);
  assert.equal(TEST_0002.voiceHandoff.audioGenerated, false);
  assert.match(TEST_0002.assets.A5.value, /cần test riêng/);
});

test('scene plan is contiguous, complete, and technically valid in explicit proof mode', () => {
  const result = runTechnicalQa(TEST_0002, true);
  assert.deepEqual(result, {pass: true, errors: []});
});

test('missing or remote required asset blocks QA', () => {
  const manifest = clone();
  manifest.assets.A3.value = '';
  const result = runTechnicalQa(manifest, true);
  assert.equal(result.pass, false);
  assert.match(result.errors.join('\n'), /missing required asset A3/);

  const remote = clone();
  remote.assets.A3.value = 'https://example.com/runtime-proof.png';
  const remoteResult = runTechnicalQa(remote, true);
  assert.equal(remoteResult.pass, false);
  assert.match(remoteResult.errors.join('\n'), /remote runtime assets are forbidden/);

  const approvedWithMissingAsset = clone();
  approvedWithMissingAsset.inputEligibility = 'production';
  approvedWithMissingAsset.upstreamAnimationHandoffStatus = 'READY';
  approvedWithMissingAsset.humanDecision = 'approved';
  approvedWithMissingAsset.technicalQa = 'BLOCKED';
  approvedWithMissingAsset.unresolvedBlockers = ['required asset A3 is missing'];
  approvedWithMissingAsset.assets.A3.value = '';
  const scenarioA = runTechnicalQa(approvedWithMissingAsset, false);
  assert.equal(scenarioA.pass, false);
  assert.equal(isVoiceHandoffReady(approvedWithMissingAsset), false);
});

test('missing proof or caveat blocks QA', () => {
  const manifest = clone();
  manifest.proofIds = manifest.proofIds.filter((id) => id !== 'R2');
  manifest.caveatIds = manifest.caveatIds.filter((id) => id !== 'C2');
  const result = runTechnicalQa(manifest, true);
  assert.equal(result.pass, false);
  assert.match(result.errors.join('\n'), /missing proof R2/);
  assert.match(result.errors.join('\n'), /missing caveat C2/);
});

test('reverse-audit fixture cannot use production render mode and never reaches Voice', () => {
  const result = runTechnicalQa(TEST_0002, false);
  assert.equal(result.pass, false);
  assert.match(result.errors.join('\n'), /Visual Direction\.visual_input_eligibility must be production/);
  assert.equal(isVoiceHandoffReady(TEST_0002), false);
  assert.equal(TEST_0002.voiceHandoffStatus, 'BLOCKED');

  const relabeled = clone();
  relabeled.inputEligibility = 'production';
  relabeled.upstreamAnimationHandoffStatus = 'READY';
  const relabeledResult = runTechnicalQa(relabeled, false);
  assert.equal(relabeledResult.pass, false);
  assert.match(relabeledResult.errors.join('\n'), /Visual Direction\.visual_input_eligibility must be production/);
});

test('Scenario A: a forged READY or stale source is blocked', () => {
  const manifest = productionManifest(FORGED_SOURCE, FORGED_SHA256, 'CONTRACT-FORGED');
  const verification = verifyCanonicalUpstream(manifest, 'production');
  const result = runTechnicalQa(manifest, false);
  assert.equal(verification.pass, false);
  assert.equal(verification.derivedAnimationHandoffStatus, 'BLOCKED');
  assert.equal(result.pass, false);
  assert.match(result.errors.join('\n'), /Visual Direction\.human_decision must be approved/);
  assert.equal(isVoiceHandoffReady(manifest, verification), false);

  const stale = productionManifest(VALID_SOURCE, '0'.repeat(64), 'CONTRACT-VALID');
  const staleResult = runTechnicalQa(stale, false);
  assert.equal(staleResult.pass, false);
  assert.match(staleResult.errors.join('\n'), /Visual Direction checksum mismatch/);
});

test('Scenario B: only a verified canonical STEP 04 READY source passes production input', () => {
  const manifest = productionManifest(VALID_SOURCE, VALID_SHA256, 'CONTRACT-VALID');
  const verification = verifyCanonicalUpstream(manifest, 'production');
  assert.equal(verification.pass, true);
  assert.equal(verification.derivedAnimationHandoffStatus, 'READY');
  assert.deepEqual(runTechnicalQa(manifest, false), {pass: true, errors: []});
  assert.equal(isVoiceHandoffReady(manifest, verification), true);
  manifest.humanDecision = 'pending';
  assert.equal(isVoiceHandoffReady(manifest, verification), false);
  manifest.humanDecision = 'approved';
  manifest.technicalQa = 'BLOCKED';
  assert.equal(isVoiceHandoffReady(manifest, verification), false);
});
