# CKAI Phase 2 Audio Engine V1

Status: `VALIDATED`

Implementation: [`../video-factory/audio/`](../video-factory/audio/)

## Purpose and boundary

The engine implements the repeatable parts of [`audio-direction-v1.md`](audio-direction-v1.md) while preserving creative audio judgment. It extends the canonical STEP 07 `FinalReviewManifest`; it does not create a second content lifecycle or award perceptual approval.

`actual narration → ranked library candidates → narration-context selection → semantic bed/SFX plan → existing finishing/mastering → technical QA → phone listening + human creative approval`

## Responsibility split

| Capability | Classification | Implementation truth |
|---|---|---|
| Music registry/provenance resolution | AUTOMATABLE | Reads and verifies all 22 canonical tracks, hashes and evidence directly from Music Library V1. |
| Candidate ranking | AUTOMATABLE | Deterministic, explainable support ranking from mode/context/metadata; never final track selection. |
| Final music selection | HUMAN_GATED | Requires a selected ranked candidate and audition evidence bound to actual narration SHA-256. |
| Bed planning | ASSISTED | Complete timeline with explicit `BASE`, `ATTENUATE` or semantically justified `SILENCE`; gain deltas remain content-specific. |
| Semantic SFX | ASSISTED | Meaningful event contract, approved asset binding and valid `NO_SFX`; no decorative cue generation. |
| Mix/master | MOSTLY_AUTONOMOUS | Reuses STEP 07 finishing, ducking and `CKAI_SHORT_FORM_MASTERING_V1`; no new universal creative values. |
| Technical/phone proxy QA | MOSTLY_AUTONOMOUS | Existing binary/mastering/provenance checks can block; contract records proxy status. |
| Phone listening/perceptual approval | HUMAN_GATED | Actual decoded mix must be heard; technical PASS cannot satisfy this gate. |

## Contract

`CKAI_AUDIO_PRODUCTION_V1` is defined in TypeScript at `video-factory/audio/src/model.ts` with a portable JSON schema at `video-factory/audio/audio-production.schema.json`. It records:

- Content ID, THINKING/PRACTICAL mode and exact narration identity;
- ranked candidates, selected track, rationale and narration-context audition;
- complete bed segments and semantic SFX decision/events, including `NO_SFX`;
- canonical direction/mastering/registry references;
- render, provenance, technical, phone and perceptual QA states;
- human creative approval provenance.

The adapter in `video-factory/review/src/audio-engine.ts` attaches an approved contract and its finishing assets to the existing Final Review manifest. Production music must retain canonical track ID, canonical source hash and registry provenance reference. Review QA rejects unresolved candidate/SFX state, stale narration audition, missing render/phone proxy or missing human approval at Export handoff.

## Failure visibility

The implementation throws or returns explicit blockers for missing narration identity, invalid/unavailable track, registry/hash/provenance failure, unranked final selection, stale/missing narration audition, incomplete/arbitrary bed plan, invalid SFX event/asset, render/technical QA failure, phone-listening gap and missing human creative approval. It never silently swaps a track, creates SFX or changes creative output.

## Evidence and non-claims

CKAI-0004/0005/0006 remain immutable evidence only. Their content-specific envelopes, cue timings and measurements were not copied into universal rules. No video, new Content ID, provider call, library expansion, Golden claim or dual-voice subsystem was created for AUD-04.
