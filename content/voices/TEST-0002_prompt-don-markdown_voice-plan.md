---
id: TEST-0002
type: short-form-voice-plan-proof
source_animation_artifact: ../animations/TEST-0002_prompt-don-markdown_animation.md
source_animation_artifact_sha256: 71C96491A3E8E622BC15E230A2CAF70DB46CB7B8C87E856B3C77C1DC8BA0CD17
source_animation_manifest: ../../video-factory/animation/src/manifest/test0002.ts
source_animation_manifest_sha256: D33AB2C59E3FCA4F44BEE89645439DC8244EFDB20C81929FA6294E12F0D8DFB7
source_animation_voice_handoff_sha256: 09CFF5717E602A6F93D32E330EB8EC9278245833FCE95BBAA8D490466DB51A70
source_script: ../scripts/TEST-0002_prompt-don-markdown-script-contract.md
input_eligibility: legacy-approved-reverse-audit
preferred_provider: vbee
proof_provider: piper-local
voice_candidates: [LOCAL_VI_NARRATOR_PROOF, LOCAL_VI_AI_PROOF]
auditioned_voice_aliases: [LOCAL_VI_NARRATOR_PROOF, LOCAL_VI_AI_PROOF]
selected_voice_aliases: [LOCAL_VI_NARRATOR_PROOF, LOCAL_VI_AI_PROOF]
production_approved_voice_mapping: false
voice_selection_check: BLOCKED
provider_input_check: PASS
segments_generated_check: PASS
audio_technical_qa: PASS
timing_fit_check: PASS
pronunciation_check: pending
proof_caveat_check: PASS
voice_review: pending
human_decision: not-applicable
final_review_export_handoff_status: BLOCKED
unresolved_blockers:
  - reverse-audit fixture has no production authority
  - pronunciation and permanent CKAI voice require Product Owner review
---

# Voice Contract Proof — TEST-0002

Real local Vietnamese TTS proof, không giả Vbee success và không phải production content.

## Provider and speakers

- Vbee credential environment: unavailable; live Vbee request count/characters/credits: `0 / 0 / 0`.
- `LOCAL_VI_NARRATOR_PROOF` → Piper `vi_VN-vais1000-medium`, technical-preview.
- `LOCAL_VI_AI_PROOF` → Piper `vi_VN-vivos-x_low`, speaker 0, non-commercial reverse-audit proof only.
- Mapping contains A→B→A: narrator scenes 01/02 → AI scene 03 → narrator scenes 04/05. Roles are editorial configuration, not gender invariant.
- Hai local aliases đã được dùng/audition trong technical proof nhưng `production_approved_voice_mapping: false`; chúng không phải Vbee audition hay CKAI brand voice selection.

## Exact copy, normalization and timing

All five `originalText` values equal STEP 05 Voice handoff Spoken Copy. Only synthesis text maps `PDF → pi đi ép`, `Markdown → Mác-đao`, `OCR → ô si a`; reviewer has not approved pronunciation.

| Segment | Scene | Alias | Audio duration | Usable slack | Fit | SHA-256 |
|---|---|---|---:|---:|---|---|
| VO-01 | SC-01 | LOCAL_VI_NARRATOR_PROOF | 4.702s | 2.298s | PASS | `C7A1E9B6…17C4` |
| VO-02 | SC-02 | LOCAL_VI_NARRATOR_PROOF | 1.683s | 1.317s | PASS | `8767E5C4…A2BCF` |
| VO-03 | SC-03 | LOCAL_VI_AI_PROOF | 13.840s | 1.160s before `[25,26)` pause | PASS | `C4375171…679` |
| VO-04 | SC-04 | LOCAL_VI_NARRATOR_PROOF | 6.827s | 3.173s | PASS | `92A864B9…6D3C` |
| VO-05 | SC-05 | LOCAL_VI_NARRATOR_PROOF | 8.336s | 4.664s | PASS | `ED7CC05F…AD9` |

R1–R4/C1–C2 mapping is unchanged. SC-05 still reads the long-document/table/OCR limitation and human judgment.

## Assembly and preview proof — 2026-08-23

- Master: `generated/voice/TEST-0002/master.wav`; PCM s16le, mono, 48 kHz, 49.000s; SHA-256 `0641AB84EBBD485D859F98DC1F84E29FF54411D3D153718F5BD9607D77F6CB5C`.
- Preview: `generated/previews/TEST-0002-voice.mp4`; H.264 1080×1920, 30fps + AAC stereo 48 kHz; duration 49.045s; 5,064,261 bytes; SHA-256 `7413F23B2CBD64F9329DA1FC76EF5B88566CF92CD02D94F283BBDE701B8FE231`.
- Voice QA checks source hashes, exact copy, aliases, cache, decode, silence/clipping indicators, fit/overlap, pronunciation presence and proof/caveat mapping.
- Contract tests: `14/14 PASS`; Voice QA with real audio: `PASS`.

Technical proof PASS does not approve pronunciation, brand voice or downstream Final Review/Export. `not-applicable` keeps handoff **BLOCKED**.
