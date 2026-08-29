---
type: canonical-engine
step: 05
status: implemented
framework: remotion
downstream_boundary: voice-not-implemented
---

# Animation Engine — STEP 05

## Operating authority

ChatGPT reviews creative/editorial fidelity and gives delegated operator acceptance under valid Content Approval. Codex owns executable manifests, Remotion/runtime implementation, source validation and technical QA. Product Owner does not approve Animation by default; no acceptance overrides a failed upstream or technical gate. See PROJECT.md §23.

## Operator UX compatibility

STEP 05 is internal machinery. Legacy human_decision approved means ChatGPT delegated operator acceptance under active Content Approval after source/runtime/QA gates PASS. Product Owner does not inspect Animation artifacts by default; creative feedback is routed by ChatGPT, and market-facing meaning changes invalidate Content Approval.


Animation Engine biến **approved Visual Direction** thành executable 9:16 timeline, scene implementation, local assets, technical preview và QA record. Engine dừng ở delegated operator acceptance + Voice handoff contract; không tạo voice, audio, caption, final export hay publishing automation.

## 1. Framework decision

CKAI dùng **Remotion + React + TypeScript**, pin version trong `package.json`/`package-lock.json`: frame/timeline deterministic; code là source of truth; primitives có thể reuse; native 1080×1920; input/proof/caveat/gates audit được bằng code. Runtime render không dùng network asset/font/API. Remotion là local production runtime, không phải publishing service.

## 2. Input contract

Production execution không tin một READY string được copy vào Animation manifest. Validator đọc trực tiếp canonical Visual Direction source và chỉ derive upstream `READY` khi toàn bộ conjunction sau đúng:

```text
source Visual Direction exists and matches source_visual_direction
AND source checksum == source_visual_direction_sha256
AND Visual Direction.visual_input_eligibility == production
AND source Storyboard exists and is production-valid
AND Storyboard exact STEP 03 handoff invariant == READY
AND Visual Direction.visual_input_check == PASS
AND storyboard_trace_check == PASS
AND proof_evidence_check == PASS
AND caveat_check == PASS
AND asset_provenance_check == PASS
AND native_vertical_check == PASS
AND continuity_check == PASS
AND readability_density_check == PASS
AND brand_check == PASS
AND boundary_check == PASS
AND visual_quality_check == PASS
AND visual_review == pass
AND human_decision == approved
AND animation_handoff_status == READY
AND unresolved_issues == none
```

Animation manifest vẫn lưu `upstream_animation_handoff_status`, nhưng đây là **derived/verified state** phải khớp kết quả source validation, không phải authorization token tự khai báo. Thiếu một vế, source/ref/hash mismatch hoặc declared state khác derived state thì production render `BLOCKED`; đổi riêng `BLOCKED → READY` không mở gate. Runtime không tự sửa/fill Visual Direction.

Validator dùng direct source parse (Pattern A), kiểm Content ID/ref và trace Visual Direction → Storyboard → canonical STEP 02 approved Script; Script status/editorial/human/duration/evidence/handoff gates cũng phải hợp lệ. SHA-256 của exact Visual Direction bytes là lightweight freshness check: source đổi sau khi manifest được lập sẽ bị stale checksum và `BLOCKED` cho tới khi maintainer revalidate source rồi cập nhật checksum.

Reverse-audit chỉ chạy qua explicit `reverse-audit-proof` mode để test schema/timeline/render. Mode này yêu cầu source Visual Direction + Storyboard vẫn mang eligibility reverse-audit, human `not-applicable`, handoff `BLOCKED`; vì vậy đổi riêng Animation `input_eligibility` không thể biến fixture thành production.

## 3. Canonical executable manifest

Mỗi animation có executable manifest cùng code refs:

```yaml
id: CKAI-000N-Animation
source_visual_direction: content/visual-directions/CKAI-000N_...md
input_eligibility: production
source_visual_direction_sha256: <SHA-256 OF EXACT SOURCE BYTES>
upstream_animation_handoff_status: READY
width: 1080
height: 1920
fps: 30
total_seconds: 49
scenes:
  - id: SC-01
    start_seconds: 0
    end_seconds: 7
    required_asset_ids: [A1]
    required_proof_ids: []
    required_caveat_ids: []
    motion: [reveal, emphasis]
technical_qa: PASS
animation_review: pass
human_decision: pending
unresolved_blockers: []
voice_handoff_status: BLOCKED
```

Schema/type: [`../video-factory/animation/src/model.ts`](../video-factory/animation/src/model.ts). Proof manifest: [`../video-factory/animation/src/manifest/test0002.ts`](../video-factory/animation/src/manifest/test0002.ts).

## 4. Deterministic timeline contract

```text
frame = round(seconds × fps)
duration_in_frames = end_frame - start_frame
```

Intervals are end-exclusive `[start_frame,end_frame)`. First start is 0; every next start equals previous end; last end equals composition duration. Reveals/transitions live inside scene budget and add no hidden frames. Defaults: `1080×1920`, `30 fps`; TEST-0002: `49 × 30 = 1470` frames.

## 5. Runtime, primitives and motion

- Manifest/data: source, timing, assets, proof/caveat IDs and states.
- Engine: frame math, input/downstream gates and QA.
- Minimal primitives: safe area, scene header, card/panel, code/document text, truth label.
- Central tokens: color, type, spacing, safe margins, radius, elevation.
- Motion grammar: `ENTER → SETTLE → EMPHASIZE → TRANSITION → EXIT`; deterministic, semantic and fully inside scene duration.
- Transition derives from semantic relationship: `CUT | PUSH | SLIDE | FOCUS | MASK_REVEAL | WIPE | ZOOM | FADE | TRANSFORM`; no random preset selection or three identical consecutive transitions.
- Every interval must progress through visual, typography, proof, camera, transition or emphasis. An empty interval is valid only when explicitly marked `INTENTIONAL_EMPHASIS`, `REFLECTION` or `TENSION_HOLD`.
- Actual review binary is inspected for speech-silence plus visual-freeze overlap. Audio silence alone is not mislabeled dead air when a meaningful visual channel continues.

Runtime: [`../video-factory/animation/`](../video-factory/animation/). Add primitives only when an approved scene requires them. No random/decorative motion that hides proof, invented provider UI, stock montage or generative-video dependency.

## 6. Asset and truth contract

Every required asset has `id`, `kind`, non-empty local value/path, source/provenance and `truthLabel`. Missing asset/content/provenance/truth label blocks QA. Required proof/caveat IDs must exist in manifest and owning scene. Fallback is valid only if it preserves the requirement and truth label; illustrative mockup never replaces required actual proof.

## 7. Technical QA

All applicable checks must pass: schema/source refs; 9:16/fps/frame math; complete scene order/windows with no gap/overlap; local asset/provenance/truth labels; mandatory proof/caveat; safe-area/mobile hierarchy; allowed input mode; consistent gate state; bundle/composition/render smoke; output dimensions/fps/duration and no STEP 06 audio.

Validator/tests: [`../video-factory/animation/src/engine/qa.ts`](../video-factory/animation/src/engine/qa.ts), [`../video-factory/animation/tests/animation.test.ts`](../video-factory/animation/tests/animation.test.ts).

## 8. Review, human gate and exact Voice READY invariant

```text
eligible Visual Direction
→ implementation + technical preview
→ technical_qa: PASS
→ animation_review: pass
→ human_decision: pending
→ delegated operator accepted | rejected | needs-changes
```

`voice_handoff_status: READY` **khi và chỉ khi**:

```text
canonical STEP 04 source verification == PASS
AND input_eligibility == production
AND upstream_animation_handoff_status == READY
AND technical_qa == PASS
AND animation_review == pass
AND human_decision == approved
AND unresolved_blockers is empty
```

Bất kỳ conjunct nào fail/pending/BLOCKED bắt buộc Voice `BLOCKED`. `upstream_animation_handoff_status` phải bằng state validator derive từ canonical source; READY tự khai báo không có authority. Render success không phải delegated acceptance; delegated acceptance không override failed QA/upstream gate; `not-applicable` không bao giờ tạo READY.

## 9. Reverse-audit exception and scenarios

TEST-0002 là `legacy-approved-reverse-audit`, upstream `BLOCKED`, human `not-applicable`. Nó chạy source/schema/timeline/render checks qua explicit proof mode, không phải production input, không có production authority và luôn Voice `BLOCKED`.

| Scenario | Canonical STEP 04 source | Declared upstream | Animation QA/review/human | Result |
|---|---|---|---|---|
| A — forged READY | human pending hoặc hard check BLOCKED | READY | otherwise eligible | production input + Voice **BLOCKED** |
| A2 — stale source | checksum mismatch | READY | otherwise eligible | production input + Voice **BLOCKED** |
| B — valid upstream | exact STEP 04 conjunction PASS | READY matching derived READY | QA PASS, review pass, human approved, no blocker | production input PASS; Voice **READY** |
| C — valid upstream, Animation human pending | exact STEP 04 conjunction PASS | READY | QA PASS, review pass, human pending | Voice **BLOCKED** |
| TEST-0002 | reverse-audit source; handoff BLOCKED | BLOCKED | proof QA PASS; human not-applicable | production authority none; Voice **BLOCKED** |

## 10. Voice handoff package — contract only

STEP 06 sẽ nhận một structured package, nhưng STEP 05 không tạo audio:

- approved animation implementation ref + technical preview location;
- approved Script ref và exact Spoken Copy theo từng scene;
- exact scene IDs và `[start_seconds,end_seconds)` windows;
- explicit `[pause]`/`[hold]` windows;
- planned total duration và hard maximum `<60s`;
- pronunciation-sensitive text đã biết;
- proof/caveat timing constraints.

QA bắt package thiếu scene/copy/ref, slot lệch animation timing, pause ngoài scene, thiếu proof/caveat timing, duration lệch hoặc `audioGenerated != false`. Future Voice phải fit vào các slot này; nếu không fit thì return for correction, không silently stretch audio hay đổi visual duration.

Executable TEST-0002 package nằm trong [`../video-factory/animation/src/manifest/test0002.ts`](../video-factory/animation/src/manifest/test0002.ts): exact B1–B5 copy, pause `[25,26)`, terms `PDF/Markdown/OCR`, proof/caveat mapping; status vẫn `BLOCKED`.

## 11. Output hygiene and commands

Generated preview/stills live under gitignored `generated/`; source/manifest/tests/lockfile are committed.

```text
npm ci
npm run animation:check
npm run animation:studio
npm run animation:proof
npm run animation:proof:stills
```

`animation:proof` is a muted technical preview, not final Export. Runtime notes: [`../video-factory/animation/README.md`](../video-factory/animation/README.md).

## 12. STEP 05 stopping rule

STOP after implementation, technical preview/QA, animation review, legacy delegated-operator field and Voice handoff state. Do not build Voice/TTS, music/SFX, captions, final review/Export, auto-post, scheduler, platform API or publishing automation.
