---
type: engine
scope: hook-library
---

# Hook Engine & Hook Library

## Workflow bắt buộc trong `/ck-script`

```
Topic / Big Idea → sinh 10–15 hook → scoring → chọn Top 3 → viết script
```

Công thức tính điểm hook: xem [`content-scoring.md`](content-scoring.md) — tóm tắt trọng số: Stop Power 25% · Curiosity 25% · Relevance 20% · Credibility 15% · Brand Fit 15%.

**Không** clickbait sai sự thật. **Không** hy sinh Brand Fit để lấy view — một hook điểm cao Stop Power nhưng điểm thấp Brand Fit (nghe giống kênh giật gân) phải bị loại hoặc viết lại.

## 10 loại hook được dùng

| Loại | Mô tả ngắn | Ví dụ khung câu (template, không phải hook thật) |
|---|---|---|
| Nghịch lý | Nêu một điều tưởng mâu thuẫn nhưng đúng | "[X] không nguy hiểm vì nó [Y]. Nó nguy hiểm vì nó [ngược lại Y]." |
| Contradiction | Đối lập trực tiếp một niềm tin phổ biến | "Mọi người nghĩ [niềm tin phổ biến]. Tôi nghĩ ngược lại." |
| Open loop | Mở một câu hỏi/khoảng trống chưa trả lời ngay | "Có một điều về [topic] mà gần như không ai để ý." |
| Câu hỏi | Đặt câu hỏi trực tiếp cho người xem | "Bạn có bao giờ tự hỏi vì sao [hiện tượng]?" |
| Nhận định mạnh | Một tuyên bố dứt khoát, rõ quan điểm | "[Chủ đề] không phải vấn đề thật. Vấn đề thật là [điều khác]." |
| Quan sát bất ngờ | Kể một điều vừa nhận ra khiến người nghe bất ngờ | "Tôi vừa nhận ra một chuyện khá kỳ về [topic]." |
| Kết quả | Mở bằng một kết quả cụ thể gây tò mò | "Sau khi [hành động], điều xảy ra không phải là [kỳ vọng]." |
| Confession | Thừa nhận một điều cá nhân (chỉ dùng khi có entry thật trong `my-stories.md`) | "Tôi từng [thừa nhận] — cho tới khi..." |
| Story opening | Bắt đầu bằng bối cảnh 1 câu chuyện (cần story thật) | "Có một lần [bối cảnh ngắn]..." |
| Scenario | Vẽ một tình huống giả định để người xem tự đặt mình vào | "Tưởng tượng bạn đang [tình huống]..." |

**Confession** và **Story opening** bắt buộc có entry tương ứng trong [`../knowledge/my-stories.md`](../knowledge/my-stories.md); nếu không có, đánh dấu `PERSONAL STORY NEEDED` và không dùng 2 loại hook này.

## Nguyên tắc chống clickbait

- Hook phải phản ánh đúng nội dung sẽ nói tiếp theo — không hứa hẹn rồi không trả lời.
- Không dùng nỗi sợ thái quá chỉ để câu view (trùng với 1 tiêu chí trong [`chanh-kien-filter.md`](chanh-kien-filter.md)).
- Không bịa số liệu/kết quả trong hook dạng "Kết quả" nếu chưa có dữ liệu thật → gắn `NEEDS_VERIFICATION` hoặc đổi sang loại hook khác.

---

Xem thêm: [`content-scoring.md`](content-scoring.md) · [`chanh-kien-filter.md`](chanh-kien-filter.md)
