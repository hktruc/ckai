# content/scripts/

## Operator UX

This layer produces CHECKPOINT A: exact market-facing content. Product Owner Content Approval binds Spoken Copy, critical claims, CTA and meaning-critical text; material downstream changes invalidate it.

Output canonical của `/ck-script`, mỗi file một Content ID. Logic/schema: [`../../engine/script-engine.md`](../../engine/script-engine.md); mẫu: [`TEMPLATE.md`](TEMPLATE.md).

- Tên file: `CKAI-000N_slug.md`
- Script gồm structured editorial brief, Top 3 hook, selected hook, narrative beats, spoken copy, claim/evidence ledger, duration check, ending và editorial handoff requirements.
- Không chứa scene, shot list, visual direction, animation hoặc Remotion implementation.

## States

- Generated: `status: draft`, editorial/human `pending`, Storyboard `BLOCKED`.
- `/ck-review` PUBLISH: editorial `pass`, nhưng human vẫn `pending`; file vẫn ở đây.
- Chỉ direct Product Owner Content Approval + duration/evidence PASS mới đặt `approved/READY` và move sang `../approved/`.
- REVISE/REJECT hoặc human pending/needs-changes/rejected: giữ file ở đây.

`TEST-*` là fixture, không phải production và luôn `BLOCKED`. Proof STEP 02: [`TEST-0002_prompt-don-markdown-script-contract.md`](TEST-0002_prompt-don-markdown-script-contract.md).
