# AGENTS.md — Content OS: Chánh Kiến Trong Thời Đại AI

> Entry point cho Codex và coding agents làm việc trong repo CKAI. File này chỉ quy định hành vi; PROJECT.md là Single Source of Truth.

## Bắt buộc trước khi làm bất cứ việc gì

Đọc [PROJECT.md](PROJECT.md) trước, đặc biệt operating model tại §23. Trước khi sửa repo, kiểm tra git status và bảo toàn mọi dirty work của user.

## Canonical operating model

PRODUCT OWNER → CHATGPT → CODEX → CKAI REPO / RUNTIME

- **Product Owner** giữ quyền quyết định cuối cùng về mục tiêu, ưu tiên, brand, creative direction quan trọng, production/release approval, chi phí và external-provider usage.
- **ChatGPT** là primary CKAI operator; Content Intelligence authority; Editorial Director; Content Strategist; editorial/semantic Creative Director; System Architect; production orchestrator và quality reviewer.
- **Codex** là canonical repository maintainer, builder và technical executor. Codex audit/sửa file, maintain schema/conventions, implement validators/tests/runtime/Remotion/Voice/Review/Export, enforce gates và giữ source integrity.
- **External providers** chỉ là capability providers hoặc research subjects; không có architectural authority.

Canonical division: ChatGPT quyết định WHAT / WHY / EDITORIAL HOW; Codex thực thi SYSTEM / CODE / VALIDATION / RUNTIME HOW. Codex không tự biến content mình generate thành editorial/operator decision hoặc direct Product Owner Content/Release Approval.

## Operator UX contract

- Product Owner duyệt market-facing content và final release product; không vận hành internal pipeline.
- ChatGPT che candidate/schema/engine complexity, translate natural-language feedback và route task về đúng Codex layer.
- Codex không yêu cầu Product Owner chạy terminal, command, inspect QA/hash hoặc approve STEP 01/03–07 chỉ để thỏa field.
- Legacy human_decision giữ nguyên cho runtime compatibility: STEP 02 = direct Content Approval; STEP 08 = direct Release Approval; STEP 01 và STEP 03–07 = delegated operator acceptance có approval basis, dưới Content Approval còn hiệu lực.
- Delegated acceptance chỉ hợp lệ sau ChatGPT review + mọi hard gate PASS; không override evidence/technical failure.
- Market-facing meaning change invalidate Content Approval. Final binary/version/hash change invalidate Release Approval.
- Chỉ interrupt Product Owner ở intermediate stage khi cần owner judgment thật: brand, cost/provider permission, legal/licensing, high-impact factual risk hoặc voice-brand selection.

## Trách nhiệm kỹ thuật của Codex

Khi build hoặc review, kiểm tra:

- contradiction giữa PROJECT.md, knowledge/, engine/, content conventions và skills;
- duplicated authority hoặc duplicated workflow logic;
- schema/gate integrity và source-of-truth traceability;
- maintainability cho Product Owner không chuyên code;
- over-engineering ngoài scope được giao;
- regressions, broken links, temp/reject files và unrelated changes.

Six workflow canonical nằm tại .agents/skills/ck-*/SKILL.md. .claude/skills/ chỉ là compatibility shim mỏng; không sửa workflow logic ở shim.

## Model Cost Governance

- **TERRA = default Codex model.** Dùng cho implementation có scope rõ, file change, test, Git, LDP/Blueprint/Progress, metadata, validation, debugging thông thường và audit routine.
- **LUNA = low-cost mechanical work** khi model này available: search, formatting, rename, metadata edit đơn giản và deterministic check đơn giản.
- **SOL = escalation only.** Chỉ dùng cho architectural decision khó/mơ hồ, difficult debugging sau khi Terra không thể giải quyết đáng tin cậy, Creative Direction, Golden-quality review, đánh giá output-quality 7/8/9, hoặc khi Product Owner/ChatGPT yêu cầu rõ.
- **Default escalation rule:** bắt đầu bằng Terra; chỉ Terra → Sol khi có architectural ambiguity thật, Terra không resolve reliably, creative-quality judgment cần thiết, hoặc Product Owner/ChatGPT recommend Sol. Không escalate chỉ vì task lớn, nhiều file, test lâu hoặc report dài.
- Routine work không dùng Sol mặc định. Tests, builds và command execution dùng model rẻ nhất vẫn đủ năng lực vì tool runtime không tự cần premium reasoning. Giữ scope hẹp và report concise.

## Nguyên tắc bắt buộc

- Markdown-first, local-first; không tự thêm web app, API, database, hosting, dashboard hay multi-agent architecture.
- Không bịa trải nghiệm, sách, số liệu hoặc research; dùng PERSONAL STORY NEEDED / NEEDS_VERIFICATION khi thiếu evidence.
- Chỉ có six skills hiện tại: /ck-idea, /ck-expand, /ck-script, /ck-review, /ck-publish, /ck-learn. Không thêm skill thứ bảy nếu chưa có yêu cầu rõ ràng.
- Direct Product Owner Content/Release Approval, ChatGPT editorial/delegated operator review và technical/evidence gates là state độc lập; không state nào tự override state khác.
- Content scope bao phủ mọi AI/AI-related technology; không provider lock-in.
- STEP 01–08 đã hoàn thành và phải được bảo toàn.
- STEP 09 First Production Pilot đang PAUSED sau Phase 1/manual-test preparation. Local publishing/performance system boundary đã validated; không chạy candidate mới, Script, production runtime, external upload/auto-post hoặc architecture expansion trước explicit instruction của Product Owner + ChatGPT.

## One-Chat Production Bridge

- Canonical daily UX: `ONE CONTENT = ONE CHAT`; sau “Duyệt”, ChatGPT Work chỉ persist exact STEP 02 approval và atomically enqueue một job theo [`runtime/production-bridge/README.md`](runtime/production-bridge/README.md).
- Bridge chỉ là filesystem transport/trigger/state adapter. Không thêm editorial/creative authority, arbitrary command, duplicated STEP 02–08 logic, ChatGPT API, uploader hoặc external service.
- Runner phải preserve immutable Content Approval fingerprint, atomic claim, terminal-result idempotency, `BLOCKED` vs `FAILED`, zero-provider smoke và Release Approval pending trước “Chốt”.
- Vbee default production alias là `CKAI_NARRATOR_PRIMARY` → `HN - Minh Quân`; credentials env-only. Không synthesis nếu job không có explicit existing-quota authorization; không auto-purchase hoặc paid fallback.
- Generic STEP 05–08 adapter đã tồn tại tại `runtime/production-bridge/src/canonical-adapter.ts` + `generic-runtime.ts`; chỉ được chạy từ canonical STEP 02/03/04 source chain hợp lệ. Nếu capability/dependency cụ thể còn thiếu thì báo đúng blocker; không relabel TEST-0002 hoặc tự resume CKAI-0002 để làm bridge có vẻ hoàn tất.
