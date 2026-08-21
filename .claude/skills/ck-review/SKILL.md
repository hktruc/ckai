---
name: ck-review
description: Review 1 script theo Hook/Retention/Clarity/Originality/Depth/Brand Fit/Chanh Kien/Overclaim/AI-sounding/Practical Value/Viral/Authority, ra verdict PUBLISH/REVISE/REJECT — dùng khi user gõ /ck-review sau khi có script từ /ck-script.
---

# /ck-review — Review script

## Bắt buộc đọc trước khi chạy

1. `../../../PROJECT.md` §10
2. `../../../engine/chanh-kien-filter.md`
3. `../../../knowledge/brand.md`
4. `../../../knowledge/voice-and-style.md` — dùng để đánh giá tiêu chí 9 (AI-sounding Language) chính xác hơn: so với cách Trực thật sự nói (mở bằng ví dụ, tự nới lỏng khẳng định, tự nhận lỗi của chính mình...), không chỉ so với "văn ChatGPT" chung chung
5. `../../../engine/content-scoring.md`
6. `../../../knowledge/audience.md`
7. `../../../knowledge/philosophy.md` — nếu script trích dẫn một quan điểm/framework cá nhân của Trực, đối chiếu xem có giữ đúng mức độ chắc chắn đã phân loại (BELIEF/HYPOTHESIS/EMERGING FRAMEWORK) không, hay đã bị viết cứng hơn thành khẳng định chắc nịch
8. `../../../PROJECT.md` §26 — nếu script thuộc AI Content Level L1/L2 (Practical AI / AI×Work-Learning), dùng mục này để không đánh giá sai tiêu chí 6/7 (Brand Fit/Chánh kiến) — content thực dụng không bắt buộc nhắc "Chánh kiến" hay triết lý hóa

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

## Verdict cuối

Chọn đúng 1 trong 3, in đậm:

- **PUBLISH** — sẵn sàng quay, không cần sửa gì đáng kể.
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

Nếu **PUBLISH**:
1. Cập nhật `status: approved` trong frontmatter của script và trong dòng tương ứng ở `data/content-index.csv`.
2. **Tự động di chuyển file** từ `content/scripts/CKAI-000N_slug.md` sang `content/approved/CKAI-000N_slug.md` (giữ nguyên tên file) — không hỏi lại, không giữ bản trùng ở `content/scripts/`. Đây là quy tắc chuẩn của workflow (xem `PROJECT.md` §21), không phải hành động cần xác nhận riêng mỗi lần.
3. Nếu có nơi nào khác trong repo tham chiếu trực tiếp tới đường dẫn cũ (`content/scripts/CKAI-000N...`), cập nhật lại cho khớp path mới — thường không có, vì các file khác (`my-stories.md`, `content-index.csv`...) chỉ tham chiếu Content ID, không tham chiếu đường dẫn.

Nếu **REVISE** hoặc **REJECT**: giữ nguyên file ở `content/scripts/`, không di chuyển.

`content/approved/` **không** tự động chuyển tiếp sang `content/published/` — việc đó chỉ xảy ra khi user xác nhận video đã thật sự publish (qua bước riêng, hiện chưa có skill tự động cho bước này).
