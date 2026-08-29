---
id: TEST-0002
type: short-form-animation-proof
source_visual_direction: ../visual-directions/TEST-0002_prompt-don-markdown_visual-direction.md
source_visual_direction_sha256: E5C965C16CE7C79857880D9ABD0D4ECA7C3966D803660682565808AA2B2E811B
input_eligibility: legacy-approved-reverse-audit
upstream_animation_handoff_status: BLOCKED
executable_manifest: ../../video-factory/animation/src/manifest/test0002.ts
composition_id: TEST-0002-Animation
format: 1080x1920
fps: 30
total_seconds: 49
total_frames: 1470
technical_qa: PASS
animation_review: pass
human_decision: not-applicable
voice_handoff_status: BLOCKED
unresolved_blockers:
  - reverse-audit fixture is not a production input
---

# Animation Contract Proof — TEST-0002

Reverse-audit fixture chứng minh executable Animation Engine, không giả thành production artifact. Technical render chỉ qua explicit `reverse-audit-proof`; render success không thay upstream `BLOCKED`, human `not-applicable` hay Voice `BLOCKED`.

## Source and implementation

- Visual Direction: [`../visual-directions/TEST-0002_prompt-don-markdown_visual-direction.md`](../visual-directions/TEST-0002_prompt-don-markdown_visual-direction.md).
- Manifest: [`../../video-factory/animation/src/manifest/test0002.ts`](../../video-factory/animation/src/manifest/test0002.ts).
- Composition: [`../../video-factory/animation/src/Test0002.tsx`](../../video-factory/animation/src/Test0002.tsx).
- Exact E2 input/instruction/output/limits remain repo-backed A1–A5; no fake provider UI/result.

## Timeline proof

| Scene | Seconds | Frames `[start,end)` | Frames | Main implementation |
|---|---:|---:|---:|---|
| SC-01 | 0–7 | `[0,210)` | 210 | problem + A1 document |
| SC-02 | 7–10 | `[210,300)` | 90 | formatting-only boundary |
| SC-03 | 10–26 | `[300,780)` | 480 | exact A2 instruction + truth label |
| SC-04 | 26–36 | `[780,1080)` | 300 | exact A1/A3 + A4 criteria + caveat |
| SC-05 | 36–49 | `[1080,1470)` | 390 | A5 limitation + human judgment |

No gap/overlap/transition-added frame. `49 × 30 = 1470`.

## Voice handoff data proof

- Exact B1–B5 Spoken Copy is stored per SC-01…SC-05 with source Script reference.
- Scene slots exactly match animation windows; SC-03 carries explicit `[pause]` at `[25,26)`.
- Pronunciation-sensitive terms: `PDF`, `Markdown`, `OCR`.
- R1–R4/C1–C2 timing constraints map to SC-03/04/05; planned duration 49s, ceiling `<60s`.
- `audioGenerated: false`; package exists for contract proof but cannot handoff because fixture is non-production.

## Asset/proof/caveat proof

- A1–A5 resolved with source + truth label; R1–R4 and C1/C2 preserved.
- SC-05 keeps “tài liệu dài, bảng phức tạp hoặc OCR cần test riêng” and human review.
- Runtime network assets/fonts: none. Voice/Audio/Caption components: none.

## Test/render result — 2026-08-23

- Contract tests `7/7 PASS`, gồm forged READY, stale checksum và valid upstream source; bundle/composition discovery `PASS`.
- Five representative stills `PASS` at frames 90, 240, 540, 930, 1260.
- Full muted preview `PASS`: H.264, `1080×1920`, `30 fps`, `49.00s`, DAR `9:16`, video stream only.
- Gitignored output: `generated/previews/TEST-0002.mp4`, 3,081,675 bytes.
- SHA-256: `5CA8D2A06047B2702E40D5B2BD4620DF3C6AD8843096F094F5D87DA4025169DF`.

## Gate proof

| Condition | Result |
|---|---|
| Technical QA/render | PASS |
| Production input / upstream handoff | BLOCKED — reverse-audit only |
| Animation review | pass for contract proof |
| Human decision | not-applicable |
| Voice handoff | **BLOCKED** |

This proves `render PASS ≠ production approval ≠ Voice READY`.

- **Scenario A — forged/stale:** Animation khai production + upstream READY nhưng canonical Visual Direction có human pending, hoặc source hash stale → direct source verification derive `BLOCKED`; production input và Voice đều `BLOCKED`.
- **Scenario B — valid upstream:** canonical Visual Direction + traced Storyboard thỏa exact STEP 04/03 invariants, checksum khớp → source gate PASS; chỉ khi Animation QA/review/human/no-blocker cũng đủ thì Voice `READY`.
- **Proof isolation:** đổi riêng TEST-0002 Animation eligibility/upstream thành production/READY vẫn fail vì canonical Visual Direction và Storyboard source còn reverse-audit + human `not-applicable` + handoff `BLOCKED`.
