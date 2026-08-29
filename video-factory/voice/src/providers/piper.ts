import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import type {SynthRequest, SynthResult, VoiceProvider} from '../model';

export class PiperProvider implements VoiceProvider {
  readonly id = 'piper' as const;

  async synthesize({segment, voice, outputPath}: SynthRequest): Promise<SynthResult> {
    const python = process.env.PIPER_PYTHON;
    const model = voice.modelPathEnv ? process.env[voice.modelPathEnv] : undefined;
    if (!python || !model) throw new Error(`Missing PIPER_PYTHON or ${voice.modelPathEnv ?? 'model path env'}`);
    mkdirSync(dirname(outputPath), {recursive: true});
    const args = ['-m', 'piper', '-m', model, '-f', outputPath, '--length-scale', String(1 / segment.speed)];
    if (voice.speakerId !== undefined) args.push('--speaker', String(voice.speakerId));
    args.push('--', segment.synthesisText);
    const result = spawnSync(python, args, {encoding: 'utf8', timeout: 120_000});
    if (result.status !== 0) throw new Error(`Piper synthesis failed for ${segment.id}: ${(result.stderr || result.stdout).trim()}`);
    return {provider: this.id, voiceCode: voice.voiceCode!, outputPath, characters: segment.synthesisText.length, cacheHit: false};
  }
}
