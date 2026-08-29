---
type: knowledge
scope: brand
---

# Brand Voice & Văn phong Script

Nguồn tham chiếu chính cho `/ck-script` và `/ck-review` khi đánh giá Brand Fit.

## Tone tổng thể

> Một người đang chia sẻ điều mình quan sát, thực hành và chiêm nghiệm được.

**Không phải:**

> Một chuyên gia đứng trên bục giảng để nói người khác phải sống thế nào.

## Content cần

- sâu nhưng dễ hiểu
- thực tế
- bình tĩnh
- trí tuệ
- có chiều sâu
- có phản biện
- đa chiều

## Content KHÔNG được

- cực đoan
- giật gân rẻ tiền
- giáo điều
- phán xét
- lên lớp

## Được phép dùng khi phù hợp

- nghịch lý (paradox)
- challenge niềm tin phổ biến
- storytelling
- ví dụ đời sống (ưu tiên hơn lý thuyết hàn lâm)
- insight làm người xem dừng lại suy nghĩ

Luôn khuyến khích người xem **tự suy nghĩ** — không đưa ra kết luận đóng, đặc biệt với nội dung thuộc pillar `mind` (Giáo dục và tâm thức).

---

## Văn phong Script — VĂN NÓI

Dù final asset dùng animation, Spoken Copy vẫn phải là **văn nói tự nhiên**, không phải:

- bài báo
- blog
- bài luận
- văn ChatGPT (câu dài, trang trọng, sáo rỗng)
- caption kéo dài
- văn hàn lâm

### Ví dụ KHÔNG nên viết

> "Trong thời đại trí tuệ nhân tạo đang phát triển với tốc độ chưa từng có, con người đang đứng trước những thách thức to lớn..."

### Ví dụ nên viết gần với

> "Tôi nghĩ có một chuyện khá đáng lo khi chúng ta bắt đầu dùng AI quá nhiều."

> "Có một câu hỏi mà tôi nghĩ bất cứ ai đang dùng ChatGPT cũng nên tự hỏi mình."

### Quy tắc kỹ thuật script

- câu tương đối ngắn
- có nhịp (rhythm) — đọc lên nghe tự nhiên như đang nói chuyện, không như đọc văn bản
- không lạm dụng thuật ngữ
- có khoảng dừng (để nhấn ý và tạo nhịp delivery)
- video final: dưới 60 giây
- script target mặc định 50 giây; estimate phải ≤55 giây để chừa breathing room cho dựng
- công thức và gate duration: [`../engine/script-engine.md`](../engine/script-engine.md) §4

### Cách tự kiểm tra "có phải văn nói không"

Đọc to script lên. Nếu nghe giống đang đọc một bài luận hoặc một bài báo — chưa đạt, cần viết lại. Nếu nghe giống một người bạn thông minh đang kể cho bạn nghe một điều họ vừa nhận ra — đạt.

---
## Visual direction cho animation

Visual identity production chưa có đủ learning để khóa thành design system lớn. Visual Director dùng hai lớp sau:

### Stable brand constraints

- Visual phải làm rõ narrative/function trước khi làm đẹp; decoration không có chức năng nên bỏ.
- Cảm giác tổng thể bình tĩnh, đáng tin, không giật gân hoặc tạo authority giả bằng pseudo-data.
- Proof, truth label và caveat phải trung thực, đủ visibility; mockup/metaphor không được trình bày như actual evidence.
- Thiết kế native `vertical-9x16`, ưu tiên mobile readability và một attention priority rõ mỗi scene.
- Cùng object/semantic role phải nhất quán xuyên scene; không đổi representation vô cớ.
- Visual không được làm claim mạnh hơn Script/Storyboard hoặc biến observation thành fact.
- `tuyet-chieu-ai`: usefulness, step order, result/proof và limitation quan trọng hơn decoration.
- `chanh-kien`: visual phục vụ reasoning/reframing; không ép thành tutorial, slide deck literal hoặc chart giả.

### Experimental visual choices

Các lựa chọn sau được phép thử theo từng video nhưng **chưa phải brand invariant**:

- palette và exact color roles;
- font family/exact typography treatment;
- flat hay dimensional, texture và illustration treatment;
- mức độ UI-like/text-led/illustration-led;
- transition feel và semantic motion vocabulary.

Mỗi Visual Direction phải ghi experimental choices + rationale. Chỉ graduate thành stable constraint sau production/performance learning đủ rõ và Product Owner xác nhận.


Xem thêm: [`content-pillars.md`](content-pillars.md) · [`audience.md`](audience.md) · [`../engine/hook-library.md`](../engine/hook-library.md)
