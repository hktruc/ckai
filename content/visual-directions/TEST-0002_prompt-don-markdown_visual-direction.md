---
id: TEST-0002
type: short-form-visual-direction-proof
content_stream: tuyet-chieu-ai
format: vertical-9x16
visual_input_eligibility: legacy-approved-reverse-audit
source_storyboard: ../storyboards/TEST-0002_prompt-don-markdown_storyboard.md
source_script_contract: ../scripts/TEST-0002_prompt-don-markdown-script-contract.md
source_legacy_approved_script: ../approved/CKAI-0002_prompt-don-tai-lieu-markdown.md
visual_direction_status: review
visual_review: pass
human_decision: not-applicable
animation_handoff_status: BLOCKED
scene_count: 5
visual_input_check: PASS
storyboard_trace_check: PASS
proof_evidence_check: PASS
caveat_check: PASS
asset_provenance_check: PASS
native_vertical_check: PASS
continuity_check: PASS
readability_density_check: PASS
brand_check: PASS
boundary_check: PASS
visual_quality_check: PASS
unresolved_issues: none-for-contract-proof
created: 2026-08-23
updated: 2026-08-23
---

# Visual Direction Contract Proof — TEST-0002

_Reverse-audit từ Storyboard TEST-0002. Fixture chứng minh visual schema, proof integrity, 9:16, hierarchy và continuity; source không phải production Storyboard, human `not-applicable`, nên Animation handoff luôn `BLOCKED`._

## 1. SOURCE & VISUAL INPUT AUDIT

- **Source Storyboard:** [`../storyboards/TEST-0002_prompt-don-markdown_storyboard.md`](../storyboards/TEST-0002_prompt-don-markdown_storyboard.md).
- **Source Script Contract:** [`../scripts/TEST-0002_prompt-don-markdown-script-contract.md`](../scripts/TEST-0002_prompt-don-markdown-script-contract.md).
- **Upstream direct-test evidence:** [`../candidates/AITIP-TEST-0001_prompt-don-markdown.md`](../candidates/AITIP-TEST-0001_prompt-don-markdown.md) E2.
- **Production eligibility:** `BLOCKED` — source Storyboard là reverse-audit, `visual_director_handoff_status: BLOCKED`, human `not-applicable`.
- **Reverse-audit eligibility:** `PASS` — được chạy visual checks, không override STEP 03 gate.
- **Scenes/timing/Spoken mapping:** 5 scenes, 49 seconds, present and fixed.
- **Mandatory text/proof/caveat/continuity:** present.
- **Visual input check:** `PASS` cho contract audit only.

## 2. GLOBAL VISUAL LANGUAGE

- **Density:** clean; tăng density có kiểm soát ở prompt/proof scenes.
- **Mode:** editorial-technical.
- **Dimensionality:** flat.
- **Representation:** text-led + document/result panels; UI-like chỉ ở mức schematic, không giả provider UI.
- **Background philosophy:** nền ít cạnh tranh, giữ proof/text là focal subject.
- **Whitespace principle:** một focal cluster chính mỗi scene; khoảng trống tách problem/action/result/caveat.
- **Emphasis principle:** content state và verified result quan trọng hơn decoration.
- **Stable brand constraints:** rõ, bình tĩnh, không giật gân; proof/caveat truth-label dễ thấy; không dùng visual để làm claim mạnh hơn source.
- **Experimental choices for this video:** stacked document cards và monospaced-like treatment cho prompt/Markdown; không khóa palette, exact font hoặc illustration style thành brand invariant.
- **Reusable primitives:** `document`, `prompt-block`, `result-panel`, `before-after`, `keyword`, `warning`, `annotation`, `connector`.
- **Continuity strategy:** cùng một sample document giữ identity từ trạng thái lộn xộn → input → verified result; role không đổi vô cớ.

## 3. SCENE VISUAL DIRECTIONS

### SC-01

- **Storyboard/timing reference:** SC-01 · 00:00.0–00:07.0.
- **Semantic visual function:** `establish problem`.
- **Visual concept:** Một document state có page number/footer/list lộn xộn, được trình bày như vấn đề cần cleanup.
- **Representation type:** `visual-representation`; không phải screenshot hay proof capability.
- **Focal element:** document lộn xộn.
- **Supporting elements:** label nhỏ cho page/footer/list breaks; không thêm provider logo.
- **Composition intent:** một document card chiếm middle focal zone; headline ngắn ở top, supporting labels nằm sát chi tiết liên quan.
- **Spatial hierarchy:** document > broken-format markers > optional headline.
- **Background intent:** low-detail field để document dễ đọc.
- **On-screen text hierarchy:**
  - Primary: “Text lộn xộn?”
  - Secondary: page number · footer · xuống dòng.
  - Proof/caveat: none.
- **Proof representation:** `visual-representation` — truth label “Minh họa problem state”; không dùng làm evidence AI capability.
- **Caveat representation:** none.
- **Asset requirements:** A1.
- **Continuity notes:** A1 là cùng sample document tiếp tục sang SC-03/SC-04.
- **Motion intent:** `focus` — semantic intent đưa attention vào các lỗi định dạng.
- **Density/readability warning:** tối đa ba problem markers cùng lúc; không thu nhỏ document tới mức chữ không đọc được.
- **Reviewer note:** Không định nghĩa camera, keyframe hoặc transition.

### SC-02

- **Storyboard/timing reference:** SC-02 · 00:07.0–00:10.0.
- **Semantic visual function:** `orient viewer`.
- **Visual concept:** Tách rõ “định dạng” là phần giao cho AI, còn content judgment chưa được giao.
- **Representation type:** conceptual label + persistent document.
- **Focal element:** label “Dọn định dạng”.
- **Supporting elements:** document A1 ở vai trò context; boundary label nhỏ “không quyết định nội dung”.
- **Composition intent:** primary label ở upper-middle, document context thấp hơn; vertical hierarchy đọc từ scope → object.
- **Spatial hierarchy:** scope label > document > boundary annotation.
- **Background intent:** giữ cùng background role với SC-01.
- **On-screen text hierarchy:**
  - Primary: “Dọn định dạng”.
  - Secondary: “Không giao quyết định nội dung”.
  - Proof/caveat: none.
- **Proof representation:** none; capability proof vẫn dành cho SC-04.
- **Caveat representation:** supporting boundary, không phải decision-critical test caveat.
- **Asset requirements:** A1.
- **Continuity notes:** document identity giữ nguyên từ SC-01.
- **Motion intent:** `emphasize`.
- **Density/readability warning:** 3 seconds; chỉ hai text roles, không thêm explanation.
- **Reviewer note:** Không biến conceptual scope thành provider-specific UI.

### SC-03

- **Storyboard/timing reference:** SC-03 · 00:10.0–00:26.0.
- **Semantic visual function:** `demonstrate step`.
- **Visual concept:** Sample input và prompt xuất hiện như hai semantic blocks rõ thứ tự: input trước, instruction sau.
- **Representation type:** text-led `document` + `prompt-block`; không giả app screenshot.
- **Focal element:** prompt nguyên văn A2 ở readable state.
- **Supporting elements:** sample document A1 và step labels “1 Input / 2 Prompt”.
- **Composition intent:** progressive vertical stack: step label → input document → prompt block; prompt nhận phần lớn middle/lower reading area.
- **Spatial hierarchy:** prompt > step order > sample context.
- **Background intent:** giảm contrast của input sau khi prompt trở thành focal.
- **On-screen text hierarchy:**
  - Primary: prompt nguyên văn.
  - Secondary: “1 Input” / “2 Prompt”.
  - Proof/caveat: truth label “Instruction đã test trong E2”.
- **Proof representation:** `actual-proof` cho instruction text — exact text trace về E2; không phải provider UI proof.
- **Caveat representation:** none tại scene này.
- **Asset requirements:** A1, A2.
- **Continuity notes:** A1 tiếp tục là input tạo output A3 ở SC-04.
- **Motion intent:** `build` — semantic order input rồi prompt.
- **Density/readability warning:** prompt dài; ưu tiên readable hold, không thêm decorative elements hoặc full VO subtitle cạnh prompt.
- **Reviewer note:** No font size pixels, cursor mechanics hoặc motion duration implementation.

### SC-04

- **Storyboard/timing reference:** SC-04 · 00:26.0–00:36.0.
- **Semantic visual function:** `reveal result` + `provide evidence`.
- **Visual concept:** Before/after của đúng E2 sample với bốn validation criteria được đánh dấu rõ.
- **Representation type:** `actual-proof` rendered từ exact stored input/output text; không phải fake screenshot.
- **Focal element:** verified Markdown output A3.
- **Supporting elements:** input A1, four-point checklist A4, E2 truth label.
- **Composition intent:** native vertical stacked comparison: “Before” ở upper zone, “After” ở middle focal zone, validation strip ở bottom; không dùng horizontal crop.
- **Spatial hierarchy:** verified output > four criteria > input context > provenance label.
- **Background intent:** proof panels nổi khỏi neutral context bằng hierarchy, không khóa palette.
- **On-screen text hierarchy:**
  - Primary: verified Markdown output.
  - Secondary: Before / After.
  - Proof/caveat: “E2 direct test · sample ngắn · 4/4”.
- **Proof representation:** `actual-proof` — input/output exact từ AITIP E2; visual treatment không thay đổi nội dung.
- **Caveat representation:** short truth label “sample ngắn”; full limitation tiếp tục SC-05.
- **Asset requirements:** A1, A3, A4.
- **Continuity notes:** same document identity; input/output relationship phải rõ, không đổi sample.
- **Motion intent:** `compare` + `highlight` ở semantic level.
- **Density/readability warning:** bốn criteria không cùng tranh focal với output; reveal/scan order phải ưu tiên output rồi checklist.
- **Reviewer note:** Không thêm logo/provider shell; tránh khiến panel bị hiểu là screenshot từ sản phẩm cụ thể.

### SC-05

- **Storyboard/timing reference:** SC-05 · 00:36.0–00:49.0.
- **Semantic visual function:** `highlight limitation` + `reinforce thesis`.
- **Visual concept:** Thu hẹp phạm vi verified result, sau đó tách ranh giới AI cleanup và human judgment.
- **Representation type:** warning/caveat card + conceptual two-role relationship.
- **Focal element:** caveat A5.
- **Supporting elements:** compact labels “AI: định dạng” và “Mình: nội dung đáng giữ”.
- **Composition intent:** top warning/caveat giữ visibility trước; bottom two-role stack kết luận, không đặt side-by-side quá nhỏ.
- **Spatial hierarchy:** caveat > human judgment takeaway > prior result context.
- **Background intent:** giảm proof panels thành context, không để result lấn caveat.
- **On-screen text hierarchy:**
  - Primary: “Mẫu ngắn; tài liệu dài, bảng, OCR cần test riêng”.
  - Secondary: “AI dọn định dạng / Mình quyết nội dung đáng giữ”.
  - Proof/caveat: caveat là warning role, không làm footnote nhỏ.
- **Proof representation:** `visual-representation` của verified scope; không claim OCR/bảng đã test.
- **Caveat representation:** REQUIRED — A5 ở primary hierarchy.
- **Asset requirements:** A5.
- **Continuity notes:** same result remains muted context; semantic roles kết thúc đúng script thesis.
- **Motion intent:** `focus-shift` từ result sang limitation/judgment.
- **Density/readability warning:** caveat và takeaway xuất hiện theo attention order; không đồng thời cùng maximum emphasis.
- **Reviewer note:** Không chọn metaphor/style treatment ngoài needs của fixture.

## 4. ASSET REQUIREMENTS

| Asset ID | Scene | Type | Purpose | Priority | Provenance/source | Evidence-critical | Truth label | Valid fallback | Status |
|---|---|---|---|---|---|---|---|---|---|
| A1 | SC-01–04 | sample input text | Persistent before/input document | REQUIRED | AITIP E2 Input, lines 67–75 | yes | “E2 sample input” | none | AVAILABLE |
| A2 | SC-03 | prompt text | Show exact instruction | REQUIRED | AITIP E2 Instruction, lines 63–65 | yes | “E2 tested instruction” | none | AVAILABLE |
| A3 | SC-04 | Markdown output text | Actual result proof | REQUIRED | AITIP E2 Observed output, lines 77–84 | yes | “E2 observed output” | none | AVAILABLE |
| A4 | SC-04 | validation labels | Show 4/4 pass criteria | REQUIRED | AITIP E2 Verification/Testability, lines 86–94 and 118–129 | yes | “E2 criteria” | none | AVAILABLE |
| A5 | SC-05 | caveat text | Preserve tested limits | REQUIRED | AITIP E2 limits + Script S3 | yes | “Verified scope/limits” | none | AVAILABLE |

- **Asset provenance check:** `PASS` — all evidence-critical assets are exact text stored in repo; no screenshot/download/generation required.
- **Asset generation/download performed:** no.
- **Product/provider logos:** none required.

## 5. PROOF / CAVEAT REPRESENTATION

| Requirement ID | Storyboard scene/requirement | Representation class | Visual treatment intent | Source/provenance | Status |
|---|---|---|---|---|---|
| R1 — Prompt readable | SC-03 | actual-proof | Readable prompt block with E2 label | A2 | PRESERVED |
| R2 — Before/after result | SC-04 | actual-proof | Vertical stacked exact input/output | A1 + A3 | PRESERVED |
| R3 — Four criteria | SC-04 | visual-representation of evidence | Secondary validation strip after output | A4 | PRESERVED |
| R4 — Sample limits | SC-05 | visual-representation | Primary warning/caveat role | A5 | PRESERVED |
| R5 — No portability/FREE claim | all | constraint | No provider/tier claim or logo | Script S4 `EXCLUDED` | PRESERVED |

- **Mockup presented as actual proof:** no.
- **Invented claim/UI/result/data:** no.
- **Actual proof vs representation:** explicitly labeled per row.
- **Proof/evidence check:** `PASS`.
- **Required caveat check:** `PASS`.

## 6. CONTINUITY & ATTENTION MAP

| From → To | Persistent identity/role | Spatial/semantic relationship | Required continuity | Conflict |
|---|---|---|---|---|
| SC-01 → SC-02 | A1 document/problem | Problem object becomes scoped cleanup target | Same sample/content identity | none |
| SC-02 → SC-03 | A1 + cleanup scope | Scope becomes ordered action | Document remains input; no provider switch | none |
| SC-03 → SC-04 | A1/A2 → A3 | Input/instruction produce observed result | Exact E2 pairing; no fabricated sample | none |
| SC-04 → SC-05 | A3 result | Proof becomes context for limitation/judgment | Result not generalized beyond E2 | none |

- **Single attention priority per scene:** `PASS`.
- **Mobile readability/density:** `PASS` at direction level; prompt/proof scenes explicitly reserve readable states.
- **Continuity check:** `PASS`.
- **Native vertical check:** `PASS` — stacked vertical hierarchy, no horizontal crop dependency.

## 7. VISUAL QUALITY REVIEW

- **Visual input:** `PASS` for reverse-audit only; production remains `BLOCKED`.
- **Storyboard trace/no rewrite:** `PASS` — all five IDs/timings/functions preserved.
- **Proof integrity/truth labels:** `PASS`.
- **Caveat visibility:** `PASS` — primary role in SC-05.
- **Asset provenance:** `PASS` — exact repo-backed E2 text.
- **Native 9:16/mobile hierarchy:** `PASS`.
- **Density/readability:** `PASS` at direction level, with dense-scene warnings retained.
- **Global language consistency:** `PASS`.
- **Continuity/object identity:** `PASS`.
- **Text hierarchy:** `PASS` — no full VO duplication.
- **Brand/stream behavior:** `PASS` — usefulness/proof over decoration.
- **No invented claim/fake proof:** `PASS`.
- **No animation implementation leakage:** `PASS` — semantic motion only.
- **Visual review:** `pass` for contract proof.
- **Consolidated visual quality check:** `PASS` for contract audit.
- **Boundary check:** `PASS`.

## 8. LEGACY DELEGATED-OPERATOR FIELD & GATE PROOF

- **Legacy delegated-operator decision:** `not-applicable` — reverse-audit fixture, không phải production acceptance.
- **Operator notes:** Không được đổi fixture thành production input để mở Animation.
- **Unresolved issues:** none cho contract proof; production eligibility không tồn tại.

| Scenario | Production input | Visual hard checks | Review | Human | Unresolved | Animation handoff |
|---|---|---|---|---|---|---|
| Delegated field approved nhưng provenance BLOCKED | PASS | `asset_provenance_check: BLOCKED` | pass | approved | none | **BLOCKED** |
| Exact production conjunction đạt | PASS | all PASS | pass | approved | none | **READY** |
| Fixture này | **BLOCKED** (`reverse-audit`) | PASS | pass | not-applicable | none-for-proof | **BLOCKED** |

Hai scenario đầu là state-transition contract, không phải production artifacts.

## 9. ANIMATION HANDOFF

- **Approved Visual Direction:** none — fixture không thể approved production.
- **Source Storyboard/Script:** complete for proof only.
- **Scene concepts/composition/hierarchy:** complete for proof.
- **Assets/provenance/text/proof/caveat:** complete for proof.
- **Continuity/semantic motion intent:** complete for proof.
- **Animation handoff:** `BLOCKED`.

_STOP BEFORE ANIMATION. Không có component, CSS/SVG animation, timeline, frames/keyframes, easing/spring, transition code, Remotion, FFmpeg, render, voice hoặc export._
