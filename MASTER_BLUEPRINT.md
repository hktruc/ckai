# CKAI MASTER BLUEPRINT — BẢN VẼ TỔNG CÔNG TRÌNH

> **Canonical project map** for CKAI — Chánh Kiến AI  
> Version: **1.0** · Baseline date: **2026-08-29** · Owner: **Product Owner**  
> Governance role: **QLDA / PMO** · Execution role: **Codex**  
> This file is the authoritative map for long-horizon construction continuity.

---

## 0. North Star

CKAI is not complete when the pipeline merely works. The end state is a system that can repeatedly produce short-form videos at **tác phẩm / masterpiece quality**, while preserving the creator's own thinking, voice, judgment and brand.

Quality ladder:

- **Market-ready:** approximately 7/10+
- **Golden target:** approximately 8/10
- **Aspirational masterpiece:** approximately 9/10+

The project must close the gap between **SYSTEM CAPABILITY** and **FINAL OUTPUT QUALITY**.

---

## 1. Canonical hierarchy and IDs

```text
ARC-xx                       Architecture Block
└── ARC-xx.PH-yy             Phase
    └── ARC-xx.PH-yy.T-zzz   Task
        └── Evidence / Milestone / Content ID
```

No parallel ID system may be created without changing this canonical blueprint.

### Status vocabulary

`NOT_STARTED` · `IN_PROGRESS` · `BLOCKED` · `DONE` · `FROZEN` · `CANDIDATE` · `VALIDATED` · `REJECTED`

### Evidence governance

Learnings are classified as:

`VERIFIED` · `CANDIDATE` · `CONTENT_SPECIFIC` · `REJECTED`

A successful single video is evidence, not automatically a system rule.

---

# ARC-01 — GOVERNANCE & CONTENT OS

**Objective:** preserve brand truth, content intelligence, lifecycle governance, project state and long-term IP accumulation.

## ARC-01.PH-01 — Content OS Foundation

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-01.PH-01.T-001 | Establish `PROJECT.md` as Content OS SSOT | DONE | Existing repository foundation |
| ARC-01.PH-01.T-002 | Establish `AGENTS.md` / coding-agent entry rules | DONE | Existing repository foundation |
| ARC-01.PH-01.T-003 | Build knowledge base for brand, audience, philosophy, stories | DONE | Existing `knowledge/` layer |
| ARC-01.PH-01.T-004 | Calibrate creator voice and philosophy | DONE | Four calibration rounds recorded |

## ARC-01.PH-02 — Content Lifecycle Engine

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-01.PH-02.T-001 | Idea / expand / script workflow | DONE | `/ck-idea`, `/ck-expand`, `/ck-script` |
| ARC-01.PH-02.T-002 | Review and Chánh Kiến quality filter | DONE | `/ck-review` and filters |
| ARC-01.PH-02.T-003 | Publish / Delivery Learning workflow | DONE | `/ck-publish`, voice observations |
| ARC-01.PH-02.T-004 | Performance Learning workflow | IN_PROGRESS | Logic exists; requires recurring real performance evidence |

## ARC-01.PH-03 — AI Agent & API Modernization

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-01.PH-03.T-001 | Define OpenAI API role in production system | IN_PROGRESS | Investment/decision established; reconcile latest local implementation |
| ARC-01.PH-03.T-002 | Separate content intelligence from rendering implementation | IN_PROGRESS | Architecture direction established |
| ARC-01.PH-03.T-003 | Establish reliable agent handoff contracts | CANDIDATE | Explicit machine contracts + regression evidence |
| ARC-01.PH-03.T-004 | Remove unnecessary manual handholding | NOT_STARTED | Multiple productions can run with bounded human approvals |

## ARC-01.PH-04 — Project Control & Continuity

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-01.PH-04.T-001 | Create canonical Master Blueprint | DONE | This file |
| ARC-01.PH-04.T-002 | Create public Web Status Board | IN_PROGRESS | GitHub Pages deployment must be live |
| ARC-01.PH-04.T-003 | Bind every completed task to `PROGRESS.md` | IN_PROGRESS | Required operating rule from this version onward |
| ARC-01.PH-04.T-004 | Prevent video side quests from erasing backlog | VALIDATED | Continuity rule formalized in this blueprint |

---

# ARC-02 — VISUAL PRODUCTION SYSTEM

**Objective:** transform approved content into reliable, controllable, high-quality visual production.

## ARC-02.PH-01 — Video Factory Foundation

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-02.PH-01.T-001 | Establish Video Factory project structure | DONE | `video-factory` referenced in canonical implementation reports |
| ARC-02.PH-01.T-002 | Define manifest/model/gates architecture | DONE | Export implementation exists in recent reports |
| ARC-02.PH-01.T-003 | Establish technical test harness | DONE | Focused export/regression tests reported |

## ARC-02.PH-02 — Script → Visual Pipeline

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-02.PH-02.T-001 | Segment script into visual beats/scenes | IN_PROGRESS | Works on production evidence; needs broader validation |
| ARC-02.PH-02.T-002 | Map semantic intent to visual treatment | IN_PROGRESS | Creative production currently exercises this layer |
| ARC-02.PH-02.T-003 | Support talking-head + illustrative/B-roll composition | IN_PROGRESS | Repeated production evidence required |
| ARC-02.PH-02.T-004 | Support practical workflow/result illustration | IN_PROGRESS | CKAI-0006 is primary evidence track |

## ARC-02.PH-03 — Asset Layer & Provenance

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-02.PH-03.T-001 | Standardize asset folders and naming | IN_PROGRESS | Reconcile latest local repository state |
| ARC-02.PH-03.T-002 | Track asset source / provenance / license | IN_PROGRESS | Required for durable production |
| ARC-02.PH-03.T-003 | Build reusable approved visual asset library | CANDIDATE | Reuse without quality/provenance drift |
| ARC-02.PH-03.T-004 | Define asset rejection and replacement rules | CANDIDATE | Explicit rules + evidence |

## ARC-02.PH-04 — Rendering & Export

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-02.PH-04.T-001 | Establish deterministic render/export path | DONE | Export system reported operational |
| ARC-02.PH-04.T-002 | Separate technical pass from creative-quality pass | DONE | Regression explicitly reported |
| ARC-02.PH-04.T-003 | Validate final short-form format output | IN_PROGRESS | Multiple real content outputs required |
| ARC-02.PH-04.T-004 | Harden final export failure handling | IN_PROGRESS | No silent invalid release |

## ARC-02.PH-05 — Production Automation & Validation

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-02.PH-05.T-001 | Automate repeatable visual assembly steps | IN_PROGRESS | Reduce manual production burden without quality loss |
| ARC-02.PH-05.T-002 | Add regression fixtures for representative videos | IN_PROGRESS | Baseline + practical + generalization fixtures |
| ARC-02.PH-05.T-003 | Validate output across different topics/modes | IN_PROGRESS | ARC-06 evidence required |
| ARC-02.PH-05.T-004 | Achieve production-ready failure visibility | CANDIDATE | Clear task-level diagnostics |

---

# ARC-03 — CREATIVE QUALITY & ART DIRECTION

**Objective:** ensure the system optimizes for perceived quality and not merely technical correctness.

## ARC-03.PH-01 — Creative Quality Standard

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-03.PH-01.T-001 | Create machine-readable creative-quality registry | DONE | `config/creative-quality-standard.json` reported |
| ARC-03.PH-01.T-002 | Create canonical governance semantics | DONE | `engine/creative-quality-standard.md` reported |
| ARC-03.PH-01.T-003 | Build configuration-driven evaluator/validator | DONE | Evaluator + tests reported |
| ARC-03.PH-01.T-004 | Separate quality status from release eligibility | DONE | Export gate regression reported |

## ARC-03.PH-02 — Art Direction System

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-03.PH-02.T-001 | Define CKAI visual taste / aesthetic principles | IN_PROGRESS | Needs canonical visual direction reference |
| ARC-03.PH-02.T-002 | Define typography / composition / pacing principles | IN_PROGRESS | Repeated output evidence |
| ARC-03.PH-02.T-003 | Define when metaphor is appropriate | IN_PROGRESS | Stronger for THINKING mode |
| ARC-03.PH-02.T-004 | Define direct illustration rule for PRACTICAL mode | IN_PROGRESS | Validate via CKAI-0006+ |

## ARC-03.PH-03 — Quality Control Gates

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-03.PH-03.T-001 | Technical release gate | DONE | Existing export logic |
| ARC-03.PH-03.T-002 | Creative-quality evaluation gate | DONE | Governance system exists |
| ARC-03.PH-03.T-003 | Human approval points for Golden-level work | IN_PROGRESS | Define minimal but necessary approvals |
| ARC-03.PH-03.T-004 | Quality regression protection | IN_PROGRESS | Cross-video regression tests/evidence |

## ARC-03.PH-04 — North Star & Benchmarking

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-03.PH-04.T-001 | Create Creative North Star structure | DONE | Intentionally empty structure reported |
| ARC-03.PH-04.T-002 | Populate approved North Star references | NOT_STARTED | Curated reference set with provenance |
| ARC-03.PH-04.T-003 | Create benchmark scoring examples | CANDIDATE | Anchor examples at 7/8/9 quality levels |
| ARC-03.PH-04.T-004 | Calibrate evaluator against real human judgments | NOT_STARTED | Agreement stable across multiple videos |

---

# ARC-04 — AUDIO, MUSIC & VOICE SYSTEM

**Objective:** make audio a creative system, not an afterthought.

## ARC-04.PH-01 — Music Library

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-04.PH-01.T-001 | Define music functional categories | IN_PROGRESS | Investigative / tension / reveal / momentum / neutral-bed directions exist |
| ARC-04.PH-01.T-002 | Complete shortlist round 1 | DONE | Seven-track shortlist reported on 2026-08-27 |
| ARC-04.PH-01.T-003 | Download and archive approved licensed tracks | NOT_STARTED | Files stored with source/license metadata |
| ARC-04.PH-01.T-004 | Build reusable music selection rules | CANDIDATE | Selection works across multiple content IDs |

## ARC-04.PH-02 — Audio Direction

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-04.PH-02.T-001 | Define CKAI audio aesthetic | IN_PROGRESS | Dark investigative + modern electronic direction emerging |
| ARC-04.PH-02.T-002 | Define loudness hierarchy under voice-over | IN_PROGRESS | Consistent phone-speaker listening tests |
| ARC-04.PH-02.T-003 | Define tension/reveal/momentum mapping | IN_PROGRESS | Repeated semantic fit across videos |
| ARC-04.PH-02.T-004 | Freeze Audio Direction V1 | NOT_STARTED | Enough evidence to automate safely |

## ARC-04.PH-03 — Voice System

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-04.PH-03.T-001 | Preserve creator's primary voice intelligibility | IN_PROGRESS | Stable across production |
| ARC-04.PH-03.T-002 | Validate purchased Vbee voice role | IN_PROGRESS | Role boundaries and quality confirmed |
| ARC-04.PH-03.T-003 | Formalize dual-voice use cases | CANDIDATE | Clear creative benefit, not gimmick |
| ARC-04.PH-03.T-004 | Define voice processing chain | CANDIDATE | Repeatable EQ/dynamics/loudness policy |

## ARC-04.PH-04 — Music Bed & Semantic SFX

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-04.PH-04.T-001 | Define music bed automation boundaries | CANDIDATE | Automation only after direction V1 |
| ARC-04.PH-04.T-002 | Build semantic SFX taxonomy | CANDIDATE | SFX maps to meaning rather than decoration |
| ARC-04.PH-04.T-003 | Validate phone-speaker mix | NOT_STARTED | Translation test across common devices |
| ARC-04.PH-04.T-004 | Prevent over-scoring / audio clutter | IN_PROGRESS | Creative review evidence |

## ARC-04.PH-05 — Phase 2 Audio Engine

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-04.PH-05.T-001 | Design Audio Engine architecture | FROZEN | Unfreeze only after Audio Direction V1 |
| ARC-04.PH-05.T-002 | Automate music/SFX placement | FROZEN | Depends on T-001 and direction validation |
| ARC-04.PH-05.T-003 | Automate mix/master baseline | FROZEN | Depends on phone-speaker mix target |
| ARC-04.PH-05.T-004 | Regression-test audio quality | FROZEN | Requires stable engine |

---

# ARC-05 — CONTENT MODES & FRAMEWORK

**Objective:** let one system handle distinct content intents without forcing one visual/creative formula onto everything.

## ARC-05.PH-01 — Mode Taxonomy

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-05.PH-01.T-001 | Establish THINKING / CHÁNH KIẾN mode | VALIDATED | Existing conceptual/philosophical content |
| ARC-05.PH-01.T-002 | Establish PRACTICAL / TUYỆT CHIÊU mode | IN_PROGRESS | Current validation track |
| ARC-05.PH-01.T-003 | Define mode-selection criteria | IN_PROGRESS | Deterministic enough for production routing |
| ARC-05.PH-01.T-004 | Prevent mode mixing that weakens intent | CANDIDATE | Review rule + evidence |

## ARC-05.PH-02 — THINKING Mode

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-05.PH-02.T-001 | Preserve conceptual / corrective / philosophical tone | VALIDATED | Existing channel foundation |
| ARC-05.PH-02.T-002 | Formalize metaphor-friendly visual grammar | IN_PROGRESS | Quality reference set |
| ARC-05.PH-02.T-003 | Validate high-level insight pacing | IN_PROGRESS | Multiple output reviews |

## ARC-05.PH-03 — PRACTICAL Mode

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-05.PH-03.T-001 | Formalize actionable workflow structure | IN_PROGRESS | CKAI-0006 evidence |
| ARC-05.PH-03.T-002 | Require direct visual illustration of tool/workflow/result | IN_PROGRESS | Practical-mode rule under validation |
| ARC-05.PH-03.T-003 | Avoid unnecessary philosophical overlay | IN_PROGRESS | Aligns with AI Content Layer Model |
| ARC-05.PH-03.T-004 | Validate Practical Mode V1 across multiple topics | NOT_STARTED | At least several non-identical cases |

## ARC-05.PH-04 — Future Modes & General Rules

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-05.PH-04.T-001 | Identify additional modes only from evidence | FROZEN | No architecture expansion without need |
| ARC-05.PH-04.T-002 | Create per-mode production guides | CANDIDATE | Only after mode validation |
| ARC-05.PH-04.T-003 | Create cross-mode quality invariants | CANDIDATE | Brand/quality rules shared safely |

---

# ARC-06 — PRODUCTION CONSISTENCY & GENERALIZATION

**Objective:** prove the system works beyond one successful handcrafted case.

## ARC-06.PH-01 — Baseline Evidence

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-06.PH-01.T-001 | Establish Production Baseline V1 | DONE | CKAI-0004 |
| ARC-06.PH-01.T-002 | Capture baseline shortcomings as backlog | IN_PROGRESS | All issues mapped back to ARC tasks |
| ARC-06.PH-01.T-003 | Freeze content-specific hacks from promotion | VALIDATED | Learning governance rule |

## ARC-06.PH-02 — Generalization Test 01

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-06.PH-02.T-001 | Run generalization production | DONE | CKAI-0005 |
| ARC-06.PH-02.T-002 | Capture audio learning | DONE | CKAI-0005 designated audio learning evidence |
| ARC-06.PH-02.T-003 | Promote only repeated reusable learnings | IN_PROGRESS | Needs further productions |

## ARC-06.PH-03 — Practical / Consistency Test

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-06.PH-03.T-001 | Run Practical / Consistency Test | IN_PROGRESS | CKAI-0006 |
| ARC-06.PH-03.T-002 | Validate direct workflow imagery | IN_PROGRESS | Links to ARC-05.PH-03 |
| ARC-06.PH-03.T-003 | Validate template consistency without sameness | IN_PROGRESS | Creative review after output |
| ARC-06.PH-03.T-004 | Record production friction / manual steps | IN_PROGRESS | Feeds autonomy backlog |

## ARC-06.PH-04 — Reusability, Autonomy & Scale

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-06.PH-04.T-001 | Prove reuse across unrelated topics | NOT_STARTED | Multiple heterogeneous examples |
| ARC-06.PH-04.T-002 | Reduce content-specific code/config | NOT_STARTED | Generalized templates/contracts |
| ARC-06.PH-04.T-003 | Measure manual intervention points | CANDIDATE | Production audit |
| ARC-06.PH-04.T-004 | Demonstrate bounded-autonomy production | NOT_STARTED | End-to-end run with predefined approvals only |

---

# ARC-07 — GOLDEN MASTER & ARTWORK OBJECTIVE

**Objective:** convert quality ambition into an explicit, testable roadmap toward masterpiece-level output.

## ARC-07.PH-01 — Golden Target Definition

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-07.PH-01.T-001 | Define market-ready ≈ 7+ | VALIDATED | Governance target established |
| ARC-07.PH-01.T-002 | Define Golden target ≈ 8 | VALIDATED | Governance target established |
| ARC-07.PH-01.T-003 | Define aspirational ≈ 9+ | VALIDATED | Governance target established |
| ARC-07.PH-01.T-004 | Define dimensions behind the score | IN_PROGRESS | Must connect creative, commercial, aesthetic perception |

## ARC-07.PH-02 — Benchmark System

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-07.PH-02.T-001 | Curate external/internal benchmark references | NOT_STARTED | Provenance-safe reference set |
| ARC-07.PH-02.T-002 | Create benchmark comparison rubric | CANDIDATE | Distinguishes 7 vs 8 vs 9 visibly |
| ARC-07.PH-02.T-003 | Calibrate with Product Owner judgments | NOT_STARTED | Repeated agreement across outputs |

## ARC-07.PH-03 — Golden 8/10 Roadmap

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-07.PH-03.T-001 | Identify top quality bottleneck after each evidence video | IN_PROGRESS | Ranked bottleneck register |
| ARC-07.PH-03.T-002 | Close visual quality gap | IN_PROGRESS | ARC-02 + ARC-03 |
| ARC-07.PH-03.T-003 | Close audio quality gap | IN_PROGRESS | ARC-04 |
| ARC-07.PH-03.T-004 | Close consistency/autonomy gap | IN_PROGRESS | ARC-06 |
| ARC-07.PH-03.T-005 | Produce first Golden Master candidate | NOT_STARTED | Candidate output scored/reviewed around 8 |

## ARC-07.PH-04 — 9/10+ Masterpiece Path

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-07.PH-04.T-001 | Establish 9/10+ differentiators | NOT_STARTED | Beyond competent automation |
| ARC-07.PH-04.T-002 | Build signature CKAI audiovisual language | NOT_STARTED | Recognizable without logo |
| ARC-07.PH-04.T-003 | Prove repeatable masterpiece capability | NOT_STARTED | More than one exceptional output |

---

# ARC-08 — PUBLISHING, DELIVERY & LEARNING LOOP

**Objective:** connect creation to real audience evidence and evolve the system from production outcomes.

## ARC-08.PH-01 — Publishing Package

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-08.PH-01.T-001 | Define Facebook/Reels primary packaging | IN_PROGRESS | Copy, title/caption, asset package |
| ARC-08.PH-01.T-002 | Preserve future TikTok/Shorts portability | CANDIDATE | No premature platform-specific architecture |
| ARC-08.PH-01.T-003 | Add provenance/release metadata to package | CANDIDATE | Traceable final artifacts |

## ARC-08.PH-02 — Delivery Learning

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-08.PH-02.T-001 | Record approved-vs-actual delivery delta | DONE | `/ck-publish` architecture |
| ARC-08.PH-02.T-002 | Build voice observations over time | IN_PROGRESS | Needs repeated real transcripts |
| ARC-08.PH-02.T-003 | Promote stable delivery patterns | NOT_STARTED | Multiple observations required |

## ARC-08.PH-03 — Performance Learning

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-08.PH-03.T-001 | Capture content performance data | IN_PROGRESS | Requires real published video metrics |
| ARC-08.PH-03.T-002 | Separate observation / hypothesis / learned pattern | DONE | Existing learning rules |
| ARC-08.PH-03.T-003 | Connect performance learning to content decisions | NOT_STARTED | Evidence-driven changes documented |
| ARC-08.PH-03.T-004 | Prevent view-only optimization | VALIDATED | Brand/authority objectives preserved |

## ARC-08.PH-04 — Feedback → System Evolution

| Task ID | Task | Status | Evidence / Done when |
|---|---|---|---|
| ARC-08.PH-04.T-001 | Route learnings to correct ARC/PH/T task | IN_PROGRESS | Mandatory from Blueprint v1.0 onward |
| ARC-08.PH-04.T-002 | Maintain candidate vs verified learning register | IN_PROGRESS | No single-video overpromotion |
| ARC-08.PH-04.T-003 | Review roadmap against real audience evidence | NOT_STARTED | Periodic PMO review |
| ARC-08.PH-04.T-004 | Feed validated patterns back into agents | NOT_STARTED | Controlled updates + regressions |

---

# 9. Production Evidence Register

| Content ID | Project role | Current mapping | Governance state |
|---|---|---|---|
| CKAI-0004 | Production Baseline V1 | ARC-06.PH-01 | VERIFIED evidence for baseline only |
| CKAI-0005 | Generalization Test 01 / Audio learning | ARC-06.PH-02 + ARC-04 | VERIFIED as test evidence; system rules require repetition |
| CKAI-0006 | Practical / Consistency Test | ARC-06.PH-03 + ARC-05.PH-03 | IN_PROGRESS evidence track |

Future CKAI-000x IDs must be attached to at least one blueprint task. They are never standalone projects.

---

# 10. Project Health Axes

QLDA reviews the project using these axes:

1. Architecture Foundation
2. Creative Quality
3. Audio Quality
4. Practical Content Capability
5. Production Consistency
6. Autonomy / Automation
7. Golden Master Progress
8. Publishing / Learning Loop

Percentages are permitted only as explicit estimates when evidence supports them; false precision is prohibited.

---

# 11. Risk Register

| Risk ID | Risk | Severity | Status | Mitigation | Related work |
|---|---|---:|---|---|---|
| R-001 | Project-state fragmentation between local repo, reports and GitHub | HIGH | IN_PROGRESS | Blueprint + web board + mandatory progress sync | ARC-01.PH-04 |
| R-002 | Side quests distract from long-horizon roadmap | HIGH | IN_PROGRESS | Every experiment mapped to task/evidence | ARC-01.PH-04 |
| R-003 | Automation before creative/audio quality is understood | HIGH | IN_PROGRESS | Freeze Audio Engine; gate automation with direction evidence | ARC-04.PH-05 |
| R-004 | One successful video becomes a false global rule | HIGH | IN_PROGRESS | Learning governance and repeated validation | ARC-06 |
| R-005 | Creative quality plateaus at technically-correct output | HIGH | IN_PROGRESS | Golden benchmark + North Star + human review | ARC-03 / ARC-07 |
| R-006 | Excessive manual handholding limits scale | MEDIUM | IN_PROGRESS | Audit intervention points before autonomy work | ARC-06.PH-04 |
| R-007 | Asset / license / provenance drift | MEDIUM | IN_PROGRESS | Explicit asset metadata and approved libraries | ARC-02.PH-03 / ARC-04.PH-01 |
| R-008 | Golden target remains aspirational but not measurable | HIGH | IN_PROGRESS | Build benchmark system and score anchors | ARC-07.PH-02 |

---

# 12. Mandatory Continuity Protocol

After **every meaningful completed task**, Codex must do all of the following in the same work unit:

1. Update the task status/evidence in `MASTER_BLUEPRINT.md`.
2. Append the milestone and impact to `PROGRESS.md`.
3. If a new task is discovered, add it under the correct existing ARC/PH; do not create a parallel architecture casually.
4. If a learning is created, classify it as `VERIFIED`, `CANDIDATE`, `CONTENT_SPECIFIC`, or `REJECTED`.
5. If the task changes risk, update the Risk Register.
6. Commit the canonical changes to GitHub.
7. GitHub Pages auto-deploys the latest blueprint and progress board.

A short experimental request from the Product Owner may change **current focus**, but it may not silently change or erase the blueprint backlog.

---

# 13. Definition of Done for a Blueprint Task

A task is `DONE` only when:

- the intended deliverable exists;
- relevant tests/review have passed where applicable;
- evidence is linked or named;
- downstream dependency state is updated;
- `MASTER_BLUEPRINT.md` and `PROGRESS.md` are synchronized;
- no known critical blocker is hidden by the status.

If evidence is insufficient, keep the task `IN_PROGRESS` or `CANDIDATE`.

---

# 14. Immediate Priority Stack — Blueprint v1.0

1. **P0 — Reconcile latest local/Codex implementation with GitHub** so the remote repository is no longer stale.
2. **P0 — Complete CKAI-0006 Practical / Consistency evidence** and map findings back into ARC-02 / ARC-05 / ARC-06.
3. **P0 — Clarify Audio Direction V1** and complete the licensed music library before unfreezing ARC-04.PH-05.
4. **P1 — Populate Creative North Star / benchmark references** for ARC-03 and ARC-07.
5. **P1 — Measure production handholding and generalization** before scaling automation.
6. **P1 — Establish real publish/performance learning evidence** and close the loop into the blueprint.

---

## Governance note

This v1.0 is the first canonical total-project map. It intentionally records the **known system state plus explicitly marked planning state**. The remote GitHub repository was observed to lag behind later Codex/local development, so reconciliation of implementation evidence is itself a P0 task rather than being silently assumed complete.
