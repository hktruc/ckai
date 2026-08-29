# Animation artifacts

## Operator UX

Internal machinery executed by Codex/runtime and reviewed by ChatGPT. Legacy human_decision approval records delegated acceptance, not Product Owner artifact inspection.

Canonical STEP 05 Animation records theo cùng Content ID. Executable implementation nằm trong [`../../video-factory/animation/`](../../video-factory/animation/); generated media nằm trong gitignored `generated/`.

- Production artifact chỉ nhận canonical Visual Direction được validator đọc trực tiếp, checksum khớp và thỏa exact STEP 04 READY invariant; READY trong Animation record chỉ là derived state.
- Reverse-audit cần explicit proof mode và không đổi production eligibility.
- Render/QA pass không đồng nghĩa delegated operator accepted hay Voice READY.
- Voice READY theo hard conjunction trong [`../../engine/animation-engine.md`](../../engine/animation-engine.md).
- Không lưu Voice/audio/caption/final Export trong STEP 05.

Template: [`TEMPLATE.md`](TEMPLATE.md). Proof: [`TEST-0002_prompt-don-markdown_animation.md`](TEST-0002_prompt-don-markdown_animation.md).
