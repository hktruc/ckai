---
id: AITIP-TEST-0001
type: ai-tip-candidate
stage: taught
verification_status: PARTIALLY_VERIFIED
testability_status: TESTABLE
test_execution_status: COMPLETED
test_result: PASSED
decision: recommend
human_decision: not-applicable
score_total: 82
discovered_at: 2026-08-23
updated_at: 2026-08-23
content_id: CKAI-0002
---

# AI Tip Candidate Example — Dọn text lộn xộn thành Markdown

_Smoke/example dùng để chứng minh STEP 01. Đây là audit ngược của content đã có [`CKAI-0002`](../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md), không phải candidate production mới và không tạo thêm Content ID._

## 1. DISCOVER — Raw Candidate

- **Title:** Dùng AI chat dọn text lộn xộn thành Markdown sạch.
- **Core idea:** Đưa text có page number/header/footer/list lộn xộn cho một general-purpose LLM, yêu cầu chỉ chuẩn hóa định dạng và không thêm/bớt ý.
- **Target user:** Người làm tri thức, creator hoặc người dùng Obsidian/Markdown phải gom tài liệu từ nhiều nguồn.
- **Problem:** Copy text từ PDF/web thường tạo xuống dòng, header/footer và ký tự thừa; dọn tay chậm và dễ bỏ sót.
- **Expected outcome:** Nhận lại Markdown có heading/list rõ, loại bỏ page number/header/footer đã chỉ định, giữ nguyên nội dung có nghĩa.
- **Tool/product involved:** General-purpose LLM chat có khả năng làm theo hướng dẫn biến đổi text; example chỉ xác minh trong môi trường Codex hiện tại, không khẳng định mọi provider/tier đều giống nhau.
- **Initial source/evidence:** Approved content `CKAI-0002` + direct transformation test trong hồ sơ này.
- **Discovered at:** 2026-08-23 (audit ngược; content gốc tạo 2026-08-21).
- **Cost assumption:** Có thể dùng AI chat người xem đang có; FREE/BASIC availability theo từng provider **chưa được xác minh**.
- **Setup complexity:** low — cần AI chat và một đoạn text mẫu; không API/code.
- **Why it may be useful:** Outcome cụ thể, phổ biến, demo trước/sau dễ hiểu và time-to-value dưới 10 phút.

### DISCOVER gate

- **Required fields complete:** yes
- **Outcome observable:** yes
- **Result:** pass
- **Rationale:** Input, thao tác và output đều cụ thể; không dựa vào lời hứa “tăng năng suất” mơ hồ.

## 2. VERIFY — Claims & Evidence

### Claims ledger

| Claim ID | Claim | Type | Evidence IDs | Status/rationale |
|---|---|---|---|---|
| C1 | LLM trong môi trường test có thể chuyển sample text thành Markdown theo rules đã nêu. | `VERIFIED_FACT` | E2 | Direct test đạt toàn bộ pass criteria. |
| C2 | Workflow có thể hoàn thành dưới 10 phút với một đoạn text ngắn. | `VERIFIED_FACT` | E2 | Test thủ công hoàn thành dưới 2 phút. |
| C3 | Cùng prompt hoạt động tương đương trên Claude, ChatGPT và Gemini. | `UNVERIFIED_CLAIM` | E1 | Approved script cũ nêu ba tool nhưng STEP 01 chưa direct-test từng provider/tier; không dùng claim này trong teaching brief. |
| C4 | FREE/BASIC tier của mọi provider đủ cho workflow. | `UNVERIFIED_CLAIM` |  | Provider-specific tier chưa kiểm tra. |
| C5 | Người dùng vẫn phải quyết định nội dung nào đáng giữ. | `INFERENCE` | E1, E2 | Test xác minh format, không xác minh chất lượng/giá trị nội dung; đây là ranh giới judgment hợp lý. |

### Evidence

| Evidence ID | Type | Source/path | Accessed/tested | Supports | Limits |
|---|---|---|---|---|---|
| E1 | `INTERNAL_ASSET` | [`../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md`](../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md) | 2026-08-23 | Candidate origin, expected workflow, audience | Approved content là provenance/editorial asset, không phải product capability verification. |
| E2 | `DIRECT_TEST` | Input/output bên dưới, chạy trong môi trường Codex hiện tại | 2026-08-23 | C1, C2 | Chỉ chứng minh current model + sample; không chứng minh mọi provider, document dài hoặc OCR. |

### Direct test artifact (E2)

**Instruction**

> Chuyển đoạn text sau thành Markdown sạch. Giữ nguyên nội dung, không thêm hay bớt ý. Tiêu đề chuyển thành dấu thăng. Danh sách chuyển thành gạch đầu dòng. Xóa số trang, header, footer và ký tự thừa.

**Input**

```text
PAGE 2
QUẢN LÝ CÔNG VIỆC
1. Thu thập yêu cầu
2. Ưu tiên việc quan trọng
Footer: Internal handbook
```

**Observed output**

```markdown
# Quản lý công việc

- Thu thập yêu cầu
- Ưu tiên việc quan trọng
```

### Verification checklist

- **Capability exists:** yes — trong current Codex environment cho sample đã test.
- **Feature current:** yes — current environment, test ngày 2026-08-23.
- **FREE/BASIC tier verified:** no — không gắn claim provider-specific.
- **Important limits captured:** yes — sample ngắn, không OCR, không kiểm tra document dài, bảng phức tạp hoặc fidelity tuyệt đối.
- **Staleness risk:** medium — core transformation ổn định, nhưng provider/tier và limits có thể đổi.
- **Recheck trigger/date:** Recheck trước khi teaching brief gọi tên một provider/tier cụ thể hoặc sau 90 ngày.
- **Verification status:** `PARTIALLY_VERIFIED`.
- **Unresolved items:** Portability qua từng provider và FREE/BASIC limits; không ảnh hưởng core teaching brief vì brief giữ provider-agnostic và disclose giới hạn.

## 3. SCORE — Breakdown

| Criterion | Weight | Score 1–5 | Weighted points | Rationale/evidence |
|---|---:|---:|---:|---|
| Utility | 20 | 4 | 16 | Giải quyết thao tác lặp lại thực tế; E1/E2. |
| Clarity of outcome | 10 | 5 | 10 | Before/after nhìn thấy ngay; E2. |
| Ease of execution | 10 | 5 | 10 | Một đoạn text + một instruction; không code/API. |
| Cost accessibility | 10 | 3 | 6 | Có thể dùng chat sẵn có nhưng FREE/BASIC chưa verified theo provider; C4. |
| Novelty | 5 | 2 | 2 | Kỹ thuật không mới với power user, nhưng có thể mới với người dùng phổ thông. |
| Broad relevance | 10 | 4 | 8 | Phù hợp knowledge worker/creator/second-brain user. |
| Reliability/confidence | 15 | 4 | 12 | Direct test pass; trừ điểm vì portability và long-document limits chưa test. |
| Reproducibility | 10 | 4 | 8 | Sample/rules rõ, dễ lặp; output wording có thể khác nhẹ. |
| Time-to-value | 10 | 5 | 10 | Test dưới 2 phút, thấp hơn ưu tiên 10 phút. |
| **TOTAL** | **100** |  | **82/100** | Điểm cao nhờ outcome/ease/time; novelty và cost uncertainty không bị che. |

## 4. TESTABILITY — Test Gate

- **Testability rationale:** Có input, observable output và bốn pass/fail criteria cụ thể; phép thử chạy được trong vài phút.
- **Prerequisites:** Một LLM chat đang dùng được; không cần file upload, chỉ paste text.
- **Estimated time:** 2–5 phút; direct test dưới 2 phút.
- **Paid/API/technical requirements:** Không có trong test hiện tại; provider-specific access chưa xác minh.
- **Test steps:**
  1. Chuẩn bị sample có heading, numbered list, page number và footer.
  2. Dán instruction + sample vào AI chat.
  3. So output với input theo pass criteria, không chỉ nhìn “đẹp hơn”.
- **Expected observable result:** Heading thành Markdown, list thành bullet, page/footer bị loại, hai ý nội dung vẫn đủ.
- **Pass criteria:** Đủ 4/4: heading đúng; list đúng; page/footer bị xóa; không thêm/bớt hai ý.
- **Fail criteria:** Thiếu một ý, tự thêm nội dung, giữ rác hoặc không tạo Markdown.
- **Testability status:** `TESTABLE`
- **Test execution status:** `COMPLETED`
- **Actual test date:** 2026-08-23
- **Actual result/evidence:** E2 đạt 4/4 criteria.
- **Test result:** `PASSED`
- **Blocker/next action:** Không có cho direct test hiện tại.

## 5. SELECT — Decision

- **Score threshold:** pass — 82/100 ≥70.
- **Verification hard gate:** pass with caveat — `PARTIALLY_VERIFIED`; core capability pass, portability/cost chưa verified nhưng bị loại khỏi claim chính.
- **Test hard gate:** pass — `TESTABLE` + `COMPLETED` + `PASSED`, direct test dưới 10 phút.
- **Reliability/reproducibility gate:** pass — cả hai 4/5.
- **Duplicate check:** `existing-content-audit` — đây là audit ngược của CKAI-0002, không sinh content mới.
- **Decision:** `recommend`
- **Rationale:** Utility/outcome/ease/testability mạnh; direct test chứng minh core workflow. Recommend chỉ với wording provider-agnostic và caveat rằng output cần đối chiếu; không được tuyên bố mọi provider/free tier đều giống nhau.
- **Next evidence/action if hold:** Không áp dụng. Nếu muốn gọi tên ChatGPT/Claude/Gemini hoặc nói “miễn phí”, phải test/xác minh từng provider trước.

## 6. TEACH — Teaching Brief

- **Hook/value proposition:** Biến một đoạn text dính page number, footer và list lộn xộn thành Markdown sạch trong vài phút.
- **Viewer problem:** Copy từ PDF/web vào hệ thống ghi chú làm định dạng vỡ; dọn tay chậm và dễ bỏ sót.
- **What the tip does:** Nhờ AI xử lý cleanup định dạng theo rules cụ thể, không giao cho AI quyết định nội dung nào có giá trị.
- **Minimal steps:**
  1. Paste đoạn text cần dọn vào AI chat đang dùng.
  2. Yêu cầu: giữ nguyên nội dung; chuyển heading/list sang Markdown; xóa page/header/footer/ký tự thừa.
  3. So output với bản gốc để kiểm tra thiếu/thừa ý rồi mới lưu `.md`.
- **Expected result:** Một đoạn Markdown dễ đọc, không còn rác định dạng đã chỉ định.
- **Conditions/limits/warnings:** Kết quả có thể khác theo model và độ phức tạp; test hiện chỉ dùng sample ngắn, không chứng minh OCR/bảng/document dài; không tuyên bố FREE/BASIC cho provider cụ thể.
- **Proof/evidence to show:** Before/after của đúng một sample; zoom vào 4 pass criteria thay vì chỉ nói “AI dọn rất sạch”.
- **Why worth learning:** Giảm việc format lặp lại và dạy người xem cách kiểm tra output thay vì tin ngay.
- **CTA/next action:** Thử với một đoạn text ngắn trước; đối chiếu từng ý rồi mới dùng cho tài liệu dài.

## 7. LEGACY DELEGATED-OPERATOR DECISION & HANDOFF

- **Legacy delegated-operator decision:** `not-applicable` — CKAI-0002 đã tồn tại trước STEP 01; example không tạo direct Content Approval cho content cũ.
- **Decision date:**
- **Notes:** Khi dùng pipeline cho candidate production, `recommend` phải dừng tại đây chờ Product Owner.
- **Assigned Content ID:** `CKAI-0002` (reference only)
- **Handoff file:** [`../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md`](../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md)
