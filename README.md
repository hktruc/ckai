# Content OS — Chánh Kiến Trong Thời Đại AI

Hệ thống cá nhân hỗ trợ sản xuất video ngắn (Facebook/Reels, mở rộng TikTok/YouTube Shorts sau) xoay quanh định vị **Chánh kiến trong thời đại AI**. Chạy hoàn toàn local bằng Markdown + Claude Code Skills — không web app, không API, không database.

## Bắt đầu từ đâu

Đọc [`PROJECT.md`](PROJECT.md) — đó là Single Source of Truth, mô tả toàn bộ mục tiêu, định vị, 6 trụ cột nội dung, brand voice, content matrix, video structures, hook engine, Chánh Kiến Filter, và workflow.

## Workflow hằng ngày (tóm tắt)

```
/ck-idea → chọn idea → /ck-expand (nếu cần) → chọn angle → /ck-script → /ck-review
    → tự đọc & chỉnh sửa → quay video thật → tự đăng
    → /ck-publish (paste transcript thực tế) → nhập performance khi có số liệu → /ck-learn
```

Chi tiết đầy đủ: `PROJECT.md` §21.

## 6 lệnh (`/ck-*`)

| Lệnh | Dùng khi nào |
|---|---|
| `/ck-idea` | Cần 5 gợi ý content mới, chưa có topic cụ thể trong đầu |
| `/ck-expand <topic>` | Đã có topic, cần nhiều góc nhìn (angle) khác nhau để chọn |
| `/ck-script <topic/angle>` | Đã chốt topic/angle, cần script hoàn chỉnh 45–90s |
| `/ck-review` | Đã có script, cần kiểm tra trước khi quay |
| `/ck-publish <CKAI-000N>` | Đã quay & tự đăng xong, cần lưu transcript thực tế + đóng hồ sơ production (không phải đăng bài hộ) |
| `/ck-learn` | Video đã publish, có số liệu performance, cần ghi nhận & học |

## Cấu trúc thư mục

- `knowledge/` — sự thật về brand, audience, philosophy, pillars, stories, books, affiliate, voice-and-style (dữ liệu gốc, không suy luận).
- `engine/` — luật sinh & lọc content (content matrix, structures, hook library, Chánh Kiến Filter, scoring, learning rules).
- `content/` — vòng đời từng content theo Content ID (`ideas/` → `scripts/` → `approved/` → `published/`). Trong `published/`, mỗi ID có 3 file phẳng: script gốc, `_transcript-actual.md`, `_delivery-delta.md`.
- `data/` — `content-index.csv` (index toàn bộ content) và `performance.csv` (số liệu sau publish).
- `insights/` — IP tích lũy: pattern, framework, audience insight, voice-observations (Delivery Learning) phát hiện theo thời gian.
- `.claude/skills/ck-*/` — implementation của 6 skill.

## Nguyên tắc vận hành

- Mọi Content ID dạng `CKAI-000N`, tăng dần. ID dạng `TEST-000N` là dữ liệu smoke test (không phải content thật) — không tính khi chống trùng, phân tích performance, phát hiện pattern, hay đếm số content đã sản xuất (xem `PROJECT.md` mục 16).
- AI không bịa trải nghiệm cá nhân (`PERSONAL STORY NEEDED`) hay số liệu chưa kiểm chứng (`NEEDS_VERIFICATION`).
- Quyết định cuối cùng luôn thuộc về người dùng — AI chỉ hỗ trợ, không tự publish.

Chi tiết đầy đủ mọi quy tắc: xem `PROJECT.md`.
