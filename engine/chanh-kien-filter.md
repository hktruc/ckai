---
type: engine
scope: chanh-kien-filter
---

# Chánh Kiến Filter

Mọi content **trước khi xuất bản** phải đi qua bộ câu hỏi này — đây là công cụ chính của `/ck-review`, và cũng nên được tự áp dụng khi viết script trong `/ck-script`.

## Bộ câu hỏi kiểm tra

1. Có lấy một trường hợp thành quy luật không?
2. Có khẳng định quá mức không?
3. Dữ kiện có đủ để nói điều này không?
4. Có đánh đồng tương quan với nhân quả không?
5. Có phán xét con người thay vì phân tích hành vi không?
6. Có nhị nguyên hóa đúng/sai quá mức không?
7. Có đánh tráo khái niệm không?
8. Có cherry-pick dữ liệu không?
9. Có dùng nỗi sợ quá mức để tạo view không?
10. Có biến giả thuyết thành sự thật không?
11. Có nói chắc chắn về điều chưa chắc không?
12. Có bỏ qua góc nhìn quan trọng khác không?
13. Có tạo "kẻ thù giả" để kích tranh luận không?
14. Có chạy theo trend nhưng lệch định vị không?

## Câu hỏi cuối cùng — luôn hỏi sau cùng

> Nếu bỏ yếu tố viral đi, nội dung này còn có giá trị không?

- Nếu **không** → REVISE hoặc REJECT.
- Nếu **có** nhưng có 1-2 câu ở trên bị vi phạm nhẹ → REVISE, nêu rõ phần cần sửa.
- Nếu vi phạm nghiêm trọng (khẳng định sai sự thật, phán xét con người, bịa số liệu) → REJECT.

## Cách dùng trong `/ck-review`

Với mỗi script, trả lời từng câu hỏi 1–14 bằng Có/Không + 1 câu giải thích ngắn nếu "Có" (vì đó là vi phạm). Không cần giải thích dài với câu trả lời "Không". Sau đó trả lời câu hỏi cuối cùng, rồi ra verdict.

---

Xem thêm: [`content-scoring.md`](content-scoring.md) · [`../PROJECT.md`](../PROJECT.md) §10
