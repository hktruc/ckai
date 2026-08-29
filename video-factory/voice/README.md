# CKAI Voice runtime

Minimal STEP 06 subsystem. Canonical contract: [`../../engine/voice-engine.md`](../../engine/voice-engine.md). It generates traceable local narration segments, assembles a 49-second master and registers a Remotion voice-preview composition; STEP 07 may verify and reuse this output; Voice itself does not implement captions, Final Export or publishing.

## Local proof setup

Piper is intentionally outside the repo. Default Windows paths use `%LOCALAPPDATA%/CKAI/voice-runtime`; override with `.env` variables from [`.env.example`](../../.env.example). Download only models whose license/use tier is recorded in the Voice Registry.

## Commands

```text
npm run voice:test
npm run voice:validate -- --require-audio
npm run voice:generate
npm run voice:preview
npm run voice:registry
npm run voice:voices -- --dry-run
npm run voice:voices -- --male --limit=100
npm run voice:audition -- VBEE_AUDITION_NGOC_HUYEN VBEE_AUDITION_LAN_TRINH --dry-run
npm run voice:audition -- VBEE_AUDITION_NGOC_HUYEN VBEE_AUDITION_LAN_TRINH --allow-vbee-quota
```

`voice:voices` uses the official authenticated catalog GET and no synthesis quota. It normalizes only metadata returned by Vbee; region/accent/style remain null when absent. `--dry-run` works without credentials and performs no network call.

`voice:audition` preflights all aliases before any API call, uses one fixed Vietnamese text/rate, reports distinct provider voices, and caps the shortlist at six. Live mode requires credentials plus `--allow-vbee-quota`; `--dry-run` never fabricates Vbee audio. There is no automatic winner, Registry update, purchase or paid fallback.

Selection path: catalog → Registry candidates → dry-run/live audition → Product Owner selects → semantic `CKAI_*` alias becomes `selected` → explicit production approval sets `production-approved` and `productionAllowed: true`.

Current Product Owner-approved default: `CKAI_NARRATOR_PRIMARY` → `HN - Minh Quân` → `hn_male_minhquan_yt-stable` (`productionApprovedMapping: true`, `voiceSelectionCheck: PASS`, `productionAllowed: true`). No random switching. This is distinct from the higher-factor Beta/Pro catalog entry. Actual synthesis still requires credentials plus explicit existing-quota permission; default selection never authorizes auto-purchase or paid fallback.

Generated WAV/cache/metadata and MP4 preview live under ignored `generated/`. Provider API logic is isolated in `src/providers/`; Remotion scenes only consume the assembled local master.
