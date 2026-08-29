# Content OS — Chánh Kiến Trong Thời Đại AI

CKAI là **Content Intelligence & Production System** cá nhân cho video ngắn, xoay quanh định vị **Chánh kiến trong thời đại AI**. Hệ thống local-first dùng Markdown, CSV và repo runtime; không bị khóa vào một AI provider.

## Operating model

    PRODUCT OWNER
          ↓
    CHATGPT — Primary CKAI Operator
    Content Intelligence + Editorial + Architecture
          ↓
    CODEX — Canonical Maintainer + Builder + Runtime Executor
          ↓
    CKAI REPO / VIDEO FACTORY
          ↓
    External providers when needed

ChatGPT quyết định WHAT / WHY / EDITORIAL HOW. Codex thực thi SYSTEM / CODE / VALIDATION / RUNTIME HOW. Product Owner giữ direct Content Approval và direct Release Approval; delegated operator review và technical gates là state độc lập. ChatGPT hiện là conversation orchestration layer, không phải runtime API dependency.

Claude, Gemini, ChatGPT, Vbee và các công nghệ AI khác vẫn có thể là research subjects hoặc capability providers. Không provider nào có architectural authority trên CKAI.

## Bắt đầu từ đâu

Đọc [`PROJECT.md`](PROJECT.md) — đó là Single Source of Truth, mô tả toàn bộ mục tiêu, định vị, 6 trụ cột nội dung, brand voice, content matrix, video structures, hook engine, Chánh Kiến Filter, và workflow.

Project-management truth nằm tại [`MASTER_BLUEPRINT.md`](MASTER_BLUEPRINT.md); construction history tại [`PROGRESS.md`](PROGRESS.md); trang theo dõi ghim trình duyệt tại [`ldp.html`](ldp.html). Local repository là implementation truth, GitHub là published mirror.

## DAILY USE — ONE CONTENT = ONE CHAT

    CHATGPT DESKTOP → PROJECT CKAI → NEW CHAT
      → Ý TƯỞNG → CONTENT → “DUYỆT.”
      → BACKGROUND PRODUCTION → FACEBOOK REVIEW PACKAGE
      → “CHỐT.” → MANUAL FACEBOOK POST

Mỗi video dùng một chat theo subject. Chat đó giữ toàn bộ idea, iterations, Content Approval, production status, review, Release Approval và Facebook Package; repo là SSOT xuyên chat. Product Owner không mở Codex, terminal, engine UI hoặc một production/release chat riêng trong normal use.

Sau “Duyệt”, ChatGPT Work persist exact approved STEP 02 artifact và ghi một local job. Runner nền đọc job/result theo [`runtime/production-bridge/README.md`](runtime/production-bridge/README.md). Nếu platform không tự push completion vào chat, Product Owner chỉ cần hỏi “Xong chưa?” trong cùng chat; Work đọc result hiện tại và trả package. Không ChatGPT API hoặc fake push notification.

Review Package vẫn `PENDING_RELEASE_APPROVAL`. “Chốt” chỉ hợp lệ với exact version + SHA-256 và chuyển package thành `READY_TO_PUBLISH`; Product Owner tự đăng Facebook. Sau xác nhận upload, `/ck-publish` đóng delivery record và package chuyển `PUBLISHED`. Ngày đăng, URL và external ID được giữ blank/null khi chưa có. Default production voice là Vbee `HN - Minh Quân` qua alias `CKAI_NARRATOR_PRIMARY`; không random, auto-buy credit hoặc paid fallback.

## Product Owner UX — chỉ hai primary checkpoints

    “Tôi có ý này...”
      → ChatGPT research / verify / editorialize
      → market-facing content
    “Duyệt.” — Content Approval
      → Codex + CKAI factory chạy STEP 03–08
      → ChatGPT review creative output + system hard gates
      → Product Owner nhận review video / release candidate
    “Chốt.” — Release Approval
      → exact final master
      → Product Owner tự đăng Facebook

Product Owner duyệt sản phẩm, không duyệt quy trình. Candidate state, evidence ledger, Storyboard, Visual Direction, QA và hashes vẫn tồn tại nhưng được ChatGPT/Codex xử lý nội bộ.

Intermediate STEP 01 và STEP 03–07 dùng delegated operator acceptance dưới Content Approval còn hiệu lực; legacy human_decision field được giữ cho compatibility. STEP 02 human_decision approved là direct Content Approval. STEP 08 human_decision approved là direct Release Approval. Hard gates không bị làm yếu.

Nếu downstream đổi Spoken Copy, factual claim, CTA, key on-screen assertion hoặc caveat meaning, Content Approval stale và phải duyệt lại. Nếu final binary/version/hash đổi sau Release Approval, Release Approval stale và phải chốt lại.

Normal setup:

- ChatGPT Desktop / Project CKAI là primary interface.
- Mobile dùng cho ideation/content review và video review khi asset accessible.
- Local computer là Codex/Remotion/Voice/FFmpeg production workshop.
- Không cần terminal hoặc GitHub trong daily UX.
- Facebook posting là manual; không API/OAuth/scheduler/auto-post.

Chi tiết đầy đủ: PROJECT.md §21 và §23.
Canonical pipeline: `CONTENT INTELLIGENCE → SCRIPT → STORYBOARD → VISUAL DIRECTOR → ANIMATION → VOICE → FINAL REVIEW / FINISHING → EXPORT → PUBLISH → LEARNING`. Local system mechanics đã tồn tại end-to-end: Facebook package/release lifecycle tại [`runtime/publishing/`](runtime/publishing/) và validated performance ingestion tại [`runtime/learning/`](runtime/learning/). Upload vẫn manual; real learning vẫn chờ metrics thật.

## Tuyệt chiêu AI — intelligence trước production

```text
AITIP candidate → DISCOVER → VERIFY → SCORE → TESTABILITY → SELECT → TEACH
    → ChatGPT operator selection/delegated handoff → cấp CKAI-* → market-facing content approval ở Script
```

Spec: [`engine/ai-tips-intelligence.md`](engine/ai-tips-intelligence.md) · Template/example: [`content/candidates/`](content/candidates/)

## Script Engine — STEP 02

```text
eligible content → script → duration/evidence check → ChatGPT editorial review → Product Owner Content Approval → approved script → STOP
```

Spec: [`engine/script-engine.md`](engine/script-engine.md) · Template/proof: [`content/scripts/`](content/scripts/)

## Storyboard Engine — STEP 03

```text
approved script → input check → scenes/timing/semantic requirements → ChatGPT review/delegated acceptance → Visual Director handoff → STOP
```

Spec: [`engine/storyboard-engine.md`](engine/storyboard-engine.md) · Template/proof: [`content/storyboards/`](content/storyboards/)

STEP 03 không thêm command mới; storyboard được tạo theo explicit request bằng engine/template.

## Visual Director — STEP 04

```text
approved storyboard → visual input → language/concept/composition/assets → ChatGPT review/delegated acceptance → Animation handoff → STOP
```

Spec: [`engine/visual-director.md`](engine/visual-director.md) · Template/proof: [`content/visual-directions/`](content/visual-directions/)

STEP 04 không thêm command mới; STEP 05 dùng handoff này làm production input gate.

## Animation Engine — STEP 05

```text
approved Visual Direction → manifest/timeline/assets → Remotion implementation → technical QA + ChatGPT delegated acceptance → Voice handoff → STOP
```

Spec: [`engine/animation-engine.md`](engine/animation-engine.md) · Artifact/proof: [`content/animations/`](content/animations/) · Runtime: [`video-factory/animation/`](video-factory/animation/)

STEP 05 không thêm command mới; technical proof chạy local và handoff sang STEP 06 qua verified source chain.

## Voice Engine — STEP 06

```text
approved Animation → verified input → Voice Plan/provider/timing/QA → ChatGPT delegated acceptance → Final Review handoff → STOP
```

Spec: [`engine/voice-engine.md`](engine/voice-engine.md) · Plan/proof: [`content/voices/`](content/voices/) · Runtime: [`video-factory/voice/`](video-factory/voice/)

Vbee là preferred provider nhưng cần explicit quota permission; Piper local chỉ là fallback kỹ thuật/proof theo license boundary. STEP 06 không thêm command mới; STEP 07 xác minh và dùng output này nhưng không làm yếu Voice gate.

## Final Review & Finishing Engine — STEP 07

```text
verified Voice output → AV/caption/finishing QA → ChatGPT delegated acceptance → Export handoff → STOP
```

Spec: [`engine/final-review-engine.md`](engine/final-review-engine.md) · Artifact/proof: [`content/reviews/`](content/reviews/) · Runtime: [`video-factory/review/`](video-factory/review/)

Review preview không phải Final Export. STEP 07 READY cần verified source + mọi hard gate PASS + ChatGPT delegated operator acceptance. Product Owner không mặc định duyệt STEP 07 artifact; direct release checkpoint ở STEP 08.

## Final Export Engine — STEP 08

```text
verified STEP07 handoff → mechanical export/equivalence/QA → exact master/hash → Product Owner Release Approval → Publish handoff → STOP
```

Spec: [`engine/final-export-engine.md`](engine/final-export-engine.md) · Artifact/proof: [`content/exports/`](content/exports/) · Runtime: [`video-factory/export/`](video-factory/export/)

Final Export dùng exact hash-verified review preview, không creative rerender; full-timeline normalized SSIM và decoded-audio consistency là hard encode-integrity checks. TEST-0002 có real MP4 proof nhưng Publish luôn `BLOCKED`. Không uploader, scheduler, platform API hoặc auto-post.

STEP 09 First Production Pilot đang **PAUSED** sau Phase 1/manual-test preparation. AITIP-0001 được preserve nhưng manual test không còn là active next action; chờ Product Owner + ChatGPT explicit instruction.

## Current production evidence

- `CKAI-0004` — `Production Baseline V1`, complete.
- `CKAI-0005` — Generalization Test 01 PASS; Final Audio V2 published; not Golden.
- `CKAI-0006` — V1.2 locked as `Practical Visual Baseline V1`; Product Owner ≈6/10, below Market Ready and not Golden; baseline preserves practical visual learning, while voice + music remain accepted; not published unless separately confirmed.
- CKAI Music Library V1 — 22 canonical local tracks across six families, license/provenance/local-asset QA PASS, ready for production use.
- Audio Direction V1 — in progress, not fully validated. Phase 2 Audio Engine — frozen by dependency.

## 6 lệnh (`/ck-*`)

| Lệnh | Dùng khi nào |
|---|---|
| `/ck-idea` | Cần 5 gợi ý content mới, chưa có topic cụ thể trong đầu |
| `/ck-expand <topic>` | Đã có topic, cần nhiều góc nhìn (angle) khác nhau để chọn |
| `/ck-script <topic/angle>` | Input hợp lệ, cần canonical script estimate ≤55 giây |
| `/ck-review` | Cần editorial verdict; Product Owner Content Approval vẫn là gate riêng |
| `/ck-publish <CKAI-000N>` | Product Owner đã xác nhận asset/video published; cần lưu final delivered transcript + đóng record (không upload/render) |
| `/ck-learn` | Video đã publish, có số liệu performance, cần ghi nhận & học |

## Cấu trúc thư mục

- `knowledge/` — sự thật về brand, audience, philosophy, pillars, stories, books, affiliate, voice-and-style (dữ liệu gốc, không suy luận).
- `engine/` — luật sinh & lọc content, gồm AI Tips Intelligence, Script, Storyboard, Visual, Animation, Voice và Final Review Engine.
- `content/` — lifecycle Content ID dùng `ideas/`, `scripts/`, `approved/`, `storyboards/`, `visual-directions/`, `animations/`, `voices/`, `reviews/`, `exports/`, rồi `published/` sau publish confirmation; reference assets/provenance dài hạn nằm tại `content/references/`, gồm CKAI Music Library V1 ở `content/references/audio/music-library-v1/`.
- `video-factory/animation/` — Remotion/TypeScript executable STEP 05 và Voice preview composition.
- `video-factory/voice/` — provider abstraction, normalization, cache, timing/assembly/QA executable STEP 06; generated audio không commit.
- `video-factory/review/` — deterministic captions, local finishing-audio policy, review QA và Export handoff gate của STEP 07; review preview không phải Final Export.
- `video-factory/export/` — mechanical canonical master encode, media inspection, source-equivalence, Release Manifest và Publish handoff gate của STEP 08.
- `data/` — `content-index.csv` (index toàn bộ content) và `performance.csv` (số liệu sau publish).
- `insights/` — IP tích lũy: pattern, framework, audience insight, voice-observations (Delivery Learning) phát hiện theo thời gian.
- .claude/skills/ck-*/ — compatibility shims mỏng trỏ về .agents; không chứa workflow logic.
- .agents/skills/ck-*/ — canonical source của 6 workflow, Codex dùng trực tiếp.

## Nguyên tắc vận hành

- Mọi Content ID dạng `CKAI-000N`, tăng dần. ID dạng `TEST-000N` là dữ liệu smoke test (không phải content thật) — không tính khi chống trùng, phân tích performance, phát hiện pattern, hay đếm số content đã sản xuất (xem `PROJECT.md` mục 16).
- Candidate Tuyệt chiêu AI dùng `AITIP-000N`; `recommend` không đồng nghĩa approved và không tự nhận Content ID.
- AI không bịa trải nghiệm cá nhân (`PERSONAL STORY NEEDED`) hay số liệu chưa kiểm chứng (`NEEDS_VERIFICATION`).
- Product Owner giữ final human authority; ChatGPT giữ editorial/content-intelligence authority; Codex giữ repository/runtime authority. Không authority nào override hard factual/technical failure.
- Script generated/editorial pass chưa phải Content Approval; chỉ Product Owner “Duyệt” exact market-facing content mới mở production.
- STEP 03–07 là internal machinery: ChatGPT delegated acceptance + mọi hard gate PASS; Product Owner không mặc định inspect từng artifact.
- Intermediate delegated acceptance không override proof/evidence/quality/source gates và phải reference Content Approval còn hiệu lực.
- Animation/Voice/Review/Export vẫn direct-validate upstream sources/hashes; delegated acceptance không biến forged/stale READY thành hợp lệ.
- Downstream market-facing meaning change invalidate Content Approval; final binary/version/hash change invalidate Release Approval.
- Final Review không silent-rewrite upstream: semantic issue được route về Script/Storyboard/Visual/Animation/Voice; chỉ finishing issue sửa local. Export READY là derived hard conjunction, delegated operator acceptance không override failure; reverse-audit luôn `BLOCKED`.

Chi tiết đầy đủ mọi quy tắc: xem `PROJECT.md`.
