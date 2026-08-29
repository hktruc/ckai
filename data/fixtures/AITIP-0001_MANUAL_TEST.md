# AITIP-0001 — Manual direct-test package

> **PAUSED:** Package này được preserve để test sau nếu Product Owner + ChatGPT explicit re-activate AITIP-0001. Đây không còn là active production-pilot next action; không tự chạy Claude UI từ tài liệu này.

This package prepares one Product Owner-run test. It is not provider evidence and does not change the candidate decision.

## Fixed inputs

- Upload fixture: [`AITIP-0001_sales.csv`](AITIP-0001_sales.csv)
- Copy-only prompt: [`AITIP-0001_claude-prompt.txt`](AITIP-0001_claude-prompt.txt)
- Machine-readable ground truth: [`AITIP-0001_expected.json`](AITIP-0001_expected.json)
- Validator: [`../../scripts/validate-aitip-0001-xlsx.py`](../../scripts/validate-aitip-0001-xlsx.py)

Expected ground truth:

- 12 source rows, preserved in order;
- 35 total units;
- total revenue: `3800`;
- North: `1070`, Central: `1170`, South: `1560`;
- Notebook: `1320`, Mouse: `1280`, Keyboard: `1200`;
- `Revenue` cells are formulas, not pasted values;
- summary totals are formulas referencing `Raw Data`;
- the chart reads the region summary table, not hard-coded chart values.

## Product Owner run

1. Start a new Claude chat and record the account/tier shown in the UI plus the test start time.
2. Upload only `data/fixtures/AITIP-0001_sales.csv`.
3. Paste the contents of `data/fixtures/AITIP-0001_claude-prompt.txt` unchanged and submit once.
4. Do not repair the workbook silently. If one correction prompt is needed, preserve its exact text and report it.
5. Download the returned `.xlsx` without editing it.
6. Save it at exactly `generated/candidates/AITIP-0001/AITIP-0001_claude-output.xlsx`.
7. Record the test end time, whether the first response succeeded, and any observed provider/UI limitation.
8. Ask Codex to run the validator and update the candidate evidence. The validator result is evidence for review; it does not itself authorize `recommend` or human approval.

## Commands

Package-only preflight (does not require or claim a Claude result):

```powershell
python scripts/validate-aitip-0001-xlsx.py --check-package
```

Validate the untouched downloaded workbook after the Product Owner run:

```powershell
python scripts/validate-aitip-0001-xlsx.py
```

## State boundary

Until the real returned workbook and manual-run metadata are supplied and validated, keep:

- `testability_status: TESTABLE`
- `test_execution_status: BLOCKED`
- `test_result: NOT_AVAILABLE`
- `decision: hold`
- `human_decision: pending`

Preparing this package is not test execution. No `PASSED`, `recommend`, Teaching Brief, CKAI ID, or downstream production authority may be inferred from it.
