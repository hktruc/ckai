import {spawnSync} from 'node:child_process';
import {devNull} from 'node:os';
import {probeAudioLevels} from '../../voice/src/media';
import {probeVideo} from './media';
import {resolveFfmpeg} from '../../shared/media-tools';

export type MediaSpan = {startSeconds: number; endSeconds: number; durationSeconds: number};
export type ActualBinaryExperience = {
  durationSeconds: number;
  audioCodec: string;
  audioSampleRate: number;
  audioChannels: number;
  meanVolumeDb: number;
  maxVolumeDb: number;
  silenceSpans: MediaSpan[];
  freezeSpans: MediaSpan[];
  nonSemanticDeadAirSpans: MediaSpan[];
  longestSilenceSeconds: number;
  longestFreezeSeconds: number;
  longestNonSemanticDeadAirSeconds: number;
  averageNonSemanticGapSeconds: number;
  pass: boolean;
  errors: string[];
};

const runAnalysis = (path: string, args: string[]) => {
  const result = spawnSync(resolveFfmpeg(), ['-hide_banner', '-i', path, ...args, '-f', 'null', devNull], {encoding:'utf8', timeout:180_000});
  if (result.status !== 0) throw new Error(`Actual-binary experience analysis failed: ${path}`);
  return result.stderr;
};

const spans = (text: string, prefix: 'silence' | 'freeze'): MediaSpan[] => {
  const starts = [...text.matchAll(new RegExp(`${prefix}_start:\\s*(-?\\d+(?:\\.\\d+)?)`, 'g'))].map((match) => Number(match[1]));
  const ends = [...text.matchAll(new RegExp(`${prefix}_end:\\s*(-?\\d+(?:\\.\\d+)?)`, 'g'))].map((match) => Number(match[1]));
  return starts.slice(0, ends.length).map((start, index) => ({startSeconds: Math.max(0, start), endSeconds: ends[index], durationSeconds: Math.max(0, ends[index] - Math.max(0, start))}));
};

const overlap = (a: MediaSpan, b: MediaSpan): MediaSpan | null => {
  const start = Math.max(a.startSeconds, b.startSeconds); const end = Math.min(a.endSeconds, b.endSeconds);
  return end > start ? {startSeconds:start,endSeconds:end,durationSeconds:end-start} : null;
};

export const inspectActualBinaryExperience = (path: string): ActualBinaryExperience => {
  const media = probeVideo(path); const levels = probeAudioLevels(path);
  const silence = spans(runAnalysis(path, ['-af', 'silencedetect=noise=-55dB:d=0.35', '-vn']), 'silence');
  const freeze = spans(runAnalysis(path, ['-vf', 'freezedetect=n=0.001:d=0.75', '-an']), 'freeze');
  const dead = silence.flatMap((silent) => freeze.map((frozen) => overlap(silent, frozen)).filter((value): value is MediaSpan => Boolean(value))).filter((span) => span.durationSeconds >= .5);
  const longest = (values: MediaSpan[]) => Math.max(0, ...values.map((span) => span.durationSeconds));
  const averageDead = dead.length ? dead.reduce((sum, span) => sum + span.durationSeconds, 0) / dead.length : 0;
  const errors: string[] = [];
  if (levels.meanVolumeDb < -60 || levels.maxVolumeDb < -60) errors.push('Actual rendered binary narration is effectively silent');
  if (levels.maxVolumeDb > .1 || levels.zeroDbSampleRatio > .005) errors.push('Actual rendered binary has clipping indicators');
  if (longest(dead) >= .75) errors.push('Static visual and speech silence overlap without semantic progression');
  if (!(media.durationSeconds > 0 && media.durationSeconds < 60)) errors.push('Actual rendered binary must remain under 60 seconds');
  return {durationSeconds:media.durationSeconds,audioCodec:media.audioCodec,audioSampleRate:media.audioSampleRate,audioChannels:media.audioChannels,meanVolumeDb:levels.meanVolumeDb,maxVolumeDb:levels.maxVolumeDb,silenceSpans:silence,freezeSpans:freeze,nonSemanticDeadAirSpans:dead,longestSilenceSeconds:longest(silence),longestFreezeSeconds:longest(freeze),longestNonSemanticDeadAirSeconds:longest(dead),averageNonSemanticGapSeconds:averageDead,pass:errors.length===0,errors};
};
