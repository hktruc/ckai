---
name: ck-learn
description: Ghi nhận performance của 1 video đã publish, liên kết với metadata, và cập nhật insight theo 3 cấp Observation/Hypothesis/Learned Pattern — dùng khi user gõ /ck-learn kèm số liệu 1 video đã đăng.
---

# /ck-learn — Học từ performance

## Authority boundary

- **ChatGPT** là primary CKAI operator và editorial authority cho WHAT / WHY / EDITORIAL HOW.
- **Codex** dùng workflow canonical này để structure/persist artifact, enforce schema/evidence/technical gates và thực thi thay đổi được giao; output do Codex tạo không tự trở thành editorial approval.
- **Product Owner** giữ hai primary checkpoints: direct market-facing Content Approval và direct final Release Approval. ChatGPT recommendation/delegated acceptance không phải hai approvals này; không state nào override factual/technical hard gate.
- Workflow bên dưới mô tả canonical outcome, không chuyển editorial authority cho executor. Khi Codex chạy workflow, mọi judgment chưa được ChatGPT explicit cung cấp/xác nhận chỉ là draft; creative/editorial gate phải giữ pending.
- **Operator UX:** Product Owner không cần nhớ command/engine/schema. ChatGPT translate natural language thành workflow và không expose candidate score, artifact state, QA/hash hoặc intermediate approval request trừ khi Product Owner hỏi.
- Primary Product Owner checkpoints chỉ là Content Approval và Release Approval. Intermediate owner interruption chỉ dùng cho brand/cost/legal/provider/high-impact factual/voice-brand judgment thật sự.

## Bắt buộc đọc trước khi chạy

1. `../../../PROJECT.md` §13
2. `../../../engine/learning-rules.md`
3. `../../../data/content-index.csv`
4. `../../../insights/patterns.md`

## Input — ví dụ format user sẽ đưa

```
/ck-learn

Video: CKAI-0021
Views: 286000
Average Watch: 68%
Completion: 41%
Shares: 3200
Saves: 1800
Comments: 720
Follows: 480
```

Không phải mọi field đều bắt buộc có — chỉ dùng field nào user cung cấp. Nếu thiếu Content ID, hỏi lại thay vì đoán.

## Việc phải làm (đúng thứ tự)

1. **Lưu dữ liệu thô** — validate/append qua canonical ingestor vào `data/performance.csv` theo đúng cột (`id,date,platform,views,avg_watch_pct,completion_pct,likes,comments,shares,saves,follows,affiliate_clicks,notes`). Field không có → để trống; số 0 chỉ ghi khi thực sự được cung cấp. Duplicate key là `id + date + platform`: exact repeat không ghi lại, conflict phải fail trừ khi Product Owner xác nhận đây là correction.
2. **Liên kết với metadata** — tra `data/content-index.csv` theo Content ID để lấy `pillar,topic,angle,structure,objective`.
3. **Tìm insight** — so sánh với các video khác cùng structure/pillar/loại hook đã có trong `insights/patterns.md`.
4. **Cập nhật pattern theo đúng cấp độ** (xem `engine/learning-rules.md`):
   - Luôn ghi 1 **Observation** mới cho video này.
   - Nếu đã có 2–4 video cùng điều kiện (cùng structure hoặc cùng loại hook hoặc cùng pillar) cho kết quả tương tự → nâng lên **Hypothesis**, ghi rõ đang dựa trên mấy video.
   - Chỉ nâng lên **Learned Pattern** khi có ≥5 video cùng điều kiện, kết quả nhất quán. **Không** kết luận từ sample nhỏ dù kết quả có ấn tượng đến đâu.
5. Nếu phát hiện một nguyên lý/framework (không chỉ về số liệu mà về nội dung/tư tưởng) đáng tái sử dụng, gợi ý thêm vào `insights/frameworks.md` — nhưng không tự thêm mà không nói rõ với user đây là đề xuất.

## Ràng buộc bắt buộc

- **Từ chối Content ID dạng `TEST-*` trong real-data commit path.** Fixture mode chỉ chạy isolated test/dry-run, không ghi vào canonical `data/performance.csv`, không tạo Observation thật và không được tính vào bất kỳ thống kê/pattern nào.
- Content ID phải tồn tại, đang `published`, và platform phải khớp canonical publication metadata. Dữ liệu malformed, percentage ngoài 0–100 hoặc metric âm phải fail rõ.
- Phân biệt rõ 3 nhãn Observation / Hypothesis / Learned Pattern trong mọi output — không dùng chung chung "insight".
- Không tối ưu chỉ cho Views — luôn tách rõ đang nói về trục nào (views, followers, shares, comments, authority, brand-strength) theo `engine/learning-rules.md` mục "Không tối ưu chỉ cho Views".
- Nếu chỉ có 1 video dữ liệu, output chỉ nên là Observation, không được bịa ra Hypothesis/Pattern để nghe "có insight".

## Format output

```
## /ck-learn — CKAI-000N

### Dữ liệu đã lưu
(xác nhận đã ghi vào data/performance.csv)

### Metadata liên kết
Pillar: ... | Structure: ... | Objective: ... | Hook type: ...

### Observation (video này)
- ...

### Hypothesis (nếu đủ 2-4 video cùng điều kiện)
- ... (dựa trên N video: CKAI-000X, CKAI-000Y...)

### Learned Pattern (chỉ nếu đủ ≥5 video)
- ...

### Đề xuất cập nhật insights/
(patterns.md / frameworks.md / audience-insights.md — nêu rõ đề xuất thêm gì, chờ xác nhận trước khi ghi)
```

## Sau khi có xác nhận từ user

Ghi các mục Observation/Hypothesis/Learned Pattern đã thống nhất vào `insights/patterns.md` (và `insights/frameworks.md` hoặc `insights/audience-insights.md` nếu phù hợp).
