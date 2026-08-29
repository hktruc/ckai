# Final Export artifacts

## Operator UX

This layer contains CHECKPOINT B. Product Owner Release Approval is bound to exact release version + output SHA-256. Any binary/content mutation invalidates approval and requires revalidation plus a new Chốt.

Canonical STEP 08 export/release records. Binary master và generated Release Manifest nằm trong `generated/exports/` và không commit.

Artifact Markdown giữ source hashes, profile/version, output identity, inspection summary, full-timeline decoded visual/audio equivalence, Export review, Product Owner release decision và Publish handoff. READY là derived hard conjunction trong `engine/final-export-engine.md`, không phải field copy tay.

TEST-0002 là reverse-audit executable proof và luôn Publish `BLOCKED`.
