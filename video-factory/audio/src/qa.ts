import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import type {AudioProductionContract} from './model';
import {canonicalTrackAudioPath, loadCanonicalMusicLibrary, resolveCanonicalTrack} from './library';

export const validateAudioProductionContract = (contract: AudioProductionContract, options: {workspace?: string; requireRender?: boolean; requireHumanApproval?: boolean} = {}) => {
  const workspace = options.workspace ?? process.cwd();
  const errors: string[] = [];
  try { loadCanonicalMusicLibrary(workspace); } catch (error) { errors.push((error as Error).message); }
  if (contract.schemaVersion !== 'CKAI_AUDIO_PRODUCTION_V1') errors.push('Audio production schema is invalid');
  if (!contract.contentId.trim() || !(contract.narration.durationSeconds > 0) || !/^[A-F0-9]{64}$/i.test(contract.narration.sha256)) errors.push('Audio contract narration identity is invalid');
  const narrationPath = resolve(workspace, contract.narration.sourcePath);
  if (!existsSync(narrationPath)) errors.push('Canonical narration source is missing');
  else if (createHash('sha256').update(readFileSync(narrationPath)).digest('hex').toUpperCase() !== contract.narration.sha256.toUpperCase()) errors.push('Canonical narration source checksum mismatch');
  if (contract.authority.musicRegistry !== 'content/references/audio/music-library-v1/03_catalog/music-library.json') errors.push('Audio contract must use the canonical Music Library registry');
  if (contract.music.state === 'CANDIDATES_PENDING') errors.push('Human music selection is pending');
  if (contract.music.state === 'TRACK_APPROVED') {
    try {
      const track = resolveCanonicalTrack(contract.music.selectedTrackId ?? '', workspace);
      if (!existsSync(resolve(workspace, canonicalTrackAudioPath(track)))) errors.push('Selected canonical music asset is missing');
    } catch (error) { errors.push((error as Error).message); }
    if (contract.music.audition.status !== 'PASS' || contract.music.audition.narrationSha256.toUpperCase() !== contract.narration.sha256.toUpperCase() || !contract.music.audition.auditionArtifactPath || !contract.music.audition.auditionArtifactSha256) errors.push('Selected music lacks actual-narration audition evidence');
    else {
      const auditionPath = resolve(workspace, contract.music.audition.auditionArtifactPath);
      if (!existsSync(auditionPath)) errors.push('Narration-context audition artifact is missing');
      else if (createHash('sha256').update(readFileSync(auditionPath)).digest('hex').toUpperCase() !== contract.music.audition.auditionArtifactSha256.toUpperCase()) errors.push('Narration-context audition artifact checksum mismatch');
    }
    if (contract.bed.mode !== 'CONTINUOUS_FULL_BED' || !contract.bed.segments.length) errors.push('Approved music requires a complete bed plan');
  }
  if (contract.music.state === 'INTENTIONAL_SILENCE' && contract.bed.mode !== 'INTENTIONAL_SILENCE') errors.push('Intentional music silence must be explicit in the bed plan');
  if (contract.sfx.state === 'NO_SFX' && contract.sfx.events.length) errors.push('NO_SFX cannot contain events');
  if (contract.sfx.state === 'DECISION_PENDING' || contract.sfx.state === 'CANDIDATES_PENDING') errors.push('Semantic SFX review is pending');
  if (contract.sfx.state === 'APPROVED' && contract.sfx.events.some((event) => !event.assetId)) errors.push('Approved semantic SFX event has no asset ID');
  if (contract.qa.phoneSpeakerHumanListening === 'PASS' && contract.qa.phoneSpeakerTechnicalProxy !== 'PASS') errors.push('Phone human listening cannot pass before the technical proxy artifact exists');
  if (options.requireRender && (contract.mix.renderState !== 'RENDERED' || contract.mix.technicalQa !== 'PASS' || contract.qa.phoneSpeakerTechnicalProxy !== 'PASS')) errors.push('Rendered audio requires mix QA and phone-speaker technical proxy PASS');
  if (options.requireHumanApproval && (contract.humanCreativeApproval.state !== 'APPROVED' || contract.qa.phoneSpeakerHumanListening !== 'PASS' || contract.qa.perceptualMixReview !== 'PASS')) errors.push('Product Owner/ChatGPT human audio approval is required');
  return {pass: errors.length === 0, errors};
};
