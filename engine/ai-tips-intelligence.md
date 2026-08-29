---
type: engine
scope: ai-tips-intelligence
version: 1
---

# AI Tips Intelligence — STEP 01

## Operating authority

ChatGPT owns Content Intelligence analysis, selection recommendation, Teaching Brief judgment and delegated operator handoff. Codex collects/structures evidence, persists candidate artifacts and validates schema/test/selection gates. STEP 01 does not require direct Product Owner approval; no operator decision overrides failed evidence/technical gates. See PROJECT.md §23.

## Operator UX compatibility

STEP 01 remains internal machinery. ChatGPT may set the legacy human_decision approval state as delegated operator authorization only after verification/test/score hard gates PASS. This does not mean Product Owner inspected a candidate and is not Content Approval; Product Owner sees the market-facing package later at STEP 02.

For a familiar, non-controversial, low-risk capability claim only, direct Product Owner confirmation may be recorded as `verification_basis: product-owner-confirmed`. The executable policy and negative tests live at `video-factory/verification/`. Pricing, quota, access/rollout, statistics, benchmarks, new/time-sensitive claims, medical/legal/financial/high-impact claims, direct visual proof, contradictory evidence and known falsehoods still require independent evidence and cannot be promoted by a self-declared basis.


Engine này áp dụng riêng cho dòng **Tuyệt chiêu AI** trước khi một tip trở thành content production.

```text
candidate → DISCOVER → VERIFY → SCORE → TESTABILITY → SELECT → TEACH
                                                            ↓
                                                  CHATGPT OPERATOR SELECTION / DELEGATED HANDOFF
                                                            ↓
                                                cấp CKAI-* và vào content/ideas/
```

`SELECT: recommend` chỉ là đề xuất của hệ thống, **không phải approval**. Chỉ verified delegated operator authorization mới được đưa candidate vào pre-production lifecycle `CKAI-*` hiện có.

## 1. Artifact và Content ID

- Mỗi candidate là một file phẳng trong `content/candidates/`.
- Candidate production: `AITIP-000N_slug.md`.
- Smoke/example: `AITIP-TEST-000N_slug.md`; không tính production, không đưa vào performance learning.
- Candidate chưa được ghi vào `data/content-index.csv` vì chưa phải content production.
- Sau delegated operator handoff: cấp `CKAI-000N` theo `PROJECT.md` §16, tạo file `content/ideas/CKAI-000N_slug.md`, ghi `source_candidate: AITIP-000N`, rồi tiếp tục tới market-facing Content Approval ở STEP 02. Không tái sử dụng AITIP ID làm Content ID.

## 2. Frontmatter tối thiểu

```yaml
id: AITIP-0001
type: ai-tip-candidate
stage: discovered
verification_status: UNVERIFIED
testability_status: NOT_ASSESSED
test_execution_status: NOT_RUN
test_result: NOT_AVAILABLE
decision: pending
human_decision: pending
score_total:
discovered_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
content_id:
```

### Mã trạng thái

- `stage`: `discovered` | `verified` | `scored` | `tested` | `selected` | `taught` | `approved` | `handed-off` | `closed`
- `verification_status`: `VERIFIED` | `PARTIALLY_VERIFIED` | `UNVERIFIED` | `REJECTED`
- `testability_status`: `NOT_ASSESSED` | `TESTABLE` | `NOT_TESTABLE`
- `test_execution_status`: `NOT_RUN` | `COMPLETED` | `BLOCKED`
- `test_result`: `NOT_AVAILABLE` | `PASSED` | `FAILED`
- `decision`: `pending` | `recommend` | `hold` | `reject`
- `human_decision`: `pending` | `approved` | `rejected` | `needs-changes` | `not-applicable`

Frontmatter là snapshot để lọc nhanh. Chi tiết và rationale nằm trong đúng section của từng stage; không nhồi toàn bộ evidence vào YAML.

## 3. DISCOVER — raw candidate

### Input bắt buộc

- title
- core idea
- target user
- problem
- expected outcome
- tool/product involved
- source/evidence ban đầu
- discovered_at
- cost assumption
- setup complexity
- why it may be useful

Tool phải là field dữ liệu, không hard-code engine cho ChatGPT/Gemini/Claude hay một vendor cụ thể.

### Gate DISCOVER

Chỉ chuyển sang VERIFY khi đủ tất cả field bắt buộc và outcome có thể quan sát được. Nếu chỉ mô tả “rất hay”, “tăng năng suất”, “thần thánh” mà không nói kết quả cụ thể, giữ `stage: discovered` và bổ sung dữ liệu.

## 4. VERIFY — claims và evidence

### Claims ledger

Mọi claim ảnh hưởng tới quyết định phải được ghi thành một dòng và gắn đúng loại:

| Loại | Ý nghĩa |
|---|---|
| `VERIFIED_FACT` | Có evidence đủ mạnh, hiện hành, hỗ trợ trực tiếp claim |
| `INFERENCE` | Suy luận hợp lý từ evidence nhưng source không nói trực tiếp |
| `UNVERIFIED_CLAIM` | Chưa có evidence đủ hoặc chưa kiểm tra |

### Evidence strength

Từ mạnh xuống yếu:

1. `DIRECT_TEST` — kết quả test quan sát được, có input/output và ngày test.
2. `OFFICIAL_DOC` / `OFFICIAL_PRODUCT_UI` — tài liệu hoặc UI chính thức, có ngày truy cập.
3. `CREDIBLE_SECONDARY` — nguồn chuyên môn đáng tin nhưng không phải nhà cung cấp.
4. `COMMUNITY_REPORT` / `MARKETING_DEMO` — chỉ dùng để khám phá, không đủ để xác nhận capability một mình.
5. `INTERNAL_ASSET` — content/brief cũ dùng để truy vết nguồn candidate, không tự xác minh capability.

“Đọc thấy trên internet” không phải trạng thái verification. Source phải chỉ rõ URL/path, ngày truy cập, claim nào được hỗ trợ và giới hạn của evidence.

### Checklist VERIFY

- Capability có thật và evidence hỗ trợ trực tiếp không?
- Feature còn tồn tại tại ngày kiểm tra không?
- Cost/tier assumption đã được xác minh chưa?
- Có quota, region, language, account, file-size hoặc format limit quan trọng không?
- Source có phải primary/current không?
- Claim có nguy cơ stale cao không? Nếu có, ghi `recheck_by` hoặc trigger cần kiểm tra lại.

### Cách gán status

- `VERIFIED`: mọi claim quyết định-critical, gồm capability và cost/access được hỗ trợ bởi evidence current hoặc direct test.
- `PARTIALLY_VERIFIED`: core capability có evidence/test, nhưng một phần như tier, quota, portability hoặc giới hạn phụ chưa đủ chắc; phần thiếu phải được nêu rõ.
- `UNVERIFIED`: core capability chưa có evidence đủ mạnh.
- `REJECTED`: evidence cho thấy claim sai, feature không còn tồn tại hoặc không dùng được theo cách candidate mô tả.

`UNVERIFIED` và `REJECTED` không được đi tới `recommend`.

## 5. SCORE — explainable scoring

Mỗi tiêu chí chấm 1–5, ghi rationale và evidence ID liên quan. Điểm quy đổi:

```text
weighted points = (score / 5) × weight
score_total = tổng weighted points, thang 0–100
```

| Tiêu chí | Trọng số | Câu hỏi |
|---|---:|---|
| Utility | 20 | Có giải quyết một vấn đề thật và tạo giá trị đáng kể không? |
| Clarity of outcome | 10 | Kết quả có cụ thể, dễ nhìn thấy và dễ giải thích không? |
| Ease of execution | 10 | Người bình thường có làm được với ít bước không? |
| Cost accessibility | 10 | FREE/BASIC COST có đủ để đạt outcome không? |
| Novelty | 5 | Có mới hoặc ít nhất mới với target user không? |
| Broad relevance | 10 | Có hữu ích cho một nhóm đủ rộng trong audience CKAI không? |
| Reliability/confidence | 15 | Evidence và mức chắc chắn có đủ mạnh không? |
| Reproducibility | 10 | Người khác làm lại có khả năng đạt kết quả tương tự không? |
| Time-to-value | 10 | Có đạt kết quả nhanh, ưu tiên khoảng 10 phút không? |

Điểm tổng không được che hard gate. Novelty cao không bù được reliability hoặc reproducibility thấp.

## 6. TESTABILITY — test gate

Mỗi candidate phải mô tả:

- test được hay không;
- prerequisites;
- thời gian ước tính;
- test steps tối giản;
- expected observable result;
- pass criteria và fail criteria;
- yêu cầu paid account/API/technical setup;
- actual result và evidence nếu đã test.

### Ba trạng thái độc lập

Không dùng một field để đại diện đồng thời khả năng kiểm thử, việc đã chạy test hay chưa và kết quả test:

- `testability_status` trả lời **có thiết kế được phép thử hữu ích không**: `NOT_ASSESSED`, `TESTABLE`, `NOT_TESTABLE`.
- `test_execution_status` trả lời **test thực tế đã được chạy chưa**: `NOT_RUN`, `COMPLETED`, `BLOCKED`.
- `test_result` chỉ ghi **kết quả của test đã hoàn tất**: `NOT_AVAILABLE`, `PASSED`, `FAILED`.

| Tình huống | Testability | Execution | Result | Selection behavior |
|---|---|---|---|---|
| Chưa đánh giá | `NOT_ASSESSED` | `NOT_RUN` | `NOT_AVAILABLE` | `pending` hoặc `hold` |
| Testable, chưa chạy | `TESTABLE` | `NOT_RUN` | `NOT_AVAILABLE` | `hold`; không được coi là pass |
| Đã chạy và đạt | `TESTABLE` | `COMPLETED` | `PASSED` | Có thể qua test hard gate |
| Đã chạy và không đạt | `TESTABLE` | `COMPLETED` | `FAILED` | `reject` hoặc sửa rồi test lại |
| Có test plan nhưng đang bị chặn | `TESTABLE` | `BLOCKED` | `NOT_AVAILABLE` | `hold`; ghi blocker/next action |
| Không thiết kế được phép thử hữu ích | `NOT_TESTABLE` | `NOT_RUN` | `NOT_AVAILABLE` | `reject` |

Invariant: `test_result: PASSED/FAILED` chỉ hợp lệ khi `test_execution_status: COMPLETED` và có actual result/evidence. `NOT_RUN` hoặc `BLOCKED` luôn đi với `NOT_AVAILABLE`; tuyệt đối không suy diễn thành `PASSED`.
State transition bình thường:

`NOT_ASSESSED + NOT_RUN + NOT_AVAILABLE` → `TESTABLE + NOT_RUN + NOT_AVAILABLE` → `TESTABLE + COMPLETED + PASSED/FAILED`.

Nếu bị chặn, dùng `TESTABLE + BLOCKED + NOT_AVAILABLE`; sau khi gỡ blocker, quay về `NOT_RUN` để chạy hoặc chuyển thẳng sang `COMPLETED` khi test thực tế hoàn tất. Chỉ dùng `stage: tested` khi execution là `COMPLETED`; testable nhưng chưa chạy vẫn ở `stage: scored`.

Ưu tiên test ≤10 phút. Test >15 phút, cần API/code setup đặc biệt hoặc phụ thuộc paid tier phải có lý do mạnh; mặc định `hold` cho tới khi giá trị vượt đủ chi phí/độ phức tạp.

## 7. SELECT — decision gate

### `recommend`

Chỉ dùng khi tất cả điều kiện đều đạt:

- `score_total ≥ 70`;
- verification là `VERIFIED` hoặc `PARTIALLY_VERIFIED`;
- `testability_status: TESTABLE`;
- `test_execution_status: COMPLETED`;
- `test_result: PASSED`;
- không còn `UNVERIFIED_CLAIM` nào làm thay đổi core outcome;
- Reliability và Reproducibility đều ≥3;
- cost, prerequisites và giới hạn quan trọng được disclose;
- không trùng Big Idea với content production hiện có, trừ khi đây là audit ngược của chính content đó.

Với `PARTIALLY_VERIFIED`, phần chưa chắc chỉ được là giới hạn phụ hoặc portability; teaching brief phải giữ nguyên caveat.

### `hold`

Dùng khi candidate có tiềm năng nhưng còn một trong các điểm:

- score 55–69;
- testable nhưng `test_execution_status: NOT_RUN` hoặc `BLOCKED`;
- core capability đã có tín hiệu nhưng evidence/cost/tier chưa đủ;
- cần sửa scope để outcome cụ thể hoặc test được;
- risk stale/paywall/setup complexity chưa được giải quyết.

Phải ghi rõ `next evidence/action` để candidate có đường quay lại pipeline.

### `reject`

Dùng khi score <55, core claim `UNVERIFIED` kéo dài hoặc `REJECTED`, `test_result: FAILED`, `testability_status: NOT_TESTABLE`, paywall/setup quá nặng so với utility, quá niche, stale hoặc không reproducible.

Decision luôn kèm hard-gate result và rationale. Không tự động publish hay cấp Content ID.

## 8. TEACH — teaching brief, chưa phải script

Chỉ tạo teaching brief khi `decision: recommend`. Brief bắt buộc có:

- Hook/value proposition;
- vấn đề của người xem;
- chiêu làm gì;
- các bước tối giản;
- expected result;
- điều kiện/giới hạn/cảnh báo;
- proof/evidence cần thể hiện;
- vì sao đáng học;
- CTA/next action nếu phù hợp.

Không sinh Top 3 hook, full script, storyboard hoặc visual direction ở STEP 01. Teaching brief được phép nêu **proof cần quay/chụp**, nhưng không thiết kế scene.

## 9. Operator compatibility approval và handoff

1. Hệ thống hoàn tất `SELECT → TEACH`; candidate production luôn giữ `human_decision: pending` theo mặc định, kể cả khi `decision: recommend`.
2. ChatGPT operator chọn legacy `approved`, `rejected` hoặc `needs-changes` và ghi delegated basis; đây không phải Product Owner Content Approval.
3. `decision: recommend` + `human_decision: pending` vẫn bị chặn trước STEP 02 handoff.
4. Chỉ khi legacy human_decision approved đã ghi delegated operator basis: cấp Content ID, tạo idea reference và tiếp tục tới market-facing Content Approval ở STEP 02.
5. `not-applicable` chỉ dùng cho test fixture, migration hoặc reverse-audit content đã tồn tại; không dùng làm default hay đường tắt cho candidate production mới.
6. Sau đó mới dùng `/ck-script` và các workflow production hiện hữu.

Invariant: `stage: approved` và `stage: handed-off` chỉ hợp lệ khi `human_decision: approved`. Với `human_decision: pending`, stage cao nhất là `taught`.

Không tự suy ra approval từ `recommend`.

## 10. Contract proof

| Scenario | Verification/score | Test state | System/human decision | Kết quả bắt buộc |
|---|---|---|---|---|
| **A — testable, chưa test** | Có thể đủ verification và điểm | `TESTABLE` + `NOT_RUN` + `NOT_AVAILABLE` | `hold` + `pending` | Không được giả thành `PASSED`; fail test hard gate; không `recommend` |
| **B — recommend, chưa human approve** | Đủ verification, score ≥70 | `TESTABLE` + `COMPLETED` + `PASSED` | `recommend` + `pending` | Teaching brief được phép tồn tại, nhưng không cấp `CKAI-*`, không tạo file trong `content/ideas/`, không gọi workflow script |

## 11. Stopping rules

- Dừng sớm ở VERIFY nếu core claim sai hoặc feature không tồn tại.
- Dừng ở TESTABILITY nếu không có observable result/pass-fail criteria.
- Không viết teaching brief cho `hold/reject`.
- Không build automation, Script Engine, storyboard hay video production trong STEP 01.

---

Template: [`../content/candidates/TEMPLATE.md`](../content/candidates/TEMPLATE.md) · Example: [`../content/candidates/AITIP-TEST-0001_prompt-don-markdown.md`](../content/candidates/AITIP-TEST-0001_prompt-don-markdown.md)
