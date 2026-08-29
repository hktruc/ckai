---
id: TEST-0002
type: short-form-script-proof
content_stream: tuyet-chieu-ai
input_eligibility: legacy-approved-reverse-audit
format: vertical-9x16
status: review
editorial_review: pass
human_decision: not-applicable
storyboard_handoff_status: BLOCKED
pillar: ai-human
topic: don-tai-lieu-thanh-markdown
angle: mot-prompt-don-sach
structure: practical-tool-walkthrough
objective: education
duration_target: 50
estimated_duration_seconds: 48
spoken_unit_count: 134
pacing_spoken_units_per_minute: 170
pause_budget_seconds: 1
duration_check: PASS
claim_evidence_check: PASS
source_idea: CKAI-0002 legacy approved content
source_candidate: AITIP-TEST-0001
created: 2026-08-23
updated: 2026-08-23
---

# Script Contract Proof — TEST-0002

_Reverse-audit của CKAI-0002 và AITIP-TEST-0001. Đây là fixture, không phải content production mới; `not-applicable` không thay thế Content Approval và fixture luôn bị chặn trước Storyboard._

## 1. EDITORIAL BRIEF

- **Working title:** Dọn text lộn xộn thành Markdown sạch.
- **Content stream:** `tuyet-chieu-ai` — HOW/practical.
- **Format:** `vertical-9x16`.
- **Core promise/takeaway:** Giao phần cleanup định dạng cho AI, rồi đối chiếu output trước khi lưu.
- **Target audience:** Người làm tri thức/creator thường copy text từ PDF hoặc web vào hệ thống ghi chú.
- **Primary objective:** `education`.
- **Structure + rationale:** `practical-tool-walkthrough`; outcome và thao tác là giá trị chính, không cần ép thành insight narrative.
- **Source/upstream references:** [`../candidates/AITIP-TEST-0001_prompt-don-markdown.md`](../candidates/AITIP-TEST-0001_prompt-don-markdown.md), [`../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md`](../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md).
- **Unresolved input issues:** Không dùng claim portability/FREE tier chưa verified.

## 2. HOOK

- **Hook A:** “Bạn copy text từ PDF vào ghi chú, rồi mất thời gian dọn số trang, footer và xuống dòng?” — Stop 4 | Curiosity 3 | Relevance 5 | Credibility 5 | Brand Fit 5 → 4.3/5.
- **Hook B:** “Phần dọn định dạng này, bạn không cần làm tay từng dòng.” — Stop 4 | Curiosity 4 | Relevance 5 | Credibility 4 | Brand Fit 5 → 4.35/5.
- **Hook C:** “Một đoạn text lộn xộn có thể thành Markdown sạch — nếu bạn giao đúng phần việc cho AI.” — Stop 4 | Curiosity 4 | Relevance 5 | Credibility 4 | Brand Fit 5 → 4.35/5.
- **Selected hook:** A.
- **Promise alignment:** pass — body hướng dẫn đúng cleanup và không hứa fidelity tuyệt đối.

## 3. NARRATIVE BEATS

| Beat ID | Function | Editorial point |
|---|---|---|
| B1 | Hook/problem | Nêu đúng friction khi copy text. |
| B2 | Move | Giao riêng cleanup định dạng cho AI. |
| B3 | Steps | Prompt có scope và constraint rõ. |
| B4 | Result/proof | Đối chiếu bốn tiêu chí thay vì tin output. |
| B5 | Caveat/end | Giữ giới hạn test và ranh giới judgment. |

## 4. SPOKEN COPY

[B1 — HOOK/PROBLEM]

Bạn copy text từ PDF vào ghi chú, rồi mất thời gian dọn số trang, footer và xuống dòng?

[B2 — MOVE]

Thử giao riêng phần định dạng cho AI.

[B3 — STEPS]

Dán đoạn text vào AI chat bạn đang dùng, rồi thêm yêu cầu này:

“Chuyển đoạn text thành Markdown sạch. Giữ nguyên nội dung. Đổi tiêu đề và danh sách đúng định dạng. Xóa số trang, header, footer và ký tự thừa.”

[pause]

[B4 — RESULT/PROOF]

Khi AI trả kết quả, đừng copy ngay. So lại bốn điểm: tiêu đề, danh sách, phần rác đã bị xóa, và nội dung có thiếu hay thừa không.

[B5 — CAVEAT/END]

Test hiện tại chỉ dùng một mẫu ngắn, nên tài liệu dài, bảng hoặc OCR vẫn cần kiểm tra riêng.

AI có thể dọn định dạng. Còn nội dung nào đáng giữ, mình vẫn phải quyết.

## 5. CLAIM & EVIDENCE LEDGER

| Script claim ID | Claim used in hook/copy | Upstream claim/evidence | Required caveat | Status |
|---|---|---|---|---|
| S1 | AI trong phạm vi test có thể cleanup sample text theo prompt. | AITIP C1 → E2 `DIRECT_TEST` | Không generalize sang mọi provider/document. | SUPPORTED |
| S2 | Người dùng nên đối chiếu heading/list/rác/thiếu-thừa. | AITIP E2 pass criteria | Không mô tả output là luôn chính xác. | SUPPORTED |
| S3 | Test chỉ chứng minh sample ngắn, không chứng minh OCR/bảng/document dài. | AITIP E2 limits | Phải giữ trong spoken copy. | SUPPORTED |
| S4 | Workflow miễn phí hoặc dùng được với mọi AI. | AITIP C3/C4 `UNVERIFIED_CLAIM` | Không dùng trong hook/copy. | EXCLUDED |

- **Claim/evidence check:** PASS — claim chưa verified bị loại, caveat decision-critical được giữ.

## 6. DURATION CHECK

- **Spoken unit count:** 134 — đếm theo whitespace-delimited segment có ít nhất một Unicode letter/digit; không dùng tokenizer.
- **Pacing:** 170 spoken units/phút.
- **Pause budget:** 1 `[pause]` × 1 giây = 1 giây.
- **Formula:** round((134 spoken units / 170 spoken units per minute) × 60 + 1 second).
- **Estimated duration:** 48 seconds.
- **Target duration:** 50 seconds.
- **Duration check:** PASS — dưới approval ceiling 55 giây, còn breathing room trước hard limit 60 giây.
- **Revision if over budget:** Không áp dụng.

## 7. ENDING / CTA

- **Ending type:** takeaway.
- **Spoken ending:** “AI có thể dọn định dạng. Còn nội dung nào đáng giữ, mình vẫn phải quyết.”

## 8. EDITORIAL HANDOFF REQUIREMENTS

- **Proof that must remain:** Before/after hoặc kết quả thể hiện đủ bốn pass criteria từ E2.
- **Critical on-screen facts/text:** Prompt nguyên văn nếu future Storyboard cần người xem đọc/copy.
- **Caveats that must remain:** Test sample ngắn; chưa chứng minh mọi provider, OCR, bảng hoặc tài liệu dài.
- **Content stream:** `tuyet-chieu-ai`.

_Không có scene, shot, animation, transition hoặc asset plan trong fixture này._

## 9. REVIEW & APPROVAL

- **Editorial review:** pass — practical value xuất hiện sớm; claim/evidence và duration đều đạt.
- **Editorial notes:** Reverse-audit output contract, không thay thế review production.
- **Legacy Content Approval field:** `not-applicable` — fixture dựa trên content legacy đã tồn tại.
- **Human notes:** `not-applicable` không phải approval.
- **Unresolved issues:** none cho proof; portability/FREE tier bị loại khỏi script.
- **Storyboard handoff:** `BLOCKED` — mọi fixture luôn bị chặn, dù editorial review pass.

