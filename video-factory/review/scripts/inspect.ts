import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {runReviewQa} from '../src/qa';
import {hydrateReviewPreview, loadTest0002ReviewInput} from './runtime';

const input = hydrateReviewPreview(loadTest0002ReviewInput());
const qa = runReviewQa(input, 'reverse-audit-proof', true);
if (!qa.pass) throw new Error(qa.errors.join('\n'));
const output = 'generated/review/TEST-0002/final-review.generated.json';
mkdirSync(dirname(output), {recursive: true});
writeFileSync(output, JSON.stringify(input.review, null, 2));
console.log(JSON.stringify({reviewPreview: input.review.reviewPreview, exportHandoffStatus: input.review.exportHandoffStatus}, null, 2));
