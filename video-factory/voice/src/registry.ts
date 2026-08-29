import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import type {VoiceRegistryEntry} from './model';

type RawEntry = Omit<VoiceRegistryEntry, 'alias'>;

export type RegistryValidation = {errors: string[]; warnings: string[]};

export const validateVoiceRegistry = (registry: Record<string, VoiceRegistryEntry>): RegistryValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const providerVoices = new Map<string, string[]>();
  for (const [alias, entry] of Object.entries(registry)) {
    if (!/^[A-Z][A-Z0-9_]+$/.test(alias)) errors.push(`Voice alias has invalid format: ${alias}`);
    if (entry.alias !== alias) errors.push(`Voice alias key/value mismatch: ${alias}`);
    if (entry.provider === 'vbee' && entry.voiceCode && entry.languageCode !== 'vi-VN') errors.push(`${alias} must declare languageCode vi-VN`);
    if (entry.productionAllowed && entry.selectionStatus !== 'production-approved') errors.push(`${alias} productionAllowed requires production-approved selection`);
    if (entry.selectionStatus === 'production-approved' && (!entry.productionAllowed || !entry.voiceCode)) errors.push(`${alias} production-approved requires voiceCode and productionAllowed`);
    if (entry.productionApprovedMapping && (entry.selectionStatus !== 'production-approved' || entry.voiceSelectionCheck !== 'PASS')) errors.push(`${alias} productionApprovedMapping requires production-approved + voiceSelectionCheck PASS`);
    if (entry.defaultFor && (!entry.productionApprovedMapping || !entry.productionAllowed)) errors.push(`${alias} production default requires an approved production mapping`);
    if (entry.selectionStatus === 'approved-for-proof' && entry.productionAllowed) errors.push(`${alias} proof voice cannot be productionAllowed`);
    if (entry.voiceCode) {
      const key = `${entry.provider}:${entry.voiceCode}:${entry.speakerId ?? 'default'}`;
      providerVoices.set(key, [...(providerVoices.get(key) ?? []), alias]);
    }
  }
  const defaults = Object.entries(registry).filter(([, entry]) => entry.defaultFor === 'ckai-production-narration');
  if (defaults.length > 1) errors.push(`Only one CKAI production narration default is allowed: ${defaults.map(([alias]) => alias).join(', ')}`);
  for (const [providerVoice, aliases] of providerVoices) {
    if (aliases.length > 1) warnings.push(`Aliases ${aliases.join(', ')} map to the same audible provider voice ${providerVoice}`);
  }
  return {errors, warnings};
};

export const loadVoiceRegistry = (): Record<string, VoiceRegistryEntry> => {
  const path = resolve(process.cwd(), 'video-factory/voice/config/voice-registry.json');
  const raw = JSON.parse(readFileSync(path, 'utf8')) as Record<string, RawEntry>;
  const registry = Object.fromEntries(Object.entries(raw).map(([alias, entry]) => [alias, {...entry, alias}]));
  const validation = validateVoiceRegistry(registry);
  if (validation.errors.length) throw new Error(`Invalid Voice Registry:\n${validation.errors.join('\n')}`);
  return registry;
};

export const resolveVoiceAlias = (alias: string, mode: 'production' | 'reverse-audit-proof'): VoiceRegistryEntry => {
  const entry = loadVoiceRegistry()[alias];
  if (!entry) throw new Error(`Voice alias is not registered: ${alias}`);
  if (!entry.voiceCode) throw new Error(`Voice alias ${alias} is unresolved; Product Owner must select a provider voice`);
  if (mode === 'production' && (!entry.productionAllowed || entry.selectionStatus !== 'production-approved')) {
    throw new Error(`Voice alias ${alias} is not approved for production`);
  }
  return entry;
};
