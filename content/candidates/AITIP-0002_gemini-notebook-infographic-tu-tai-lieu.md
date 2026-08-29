---
id: AITIP-0002
type: ai-tip-candidate
stage: scored
verification_status: VERIFIED
testability_status: TESTABLE
test_execution_status: BLOCKED
test_result: NOT_AVAILABLE
decision: hold
human_decision: pending
score_total: 90
discovered_at: 2026-08-24
updated_at: 2026-08-24
content_id:
---

# AI Tip Candidate — AITIP-0002

## 1. DISCOVER — Raw Candidate

- **Title:** Biến một tài liệu dài thành infographic dọc bằng Gemini Notebook
- **Core idea:** Thêm nguồn vào Gemini Notebook (tên mới của NotebookLM), chọn Infographic, đặt tiếng Việt + portrait + concise để nhận một visual summary tải xuống dạng PNG.
- **Target user:** Người đi làm, giáo viên, creator hoặc người học cần tóm ý để chia sẻ/ôn tập.
- **Problem:** Tài liệu dài khó đọc nhanh; tự chọn ý và bố cục infographic mất thời gian.
- **Expected outcome:** Một PNG portrait tóm tắt các ý chính từ source, có thể đối chiếu lại với nguồn.
- **Tool/product involved:** Google Gemini Notebook — Infographic.
- **Initial source/evidence:** Google Gemini Notebook Help và plan limits.
- **Discovered at:** 2026-08-24
- **Cost assumption:** Standard đăng ký miễn phí bằng Gmail; Infographic có limited quota.
- **Setup complexity:** low
- **Why it may be useful:** Input/output rõ, không cần prompt dài, visual transformation mạnh nhưng vẫn source-grounded.

### DISCOVER gate

- **Required fields complete:** yes
- **Outcome observable:** yes
- **Result:** pass
- **Rationale:** PNG, orientation, content coverage và factual match có thể kiểm tra.

## 2. VERIFY — Claims & Evidence

### Claims ledger

| Claim ID | Claim | Type | Evidence IDs | Status/rationale |
|---|---|---|---|---|
| C1 | Gemini Notebook tạo infographic từ notebook sources và cho chọn language/detail/orientation/style. | VERIFIED_FACT | E1 | Official help nêu trực tiếp workflow/options. |
| C2 | Standard có thể đăng ký miễn phí và có Infographic ở limited quota. | VERIFIED_FACT | E2 | Official plan table nêu free signup và limited Infographics. |
| C3 | Infographic phản ánh nguồn hoàn toàn chính xác. | UNVERIFIED_CLAIM | E1 | Google cảnh báo visual/factual inaccuracies; bắt buộc review. |
| C4 | Output ở Việt Nam có thể có visible watermark. | VERIFIED_FACT | E2 | Official plan help nêu watermark tự động tại Vietnam. |

### Evidence

| Evidence ID | Type | Source/path | Accessed/tested | Supports | Limits |
|---|---|---|---|---|---|
| E1 | OFFICIAL_DOC | [Generate an Infographic in Gemini Notebook](https://support.google.com/gemininotebook/answer/16758265?hl=en) | 2026-08-24 | C1, C3 | 18+; edit access; takes a couple minutes; output may have visual/factual errors. |
| E2 | OFFICIAL_DOC | [Upgrade Gemini Notebook](https://support.google.com/gemininotebook/answer/16213268?hl=en) | 2026-08-24 | C2, C4 | Standard quota is described only as “Limited”; limits can change; region/account rules apply. |
| E3 | DIRECT_TEST | Planned browser test below | BLOCKED 2026-08-24 | C1 reproducibility | Browser runtime failed before sign-in/source upload; no generation/quota was consumed. |

### Verification checklist

- **Capability exists:** yes
- **Feature current:** yes
- **FREE/BASIC tier verified:** yes
- **Important limits captured:** yes
- **Staleness risk:** medium
- **Recheck trigger/date:** Before scripting or 2026-09-24; recheck name, Standard quota, watermark and Vietnam availability.
- **Verification status:** VERIFIED
- **Unresolved items:** Vietnamese typography, factual fidelity and generation consistency need direct test.

## 3. SCORE — Breakdown

| Criterion | Weight | Score 1–5 | Weighted points | Rationale/evidence |
|---|---:|---:|---:|---|
| Utility | 20 | 5 | 20 | Compresses long source into a shareable/learnable visual. |
| Clarity of outcome | 10 | 5 | 10 | Downloadable PNG and source match are visible. |
| Ease of execution | 10 | 4 | 8 | Source upload plus one Studio action/customization. |
| Cost accessibility | 10 | 5 | 10 | Standard is free signup; quota is limited. |
| Novelty | 5 | 5 | 5 | Current source-to-infographic artifact is a strong discovery moment. |
| Broad relevance | 10 | 4 | 8 | Useful for learning, work communication and creators. |
| Reliability/confidence | 15 | 5 | 15 | Capability/tier/limitations have current official evidence. |
| Reproducibility | 10 | 3 | 6 | Generative layout/text accuracy may vary; no direct test yet. |
| Time-to-value | 10 | 4 | 8 | Officially takes a couple minutes; expected under 10 minutes. |
| **TOTAL** | **100** |  | **90/100** | Score does not override blocked test gate. |

## 4. TESTABILITY — Test Gate

- **Testability rationale:** A short public-domain Vietnamese source with a known fact checklist supports objective content and typography checks.
- **Prerequisites:** Signed-in supported Google/Gmail account; age 18+; edit access; remaining Standard Infographic quota.
- **Estimated time:** 6–10 minutes
- **Paid/API/technical requirements:** No paid plan/API required for Standard, but quota is limited and provider-controlled.
- **Test steps:**
  1. Create a notebook using a short non-sensitive Vietnamese source containing five known points.
  2. Generate Infographic with Vietnamese, portrait, concise, professional style.
  3. Download PNG.
  4. Verify five facts, Vietnamese text readability, portrait orientation, watermark and any hallucinated claim.
- **Expected observable result:** Readable portrait PNG summarizing the source without material false claim.
- **Pass criteria:** PNG downloads/opens; at least 4/5 key points preserved; no contradictory/invented fact; Vietnamese text materially readable; orientation is portrait.
- **Fail criteria:** Generation unavailable, unreadable text, material factual error, source-independent claim or wrong orientation.
- **Testability status:** TESTABLE
- **Test execution status:** BLOCKED
- **Actual test date:** NOT RUN
- **Actual result/evidence:** No Google request or quota consumption. Browser runtime was blocked before product interaction.
- **Test result:** NOT_AVAILABLE
- **Blocker/next action:** Run in a working signed-in Gemini Notebook session and retain source, PNG and five-point audit.

## 5. SELECT — Decision

- **Score threshold:** pass
- **Verification hard gate:** pass
- **Test hard gate:** fail — `BLOCKED + NOT_AVAILABLE`
- **Reliability/reproducibility gate:** pass
- **Duplicate check:** pass
- **Decision:** hold
- **Rationale:** High-value, highly visual candidate; direct factual/readability test is mandatory because Google explicitly warns of inaccuracies.
- **Next evidence/action if hold:** Complete the five-point source → PNG audit.

### Pilot-only production suitability

- **Rating:** 5/5 — very strong
- **Visual transformation:** Dense source → generation progress → portrait infographic → fact callouts.
- **Truthful proof path:** Show exact source checklist beside downloaded PNG; explicitly mark watermark and any corrected error.
- **Provider-UI dependency:** Medium; proof can use source + downloaded artifact rather than mimic provider UI.
- **Under-60s fit:** Strong.
- **Risk:** Attractive design can make a factual error look authoritative; source verification remains human work.

## 6. TEACH — Teaching Brief

NOT CREATED — `decision: hold`; test hard gate has not passed.

## 7. LEGACY DELEGATED-OPERATOR DECISION & HANDOFF

- **Legacy delegated-operator decision:** pending
- **Decision date:**
- **Notes:** Candidate has no production authority while test is blocked.
- **Assigned Content ID:**
- **Handoff file:**
