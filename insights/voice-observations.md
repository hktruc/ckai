---
type: insights
scope: voice-observations
status: in-progress
---

# Voice Observations (Delivery Learning)

Ghi nhận từ `/ck-publish` khi so sánh **approved script** vs **transcript thực tế** — mục đích là học cách Trực thực sự nói trước camera. Đây là **Delivery Learning**, khác với `insights/patterns.md` (**Performance Learning** — học từ số liệu views/watch time, do `/ck-learn` ghi). Không gộp 2 loại học này lại với nhau.

Ghi nhận theo 3 cấp độ — không suy rộng vội, xem định nghĩa đầy đủ tại [`../.claude/skills/ck-publish/SKILL.md`](../.claude/skills/ck-publish/SKILL.md):

| Cấp độ | Định nghĩa | Khi nào dùng |
|---|---|---|
| **Observation** | Một quan sát về 1 video cụ thể (đoạn hay bị cắt, hay được thêm, cách rewrite bằng miệng, nhịp nói...) | Luôn ghi mỗi khi `/ck-publish` chạy, dù chỉ 1 video |
| **Possible Pattern** | Một xu hướng thấy lặp lại ở 2–4 video, chưa đủ để coi là đặc điểm giọng nói thật | Khi 1 quan sát trùng với quan sát trước đó 2–4 lần |
| **Confirmed Voice Pattern** | Một đặc điểm giọng nói đáng tin, dựa trên ≥5 video cho kết quả nhất quán | Chỉ nâng cấp khi đủ mẫu — **không tự ghi vào `knowledge/voice-and-style.md`**, chỉ đề xuất và chờ Trực xác nhận |

**Không kết luận từ 1 video.** Một video có nhiều đoạn ứng khẩu không đủ để nói "Trực luôn ứng khẩu nhiều" — đó là Observation, cùng lắm là Possible Pattern.

## Observations

### CKAI-0003 — 2026-08-22
- **Observation:** Xưng "mình" xuyên suốt khi nói thật, dù script viết "tôi". Mở rộng 1 ví dụ sâu (script) thành 4 ví dụ song song liên tiếp (AI, công việc, chạy bộ, thiện nguyện) mà không dùng story cụ thể nào từ `my-stories.md` — mọi ví dụ ở mức khái quát. Key Sentence (câu hỏi đóng khung, ngắn, in đậm trong script) được nói ra sớm hơn trong luồng nói và dài/lỏng hơn nhiều so với bản viết, không giữ dạng câu hỏi gọn dễ nhớ. Có 1 cụm gần với "đừng vội tin" xuất hiện tự nhiên (dù có thể lỗi STT). Video kết bằng câu tổng kết hướng đi, không có CTA hành động cụ thể như script thiết kế. Thời lượng thực tế dài hơn nhiều so với target — chi tiết đầy đủ xem [`../content/published/CKAI-0003_nhin-nhu-no-dang-la_delivery-delta.md`](../content/published/CKAI-0003_nhin-nhu-no-dang-la_delivery-delta.md).

## Possible Patterns

_(chưa có entry nào)_

## Confirmed Voice Patterns

_(chưa có entry nào — mọi entry ở đây đều phải đã được Trực xác nhận đưa vào `knowledge/voice-and-style.md`, không tự động)_

---

Xem thêm: [`../knowledge/voice-and-style.md`](../knowledge/voice-and-style.md) · [`../.claude/skills/ck-publish/SKILL.md`](../.claude/skills/ck-publish/SKILL.md) · [`../PROJECT.md`](../PROJECT.md) §27
