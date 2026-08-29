---
id: CKAI-000N
type: short-form-visual-direction
content_stream: chanh-kien
format: vertical-9x16
visual_input_eligibility: production
visual_dna_preset: CKAI_DARK_PREMIUM_EDITORIAL_V1
visual_dna_version: 1
source_approved_storyboard: ../storyboards/CKAI-000N_slug_storyboard.md
source_approved_storyboard_sha256:
source_approved_script: ../approved/CKAI-000N_slug.md
source_approved_script_sha256:
visual_direction_status: draft
visual_review: pending
human_decision: pending
animation_handoff_status: BLOCKED
scene_count:
visual_input_check: pending
storyboard_trace_check: pending
proof_evidence_check: pending
caveat_check: pending
asset_provenance_check: pending
native_vertical_check: pending
continuity_check: pending
readability_density_check: pending
brand_check: pending
boundary_check: pending
visual_quality_check: pending
unresolved_issues:
operator_acceptance_by:
operator_acceptance_at:
operator_acceptance_basis:
operator_acceptance_source_sha256:
runtime_delegation_by:
runtime_delegation_at:
runtime_delegation_basis:
runtime_delegation_scope: STEP05,STEP06,STEP07
runtime_delegation_content_approval_fingerprint_sha256:
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Visual Direction — CKAI-000N

_Dùng theo [`../../engine/visual-director.md`](../../engine/visual-director.md). Không thêm animation mechanics, component/code, frame/keyframe/easing hoặc render implementation._

## 1. SOURCE & VISUAL INPUT AUDIT

- **Source approved Storyboard:**
- **Source approved Script:**
- **Storyboard eligibility/status/review/human:** production / approved / pass / approved
- **Visual Director handoff:** READY
- **Storyboard hard checks:** all PASS
- **Scene timing/Spoken mapping/semantic function:** present | missing
- **Mandatory text/proof/caveat/continuity:** present | missing
- **Unresolved source blockers:** none |
- **Visual input check:** PASS | BLOCKED

## 2. GLOBAL VISUAL LANGUAGE

- **Density:**
- **Mode:** editorial | technical | conceptual |
- **Dimensionality:** flat | dimensional |
- **Representation:** abstract | representational | UI-like | text-led | illustration-led |
- **Background philosophy:**
- **Whitespace principle:**
- **Emphasis principle:**
- **Stable brand constraints:**
- **Experimental choices for this video:**
- **Reusable primitives:**
- **Continuity strategy:**

Experimental choices không tự trở thành CKAI invariant; xem [`../../knowledge/brand.md`](../../knowledge/brand.md).

## 3. SCENE VISUAL DIRECTIONS

### SC-01

- **Storyboard/timing reference:** SC-01 · 00:00.0–00:00.0
- **Semantic visual function:**
- **Display copy:** short hero/keyword/number/proof label/conclusion; never full Spoken Copy by default
- **Semantic visual objective:** comparison | process | abstract-concept | proof | key-insight | tension | conclusion
- **Semantic archetype:** thesis-declaration | contrast-before-after | investigation-verification | transformation | consequence-payoff | evidence-proof | reflection-insight | warning-tension | conclusion-distillation
- **Visual mode:** typographic-editorial | object-metaphor-cinematic | proof-evidence-presentation | transformation-comparison
- **Primary visual concept:**
- **Central tension:**
- **Semantic object:** none | lens | balance | layers | fracture | domino-chain | aperture | document-field | reassembly-field
- **Primary visual object:**
- **Visual metaphor:** none |
- **Object rationale:** none — typography-led | why this object fits this idea
- **Representation type:**
- **Focal element:**
- **Supporting elements:**
- **Composition strategy:**
- **Lighting strategy:** restrained-ambient | directional-edge | backlight | localized-glow | dark-to-light | shadow-separation
- **Depth strategy:** foreground-background | occlusion | perspective | atmospheric | shadow-separation | flat-intentional
- **Line purpose:** none | connect | reveal | separate | directional-tension
- **Typography strategy:**
- **Pacing intent:** hold | scan | investigate | accumulate | cascade | reveal | reflect | interrupt | resolve
- **Proof strategy:** none | honest-if-used | visual-representation | actual-proof
- **Negative-space intent:**
- **Source strategy:** typography-only | procedural-semantic-object | canonical-evidence-representation | approved-local-asset
- **Hybrid source choice:** CODE_NATIVE | REAL_EVIDENCE | GENERATED_KEY_VISUAL
- **Source choice rationale:** why this source is semantically appropriate; absence of an asset is not a CODE_NATIVE rationale
- **Key visual brief:** none | ../visual-assets/<CONTENT-ID>/<SCENE>-key-visual-brief.json
- **Visual asset contract:** none | ../visual-assets/<CONTENT-ID>/<SCENE>-visual.asset.json
- **Forbidden fallback anatomy:** text wall; generic shape; generic card; generic geometry; default typography block
- **Eye path:**
- **Accent rationale:** none |
- **Spatial hierarchy:**
- **Emotional tone:**
- **Relationship to preceding/following scene:**
- **Background intent:**
- **On-screen text hierarchy:**
  - Primary:
  - Secondary:
  - Proof/caveat:
- **Proof representation:** none | actual-proof | visual-representation | illustrative-mockup | conceptual-metaphor — truth label/source
- **Proof truth label:** none | exact visible honesty label
- **Verification basis:** direct-evidence | product-owner-confirmed | independent-verification-required | none
- **Caveat representation:** none | REQUIRED — hierarchy/visibility
- **Asset requirements:** none | A1, A2
- **Continuity notes:** none |
- **Motion intent:** none | reveal | transform | build | compare | focus | emphasize | progress | replace | collapse | expand
- **Density/readability warning:** none |
- **Reviewer note:** none |

_Lặp với scene IDs/timing giữ nguyên Storyboard. Không ghi pixel coordinates, implementation duration, frames, keyframes, easing, spring, transition code, Remotion/React/CSS/SVG hoặc render API._

## 4. ASSET REQUIREMENTS

| Asset ID | Scene | Type | Purpose | Priority | Provenance/source | Evidence-critical | Truth label | Valid fallback | Status |
|---|---|---|---|---|---|---|---|---|---|
| A1 | SC-01 |  |  | REQUIRED \| OPTIONAL |  | yes \| no |  | none \| | AVAILABLE \| NEEDED \| BLOCKED |

- **Asset provenance check:** PASS | BLOCKED
- **Asset generation/download performed:** no

Production asset JSON uses the minimal filesystem contract in `video-factory/animation/src/visual-system/hybrid-source.ts`: `assetId`, Content/Scene IDs, source type, source/provenance/SHA-256, rights/truth state, production approval, crop metadata and safe-animation metadata. No database or DAM.

## 5. PROOF / CAVEAT REPRESENTATION

| Requirement ID | Storyboard scene/requirement | Representation class | Visual treatment intent | Source/provenance | Status |
|---|---|---|---|---|---|
| R1 |  | actual-proof \| visual-representation \| illustrative-mockup \| conceptual-metaphor |  |  | PRESERVED \| BLOCKED |

- **Mockup presented as actual proof:** no | BLOCKED —
- **Invented claim/UI/result/data:** no | BLOCKED —
- **Proof/evidence check:** PASS | BLOCKED
- **Required caveat check:** PASS | BLOCKED

## 6. CONTINUITY & ATTENTION MAP

| From → To | Persistent identity/role | Spatial/semantic relationship | Required continuity | Conflict |
|---|---|---|---|---|
| SC-01 → SC-02 |  |  |  | none |

- **Single attention priority per scene:** PASS | BLOCKED
- **Mobile readability/density:** PASS | BLOCKED
- **Continuity check:** PASS | BLOCKED
- **Native vertical check:** PASS | BLOCKED

## 7. VISUAL QUALITY REVIEW

- **Visual input:** PASS | BLOCKED —
- **Storyboard trace/no rewrite:** PASS | BLOCKED —
- **Proof integrity/truth labels:** PASS | BLOCKED —
- **Caveat visibility:** PASS | BLOCKED —
- **Asset provenance:** PASS | BLOCKED —
- **Native 9:16/mobile hierarchy:** PASS | BLOCKED —
- **Density/readability:** PASS | BLOCKED —
- **Global language consistency:** PASS | BLOCKED —
- **Continuity/object identity:** PASS | BLOCKED —
- **Text hierarchy:** PASS | BLOCKED —
- **Brand/stream behavior:** PASS | BLOCKED —
- **No invented claim/fake proof:** PASS | BLOCKED —
- **No animation implementation leakage:** PASS | BLOCKED —
- **Visual review:** pending | pass | revise | reject
- **Consolidated visual quality check:** pending | PASS | BLOCKED
- **Reviewer notes:**

## 8. DELEGATED OPERATOR ACCEPTANCE

- **Legacy human_decision:** pending | approved | rejected | needs-changes | not-applicable
- **Approval basis/reference:** active STEP 02 Content Approval + ChatGPT visual review
- **Operator notes:**
- **Unresolved issues:** none |

ChatGPT visual review + delegated acceptance không override hard checks. Product Owner không mặc định inspect Visual Direction; fixture not-applicable không mở handoff.

## 9. ANIMATION HANDOFF

### READY invariant checklist

- **Visual input eligibility:** production | other
- **Source Storyboard exact READY invariant:** PASS | BLOCKED
- **Visual input / Storyboard trace:** PASS | BLOCKED
- **Proof / caveat:** PASS | BLOCKED
- **Asset provenance:** PASS | BLOCKED
- **Native vertical / readability:** PASS | BLOCKED
- **Continuity / brand / boundary / visual quality:** PASS | BLOCKED
- **Visual review:** pass | other
- **Delegated operator decision / legacy human_decision:** approved | other
- **Unresolved blockers:** none | present

- **Approved Visual Direction:** this file
- **Source Storyboard/Script:** included | incomplete
- **Scene concepts/composition/hierarchy:** included | incomplete
- **Assets/provenance/text/proof/caveat:** included | incomplete
- **Continuity/semantic motion intent:** included | none | incomplete
- **Animation handoff:** BLOCKED | READY

Chỉ toàn bộ READY conjunction cùng đạt mới được `READY`. Reverse-audit/non-production input luôn `BLOCKED` dù các visual checks khác PASS.

_STOP BEFORE ANIMATION. Không thêm Animation Engine, Remotion, component/code, timeline, render, voice hoặc export._
