import {existsSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {objectsToRows, parseCsv, rowsToObjects, serializeCsv} from '../../../scripts/lib/csv.mjs';

export const PERFORMANCE_FIELDS = ['id', 'date', 'platform', 'views', 'avg_watch_pct', 'completion_pct', 'likes', 'comments', 'shares', 'saves', 'follows', 'affiliate_clicks', 'notes'];
const METRICS = ['views', 'avg_watch_pct', 'completion_pct', 'likes', 'comments', 'shares', 'saves', 'follows', 'affiliate_clicks'];
const INTEGER_METRICS = new Set(['views', 'likes', 'comments', 'shares', 'saves', 'follows', 'affiliate_clicks']);
const PERCENT_METRICS = new Set(['avg_watch_pct', 'completion_pct']);
const normalizePlatform = (value) => String(value ?? '').trim().toLowerCase();

const validateMetric = (name, value) => {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error(`${name} must be a non-negative number or missing`);
  if (INTEGER_METRICS.has(name) && !Number.isInteger(value)) throw new Error(`${name} must be an integer`);
  if (PERCENT_METRICS.has(name) && value > 100) throw new Error(`${name} must be between 0 and 100`);
  return String(value);
};

const atomicWrite = (path, text) => {
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, text, 'utf8');
  renameSync(temporary, path);
};

const readTable = (path) => rowsToObjects(parseCsv(readFileSync(path, 'utf8')));
const sameRecord = (left, right) => PERFORMANCE_FIELDS.every((field) => String(left[field] ?? '') === String(right[field] ?? ''));
const keyOf = (row) => `${row.id}|${row.date}|${normalizePlatform(row.platform)}`;

const observationBlock = (record, metadata) => {
  const supplied = METRICS.filter((name) => record[name] !== '').map((name) => `${name}=${record[name]}`).join('; ');
  return `### ${record.id} — ${record.date} — ${record.platform}\n- **Observation:** Supplied platform metrics: ${supplied}. Missing metrics remain unavailable; zero values above are actual supplied zeroes.\n- **Metadata:** pillar=${metadata.pillar}; topic=${metadata.topic}; angle=${metadata.angle}; structure=${metadata.structure}; objective=${metadata.objective}.\n- **Governance:** This record is an Observation only. Cross-content interpretation and any Hypothesis/Learned Pattern promotion require consistent evidence plus ChatGPT/Product Owner review; views are not the sole objective.\n`;
};

const insertObservation = (patterns, block) => {
  const match = patterns.match(/(^## Observations\s*$)([\s\S]*?)(?=^## Hypotheses\s*$)/m);
  if (!match) throw new Error('Canonical patterns.md is missing the Observations → Hypotheses structure');
  const current = match[2].trim();
  const existing = /^_\([^\n]*\)_$/.test(current) ? '' : current;
  const replacement = `${match[1]}\n\n${existing ? `${existing}\n\n` : ''}${block.trim()}\n\n`;
  return patterns.slice(0, match.index) + replacement + patterns.slice(match.index + match[0].length);
};

export const preparePerformanceIngestion = ({repoRoot, input, replace = false, fixtureMode = false}) => {
  const root = resolve(repoRoot);
  const indexPath = join(root, 'data', 'content-index.csv');
  const performancePath = join(root, 'data', 'performance.csv');
  const patternsPath = join(root, 'insights', 'patterns.md');
  if (!existsSync(indexPath) || !existsSync(performancePath) || !existsSync(patternsPath)) throw new Error('Canonical content/performance/learning files are missing');
  if (!/^(?:CKAI|TEST)-\d{4}$/.test(input.contentId ?? '')) throw new Error('Invalid Content ID');
  if (input.contentId.startsWith('TEST-') && !fixtureMode) throw new Error('TEST-* performance is excluded from real ingestion');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date ?? '')) throw new Error('Performance date must be YYYY-MM-DD');
  if (!String(input.platform ?? '').trim()) throw new Error('Performance platform is required');
  const indexRows = readTable(indexPath);
  const metadata = indexRows.find((row) => row.id === input.contentId);
  if (!metadata) throw new Error('Content ID does not exist in the canonical content index');
  if (metadata.status !== 'published') throw new Error('Performance ingestion requires published content');
  const canonicalPlatforms = String(metadata.platform ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  const matchedPlatform = canonicalPlatforms.find((value) => normalizePlatform(value) === normalizePlatform(input.platform));
  if (!matchedPlatform) throw new Error('Performance platform does not match canonical publication metadata');
  const record = {id: input.contentId, date: input.date, platform: matchedPlatform};
  for (const metric of METRICS) record[metric] = validateMetric(metric, input[metric]);
  record.notes = input.notes === null || input.notes === undefined ? '' : String(input.notes).replace(/[\r\n]+/g, ' ').trim();
  if (!METRICS.some((metric) => record[metric] !== '')) throw new Error('At least one real performance metric is required');

  const existing = readTable(performancePath);
  const existingIndex = existing.findIndex((row) => keyOf(row) === keyOf(record));
  let operation = 'APPEND';
  if (existingIndex >= 0) {
    if (sameRecord(existing[existingIndex], record)) operation = 'NO_CHANGE';
    else if (!replace) throw new Error('Conflicting duplicate performance record; use explicit replace only after source correction');
    else { existing[existingIndex] = record; operation = 'REPLACE'; }
  } else existing.push(record);

  const realRows = existing.filter((row) => !row.id.startsWith('TEST-'));
  const dimensions = ['pillar', 'structure', 'objective'].map((dimension) => ({
    dimension,
    value: metadata[dimension],
    sampleCount: new Set(realRows.filter((row) => indexRows.find((item) => item.id === row.id)?.[dimension] === metadata[dimension]).map((row) => row.id)).size,
  }));
  const maximumComparableSample = Math.max(1, ...dimensions.map((item) => item.sampleCount));
  const promotionReview = fixtureMode
    ? 'EXCLUDED_TEST_FIXTURE'
    : maximumComparableSample >= 5 ? 'LEARNED_PATTERN_REVIEW_ELIGIBLE_NOT_AUTO_PROMOTED'
      : maximumComparableSample >= 2 ? 'HYPOTHESIS_REVIEW_ELIGIBLE_NOT_AUTO_PROMOTED'
        : 'OBSERVATION_ONLY';
  const marker = `### ${record.id} — ${record.date} — ${record.platform}`;
  const patterns = readFileSync(patternsPath, 'utf8');
  const updatedPatterns = fixtureMode || operation === 'NO_CHANGE' || patterns.includes(marker)
    ? patterns
    : insertObservation(patterns, observationBlock(record, metadata));
  return {
    record,
    metadata: Object.fromEntries(['pillar', 'topic', 'angle', 'structure', 'objective'].map((field) => [field, metadata[field]])),
    operation,
    promotionReview,
    comparableSamples: dimensions,
    fixtureExcluded: fixtureMode,
    writes: {
      performancePath,
      performanceText: serializeCsv(objectsToRows(PERFORMANCE_FIELDS, existing)),
      patternsPath,
      patternsText: updatedPatterns,
    },
  };
};

export const commitPerformanceIngestion = (prepared) => {
  if (prepared.fixtureExcluded) throw new Error('TEST fixture ingestion cannot be committed through the real-data path');
  if (prepared.operation === 'NO_CHANGE') return prepared;
  const oldPerformance = readFileSync(prepared.writes.performancePath, 'utf8');
  const oldPatterns = readFileSync(prepared.writes.patternsPath, 'utf8');
  try {
    atomicWrite(prepared.writes.performancePath, prepared.writes.performanceText);
    atomicWrite(prepared.writes.patternsPath, prepared.writes.patternsText);
  } catch (error) {
    writeFileSync(prepared.writes.performancePath, oldPerformance, 'utf8');
    writeFileSync(prepared.writes.patternsPath, oldPatterns, 'utf8');
    throw error;
  }
  return prepared;
};
