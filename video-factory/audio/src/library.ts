import {existsSync, readFileSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {createHash} from 'node:crypto';
import type {CanonicalMusicLibrary, CanonicalMusicTrack} from './model';

export const MUSIC_LIBRARY_REGISTRY = 'content/references/audio/music-library-v1/03_catalog/music-library.json' as const;
export const MUSIC_LIBRARY_ROOT = 'content/references/audio/music-library-v1' as const;

const sha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase();

export const loadCanonicalMusicLibrary = (workspace = process.cwd()): CanonicalMusicLibrary => {
  const registryPath = resolve(workspace, MUSIC_LIBRARY_REGISTRY);
  const library = JSON.parse(readFileSync(registryPath, 'utf8')) as CanonicalMusicLibrary;
  const errors: string[] = [];
  if (library.schema_version !== 'CKAI_MUSIC_LIBRARY_V1' || library.library_id !== 'CKAI_MUSIC_LIBRARY_V1') errors.push('Music registry identity is invalid');
  if (library.current_track_count !== 22 || library.downloaded_audio_count !== 22 || library.tracks.length !== 22) errors.push('Music Library V1 must resolve exactly 22/22 canonical tracks');
  if (new Set(library.tracks.map((track) => track.library_track_id)).size !== library.tracks.length) errors.push('Music registry contains duplicate track IDs');
  const root = resolve(workspace, MUSIC_LIBRARY_ROOT);
  for (const track of library.tracks) {
    const audio = resolve(root, track.local_file_path);
    const license = resolve(root, track.license_evidence_path);
    const evidence = resolve(root, track.track_evidence_path);
    if (!(audio === root || audio.startsWith(`${root}${sep}`))) errors.push(`${track.library_track_id} escapes the canonical library root`);
    if (track.download_status !== 'DOWNLOADED_VERIFIED' || !existsSync(audio)) errors.push(`${track.library_track_id} canonical audio is unavailable`);
    else if (sha256(audio) !== track.sha256.toUpperCase()) errors.push(`${track.library_track_id} audio checksum mismatch`);
    if (!existsSync(license) || !existsSync(evidence)) errors.push(`${track.library_track_id} provenance evidence is incomplete`);
  }
  if (errors.length) throw Object.assign(new Error(errors.join('\n')), {code: 'AUDIO_PROVENANCE_BLOCKED'});
  return library;
};

export const resolveCanonicalTrack = (trackId: string, workspace = process.cwd()): CanonicalMusicTrack => {
  const track = loadCanonicalMusicLibrary(workspace).tracks.find((item) => item.library_track_id === trackId);
  if (!track) throw Object.assign(new Error(`Unknown canonical music track: ${trackId}`), {code: 'INVALID_MUSIC_LIBRARY_REFERENCE'});
  return track;
};

export const canonicalTrackAudioPath = (track: CanonicalMusicTrack): string => `${MUSIC_LIBRARY_ROOT}/${track.local_file_path}`;
