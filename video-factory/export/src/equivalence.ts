import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {devNull} from 'node:os';
import {resolveFfmpeg} from '../../shared/media-tools';
import {probeAudio, probeAudioLevels} from '../../voice/src/media';
import {sha256} from '../../voice/src/segment';
import {reviewDigests} from './digests';
import type {DecodedMediaEquivalence, ExportManifest, ExportMediaInspection} from './model';

export const VISUAL_SSIM_ALL_MINIMUM = 0.98;
export const VISUAL_SSIM_CHANNEL_MINIMUM = 0.97;
export const AUDIO_MEAN_LEVEL_DELTA_DB_MAXIMUM = 3;
export const AUDIO_MAX_LEVEL_DELTA_DB_MAXIMUM = 3;
export const AUDIO_LONGEST_SILENCE_INCREASE_SECONDS_MAXIMUM = 0.5;

const silenceDurations = (path: string): number[] => {
  const result = spawnSync(resolveFfmpeg(), ['-hide_banner', '-i', path, '-map', '0:a:0', '-af', 'silencedetect=noise=-55dB:d=0.75', '-f', 'null', devNull], {encoding: 'utf8', timeout: 180_000});
  if (result.status !== 0) throw new Error(`Decoded audio silence analysis failed: ${path}`);
  return [...result.stderr.matchAll(/silence_duration:\s*(\d+(?:\.\d+)?)/g)].map((match) => Number(match[1]));
};

export const inspectDecodedMediaEquivalence = (source: string, output: string, comparisonDurationSeconds?: number): DecodedMediaEquivalence => {
  const trim = comparisonDurationSeconds === undefined ? [] : ['-t', String(comparisonDurationSeconds)];
  const filter = '[0:v]scale=1080:1920:in_range=auto:out_range=tv,format=yuv420p,fps=30,settb=AVTB,setpts=N/(30*TB)[source];[1:v]scale=1080:1920:in_range=auto:out_range=tv,format=yuv420p,fps=30,settb=AVTB,setpts=N/(30*TB)[output];[source][output]ssim';
  const visual = spawnSync(resolveFfmpeg(), ['-hide_banner', ...trim, '-i', source, ...trim, '-i', output, '-filter_complex', filter, '-an', '-f', 'null', devNull], {encoding: 'utf8', timeout: 180_000});
  if (visual.status !== 0) throw new Error(`Decoded visual equivalence analysis failed: ${visual.stderr.trim()}`);
  const metric = [...visual.stderr.matchAll(/SSIM Y:(\d+(?:\.\d+)?) \([^)]*\) U:(\d+(?:\.\d+)?) \([^)]*\) V:(\d+(?:\.\d+)?) \([^)]*\) All:(\d+(?:\.\d+)?)/g)].at(-1);
  const frames = [...visual.stderr.matchAll(/frame=\s*(\d+)/g)].at(-1);
  if (!metric || !frames) throw new Error('FFmpeg did not emit decoded SSIM/frame metrics');

  const sourceAudio = probeAudio(source);
  const outputAudio = probeAudio(output);
  const sourceLevels = probeAudioLevels(source);
  const outputLevels = probeAudioLevels(output);
  const sourceSilence = silenceDurations(source);
  const outputSilence = silenceDurations(output);
  const sourceLongestSilence = Math.max(0, ...sourceSilence);
  const outputLongestSilence = Math.max(0, ...outputSilence);
  return {
    comparisonScope: 'full-video', normalization: '1080x1920-yuv420p-tv-cfr30-common-timebase', comparedFrames: Number(frames[1]),
    visualSsimY: Number(metric[1]), visualSsimU: Number(metric[2]), visualSsimV: Number(metric[3]), visualSsimAll: Number(metric[4]),
    visualThresholdAll: VISUAL_SSIM_ALL_MINIMUM, visualThresholdChannel: VISUAL_SSIM_CHANNEL_MINIMUM,
    sourceAudioDurationSeconds: sourceAudio.duration, sourceAudioChannels: sourceAudio.channels, outputAudioDurationSeconds: outputAudio.duration, outputAudioChannels: outputAudio.channels,
    audioDurationDeltaSeconds: Math.abs(sourceAudio.duration - outputAudio.duration),
    sourceMeanVolumeDb: sourceLevels.meanVolumeDb, outputMeanVolumeDb: outputLevels.meanVolumeDb,
    audioMeanLevelDeltaDb: Math.abs(sourceLevels.meanVolumeDb - outputLevels.meanVolumeDb),
    sourceMaxVolumeDb: sourceLevels.maxVolumeDb, outputMaxVolumeDb: outputLevels.maxVolumeDb,
    audioMaxLevelDeltaDb: Math.abs(sourceLevels.maxVolumeDb - outputLevels.maxVolumeDb),
    sourceLongestSilenceSeconds: sourceLongestSilence, outputLongestSilenceSeconds: outputLongestSilence,
    audioLongestSilenceIncreaseSeconds: Math.max(0, outputLongestSilence - sourceLongestSilence),
  };
};

export const validateDecodedMediaEquivalence = (metrics: DecodedMediaEquivalence, durationToleranceSeconds: number): string[] => {
  const errors: string[] = [];
  if (metrics.visualSsimAll < VISUAL_SSIM_ALL_MINIMUM || Math.min(metrics.visualSsimY, metrics.visualSsimU, metrics.visualSsimV) < VISUAL_SSIM_CHANNEL_MINIMUM) errors.push('Decoded visual equivalence SSIM is below gross-corruption threshold');
  if (metrics.sourceAudioChannels <= 0 || metrics.outputAudioChannels !== metrics.sourceAudioChannels) errors.push('Decoded audio stream/channel preservation mismatch');
  if (metrics.audioDurationDeltaSeconds > durationToleranceSeconds) errors.push('Decoded audio duration exceeds source/output tolerance');
  if (metrics.audioMeanLevelDeltaDb > AUDIO_MEAN_LEVEL_DELTA_DB_MAXIMUM || metrics.audioMaxLevelDeltaDb > AUDIO_MAX_LEVEL_DELTA_DB_MAXIMUM) errors.push('Decoded audio level changed materially during export');
  if (metrics.outputMeanVolumeDb < -60) errors.push('Decoded export audio is unexpectedly silent');
  if (metrics.audioLongestSilenceIncreaseSeconds > AUDIO_LONGEST_SILENCE_INCREASE_SECONDS_MAXIMUM) errors.push('Decoded export audio contains a new or materially longer missing-audio span');
  return errors;
};

export const validateSourceEquivalence = (manifest: ExportManifest, inspection: ExportMediaInspection): string[] => {
  const errors: string[] = [];
  const review = JSON.parse(readFileSync(manifest.sourceReviewSnapshot, 'utf8'));
  const digests = reviewDigests(review);
  if (digests.timeline !== manifest.timelineDigestSha256) errors.push('Reviewed timeline digest mismatch');
  if (digests.captions !== manifest.captionDigestSha256) errors.push('Reviewed caption digest mismatch');
  if (digests.finishing !== manifest.finishingDigestSha256) errors.push('Reviewed finishing digest mismatch');
  if (review.captionMode !== manifest.captionMode || review.musicMode !== manifest.musicMode || review.sfxMode !== manifest.sfxMode) errors.push('Caption/music/SFX state changed after review');
  if (Math.abs(inspection.durationSeconds - manifest.reviewedDurationSeconds) > manifest.deliveryProfile.durationToleranceSeconds) errors.push('Export duration exceeds mechanical container tolerance');
  if (inspection.width !== manifest.deliveryProfile.width || inspection.height !== manifest.deliveryProfile.height || inspection.fps !== manifest.deliveryProfile.fps) errors.push('Export timeline geometry differs from reviewed profile');
  if (!manifest.outputSha256 || sha256(readFileSync(manifest.outputPath)) !== manifest.outputSha256) errors.push('Export output checksum is missing or stale');
  return errors;
};
