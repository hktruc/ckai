---
type: engine
scope: short-form-script
version: 1
---

# Script Engine — STEP 02

## Operating authority

ChatGPT owns script direction, writing quality, narrative and editorial review. Codex persists the canonical script artifact, validates schema/duration/evidence and enforces handoff state. Product Owner explicit Content Approval remains separate; no approval overrides a failed hard gate. See PROJECT.md §23.

## Operator UX compatibility

STEP 02 is CHECKPOINT A. Product Owner Content Approval is bound to exact market-facing angle/hook/Spoken Copy/critical claims/CTA/meaning-critical text. The legacy human_decision approved state at this step means direct Product Owner Content Approval. Any later material meaning change invalidates it and blocks downstream handoff.


Script Engine mở rộng workflow CKAI hiện có; không tạo hệ thống hoặc Content ID song song.

```text
eligible content → SCRIPT INPUT → GENERATE → DURATION CHECK
                 → CLAIM/EVIDENCE CHECK → EDITORIAL REVIEW
                 → PRODUCT OWNER CONTENT APPROVAL → APPROVED SCRIPT
                 → STOP BEFORE STORYBOARD
```

`generated`, `editorially passed`, `Content approved` và `storyboard-ready` là các trạng thái khác nhau.

## 1. Script input contract

### `tuyet-chieu-ai`

Đường production duy nhất:

```text
AITIP-* decision: recommend
  + human_decision: approved
  → cấp CKAI-* và tạo content/ideas/CKAI-*.md
  → /ck-script
```

- `/ck-script` chỉ đọc Tuyệt chiêu AI từ `content/ideas/` có `source_candidate: AITIP-*`.
- Candidate nguồn phải còn `decision: recommend`, legacy `human_decision: approved` có delegated operator basis, có Teaching Brief và `content_id` trùng CKAI ID của idea. Đây chưa phải Product Owner Content Approval.
- Không đọc trực tiếp candidate `pending`, không tự đổi approval và không dùng Teaching Brief như script nguyên văn.
- Teaching Brief là editorial input. Script được viết lại nhịp/cấu trúc/ngôn ngữ, nhưng không được làm mạnh claim hơn evidence hoặc bỏ caveat quyết định-critical.

Fixture, migration và reverse-audit content cũ có thể dùng `input_eligibility: legacy-approved-reverse-audit`; chúng mang ID `TEST-*`, không được handoff production và không tạo tiền lệ bypass gate.

### `chanh-kien`

Không đi qua AI Tips Intelligence. Input hợp lệ là:

- một file `content/ideas/CKAI-*.md` có Big Idea/angle đã được chọn; hoặc
- topic/angle do Product Owner đưa trực tiếp, sau khi `/ck-script` ghi lại brief tối thiểu và cấp CKAI ID theo convention hiện có.

Trước khi viết phải có: Big Idea một câu, audience, objective, stream và source references. Story cá nhân thiếu dữ liệu phải giữ `PERSONAL STORY NEEDED`; factual/current claim thiếu nguồn phải giữ `NEEDS_VERIFICATION`.

## 2. Hai editorial contract

| Stream | Bản chất | Beat gợi ý, không phải công thức cứng | Không được ép |
|---|---|---|---|
| `tuyet-chieu-ai` | HOW — practical, outcome cụ thể | Hook → Problem → Move → Steps → Result/Proof → Caveat → End | Không thêm triết lý/filler; không bỏ proof/caveat để câu chuyện “mượt” hơn |
| `chanh-kien` | WHY — insight, perspective, reframing | Hook → Tension → Reframe → Explanation → Implication → End | Không ép steps/demo/tutorial; không biến thành motivational fluff |

Mọi stream chỉ có một core promise/takeaway. Hook phải đúng thesis và không hứa nhiều hơn spoken copy.

## 3. Canonical script schema

Mỗi script là một file `content/scripts/CKAI-000N_slug.md`, dùng [`../content/scripts/TEMPLATE.md`](../content/scripts/TEMPLATE.md).

Frontmatter tối thiểu:

```yaml
format: vertical-9x16
id: CKAI-000N
type: short-form-script
content_stream: chanh-kien # chanh-kien | tuyet-chieu-ai
status: draft             # draft | review | approved | published | archived
editorial_review: pending # pending | pass | revise | reject
human_decision: pending   # pending | approved | rejected | needs-changes | not-applicable
storyboard_handoff_status: BLOCKED # BLOCKED | READY
duration_target: 50
spoken_unit_count:
pacing_spoken_units_per_minute: 170
pause_budget_seconds:
estimated_duration_seconds:
duration_check: pending   # pending | PASS | REVISE
claim_evidence_check: pending # pending | PASS | BLOCKED
source_idea:
source_candidate:
created: YYYY-MM-DD
updated: YYYY-MM-DD
```

Body bắt buộc thể hiện:

1. Editorial Brief — title, core promise/takeaway, audience, objective, structure và upstream references.
2. Hook — Top 3 đã score theo Hook Engine, chỉ rõ selected hook.
3. Narrative Beats — beat ID, function, editorial point; không mô tả scene/shot/animation.
4. Spoken Copy — final VO/văn nói, có beat markers nhưng không có chỉ dẫn hình ảnh.
5. Claim & Evidence Ledger — claim quan trọng, source/evidence, caveat và trạng thái.
6. Duration Check — spoken unit count, pacing cùng đơn vị, pause budget, công thức và verdict.
7. Ending/CTA — cho biết có CTA hay intentional ending.
8. Editorial Handoff Requirements — proof bắt buộc, critical on-screen facts/text và caveat future Storyboard phải giữ; đây là yêu cầu editorial, không phải visual plan.
9. Review & Approval — editorial verdict, human decision, unresolved issues và handoff status.
10. Facebook Package Copy — approved Working Title/Headline và Facebook Caption; optional hashtag/pinned comment chỉ khi hữu ích. Đây là market-facing content nằm trong Content Approval fingerprint, không được runner tự viết sau approval.

## 4. Duration contract

Video production tương lai có hard limit **dưới 60 giây**. Script không được dùng hết 59.9 giây trên giấy.

Convention planning mặc định:

```text
spoken_unit_count = số spoken unit trong Spoken Copy
pacing_spoken_units_per_minute = 170
pause_budget_seconds = tổng số giây của các pause marker; mặc định mỗi [pause] = 1 giây
estimated_duration_seconds = round((spoken_unit_count / pacing_spoken_units_per_minute) × 60 + pause_budget_seconds)
```

### Rule đếm `spoken_unit_count`

1. Chỉ lấy nội dung trong section Spoken Copy.
2. Loại toàn bộ dòng chỉ chứa beat marker hoặc non-spoken marker trong ngoặc vuông, ví dụ `[B1 — HOOK]`, `[pause]`; pause được cộng riêng vào `pause_budget_seconds`. Marker phải đứng riêng một dòng; marker viết inline là schema invalid và phải được chuẩn hóa trước khi đếm.
3. Chuẩn hóa mọi chuỗi whitespace liên tiếp (space/tab/newline) thành một space và trim hai đầu.
4. Tách theo whitespace. Mỗi segment có ít nhất một Unicode letter (`\p{L}`) hoặc decimal digit (`\p{Nd}`) được tính là **1 spoken unit**. Dấu câu gắn với segment không tạo unit mới; segment chỉ có dấu câu không được tính.
5. Không dùng tokenizer. Cùng một Spoken Copy đã lưu phải cho cùng count, không phụ thuộc OpenAI, Claude, model hoặc provider.

Đây là estimate, không phải timing tuyệt đối. Khi Delivery Learning có pacing thật ổn định, được override `pacing_spoken_units_per_minute` nhưng phải ghi rationale; schema và counting rule không đổi.

- Target mặc định: **50 giây**.
- `PASS`: estimate ≤55 giây, tạo breathing room tối thiểu khoảng 5 giây.
- `REVISE`: estimate >55 giây; phải cắt/viết lại rồi tính lại.
- Script `REVISE` không được approved hoặc đánh dấu storyboard-ready.
- Không kéo dài script chỉ để chạm target; giá trị đã đủ thì kết thúc sớm.

Chỉ đếm spoken copy theo rule trên. Heading, metadata, beats, evidence ledger và review notes không tính.

## 5. Claim & evidence safety

Đặc biệt bắt buộc với `tuyet-chieu-ai`:

- Mỗi claim decision-critical trong hook/spoken copy phải trỏ về claim/evidence upstream hoặc được gắn `NEEDS_VERIFICATION`.
- Giữ nguyên caveat ảnh hưởng tới cách người xem hiểu hoặc làm theo tip.
- Không tự thêm “hoàn toàn miễn phí”, “mọi AI”, “luôn chính xác”, “100%”, thời gian tuyệt đối, no-paid claim hoặc provider capability nếu upstream không hỗ trợ.
- `UNVERIFIED` decision-critical claim làm `claim_evidence_check: BLOCKED`; script có thể giữ ở `draft/review` để sửa nhưng không được approved.
- Copy thay đổi wording được phép; thay đổi mức độ chắc chắn của claim thì không.

Với `chanh-kien`, ledger vẫn dùng cho số liệu, nghiên cứu, current facts, personal story và mức độ chắc chắn của BELIEF/HYPOTHESIS/EMERGING FRAMEWORK. Không biến quan sát cá nhân thành quy luật phổ quát.

## 6. States, review và approval

```text
generated
  → status: draft
  → editorial_review: pending
  → human_decision: pending
  → storyboard_handoff_status: BLOCKED

/ck-review verdict PUBLISH
  → status: review
  → editorial_review: pass
  → human_decision: pending
  → vẫn ở content/scripts/

Product Owner explicit Content Approval
  + editorial_review: pass
  + duration_check: PASS
  + claim_evidence_check: PASS
  → status: approved
  → human_decision: approved
  → storyboard_handoff_status: READY
  → move sang content/approved/
```

- `PUBLISH` là editorial verdict của hệ thống, không phải Content Approval.
- `REVISE/REJECT` cập nhật editorial state tương ứng và giữ file trong `content/scripts/`.
- `human_decision: pending/rejected/needs-changes` luôn chặn move và chặn Storyboard handoff.
- `not-applicable` chỉ dành cho fixture/migration/reverse-audit; các file này luôn `BLOCKED` và không vào production.

## 7. Storyboard handoff contract — boundary sang STEP 03

Storyboard Engine tại [`storyboard-engine.md`](storyboard-engine.md) chỉ được nhận production script có `storyboard_handoff_status: READY`, gồm:

- content stream, `vertical-9x16` format và final spoken copy;
- selected hook và narrative beats;
- duration budget/estimate;
- proof/evidence requirements;
- critical on-screen facts/text nếu editorial bắt buộc;
- caveats bắt buộc giữ;
- unresolved issues phải rỗng.

STEP 02 không tạo scene. STEP 03 kế thừa package này để segmentation/timing/semantic requirements; camera, composition, art direction, animation, transition, Remotion component và visual asset plan vẫn nằm ngoài Script Engine.

## 8. Proof

- Tuyệt chiêu AI: [`../content/scripts/TEST-0002_prompt-don-markdown-script-contract.md`](../content/scripts/TEST-0002_prompt-don-markdown-script-contract.md) reverse-audit CKAI-0002/AITIP-TEST-0001; chứng minh duration và evidence preservation, không tạo production content.
- Chánh kiến: CKAI-0001 là reverse-audit reference cho stream WHY: story → tension → realization → implication; không bị ép thành steps/demo. File legacy chưa được migrate schema trong STEP 02 để bảo toàn approved content.

## 9. Stopping rule

STEP 02 kết thúc tại approved script + handoff contract. Storyboard được triển khai riêng ở STEP 03; Script Engine không triển khai Visual Director, animation, voice/TTS, subtitle renderer, export hoặc publishing automation.
