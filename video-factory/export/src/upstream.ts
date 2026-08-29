import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {parseFrontmatter} from '../../animation/src/engine/upstream';
import {isExportHandoffReady} from '../../review/src/gates';
import {runReviewQa} from '../../review/src/qa';
import {verifyReviewUpstream} from '../../review/src/upstream';
import {sha256} from '../../voice/src/segment';
import type {ExportMode, ExportRuntimeInput} from './model';

export type ExportUpstreamVerification = {pass: boolean; errors: string[]; derivedExportInputStatus: 'READY' | 'BLOCKED'};

export const verifyExportUpstream = (input: ExportRuntimeInput, mode: ExportMode): ExportUpstreamVerification => {
  const {exportManifest: manifest, reviewInput} = input;
  const {review} = reviewInput;
  const errors: string[] = [];
  const sources = [
    ['Final Review artifact', manifest.sourceReviewArtifact, manifest.sourceReviewArtifactSha256],
    ['Final Review snapshot', manifest.sourceReviewSnapshot, manifest.sourceReviewSnapshotSha256],
    ['Review preview', manifest.sourceReviewPreview, manifest.sourceReviewPreviewSha256],
  ] as const;
  for (const [label, path, expected] of sources) {
    const absolute = resolve(process.cwd(), path);
    if (!existsSync(absolute)) { errors.push(`${label} missing: ${path}`); continue; }
    if (sha256(readFileSync(absolute)) !== expected) errors.push(`${label} checksum mismatch`);
  }
  if (manifest.contentId !== review.contentId || manifest.id !== `${review.contentId}-Export-v${manifest.releaseVersion}`) errors.push('Export/Final Review identity mismatch');
  if (manifest.sourceReviewPreview !== review.reviewPreview.path || manifest.sourceReviewPreviewSha256 !== review.reviewPreview.sha256) errors.push('Export review-preview reference/hash differs from reviewed state');
  if (manifest.captionMode !== review.captionMode || manifest.musicMode !== review.musicMode || manifest.sfxMode !== review.sfxMode) errors.push('Export finishing modes differ from Final Review');
  if (manifest.sourceTranscript !== review.sourceChain.find((item) => item.stage === 'script')?.path) errors.push('Export transcript reference differs from Final Review chain');
  try {
    const fm = parseFrontmatter(readFileSync(resolve(process.cwd(), manifest.sourceReviewArtifact), 'utf8'));
    if (fm.id !== review.id || fm.input_eligibility !== review.inputEligibility || fm.review_preview_sha256 !== manifest.sourceReviewPreviewSha256) errors.push('Canonical Final Review artifact identity/preview mismatch');
    if (mode === 'production') {
      const expected: Record<string, string> = {input_eligibility: 'production', final_review: 'pass', human_decision: 'approved', export_handoff_status: 'READY', unresolved_issues: 'none'};
      for (const [field, value] of Object.entries(expected)) if (fm[field] !== value) errors.push(`FinalReview.${field} must be ${value}`);
      if (fm.operator_acceptance_by !== 'chatgpt-work' || !Number.isFinite(Date.parse(String(fm.operator_acceptance_at ?? ''))) || !String(fm.operator_acceptance_basis ?? '').trim()) errors.push('Final Review delegated acceptance provenance is incomplete');
      if (String(fm.operator_acceptance_source_sha256 ?? '').toUpperCase() !== manifest.sourceReviewSnapshotSha256) errors.push('Final Review delegated acceptance is not bound to the exact technical snapshot');
      if (!String(fm.operator_acceptance_basis ?? '').toUpperCase().includes(manifest.sourceReviewPreviewSha256)) errors.push('Final Review delegated acceptance basis is not bound to the exact reviewed binary');
    } else if (fm.input_eligibility !== 'legacy-approved-reverse-audit' || fm.human_decision !== 'not-applicable' || fm.export_handoff_status !== 'BLOCKED') errors.push('Reverse-audit Final Review gained production authority');
  } catch (error) { errors.push(`Final Review artifact parse failed: ${(error as Error).message}`); }
  const reviewQa = runReviewQa(reviewInput, mode, true);
  if (!reviewQa.pass) errors.push(...reviewQa.errors.map((error) => `STEP07 source: ${error}`));
  const reviewUpstream = verifyReviewUpstream(reviewInput, mode);
  if (mode === 'production' && !isExportHandoffReady(review, reviewUpstream)) errors.push('Canonical STEP07 Export handoff invariant is not READY');
  if (mode === 'reverse-audit-proof' && (manifest.inputEligibility !== 'legacy-approved-reverse-audit' || review.humanDecision !== 'not-applicable' || review.exportHandoffStatus !== 'BLOCKED')) errors.push('Reverse-audit Export was relabeled');
  const ready = mode === 'production' && errors.length === 0;
  return {pass: errors.length === 0, errors, derivedExportInputStatus: ready ? 'READY' : 'BLOCKED'};
};
