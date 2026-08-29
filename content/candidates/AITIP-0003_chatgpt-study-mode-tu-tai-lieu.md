---
id: AITIP-0003
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

# AI Tip Candidate — AITIP-0003

## 1. DISCOVER — Raw Candidate

- **Title:** Dùng ChatGPT Study Mode để học bằng câu hỏi thay vì xin bản tóm tắt
- **Core idea:** Mở Study Mode, đưa một trang ghi chú/tài liệu vào và yêu cầu AI hỏi từng câu, cho hint trước khi giải thích đáp án.
- **Target user:** Người tự học, sinh viên, giáo viên và người đi làm cần ôn một chủ đề.
- **Problem:** Đọc tóm tắt tạo cảm giác “đã hiểu” nhưng không kiểm tra khả năng nhớ và giải thích.
- **Expected outcome:** Một chuỗi câu hỏi bám tài liệu, có hint/feedback và buộc người học chủ động trả lời.
- **Tool/product involved:** ChatGPT Study Mode.
- **Initial source/evidence:** OpenAI Help Center.
- **Discovered at:** 2026-08-24
- **Cost assumption:** Có trên mọi ChatGPT plan; chịu message/model/upload limits của plan hiện tại.
- **Setup complexity:** low
- **Why it may be useful:** Chỉ đổi mode và cách yêu cầu nhưng thay đổi hành vi từ nhận đáp án sang luyện retrieval/understanding.

### DISCOVER gate

- **Required fields complete:** yes
- **Outcome observable:** yes
- **Result:** pass
- **Rationale:** Có thể đếm câu hỏi, kiểm tra source coverage, hint-before-answer và feedback behavior.

## 2. VERIFY — Claims & Evidence

### Claims ledger

| Claim ID | Claim | Type | Evidence IDs | Status/rationale |
|---|---|---|---|---|
| C1 | Study Mode có thể hỏi câu hỏi, hướng dẫn từng bước, kiểm tra hiểu biết và tạo quiz/practice questions. | VERIFIED_FACT | E1 | Official help mô tả trực tiếp. |
| C2 | Study Mode có trên mọi ChatGPT plan toàn cầu ở web/iOS/Android. | VERIFIED_FACT | E1 | Official availability/FAQ. |
| C3 | Study Mode dùng được file/image khi upload có trên chat hiện tại. | VERIFIED_FACT | E1 | Official FAQ, nhưng upload limit phụ thuộc plan/chat. |
| C4 | Study Mode luôn dùng Socratic flow và không bao giờ cho đáp án thẳng. | UNVERIFIED_CLAIM | E1 | Official limitation nói đôi khi vẫn trả lời trực tiếp. |

### Evidence

| Evidence ID | Type | Source/path | Accessed/tested | Supports | Limits |
|---|---|---|---|---|---|
| E1 | OFFICIAL_DOC | [Using Study Mode in ChatGPT](https://help.openai.com/en/articles/11780217-study-mode) | 2026-08-24 | C1–C4 | Có thể sai; file/image uploads và tools phụ thuộc plan/chat; không có trong Temporary Chat, GPT hoặc Project conversation; vẫn chịu rate limits. |
| E2 | DIRECT_TEST | Planned browser test below | BLOCKED 2026-08-24 | C1 reproducibility | Browser runtime failed before ChatGPT navigation/prompt. No external message was sent. |

### Verification checklist

- **Capability exists:** yes
- **Feature current:** yes
- **FREE/BASIC tier verified:** yes
- **Important limits captured:** yes
- **Staleness risk:** low
- **Recheck trigger/date:** Before scripting or 2026-09-24; recheck entry path and conversation restrictions.
- **Verification status:** VERIFIED
- **Unresolved items:** Need direct test of Vietnamese question quality and adherence to “hint before answer.”

## 3. SCORE — Breakdown

| Criterion | Weight | Score 1–5 | Weighted points | Rationale/evidence |
|---|---:|---:|---:|---|
| Utility | 20 | 4 | 16 | Improves active study behavior, though not every task needs tutoring. |
| Clarity of outcome | 10 | 4 | 8 | Questions/hints/feedback are visible; learning gain itself is not proven in one test. |
| Ease of execution | 10 | 5 | 10 | Open mode, add material, state desired tutoring behavior. |
| Cost accessibility | 10 | 5 | 10 | Officially across all plans. |
| Novelty | 5 | 3 | 3 | Mode is known, but “quiz me before explaining” remains underused. |
| Broad relevance | 10 | 5 | 10 | Applies to school, professional learning and self-study. |
| Reliability/confidence | 15 | 5 | 15 | Current official docs cover capability, access and caveats. |
| Reproducibility | 10 | 4 | 8 | Flow is promptable, but model may still answer directly. |
| Time-to-value | 10 | 5 | 10 | First useful question should appear within minutes. |
| **TOTAL** | **100** |  | **90/100** | Score does not override blocked test gate. |

## 4. TESTABILITY — Test Gate

- **Testability rationale:** A short five-fact Vietnamese note supports an observable five-question tutoring flow.
- **Prerequisites:** Signed-in ChatGPT regular conversation with Study Mode; paste text if file upload is unavailable.
- **Estimated time:** 5–8 minutes
- **Paid/API/technical requirements:** No paid plan/API; normal plan rate/upload limits apply.
- **Test steps:**
  1. Open a new regular Study Mode conversation.
  2. Paste a short Vietnamese note containing five known concepts.
  3. Ask: one question at a time, hint before explanation, do not reveal answer until an attempt.
  4. Intentionally answer one question incorrectly and inspect feedback/source adherence.
- **Expected observable result:** Questions grounded in the note, one-at-a-time pacing, hint before answer and corrective feedback.
- **Pass criteria:** At least four grounded questions; no invented core fact; first answer is withheld until an attempt; incorrect response receives useful correction.
- **Fail criteria:** Generic questions unrelated to note, immediate answer dump despite instruction, material fabricated fact or no corrective feedback.
- **Testability status:** TESTABLE
- **Test execution status:** BLOCKED
- **Actual test date:** NOT RUN
- **Actual result/evidence:** No ChatGPT product interaction; browser runtime failed before navigation.
- **Test result:** NOT_AVAILABLE
- **Blocker/next action:** Run in a working signed-in ChatGPT browser session and preserve the compact transcript as evidence.

## 5. SELECT — Decision

- **Score threshold:** pass
- **Verification hard gate:** pass
- **Test hard gate:** fail — `BLOCKED + NOT_AVAILABLE`
- **Reliability/reproducibility gate:** pass
- **Duplicate check:** pass
- **Decision:** hold
- **Rationale:** Broad, free and useful, but the specific Vietnamese tutoring behavior must be observed before recommendation.
- **Next evidence/action if hold:** Complete and preserve the five-concept tutoring transcript.

### Pilot-only production suitability

- **Rating:** 4/5 — strong
- **Visual transformation:** Passive summary scroll → question card → learner attempt → hint → feedback loop.
- **Truthful proof path:** Animate only the exact preserved test transcript; label Study Mode limitation.
- **Provider-UI dependency:** Medium-high; conversation flow matters more than a static artifact.
- **Under-60s fit:** Strong.
- **Risk:** Do not imply proven learning improvement from one demo; verify high-stakes content independently.

## 6. TEACH — Teaching Brief

NOT CREATED — `decision: hold`; test hard gate has not passed.

## 7. LEGACY DELEGATED-OPERATOR DECISION & HANDOFF

- **Legacy delegated-operator decision:** pending
- **Decision date:**
- **Notes:** Candidate has no production authority while test is blocked.
- **Assigned Content ID:**
- **Handoff file:**
