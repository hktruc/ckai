# STEP 07 runtime

`video-factory/review/` là implementation nhỏ, local-first của Final Review & Finishing Engine.

- `src/upstream.ts`: direct source-chain/checksum verification và STEP 06 revalidation.
- `src/captions.ts`: deterministic captions từ exact Spoken Copy + Voice timing.
- `src/assets.ts`: local-approved music/SFX boundary.
- `src/qa.ts`: review, truth/brand và technical AV gates.
- `src/gates.ts`: exact Export READY conjunction.
- `src/routing.ts`: issue severity/return target.
- `tests/review.test.ts`: executable contract proofs.

Composition `TEST-0002-Review-Preview` reuses the verified animation+voice preview and overlays captions. It is a review artifact only. Review runtime không tự encode Final Export, upload, publish hoặc download/generate audio assets; STEP 08 consume exact reviewed output qua contract riêng.
