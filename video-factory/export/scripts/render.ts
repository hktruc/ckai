import {existsSync, mkdirSync, renameSync, rmSync} from 'node:fs';
import {dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {runExportQa} from '../src/qa';
import {ffmpegArguments} from '../src/profile';
import {loadTest0002ExportInput} from './runtime';

const input = loadTest0002ExportInput();
const qa = runExportQa(input, 'reverse-audit-proof', false);
if (!qa.pass) throw new Error(qa.errors.join('\n'));
const output = input.exportManifest.outputPath;
const partial = output.replace(/\.mp4$/, '.partial.mp4');
const replaceProof = process.argv.includes('--replace-proof');
mkdirSync(dirname(output), {recursive: true});
if (existsSync(output) && !replaceProof) throw new Error('Export version already exists; increment releaseVersion or pass --replace-proof for TEST reverse-audit only');
if (existsSync(partial)) rmSync(partial);
if (existsSync(output) && replaceProof) rmSync(output);
const result = spawnSync('ffmpeg', ffmpegArguments(input.exportManifest.sourceReviewPreview, partial), {stdio: 'inherit'});
if (result.status !== 0) { if (existsSync(partial)) rmSync(partial); throw new Error('Final Export encoding failed'); }
renameSync(partial, output);
console.log(`export_created=${output}`);
