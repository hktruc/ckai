---
name: ck-review
description: Review editorial script, kiểm tra duration/evidence và ra verdict PUBLISH/REVISE/REJECT; Product Owner Content Approval là CHECKPOINT A trước khi script được approved hoặc storyboard-ready.
---

# /ck-review — Review script

## Authority boundary

- **ChatGPT** là primary CKAI operator và editorial authority cho WHAT / WHY / EDITORIAL HOW.
- **Codex** dùng workflow canonical này để structure/persist artifact, enforce schema/evidence/technical gates và thực thi thay đổi được giao; output do Codex tạo không tự trở thành editorial approval.
- **Product Owner** giữ hai primary checkpoints: direct market-facing Content Approval và direct final Release Approval. ChatGPT recommendation/delegated acceptance không phải hai approvals này; không state nào override factual/technical hard gate.
- Workflow bên dưới mô tả canonical outcome, không chuyển editorial authority cho executor. Khi Codex chạy workflow, mọi judgment chưa được ChatGPT explicit cung cấp/xác nhận chỉ là draft; creative/editorial gate phải giữ pending.
- **Operator UX:** Product Owner không cần nhớ command/engine/schema. ChatGPT translate natural language thành workflow và không expose candidate score, artifact state, QA/hash hoặc intermediate approval request trừ khi Product Owner hỏi.
- Primary Product Owner checkpoints chỉ là Content Approval và Release Approval. Intermediate owner interruption chỉ dùng cho brand/cost/legal/provider/high-impact factual/voice-brand judgment thật sự.

## Bắt buộc đọc trước khi chạy

2. `../../../engine/script-engine.md` — đặc biệt duration, claim/evidence, states và approval gate.
3. `../../../content/scripts/TEMPLATE.md` — schema canonical cho script STEP 02.
1. `../../../PROJECT.md` §10
4. `../../../engine/chanh-kien-filter.md`
5. `../../../knowledge/brand.md`
6. `../../../knowledge/voice-and-style.md` — dùng để đánh giá tiêu chí 9 (AI-sounding Language) chính xác hơn: so với cách Trực thật sự nói (mở bằng ví dụ, tự nới lỏng khẳng định, tự nhận lỗi của chính mình...), không chỉ so với "văn ChatGPT" chung chung
7. `../../../engine/content-scoring.md`
8. `../../../knowledge/audience.md`
9. `../../../knowledge/philosophy.md` — nếu script trích dẫn một quan điểm/framework cá nhân của Trực, đối chiếu xem có giữ đúng mức độ chắc chắn đã phân loại (BELIEF/HYPOTHESIS/EMERGING FRAMEWORK) không, hay đã bị viết cứng hơn thành khẳng định chắc nịch
10. `../../../PROJECT.md` §26 — nếu script thuộc AI Content Level L1/L2 (Practical AI / AI×Work-Learning), dùng mục này để không đánh giá sai tiêu chí 6/7 (Brand Fit/Chánh kiến) — content thực dụng không bắt buộc nhắc "Chánh kiến" hay triết lý hóa

## Input

Một script (từ `content/scripts/CKAI-000N_slug.md`, hoặc script user paste trực tiếp).

## Việc phải làm

Review script theo đúng 12 tiêu chí sau, mỗi tiêu chí cho nhận xét ngắn (1-2 câu) + đánh giá Đạt / Cần sửa / Không đạt:

1. **Hook** — có đủ Stop Power + Curiosity, đúng loại hook phù hợp, không clickbait sai sự thật?
2. **Retention** — nhịp script có giữ được người xem tới cuối không (câu đầu có kéo được sang câu sau không, có đoạn nào chùng/dài dòng không)?
3. **Clarity** — Big Idea có rõ ràng, người xem hiểu ngay không cần xem lại?
4. **Originality** — có phải góc nhìn thật/riêng, hay là điều ai cũng đã nói?
5. **Depth** — có đi sâu hơn bề mặt vấn đề, hay chỉ dừng ở nhận định chung chung?
6. **Brand Fit** — đúng tone "chia sẻ điều quan sát được", không giáo điều/lên lớp/cực đoan? **Với content AI Content Level L1/L2 (Practical AI / AI×Work-Learning):** không trừ điểm chỉ vì bài chủ yếu là tutorial, và không bắt buộc phải nhắc "Chánh kiến" để đạt Brand Fit cao (xem `PROJECT.md` §26).
7. **Chánh kiến** — chạy đầy đủ 14 câu hỏi trong `engine/chanh-kien-filter.md` + câu hỏi cuối cùng, liệt kê câu nào bị vi phạm.
8. **Overclaim** — có khẳng định vượt quá dữ kiện có sẵn không?
9. **AI-sounding Language** — có đoạn nào đọc như "văn ChatGPT" (trang trọng, sáo rỗng, câu dài) thay vì văn nói không? Đối chiếu thêm với `knowledge/voice-and-style.md`: script có mở bằng ví dụ cụ thể (không mở bằng định nghĩa), có tự nới lỏng khẳng định tuyệt đối khi cần, có giữ được yếu tố "người nói cũng từng/đang vấp phải" không, hay đã biến Trực thành người "đã đạt tới" giảng dạy từ trên xuống? Trích đoạn cụ thể nếu có.
10. **Practical Value** — người xem có nhận được gì cụ thể (insight/framework/cách nhìn mới) không chỉ là giải trí?
11. **Viral Potential** — khả năng share/dừng xem hết, đánh giá thực tế không thổi phồng.
12. **Authority Potential** — có củng cố hình ảnh người có chiều sâu/đáng tin không?

## Khi review content AI thực dụng (Practical AI / L1–L2)

Vẫn review đủ 12 tiêu chí ở trên, nhưng hỏi thêm 6 câu sau (gộp nhận xét vào các tiêu chí liên quan — không cần đánh số riêng trong output):

1. Bài có thực sự hữu ích không?
2. Có đúng đối tượng của thương hiệu không?
3. Có biến kênh thành kiểu spam tool/trend không?
4. Human Layer có tự nhiên hay bị gượng ép? (hoặc nếu ghi `HUMAN LAYER NOT NECESSARY` — có hợp lý không, hay đang né tránh)
5. Có claim công nghệ nào cần `NEEDS_VERIFICATION` không?
6. Có affiliate nào làm giảm trust không?

## Hard gates trước verdict

Ngoài 12 tiêu chí, luôn kiểm tra riêng:

1. **Input eligibility:** với `tuyet-chieu-ai`, `source_candidate` phải là candidate `recommend + approved`; không review một script đã bypass gate.
2. **Duration:** đếm lại Spoken Copy theo `script-engine.md`; estimate >55 giây là `REVISE`, không silently pass.
3. **Claim/evidence:** claim decision-critical phải có upstream evidence/caveat; unresolved claim làm `claim_evidence_check: BLOCKED` và verdict không thể PUBLISH.
4. **Schema/state:** generated script phải còn human `pending` và Storyboard `BLOCKED`.
5. **Scope:** không yêu cầu hoặc tạo scene/shot/animation/visual plan trong review.

Nếu gặp legacy approved content trước STEP 02, có thể reverse-audit nhưng không rewrite/migrate file tích lũy nếu user không yêu cầu.

## Verdict cuối

Chọn đúng 1 trong 3, in đậm:

- **PUBLISH** — editorial quality + hard gates đạt; đây chưa phải Product Owner Content Approval và chưa tự move file.
- **REVISE** — cần sửa; liệt kê rõ **phần nào** cần sửa và **vì sao** (trích dẫn câu/đoạn cụ thể trong script). **Không tự rewrite toàn bộ** trừ khi user yêu cầu rõ ràng — chỉ chỉ ra vấn đề.
- **REJECT** — vi phạm nghiêm trọng (overclaim nặng, phán xét con người, bịa dữ kiện, lệch định vị) — nêu rõ lý do, không nên sửa nhỏ mà nên viết lại từ đầu với angle khác.

## Format output

```
## Review: CKAI-000N — [Working Title]

1. Hook: Đạt/Cần sửa/Không đạt — nhận xét
2. Retention: ...
3. Clarity: ...
4. Originality: ...
5. Depth: ...
6. Brand Fit: ...
7. Chánh kiến: (liệt kê câu nào trong 14 câu bị vi phạm, nếu có)
8. Overclaim: ...
9. AI-sounding Language: ...
10. Practical Value: ...
11. Viral Potential: ...
12. Authority Potential: ...

### Câu hỏi cuối cùng (Chánh Kiến Filter)
Nếu bỏ yếu tố viral đi, nội dung này còn có giá trị không? → (trả lời)

### VERDICT: PUBLISH / REVISE / REJECT

(nếu REVISE: liệt kê rõ từng phần cần sửa)
(nếu REJECT: nêu lý do chính)
```

## Sau khi review

Với mọi verdict, giữ file trong `content/scripts/` trừ khi có Product Owner Content Approval rõ ràng.

- **PUBLISH:** cập nhật `status: review`, `editorial_review: pass`, `human_decision: pending`, `storyboard_handoff_status: BLOCKED`; cập nhật index `status: review`.
- **REVISE:** cập nhật `status: review`, `editorial_review: revise`, giữ human `pending` và handoff `BLOCKED`.
- **REJECT:** cập nhật `status: review`, `editorial_review: reject`, giữ handoff `BLOCKED`; không tự xóa file.

Chỉ khi Product Owner trực tiếp nói Duyệt hoặc tương đương cho exact market-facing Script, và mọi hard gate PASS:

1. đặt `human_decision: approved`, `status: approved`, `storyboard_handoff_status: READY`;
2. cập nhật dòng tương ứng trong `data/content-index.csv` thành `approved`;
3. di chuyển file sang `content/approved/` và không giữ bản trùng trong `content/scripts/`;
4. dừng lại — không tạo Storyboard.

Nếu human `rejected/needs-changes/pending`, file không được move. `content/approved/` chỉ chuyển tiếp qua `/ck-publish` sau khi Product Owner xác nhận final asset/video đã publish.
