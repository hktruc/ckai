import type {
  AudioProductionContract,
  AudioSelectionContext,
  CanonicalMusicTrack,
  MusicBedSegment,
  MusicCandidate,
  SemanticSfxEvent,
} from './model';
import {loadCanonicalMusicLibrary, resolveCanonicalTrack} from './library';
import {existsSync, readFileSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {createHash} from 'node:crypto';

const weight = (value: string, high = 2, medium = 1): number => value === 'HIGH' ? high : value === 'MEDIUM' ? medium : 0;
const contains = (values: string[], pattern: RegExp): boolean => values.some((value) => pattern.test(value));

const supportFor = (track: CanonicalMusicTrack, context: AudioSelectionContext) => {
  const rationale: string[] = [];
  let score = weight(track.voice_friendliness, 4, 2) + weight(track.full_bed_suitability, 4, 2) + weight(track.editability) + weight(track.loopability);
  rationale.push(`voice friendliness ${track.voice_friendliness}`, `full-bed suitability ${track.full_bed_suitability}`);
  if (context.contentMode === 'THINKING') {
    score += track.reflective_fit * 2;
    rationale.push(`THINKING reflective support ${track.reflective_fit}/5`);
  } else {
    score += track.explainer_fit * 2 + track.tech_fit;
    rationale.push(`PRACTICAL explainer/tech support ${track.explainer_fit}/5 + ${track.tech_fit}/5`);
  }
  const signals = [...context.semanticIntent, ...context.emotionalTrajectory];
  if (contains(signals, /tension|investigat|căng|điều tra|mystery/i)) { score += track.darkness_1_to_5 + (track.primary_role.includes('TENSION') ? 3 : 0); rationale.push('supports stated tension/investigation trajectory'); }
  if (contains(signals, /reveal|payoff|mở ra|hé lộ|chốt/i) && track.editability === 'HIGH') { score += 2; rationale.push('editable for reveal/payoff'); }
  if (contains(signals, /clarity|explain|workflow|hướng dẫn|thực hành/i)) { score += track.explainer_fit; rationale.push('supports stated clarity/workflow intent'); }
  if (contains(signals, /uplift|momentum|tiến lên|động lực/i)) { score += track.uplift_fit; rationale.push('supports stated uplift/momentum intent'); }
  if (context.preferredFamilies?.includes(track.music_family)) { score += 2; rationale.push(`requested family candidate ${track.music_family}`); }
  if (context.priorApprovedTrackIds?.includes(track.library_track_id)) { score += 1; rationale.push('prior approved evidence used only as a bounded tie signal'); }
  const warnings = [track.content_id_status === 'UNKNOWN' ? 'Content ID claim status remains UNKNOWN' : ''].filter(Boolean);
  return {score, rationale, warnings};
};

export const rankMusicCandidates = (context: AudioSelectionContext, limit = 5, workspace = process.cwd()): MusicCandidate[] => {
  if (!context.contentId.trim()) throw new Error('Audio selection requires contentId');
  if (!(context.narration.durationSeconds > 0) || !/^[A-F0-9]{64}$/i.test(context.narration.sha256)) throw new Error('Audio selection requires actual narration duration and SHA-256');
  if (!context.semanticIntent.length || !context.emotionalTrajectory.length) throw new Error('Audio selection requires semantic intent and emotional trajectory');
  const tracks = loadCanonicalMusicLibrary(workspace).tracks;
  return tracks.map((track) => ({track, ...supportFor(track, context)}))
    .sort((a, b) => b.score - a.score || a.track.library_track_id.localeCompare(b.track.library_track_id))
    .slice(0, Math.max(1, Math.min(limit, tracks.length)))
    .map((value, index) => ({rank: index + 1, trackId: value.track.library_track_id, supportScore: value.score, rationale: value.rationale, warnings: value.warnings}));
};

export const createAudioProductionDraft = (context: AudioSelectionContext, workspace = process.cwd()): AudioProductionContract => ({
  schemaVersion: 'CKAI_AUDIO_PRODUCTION_V1', contentId: context.contentId, contentMode: context.contentMode,
  authority: {audioDirection: 'engine/audio-direction-v1.md', masteringPolicy: 'engine/short-form-mastering-policy.md', musicRegistry: 'content/references/audio/music-library-v1/03_catalog/music-library.json'},
  automationBoundary: {candidateRanking: 'AUTOMATABLE', bedMechanics: 'ASSISTED', semanticSfx: 'ASSISTED', technicalMastering: 'AUTOMATABLE', perceptualApproval: 'HUMAN_GATED'},
  narration: structuredClone(context.narration), semanticIntent: [...context.semanticIntent], emotionalTrajectory: [...context.emotionalTrajectory],
  music: {state: 'CANDIDATES_PENDING', candidates: rankMusicCandidates(context, 5, workspace), selectedTrackId: null, selectionRationale: null, audition: {status: 'REQUIRED', narrationSha256: context.narration.sha256, auditionArtifactPath: null, auditionArtifactSha256: null, reviewedBy: 'pending', reviewedAt: null, observation: null}},
  bed: {mode: 'PENDING_SELECTION', segments: [], voicePriority: true, arbitraryAutomationAllowed: false},
  sfx: {state: 'DECISION_PENDING', events: [], rationale: 'Human/production review must explicitly choose semantic events or NO_SFX.'},
  mix: {policyId: 'CKAI_SHORT_FORM_MASTERING_V1', renderState: 'NOT_RENDERED', technicalQa: 'PENDING'},
  qa: {provenance: 'PASS', narrationContextAudition: 'PENDING', phoneSpeakerTechnicalProxy: 'PENDING', phoneSpeakerHumanListening: 'PENDING', perceptualMixReview: 'PENDING'},
  humanCreativeApproval: {state: 'PENDING', by: 'pending', at: null, basis: null},
});

export const approveMusicCandidate = (contract: AudioProductionContract, input: {trackId: string; rationale: string; auditionArtifactPath: string; auditionArtifactSha256: string; narrationSha256: string; reviewedBy: 'chatgpt-work' | 'product-owner'; reviewedAt: string; observation: string}, workspace = process.cwd()): AudioProductionContract => {
  resolveCanonicalTrack(input.trackId, workspace);
  if (!contract.music.candidates.some((item) => item.trackId === input.trackId)) throw Object.assign(new Error('Selected music must be one of the ranked narration-context candidates'), {code: 'INVALID_MUSIC_SELECTION'});
  if (input.narrationSha256.toUpperCase() !== contract.narration.sha256.toUpperCase() || !input.auditionArtifactPath.trim()) throw Object.assign(new Error('Music approval requires an audition artifact using the actual narration SHA-256'), {code: 'NARRATION_CONTEXT_AUDITION_REQUIRED'});
  const workspaceRoot = resolve(workspace); const auditionPath = resolve(workspaceRoot, input.auditionArtifactPath);
  if (!(auditionPath === workspaceRoot || auditionPath.startsWith(`${workspaceRoot}${sep}`)) || !existsSync(auditionPath)) throw Object.assign(new Error('Narration-context audition artifact is missing or outside the workspace'), {code: 'NARRATION_CONTEXT_AUDITION_REQUIRED'});
  const actualAuditionSha = createHash('sha256').update(readFileSync(auditionPath)).digest('hex').toUpperCase();
  if (actualAuditionSha !== input.auditionArtifactSha256.toUpperCase()) throw Object.assign(new Error('Narration-context audition artifact checksum mismatch'), {code: 'NARRATION_CONTEXT_AUDITION_STALE'});
  if (!input.rationale.trim() || !input.observation.trim() || !Number.isFinite(Date.parse(input.reviewedAt))) throw new Error('Music approval requires rationale, listening observation and valid review timestamp');
  const next = structuredClone(contract);
  next.music = {...next.music, state: 'TRACK_APPROVED', selectedTrackId: input.trackId, selectionRationale: input.rationale, audition: {status: 'PASS', narrationSha256: input.narrationSha256.toUpperCase(), auditionArtifactPath: input.auditionArtifactPath, auditionArtifactSha256: actualAuditionSha, reviewedBy: input.reviewedBy, reviewedAt: input.reviewedAt, observation: input.observation}};
  next.qa.narrationContextAudition = 'PASS';
  return next;
};

export const chooseIntentionalSilence = (contract: AudioProductionContract, rationale: string): AudioProductionContract => {
  if (!rationale.trim()) throw new Error('Intentional silence requires a semantic rationale');
  const next = structuredClone(contract);
  next.music = {...next.music, state: 'INTENTIONAL_SILENCE', selectedTrackId: null, selectionRationale: rationale, audition: {...next.music.audition, status: 'PASS', auditionArtifactPath: null, observation: rationale}};
  next.bed = {mode: 'INTENTIONAL_SILENCE', segments: [{startSeconds: 0, endSeconds: next.narration.durationSeconds, behavior: 'SILENCE', gainDeltaDb: 0, semanticPurpose: rationale}], voicePriority: true, arbitraryAutomationAllowed: false};
  next.qa.narrationContextAudition = 'NOT_APPLICABLE';
  return next;
};

export const planMusicBed = (contract: AudioProductionContract, segments: MusicBedSegment[]): AudioProductionContract => {
  if (contract.music.state !== 'TRACK_APPROVED') throw Object.assign(new Error('Full-bed planning requires a human-approved music candidate'), {code: 'MUSIC_SELECTION_REQUIRED'});
  if (!segments.length || segments[0]?.startSeconds !== 0 || Math.abs(segments.at(-1)!.endSeconds - contract.narration.durationSeconds) > 0.05) throw new Error('Music bed must cover the complete narration timeline');
  let cursor = 0;
  for (const segment of segments) {
    if (Math.abs(segment.startSeconds - cursor) > 0.001 || segment.endSeconds <= segment.startSeconds || !segment.semanticPurpose.trim()) throw new Error('Music-bed segments must be contiguous, positive and semantically justified');
    if (segment.behavior === 'BASE' && segment.gainDeltaDb !== 0) throw new Error('BASE bed segments cannot carry hidden gain automation');
    if (segment.behavior === 'ATTENUATE' && !(segment.gainDeltaDb < 0)) throw new Error('ATTENUATE bed segments require an explicit negative content-specific gain delta');
    if (segment.behavior === 'SILENCE' && segment.gainDeltaDb !== 0) throw new Error('SILENCE bed segments use semantic muting, not an arbitrary gain value');
    if (segment.behavior !== 'BASE' && /volume automation|decorative|because it sounds good/i.test(segment.semanticPurpose)) throw new Error('Attenuation or silence cannot be decorative/arbitrary automation');
    cursor = segment.endSeconds;
  }
  const next = structuredClone(contract);
  next.bed = {mode: 'CONTINUOUS_FULL_BED', segments: structuredClone(segments), voicePriority: true, arbitraryAutomationAllowed: false};
  return next;
};

export const planSemanticSfx = (contract: AudioProductionContract, input: {decision: 'NO_SFX'; rationale: string} | {decision: 'CANDIDATES_PENDING' | 'APPROVED'; events: SemanticSfxEvent[]; rationale: string}): AudioProductionContract => {
  if (!input.rationale.trim()) throw new Error('Semantic SFX decision requires rationale');
  const next = structuredClone(contract);
  if (input.decision === 'NO_SFX') { next.sfx = {state: 'NO_SFX', events: [], rationale: input.rationale}; return next; }
  if (!input.events.length) throw new Error('Semantic SFX proposal requires at least one meaningful event; otherwise use NO_SFX');
  for (const event of input.events) {
    if (!event.semanticPurpose.trim() || !event.sceneId.trim() || event.atSeconds < 0 || event.atSeconds > contract.narration.durationSeconds) throw new Error(`${event.id} has invalid semantic SFX timing or purpose`);
    if (input.decision === 'APPROVED' && !event.assetId?.trim()) throw new Error(`${event.id} approved SFX requires a canonical/local asset ID`);
  }
  next.sfx = {state: input.decision, events: structuredClone(input.events), rationale: input.rationale};
  return next;
};

export const deriveContentMode = (semanticArchetypes: string[]): {mode: 'THINKING' | 'PRACTICAL'; rationale: string} => {
  const thinking = semanticArchetypes.filter((value) => /thesis|investigation|reflection|warning|contrast/i.test(value)).length;
  const practical = semanticArchetypes.filter((value) => /evidence|transformation|consequence|conclusion/i.test(value)).length;
  return thinking > practical ? {mode: 'THINKING', rationale: 'More reasoning/reflection archetypes than action/result archetypes'} : {mode: 'PRACTICAL', rationale: 'Action/result archetypes are equal or dominant'};
};
