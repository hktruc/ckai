import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {approveRelease, createFacebookReelsPackageManifest, recordPublication} from '../../runtime/publishing/src/lifecycle.mjs';
import {commitPerformanceIngestion, preparePerformanceIngestion} from '../../runtime/learning/src/performance.mjs';

const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'ckai-lifecycle-test-'));
  for (const directory of ['data', 'content/published', 'insights']) mkdirSync(join(root, directory), {recursive: true});
  writeFileSync(join(root, 'data/content-index.csv'), 'id,status,pillar,topic,angle,structure,objective,duration_target,created,published_date,platform,title\nCKAI-9001,published,ai-human,test,test,paradox-insight,authority,30,2026-08-29,,Facebook Reels,Test\nCKAI-9002,approved,ai-human,test,test,paradox-insight,authority,30,2026-08-29,,,Unpublished\nTEST-9001,published,ai-human,test,test,paradox-insight,authority,30,2026-08-29,2026-08-29,Facebook Reels,Fixture\n');
  writeFileSync(join(root, 'data/performance.csv'), 'id,date,platform,views,avg_watch_pct,completion_pct,likes,comments,shares,saves,follows,affiliate_clicks,notes\n');
  writeFileSync(join(root, 'insights/patterns.md'), '# Patterns\n\n## Observations\n\n_(none)_\n\n## Hypotheses\n\n_(none)_\n\n## Learned Patterns\n\n_(none)_\n');
  for (const id of ['CKAI-9001', 'TEST-9001']) {
    writeFileSync(join(root, `content/published/${id}_test.md`), `---\nid: ${id}\nstatus: published\n---\n`);
    writeFileSync(join(root, `content/published/${id}_test_transcript-actual.md`), `---\nid: ${id}\ndelivery_mode: animated-voice\n---\n`);
    writeFileSync(join(root, `content/published/${id}_test_delivery-delta.md`), '# Delta\n');
  }
  return root;
};

test('Facebook package cannot publish before exact release approval and canonical delivery evidence', () => {
  const root = fixture();
  try {
    const hash = createHash('sha256').update('video').digest('hex').toUpperCase();
    writeFileSync(join(root, 'video.mp4'), 'video');
    let manifest = createFacebookReelsPackageManifest({contentId: 'CKAI-9001', releaseVersion: 3, video: 'video.mp4', videoSha256: hash, caption: 'caption.txt', headline: 'headline.txt', qa: {exportQa: 'PASS', exportReview: 'pass'}});
    assert.throws(() => recordPublication(manifest, {confirmedBy: 'product-owner', platform: 'Facebook Reels'}, {repoRoot: root}), /Release Approval/);
    assert.throws(() => approveRelease(manifest, {approvedBy: 'product-owner', approvedAt: '2026-08-29T00:00:00Z', releaseVersion: 3, outputSha256: 'A'.repeat(64)}, {repoRoot: root}), /SHA-256/);
    manifest = approveRelease(manifest, {approvedBy: 'product-owner', approvedAt: '2026-08-29T00:00:00Z', releaseVersion: 3, outputSha256: hash}, {repoRoot: root});
    writeFileSync(join(root, 'video.mp4'), 'mutated');
    assert.throws(() => recordPublication(manifest, {confirmedBy: 'product-owner', confirmedAt: '2026-08-29T01:00:00Z', platform: 'Facebook Reels'}, {repoRoot: root}), /no longer matches/);
    writeFileSync(join(root, 'video.mp4'), 'video');
    manifest = recordPublication(manifest, {confirmedBy: 'product-owner', confirmedAt: '2026-08-29T01:00:00Z', platform: 'Facebook Reels'}, {repoRoot: root});
    assert.equal(manifest.lifecycleState, 'PUBLISHED');
    assert.equal(manifest.publication.publishedDate, null);
    assert.equal(manifest.publication.externalUrl, null);
    assert.match(manifest.publication.contentRecord.deliveryDelta, /delivery-delta/);
  } finally { rmSync(root, {recursive: true, force: true}); }
});

test('performance ingestion preserves missing versus zero and is idempotent', () => {
  const root = fixture();
  try {
    const input = {contentId: 'CKAI-9001', date: '2026-08-29', platform: 'Facebook Reels', views: 0, shares: 2};
    const first = preparePerformanceIngestion({repoRoot: root, input});
    assert.equal(first.record.views, '0');
    assert.equal(first.record.likes, '');
    commitPerformanceIngestion(first);
    const second = preparePerformanceIngestion({repoRoot: root, input});
    assert.equal(second.operation, 'NO_CHANGE');
    assert.equal((readFileSync(join(root, 'insights/patterns.md'), 'utf8').match(/### CKAI-9001/g) ?? []).length, 1);
    assert.ok(readFileSync(join(root, 'insights/patterns.md'), 'utf8').indexOf('### CKAI-9001') < readFileSync(join(root, 'insights/patterns.md'), 'utf8').indexOf('## Hypotheses'));
    assert.throws(() => preparePerformanceIngestion({repoRoot: root, input: {...input, views: 1}}), /Conflicting duplicate/);
  } finally { rmSync(root, {recursive: true, force: true}); }
});

test('malformed, unpublished and TEST records cannot enter real performance data', () => {
  const root = fixture();
  try {
    assert.throws(() => preparePerformanceIngestion({repoRoot: root, input: {contentId: 'TEST-9001', date: '2026-08-29', platform: 'Facebook Reels', views: 1}}), /excluded/);
    assert.throws(() => preparePerformanceIngestion({repoRoot: root, input: {contentId: 'CKAI-9002', date: '2026-08-29', platform: 'Facebook Reels', views: 1}}), /requires published/);
    assert.throws(() => preparePerformanceIngestion({repoRoot: root, input: {contentId: 'CKAI-9001', date: 'bad', platform: 'Facebook Reels', views: 1}}), /YYYY-MM-DD/);
    assert.throws(() => preparePerformanceIngestion({repoRoot: root, input: {contentId: 'CKAI-9001', date: '2026-08-29', platform: 'Facebook Reels', completion_pct: 101}}), /between 0 and 100/);
    const fixtureOnly = preparePerformanceIngestion({repoRoot: root, fixtureMode: true, input: {contentId: 'TEST-9001', date: '2026-08-29', platform: 'Facebook Reels', views: 1}});
    assert.equal(fixtureOnly.promotionReview, 'EXCLUDED_TEST_FIXTURE');
    assert.throws(() => commitPerformanceIngestion(fixtureOnly), /cannot be committed/);
  } finally { rmSync(root, {recursive: true, force: true}); }
});
