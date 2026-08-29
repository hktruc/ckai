import {createHash} from 'node:crypto';
import {existsSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {parseCsv, rowsToObjects} from '../../../scripts/lib/csv.mjs';

export const FACEBOOK_REELS = 'Facebook Reels';
const SHA256 = /^[A-F0-9]{64}$/;
const CONTENT_ID = /^(?:CKAI|TEST)-\d{4}$/;
const isoDate = (value) => value === null || value === undefined || value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value);
const sha256File = (path) => createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase();

export const createFacebookReelsPackageManifest = ({
  contentId, packageState = 'REVIEW_PACKAGE', validationOnly = false, releaseVersion = null,
  video, videoSha256, caption, headline, cover = null, provenance = {}, qa = {}, additional = {},
}) => {
  if (!CONTENT_ID.test(contentId)) throw new Error('Publishing package requires a canonical CKAI-* or TEST-* Content ID');
  if (!video || !SHA256.test(String(videoSha256).toUpperCase())) throw new Error('Publishing package requires an exact video path and SHA-256');
  return {
    ...additional,
    schemaVersion: 1,
    contentId,
    platform: FACEBOOK_REELS,
    lifecycleState: 'REVIEW_PACKAGE',
    packageState,
    validationOnly,
    releaseVersion,
    releaseState: 'PENDING_RELEASE_APPROVAL',
    publicationState: 'NOT_PUBLISHED',
    video,
    videoSha256: String(videoSha256).toUpperCase(),
    caption,
    headline,
    cover,
    provenance,
    qa,
    releaseApproval: null,
    upload: {
      actor: 'PRODUCT_OWNER',
      state: 'WAITING_FOR_RELEASE_APPROVAL',
      instruction: 'After exact-version Release Approval, Product Owner uploads this package to Facebook Reels.',
    },
    publication: {
      platform: FACEBOOK_REELS,
      publishedDate: null,
      externalUrl: null,
      externalId: null,
      confirmedBy: null,
      confirmedAt: null,
      requiredFields: ['platform', 'productOwnerPublicationConfirmation'],
      optionalFields: ['publishedDate', 'externalUrl', 'externalId'],
    },
  };
};

export const verifyPackageVideo = (manifest, repoRoot) => {
  const path = resolve(repoRoot, manifest.video);
  return existsSync(path) && sha256File(path) === manifest.videoSha256;
};

export const approveRelease = (manifest, approval, {fixtureMode = false, repoRoot} = {}) => {
  if (manifest.validationOnly && !fixtureMode) throw new Error('Validation-only package cannot receive real Release Approval');
  if (!repoRoot || !verifyPackageVideo(manifest, repoRoot)) throw new Error('Release Approval requires the current package video to match its exact SHA-256');
  if (approval.approvedBy !== 'product-owner') throw new Error('Direct Product Owner Release Approval is required');
  if (!Number.isFinite(Date.parse(approval.approvedAt))) throw new Error('Release Approval requires an ISO-compatible approvedAt');
  if (String(approval.outputSha256).toUpperCase() !== manifest.videoSha256) throw new Error('Release Approval output SHA-256 does not match the package video');
  if (approval.releaseVersion !== manifest.releaseVersion) throw new Error('Release Approval version does not match the package release version');
  if (manifest.qa.exportQa !== 'PASS' || manifest.qa.exportReview !== 'pass') throw new Error('Release Approval requires PASS export QA and export review');
  return {
    ...manifest,
    lifecycleState: 'READY_TO_PUBLISH',
    packageState: 'READY_TO_PUBLISH',
    releaseState: 'RELEASE_APPROVED',
    releaseApproval: {...approval, outputSha256: manifest.videoSha256},
    upload: {...manifest.upload, state: 'AWAITING_PRODUCT_OWNER_UPLOAD'},
  };
};

const normalize = (value) => String(value ?? '').trim().toLowerCase();
const publishedEvidence = (repoRoot, contentId, platform, publishedDate) => {
  const indexPath = join(repoRoot, 'data', 'content-index.csv');
  if (!existsSync(indexPath)) throw new Error('Canonical content index is missing');
  const rows = rowsToObjects(parseCsv(readFileSync(indexPath, 'utf8')));
  const row = rows.find((item) => item.id === contentId);
  if (!row || row.status !== 'published') throw new Error('Content index must already record the Content ID as published via /ck-publish');
  const platforms = String(row.platform ?? '').split(',').map(normalize).filter(Boolean);
  if (!platforms.includes(normalize(platform))) throw new Error('Publication platform does not match the canonical content index');
  if (publishedDate && row.published_date !== publishedDate) throw new Error('Publication date does not match the canonical content index');
  const directory = join(repoRoot, 'content', 'published');
  const names = existsSync(directory) ? readdirSync(directory).filter((name) => name.startsWith(`${contentId}_`) && name.endsWith('.md')) : [];
  const script = names.find((name) => !name.endsWith('_transcript-actual.md') && !name.endsWith('_delivery-delta.md'));
  const transcript = names.find((name) => name.endsWith('_transcript-actual.md'));
  const delta = names.find((name) => name.endsWith('_delivery-delta.md'));
  if (!script || !transcript || !delta) throw new Error('Published lifecycle requires script, transcript-actual and delivery-delta evidence');
  const transcriptText = readFileSync(join(directory, transcript), 'utf8');
  if (!/^delivery_mode:\s*(manual-human|animated-voice|other)\s*$/m.test(transcriptText)) throw new Error('Transcript actual has no valid delivery_mode');
  return {
    contentIndex: relative(repoRoot, indexPath).replaceAll('\\', '/'),
    publishedContent: `content/published/${script}`,
    transcriptActual: `content/published/${transcript}`,
    deliveryDelta: `content/published/${delta}`,
  };
};

export const recordPublication = (manifest, input, {repoRoot, fixtureMode = false} = {}) => {
  if (manifest.validationOnly && !fixtureMode) throw new Error('Validation-only package cannot become a real publication');
  if (manifest.lifecycleState !== 'READY_TO_PUBLISH' || manifest.releaseState !== 'RELEASE_APPROVED') throw new Error('Publication requires exact-version Release Approval and READY_TO_PUBLISH state');
  if (input.confirmedBy !== 'product-owner') throw new Error('Authoritative Product Owner publication confirmation is required');
  if (!Number.isFinite(Date.parse(input.confirmedAt))) throw new Error('Publication confirmation requires an ISO-compatible confirmedAt');
  if (input.platform !== FACEBOOK_REELS) throw new Error(`This boundary requires canonical platform ${FACEBOOK_REELS}`);
  if (!isoDate(input.publishedDate)) throw new Error('publishedDate must be blank or YYYY-MM-DD');
  if (input.externalUrl && !/^https?:\/\//i.test(input.externalUrl)) throw new Error('externalUrl must be an HTTP(S) URL when supplied');
  if (input.externalId !== null && input.externalId !== undefined && !String(input.externalId).trim()) throw new Error('externalId must be non-empty when supplied');
  if (!repoRoot) throw new Error('repoRoot is required to verify canonical /ck-publish evidence');
  if (!verifyPackageVideo(manifest, repoRoot)) throw new Error('Published package video no longer matches the Release-approved SHA-256');
  const contentRecord = publishedEvidence(resolve(repoRoot), manifest.contentId, input.platform, input.publishedDate || null);
  return {
    ...manifest,
    lifecycleState: 'PUBLISHED',
    packageState: 'PUBLISHED',
    publicationState: 'PUBLISHED',
    upload: {...manifest.upload, state: 'CONFIRMED_UPLOADED'},
    publication: {
      ...manifest.publication,
      platform: input.platform,
      publishedDate: input.publishedDate || null,
      externalUrl: input.externalUrl || null,
      externalId: input.externalId || null,
      confirmedBy: input.confirmedBy,
      confirmedAt: input.confirmedAt,
      contentRecord,
    },
  };
};

export const writeManifestAtomic = (path, manifest) => {
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  renameSync(temporary, path);
};
