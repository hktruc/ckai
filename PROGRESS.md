# PROGRESS.md — Nhật ký xây dựng Content OS

> File này ghi lại **tiến trình xây dựng chính hệ thống Content OS** (kiến trúc, skill, knowledge base, calibration) — khác với `data/content-index.csv` (theo dõi từng content) và `insights/` (IP tích lũy từ content). Cập nhật mỗi khi có một cột mốc đáng kể trong việc build/mở rộng agent, không phải mỗi lần sửa nhỏ.

## Timeline

### 2026-08-20 — Khởi tạo MVP
- Dựng kiến trúc từ brief gốc: `PROJECT.md` (Single Source of Truth), `CLAUDE.md`, `AGENTS.md`, `README.md`.
- 5 skill gốc: `/ck-idea`, `/ck-expand`, `/ck-script`, `/ck-review`, `/ck-learn`.
- Cấu trúc thư mục: `knowledge/`, `engine/`, `content/{ideas,scripts,approved,published}/`, `data/`, `insights/`.

### 2026-08-20 — Dọn dữ liệu smoke test
- Phát hiện `CKAI-0001` là dữ liệu test dựng trong lúc build MVP, không phải content thật.
- Đổi thành `TEST-0001`; thêm quy tắc loại trừ `TEST-*` khỏi anti-duplication, performance analysis, phát hiện pattern, và đếm sản lượng — cập nhật ở `PROJECT.md` + 4 skill liên quan.
- Quyết định: không thêm cột riêng cho test/production trong CSV — dùng prefix ID là đủ (tránh over-engineer).

### 2026-08-20 → 2026-08-21 — Calibration (4 round phỏng vấn)
- Phỏng vấn trực tiếp Trực qua voice-to-text, 4 round, giữ **nguyên văn** trong `knowledge/calibration-raw.md`.
- Tổng hợp có phân loại rõ (BELIEF / EXPERIENCE / PERSONAL STORY / HYPOTHESIS / EMERGING FRAMEWORK / OPEN QUESTION) vào `knowledge/philosophy.md`.
- 5 personal story thật được ghi vào `knowledge/my-stories.md` (1 story gắn `STORY NEEDS DETAIL` vì chưa đủ chi tiết để kể).
- Tạo mới `knowledge/voice-and-style.md` — suy hoàn toàn từ calibration thật, không viết generic.
- Trực chủ động dừng calibration sau Round 4 — có thể tiếp tục sau nếu cần.

### 2026-08-21 — Content thật đầu tiên: CKAI-0001
- `/ck-idea` (bản đã calibrate) → 5 idea mới, neo vào dữ liệu calibration thật thay vì chung chung.
- `/ck-script` cho Idea 1 "Bức bình phong" → `CKAI-0001`.
- `/ck-review`: verdict đầu REVISE (overclaim ở Key Sentence — viết như quy luật phổ quát thay vì quan sát cá nhân) → sửa đúng 1 chỗ → PUBLISH → `approved`.

### 2026-08-21 — Nguyên tắc chiến lược mới: AI Content Layer Model ("Human Layer")
- Bổ sung mô hình `TOOL → USE → HUMAN LAYER` và 3 tầng L1 (Practical AI) / L2 (AI×Work-Learning) / L3 (AI×Human-Chánh kiến).
- Cập nhật `PROJECT.md` §26, `knowledge/content-pillars.md`, `engine/content-matrix.md`, `knowledge/affiliate.md`.
- Cập nhật `/ck-idea`, `/ck-script`, `/ck-review` để hỗ trợ đúng content AI thực dụng — không ép triết lý hóa, không bắt buộc nhắc "Chánh kiến" ở L1/L2.

### 2026-08-21 — Test đầu tiên của AI Content Layer Model: CKAI-0002
- `/ck-script` cho content Level 1 Practical AI: "1 prompt dọn sạch tài liệu thành Markdown".
- `/ck-review`: verdict đầu REVISE (hook hứa "4 dòng" nhưng prompt thật có 5 câu lệnh) → sửa → PUBLISH → `approved`.
- Xác nhận: hệ thống biết khi nào giữ Human Layer (ranh giới Judgment có thật) thay vì lạm dụng `HUMAN LAYER NOT NECESSARY`.

### 2026-08-21 — Chuẩn hóa lifecycle production
- `/ck-review` giờ **tự động** move file `approved` sang `content/approved/` khi verdict PUBLISH — không hỏi lại mỗi lần.
- Di chuyển `CKAI-0001` và `CKAI-0002` vào `content/approved/`.

### 2026-08-21 — Skill thứ 6: `/ck-publish` (Delivery Learning)
- Bổ sung workflow đóng hồ sơ production sau khi Trực tự quay & tự đăng video — lưu transcript thực tế nguyên văn, so sánh với approved script (delivery-delta: CUT/ADD/REPHRASE/REORDER/LENGTH DELTA/VOICE OBSERVATIONS).
- File mới: `insights/voice-observations.md` — 3 cấp Observation / Possible Pattern / Confirmed Voice Pattern, tách biệt hoàn toàn khỏi performance learning (`/ck-learn`).
- `PROJECT.md` §27; cập nhật `CLAUDE.md`, `AGENTS.md`, `README.md` (5 → 6 skill).

### 2026-08-21 — Git & GitHub
- `git init`, commit đầu tiên (42 file).
- Push lên [github.com/hktruc/ckai](https://github.com/hktruc/ckai), branch `main`.

### 2026-08-29 — Master Blueprint + QLDA Web Status Board
- Tạo `MASTER_BLUEPRINT.md` v1.0 làm bản đồ tổng công trình theo hệ mã canonical `ARC → PHASE → TASK → Evidence`.
- Thiết lập 8 architecture blocks: Governance & Content OS; Visual Production System; Creative Quality & Art Direction; Audio/Music/Voice; Content Modes; Production Consistency & Generalization; Golden Master; Publishing/Delivery/Learning Loop.
- Gắn CKAI-0004 / 0005 / 0006 vào đúng phase như production evidence, không xem là dự án riêng.
- Thêm Risk Register, learning governance, Definition of Done, continuity protocol và priority stack.
- Tạo `index.html` làm Web Status Board, `docs/ckai-master-architecture.svg` làm sơ đồ kiến trúc, và `.github/workflows/deploy-pages.yml` để GitHub Pages tự deploy từ `main`.
- Quy định mới: sau mỗi task đáng kể, phải đồng bộ `MASTER_BLUEPRINT.md` + `PROGRESS.md` + Web Status Board trong cùng work unit.
- Phát hiện remote GitHub trước mốc này đang **stale** so với các report Codex/local mới hơn; mở P0 reconciliation task thay vì giả định trạng thái đã sync.

## Trạng thái hiện tại (snapshot)

- **QLDA canonical map:** `MASTER_BLUEPRINT.md` v1.0.
- **Web Status Board:** `index.html`, auto-deploy qua GitHub Pages workflow.
- **Architecture:** 8 ARC / 31 phase-level workstreams được mã hóa; task chi tiết nằm trong Blueprint.
- **Production evidence:** CKAI-0004 = baseline; CKAI-0005 = generalization/audio learning; CKAI-0006 = practical/consistency test đang active.
- **Current P0:** reconcile local/Codex repo state với GitHub; hoàn tất CKAI-0006; làm rõ Audio Direction V1 trước khi mở Phase 2 Audio Engine.
- **Golden objective:** market-ready ≈ 7+, Golden ≈ 8, aspirational ≈ 9+; chưa coi architecture completeness là hoàn thành dự án.

## Việc có thể làm tiếp

- Đồng bộ toàn bộ implementation/report mới nhất từ local/Codex lên GitHub để đóng risk project-state fragmentation.
- Hoàn tất CKAI-0006 và đưa learning về đúng ARC/PH/T thay vì ghi rời theo video.
- Hoàn thiện Audio Direction + licensed music library; giữ Phase 2 Audio Engine ở trạng thái FROZEN cho tới khi hướng âm thanh đủ rõ.
- Populate Creative North Star / benchmark set để tiến tới Golden Master có tiêu chuẩn đo rõ hơn.
