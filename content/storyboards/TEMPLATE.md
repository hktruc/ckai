---
id: CKAI-000N
type: short-form-storyboard
content_stream: chanh-kien
format: vertical-9x16
input_eligibility: production
source_approved_script: ../approved/CKAI-000N_slug.md
source_approved_script_sha256:
content_approval_fingerprint_sha256:
storyboard_status: draft
storyboard_review: pending
human_decision: pending
visual_director_handoff_status: BLOCKED
target_duration_seconds: 50
script_estimated_duration_seconds:
storyboard_planned_duration_seconds:
scene_count:
input_check: pending
spoken_mapping_check: pending
timing_check: pending
proof_evidence_check: pending
caveat_check: pending
storyboard_quality_check: pending
boundary_check: pending
unresolved_issues:
operator_acceptance_by:
operator_acceptance_at:
operator_acceptance_basis:
operator_acceptance_source_sha256:
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Storyboard — CKAI-000N

_Dùng theo [`../../engine/storyboard-engine.md`](../../engine/storyboard-engine.md). Chỉ mô tả semantic requirements; không thêm art direction hoặc animation implementation._

## 1. SOURCE & INPUT AUDIT

- **Source approved script:**
- **Input status / editorial / human:** approved / pass / approved
- **Script handoff:** READY
- **Content stream:** chanh-kien | tuyet-chieu-ai
- **Format:** vertical-9x16
- **Duration / evidence checks:** PASS / PASS
- **Final Spoken Copy present:** yes | no
- **Narrative Beats present:** yes | no
- **Editorial Handoff Requirements present:** yes | no
- **Unresolved decision-critical issues:** none |
- **Input check:** PASS | BLOCKED

## 2. SCENE PLAN

### SC-01

- **Order:** 1
- **Timing:** 00:00.0–00:00.0
- **Duration seconds:**
- **Source beat(s):** B1
- **Spoken Copy:**

> Exact excerpt từ approved script, hoặc `[visual-only]`.

- **Narrative purpose:**
- **Semantic visual function:**
- **On-screen text requirement:** none | REQUIRED —
- **Proof/evidence requirement:** none | REQUIRED — source/ref
- **Caveat requirement:** none | REQUIRED —
- **Continuity/dependency:** none |
- **Density/attention warning:** none |
- **Reviewer note:** none |

_Lặp scene block với ID liên tục `SC-02`, `SC-03`... Không mô tả palette, exact composition, asset, camera, typography treatment, transition, animation, Remotion, voice hoặc sound._

## 3. SPOKEN COPY COVERAGE

| Source beat/segment | Scene | Coverage | Order | Notes |
|---|---|---|---|---|
| B1 | SC-01 | FULL | correct |  |

- **Missing segments:** none |
- **Duplicate segments:** none |
- **Invented Spoken Copy:** none |
- **Pause/hold mapping:** none |
- **Spoken mapping check:** PASS | BLOCKED

## 4. TIMING SUMMARY

| Scene | Start | End | Duration seconds | Timing rationale |
|---|---:|---:|---:|---|
| SC-01 | 0.0 | 0.0 | 0.0 |  |
| **TOTAL** |  |  | **0.0** |  |

- **Script estimated duration:** seconds
- **Storyboard planned duration:** seconds
- **Difference + rationale:**
- **Visual-only holds:** none |
- **Approval ceiling / hard limit:** 55 / <60 seconds
- **Timing check:** PASS | REVISE

## 5. PROOF / TEXT / CAVEAT TRACEABILITY

| Requirement ID | Upstream claim/evidence | Scene | Priority | Status |
|---|---|---|---|---|
| R1 |  | SC-01 | REQUIRED \| OPTIONAL | PRESERVED \| MISSING \| BLOCKED |

- **Fake/unverified proof introduced:** no | BLOCKED —
- **Proof/evidence check:** PASS | BLOCKED
- **Required caveat check:** PASS | BLOCKED

## 6. STORYBOARD QUALITY REVIEW

- **Input eligibility:** PASS | BLOCKED —
- **Full Spoken Copy mapping:** PASS | BLOCKED —
- **Timing and readability:** PASS | REVISE —
- **Scene density/function:** PASS | REVISE —
- **Proof/evidence/caveat preservation:** PASS | BLOCKED —
- **Continuity:** PASS | REVISE —
- **No invented claim/fake proof:** PASS | BLOCKED —
- **No art-direction leakage:** PASS | BLOCKED —
- **Stream behavior:** PASS | REVISE —
- **Storyboard review:** pending | pass | revise | reject
- **Consolidated storyboard quality check:** pending | PASS | BLOCKED
- **Reviewer notes:**

## 7. DELEGATED OPERATOR ACCEPTANCE

- **Legacy human_decision:** pending | approved | rejected | needs-changes | not-applicable
- **Approval basis/reference:** active STEP 02 Content Approval + ChatGPT review
- **Operator notes:**
- **Unresolved issues:** none |

ChatGPT review + delegated acceptance không override hard gates. Product Owner không mặc định inspect Storyboard; not-applicable chỉ dành fixture/reverse-audit và không mở handoff.

## 8. VISUAL DIRECTOR HANDOFF
### READY invariant checklist

- **Input eligibility:** `production`
- **Canonical STEP 02 approved source + handoff READY:** PASS | BLOCKED
- **Input check:** PASS | BLOCKED
- **Spoken mapping check:** PASS | BLOCKED
- **Timing check:** PASS | REVISE
- **Proof/evidence check:** PASS | BLOCKED
- **Required caveat check:** PASS | BLOCKED
- **Storyboard quality check:** PASS | BLOCKED
- **Boundary check:** PASS | BLOCKED
- **Storyboard review:** pass | other
- **Delegated operator decision / legacy human_decision:** approved | other
- **Unresolved blockers:** none | present

Nếu một dòng không đạt, handoff phải `BLOCKED`; human `approved` không override hard gate.


- **Approved storyboard:** this file
- **Approved script reference:**
- **Scene timing/mapping:** included | incomplete
- **Mandatory text/proof/caveat:** included | incomplete
- **Continuity constraints:** included | none
- **Visual Director handoff:** BLOCKED | READY

Chỉ toàn bộ READY invariant checklist cùng đạt mới được `READY`. Fixture/reverse-audit có `input_eligibility != production` hoặc human `not-applicable` luôn `BLOCKED` dù các contract checks khác PASS.

_STOP BEFORE VISUAL DIRECTOR. Không thêm actual art direction, assets, animation, voice hoặc export._
