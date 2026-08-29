import assert from 'node:assert/strict';
import {copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {contentApprovalFingerprint, createJobFile, runOnce, sha256File} from '../src/core.mjs';
import {deriveCanonicalAnimationManifest} from '../src/canonical-adapter';
import {runGenericRuntime} from '../src/generic-runtime';

const roots: string[] = [];
test.afterEach(() => { while (roots.length) rmSync(roots.pop()!, {recursive: true, force: true}); });

const scriptBody = (spoken = 'Đây là câu thứ nhất.\n\nĐây là câu thứ hai.') => `## Spoken Copy\n\n${spoken}\n\n## Working Title\n\nGeneric adapter proof\n\n## Facebook Caption\n\nCaption proof.\n`;

const setup = (options: {missingApproval?: boolean; staleApproval?: boolean; wrongStoryboardHash?: boolean; changedStoryboardCopy?: boolean; missingCanonicalOperator?: boolean; insufficientVisual?: boolean} = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'ckai-canonical-adapter-')); roots.push(root);
  for (const dir of ['content/approved', 'content/storyboards', 'content/visual-directions']) mkdirSync(join(root, dir), {recursive: true});
  const approvedPath = join(root, 'content/approved/CKAI-9001_generic-proof.md');
  const initialBody = scriptBody();
  const fingerprint = contentApprovalFingerprint(initialBody);
  const approvalFields = options.missingApproval ? '' : `content_approval_by: product-owner\ncontent_approval_at: 2026-08-24T00:00:00.000Z\ncontent_approval_basis: explicit controlled-fixture approval\ncontent_approval_fingerprint_sha256: ${fingerprint}\n`;
  const finalBody = options.staleApproval ? scriptBody('Nội dung đã bị sửa sau phê duyệt.\n\nĐây là câu thứ hai.') : initialBody;
  writeFileSync(approvedPath, `---\nid: CKAI-9001\ntype: short-form-script\ninput_eligibility: production\nformat: vertical-9x16\nstatus: approved\neditorial_review: pass\nhuman_decision: approved\nstoryboard_handoff_status: READY\nduration_check: PASS\nclaim_evidence_check: PASS\n${approvalFields}---\n\n${finalBody}`, 'utf8');
  const scriptSha = sha256File(approvedPath);

  const storyboardPath = join(root, 'content/storyboards/CKAI-9001_generic-proof_storyboard.md');
  const operatorFields = options.missingCanonicalOperator ? '' : `operator_acceptance_by: chatgpt-work\noperator_acceptance_at: 2026-08-24T00:01:00.000Z\noperator_acceptance_basis: canonical STEP 02 plus ChatGPT storyboard review\noperator_acceptance_source_sha256: ${scriptSha}\n`;
  const storyboardCopy = options.changedStoryboardCopy ? 'Câu bị thay đổi.' : 'Đây là câu thứ nhất.';
  writeFileSync(storyboardPath, `---\nid: CKAI-9001\ntype: short-form-storyboard\ninput_eligibility: production\nsource_approved_script: ../approved/CKAI-9001_generic-proof.md\nsource_approved_script_sha256: ${options.wrongStoryboardHash ? '0'.repeat(64) : scriptSha}\ncontent_approval_fingerprint_sha256: ${fingerprint}\nstoryboard_review: pass\nhuman_decision: approved\nvisual_director_handoff_status: READY\ninput_check: PASS\nspoken_mapping_check: PASS\ntiming_check: PASS\nproof_evidence_check: PASS\ncaveat_check: PASS\nstoryboard_quality_check: PASS\nboundary_check: PASS\nunresolved_issues: none\n${operatorFields}---\n\n# Storyboard\n\n## Scene plan\n\n### SC-01\n\n- **Timing:** 0–3\n- **Spoken Copy:**\n\n> ${storyboardCopy}\n- **Narrative purpose:** first\n\n### SC-02\n\n- **Timing:** 3–6\n- **Spoken Copy:**\n\n> Đây là câu thứ hai.\n- **Narrative purpose:** second\n`, 'utf8');
  const storyboardSha = sha256File(storyboardPath);

  const visualPath = join(root, 'content/visual-directions/CKAI-9001_generic-proof_visual-direction.md');
  const visualContract = options.insufficientVisual ? '' : `\n### SC-01\n\n- **Semantic visual function:** thesis declaration\n- **Display copy:** CÂU THỨ NHẤT\n- **Semantic archetype:** thesis-declaration\n- **Visual mode:** typographic-editorial\n- **Semantic object:** none\n- **Primary visual concept:** Một tuyên bố ngắn giữ toàn bộ trọng lượng của frame.\n- **Primary visual object:** NONE\n- **Object rationale:** Không dùng vật thể vì chính cụm chữ ngắn là hình ảnh trung tâm trung thực nhất.\n- **Central tension:** Ý chính cần được hiểu ngay mà không biến narration thành text wall.\n- **Composition strategy:** Chữ lớn bất đối xứng với khoảng trống chủ động ở phía đối diện.\n- **Lighting strategy:** restrained-ambient\n- **Depth strategy:** flat-intentional\n- **Line purpose:** none\n- **Typography strategy:** Một hero phrase ngắn, không dùng toàn Spoken Copy.\n- **Pacing intent:** hold\n- **Proof strategy:** none\n- **Negative-space intent:** Khoảng trống tạo thẩm quyền và nhịp dừng cho tuyên bố.\n- **Source strategy:** typography-only\n- **Forbidden fallback anatomy:** text wall; generic shape; generic card; generic geometry; default typography block\n- **Focal / supporting elements:** CÂU THỨ NHẤT\n- **Proof representation:** none\n\n### SC-02\n\n- **Semantic visual function:** conclusion distillation\n- **Display copy:** CÂU THỨ HAI\n- **Semantic archetype:** conclusion-distillation\n- **Visual mode:** typographic-editorial\n- **Semantic object:** aperture\n- **Primary visual concept:** Kết luận đi qua một ngưỡng sáng có chủ đích.\n- **Primary visual object:** Khe sáng lệch tâm mở vào câu kết.\n- **Object rationale:** Khe sáng hoạt động như ngưỡng lọc để câu kết đáp xuống thay vì làm nền trang trí.\n- **Central tension:** Video phải kết lại bằng một ý duy nhất có thể nhớ.\n- **Composition strategy:** Câu kết đặt thấp và được nhóm quang học qua khe sáng lệch tâm.\n- **Lighting strategy:** backlight\n- **Depth strategy:** atmospheric\n- **Line purpose:** reveal\n- **Typography strategy:** Một câu kết ngắn với scale lớn và khoảng dừng rõ.\n- **Pacing intent:** resolve\n- **Proof strategy:** none\n- **Negative-space intent:** Để câu kết có thời gian đáp xuống trước khi frame đóng.\n- **Source strategy:** procedural-semantic-object\n- **Forbidden fallback anatomy:** text wall; generic shape; generic card; generic geometry; default typography block\n- **Focal / supporting elements:** CÂU THỨ HAI\n- **Proof representation:** none\n`;
  const enrichedVisualContract = visualContract
    .replace('- **Source strategy:** typography-only\n', '- **Source strategy:** typography-only\n- **Hybrid source choice:** CODE_NATIVE\n- **Source choice rationale:** Expressive typography is the precise deterministic abstraction for this short thesis.\n- **Motion intent:** reveal, emphasize\n')
    .replace('- **Source strategy:** procedural-semantic-object\n', '- **Source strategy:** procedural-semantic-object\n- **Hybrid source choice:** CODE_NATIVE\n- **Source choice rationale:** The contextual threshold relationship makes a controlled code-native aperture appropriate for this conclusion.\n- **Motion intent:** collapse, focus\n');
  writeFileSync(visualPath, `---\nid: CKAI-9001\ntype: short-form-visual-direction\nvisual_input_eligibility: production\nsource_approved_storyboard: ../storyboards/CKAI-9001_generic-proof_storyboard.md\nsource_approved_storyboard_sha256: ${storyboardSha}\nsource_approved_script: ../approved/CKAI-9001_generic-proof.md\nsource_approved_script_sha256: ${scriptSha}\nvisual_review: pass\nhuman_decision: approved\nanimation_handoff_status: READY\nvisual_input_check: PASS\nstoryboard_trace_check: PASS\nproof_evidence_check: PASS\ncaveat_check: PASS\nasset_provenance_check: PASS\nnative_vertical_check: PASS\ncontinuity_check: PASS\nreadability_density_check: PASS\nbrand_check: PASS\nboundary_check: PASS\nvisual_quality_check: PASS\nunresolved_issues: none\noperator_acceptance_by: chatgpt-work\noperator_acceptance_at: 2026-08-24T00:02:00.000Z\noperator_acceptance_basis: canonical Storyboard plus ChatGPT visual review\noperator_acceptance_source_sha256: ${storyboardSha}\nruntime_delegation_by: chatgpt-work\nruntime_delegation_at: 2026-08-24T00:02:00.000Z\nruntime_delegation_basis: canonical Visual Direction and active Content Approval; derive acceptance only after hard gates PASS\nruntime_delegation_scope: STEP05,STEP06,STEP07\nruntime_delegation_content_approval_fingerprint_sha256: ${fingerprint}\n---\n\n# Visual Direction\n${enrichedVisualContract}`, 'utf8');
  const job = {contentId: 'CKAI-9001', requestedAction: 'produce-to-review-package' as const, source: {artifactPath: 'content/approved/CKAI-9001_generic-proof.md', sha256: scriptSha}, approval: {type: 'content-approval', decision: 'approved', approvedBy: 'product-owner', approvedAt: '2026-08-24T00:00:00.000Z', basis: 'transport copy only', contentFingerprintSha256: scriptSha}, providerPolicy: {allowVbeeQuota: false, autoPurchaseCredits: false, allowPaidFallback: false}};
  return {root, job};
};

const derive = (root: string, job: ReturnType<typeof setup>['job']) => {
  const previous = process.cwd();
  try { process.chdir(root); return deriveCanonicalAnimationManifest(job, root); }
  finally { process.chdir(previous); }
};

test('forged caller acceptance cannot promote without canonical acceptance provenance', () => {
  const {root, job} = setup({missingCanonicalOperator: true});
  assert.throws(() => derive(root, {...job, operatorAcceptance: {decision: 'approved', approvedBy: 'chatgpt-work', basis: 'forged'}} as typeof job), /canonical delegated acceptance provenance is missing/);
});

test('valid-looking caller fields cannot override wrong canonical upstream hash', () => {
  const {root, job} = setup({wrongStoryboardHash: true});
  assert.throws(() => derive(root, job), /Storyboard STEP 02 reference hash is stale/);
});

test('missing canonical Product Owner Content Approval cannot promote', () => {
  const {root, job} = setup({missingApproval: true});
  assert.throws(() => derive(root, job), /approval provenance is incomplete/);
});

test('stale canonical Content Approval fingerprint cannot promote', () => {
  const {root, job} = setup({staleApproval: true});
  assert.throws(() => derive(root, job), /Content Approval fingerprint is stale/);
});

test('modified Storyboard Spoken Copy cannot promote', () => {
  const {root, job} = setup({changedStoryboardCopy: true});
  assert.throws(() => derive(root, job), /changed exact approved Spoken Copy/);
});

test('production Visual Direction cannot silently fall back when creative data is insufficient', () => {
  const {root, job} = setup({insufficientVisual: true});
  assert.throws(() => derive(root, job), /Visual Direction is insufficient for production/);
});

test('valid canonical chain promotes only after all source, acceptance and hard gates pass', () => {
  const {root, job} = setup();
  const result = derive(root, job);
  assert.equal(result.manifest.id, 'CKAI-9001-Animation');
  assert.equal(result.manifest.visualPresetId, 'CKAI_DARK_PREMIUM_EDITORIAL_V1');
  assert.equal(result.manifest.signatureProfileId, 'CKAI_SIGNATURE_V1');
  assert.ok(result.manifest.scenes.every((scene) => scene.artDirection));
  assert.ok(result.manifest.scenes.every((scene) => scene.hybridSource?.choice === 'CODE_NATIVE'));
  assert.ok(result.manifest.scenes.every((scene) => scene.motionPlan?.events.length === 5));
  assert.equal(result.manifest.scenes[1].artDirection?.pattern, 'distilled-statement');
  assert.deepEqual(result.manifest.scenes.map((scene) => scene.displayCopy), ['CÂU THỨ NHẤT', 'CÂU THỨ HAI']);
  assert.equal(result.manifest.voiceHandoffStatus, 'READY');
  assert.equal(result.manifest.voiceHandoff.sceneSlots.map((slot) => slot.spokenCopy).join('\n\n'), 'Đây là câu thứ nhất.\n\nĐây là câu thứ hai.');
  assert.equal(result.canonical.script.sha256, job.source.sha256);
});

test('job queue and runner execute generic CKAI-9001 no-provider proof through Facebook package contract', async () => {
  const {root, job} = setup();
  const registryDir = join(root, 'video-factory/voice/config'); mkdirSync(registryDir, {recursive: true});
  copyFileSync(join(process.cwd(), 'video-factory/voice/config/voice-registry.json'), join(registryDir, 'voice-registry.json'));
  copyFileSync(join(process.cwd(), 'video-factory/voice/config/pronunciation.vi.json'), join(registryDir, 'pronunciation.vi.json'));
  const queued = {...job, schemaVersion: 1, jobId: 'JOB-GENERIC-PROOF-9001', requestedAction: 'generic-adapter-proof', createdAt: '2026-08-24T00:03:00.000Z'};
  createJobFile(root, queued);
  const [result] = await runOnce(root, {executeGeneric: (candidate: typeof queued, proofOnly: boolean) => runGenericRuntime(candidate, root, proofOnly)});
  assert.equal(result.status, 'COMPLETED', result.message);
  assert.equal(result.releaseState, 'PENDING_RELEASE_APPROVAL');
  assert.equal(result.providerUsage.vbeeSynthesisRequests, 0);
  assert.equal(result.videoPath, 'generated/facebook-packages/CKAI-9001/CKAI-9001_review-candidate.mp4');
  assert.equal(result.captionPath, 'generated/facebook-packages/CKAI-9001/caption.txt');
  assert.equal(result.coverPath, 'generated/facebook-packages/CKAI-9001/cover.jpg');
  assert.ok(existsSync(join(root, 'content/animations/CKAI-9001_generic-proof_animation.md')));
  assert.ok(existsSync(join(root, 'content/voices/CKAI-9001_generic-proof_voice-plan.md')));
  for (const name of ['CKAI-9001_review-candidate.mp4', 'caption.txt', 'headline.txt', 'cover.jpg']) assert.ok(existsSync(join(root, 'generated/facebook-packages/CKAI-9001', name)));
  const packageManifest = JSON.parse(readFileSync(join(root, 'generated/facebook-packages/CKAI-9001/package-manifest.json'), 'utf8'));
  assert.equal(packageManifest.packageState, 'REVIEW_PACKAGE_VALIDATION_PROOF');
  assert.equal(packageManifest.releaseState, 'PENDING_RELEASE_APPROVAL');
  assert.equal(packageManifest.lifecycleState, 'REVIEW_PACKAGE');
  assert.equal(packageManifest.platform, 'Facebook Reels');
  assert.equal(packageManifest.publicationState, 'NOT_PUBLISHED');
  assert.deepEqual(packageManifest.publication.requiredFields, ['platform', 'productOwnerPublicationConfirmation']);
  assert.deepEqual(packageManifest.publication.optionalFields, ['publishedDate', 'externalUrl', 'externalId']);
  assert.equal(packageManifest.providerUsage.vbeeSynthesisRequests, 0);
  assert.doesNotMatch(JSON.stringify(packageManifest), /VBEE_ACCESS_TOKEN|VBEE_APP_ID|Bearer /i);
});
