# content/published/

## Operator UX

Publishing remains manual MVP UX: Product Owner downloads/receives the exact approved master and posts it to Facebook. This folder records publication afterward; it does not upload, schedule or auto-post.

Content đã đăng thật lên nền tảng, được đóng hồ sơ qua `/ck-publish`. Đây là nguồn để `/ck-learn` đối chiếu khi nhập performance.

Mỗi Content ID có **3 file phẳng** (không tạo thư mục con):

- `CKAI-000N_slug.md` — approved script gốc (bản thiết kế), di chuyển nguyên vẹn từ `../approved/`. Metadata: `status: published`, canonical `platform` bắt buộc; `published: YYYY-MM-DD` chỉ ghi khi có evidence và được để trống nếu chưa biết.
- `CKAI-000N_slug_transcript-actual.md` — transcript của audio/voice track thực sự có trong final asset, **nguyên văn**, không chỉnh sửa. Tên file được giữ để tương thích legacy; không hàm ý asset phải được quay thủ công.
- `CKAI-000N_slug_delivery-delta.md` — so sánh approved vs actual (CUT/ADD/REPHRASE/REORDER/LENGTH DELTA/VOICE OBSERVATIONS).

Performance số liệu **không** lưu ở đây — lưu trong `../../data/performance.csv`, liên kết qua Content ID. Chỉ delivery được xác nhận là lời Trực thực sự nói mới đóng góp vào `../../insights/voice-observations.md`; các delivery mode khác vẫn có delivery-delta nhưng không tạo natural-voice pattern.

Với animated asset qua STEP 08, record có thể tham chiếu optional approved Release Manifest + exact master SHA-256 để giữ provenance. Điều này không bắt buộc với legacy/manual content và không biến `/ck-publish` thành uploader hay Export command.

Facebook package lifecycle tại [`../../runtime/publishing/README.md`](../../runtime/publishing/README.md) chỉ chuyển `PUBLISHED` sau khi ba file ở đây và content index đã tồn tại. External URL/ID và publication date là optional; thiếu chúng không được thay bằng dữ liệu đoán.
