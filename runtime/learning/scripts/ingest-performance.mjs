import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {commitPerformanceIngestion, preparePerformanceIngestion} from '../src/performance.mjs';

const inputIndex = process.argv.indexOf('--input');
if (inputIndex < 0 || !process.argv[inputIndex + 1]) throw new Error('Usage: --input <performance.json> [--commit] [--replace]');
const input = JSON.parse(readFileSync(resolve(process.argv[inputIndex + 1]), 'utf8'));
const prepared = preparePerformanceIngestion({repoRoot: process.cwd(), input, replace: process.argv.includes('--replace')});
if (process.argv.includes('--commit')) commitPerformanceIngestion(prepared);
console.log(JSON.stringify({status: 'PASS', committed: process.argv.includes('--commit') && prepared.operation !== 'NO_CHANGE', operation: prepared.operation, record: prepared.record, metadata: prepared.metadata, promotionReview: prepared.promotionReview, comparableSamples: prepared.comparableSamples}, null, 2));
