import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {test} from 'node:test';
import {sha256} from '../../voice/src/segment';
import {inspectDecodedMediaEquivalence, validateDecodedMediaEquivalence, validateSourceEquivalence} from '../src/equivalence';
import {isPublishHandoffReady} from '../src/gates';
import {inspectExportMedia} from '../src/media';
import {validateDeliveryProfile} from '../src/profile';
import {verifyExportUpstream} from '../src/upstream';
import {loadTest0002ExportInput} from '../scripts/runtime';
import {resolveFfmpeg, resolveH264Encoder} from '../../shared/media-tools';

test('verified STEP07 reverse-audit source is executable proof input without production authority', () => {
  const input = loadTest0002ExportInput();
  const result = verifyExportUpstream(input, 'reverse-audit-proof');
  assert.equal(result.pass, true, result.errors.join('\n'));
  assert.equal(result.derivedExportInputStatus, 'BLOCKED');
  assert.equal(input.exportManifest.publishHandoffStatus, 'BLOCKED');
});

test('Scenario A: forged STEP07 READY cannot bypass canonical human/hard gates', () => {
  const input = loadTest0002ExportInput();
  input.exportManifest.inputEligibility = 'production';
  input.exportManifest.publishHandoffStatus = 'READY';
  const result = verifyExportUpstream(input, 'production');
  assert.equal(result.pass, false);
  assert.equal(result.derivedExportInputStatus, 'BLOCKED');
  assert.match(result.errors.join('\n'), /FinalReview|STEP07|production|approved|READY/i);
});

test('Scenario B: stale review preview hash is blocked before encoding', () => {
  const input = loadTest0002ExportInput();
  input.exportManifest.sourceReviewPreviewSha256 = '0'.repeat(64);
  const result = verifyExportUpstream(input, 'reverse-audit-proof');
  assert.equal(result.pass, false);
  assert.match(result.errors.join('\n'), /preview.*checksum|preview.*hash/i);
});

test('canonical delivery profile is exact and provider/platform agnostic', () => {
  const input = loadTest0002ExportInput();
  assert.deepEqual(validateDeliveryProfile(input.exportManifest.deliveryProfile), []);
  input.exportManifest.deliveryProfile.fps = 60 as 30;
  assert.match(validateDeliveryProfile(input.exportManifest.deliveryProfile).join('\n'), /fps/i);
});

test('real export media meets codec/spec, duration tolerance, decode and checksum contracts', () => {
  const input = loadTest0002ExportInput();
  const manifest = input.exportManifest;
  const inspection = inspectExportMedia(manifest.outputPath);
  manifest.mediaInspection = inspection;
  manifest.decodedMediaEquivalence = inspectDecodedMediaEquivalence(manifest.sourceReviewPreview, manifest.outputPath);
  manifest.outputSha256 = sha256(readFileSync(manifest.outputPath));
  assert.equal(inspection.videoCodec, 'h264');
  assert.equal(inspection.pixelFormat, 'yuv420p');
  assert.equal(inspection.audioCodec, 'aac');
  assert.equal(inspection.audioSampleRate, 48000);
  assert.equal(inspection.audioChannels, 2);
  assert.equal(inspection.width, 1080);
  assert.equal(inspection.height, 1920);
  assert.equal(inspection.fps, 30);
  assert.ok(inspection.durationSeconds < 60);
  assert.equal(inspection.decodeCheck, 'PASS');
  assert.equal(manifest.decodedMediaEquivalence.comparedFrames, 1470);
  assert.deepEqual(validateDecodedMediaEquivalence(manifest.decodedMediaEquivalence, manifest.deliveryProfile.durationToleranceSeconds), []);
  assert.deepEqual(validateSourceEquivalence(manifest, inspection), []);
});

test('negative proof: decoded brightness-corrupted fixture is blocked by visual equivalence gate', () => {
  const input = loadTest0002ExportInput();
  const directory = mkdtempSync(join(tmpdir(), 'ckai-export-equivalence-'));
  const altered = join(directory, 'brightness-corrupted.mp4');
  try {
    const encode = spawnSync(resolveFfmpeg(), ['-hide_banner', '-y', '-f', 'lavfi', '-i', `color=c=white:s=1080x1920:r=30:d=${input.exportManifest.reviewedDurationSeconds}`, '-i', input.exportManifest.sourceReviewPreview, '-map', '0:v:0', '-map', '1:a:0', '-c:v', resolveH264Encoder(), '-b:v', '4M', '-c:a', 'copy', '-shortest', altered], {encoding: 'utf8', timeout: 180_000});
    assert.equal(encode.status, 0, encode.stderr);
    const metrics = inspectDecodedMediaEquivalence(input.exportManifest.sourceReviewPreview, altered);
    assert.match(validateDecodedMediaEquivalence(metrics, input.exportManifest.deliveryProfile.durationToleranceSeconds).join('\n'), /visual equivalence SSIM/i);
  } finally {
    rmSync(directory, {recursive: true, force: true});
  }
});

test('duration beyond mechanical tolerance is not source-equivalent', () => {
  const input = loadTest0002ExportInput();
  const inspection = inspectExportMedia(input.exportManifest.outputPath);
  input.exportManifest.outputSha256 = sha256(readFileSync(input.exportManifest.outputPath));
  const shifted = {...inspection, durationSeconds: input.exportManifest.reviewedDurationSeconds + 0.5};
  assert.match(validateSourceEquivalence(input.exportManifest, shifted).join('\n'), /duration.*tolerance/i);
});

test('output mutation/hash mismatch requires revalidation', () => {
  const input = loadTest0002ExportInput();
  const inspection = inspectExportMedia(input.exportManifest.outputPath);
  input.exportManifest.outputSha256 = '0'.repeat(64);
  assert.match(validateSourceEquivalence(input.exportManifest, inspection).join('\n'), /checksum/i);
});

test('generated Release Manifest is complete and bound to the exact accepted binary', () => {
  const release = JSON.parse(readFileSync('generated/exports/TEST-0002/TEST-0002_v1_release.generated.json', 'utf8'));
  for (const field of ['contentId', 'sourceReviewArtifact', 'sourceReviewPreview', 'deliveryProfile', 'outputPath', 'outputSha256', 'mediaInspection', 'decodedMediaEquivalence', 'captionMode', 'musicMode', 'sfxMode', 'sourceTranscript', 'deliveryMode', 'humanDecision', 'publishHandoffStatus']) {
    assert.notEqual(release[field], undefined, `Release Manifest missing ${field}`);
  }
  assert.equal(release.outputSha256, sha256(readFileSync(release.outputPath)));
  assert.equal(release.publishHandoffStatus, 'BLOCKED');
});
test('Scenario C: Publish READY is a complete production hard conjunction', () => {
  const input = loadTest0002ExportInput();
  const manifest = input.exportManifest;
  manifest.inputEligibility = 'production';
  manifest.mediaInspection = inspectExportMedia(manifest.outputPath);
  manifest.decodedMediaEquivalence = inspectDecodedMediaEquivalence(manifest.sourceReviewPreview, manifest.outputPath);
  manifest.outputSha256 = sha256(readFileSync(manifest.outputPath));
  manifest.exportReview = 'pass';
  manifest.humanDecision = 'approved';
  manifest.qualityGovernance = {standardId: 'CKAI_MARKET_TASTE_STANDARD_V1', architectureStatus: 'PASS', integrationStatus: 'PASS', machineTechnicalStatus: 'PASS', creativeQualityStatus: 'MARKET_READY', marketReadinessScore: 8, tasteGate: 'PASS', goldenCandidate: true, releaseCandidateEligible: true, humanCreativeDirectorVerdict: 'APPROVED'};
  manifest.unresolvedBlockers = [];
  manifest.publishHandoffStatus = 'READY';
  const verified = {pass: true, errors: [], derivedExportInputStatus: 'READY' as const};
  assert.equal(isPublishHandoffReady(manifest, verified), true);
  manifest.decodedVisualEquivalenceCheck = 'BLOCKED';
  assert.equal(isPublishHandoffReady(manifest, verified), false);
  manifest.decodedVisualEquivalenceCheck = 'PASS';
  manifest.decodedMediaEquivalence.visualSsimAll = 0.5;
  assert.equal(isPublishHandoffReady(manifest, verified), false);
});

test('technical PASS and Product Owner approval cannot bypass pending Market/Taste governance', () => {
  const input = loadTest0002ExportInput();
  const manifest = input.exportManifest;
  manifest.inputEligibility = 'production';
  manifest.mediaInspection = inspectExportMedia(manifest.outputPath);
  manifest.decodedMediaEquivalence = inspectDecodedMediaEquivalence(manifest.sourceReviewPreview, manifest.outputPath);
  manifest.outputSha256 = sha256(readFileSync(manifest.outputPath));
  manifest.exportReview = 'pass';
  manifest.humanDecision = 'approved';
  manifest.unresolvedBlockers = [];
  const verified = {pass: true, errors: [], derivedExportInputStatus: 'READY' as const};
  assert.equal(isPublishHandoffReady(manifest, verified), false);
  assert.equal(manifest.qualityGovernance.tasteGate, 'PENDING');
  assert.equal(manifest.qualityGovernance.releaseCandidateEligible, false);
});
