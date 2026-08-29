---
name: ck-script
description: Viết short-form editorial script dưới 60 giây cho Chánh kiến hoặc Tuyệt chiêu AI từ input production hợp lệ; dùng khi user gõ /ck-script sau khi đã chốt topic/angle hoặc có AI Tip đã human-approved.
---

# /ck-script — Script Engine

## Authority boundary

- **ChatGPT** là primary CKAI operator và editorial authority cho WHAT / WHY / EDITORIAL HOW.
- **Codex** dùng workflow canonical này để structure/persist artifact, enforce schema/evidence/technical gates và thực thi thay đổi được giao; output do Codex tạo không tự trở thành editorial approval.
- **Product Owner** giữ hai primary checkpoints: direct market-facing Content Approval và direct final Release Approval. ChatGPT recommendation/delegated acceptance không phải hai approvals này; không state nào override factual/technical hard gate.
- Workflow bên dưới mô tả canonical outcome, không chuyển editorial authority cho executor. Khi Codex chạy workflow, mọi judgment chưa được ChatGPT explicit cung cấp/xác nhận chỉ là draft; creative/editorial gate phải giữ pending.
- **Operator UX:** Product Owner không cần nhớ command/engine/schema. ChatGPT translate natural language thành workflow và không expose candidate score, artifact state, QA/hash hoặc intermediate approval request trừ khi Product Owner hỏi.
- Primary Product Owner checkpoints chỉ là Content Approval và Release Approval. Intermediate owner interruption chỉ dùng cho brand/cost/legal/provider/high-impact factual/voice-brand judgment thật sự.

## Bắt buộc đọc trước khi chạy

1. `../../../PROJECT.md` §6, §8–§10, §15–§21, §26, §28.
2. `../../../engine/script-engine.md` — input/output schema, duration, evidence, states và stopping rule canonical.
3. `../../../content/scripts/TEMPLATE.md`.
4. `../../../knowledge/brand.md`, `../../../knowledge/voice-and-style.md`, `../../../knowledge/audience.md`, `../../../knowledge/content-pillars.md`.
5. `../../../engine/viral-structures.md`, `../../../engine/hook-library.md`, `../../../engine/content-scoring.md`, `../../../engine/chanh-kien-filter.md`.
6. `../../../knowledge/my-stories.md` và `../../../knowledge/philosophy.md` khi content dùng story/quan điểm cá nhân.
7. `../../../data/content-index.csv` và `../../../content/` để lấy ID/kiểm tra trùng; bỏ qua `TEST-*` theo `PROJECT.md` §16.

## Input gate

Xác định `content_stream` trước khi viết:

- `tuyet-chieu-ai`: chỉ nhận file `content/ideas/CKAI-*.md` đã handoff từ candidate. Đọc `source_candidate`, rồi xác nhận candidate nguồn có `decision: recommend`, `human_decision: approved`, Teaching Brief và `content_id` khớp. Nếu pending/không khớp/đọc trực tiếp candidate, **dừng**; không tự approve hay bypass.
- `chanh-kien`: nhận idea/angle đã chọn trong `content/ideas/`, hoặc topic/angle Product Owner đưa trực tiếp. Không bắt đi qua AI Tips Intelligence; phải chốt Big Idea, audience và objective trước khi viết.

Teaching Brief không phải script. Được viết lại cấu trúc/ngôn ngữ, không được làm mạnh claim hơn evidence hoặc bỏ caveat upstream.

## Workflow

1. Xác nhận input gate, stream và source references.
2. Diễn đạt Big Idea/core promise trong một câu.
3. Chọn structure theo bản chất nội dung:
   - `tuyet-chieu-ai`: ưu tiên HOW/outcome; có thể dùng `practical-tool-walkthrough`, không hard-code nếu structure khác rõ hơn.
   - `chanh-kien`: ưu tiên WHY/reframe; không ép steps/demo.
4. Sinh 10–15 hook, score theo Hook Engine, loại hook có tiêu chí <3/5, giữ Top 3 và chọn một hook không overpromise.
5. Điền template: Editorial Brief → Hook → Narrative Beats → Spoken Copy → Claim/Evidence → Duration → Ending → Editorial Handoff → Review state.
6. Viết văn nói đúng `brand.md` và `voice-and-style.md`. Không tự bịa personal story; dùng `PERSONAL STORY NEEDED` khi thiếu.
7. Lập claim/evidence ledger. Với Tuyệt chiêu AI, trace claim decision-critical về candidate/evidence; claim chưa đủ phải `NEEDS_VERIFICATION`/`BLOCKED`, không tự hợp thức hóa.
8. Tính duration theo `script-engine.md`: target 50 giây, estimate ≤55 giây mới `PASS`. Nếu vượt, cắt/viết lại và tính lại; không silently pass.
9. Tự áp Chánh Kiến Filter, rồi lưu script generated với:
   - `status: draft`
   - `editorial_review: pending`
   - `human_decision: pending`
   - `storyboard_handoff_status: BLOCKED`

## Output và lưu file

- Dùng đúng [`../../../content/scripts/TEMPLATE.md`](../../../content/scripts/TEMPLATE.md); không duy trì schema thứ hai trong skill.
- Lưu `content/scripts/CKAI-000N_slug.md` và cập nhật `data/content-index.csv` thành `status: scripting`.
- Không tạo Visual/B-roll, scene, shot list, storyboard, animation, transition, Remotion component hoặc asset plan.
- Script generated chưa được Content Approval. Chạy /ck-review; sau hard gates + ChatGPT editorial pass, present only market-facing content to Product Owner. Explicit Duyệt maps to direct STEP 02 Content Approval and allows move to content/approved/.

## Stopping rules

- Dừng nếu AI Tip chưa human-approved hoặc source mismatch.
- Dừng/flag nếu thiếu evidence quyết định-critical, factual/current claim chưa verify hoặc personal story chưa có dữ liệu thật.
- Dừng tại script. Không bắt đầu Storyboard hoặc bất kỳ production implementation nào.
