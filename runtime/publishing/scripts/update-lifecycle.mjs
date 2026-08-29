import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {approveRelease, recordPublication, writeManifestAtomic} from '../src/lifecycle.mjs';

const value = (name) => { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : null; };
const manifestPath = value('--manifest');
const inputPath = value('--input');
const action = value('--action');
if (!manifestPath || !inputPath || !['approve-release', 'record-publication'].includes(action)) {
  throw new Error('Usage: --action approve-release|record-publication --manifest <package-manifest.json> --input <input.json>');
}
const absoluteManifest = resolve(manifestPath);
const manifest = JSON.parse(readFileSync(absoluteManifest, 'utf8'));
const input = JSON.parse(readFileSync(resolve(inputPath), 'utf8'));
const updated = action === 'approve-release'
  ? approveRelease(manifest, input, {repoRoot: process.cwd()})
  : recordPublication(manifest, input, {repoRoot: process.cwd()});
writeManifestAtomic(absoluteManifest, updated);
console.log(JSON.stringify({status: 'PASS', action, contentId: updated.contentId, lifecycleState: updated.lifecycleState}, null, 2));
