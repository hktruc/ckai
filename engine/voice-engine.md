---
type: canonical-engine
step: 06
status: implemented
preferred_provider: vbee
downstream_boundary: final-review-implemented-export-not-implemented
---

# Voice Engine — STEP 06

## Operating authority

ChatGPT and Product Owner decide voice direction and editorial speaker intent; Product Owner explicitly selects/approves production mapping and provider spend. Codex owns the Voice Registry, provider adapters, synthesis/timing/QA and source-chain validation. Vbee/Piper have no CKAI authority. See PROJECT.md §23.

## Operator UX compatibility

STEP 06 is internal machinery. Legacy human_decision approved means ChatGPT delegated operator acceptance after Voice hard gates PASS. Product Owner is interrupted only for voice-brand selection, cost/quota/provider permission or another owner-interrupt condition. Spoken meaning changes invalidate Content Approval.


Voice Engine biến exact approved Spoken Copy + approved Animation scene slots thành traceable Vietnamese narration segments, deterministic timeline audio và voice-integrated technical preview. Engine dừng tại delegated operator acceptance + Final Review handoff state; không build Final Export hoặc Publishing.

## 1. Canonical flow

```text
VERIFIED STEP05 VOICE HANDOFF
→ VOICE PLAN → NORMALIZE → RESOLVE SPEAKERS → SYNTHESIZE SEGMENTS
→ FIT CHECK → ASSEMBLE → VOICE PREVIEW → QA/REVIEW → DELEGATED OPERATOR ACCEPTANCE
→ FINAL REVIEW/EXPORT HANDOFF READY → STOP
```

## 2. Exact upstream input

Production Voice không tin một `voice_handoff_status: READY` string. Validator kiểm trực tiếp:

- exact Animation artifact + SHA-256 và executable manifest + SHA-256;
- Content ID, manifest reference và source Script match;
- STEP 05 direct Visual Direction/Storyboard/Script verification vẫn PASS;
- Animation production/technical QA/review/human/no-blocker exact conjunction;
- executable STEP 05 Voice READY invariant;
- Voice handoff structured snapshot SHA-256;
- mỗi scene, exact Spoken Copy, slot, pause window và proof/caveat IDs match.

Wrong ID/ref/Script, stale hash, changed Spoken Copy/slot hoặc forged READY đều derive Voice input `BLOCKED`. Implementation: [`../video-factory/voice/src/upstream.ts`](../video-factory/voice/src/upstream.ts).

## 3. Voice Plan and text authority

Canonical fields nằm trong [`../video-factory/voice/src/model.ts`](../video-factory/voice/src/model.ts) và template [`../content/voices/TEMPLATE.md`](../content/voices/TEMPLATE.md). `originalText` phải bằng Animation Voice handoff Spoken Copy. `synthesisText` chỉ được pronunciation/format normalization, không đổi nghĩa. Rewrite nội dung phải return Script/review.

Segment boundary mặc định theo scene/speaker/semantic phrase; không chia từng vài từ. Mỗi segment có `VO-*`, scene, alias, original/synthesis text, speed, slot, required end/pause, proof/caveat IDs, cache key, audio ref, measured duration và fit state.

## 4. Provider and cost policy

```text
preferred_provider = vbee
use_existing_quota = true
auto_purchase_extra_credits = false
paid_fallback_requires_product_owner_approval = true
```

Minimal `VoiceProvider.synthesize()` abstraction giữ Voice Plan độc lập provider. Provider logic không nằm trong React scenes.

### Vbee adapter

Official docs audited 2026-08-23:

- Realtime POST `https://api.vbee.vn/v1/tts`, headers `Authorization: Bearer <token>`, `App-Id`, JSON body `text`, `mode: sync`, `voiceCode`, `outputFormat`, `speed`.
- Realtime text tối đa 300 ký tự; adapter dùng short segments và WAV binary response.
- Voice discovery GET `https://vbee.vn/api/public/v1/voices`, filters `voiceOwnership=VBEE`, `languageCode=vi-VN`, optional structured `gender`; response có code/name/gender/demo/`credit_factor`.
- Catalog không expose field structured riêng cho region/accent/style. CLI trả các field đó là `null`, không suy đoán từ code hoặc display name.
- Realtime docs hiện liệt kê 5 compatible voice codes; audition preflight chỉ cho live synthesis với candidate đã đánh dấu `realtimeCompatible: true` từ allowlist này. Catalog voice khác vẫn được list nhưng không tự coi là realtime-compatible.
- Official references: [Realtime API](https://api-docs.vbee.vn/vbee-api/text-to-speech/realtime-api), [Voice catalog](https://api-docs.vbee.vn/vbee-api/voices/get-list-voices), [App ID/token](https://api-docs.vbee.vn/tao-ung-dung-app-id-va-token).

Adapter không dùng legacy endpoint, không webhook/polling cho short segments, không retry tự động, không purchase/upgrade/fallback paid. Live synthesis chỉ chạy khi credential có trong environment **và** CLI nhận `--allow-vbee-quota`. Bad request/insufficient credit/concurrency/credit-spend error đều BLOCKED.

Credentials: `VBEE_APP_ID`, `VBEE_ACCESS_TOKEN`; chỉ placeholder trong `.env.example`. Không log token hoặc commit `.env`.

### Piper local fallback

Piper chạy offline sau model download, không per-request charge. Adapter dùng isolated local runtime/model paths; generated binaries/models không commit.

- `vi_VN-vais1000-medium`: technical preview; dataset CC BY 4.0; model khoảng 63 MB.
- `vi_VN-vivos-x_low`: multi-speaker reverse-audit proof only; dataset CC BY-NC-SA 4.0, không production/commercial default.
- Piper runtime GPL-3.0. Product Owner phải review license/deployment trước production distribution.

Local quality tier là `technical-preview`, không mặc nhiên production candidate. `CKAI_NARRATOR_PRIMARY` đã được Product Owner production-approve cho HN - Minh Quân; `CKAI_SECONDARY` vẫn unresolved tới khi Product Owner audition/chọn.

## 5. Voice Registry and multi-speaker

Registry tập trung tại [`../video-factory/voice/config/voice-registry.json`](../video-factory/voice/config/voice-registry.json). Content chỉ dùng stable alias; raw provider voice code không rải trong Script/Storyboard/Animation.

Canonical separation:

```text
CKAI semantic alias → provider → provider-specific voice code
CKAI_NARRATOR_PRIMARY → vbee → hn_male_minhquan_yt-stable (HN - Minh Quân; Product Owner production-approved default)
CKAI_SECONDARY → vbee → hn_female_ngochuyen_full_48k-fhg (HN - Ngọc Huyền; Product Owner production-selected on 2026-08-29)
```

Alias có provider, voice code, display name/language/structured gender khi có, quality tier, selection status, provider metadata, license, speaker ID và production permission. Gender không quyết định semantic role; narrator/AI/question/quote mapping là editorial choice trong từng Voice Plan. Hai semantic aliases có thể map cùng provider code cho use case hợp lệ, nhưng registry/audition report phải cảnh báo chúng không phải hai audible voices khác nhau.

`CKAI_NARRATOR_PRIMARY` là default duy nhất, không random switching. Official authenticated catalog GET ngày 2026-08-24 resolve `HN - Minh Quân` thành `hn_male_minhquan_yt-stable`, `credit_factor: 1`; không nhầm với `Minh Quân Pro (Beta)` code `hn_male_minhquan_yt_24k-pre`, credit factor 3. Catalog lookup không synthesize và không tiêu TTS quota.

Selection lifecycle là state rõ, không suy ra từ việc entry tồn tại:

```text
candidate → auditioned → selected → production-approved
```

`approved-for-proof` là nhánh riêng cho technical fixture. `selected` ghi nhận Product Owner đã chọn mapping nhưng chưa cấp production authority. Chỉ `production-approved + productionAllowed: true` mở production resolve. Voice Plan snapshot riêng `candidateAliases`, `auditionedAliases`, `selectedAliases`, `productionApprovedMapping` và `voiceSelectionCheck`; production READY đòi selection check PASS.

Product Owner workflow:

1. `voice:voices -- --dry-run` kiểm config; khi credentials có, bỏ `--dry-run` để đọc catalog thật (catalog GET, không synthesis quota).
2. Chọn tối đa 6 codes phù hợp; thêm chúng thành centralized `VBEE_AUDITION_*` candidates trong Registry, giữ metadata structured từ catalog.
3. `voice:registry` validate format/state và report duplicate provider mappings.
4. `voice:audition -- <aliases> --dry-run` xem exact text/rate/characters/distinct mapping, không gọi API.
5. Chỉ khi muốn nghe live: thêm `--allow-vbee-quota`. CLI preflight toàn shortlist trước request, dùng cùng một text/rate và tạo một WAV rõ tên cho mỗi alias.
6. Với mapping mới/override, Product Owner tự nghe/chọn; maintainer copy chosen code vào semantic alias và đặt `selected`. Chỉ sau explicit production approval mới đặt `production-approved` cùng `productionAllowed: true`. Default Minh Quân hiện tại đã hoàn tất bước này.

CLI không tự chọn winner, không tự update Registry và không auto-purchase.

`voice:voices` normalized output gồm code, display name, language, structured gender, demo URL, credit factor, ownership, realtime compatibility; region/accent/style là `null` khi API không cung cấp. Pagination cursor/limit được expose. Thiếu credentials thì `--dry-run` chỉ validate/display request plan và không fabricate catalog/audio.

## 6. Vietnamese normalization and pronunciation

Dictionary versioned tại [`../video-factory/voice/config/pronunciation.vi.json`](../video-factory/voice/config/pronunciation.vi.json). Layer xử lý whitespace/quotes, `%`, seconds và centrally approved term mappings; TEST-0002 chạy mapping PDF/Markdown/OCR.

Normalization output luôn giữ cả original + synthesis text. Dictionary entry có review state; generated audio không tự làm `pronunciation_check: PASS`. Reviewer phải nghe các acronym/tool/model/foreign terms. Learning chỉ cập nhật dictionary sau evidence/review.

## 7. Segment identity, cache and quota

Cache key = SHA-256 canonical JSON của synthesis text + provider + voice code + speaker ID + speed. Audio nằm ở `generated/voice/<ID>/segments/<hash>.wav`; cùng identity reuse file, thay text/voice/options tạo path mới và chỉ regenerate segment đó.

Vbee preflight biết segment count + exact character count; live command không chạy nếu thiếu explicit quota flag. Không có auto-purchase hoặc unbounded retry.

## 8. Timing and allowed fit adjustments

Animation slot là authority:

```text
usable_duration = required_end_or_slot_end - slot_start
fit_delta = usable_duration - measured_audio_duration
PASS iff fit_delta >= 0
```

Pause window tạo `requiredEndSeconds`; narration phải kết thúc trước pause. Safe correction chỉ gồm provider speed trong capability/range đã audit, reuse approved pause/hold và re-segmentation không đổi text. Không extreme time-stretch, không kéo animation, không rewrite Spoken Copy. Không fit → `REVISE/BLOCKED` và return upstream.

## 9. Assembly and Remotion preview

FFmpeg resample segment về 48 kHz, đặt deterministic `adelay` theo slot start, mix không normalize, pad/trim đúng approved total duration. QA chặn slot overlap trước assembly. Master WAV là Voice artifact; Remotion composition chỉ consume `staticFile('voice/<ID>/master.wav')` bên ngoài visual scene components.

`TEST-0002-Voice-Preview` reuse nguyên visual composition 1080×1920/30fps/1470 frames và gắn master Voice. Đây là technical/editorial preview, không phải Final Export.

## 10. QA and exact next-handoff invariant

QA kiểm: source chain/hash; all segments/aliases; exact original text; cache identity; audio exists/nonzero/decodable; sample rate/channels; effective silence; severe clipping indicator; duration fit; no slot overlap; pause/proof/caveat preservation; provider trace; generated hashes.

`final_review_input_status: READY` iff:

```text
production input + verified STEP05 Voice handoff
AND provider_input_check == PASS
AND segments_generated_check == PASS
AND audio_technical_qa == PASS
AND voice_selection_check == PASS
AND voice_selection.productionApprovedMapping == true
AND timing_fit_check == PASS
AND pronunciation_check == PASS
AND proof_caveat_check == PASS
AND voice_review == pass
AND human_decision == approved
AND unresolved_blockers empty
```

Delegated operator acceptance không override technical/timing/pronunciation/source failures. TTS success không phải Voice approval. State này chỉ cho phép STEP 07 bắt đầu; nó không phải và không thể thay thế STEP 07 `export_handoff_status`.

## 11. Reverse-audit and contract scenarios

TEST-0002 có thể synthesize/assemble/render real audio qua explicit proof mode, nhưng eligibility reverse-audit + human `not-applicable` luôn next handoff `BLOCKED`.

| Scenario | Result |
|---|---|
| A — Voice manifest khai READY nhưng canonical STEP05 human pending/hard gate fail | Voice input + next handoff **BLOCKED** |
| B — audio vượt usable slot | fit `REVISE`; không stretch Animation; next handoff **BLOCKED** |
| C — verified production upstream + all Voice checks/review/human PASS | next handoff **READY** |
| TEST-0002 audio/render PASS | proof authority only; pronunciation pending + human not-applicable; **BLOCKED** |

## 12. Commands and stopping rule

```text
| Selection A — aliases map A→B→A with two provider codes | order preserved; two actual voices reported |
| Selection B — unknown alias | preflight **BLOCKED before API call** |
| Selection C — distinct aliases share one provider code | allowed with explicit duplicate/audible-voice warning |
npm run voice:test
npm run voice:validate -- --require-audio
npm run voice:registry
npm run voice:voices -- --dry-run
npm run voice:voices -- --male|--female --limit=100
npm run voice:audition -- VBEE_AUDITION_NGOC_HUYEN VBEE_AUDITION_LAN_TRINH --dry-run
npm run voice:audition -- VBEE_AUDITION_NGOC_HUYEN VBEE_AUDITION_LAN_TRINH --allow-vbee-quota
npm run voice:generate
npm run voice:preview
```

STEP 06 stops after voice-integrated preview, Voice QA/review, compatibility approval field and Final Review handoff state. STEP 07 may verify/reuse this output, but Voice Engine itself does not implement captions, music/SFX, Final Export, publishing, uploader, scheduler, social API, analytics, multilingual dubbing or voice cloning.
