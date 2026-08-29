---
type: visual-dna
id: CKAI_DARK_PREMIUM_EDITORIAL_V1
version: 1
scope: visual-foundation
runtime_tokens: ../video-factory/animation/src/visual-system/preset.ts
---

# CKAI Visual DNA V1

`CKAI_DARK_PREMIUM_EDITORIAL_V1` is the canonical Visual Foundation preset for new generic production. It is mobile-first 9:16 and carries five traits: premium, intellectual, cinematic, minimal and confident.

## Manifesto

> Không dùng nhiều thứ để gây ấn tượng. Dùng đúng một thứ và làm cho nó đủ mạnh.

Operationally: fewer elements, more weight. Dark space is a design material; light appears only where attention should stop; amber/gold is a restrained point of light rather than a filled theme. Hierarchy must remain strong in grayscale and without the accent.

The executable single token source is [`preset.ts`](../video-factory/animation/src/visual-system/preset.ts). Components consume its color, typography, spacing, density, lighting, depth, material, geometry, image and line-treatment tokens. New versions receive a new preset ID; V1 values are not silently mutated into V2.

## Composition rules

- Native 1080×1920, mobile first.
- Normally one primary focus and no more than two strong attractors.
- 50–60% occupied area is a review prompt, never a numeric validator. A frame may be sparser or fuller when its visual mass, tension and hierarchy feel complete.
- Dark canvas uses graphite/midnight tonal depth, vignette and limited localized light—not flat pure black everywhere.
- Matte graphite, smoked glass and restrained warm metal are allowed. Plastic gloss, heavy chrome, multicolor neon and HUD decoration are not.
- Negative space must be activated by meaningful scale, object placement, light falloff, depth or tension. It is not permission to leave a frame visually unfinished.
- Lines exist only to connect, reveal, separate or create directional tension. They are removed when they do not carry meaning.
- No permanent audience-facing brand header, scene ID, debug label or internal metadata appears in production frames.

## Typography

Display and text stacks use Vietnamese-safe local system families. Hero, title, support and caption scales are separate. Captions remain a timing/readability layer; expressive kinetic typography is a semantic visual layer and may emphasize only a precise keyword, number, contrast, before/after, key claim, reveal phrase or short conclusion. It must preserve exact text and may not animate most words.

## Semantic art direction

The Visual Director works concept-first in this order: central idea → tension → object/metaphor decision → light → composition/depth → typography. Components never choose the concept.

Nine reusable semantic archetypes are canonical: `thesis-declaration`, `contrast-before-after`, `investigation-verification`, `transformation`, `consequence-payoff`, `evidence-proof`, `reflection-insight`, `warning-tension`, and `conclusion-distillation`. They resolve into four intentionally different visual modes: typographic editorial, object/metaphor cinematic, proof/evidence presentation, and transformation/comparison.

The executable policy table is [`art-direction.ts`](../video-factory/animation/src/visual-system/art-direction.ts). Each archetype declares compositional tendencies, object policy, light, depth, typography, pacing intent, proof policy, active-negative-space role and eye path. The renderer consumes these semantic policies; it never switches on an exact sentence, Content ID, provider or fixture.

The legacy objective mapping remains compatible:

| Objective | Canonical pattern |
|---|---|
| comparison | split / contrast |
| process | progression / flow |
| abstract concept | symbolic focus |
| proof | evidence-forward |
| key insight | focus / reveal |
| tension | asymmetric tension |
| conclusion | distilled statement |

Each scene records its archetype/mode, central idea and tension, a semantic object ID or `none`, why-this-object rationale, composition, light, depth, typography, pacing intent, proof policy, active negative space and eye path. `none` is preferred when a meaningful object rationale is absent. The object library is semantic (`lens`, `balance`, `layers`, `fracture`, `domino-chain`, `aperture`, `document-field`, `reassembly-field`), not decorative.

## Art-quality QA

[`art-quality.ts`](../video-factory/animation/src/visual-system/art-quality.ts) adds hard, human-readable checks for not-template, semantic-object fit, poster strength, mobile stop power, hierarchy clarity, aesthetic integrity, adjacent-scene variation, proof honesty and content genericity. It rejects UI/card anatomy, generic sphere/blob/glow language, weak object rationale, purposeless lines, repeated adjacent anatomy and fixture-specific implementation rules. These checks supplement—not replace—source integrity and technical gates.

## Proof presentation and PO trusted verification

Canonical classes remain `actual-proof`, `visual-representation`, `illustrative-mockup`, and `conceptual-metaphor`.

- Actual proof requires an available evidence asset, provenance and a visible truth label.
- Visual representation must trace to real source evidence.
- Mockup and metaphor never acquire evidence authority through styling or caller labels.
- Evidence conflict blocks. Known contradictory evidence is never overridden by approval.

For ordinary low-risk capability claims, direct Product Owner confirmation at Content Approval may be recorded as `verification_basis: product-owner-confirmed` and can satisfy an unnecessary repeat-test requirement. It cannot override contradictory evidence or replace independent verification for pricing, quota, availability, rollout, new features, precise statistics, benchmarks, time-sensitive facts, legal/medical/financial/high-impact claims, or a claim whose visual core requires direct proof.

## Quick review

Review an actual 360×640 or smaller downscale. Primary market text remains immediately legible; proof/truth labels remain readable without zoom; the focal object survives reduction; grayscale hierarchy works; removing gold does not collapse the frame; only one or two elements pull strongly; dark space feels intentional; adjacent scenes do not reuse the same anatomy; decorative removal does not weaken meaning.

## Cross-content creative learning — CKAI-0004 + CKAI-0005

This section consolidates human-reviewed production evidence inside the existing Visual DNA. It does not create a second governance registry or turn either video's metaphor into a template.

### VERIFIED BASELINE

- **Typography:** main social-video typography is large and immediately mobile-readable. Meaningful phrases outperform isolated semantic keywords as the primary communication layer. A stable reading position reduces cognitive load; shorten display copy before shrinking the type. Vietnamese display type receives glyph-aware line-spacing QA and stays native/controllable rather than baked into generated images where possible. `A.I` may receive a distinct treatment when it helps Vietnamese reading.
- **Social layout:** production is checked against real Facebook Reels presentation, not only theoretical safe zones. Critical copy stays away from the excessively low region; right-side interaction UI may overlap noncritical visual area; the reading field remains spatially predictable.
- **Pacing:** high information velocity works best with contrast. Constant-fast intensity is fatiguing; longer films need periodic visual refreshes and typography-first, brightness, scale or density resets.
- **Visual storytelling:** one semantic idea should use multiple representations. One world does not mean one repeated composition; generated plates vary in shot type, scale, density and brightness. Hero motion is distinct from transition and must change meaning, not merely decorate a plate. Visual metaphor is derived from each content topic.
- **Long-form:** a successful 10–15 second prototype is not repeated mechanically into a full film. Full-film work needs pacing chapters, resets and montage review to detect monotony.

### CANDIDATE

- Dual-voice narration may improve pacing, dialogue, contrast and perceived human presence when the voices have distinct semantic roles; it is not used merely for novelty.
- Opening/ending callback may strengthen reinterpretation but is not a mandatory default.
- The ideal number of semantic hero motions, exact transition-family frequency and exact reset interval remain provisional. `8–12 seconds` is a useful current heuristic, not an absolute timing law.

### CONTENT-SPECIFIC

- CKAI-0004: `FRACTURED CERTAINTY / THE MISSING RELATIONSHIP`.
- CKAI-0005: `PERFECT SURFACE / HOLLOW CORE`.
- These metaphors, their object worlds and their exact motion sequences are never promoted into general CKAI templates.

### REJECTED

- Dots/lines/convergence/target anatomy as a default; small semantic labels as the main communication layer; one plate stretched across a long duration; visually identical dark-gold frames throughout; pan/zoom plus text swap presented as authored motion; repetitive transitions; overly tight Vietnamese line-height; theoretical social safe zones without real-platform review; mechanically extending one 13-second rhythm to 45–60 seconds.

## CKAI signature profile

`CKAI_SIGNATURE_V1` is intentionally small and learned from accepted recurring behavior: restrained amber attention, dark spatial depth, evidence-first honesty, controlled reveal, editorial typography rhythm, purposeful negative space, voice-first audio and precise optional accents. A scene uses only relevant qualities; no motif is forced into every video.

## Boundary

Visual DNA remains the visual foundation. Motion/retention and optional local rights-known finishing audio extend it through their existing STEP 05/07 engines; they do not authorize paid image/music providers, automatic downloads, new Product Owner controls or publishing automation.
