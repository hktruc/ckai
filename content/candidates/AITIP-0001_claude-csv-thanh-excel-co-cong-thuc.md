---
id: AITIP-0001
type: ai-tip-candidate
stage: scored
verification_status: VERIFIED
testability_status: TESTABLE
test_execution_status: BLOCKED
test_result: NOT_AVAILABLE
decision: hold
human_decision: pending
score_total: 94
discovered_at: 2026-08-24
updated_at: 2026-08-24
content_id:
---

# AI Tip Candidate — AITIP-0001

## 1. DISCOVER — Raw Candidate

- **Title:** Biến CSV lộn xộn thành file Excel có công thức và biểu đồ bằng Claude
- **Core idea:** Upload một CSV không nhạy cảm, mô tả workbook cần nhận; Claude tạo file `.xlsx` tải xuống thay vì chỉ trả bảng text.
- **Target user:** Người đi làm thường nhận CSV/export nhưng không giỏi Excel.
- **Problem:** Làm sạch cột, viết công thức, tổng hợp và dựng chart thủ công tốn thời gian.
- **Expected outcome:** Một workbook mở được, giữ dữ liệu nguồn, có sheet tổng hợp, công thức kiểm tra được và chart đúng dữ liệu.
- **Tool/product involved:** Claude — Code execution and file creation.
- **Initial source/evidence:** Anthropic Help Center, cập nhật hiện hành.
- **Discovered at:** 2026-08-24
- **Cost assumption:** FREE tier có capability; dùng chung usage limit của plan.
- **Setup complexity:** low
- **Why it may be useful:** Outcome là deliverable thật, giải quyết công việc phổ biến và có before/after rất rõ.

### DISCOVER gate

- **Required fields complete:** yes
- **Outcome observable:** yes
- **Result:** pass
- **Rationale:** File, formula totals và chart đều có tiêu chí kiểm tra trực tiếp.

## 2. VERIFY — Claims & Evidence

### Claims ledger

| Claim ID | Claim | Type | Evidence IDs | Status/rationale |
|---|---|---|---|---|
| C1 | Claude có thể tạo file Excel `.xlsx`, gồm formula/chart, từ dữ liệu và chỉ dẫn bằng ngôn ngữ tự nhiên. | VERIFIED_FACT | E1 | Official help mô tả trực tiếp file creation, spreadsheet, formula và chart. |
| C2 | Capability có trên Free, Pro, Max, Team và Enterprise; Free dùng chung usage limit. | VERIFIED_FACT | E1 | Official availability và FAQ nêu rõ plan coverage/usage behavior. |
| C3 | File tạo ra luôn đúng và sẵn sàng dùng mà không cần review. | UNVERIFIED_CLAIM | E1 | Source yêu cầu review/refine; claim này bị loại khỏi teaching angle. |

### Evidence

| Evidence ID | Type | Source/path | Accessed/tested | Supports | Limits |
|---|---|---|---|---|---|
| E1 | OFFICIAL_DOC | [Create and edit files with Claude](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude) | 2026-08-24 | C1, C2 | File tối đa 30MB; capability phải bật; file creation tiêu hao usage nhiều hơn chat thường; network access có privacy/security risk. |
| E2 | DIRECT_TEST | [Prepared manual direct-test package](../../data/fixtures/AITIP-0001_MANUAL_TEST.md) | BLOCKED 2026-08-24 | C1 reproducibility | Deterministic fixture, ground truth, prompt and validator are ready. No Claude request was sent and no returned workbook exists yet. |

### Verification checklist

- **Capability exists:** yes
- **Feature current:** yes
- **FREE/BASIC tier verified:** yes
- **Important limits captured:** yes
- **Staleness risk:** medium
- **Recheck trigger/date:** Before scripting or 2026-09-24; recheck plan coverage, toggle path and file limit.
- **Verification status:** VERIFIED
- **Unresolved items:** Direct output quality/reproducibility has not been tested in the available environment.

## 3. SCORE — Breakdown

| Criterion | Weight | Score 1–5 | Weighted points | Rationale/evidence |
|---|---:|---:|---:|---|
| Utility | 20 | 5 | 20 | Replaces common CSV cleanup/workbook assembly work. |
| Clarity of outcome | 10 | 5 | 10 | Downloadable workbook, formulas and chart are inspectable. |
| Ease of execution | 10 | 4 | 8 | Upload + one scoped prompt; still needs output review. |
| Cost accessibility | 10 | 5 | 10 | Capability is officially available on Free. |
| Novelty | 5 | 5 | 5 | “AI returns a working file” is stronger than ordinary chat output. |
| Broad relevance | 10 | 5 | 10 | Useful across operations, sales, finance, education and creators. |
| Reliability/confidence | 15 | 5 | 15 | Current official documentation directly supports critical capability/tier claims. |
| Reproducibility | 10 | 4 | 8 | Input/output contract is clear, but actual quality still needs direct test. |
| Time-to-value | 10 | 4 | 8 | Expected within 10 minutes for a small synthetic CSV. |
| **TOTAL** | **100** |  | **94/100** | Score does not override blocked test gate. |

## 4. TESTABILITY — Test Gate

- **Testability rationale:** Small synthetic CSV permits exact totals/formulas/chart checks without exposing private data.
- **Prerequisites:** Signed-in Claude account; Code execution and file creation enabled; synthetic CSV under 30MB.
- **Estimated time:** 7–10 minutes
- **Paid/API/technical requirements:** No paid plan or API required per official docs; consumes normal Claude usage.
- **Test steps:**
  1. Upload only [AITIP-0001_sales.csv](../../data/fixtures/AITIP-0001_sales.csv) in a new signed-in Claude chat.
  2. Paste [AITIP-0001_claude-prompt.txt](../../data/fixtures/AITIP-0001_claude-prompt.txt) unchanged and submit once.
  3. Download the untouched returned workbook to generated/candidates/AITIP-0001/AITIP-0001_claude-output.xlsx.
  4. Record account/tier, start/end time, first-response success and any exact correction prompt.
  5. Run python scripts/validate-aitip-0001-xlsx.py and retain its report with the manual-run metadata.
- **Expected observable result:** Valid workbook whose 12 calculated row revenues total 3800, whose region totals are North 1070, Central 1170, South 1560, and whose chart uses that region-summary range.
- **Pass criteria:** File opens; 12/12 rows are preserved in order; every Revenue cell is a real Units × Unit Price formula; total/region formulas reference Raw Data and logically yield the fixed ground truth; a column/bar chart references the Summary region table; validator PASS plus complete manual-run metadata.
- **Fail criteria:** No file, corrupt workbook, missing rows, hard-coded/incorrect totals, missing or unrelated chart.
- **Testability status:** TESTABLE
- **Test execution status:** BLOCKED
- **Actual test date:** NOT RUN
- **Actual result/evidence:** No provider request or output. Browser runtime was blocked before product interaction.
- **Test result:** NOT_AVAILABLE
- **Pilot activity:** PAUSED — Product Owner decision; prepared manual test is preserved but is not the active production-pilot next action.
- **Blocker/next action:** No active test action. Preserve the package and wait for Product Owner + ChatGPT explicit editorial prioritization before any Claude UI test.

### Prepared manual direct-test package

- **Fixture:** [data/fixtures/AITIP-0001_sales.csv](../../data/fixtures/AITIP-0001_sales.csv)
- **Exact one-shot prompt:** [data/fixtures/AITIP-0001_claude-prompt.txt](../../data/fixtures/AITIP-0001_claude-prompt.txt)
- **Ground truth:** [data/fixtures/AITIP-0001_expected.json](../../data/fixtures/AITIP-0001_expected.json)
- **Validator:** [scripts/validate-aitip-0001-xlsx.py](../../scripts/validate-aitip-0001-xlsx.py)
- **Required returned-file path:** generated/candidates/AITIP-0001/AITIP-0001_claude-output.xlsx
- **Preparation proof:** Package preflight PASS for 12 rows, 35 units and total revenue 3800; returned workbook remains NOT_EXECUTED.
## 5. SELECT — Decision

- **Score threshold:** pass
- **Verification hard gate:** pass
- **Test hard gate:** fail — `BLOCKED + NOT_AVAILABLE`
- **Reliability/reproducibility gate:** pass
- **Duplicate check:** pass — only a generic non-production example mentions Claude reading Excel; no matching Big Idea/outcome exists.
- **Decision:** hold
- **Rationale:** Strongest value/outcome candidate, but canonical STEP 01 forbids recommendation before a completed PASS test.
- **Next evidence/action if hold:** PAUSED. Do not run the prepared manual test unless Product Owner + ChatGPT explicitly reactivate this candidate.

### Pilot-only production suitability

- **Rating:** 5/5 — very strong
- **Visual transformation:** Messy rows → structured workbook → formulas calculate → chart appears.
- **Truthful proof path:** Show sanitized fixture, exact prompt excerpt, formula cells, known total and chart.
- **Provider-UI dependency:** Medium; proof can emphasize input/output artifact rather than reproducing live UI.
- **Under-60s fit:** Strong.
- **Risk:** Never upload sensitive company data casually; AI-generated formulas and conclusions require review.

## 6. TEACH — Teaching Brief

NOT CREATED — `decision: hold`; test hard gate has not passed.

## 7. LEGACY DELEGATED-OPERATOR DECISION & HANDOFF

- **Legacy delegated-operator decision:** pending
- **Decision date:**
- **Notes:** Candidate has no production authority while test is blocked.
- **Assigned Content ID:**
- **Handoff file:**
