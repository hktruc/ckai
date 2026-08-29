import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import type {VoicePlan} from './model';
import {resolveFfmpeg} from '../../shared/media-tools';

export const assembleVoiceTimeline = (plan: VoicePlan, totalSeconds: number): void => {
  mkdirSync(dirname(plan.assembledAudioPath), {recursive: true});
  const inputs = plan.segments.flatMap((segment) => ['-i', segment.generatedAudioPath]);
  const filters = plan.segments.map((segment, index) => {
    const delay = Math.round(segment.slotStartSeconds * 1000);
    return `[${index}:a]aresample=48000,adelay=${delay}|${delay}[a${index}]`;
  });
  const labels = plan.segments.map((_, index) => `[a${index}]`).join('');
  filters.push(`${labels}amix=inputs=${plan.segments.length}:duration=longest:normalize=0,apad,atrim=0:${totalSeconds}[out]`);
  const result = spawnSync(resolveFfmpeg(), ['-y', ...inputs, '-filter_complex', filters.join(';'), '-map', '[out]', '-c:a', 'pcm_s16le', plan.assembledAudioPath], {encoding: 'utf8', timeout: 120_000});
  if (result.status !== 0) throw new Error(`Voice assembly failed: ${result.stderr.slice(-1000)}`);
};
