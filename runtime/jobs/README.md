# CKAI production job state

Runtime-created folders: `inbox/`, `running/`, `completed/`, `blocked/`, `failed/`, `duplicates/`, `status/`, `results/`, `logs/`.

ChatGPT Work writes exactly one `<JOB-ID>.job.json` to `inbox/` using the contract in [`../production-bridge/README.md`](../production-bridge/README.md). It reads active state from `status/<JOB-ID>.status.json` and terminal detail from `results/<JOB-ID>.result.md` or `.result.json`; it never needs to parse logs.

Job/result/log files are local runtime state and are ignored by Git.
