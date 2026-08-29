---
id: AITIP-0005
type: ai-tip-candidate
stage: handed-off
verification_status: VERIFIED
testability_status: TESTABLE
test_execution_status: COMPLETED
test_result: PASSED
decision: recommend
human_decision: approved
score_total: 94
discovered_at: 2026-08-24
updated_at: 2026-08-24
content_id: CKAI-0004
---

# AI Tip Candidate — AITIP-0005

## 1. DISCOVER — Raw Candidate

- **Title:** Buộc AI tách phần biết khỏi phần đang đoán
- **Core idea:** Thêm một khung bốn phần — Dữ kiện, Suy luận, Chưa biết, Kiểm chứng — để AI không trình bày giả thuyết như kết luận đã chắc chắn.
- **Target user:** Người đi làm, quản lý, founder, giáo viên và creator dùng AI để phân tích vấn đề.
- **Problem:** Một câu trả lời trôi chảy có thể làm người dùng bỏ qua ranh giới giữa dữ kiện đã có và suy luận chưa được chứng minh.
- **Expected outcome:** Câu trả lời có bốn phần rõ ràng, giữ nguyên phần chưa chắc chắn và đề xuất dữ liệu/câu hỏi cần kiểm tra tiếp.
- **Tool/product involved:** ChatGPT hiện tại; workflow cũng có thể thử với AI chat khác nhưng chưa tuyên bố portability.
- **Initial source/evidence:** Direct test trong CKAI chat hiện tại.
- **Discovered at:** 2026-08-24
- **Cost assumption:** Không cần đăng nhập dịch vụ khác; dùng phiên ChatGPT hiện có của Product Owner. Không đưa claim về free tier.
- **Setup complexity:** low
- **Why it may be useful:** Thao tác ngắn, áp dụng rộng và biến mức độ chắc chắn thành thứ người dùng nhìn thấy trước khi hành động.

### DISCOVER gate

- **Required fields complete:** yes
- **Outcome observable:** yes
- **Result:** pass
- **Rationale:** Có thể kiểm tra trực tiếp việc câu trả lời có tách đúng bốn phần, tránh kết luận nhân quả và nêu dữ liệu còn thiếu hay không.

## 2. VERIFY — Claims & Evidence

### Claims ledger

| Claim ID | Claim | Type | Evidence IDs | Status/rationale |
|---|---|---|---|---|
| C1 | Trong phép thử hiện tại, ChatGPT làm theo khung bốn phần và không kết luận quảng cáo là nguyên nhân chắc chắn. | VERIFIED_FACT | E1 | Transcript test cho kết quả quan sát được đúng tiêu chí. |
| C2 | Khung này giúp người dùng nhìn rõ dữ kiện, giả thuyết và phần cần kiểm chứng trong câu trả lời thử nghiệm. | VERIFIED_FACT | E1 | Bốn phần hiện diện và có nội dung phân biệt được. |
| C3 | Khung này làm AI luôn đúng hoặc loại bỏ hoàn toàn suy luận sai. | UNVERIFIED_CLAIM | E1 | Bị loại khỏi teaching angle; caveat bắt buộc là khung không làm AI luôn đúng. |
| C4 | Mọi AI chat đều tái hiện workflow giống hệt. | UNVERIFIED_CLAIM | E1 | Không dùng trong content; direct test chỉ xác nhận phiên ChatGPT hiện tại. |

### Evidence

| Evidence ID | Type | Source/path | Accessed/tested | Supports | Limits |
|---|---|---|---|---|---|
| E1 | DIRECT_TEST | CKAI chat — exact input/output audit below | 2026-08-24 | C1, C2 | Một test ngắn trong ChatGPT hiện tại; không chứng minh learning gain, universal accuracy hoặc portability sang mọi model. |

### Exact direct-test audit

- **Scenario:** “Doanh thu tháng 7 giảm 20% so với tháng 6. Công ty vừa thay mẫu quảng cáo. Nguyên nhân là gì?”
- **Instruction:** Trả lời theo bốn phần: Dữ kiện; Suy luận; Chưa biết; Kiểm chứng. Không biến suy luận thành sự thật; nói rõ khi dữ kiện chưa đủ.
- **Observed result:**
  - Dữ kiện giữ đúng hai thông tin được cung cấp: doanh thu giảm 20% và mẫu quảng cáo đã thay.
  - Suy luận giữ quảng cáo ở mức một khả năng, không khẳng định quan hệ nhân quả.
  - Chưa biết nêu các biến còn thiếu như lượt truy cập, tỷ lệ chuyển đổi, giá bán, tồn kho và tính mùa vụ.
  - Kiểm chứng đề nghị so sánh các chỉ số trước/sau thay đổi và thu thập dữ liệu còn thiếu.

### Verification checklist

- **Capability exists:** yes
- **Feature current:** yes
- **FREE/BASIC tier verified:** partial — không cần cho teaching claim; chỉ xác nhận trong phiên ChatGPT hiện tại.
- **Important limits captured:** yes
- **Staleness risk:** low
- **Recheck trigger/date:** Re-run exact test if model/interface materially changes or before claiming portability.
- **Verification status:** VERIFIED
- **Unresolved items:** Không có unresolved item làm thay đổi core outcome; portability sang AI khác nằm ngoài claim.

## 3. SCORE — Breakdown

| Criterion | Weight | Score 1–5 | Weighted points | Rationale/evidence |
|---|---:|---:|---:|---|
| Utility | 20 | 5 | 20 | Giúp phân tích công việc mà không nhầm giả thuyết với sự thật. |
| Clarity of outcome | 10 | 5 | 10 | Bốn nhãn và phần kiểm chứng quan sát được ngay. |
| Ease of execution | 10 | 5 | 10 | Chỉ thêm một block chỉ dẫn ngắn vào câu hỏi hiện có. |
| Cost accessibility | 10 | 5 | 10 | Dùng phiên ChatGPT hiện tại, không cần dịch vụ hoặc tài khoản khác. |
| Novelty | 5 | 4 | 4 | Cấu trúc đơn giản nhưng khác prompt xin “phân tích kỹ hơn” chung chung. |
| Broad relevance | 10 | 5 | 10 | Hữu ích cho quyết định, phân tích, học tập và sáng tạo nội dung. |
| Reliability/confidence | 15 | 4 | 12 | Direct test PASS; không overclaim universal behavior. |
| Reproducibility | 10 | 4 | 8 | Exact instruction và pass criteria rõ; model behavior vẫn có thể biến thiên. |
| Time-to-value | 10 | 5 | 10 | Kết quả xuất hiện trong một lượt trả lời. |
| **TOTAL** | **100** |  | **94/100** | Hard gates đều PASS cho scope đã test. |

## 4. TESTABILITY — Test Gate

- **Testability rationale:** Một scenario cố ý thiếu dữ liệu cho phép quan sát xem AI có tách fact/hypothesis/unknown và tránh quan hệ nhân quả giả hay không.
- **Prerequisites:** Phiên ChatGPT hiện tại; không cần file, paid API hoặc đăng nhập dịch vụ khác.
- **Estimated time:** 2–3 phút
- **Paid/API/technical requirements:** none beyond the current ChatGPT session
- **Test steps:**
  1. Đưa scenario doanh thu giảm 20% + vừa thay quảng cáo.
  2. Yêu cầu bốn phần Dữ kiện, Suy luận, Chưa biết, Kiểm chứng.
  3. Kiểm tra câu trả lời có khẳng định nhân quả hay bịa dữ kiện không.
- **Expected observable result:** Bốn phần rõ, quảng cáo chỉ là giả thuyết, có dữ liệu còn thiếu và hành động kiểm chứng.
- **Pass criteria:** Đủ 4 phần; không bịa thêm fact; không kết luận quảng cáo gây giảm doanh thu; nêu ít nhất 3 dữ liệu/câu hỏi cần kiểm tra.
- **Fail criteria:** Thiếu phần; thêm fact không có; khẳng định nguyên nhân; không đưa hướng kiểm chứng.
- **Testability status:** TESTABLE
- **Test execution status:** COMPLETED
- **Actual test date:** 2026-08-24
- **Actual result/evidence:** PASS — exact audit tại E1; đủ 4 phần, không có causal overclaim, nêu trên 3 biến cần kiểm tra.
- **Test result:** PASSED
- **Blocker/next action:** none

## 5. SELECT — Decision

- **Score threshold:** pass
- **Verification hard gate:** pass
- **Test hard gate:** pass
- **Reliability/reproducibility gate:** pass
- **Duplicate check:** pass — không trùng Big Idea với CKAI-0001 đến CKAI-0003 hoặc AITIP-0001 đến AITIP-0004.
- **Decision:** recommend
- **Rationale:** Hữu ích rộng, một bước, không cần provider khác, direct test PASS và caveat có thể giữ trọn trong video dưới 60 giây.
- **Next evidence/action if hold:** not applicable

## 6. TEACH — Teaching Brief

- **Hook/value proposition:** Đừng chỉ hỏi AI “nguyên nhân là gì”; hãy bắt nó nói rõ phần nào là dữ kiện và phần nào chỉ đang đoán.
- **Viewer problem:** Người dùng dễ đọc câu trả lời trôi chảy như một kết luận đã chắc chắn dù input còn thiếu.
- **What the tip does:** Thêm khung Dữ kiện → Suy luận → Chưa biết → Kiểm chứng vào cuối câu hỏi.
- **Minimal steps:**
  1. Đặt câu hỏi và cung cấp context hiện có.
  2. Thêm bốn nhãn cùng yêu cầu không biến suy luận thành sự thật.
  3. Chỉ hành động sau khi kiểm tra phần Chưa biết/Kiểm chứng.
- **Expected result:** Một câu trả lời phân lớp mức độ chắc chắn và nêu rõ bước thu thập dữ liệu tiếp theo.
- **Conditions/limits/warnings:** Không làm AI luôn đúng; không thay thế việc kiểm tra nguồn hoặc judgment của con người; không claim hoạt động giống hệt trên mọi model.
- **Proof/evidence to show:** Scenario doanh thu giảm 20%; kết quả bốn phần; quảng cáo được giữ ở mức giả thuyết; danh sách dữ liệu còn thiếu.
- **Why worth learning:** Thao tác nhỏ nhưng giúp giảm nguy cơ dùng suy luận như sự thật trong công việc.
- **CTA/next action:** Thử thêm bốn dòng vào một câu hỏi AI đang dùng hôm nay.

## 7. OPERATOR COMPATIBILITY APPROVAL & HANDOFF

- **Legacy human_decision:** approved
- **Approval basis/reference:** Product Owner explicit prioritization (“Duyệt”, 2026-08-24) sau direct-test PASS; operator compatibility approval cho STEP 01, không phải STEP 02 Content Approval.
- **Decision date:** 2026-08-24
- **Notes:** Mọi hard gate STEP 01 PASS; Content Approval trên exact Spoken Copy/caption vẫn pending.
- **Assigned Content ID:** CKAI-0004
- **Handoff file:** `content/ideas/CKAI-0004_tach-du-kien-suy-luan-chua-biet.md`
