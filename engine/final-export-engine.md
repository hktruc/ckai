---
type: canonical-engine
step: 08
status: implemented
downstream_boundary: publish-handoff-only
---

# Final Export Engine — STEP 08

## Operating authority

ChatGPT may recommend release quality based on the reviewed asset; Codex owns mechanical encode, decoded-media equivalence, Release Manifest, hashes and technical Publish handoff. Product Owner holds explicit release approval; neither editorial nor Release Approval overrides Export QA failure. See PROJECT.md §23.

## Operator UX compatibility

STEP 08 contains CHECKPOINT B. Legacy human_decision approved means direct Product Owner Release Approval bound to exact release version and output SHA-256. Any binary/content mutation after approval invalidates Release Approval and requires revalidation plus a new explicit Chốt.


## Boundary

Final Export là mechanical delivery layer:

`verified STEP07 Export handoff → profile → transcode → inspect → source equivalence → Export QA → Release Manifest → Product Owner Release Approval → Publish handoff → STOP`.

Engine không rewrite Script/Storyboard/Visual Direction, không đổi Animation/Voice/timing, không regenerate captions, không remix/thêm/bớt music/SFX và không “làm đẹp” creative state. Semantic/AV change phải return STEP 07 hoặc upstream owner. Không uploader, auto-post, platform API hay scheduler.

## Canonical input verification

Copied `export_handoff_status: READY` không có authority. Production validator:

1. kiểm Content ID và exact Final Review artifact/snapshot/review-preview references;
2. kiểm SHA-256 của cả ba source;
3. parse canonical Final Review frontmatter;
4. chạy lại STEP 07 QA và STEP 02–06 source chain;
5. yêu cầu production eligibility, mọi STEP 07 hard check PASS, final review pass, STEP 07 delegated operator acceptance, Export handoff READY và không blocker/major.

Forged READY, stale preview/source, changed finishing modes hoặc reverse-audit relabel đều BLOCKED. TEST-0002 chỉ được encode bằng explicit `reverse-audit-proof`; technical success không cấp production authority.

## Delivery profile

`CKAI_VERTICAL_MASTER_V1`:

- MP4; H.264 High-compatible via `libx264`; `yuv420p`;
- 1080×1920, SAR 1:1, DAR 9:16, CFR 30fps;
- CRF 18, preset medium;
- AAC-LC, 48kHz, stereo, 192kbps;
- `+faststart`, metadata source không được copy;
- duration `<60s`; source/output container tolerance tối đa 0.12s.

Đây là một canonical master dùng chung, không phải TikTok/Instagram/YouTube upload profile.

## Canonical encode path

Chọn **transcode exact reviewed preview**. STEP 07 preview đã chứa reviewed animation, voice, burned-in captions và optional finishing. Validator kiểm exact preview hash trước khi FFmpeg đọc nó. FFmpeg chỉ map video/audio stream, chuyển technical color range `pc → tv` để tạo compatible `yuv420p`, rồi encode profile; không crop/resize geometry, creative filter, trim, speed, transition hoặc audio normalization.

Output deterministic identity:

`generated/exports/<CONTENT-ID>/<CONTENT-ID>_v<releaseVersion>_master.mp4`

Existing version không bị overwrite mặc định. TEST fixture chỉ được thay bằng explicit `--replace-proof`. Upstream content revision hoặc accepted binary change yêu cầu revalidate/release và SHA-256 mới.

## Source equivalence

Equivalence được chứng minh nhẹ bằng:

- Final Review artifact/snapshot/preview hashes;
- timeline digest (source chain + Voice-segment caption timings);
- exact caption mode/policy/cue digest;
- exact music/SFX/voice-gain/assets digest;
- same dimensions/fps và duration trong 0.12s tolerance;
- only one reviewed preview input, no creative FFmpeg filter;
- output media inspection + SHA-256;
- decoded visual/audio equivalence của exact preview và exact master.

Decoded visual comparison chạy trên **toàn bộ timeline/all frames**. Cả hai input được normalize deterministic về `1080×1920`, `yuv420p`, TV range, CFR 30fps và common timebase; source full-range vì vậy được đổi sang cùng comparison space với master TV-range trước SSIM. PASS yêu cầu `SSIM All >= 0.98` và từng `Y/U/V >= 0.97`. Đây là encode-integrity threshold nhằm bắt black output, missing/changed scene, major brightness/range/color hoặc geometry corruption; không tuyên bố pixel/perceptual identity tuyệt đối và không thay Final Review editorial approval.

Decoded audio comparison không thêm creative filter: Export chỉ re-encode exact approved audio stream sang AAC. PASS yêu cầu audio stream/channels tồn tại, source/output duration lệch không quá 0.12s, decoded mean/max level lệch không quá 3dB, output không full-silence và longest detected silence (`-55dB`, tối thiểu 0.75s) không tăng quá 0.5s. Mục tiêu là bắt gross silence, level collapse hoặc missing span; không phải perceptual fingerprint.

Encoding khác không đồng nghĩa semantic khác. Tolerance chỉ cho container/codec behavior, không che trim hoặc timing change.

## Media inspection và QA

Sau encode, `ffprobe` và full decode smoke kiểm file/non-zero, MP4, H.264/yuv420p, AAC, 1080×1920, SAR/DAR, 30fps, duration, 48kHz/stereo, audio presence và bitrate metadata. Decoded SSIM + decoded audio consistency là Export hard checks; failure luôn chặn Publish READY và Product Owner Release Approval không override. Audio level check tiếp tục chặn accidental silence/severe clipping. Output checksum và structured inspection/equivalence phải trùng binary hiện tại.

## Release gate

`publish_handoff_status: READY` iff:

`production eligibility`
AND verified STEP07 source/chain
AND all Export hard checks PASS
AND complete inspection + output SHA-256
AND export review pass
AND active Market/Taste Gate PASS under [`creative-quality-standard.md`](creative-quality-standard.md)
AND Human/ChatGPT Creative Director review is authoritative for that taste decision
AND direct Product Owner Release Approval is bound to output version + SHA-256
AND no unresolved blocker.

Render/FFmpeg success không phải Release Approval hoặc Market/Taste PASS. Technical gates PASS riêng lẻ không tạo `release_candidate_eligible`. Release Approval không override hard failure/taste failure. Reverse-audit và `not-applicable` luôn BLOCKED. Historical artifacts không bị rewrite; mọi future candidate theo Creative Reset phải ghi đủ separated quality status contract.

Release Manifest giao publishing layer exact master path/hash, Content ID/spec, transcript and Review references, delivery/finishing modes, profile/version và human decision. Publishing layer không render lại.

## Commands

- `npm run export:validate` — source/gate validation, không encode.
- `npm run export:render` — encode proof; không overwrite version hiện có.
- `npm run export:proof` — explicit replace TEST proof, inspect và generate Release Manifest.
- `npm run export:inspect` — inspect existing output và write structured Release Manifest.
- `npm run export:test` — executable contracts; yêu cầu proof binary hiện có.

STEP 08 dừng trước publishing. `/ck-publish` tiếp tục chỉ đóng record sau Product Owner xác nhận asset đã publish.
