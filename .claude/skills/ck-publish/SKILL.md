---
name: ck-publish
description: Đóng hồ sơ production sau khi Trực đã quay và tự đăng video — lưu transcript thực tế nguyên văn, so sánh với approved script, chuyển lifecycle sang published. KHÔNG phải chức năng đăng bài lên nền tảng (Trực tự đăng thủ công trước). Dùng khi user gõ /ck-publish CKAI-xxxx kèm transcript thực tế đã quay.
---

# /ck-publish — Đóng hồ sơ production (approved → published)

## Bắt buộc đọc trước khi chạy

1. `../../../PROJECT.md` §15 (kiến trúc file, quy tắc chuyển file), §16–§17 (naming/metadata), §21 (workflow), §27 (Delivery Learning)
2. `content/approved/CKAI-000N_slug.md` tương ứng với Content ID user đưa — đây là **bản thiết kế** (approved script) dùng để so sánh
3. `../../../knowledge/voice-and-style.md` — để nhận diện quan sát nào khớp hoặc lệch so với voice đã ghi nhận (**không sửa file này** ở bước này)
4. `../../../insights/voice-observations.md` — xem Observation/Possible Pattern trước đó, để biết quan sát mới có lặp lại quan sát cũ không
5. `../../../data/content-index.csv` — xác nhận Content ID tồn tại và đang ở `status: approved`

## Input

- **Content ID** (bắt buộc): `CKAI-000N`.
- **Transcript thực tế** (bắt buộc): Trực paste nguyên văn những gì đã nói trước camera.
- **Platform** (nếu Trực cung cấp): facebook | tiktok | youtube-shorts | ... — nếu không có, hỏi lại thay vì đoán hoặc để trống mập mờ.
- **Ngày đăng** (nếu Trực cung cấp): mặc định ngày hôm nay nếu không nói khác.

Nếu Content ID không tồn tại trong `content/approved/` (chưa qua `/ck-review` với verdict PUBLISH), dừng lại và báo rõ lý do — không đoán, không tự tạo script mới ở bước này. Nếu Content ID là `TEST-*`, từ chối — đó là dữ liệu smoke test, không publish thật (xem `PROJECT.md` mục 16).

## Việc phải làm (đúng thứ tự)

1. **Xác nhận Content ID** — đọc script tương ứng trong `content/approved/`.
2. **Lưu transcript actual nguyên văn** vào `content/published/CKAI-000N_slug_transcript-actual.md` (format bên dưới) — không sửa chính tả, không chuẩn hóa câu, không làm "đẹp" lên.
3. **Di chuyển approved script** từ `content/approved/CKAI-000N_slug.md` sang `content/published/CKAI-000N_slug.md` — giữ nguyên tên file, giữ nguyên nội dung Full Script (chỉ cập nhật đúng phần metadata ở bước 5, không sửa nội dung script).
4. **Tạo delivery-delta.md** — so sánh Full Script (bản approved) với transcript actual, theo đúng 6 mục ở "Format delivery-delta.md" bên dưới. Ưu tiên insight thực tế, **không** diff từng từ.
5. **Cập nhật metadata**: trong script (giờ ở `content/published/`) đổi `status: published`, điền `published: YYYY-MM-DD`, điền `platform:`. Cập nhật đúng dòng trong `data/content-index.csv`: `status → published`, `published_date`, `platform`.
6. **Ghi 1 Observation** vào `insights/voice-observations.md` (luôn luôn, mỗi video, kể cả khi delivery gần giống script). Nếu quan sát này lặp lại quan sát đã có ở 1–3 video trước → nâng thành **Possible Pattern** (ghi rõ dựa trên bao nhiêu video, video nào). Nếu đã có ≥5 video cùng cho ra kết quả nhất quán → có thể đề xuất **Confirmed Voice Pattern** — nhưng **không** tự ghi vào `voice-and-style.md` ở bước này; chỉ nêu đề xuất trong output, chờ Trực xác nhận riêng (giống cách `/ck-learn` đề xuất cập nhật `insights/frameworks.md`).
7. Báo lại cho Trực: đường dẫn 3 file trong `content/published/`, tóm tắt nhanh delivery-delta (2–4 điểm chính, không liệt kê hết chi tiết trong tin nhắn), và (nếu có) đề xuất Possible Pattern/Confirmed Voice Pattern kèm số video làm căn cứ.

## Ràng buộc bắt buộc

- **Transcript actual giữ nguyên văn tuyệt đối** — không sửa ngữ pháp, không rút gọn, không "dịch" thành câu chuẩn. Nếu Trực nói lắp/lặp/ngập ngừng trên thực tế, giữ y nguyên — đây chính là dữ liệu để học giọng nói thật (cùng nguyên tắc như `knowledge/calibration-raw.md`).
- **Không ghi đè approved script.** Bản approved (thiết kế) và bản actual (thi công) phải cùng tồn tại, tách file riêng, không hợp nhất, không để bản nào biến mất.
- **`delivery-delta.md` không phải diff từng từ.** Chỉ liệt kê khác biệt có ý nghĩa (đoạn bị cắt, đoạn thêm, cách diễn đạt lại, thứ tự đổi) — không liệt kê từng chỗ lệch 1 chữ, tránh output khó đọc.
- **Không tự cập nhật `knowledge/voice-and-style.md` từ 1 video.** Dù quan sát rõ tới đâu, tối đa chỉ ghi Observation/Possible Pattern trong `insights/voice-observations.md`. Graduate lên Confirmed Voice Pattern (≥5 video nhất quán) chỉ là đề xuất trong output — sửa `voice-and-style.md` chỉ khi Trực xác nhận riêng.
- **Không xử lý performance** (views, watch time, likes...). Đó là việc của `/ck-learn`, chạy riêng sau khi có số liệu thật. `/ck-publish` không đụng tới `data/performance.csv` hay `insights/patterns.md` — giữ delivery learning và performance learning tách biệt.
- **Không sản xuất content mới** ở bước này — đây thuần túy là bước đóng hồ sơ, không viết lại/góp ý script.

## Format: `content/published/CKAI-000N_slug_transcript-actual.md`

```
---
id: CKAI-000N
type: transcript-actual
recorded_note: nguyên văn, không chỉnh sửa
created: <YYYY-MM-DD>
---

# Transcript thực tế — CKAI-000N

_Nguyên văn những gì Trực nói trước camera. Không sửa ngữ pháp, không rút gọn, không làm đẹp câu chữ — giữ đúng để học giọng nói thật._

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
Script: ~X từ (~Y giây ước tính) → Actual: ~X' từ (ước tính Y' giây)

## VOICE OBSERVATIONS
(Ghi dạng Observation — mô tả điều nhận thấy, KHÔNG tự kết luận thành quy luật ở đây. Kết luận cấp Pattern nằm ở `insights/voice-observations.md`, không lặp lại nội dung ở file này.)
```

## Format: entry ghi vào `insights/voice-observations.md`

```
### CKAI-000N — <YYYY-MM-DD>
- **Observation:** ...
```

Nếu nâng cấp thành Possible Pattern/Confirmed Voice Pattern, thêm 1 dòng riêng vào đúng mục tương ứng trong file đó (ghi rõ dựa trên những Content ID nào) — không lặp lại nguyên văn Observation ở nhiều chỗ.

## Sau khi hoàn thành

- Không tự chạy `/ck-learn` — đó là bước riêng, chỉ chạy khi Trực có số liệu performance thật.
- Không di chuyển hay xoá gì khác trong `content/approved/` ngoài file vừa xử lý.
