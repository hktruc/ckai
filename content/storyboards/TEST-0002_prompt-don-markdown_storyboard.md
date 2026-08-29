---
id: TEST-0002
type: short-form-storyboard-proof
input_eligibility: legacy-approved-reverse-audit
content_stream: tuyet-chieu-ai
format: vertical-9x16
source_script_contract: ../scripts/TEST-0002_prompt-don-markdown-script-contract.md
source_legacy_approved_script: ../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md
storyboard_status: review
storyboard_review: pass
human_decision: not-applicable
visual_director_handoff_status: BLOCKED
target_duration_seconds: 50
script_estimated_duration_seconds: 48
storyboard_planned_duration_seconds: 49
scene_count: 5
input_check: PASS
spoken_mapping_check: PASS
timing_check: PASS
proof_evidence_check: PASS
caveat_check: PASS
storyboard_quality_check: PASS
boundary_check: PASS
unresolved_issues: none-for-contract-proof
created: 2026-08-23
updated: 2026-08-23
---

# Storyboard Contract Proof — TEST-0002

_Reverse-audit từ canonical Script Contract TEST-0002 và legacy approved CKAI-0002. Fixture chứng minh schema/mapping/review nhưng không chứng minh production eligibility: `not-applicable` không phải approval và Visual Director handoff luôn `BLOCKED`._

## 1. SOURCE & INPUT AUDIT

- **Source script contract:** [`../scripts/TEST-0002_prompt-don-markdown-script-contract.md`](../scripts/TEST-0002_prompt-don-markdown-script-contract.md).
- **Source legacy approved script:** [`../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md`](../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md).
- **Upstream evidence:** [`../candidates/AITIP-TEST-0001_prompt-don-markdown.md`](../candidates/AITIP-TEST-0001_prompt-don-markdown.md).
- **Production eligibility:** `BLOCKED` — source contract là `TEST-*`, human `not-applicable`, Script handoff `BLOCKED`.
- **Reverse-audit eligibility:** `PASS` — fixture được phép kiểm tra contract nhưng không được handoff.
- **Content stream:** `tuyet-chieu-ai`.
- **Format:** `vertical-9x16`.
- **Duration / evidence checks:** `PASS` / `PASS` trong Script Contract.
- **Final Spoken Copy / Narrative Beats / Handoff Requirements:** present.
- **Input check:** `PASS` chỉ trong reverse-audit mode; fixture được chạy segmentation/timing/mapping/evidence/caveat/quality checks nhưng không override production gate.

## 2. SCENE PLAN

### SC-01

- **Order:** 1
- **Timing:** 00:00.0–00:07.0
- **Duration seconds:** 7
- **Source beat(s):** B1 — HOOK/PROBLEM
- **Spoken Copy:**

> Bạn copy text từ PDF vào ghi chú, rồi mất thời gian dọn số trang, footer và xuống dòng?

- **Narrative purpose:** Nêu friction cụ thể và mở problem.
- **Semantic visual function:** `establish problem` — giúp người xem nhận ra trạng thái text lộn xộn cần xử lý.
- **On-screen text requirement:** OPTIONAL — keyword ngắn về “text lộn xộn”; không duplicate cả câu.
- **Proof/evidence requirement:** none — đây là problem setup, chưa phải capability proof.
- **Caveat requirement:** none.
- **Continuity/dependency:** Thiết lập trạng thái trước cho transformation ở SC-03/SC-04.
- **Density/attention warning:** Giữ problem state dễ nhận ra trong 7 giây.
- **Reviewer note:** Không chỉ định app, palette, composition hoặc asset.

### SC-02

- **Order:** 2
- **Timing:** 00:07.0–00:10.0
- **Duration seconds:** 3
- **Source beat(s):** B2 — MOVE
- **Spoken Copy:**

> Thử giao riêng phần định dạng cho AI.

- **Narrative purpose:** Chuyển từ problem sang action principle.
- **Semantic visual function:** `orient viewer` — làm rõ AI chỉ nhận phần cleanup định dạng.
- **On-screen text requirement:** REQUIRED — “Dọn định dạng”, không thêm claim về provider/cost.
- **Proof/evidence requirement:** none; proof capability nằm ở SC-04.
- **Caveat requirement:** none.
- **Continuity/dependency:** Phải giữ ranh giới “riêng phần định dạng” trước prompt SC-03.
- **Density/attention warning:** none.
- **Reviewer note:** Không biến thành tuyên bố AI xử lý mọi loại tài liệu.

### SC-03

- **Order:** 3
- **Timing:** 00:10.0–00:26.0
- **Duration seconds:** 16
- **Source beat(s):** B3 — STEPS + một `[pause]`
- **Spoken Copy:**

> Dán đoạn text vào AI chat bạn đang dùng, rồi thêm yêu cầu này:
>
> “Chuyển đoạn text thành Markdown sạch. Giữ nguyên nội dung. Đổi tiêu đề và danh sách đúng định dạng. Xóa số trang, header, footer và ký tự thừa.”

- **Narrative purpose:** Truyền đạt action và prompt cần dùng.
- **Semantic visual function:** `demonstrate step` — giúp người xem hiểu input và thứ tự thao tác, chưa quyết định UI/art treatment.
- **On-screen text requirement:** REQUIRED — prompt nguyên văn phải có readable state; không phải subtitle toàn phần.
- **Proof/evidence requirement:** REQUIRED — thao tác phải nhất quán với direct-test procedure E2; không invent provider-specific UI/capability.
- **Caveat requirement:** none tại scene này.
- **Continuity/dependency:** Nhận problem state từ SC-01 và tạo input cho result/proof SC-04.
- **Density/attention warning:** Prompt dài; 16 giây gồm một pause/hold để có khả năng đọc. Nếu review thấy chưa đủ đọc, không tự tăng total quá budget—phải simplify mapping hoặc trả về Script layer.
- **Reviewer note:** Không thiết kế typography, composition, cursor motion hoặc transition.

### SC-04

- **Order:** 4
- **Timing:** 00:26.0–00:36.0
- **Duration seconds:** 10
- **Source beat(s):** B4 — RESULT/PROOF
- **Spoken Copy:**

> Khi AI trả kết quả, đừng copy ngay. So lại bốn điểm: tiêu đề, danh sách, phần rác đã bị xóa, và nội dung có thiếu hay thừa không.

- **Narrative purpose:** Chứng minh result trong phạm vi test và hướng dẫn validation.
- **Semantic visual function:** `reveal result` + `provide evidence` — giúp người xem đối chiếu output theo bốn pass criteria.
- **On-screen text requirement:** REQUIRED — bốn tiêu chí: tiêu đề; danh sách; rác đã xóa; thiếu/thừa nội dung.
- **Proof/evidence requirement:** REQUIRED — before/after hoặc verified output state từ E2 phải thể hiện đủ bốn tiêu chí; animation decoration không thay proof.
- **Caveat requirement:** REQUIRED — không mô tả output là luôn chính xác.
- **Continuity/dependency:** Phải dùng input state của SC-03; result không được là output fabricated không trace được về test.
- **Density/attention warning:** Bốn tiêu chí cần đủ 10 giây để scan; review readability trước approval.
- **Reviewer note:** Storyboard không chọn exact UI, screenshot, layout hoặc visual style.

### SC-05

- **Order:** 5
- **Timing:** 00:36.0–00:49.0
- **Duration seconds:** 13
- **Source beat(s):** B5 — CAVEAT/END
- **Spoken Copy:**

> Test hiện tại chỉ dùng một mẫu ngắn, nên tài liệu dài, bảng hoặc OCR vẫn cần kiểm tra riêng.
>
> AI có thể dọn định dạng. Còn nội dung nào đáng giữ, mình vẫn phải quyết.

- **Narrative purpose:** Giới hạn mức chắc chắn và kết bằng Human Layer/Judgment.
- **Semantic visual function:** `highlight limitation` + `reinforce thesis` — phân biệt phần AI cleanup với quyết định của con người.
- **On-screen text requirement:** REQUIRED — caveat ngắn “Mẫu ngắn; tài liệu dài/bảng/OCR cần test riêng”.
- **Proof/evidence requirement:** REQUIRED — giữ đúng limit E2; không thêm proof cho OCR/bảng/document dài.
- **Caveat requirement:** REQUIRED — toàn bộ caveat của S3 phải còn rõ.
- **Continuity/dependency:** Chỉ kết luận sau result/proof SC-04.
- **Density/attention warning:** Hai chức năng khác nhau nhưng cùng beat kết; reviewer xác nhận transition semantic đủ rõ, không cần split chỉ vì có hai câu.
- **Reviewer note:** Không chọn metaphor, illustration hoặc end-card treatment.

## 3. SPOKEN COPY COVERAGE

| Source beat/segment | Scene | Coverage | Order | Notes |
|---|---|---|---|---|
| B1 | SC-01 | FULL | correct | 19 spoken units |
| B2 | SC-02 | FULL | correct | 8 spoken units |
| B3 + `[pause]` | SC-03 | FULL | correct | 42 spoken units; pause mapped to timing |
| B4 | SC-04 | FULL | correct | 29 spoken units |
| B5 | SC-05 | FULL | correct | 36 spoken units |

- **Total mapped spoken units:** 134 / 134.
- **Missing segments:** none.
- **Duplicate segments:** none.
- **Invented Spoken Copy:** none.
- **Pause/hold mapping:** one `[pause]` in SC-03.
- **Spoken mapping check:** `PASS`.

## 4. TIMING SUMMARY

| Scene | Start | End | Duration seconds | Timing rationale |
|---|---:|---:|---:|---|
| SC-01 | 0.0 | 7.0 | 7 | Hook/problem recognition |
| SC-02 | 7.0 | 10.0 | 3 | Short conceptual move |
| SC-03 | 10.0 | 26.0 | 16 | Dense prompt + one-second hold |
| SC-04 | 26.0 | 36.0 | 10 | Result and four-point validation |
| SC-05 | 36.0 | 49.0 | 13 | Caveat + ending judgment |
| **TOTAL** |  |  | **49** | Continuous, no gap/overlap |

- **Script estimated duration:** 48 seconds.
- **Storyboard planned duration:** 49 seconds.
- **Difference + rationale:** +1 second do làm tròn theo scene và giữ readable state cho prompt/proof; vẫn trong target budget.
- **Visual-only holds:** một hold đã map từ `[pause]`, nằm trong SC-03 duration.
- **Approval ceiling / hard limit:** 55 / <60 seconds.
- **Timing check:** `PASS` — 49 ≤55 và <60.

## 5. PROOF / TEXT / CAVEAT TRACEABILITY

| Requirement ID | Upstream claim/evidence | Scene | Priority | Status |
|---|---|---|---|---|
| R1 — Prompt readable state | Script Handoff “Prompt nguyên văn” | SC-03 | REQUIRED | PRESERVED |
| R2 — Verified result/before-after | AITIP E2 direct test + Script S1/S2 | SC-04 | REQUIRED | PRESERVED |
| R3 — Four validation criteria | AITIP E2 pass criteria + Script S2 | SC-04 | REQUIRED | PRESERVED |
| R4 — Sample limits | AITIP E2 limits + Script S3 | SC-05 | REQUIRED | PRESERVED |
| R5 — No portability/FREE claim | Script S4 `EXCLUDED` | all | REQUIRED constraint | PRESERVED — not introduced |

- **Fake/unverified proof introduced:** no.
- **Required proof downgraded to decoration:** no.
- **Proof/evidence check:** `PASS`.
- **Required caveat check:** `PASS`.

## 6. STORYBOARD QUALITY REVIEW

- **Input eligibility:** `PASS` for reverse-audit only; production remains `BLOCKED`.
- **Full Spoken Copy mapping:** `PASS` — 134/134, exact order, no gap/duplicate.
- **Timing and readability:** `PASS` — continuous 49 seconds; dense prompt/result are explicitly flagged.
- **Scene density/function:** `PASS` — boundaries follow problem/move/step/result/caveat, not sentence count.
- **Proof/evidence/caveat preservation:** `PASS`.
- **Continuity:** `PASS` — problem → action → result → limitation.
- **No invented claim/fake proof:** `PASS`.
- **No art-direction leakage:** `PASS` — only semantic functions/requirements.
- **Stream behavior:** `PASS` — usefulness follows `PROBLEM → ACTION → RESULT`; proof is mandatory.
- **Storyboard review:** `pass` for contract proof.
- **Boundary check:** `PASS`.
- **Consolidated storyboard quality check:** `PASS` cho contract audit; không thay production eligibility.

## 7. LEGACY DELEGATED-OPERATOR FIELD & GATE PROOF

- **Legacy delegated-operator decision:** `not-applicable` — reverse-audit fixture, không phải production acceptance.
- **Operator notes:** Fixture không được dùng để bypass production gates.
- **Unresolved issues:** none cho contract proof; production eligibility vẫn không tồn tại.

| Scenario | Production input | Mapping/timing | Proof/evidence | Caveat/quality/boundary | Editorial | Human | Unresolved | Handoff |
|---|---|---|---|---|---|---|---|---|
| **A — Delegated field approved, proof BLOCKED** | PASS | PASS | **BLOCKED** | PASS | pass | approved | none | **BLOCKED** |
| **B — Exact conjunction đạt** | PASS | PASS | PASS | PASS | pass | approved | none | **READY** |
| Fixture này | **BLOCKED** (`reverse-audit`) | PASS | PASS | PASS | pass | not-applicable | none-for-proof | **BLOCKED** |

Scenario A/B là state-transition contract, không phải production artifacts. Fixture không được đổi thành fake production input để đạt READY.

## 8. VISUAL DIRECTOR HANDOFF

- **Approved storyboard:** none — fixture không thể approved production.
- **Approved script reference:** legacy reference chỉ phục vụ reverse-audit.
- **Scene timing/mapping:** complete for proof.
- **Mandatory text/proof/caveat:** complete for proof.
- **Continuity constraints:** included.
- **Visual Director handoff:** `BLOCKED`.

_STOP BEFORE VISUAL DIRECTOR. Proof không chứa art style, composition, asset, animation, Remotion, voice, sound, subtitle rendering hoặc export._
