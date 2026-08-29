# Performance ingestion and governed learning

Executable system-side path for `/ck-learn`:

`real metrics → validated data/performance.csv row → metadata join → Observation → promotion review eligibility → future decision support`

The ingestor validates Content ID, published state, platform, dates, numeric ranges and at least one supplied metric. Blank means unavailable; supplied `0` remains an actual zero. Duplicate key is `content ID + measurement date + platform`: exact repeats are idempotent, conflicts fail unless an explicit corrected-source replace is requested.

`TEST-*` is rejected by the real commit path. Fixture mode exists only for isolated tests/dry runs and is always classified `EXCLUDED_TEST_FIXTURE`.

The system appends a factual Observation without calling a result “good” or “bad”. Two-to-four comparable records only become Hypothesis-review eligible; five or more only become Learned-Pattern-review eligible. Neither is auto-promoted because consistency, causal interpretation, brand strength and non-view objectives require ChatGPT/Product Owner review under `engine/learning-rules.md`.

ChatGPT/Codex operator usage:

```text
npm run performance:ingest -- --input <performance.json>
npm run performance:ingest -- --input <performance.json> --commit
```

The first command is a non-writing validation preview. `--commit` atomically updates the canonical CSV and Observation log. `--replace` is reserved for an explicit correction of the same content/date/platform source record.
