import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync, copyFileSync} from 'node:fs';
import {basename, dirname, isAbsolute, join, relative, resolve, sep} from 'node:path';
import {spawnSync} from 'node:child_process';

export const TERMINAL_STATUSES = new Set(['COMPLETED', 'BLOCKED', 'FAILED']);
export const JOB_ACTIONS = new Set(['smoke-no-provider', 'production-preflight', 'generic-adapter-proof', 'produce-to-review-package']);
export const DEFAULT_POLL_MS = 5000;

const sha256 = (value) => createHash('sha256').update(value).digest('hex').toUpperCase();
export const sha256File = (path) => sha256(readFileSync(path));

const canonicalSection = (markdown, headings) => {
  const escaped = headings.map((heading) => heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return markdown.match(new RegExp(`^##\\s+(?:${escaped})\\s*\\r?\\n([\\s\\S]*?)(?=^##\\s+|(?![\\s\\S]))`, 'mi'))?.[1].replace(/\r\n/g, '\n').trim() ?? '';
};

export const contentApprovalFingerprint = (markdown) => {
  const payload = {
    spokenCopy: canonicalSection(markdown, ['4. SPOKEN COPY', 'Final Spoken Copy', 'Spoken Copy', 'Full Script']),
    ending: canonicalSection(markdown, ['7. ENDING / CTA', 'Ending / CTA', 'CTA']),
    claimLedger: canonicalSection(markdown, ['5. CLAIM & EVIDENCE LEDGER', 'Claim & Evidence Ledger']),
    workingTitle: canonicalSection(markdown, ['Working Title', 'Title', 'Headline']),
    facebookCaption: canonicalSection(markdown, ['Facebook Caption', 'Caption ngắn', 'Caption']),
  };
  if (!payload.spokenCopy || !payload.workingTitle || !payload.facebookCaption) throw new Error('Canonical approval fingerprint requires Spoken Copy, Working Title and Facebook Caption');
  return sha256(Buffer.from(JSON.stringify(payload), 'utf8'));
};

const nowIso = () => new Date().toISOString();
const safeStamp = () => nowIso().replace(/[:.]/g, '-');

export const bridgePaths = (repoRoot) => {
  const jobs = join(repoRoot, 'runtime', 'jobs');
  return {
    repoRoot,
    jobs,
    inbox: join(jobs, 'inbox'),
    running: join(jobs, 'running'),
    completed: join(jobs, 'completed'),
    blocked: join(jobs, 'blocked'),
    failed: join(jobs, 'failed'),
    duplicates: join(jobs, 'duplicates'),
    results: join(jobs, 'results'),
    status: join(jobs, 'status'),
    logs: join(jobs, 'logs'),
  };
};

export const ensureBridgeDirectories = (paths) => {
  for (const key of ['inbox', 'running', 'completed', 'blocked', 'failed', 'duplicates', 'results', 'status', 'logs']) {
    mkdirSync(paths[key], {recursive: true});
  }
};

const atomicWrite = (path, text) => {
  mkdirSync(dirname(path), {recursive: true});
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(temporary, text, 'utf8');
  renameSync(temporary, path);
};

export const atomicWriteJson = (path, value) => atomicWrite(path, `${JSON.stringify(value, null, 2)}\n`);

const redact = (value) => {
  let text = typeof value === 'string' ? value : JSON.stringify(value);
  for (const secret of [process.env.VBEE_APP_ID, process.env.VBEE_ACCESS_TOKEN]) {
    if (secret && secret.length >= 4) text = text.split(secret).join('[REDACTED]');
  }
  return text
    .replace(/Bearer\s+[^\s"']+/gi, 'Bearer [REDACTED]')
    .replace(/("?(?:access[_-]?token|app[_-]?id|authorization)"?\s*[:=]\s*)"?[^",\s}]+"?/gi, '$1[REDACTED]');
};

export const appendLog = (paths, level, event, fields = {}) => {
  const record = {timestamp: nowIso(), level, event, ...fields};
  const line = `${redact(record)}\n`;
  mkdirSync(paths.logs, {recursive: true});
  writeFileSync(join(paths.logs, 'runner.jsonl'), line, {encoding: 'utf8', flag: 'a'});
};

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const assertString = (value, field) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Malformed job: ${field} must be a non-empty string`);
};

export const validateJob = (job) => {
  if (!isPlainObject(job)) throw new Error('Malformed job: root must be an object');
  if (job.schemaVersion !== 1) throw new Error('Malformed job: schemaVersion must be 1');
  assertString(job.jobId, 'jobId');
  if (!/^(?:JOB|SMOKE)-[A-Z0-9][A-Z0-9_-]{5,79}$/.test(job.jobId)) throw new Error('Malformed job: invalid jobId');
  assertString(job.contentId, 'contentId');
  if (!/^(?:CKAI|TEST)-\d{4}$/.test(job.contentId)) throw new Error('Malformed job: invalid contentId');
  if (!JOB_ACTIONS.has(job.requestedAction)) throw new Error('Malformed job: requestedAction is not allowlisted');
  if (['produce-to-review-package', 'generic-adapter-proof'].includes(job.requestedAction) && !job.contentId.startsWith('CKAI-')) throw new Error('Malformed job: production/proof action requires CKAI Content ID');
  if (['smoke-no-provider', 'production-preflight'].includes(job.requestedAction) && !job.contentId.startsWith('TEST-')) throw new Error('Malformed job: smoke/preflight actions require TEST Content ID');
  assertString(job.createdAt, 'createdAt');
  if (!Number.isFinite(Date.parse(job.createdAt))) throw new Error('Malformed job: createdAt must be ISO-compatible');
  if (!isPlainObject(job.source)) throw new Error('Malformed job: source must be an object');
  assertString(job.source.artifactPath, 'source.artifactPath');
  if (isAbsolute(job.source.artifactPath) || job.source.artifactPath.includes('..') || job.source.artifactPath.includes('\\')) {
    throw new Error('Malformed job: source.artifactPath must be a safe repo-relative POSIX path');
  }
  if (!/^[A-Fa-f0-9]{64}$/.test(job.source.sha256 ?? '')) throw new Error('Malformed job: source.sha256 must be SHA-256');
  if (!isPlainObject(job.approval)) throw new Error('Malformed job: approval must be an object');
  if (job.approval.type !== 'content-approval' || job.approval.decision !== 'approved' || job.approval.approvedBy !== 'product-owner') {
    throw new Error('Malformed job: direct Product Owner Content Approval is required');
  }
  assertString(job.approval.approvedAt, 'approval.approvedAt');
  assertString(job.approval.basis, 'approval.basis');
  if (!/^[A-Fa-f0-9]{64}$/.test(job.approval.contentFingerprintSha256 ?? '')) {
    throw new Error('Malformed job: approval.contentFingerprintSha256 must be SHA-256');
  }
  if (job.approval.contentFingerprintSha256.toUpperCase() !== job.source.sha256.toUpperCase()) {
    throw new Error('Malformed job: approval fingerprint must equal source fingerprint');
  }
  if (!isPlainObject(job.providerPolicy) || job.providerPolicy.autoPurchaseCredits !== false || job.providerPolicy.allowPaidFallback !== false) {
    throw new Error('Malformed job: providerPolicy must prohibit auto-purchase and paid fallback');
  }
  if (job.requestedAction !== 'produce-to-review-package' && job.providerPolicy.allowVbeeQuota !== false) {
    throw new Error('Malformed job: smoke/preflight/proof must set allowVbeeQuota false');
  }
  if (job.providerPolicy.allowOpenAIImageGeneration !== undefined && typeof job.providerPolicy.allowOpenAIImageGeneration !== 'boolean') {
    throw new Error('Malformed job: providerPolicy.allowOpenAIImageGeneration must be boolean when present');
  }
  if (job.requestedAction !== 'produce-to-review-package' && job.providerPolicy.allowOpenAIImageGeneration === true) {
    throw new Error('Malformed job: smoke/preflight/proof cannot authorize OpenAI image generation');
  }
  if (job.providerPolicy.allowOpenAIVision !== undefined && typeof job.providerPolicy.allowOpenAIVision !== 'boolean') {
    throw new Error('Malformed job: providerPolicy.allowOpenAIVision must be boolean when present');
  }
  if (job.requestedAction !== 'produce-to-review-package' && job.providerPolicy.allowOpenAIVision === true) {
    throw new Error('Malformed job: smoke/preflight/proof cannot authorize OpenAI Vision');
  }
  if (job.providerPolicy.maxOpenAIImageUsd !== undefined && job.providerPolicy.maxOpenAIImageUsd !== null && (!Number.isFinite(job.providerPolicy.maxOpenAIImageUsd) || job.providerPolicy.maxOpenAIImageUsd < 0)) {
    throw new Error('Malformed job: providerPolicy.maxOpenAIImageUsd must be null or a non-negative number');
  }
  return job;
};

export const readJobFile = (path) => validateJob(JSON.parse(readFileSync(path, 'utf8')));

const parseScalar = (raw) => {
  const value = raw.trim().replace(/^['"]|['"]$/g, '');
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  return value;
};

export const parseFrontmatter = (markdown) => {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error('Canonical source has no YAML frontmatter');
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || /^\s/.test(line)) continue;
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    fields[line.slice(0, separator).trim()] = parseScalar(line.slice(separator + 1));
  }
  return fields;
};

const resolveRepoFile = (repoRoot, relativePath) => {
  const absolute = resolve(repoRoot, ...relativePath.split('/'));
  const rel = relative(repoRoot, absolute);
  if (!rel || rel.startsWith(`..${sep}`) || rel === '..' || isAbsolute(rel)) throw new Error('Source path escapes repository');
  return absolute;
};

export const validateApprovedSource = (job, repoRoot) => {
  let sourcePath = resolveRepoFile(repoRoot, job.source.artifactPath);
  if (['produce-to-review-package', 'generic-adapter-proof'].includes(job.requestedAction)) {
    const canonical = findByPrefix(join(repoRoot, 'content', 'approved'), `${job.contentId}_`);
    if (canonical.length !== 1) return {ok: false, code: 'CONTENT_APPROVAL_MISSING', message: `Exactly one canonical approved STEP 02 artifact is required for ${job.contentId}`};
    const canonicalRelative = relative(repoRoot, canonical[0]).replaceAll('\\', '/');
    if (canonicalRelative !== job.source.artifactPath) return {ok: false, code: 'CONTENT_APPROVAL_SOURCE_MISMATCH', message: 'Job source does not identify the canonical approved STEP 02 artifact'};
    sourcePath = canonical[0];
  }
  if (!existsSync(sourcePath)) return {ok: false, code: 'CONTENT_APPROVAL_MISSING', message: 'Approved canonical source artifact does not exist'};
  const actualHash = sha256File(sourcePath);
  if (actualHash !== job.source.sha256.toUpperCase()) {
    return {ok: false, code: 'CONTENT_APPROVAL_STALE', message: 'Approved content fingerprint no longer matches the canonical artifact'};
  }
  let fields;
  try { fields = parseFrontmatter(readFileSync(sourcePath, 'utf8')); }
  catch (error) { return {ok: false, code: 'CONTENT_APPROVAL_MISSING', message: error.message}; }
  const required = {
    id: job.contentId,
    status: 'approved',
    editorial_review: 'pass',
    human_decision: 'approved',
    storyboard_handoff_status: 'READY',
    duration_check: 'PASS',
    claim_evidence_check: 'PASS',
  };
  const failures = Object.entries(required).filter(([key, value]) => fields[key] !== value).map(([key, value]) => `${key}=${String(fields[key] ?? 'missing')} (required ${value})`);
  if (failures.length) return {ok: false, code: 'CONTENT_APPROVAL_MISSING', message: `STEP 02 gate is not valid: ${failures.join('; ')}`};
  if (['produce-to-review-package', 'generic-adapter-proof'].includes(job.requestedAction)) {
    const approvalFailures = [];
    if (fields.content_approval_by !== 'product-owner') approvalFailures.push('content_approval_by=product-owner');
    if (!fields.content_approval_at || !Number.isFinite(Date.parse(String(fields.content_approval_at)))) approvalFailures.push('valid content_approval_at');
    if (typeof fields.content_approval_basis !== 'string' || !fields.content_approval_basis.trim()) approvalFailures.push('content_approval_basis');
    if (!/^[A-Fa-f0-9]{64}$/.test(String(fields.content_approval_fingerprint_sha256 ?? ''))) approvalFailures.push('content_approval_fingerprint_sha256');
    if (approvalFailures.length) return {ok: false, code: 'CONTENT_APPROVAL_PROVENANCE_MISSING', message: `Canonical STEP 02 approval provenance is incomplete: ${approvalFailures.join(', ')}`};
    let derivedFingerprint;
    try { derivedFingerprint = contentApprovalFingerprint(readFileSync(sourcePath, 'utf8')); }
    catch (error) { return {ok: false, code: 'CONTENT_APPROVAL_PROVENANCE_MISSING', message: error.message}; }
    if (derivedFingerprint !== String(fields.content_approval_fingerprint_sha256).toUpperCase()) return {ok: false, code: 'CONTENT_APPROVAL_STALE', message: 'Canonical market-facing Content Approval fingerprint is stale'};
  }
  const expectedEligibility = job.requestedAction === 'smoke-no-provider'
    ? 'smoke-only'
    : job.requestedAction === 'production-preflight'
      ? 'preflight-only'
      : 'production';
  if (fields.input_eligibility !== expectedEligibility) {
    return {ok: false, code: 'CONTENT_NOT_PRODUCTION_ELIGIBLE', message: `Source input_eligibility must be ${expectedEligibility} for this action`};
  }
  return {ok: true, sourcePath, sourceSha256: actualHash, fields};
};

const resultPaths = (paths, jobId) => ({json: join(paths.results, `${jobId}.result.json`), markdown: join(paths.results, `${jobId}.result.md`)});

const writeStatus = (paths, jobId, contentId, status, fields = {}) => atomicWriteJson(join(paths.status, `${jobId}.status.json`), {
  schemaVersion: 1, jobId, contentId, status, updatedAt: nowIso(), ...fields,
});

const resultMarkdown = (result) => `# CKAI Production Job Result\n\n- Job status: **${result.status}**\n- Job ID: \`${result.jobId}\`\n- Content ID: \`${result.contentId}\`\n- Requested action: \`${result.requestedAction}\`\n- Release state: **${result.releaseState}**\n- Final package: ${result.finalPackagePath ?? 'not available'}\n- Video: ${result.videoPath ?? 'not available'}\n- Caption: ${result.captionPath ?? 'not available'}\n- Cover: ${result.coverPath ?? 'not available'}\n- User action needed: ${result.userActionNeeded ?? 'none'}\n- Message: ${result.message}\n`;

export const writeResult = (paths, result) => {
  const outputs = resultPaths(paths, result.jobId);
  atomicWriteJson(outputs.json, result);
  atomicWrite(outputs.markdown, resultMarkdown(result));
  writeStatus(paths, result.jobId, result.contentId, result.status, {releaseState: result.releaseState, resultPath: relative(paths.repoRoot, outputs.json).replaceAll('\\', '/')});
  return outputs;
};

const baseResult = (job, status, extra = {}) => ({
  schemaVersion: 1,
  jobId: job.jobId,
  contentId: job.contentId,
  requestedAction: job.requestedAction,
  status,
  finishedAt: nowIso(),
  releaseState: 'PENDING_RELEASE_APPROVAL',
  finalPackagePath: null,
  videoPath: null,
  captionPath: null,
  coverPath: null,
  userActionNeeded: null,
  providerUsage: {vbeeSynthesisRequests: 0, vbeeCharacters: 0, automaticCreditPurchase: false, paidFallback: false},
  ...extra,
});

const findByPrefix = (directory, prefix, suffix = '.md') => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter((name) => name.startsWith(prefix) && name.endsWith(suffix)).sort().map((name) => join(directory, name));
};

const markdownSection = (markdown, headings) => {
  const escaped = headings.map((heading) => heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const match = markdown.match(new RegExp(`^##\\s+(?:${escaped})\\s*\\r?\\n([\\s\\S]*?)(?=^##\\s+|$)`, 'mi'));
  return match?.[1].trim() || null;
};

const plainMarketCopy = (value) => value
  ?.replace(/^_\(|\)_$/g, '')
  .replace(/^\*+|\*+$/g, '')
  .replace(/^['"]|['"]$/g, '')
  .trim() || null;

export const assembleExistingReviewPackage = (job, paths) => {
  const exports = findByPrefix(join(paths.repoRoot, 'content', 'exports'), job.contentId);
  if (!exports.length) return null;
  const artifactPath = exports.at(-1);
  const fields = parseFrontmatter(readFileSync(artifactPath, 'utf8'));
  const sourceOutput = typeof fields.output_path === 'string' ? resolve(dirname(artifactPath), fields.output_path) : null;
  if (!sourceOutput || !existsSync(sourceOutput) || !/^[A-Fa-f0-9]{64}$/.test(String(fields.output_sha256 ?? ''))) return null;
  if (sha256File(sourceOutput) !== String(fields.output_sha256).toUpperCase()) return null;
  if (fields.export_qa !== 'PASS' || fields.export_review !== 'pass') return null;
  const approvedMarkdown = readFileSync(resolveRepoFile(paths.repoRoot, job.source.artifactPath), 'utf8');
  const caption = plainMarketCopy(markdownSection(approvedMarkdown, ['Facebook Caption', 'Caption ngắn', 'Caption']));
  const headline = plainMarketCopy(markdownSection(approvedMarkdown, ['Working Title', 'Title', 'Headline']));
  if (!caption || !headline) return {blocked: true, code: 'FACEBOOK_COPY_MISSING', message: 'Approved content must include a Facebook Caption and Working Title/Headline before packaging.'};
  const packageDir = join(paths.repoRoot, 'generated', 'facebook-packages', job.contentId);
  mkdirSync(packageDir, {recursive: true});
  const videoPath = join(packageDir, `${job.contentId}_review-candidate.mp4`);
  copyFileSync(sourceOutput, videoPath);
  const captionPath = join(packageDir, 'caption.txt');
  const headlinePath = join(packageDir, 'headline.txt');
  const coverPath = join(packageDir, 'cover.jpg');
  atomicWrite(captionPath, `${caption}\n`);
  atomicWrite(headlinePath, `${headline}\n`);
  const cover = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', videoPath, '-frames:v', '1', coverPath], {cwd: paths.repoRoot, encoding: 'utf8', timeout: 120_000});
  if (cover.status !== 0 || !existsSync(coverPath)) return {blocked: true, code: 'FACEBOOK_COVER_FAILED', message: 'Deterministic first-frame cover extraction failed; package was not declared complete.'};
  atomicWriteJson(join(packageDir, 'package-manifest.json'), {
    contentId: job.contentId,
    packageState: 'REVIEW_PACKAGE',
    releaseState: 'PENDING_RELEASE_APPROVAL',
    sourceExportArtifact: relative(paths.repoRoot, artifactPath).replaceAll('\\', '/'),
    sourceMasterSha256: sha256File(sourceOutput),
    video: relative(paths.repoRoot, videoPath).replaceAll('\\', '/'),
    videoSha256: sha256File(videoPath),
    caption: relative(paths.repoRoot, captionPath).replaceAll('\\', '/'),
    headline: relative(paths.repoRoot, headlinePath).replaceAll('\\', '/'),
    cover: relative(paths.repoRoot, coverPath).replaceAll('\\', '/'),
  });
  return {packageDir, videoPath, captionPath, headlinePath, coverPath};
};

const executeGenericViaCli = (job, paths, proofOnly) => {
  const tsxExecutable = join(paths.repoRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'tsx.cmd' : 'tsx');
  const tsxEntrypoint = join(paths.repoRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
  const runtimeExists = process.platform === 'win32' ? existsSync(tsxEntrypoint) : existsSync(tsxExecutable);
  if (!runtimeExists) return {status: 'FAILED', message: 'Local tsx runtime is missing; run the checked-in dependency setup once.', errorCode: 'GENERIC_RUNTIME_MISSING', providerUsage: {vbeeSynthesisRequests: 0, vbeeCharacters: 0, automaticCreditPurchase: false, paidFallback: false}};
  const requestPath = join(paths.status, `${job.jobId}.adapter-request.json`);
  const outputPath = join(paths.status, `${job.jobId}.adapter-result.json`);
  atomicWriteJson(requestPath, {repoRoot: paths.repoRoot, job, proofOnly});
  const script = join(paths.repoRoot, 'runtime', 'production-bridge', 'src', 'generic-runtime.ts');
  const executable = process.platform === 'win32' ? process.execPath : tsxExecutable;
  const arguments_ = process.platform === 'win32' ? [tsxEntrypoint, script, '--request', requestPath, '--output', outputPath] : [script, '--request', requestPath, '--output', outputPath];
  const result = spawnSync(executable, arguments_, {cwd: paths.repoRoot, encoding: 'utf8', timeout: 1_800_000});
  if (result.status !== 0 || !existsSync(outputPath)) return {status: 'FAILED', message: redact((result.stderr || result.stdout || 'Generic runtime did not return a result').slice(-2000)), errorCode: 'GENERIC_RUNTIME_PROCESS_FAILED', providerUsage: {vbeeSynthesisRequests: 0, vbeeCharacters: 0, automaticCreditPurchase: false, paidFallback: false}};
  return JSON.parse(readFileSync(outputPath, 'utf8'));
};

export const executeJob = async (job, paths, options = {}) => {
  const approval = validateApprovedSource(job, paths.repoRoot);
  if (!approval.ok) return baseResult(job, 'BLOCKED', {message: approval.message, errorCode: approval.code, userActionNeeded: 'ChatGPT must repair or re-record exact STEP 02 Content Approval, then enqueue a new immutable job.'});
  if (job.requestedAction === 'smoke-no-provider') {
    return baseResult(job, 'COMPLETED', {message: 'No-provider smoke completed: approval, claim, result and zero-provider policy verified.', releaseState: 'NOT_APPLICABLE_SMOKE'});
  }
  if (job.requestedAction === 'production-preflight') {
    return baseResult(job, 'COMPLETED', {message: 'Canonical production preflight passed and stopped before render/provider spend.', releaseState: 'PENDING_PRODUCTION'});
  }
  const runGeneric = options.executeGeneric ?? ((candidate, proofOnly) => executeGenericViaCli(candidate, paths, proofOnly));
  if (job.requestedAction === 'generic-adapter-proof') {
    const result = await runGeneric(job, true);
    return baseResult(job, result.status, {message: result.message, errorCode: result.errorCode, finalPackagePath: result.artifacts?.facebookPackage ?? null, videoPath: result.artifacts?.video ?? null, captionPath: result.artifacts?.caption ?? null, coverPath: result.artifacts?.cover ?? null, providerUsage: result.providerUsage ?? baseResult(job, result.status).providerUsage, releaseState: 'PENDING_RELEASE_APPROVAL'});
  }
  const packaged = assembleExistingReviewPackage(job, paths);
  if (packaged?.blocked) {
    return baseResult(job, 'BLOCKED', {message: packaged.message, errorCode: packaged.code, userActionNeeded: 'ChatGPT must add the missing market-facing Facebook copy, obtain renewed Content Approval for the changed fingerprint, and enqueue a new job.'});
  }
  if (packaged) {
    return baseResult(job, 'COMPLETED', {
      message: 'Existing canonical STEP 08 candidate was hash-verified and packaged for review; Release Approval remains pending.',
      finalPackagePath: relative(paths.repoRoot, packaged.packageDir).replaceAll('\\', '/'),
      videoPath: relative(paths.repoRoot, packaged.videoPath).replaceAll('\\', '/'),
      captionPath: relative(paths.repoRoot, packaged.captionPath).replaceAll('\\', '/'),
      coverPath: relative(paths.repoRoot, packaged.coverPath).replaceAll('\\', '/'),
    });
  }
  const runtime = await runGeneric(job, false);
  if (runtime.status !== 'COMPLETED') return baseResult(job, runtime.status, {message: runtime.message, errorCode: runtime.errorCode, providerUsage: runtime.providerUsage ?? baseResult(job, runtime.status).providerUsage, userActionNeeded: runtime.status === 'BLOCKED' ? 'ChatGPT Work must satisfy the reported canonical gate and enqueue a new unique continuation job.' : 'Codex must inspect the technical runtime failure.'});
  const completedPackage = assembleExistingReviewPackage(job, paths);
  if (!completedPackage) return baseResult(job, 'FAILED', {message: 'Generic runtime completed but no hash-valid canonical STEP 08 candidate was available for packaging.', errorCode: 'FACEBOOK_PACKAGE_ASSEMBLY_FAILED', providerUsage: runtime.providerUsage});
  return baseResult(job, 'COMPLETED', {message: 'Generic canonical STEP 03–08 runtime completed and produced a Facebook Review Package; Release Approval remains pending.', finalPackagePath: relative(paths.repoRoot, completedPackage.packageDir).replaceAll('\\', '/'), videoPath: relative(paths.repoRoot, completedPackage.videoPath).replaceAll('\\', '/'), captionPath: relative(paths.repoRoot, completedPackage.captionPath).replaceAll('\\', '/'), coverPath: relative(paths.repoRoot, completedPackage.coverPath).replaceAll('\\', '/'), providerUsage: runtime.providerUsage});
};

const statePath = (runningJobPath) => runningJobPath.replace(/\.job\.json$/, '.state.json');
const filenameFor = (jobId) => `${jobId}.job.json`;

export const recoverRunningJobs = (paths) => {
  ensureBridgeDirectories(paths);
  const recovered = [];
  for (const name of readdirSync(paths.running).filter((entry) => entry.endsWith('.job.json'))) {
    const runningPath = join(paths.running, name);
    let job;
    try { job = readJobFile(runningPath); }
    catch (error) {
      const failedPath = join(paths.failed, `${basename(name, '.job.json')}.${safeStamp()}.job.json`);
      renameSync(runningPath, failedPath);
      appendLog(paths, 'error', 'recovery-malformed', {file: name, error: error.message});
      continue;
    }
    const checkpointPath = statePath(runningPath);
    const checkpoint = existsSync(checkpointPath) ? JSON.parse(readFileSync(checkpointPath, 'utf8')) : {phase: 'CLAIMED'};
    if (checkpoint.phase === 'CLAIMED') {
      renameSync(runningPath, join(paths.inbox, name));
      if (existsSync(checkpointPath)) renameSync(checkpointPath, join(paths.inbox, name.replace(/\.job\.json$/, '.recovered.state.json')));
      appendLog(paths, 'warn', 'job-requeued-after-restart', {jobId: job.jobId});
      writeStatus(paths, job.jobId, job.contentId, 'QUEUED', {recoveredAfterRestart: true});
      recovered.push({jobId: job.jobId, outcome: 'REQUEUED'});
    } else {
      const result = baseResult(job, 'BLOCKED', {message: 'Runner restarted after execution began; automatic retry is disabled to prevent duplicate provider/render work.', errorCode: 'EXECUTION_INTERRUPTED_AUDIT_REQUIRED', userActionNeeded: 'ChatGPT/Codex must inspect canonical outputs before creating a new job.'});
      writeResult(paths, result);
      renameSync(runningPath, join(paths.blocked, name));
      if (existsSync(checkpointPath)) renameSync(checkpointPath, join(paths.blocked, basename(checkpointPath)));
      appendLog(paths, 'warn', 'job-blocked-after-interrupted-execution', {jobId: job.jobId});
      recovered.push({jobId: job.jobId, outcome: 'BLOCKED'});
    }
  }
  return recovered;
};

export const claimJob = (paths, inboxPath) => {
  const name = basename(inboxPath);
  const runningPath = join(paths.running, name);
  try { renameSync(inboxPath, runningPath); }
  catch (error) { if (error.code === 'ENOENT' || error.code === 'EACCES' || error.code === 'EPERM') return null; throw error; }
  atomicWriteJson(statePath(runningPath), {phase: 'CLAIMED', claimedAt: nowIso(), pid: process.pid});
  return runningPath;
};

export const processClaimedJob = async (paths, runningPath, options = {}) => {
  let job;
  try { job = readJobFile(runningPath); }
  catch (error) {
    const fallbackId = basename(runningPath, '.job.json');
    const result = {schemaVersion: 1, jobId: fallbackId, contentId: 'UNKNOWN', requestedAction: 'UNKNOWN', status: 'FAILED', finishedAt: nowIso(), releaseState: 'NOT_APPLICABLE', finalPackagePath: null, videoPath: null, captionPath: null, coverPath: null, userActionNeeded: 'Fix malformed job and enqueue a new unique job ID.', providerUsage: {vbeeSynthesisRequests: 0, vbeeCharacters: 0, automaticCreditPurchase: false, paidFallback: false}, message: redact(error.message), errorCode: 'MALFORMED_JOB'};
    writeResult(paths, result);
    renameSync(runningPath, join(paths.failed, basename(runningPath)));
    const checkpoint = statePath(runningPath); if (existsSync(checkpoint)) renameSync(checkpoint, join(paths.failed, basename(checkpoint)));
    appendLog(paths, 'error', 'job-failed-malformed', {jobId: fallbackId, error: error.message});
    return result;
  }
  if (basename(runningPath) !== filenameFor(job.jobId)) {
    const result = baseResult(job, 'FAILED', {message: 'Job filename must exactly match <jobId>.job.json', errorCode: 'JOB_FILENAME_MISMATCH', userActionNeeded: 'ChatGPT Work must enqueue a new unique job using the canonical filename.'});
    writeResult(paths, result);
    renameSync(runningPath, join(paths.failed, `${job.jobId}.${safeStamp()}.job.json`));
    const checkpoint = statePath(runningPath); if (existsSync(checkpoint)) renameSync(checkpoint, join(paths.failed, `${job.jobId}.${safeStamp()}.state.json`));
    appendLog(paths, 'error', 'job-failed-filename-mismatch', {jobId: job.jobId});
    return result;
  }
  const outputs = resultPaths(paths, job.jobId);
  if (existsSync(outputs.json)) {
    const existing = JSON.parse(readFileSync(outputs.json, 'utf8'));
    const duplicatePath = join(paths.duplicates, `${job.jobId}.${safeStamp()}.job.json`);
    renameSync(runningPath, duplicatePath);
    const checkpoint = statePath(runningPath); if (existsSync(checkpoint)) renameSync(checkpoint, duplicatePath.replace(/\.job\.json$/, '.state.json'));
    writeStatus(paths, job.jobId, job.contentId, existing.status, {releaseState: existing.releaseState, resultPath: relative(paths.repoRoot, outputs.json).replaceAll('\\', '/'), duplicateIgnored: true});
    appendLog(paths, 'warn', 'duplicate-job-ignored', {jobId: job.jobId, existingStatus: existing.status});
    return existing;
  }
  writeStatus(paths, job.jobId, job.contentId, 'RUNNING', {requestedAction: job.requestedAction});
  atomicWriteJson(statePath(runningPath), {phase: 'EXECUTING', startedAt: nowIso(), pid: process.pid});
  appendLog(paths, 'info', 'job-started', {jobId: job.jobId, contentId: job.contentId, requestedAction: job.requestedAction});
  let result;
  try { result = await executeJob(job, paths, options); }
  catch (error) { result = baseResult(job, 'FAILED', {message: redact(error.message), errorCode: 'TECHNICAL_EXECUTION_FAILURE', userActionNeeded: 'ChatGPT/Codex should inspect the technical failure and enqueue a new unique job after repair.'}); }
  writeResult(paths, result);
  const destination = result.status === 'COMPLETED' ? paths.completed : result.status === 'BLOCKED' ? paths.blocked : paths.failed;
  renameSync(runningPath, join(destination, filenameFor(job.jobId)));
  const checkpoint = statePath(runningPath); if (existsSync(checkpoint)) renameSync(checkpoint, join(destination, `${job.jobId}.state.json`));
  appendLog(paths, result.status === 'FAILED' ? 'error' : 'info', 'job-finished', {jobId: job.jobId, status: result.status, errorCode: result.errorCode ?? null});
  return result;
};

export const runOnce = async (repoRoot, options = {}) => {
  const paths = bridgePaths(repoRoot);
  ensureBridgeDirectories(paths);
  const candidates = readdirSync(paths.inbox).filter((name) => name.endsWith('.job.json')).sort();
  const results = [];
  for (const name of candidates) {
    const claimed = claimJob(paths, join(paths.inbox, name));
    if (claimed) results.push(await processClaimedJob(paths, claimed, options));
  }
  return results;
};

export const createJobFile = (repoRoot, job) => {
  validateJob(job);
  const paths = bridgePaths(repoRoot); ensureBridgeDirectories(paths);
  const path = join(paths.inbox, filenameFor(job.jobId));
  if (existsSync(path) || existsSync(resultPaths(paths, job.jobId).json)) throw new Error(`Job ID already exists: ${job.jobId}`);
  atomicWriteJson(path, job);
  writeStatus(paths, job.jobId, job.contentId, 'QUEUED', {requestedAction: job.requestedAction});
  return path;
};
