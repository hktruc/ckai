# CKAI Audio Direction V1

Status: `VALIDATED`
Scope: creative audio direction and human review guidance
Boundary: this document does not select tracks, place SFX, mix/master audio or implement Phase 2 Audio Engine.

## Evidence basis

- **CKAI-0004:** direct Product Owner listening rejected V5.1 although signal checks passed: narration was too quiet and music was effectively imperceptible. `CKAI_SHORT_FORM_MASTERING_V1` separated technical presence from perceptual readiness.
- **CKAI-0005:** seven narration-context auditions, two A/B stages and the published Final Audio V2 established a successful continuous perceptible bed, restrained semantic SFX, voice priority and phone-oriented QA. Exact track, cue timing and mix values remain content-specific.
- **CKAI-0006:** the locked Practical Visual Baseline V1 preserved its complete voice/music/SFX mix through V1.1 and V1.2; Product Owner judged voice + music OK. It supplies a second content mode with a different music family.
- **Music Library V1:** 22 local canonical tracks across six families, with track-specific provenance/license evidence. Library readiness is asset readiness, not selection intelligence.
- **Product Owner confirmed direction:** voice-first does not mean music-invisible; music must sound like music; full-bed suitability, semantic SFX restraint, phone-speaker readability and audition under actual narration matter; dual voice is promising but not universal.

Measured LUFS, peak, presence and Voice-relative values in individual reports are production evidence. They are not new universal creative constants. Technical mastering remains governed by [`short-form-mastering-policy.md`](short-form-mastering-policy.md).

## A. Core audio philosophy

- **VERIFIED:** CKAI audio is narration-led, musically present and semantically restrained.
- **VERIFIED:** Voice carries meaning and timing. Music carries emotional continuity, momentum, tension, reveal, atmosphere and pacing where the content needs them. SFX marks selected meaningful events.
- **REJECTED:** treating music as decorative filler, treating audio-stream existence as quality, or allowing machine metrics to replace listening judgment.

## B. Voice hierarchy

- **VERIFIED:** intelligible Vietnamese narration is the structural anchor. Music and SFX must not mask articulation, thinking rhythm, caveats, proof or the payoff.
- **VERIFIED:** voice processing may improve perceptual readiness, but must preserve accepted words, timing and identity. Use restrained processing and the existing mastering policy; do not solve a poor mix through destructive compression, pitch/time manipulation or arbitrary per-content loudness rules.
- **VERIFIED:** technical Voice dominance is necessary but not sufficient. The actual decoded candidate must still pass human listening.
- **CONTENT_SPECIFIC:** current production aliases are Minh Quân and Ngọc Huyền under the existing provider/authorization boundary. Provider choice is not an Audio Direction principle.

## C. Music role

- **VERIFIED:** music must contribute a legible function—continuity, momentum, tension, reveal, atmosphere or pacing—not merely fill silence.
- **VERIFIED:** `VOICE_FIRST != MUSIC_INVISIBLE`. A voice-safe mix in which music no longer registers as music is a failure.
- **VERIFIED:** music may remain perceptibly melodic or rhythmic when the chosen track, arrangement and restraint preserve comprehension.
- **REJECTED:** choosing a track because its catalog mood or isolated playback sounds impressive while it competes with narration in context.

## D. Music-bed principles

- **VERIFIED:** a continuous perceptible bed is a proven V1 option and must be auditioned when it serves the content; it is not mandatory. `MUSIC_NONE` remains valid when silence is an intentional editorial choice, not an omission.
- **VERIFIED:** full-bed suitability is distinct from mood: consider repetition comfort, restrained melody, spectral clearance, editability and whether musical identity survives under narration.
- **VERIFIED:** a bed may reduce or disappear briefly only for a meaningful transition, reveal, absence or emphasis. It must return deliberately and must not create an unmotivated dead zone.
- **CANDIDATE:** chapter-level source edits, filtering, density shaping and transformed callbacks can strengthen an arc. Their exact use still requires content-specific listening.
- **REJECTED:** flat placement with no relationship to the narrative, over-scoring every turn, or lowering a masking track until it becomes imperceptible.

## E. Music selection

Use Music Library V1 before new sourcing when it contains viable candidates. Selection remains a human/agent judgment:

1. Identify content intent and emotional trajectory: explanation, reflection, tension, reveal, momentum or payoff.
2. Consider narration density and where the listener must process a caveat, proof or key distinction.
3. Shortlist by family and per-track metadata, including voice fit and full-bed utility. Catalog ratings are descriptive, not approval.
4. Audition the candidate beneath the actual narration and across the whole arc—not as an isolated track and not only at the hook.
5. Reject masking, loss of musical identity, tiring repetition, mismatched emotional direction or poor editability.
6. Verify local file, provenance, license evidence and recorded claim risk. `UNKNOWN` claim status must remain `UNKNOWN`.
7. Bind the selected track and rationale to the content-specific production record. Do not generalize the chosen track into an automatic rule.

- **VERIFIED:** this selection process and narration-context audition boundary.
- **CONTENT_SPECIFIC:** `Digital Clouds` for CKAI-0005 and `Close Up` for CKAI-0006.
- **REJECTED:** deterministic auto-selection from mode/family scores in Audio Direction V1.

## F. THINKING vs PRACTICAL

Both modes use the same core system: voice anchor, perceptible music, semantic restraint, phone review and human listening.

- **CANDIDATE — THINKING / CHÁNH KIẾN:** reflective, intellectual, tension/reveal or atmospheric trajectories may benefit from restrained electronic, ambient, investigative or other content-fit beds, including controlled density changes around a conceptual reveal.
- **CANDIDATE — PRACTICAL / TUYỆT CHIÊU:** explainer, technology, light corporate or groove-led beds may support clarity and forward motion when they avoid generic advertising tone and preserve instruction comprehension.
- **CONTENT_SPECIFIC:** CKAI-0005 and CKAI-0006 demonstrate different useful families; two examples do not justify separate audio systems or fixed mode-to-family mapping.

## G. Semantic SFX

- **VERIFIED:** every SFX must bind to a meaningful physical or semantic event such as lock, collapse, withdrawal, reveal, rewrite or completion.
- **VERIFIED:** use few enough cues that each retains meaning. SFX complements the music and narrative; it does not replace the musical layer or announce every cut.
- **CANDIDATE:** restrained harmonic support can help a low-frequency event survive small speakers. Perceptual comfort still requires listening.
- **CONTENT_SPECIFIC:** the six cues used by CKAI-0005 and CKAI-0006 and their exact timestamps.
- **REJECTED:** decorative whooshes/hits on routine transitions or cues with no describable narrative purpose.

## H. Phone-speaker readability

- **VERIFIED:** review the actual decoded mix through a phone-speaker-oriented listening path. Voice must remain intelligible; music must retain useful identity; semantic cues must translate without sounding harsh, cheap or absent.
- **VERIFIED:** band/presence measurements can flag missing energy, but cannot certify comfort or taste. Human phone playback remains required.
- **REJECTED:** declaring phone readiness from codec/sample-rate/peak checks alone.

## I. Narration-context audition

- **VERIFIED / MANDATORY:** music cannot receive production selection in isolation. Audition under the actual narration, at representative dense passages, transitions, reveal/payoff and any voice-role change.
- **REJECTED:** approving from title, tags, family score or standalone listening alone.

## J. Dual voice

- **CANDIDATE:** a second voice may mark a genuine semantic turn, reflective question, payoff or final directive when roles are distinct.
- **CANDIDATE:** keep each role stable and avoid casual alternation inside one argument. Current evidence keeps both voices centered while music changes density around the turn.
- **CONTENT_SPECIFIC:** Minh Quân carries explanatory bodies and Ngọc Huyền carries closing turns in CKAI-0005/0006.
- **REJECTED:** dual voice as a default, novelty effect or universal THINKING/PRACTICAL rule.

## K. Known failure patterns

- **REJECTED — music invisible:** CKAI-0004 V5.1 and earlier CKAI-0005 prototypes showed that signal presence or voice protection can coexist with an effectively absent musical experience.
- **REJECTED — masking track rescued only by volume:** CKAI-0005 context audition showed a dense track can fight narration and lose its own identity under deeper ducking.
- **REJECTED — decorative SFX:** cues without semantic events dilute the cues that matter.
- **REJECTED — unmotivated silence/hold:** music or motion continuing does not justify viewer-perceived waiting after a spoken idea is complete.
- **REJECTED — technical-pass substitution:** LUFS, peak, presence and phone-band metrics do not replace Product Owner/ChatGPT listening and taste judgment.
- **CANDIDATE RISK — over-scoring/mismatched emotion:** oversized trailer, sentimental or generic advertising character may over-direct the content; assess per production rather than banning a family globally.

## L. Audio PASS / REVISE checklist

Answer every item from the actual decoded candidate:

- Is every word, caveat and payoff intelligible without strain?
- Is music perceptibly musical while remaining subordinate to narration?
- Was the track auditioned under actual narration across the full emotional arc?
- Does the bed have a clear role, and are reductions/silence semantically motivated?
- Is each SFX tied to a meaningful event rather than a routine cut?
- Does phone playback preserve voice clarity, musical identity and cue comfort?
- Are source, local asset, license evidence, hash and claim-risk state recorded accurately?
- Does technical mastering pass the existing policy without clipping, pumping, harshness or crushed dynamics?
- Has human audio review judged the result coherent and appropriate for this content?

`PASS` requires every applicable item to pass. Otherwise return `REVISE` with the failing listening observation. Machine checks may block a failure; they do not self-award creative PASS.

## AUD-03 closure and AUD-04 boundary

Audio Direction V1 is validated from CKAI-0004 failure evidence, CKAI-0005 published evidence, CKAI-0006 locked evidence, the 22-track library and explicit Product Owner learnings. Reusable rules, candidates and content-specific choices are separated above.

This clears the evidence dependency for `AUD-04`. Phase 2 Audio Engine remains `NOT_STARTED`: no auto-selection, placement, mixing, mastering or scoring logic is authorized or implemented by this document.
