# content/storyboards/

## Operator UX

Internal machinery. ChatGPT reviews semantic flow and records delegated operator acceptance under active Content Approval. Product Owner does not inspect Storyboard by default.

Storyboard companion artifacts của approved scripts. Logic/schema canonical: [`../../engine/storyboard-engine.md`](../../engine/storyboard-engine.md); mẫu: [`TEMPLATE.md`](TEMPLATE.md).

- Production filename: `CKAI-000N_slug_storyboard.md`; dùng cùng Content ID và không move/rewrite source trong `../approved/`.
- Input production chỉ nhận canonical script `approved + human approved + duration/evidence PASS + storyboard_handoff READY`.
- Storyboard mô tả scene timing, exact Spoken Copy mapping, narrative purpose, semantic visual function và requirements; không chứa art direction hoặc animation implementation.

## States

- Generated: `storyboard_status: draft`, review/human `pending`, Visual Director `BLOCKED`.
- Editorial pass: `storyboard_status: review`, `storyboard_review: pass`, human vẫn `pending`, Visual Director vẫn `BLOCKED`.
- `READY` là hard conjunction: `input_eligibility: production` + canonical STEP 02 source/handoff + input/mapping/timing/proof/caveat/quality/boundary PASS + editorial pass + human approved + no unresolved blocker.
- Bất kỳ conjunct fail/pending/REVISE/BLOCKED nào cũng bắt buộc handoff `BLOCKED`, kể cả khi human đã approved.
- delegated operator acceptance không override technical/editorial hard gate.
- Revise/reject, human pending/needs-changes/rejected hoặc fixture `not-applicable`: luôn `BLOCKED`.

`TEST-*` chỉ là reverse-audit fixture: được chạy segmentation/timing/evidence/caveat checks nhưng không phải production input; `not-applicable` không bao giờ tạo READY và fixture không được handoff. Proof STEP 03: [`TEST-0002_prompt-don-markdown_storyboard.md`](TEST-0002_prompt-don-markdown_storyboard.md).
Storyboard production `approved + READY` là source input cho [`../../engine/visual-director.md`](../../engine/visual-director.md); Visual Direction được lưu riêng trong `../visual-directions/`.

STEP 03 dừng trước Visual Director; thư mục này không chứa styleframe, asset, animation, Remotion, voice hoặc export.
