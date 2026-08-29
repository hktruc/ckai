import {existsSync} from 'node:fs';
import {runReviewQa} from '../src/qa';
import {hydrateReviewPreview, loadTest0002ReviewInput} from './runtime';

const requirePreview = process.argv.includes('--require-preview');
let input = loadTest0002ReviewInput();
if (requirePreview && existsSync(input.review.reviewPreview.path)) input = hydrateReviewPreview(input);
const result = runReviewQa(input, 'reverse-audit-proof', requirePreview);
console.log(`mode=reverse-audit-proof preview=${requirePreview ? 'required' : 'not-required'} export_handoff=${input.review.exportHandoffStatus}`);
if (!result.pass) { result.errors.forEach((error) => console.error(`BLOCKED: ${error}`)); process.exitCode = 1; }
else console.log('final_review_qa=PASS');
