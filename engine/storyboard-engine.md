---
type: engine
scope: short-form-storyboard
version: 1
---

# Storyboard Engine — STEP 03

## Operating authority

ChatGPT owns semantic scene flow and editorial Storyboard judgment. Codex persists the artifact, validates exact Spoken Copy mapping, timing, evidence/caveat preservation and handoff gates. delegated operator acceptance remains separate and cannot override a hard failure. See PROJECT.md §23.

## Operator UX compatibility

STEP 03 is internal machinery. Legacy human_decision approved means ChatGPT delegated operator acceptance under an active STEP 02 Content Approval, with approval basis recorded in notes. It does not mean Product Owner inspected the Storyboard. Any market-facing meaning change must return to STEP 02 and invalidate Content Approval.


Storyboard Engine mở rộng cùng CKAI lifecycle và Content ID; không tạo production system song song.

```text
APPROVED SCRIPT → STORYBOARD INPUT CHECK → SCENE SEGMENTATION
                → TIMING → SEMANTIC VISUAL FUNCTION
                → TEXT / PROOF REQUIREMENTS → STORYBOARD REVIEW
                → DELEGATED OPERATOR ACCEPTANCE → VISUAL DIRECTOR HANDOFF READY
                → STOP BEFORE VISUAL DIRECTOR
```

Storyboard trả lời: video cần diễn ra qua những scene nào, mỗi scene phục vụ ý gì, map đoạn Spoken Copy nào, kéo dài bao lâu và bắt buộc phải chứng minh/hiển thị điều gì. Storyboard không quyết định scene trông như thế nào.

## 1. Input contract

Đường production duy nhất nhận một file canonical trong `content/approved/` thỏa đồng thời:

- `id: CKAI-*`, `type: short-form-script`, `format: vertical-9x16`;
- `status: approved`, `editorial_review: pass`, `human_decision: approved`;
- `duration_check: PASS`, `claim_evidence_check: PASS`;
- `storyboard_handoff_status: READY`;
- có `content_stream`, final Spoken Copy, Narrative Beats và duration metadata rõ;
- Editorial Handoff Requirements đã nêu proof, critical on-screen text, caveat và unresolved issues; unresolved issue decision-critical phải rỗng.

Không tạo storyboard trực tiếp từ draft/review script, `AITIP-*`, Teaching Brief hoặc input chưa qua delegated operator acceptance. Không tự đổi state upstream để làm input hợp lệ. Thiếu input thì đặt `input_check: BLOCKED`, ghi issue và dừng trước segmentation.

Legacy approved content có thể được **reverse-audit** bằng fixture `TEST-*` để kiểm tra contract. Fixture phải khai báo `input_eligibility: legacy-approved-reverse-audit`, `human_decision: not-applicable` và `visual_director_handoff_status: BLOCKED`; nó không chứng minh production eligibility và không được handoff.

Reverse-audit được phép chạy segmentation, timing, mapping, proof/evidence, caveat và quality checks để chứng minh contract. `input_check: PASS` trong mode này chỉ có nghĩa input đủ cho **contract audit**; nó không đổi `input_eligibility` thành `production`, không thay STEP 02 approval và không bao giờ mở Visual Director handoff.

## 2. Storyboard và Visual Director là hai layer khác nhau

Storyboard được phép định nghĩa:

- scene ID/order, timing window và duration;
- exact Spoken Copy mapping và narrative purpose;
- semantic visual function: hình ảnh cần giúp người xem hiểu điều gì;
- required on-screen text, proof/evidence, caveat và UI/result/demo state;
- continuity/dependency, density warning và reviewer note.

Storyboard không được quyết định:

- art style, scene palette, illustration style, exact composition hoặc typography treatment;
- asset selection, camera/lens, rendering method hoặc image-generation prompt;
- transition implementation, motion curve/easing, animation/Remotion component;
- sound design, music, TTS voice hoặc subtitle renderer.

Nếu một field bắt đầu mô tả “trông như thế nào” thay vì “cần truyền đạt/chứng minh điều gì”, chuyển nó thành `boundary_check: BLOCKED` và trả lại để revise.

## 3. Canonical schema

Mỗi storyboard là một companion file `content/storyboards/CKAI-000N_slug_storyboard.md`, dùng [`../content/storyboards/TEMPLATE.md`](../content/storyboards/TEMPLATE.md). Approved script nguồn không bị move hoặc rewrite.

Frontmatter tối thiểu:

```yaml
id: CKAI-000N
type: short-form-storyboard
content_stream: chanh-kien # chanh-kien | tuyet-chieu-ai
format: vertical-9x16
input_eligibility: production # production | legacy-approved-reverse-audit
source_approved_script: ../approved/CKAI-000N_slug.md
storyboard_status: draft   # draft | review | approved | archived
storyboard_review: pending # pending | pass | revise | reject
human_decision: pending    # pending | approved | rejected | needs-changes | not-applicable
visual_director_handoff_status: BLOCKED # BLOCKED | READY
target_duration_seconds:
script_estimated_duration_seconds:
storyboard_planned_duration_seconds:
scene_count:
input_check: pending       # pending | PASS | BLOCKED
spoken_mapping_check: pending # pending | PASS | BLOCKED
timing_check: pending      # pending | PASS | REVISE
proof_evidence_check: pending # pending | PASS | BLOCKED
caveat_check: pending     # pending | PASS | BLOCKED
storyboard_quality_check: pending # pending | PASS | BLOCKED
boundary_check: pending    # pending | PASS | BLOCKED
unresolved_issues:
created: YYYY-MM-DD
updated: YYYY-MM-DD
```

Body bắt buộc gồm: source/input audit, scene plan, Spoken Copy coverage ledger, timing summary, proof/evidence traceability, quality review, delegated operator decision và Visual Director handoff package.

### Scene block

Mỗi scene dùng một heading `SC-01`, `SC-02`... theo thứ tự liên tục và đủ các field:

```text
Scene ID / order
Timing window + duration_seconds
Source beat(s)
Spoken Copy — exact excerpt, hoặc [visual-only]
Narrative purpose
Semantic visual function
On-screen text requirement
Proof/evidence requirement
Caveat requirement
Continuity/dependency
Density/attention warning
Reviewer note
```

`semantic_visual_function` là open vocabulary có rationale, không phải enum đóng. Ví dụ hợp lệ: `establish problem`, `contrast before/after`, `show transformation`, `demonstrate step`, `reveal result`, `provide evidence`, `highlight limitation`, `reinforce thesis`, `orient viewer`, `simplify abstract concept`.

## 4. Scene segmentation contract

Tạo boundary khi có thay đổi đáng kể về một hoặc nhiều yếu tố:

- narrative beat hoặc narrative purpose;
- viewer task hay bước thao tác;
- evidence/result/UI information state;
- concept, comparison, emphasis hoặc caveat;
- dependency cần được hiểu trước khi chuyển ý.

Không tạo một scene cho mỗi câu chỉ để dễ parse. Không gom các ý khác chức năng vào một scene chỉ để giảm scene count. Preserve thứ tự, thesis và flow của approved script.

Spoken Copy chỉ được chia/mapping, không rewrite. Correction nhỏ về whitespace/quote để map phải được note và không đổi chữ/nghĩa. Nếu cần rewrite thesis, claim, caveat hoặc một đoạn lớn để storyboard hoạt động: `spoken_mapping_check: BLOCKED`, trả về Script layer.

### Khác biệt theo content stream

- `tuyet-chieu-ai`: ưu tiên semantic flow `PROBLEM → ACTION → RESULT` hoặc flow tương đương của script. Step order phải rõ; proof/result có scene và thời lượng đọc được; decoration không thay proof; caveat decision-critical không được mất.
- `chanh-kien`: ưu tiên tension, contrast, conceptual reframing, reasoning và implication. Không ép thành tutorial/demo, không thêm fake proof. Metaphor/abstraction chỉ được ghi ở mức semantic intent; Visual Director tương lai mới cụ thể hóa hình ảnh.

Lightweight reference cho CKAI-0001: boundary hợp lý có thể đi theo story setup → self-justification/conflict → realization → second example/pattern → open implication. Không đổi chuỗi này thành “5 bước sửa ham muốn”.

## 5. Spoken Copy mapping contract

- Mọi spoken segment trong approved script phải xuất hiện **đúng một lần**, đúng thứ tự trong các scene.
- Không được bỏ, duplicate hoặc invent Spoken Copy. Scene `[visual-only]` không được thêm claim bằng on-screen text.
- Beat/pause marker không phải spoken unit nhưng phải map vào scene liên quan; pause/visual-only hold được tính trong timing.
- Coverage ledger map từng source beat/segment sang scene. `spoken_mapping_check: PASS` chỉ khi coverage đầy đủ, không overlap và không gap.
- On-screen text không thay thế Spoken Copy mapping.

## 6. Timing contract

Storyboard dùng seconds, có thể dùng một chữ số thập phân:

```text
scene_duration_seconds = end_seconds - start_seconds
storyboard_planned_duration_seconds = tổng scene_duration_seconds
```

Rules:

1. Scene windows liên tục từ `00:00.0`, không gap/overlap trừ khi overlap được ghi rõ là cùng timeline (mặc định không dùng).
2. Tổng scene durations phải bằng `storyboard_planned_duration_seconds`.
3. Planned duration phải dưới 60 giây và không vượt script approval ceiling 55 giây.
4. Planned duration phải phù hợp script estimate. Chênh lệch được phép để phân bổ nhịp/visual hold nhưng phải ghi rationale; không silently kéo dài.
5. Visual-only hold phải có purpose và được tính vào planned duration.
6. Không chia đều thời lượng theo câu; proof, step, result và dense on-screen text phải có đủ thời gian hiểu.

`timing_check: REVISE` nếu tổng sai, overflow, proof/text không đọc được hoặc timeline đòi tăng quá budget. Storyboard không được tự kéo video thành 60+ giây; nếu không thể fit hợp lệ, trả về Script layer.

## 7. On-screen text contract

Chỉ mark text bắt buộc vì chức năng editorial: keyword, step number, command, result, warning, caveat, metric hoặc short quote/paraphrase cần thiết.

- Không duplicate toàn bộ voiceover.
- Không viết dense paragraph; prompt/command dài có thể cần một required readable state nhưng Storyboard không thiết kế typography.
- Claim trong on-screen text phải trace về script claim/evidence; không thêm claim mới.
- Subtitle/caption rendering là subsystem tương lai, không build ở STEP 03.

## 8. Proof, evidence và caveat preservation

Mỗi requirement decision-critical từ Script Handoff phải map tới ít nhất một scene và một upstream reference:

```text
requirement_id → source claim/evidence → scene_id → REQUIRED | OPTIONAL → status
```

- `REQUIRED` không được hạ thành decoration hoặc optional.
- Không tạo fake screenshot, metric, UI, output hoặc fabricated result.
- Nếu required proof không thể biểu diễn hợp lệ: `proof_evidence_check: BLOCKED`, ghi issue cho ChatGPT operator; không READY. Chỉ interrupt Product Owner nếu issue là owner-interrupt condition. Nếu required caveat thiếu hoặc bị làm yếu: `caveat_check: BLOCKED`.
- Với `tuyet-chieu-ai`, animation decoration không thay cho actual verified result/UI state mà upstream yêu cầu.
- Với `chanh-kien`, không tạo evidence giả cho observation/metaphor; factual claim vẫn phải giữ evidence requirement thật.

## 9. States, review và delegated operator gate

```text
generated
  → storyboard_status: draft
  → storyboard_review: pending
  → human_decision: pending
  → visual_director_handoff_status: BLOCKED

editorial review PASS
  → storyboard_status: review
  → storyboard_review: pass
  → human_decision: pending
  → vẫn BLOCKED

Delegated operator acceptance chỉ là một conjunct
  + tất cả production hard gates bên dưới cùng đạt
  → storyboard_status: approved
  → visual_director_handoff_status: READY
```

### Exact READY invariant

`visual_director_handoff_status: READY` **khi và chỉ khi** toàn bộ conjunction sau đúng:

```text
input_eligibility == production
AND input_check == PASS
AND source script == canonical STEP 02 approved input
AND source storyboard_handoff_status == READY
AND spoken_mapping_check == PASS
AND timing_check == PASS
AND proof_evidence_check == PASS
AND caveat_check == PASS
AND storyboard_quality_check == PASS
AND boundary_check == PASS
AND storyboard_review == pass
AND human_decision == approved
AND unresolved_issues == none
```

Nếu **bất kỳ** conjunct nào sai/pending/BLOCKED/REVISE, handoff bắt buộc là `BLOCKED` — kể cả khi ChatGPT operator đã đặt legacy `human_decision: approved`. Delegated acceptance không override input, technical, editorial, evidence, caveat hoặc quality gate.

- Generated không đồng nghĩa reviewed; editorial pass không đồng nghĩa human approved.
- `pending/rejected/needs-changes/not-applicable` luôn chặn Visual Director handoff.
- `not-applicable` chỉ dành fixture/migration/reverse-audit và luôn `BLOCKED`.
- Review `revise/reject` hoặc bất kỳ hard check BLOCKED/REVISE đều chặn READY.

### Contract scenarios

| Scenario | Production input | Mapping/timing | Proof/caveat/quality/boundary | Editorial | Human | Unresolved | Handoff |
|---|---|---|---|---|---|---|---|
| **A — Human approved nhưng proof fail** | PASS | PASS | `proof_evidence_check: BLOCKED` | pass | approved | none | **BLOCKED** |
| **B — Toàn bộ conjunction đạt** | PASS | PASS | tất cả PASS | pass | approved | none | **READY** |

Scenario B là state contract, không tạo production artifact giả.

### Review checklist

1. Input có đủ approved/READY gates không?
2. Toàn bộ Spoken Copy được map đúng một lần, đúng thứ tự không?
3. Timeline có liên tục, tổng đúng, dưới 55/60 và đủ thời gian hiểu không?
4. Có scene quá dày, vô chức năng, duplicate hoặc continuity conflict không?
5. Semantic visual intent có hỗ trợ narrative không?
6. Required proof, evidence, caveat và on-screen text đã được trace/mapping chưa?
7. Có fake proof, claim mới hoặc UI/capability chưa verified không?
8. On-screen text có quá dài hoặc duplicate voiceover không?
9. Có art-direction/animation implementation leakage không?
10. Stream behavior có đúng: practical không mất usefulness, chánh kiến không bị tutorial hóa?

## 10. Visual Director handoff package


`storyboard_quality_check: PASS` chỉ hợp lệ khi toàn bộ checklist trên đạt; checklist item `REVISE/BLOCKED` làm consolidated quality check `BLOCKED` và handoff `BLOCKED`.
Chỉ storyboard thỏa **Exact READY invariant** mới được đặt `approved + READY` và handoff. Package gồm:

- approved storyboard và approved script reference;
- Content ID, stream, format và duration budget;
- scene order/timing, exact Spoken Copy mapping và semantic visual function;
- mandatory on-screen text, proof/evidence, caveat và continuity constraints;
- unresolved issues phải là `none`.

Package không chứa actual art direction. Visual Director tại [`visual-director.md`](visual-director.md) nhận semantic constraints và quyết định visual expression trong STEP 04.

## 11. Workflow entrypoint và proof

STEP 03 không thêm `/ck-storyboard`. Sau Content Approval hoặc khi ChatGPT operator route feedback tới Storyboard, maintainer áp dụng engine này và [`../content/storyboards/TEMPLATE.md`](../content/storyboards/TEMPLATE.md) trực tiếp. Product Owner không cần biết command/engine name. Nếu sau này cần command riêng, đó là architecture decision mới.

Proof: [`../content/storyboards/TEST-0002_prompt-don-markdown_storyboard.md`](../content/storyboards/TEST-0002_prompt-don-markdown_storyboard.md) reverse-audit TEST-0002/CKAI-0002. Proof chứng minh full mapping, timing, required result/prompt/caveat và human gate; vì là fixture `not-applicable`, Visual Director handoff luôn `BLOCKED`.

## 12. Stopping rule

STEP 03 kết thúc tại approved storyboard + Visual Director handoff contract. Visual Director được triển khai riêng ở STEP 04; Storyboard Engine không triển khai art direction, asset/image generation, Animation Engine, Remotion/React video, transition mechanics, voice/TTS, subtitle renderer, export hoặc publishing automation.
