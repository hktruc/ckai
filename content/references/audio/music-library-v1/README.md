# CKAI Music Library V1

Thư viện nhạc nền cho CKAI Reels/Shorts.

## Trạng thái canonical

- Vị trí canonical: `content/references/audio/music-library-v1/`
- Trạng thái: `READY FOR PRODUCTION USE`
- Round 1: `7 KEEP`; Round 2: `15 KEEP`; tổng canonical: `22 KEEP`.
- File audio đã tải: `22 / 22`, đã verify decode/duration/SHA-256.
- Sáu family hiện có: investigative/tension, lofi/chillhop, ambient, corporate/upbeat light, minimalist piano/classical và soft electronic/synthwave.
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

## Boundary sử dụng

Audio direction canonical nằm tại [`../../../../engine/audio-direction-v1.md`](../../../../engine/audio-direction-v1.md). Music Library chỉ cung cấp local asset, provenance/license và descriptive fit metadata; không tự chọn track hoặc cấp production approval.

Music phải được audition dưới actual narration. `VOICE-FIRST` không có nghĩa là làm nhạc biến mất; full-bed suitability, repetition comfort, editability và spectral clearance đều phải được nghe trong content context. Family/fit score không phải deterministic selector.

Không có expansion round nào đang active. Track mới chỉ được sourcing khi production thật chứng minh 22-track shelf không có ứng viên phù hợp; không mở rộng để đạt quota.
