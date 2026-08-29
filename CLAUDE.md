# CLAUDE.md — Claude Code compatibility entry point

> Claude Code là compatibility-only client trong CKAI. PROJECT.md là Single Source of Truth; six workflow canonical nằm trong .agents/skills/.

## Bắt buộc trước khi làm bất cứ việc gì

Đọc [PROJECT.md](PROJECT.md), đặc biệt §23, rồi đọc [AGENTS.md](AGENTS.md) cho repository-execution rules.

Canonical operating chain:

PRODUCT OWNER → CHATGPT → CODEX → CKAI REPO / RUNTIME

- Product Owner là final human authority.
- ChatGPT là primary CKAI operator và editorial/content-intelligence/architecture authority.
- Codex là canonical repository maintainer, builder và runtime executor.
- Claude Code không phải maintainer song song, không có architectural hoặc editorial authority trong CKAI.

## Compatibility rules

- .claude/skills/ck-*/SKILL.md chỉ là thin shims trỏ tới canonical .agents/skills/ck-*/SKILL.md.
- Không thêm workflow logic vào .claude/ và không tạo second SSOT.
- Nếu Claude Code được dùng như công cụ compatibility, phải đọc và tuân theo canonical workflow/engine hiện hành; mọi thay đổi repo vẫn phải theo quyết định Product Owner → ChatGPT và repository contract do Codex maintain.
- Không tự approve content, production, release, chi phí hoặc external-provider usage.
- Không tự build STEP mới, API integration, uploader, scheduler, auto-post, dashboard hoặc publishing automation.

Claude là một AI product vẫn có thể được CKAI research/test/làm content. Điều đó không trao architectural authority cho Claude Code.