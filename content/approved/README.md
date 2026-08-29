# content/approved/

Script đã qua đủ hai gate: `/ck-review` editorial **PUBLISH** và direct Product Owner Content Approval (CHECKPOINT A). Với schema STEP 02, file phải có duration/evidence `PASS` và `storyboard_handoff_status: READY`; đây là Content Approval anchor cho delegated STEP 03–07.

- Tên file: `CKAI-000N_slug.md`
- Canonical script đủ `storyboard_handoff_status: READY` là input cho [`../../engine/storyboard-engine.md`](../../engine/storyboard-engine.md); storyboard được lưu như companion artifact trong `../storyboards/`, source script vẫn ở đây và không bị rewrite.
- Sau khi Product Owner xác nhận final asset/video đã publish, chạy `/ck-publish CKAI-000N` kèm final delivered transcript — skill tự cập nhật `status: published` + `published`/`platform`, di chuyển file sang `../published/`, và tạo thêm 2 file companion (`_transcript-actual.md`, `_delivery-delta.md`). Skill chỉ đóng record, không upload/render; production source có thể là legacy thủ công hoặc Video Factory tương lai.

CKAI-0001/0002 là legacy approved trước schema STEP 02 và được giữ nguyên, không migrate chỉ để đổi format. Có thể reverse-audit bằng `TEST-*`, nhưng không được giả là production input đã qua đủ canonical gates.

`TEST-0003` và `TEST-0004` là bridge-only `smoke-only`/`preflight-only` fixtures. Chúng không phải market-facing production, luôn bị loại khỏi content/performance/publish count và không thể dùng action `produce-to-review-package`.
