import {spawnSync} from 'node:child_process';
import {existsSync, statSync} from 'node:fs';
import {devNull} from 'node:os';
import {resolveFfmpeg,resolveFfprobe} from '../../shared/media-tools';

export type AudioProbe = {duration: number; sampleRate: number; channels: number; codec: string; size: number};

export const probeAudio = (path: string): AudioProbe => {
  if (!existsSync(path) || statSync(path).size === 0) throw new Error(`Audio missing or empty: ${path}`);
  const result = spawnSync(resolveFfprobe(), ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name,sample_rate,channels:format=duration', '-of', 'json', path], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(`Audio decode failed: ${result.stderr.trim()}`);
  const data = JSON.parse(result.stdout) as {streams?: Array<{codec_name: string; sample_rate: string; channels: number}>; format?: {duration: string}};
  const stream = data.streams?.[0];
  if (!stream) throw new Error(`No audio stream: ${path}`);
  return {duration: Number(data.format?.duration), sampleRate: Number(stream.sample_rate), channels: stream.channels, codec: stream.codec_name, size: statSync(path).size};
};

export type AudioLevels = {meanVolumeDb: number; maxVolumeDb: number; zeroDbSampleRatio: number};

export const probeAudioLevels = (path: string): AudioLevels => {
  const result = spawnSync(resolveFfmpeg(), ['-hide_banner', '-i', path, '-af', 'volumedetect', '-f', 'null', devNull], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(`Audio level analysis failed: ${path}`);
  const output = result.stderr;
  const mean = [...output.matchAll(/mean_volume:\s*(-?\d+(?:\.\d+)?) dB/g)].at(-1);
  const max = [...output.matchAll(/max_volume:\s*(-?\d+(?:\.\d+)?) dB/g)].at(-1);
  const samples = [...output.matchAll(/n_samples:\s*(\d+)/g)].at(-1);
  const zero = [...output.matchAll(/histogram_0db:\s*(\d+)/g)].at(-1);
  if (!mean || !max || !samples) throw new Error(`Audio is silent or level metadata is unavailable: ${path}`);
  const totalSamples = Number(samples[1]);
  return {meanVolumeDb: Number(mean[1]), maxVolumeDb: Number(max[1]), zeroDbSampleRatio: totalSamples ? Number(zero?.[1] ?? 0) / totalSamples : 1};
};
