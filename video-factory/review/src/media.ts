import {spawnSync} from 'node:child_process';
import {existsSync, statSync} from 'node:fs';
import {resolveFfmpeg,resolveFfprobe} from '../../shared/media-tools';

export type VideoProbe = {
  durationSeconds: number;
  width: number;
  height: number;
  fps: number;
  videoCodec: string;
  audioCodec: string;
  audioSampleRate: number;
  audioChannels: number;
  frames?: number;
  size: number;
};

const rational = (value: string): number => {
  const parts = value.split('/');
  const numerator = Number(parts[0] ?? 0);
  const denominator = Number(parts[1] ?? 1);
  return denominator ? numerator / denominator : 0;
};

export const probeVideo = (path: string): VideoProbe => {
  if (!existsSync(path) || statSync(path).size === 0) throw new Error(`Review preview missing or empty: ${path}`);
  const result = spawnSync(resolveFfprobe(), ['-v', 'error', '-show_entries', 'stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels,nb_frames:format=duration', '-of', 'json', path], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(`Review preview decode failed: ${result.stderr.trim()}`);
  const data = JSON.parse(result.stdout) as {streams?: Array<Record<string, string | number>>; format?: {duration?: string}};
  const video = data.streams?.find((stream) => stream.codec_type === 'video');
  const audio = data.streams?.find((stream) => stream.codec_type === 'audio');
  if (!video) throw new Error('Review preview has no video stream');
  if (!audio) throw new Error('Review preview has no audio stream while Voice is enabled');
  return {
    durationSeconds: Number(data.format?.duration), width: Number(video.width), height: Number(video.height),
    fps: rational(String(video.r_frame_rate)), videoCodec: String(video.codec_name), audioCodec: String(audio.codec_name),
    audioSampleRate: Number(audio.sample_rate), audioChannels: Number(audio.channels), frames: video.nb_frames === undefined ? undefined : Number(video.nb_frames), size: statSync(path).size,
  };
};

export const detectUnintendedBlack = (path: string): number => {
  const result = spawnSync(resolveFfmpeg(), ['-hide_banner', '-i', path, '-vf', 'blackdetect=d=0.5:pix_th=0.02', '-an', '-f', 'null', '-'], {encoding: 'utf8', timeout: 120_000});
  if (result.status !== 0) throw new Error('Black-frame heuristic failed');
  const durations = [...result.stderr.matchAll(/black_duration:(\d+(?:\.\d+)?)/g)].map((match) => Number(match[1]));
  return durations.length ? Math.max(...durations) : 0;
};
