---
type: engine
scope: content-scoring
---

# Content Scoring

## Hook Scoring (dùng trong `/ck-script`)

Mỗi hook ứng viên được chấm trên thang 1–5 cho từng tiêu chí, nhân trọng số, cộng lại ra điểm tổng /5.

| Tiêu chí | Trọng số | Câu hỏi để chấm |
|---|---|---|
| Stop Power | 25% | Có đủ mạnh để khiến người đang lướt dừng lại không? |
| Curiosity | 25% | Có tạo một khoảng trống thông tin khiến người xem muốn biết tiếp không? |
| Relevance | 20% | Có liên quan trực tiếp tới điều audience mục tiêu đang quan tâm/lo lắng không? |
| Credibility | 15% | Có nghe đáng tin, không phóng đại quá mức không? |
| Brand Fit | 15% | Có đúng tone "chia sẻ điều quan sát được", không giật gân rẻ tiền không? |

Chọn Top 3 hook có điểm tổng cao nhất **và** không có tiêu chí nào dưới 3/5 (một hook điểm tổng cao nhưng Brand Fit chỉ 1/5 vẫn bị loại — xem `PROJECT.md` §9: "không hy sinh Brand Fit để lấy view").

## Idea Scoring (dùng trong `/ck-idea`)

Mỗi idea được ước lượng (không cần công thức cứng, dùng đánh giá định tính theo thang 1–5):

- **Brand Fit Score** — mức phù hợp với định vị Chánh kiến trong thời đại AI.
- **Viral Potential** — khả năng được share/dừng lại xem hết.
- **Authority Potential** — khả năng củng cố hình ảnh chuyên gia/người có chiều sâu.
- **Affiliate Potential** — chỉ chấm nếu thực sự có sản phẩm liên quan phù hợp tự nhiên (không ép).

Đây là ước lượng định tính để giúp Trực so sánh nhanh 5 idea, không phải điểm số tuyệt đối chính xác.

## Nguyên tắc chung

- Điểm số là công cụ hỗ trợ quyết định, không thay thế quyết định của Trực.
- Không thổi điểm cao để "cho đẹp" — nếu một idea/hook trung bình, chấm trung bình.

---

Xem thêm: [`hook-library.md`](hook-library.md) · [`chanh-kien-filter.md`](chanh-kien-filter.md)
