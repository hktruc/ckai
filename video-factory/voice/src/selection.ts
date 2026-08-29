import type {VoiceRegistryEntry} from './model';
import {resolveVoiceAlias} from './registry';

export type VoiceMappingSummary = {
  aliases: string[];
  mappings: Array<{alias: string; provider: string; voiceCode: string}>;
  distinctProviderVoices: number;
  duplicateProviderVoices: Array<{providerVoice: string; aliases: string[]}>;
  audiblyDistinct: boolean;
};

export const summarizeVoiceMappings = (entries: VoiceRegistryEntry[]): VoiceMappingSummary => {
  const groups = new Map<string, string[]>();
  for (const entry of entries) {
    const providerVoice = `${entry.provider}:${entry.voiceCode ?? `speaker-${entry.speakerId ?? 'default'}`}`;
    const aliases = groups.get(providerVoice) ?? [];
    if (!aliases.includes(entry.alias)) groups.set(providerVoice, [...aliases, entry.alias]);
  }
  return {
    aliases: entries.map((entry) => entry.alias),
    mappings: entries.map((entry) => ({alias: entry.alias, provider: entry.provider, voiceCode: entry.voiceCode ?? `speaker-${entry.speakerId ?? 'default'}`})),
    distinctProviderVoices: groups.size,
    duplicateProviderVoices: [...groups.entries()].filter(([, aliases]) => aliases.length > 1).map(([providerVoice, aliases]) => ({providerVoice, aliases})),
    audiblyDistinct: groups.size === new Set(entries.map((entry) => entry.alias)).size,
  };
};

export const preflightVbeeAudition = (aliases: string[]): VoiceMappingSummary => {
  if (!aliases.length || aliases.length > 6) throw new Error('Choose 1–6 centralized Voice Registry aliases');
  const entries = aliases.map((alias) => resolveVoiceAlias(alias, 'reverse-audit-proof'));
  for (const entry of entries) {
    if (entry.provider !== 'vbee') throw new Error(`Audition alias ${entry.alias} is not a Vbee voice`);
    if (entry.providerMetadata?.realtimeCompatible !== true) {
      throw new Error(`Vbee alias ${entry.alias} is not confirmed compatible with the current realtime API`);
    }
  }
  return summarizeVoiceMappings(entries);
};
