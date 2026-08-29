import {createHash} from 'node:crypto';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {approveRelease, createFacebookReelsPackageManifest, recordPublication} from '../runtime/publishing/src/lifecycle.mjs';
import {preparePerformanceIngestion} from '../runtime/learning/src/performance.mjs';

const root = mkdtempSync(join(tmpdir(), 'ckai-system-dry-run-'));
try {
  for (const directory of ['data', 'content/published', 'insights', 'generated/facebook-packages/TEST-9001']) mkdirSync(join(root, directory), {recursive: true});
  writeFileSync(join(root, 'data/content-index.csv'), 'id,status,pillar,topic,angle,structure,objective,duration_target,created,published_date,platform,title\nTEST-9001,published,ai-human,fixture,fixture,practical-tool-walkthrough,education,30,2026-08-29,2026-08-29,Facebook Reels,System fixture\n');
  writeFileSync(join(root, 'data/performance.csv'), 'id,date,platform,views,avg_watch_pct,completion_pct,likes,comments,shares,saves,follows,affiliate_clicks,notes\n');
  writeFileSync(join(root, 'insights/patterns.md'), '# Patterns\n\n## Observations\n\n## Hypotheses\n\n## Learned Patterns\n');
  writeFileSync(join(root, 'content/published/TEST-9001_fixture.md'), '---\nid: TEST-9001\nstatus: published\nplatform: Facebook Reels\npublished: 2026-08-29\n---\n');
  writeFileSync(join(root, 'content/published/TEST-9001_fixture_transcript-actual.md'), '---\nid: TEST-9001\ndelivery_mode: animated-voice\n---\n\nFixture transcript.\n');
  writeFileSync(join(root, 'content/published/TEST-9001_fixture_delivery-delta.md'), '# Fixture delivery delta\n');
  const video = join(root, 'generated/facebook-packages/TEST-9001/TEST-9001_review-candidate.mp4');
  writeFileSync(video, 'TEST FIXTURE — NOT MEDIA');
  const hash = createHash('sha256').update('TEST FIXTURE — NOT MEDIA').digest('hex').toUpperCase();
  let manifest = createFacebookReelsPackageManifest({contentId: 'TEST-9001', validationOnly: true, releaseVersion: 1, video: 'generated/facebook-packages/TEST-9001/TEST-9001_review-candidate.mp4', videoSha256: hash, caption: 'caption.txt', headline: 'headline.txt', qa: {exportQa: 'PASS', exportReview: 'pass'}});
  manifest = approveRelease(manifest, {approvedBy: 'product-owner', approvedAt: '2026-08-29T00:00:00+07:00', releaseVersion: 1, outputSha256: hash, basis: 'TEST fixture only'}, {fixtureMode: true, repoRoot: root});
  manifest = recordPublication(manifest, {confirmedBy: 'product-owner', confirmedAt: '2026-08-29T00:01:00+07:00', platform: 'Facebook Reels', publishedDate: '2026-08-29'}, {repoRoot: root, fixtureMode: true});
  const learning = preparePerformanceIngestion({repoRoot: root, fixtureMode: true, input: {contentId: 'TEST-9001', date: '2026-08-29', platform: 'Facebook Reels', views: 0, avg_watch_pct: 0, notes: 'TEST fixture only'}});
  console.log(JSON.stringify({status: 'PASS', namespace: 'TEST-9001', productionStateChanged: false, lifecycle: ['REVIEW_PACKAGE', 'READY_TO_PUBLISH', manifest.lifecycleState], publicationEvidence: manifest.publication.contentRecord, performanceOperation: learning.operation, learningClassification: learning.promotionReview, zeroPreserved: learning.record.views === '0', persistentWrites: false}, null, 2));
} finally {
  rmSync(root, {recursive: true, force: true});
}
