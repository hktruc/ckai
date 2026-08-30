# CKAI Operations Runbook

> Quick reference for Claude Code sessions. Full context: [FACTORY_HANDOVER_SNAPSHOT_2026-08-30.md](content/reports/FACTORY_HANDOVER_SNAPSHOT_2026-08-30.md)

---

## How to Start a New Production Task

### 1. Check Current State

```bash
# Validate project state
project-state:validate

# Run tests
animation:typecheck
```

### 2. Identify Task Type

| Input | Skill | Output |
|-------|-------|--------|
| Need content ideas | `/ck-idea` | 5 ideas |
| Have topic, need angles | `/ck-expand <topic>` | 10–15 angles |
| Have AITIP/idea ready | `/ck-script <id>` | Script ≤55s |
| Have script to review | `/ck-review <script-id>` | PUBLISH/REVISE/REJECT |
| Video published | `/ck-publish <id>` | Record closing |
| Have metrics | `/ck-learn <id>` | Performance log |

### 3. Production Pipeline

```
ChatGPT (Content Approval)
    ↓
runtime/production-bridge (Job Enqueue)
    ↓
Generic Runtime (STEP 05–08)
    ↓
Facebook Package + Manifest
    ↓
Product Owner (Release Approval)
    ↓
Manual Facebook Upload
    ↓
/ck-publish → Learning
```

---

## Source-of-Truth Order

1. **`PROJECT.md`** — Single Source of Truth
2. **`AGENTS.md`** — Codex/agent behavior rules
3. **`.agents/skills/ck-*/SKILL.md`** — Canonical workflow sources
4. **Engine files** (`engine/*.md`) — Technical contracts
5. **Runtime files** (`runtime/`, `video-factory/`) — Implementation

**Rule:** Never contradict PROJECT.md. If you find a contradiction, flag it.

---

## Preflight Checks

### Before Any Content Work

```bash
# Check content-index for duplicates
cat data/content-index.csv

# Verify no TEST-* entries in production
grep "TEST-" data/content-index.csv | head
```

### Before Production

```bash
# TypeScript check
animation:typecheck

# Run test suite
animation:test
review:test
voice:test
```

### Before New Script

- Verify no duplicate concept exists (`ck-idea` anti-duplication)
- Check `data/content-index.csv` for existing CKAI-*
- Confirm Personal Story exists if needed
- Confirm Facts verified if current research

---

## Render / Reuse Rules

### Reuse Existing Components

| Asset | Reuse From |
|-------|------------|
| Visual grammar | CKAI-0006 V1.2 (Practical Baseline) |
| Audio mix | CKAI-0005 Final Audio V2 |
| Animation template | `video-factory/animation/src/manifest/test0002.ts` |
| Music | `content/references/audio/music-library-v1/` |

### DO NOT Reuse

- CKAI-0007 compositions (quarantined)
- TEST-* entries (smoke test only)
- Hardcoded strings from test fixtures

---

## QA Sequence

### Content QA

```
1. Duration check     → ≤ 55s (ceiling)
2. Evidence ledger    → All claims sourced
3. Chánh Kiến Filter  → No overclaim/cherry-pick
4. Editorial verdict  → PUBLISH
5. Product Owner      → Content Approval
```

### Production QA

```
1. Input check    → Source chain verified
2. Animation QA    → Manifest valid
3. Voice QA       → Timing fits slots
4. Final Review   → AV review pass
5. Export QA      → SHA-256 verified
6. Release        → Product Owner Approval
```

### Validation Commands

```bash
project-state:validate   # Schema validation
animation:typecheck      # TypeScript
review:validate          # Final review QA
```

---

## Report Requirements

### Per Content Item

1. **Script**: `content/scripts/CKAI-*.md`
2. **Approved**: `content/approved/CKAI-*.md`
3. **Storyboard**: `content/storyboards/CKAI-*.md`
4. **Animation**: `content/animations/CKAI-*.md`
5. **Voice**: `content/voices/CKAI-*.md`
6. **Review**: `content/reviews/CKAI-*.md`
7. **Export**: `content/exports/CKAI-*.md`

### Report Files

- Location: `content/reports/`
- Naming: `{CONTENT-ID}_{version}_{purpose}.md`
- Must include: date, status, verdict, evidence

---

## Timing Requirements

| Phase | Target | Hard Limit |
|-------|--------|------------|
| Script | 50s | 55s (approval) |
| Animation | Target frames | 60s absolute |
| Voice | Fit slots | No overflow |
| Export | Exact master | 60s absolute |

---

## Blocker Escalation

### Internal Blocker (Codex can resolve)

- Schema validation failure
- TypeScript error
- Test failure
- Gate not passing

### External Blocker (Requires Product Owner/ChatGPT)

| Blocker | Escalation |
|---------|------------|
| Brand-sensitive direction | ChatGPT → Product Owner |
| Creative quality judgment | ChatGPT → Product Owner |
| Cost/quota authorization | ChatGPT → Product Owner |
| Legal/licensing uncertainty | ChatGPT → Product Owner |
| Release decision | Product Owner |
| New production pilot | Product Owner + ChatGPT |

**Rule:** Never claim something "approved" without explicit approval signal.

---

## Product / Creative Approval Boundary

### What Product Owner Decides

| Decision | Type |
|----------|------|
| Content direction (what to make) | Product Owner |
| Angle/hook/final copy | Product Owner (Content Approval) |
| Release version | Product Owner (Release Approval) |
| Cost/quota authorization | Product Owner |
| Creative direction (major) | Product Owner |
| Production pilot | Product Owner + ChatGPT |

### What ChatGPT Handles

| Decision | Type |
|----------|------|
| Content intelligence | ChatGPT |
| Editorial direction | ChatGPT |
| Script quality | ChatGPT |
| Narrative/story | ChatGPT |
| Production orchestration | ChatGPT |

### What Codex Handles

| Decision | Type |
|----------|------|
| Schema enforcement | Codex |
| Test validation | Codex |
| Runtime implementation | Codex |
| Technical QA | Codex |
| Artifact persistence | Codex |

### Approval Signals

| Gate | Signal |
|------|--------|
| Content Approval | "Duyệt." / explicit approval |
| Release Approval | "Chốt." / explicit approval |
| Delegated (internal) | ChatGPT acceptance + gates PASS |

---

## Quick Reference

### Naming Convention

```
CKAI-000N_slug-tieng-viet-khong-dau.md
AITIP-000N_slug.md
TEST-000N_slug.md
JOB-{UUID}.json
```

### Status Values

```
Content: draft → review → approved → published → archived
Script: draft → review → approved (with storyboard_handoff READY)
Jobs: PENDING → CLAIMED → EXECUTING → COMPLETED / BLOCKED / FAILED
```

### Key Paths

```bash
# Content
content/scripts/
content/approved/
content/published/

# Production
video-factory/animation/
video-factory/voice/
video-factory/review/
video-factory/export/

# Runtime
runtime/production-bridge/
runtime/jobs/inbox/

# Data
data/content-index.csv
data/performance.csv

# Insights
insights/patterns.md
insights/frameworks.md
```

---

## Emergency Contacts

| Issue | Action |
|-------|--------|
| Tests failing | Run `animation:typecheck`, check recent changes |
| Production blocked | Check `runtime/jobs/` for job state |
| Schema error | Validate against `job-contract.schema.json` |
| Vbee quota | Requires Product Owner authorization |

---

*Runbook version: 2026-08-30*
*Author: Claude Code compatibility mode*
