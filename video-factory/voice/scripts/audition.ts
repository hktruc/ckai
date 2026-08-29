import {mkdirSync} from 'node:fs';
import {normalizeVietnamese} from '../src/normalization';
import {VbeeProvider, vbeeCredentialsAvailable} from '../src/providers/vbee';
import {resolveVoiceAlias} from '../src/registry';
import {segmentCacheKey} from '../src/segment';
import {preflightVbeeAudition} from '../src/selection';

const main = async () => {
  const aliases = process.argv.slice(2).filter((value) => !value.startsWith('--'));
  const summary = preflightVbeeAudition(aliases);
  const text = 'AI không thay mình suy nghĩ. Nó giúp mình nhìn rõ hơn, rồi mình vẫn là người quyết định.';
  const dryRun = process.argv.includes('--dry-run');
  const allowQuota = process.argv.includes('--allow-vbee-quota');
  console.log(JSON.stringify({mode: dryRun ? 'dry-run' : 'live', text, speed: 1, characters: text.length, shortlistLimit: 6, credentialsAvailable: vbeeCredentialsAvailable(), ...summary}, null, 2));
  if (summary.duplicateProviderVoices.length) console.warn('WARNING: shortlist aliases do not all represent distinct audible provider voices');
  if (dryRun) return;
  if (!allowQuota) throw new Error('Live audition is blocked without --allow-vbee-quota');
  if (!vbeeCredentialsAvailable()) throw new Error('Missing VBEE_APP_ID or VBEE_ACCESS_TOKEN; use --dry-run without fabricating Vbee audio');
  mkdirSync('generated/voice/auditions', {recursive: true});
  for (const alias of aliases) {
    const voice = resolveVoiceAlias(alias, 'reverse-audit-proof');
    const normalized = normalizeVietnamese(text);
    const segment = {id: `AUD-${alias}`, sceneId: 'AUDITION', speakerAlias: alias, originalText: text, synthesisText: normalized.synthesisText,
      pronunciationTerms: normalized.terms, speed: 1, slotStartSeconds: 0, slotEndSeconds: 15, requiredProofCaveatIds: [], cacheKey: '', generatedAudioPath: '', fitStatus: 'pending' as const};
    segment.cacheKey = segmentCacheKey(segment, voice);
    const safeVoiceCode = voice.voiceCode!.replace(/[^a-zA-Z0-9_-]/g, '_');
    segment.generatedAudioPath = `generated/voice/auditions/${alias}--${safeVoiceCode}--${segment.cacheKey.slice(0, 12)}.wav`;
    await new VbeeProvider().synthesize({segment, voice, outputPath: segment.generatedAudioPath, allowQuotaConsumption: true});
    console.log(`${alias} -> ${voice.voiceCode}: ${segment.generatedAudioPath} characters=${segment.synthesisText.length}`);
  }
};
main().catch((error) => { console.error(error); process.exitCode = 1; });
