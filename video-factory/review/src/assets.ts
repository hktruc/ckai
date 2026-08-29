import {existsSync, readFileSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {sha256} from '../../voice/src/segment';
import {probeAudio, probeAudioLevels} from '../../voice/src/media';
import type {FinalReviewManifest, ReviewMode} from './model';

export const validateFinishingAudio = (review: FinalReviewManifest, mode: ReviewMode, timelineSeconds?: number): string[] => {
  const errors: string[] = [];
  const workspace = resolve(process.cwd());
  const allowedRoots = [resolve(workspace, 'generated'), resolve(workspace, 'video-factory/review/assets')];
  for (const type of ['music', 'sfx'] as const) {
    const modeValue = type === 'music' ? review.musicMode : review.sfxMode;
    const assets = review.finishingAudioAssets.filter((asset) => asset.type === type);
    if (modeValue === 'none' && assets.length) errors.push(`${type} mode none cannot contain ${type} assets`);
    if (modeValue === 'local-approved' && !assets.length) errors.push(`${type} local-approved requires at least one local asset`);
  }
  for (const asset of review.finishingAudioAssets) {
    if (/^[a-z]+:\/\//i.test(asset.localPath)) { errors.push(`${asset.id} must use a local path`); continue; }
    const absolute = resolve(workspace, asset.localPath);
    if (!allowedRoots.some((root) => absolute === root || absolute.startsWith(`${root}${sep}`))) errors.push(`${asset.id} path is outside controlled finishing roots`);
    if (!asset.source.trim() || !asset.provenance.trim() || !asset.purpose.trim()) errors.push(`${asset.id} needs source, provenance and semantic purpose`);
    if (asset.licenseStatus === 'unknown') errors.push(`${asset.id} has unknown licensing/provenance`);
    if (mode === 'production' && asset.licenseStatus !== 'approved') errors.push(`${asset.id} is not licensed for production`);
    if (asset.unresolvedIssue) errors.push(`${asset.id} has unresolved issue: ${asset.unresolvedIssue}`);
    if (!existsSync(absolute)) { errors.push(`${asset.id} audio asset is missing`); continue; }
    if (sha256(readFileSync(absolute)) !== asset.sha256) errors.push(`${asset.id} checksum mismatch`);
    if (asset.type === 'music' && asset.gainDb > -12) errors.push(`${asset.id} music gain exceeds voice-dominant ceiling -12 dB`);
    if (asset.type === 'sfx' && asset.gainDb > -3) errors.push(`${asset.id} SFX gain exceeds technical ceiling -3 dB`);
    if (asset.startSeconds < 0 || (asset.durationSeconds !== undefined && asset.durationSeconds <= 0)) errors.push(`${asset.id} timing is invalid`);
    if ((asset.fadeInSeconds ?? 0) < 0 || (asset.fadeOutSeconds ?? 0) < 0) errors.push(`${asset.id} fade timing is invalid`);
    if (asset.durationSeconds !== undefined && (asset.fadeInSeconds ?? 0) + (asset.fadeOutSeconds ?? 0) > asset.durationSeconds) errors.push(`${asset.id} fades exceed its scheduled duration`);
    if (timelineSeconds !== undefined && asset.startSeconds + (asset.durationSeconds ?? 0) > timelineSeconds + 0.05) errors.push(`${asset.id} exceeds the canonical timeline`);
    if (asset.type === 'music' && (asset.duckUnderVoiceDb ?? -8) > -3) errors.push(`${asset.id} music ducking must preserve voice-first priority`);
    if (asset.type === 'sfx' && (!asset.sceneId?.trim() || !asset.cueType)) errors.push(`${asset.id} SFX requires a traceable scene and semantic cue type`);
    try {
      const media = probeAudio(absolute); const levels = probeAudioLevels(absolute);
      if (media.sampleRate !== 48000 || ![1, 2].includes(media.channels)) errors.push(`${asset.id} must decode as 48 kHz mono/stereo before mixing`);
      if (asset.durationSeconds !== undefined && asset.durationSeconds > media.duration + 0.05) errors.push(`${asset.id} scheduled duration exceeds decoded asset duration`);
      if (levels.meanVolumeDb < -70 || levels.maxVolumeDb < -60) errors.push(`${asset.id} is effectively silent`);
      if (levels.maxVolumeDb > 0.1 || levels.zeroDbSampleRatio > 0.005) errors.push(`${asset.id} has clipping indicators before mixing`);
    } catch (error) { errors.push(`${asset.id} audio inspection failed: ${(error as Error).message}`); }
  }
  return errors;
};
