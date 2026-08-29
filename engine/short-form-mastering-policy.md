# CKAI Short-Form Mastering V1

`CKAI_SHORT_FORM_MASTERING_V1` is the canonical finishing policy for CKAI short-form review and production candidates.

Creative listening direction is canonical at [`audio-direction-v1.md`](audio-direction-v1.md). This file defines technical finishing/evaluation boundaries only; it does not select music, place SFX or grant creative PASS.

The chain is: restrained Voice high-pass and presence shaping → moderate Voice compression → Voice-relative music/SFX balance → gentle bus compression → two-pass loudness normalization → true-peak limiting with auto-level disabled and codec headroom → decoded-binary QA.

Targets are evaluative ranges, not automatic approval: approximately `-16` to `-14 LUFS`, true peak no higher than `-1 dBTP`, clear dominant narration, perceptible midrange-capable music, smooth duck/recovery, restrained semantic SFX, no clipping, distortion, pumping, or crushed dynamics. Signal presence alone never passes perceptual usability.

Every technically passing candidate remains `HUMAN_AUDIO_REVIEW_REQUIRED` before delegated Final Review acceptance. The policy contains no Content ID, topic, scene, or fixed cue timestamp.
