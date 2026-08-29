import type {AnimationManifest} from '../model';

export const TEST_0002: AnimationManifest = {
  id: 'TEST-0002-Animation',
  type: 'short-form-animation',
  sourceVisualDirection: 'content/visual-directions/TEST-0002_prompt-don-markdown_visual-direction.md',
  sourceVisualDirectionSha256: 'D1D1BDDB9DA2858D5DFAF5ED159D55D9EFE4593BF0BB674A7700B1D28C877204',
  inputEligibility: 'legacy-approved-reverse-audit',
  upstreamAnimationHandoffStatus: 'BLOCKED',
  width: 1080,
  height: 1920,
  fps: 30,
  totalSeconds: 49,
  scenes: [
    {id: 'SC-01', startSeconds: 0, endSeconds: 7, purpose: 'Problem recognition', requiredAssetIds: ['A1'], requiredProofIds: [], requiredCaveatIds: [], motion: ['reveal', 'emphasis']},
    {id: 'SC-02', startSeconds: 7, endSeconds: 10, purpose: 'Scope the cleanup task', requiredAssetIds: ['A1'], requiredProofIds: [], requiredCaveatIds: [], motion: ['reveal', 'emphasis']},
    {id: 'SC-03', startSeconds: 10, endSeconds: 26, purpose: 'Show exact tested instruction', requiredAssetIds: ['A1', 'A2'], requiredProofIds: ['R1'], requiredCaveatIds: [], motion: ['reveal', 'emphasis']},
    {id: 'SC-04', startSeconds: 26, endSeconds: 36, purpose: 'Show exact before/after proof', requiredAssetIds: ['A1', 'A3', 'A4'], requiredProofIds: ['R2', 'R3'], requiredCaveatIds: ['C1'], motion: ['reveal', 'compare']},
    {id: 'SC-05', startSeconds: 36, endSeconds: 49, purpose: 'Preserve limitation and judgment', requiredAssetIds: ['A5'], requiredProofIds: ['R4'], requiredCaveatIds: ['C2'], motion: ['reveal', 'emphasis']}
  ],
  assets: {
    A1: {id: 'A1', kind: 'text', value: 'PAGE 2\nQUẢN LÝ CÔNG VIỆC\n1. Thu thập yêu cầu\n2. Ưu tiên việc quan trọng\nFooter: Internal handbook', source: 'AITIP-TEST-0001 E2 Input', truthLabel: 'E2 sample input'},
    A2: {id: 'A2', kind: 'text', value: 'Chuyển đoạn text sau thành Markdown sạch. Giữ nguyên nội dung, không thêm hay bớt ý. Tiêu đề chuyển thành dấu thăng. Danh sách chuyển thành gạch đầu dòng. Xóa số trang, header, footer và ký tự thừa.', source: 'AITIP-TEST-0001 E2 Instruction', truthLabel: 'Instruction đã test trong E2'},
    A3: {id: 'A3', kind: 'text', value: '# Quản lý công việc\n\n- Thu thập yêu cầu\n- Ưu tiên việc quan trọng', source: 'AITIP-TEST-0001 E2 Observed output', truthLabel: 'E2 observed output'},
    A4: {id: 'A4', kind: 'text', value: '✓ Bỏ số trang\n✓ Bỏ header/footer\n✓ Đổi tiêu đề\n✓ Đổi danh sách', source: 'AITIP-TEST-0001 E2 Verification', truthLabel: 'E2 criteria · 4/4'},
    A5: {id: 'A5', kind: 'text', value: 'Mẫu ngắn; tài liệu dài, bảng phức tạp hoặc OCR cần test riêng. Kết quả vẫn cần con người kiểm tra.', source: 'AITIP-TEST-0001 E2 limits + Script S3', truthLabel: 'Verified scope/limits'}
  },
  proofIds: ['R1', 'R2', 'R3', 'R4'],
  caveatIds: ['C1', 'C2'],
  technicalQa: 'PASS',
  animationReview: 'pass',
  humanDecision: 'not-applicable',
  unresolvedBlockers: ['reverse-audit fixture is not a production input'],
  voiceHandoffStatus: 'BLOCKED',
  voiceHandoff: {
    sourceScript: 'content/scripts/TEST-0002_prompt-don-markdown-script-contract.md',
    implementationRef: 'video-factory/animation/src/Test0002.tsx',
    technicalPreviewLocation: 'generated/previews/TEST-0002.mp4',
    totalDurationSeconds: 49,
    hardMaximumSecondsExclusive: 60,
    sceneSlots: [
      {sceneId: 'SC-01', startSeconds: 0, endSeconds: 7, spokenCopy: 'Bạn copy text từ PDF vào ghi chú, rồi mất thời gian dọn số trang, footer và xuống dòng?', pauseWindows: []},
      {sceneId: 'SC-02', startSeconds: 7, endSeconds: 10, spokenCopy: 'Thử giao riêng phần định dạng cho AI.', pauseWindows: []},
      {sceneId: 'SC-03', startSeconds: 10, endSeconds: 26, spokenCopy: 'Dán đoạn text vào AI chat bạn đang dùng, rồi thêm yêu cầu này:\n\n“Chuyển đoạn text thành Markdown sạch. Giữ nguyên nội dung. Đổi tiêu đề và danh sách đúng định dạng. Xóa số trang, header, footer và ký tự thừa.”', pauseWindows: [{startSeconds: 25, endSeconds: 26, sourceMarker: '[pause]'}]},
      {sceneId: 'SC-04', startSeconds: 26, endSeconds: 36, spokenCopy: 'Khi AI trả kết quả, đừng copy ngay. So lại bốn điểm: tiêu đề, danh sách, phần rác đã bị xóa, và nội dung có thiếu hay thừa không.', pauseWindows: []},
      {sceneId: 'SC-05', startSeconds: 36, endSeconds: 49, spokenCopy: 'Test hiện tại chỉ dùng một mẫu ngắn, nên tài liệu dài, bảng hoặc OCR vẫn cần kiểm tra riêng.\n\nAI có thể dọn định dạng. Còn nội dung nào đáng giữ, mình vẫn phải quyết.', pauseWindows: []}
    ],
    pronunciationSensitiveText: ['PDF', 'Markdown', 'OCR'],
    proofCaveatTiming: [
      {sceneId: 'SC-03', requirementIds: ['R1']},
      {sceneId: 'SC-04', requirementIds: ['R2', 'R3', 'C1']},
      {sceneId: 'SC-05', requirementIds: ['R4', 'C2']}
    ],
    audioGenerated: false
  }
};
