# Final Review & Finishing Engine — STEP 07

## Operating authority

ChatGPT owns creative/editorial quality review and publish-worthiness recommendation. Codex owns deterministic finishing tooling, AV/truth/brand/technical QA and verified Export handoff. delegated operator acceptance remains separate and cannot override failed hard checks. See PROJECT.md §23.

## Operator UX compatibility

STEP 07 is internal machinery. Legacy human_decision approved means ChatGPT delegated operator acceptance after AV/truth/brand/technical checks PASS. Product Owner does not approve the STEP 07 artifact by default; the visible release checkpoint is the exact STEP 08 release candidate.


## Mục tiêu và boundary

STEP 07 nhận output Voice đã được xác minh, tạo một review preview có caption và finishing audio tùy chọn, chạy QA, ghi quyết định review và chỉ mở handoff sang STEP 08 khi toàn bộ hard gate đạt. Review preview **không phải Final Export**, không upload và không publish.

Canonical flow:

`verified Voice output → input check → AV review → captions → optional music/SFX → QA → review preview → delegated operator acceptance → Export handoff READY → STOP`

## Source-of-truth invariant

`upstream_final_review_handoff_status: READY` không phải authorization token tự khai báo. Validator phải đọc trực tiếp source chain Script → Storyboard → Visual Direction → Animation → Voice, xác minh reference và SHA-256 của từng artifact, rồi chạy lại canonical STEP 06 invariant trên Voice Plan/Animation source.

Production input chỉ hợp lệ khi:

- source Voice artifact, structured snapshot, assembled audio và Voice preview tồn tại, đúng reference và checksum;
- runtime Voice Plan trùng structured snapshot;
- toàn bộ STEP 06 production hard checks PASS, Voice review pass, delegated operator accepted, không blocker;
- canonical STEP 06 `final_review_input_status == READY` được **derived** từ source thật; state này chỉ mở STEP 07 và không cấp Export authority.

Chỉ đổi một field READY, relabel fixture thành production, thay source sau snapshot, hoặc dùng checksum cũ đều cho `derived_review_input_status: BLOCKED`.

## Review artifact

Artifact canonical nằm tại `content/reviews/` và dùng schema trong `video-factory/review/src/model.ts`. Nó lưu:

- source chain + checksum;
- caption mode/policy/cues;
- music/SFX mode và asset provenance;
- 10 hard review/QA checks;
- issue routing;
- `final_review`, `human_decision`, `export_handoff_status`;
- review-preview metadata/checksum.

## Captions

Caption source duy nhất là exact `originalText` của từng Voice segment (canonical Spoken Copy). Engine chỉ normalize whitespace để so sánh; không STT, không dịch, không paraphrase, không sửa claim.

Deterministic derivation:

1. Chia theo word boundary với `maxLineCharacters` và `maxLines`.
2. Token dài hơn giới hạn hoặc cue cần quá số dòng → BLOCKED.
3. Chia timing theo tỷ lệ ký tự trong `measuredDurationSeconds`, nhưng không vượt Voice slot.
4. Reconstruct toàn bộ cue của mỗi segment và so exact Spoken Copy sau whitespace normalization.
5. Kiểm tra cue ID, duration, line limits và collision với protected zone.

Caption dùng high contrast, tối đa 2 dòng, đặt tại `upper-safe` hoặc `lower-safe` theo scene. Zone caption và protected visual zone không được trùng nhau. `captionMode: off-approved` chỉ hợp lệ khi có quyết định editorial rõ và vẫn phải PASS caption check.

## Music và SFX

Hai mode canonical, độc lập cho music và SFX:

- `none`: hợp lệ và không chứa asset.
- `local-approved`: chỉ đọc asset local trong `generated/` hoặc `video-factory/review/assets/`.

Mỗi asset phải có `source`, `provenance`, semantic `purpose`, `licenseStatus`, timing, gain và SHA-256; SFX bind thêm scene + cue type. Production yêu cầu license `approved`, decoded asset audible và 48 kHz mono/stereo; unknown/missing/stale/silent/clipped/unresolved đều BLOCKED. Voice giữ 0 dB; music không cao hơn -12 dB, SFX không cao hơn -3 dB. Fade không được vượt asset duration; optional fade-in/fade-out và music ducking dưới measured Voice windows giữ voice-first mix; actual rendered binary vẫn phải qua silence/clipping/audibility QA. `MUSIC_NONE` và `SFX_NONE` vẫn production-valid. Đây là technical ceiling, không phải auto-mix/mastering. Engine không download, generate hay mua music/SFX.

Nguồn tuyển chọn dài hạn của music nằm tại [`../content/references/audio/music-library-v1/`](../content/references/audio/music-library-v1/). Registry/library chỉ cung cấp provenance, license evidence và creative metadata; khi dùng thật, asset vẫn phải được stage vào runtime path được phép, có checksum và qua toàn bộ `local-approved` gate ở trên. Library không tự cấp production approval hoặc khởi động Phase 2 Audio Engine.

## Review issue routing

| Loại lỗi | Trả về |
|---|---|
| claim/script | Script |
| segmentation | Storyboard |
| visual concept | Visual Director |
| animation mechanics | Animation |
| pronunciation/timing | Voice |
| caption/mix/finishing | Final Review |

Mỗi issue có severity `blocker | major | minor`, reason, required correction và return target. Blocker/major còn open chặn handoff; chỉ minor mới được `accepted-minor`.

## QA contract

Review phải PASS đồng thời:

- editorial coherence, visual comprehension, AV sync;
- captions, music, SFX;
- truth/evidence/caveat preservation và Chánh Kiến/brand review;
- 1080×1920, 30fps, duration >0 và <60s, video+audio decode;
- narration không silent, không clipping nghiêm trọng;
- không có unintended black/empty interval theo heuristic.
- actual rendered binary có measured mean/max level, silence spans, codec/sample rate/channels và freeze spans; audio-stream existence alone không PASS;
- speech silence + visual freeze ≥0.75s không có semantic progression là dead-air BLOCKED.
- [`SHORT_FORM_RETENTION_POLICY_V1`](short-form-retention-policy.md) được tính lại từ measured Voice/Animation timeline; `RETENTION_PAUSE` khác dead-air, nên motion hoặc music còn chạy không thể tự làm pause PASS.
- production Review phải lưu đúng policy ID/version và findings; record thiếu/stale hoặc retention status BLOCKED đều chặn render/handoff.
- [`CKAI_SHORT_FORM_MASTERING_V1`](short-form-mastering-policy.md) chạy trong cùng STEP 07 finishing boundary cho arbitrary production Content ID: restrained Voice processing, Voice-relative finishing balance, two-pass loudness normalization, true-peak protection và decoded-binary QA. Technical PASS vẫn để `HUMAN_AUDIO_REVIEW_REQUIRED`; perceptual listening evidence phải có trước delegated Final Review acceptance.

Review không được thêm claim, evidence hay certainty mới. Lỗi truth/brand phải return upstream, không được che bằng finishing.

## Exact Export READY invariant

`export_handoff_status: READY` **iff** tất cả cùng đúng:

`input_eligibility == production`

AND verified STEP 06 source chain PASS

AND derived review input READY

AND toàn bộ 10 hard review/QA checks PASS

AND không open blocker/major

AND `final_review == pass`

AND `human_decision == approved`.

Nếu bất kỳ điều kiện nào fail thì status bắt buộc là `BLOCKED`. delegated operator acceptance không override technical/editorial/truth gate. STEP 07 tự dừng ở handoff; STEP 08 có thể consume exact reviewed package nhưng không thay đổi STEP 07 contract.

## Reverse-audit fixture

TEST-0002 chạy explicit `reverse-audit-proof`: được derive caption, render preview và chạy QA, nhưng không phải production. `input_eligibility: legacy-approved-reverse-audit`, upstream Voice `human_decision: not-applicable`, và `export_handoff_status: BLOCKED` là bất biến. Render/QA PASS không cấp production authority.

## Commands

- `npm run review:test` — executable contract proofs.
- `npm run review:validate` — validate TEST-0002 không cần render lại.
- `npm run review:preview` — render review preview và inspect; không Final Export.
- `npm run review:inspect` — hash, probe và QA preview hiện có.
