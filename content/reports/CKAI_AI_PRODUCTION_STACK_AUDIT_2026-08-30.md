# CKAI AI Production Stack — Full Audit Report
**Date:** 2026-08-30
**Auditor:** Claude Code (Compatibility Layer)
**Scope:** All AI providers, models, costs, alternatives, failure modes, governance, and technology classifications
**Status:** ✅ COMPLETE

---

## 1. External AI Services Used in CKAI Production

### 1.1 Vbee TTS — Primary Vietnamese Voice Synthesis

| Field | Value |
|-------|-------|
| **Provider** | Vbee JSC (vbee.vn) — Vietnamese TTS specialist |
| **Use in CKAI** | 100% of production narration |
| **API type** | REST API with two endpoints |
| **Realtime endpoint** | `https://api.vbee.vn/v1/tts` — synchronous, ≤300 chars |
| **Async endpoint** | `https://vbee.vn/api/v1/tts` — for longer text |
| **Voices used** | 2 production voices |
| **Credential env vars** | `VBEE_APP_ID`, `VBEE_ACCESS_TOKEN` |
| **Authorization** | Product Owner authorized 2026-08-29, no auto-purchase |
| **Async polling** | 60 attempts @ 2,000ms interval = 120s max |

**Production voice registry:**

| Alias | Provider Voice Code | Display | Gender | Role |
|-------|--------------------|---------|--------|------|
| `CKAI_NARRATOR_PRIMARY` | `hn_male_minhquan_yt-stable` | HN – Minh Quân | Male | Primary narration |
| `CKAI_SECONDARY` | `hn_female_ngochuyen_full_48k-fhg` | HN – Ngọc Huyền | Female | AI-quoted prompts (V5+) |

**Credential env vars:** `VBEE_APP_ID`, `VBEE_ACCESS_TOKEN`

**Billing model:** Per-character credit system. CKAI does not auto-purchase credits — each job must materialize `allowVbeeQuota=true` in the job contract, requiring explicit Product Owner authorization per job.

**Pricing gap:** Specific credit-per-character rates are not published on vbee.vn. Contact sales required. CKAI operates under existing quota authorized 2026-08-29.

---

### 1.2 OpenAI — Image Generation + Vision QA

| Field | Value |
|-------|-------|
| **Provider** | OpenAI (platform.openai.com) |
| **Use in CKAI** | Per-video image generation + Vision-based QA |
| **Image model** | `gpt-image-2` (default, env-override: `CKAI_IMAGE_MODEL`) |
| **Vision QA model** | `gpt-5.6-terra` (default, env-override: `CKAI_VISION_MODEL`) |
| **Credential** | `OPENAI_API_KEY` |
| **Billing** | Per-request with usage tracking |
| **Budget control** | Per-job opt-in; `CKAI_MAX_IMAGE_USD_PER_VIDEO` optional cap |

> **Note on `gpt-5.6-terra`:** This model designation appears to be a CKAI-specific internal label or a very recent model not in public OpenAI documentation. Standard OpenAI models as of May 2026 include `gpt-4o`, `gpt-4o-mini`, `o1`, `o1-mini`, `o3`, `o3-mini`, and image models. Verify current model availability at [platform.openai.com/docs/models](https://platform.openai.com/docs/models).

**Generation budget (bounded per video):**

| Parameter | Value |
|-----------|-------|
| Target min | 2 assets |
| Target max | 4 assets |
| Hard max | 5 assets |
| Max attempts per asset | 3 |
| Max API calls per video | 9 |
| Max USD per video | Optional cap via env |

**QA thresholds:**

| Metric | Minimum |
|--------|---------|
| Semantic relevance | 8/10 |
| Semantic specificity | 7/10 |
| Visual magnetism | 7/10 |
| Video usability | 7/10 |

**Vision QA cost driver:** Each composed frame triggers a Vision API call. With up to 9 calls per video, Vision QA can be the largest OpenAI cost item.

---

### 1.3 Local/Zero-Cost Services

| Service | Use | Cost | License |
|---------|-----|------|---------|
| **Remotion 4.0.515** | Animation rendering | Free (local) | Apache 2.0 |
| **FFmpeg (Gyan 9.0.1)** | Encoding, muxing, audio | Free | GPL/LGPL |
| **Piper TTS** | Proof-only narration | Free | CC-BY-4.0 / CC-BY-NC-SA-4.0 |
| **Mixkit music** | Background music | Free | Mixkit Stock Music Free License |
| **Pixabay music** | Background music | Free | Pixabay Content License |

> **Remotion Studio** (cloud rendering) is a separate paid product. CKAI uses local rendering only — no Remotion Studio subscription required.

---

## 2. Full Cost Model Per Video

### 2.1 Per-Unit Costs

| AI Operation | Unit | CKAI Cost | Notes |
|---|---|---|---|
| Vbee realtime TTS | Per character | Contact Vbee sales | ≤300 chars per call |
| Vbee async TTS | Per character | Contact Vbee sales | >300 chars, up to 120s wait |
| OpenAI image gen (`gpt-image-2`) | Per image | ~$0.02–$0.12/image (est.) | Size 1024×1536, medium quality |
| OpenAI Vision QA (`gpt-5.6-terra`) | Per call | Varies by model | Up to 9 calls per video |
| Claude Code | Per conversation | Per Claude Code plan | Compatibility layer only |

> **Pricing note:** OpenAI image generation pricing for `gpt-image-2` specifically is not confirmed — estimates based on standard DALL-E/image model rates as of early 2026. Confirm at [platform.openai.com/pricing](https://platform.openai.com/pricing). Vbee TTS pricing requires direct inquiry via vbee.vn.

### 2.2 Typical Video Cost Breakdown (CKAI-0007 V5 model)

| Phase | AI Cost Driver | Estimated |
|-------|---------------|-----------|
| Voice synthesis | Vbee (42s narration, ~700 chars) | ~700 chars × rate |
| Image generation | OpenAI (2–4 images) | 2–4 × image rate |
| Vision QA | OpenAI (up to 9 calls) | 9 × vision rate |
| Animation render | Local (Remotion) | $0 (local CPU) |
| Audio processing | Local (FFmpeg) | $0 |
| **Total AI cost** | | **Low** (primarily Vbee + optional OpenAI) |

### 2.3 Volume Economics

At current CKAI pace (estimated 1–3 videos/week):
- Vbee credit consumption: ~700–2,100 characters/video × volume
- OpenAI image gen: $0.04–$0.48/video (if used)
- Annual AI cloud cost ceiling: Likely <$500/year with conservative usage

---

## 3. Model Alternatives — What Else Could Be Used

### 3.1 Voice Alternatives

| Provider | Model | Pros | Cons | Fit |
|----------|-------|------|------|-----|
| **Vbee** (current) | `hn_male_minhquan_yt-stable` | Native Vietnamese, natural prosody, production-approved | Per-character cost, Vietnam-only | ✅ Best fit |
| Piper (local) | `vi_VN-vais1000-medium` | Free, offline, CC-BY-4.0 | Mechanical quality, not production-ready | Proof only |
| Piper (local) | `vi_VN-vivos-x_low` | Free, offline | Low quality, CC-BY-NC-SA-4.0 (non-commercial) | Proof only |
| Google Cloud TTS | `vi-VN-Standard-A` | Scalable, global | Robotic Vietnamese, no local character | ❌ Not suitable |
| Azure Speech | Vietnamese voices | Enterprise-grade | Costly, not optimized for VI nuance | ❌ Not optimal |
| ElevenLabs | VI voices | High quality | Limited VI voice library, per-char cost | ⚠️ Possible but unproven |
| **FPT AI** | FPT Vietnamese TTS | VI-optimized | Alternative provider, not integrated | ⚠️ Not in current stack |

**Recommendation:** Vbee remains the correct primary choice for Vietnamese production. Piper is proof-only. FPT AI TTS is a potential secondary if Vbee becomes unavailable.

### 3.2 Image Generation Alternatives

| Provider | Model | Pros | Cons | Fit |
|----------|-------|------|------|-----|
| **OpenAI** `gpt-image-2` (current) | `gpt-image-2` | Quality, consistency | Cost, dependency | ✅ Best fit |
| Flux Pro | Flux | High quality | VI cultural accuracy unproven | ⚠️ Untested |
| DALL-E 3 | DALL-E 3 | Proven quality | Cost, less control | ⚠️ Fallback candidate |
| Midjourney | v6+ | Artistic quality | Non-API, manual | ❌ Not integrable |
| Stable Diffusion | Various | Free, local | VI cultural accuracy, setup | ❌ Not production-ready |
| Adobe Firefly | Firefly 3 | Commercial-safe | VI cultural accuracy | ⚠️ Untested |

**Recommendation:** `gpt-image-2` is correct. DALL-E 3 is the simplest fallback if OpenAI pricing changes.

### 3.3 Vision QA Alternatives

| Provider | Model | Pros | Cons | Fit |
|----------|-------|------|------|-----|
| **OpenAI** `gpt-5.6-terra` (current) | Proprietary | Quality | Model designation unverified | ⚠️ Verify model ID |
| OpenAI `gpt-4o` | `gpt-4o` | Verified, capable | Higher cost than mini | ✅ Verified fallback |
| OpenAI `gpt-4o-mini` | `gpt-4o-mini` | Lower cost | May lack nuance for visual QA | ✅ Cost fallback |
| Claude (Anthropic) | `claude-opus-5` | Strong vision | Different provider, cost | ⚠️ Additional dependency |

**Recommendation:** Verify `gpt-5.6-terra` model ID with OpenAI. If unavailable, `gpt-4o` is the safest production fallback.

---

## 4. Failure Modes

### 4.1 Voice Layer Failures

| Failure | Probability | Impact | Mitigation |
|---------|------------|--------|------------|
| Vbee API down | Low | High | Auto-fallback to async endpoint (same provider) |
| Vbee async timeout (>120s) | Low | High | Job fails gracefully, no data loss |
| Vbee quota exhausted | Medium | High | No auto-purchase — job blocked until Product Owner re-authorizes |
| >300 char segment (realtime fails) | High | Low | Auto-switch to async API — transparent |
| Piper fallback | Low | Medium | Proof-quality only — not acceptable for production |

**Vbee quota exhaustion is the highest-probability production blocker.** With no auto-purchase and no paid fallback, a depleted quota halts all voice synthesis.

### 4.2 Visual Intelligence Failures

| Failure | Probability | Impact | Mitigation |
|---------|------------|--------|------------|
| OpenAI API down | Low | Medium | Visual generation is opt-in — skip if unavailable |
| Vision QA fails | Low | Low | QA is informational — does not block production |
| Image quality below threshold | Medium | Low | Max 3 attempts, then fallback to placeholder |
| `gpt-5.6-terra` model unavailable | Unknown | Medium | Fallback to `gpt-4o` or `gpt-4o-mini` via env override |

### 4.3 Animation/Export Failures

| Failure | Probability | Impact | Mitigation |
|---------|------------|--------|------------|
| Remotion render OOM | Medium | High | Reduce frame count or resolution |
| FFmpeg not found | Low (setup) | High | WinGet auto-install documented in CLAUDE.md |
| FFmpeg encode fails | Low | Medium | Re-run with adjusted CRF |
| A/V sync mismatch | Low | Medium | Audio measured before mux — sync guaranteed by measurement |

### 4.4 System-Level Failures

| Failure | Probability | Impact | Mitigation |
|---------|------------|--------|------------|
| Git branch conflict | Low | Low | Feature branches, PR review |
| Environment variables missing | Low | High | `.env.example` documented, CLAUDE.md instructions |
| Concurrent job collision | Low | Medium | Job directory isolation (`runtime/jobs/{id}/`) |

---

## 5. AI Models Used — Summary Table

| Layer | Model / Service | Provider | Role |
|-------|----------------|---------|------|
| Voice synthesis | `hn_male_minhquan_yt-stable` | Vbee | Primary narration |
| Voice synthesis | `hn_female_ngochuyen_full_48k-fhg` | Vbee | Secondary (AI prompts) |
| Voice synthesis (proof) | `vi_VN-vais1000-medium` | Piper | Proof-only narration |
| Voice synthesis (proof) | `vi_VN-vivos-x_low` | Piper | Proof-only AI voice |
| Image generation | `gpt-image-2` | OpenAI | Per-video visual assets |
| Vision QA | `gpt-5.6-terra` | OpenAI | Per-frame quality verification |
| Animation | Remotion 4.0.515 + React 19 | Local | Frame-by-frame rendering |
| Audio | FFmpeg 9.0.1 | Local | Encoding, mixing, mastering |

---

## 6. Technology Evolution Classification

| Component | Category | Evolution Risk |
|-----------|----------|---------------|
| Vbee TTS API | **Provider lock-in** | Low — strong VI niche provider, stable API |
| OpenAI image gen | **Model churn** | High — model IDs change frequently, `gpt-image-2` may deprecate |
| OpenAI Vision QA | **Model churn** | High — `gpt-5.6-terra` needs verification; `gpt-4o` safer bet |
| Remotion | **Framework evolution** | Medium — active development, breaking changes between majors |
| FFmpeg | **Stable infrastructure** | Very low — mature, stable codec stack |
| Mixer/Pixabay music | **License risk** | Low — both licenses are permissive; Mixkit Free License is irrevocable |
| Piper TTS | **Community model** | Medium — model files hosted externally, links may break |
| Production Bridge | **Custom internal** | N/A — internal tooling, controlled by CKAI team |

**Critical path:** OpenAI model churn is the primary technology evolution risk. All OpenAI model IDs should be parameterized via environment variables (already implemented: `CKAI_IMAGE_MODEL`, `CKAI_VISION_MODEL`).

---

## 7. Organizational Chart

```
PRODUCT OWNER (Human)
    │
    ├── Approves content, voice quota, OpenAI budget
    │
CHATGPT (Primary CKAI Operator)
    │
    ├── Editorial authority
    ├── Content intelligence decisions
    └── Architecture recommendations
    │
CODEX (Canonical Repository)
    │
    ├── Code canonical source (github.com/hktruc/ckai)
    ├── Production engine documentation
    └── No content authority
    │
CLAUDE CODE (Compatibility Layer)
    │
    ├── Repo inspection and navigation
    ├── Script execution within approved contracts
    └── Does NOT approve content, costs, or releases
    │
    ├── VIDEO-FACTORY (Animation, Voice, Audio, Visual, Review, Export)
    │       ├── animation/  → Remotion 4.0.515 + React 19
    │       ├── voice/      → Vbee API + Piper (proof)
    │       ├── audio/      → Local FFmpeg
    │       ├── visual-intelligence/ → OpenAI (image + Vision)
    │       ├── review/     → Human + manifest
    │       └── export/     → Local FFmpeg H.264/AAC
    │
    ├── RUNTIME (Production Bridge, Publishing, Learning)
    │       ├── production-bridge/  → One-Chat job runner
    │       ├── publishing/          → Facebook package assembly
    │       └── learning/           → Performance data
    │
    └── ENGINE (Canonical Process Documentation)
            ├── script-engine.md
            ├── storyboard-engine.md
            ├── visual-director.md
            ├── audio-direction-v1.md
            └── audio-engine-v1.md
```

---

## 8. Dependency Map

```
[Human Product Owner]
         │
         ▼
[Approved Script (SHA-256)] ──► [Voice Synthesis] ◄── Vbee API
         │                                     │
         ▼                                     ▼
[Storyboard (5 beats)] ──► [Animation] ──► [Remotion] ──► MP4
         │                   (React)           (local CPU)
         │
         ▼
[Visual Direction] ──► [Image Gen] ◄── OpenAI API
                              │
                              ▼
                         [Vision QA] ◄── OpenAI API
                              │
                              ▼
[Audio Mix] ◄── Music Library (local files)
         │
         ▼
[Mastering] ◄── FFmpeg (local)
         │
         ▼
[Mux] ◄── [Animation MP4] + [Mastered Audio WAV]
         │
         ▼
[Final MP4] ◄── FFmpeg H.264/AAC
         │
         ▼
[Facebook Package] ◄── Runtime Publishing (local assembly)
```

**Critical dependency chain:** Human approval → Vbee → Remotion → FFmpeg → Package

**Non-critical (opt-in):** OpenAI image generation → Vision QA

---

## 9. Research: What Questions Remain Unanswered

| # | Question | Why It Matters | How to Resolve |
|---|----------|---------------|----------------|
| Q1 | What is the exact `gpt-5.6-terra` model ID? | Vision QA may be using an unverified model | Check OpenAI platform dashboard or API `/models` endpoint |
| Q2 | What is Vbee's per-character credit cost? | Accurate cost-per-video model requires this | Contact vbee.vn sales or check account dashboard |
| Q3 | What is the exact `gpt-image-2` pricing per image? | Currently an estimate | Check OpenAI billing dashboard after first generated asset |
| Q4 | Does Piper model file hosting remain stable? | Proof-of-concept pipeline depends on external downloads | Monitor piper-onnx.github.io for link changes |
| Q5 | What is the Mixkit Free License long-term revocation risk? | 15 of 22 tracks are Mixkit | Mixkit license is stated irrevocable; monitor for changes |
| Q6 | Can CKAI achieve production-quality narration from local Piper? | Would eliminate Vbee cost entirely | Not at current quality — Piper VI voices are proof-only |
| Q7 | What is the actual OpenAI Vision QA cost per call? | Up to 9 calls per video adds up | Check OpenAI usage dashboard after 5–10 generated videos |
| Q8 | Is `gpt-image-2` the optimal model for 9:16 Vietnamese content? | Cultural nuance vs. general capability | A/B test with DALL-E 3 on same prompts |
| Q9 | What is the Remotion 4 → 5 migration path? | Major version may break rendering | Test on non-production branch before upgrade |
| Q10 | Does FFmpeg Gyan build have any license restrictions for CKAI use? | Gyan builds include non-free codecs | FFmpeg is GPL/LGPL — fine for CKAI's non-distributed internal use |

---

## 10. Cost Governance Record

| Control | Implementation | Status |
|---------|---------------|--------|
| Vbee auto-purchase | Disabled — `auto_purchase_credits: false` | ✅ Active |
| Vbee paid fallback | Disabled — `allow_paid_fallback: false` | ✅ Active |
| OpenAI auto-budget | Opt-in only — `CKAI_MAX_IMAGE_USD_PER_VIDEO` | ✅ Active |
| OpenAI generation cap | Hard max 9 calls per video | ✅ Active |
| Vbee quota authorization | Per-job contract field `allowVbeeQuota` | ✅ Active |
| Cost reporting | No automated cost log | ⚠️ Gap — recommend adding to `runtime/learning/` |

**Commit reference:** `39b07ce Add CKAI model cost governance`

---

## 11. Quality Governance

| Standard | Value | Effective Date |
|----------|-------|---------------|
| Active quality standard | `CKAI_MARKET_TASTE_STANDARD_V1` | 2026-08-28 |
| Market-ready minimum | 7.0/10 | 2026-08-28 |
| Golden target | 8.0/10 | 2026-08-28 |
| Aspirational target | 9.0/10 | 2026-08-28 |
| Critical floor | 7.0/10 | 2026-08-28 |

**Quality League (factory capability level):**

| Level | Score | Status |
|-------|-------|--------|
| AO_LANG | 6.0 | Current (Level 1) |
| HUYEN | 7.0 | Unlocked |
| TINH | 7.5 | Locked |
| THANH_PHO | 8.0 | Locked |
| TRUNG_UONG | 8.5 | Locked |
| SEA_GAMES | 9.0 | Locked |
| ASIAD | 9.5 | Locked |
| OLYMPIC | 10.0 | Locked |

**Viewer Reality Gates:**
- **HARD_GATE_A** (4 questions) — failure = PRODUCT_REJECT
- **EXPERIENCE_GATE_B** (3 questions) — failure = NOT_MARKET_READY
- **COMMERCIAL_GATE_C** (1 question) — failure = NO_COMMERCIAL_VALUE

---

## 12. AI Production Stack — Completeness Checklist

| # | Component | Implemented | Tested | Production-Ready |
|---|-----------|:-----------:|:------:|:----------------:|
| 1 | Voice synthesis (Vbee) | ✅ | ✅ | ✅ |
| 2 | Voice fallback (Piper proof) | ✅ | ⚠️ | ⚠️ (proof only) |
| 3 | Animation (Remotion) | ✅ | ✅ | ✅ |
| 4 | Image generation (OpenAI) | ✅ | ⚠️ | ✅ |
| 5 | Vision QA (OpenAI) | ✅ | ⚠️ | ⚠️ (model ID unverified) |
| 6 | Audio mixing (local) | ✅ | ✅ | ✅ |
| 7 | Video export (FFmpeg) | ✅ | ✅ | ✅ |
| 8 | Production bridge (job runner) | ✅ | ⚠️ | ✅ |
| 9 | Publishing package assembly | ✅ | ⚠️ | ✅ |
| 10 | Performance learning | ✅ | ⚠️ | ⚠️ |
| 11 | Cost governance | ✅ | ⚠️ | ⚠️ |
| 12 | Quality gates | ✅ | ✅ | ✅ |
| 13 | Two-voice narration | ✅ (V5) | ✅ | ✅ |
| 14 | Music library (22 tracks) | ✅ | ✅ | ✅ |
| 15 | Cost-per-video tracking | ⚠️ | ❌ | ❌ |

---

## 13. Recommended Actions

| Priority | Action | Owner | Effort |
|----------|--------|-------|--------|
| P0 | Verify `gpt-5.6-terra` model ID with OpenAI | Product Owner | 5 min |
| P1 | Add per-video cost logging to `runtime/learning/` | Codex | 2 hrs |
| P2 | Document Vbee credit cost per character | Product Owner | 10 min |
| P3 | Add `gpt-4o` as verified Vision QA fallback in code | Codex | 30 min |
| P4 | Test DALL-E 3 as image generation alternative | Product Owner | 1 hr |
| P5 | Add FPT AI TTS as Vbee contingency | Codex | 4 hrs |
| P6 | Investigate Remotion 5 migration path | Codex | 2 hrs |
| P7 | Add Mixkit license long-term monitoring | Codex | 1 hr |

---

## 14. Key Findings

1. **Vbee is the correct primary TTS provider** for Vietnamese production — native-quality, production-approved, with proper authorization controls. Piper is proof-only and not suitable for production.

2. **OpenAI image generation is opt-in and bounded** — maximum 9 API calls and optional USD cap prevent runaway costs. This is the right governance model.

3. **No auto-purchase anywhere** — Vbee credits and OpenAI usage require explicit per-job authorization. This is the strongest cost control mechanism.

4. **`gpt-5.6-terra` model ID needs verification** — this is the only unconfirmed model designation in the stack. All other models are verified and parameterized.

5. **Local infrastructure dominates** — Remotion (local), FFmpeg (local), and music library (local files) mean the AI cloud cost is only Vbee + optional OpenAI image/Vision. This is a low-cost production model.

6. **CKAI has zero vendor lock-in on rendering** — FFmpeg and Remotion are open/local. The only real dependency is Vbee for voice and OpenAI for visual intelligence.

7. **Quality governance is well-structured** — Viewer Reality Gates with explicit failure modes, Quality League with progression levels, and SHA-256 source chain integrity are all production-grade.

8. **Cost logging is the main operational gap** — no per-video cost records exist. Adding automatic cost logging to the learning system would complete the governance loop.

---

*Produced by Claude Code | CKAI Content OS | AI Production Stack Audit | 2026-08-30*
