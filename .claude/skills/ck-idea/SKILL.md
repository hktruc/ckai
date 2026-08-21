---
name: ck-idea
description: Đề xuất 5 content idea mới cho kênh Chánh Kiến Trong Thời Đại AI, dựa trên brand/pillars/content đã xuất bản — dùng khi user gõ /ck-idea hoặc cần gợi ý topic mới chưa có sẵn trong đầu.
---

# /ck-idea — Đề xuất content idea

## Bắt buộc đọc trước khi chạy

1. `../../../PROJECT.md` — đặc biệt §3 (6 pillar), §7 (content matrix), §11 (objectives), §18 (anti-duplication), §26 (AI Content Layer Model — "Human Layer")
2. `../../../knowledge/content-pillars.md`
3. `../../../knowledge/audience.md`
4. `../../../knowledge/brand.md`
5. `../../../engine/content-matrix.md` — gồm mục "AI Content Level & Human Layer"
6. `../../../data/content-index.csv` — để biết content đã có, tránh trùng (xem §18 trong PROJECT.md)
7. `../../../knowledge/philosophy.md` — mục "Quan điểm cá nhân của Trực (từ Calibration)": quan điểm lặp lại nhiều lần, câu hỏi lớn đang theo đuổi, điểm khác biệt định vị — ưu tiên đề xuất idea chạm được vào các điểm này khi tự nhiên phù hợp, không ép
8. `../../../knowledge/my-stories.md` — biết sẵn có story thật nào có thể làm authority point cho idea

## Việc phải làm

Đề xuất đúng **5 content idea**, KHÔNG random — mỗi idea phải là một điểm khác nhau trên Content Matrix (Pillar × Topic × Angle × Structure × Audience × Objective), và tổng thể 5 idea nên đa dạng pillar/objective, không dồn cả 5 vào cùng 1 pillar trừ khi user yêu cầu tập trung 1 pillar cụ thể.

**Không mặc định mọi idea phải sâu/triết học.** Cho phép đề xuất đủ dải: Practical AI (L1), AI × Workflow/Cách học (L2), AI × Con người/Chánh kiến (L3), và các pillar khác (chanh-kien, work, growth, mind, books) — một tutorial thực dụng thuần túy (vd: "cách dùng tính năng X của ChatGPT") là một idea hợp lệ, không cần ép philosophical.

Nếu idea thuộc dạng AI thực dụng (tool/feature/prompt/workflow/automation cụ thể), xác định thêm:
- **AI Content Level:** `L1 Practical AI` | `L2 AI × Work/Learning` | `L3 AI × Human/Chánh kiến` (xem `PROJECT.md` §26)
- Nếu L1 hoặc L2, thêm **Human Layer:** 1 câu mô tả lớp liên hệ tới con người (xem 10 loại trong `engine/content-matrix.md`) — không gượng ép; nếu không có Human Layer tự nhiên, ghi `HUMAN LAYER NOT NECESSARY` thay vì cố nhét vào. Nếu L3, không cần field riêng — Human Layer chính là Big Idea của idea đó.

Trước khi chốt 5 idea, đọc nhanh `data/content-index.csv`: nếu một ý tưởng định đề xuất đã trùng Big Idea với content đã có (cùng luận điểm cốt lõi, không chỉ khác câu chữ), loại bỏ hoặc đổi angle rõ rệt. **Bỏ qua mọi entry có ID `TEST-*`** khi kiểm tra trùng — đó là dữ liệu smoke test, không phải content thật (xem `PROJECT.md` mục 16).

Nếu một idea cần trải nghiệm cá nhân cụ thể để làm điểm authority, kiểm tra `knowledge/my-stories.md` — nếu không có tư liệu tương ứng, vẫn có thể đề xuất idea (không bắt buộc có story) nhưng ghi chú `PERSONAL STORY NEEDED` nếu idea đó phụ thuộc vào 1 trải nghiệm cụ thể chưa có. Nếu story tương ứng có gắn `STORY NEEDS DETAIL`, coi như tương đương chưa có — vẫn cần `PERSONAL STORY NEEDED`.

Khi phù hợp, ưu tiên (không bắt buộc mọi idea) neo idea vào dữ liệu calibration thật trong `philosophy.md`: một quan điểm lặp lại nhiều lần, một EMERGING FRAMEWORK đã có ≥2 bằng chứng, một niềm tin muốn phản biện, hoặc OPEN QUESTION đang theo đuổi — đây là chỗ Content OS có thể đề xuất idea mang dấu ấn cá nhân thật thay vì idea chung chung đúng pillar nhưng ai viết cũng được.

**Chưa viết full script** — đây chỉ là bước đề xuất ý tưởng.

## Format output — cho MỖI idea trong 5 idea

```
### Idea N: [Working title ngắn]

- **Topic:** 
- **Pillar:** (code: chanh-kien | ai-human | work | growth | mind | books)
- **Big Idea:** (1 câu, luận điểm trung tâm)
- **Audience:** (phân khúc cụ thể)
- **Angle:** 
- **Recommended Structure:** (1 trong 12 code, xem engine/viral-structures.md)
- **Primary Objective:** (viral | authority | trust | education | engagement | community | thought-leadership | conversion | affiliate | experiment)
- **Hook gợi ý:** (1 câu hook mẫu, chưa cần Top 3 — đó là việc của /ck-script)
- **Why this matters:** (1-2 câu giải thích vì sao idea này đáng làm ngay bây giờ — với idea L1/L2 không bắt buộc phải liên hệ Chánh kiến trực tiếp, "hữu ích/dễ tiếp cận/mở audience mới" là lý do hợp lệ)
- **AI Content Level:** (chỉ điền nếu idea là AI tool/feature/workflow cụ thể — L1 | L2 | L3)
- **Human Layer:** (chỉ điền nếu có AI Content Level L1/L2 — 1 câu, hoặc `HUMAN LAYER NOT NECESSARY`)
- **Brand Fit Score:** X/5
- **Viral Potential:** X/5
- **Authority Potential:** X/5
- **Affiliate Potential:** X/5 hoặc "Không áp dụng" nếu không có sản phẩm liên quan tự nhiên
```

Sau 5 idea, thêm 1 dòng tóm tắt: idea nào đề xuất ưu tiên làm trước và vì sao (1-2 câu).

## Ràng buộc

- Không bịa số liệu/nghiên cứu để làm "Why this matters" nghe thuyết phục hơn — nếu cần dẫn chứng factual, đánh dấu `NEEDS_VERIFICATION`.
- Không đề xuất idea lệch định vị "Chánh kiến trong thời đại AI" chỉ vì đang trend.
- Đọc `../../../engine/chanh-kien-filter.md` nếu Big Idea có vẻ dễ bị overclaim — điều chỉnh trước khi đưa vào output.
