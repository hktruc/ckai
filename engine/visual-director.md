---
type: engine
scope: short-form-visual-direction
version: 2
---

# Visual Director — STEP 04

Canonical Visual DNA for new generic production: [`visual-dna.md`](visual-dna.md) → `CKAI_DARK_PREMIUM_EDITORIAL_V1`. Visual DNA defines feeling, hierarchy and shared grammar, not a rigid slide anatomy.

## Operating authority

ChatGPT owns editorial/semantic creative direction and visual concept judgment. Codex persists the Visual Direction contract and validates provenance, readability, continuity, brand/boundary and handoff gates. delegated operator acceptance remains separate and cannot override a hard failure. See PROJECT.md §23.

## Operator UX compatibility

STEP 04 is internal machinery. Legacy human_decision approved means ChatGPT delegated operator acceptance under an active Content Approval after all visual hard checks PASS. Product Owner is interrupted only for a brand-sensitive choice or other owner-interrupt condition. Meaning changes return to STEP 02.


Visual Director mở rộng cùng CKAI lifecycle và Content ID; không tạo Video Factory song song.

```text
APPROVED STORYBOARD → VISUAL INPUT CHECK → GLOBAL VISUAL LANGUAGE
                    → SCENE VISUAL CONCEPT → COMPOSITION / HIERARCHY
                    → TEXT / PROOF REPRESENTATION → ASSET REQUIREMENTS
                    → CONTINUITY → VISUAL REVIEW → DELEGATED OPERATOR ACCEPTANCE
                    → ANIMATION HANDOFF READY → STOP BEFORE ANIMATION
```

Visual Director trả lời: “Scene này nên được thể hiện bằng ngôn ngữ hình ảnh nào để truyền tải đúng storyboard?” Nó không quyết định animation được implement thế nào.

## 1. Input contract

Production path chỉ nhận canonical storyboard thỏa toàn bộ **Exact READY invariant** tại [`storyboard-engine.md`](storyboard-engine.md) §9:

- `id: CKAI-*`, `type: short-form-storyboard`, `format: vertical-9x16`;
- `input_eligibility: production`, `storyboard_status: approved`;
- `storyboard_review: pass`, `human_decision: approved`;
- `visual_director_handoff_status: READY`;
- input/mapping/timing/proof/caveat/quality/boundary checks đều `PASS`;
- approved script reference tồn tại;
- scene timing, exact Spoken Copy mapping, semantic visual function, mandatory text, proof/evidence, caveat và continuity rõ;
- `unresolved_issues: none`.

Không đọc draft/review storyboard rồi tự “fix”; không bypass delegated operator acceptance; không rewrite script/Spoken Copy; không làm yếu proof/caveat; không invent claim, UI hoặc result. Thiếu điều kiện thì `visual_input_check: BLOCKED` và dừng trước visual concept.

Reverse-audit fixture có thể dùng `visual_input_eligibility: legacy-approved-reverse-audit` để chạy schema/review checks. Nó không phải production input, không đổi source Storyboard thành READY, dùng human `not-applicable` và luôn `animation_handoff_status: BLOCKED`.

## 2. Layer boundaries

### Storyboard → Visual Director

- Storyboard quyết định scene nào cần tồn tại, timing, Spoken Copy mapping và **hình ảnh cần làm nhiệm vụ gì**.
- Visual Director quyết định visual concept, representation, hierarchy, composition intent, asset requirements và continuity để thực hiện đúng nhiệm vụ đó.
- Visual Director không được đổi scene logic hoặc bỏ requirement để art direction “đẹp hơn”. Nếu storyboard không thể biểu diễn rõ/rộng vừa budget, trả lại Storyboard layer.

### Visual Director → Animation Engine

Visual Director được phép quyết định:

- visual language, concept/metaphor và representation type;
- focal/supporting elements, foreground/background role và spatial hierarchy;
- composition intent, text hierarchy, style treatment và brand-fit direction;
- proof/caveat representation, asset requirements và scene-to-scene continuity;
- semantic motion intent như `reveal`, `assemble`, `transform`, `highlight`, `compare`, `focus-shift`.

Không được quyết định React/Remotion component, CSS/SVG implementation, frames, keyframes, easing, spring constants, transition code, exact motion duration, FFmpeg, renderer hoặc code architecture. Những phần đó thuộc future Animation Engine.

## 3. Canonical schema

Mỗi visual direction là companion file `content/visual-directions/CKAI-000N_slug_visual-direction.md`, dùng [`../content/visual-directions/TEMPLATE.md`](../content/visual-directions/TEMPLATE.md). Source storyboard/script không bị move hoặc rewrite.

Frontmatter tối thiểu:

```yaml
id: CKAI-000N
type: short-form-visual-direction
content_stream: chanh-kien # chanh-kien | tuyet-chieu-ai
format: vertical-9x16
visual_input_eligibility: production # production | legacy-approved-reverse-audit
source_approved_storyboard: ../storyboards/CKAI-000N_slug_storyboard.md
source_approved_script: ../approved/CKAI-000N_slug.md
visual_direction_status: draft # draft | review | approved | archived
visual_review: pending         # pending | pass | revise | reject
human_decision: pending        # pending | approved | rejected | needs-changes | not-applicable
animation_handoff_status: BLOCKED # BLOCKED | READY
scene_count:
visual_input_check: pending    # pending | PASS | BLOCKED
storyboard_trace_check: pending # pending | PASS | BLOCKED
proof_evidence_check: pending # pending | PASS | BLOCKED
caveat_check: pending         # pending | PASS | BLOCKED
asset_provenance_check: pending # pending | PASS | BLOCKED
native_vertical_check: pending # pending | PASS | BLOCKED
continuity_check: pending     # pending | PASS | BLOCKED
readability_density_check: pending # pending | PASS | BLOCKED
brand_check: pending          # pending | PASS | BLOCKED
boundary_check: pending       # pending | PASS | BLOCKED
visual_quality_check: pending # pending | PASS | BLOCKED
unresolved_issues:
created: YYYY-MM-DD
updated: YYYY-MM-DD
```

Body bắt buộc gồm source/input audit, global visual language, scene visual directions, asset ledger, continuity map, proof/caveat traceability, quality review, delegated operator decision và Animation handoff package.

## 4. Global visual language

Mỗi video phải có một visual-language statement dùng xuyên scene:

- density: clean/minimal/dense có kiểm soát;
- mode: editorial/technical/conceptual;
- dimensionality: flat/dimensional;
- representation: abstract/representational/UI-like/text-led/illustration-led;
- background philosophy, whitespace và emphasis principles;
- repeated primitives và semantic roles;
- continuity strategy.

Phải tách:

- **Stable brand constraints:** clarity, calm credibility, useful visuals, honest proof labels, mobile readability và consistent semantic roles; xem [`../knowledge/brand.md`](../knowledge/brand.md).
- **Experimental visual choices:** palette, exact font family, illustration treatment, dimensionality, texture hoặc transition feel. Ghi rationale; không nâng thành CKAI invariant khi chưa có production learning.

Global language đủ để scenes giống cùng một video, nhưng không phải enterprise design system.

### Visual primitives

Dùng vocabulary mở, có thể tái sử dụng: `text`, `keyword`, `card`, `badge`, `icon`, `shape`, `connector`, `diagram`, `ui-panel`, `prompt-block`, `document`, `result-panel`, `comparison`, `before-after`, `metric`, `warning`, `image/illustration`, `abstract-object`.

Không hard-code closed enum và không build component/asset library ở STEP 04.

## 5. Scene visual-direction contract

Mỗi scene `SC-01...` phải giữ ID/timing từ Storyboard và có:

```text
storyboard reference + timing reference
semantic visual function
display copy: selective hero phrase | keyword | number | proof label | short contrast | conclusion | essential evidence
semantic visual objective: comparison | process | abstract-concept | proof | key-insight | tension | conclusion
semantic archetype: thesis-declaration | contrast-before-after | investigation-verification | transformation | consequence-payoff | evidence-proof | reflection-insight | warning-tension | conclusion-distillation
visual mode: typographic-editorial | object-metaphor-cinematic | proof-evidence-presentation | transformation-comparison
primary visual concept + representation type
primary visual object + optional visual metaphor
central tension + why-this-object rationale (hoặc semantic object = none)
focal element + supporting elements
composition strategy + spatial hierarchy
lighting strategy + depth strategy + purposeful line role
typography strategy + active negative-space role + eye path
pacing intent (semantic only; không phải frame/transition timing)
proof strategy + accent rationale
source strategy: typography-only | procedural-semantic-object | canonical-evidence-representation | approved-local-asset
forbidden fallback anatomy: text wall + generic shape/card/geometry + default typography block
emotional tone + relationship to preceding/following scene
background intent
on-screen text hierarchy
proof representation + truth label
caveat representation
asset requirements
continuity notes
semantic motion intent (nếu cần)
density/readability warning
reviewer note
```

Không đổi timing/Spoken Copy. Nếu visual requirement cần timing khác hoặc scene split/merge, đặt `storyboard_trace_check: BLOCKED` và trả lại Storyboard layer.

Production không được suy diễn im lặng các field creative còn thiếu. Thiếu `display copy`, semantic archetype/mode/object, concept/rationale, composition, light/depth/type/proof/negative-space/source strategy hoặc forbidden fallback anatomy phải trả `VISUAL_DIRECTION_INSUFFICIENT_FOR_PRODUCTION` và route về STEP 04 enrichment. Default/fallback chỉ tồn tại cho fixture/reverse-audit không có production authority.

Mỗi production scene còn phải chọn rõ `CODE_NATIVE`, `REAL_EVIDENCE` hoặc `GENERATED_KEY_VISUAL`. `CURATED_OR_GENERATED_KEY_VISUAL` chỉ là legacy compatibility alias và được runtime normalize. `REAL_EVIDENCE` ưu tiên khi proof là trọng tâm và dùng filesystem asset contract có provenance/SHA-256/rights/truth/crop/animation boundary. Rich visual dùng provider-agnostic Key Visual Brief; không có asset thì ghi `KEY_VISUAL_ASSET_REQUIRED`, không giả primitive geometry thành artwork-grade. Magnifying glass, scale, stacked layers, fracture và domino là literal-metaphor warning; chỉ hợp lệ khi có contextual second-order rationale. Runtime generation/QA follow [`semantic-retention-visual-intelligence.md`](semantic-retention-visual-intelligence.md).

Art direction phải pass art-quality lint tại [`../video-factory/animation/src/visual-system/art-quality.ts`](../video-factory/animation/src/visual-system/art-quality.ts). Một object chung chung, anatomy card/UI, line/glow trang trí, adjacent anatomy lặp hoặc rule gắn với exact copy/fixture đều `BLOCKED`. Không có metaphor đủ mạnh thì chuyển sang typography-led composition; không thêm object để lấp chỗ trống.

## 6. Native vertical 9:16 composition

- Thiết kế native vertical, không lấy layout ngang rồi crop.
- Dùng hierarchy theo trục dọc và xác định top/middle/bottom roles khi hữu ích.
- Mỗi scene có một attention priority/focal subject rõ.
- Text/proof chính phải đọc được ở mobile viewing distance; tránh detail/UI quá nhỏ.
- Giảm simultaneous focal elements; không để headline, UI, result và caveat cùng tranh mức ưu tiên.
- Split comparison phải được thích nghi cho vertical, ví dụ stacked before/after; không mặc định two-column ngang.
- Chỉ ghi composition intent/spatial relationship, không encode pixel coordinates hoặc exact layout geometry.

`native_vertical_check: BLOCKED` nếu composition phụ thuộc crop ngang, hierarchy không rõ hoặc evidence/text không thể đọc trên mobile.

## 7. Stream-specific behavior

### `tuyet-chieu-ai`

Visual phải giúp người xem làm theo: problem state → input/action/process → output/proof → limitation. Prompt phải nhận diện được là prompt; result phải có representation rõ; step order không được mơ hồ.

Production learning từ CKAI-0006 V1.2 định tuyến mode này theo `PRACTICAL`: hình ảnh liên quan trực tiếp workflow/action/result; ưu tiên broadcast/editorial moving-image language và shot grammar; workflow là nội dung; UI chỉ là một actor trong thế giới hình ảnh. `Practical != dashboard`, `Technical != presentation deck`, và animation chỉ là công cụ. Đây là routing rule tối giản, không phải framework hoặc engine mới.

- Khi Storyboard yêu cầu actual evidence, verified input/output hoặc capture phải là focal proof, không bị thay bằng decorative mockup.
- Schematic/stylized UI được phép nếu được truth-label đúng và không làm người xem hiểu là provider UI thật.
- Không tạo fake screenshot/provider capability; không dùng beauty shot thay validation criteria.

### `chanh-kien`

Visual phục vụ tension, conceptual contrast, reasoning, reframing và implication. Có thể dùng metaphor, abstraction, progressive reveal hoặc symbolic relationship, nhưng không biến thành slide deck/tutorial literal và không tạo pseudo-chart/data.

Mode `THINKING` tương ứng với nội dung conceptual/philosophical/corrective và có thể dùng metaphor khi nó làm rõ reasoning. Không ép workflow literal của `PRACTICAL` lên mode này.

Lightweight reference cho CKAI-0001: có thể giữ một persistent “bình phong” như conceptual relationship che ham muốn/lý do, rồi reveal lớp phía sau; đây chỉ là semantic visual reference, không khóa illustration style hoặc animation mechanic.

## 8. Proof/evidence representation

Mọi proof-critical scene phải phân loại representation:

- `actual-proof`: asset/data/output có provenance và trực tiếp hỗ trợ claim;
- `visual-representation`: diễn đạt lại evidence thật, trace được về source;
- `illustrative-mockup`: minh họa, không được trình bày như actual proof;
- `conceptual-metaphor`: giúp hiểu ý, không chứng minh factual capability.

Mỗi entry ghi `truth_label`, source/provenance và claim/requirement được hỗ trợ. Mockup/metaphor không thay actual proof. Không fabricate UI state, provider capability, result, metric, testimonial, chart/data, benchmark hoặc logo/context gây hiểu lầm.

Nếu required proof chưa có asset/provenance hợp lệ: `proof_evidence_check: BLOCKED` hoặc `asset_provenance_check: BLOCKED`; Visual Direction không READY dù human approved.

PO trusted verification follows [`visual-dna.md`](visual-dna.md): `product-owner-confirmed` may prevent ceremonial re-testing of a normal low-risk claim, but cannot override conflicting evidence or convert a mockup/metaphor into actual proof. Time-sensitive/high-impact claims and direct visual-proof claims retain independent verification requirements.

## 9. Asset requirement contract

Visual Director chỉ định loại asset cần có; không download/generate/build asset.

Mỗi asset requirement gồm:

```text
asset_id
scene_id
asset_type
purpose
priority: REQUIRED | OPTIONAL
provenance/source requirement
evidence_critical: yes | no
truth label
valid fallback (nếu có)
status: AVAILABLE | NEEDED | BLOCKED
```

Asset có thể là verified screenshot, logo, icon, document excerpt, sample input, output example, illustration/reference, product UI, diagram elements hoặc abstract shapes. Fallback chỉ hợp lệ nếu không hạ proof requirement và được label đúng.

## 10. Text hierarchy

Storyboard quyết định text nào bắt buộc xuất hiện; Visual Director quyết định vai trò:

`primary headline` · `step label` · `keyword emphasis` · `supporting label` · `proof text` · `warning/caveat` · `result` · `annotation`.

- Không duplicate toàn bộ VO và không build subtitle renderer.
- `Spoken Copy` chỉ là nguồn Voice. `display copy` là lựa chọn editorial ngắn cho visual; không tự động dump narration lên frame, không shrink text wall để fit.
- Main visual và text không cạnh tranh cùng priority.
- Proof/caveat không được giảm visibility đến mức mất ý.
- Prompt/dense text cần readable state và hierarchy, nhưng không khóa pixel font size hay font implementation.

## 11. Continuity và semantic motion intent

Continuity map phải theo dõi persistent object/UI/document, semantic role, spatial orientation, before/after relationship và step progression. Không đổi representation vô cớ làm viewer tưởng là object khác.

`motion_intent` là optional và chỉ dùng vocabulary semantic như `reveal`, `transform`, `build`, `compare`, `focus`, `emphasize`, `progress`, `replace`, `collapse`, `expand`. Không chứa duration implementation, frame, keyframe, easing, spring, transition code hoặc component.

## 12. Visual review và hard gate

Review bắt buộc kiểm tra:

1. Visual concept có hỗ trợ semantic function/narrative không?
2. Có contradict/rewrite Storyboard hoặc Spoken Copy không?
3. Required proof được represent đúng và truth-label rõ không?
4. Có fake proof/mockup ambiguity/invented claim không?
5. Caveat có đủ visible không?
6. Asset provenance có rõ và evidence-critical asset có available không?
7. Composition có native 9:16 và mobile-readable không?
8. Scene có quá dày, quá nhiều focal elements hoặc decoration vô chức năng không?
9. Global visual language và semantic roles có nhất quán không?
10. Continuity/object identity có conflict không?
11. Text hierarchy có đúng priority không?
12. Visual direction có phù hợp brand và đúng stream behavior không?
13. Có animation implementation leakage không?

`visual_quality_check: PASS` chỉ khi toàn bộ checklist đạt. Một item BLOCKED/REVISE làm consolidated quality check `BLOCKED`.

## 13. States, delegated operator gate và exact READY invariant

```text
generated
  → visual_direction_status: draft
  → visual_review: pending
  → human_decision: pending
  → animation_handoff_status: BLOCKED

visual review PASS
  → visual_direction_status: review
  → visual_review: pass
  → human_decision: pending
  → vẫn BLOCKED

delegated operator acceptance chỉ là một conjunct
  + toàn bộ production hard gates cùng đạt
  → visual_direction_status: approved
  → animation_handoff_status: READY
```

`animation_handoff_status: READY` **khi và chỉ khi**:

```text
visual_input_eligibility == production
AND visual_input_check == PASS
AND source storyboard satisfies STEP 03 Exact READY invariant
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
AND unresolved_issues == none
```

Bất kỳ conjunct nào pending/REVISE/BLOCKED/fail đều bắt buộc `animation_handoff_status: BLOCKED`, kể cả human đã approved. delegated operator acceptance không override evidence, provenance, readability, editorial hoặc boundary gate. Fixture/reverse-audit và `not-applicable` luôn BLOCKED.

### Contract scenarios

| Scenario | Production input | Visual hard checks | Review | Human | Unresolved | Animation handoff |
|---|---|---|---|---|---|---|
| Human approved nhưng asset provenance BLOCKED | PASS | BLOCKED | pass | approved | none | **BLOCKED** |
| Toàn bộ conjunction đạt | PASS | PASS | pass | approved | none | **READY** |

Scenario READY là state contract, không tạo production artifact giả.

## 14. Animation handoff package

Chỉ visual direction thỏa exact READY invariant mới handoff:

- approved visual direction + approved storyboard/script references;
- scene timing, visual concept, composition/hierarchy và element list;
- asset requirements/provenance, text hierarchy và proof/caveat representation;
- continuity constraints, semantic motion intent và brand constraints;
- unresolved issues phải `none`.

Package không chứa animation mechanics hoặc framework choice.

## 15. Workflow entrypoint và proof

STEP 04 không thêm `/ck-visual`. Sau verified Storyboard hoặc khi ChatGPT operator route creative feedback tới Visual Direction, maintainer áp dụng engine này và [`../content/visual-directions/TEMPLATE.md`](../content/visual-directions/TEMPLATE.md) trực tiếp. Product Owner không cần biết command/engine name.

Proof: [`../content/visual-directions/TEST-0002_prompt-don-markdown_visual-direction.md`](../content/visual-directions/TEST-0002_prompt-don-markdown_visual-direction.md) reverse-audit Storyboard TEST-0002. Fixture dùng exact E2 input/output làm traceable proof representation, kiểm tra 9:16/hierarchy/assets/continuity nhưng luôn Animation `BLOCKED` vì non-production + `not-applicable`.

## 16. Stopping rule

STEP 04 kết thúc tại approved Visual Direction + Animation handoff contract. Không triển khai Animation Engine, Remotion/React/CSS/SVG animation, timeline, frames/keyframes/easing/spring, transition code, FFmpeg/render pipeline, image generation workflow, asset downloader/library/database, TTS/voice cloning, music/SFX, subtitle renderer, export, publishing automation, platform API, scheduler, analytics dashboard, database hoặc web app. Không chạy AI video generation.
