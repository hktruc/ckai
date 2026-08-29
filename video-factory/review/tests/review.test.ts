import assert from 'node:assert/strict';
import {mkdirSync, readFileSync, rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {relative, resolve} from 'node:path';
import {test} from 'node:test';

import {validateFinishingAudio} from '../src/assets';
import {finishingGainAtTime, linearGain} from '../src/mix';
import {deriveCaptions, deriveSegmentCaptions, validateCaptions, wrapCaption} from '../src/captions';
import {isExportHandoffReady} from '../src/gates';
import {probeVideo} from '../src/media';
import {runReviewQa} from '../src/qa';
import {routeIssue, validateIssues} from '../src/routing';
import {verifyReviewUpstream} from '../src/upstream';
import {createTest0002ReviewManifest} from '../src/manifest/test0002';
import {TEST_0002} from '../../animation/src/manifest/test0002';
import type {VoicePlan} from '../../voice/src/model';
import {resolveFfmpeg} from '../../shared/media-tools';

const loadVoicePlan = (): VoicePlan => JSON.parse(
  readFileSync('generated/voice/TEST-0002/voice-plan.generated.json', 'utf8'),
) as VoicePlan;

test('captions preserve exact Spoken Copy and Voice timing', () => {
  const plan = loadVoicePlan();
  const review = createTest0002ReviewManifest(plan);
  review.captions = deriveCaptions(plan, review.captionPolicy);
  const errors = validateCaptions(review, plan);
  assert.deepEqual(errors, []);
  for (const segment of plan.segments) {
    const cues = review.captions.filter((cue) => cue.voiceSegmentId === segment.id);
    assert.equal(cues.map((cue) => cue.sourceText).join(' ').replace(/\s+/g, ' ').trim(), segment.originalText.replace(/\s+/g, ' ').trim());
    assert.ok(cues.every((cue) => cue.startSeconds >= segment.slotStartSeconds && cue.endSeconds <= segment.slotEndSeconds));
  }
});

test('caption overflow and protected-zone collision are blocked', () => {
  assert.throws(() => wrapCaption('motcuctukhongthexuongdongviquadai', 12, 2), /token|width/i);
  const plan = loadVoicePlan();
  const review = createTest0002ReviewManifest(plan);
  const first = review.captions[0]!;
  review.captionPolicy.protectedZones[first.sceneId] = [first.zone];
  assert.match(validateCaptions(review, plan).join('\n'), /collides|protected/i);
});

test('long Vietnamese Spoken Copy is split into multiple two-line cues', () => {
  const segment = {...loadVoicePlan().segments[0]};
  segment.originalText = 'Ví dụ: doanh thu giảm hai mươi phần trăm, và công ty vừa đổi mẫu quảng cáo. Hai việc xảy ra gần nhau chưa đủ để nói quảng cáo là nguyên nhân.';
  segment.slotStartSeconds = 0;
  segment.slotEndSeconds = 9;
  segment.measuredDurationSeconds = 7.8;
  const cues = deriveSegmentCaptions(segment, 'lower-safe', 28, 2);
  assert.ok(cues.length > 1);
  assert.ok(cues.every((cue) => cue.lines.length <= 2 && cue.lines.every((line) => line.length <= 28)));
  assert.equal(cues.map((cue) => cue.sourceText).join(' '), segment.originalText);
});

test('music/SFX none is valid; missing or unlicensed local assets are blocked', () => {
  const review = createTest0002ReviewManifest(loadVoicePlan());
  assert.deepEqual(validateFinishingAudio(review, 'reverse-audit-proof'), []);
  review.musicMode = 'local-approved';
  review.finishingAudioAssets = [{
    id: 'MUS-01', type: 'music', localPath: 'video-factory/review/assets/missing.wav',
    source: 'local library', provenance: 'unverified test source', purpose: 'optional background music', licenseStatus: 'unknown',
    startSeconds: 0, durationSeconds: 10, gainDb: -18, required: true, sha256: '0'.repeat(64),
  }];
  assert.match(validateFinishingAudio(review, 'production').join('\n'), /missing|license|licensed/i);
});

test('local finishing audio must be audible, rights-traceable and voice-first', () => {
  const directory = resolve('generated/review-audio-test'); mkdirSync(directory, {recursive: true});
  const audible = `${directory}/audible.wav`; const silent = `${directory}/silent.wav`;
  try {
    const ffmpeg=resolveFfmpeg();
    assert.equal(spawnSync(ffmpeg, ['-hide_banner','-loglevel','error','-y','-f','lavfi','-i','sine=frequency=220:sample_rate=48000:duration=2','-ac','2',audible]).status, 0);
    assert.equal(spawnSync(ffmpeg, ['-hide_banner','-loglevel','error','-y','-f','lavfi','-i','anullsrc=r=48000:cl=stereo','-t','2',silent]).status, 0);
    const review = createTest0002ReviewManifest(loadVoicePlan()); review.musicMode = 'local-approved';
    const base = {id:'MUS-01',type:'music' as const,source:'CKAI deterministic local fixture',provenance:'Generated locally for mix QA; no external provider',purpose:'restrained continuous test bed',licenseStatus:'test-only' as const,startSeconds:0,durationSeconds:2,gainDb:-18,fadeInSeconds:.5,fadeOutSeconds:.5,duckUnderVoiceDb:-8,required:true};
    review.finishingAudioAssets = [{...base,localPath:relative(process.cwd(), audible).replaceAll('\\','/'),sha256:createHash('sha256').update(readFileSync(audible)).digest('hex').toUpperCase()}];
    assert.deepEqual(validateFinishingAudio(review, 'reverse-audit-proof', 49), []);
    const asset = review.finishingAudioAssets[0]!;
    assert.equal(finishingGainAtTime(asset, 0), 0);
    assert.ok(Math.abs(finishingGainAtTime(asset, 1, [{startSeconds:.75,endSeconds:1.25}]) - linearGain(-26)) < 1e-9);
    review.finishingAudioAssets[0] = {...asset,localPath:relative(process.cwd(), silent).replaceAll('\\','/'),sha256:createHash('sha256').update(readFileSync(silent)).digest('hex').toUpperCase()};
    assert.match(validateFinishingAudio(review, 'reverse-audit-proof', 49).join('\n'), /effectively silent/i);
  } finally { rmSync(directory, {recursive:true,force:true}); }
});

test('review issues route to the owning upstream layer', () => {
  assert.equal(routeIssue('claim-script'), 'script');
  assert.equal(routeIssue('segmentation'), 'storyboard');
  assert.equal(routeIssue('visual-concept'), 'visual-director');
  assert.equal(routeIssue('animation-mechanics'), 'animation');
  assert.equal(routeIssue('voice-pronunciation-timing'), 'voice');
  assert.equal(routeIssue('caption-mix-finishing'), 'finishing');
  assert.deepEqual(validateIssues([{id: 'ISS-01', severity: 'major', status: 'open', returnTo: 'voice', reason: 'Timing lệch', requiredCorrection: 'Sửa Voice timing'}]), []);
});

test('TEST-0002 reverse-audit passes proof checks but never gains Export authority', () => {
  const voicePlan = loadVoicePlan();
  const input = {review: createTest0002ReviewManifest(voicePlan), voicePlan, animation: TEST_0002};
  const upstream = verifyReviewUpstream(input, 'reverse-audit-proof');
  const qa = runReviewQa(input, 'reverse-audit-proof', false);
  assert.equal(upstream.pass, true, upstream.errors.join('\n'));
  assert.equal(upstream.derivedReviewInputStatus, 'BLOCKED');
  assert.equal(qa.pass, true, qa.errors.join('\n'));
  assert.equal(isExportHandoffReady(input.review, upstream), false);
  assert.equal(input.review.exportHandoffStatus, 'BLOCKED');
});

test('forged or stale upstream data is blocked even when copied state says READY', () => {
  const voicePlan = loadVoicePlan();
  const review = createTest0002ReviewManifest(voicePlan);
  review.sourceChain.find((item) => item.stage === 'voice')!.sha256 = '0'.repeat(64);
  const result = verifyReviewUpstream({review, voicePlan, animation: TEST_0002}, 'reverse-audit-proof');
  assert.equal(result.pass, false);
  assert.equal(result.derivedReviewInputStatus, 'BLOCKED');
  assert.match(result.errors.join('\n'), /checksum|voice/i);
});

test('production Export READY is the full hard conjunction', () => {
  const review = createTest0002ReviewManifest(loadVoicePlan());
  review.inputEligibility = 'production';
  review.humanDecision = 'approved';
  review.exportHandoffStatus = 'READY';
  const verified = {pass: true, errors: [] as string[], derivedReviewInputStatus: 'READY' as const};
  assert.equal(isExportHandoffReady(review, verified), true);
  review.truthEvidenceCheck = 'BLOCKED';
  assert.equal(isExportHandoffReady(review, verified), false);
});

test('Voice acceptance opens STEP07 input but cannot open STEP08', () => {
  const review = createTest0002ReviewManifest(loadVoicePlan());
  review.inputEligibility = 'production'; review.finalReview = 'pending'; review.humanDecision = 'pending'; review.exportHandoffStatus = 'BLOCKED';
  const acceptedVoiceInput = {pass:true,errors:[] as string[],derivedReviewInputStatus:'READY' as const};
  assert.equal(isExportHandoffReady(review, acceptedVoiceInput), false);
});

test('Final Review technical PASS alone cannot open STEP08; delegated Final Review acceptance is required', () => {
  const review = createTest0002ReviewManifest(loadVoicePlan());
  review.inputEligibility = 'production'; review.finalReview = 'pass'; review.humanDecision = 'pending'; review.exportHandoffStatus = 'BLOCKED';
  const acceptedVoiceInput = {pass:true,errors:[] as string[],derivedReviewInputStatus:'READY' as const};
  assert.equal(isExportHandoffReady(review, acceptedVoiceInput), false);
  review.humanDecision = 'approved';
  assert.equal(isExportHandoffReady(review, acceptedVoiceInput), true);
});

test('caller-supplied acceptance-like fields cannot promote Final Review', () => {
  const review = createTest0002ReviewManifest(loadVoicePlan()) as ReturnType<typeof createTest0002ReviewManifest> & {decision?:string;approvedBy?:string;basis?:string};
  review.inputEligibility = 'production'; review.finalReview = 'pass'; review.humanDecision = 'pending'; review.exportHandoffStatus = 'BLOCKED';
  Object.assign(review, {decision:'approved',approvedBy:'chatgpt-work',basis:'caller payload only'});
  assert.equal(isExportHandoffReady(review, {pass:true,errors:[],derivedReviewInputStatus:'READY'}), false);
});

test('existing TEST-0002 media remains 9:16, 30fps, audio-present and under 60s', () => {
  const metadata = probeVideo('generated/previews/TEST-0002-voice.mp4');
  assert.equal(metadata.width, 1080);
  assert.equal(metadata.height, 1920);
  assert.equal(metadata.fps, 30);
  assert.ok(metadata.durationSeconds < 60);
  assert.ok(metadata.audioCodec.length > 0);
});


