# CKAI Phase 2 Audio Engine

Status: `VALIDATED`

This module turns [`engine/audio-direction-v1.md`](../../engine/audio-direction-v1.md) into bounded machine-facing mechanics without claiming automated taste.

Flow:

`actual narration identity → deterministic candidate support ranking → narration-context human selection → semantic bed/SFX plan → existing STEP 07 render/mastering → technical QA → phone listening + human creative approval`

## Boundaries

| Stage | Maturity | Boundary |
|---|---|---|
| Voice | MOSTLY_AUTONOMOUS | Existing Voice Engine; identity/timing and approval remain gated. |
| Music candidates | MOSTLY_AUTONOMOUS | Ranks only the canonical 22 tracks; never selects the final track. |
| Music bed | ASSISTED | Validates complete, semantically justified base/attenuation/silence segments. |
| Semantic SFX | ASSISTED | Represents meaningful events and supports `NO_SFX`; asset choice remains reviewed. |
| Mix/master | MOSTLY_AUTONOMOUS | Reuses `CKAI_SHORT_FORM_MASTERING_V1` and existing deterministic render mechanics. |
| Technical QA | MOSTLY_AUTONOMOUS | Provenance, binary, clipping/loudness and phone-proxy checks can block. |
| Creative QA | HUMAN_GATED | Actual decoded mix and phone-speaker listening remain Product Owner/ChatGPT judgment. |

The canonical music registry is read directly from `content/references/audio/music-library-v1/03_catalog/music-library.json`; no track metadata is copied into an engine config. Candidate `supportScore` is explainable shortlist assistance, not perceptual fit or approval.

`AudioProductionContract` extends the existing STEP 07 Final Review contract. Technical PASS cannot satisfy its narration audition, phone listening or human creative approval gates.

Run focused regression tests with:

```text
npm run audio:test
```
