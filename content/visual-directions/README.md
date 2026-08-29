# content/visual-directions/

## Operator UX

Internal machinery. ChatGPT reviews creative/semantic direction and records delegated acceptance after all hard gates PASS. Interrupt Product Owner only for brand-sensitive owner judgment.

Visual Direction companion artifacts của approved Storyboards. Logic/schema canonical: [`../../engine/visual-director.md`](../../engine/visual-director.md); mẫu: [`TEMPLATE.md`](TEMPLATE.md).

- Production filename: `CKAI-000N_slug_visual-direction.md`; dùng cùng Content ID, không move/rewrite source Storyboard hoặc Script.
- Production input phải thỏa exact STEP 03 READY invariant và `visual_director_handoff_status: READY`.
- Visual Direction quyết định visual language/concept/composition/hierarchy/assets/continuity; không chứa animation implementation.

## States

- Generated: visual status `draft`, review/human `pending`, Animation `BLOCKED`.
- Visual review pass: status `review`, human vẫn `pending`, Animation vẫn `BLOCKED`.
- `READY` là hard conjunction của production input + mọi visual hard check PASS + review pass + delegated operator accepted + no unresolved blocker.
- Delegated operator acceptance không override proof, provenance, readability, brand hoặc boundary gate.
- Revise/reject, missing asset/provenance, human pending/needs-changes/rejected hoặc fixture `not-applicable`: luôn `BLOCKED`.

`TEST-*` chỉ là reverse-audit fixture: được chạy visual schema/checks nhưng không phải production input và không được Animation handoff. Proof STEP 04: [`TEST-0002_prompt-don-markdown_visual-direction.md`](TEST-0002_prompt-don-markdown_visual-direction.md).

STEP 04 dừng trước Animation Engine; không chứa Remotion/component/code/timeline/render/voice/export.
