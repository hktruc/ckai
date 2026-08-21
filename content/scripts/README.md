# content/scripts/

Output của `/ck-script` được lưu ở đây, mỗi file 1 Content ID.

- Tên file: `CKAI-000N_slug.md`
- Chứa: metadata YAML + Working Title + Structure + Top 3 hook + Full Script + Key Sentence + CTA/Caption/Visual nếu có.
- Khi `/ck-review` ra verdict PUBLISH, skill **tự động** đổi `status: approved` và di chuyển file sang `../approved/` — không cần làm tay, không hỏi lại (xem `PROJECT.md` §15). Nếu verdict REVISE/REJECT, file ở nguyên đây cho tới khi review lại đạt PUBLISH.
