# CKAI Animation runtime

Minimal STEP 05 Remotion runtime. Canonical contract: [`../../engine/animation-engine.md`](../../engine/animation-engine.md). STEP 06 reuses the composition for Voice preview; STEP 07 registers a separate captioned review-preview composition. Neither preview is Final Export or publishing integration.

## Setup and commands

```text
npm ci
npm run animation:check
npm run animation:studio
npm run animation:proof
npm run animation:proof:stills
```
Production validation parses the canonical Visual Direction, Storyboard and approved Script source chain; checks Content IDs and STEP 04/03/02 READY invariants; and compares the exact Visual Direction SHA-256 recorded in the manifest. A copied READY field, stale checksum, mismatched source, or reverse-audit relabel cannot authorize production.


`animation:validate` defaults to production mode and rejects TEST-0002. Proof commands pass `--proof-mode` explicitly. Outputs go to gitignored `generated/previews/`.

## Code map

- `src/manifest/` — executable content/timing/assets/gates.
- `src/engine/` — frame math, gates and QA.
- `src/primitives.tsx` + `src/theme.ts` — minimal layout/motion/tokens.
- `src/Test0002.tsx` — five-scene reverse-audit composition.
- `tests/` — timeline, missing-asset, proof/caveat, forged/stale upstream and valid-source gate tests.

No runtime network request is required. Package versions are pinned in root `package.json` and `package-lock.json`.
