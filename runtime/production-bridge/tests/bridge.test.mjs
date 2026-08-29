import assert from 'node:assert/strict';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {
  appendLog, bridgePaths, claimJob, createJobFile, ensureBridgeDirectories, parseFrontmatter,
  readJobFile, recoverRunningJobs, runOnce, sha256File, validateApprovedSource, validateJob,
} from '../src/core.mjs';

const roots = [];
test.afterEach(() => { while (roots.length) rmSync(roots.pop(), {recursive: true, force: true}); });

const sourceText = (overrides = {}) => {
  const values = {
    id: 'TEST-0003', type: 'short-form-script', input_eligibility: 'smoke-only', status: 'approved',
    editorial_review: 'pass', human_decision: 'approved', storyboard_handoff_status: 'READY',
    duration_check: 'PASS', claim_evidence_check: 'PASS', ...overrides,
  };
  return `---\n${Object.entries(values).map(([key, value]) => `${key}: ${value}`).join('\n')}\n---\n\n# Approved smoke source\n\nExact market-facing fixture.\n`;
};

const setup = (id = 'SMOKE-20260824-0001', sourceOverrides = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'ckai-bridge-')); roots.push(root);
  const sourceDir = join(root, 'content', 'approved'); mkdirSync(sourceDir, {recursive: true});
  const sourcePath = join(sourceDir, 'TEST-0003_bridge-smoke.md'); writeFileSync(sourcePath, sourceText(sourceOverrides), 'utf8');
  const hash = sha256File(sourcePath);
  const job = {
    schemaVersion: 1, jobId: id, contentId: 'TEST-0003', requestedAction: 'smoke-no-provider', createdAt: '2026-08-24T00:00:00.000Z',
    source: {artifactPath: 'content/approved/TEST-0003_bridge-smoke.md', sha256: hash},
    approval: {type: 'content-approval', decision: 'approved', approvedBy: 'product-owner', approvedAt: '2026-08-24T00:00:00.000Z', basis: 'Explicit smoke-fixture approval.', contentFingerprintSha256: hash},
    providerPolicy: {allowVbeeQuota: false, autoPurchaseCredits: false, allowPaidFallback: false},
  };
  return {root, sourcePath, job, paths: bridgePaths(root)};
};

test('valid job parsing', () => {
  const {root, job} = setup();
  const path = createJobFile(root, job);
  assert.equal(readJobFile(path).jobId, job.jobId);
  assert.equal(parseFrontmatter(readFileSync(join(root, job.source.artifactPath), 'utf8')).human_decision, 'approved');
});

test('malformed job rejection', () => {
  const {job} = setup();
  assert.throws(() => validateJob({...job, requestedAction: 'shell-anything'}), /not allowlisted/);
  assert.throws(() => validateJob({...job, source: {...job.source, artifactPath: '..\/secret'}}), /safe repo-relative/);
  assert.throws(() => validateJob({...job, requestedAction: 'produce-to-review-package'}), /requires CKAI Content ID/);
});

test('missing Content Approval blocks', () => {
  const {root, job} = setup('SMOKE-20260824-0002', {human_decision: 'pending'});
  assert.equal(validateApprovedSource(job, root).code, 'CONTENT_APPROVAL_MISSING');
});

test('stale Content Approval blocks', () => {
  const {root, sourcePath, job} = setup('SMOKE-20260824-0003');
  writeFileSync(sourcePath, `${readFileSync(sourcePath, 'utf8')}changed\n`, 'utf8');
  assert.equal(validateApprovedSource(job, root).code, 'CONTENT_APPROVAL_STALE');
});

test('atomic claim allows only one claimant', () => {
  const {root, job, paths} = setup('SMOKE-20260824-0004');
  const inbox = createJobFile(root, job);
  assert.ok(claimJob(paths, inbox));
  assert.equal(claimJob(paths, inbox), null);
});

test('duplicate job is idempotently ignored', async () => {
  const {root, job, paths} = setup('SMOKE-20260824-0005');
  createJobFile(root, job); await runOnce(root);
  writeFileSync(join(paths.inbox, `${job.jobId}.job.json`), `${JSON.stringify(job)}\n`, 'utf8');
  const second = await runOnce(root);
  assert.equal(second[0].status, 'COMPLETED');
  assert.equal(readFileSync(join(paths.logs, 'runner.jsonl'), 'utf8').match(/job-started/g)?.length, 1);
  assert.equal(readdirSync(paths.duplicates).length, 2);
});

test('runner restart requeues a claimed but unexecuted job', () => {
  const {root, job, paths} = setup('SMOKE-20260824-0006');
  ensureBridgeDirectories(paths);
  const running = claimJob(paths, createJobFile(root, job));
  assert.ok(running);
  assert.deepEqual(recoverRunningJobs(paths), [{jobId: job.jobId, outcome: 'REQUEUED'}]);
  assert.ok(existsSync(join(paths.inbox, `${job.jobId}.job.json`)));
});

test('successful dry-run completion produces zero provider usage', async () => {
  const {root, job} = setup('SMOKE-20260824-0007');
  createJobFile(root, job); const [result] = await runOnce(root);
  assert.equal(result.status, 'COMPLETED');
  assert.equal(result.providerUsage.vbeeSynthesisRequests, 0);
  assert.equal(result.providerUsage.automaticCreditPurchase, false);
});

test('controlled production preflight stops before provider and render spend', async () => {
  const {root, job} = setup('SMOKE-20260824-0015', {input_eligibility: 'preflight-only'});
  const preflight = {...job, requestedAction: 'production-preflight'};
  createJobFile(root, preflight); const [result] = await runOnce(root);
  assert.equal(result.status, 'COMPLETED');
  assert.equal(result.releaseState, 'PENDING_PRODUCTION');
  assert.equal(result.providerUsage.vbeeSynthesisRequests, 0);
});

test('malformed execution becomes FAILED and preserves report', async () => {
  const {root, paths} = setup('SMOKE-20260824-0008');
  ensureBridgeDirectories(paths);
  writeFileSync(join(paths.inbox, 'JOB-MALFORMED-0001.job.json'), '{broken', 'utf8');
  const [result] = await runOnce(root);
  assert.equal(result.status, 'FAILED');
  assert.ok(existsSync(join(paths.results, 'JOB-MALFORMED-0001.result.json')));
});

test('filename must equal job ID to preserve one-file atomic idempotency', async () => {
  const {root, job, paths} = setup('SMOKE-20260824-0016'); ensureBridgeDirectories(paths);
  writeFileSync(join(paths.inbox, 'SMOKE-WRONG-NAME.job.json'), `${JSON.stringify(job)}\n`, 'utf8');
  const [result] = await runOnce(root);
  assert.equal(result.status, 'FAILED');
  assert.equal(result.errorCode, 'JOB_FILENAME_MISMATCH');
});

test('legitimate gate failure becomes BLOCKED', async () => {
  const {root, job} = setup('SMOKE-20260824-0009', {claim_evidence_check: 'BLOCKED'});
  createJobFile(root, job); const [result] = await runOnce(root);
  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.errorCode, 'CONTENT_APPROVAL_MISSING');
});

test('result artifacts include machine and human readable forms', async () => {
  const {root, job, paths} = setup('SMOKE-20260824-0010');
  createJobFile(root, job); await runOnce(root);
  assert.ok(existsSync(join(paths.results, `${job.jobId}.result.json`)));
  assert.match(readFileSync(join(paths.results, `${job.jobId}.result.md`), 'utf8'), /Job status: \*\*COMPLETED\*\*/);
  assert.equal(JSON.parse(readFileSync(join(paths.status, `${job.jobId}.status.json`), 'utf8')).status, 'COMPLETED');
});

test('structured logs redact configured Vbee secrets', () => {
  const {paths} = setup('SMOKE-20260824-0011'); ensureBridgeDirectories(paths);
  const oldToken = process.env.VBEE_ACCESS_TOKEN; const oldAppId = process.env.VBEE_APP_ID;
  process.env.VBEE_ACCESS_TOKEN = 'super-secret-token'; process.env.VBEE_APP_ID = 'secret-app-id';
  try { appendLog(paths, 'error', 'redaction-test', {authorization: 'Bearer super-secret-token', detail: 'secret-app-id'}); }
  finally {
    if (oldToken === undefined) delete process.env.VBEE_ACCESS_TOKEN; else process.env.VBEE_ACCESS_TOKEN = oldToken;
    if (oldAppId === undefined) delete process.env.VBEE_APP_ID; else process.env.VBEE_APP_ID = oldAppId;
  }
  const log = readFileSync(join(paths.logs, 'runner.jsonl'), 'utf8');
  assert.doesNotMatch(log, /super-secret-token|secret-app-id/);
  assert.match(log, /REDACTED/);
});

test('smoke policy rejects any Vbee quota authorization', () => {
  const {job} = setup('SMOKE-20260824-0012');
  assert.throws(() => validateJob({...job, providerPolicy: {...job.providerPolicy, allowVbeeQuota: true}}), /allowVbeeQuota false/);
  assert.throws(() => validateJob({...job, providerPolicy: {...job.providerPolicy, allowOpenAIImageGeneration: true}}), /cannot authorize OpenAI image generation/);
  assert.throws(() => validateJob({...job, providerPolicy: {...job.providerPolicy, allowOpenAIVision: true}}), /cannot authorize OpenAI Vision/);
});

test('production image generation is explicit opt-in with a bounded optional budget', () => {
  const {job} = setup('JOB-20260824-VISUAL');
  const production = {...job, contentId:'CKAI-0004', requestedAction:'produce-to-review-package', source:{...job.source,artifactPath:'content/approved/CKAI-0004_fixture.md'}, providerPolicy:{...job.providerPolicy,allowOpenAIImageGeneration:true,maxOpenAIImageUsd:2}};
  assert.equal(validateJob(production).providerPolicy.allowOpenAIImageGeneration,true);
  assert.equal(validateJob({...production,providerPolicy:{...production.providerPolicy,allowOpenAIVision:true}}).providerPolicy.allowOpenAIVision,true);
  assert.throws(()=>validateJob({...production,providerPolicy:{...production.providerPolicy,maxOpenAIImageUsd:-1}}),/maxOpenAIImageUsd/);
});

test('review result remains pending before Chốt', async () => {
  const {root, job} = setup('SMOKE-20260824-0013');
  createJobFile(root, job); const [result] = await runOnce(root);
  assert.notEqual(result.releaseState, 'RELEASE_APPROVED');
});

test('restart after EXECUTING blocks without retry', () => {
  const {root, job, paths} = setup('SMOKE-20260824-0014'); ensureBridgeDirectories(paths);
  const running = claimJob(paths, createJobFile(root, job));
  writeFileSync(running.replace(/\.job\.json$/, '.state.json'), JSON.stringify({phase: 'EXECUTING'}), 'utf8');
  assert.deepEqual(recoverRunningJobs(paths), [{jobId: job.jobId, outcome: 'BLOCKED'}]);
  assert.match(readFileSync(join(paths.results, `${job.jobId}.result.md`), 'utf8'), /automatic retry is disabled/);
});
