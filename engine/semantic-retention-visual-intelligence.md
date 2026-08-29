# Semantic + Retention Visual Intelligence — Phase 1

> Runtime policy mở rộng STEP 04–07. Không tạo editorial authority mới, không thay Visual DNA, không đổi Spoken Copy/Voice/Mastering và không bypass Final Review.

## North Star và boundary

`Semantic correctness is the floor. Retention is the performance standard.` Actual rendered binary và human viewer review cao hơn internal score. Pipeline:

`Approved Spoken Copy → normalized Scene Semantic Plan → whole-video Retention Plan → Visual Source Router → Asset Preparation → Asset QA → Remotion composition → Composed-frame QA → actual rendered-video QA → existing Facebook Review Package`.

STEP 04 Visual Direction vẫn là creative source. Runtime chỉ normalize/validate và thực thi; `CKAI_DARK_PREMIUM_EDITORIAL_V1` chỉ điều khiển cảm giác sau khi `viewer_should_see` đã rõ.

## Scene Semantic Plan

Mỗi scene bắt buộc có `scene_id`, `spoken_meaning`, `semantic_core`, `viewer_should_see`, `retention_role`, `must_show`, `must_not_show`. `viewer_should_see` phải mô tả object/relationship/state người xem cần thấy, không lặp Spoken Copy. `retention_role` thuộc `HOOK | CURIOSITY | CONTEXT | CONTRAST | PROOF | ESCALATION | REVEAL | PAYOFF | BREATH`.

Retention Director nhìn toàn video và ghi `hook`, `open_loops`, `semantic_beats`, `pattern_interrupts`, `intensity_curve`, `payoff`, `dead_zone_risks`. Mỗi scene phải tạo information/curiosity/reveal/visual-state/tension/payoff progression; motion hoặc effect riêng không xóa dead zone.

## Visual Source Router và evidence invariant

Mỗi need route đúng một nguồn: `CODE_NATIVE | REAL_EVIDENCE | GENERATED_KEY_VISUAL`.

- `CODE_NATIVE`: logic, comparison, causality, hierarchy, timeline, process, exact typography hoặc diagram.
- `REAL_EVIDENCE`: số liệu, nghiên cứu, bài báo, screenshot/UI/document/source chart/real person-event-product hoặc factual proof.
- `GENERATED_KEY_VISUAL`: opt-in, non-evidentiary semantic idea có lợi cho comprehension/retention và code-native không tốt hơn.

Hard invariant: `GENERATED_ASSET != EVIDENCE`. Metadata generated luôn có `evidence: false`; proof scene route sai hoặc pseudo-evidence là hard fail. `CURATED_OR_GENERATED_KEY_VISUAL` chỉ là legacy input alias; runtime normalize thành `GENERATED_KEY_VISUAL` khi generation thật được chọn.

## Key Visual Brief, generation và provenance

Creative Brief tách khỏi compiled API prompt. Brief giữ một primary idea, semantic core, viewer-visible relationship, must-show/must-not-show, focal composition, active negative space, magnetism, motion headroom, 9:16 safe/crop contract và Visual DNA constraint. Generated pixels không chứa critical typography mặc định.

Runtime TypeScript dùng official OpenAI SDK. Defaults: `gpt-image-2` và `gpt-5.6-terra`; override bằng `CKAI_IMAGE_MODEL`/`CKAI_VISION_MODEL`. Secret chỉ đọc từ ignored `.env`. Binary lưu dưới `generated/visual-assets/<CONTENT-ID>/<SCENE-ID>/`; metadata giữ stable asset ID, provider/model, timestamp, brief/prompt version, actual SHA-256, attempt, usage, nullable reliable-cost estimate, QA và `evidence: false`.

Generation phải được job opt-in bằng `providerPolicy.allowOpenAIImageGeneration: true`. `autoPurchaseCredits` và `allowPaidFallback` luôn false. Target 2–4 không phải quota; 0 hợp lệ. Hard max 5 accepted/video, 3 attempts/asset, finite total call guard và optional USD guard. Nếu không có reliable price, `estimated_cost_usd: null`; không fabricate cost.

## QA và failure routing

Vision QA đọc actual binary bằng Responses API + Structured Outputs. Semantic Caption Test tự mô tả ảnh trước, không nhận generation prompt. Hard gates: factual integrity fail → reject; semantic relevance <8, specificity <7, magnetism <7 hoặc video usability <7 → retry/reject; không dùng average bù hard failure.

Retry 2/3 phải dùng diagnosis cụ thể. Sau attempt 3: stop generation và replan. Routing:

- `GENERATION_EXECUTION_FAILURE` → Image Asset Service;
- `SEMANTIC_ASSET_MISMATCH` → Key Visual Brief;
- `WRONG_VISUAL_SOURCE` → Source Router;
- `RETENTION_DEAD_ZONE` → Retention Director;
- `SCRIPT_NOT_VISUALIZABLE` → Editorial/Script Review;
- `FAKE_OR_PSEUDO_EVIDENCE` → Evidence/Source Review;
- `COMPOSED_FRAME_FAILURE` → Remotion Composition;
- `VIDEO_RETENTION_FAILURE` → Retention Director.

Asset PASS không đồng nghĩa composed frame PASS. Runner renders an actual frame and re-runs Vision QA for crop/focal subject/typography/hierarchy/safe zone. STEP 07 inspects actual video binary for media integrity, freeze+silence overlap and semantic retention; machine PASS never replaces Product Owner/ChatGPT viewer judgment.

## Runtime and tests

Implementation: `video-factory/visual-intelligence/`; Local Runner integration: `runtime/production-bridge/src/generic-runtime.ts`; Remotion generated-asset composition: `video-factory/animation/src/visual-system/VisualScene.tsx`.

Maintainer commands:

```text
npm run visual-intelligence:test
npm run visual-intelligence:smoke
```

Smoke and unit tests never print the API key. A real trial remains `HUMAN/PRODUCT OWNER ACCEPTANCE: PENDING` until the actual binary is reviewed.

## Phase 1H — Retention execution contract

`Scene` là content unit; `Retention Beat` là viewer-attention unit. Retention Director output không còn chỉ mô tả: mỗi scene mang `retentionExecution` gồm contiguous beat timing, purpose, semantic event, visual state, state change, motion purpose, required progression, pause budget và exit condition. Một beat chỉ hợp lệ khi làm tiến triển meaning, expectation, focal relationship, proof, uncertainty, contrast, open loop hoặc payoff. Camera drift/slow zoom/glow riêng là `COSMETIC_MOTION_ONLY`.

`UNMOTIVATED_SILENCE_POLICY_V1`: dưới 0.6s bình thường; 1.0–1.5s là risk khi progression yếu; trên 1.5s high risk; trên 2s là fail candidate trừ khi có `TENSION | COMPREHENSION | REVEAL | PROOF_READING | PAYOFF_LANDING | EMOTIONAL_BREATH` và actual semantic progression. Narration complete + unchanged scene tail là `UNMOTIVATED_SCENE_TAIL`; scene kết thúc theo semantic need, không giữ legacy allocation.

## CODE_NATIVE semantic mechanism

CODE_NATIVE bắt buộc có `viewer_question`, `entities`, `relationships`, `initial_state`, `transformation`, `final_state`, `insight_revealed`. Vocabulary nhỏ gồm causal/missing-link, hypothesis branching, evidence accumulation, fact-vs-inference, comparison, hierarchy, filtering, confidence/uncertainty, convergence và state transition. Primitive phải encode relationship; text/rectangle/glow không được thay visual reasoning. Typography-first vẫn hợp lệ cho hook/payoff/quote/numeric/editorial case có basis và phải biến đổi.

Hard failures: `GENERIC_PRIMITIVE_FALLBACK`, `SPOKEN_COPY_AS_DISPLAY_COPY_FALLBACK`, `CODE_NATIVE_NOT_EXPRESSIVE_ENOUGH`, `TEXT_DEPENDENT_VISUAL_FAILURE`, `MISSING_SEMANTIC_TRANSFORMATION`, `LEGACY_VISUAL_BEHAVIOR`, `RETENTION_PLAN_EXECUTION_MISMATCH`.

## Actual-MP4 Retention QA V2

Runtime giải mã actual MP4 thành sampled luma activity, đối chiếu focal/state-change peaks với planned beat boundaries và actual speech/silence spans. `actual-retention-timeline.json` ghi từng window, speech activity, silence, visual activity, planned/executed beat, justification, risk và suspicious spans. Slow cosmetic movement không tự được tính là semantic state change.

Whole-video continuity kiểm hero/body quality drop, repeated visual mode, mid-video collapse, source-switch parity và payoff preparation. Hard failures gồm `HERO_SCENE_QUALITY_DROP`, `VISUAL_PATTERN_FATIGUE`, `MID_VIDEO_RETENTION_COLLAPSE`, `SOURCE_SWITCH_QUALITY_GAP`, `FILLER_SCENE`, `PAYOFF_NOT_PREPARED`. Human retention failure sau machine PASS được ghi `RETENTION_QA_FALSE_NEGATIVE`; không whitelist Content ID.

## Phase 1H.5 — Perceptual Progression Gate

`BEAT_PRESENT != PERCEPTUAL_PROGRESSION`. Mỗi retention beat khai báo Level 2/3 perceptual target và viewer dimension cần thay đổi. Runtime execution vẫn được ghi riêng; actual-MP4 selective Vision QA quyết định beat có `perceptually_distinct` hay không bằng ordered frame states. Level 1 glow/opacity/minor scale/drift không đủ. Không dùng average để bù hook, hold, evidence, CODE_NATIVE hoặc payoff failure.

Artifact canonical gồm `perceptual-beat-qa.json`, `perceptual-state-sampling.json`, `code-native-qa.json`, `payoff-qa.json` và actual-retention timeline đã merge perceptual findings. Sampling cost-aware: một request/scene, tối đa bốn state/scene; không gọi Vision từng frame. `PERCEIVED_BEAT_RATIO` được diễn giải theo duration/role, không phải score khoa học phổ quát.

Hard gates: `BEAT_EXECUTED_BUT_NOT_PERCEPTUALLY_DISTINCT`, `PERCEPTUAL_HOLD_TOO_LONG`, `HOOK_VISUALLY_STATIC`, `LONG_SCENE_NO_REENGAGEMENT`, `POST_INFORMATION_LINGER`, `SEMANTIC_MECHANISM_VISUALLY_UNDERPOWERED`, `MICROCOPY_OVERLOAD`, `PAYOFF_AS_END_CARD`. Actual-MP4 perceptual FAIL quay lại Visual Director bằng `PERCEPTUAL_PROGRESSION_REPLAN_REQUIRED`; không được trôi sang Voice acceptance. Vision authorization độc lập với image generation, secret env-only, không thay human acceptance.

## Automatic Perceptual Visual Replan Loop (Phase 1H.6)

Actual-MP4 QA không còn là điểm cuối. Failure P0/P1 phải đi qua centralized recovery registry tại `video-factory/visual-intelligence/src/recovery.ts`, rồi quay về đúng owning layer. Registry phân biệt `DETERMINISTIC_FIX`, `CREATIVE_REPLAN`, `SOURCE_REPLAN`, `RUNTIME_FIX` và `HUMAN_REVIEW`; creative failure không được che bằng cosmetic motion, runtime mismatch không được che bằng creative rewrite.

Automatic policy mặc định: Round 0 initial → tối đa Round 1 và Round 2 → `MACHINE_VISUAL_ACCEPTANCE` hoặc `NEEDS_CHATGPT_CREATIVE_REVIEW`. Mỗi round giữ structured previous-attempt memory, explicit `do_not_repeat`, required improvement và source-escalation boundary. Round 2 không được lặp lại Round 1. `visual_replan_rounds` độc lập với `image_generation_attempts`; evidence-required scene luôn giữ proof authority ở `REAL_EVIDENCE` và không được chuyển thành generated proof.

Scene-local failure chỉ replan scene bị tác động. Whole-video failure (`HERO_SCENE_QUALITY_DROP`, `VISUAL_PATTERN_FATIGUE`, `MID_VIDEO_RETENTION_COLLAPSE`, `SOURCE_SWITCH_QUALITY_GAP`) có thể đổi visual-mode sequence, compression, source cadence và re-engagement placement nhưng không đổi approved editorial meaning. Mọi round vẫn chạy lại Meaning, Evidence, Semantic, actual-retention, Perceptual và Continuity gates trên final rebuilt MP4.

## Phase 1I — Creative Representation Engine

Semantic mechanism chỉ mô tả `WHAT`; Representation Grammar quyết định `HOW THE VIEWER SEES IT HAPPEN`; capability-matched renderer thực thi process thành pixels. Generic compiler tại `video-factory/visual-intelligence/src/representation.ts` tạo `ProcessPlan` gồm typed objects, states, relationships, semantic events, display-copy burden, persistent motifs, evidence regions và explicit representation decision. Source Router vẫn độc lập với Representation Selector.

V1 hỗ trợ `CAUSAL_RELATIONSHIP`, `FILTER_CLASSIFY`, `HYPOTHESIS_BRANCHING`, `CONFIDENCE_UNCERTAINTY`, `EVIDENCE_PROOF`, `TRANSFORMATION_STATE_CHANGE`, `CONVERGENCE_PAYOFF`. Sáu renderer riêng dùng shared primitives; capability mismatch trả `REPRESENTATION_CAPABILITY_MISSING`, không silent fallback về card/title/funnel. Anatomy, rejected alternatives và novelty được lưu để Round 1/2 phải thay viewer-facing representation, không chỉ đổi mechanism name.

Actual-pixel QA tại `representation-qa.ts` so Process Plan với ordered Vision states và phát hiện process/event/object/relationship không perceptible, semantic load nằm ở label, card collapse, scene-role mismatch, evidence integrity/readability, hook/payoff failure, motif break và grammar fatigue. Replan memory đổi grammar/renderer/anatomy, tính `LOW | MEDIUM | HIGH` creative distance và giới hạn hai vòng. Candidate selection theo Meaning → Evidence → hard failures → creative quality → cost; Review Package lấy best candidate, không mặc định latest.

`REAL_EVIDENCE` dùng `EvidenceNativeRenderer`: source/provenance/SHA, semantic regions, context-preserving viewport, proof hierarchy, raw-vs-derived disclosure và `CKAI_EDITORIAL_OVERLAY`. Source pixels giữ factual authority; derived visual không được masquerade raw proof. Hook là `INTERRUPT → TENSION → PROMISE`; payoff là `RESOLVE → SIMPLIFY → LAND`; persistent motif liên kết hai đầu nhưng actual MP4 vẫn là source of truth.

## Phase 1J — Spatial & Motion Realization Engine

Representation grammar và Process Plan nay được biên dịch tiếp thành `SpatialMotionPlan`: topology state được xác định trước geometry, sau đó semantic event được gắn intended structural consequence, trajectory, causality, focal hierarchy, spoken anchor, settle/comprehension window và camera plan. Public vocabulary là semantic motion (`INTRODUCE`, `CONNECT`, `DISCONNECT`, `BREAK`, `BRANCH`, `FILTER`, `VERIFY`, `QUESTION`, `DESTABILIZE`, `REJECT`, `COLLAPSE`, `REVEAL`, `FOCUS`, `MERGE`, `CONVERGE`, `TRANSFORM`, `RESOLVE`) cùng spatial functions (`FIELD`, `REGION`, `LANE`, `PATH`, `BRANCH`, `GAP`, `BRIDGE`, `GATE`, `ANCHOR`, `CLUSTER`, `SOURCE_VIEWPORT`, `CONVERGENCE_TARGET`, `OUTSIDE_FIELD`); CSS/Remotion effects chỉ là implementation detail.

Runtime tách rõ `PLANNED → EXECUTED → PERCEPTUALLY_REALIZED`. Renderer metadata chỉ chứng minh code path chạy; actual production pixels quyết định topology, relationship, state, focal transfer và settle có thực sự đọc được hay không. `PRODUCTION` render ẩn process badge/debug caption; `DIAGNOSTIC` mới được phép hiện chúng. Internal grammar/renderer/event/topology identifiers trong production là `DIAGNOSTIC_OVERLAY_LEAKED_TO_PRODUCTION`; provenance thực như SHA, content ID và verification status không bị nhầm là debug leak.

Evidence camera dùng sequence `ESTABLISH_CONTEXT → REGION_TRAVEL → REGION_FOCUS → LIMITATION → PAYLOAD_COMPLETE → EXIT`, giữ source authority và timing theo Spoken Copy canonical, không dùng Whisper. Failure được route theo origin `PLAN | CAPABILITY | REALIZATION | TIMING | QA_MISMATCH`, với evidence camera và whole-video repetition có owner riêng. Chính sách V1 chỉ cho một realization repair/candidate, giữ nguyên meaning/source/grammar/Process Plan và không tiêu creative-replan round. Candidate tree so sánh cả `R0`/`R0-R` theo Meaning → Evidence → Production Cleanliness → hard Retention/Perceptual → Motion/Spatial → Creative Quality → Cost; repaired/latest không mặc định thắng.

## Phase 1K — Semantic Object Identity & Concrete Visual Language

Semantic role nay được biên dịch qua `Embodiment Selector` trước Representation/Topology/Motion. Mỗi object quan trọng nhận `SemanticSignature` gồm role, mức cụ thể, morphology, spatial/motion/relationship behavior, lifecycle, stability, source affordance, lineage, text dependency và tối thiểu hai identity channels. Concreteness ladder ưu tiên `REAL/SOURCE-BASED → RECOGNIZABLE MATERIAL → SEMANTIC DIAGRAMMATIC`; `ABSTRACT NODE` chỉ hợp lệ khi identity đã được thiết lập và topology đủ rõ. Không có fixed icon dictionary.

Renderer capability registry khai báo material/embodiment support. Generic `SemanticEmbodiment` render proposition fragment, stable anchor, derived trail, branch candidate, negative-space gap, outcome marker, variable control, stability field, interactive gate, earned conclusion, terminal principle và source fragment bằng morphology + relationship + lifecycle thay vì circle/color/label universal fallback. Lineage và transition kind phân biệt `SAME_OBJECT_STATE_CHANGE | OBJECT_REPLACEMENT | DERIVED_OBJECT_CREATION`; important object phải `ESTABLISH` trước complex action và giữ identity qua motion/transformation.

Actual-pixel Identity QA đọc production MP4 samples, đo label-ablation bằng SSIM, kiểm production language, generic reuse, editorial compensation và route failure về `EMBODIMENT_PLAN | EMBODIMENT_CAPABILITY | IDENTITY_REALIZATION | MOTION_SPATIAL_REALIZATION | TIMING | REPRESENTATION_PLAN | SOURCE | QA_MISMATCH`. Mỗi candidate chỉ được tối đa một Identity Realization Repair và một Motion/Spatial Repair; creative replan vẫn tối đa hai vòng. Best Candidate hierarchy thêm Production Language và Semantic Object Identity trước Motion/Spatial; repaired/latest không mặc định thắng.

CKAI-0004 Phase 1K technical probe render `R0` và `R0-I` bằng generic pipeline, dùng lại soundtrack hiện hữu, không tiếp tục STEP 09 và không gọi paid provider. R0-I có cùng actual SHA với R0 nên bị rollback; R0 được đóng Review Package. Meaning, Evidence, Production Cleanliness và Production Language PASS, nhưng actual semantic-role readability không được machine-pass khi không có fresh Vision authority; kết quả đúng là `NEEDS_CHATGPT_CREATIVE_REVIEW`.

## Phase 1K closure — repair-to-renderer propagation

Probe ban đầu xác định repair chỉ đổi metadata `repair.pass/diagnosis`: mọi object CKAI-0004 đều dùng material không phải `ABSTRACT_NODE`, nên repaired Embodiment Decision/Semantic Signature không đổi viewer-facing contract và shared renderer không consume repair metadata. Closure thêm `realization_profile` diagnosis-directed vào Embodiment Decision, biên dịch profile này thành morphology, establishment, relationship attachment, lineage và label-dependency mà `SemanticEmbodiment`/`EvidenceNativeRenderer` thực sự consume. Không có Content-ID/scene-ID branch.

Mọi candidate nay có deterministic fingerprints cho embodiment contract, semantic signatures, viewer-facing scene render contract, compiled Remotion props, cache key và MP4 SHA. `REPAIR_CLAIMS_VIEWER_FACING_CHANGE` buộc render contract thay đổi; metadata-only repair là `IDENTITY_REPAIR_NOT_PROPAGATED`/`REPAIR_NO_OP_BEFORE_RENDER`, còn changed render contract nhưng byte-identical binary là `IDENTITY_REPAIR_PIXEL_NO_OP`. Cache reuse chỉ hợp lệ khi render-contract key, compiled-props hash và actual cached-video SHA cùng khớp.

Closure rerender local xác nhận `SHA(R0) != SHA(R0-I)` và hai ordered samples tại 35%/65% của cả sáu repaired scenes đều `PIXELS_CHANGED`. Đây là architecture/integration PASS, không phải perceptual-quality PASS: Meaning, Evidence, Production Cleanliness và Production Language vẫn PASS; semantic-role readability, identity continuity và motion/spatial quality vẫn chờ human/ChatGPT review vì không chạy paid Vision.
