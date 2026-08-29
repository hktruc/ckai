# CKAI Creative Quality Standard

Canonical standard ID: `CKAI_MARKET_TASTE_STANDARD_V1`

Machine-readable SSOT: [`../config/creative-quality-standard.json`](../config/creative-quality-standard.json). This document explains its governance semantics; numeric thresholds, weights, active version, dimensions, questions, baseline, and program state must not be duplicated in runtime code.

## Governing distinction

The final video is the product. Architecture is infrastructure.

```text
ARCHITECTURE QUALITY != PRODUCT QUALITY
TEST PASS != CREATIVE QUALITY
SEMANTIC CORRECTNESS != MARKET READINESS
SYSTEM IMPROVEMENT != VIEWER-PERCEIVED IMPROVEMENT
```

A technically excellent system that produces a 2/10 video produces a `PRODUCT FAILURE`. Historical architecture/integration reports remain historically valid; they never imply Product Quality success.

Status must remain separated:

```yaml
architecture_status:
integration_status:
machine_technical_status:
creative_quality_status:
market_readiness_score:
taste_gate:
golden_candidate:
release_candidate_eligible:
human_creative_director_verdict:
```

An architecture/technical PASS plus Market/Taste FAIL is explicitly a product failure. A changed SHA, richer metadata, more tests, or a newly implemented subsystem earns no creative-quality credit by itself.

## V1 Market Readiness scale

| Score | Meaning | Market ready? |
|---:|---|:---:|
| 0 | Broken or unusable | NO |
| 1 | Raw technical experiment | NO |
| 2 | Technical prototype / AI engine demonstration | NO |
| 3 | Beginner amateur production | NO |
| 4–5 | High-school/hobbyist experimentation under the CKAI commercial standard | **NO** |
| 6 | Semi-professional; postable in some contexts but below CKAI ambition | NO |
| 7 | Professional / commercially deliverable; minimum Market Ready | YES |
| 8 | Premium commercially competitive; current CKAI Golden floor | YES |
| 9 | Top-tier studio / agency-grade; aspirational target | YES |
| 10 | Rare benchmark / category-defining work | YES |

V1 targets are configuration-driven: Market Ready starts at 7, Golden is 8, aspirational is 9, and the Golden critical-dimension floor is 7. Product Owner may activate V2/V3 with stricter values without changing evaluator/pipeline architecture.

## Human taste authority

Machine QA may find defects and produce diagnostics. It may not authoritatively award commercial acceptance at 7+, Golden acceptance at 8+, or studio-grade acceptance at 9+. Without `HUMAN_CHATGPT_CREATIVE_DIRECTOR` review, the canonical state is `MARKET/TASTE ACCEPTANCE: PENDING`.

The current baseline is a direct Product Owner + ChatGPT judgment: CKAI-0004 at Phase 1K is approximately 2/10 and therefore `PRODUCT_FAILURE`. This current reset baseline does not rewrite historical architecture reports or become an immutable score for every future review.

## Creative-quality dimensions

Every visual review covers Scroll-stop/Hook, Art Direction, Visual Originality, Composition, Visual Storytelling, Motion/Editing, Typography, Semantic Clarity, Emotional/Intellectual Impact, Premium Finish, Retention Experience, and Template/AI-generic Resistance. REAL_EVIDENCE also covers Evidence Presentation, Source Legibility, and Proof Direction.

Critical V1 dimensions are Scroll-stop/Hook, Art Direction, Visual Storytelling, Motion/Editing, Premium Finish, and Template/AI-generic Resistance. A Golden candidate must satisfy both its overall target and every critical floor; acceptable dimensions cannot average away a collapsed critical one. Human Creative Director may still fail a mathematically high candidate when the work visibly fails the serious review questions.

Audio is intentionally outside this V1 visual score. Phase 2 Audio has not started, so current visual experiments are not penalized for a future sound standard.

## Serious review questions and four viewpoints

The versioned config contains the canonical question list. It tests scroll-stop, mute viability, frame-level art direction, designed-vs-generated feel, memorable idea, authored motion, intentionality, editorial typography, resistance to AI-explainer aesthetics, CKAI brand confidence, client deliverability, willingness to pay, and contemporary professional competitiveness. A meaningful number of NO answers means `TASTE GATE: FAIL`; architecture cannot rationalize it away.

Every final review must survive all four perspectives:

- Artist / Creative Director: authorship, taste, composition, restraint, surprise, memorable idea, coherence.
- Professional Motion / Video Expert: timing, meaningful motion, choreography, earned transitions, hierarchy, production-grade execution.
- Investor: visible product advantage and creative moat; output must impress more than its architecture explanation.
- Paying Client: willingness to pay/publish, expensive appearance, and no visible quality loss versus hiring a good creative team.

Primary comparison is excellent professional work currently available in the market, not the previous CKAI version. `BETTER_THAN_BEFORE` is diagnostic only.

## Visible Creative Delta and iteration discipline

`VISIBLE_CREATIVE_DELTA` has four configured levels: `NONE`, `MINOR`, `MEANINGFUL`, and `STEP_CHANGE`. The current Creative Reset targets `STEP_CHANGE`. Phrases such as “significant improvement” or “production quality improved” are prohibited when the only evidence is tests, metadata, motion change, SHA change, or improved defect detection.

> If a substantial iteration consumes meaningful working time but the human viewer cannot see a clear quality jump, that iteration is a product-level failure.

## Creative Reset and Golden-first strategy

Current program state:

```text
ARCHITECTURE EXPANSION: FROZEN
PHASE 1L: FROZEN / NOT STARTED
PHASE 2 AUDIO: NOT STARTED
CKAI MUSIC LIBRARY V1: ROUND 2 COMPLETE / 22 KEEP / 22 DOWNLOADED / READY FOR PRODUCTION USE
CREATIVE RESET: ACTIVE
GENERALIZATION TEST 01: PASS / HUMAN CONFIRMATION RECORDED
CKAI-0005 FULL V1: 6.3–6.6 / NOT GOLDEN
CKAI-0005 V1.1 TARGETED REPAIR: HUMAN REVIEWED ~6.7 / CURRENT BEST VISUAL / NOT GOLDEN
CKAI-0005 FINAL AUDIO V2: PUBLISHED / AUDIO LEARNING INGESTED
CKAI-0006 CONSISTENCY TEST: V1.2 LOCKED / PRACTICAL VISUAL BASELINE V1
```

Canonical next-development sequence:

```text
GOLDEN CREATIVE OUTPUT
→ UNDERSTAND WHY IT WORKS
→ ENCODE CAPABILITY
→ AUTOMATE
→ TEST ON ANOTHER CONTENT ID
```

The initial Golden Sequence is 10–15 seconds, not a full ~42-second video. It must demonstrate premium art direction, scroll-stop, authorship, professional composition and motion/editing, memorable visual idea, strong finish, and low template feel. Completion requires Market/Taste score at least 8, no critical dimension below the configured floor, `STEP_CHANGE`, and Human/ChatGPT Creative Director authority. Machine cannot declare completion.

Human/ChatGPT review of CKAI-0005 Full V1 records approximately `6.3–6.6/10`; V1.1 is approximately `6.7/10`. Generalization Test 01 passed and Final Audio V2 was published, but neither visual score is Golden. CKAI-0006 closes at locked V1.2 as `Practical Visual Baseline V1`; that evidence does not award Golden status.

The canonical reference placeholder is [`../content/references/creative-north-star/README.md`](../content/references/creative-north-star/README.md). It remains empty until real references are deliberately selected.

The canonical music reference foundation is [`../content/references/audio/music-library-v1/`](../content/references/audio/music-library-v1/). Its registry and license evidence support future voice-first selection, but the library does not score visual quality, start Phase 2 Audio Engine or grant production approval.

## Tool-agnostic output quality

`OUTPUT QUALITY > TOOL LOYALTY`. Remotion need not draw everything. Future Golden work may combine truthful generated material, real evidence, compositing, typography, custom motion, code-native diagrams, and approved image/video tools according to output quality and evidence constraints.

CODE_NATIVE is a tool, not CKAI's visual identity. Diagram is used when diagram is the best communication medium—not because the renderer can generate it. Dots, lines, nodes, paths, cards, and convergence must not become the default aesthetic.

## Taste and release eligibility

The executable governance evaluator at [`../scripts/lib/creative-quality-standard.mjs`](../scripts/lib/creative-quality-standard.mjs) keeps technical status separate from authoritative human taste status. It prevents machine diagnostic scores from becoming Market/Taste PASS and prevents average-score gaming through critical floors.

A future release candidate is eligible only when all are true:

```text
TECHNICAL GATES PASS
AND MARKET/TASTE GATE PASS
AND HUMAN APPROVAL
```

There is never auto-publishing. Existing historical artifacts are not retroactively rewritten; new candidate governance must use the active standard.

## Versioning

To raise the bar, add a new entry under `standards` in the JSON registry, assign `standard_version`, `effective_date`, and `change_notes`, adjust thresholds/weights/critical flags/scale/questions/release conditions, validate it, then change `active_standard`. Never overwrite V1 history or duplicate thresholds in code.

Validation command:

```text
npm run quality-governance:test
```
