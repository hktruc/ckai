# CKAI One-Chat Production Bridge

Thin local filesystem IPC only: **transport + trigger + job-state adapter**. It has no editorial, Script, visual, validation or release authority and never runs arbitrary commands from a job.

Canonical production workspace: `D:\\0_Agent\\01_CKAI`. The Google Drive copy is backup/non-runtime only. Dependency setup is a one-time technical operation; Product Owner does not manage npm or `node_modules` in daily use.

## Daily Work instruction

After the Product Owner says **“Duyệt.”**, ChatGPT Work follows one short canonical instruction:

> Persist this exact approved market-facing content as canonical CKAI STEP 02 Content Approval, including approved Facebook caption/headline and canonical Content Approval fingerprint; create/review hash-bound canonical STEP 03 Storyboard and STEP 04 Visual Direction with delegated provenance; then atomically enqueue one `produce-to-review-package` job. Do not modify the approved wording. Do not set Release Approval.

Work writes a temporary file not ending in `.job.json`, then renames it to `runtime/jobs/inbox/<JOB-ID>.job.json`. The runner only claims complete `.job.json` files. No terminal command or Codex chat is part of daily use.

## Job contract

Machine schema: [`job-contract.schema.json`](job-contract.schema.json). Example: [`examples/SMOKE-JOB.template.json`](examples/SMOKE-JOB.template.json).

Required semantics:

- globally unique `jobId` and canonical `contentId`;
- allowlisted `requestedAction` only;
- repo-relative approved STEP 02 `source.artifactPath` plus exact SHA-256;
- direct Product Owner Content Approval basis bound to the same fingerprint;
- provider policy always keeps `autoPurchaseCredits: false` and `allowPaidFallback: false`;
- `allowVbeeQuota: true` is valid only for an actual `produce-to-review-package` job with explicit existing-quota authorization. Smoke and preflight require `false`.
- `allowOpenAIImageGeneration: true` is valid only for an actual production job and is the explicit opt-in for generated, non-evidentiary Key Visuals. `maxOpenAIImageUsd` is optional; call-count and attempt guards remain mandatory even when exact USD cost is unknown.

The source gate requires `status: approved`, `editorial_review: pass`, `human_decision: approved`, `storyboard_handoff_status: READY`, `duration_check: PASS`, `claim_evidence_check: PASS`, matching action eligibility (`smoke-only`, `preflight-only` or real `production`), matching Content ID and unchanged hash. Real production additionally derives the market-facing fingerprint from canonical STEP 02 sections and verifies Product Owner approval provenance stored in that artifact. Job approval fields are transport copies and cannot confer authority. Missing approval is `BLOCKED`; changed hash/fingerprint is `CONTENT_APPROVAL_STALE`.

## Lifecycle and safety

`QUEUED (inbox) → RUNNING (running) → COMPLETED | BLOCKED | FAILED`.

- Claim is one filesystem rename, so two runners cannot claim the same file.
- A terminal result is the idempotency ledger; duplicate job IDs are preserved under `duplicates/` and never executed again.
- Restart recovery requeues only checkpoint `CLAIMED`. If execution had begun, the job becomes `BLOCKED` for audit—there is no automatic retry that could duplicate render/provider work.
- Poll interval defaults to 5 seconds (allowed 1–60 seconds); the process sleeps between polls.
- Active/terminal state is machine-readable at `status/<JOB-ID>.status.json`; terminal detail is at `results/*.result.json` and `.md`. Logs are JSON Lines with Vbee credential redaction; ChatGPT Work never parses logs.
- `BLOCKED` means a valid gate/owner decision is needed. `FAILED` means technical execution failed.

Generic production is parameterized by Content ID. The adapter discovers canonical STEP 02/03/04 artifacts from disk, verifies exact upstream references, SHA-256, Content Approval fingerprint, exact Spoken Copy, delegated provenance and existing hard gates before deriving STEP 05 runtime state. TEST-0002 remains fixture-only and is never a production template or authority.

Before STEP 05 rendering, the same generic path now normalizes Scene Semantic Plans, runs the whole-video Retention Director, routes each scene to `CODE_NATIVE | REAL_EVIDENCE | GENERATED_KEY_VISUAL`, enforces `GENERATED_ASSET != EVIDENCE`, prepares authorized assets, runs actual-binary asset Vision QA, and validates an actual composed frame. STEP 07 retains final authority and adds actual rendered-video retention QA; machine scores never replace human viewer acceptance. Policy: [`../../engine/semantic-retention-visual-intelligence.md`](../../engine/semantic-retention-visual-intelligence.md).

Phase 1H turns each Retention Plan into runtime constraints: multi-beat scene execution, CODE_NATIVE semantic mechanisms, narration-aware scene-tail retiming, `UNMOTIVATED_SILENCE_POLICY_V1`, actual-MP4 planned-vs-executed beat analysis and whole-video creative-continuity QA. A Review Package records `retention-execution.json`, `semantic-mechanisms.json`, `actual-retention-timeline.json` and `creative-continuity-qa.json`; a plan/runtime mismatch or severe continuity failure cannot become machine PASS.

STEP 06 and STEP 07 acceptance is also canonical-artifact-backed: the runner first persists a technically verified `BLOCKED` snapshot; ChatGPT Work reviews it and records delegated acceptance in the existing Voice/Final Review artifact bound to that snapshot hash; a unique continuation job can then advance. Caller/job fields alone cannot promote. This remains one ChatGPT Work chat and requires no Product Owner terminal/Codex operation; Product Owner only says **Duyệt**, reviews the final package, then says **Chốt**. A no-provider `generic-adapter-proof` action exists only for controlled CKAI-format fixtures and cannot consume Vbee quota.

## Facebook Package

Review deliverable path: `generated/facebook-packages/<CONTENT-ID>/`:

- `<CONTENT-ID>_review-candidate.mp4` — exact hash-verified STEP 08 candidate;
- `caption.txt` — exact approved Facebook Caption;
- `headline.txt` — exact approved Working Title/Headline;
- `package-manifest.json` — source paths/hashes and `REVIEW_PACKAGE + PENDING_RELEASE_APPROVAL`;
- cover is optional. When implemented, it must be a deterministic frame from the approved video/visual source, not a new image-generation engine.

No package is marked release-approved before **“Chốt.”** ChatGPT Work records STEP 08 direct Release Approval against the exact release version and output SHA-256. Any binary/content/version/hash change invalidates it. The MVP never uploads to Facebook.

## Maintainer-only commands

```text
npm run bridge:test
npm run bridge:once
npm run bridge:watch
powershell -NoProfile -ExecutionPolicy Bypass -File runtime/production-bridge/windows/manage-runner.ps1 install
powershell -NoProfile -ExecutionPolicy Bypass -File runtime/production-bridge/windows/manage-runner.ps1 status
powershell -NoProfile -ExecutionPolicy Bypass -File runtime/production-bridge/windows/manage-runner.ps1 stop
powershell -NoProfile -ExecutionPolicy Bypass -File runtime/production-bridge/windows/manage-runner.ps1 uninstall
```

`install` creates a current-user Startup entry and starts a hidden Node process; no admin or Windows Service. `uninstall` stops the verified runner PID and removes only that Startup entry. This is one-time machine setup, not daily Product Owner UX.

## Phase 1H.5 perceptual gate

Production may opt into `allowOpenAIVision: true` without authorizing new image generation. The runner samples ordered actual-MP4 states cost-consciously, records perceptually distinct/weak beats and blocks with `PERCEPTUAL_PROGRESSION_REPLAN_REQUIRED` before Voice acceptance when hook, hold, evidence, CODE_NATIVE or payoff perception fails. Runtime event count cannot confer perceptual PASS.
