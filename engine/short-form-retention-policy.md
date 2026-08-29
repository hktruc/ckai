---
type: canonical-engine-policy
policy_id: SHORT_FORM_RETENTION_POLICY_V1
version: 1
status: implemented
owner: STEP 06 timing + STEP 07 technical review
---

# Short-form Retention Policy

## Principle

Choose the shortest content-driven duration that preserves exact Spoken Copy, natural narration, proof readability and semantic impact. No fixed 36–39 second template exists. Duration is derived from measured or estimated narration per semantic scene, proof-reading need, bounded emphasis and transition overlap, and must remain below the platform maximum.

`RETENTION_PAUSE` is distinct from technical `DEAD_AIR`: continued motion or music can prevent dead-air while the viewer still experiences waiting. Motion-only and music-only spans never justify a long pause.

## Versioned configuration

Executable SSOT: `video-factory/review/src/retention.ts` → `SHORT_FORM_RETENTION_POLICY_V1`.

- Leading trim tolerance `0.35s`: accommodates codec/frame onset and a natural intake without turning an empty opening into a beat.
- Trailing trim tolerance `0.45s`: preserves a clean terminal consonant/fade while preventing an unearned outro hold.
- Natural inter-unit transition maximum `0.75s`: covers ordinary sentence breathing and a restrained visual handoff.
- Intentional emphasis maximum `1.35s`: one deliberate semantic beat; requires explicit classification and basis.
- Proof reading allowance: `0.35s + visible words / 3.5 words-per-second`, capped at `2.4s`; this ties static proof time to actual reading load.
- Visual anticipation maximum `0.35s`: the next visual may lead the next spoken idea, but anticipation does not extend overall waiting.
- Default planning pace `170 spoken units/minute`; measured narration overrides estimation when available.

Threshold changes require a policy version, rationale and regression update. They are not Content-ID, topic or scene exceptions.

## Generic rules

- Trim unnecessary leading/trailing silence from narration units and minimize segmentation-created gaps.
- A scene may transition before outgoing audio ends when semantic continuity and caption readability remain intact.
- The next visual may anticipate the next spoken idea inside the configured anticipation boundary.
- Remove post-semantic holds; final outros cannot linger without a classified purpose.
- A long pause must be `intentional-emphasis` or `proof-reading`, with traceable basis. `[pause]`/`[hold]` alone is not a semantic basis.
- Static proof time is computed from visible reading need. Motion or music alone never converts waiting into progress.
- Production Review records the policy ID/version and exact findings. Missing or stale retention QA is a hard failure.

## Pipeline inheritance

The generic Final Review factory evaluates measured Voice timing against Animation duration. The production runner stops with `RETENTION_TIMELINE_REVISION_REQUIRED` before rendering a Review candidate when the timeline is excessive. The production Review QA recomputes the result from canonical Voice/Animation inputs, so copied PASS fields cannot override it.

## Duration examples

Different semantic inputs may validly produce approximately 27s, 36s or 48s. The result comes from narration density, proof reading and emphasis needs; the system never pads a shorter result to match another video.
