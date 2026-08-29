# CKAI Music Library V1

Thư viện nhạc nền cho CKAI Reels/Shorts.

## Trạng thái canonical

- Vị trí canonical: `content/references/audio/music-library-v1/`
- Trạng thái: `ACTIVE DEVELOPMENT`
- Shortlist Round 1: `7 KEEP`
- File audio đã tải: `7 / 7`, đã verify decode/duration/SHA-256.
- Mục tiêu hiện hành: khoảng `20` track thực sự hữu ích, không chạy theo số lượng.
- Registry: [`03_catalog/music-library.json`](03_catalog/music-library.json)
- Round 1 CKAI-0005 audition report: [`03_catalog/round1-ckai0005-audition-report.md`](03_catalog/round1-ckai0005-audition-report.md)
- Migration report: [`migration-report.md`](migration-report.md)

Nguồn cũ tại `C:\Users\Admin\Documents\Codex\2026-08-27\ti-p-t-c-d-n\outputs\CKAI Music Library V1` được giữ nguyên làm `LEGACY / NON-CANONICAL BACKUP`. Mọi cập nhật tiếp theo phải đi vào vị trí canonical trong repo này.

## Cấu trúc

- `01_original_audio/`: chỉ chứa file gốc của các track đã được duyệt KEEP.
- `02_license_evidence/`: bằng chứng nguồn và license, tách theo nền tảng.
- `03_catalog/`: danh mục biên tập của thư viện (không phải metadata kỹ thuật audio).
- `04_review_notes/`: shortlist và ghi chú duyệt hướng âm nhạc.

## Quy tắc vòng hiện tại

- Chỉ tải audio sau quyết định `KEEP`; Round 1 đã có đủ 7 file canonical cùng track-specific evidence.
- Không normalize hoặc chỉnh sửa audio.
- Loại meditation/healing, corporate, sentimental piano, epic trailer quá mức và vocal rõ lời.
- Function dùng để phân loại: HOOK / TENSION / INVESTIGATIVE / MOMENTUM / REFLECTIVE / REVEAL / PAYOFF / NEUTRAL BED.

## Hướng tuyển chọn tiếp theo

Round 1 hiện nghiêng về `INVESTIGATIVE / TENSION / MOMENTUM`. Khoảng track 8–20 cần ưu tiên đa dạng hóa vai trò, năng lượng và sắc độ; migration này không tìm nguồn hoặc tải thêm track.

`VOICE-FIRST` là Candidate Audio Direction Rule: nhạc phải hỗ trợ lời dẫn tiếng Việt và không che mất articulation, nhịp tư duy hoặc chuyển vai giọng. Một track nghe ấn tượng khi đứng một mình nhưng cạnh tranh với narration là ứng viên yếu cho CKAI. Đây là rule ứng viên cần tiếp tục kiểm chứng bằng Human/ChatGPT listening review, không phải Phase 2 Audio Engine hay production auto-selection.
