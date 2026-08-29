---
id: CKAI-XXXX-FinalReview
type: short-form-final-review
input_eligibility: production
source_voice_artifact: ../voices/CKAI-XXXX_voice-plan.md
source_voice_artifact_sha256: REQUIRED
source_voice_snapshot: ../../generated/voice/CKAI-XXXX/voice-plan.generated.json
source_voice_snapshot_sha256: REQUIRED
source_voice_audio: ../../generated/voice/CKAI-XXXX/master.wav
source_voice_audio_sha256: REQUIRED
source_voice_preview: ../../generated/previews/CKAI-XXXX-voice.mp4
source_voice_preview_sha256: REQUIRED
derived_review_input_status: BLOCKED
caption_mode: on
music_mode: none
sfx_mode: none
editorial_coherence_check: pending
visual_comprehension_check: pending
audiovisual_sync_check: pending
caption_check: pending
music_check: pending
sfx_check: pending
truth_evidence_check: pending
brand_review_check: pending
technical_video_qa: pending
audio_qa: pending
final_review: pending
human_decision: pending
export_handoff_status: BLOCKED
unresolved_issues: pending
---

# Final Review — CKAI-XXXX

## Verified source chain

Ghi đủ Script → Storyboard → Visual Direction → Animation → Voice references và SHA-256. READY copy tay không có authority.

## Caption plan

- Source: exact Spoken Copy từ verified Voice Plan.
- Policy: tối đa 2 dòng; khai báo max characters/line; scene zone và protected zone.
- Không STT, paraphrase, dịch hoặc thêm claim.

## Optional finishing audio

Chọn `none` hoặc ghi từng local-approved asset: local path, source, provenance, semantic purpose, license, checksum, start/duration/gain/fades. SFX còn phải bind scene + semantic cue type; production asset phải decode được, audible và 48 kHz mono/stereo trước khi mix.

## QA và issues

Ghi result/reason/correction/return target cho mọi issue. Open blocker/major luôn chặn Export.

## Delegated operator acceptance

Legacy human_decision approved means ChatGPT delegated acceptance under active Content Approval, not Product Owner artifact inspection. Record approval basis/reference. It only opens READY when every hard gate PASS.
