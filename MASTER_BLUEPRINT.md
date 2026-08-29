# CKAI MASTER BLUEPRINT

> Version `1.0.0` · reconciled `2026-08-29` · canonical architecture/task/dependency truth.
>
> Authority split: local repository = implementation truth; this file = project/task state; `PROGRESS.md` = chronological history; `PROJECT.md` = product/content/system principles; `ldp.html` = visualization; GitHub = published mirror.

## State contract

Task states are mutually exclusive: `DONE`, `VALIDATED`, `IN_PROGRESS`, `NOT_STARTED`, `CANDIDATE`, `FROZEN`, `BLOCKED`, `NEEDS_RECONCILIATION`. `DONE` means the Definition of Done is met; `VALIDATED` additionally has executable or production evidence. A phase is derived from its tasks: all closed (`DONE`/`VALIDATED`) = closed; any `BLOCKED`/`NEEDS_RECONCILIATION` wins; otherwise active, frozen or planned follows the open task set.

## Canonical focus

- **NOW — no active/executable task:** GLD-02 qualification audit found no existing authoritative Golden output. `GLD-02` remains `CANDIDATE`; no production was authorized to create new evidence.
- **NEXT — Product Owner/ChatGPT decision on a future exact Golden candidate:** only an authorized candidate with overall ≥8, every critical floor ≥7, `STEP_CHANGE` and Human/ChatGPT Creative Director approval can close `GLD-02`. Afterward: understand/encode the proven capability, demonstrate repeatability on another content ID, then consider `AUT-02`. `LRN-02` remains independently available only when real published metrics are supplied.
- **LATER — `PUB-01`:** publishing/performance integration remains separately authorized and manual meanwhile.
- **Hard stops:** no CKAI-0007, no V1.3 for CKAI-0006, no new demo/render/creative experiment or publishing automation without separate explicit instruction; no Golden claim from architecture/tests.

## ARC-01 — Governance & authority

### PHASE-01.1 — Product and authority foundation

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| GOV-01 | Product/brand/content principles SSOT | DONE | `PROJECT.md` §§1–13, 26, 31 | none |
| GOV-02 | Product Owner → ChatGPT → Codex authority chain | DONE | `PROJECT.md` §23; `AGENTS.md` | GOV-01 |

### PHASE-01.2 — Approval and source-integrity governance

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| GOV-03 | Independent Content/Release/editorial/technical gates | DONE | `PROJECT.md` §§21–23 | GOV-02 |
| GOV-04 | Approval invalidation and hash-bound source rules | DONE | STEP 02–08 engines and runtime validators | GOV-03 |

### PHASE-01.3 — Agent and workflow authority

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| GOV-05 | Six canonical `.agents/skills/ck-*` workflows | DONE | six canonical skills present | GOV-01 |
| GOV-06 | `.claude` compatibility shims only | DONE | six thin shim files; no duplicate workflow logic | GOV-05 |

### PHASE-01.4 — Project-state authority

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| GOV-07 | Blueprint / Progress / Project / LDP authority split | DONE | this file; `PROGRESS.md`; `PROJECT.md`; `ldp.html` | GOV-02 |
| GOV-08 | Lightweight drift, link and task-ID validation | DONE | `scripts/validate-project-state.mjs` | GOV-07 |

## ARC-02 — Content OS & editorial lifecycle

### PHASE-02.1 — Brand knowledge and content model

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| COS-01 | Brand, audience, philosophy and pillars knowledge base | DONE | `knowledge/` canonical files | GOV-01 |
| COS-02 | Content matrix, structures, hooks and scoring | DONE | `engine/content-matrix.md`, `viral-structures.md`, `hook-library.md`, `content-scoring.md` | COS-01 |

### PHASE-02.2 — Content identity and lifecycle

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| COS-03 | CKAI/AITIP/TEST identity and lifecycle conventions | DONE | `PROJECT.md` §§15–18; `data/content-index.csv` | COS-01 |
| COS-04 | Flat content artifact topology and traceability | DONE | `content/` stage folders and READMEs | COS-03 |

### PHASE-02.3 — Editorial workflows

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| COS-05 | Idea / expand / script / review workflows | DONE | canonical skills + engines | COS-02 |
| COS-06 | Publish / learn workflows and separated learning types | DONE | `/ck-publish`, `/ck-learn`, `PROJECT.md` §§13,27 | COS-04 |

### PHASE-02.4 — Content mode routing

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| MOD-01 | THINKING/Chánh Kiến semantic routing | DONE | script/storyboard/visual director stream rules | COS-02 |
| MOD-02 | PRACTICAL/Tuyệt Chiêu workflow/broadcast routing | DONE | `engine/visual-director.md`; CKAI-0006 V1.2 learning | PRD-06 |

## ARC-03 — Intelligence & pre-production engines

### PHASE-03.1 — STEP 01 AI Tips Intelligence

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| ENG-01 | Candidate discovery/verification/scoring contract | VALIDATED | `engine/ai-tips-intelligence.md`; fixtures | COS-03 |
| ENG-02 | Candidate hard-gate and handoff validation | VALIDATED | `content/candidates/`; test evidence | ENG-01 |

### PHASE-03.2 — STEP 02 Script Engine

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| ENG-03 | Script schema, evidence ledger and duration gate | VALIDATED | `engine/script-engine.md`; templates/proofs | ENG-01 |
| ENG-04 | Exact Content Approval and storyboard handoff | VALIDATED | approved CKAI-0004/0005/0006 artifacts | ENG-03 |

### PHASE-03.3 — STEP 03 Storyboard Engine

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| ENG-05 | Scene/timing/semantic storyboard contract | VALIDATED | `engine/storyboard-engine.md`; artifacts | ENG-04 |
| ENG-06 | Storyboard source-chain/handoff gates | VALIDATED | canonical + reverse-audit artifacts | ENG-05 |

### PHASE-03.4 — STEP 04 Visual Director

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| ENG-07 | Visual language, proof and provenance contract | VALIDATED | `engine/visual-director.md`; artifacts | ENG-06 |
| ENG-08 | Stream/mode routing and Animation handoff | VALIDATED | THINKING/PRACTICAL routes; STEP 04 validators | ENG-07 |

## ARC-04 — Production runtime STEP 05–08

### PHASE-04.1 — STEP 05 Animation

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| RUN-01 | Remotion manifest/runtime and source validation | VALIDATED | `video-factory/animation/`; tests | ENG-08 |
| RUN-02 | Animation QA and Voice handoff | VALIDATED | production/reverse-audit artifacts | RUN-01 |

### PHASE-04.2 — STEP 06 Voice

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| RUN-03 | Provider aliases, normalization, cache and timing | VALIDATED | `video-factory/voice/`; registry/tests | RUN-02 |
| RUN-04 | Quota authorization and Voice hard gate | VALIDATED | authorization JSON; voice plans; tests | RUN-03 |

### PHASE-04.3 — STEP 07 Final Review & finishing

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| RUN-05 | Caption/music/SFX finishing and AV QA | VALIDATED | `video-factory/review/`; review artifacts | RUN-04 |
| RUN-06 | Delegated review acceptance and Export handoff | VALIDATED | snapshot/hash-bound review contracts | RUN-05 |

### PHASE-04.4 — STEP 08 Final Export

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| RUN-07 | Canonical master encode/inspection/equivalence | VALIDATED | `video-factory/export/`; tests/artifacts | RUN-06 |
| RUN-08 | Release manifest and hash-bound approval boundary | VALIDATED | export artifacts; Facebook package contract | RUN-07 |

## ARC-05 — One-Chat bridge & publishing boundary

### PHASE-05.1 — Filesystem production bridge

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| BRG-01 | Atomic job lifecycle and idempotent runner | VALIDATED | `runtime/production-bridge/src/core.mjs`; tests | GOV-04 |
| BRG-02 | Provider-spend policy and secret redaction | VALIDATED | bridge schema/core/tests | BRG-01 |

### PHASE-05.2 — Generic production adapter

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| BRG-03 | Dynamic Content-ID STEP 02–04 derivation | VALIDATED | `canonical-adapter.ts`; reverse-audit tests | ENG-08 |
| BRG-04 | STEP 05–08 continuation and delegated acceptance | VALIDATED | `generic-runtime.ts`; adapter tests | BRG-03, RUN-08 |

### PHASE-05.3 — Review package and publishing

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| BRG-05 | Deterministic Facebook Review Package | VALIDATED | `generated/facebook-packages/`; bridge tests | BRG-04 |
| PUB-01 | Platform publishing/performance integration | NOT_STARTED | Facebook upload remains manual; no API/OAuth/scheduler | explicit future authorization |

## ARC-06 — Visual intelligence & creative quality

### PHASE-06.1 — Semantic + retention foundation

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| VIS-01 | Semantic routing and actual-binary QA | VALIDATED | engine policy; Phase 1 artifacts | RUN-01 |
| VIS-02 | Retention plan and source/evidence invariants | VALIDATED | production artifacts + tests | VIS-01 |

### PHASE-06.2 — Phase 1H execution contract

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| VIS-03 | Multi-beat/semantic mechanism execution | VALIDATED | Phase 1H probe/report | VIS-02 |
| VIS-04 | Actual timeline and creative-continuity QA | VALIDATED | Phase 1H actual-MP4 evidence | VIS-03 |

### PHASE-06.3 — Phase 1H.5/1H.6 perception & replan

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| VIS-05 | Viewer-perceived progression gate | VALIDATED | Phase 1H.5 report/tests | VIS-04 |
| VIS-06 | Bounded automatic perceptual replan | VALIDATED | Phase 1H.6 report/artifacts | VIS-05 |

### PHASE-06.4 — Phase 1I representation engine

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| VIS-07 | Representation planning/candidate comparison | VALIDATED | Phase 1I report/artifacts | VIS-06 |
| VIS-08 | Representation actual-pixel QA | VALIDATED | Phase 1I tests/evidence | VIS-07 |

### PHASE-06.5 — Phase 1J spatial & motion realization

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| VIS-09 | Spatial topology and semantic motion plan | VALIDATED | Phase 1J report/artifacts | VIS-08 |
| VIS-10 | Actual motion/spatial QA and repair | VALIDATED | Phase 1J selected QA | VIS-09 |

### PHASE-06.6 — Phase 1K semantic embodiment

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| VIS-11 | Semantic object identity and signatures | VALIDATED | Phase 1K report/artifacts | VIS-10 |
| VIS-12 | Repair-to-renderer propagation closure | VALIDATED | Phase 1K closure report/tests | VIS-11 |

### PHASE-06.7 — Creative governance and expansion freeze

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| QLT-01 | Market/Taste Standard V1 and 7/8/9 gates | DONE | engine/config/tests | VIS-12 |
| VIS-13 | Phase 1L architecture expansion | FROZEN | Golden-first policy; output quality gap | GLD-02 |

## ARC-07 — Production evidence

### PHASE-07.1 — CKAI-0004 baseline

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| PRD-01 | CKAI-0004 Production Baseline V1 | VALIDATED | Product Owner confirmation + local final/report | RUN-08 |
| PRD-02 | CKAI-0004 visual-system learning | VALIDATED | probes, reports, `insights/production-learning.md` | PRD-01 |

### PHASE-07.2 — CKAI-0005 generalization

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| PRD-03 | Generalization Test 01 PASS | VALIDATED | V1/V1.1 reports + Product Owner/ChatGPT review | PRD-02 |
| PRD-04 | Final Audio V2 published and learning captured | VALIDATED | final report + Product Owner confirmation | PRD-03, MUS-02 |

### PHASE-07.3 — CKAI-0006 practical consistency

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| PRD-05 | Practical/Consistency Test closed at V1.2 | VALIDATED | V1/V1.1/V1.2 reports + Product Owner lock | PRD-03 |
| PRD-06 | Practical Visual Baseline V1 formalized | VALIDATED | `engine/visual-director.md`; Product Owner learning | PRD-05 |

## ARC-08 — Audio system

### PHASE-08.1 — Voice and mastering foundation

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| AUD-01 | Production voices and authorized quota boundary | VALIDATED | voice registry + authorization + 0005/0006 evidence | RUN-03 |
| AUD-02 | Voice-first mastering, phone-presence and semantic SFX checks | VALIDATED | 0005/0006 technical QA | AUD-01 |

### PHASE-08.2 — CKAI Music Library V1

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| MUS-01 | 22-track six-family canonical local shelf | VALIDATED | registry + 22 MP3 + family matrix | none |
| MUS-02 | Round 1+2 license/provenance/local-asset QA | VALIDATED | 22 track records + reports | MUS-01 |

### PHASE-08.3 — Audio Direction and Phase 2

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| AUD-03 | Audio Direction V1 evidence consolidation | VALIDATED | `engine/audio-direction-v1.md`; 0004 failure + 0005 published + 0006 locked + Music Library evidence | PRD-04, PRD-05, MUS-02 |
| AUD-04 | Phase 2 Audio Engine | VALIDATED | `engine/audio-engine-v1.md`; 22-track resolver/ranker; audio contract + Review integration; 12 focused regressions | AUD-03, MUS-02 |

## ARC-09 — Learning, autonomy & Golden Master

### PHASE-09.1 — Delivery and performance learning

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| LRN-01 | Delivery Learning workflow and first record | DONE | CKAI-0003 published delta + voice observations | COS-06 |
| LRN-02 | Real performance ingestion and learned pattern | NOT_STARTED | `data/performance.csv` has no real rows | published metrics |
| LRN-03 | Close CKAI-0005 publication lifecycle record | VALIDATED | canonical published record + animated transcript/delta; Product Owner confirmed `Facebook Reels`; publication date remains unrecorded | LRN-01 |

### PHASE-09.2 — Production autonomy

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| AUT-01 | Evidence-based end-to-end maturity assessment | DONE | pipeline table below; implementation audit | BRG-05 |
| AUT-02 | Bounded autonomous repeatable production | CANDIDATE | audio mechanics exist; repeatable Golden-quality evidence remains absent | AUD-04, GLD-02 |

### PHASE-09.3 — Project control and Golden Master

| Task ID | Deliverable | State | Evidence / DoD | Dependency |
|---|---|---|---|---|
| PM-01 | Canonical Blueprint/LDP/update protocol synchronized | DONE | this file, `PROGRESS.md`, `ldp.html`, validator | GOV-08 |
| GLD-02 | Golden Master at authoritative score ≥8 | CANDIDATE | `content/reviews/GLD-02_golden-master-qualification.md`: existing evidence audited; best confirmed visual ≈6.7; Golden unawarded | QLT-01 |

## Production autonomy snapshot

| Stage | Maturity | Evidence / boundary |
|---|---|---|
| Idea/topic discovery | ASSISTED | ChatGPT/user judgment; STEP 01 candidate machinery exists |
| Content/script | ASSISTED | engines and gates exist; editorial authority remains human/ChatGPT |
| Review/approval | QUALITY_GATED | direct Content Approval required |
| Mode routing | MOSTLY_AUTONOMOUS | THINKING/PRACTICAL rules formalized; creative judgment remains |
| Visual planning | MOSTLY_AUTONOMOUS | STEP 03–04 + visual intelligence; human taste gate |
| Asset selection | ASSISTED | provenance/routing exist; key choice still judgment-led |
| Visual production | MOSTLY_AUTONOMOUS | generic Remotion/runtime works; Golden consistency not proven |
| Voice | MOSTLY_AUTONOMOUS | registry/provider/cache/QA; brand/cost gate retained |
| Music selection | ASSISTED | deterministic 22-track candidate ranking; final choice requires actual-narration audition |
| Music bed planning | ASSISTED | complete semantic base/attenuation/silence mechanics; content-specific deltas reviewed |
| Semantic SFX | ASSISTED | meaningful-event contract and `NO_SFX`; final cues/assets reviewed |
| Mix/master | MOSTLY_AUTONOMOUS | STEP 07 finishing plus deterministic `CKAI_SHORT_FORM_MASTERING_V1` |
| Audio technical QA | MOSTLY_AUTONOMOUS | registry/provenance/binary/mastering/phone-proxy checks block visibly |
| Audio creative QA | HUMAN_GATED | actual decoded mix + phone listening; Product Owner/ChatGPT authority |
| Rendering/export | AUTONOMOUS | deterministic local runtime and hard QA |
| Creative QA | QUALITY_GATED | machine diagnostics plus ChatGPT/Product Owner authority |
| Facebook package | AUTONOMOUS | deterministic package generation |
| Publish | MANUAL | Product Owner uploads; integration not built |
| Delivery Learning | ASSISTED | workflow exists; transcript/confirmation supplied |
| Performance ingestion | NOT_BUILT | no integration and no real performance rows |
| Feedback into system | ASSISTED | production learning exists; promotion requires evidence |

## Manual handholding classification

| Intervention | Current reason | Class | Direction |
|---|---|---|---|
| Content and Release Approval | market-facing owner authority | A — retain human judgment | permanent gate |
| Creative/taste review | Golden and Market/Taste cannot be self-awarded | A — retain human judgment | keep quality-gated |
| Voice brand/provider/cost | brand and spend authority | A — retain human judgment | interrupt only when needed |
| Job continuation after delegated acceptance | current one-chat bridge boundary | B — automate now within hashes/gates | bridge already supports bounded continuation |
| Facebook upload and metrics entry | missing integration | B — technically automatable, not authorized | remain manual |
| Music choice/perceptual mix correction | candidate/mechanical support exists; taste remains human | A — retain human judgment | actual narration audition + decoded mix/phone listening |
| Visual correction/prompt steering | consistency below Golden | C — automate only after quality evidence | feed proven patterns, not one-off taste |

## Critical dependencies and risks

| ID | Type | State | Impact / response |
|---|---|---|---|
| DEP-01 | dependency | RESOLVED | `AUD-03` and bounded `AUD-04` are validated; human creative audio gates remain intentionally open per production |
| DEP-02 | dependency | ACTIVE | Golden evidence gates architecture expansion and bounded autonomy |
| RSK-01 | quality | ACTIVE | system maturity exceeds output-quality maturity; never infer Golden from tests |
| RSK-02 | operations | ACTIVE | publishing/performance remain manual; document rather than hide handholding |
| RSK-03 | repository | MITIGATED | previously missing project-state SSOT/LDP; validator now detects drift |
| RSK-04 | provenance/storage | MONITORED | large local/generated media remain outside task truth; canonical music provenance is local and complete |
| RSK-05 | record integrity | RESOLVED | CKAI-0005 publication lifecycle closed on Product Owner-confirmed `Facebook Reels`; no publication date was invented |

## Update protocol

After every meaningful task completion: (1) complete implementation/evidence; (2) update the task here; (3) append `PROGRESS.md`; (4) update dependency/risk; (5) update/regenerate `ldp.html`; (6) run relevant tests plus `npm run project-state:validate`; (7) inspect diff and commit; (8) push GitHub when appropriate. Never promote a task only to make the dashboard look complete.
