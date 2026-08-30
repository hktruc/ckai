# CKAI Factory Handover Snapshot — 2026-08-30

> Trạng thái nhà máy CKAI sau HANDOVER PASS. Mọi phiên Claude Code mới phải đọc file này trước khi tiếp quản.

---

## Current Factory Verdict

**HANDOVER PASS** ✅ — 2026-08-30

- All 15 test suites pass (244 individual tests, 0 failures)
- Typecheck is clean
- CKAI-0007 is isolated from production baseline
- CKAI-0005 and CKAI-0006 assets are intact
- Generic runtime and canonical adapter are operational

---

## Best Proven Quality Baseline

### Published

| ID | Title | Notes |
|----|-------|-------|
| CKAI-0003 | Một câu hỏi đứng sau mọi thứ tôi từng chia sẻ | Published 2026-08-22, Facebook/TikTok |
| CKAI-0005 | Đúng chưa chắc là hiểu | Published with Final Audio V2 |

### Visual Baseline

| Version | Description | Score |
|---------|-------------|-------|
| CKAI-0006 V1.2 | Product Owner Locked Practical Visual Baseline V1 | ~6/10 |
| CKAI-0005 V1.1 | Current best visual version | ~6.7/10 |
| CKAI-0005 Final Audio V2 | Published | Music + SFX + Voice |

**GOLDEN STATUS: UNAWARDED**
- 7 = minimum professionally deliverable Market Ready
- 8 = current Golden target
- Machine may diagnose but cannot authoritatively award 7+/8+/9+

### Creative Quality Standard

Canonical: [engine/creative-quality-standard.md](../../engine/creative-quality-standard.md)
Machine-readable: [config/creative-quality-standard.json](../../config/creative-quality-standard.json) → `CKAI_MARKET_TASTE_STANDARD_V1`

---

## Practical Production Baseline

### STEP 01–08 Status

| Step | Name | Status |
|------|------|--------|
| STEP 01 | AI Tips Intelligence | ✅ Implemented |
| STEP 02 | Script Engine | ✅ Implemented |
| STEP 03 | Storyboard Engine | ✅ Implemented |
| STEP 04 | Visual Director | ✅ Implemented |
| STEP 05 | Animation Engine | ✅ Implemented |
| STEP 06 | Voice Engine | ✅ Implemented |
| STEP 07 | Final Review & Finishing | ✅ Implemented |
| STEP 08 | Final Export Engine | ✅ Implemented |
| STEP 09 | First Production Pilot | ⏸️ PAUSED |

### Active Video Factory Components

```
video-factory/
├── animation/         # Remotion/React/TypeScript, 1080×1920 @ 30fps
├── voice/             # Vbee TTS + Piper fallback
├── review/            # Captions, AV QA, mastering
├── export/            # FFmpeg, H.264, SHA-256 manifest
├── visual-intelligence/ # Semantic retention QA
└── shared/           # Media tools

runtime/
├── production-bridge/  # One-Chat job enqueuing
├── publishing/         # Facebook package boundary
└── learning/          # Performance ingestion
```

### Production Voices

| Alias | Provider | Voice ID |
|-------|----------|----------|
| `CKAI_NARRATOR_PRIMARY` | Vbee | HN - Minh Quân (hn_male_minhquan_yt-stable) |
| `CKAI_SECONDARY` | Vbee | HN - Ngọc Huyền (hn_female_ngochuyen_full_48k-fhg) |

Vbee quota authorized for all CKAI production tasks (2026-08-29).

### Canonical Presets

| Preset | Location |
|--------|----------|
| Visual DNA Phase 1 | [engine/visual-dna.md](../../engine/visual-dna.md) → `CKAI_DARK_PREMIUM_EDITORIAL_V1` |
| Audio Direction V1 | [engine/audio-direction-v1.md](../../engine/audio-direction-v1.md) |
| Audio Engine V1 | [engine/audio-engine-v1.md](../../engine/audio-engine-v1.md) |
| Music Library V1 | [content/references/audio/music-library-v1/](../../content/references/audio/music-library-v1/) — 22 KEEP, 22 downloaded |

---

## Current WIP / Quarantined Content

### CKAI-0007 — Quarantined (NOT Production)

| Field | Value |
|-------|-------|
| Status | `wip` (should be `archived`) |
| Duration | 50.67s (exceeds 55s ceiling by 2.67s) |
| Path | `content/approved/CKAI-0007_tre-con-dung-ai.md` |
| Animation | `video-factory/animation/src/CKAI0007*.tsx` (removed from Root.tsx) |
| Judgment | Requires re-authorization or re-render |

**Files requiring cleanup:**
- `video-factory/animation/src/CKAI0007V3.tsx` — WIP
- `video-factory/animation/src/CKAI0007FullProduction.tsx` — WIP
- `video-factory/animation/src/CKAI0007Shared.tsx` — WIP
- `video-factory/review/scripts/render-ckai0007-v1.mjs` — remove
- `scripts/assemble-ckai0007*.mjs` — remove
- `scripts/qa-ckai0007*.mjs` — remove
- `scripts/mix-ckai0007*.mjs` — remove
- `scripts/synthesize-ckai0007*.mjs` — remove
- `runtime/jobs/**/JOB-CKAI0007*.json` — archive

### Content Pending Action

| ID | Status | Action Required |
|----|--------|-----------------|
| CKAI-0001 | approved | Pending production |
| CKAI-0002 | approved | Pending production |
| CKAI-0004 | approved | Pending production |
| CKAI-0006 | approved | Practical Visual Baseline V1.2 locked |

---

## Active Production Capabilities

### Working Pipeline

```
CHATGPT → Content Approval → Enqueue Job → Production Bridge
                                          ↓
                                    Generic Runtime
                                          ↓
                        STEP 05 Animation → STEP 06 Voice
                                          ↓
                        STEP 07 Final Review → STEP 08 Export
                                          ↓
                              Facebook Package + Manifest
                                          ↓
                              Product Owner Release Approval
                                          ↓
                              Manual Facebook Upload
                                          ↓
                              /ck-publish → Learning
```

### Production Specs

| Parameter | Value |
|------------|-------|
| Format | 9:16 vertical, 1080×1920 |
| Frame rate | 30 fps |
| Max duration | 55s (hard limit 60s) |
| Encoding | H.264 / yuv420p |
| Audio | AAC 48kHz stereo |
| Voice | Vbee TTS (quota authorized) |
| Music | Local CKAI Music Library V1 (22 tracks) |

### Available Skills

| Skill | Purpose |
|-------|---------|
| `/ck-idea` | 5 content ideas |
| `/ck-expand` | 10–15 angles from 1 topic |
| `/ck-script` | Short-form script ≤55s |
| `/ck-review` | Editorial verdict PUBLISH/REVISE/REJECT |
| `/ck-publish` | Record closing after manual upload |
| `/ck-learn` | Performance + insights logging |

---

## Proven Components & Processes

### Test Infrastructure

| Test Suite | Tests | Status |
|------------|-------|--------|
| animation:test | 26 | ✅ PASS |
| visual:test | 19 | ✅ PASS |
| visual-intelligence:test | 87 | ✅ PASS |
| audio:test | 12 | ✅ PASS |
| voice:test | 16 | ✅ PASS |
| review:test | 26 | ✅ PASS |
| export:test | 11 | ✅ PASS |
| bridge:test | 18 | ✅ PASS |
| bridge:adapter-test | 13 | ✅ PASS |
| verification:test | 4 | ✅ PASS |
| quality-governance:test | 9 | ✅ PASS |
| publishing-learning:test | 3 | ✅ PASS |
| **TOTAL** | **244** | **0 FAIL** |

### Validation Commands

| Command | Purpose |
|---------|---------|
| `project-state:validate` | Validate project state schema |
| `animation:typecheck` | TypeScript type check |
| `review:validate` | Final review QA |

### Production Templates

| Template | Location |
|----------|----------|
| Script | [content/scripts/TEMPLATE.md](../../content/scripts/TEMPLATE.md) |
| Storyboard | [engine/storyboard-engine.md](../../engine/storyboard-engine.md) |
| Visual Direction | [engine/visual-director.md](../../engine/visual-director.md) |
| Animation Manifest | [video-factory/animation/src/manifest/test0002.ts](../../video-factory/animation/src/manifest/test0002.ts) |
| Voice Plan | [content/voices/](../../content/voices/) |

---

## Mandatory QA Gates

### Content Gate (CHECKPOINT A)

1. Duration ≤ 55s (approval ceiling)
2. Evidence ledger populated
3. Chánh Kiến Filter passed
4. Editorial verdict = PUBLISH
5. **Direct Product Owner Content Approval**

### Production Gates

1. STEP 02 script approved → STEP 03 Storyboard
2. STEP 03 Storyboard READY → STEP 04 Visual Director
3. STEP 04 Visual Direction READY → STEP 05 Animation
4. STEP 05 Animation READY → STEP 06 Voice
5. STEP 06 Voice READY → STEP 07 Final Review
6. STEP 07 Final Review READY → STEP 08 Export
7. STEP 08 Export → Facebook Package

### Release Gate (CHECKPOINT B)

1. Release Manifest SHA-256 verified
2. Source chain STEP 02–08 verified
3. **Direct Product Owner Release Approval**

---

## Current Known Limitations

1. **STEP 09 PAUSED** — First Production Pilot not active; no real upload/auto-post
2. **CKAI-0007 quarantined** — Duration exceeds ceiling; requires re-authorization
3. **CKAI-0001/0002/0004 pending** — Approved scripts awaiting production
4. **No Golden yet** — Current best ~6.7/10; target is 8/10
5. **Music Library V1** — 22 tracks confirmed; track selection remains human-gated
6. **Visual Intelligence Phase 1H** — Semantic retention QA implemented but not production-hardened
7. **Vbee quota** — Authorized but no auto-purchase; requires explicit existing-quota authorization per job

---

## Current Project-State Truth

### Content Index

| ID | Status | Pillar | Topic | Duration Target |
|----|--------|--------|-------|-----------------|
| TEST-0001 | review | ai-human | ai-dependency | 60 |
| CKAI-0001 | approved | chanh-kien | bien-minh-ham-muon | 60 |
| CKAI-0002 | approved | ai-human | don-tai-lieu-thanh-markdown | 60 |
| CKAI-0003 | published | chanh-kien | nhin-nhu-no-dang-la | 60 |
| CKAI-0004 | approved | ai-human | phan-biet-du-kien-suy-luan | 50 |
| CKAI-0005 | published | ai-human | dung-khong-dong-nghia-voi-hieu | 53 |
| CKAI-0006 | approved | ai-human | bat-ai-tu-phan-bien | 45 |
| CKAI-0007 | wip | ai-human | tre-con-dung-ai | 50 |

**Next available ID:** CKAI-0008

### Creative Program State

```
ARCHITECTURE EXPANSION: FROZEN
PHASE 1L: FROZEN / NOT STARTED
AUDIO DIRECTION V1: VALIDATED / HUMAN-GATED
PHASE 2 AUDIO ENGINE V1: VALIDATED / BOUNDED AUTOMATION
CKAI MUSIC LIBRARY V1: ROUND 2 COMPLETE / 22 KEEP / 22 DOWNLOADED
CREATIVE RESET: ACTIVE
GENERALIZATION TEST 01: PASS / HUMAN CONFIRMED
CKAI-0005 FULL PRODUCTION V1: NOT GOLDEN (~6.3–6.6/10)
CKAI-0005 FULL PRODUCTION V1.1: NOT GOLDEN (~6.7/10)
CKAI-0005 FINAL AUDIO V2: PUBLISHED
CKAI-0006 PRACTICAL CONSISTENCY TEST 01: NOT GOLDEN (~6/10)
CKAI-0006 VISUAL REPAIR V1.2: LOCKED / PRACTICAL BASELINE V1
GOLDEN STATUS: UNAWARDED
```

### System Health

- All 244 tests passing
- Typecheck clean
- STEP 01–08 fully implemented
- STEP 09 PAUSED

---

## Exact Files to Read First in a New Session

### Primary Reading Order

1. **`content/reports/FACTORY_HANDOVER_SNAPSHOT_2026-08-30.md`** ← (this file)
2. **`OPERATIONS_RUNBOOK.md`** ← quick operator reference
3. **`PROJECT.md`** ← full project context

### Before Production Tasks

| Task Type | Required Reading |
|-----------|------------------|
| `/ck-idea` | [PROJECT.md §§3-12](../../PROJECT.md) |
| `/ck-script` | [engine/script-engine.md](../../engine/script-engine.md) |
| `/ck-review` | [engine/chanh-kien-filter.md](../../engine/chanh-kien-filter.md) |
| Production | [PROJECT.md §23](../../PROJECT.md), [runtime/production-bridge/README.md](../../runtime/production-bridge/README.md) |
| Animation | [engine/animation-engine.md](../../engine/animation-engine.md) |
| Voice | [engine/voice-engine.md](../../engine/voice-engine.md) |
| Learning | [engine/learning-rules.md](../../engine/learning-rules.md) |

### Key Engineering Files

| Purpose | Path |
|---------|------|
| One-Chat Bridge | [runtime/production-bridge/README.md](../../runtime/production-bridge/README.md) |
| Generic Runtime | [runtime/production-bridge/src/generic-runtime.ts](../../runtime/production-bridge/src/generic-runtime.ts) |
| Canonical Adapter | [runtime/production-bridge/src/canonical-adapter.ts](../../runtime/production-bridge/src/canonical-adapter.ts) |
| Visual DNA | [engine/visual-dna.md](../../engine/visual-dna.md) |
| Audio Direction | [engine/audio-direction-v1.md](../../engine/audio-direction-v1.md) |
| Creative Quality | [engine/creative-quality-standard.md](../../engine/creative-quality-standard.md) |

---

## Document Metadata

| Field | Value |
|-------|-------|
| Created | 2026-08-30 |
| Source | Factory Handover Completion |
| Supersedes | All previous snapshot files |
| Next Review | Upon next production completion or system change |

---

*Factory snapshot captured by Claude Code compatibility mode*
*Canonical authority: ChatGPT / Codex maintained*
