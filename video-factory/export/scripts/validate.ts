import {runExportQa} from '../src/qa';
import {loadTest0002ExportInput} from './runtime';

const input = loadTest0002ExportInput();
const qa = runExportQa(input, 'reverse-audit-proof', false);
if (!qa.pass) throw new Error(qa.errors.join('\n'));
console.log(`export_input=proof-verified derived=${qa.upstream.derivedExportInputStatus} publish_handoff=${input.exportManifest.publishHandoffStatus}`);
