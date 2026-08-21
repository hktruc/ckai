---
name: ck-script
description: Viết script hoàn chỉnh 45-90s (mặc định 60s) dạng văn nói cho 1 topic/angle đã chọn, gồm sinh và chấm điểm hook, chọn structure, dựng script — dùng khi user gõ /ck-script <topic/angle> sau khi đã chốt angle từ /ck-idea hoặc /ck-expand.
---

# /ck-script — Viết script

## Bắt buộc đọc trước khi chạy

1. `../../../PROJECT.md` §6, §8, §9, §16, §17, §26 (AI Content Layer Model — nếu content thuộc dạng AI thực dụng)
2. `../../../knowledge/brand.md` — đặc biệt phần "Văn phong Script — VĂN NÓI"
3. `../../../knowledge/voice-and-style.md` — **bắt buộc**, suy ra từ calibration thật của Trực (cách mở vấn đề, cách lập luận, từ/cụm từ đặc trưng, kiểu văn phải tránh); dùng cùng `brand.md` để script nghe đúng giọng thật, không phải giọng "chuẩn kênh phát triển bản thân" chung chung
4. `../../../knowledge/audience.md`
5. `../../../knowledge/content-pillars.md`
6. `../../../engine/viral-structures.md`
7. `../../../engine/hook-library.md`
8. `../../../engine/content-scoring.md`
9. `../../../knowledge/my-stories.md` — nếu angle cần trải nghiệm cá nhân; bỏ qua story nào đang gắn `STORY NEEDS DETAIL` (coi như chưa có, không tự bổ sung chi tiết còn thiếu)
10. `../../../knowledge/philosophy.md` — nếu angle chạm vào một quan điểm/niềm tin/framework cá nhân đã ghi nhận qua calibration, dùng đúng mức độ chắc chắn đã phân loại (không viết một HYPOTHESIS hay EMERGING FRAMEWORK thành lời khẳng định chắc nịch trong script)
11. `../../../data/content-index.csv` — xác định Content ID tiếp theo cho content thật: chỉ tính các ID `CKAI-*` (bỏ qua entry `TEST-*`), lấy số lớn nhất + 1, hoặc `CKAI-0001` nếu chưa có `CKAI-*` nào — và kiểm tra trùng (cũng bỏ qua `TEST-*`, xem `PROJECT.md` mục 16)

## Input

Topic hoặc angle đã chọn (từ `/ck-idea`, `/ck-expand`, hoặc user tự đưa trực tiếp). Nếu `/ck-idea` đã gắn `AI Content Level`, dùng lại phân loại đó; nếu user đưa topic trực tiếp và nó là 1 tool/feature/workflow AI cụ thể, tự xác định Level trước khi viết (xem `PROJECT.md` §26).

## Workflow bắt buộc (theo đúng thứ tự)

1. **Hiểu Big Idea** — nếu chưa rõ ràng, tự diễn đạt lại thành 1 câu trước khi làm tiếp.
2. **Chọn Structure**:
   - Content thường (hoặc AI Content Level L3): dựa vào bản chất Big Idea, chọn 1 trong 12 structure (xem `engine/viral-structures.md` mục "Nguyên tắc chọn structure"). Không random.
   - Content AI Content Level **L1 hoặc L2** (Practical AI): có thể dùng cấu trúc thay thế, phù hợp hơn cho tutorial: `HOOK → VẤN ĐỀ → CÁCH DÙNG TOOL → DEMO/RESULT → HUMAN LAYER NGẮN → CTA (nếu phù hợp)`. Không bắt buộc — vẫn dùng 1 trong 12 structure chuẩn nếu hợp hơn (vd: content vẫn có 1 nghịch lý rõ, dùng `paradox-insight` là ổn). Với L1/L2, **Human Layer chỉ nên chiếm 1–3 câu**, thường ở cuối; với L3, Human Layer chính là Big Idea, viết như content thường.
3. **Sinh 10–15 hook** — dùng các loại hook trong `engine/hook-library.md`.
4. **Score hook** — theo `engine/content-scoring.md` (Stop Power 25% · Curiosity 25% · Relevance 20% · Credibility 15% · Brand Fit 15%). Loại hook nào có tiêu chí nào < 3/5.
5. **Chọn Top 3 hook.**
6. **Xây script** — VĂN NÓI, 45–90 giây, mặc định 60 giây. Đọc thầm to lên (mentally) để tự kiểm tra nhịp câu trước khi chốt.

## Ràng buộc bắt buộc trong lúc viết

- Nếu script cần 1 câu chuyện/case cá nhân và không có entry phù hợp (hoặc entry đang gắn `STORY NEEDS DETAIL`) trong `knowledge/my-stories.md` → chèn `[PERSONAL STORY NEEDED: mô tả ngắn cần loại story gì]` vào đúng vị trí trong script thay vì tự bịa hoặc tự bổ sung chi tiết còn thiếu.
- Nếu cần dẫn số liệu/nghiên cứu/sự kiện hiện tại chưa kiểm chứng → chèn `[NEEDS_VERIFICATION: nội dung claim]`.
- Áp Chánh Kiến Filter (`engine/chanh-kien-filter.md`) ngay trong lúc viết, không chỉ chờ `/ck-review` sau — tránh overclaim, cherry-pick, nhị nguyên hóa.
- Văn phong: câu ngắn, có nhịp, không thuật ngữ, không giống văn ChatGPT (xem ví dụ nên/không nên trong `knowledge/brand.md`, và cách nói thật của Trực trong `knowledge/voice-and-style.md`).
- Nếu dùng một quan điểm từ `philosophy.md`, giữ đúng nhãn đã phân loại: BELIEF nói như quan điểm cá nhân ("tôi thấy...", "theo tôi..."), HYPOTHESIS/EMERGING FRAMEWORK còn ít bằng chứng thì không viết như một quy luật đã chứng minh.
- Nếu content là AI Content Level **L1 (Practical AI)**: ưu tiên giá trị thực dụng, phần hướng dẫn/demo chiếm phần lớn thời lượng. **Không** biến script thành bài nói triết học, **không** ép nhắc từ "Chánh kiến" — Human Layer 1 câu cuối là đủ, hoặc `HUMAN LAYER NOT NECESSARY` nếu không tự nhiên. Nếu có claim về tính năng/công nghệ chưa chắc chắn (vd: "tool X luôn chính xác"), chèn `[NEEDS_VERIFICATION]`.

## Format output

```
---
id: CKAI-000N
status: draft
pillar: <code>
topic: <slug ngắn>
angle: <slug ngắn>
structure: <code>
objective: <code>
duration_target: 60
created: <YYYY-MM-DD>
published:
platform:
---

## Working Title


## Pillar


## Big Idea


## Audience


## Primary Objective


## Structure


## Hook A (score: Stop X | Curiosity X | Relevance X | Credibility X | Brand Fit X → tổng X/5)


## Hook B (score: ...)


## Hook C (score: ...)


## Full Script
(Script hoàn chỉnh, văn nói, có đánh dấu [Hook] mở đầu — dùng Hook A trừ khi ghi chú khác — [khoảng dừng] nếu cần, và có Key Sentence được in đậm)


## Key Sentence


## CTA
(nếu cần — không bắt buộc mọi video đều cần CTA rõ ràng)


## Caption ngắn
(nếu phù hợp nền tảng đăng)


## Visual / B-roll
(chỉ nếu thực sự cần thiết cho video này — không bắt buộc)


## Affiliate Opportunity
(chỉ nếu có sản phẩm phù hợp tự nhiên, kèm nhãn từ knowledge/affiliate.md; nếu không → "Không áp dụng")
```

## Sau khi viết xong

Lưu file vào `content/scripts/CKAI-000N_slug.md`, và ghi 1 dòng mới vào `data/content-index.csv` với `status: review` (chờ `/ck-review`).
