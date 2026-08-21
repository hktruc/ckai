---
type: engine
scope: learning-rules
---

# Learning Rules

Quy tắc dùng trong `/ck-learn` để biến số liệu performance thô thành insight có giá trị, mà không kết luận vội từ dữ liệu quá ít — đúng tinh thần Chánh kiến áp dụng ngược lại vào chính hệ thống.

## 3 cấp độ insight — bắt buộc phân biệt rõ

| Cấp độ | Định nghĩa | Khi nào dùng |
|---|---|---|
| **Observation** | Một quan sát về 1 video cụ thể, chưa suy rộng ra | Luôn ghi khi có dữ liệu mới, dù chỉ 1 video |
| **Hypothesis** | Một giả thuyết rút ra từ 2–4 video có điểm chung, chưa đủ để coi là quy luật | Khi thấy pattern lặp lại 2–4 lần nhưng mẫu còn nhỏ |
| **Learned Pattern** | Một quy luật được coi là đáng tin, dựa trên ≥5 video cùng điều kiện có kết quả nhất quán | Chỉ nâng cấp lên khi đủ mẫu — không được vội |

**Không kết luận từ sample nhỏ.** Một video viral không đủ để nói "structure X luôn hiệu quả" — đó là Observation, cùng lắm là Hypothesis.

**Bỏ qua mọi Content ID dạng `TEST-*`** khi gom mẫu cho Observation/Hypothesis/Learned Pattern — đó là dữ liệu smoke test, không phải video thật (xem `PROJECT.md` mục 16).

## Quy trình `/ck-learn` khi nhận performance của 1 video

1. **Lưu dữ liệu thô** vào `data/performance.csv` (theo Content ID).
2. **Liên kết với metadata** — lấy pillar/topic/angle/structure/hook/objective từ `data/content-index.csv` (dựa vào Content ID).
3. **Ghi 1 Observation** trong `insights/patterns.md` cho video này (bắt buộc, kể cả khi performance bình thường — dữ liệu "bình thường" cũng là dữ liệu).
4. **Kiểm tra xem có đủ video cùng điều kiện chưa** (cùng structure, hoặc cùng pillar, hoặc cùng loại hook) để nâng cấp thành Hypothesis hoặc Learned Pattern.
5. Nếu phát hiện một nguyên lý/framework có thể tái sử dụng nhiều lần (không chỉ về performance mà về nội dung/tư tưởng), ghi vào [`../insights/frameworks.md`](../insights/frameworks.md) thay vì `patterns.md`.

## Không tối ưu chỉ cho Views

Khi phân tích, luôn tách các trục:

- structure/hook hiệu quả cho **Views**
- pillar/topic tăng **followers**
- pillar/topic tăng **shares**
- topic tăng **comments**
- angle phù hợp audience nào
- video viral nhưng **không** tăng authority (cảnh báo — có thể lệch định vị)
- video ít view nhưng mạnh về **thương hiệu** (vẫn có giá trị, không loại bỏ)

Ghi rõ đang nói về trục nào khi kết luận, tránh gộp chung "hiệu quả" một cách mơ hồ.

---

Xem thêm: [`../insights/patterns.md`](../insights/patterns.md) · [`../insights/frameworks.md`](../insights/frameworks.md) · [`../PROJECT.md`](../PROJECT.md) §13
