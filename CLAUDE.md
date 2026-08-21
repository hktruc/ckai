# CLAUDE.md — Content OS: Chánh Kiến Trong Thời Đại AI

> Đây là entry point cho **Claude Code** trong repo này.
> File này **không** lặp lại nội dung của `PROJECT.md`. Nó chỉ nói Claude Code phải làm gì và không được làm gì khi làm việc trong repo.

## Bắt buộc trước khi làm bất cứ việc gì

**Đọc [`PROJECT.md`](PROJECT.md) trước.** Đó là Single Source of Truth: mục tiêu, định vị, 6 pillar, brand voice, content matrix, video structures, hook engine, Chánh Kiến Filter, kiến trúc file, naming convention, workflow, acceptance criteria — tất cả nằm ở đó.

Khi chạy bất kỳ skill nào trong `.claude/skills/ck-*/`, skill đó sẽ tự trỏ tới đúng file `knowledge/` và `engine/` cần đọc thêm — không cần đọc toàn bộ repo mỗi lần.

## Vai trò của Claude Code trong dự án này

**Claude Code = Architect + Builder.** Dùng để xây kiến trúc, xây/sửa Skills, chỉnh prompt, phát triển feature, refactor, và vận hành Content OS hằng ngày (chạy `/ck-idea`, `/ck-expand`, `/ck-script`, `/ck-review`, `/ck-publish`, `/ck-learn`).

Codex đóc vai Reviewer/QA/Second Opinion (xem `AGENTS.md`) — không tự ý làm trùng việc của Codex.

## Nguyên tắc bắt buộc khi làm việc trong repo

- **Markdown-first, local-first.** Không đề xuất web app, Facebook API, OpenAI API, Claude API, database phức tạp, Supabase, hosting, hay multi-agent architecture — repo này chủ động KHÔNG dùng các thứ đó ở giai đoạn MVP (xem `PROJECT.md` §14).
- **Đơn giản trước, mở rộng sau.** Không over-engineer. Nếu một thay đổi có thể làm bằng cách sửa 1 file Markdown thay vì thêm hệ thống mới — chọn cách đơn giản.
- **Không tự bịa thông tin cá nhân, trải nghiệm, sách đã đọc, dữ liệu nghiên cứu hoặc số liệu.**
  - Thiếu trải nghiệm cá nhân → đánh dấu `PERSONAL STORY NEEDED`.
  - Claim cần kiểm chứng (số liệu, nghiên cứu, sự kiện hiện tại...) → đánh dấu `NEEDS_VERIFICATION`.
- **Namespace skill:** mọi skill riêng của project phải dùng prefix `/ck-*`. MVP hiện tại chỉ có đúng 6 skill: `/ck-idea`, `/ck-expand`, `/ck-script`, `/ck-review`, `/ck-publish`, `/ck-learn`. Không tự ý tạo thêm skill khác trừ khi user yêu cầu rõ ràng.
- **Không xóa hoặc ghi đè** nội dung trong `knowledge/`, `content/`, `data/`, `insights/` nếu chưa đọc và hiểu nó — đây là dữ liệu tích lũy dài hạn của user, không phải scaffold có thể tái tạo.
- **Chánh Kiến Filter áp dụng cho chính hành vi của Claude Code**, không chỉ cho content: không khẳng định quá mức, không bịa nguồn, không cherry-pick khi báo cáo kết quả.

## Khi được yêu cầu chạy workflow

Thứ tự chuẩn: `/ck-idea` → chọn idea → `/ck-expand` (nếu cần) → chọn angle → `/ck-script` → `/ck-review` → dừng lại chờ human review (Trực quay video thật và tự đăng) → `/ck-publish` với transcript thực tế (đóng hồ sơ production, không phải đăng bài hộ) → sau khi có số liệu, nhận `/ck-learn` với performance thật.

Claude Code không tự "publish" hay tự quyết định content nào là bản cuối — quyết định cuối luôn thuộc về Trực.
