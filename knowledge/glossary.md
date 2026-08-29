---
type: knowledge
scope: glossary
---

# Glossary — thuật ngữ & mã dùng trong hệ thống

Tra nhanh mọi code/field dùng xuyên suốt Content OS, để không phải đọc lại toàn bộ `PROJECT.md` mỗi lần.

## CKAI operating authority

- **Product Owner:** final human authority cho mục tiêu, ưu tiên, brand, market-facing Content Approval, final Release Approval, cost và provider usage; không vận hành internal pipeline.
- **ChatGPT:** primary CKAI operator; Content Intelligence, editorial, creative-semantic và architecture authority.
- **Codex:** canonical repository maintainer, builder và runtime/technical executor.
- **External provider:** capability provider hoặc research subject; không có CKAI architectural authority.
- **Claude Code:** optional compatibility client; không phải maintainer/editorial authority song song.

System/technical gate, ChatGPT editorial/operator review và hai Product Owner checkpoints là state độc lập; không state nào tự override factual/technical hard failure.

## Operator UX terms

- **Content Approval:** direct Product Owner approval của exact market-facing content: angle, hook, Spoken Copy, critical claims, CTA và meaning-critical on-screen text/caveat.
- **Release Approval:** direct Product Owner approval của exact final release candidate, bound vào release version + SHA-256.
- **Delegated operator acceptance:** ChatGPT intermediate acceptance dưới Content Approval còn hiệu lực; dùng STEP 01 và STEP 03–07, không mặc định interrupt Product Owner.
- **Owner-interrupt condition:** brand-sensitive choice, cost/provider permission, legal/licensing uncertainty, high-impact factual risk, voice-brand selection hoặc hai meaning direction cần Product Owner chọn.
- **Content Approval stale:** downstream đã đổi Spoken Copy, factual claim, CTA, key on-screen assertion hoặc caveat meaning; handoff phải BLOCK và duyệt content lại.
- **Release Approval stale:** final binary/content/version/hash đổi sau approval; phải revalidate và chốt lại.
- **Three-phrases UX:** “Tôi có ý này...” → “Duyệt.” → “Chốt.”; north star, không phải literal parser/API requirement.
- **One Content = One Chat:** mỗi content/video dùng một Project CKAI chat cho idea → content → Content Approval → status/review → Release Approval → Facebook Package; repo vẫn là cross-chat SSOT.
- **Production Job:** immutable local JSON trigger trỏ approved STEP 02 source + SHA-256 + Content Approval basis; không chứa duplicated script hoặc secret.
- **Local Runner:** thin filesystem transport/trigger/job-state adapter; không có editorial/creative/release authority.
- **Review Package:** final-quality candidate có thể giao Product Owner xem nhưng luôn `PENDING_RELEASE_APPROVAL` trước “Chốt”.
- **Facebook Package:** folder market-facing gồm exact review/release MP4, approved caption/headline, optional deterministic cover và manifest; không bao gồm auto-post.
- **BLOCKED vs FAILED:** `BLOCKED` là hard gate/owner decision hợp lệ đang thiếu; `FAILED` là lỗi thực thi kỹ thuật.

Legacy human_decision mapping:

- STEP 01: delegated operator authorization, chưa phải Content Approval.
- STEP 02: direct Product Owner Content Approval.
- STEP 03–07: delegated operator acceptance, phải ghi approval basis/reference trong notes.
- STEP 08: direct Product Owner Release Approval.

Delegated acceptance và direct approval đều không override hard technical/evidence gates; fixture/reverse-audit not-applicable vẫn không có production authority.
## Pillar codes

`chanh-kien` · `ai-human` · `work` · `growth` · `mind` · `books` — chi tiết: [`content-pillars.md`](content-pillars.md)

## Structure codes (12 cấu trúc biên tập + 1 tutorial flow)

| Code | Tên |
|---|---|
| `paradox-insight` | Nghịch lý → Giải thích → Insight |
| `problem-agitate-twist-solution` | Problem → Agitate → Twist → Solution |
| `result-curiosity-reveal` | Result → Curiosity Gap → Reveal |
| `story-conflict-lesson` | Story → Conflict → Realization → Lesson |
| `mistake-consequence-fix` | Sai lầm → Hậu quả → Cách đúng |
| `a-vs-b-insight` | A vs B → Khác biệt → Insight |
| `judge-rejudge-reveal` | Situation → Judge → New Information → Rejudge → Reveal |
| `myth-truth-explanation` | Myth → Truth → Explanation |
| `levels-progression` | Levels → Progression → Highest Level |
| `question-exploration-answer` | Question → Exploration → Answer |
| `prediction-reason-implication` | Prediction → Reason → Implication |
| `analogy-connection-insight` | Analogy → Connection → Insight |
| `practical-tool-walkthrough` | Hook → Vấn đề → Cách dùng tool → Demo/Result → Human Layer ngắn → CTA (L1/L2 tutorial) |

Chi tiết + hướng dẫn chọn: [`../engine/viral-structures.md`](../engine/viral-structures.md)

## Objective codes

`viral` · `authority` · `trust` · `education` · `engagement` · `community` · `thought-leadership` · `conversion` · `affiliate` · `experiment`

## Content status codes

`idea` → `expanding` → `scripting` → `review` → `approved` → `published` → `archived`

## AI Tip candidate codes

- Candidate ID: `AITIP-000N`; example/smoke: `AITIP-TEST-000N`.
- Stage: `discovered` · `verified` · `scored` · `tested` · `selected` · `taught` · `approved` · `handed-off` · `closed`.
- Verification: `VERIFIED` · `PARTIALLY_VERIFIED` · `UNVERIFIED` · `REJECTED`.
- Testability: `NOT_ASSESSED` · `TESTABLE` · `NOT_TESTABLE`.
- Test execution: `NOT_RUN` · `COMPLETED` · `BLOCKED`.
- Test result: `NOT_AVAILABLE` · `PASSED` · `FAILED`.
- System decision: `pending` · `recommend` · `hold` · `reject`.
- Human decision: `pending` · `approved` · `rejected` · `needs-changes` · `not-applicable`.

`recommend` không tự mở handoff. Candidate chỉ sang STEP 02 khi legacy `human_decision: approved` đã ghi delegated operator basis; state này không phải Product Owner Content Approval. `not-applicable` chỉ dành cho fixture/migration/reverse-audit. Xem [`../engine/ai-tips-intelligence.md`](../engine/ai-tips-intelligence.md).

## Script Engine codes

- Content stream: `chanh-kien` · `tuyet-chieu-ai`.
- Script status: `draft` · `review` · `approved` · `published` · `archived`.
- Editorial review: `pending` · `pass` · `revise` · `reject`.
- Script human decision: `pending` · `approved` · `rejected` · `needs-changes` · `not-applicable`.
- Storyboard handoff: `BLOCKED` · `READY`.
- Duration check: `pending` · `PASS` · `REVISE`.
- Claim/evidence check: `pending` · `PASS` · `BLOCKED`.
- Duration planning unit: `spoken_unit_count`; pacing: `pacing_spoken_units_per_minute`; không phải LLM tokenizer token. Rule đếm: [`../engine/script-engine.md`](../engine/script-engine.md) §4.

Editorial `pass/PUBLISH` không phải Content Approval. Script chỉ `READY` khi direct Product Owner Content Approval và duration/evidence đều PASS. Xem [`../engine/script-engine.md`](../engine/script-engine.md).

## Storyboard Engine codes

- Storyboard status: `draft` · `review` · `approved` · `archived`.
- Storyboard review: `pending` · `pass` · `revise` · `reject`.
- Storyboard human decision: `pending` · `approved` · `rejected` · `needs-changes` · `not-applicable`.
- Visual Director handoff: `BLOCKED` · `READY`.
- Input / Spoken mapping / Proof-evidence / Caveat / Storyboard quality / Boundary checks: `pending` · `PASS` · `BLOCKED`.
- Input eligibility: `production` · `legacy-approved-reverse-audit`.
- Reverse-audit có thể PASS contract checks nhưng không phải production input và luôn handoff `BLOCKED`.
- Timing check: `pending` · `PASS` · `REVISE`.
- Scene ID: `SC-01`, `SC-02`... liên tục trong một storyboard.

Storyboard editorial `pass` không tự mở handoff. `READY` iff input eligibility là production, source STEP 02 canonical/READY, mọi hard check PASS, editorial pass, legacy `human_decision: approved` có delegated basis và không còn blocker. Delegated acceptance không override hard gate; fixture `not-applicable` luôn `BLOCKED`. Xem [`../engine/storyboard-engine.md`](../engine/storyboard-engine.md).

## Visual Director codes

- Visual input eligibility: `production` · `legacy-approved-reverse-audit`.
- Visual Direction status: `draft` · `review` · `approved` · `archived`.
- Visual review: `pending` · `pass` · `revise` · `reject`.
- Visual human decision: `pending` · `approved` · `rejected` · `needs-changes` · `not-applicable`.
- Animation handoff: `BLOCKED` · `READY`.
- Visual hard checks: `pending` · `PASS` · `BLOCKED`.
- Proof representation: `actual-proof` · `visual-representation` · `illustrative-mockup` · `conceptual-metaphor`.
- Asset priority: `REQUIRED` · `OPTIONAL`; status: `AVAILABLE` · `NEEDED` · `BLOCKED`.
- Motion intent là semantic vocabulary, không phải animation implementation.

Animation `READY` iff:

`production input + source Storyboard exact READY + all visual hard checks PASS + ChatGPT visual review + delegated operator acceptance + active Content Approval + no unresolved blocker`.

Delegated operator acceptance không override evidence/provenance/readability/boundary gate. Reverse-audit và `not-applicable` luôn Animation `BLOCKED`. Xem [`../engine/visual-director.md`](../engine/visual-director.md).

## Voice Engine codes

- Voice mode: `production` · `reverse-audit-proof`.
- Preferred provider: `vbee`; local technical fallback: `piper`.
- Voice quality tier: `technical-preview` · `production-candidate`.
- Voice selection: `candidate` · `auditioned` · `selected` · `production-approved`; fixture branch: `approved-for-proof`.
- CKAI production default: `CKAI_NARRATOR_PRIMARY` → Vbee `HN - Minh Quân` → `hn_male_minhquan_yt-stable`; không random switching.
- Registry entry tồn tại không đồng nghĩa Product Owner đã chọn. Production resolve đòi `production-approved + productionAllowed: true`.
- Technical checks: `pending` · `PASS` · `BLOCKED` · `REVISE`.
- Voice review: `pending` · `pass` · `revise` · `reject`.
- Voice human decision: `pending` · `approved` · `rejected` · `needs-changes` · `not-applicable`.
- Final Review handoff (legacy schema field: `final_review_export_handoff_status`): `BLOCKED` · `READY`.

`original_text` phải bằng exact Spoken Copy; `synthesis_text` là normalization riêng, không sửa source. Segment cache key gồm normalized text + provider + voice code/speaker + speed + normalization version.

Final Review handoff từ STEP 06 `READY` iff production input, canonical STEP 05 Voice handoff thật sự READY, mọi segment generated, timing/technical/proof/pronunciation checks PASS, Voice review pass, delegated operator acceptance và không blocker. Reverse-audit, `not-applicable`, forged/stale source hoặc timing overflow luôn `BLOCKED`. Xem [`../engine/voice-engine.md`](../engine/voice-engine.md).

## Final Review & Finishing codes

- Review mode: `production` · `reverse-audit-proof`.
- Caption mode: `on` · `off-approved`.
- Optional audio mode, độc lập cho music/SFX: `none` · `local-approved`.
- Review check: `pending` · `PASS` · `BLOCKED` · `REVISE`.
- Issue severity: `blocker` · `major` · `minor`; target: `script` · `storyboard` · `visual-director` · `animation` · `voice` · `finishing`.
- Final review: `pending` · `pass` · `revise` · `reject`.
- Human decision: `pending` · `approved` · `rejected` · `needs-changes` · `not-applicable`.
- Export handoff: `BLOCKED` · `READY`.

Export `READY` iff verified STEP 06 production source, chain-of-custody, editorial/visual/AV/caption/music/SFX/truth/brand/video/audio hard checks đều PASS, không open blocker/major, final review `pass` và delegated operator acceptance. `off-approved` và audio mode `none` là valid khi check tương ứng PASS. Delegated acceptance không override failure; reverse-audit và `not-applicable` luôn `BLOCKED`. Xem [`../engine/final-review-engine.md`](../engine/final-review-engine.md).

## Final Export codes

- Export mode: `production` · `reverse-audit-proof`.
- Delivery profile: `CKAI_VERTICAL_MASTER_V1` version `1`.
- Export check: `pending` · `PASS` · `BLOCKED`; gồm decoded visual equivalence và decoded audio equivalence hard checks.
- Export review: `pending` · `pass` · `revise` · `reject`.
- Release human decision: `pending` · `approved` · `rejected` · `needs-changes` · `not-applicable`.
- Publish handoff: `BLOCKED` · `READY`.
- Filename: `<CONTENT-ID>_v<releaseVersion>_master.mp4`; SHA-256 là release identity component.

Publish `READY` iff verified STEP 07 production source, all Export hard checks PASS, complete inspection/output SHA-256/Release Manifest, export review `pass`, direct Product Owner Release Approval và không blocker. Encode success không phải Release Approval; reverse-audit và `not-applicable` luôn BLOCKED. Xem [`../engine/final-export-engine.md`](../engine/final-export-engine.md).





## Flag bắt buộc dùng khi thiếu dữ liệu thật

| Flag | Dùng khi nào |
|---|---|
| `PERSONAL STORY NEEDED` | Script cần trải nghiệm cá nhân nhưng `my-stories.md` chưa có |
| `NEEDS_VERIFICATION` | Claim về số liệu/nghiên cứu/sự kiện hiện tại chưa được kiểm chứng |

## Định nghĩa thuật ngữ Content Matrix

- **Big Idea** — luận điểm trung tâm của 1 video, có thể diễn đạt trong 1 câu.
- **Topic** — chủ đề rộng (vd: "dùng ChatGPT").
- **Angle** — góc nhìn cụ thể vào topic (vd: "dùng quá nhiều khiến người ta lười suy nghĩ").
- **Structure** — cấu trúc kể chuyện dùng để truyền tải angle (xem 12 structure codes ở trên).
- **Hook** — câu mở đầu 3–5 giây đầu, quyết định người xem có dừng lại không.
- **Key Sentence** — câu chốt/đinh của script, thường là câu insight cô đọng nhất.

## Content ID

Định dạng `CKAI-000N`, tăng dần, không tái sử dụng số đã dùng kể cả khi content bị REJECT. Chi tiết: `PROJECT.md` §16.

Candidate `AITIP-*` chỉ nhận `CKAI-*` sau khi mọi STEP 01 hard gate PASS và ChatGPT delegated operator handoff; Product Owner Content Approval diễn ra ở STEP 02.

---

Xem thêm: [`../PROJECT.md`](../PROJECT.md)
