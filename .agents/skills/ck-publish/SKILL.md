---
name: ck-publish
description: Đóng record sau khi Product Owner xác nhận content asset/video đã publish — lưu final delivered transcript, so sánh với approved script và chuyển lifecycle sang published. Không upload, render hay tự động đăng.
---

# /ck-publish — Đóng hồ sơ production (approved → published)

Manual Facebook posting is canonical MVP UX: this workflow starts only after Product Owner has posted/confirmed publication. It never uploads, schedules or auto-posts.

## Authority boundary

- **ChatGPT** là primary CKAI operator và editorial authority cho WHAT / WHY / EDITORIAL HOW.
- **Codex** dùng workflow canonical này để structure/persist artifact, enforce schema/evidence/technical gates và thực thi thay đổi được giao; output do Codex tạo không tự trở thành editorial approval.
- **Product Owner** giữ hai primary checkpoints: direct market-facing Content Approval và direct final Release Approval. ChatGPT recommendation/delegated acceptance không phải hai approvals này; không state nào override factual/technical hard gate.
- Workflow bên dưới mô tả canonical outcome, không chuyển editorial authority cho executor. Khi Codex chạy workflow, mọi judgment chưa được ChatGPT explicit cung cấp/xác nhận chỉ là draft; creative/editorial gate phải giữ pending.
- **Operator UX:** Product Owner không cần nhớ command/engine/schema. ChatGPT translate natural language thành workflow và không expose candidate score, artifact state, QA/hash hoặc intermediate approval request trừ khi Product Owner hỏi.
- Primary Product Owner checkpoints chỉ là Content Approval và Release Approval. Intermediate owner interruption chỉ dùng cho brand/cost/legal/provider/high-impact factual/voice-brand judgment thật sự.

## Bắt buộc đọc trước khi chạy

1. `../../../PROJECT.md` §15 (kiến trúc file, quy tắc chuyển file), §16–§17 (naming/metadata), §21 (workflow), §27 (Delivery Learning), và `../../../engine/script-engine.md` §4 để LENGTH DELTA dùng cùng deterministic spoken-unit rule
2. `content/approved/CKAI-000N_slug.md` tương ứng với Content ID user đưa — đây là **bản thiết kế** (approved script) dùng để so sánh
3. `../../../knowledge/voice-and-style.md` — để nhận diện quan sát nào khớp hoặc lệch so với voice đã ghi nhận (**không sửa file này** ở bước này)
4. `../../../insights/voice-observations.md` — xem Observation/Possible Pattern trước đó, để biết quan sát mới có lặp lại quan sát cũ không
5. `../../../data/content-index.csv` — xác nhận Content ID tồn tại và đang ở `status: approved`

## Input

- **Content ID** (bắt buộc): `CKAI-000N`.
- **Final delivered transcript** (bắt buộc): nguyên văn audio/voice track thực sự có trong final asset. Có thể là delivery thủ công legacy hoặc voice track của animation; không chuẩn hóa câu chữ.
- **Delivery mode** (bắt buộc cho record mới): `manual-human` | `animated-voice` | `other`. `manual-human` chỉ dùng khi đây là lời Trực thực sự nói; nếu không rõ, hỏi lại hoặc dùng `other`, không suy đoán.
- **Release Manifest** (optional, dành cho asset qua STEP 08): exact local manifest/path + final master SHA-256. Nếu được cung cấp, phải verify Content ID, current file hash, Product Owner release approval và `publish_handoff_status: READY` trước khi đóng record. Legacy/manual content không bị ép có STEP 08 manifest.
- **Platform** (nếu Trực cung cấp): facebook | tiktok | youtube-shorts | ... — nếu không có, hỏi lại thay vì đoán hoặc để trống mập mờ.
- **Ngày đăng** (nếu Trực cung cấp): mặc định ngày hôm nay nếu không nói khác.

Chỉ chạy khi Product Owner xác nhận asset/video đã publish. Nếu Content ID không tồn tại trong `content/approved/` (chưa qua editorial PUBLISH **và** Product Owner Content Approval), dừng lại và báo rõ lý do — không đoán, không tự tạo script mới ở bước này. Nếu Content ID là `TEST-*`, từ chối — đó là dữ liệu smoke test, không publish thật (xem `PROJECT.md` mục 16).

## Việc phải làm (đúng thứ tự)

1. **Xác nhận Content ID** — đọc script tương ứng trong `content/approved/`.
   - Nếu có STEP 08 Release Manifest: xác minh exact master path/hash và Publish handoff READY; chỉ ghi provenance vào record, không upload/render lại.
2. **Lưu transcript actual nguyên văn** vào `content/published/CKAI-000N_slug_transcript-actual.md` (format bên dưới) — không sửa chính tả, không chuẩn hóa câu, không làm "đẹp" lên. `actual` nghĩa là delivery có trong final asset, không phải một production method.
3. **Di chuyển approved script** từ `content/approved/CKAI-000N_slug.md` sang `content/published/CKAI-000N_slug.md` — giữ nguyên tên file, giữ nguyên nội dung Full Script (chỉ cập nhật đúng phần metadata ở bước 5, không sửa nội dung script).
4. **Tạo delivery-delta.md** — so sánh Full Script (bản approved) với transcript actual, theo đúng 6 mục ở "Format delivery-delta.md" bên dưới. Ưu tiên insight thực tế, **không** diff từng từ.
5. **Cập nhật metadata**: trong script (giờ ở `content/published/`) đổi `status: published`, điền `published: YYYY-MM-DD`, điền `platform:`. Cập nhật đúng dòng trong `data/content-index.csv`: `status → published`, `published_date`, `platform`.
6. **Voice learning có điều kiện:** nếu `delivery_mode: manual-human`, ghi 1 Observation vào `insights/voice-observations.md` và áp dụng ngưỡng Possible/Confirmed Pattern hiện có. Với `animated-voice` hoặc `other`, vẫn hoàn tất delivery-delta nhưng không ghi natural-voice Observation và không dùng record đó làm evidence cho voice pattern của Trực.
7. Báo lại cho Trực: đường dẫn 3 file trong `content/published/`, delivery mode, tóm tắt nhanh delivery-delta (2–4 điểm chính), và (chỉ với `manual-human`) đề xuất Possible/Confirmed Voice Pattern nếu đủ căn cứ.

## Ràng buộc bắt buộc

- **Transcript actual giữ nguyên văn tuyệt đối** — không sửa ngữ pháp, không rút gọn, không "dịch" thành câu chuẩn. Với `manual-human`, giữ cả lặp/ngập ngừng thực tế để bảo toàn dữ liệu voice; với mode khác, giữ đúng transcript của final audio/voice track.
- **Không ghi đè approved script.** Bản approved (thiết kế) và bản actual (thi công) phải cùng tồn tại, tách file riêng, không hợp nhất, không để bản nào biến mất.
- **`delivery-delta.md` không phải diff từng từ.** Chỉ liệt kê khác biệt có ý nghĩa (đoạn bị cắt, đoạn thêm, cách diễn đạt lại, thứ tự đổi) — không liệt kê từng chỗ lệch 1 chữ, tránh output khó đọc.
- **Không tự cập nhật `knowledge/voice-and-style.md` từ 1 video.** Dù quan sát rõ tới đâu, tối đa chỉ ghi Observation/Possible Pattern trong `insights/voice-observations.md`. Graduate lên Confirmed Voice Pattern (≥5 video nhất quán) chỉ là đề xuất trong output — sửa `voice-and-style.md` chỉ khi Trực xác nhận riêng.
- **Không xử lý performance** (views, watch time, likes...). Đó là việc của `/ck-learn`, chạy riêng sau khi có số liệu thật. `/ck-publish` không đụng tới `data/performance.csv` hay `insights/patterns.md` — giữ delivery learning và performance learning tách biệt.
- **Không sản xuất content mới** ở bước này — đây thuần túy là bước đóng hồ sơ, không viết lại/góp ý script.
- **Không upload, render, schedule hay auto-post.** `/ck-publish` chỉ ghi nhận một publication đã được Product Owner xác nhận; cách final asset được sản xuất nằm ngoài contract này.
- **Không biến Release Manifest thành lệnh publish.** Manifest chỉ là optional provenance/immutability evidence cho animated delivery; `/ck-publish` vẫn bắt đầu sau xác nhận đã publish.

## Format: `content/published/CKAI-000N_slug_transcript-actual.md`

```
---
id: CKAI-000N
type: transcript-actual
delivery_mode: manual-human | animated-voice | other
recorded_note: nguyên văn, không chỉnh sửa
created: <YYYY-MM-DD>
---

# Transcript thực tế — CKAI-000N

_Nguyên văn audio/voice track thực sự có trong final asset. Không sửa ngữ pháp, không rút gọn, không làm đẹp câu chữ._

<transcript nguyên văn Trực paste vào>
```

## Format: `content/published/CKAI-000N_slug_delivery-delta.md`

```
---
id: CKAI-000N
type: delivery-delta
compared: approved script vs transcript actual
created: <YYYY-MM-DD>
---

# Delivery Delta — CKAI-000N

## CUT (có trong script, không nói)


## ADD (nói thêm, không có trong script)


## REPHRASE (đổi cách diễn đạt, giữ ý)


## REORDER (đổi thứ tự, nếu có)


## LENGTH DELTA
Script: X spoken units (~Y giây ước tính) → Actual: X' spoken units (~Y' giây ước tính)

LENGTH DELTA chỉ chuẩn hóa đơn vị đo để tương thích Script Engine; đây không phải publishing automation. Đếm cả script và transcript actual theo `spoken_unit_count` tại `engine/script-engine.md` §4, không dùng tokenizer.

## VOICE OBSERVATIONS (chỉ suy luận natural voice khi `delivery_mode: manual-human`)
(Ghi dạng Observation — mô tả điều nhận thấy, KHÔNG tự kết luận thành quy luật ở đây. Kết luận cấp Pattern nằm ở `insights/voice-observations.md`, không lặp lại nội dung ở file này.)
```

## Format: entry ghi vào `insights/voice-observations.md` (chỉ với `manual-human`)

```
### CKAI-000N — <YYYY-MM-DD>
- **Observation:** ...
```

Nếu nâng cấp thành Possible Pattern/Confirmed Voice Pattern, thêm 1 dòng riêng vào đúng mục tương ứng trong file đó (ghi rõ dựa trên những Content ID nào) — không lặp lại nguyên văn Observation ở nhiều chỗ.

## Sau khi hoàn thành

- Không chạy bất kỳ production layer hoặc publishing automation nào; skill bắt đầu sau xác nhận đã publish và kết thúc ở việc đóng record.
- Không tự chạy `/ck-learn` — đó là bước riêng, chỉ chạy khi Trực có số liệu performance thật.
- Không di chuyển hay xoá gì khác trong `content/approved/` ngoài file vừa xử lý.
