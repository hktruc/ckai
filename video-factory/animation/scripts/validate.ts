import {runTechnicalQa} from '../src/engine/qa';
import {getSceneFrames, getTotalFrames} from '../src/engine/timeline';
import {TEST_0002} from '../src/manifest/test0002';

const proofMode = process.argv.includes('--proof-mode');
const result = runTechnicalQa(TEST_0002, proofMode);
const timeline = getSceneFrames(TEST_0002).map(({id, startFrame, endFrame}) => `${id}[${startFrame},${endFrame})`).join(' ');

console.log(`mode=${proofMode ? 'reverse-audit-proof' : 'production'}`);
console.log(`format=${TEST_0002.width}x${TEST_0002.height}@${TEST_0002.fps}fps duration=${TEST_0002.totalSeconds}s frames=${getTotalFrames(TEST_0002)}`);
console.log(`timeline=${timeline}`);
console.log(`voice_handoff_status=${TEST_0002.voiceHandoffStatus}`);

if (!result.pass) {
  result.errors.forEach((error) => console.error(`BLOCKED: ${error}`));
  process.exitCode = 1;
} else {
  console.log('technical_qa=PASS');
}
