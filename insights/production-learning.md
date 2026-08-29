# CKAI Production Learning

## CKAI-0004 — V4 pacing case

- **Observation:** CKAI-0004 V4 is perceived as too slow despite technical dead-air PASS.
- **Root cause:** the previous experience check treated continued visual/media progression as sufficient and did not model viewer-perceived waiting between completed spoken ideas.
- **System learning:** `RETENTION_PAUSE` is a separate failure class from `DEAD_AIR`.
- **Generalizable principle:** short-form duration is content-driven; unclassified leading, inter-unit, post-semantic and outro holds must be tightened. Only bounded semantic emphasis or proof-reading need can justify a longer pause. Motion/music alone cannot.
- **Engine change:** `SHORT_FORM_RETENTION_POLICY_V1`, executable timeline evaluation, production Review record validation, and a pre-Review runner gate.
- **QA preventing recurrence:** CKAI-0004 detection plus independent normal, intentional-emphasis and excessive-pause regression cases.
- **Expected future effect:** arbitrary production Content IDs derive retention from their measured Voice/Animation timeline and stop for timeline revision before Review rendering when excessive waiting remains.

This is production-process learning, not publish-performance learning and not a CKAI-0004 exception.

## Generic visual semantics — asset success is not viewer comprehension

- **Observation:** a technically valid asset or visually polished frame can still communicate the wrong relationship, become generic after crop, or imitate evidence.
- **Failure classes:** `SEMANTIC_ASSET_MISMATCH`, `WRONG_VISUAL_SOURCE`, `FAKE_OR_PSEUDO_EVIDENCE`, `COMPOSED_FRAME_FAILURE`.
- **System learning:** validate `viewer_should_see` before source selection, enforce `GENERATED_ASSET != EVIDENCE`, then inspect both actual asset pixels and actual composed-frame pixels.
- **Regression protection:** source-router/evidence tests, bounded QA-directed retry, binary SHA-256 provenance and composed-frame Vision QA.

## Generic short-form retention — motion is not progression

- **Observation:** moving pixels can remain a dead zone when information, curiosity, semantic reveal, visual state, tension and payoff do not advance.
- **Failure classes:** `RETENTION_DEAD_ZONE`, `VIDEO_RETENTION_FAILURE`.
- **System learning:** Retention Director owns whole-video open loops, semantic beats, rhythm variation and payoff; actual rendered-video freeze/silence analysis is a downstream check, not a substitute for the plan.
- **Regression protection:** hook/payoff hard gates, semantic reason-to-continue per scene, actual-binary inspection and human acceptance pending after machine PASS.

## CKAI-0004 — V5.1 under-loud mastering case

- **Observation:** the V5.1 binary passed signal-presence checks, but direct Product Owner listening found both narration too quiet and music effectively imperceptible.
- **Root cause:** technical audibility checks protected against silence and masking but did not enforce perceptually usable short-form playback loudness.
- **System learning:** signal integrity and perceptual mastering readiness are separate gates; neither can substitute for human listening.
- **Generalizable principle:** every short-form review candidate receives versioned Voice/bus mastering, decoded-binary loudness and true-peak measurement, Voice-relative music/SFX checks, and remains human-audio-review required.
- **Engine change:** `CKAI_SHORT_FORM_MASTERING_V1` and explicit perceptual mastering QA in the existing STEP 07 finishing boundary.
- **QA preventing recurrence:** under-loud, clipped/over-compressed, and missing-perceptual-evidence generic regression cases cannot pass merely because an audio stream exists.
- **Expected future effect:** arbitrary production Content IDs inherit the same mastering policy before Final Review; no Content-ID gain branch or fixed cue timestamp is involved.

## Phase 1G human retention failure — machine false negative

- **Observation:** actual CKAI-0004 Phase 1G binary received machine retention PASS while human review found long pauses, slow pacing, held visual states and a strong generated hook followed by template-like CODE_NATIVE body scenes.
- **Root cause:** freeze+silence overlap only detected literal freeze; slow zoom produced moving pixels, and Retention Director metadata did not constrain runtime states.
- **System learning:** `HUMAN_RETENTION_FAILURE + MACHINE_RETENTION_PASS = RETENTION_QA_FALSE_NEGATIVE`. Do not whitelist the binary or tune a Content-ID branch.
- **Policy:** `UNMOTIVATED_SILENCE_POLICY_V1`; narration-complete tails without progression are `UNMOTIVATED_SCENE_TAIL`; camera/parallax/glow alone are `COSMETIC_MOTION_ONLY`; planned beats absent in actual binary are `RETENTION_PLAN_EXECUTION_MISMATCH`.
- **CODE_NATIVE protection:** `GENERIC_PRIMITIVE_FALLBACK`, `SPOKEN_COPY_AS_DISPLAY_COPY_FALLBACK`, `CODE_NATIVE_NOT_EXPRESSIVE_ENOUGH`, `TEXT_DEPENDENT_VISUAL_FAILURE`, `MISSING_SEMANTIC_TRANSFORMATION`, `LEGACY_VISUAL_BEHAVIOR`.
- **Whole-video protection:** `HERO_SCENE_QUALITY_DROP`, `VISUAL_PATTERN_FATIGUE`, `MID_VIDEO_RETENTION_COLLAPSE`, `CREATIVE_QUALITY_DROP`, `SOURCE_SWITCH_QUALITY_GAP`, `FILLER_SCENE`, `PAYOFF_NOT_PREPARED`.
- **Regression protection:** the exact human-rejected binary SHA is preserved as a negative actual-MP4 fixture; QA V2 must reject it generically and compare planned/executed beats, silence, scene tails and continuity.

## Phase 1H human perceptual finding — executed is not experienced

- **Observation:** 23/23 runtime beats executed, yet human review still perceived long dominant states, infographic/card-like body scenes, a weak 0–3s hook event and an end-card payoff.
- **System learning:** `BEAT_PRESENT != PERCEPTUAL_PROGRESSION`; `SIGNAL_PRESENT != PERCEPTUALLY_GOOD`; `ASSET_PRESENT != VIEWER_EXPERIENCE_GOOD`.
- **Gate:** `BEAT_EXECUTED_BUT_NOT_PERCEPTUALLY_DISTINCT` separates Remotion event success from actual viewer-perceived Level 2/3 change.
- **Hold/hook/body:** `PERCEPTUAL_HOLD_TOO_LONG`, `HOOK_VISUALLY_STATIC`, `LONG_SCENE_NO_REENGAGEMENT`.

## CKAI-0004 — Phase 1H.6 automatic-replan probe

- **Observation:** automatic Round 1 raised mean perceived-beat ratio from `0.19` to `0.25`, but the generic recovery renderer remained text/card-led and introduced `POST_INFORMATION_LINGER` plus `MICROCOPY_OVERLOAD`.
- **Observation:** Round 2 whole-video reset reduced mean perceived-beat ratio to `0.12`; it did not repair the static hook, underpowered semantic mechanisms, real-evidence presentation, or end-card payoff.
- **Failed pattern:** replacing one card hierarchy with another card/grid/trapezoid vocabulary is not a creative replan even when composition changes are large.
- **Failed pattern:** a whole-video reset that reuses one generic recovery anatomy across heterogeneous scenes amplifies pattern fatigue.
- **Preference signal:** future recovery should favor concrete object/process transformation, evidence-native crop/reveal, and hook-to-payoff callback designed per semantic role; labels should confirm a visible relationship rather than carry it.
- **Safety outcome:** Meaning and Evidence gates remained PASS; REAL_EVIDENCE was not converted to generated proof; no image or Vbee calls occurred.
- **Machine outcome:** `NEEDS_CHATGPT_CREATIVE_REVIEW`; this is production-process learning, not publish-performance learning and not a CKAI-0004 exception.
- **Evidence:** `EVIDENCE_READABILITY_COMPLETION` identifies payload completion; `POST_INFORMATION_LINGER` blocks empty continuation after comprehension.
- **CODE_NATIVE:** `SEMANTIC_MECHANISM_VISUALLY_UNDERPOWERED` and `MICROCOPY_OVERLOAD` prevent a logically correct mechanism from passing as a label-heavy slide.
- **Payoff:** `PAYOFF_AS_END_CARD` requires convergence/synthesis/callback or another visible completion event, not attractive final copy alone.
- **Metric:** `PERCEIVED_BEAT_RATIO` reports planned/executed/distinct/weak separately and never lets an average hide a hard failure.
- **Regression protection:** selective ordered-frame Vision QA reads actual MP4 pixels; a perceptual FAIL routes back to Visual Director and cannot proceed to Voice acceptance.

## CKAI-0004 — Phase 1I representation-engine probe

- **Observation:** representation-aware replans changed grammar, renderer and anatomy at mostly MEDIUM/HIGH distance, and Round 2 improved perceived-beat ratio from `0.042` to `0.167` plus creative quality from `1.608` to `3.033` while preserving Meaning/Evidence gates.
- **Observation:** different Process Plans still collapsed in actual pixels: all six selected scenes retained `OBJECT_STATE_NOT_PERCEPTIBLE` and `PROCESS_COLLAPSED_TO_CARD_LAYOUT`; four lacked a realized process event.
- **Weak contextual pattern:** label-heavy object/process plans rendered with insufficient spatial displacement and state contrast remain card-like even when the data model and component family differ.
- **Evidence learning:** provenance, SHA, regions, proof hierarchy and overlay disclosure passed structurally, but the actual evidence region remained hard to perceive. Evidence-native architecture must strengthen source-pixel scale, region-to-region camera travel and overlay/source separation without changing evidence.
- **Hook learning:** grammar-family changes alone did not create a perceptible opening event; the generated material needs a decisive fracture/relationship change visible before headline reading.
- **Payoff learning:** payoff impact improved `2 → 4 → 6`, but Vision still found text-led landing, no visible resolution and excessive hold. Convergence must materially reduce/merge objects before final typography appears.
- **Best-round learning:** selection correctly rejected Round 1 because Meaning failed and kept Round 2 over equally hard-failing Round 0 due higher actual creative quality. The package is best diagnostic evidence, not an accepted release.
- **Machine outcome:** `NEEDS_CHATGPT_CREATIVE_REVIEW`; this remains generic production-process learning, never a CKAI-0004 runtime exception or a global ban on cards.

## CKAI-0004 — Phase 1J spatial/motion realization probe

- **Observation:** both actual candidates preserved Meaning, Evidence Integrity and Production Cleanliness, but all planned semantic events could execute while perceived-beat ratio remained `0.000`; actual pixels still relied on unlabeled nodes, centered convergence, text-led endpoints and weak settle states.
- **Repair outcome:** the single bounded realization repair increased displacement/topology emphasis/settle/camera travel without changing meaning, source, grammar or creative round, but worsened hard failures `29 → 31`, motion/spatial failure classes `10 → 13`, and creative quality `2.233 → 2.150`; best-candidate selection correctly rolled back from `R0-R` to `R0`.
- **Generic weak pattern:** larger movement alone does not create semantic motion. Multiple paths converging into a circular target can still read as generic `V/checkmark`; stronger centered motion can amplify anatomy repetition instead of clarifying relationships.
- **Evidence learning:** source context, provenance, region travel, limitation and payload flow were actually present and production-clean, yet the source remained text-dense and the editorial caption carried too much interpretation. Evidence viewport success must be judged separately from evidence readability and relationship legibility.
- **Hook learning:** dots plus connectors do not communicate a causal break without named/visually differentiated relationship states and a readable before/after gap.
- **Payoff learning:** convergence is not resolution when the unresolved relationship does not visibly become a defensible path; final typography and a checkmark-like silhouette cannot substitute for topology completion.
- **QA learning:** production-leak detection must recognize internal grammar/renderer/process identifiers while allowing legitimate evidence provenance such as SHA, verification status and content ID.
- **Machine outcome:** `NEEDS_CHATGPT_CREATIVE_REVIEW`; architecture is implemented, actual weaknesses are correctly rejected, and no CKAI-0004-specific runtime branch was introduced.

## CKAI-0004 — Phase 1K semantic-object embodiment probe

- **Observation:** generic embodiment removed the universal-dot fallback at the renderer boundary: claim/fact/inference/unknown/outcome/hypothesis/source objects now use different morphology, relationship behavior and lifecycle. Label-ablation frames retain meaningful structure in the hook and hypothesis branch; measured label dominance was LOW for SC-01/03/05/06 and MEDIUM for the real-evidence scene SC-04.
- **Observation:** the evidence scene preserves the real source viewport, provenance/SHA and highlighted source region. CKAI-authored explanatory overlay is Vietnamese; raw source material may retain its original language.
- **Repair outcome:** one bounded identity repair produced `R0-I`, but its actual MP4 SHA was identical to R0. Selection correctly rolled back to R0 instead of claiming improvement from metadata-only change.
- **Remaining weakness:** one-frame local inspection and SSIM can verify actual pixels and label footprint, but cannot establish viewer role readability, motion identity or transformation continuity with machine authority. Without a fresh authorized Vision evaluation, every key scene remains conservatively `SEMANTIC_OBJECT_IDENTITY_NOT_PERCEPTIBLE`/unverified.
- **Generic learning:** embodiment metadata is insufficient unless it changes actual pixels; a repair that does not alter the binary is a no-op. Source fragments and negative-space gaps are stronger semantic materials than anonymous nodes, while repeated convergence anatomy can still blur FACT/INFERENCE/PRINCIPLE distinctions.
- **Safety outcome:** no OpenAI Vision, image-generation or Vbee call occurred; no secret was exposed; Phase 2 Audio and paused STEP 09 were untouched.
- **Machine outcome:** `NEEDS_CHATGPT_CREATIVE_REVIEW`; architecture is complete, no false PASS was emitted, and no CKAI-0004 runtime branch was added.

## Phase 1K closure — metadata repair is not renderer repair

- **Exact defect:** the first R0-I only changed `repair.pass/diagnosis`; all current materials were non-`ABSTRACT_NODE`, repaired viewer-facing decisions/signatures stayed unchanged, and shared renderers did not consume the repair metadata. Identical SHA was therefore an integration signal, not evidence that the creative diagnosis was wrong.
- **Generic correction:** diagnosis-directed `realization_profile` now crosses Embodiment Decision → Semantic Signature → scene render contract → compiled Remotion props → shared `SemanticEmbodiment`/`EvidenceNativeRenderer` behavior. No Content-ID or scene-specific branch exists.
- **Regression principle:** a claimed viewer-facing repair must change its downstream render contract before render and its actual binary after render; otherwise it is `REPAIR_NO_OP_BEFORE_RENDER`, `IDENTITY_REPAIR_NOT_PROPAGATED`, or `IDENTITY_REPAIR_PIXEL_NO_OP`, never a successful repair.
- **Cache learning:** reusable render output is valid only when viewer-facing render-contract key, compiled-props hash and actual cached-video SHA all match. Identity-only changes invalidate the affected candidate without disabling useful cache globally.
- **Production evidence:** repaired embodiment, semantic signature, render-contract, props and MP4 hashes all differ; 12 ordered frame comparisons across six repaired scenes changed. This proves propagation, not perceptual improvement.
- **Remaining visual debt:** local inspection still finds repeated convergence anatomy and some reinforcement rails crossing labels; anonymous-node/checkmark-like interpretation and role readability remain perceptual unknowns pending human/ChatGPT review.
- **Safety outcome:** zero OpenAI Vision, image-generation and Vbee calls; STEP 09, script, voice, music/SFX and Phase 2 Audio remain untouched.

## CKAI-0005 — Creative Upgrade Day full-production V1

- **VERIFIED BASELINE:** Human/ChatGPT review scores Full V1 approximately `6.3–6.6/10` and records Generalization Test 01 PASS. Large phrase-led typography, stable mobile reading region, Vietnamese glyph QA, high-key/typography resets, pacing contrast, plate diversity and multiple representations of one idea transferred successfully from CKAI-0004 learning without copying its metaphor.
- **VERIFIED BASELINE:** source-render, mobile montage and actual-MP4 inspection remain separate checks. Hero motion changes meaning; transitions only punctuate it. A short successful prototype is not repeated mechanically to fill a full film.
- **CANDIDATE:** dual-voice narration may improve pacing, dialogue, contrast and perceived human presence when the voices have distinct semantic roles. CKAI-0005's Minh Quân → Ngọc Huyền turn is promising but requires validation on CKAI-0006 or another content ID.
- **CANDIDATE:** opening/ending callback, ideal hero-motion count, exact reset interval and transition-family frequency remain provisional; `8–12 seconds` is a heuristic, not a timing law.
- **CONTENT-SPECIFIC:** CKAI-0004 retains `FRACTURED CERTAINTY / THE MISSING RELATIONSHIP`; CKAI-0005 retains `PERFECT SURFACE / HOLLOW CORE`. Neither becomes a reusable CKAI template.
- **REJECTED:** dots/lines/convergence/target defaults, small labels carrying the message, one plate held too long, uniform dark-gold frames, pan/zoom plus text swap, repetitive transitions, tight Vietnamese line-height, theoretical-only safe zones, and stretching a 13-second rhythm across 45–60 seconds.
- **Governance:** Generalization PASS does not imply Market Ready or Golden. Full V1 remains below 7; Release Approval and publishing remain absent.

## CKAI-0005 — Audio Creative Prototype A/B

- **CANDIDATE AUDIO RULE:** music may work better when it follows narrative chapters instead of running as one flat loop; A and B deliberately use different harmonic, rhythmic, density and tension arcs on identical visuals.
- **CANDIDATE AUDIO RULE:** semantic SFX should be reserved for meaningful physical events. Each prototype uses eight authored cues bound to surface lock, pattern assembly/collapse, assumption withdrawal, structural reaction, shell/core opening, Hollow Core and final callback; transition sounds remain selective.
- **CANDIDATE AUDIO RULE:** a music-density drop can strengthen a hero reveal. A tests a restrained 29.42–30.20 reduction; B tests a deeper 29.12–30.34 drop before a controlled impact. Whether either improves perceived impact remains a Human/ChatGPT listening judgment.
- **CANDIDATE AUDIO RULE:** reflective narration may benefit from lower density and altered harmony without spatial gimmicks; Minh Quân and Ngọc Huyền remain centered and unprocessed while the surrounding score changes semantic role.
- **CANDIDATE AUDIO RULE:** phone-readable SFX need mid/high-frequency information in addition to restrained low-frequency punctuation. Local phone-band simulation preserved measurable side-bus identity in both candidates, but perceptual comfort still requires listening.
- **CANDIDATE AUDIO RULE:** an altered opening motif at the ending may reinforce a visual callback without emotionally over-resolving.
- **Technical evidence only:** both 43.328-second MP4s decode, remain within the short-form loudness/true-peak range, retain 21+ dB active Voice dominance, and contain an H.264 video stream byte-identical to V1.1. A/B side-stem correlation is `-0.0047`, confirming the variants are not gain-only versions of one track.
- **Governance:** these are candidate rules from one content experiment, not Verified Baseline. No winner, Phase 2 Audio Engine, Golden status, Release Approval or publishing action is implied.

## CKAI Music Library V1 — canonical migration

- **OBSERVATION:** Round 1 contains seven Product Owner-confirmed `KEEP` tracks and zero downloaded audio files. Its useful coverage is currently weighted toward `INVESTIGATIVE / TENSION / MOMENTUM`; the target remains approximately 20 genuinely useful tracks, not a volume quota.
- **CANDIDATE AUDIO RULE — VOICE FIRST:** evaluate music beside Vietnamese narration, not only in isolation. A track that sounds impressive alone but masks articulation, thinking rhythm or speaker-role contrast is a weak CKAI candidate.
- **POSSIBLE PATTERN:** tracks 8–20 should diversify function, energy and tonal range, especially underrepresented `REFLECTIVE / PAYOFF` use, without drifting into sentimental piano, generic corporate or oversized trailer language. This remains a sourcing hypothesis until the later round is reviewed.
- **SYSTEM LEARNING:** long-lived music shortlist, registry and license evidence belong in a canonical in-repo reference location. External session-output folders may remain backup evidence but cannot remain the active source of truth.
- **GOVERNANCE:** library membership and provider-level license summaries do not equal production approval. Track-specific identifiers, claim risk, local hash and creative listening metadata remain `UNKNOWN` until supported; no Phase 2 Audio Engine or provider action is implied.

## CKAI Music Library Round 1 — production-context audition

- **OBSERVATION:** preliminary role tags were not authoritative. `Brainiac` matched mechanical/futuristic semantics in isolation but its dense midrange and persistent percussion competed with the actual male explanatory body and lost identity under deeper ducking; production evidence downgraded its neutral-bed role.
- **OBSERVATION:** `Other World` supplied the strongest opening negative space and measured midrange clearance, making it the safest A — Precision Minimal primary despite a later melodic/cinematic color that needs restraint around the female reflection.
- **OBSERVATION:** `Torn Threads` delivered the best complete tension/reveal arc and Hollow Core support without becoming trailer-like, making it the B — Tension Editorial primary. `Investigative Suspense — Tension Loop` is stronger as a pattern/context section than as a full bed.
- **CANDIDATE AUDIO RULE:** `VOICE_FRIENDLY != QUIET`. A cue is useful only if meaningful musical identity survives at the level/ducking required by Vietnamese speech; merely lowering a masking track is not a creative solution.
- **CANDIDATE AUDIO RULE:** editability includes graceful density reduction. Natural section boundaries or true negative space before a reveal are more valuable than constant spectrum fill, even when the latter sounds polished alone.
- **GOVERNANCE:** seven internal context auditions are technical/selection evidence, not final A/B mixes or broad Audio Engine policy. Human/ChatGPT Creative Director review remains pending; Phase 2 Audio Engine did not start.

## CKAI-0005 — canonical-library A/B final-mix test

- **OBSERVATION:** the approved primaries remained viable in authored full-length mixes; no runner-up was required. `Other World` supported A through sparse, filtered chapter edits, while `Torn Threads` supported B through a stronger build/release arc and deeper reveal contrast.
- **CANDIDATE AUDIO RULE:** music should be arranged by narrative chapter rather than placed as a flat loop. Source-section choice, density, filtering and negative space are as important as the track's catalog mood.
- **CANDIDATE AUDIO RULE:** an intentional near-silence before a semantic reveal can create more impact than adding a larger hit. CKAI-0005 tests a restrained A drop at `29.46–30.18` and a deeper B drop at `29.18–30.34`; human listening must judge whether the contrast serves meaning.
- **CANDIDATE AUDIO RULE:** attach SFX to a small set of semantic physical events, not every cut. Both library mixes use five primary events: surface lock, pattern collapse, assumption withdrawal, Hollow Core reveal and transformed callback.
- **CANDIDATE AUDIO RULE:** music-density changes can support voice-role changes without processing or spatially separating the voices. Both candidates reduce density from Ngọc Huyền's reflective turn while preserving the centered dual-voice master.
- **CANDIDATE AUDIO RULE:** a restrained, transformed opening signature at the ending may strengthen narrative recall; it should remain incomplete rather than triumphant.
- **CANDIDATE AUDIO RULE:** phone-readable low events need restrained mid/upper-harmonic support, but physical-phone comfort and cheapness remain perceptual review questions that machine band/peak measurements cannot settle.
- **Technical evidence only:** both 43.328-second outputs decode, measure approximately `-14 LUFS`, remain below `-1.3 dBTP`, contain five semantic events and preserve the byte-identical V1.1 H.264 stream. This does not award a creative winner or Verified Baseline.
- **Governance:** Human/ChatGPT Audio Creative Direction review is pending. No Vbee/provider/paid call, Phase 2 Audio Engine, publishing, Golden status or Release Approval is implied.

## CKAI Music Library V1 — Round 2 multi-family expansion

- **OBSERVATION:** the 7-track Round 1 shelf was concentrated in investigative/tension use. Round 2 adds 15 locally available tracks across lofi, ambient, light corporate, minimalist piano and soft electronic families, producing a 22-track shelf without removing Round 1.
- **CANDIDATE AUDIO/LIBRARY RULE:** CKAI should maintain a small, licensed, ready-to-use local pool across multiple emotional/music families so production can audition locally before starting new sourcing.
- **CANDIDATE AUDIO/LIBRARY RULE:** voice-first does not mean music-invisible. Useful candidates preserve audible melody/groove under narration rather than surviving only when reduced to faint ambience.
- **CANDIDATE AUDIO/LIBRARY RULE:** restrained continuous music beds may improve watchability for reflective and intellectual social content; production evidence is still required before promotion.
- **CANDIDATE AUDIO/LIBRARY RULE:** track utility includes 30–60 second full-bed suitability, repetition comfort, editability and melodic attention—not catalog mood alone.
- **CANDIDATE AUDIO/LIBRARY RULE:** production should prefer existing approved canonical local assets before new web sourcing, while retaining content-specific creative review and license/claim checks.
- **GOVERNANCE:** family and fit tags are descriptive catalog metadata, not automated selection logic or production approval. No CKAI-0006 selection or Phase 2 Audio Engine was created.

## CKAI-0005 — Final Audio V2 continuous-bed repair

- **OBSERVATION:** prior CKAI-0005 prototypes protected speech but reduced music too far for the Product Owner's desired experience. Final Audio V2 instead uses `Digital Clouds` as one continuous full bed with measured presence in `96.07%` of 100ms windows while active Voice remains `10.17 dB` above music/SFX.
- **CANDIDATE AUDIO RULE:** voice-first does not mean music-invisible; intellectual/explainer videos may benefit from a continuous, perceptibly musical bed when selection, filtering and light ducking preserve comprehension.
- **CANDIDATE AUDIO RULE:** full-bed suitability is a meaningful production criterion distinct from mood. A stable groove, restrained melody, repeat comfort and spectral clearance may matter more than cinematic chapter contrast.
- **CANDIDATE AUDIO RULE:** semantic SFX should complement continuous music at selected physical events rather than replace the musical layer or mark every transition.
- **CANDIDATE AUDIO RULE:** a short controlled reduction can preserve Hollow Core contrast without producing an extended dead zone or fragmenting the score.
- **Technical evidence only:** V2 passes decode, loudness, true-peak, byte-identical H.264, music-presence and phone-band gates. Human full-film taste and Release Approval remain pending; no universal baseline is awarded.

## CKAI-0006 — Practical Consistency Test 01

- **OBSERVATION:** a practical workflow can remain visually explicit through direct state changes—draft, critique and rewrite—without reverting to abstract nodes or borrowing CKAI-0005's material metaphor.
- **CANDIDATE VISUAL RULE:** large stable typography plus UI-like state objects may be a stronger default for actionable A.I tips than decorative interface simulation; the objects must visibly change meaning, not merely receive new labels.
- **CANDIDATE MOTION RULE:** a critique pass needs a visible scan plus surfaced defect categories; a rewrite needs an actual before/after transformation. Transitions alone do not satisfy either semantic event.
- **CANDIDATE VOICE RULE:** the Minh Quân → Ngọc Huyền role split generalized from reflective content to a practical tip when the switch occurs at payoff, not during instruction steps. Human listening review remains required before promotion to Verified Baseline.
- **CANDIDATE AUDIO RULE:** a light corporate/tech track can remain perceptibly musical under Vietnamese narration when continuous-bed presence exceeds 90%, phone-band survives and active Voice dominance remains approximately 10–11 dB.
- **Technical evidence:** 35.600-second H.264/AAC output passes decode, mobile visual inspection, `-14.05 LUFS`, `-1.41 dBTP`, `93.52%` music/SFX presence, `10.72 dB` active Voice dominance, phone-band and byte-identical visual-stream checks.
- **Governance:** technical consistency does not establish Market/Taste acceptance, Golden status or Release Approval. No Phase 2 Audio Engine, publishing or CKAI-0007 work was started.

## CKAI-0006 — V1.1 editorial/broadcast visual repair

- **HUMAN OBSERVATION:** V1 practical meaning, typography and complete audio experience passed, while its repeated flat cards read as slide, landing page, dashboard and animated report grammar.
- **CANDIDATE PRACTICAL VISUAL RULE:** `PRACTICAL != DASHBOARD`; practical AI semantics should live in an authored moving-image world rather than a page being animated.
- **CANDIDATE PRACTICAL VISUAL RULE:** UI works better as a perspective object/layer inside a scene, with foreground, background, light, occlusion and camera relation, than as the whole frame.
- **CANDIDATE PRACTICAL VISUAL RULE:** wide/medium/close/insert/hero variation gives a workflow genuine editing rhythm without sacrificing clarity.
- **CANDIDATE PRACTICAL VISUAL RULE:** camera motion must change interpretation—push toward confidence, shift axis for inspection, follow reconstruction and stabilize for payoff.
- **CANDIDATE PRACTICAL VISUAL RULE:** improvement should happen visibly through reorganization, removal and completion; replacing a bad card with a good card is insufficient.
- **CANDIDATE QA RULE:** representative paused frames that resemble slides, landing pages, dashboards or report cards require repair even when animation timing passes.
- **Evidence:** V1.1 final-MP4 freeze frames and a 12-frame critique/rewrite motion strip pass local editorial-video, mobile readability and semantic transformation checks; exact V1 audio payload remains byte-identical.
- **Governance:** these rules remain candidates from one major repair test. Human review is pending; no universal baseline, Golden award, publishing, V1.2, CKAI-0007 or new engine is implied.

## CKAI-0006 — V1.2 broadcast/editorial moving-image refinement

- **HUMAN OBSERVATION:** V1.1 improved aesthetics, relevance and engagement, but repeated headline-plus-hero-screen composition, UI dominance and uniform shot grammar remained partial.
- **CANDIDATE PRACTICAL VISUAL RULE:** broadcast/editorial moving-image language is the preferred direction for Practical CKAI; workflow is the narrative content and UI is one actor inside the production.
- **CANDIDATE PRACTICAL VISUAL RULE:** visual relevance should be direct—narration beat → visible evidence/action. Weakness collapses, ambiguity branches, absence leaves a gap and rewrite reconstructs.
- **CANDIDATE PRACTICAL VISUAL RULE:** shot variety is an independent quality dimension. A beautiful perspective screen repeated across beats can still feel like presentation grammar.
- **CANDIDATE PRACTICAL VISUAL RULE:** perspective UI alone does not create a media shot; material detail, context, occlusion, cutaways, framing and editorial sequencing provide the larger moving-image language.
- **CANDIDATE QA RULE:** freeze-frame review must ask both whether the frame avoids slide grammar and whether it reads as a shot from a media piece.
- **CANDIDATE PHILOSOPHY:** animation is a tool inside moving-image communication, not the defining visual philosophy.
- **Evidence:** V1.2 actual final MP4 passes full decode, 12-frame shot-variety/media-shot review, phone-size readability and a 16-frame critique/rewrite motion-story strip. V1.1/V1.2 AAC payloads are byte-identical.
- **PRODUCT OWNER QUALITY JUDGMENT:** locked V1.2 is approximately `6/10`, below CKAI Market Ready and not Golden. `Practical Visual Baseline V1` preserves useful direction and learning; it is not evidence of quality ≥7 or that final Practical-mode quality is solved. Voice + music remain judged OK.
- **Governance:** slide/presentation grammar is conservatively `PARTIAL` because UI hero shots remain prominent. No Golden award, V1.3, publishing, CKAI-0007 or engine work is implied.
