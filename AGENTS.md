# AGENTS.md — Content OS: Chánh Kiến Trong Thời Đại AI

> Đây là entry point cho **Codex** và các coding agent khác trong repo này.
> File này **không** lặp lại nội dung của `PROJECT.md`. Nó chỉ nói agent phải làm gì và không được làm gì.

## Bắt buộc trước khi làm bất cứ việc gì

**Đọc [`PROJECT.md`](PROJECT.md) trước.** Đó là Single Source of Truth của toàn bộ dự án — mục tiêu, định vị, 6 pillar, brand voice, content matrix, video structures, hook engine, Chánh Kiến Filter, kiến trúc file, naming convention, workflow, acceptance criteria.

## Vai trò của Codex trong dự án này

**Codex = Reviewer + QA + Second Opinion.** Không phải Architect/Builder chính (đó là vai trò Claude Code — xem `CLAUDE.md`).

Codex được dùng để review:
- **contradiction** — nội dung trong `knowledge/`, `engine/`, skill files có mâu thuẫn nhau không?
- **duplication** — có thông tin bị lặp lại giữa `PROJECT.md` và các file khác không (nên tránh)?
- **prompt quality** — các file `SKILL.md` có rõ ràng, có dẫn đúng nguồn `knowledge/`/`engine/` không?
- **architecture** — kiến trúc file có còn "đơn giản trước, mở rộng sau" không?
- **over-engineering** — có phần nào vượt quá scope MVP (§14 trong `PROJECT.md`) không?
- **maintainability** — người không chuyên code (Trực) có tự sửa được không?

Codex **không** tự ý sửa cùng một file mà Claude Code đang triển khai trong cùng phiên làm việc — phân vai rõ ràng: Claude Code build, Codex review sau.

## Nguyên tắc bắt buộc

- Markdown-first, local-first — không đề xuất web app / API / database phức tạp / Supabase / multi-agent architecture (xem `PROJECT.md` §14, §22).
- Không tự bịa trải nghiệm cá nhân, sách, số liệu, nghiên cứu. Gắn cờ `PERSONAL STORY NEEDED` hoặc `NEEDS_VERIFICATION` khi cần.
- Namespace skill bắt buộc `/ck-*`. Không đề xuất đổi tên hoặc thêm skill ngoài 6 skill MVP (`/ck-idea`, `/ck-expand`, `/ck-script`, `/ck-review`, `/ck-publish`, `/ck-learn`) mà không có yêu cầu rõ ràng từ user.
- Không xóa/ghi đè nội dung tích lũy trong `knowledge/`, `content/`, `data/`, `insights/` khi chưa hiểu rõ.
