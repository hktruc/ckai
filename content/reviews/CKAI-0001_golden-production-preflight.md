# CKAI-0001 — Golden Production Preflight

- Preflight date: `2026-08-29`
- Candidate: `CKAI-0001 — Bức bình phong`
- Candidate-selection authority: Product Owner instruction selecting the first Golden candidate
- Golden state: `UNAWARDED`
- GLD-02 state: `CANDIDATE`
- Decision: `CKAI-0001 GOLDEN PRODUCTION NOT READY`
- Scope: planning/readiness only; no script rewrite, storyboard, media, render, provider call or production execution

## 1. Candidate authority and exact source

The Product Owner has selected CKAI-0001 as the first Golden candidate. This authorizes candidate-specific preflight, not production and not direct STEP 02 Content Approval for the exact market-facing package.

Exact legacy source: [`../approved/CKAI-0001_buc-binh-phong.md`](../approved/CKAI-0001_buc-binh-phong.md).

The source is real CKAI content with `status: approved` in [`../../data/content-index.csv`](../../data/content-index.csv), but it predates the canonical STEP 02 schema. Per [`../approved/README.md`](../approved/README.md), CKAI-0001/0002 may be reverse-audited but cannot be represented as current production input without satisfying the current gates.

## 2. Script and production-entry audit

The legacy file contains the exact story, selected Hook A, Full Script, Key Sentence, ending question, caption and evidence notes. It does not contain the current production fields and sections required by STEP 02, including `type`, `content_stream`, `format`, editorial/human decisions, handoff state, duration/evidence results, approval provenance/fingerprint, explicit Narrative Beats, canonical Spoken Copy section, Claim & Evidence Ledger, Editorial Handoff Requirements and Facebook Package Copy.

Duration was calculated read-only from the exact Full Script using the canonical counting rule:

```text
spoken_unit_count = 213
pacing_spoken_units_per_minute = 170
pause_budget_seconds = 3
estimated_duration_seconds = round((213 / 170) × 60 + 3) = 78
duration_check = REVISE
```

The current hard gate is `PASS` only at ≤55 seconds, with final video below 60 seconds. Therefore a verbatim metadata conversion cannot become production-ready. Wording must change, so an editorial revision and new direct Product Owner approval of the exact STEP 02 package are mandatory. This preflight does not migrate or modify the script.

## 3. Golden creative thesis

**A polished justification is manufactured after an impulse has already set the scene in motion.**

The whole piece should reveal chronology: desire is already active; only afterward does a respectable, orderly explanation form in front of it. “Bức bình phong” is the name of this concealment mechanism, not a literal theatrical screen or a one-shot prop.

## 4. Planned 10–15 second Golden Sequence

### Hook beat

Use the approved confession—“Tôi từng mượn công việc làm bình phong…”—as an intimate admission, not a headline card. Before the justification is visible, the image already contains a restrained late-night impulse: warm rhythmic light and attention moving toward the match.

### Visual premise and semantic reveal

One continuous nocturnal editorial space contains two temporal layers:

- the desire layer is already alive, warm and rhythmically active;
- a cool, immaculate work-like veneer assembles afterward and presents the situation as reasonable;
- parallax/occlusion reveals that the “work” layer has arrived late and that the actual work surface remains untouched.

The reveal is not “a screen moves away.” It is the visible reversal of claimed chronology: the respectable reason is shown being constructed after the desire it claims to justify.

### Shot progression

1. **Intrigue:** tight material/optical detail; warm impulse motion is visible but not yet explained.
2. **Respectability:** a precise cool layer and restrained editorial copy form over it, apparently organizing the frame.
3. **Contradiction:** camera/parallax exposes the untouched work plane while the warm match rhythm continues behind the polished explanation.
4. **Reveal:** the veneer loses authority—separates, thins or becomes optically transparent—while the pre-existing impulse remains continuous.

This is a semantic progression, not frame-by-frame implementation or animation code.

### Motion/editing and sound intention

Motion must establish order of causality: impulse first, justification second, contradiction third. Cuts are earned by a change in understanding; camera movement changes access to the layers rather than decorating them.

Use one stable, close, reflective narrator. Music should begin as a perceptible restrained nocturnal pulse, acquire a cooler ordered texture when the justification forms, then reduce briefly at the chronology reveal. Any SFX should belong only to semantic material events such as veneer formation or separation; routine cuts receive no cue.

### Required STEP_CHANGE

Compared with CKAI-0005/0006, the sequence must not rely on headline-plus-object/screen repetition, UI dominance or technical shot variety alone. The viewer should perceive one authored visual idea whose timing itself proves the insight: **the desire visibly predates the reason**.

## 5. Six critical-dimension success criteria

| Critical dimension | Observable PASS evidence for the exact decoded sequence |
|---|---|
| Scroll-stop / Hook | Opening image creates unresolved tension before explanatory text; a human reviewer wants to know what is concealed and can recall the opening idea afterward. |
| Art Direction | Materials, light, space, color temperature and hierarchy form one intentional world; representative frames stand alone as professionally directed images. |
| Visual Storytelling | Muted viewing still communicates impulse first → respectable veneer second → contradiction/reveal; narration is supported rather than illustrated literally. |
| Motion / Editing | Motion changes meaning and reveals chronology; each edit changes knowledge, spatial access or causal interpretation; no ornamental holds or transition-only beats. |
| Premium Finish | Edges, typography, compositing, lighting, depth, texture and timing survive full-size and phone review without synthetic cheapness, accidental clutter or unfinished simulation. |
| Template / AI-generic Resistance | The sequence cannot be reduced to reusable cards, generic metaphor icons, prompt-demo grammar or stock montage; its visual mechanism is specific to this story and thesis. |

No predicted scores are assigned. Human/ChatGPT Creative Director review remains the authority for overall ≥8 and every critical floor ≥7.

## 6. Anti-pattern guardrails

Prohibited:

- presentation-deck or premium-dashboard grammar;
- card-heavy layout or repeated headline/object composition;
- generic football/work/food B-roll montage;
- nodes, paths or convergence diagrams;
- decorative animation, transition spectacle or camera motion without semantic change;
- text transition as a substitute for revealing meaning;
- literal/theatrical room-divider treatment of “bức bình phong”;
- animation-first decisions that search for meaning afterward.

Required: broadcast/editorial moving-image language; one coherent world; motion reveals meaning; every major visual choice traces to the approved thesis.

## 7. Candidate-specific visual system

- **Recurring motif:** a delayed veneer—an immaculate explanatory layer that forms after and in front of an already active impulse.
- **Material/space logic:** one layered nocturnal space; warm living impulse behind, cool ordered justification in front, untouched work plane as contradiction evidence.
- **Image language:** tactile editorial/cinematic observation, controlled reflections, occlusion and negative space; no unrelated location montage.
- **Typography role:** sparse evidence of the self-justifying phrase, integrated into the veneer; never full narration or standalone presentation slides.
- **Camera/edit grammar:** tight intrigue → controlled reveal → parallax contradiction → semantic separation; alternate scale only when interpretation changes.
- **Metaphor boundary:** represent concealment and reversed chronology, not a literal prop, moral villain, psychological law or universal diagnosis.
- **Contrast/reveal mechanism:** warm/cool and active/immaculate are secondary; the primary proof is temporal continuity—the impulse remains active before, during and after the explanation assembles.

This system is CKAI-0001-specific and must not be promoted into a global engine or CKAI visual identity.

## 8. Candidate-specific audio intent

- **Voice:** one stable primary narrator; close, calm and self-observing. Do not add dual voice for novelty.
- **Likely music characteristics:** restrained atmospheric/electronic or investigative nocturnal bed; perceptibly musical, minimal sentiment, no corporate uplift or trailer scale.
- **Emotional trajectory:** private admission → plausible self-organization → discomfort → lucid recognition.
- **Restraint:** a brief semantically motivated reduction may expose the moment the untouched-work contradiction becomes clear; no long empty hold.
- **SFX:** optional and sparse—only material formation/separation or a single meaningful interaction. `NO_SFX` remains valid.

The Audio Engine may later prepare an explainable shortlist from the canonical 22 tracks, but final track selection requires actual-narration audition and human approval. No track is selected by this preflight.

## 9. Creative North Star / taste risk

The board remains `STRUCTURE_READY_REFERENCES_PENDING`. This does not invalidate the current quality standard or make pre-production unsafe, so it is not a hard blocker. It does increase taste risk when moving from the current ≈6.7 best evidence to ≥8.

A minimal future calibration set of 3–5 deliberately selected real references would materially reduce risk if it covers only these qualities:

1. opening intrigue built through image/timing rather than headline;
2. premium layered-light/material compositing in vertical framing;
3. visual revelation of hidden motive or reversed causality without literal symbolism;
4. editorial motion where camera/editing changes interpretation;
5. restrained typography integrated into cinematic space.

No reference is fetched, invented or added in this task.

## 10. Hard blockers and readiness

1. **DURATION GATE:** exact script estimates to 78 seconds; current STEP 02 requires ≤55. A wording/content revision is required.
2. **CURRENT STEP 02 AUTHORITY:** CKAI-0001 is legacy approved and lacks the canonical exact-package Content Approval provenance/fingerprint and READY conjunction. After revision, Product Owner must approve the exact Spoken Copy, hook, claims, ending/CTA, title and Facebook caption.

Decision: `CKAI-0001 GOLDEN PRODUCTION NOT READY`.

GLD-02 remains `CANDIDATE`; Golden remains `UNAWARDED`; VIS-13 remains `FROZEN`; AUT-02 remains gated. No production task is opened.

## 11. Exact next action — not executed

ChatGPT Editorial must prepare a current-schema CKAI-0001 STEP 02 revision at ≤55 seconds while preserving the approved core meaning and personal-story evidence. Product Owner must then explicitly approve that exact market-facing package. Only after the canonical duration/evidence/approval conjunction is `READY` may Storyboard and the planned Golden Sequence begin.
