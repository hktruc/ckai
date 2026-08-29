import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import type {VoiceRegistryEntry, VoiceSegment} from './model';

export const sha256 = (value: string | Buffer): string => createHash('sha256').update(value).digest('hex').toUpperCase();

export const segmentCacheKey = (segment: Pick<VoiceSegment, 'synthesisText' | 'speed'>, voice: VoiceRegistryEntry): string => sha256(JSON.stringify({
  text: segment.synthesisText,
  provider: voice.provider,
  voiceCode: voice.voiceCode,
  speakerId: voice.speakerId ?? null,
  speed: segment.speed
}));

export const hasValidCache = (audioPath: string, expectedKey: string, actualKey: string): boolean =>
  expectedKey === actualKey && existsSync(audioPath);

export const voiceHandoffHash = (handoff: unknown): string => sha256(JSON.stringify(handoff));
