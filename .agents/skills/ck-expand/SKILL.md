---
name: ck-expand
description: Mở rộng 1 topic/Big Idea thành 10-15 angle thực sự khác nhau — dùng khi user gõ /ck-expand <topic> hoặc đã chốt topic từ /ck-idea nhưng cần nhiều góc nhìn để chọn trước khi viết script.
---

# /ck-expand — Mở rộng angle

## Authority boundary

- **ChatGPT** là primary CKAI operator và editorial authority cho WHAT / WHY / EDITORIAL HOW.
- **Codex** dùng workflow canonical này để structure/persist artifact, enforce schema/evidence/technical gates và thực thi thay đổi được giao; output do Codex tạo không tự trở thành editorial approval.
- **Product Owner** giữ hai primary checkpoints: direct market-facing Content Approval và direct final Release Approval. ChatGPT recommendation/delegated acceptance không phải hai approvals này; không state nào override factual/technical hard gate.
- Workflow bên dưới mô tả canonical outcome, không chuyển editorial authority cho executor. Khi Codex chạy workflow, mọi judgment chưa được ChatGPT explicit cung cấp/xác nhận chỉ là draft; creative/editorial gate phải giữ pending.
- **Operator UX:** Product Owner không cần nhớ command/engine/schema. ChatGPT translate natural language thành workflow và không expose candidate score, artifact state, QA/hash hoặc intermediate approval request trừ khi Product Owner hỏi.
- Primary Product Owner checkpoints chỉ là Content Approval và Release Approval. Intermediate owner interruption chỉ dùng cho brand/cost/legal/provider/high-impact factual/voice-brand judgment thật sự.

## Bắt buộc đọc trước khi chạy

1. `../../../PROJECT.md` §3, §7, §8
2. `../../../engine/content-matrix.md`
3. `../../../engine/viral-structures.md`
4. `../../../knowledge/content-pillars.md`
5. `../../../knowledge/brand.md`
6. `../../../data/content-index.csv` — tránh sinh angle trùng content đã có (bỏ qua entry `TEST-*`, xem `PROJECT.md` mục 16)
7. `../../../knowledge/philosophy.md` — mục "Quan điểm cá nhân của Trực (từ Calibration)", đặc biệt hữu ích cho angle loại "phản biện" (dùng niềm tin muốn phản biện đã ghi nhận) và "framework hóa" (dùng EMERGING FRAMEWORK đã có evidence, không tự bịa framework mới)

## Input

Một topic hoặc Big Idea do user cung cấp (vd: "AI đang khiến con người ngày càng lười suy nghĩ"). Nếu user chỉ đưa Content ID đã có trong `content/ideas/`, đọc file đó để lấy topic/Big Idea gốc trước.

## Việc phải làm

Sinh **10–15 angle thực sự khác nhau** cho cùng 1 topic. "Thực sự khác nhau" nghĩa là khác luận điểm hoặc khác lăng kính tiếp cận — **không** phải viết lại 10-15 lần cùng một câu bằng chữ khác.

Chủ động dùng nhiều loại lăng kính khác nhau để đảm bảo đa dạng thật, ví dụ (không bắt buộc dùng hết, nhưng nên phủ ít nhất 5-6 loại):

- nghịch lý (paradox)
- story/case (chỉ nếu có tư liệu trong `knowledge/my-stories.md` VÀ story đó không bị gắn `STORY NEEDS DETAIL`; nếu không có hoặc còn `STORY NEEDS DETAIL` → gắn `PERSONAL STORY NEEDED` thay vì bịa)
- sai lầm phổ biến
- A vs B (so sánh)
- góc nhìn tâm thức (pillar `mind`)
- góc nhìn AI/công nghệ (pillar `ai-human`)
- góc nhìn công việc (pillar `work`)
- góc nhìn giáo dục
- prediction/xu hướng (cẩn trọng, có thể cần `NEEDS_VERIFICATION`)
- phản biện lại 1 quan điểm phổ biến
- analogy/phép loại suy
- scenario/tình huống giả định
- framework hóa
- case study (nếu có, không bịa)

## Format output — cho mỗi angle (1 → 10-15)

```
N. [Tên ngắn của angle]
   Angle: (1-2 câu diễn đạt góc nhìn cụ thể)
   Loại: (nghịch lý | story | sai lầm | a-vs-b | mind | ai-human | work | education | prediction | phản biện | analogy | scenario | framework | case-study)
   Gợi ý Structure phù hợp: (1 trong 12 code; hoặc `practical-tool-walkthrough` nếu là L1/L2 tutorial)
   Gợi ý Objective: (1 trong 10 objective)
```

Sau danh sách, thêm 1 dòng gợi ý: 2-3 angle nổi bật nhất theo đánh giá (Brand Fit + Viral Potential + Authority Potential), giải thích ngắn vì sao.

## Ràng buộc

- Nếu topic quá hẹp để ra đủ 10 angle thực sự khác nhau, được phép trả về ít hơn (vd: 8) kèm giải thích thay vì gượng ép sinh angle trùng lặp.
- Không tự bịa case study/nghiên cứu để làm angle "prediction" hay "case-study" nghe thuyết phục — gắn `NEEDS_VERIFICATION` khi cần.
