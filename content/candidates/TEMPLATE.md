---
id: AITIP-000N
type: ai-tip-candidate
stage: discovered
verification_status: UNVERIFIED
testability_status: NOT_ASSESSED
test_execution_status: NOT_RUN
test_result: NOT_AVAILABLE
decision: pending
human_decision: pending
score_total:
discovered_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
content_id:
---

# AI Tip Candidate — AITIP-000N

_Dùng theo [`../../engine/ai-tips-intelligence.md`](../../engine/ai-tips-intelligence.md). Không xóa section; nếu chưa có dữ liệu, ghi rõ `UNKNOWN` hoặc `NOT YET TESTED`._

## 1. DISCOVER — Raw Candidate

- **Title:**
- **Core idea:**
- **Target user:**
- **Problem:**
- **Expected outcome:**
- **Tool/product involved:**
- **Initial source/evidence:**
- **Discovered at:**
- **Cost assumption:**
- **Setup complexity:** low | medium | high
- **Why it may be useful:**

### DISCOVER gate

- **Required fields complete:** yes | no
- **Outcome observable:** yes | no
- **Result:** pass | needs-information
- **Rationale:**

## 2. VERIFY — Claims & Evidence

### Claims ledger

| Claim ID | Claim | Type | Evidence IDs | Status/rationale |
|---|---|---|---|---|
| C1 |  | VERIFIED_FACT \| INFERENCE \| UNVERIFIED_CLAIM |  |  |

### Evidence

| Evidence ID | Type | Source/path | Accessed/tested | Supports | Limits |
|---|---|---|---|---|---|
| E1 | DIRECT_TEST \| OFFICIAL_DOC \| OFFICIAL_PRODUCT_UI \| CREDIBLE_SECONDARY \| COMMUNITY_REPORT \| MARKETING_DEMO \| INTERNAL_ASSET |  | YYYY-MM-DD | C1 |  |

### Verification checklist

- **Capability exists:** yes | no | unknown
- **Feature current:** yes | no | unknown
- **FREE/BASIC tier verified:** yes | no | partial
- **Important limits captured:** yes | no
- **Staleness risk:** low | medium | high
- **Recheck trigger/date:**
- **Verification status:** VERIFIED | PARTIALLY_VERIFIED | UNVERIFIED | REJECTED
- **Unresolved items:**

## 3. SCORE — Breakdown

| Criterion | Weight | Score 1–5 | Weighted points | Rationale/evidence |
|---|---:|---:|---:|---|
| Utility | 20 |  |  |  |
| Clarity of outcome | 10 |  |  |  |
| Ease of execution | 10 |  |  |  |
| Cost accessibility | 10 |  |  |  |
| Novelty | 5 |  |  |  |
| Broad relevance | 10 |  |  |  |
| Reliability/confidence | 15 |  |  |  |
| Reproducibility | 10 |  |  |  |
| Time-to-value | 10 |  |  |  |
| **TOTAL** | **100** |  | **/100** |  |

## 4. TESTABILITY — Test Gate

- **Testability rationale:**
- **Prerequisites:**
- **Estimated time:**
- **Paid/API/technical requirements:**
- **Test steps:**
  1.
- **Expected observable result:**
- **Pass criteria:**
- **Fail criteria:**
- **Testability status:** NOT_ASSESSED | TESTABLE | NOT_TESTABLE
- **Test execution status:** NOT_RUN | COMPLETED | BLOCKED
- **Actual test date:**
- **Actual result/evidence:**
- **Test result:** NOT_AVAILABLE | PASSED | FAILED
- **Blocker/next action:**

`PASSED/FAILED` chỉ hợp lệ khi execution là `COMPLETED` và có actual evidence. `NOT_RUN/BLOCKED` phải giữ result là `NOT_AVAILABLE`.

## 5. SELECT — Decision

- **Score threshold:** pass | fail
- **Verification hard gate:** pass | fail
- **Test hard gate:** pass | fail — chỉ pass với `TESTABLE` + `COMPLETED` + `PASSED`
- **Reliability/reproducibility gate:** pass | fail
- **Duplicate check:** pass | fail | existing-content-audit
- **Decision:** recommend | hold | reject
- **Rationale:**
- **Next evidence/action if hold:**

## 6. TEACH — Teaching Brief

_Chỉ điền nếu `decision: recommend`. Đây chưa phải script._

- **Hook/value proposition:**
- **Viewer problem:**
- **What the tip does:**
- **Minimal steps:**
  1.
- **Expected result:**
- **Conditions/limits/warnings:**
- **Proof/evidence to show:**
- **Why worth learning:**
- **CTA/next action:**

## 7. OPERATOR COMPATIBILITY APPROVAL & HANDOFF

- **Legacy human_decision:** pending | approved | rejected | needs-changes | not-applicable
- **Approval basis/reference:** delegated ChatGPT operator; this is not Content Approval
- **Decision date:**
- **Notes:**
- **Assigned Content ID:**
- **Handoff file:**

Candidate production mặc định `pending`. Chỉ `approved` mới được cấp `CKAI-*` và handoff; `recommend + pending` vẫn bị chặn. `not-applicable` chỉ dành cho fixture, migration hoặc reverse-audit content đã tồn tại.
