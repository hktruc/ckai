# content/candidates/

## Operator UX

Internal machinery. ChatGPT handles candidates/evidence/scores and may record delegated STEP 01 authorization after hard gates PASS. Product Owner sees market-facing content later, not candidate state.

Pre-content lifecycle cho dòng **Tuyệt chiêu AI**:

```text
DISCOVER → VERIFY → SCORE → TESTABILITY → SELECT → TEACH → CHATGPT OPERATOR HANDOFF
```

Candidate chưa phải content production và chưa có `CKAI-*`.

## File convention

- Production candidate: `AITIP-000N_slug.md`.
- Smoke/example: `AITIP-TEST-000N_slug.md`.
- Template: [`TEMPLATE.md`](TEMPLATE.md).
- Mỗi candidate dùng **một file duy nhất**, nhưng tách section rõ cho raw candidate, evidence/verification, scoring, testability, selection và teaching brief.

Không tách sáu stage thành sáu folder/file ở STEP 01: một candidate là một hồ sơ cần đọc trọn vẹn, và repo chưa có volume đủ lớn để biện minh cho kiến trúc phức tạp hơn.

## Quy tắc ID

- ID candidate độc lập với Content ID.
- ID tiếp theo = số lớn nhất trong filename `AITIP-*.md` + 1; bỏ qua `AITIP-TEST-*`.
- Candidate chỉ nhận `CKAI-*` sau khi mọi hard gate PASS và ChatGPT delegated operator handoff sang `content/ideas/`; direct Product Owner Content Approval diễn ra ở STEP 02.
- Không ghi candidate vào `data/content-index.csv` trước handoff.

## Contract bắt buộc

- Testability, test execution và test result là ba trạng thái độc lập theo engine; testable nhưng chưa chạy test phải giữ `NOT_RUN` + `NOT_AVAILABLE`, không được coi là `PASSED`.
- Candidate production luôn bắt đầu với `human_decision: pending`. `decision: recommend` không mở STEP 02 handoff; chỉ legacy `human_decision: approved` có delegated operator basis mới được cấp `CKAI-*` và đi vào `content/ideas/`.
- `human_decision: not-applicable` chỉ dành cho fixture, migration hoặc reverse-audit content đã tồn tại, không phải default production.

## Operating authority

- Codex collect/structure evidence, persist candidate state và validate hard gates.
- ChatGPT là Content Intelligence/editorial authority cho analysis, selection recommendation và Teaching Brief judgment.
- ChatGPT delegated operator handoff là final STEP 01 operator gate trước khi cấp CKAI-*; đây không phải Product Owner Content Approval.
- System/technical evidence gate, ChatGPT recommendation và delegated operator handoff là các state độc lập; không state nào override factual/technical failure.

## Source of truth

- Logic/gates: [`../../engine/ai-tips-intelligence.md`](../../engine/ai-tips-intelligence.md).
- Hồ sơ cụ thể: file candidate trong thư mục này.
- Sau handoff, content lifecycle tiếp tục theo [`../../PROJECT.md`](../../PROJECT.md) §15–§21.

## Example

[`AITIP-TEST-0001_prompt-don-markdown.md`](AITIP-TEST-0001_prompt-don-markdown.md) audit ngược tip đã có ở `CKAI-0002`. Đây là example/smoke data, không tạo content mới và không được tính production.
