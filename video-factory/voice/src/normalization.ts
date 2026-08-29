import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

type Dictionary = {version: string; terms: Record<string, {spoken: string; review: string}>};

export type NormalizationResult = {originalText: string; synthesisText: string; terms: string[]; dictionaryVersion: string};

export const loadPronunciationDictionary = (): Dictionary => JSON.parse(readFileSync(
  resolve(process.cwd(), 'video-factory/voice/config/pronunciation.vi.json'), 'utf8'
)) as Dictionary;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeVietnamese = (originalText: string): NormalizationResult => {
  const dictionary = loadPronunciationDictionary();
  const terms: string[] = [];
  let synthesisText = originalText
    .replace(/\r\n/g, '\n')
    .replace(/[“”]/g, '"')
    .replace(/…/g, '...')
    .replace(/(\d+)\s*%/g, '$1 phần trăm')
    .replace(/(\d+)\s*(?:s|sec)\b/gi, '$1 giây');
  for (const [term, rule] of Object.entries(dictionary.terms)) {
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(term)}(?![\\p{L}\\p{N}])`, 'giu');
    if (pattern.test(synthesisText)) {
      terms.push(term);
      synthesisText = synthesisText.replace(pattern, rule.spoken);
    }
  }
  synthesisText = synthesisText.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return {originalText, synthesisText, terms, dictionaryVersion: dictionary.version};
};
