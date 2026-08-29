# Voice Plan artifacts

## Operator UX

Internal machinery. ChatGPT reviews voice result; Product Owner is interrupted only for voice-brand selection, cost/quota/provider permission or another owner-interrupt condition.

Canonical STEP 06 records giữ cùng Content ID. Executable subsystem: [`../../video-factory/voice/`](../../video-factory/voice/); contract: [`../../engine/voice-engine.md`](../../engine/voice-engine.md).

- Production input phải trace về verified canonical STEP 05 Voice handoff; READY string không đủ authority.
- Original Spoken Copy bất biến; synthesis text chỉ pronunciation normalization.
- Speaker alias resolve qua centralized registry; provider voice code không nằm rải trong content.
- Generated audio/previews ở gitignored `generated/`.
- Reverse-audit audio proof vẫn Final Review/Export `BLOCKED`.

Template: [`TEMPLATE.md`](TEMPLATE.md). Proof: [`TEST-0002_prompt-don-markdown_voice-plan.md`](TEST-0002_prompt-don-markdown_voice-plan.md).
