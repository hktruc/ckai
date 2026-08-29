---
id: CKAI-000N
type: short-form-script
content_stream: chanh-kien
format: vertical-9x16
status: draft
editorial_review: pending
human_decision: pending
storyboard_handoff_status: BLOCKED
pillar:
topic:
angle:
structure:
objective:
duration_target: 50
spoken_unit_count:
pacing_spoken_units_per_minute: 170
pause_budget_seconds:
estimated_duration_seconds:
duration_check: pending
claim_evidence_check: pending
content_approval_by:
content_approval_at:
content_approval_basis:
content_approval_fingerprint_sha256:
source_idea:
source_candidate:
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Script — CKAI-000N

_Dùng theo [`../../engine/script-engine.md`](../../engine/script-engine.md). Không thêm scene, shot, animation hoặc visual direction._

## 1. EDITORIAL BRIEF

- **Working title:**
- **Content stream:** chanh-kien | tuyet-chieu-ai
- **Format:** vertical-9x16
- **Core promise/takeaway:**
- **Target audience:**
- **Primary objective:**
- **Structure + rationale:**
- **Source/upstream references:**
- **Unresolved input issues:** none |

## 2. HOOK

- **Hook A:** — Stop | Curiosity | Relevance | Credibility | Brand Fit → /5
- **Hook B:** — Stop | Curiosity | Relevance | Credibility | Brand Fit → /5
- **Hook C:** — Stop | Curiosity | Relevance | Credibility | Brand Fit → /5
- **Selected hook:** A | B | C
- **Promise alignment:** pass | revise — hook không hứa nhiều hơn body

## 3. NARRATIVE BEATS

| Beat ID | Function | Editorial point |
|---|---|---|
| B1 |  |  |

## 4. SPOKEN COPY

[B1 — HOOK]



## 5. CLAIM & EVIDENCE LEDGER

| Script claim ID | Claim used in hook/copy | Upstream claim/evidence | Required caveat | Status |
|---|---|---|---|---|
| S1 |  |  |  | SUPPORTED \| NEEDS_VERIFICATION \| BLOCKED |

- **Claim/evidence check:** PASS | BLOCKED

## 6. DURATION CHECK

- **Spoken unit count:**
- **Pacing:** 170 spoken units/minute
- **Pause budget:** × 1 second = seconds
- **Formula:** round((spoken units / spoken units per minute) × 60 + pause budget)
- **Estimated duration:** seconds
- **Target duration:** 50 seconds
- **Duration check:** PASS | REVISE
- **Revision if over budget:**

Counting rule: xem [`../../engine/script-engine.md`](../../engine/script-engine.md) §4; không dùng tokenizer của bất kỳ provider nào.

## 7. ENDING / CTA

- **Ending type:** CTA | question | takeaway | intentional-no-CTA
- **Spoken ending:**

## 8. EDITORIAL HANDOFF REQUIREMENTS

- **Proof that must remain:**
- **Critical on-screen facts/text:**
- **Caveats that must remain:**
- **Content stream:**

_Đây là requirement editorial cho future Storyboard, không phải scene/shot/visual plan._

## 9. REVIEW & APPROVAL

- **Editorial review:** pending | pass | revise | reject
- **Editorial notes:**
- **Product Owner Content Approval:** pending | approved | rejected | needs-changes | not-applicable
- **Approved market-facing content reference/revision:**
- **Content Approval notes:**
- **Unresolved issues:**
- **Storyboard handoff:** BLOCKED | READY

Chỉ editorial review pass + direct Product Owner Content Approval (legacy human_decision approved) + duration/evidence PASS mới READY. Content Approval binds exact Spoken Copy/claims/CTA/meaning-critical text; material change invalidates it.

Khi approved, bốn field `content_approval_*` phải được persist trong chính canonical STEP 02 artifact. Fingerprint được derive deterministic từ Spoken Copy, Ending/CTA, Claim Ledger, Working Title và Facebook Caption; job chỉ vận chuyển bản sao hash, không tạo authority.

## 10. FACEBOOK PACKAGE COPY

## Working Title



## Facebook Caption



Caption/headline là market-facing content và nằm trong exact Content Approval fingerprint. Hashtag/pinned comment chỉ thêm khi hữu ích và cũng phải approved; không tự sinh claim mới ở packaging.

