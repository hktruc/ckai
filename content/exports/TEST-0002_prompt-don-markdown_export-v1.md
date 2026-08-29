---
id: TEST-0002-Export-v1
type: short-form-final-export-proof
input_eligibility: legacy-approved-reverse-audit
source_final_review: ../reviews/TEST-0002_prompt-don-markdown_final-review.md
source_final_review_sha256: 3C12CFA765937B5F5D80EE3E5A42002E79495325F517145DA47476B5366F427E
source_review_snapshot: ../../generated/review/TEST-0002/final-review.generated.json
source_review_snapshot_sha256: ABE4B31B4371F946520CC0A716E415C1541600CC33CABCB8F8E218BA9C38092D
source_review_preview: ../../generated/previews/TEST-0002-review.mp4
source_review_preview_sha256: 4503A53CB10E5494D67B225C937344DC3AEA211D9A28BE44268D7B19D2D887D4
delivery_profile: CKAI_VERTICAL_MASTER_V1
release_version: 1
output_filename: TEST-0002_v1_master.mp4
output_path: ../../generated/exports/TEST-0002/TEST-0002_v1_master.mp4
output_sha256: 8A5B64715CA29263241E5E2D0DFAAB84A94010DA6DD1AC0BDCA452728EE095DC
output_container: mp4
video_codec: h264
video_profile: High
pixel_format: yuv420p
width: 1080
height: 1920
aspect_ratio: 9:16
fps: 30
duration_seconds: 49.045
video_bitrate_bps: 528870
audio_codec: aac
audio_profile: LC
audio_sample_rate: 48000
audio_channels: 2
audio_channel_layout: stereo
audio_bitrate_bps: 130071
caption_mode: on
music_mode: none
sfx_mode: none
input_verification_check: PASS
delivery_profile_check: PASS
source_equivalence_check: PASS
decoded_visual_equivalence_check: PASS
decoded_audio_equivalence_check: PASS
decoded_visual_scope: full-video-1470-frames
decoded_visual_normalization: 1080x1920-yuv420p-tv-cfr30-common-timebase
decoded_visual_ssim_all: 0.999149
decoded_visual_ssim_y: 0.999363
decoded_visual_ssim_u: 0.998760
decoded_visual_ssim_v: 0.998679
decoded_visual_threshold_all: 0.98
decoded_visual_threshold_channel: 0.97
decoded_audio_duration_delta_seconds: 0.000333
decoded_audio_mean_level_delta_db: 0
decoded_audio_max_level_delta_db: 0
decoded_audio_longest_silence_increase_seconds: 0
media_inspection_check: PASS
export_qa: PASS
export_review: pass
human_decision: not-applicable
publish_handoff_status: BLOCKED
unresolved_blockers: none-for-contract-proof
---

# Final Export Contract Proof — TEST-0002

Executable reverse-audit proof transcodes only the exact hash-verified STEP 07 review preview. Full-timeline decoded equivalence PASS: 1470/1470 frames, normalized SSIM All `0.999149` (minimum `0.98`; every Y/U/V above `0.97`) and decoded audio duration/level/silence-span consistency PASS. Technical export may PASS; `not-applicable` means Publish handoff remains BLOCKED.

Generated Release Manifest: `generated/exports/TEST-0002/TEST-0002_v1_release.generated.json`.
