import {spawnSync} from 'node:child_process';
import {existsSync, statSync} from 'node:fs';
import {devNull} from 'node:os';
import type {ExportMediaInspection} from './model';
import {resolveFfmpeg, resolveFfprobe} from '../../shared/media-tools';

const rational = (value: string): number => { const [a = '0', b = '1'] = value.split('/'); return Number(b) ? Number(a) / Number(b) : 0; };

export const inspectExportMedia = (path: string): ExportMediaInspection => {
  if (!existsSync(path) || statSync(path).size === 0) throw new Error(`Export output missing or empty: ${path}`);
  const probe = spawnSync(resolveFfprobe(), ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name,profile,pix_fmt,width,height,sample_aspect_ratio,display_aspect_ratio,r_frame_rate,sample_rate,channels,channel_layout,bit_rate:format=format_name,duration,size,bit_rate', '-of', 'json', path], {encoding: 'utf8'});
  if (probe.status !== 0) throw new Error(`Export ffprobe failed: ${(probe.stderr ?? probe.error?.message ?? '').trim()}`);
  const parsed = JSON.parse(probe.stdout) as {streams?: Array<Record<string, string | number>>; format?: Record<string, string>};
  const video = parsed.streams?.find((stream) => stream.codec_type === 'video');
  const audio = parsed.streams?.find((stream) => stream.codec_type === 'audio');
  if (!video || !audio) throw new Error('Export requires exactly the expected video and audio streams');
  const decode = spawnSync(resolveFfmpeg(), ['-v', 'error', '-i', path, '-map', '0:v:0', '-map', '0:a:0', '-f', 'null', devNull], {encoding: 'utf8', timeout: 180_000});
  return {
    formatName: String(parsed.format?.format_name ?? ''), durationSeconds: Number(parsed.format?.duration), sizeBytes: Number(parsed.format?.size), overallBitrate: Number(parsed.format?.bit_rate),
    videoCodec: String(video.codec_name), videoProfile: String(video.profile), pixelFormat: String(video.pix_fmt), width: Number(video.width), height: Number(video.height),
    sampleAspectRatio: String(video.sample_aspect_ratio), displayAspectRatio: String(video.display_aspect_ratio), fps: rational(String(video.r_frame_rate)), videoBitrate: Number(video.bit_rate),
    audioCodec: String(audio.codec_name), audioProfile: String(audio.profile), audioSampleRate: Number(audio.sample_rate), audioChannels: Number(audio.channels),
    audioChannelLayout: String(audio.channel_layout), audioBitrate: Number(audio.bit_rate), decodeCheck: decode.status === 0 ? 'PASS' : 'BLOCKED',
  };
};
