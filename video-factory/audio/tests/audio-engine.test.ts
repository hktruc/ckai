import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  approveMusicCandidate,
  chooseIntentionalSilence,
  createAudioProductionDraft,
  deriveContentMode,
  loadCanonicalMusicLibrary,
  planMusicBed,
  planSemanticSfx,
  rankMusicCandidates,
  validateAudioProductionContract,
  type AudioSelectionContext,
} from '../src';
import {attachAudioProductionPlan} from '../../review/src/audio-engine';
import {createTest0002ReviewManifest} from '../../review/src/manifest/test0002';
import type {VoicePlan} from '../../voice/src/model';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const NARRATION_PATH = 'generated/voice/TEST-0002/master.wav';
const AUDITION_PATH = 'generated/previews/TEST-0002-voice.mp4';
const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase();
const NARRATION_SHA = hash(NARRATION_PATH);
const AUDITION_SHA = hash(AUDITION_PATH);

const context = (mode: 'THINKING' | 'PRACTICAL' = 'THINKING'): AudioSelectionContext => ({
  contentId: 'AUDIO-ENGINE-FIXTURE', contentMode: mode,
  narration: {sourcePath: NARRATION_PATH, sha256: NARRATION_SHA, durationSeconds: 49, density: 'MEDIUM'},
  semanticIntent: mode === 'THINKING' ? ['investigation', 'reveal'] : ['workflow', 'clarity'],
  emotionalTrajectory: mode === 'THINKING' ? ['tension', 'resolution'] : ['momentum', 'confirmation'],
});

test('canonical resolver validates exactly 22 unique local tracks with provenance', () => {
  const library = loadCanonicalMusicLibrary();
  assert.equal(library.tracks.length, 22);
  assert.equal(new Set(library.tracks.map((track) => track.library_track_id)).size, 22);
  assert.ok(library.tracks.every((track) => track.download_status === 'DOWNLOADED_VERIFIED' && track.license_evidence_path && track.track_evidence_path));
});

test('candidate selection is deterministic support ranking, never final approval', () => {
  const first = rankMusicCandidates(context());
  const second = rankMusicCandidates(context());
  assert.deepEqual(first, second);
  assert.equal(first.length, 5);
  assert.ok(first.every((candidate, index) => candidate.rank === index + 1 && candidate.rationale.length > 0));
  assert.equal(createAudioProductionDraft(context()).music.state, 'CANDIDATES_PENDING');
});

test('THINKING and PRACTICAL use one engine with lightweight routing signals', () => {
  assert.match(rankMusicCandidates(context('THINKING'))[0]!.rationale.join(' '), /THINKING/);
  assert.match(rankMusicCandidates(context('PRACTICAL'))[0]!.rationale.join(' '), /PRACTICAL/);
  assert.equal(deriveContentMode(['investigation-verification', 'reflection-insight']).mode, 'THINKING');
  assert.equal(deriveContentMode(['transformation', 'consequence-payoff']).mode, 'PRACTICAL');
});

test('invalid or unranked track selection is rejected', () => {
  const draft = createAudioProductionDraft(context());
  assert.throws(() => approveMusicCandidate(draft, {trackId: 'CKAI-MUSIC-9999', rationale: 'x', auditionArtifactPath: AUDITION_PATH, auditionArtifactSha256: AUDITION_SHA, narrationSha256: NARRATION_SHA, reviewedBy: 'chatgpt-work', reviewedAt: '2026-08-29T10:00:00+07:00', observation: 'x'}), /Unknown canonical music track/);
});

test('music approval requires an audition bound to the actual narration', () => {
  const draft = createAudioProductionDraft(context());
  assert.throws(() => approveMusicCandidate(draft, {trackId: draft.music.candidates[0]!.trackId, rationale: 'supports the arc', auditionArtifactPath: AUDITION_PATH, auditionArtifactSha256: AUDITION_SHA, narrationSha256: 'B'.repeat(64), reviewedBy: 'chatgpt-work', reviewedAt: '2026-08-29T10:00:00+07:00', observation: 'voice remains clear'}), /actual narration/i);
  assert.throws(() => approveMusicCandidate(draft, {trackId: draft.music.candidates[0]!.trackId, rationale: 'supports the arc', auditionArtifactPath: AUDITION_PATH, auditionArtifactSha256: 'B'.repeat(64), narrationSha256: NARRATION_SHA, reviewedBy: 'chatgpt-work', reviewedAt: '2026-08-29T10:00:00+07:00', observation: 'voice remains clear'}), /checksum mismatch/i);
});

test('missing narration fails visibly even for an otherwise valid no-music plan', () => {
  const plan = chooseIntentionalSilence(createAudioProductionDraft(context()), 'Intentional narration-only treatment.');
  plan.narration.sourcePath = 'generated/voice/MISSING/master.wav';
  const qa = validateAudioProductionContract(plan);
  assert.equal(qa.pass, false);
  assert.match(qa.errors.join('\n'), /narration source is missing/i);
});

test('approved candidate supports a complete semantic full-bed plan', () => {
  let plan = createAudioProductionDraft(context());
  plan = approveMusicCandidate(plan, {trackId: plan.music.candidates[0]!.trackId, rationale: 'supports the whole reasoning arc', auditionArtifactPath: AUDITION_PATH, auditionArtifactSha256: AUDITION_SHA, narrationSha256: NARRATION_SHA, reviewedBy: 'chatgpt-work', reviewedAt: '2026-08-29T10:00:00+07:00', observation: 'music remains perceptible without masking narration'});
  plan = planMusicBed(plan, [
    {startSeconds: 0, endSeconds: 35, behavior: 'BASE', gainDeltaDb: 0, semanticPurpose: 'continuous musical identity'},
    {startSeconds: 35, endSeconds: 42, behavior: 'ATTENUATE', gainDeltaDb: -3, semanticPurpose: 'protect the dense caveat'},
    {startSeconds: 42, endSeconds: 49, behavior: 'BASE', gainDeltaDb: 0, semanticPurpose: 'deliberate payoff return'},
  ]);
  assert.equal(plan.bed.mode, 'CONTINUOUS_FULL_BED');
  assert.equal(plan.qa.narrationContextAudition, 'PASS');
});

test('NO_SFX and intentional music silence are valid explicit decisions', () => {
  let plan = chooseIntentionalSilence(createAudioProductionDraft(context()), 'Silence is the intended semantic frame for this fixture.');
  plan = planSemanticSfx(plan, {decision: 'NO_SFX', rationale: 'No event benefits from an accent.'});
  assert.equal(plan.sfx.state, 'NO_SFX');
  assert.equal(validateAudioProductionContract(plan).pass, true);
});

test('semantic SFX proposals require meaningful bounded events and approved assets', () => {
  const draft = createAudioProductionDraft(context());
  assert.throws(() => planSemanticSfx(draft, {decision: 'CANDIDATES_PENDING', events: [], rationale: 'decorate cuts'}), /at least one meaningful event/i);
  assert.throws(() => planSemanticSfx(draft, {decision: 'APPROVED', rationale: 'one reveal', events: [{id: 'SFX-01', eventType: 'REVEAL', sceneId: 'SC-02', atSeconds: 7, semanticPurpose: 'mark the evidence reveal', assetId: null}]}), /asset ID/);
});

test('render and human creative gates stay separate from technical planning', () => {
  let plan = chooseIntentionalSilence(createAudioProductionDraft(context()), 'Intentional unscored narration.');
  plan = planSemanticSfx(plan, {decision: 'NO_SFX', rationale: 'No semantic event requires an accent.'});
  assert.equal(validateAudioProductionContract(plan, {requireRender: true}).pass, false);
  plan.mix = {policyId: 'CKAI_SHORT_FORM_MASTERING_V1', renderState: 'RENDERED', technicalQa: 'PASS'};
  plan.qa.phoneSpeakerTechnicalProxy = 'PASS';
  assert.equal(validateAudioProductionContract(plan, {requireRender: true}).pass, true);
  assert.equal(validateAudioProductionContract(plan, {requireRender: true, requireHumanApproval: true}).pass, false);
  plan.qa.phoneSpeakerHumanListening = 'PASS'; plan.qa.perceptualMixReview = 'PASS';
  plan.humanCreativeApproval = {state: 'APPROVED', by: 'product-owner', at: '2026-08-29T10:30:00+07:00', basis: 'Listened to actual decoded mix on phone speaker.'};
  assert.equal(validateAudioProductionContract(plan, {requireRender: true, requireHumanApproval: true}).pass, true);
});

test('contract serialization is deterministic for identical inputs', () => {
  assert.equal(JSON.stringify(createAudioProductionDraft(context())), JSON.stringify(createAudioProductionDraft(context())));
});

test('Audio Engine extends the canonical Final Review contract without a parallel manifest', () => {
  const voicePlan = JSON.parse(readFileSync('generated/voice/TEST-0002/voice-plan.generated.json', 'utf8')) as VoicePlan;
  const review = createTest0002ReviewManifest(voicePlan);
  let plan = chooseIntentionalSilence(createAudioProductionDraft({...context(), contentId: 'TEST-0002'}), 'Fixture intentionally uses narration only.');
  plan = planSemanticSfx(plan, {decision: 'NO_SFX', rationale: 'Reverse-audit fixture contains no semantic SFX.'});
  const attached = attachAudioProductionPlan(review, plan, []);
  assert.equal(attached.audioProduction.schemaVersion, 'CKAI_AUDIO_PRODUCTION_V1');
  assert.equal(attached.musicMode, 'none');
  assert.equal(attached.sfxMode, 'none');
  assert.equal(attached.reviewPreview.audioMixMode, 'voice-only');
});
