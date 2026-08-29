import {existsSync, readFileSync, unlinkSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {appendLog, bridgePaths, DEFAULT_POLL_MS, ensureBridgeDirectories, recoverRunningJobs, runOnce} from './core.mjs';

const args = process.argv.slice(2);
const valueAfter = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
const repoRoot = resolve(valueAfter('--repo-root') ?? process.cwd());
const watch = args.includes('--watch');
const pollMs = Number(valueAfter('--poll-ms') ?? DEFAULT_POLL_MS);
if (!Number.isInteger(pollMs) || pollMs < 1000 || pollMs > 60000) throw new Error('--poll-ms must be an integer from 1000 to 60000');

const paths = bridgePaths(repoRoot);
ensureBridgeDirectories(paths);
const pidPath = resolve(paths.jobs, 'runner.pid');

if (existsSync(pidPath)) {
  const pid = Number(readFileSync(pidPath, 'utf8'));
  try { process.kill(pid, 0); throw new Error(`CKAI Local Runner is already active with PID ${pid}`); }
  catch (error) { if (error.code !== 'ESRCH') throw error; }
}
writeFileSync(pidPath, String(process.pid), 'utf8');
const cleanup = () => { try { if (readFileSync(pidPath, 'utf8') === String(process.pid)) unlinkSync(pidPath); } catch {} };
process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(0); });
process.on('SIGTERM', () => { cleanup(); process.exit(0); });

recoverRunningJobs(paths);
appendLog(paths, 'info', 'runner-started', {pid: process.pid, mode: watch ? 'watch' : 'once', pollMs});

if (!watch) {
  const results = await runOnce(repoRoot);
  console.log(JSON.stringify({processed: results.length, results}, null, 2));
  cleanup();
} else {
  let stopping = false;
  while (!stopping) {
    await runOnce(repoRoot);
    await new Promise((done) => setTimeout(done, pollMs));
  }
}

