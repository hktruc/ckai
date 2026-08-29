# Publishing boundary

Canonical manual-upload lifecycle for Facebook Reels:

`REVIEW_PACKAGE → exact Product Owner Release Approval → READY_TO_PUBLISH → Product Owner upload → /ck-publish delivery record → PUBLISHED`

The system prepares and verifies the package; it never uploads, schedules or calls Facebook APIs. `platform` plus authoritative Product Owner publication confirmation are required to close publication. Publication date, external URL and external ID are optional and remain `null` when unavailable—never invented.

`package-manifest.json` carries the exact video/hash/version, approved copy paths, QA/release state, provenance, upload instructions and publication state. `record-publication` refuses to mark it published until the canonical content index and all three `/ck-publish` artifacts (published script, transcript actual, delivery delta) exist. This keeps package provenance and content lifecycle linked without creating a second content registry.

Maintainer/operator commands (ChatGPT/Codex runs these; Product Owner does not use terminal):

```text
npm run publishing:lifecycle -- --action approve-release --manifest <path> --input <release-approval.json>
npm run publishing:lifecycle -- --action record-publication --manifest <path> --input <publication-confirmation.json>
```

Release approval input is exact-version/hash bound. Publication confirmation uses `Facebook Reels` plus an auditable confirmation timestamp; `publishedDate`, `externalUrl` and `externalId` may be omitted.
