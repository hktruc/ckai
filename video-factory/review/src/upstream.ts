import {existsSync, readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {parseFrontmatter} from '../../animation/src/engine/upstream';
import {isFinalReviewInputReady} from '../../voice/src/gates';
import {sha256} from '../../voice/src/segment';
import {verifyVoiceUpstream} from '../../voice/src/upstream';
import type {VoicePlan} from '../../voice/src/model';
import type {ReviewMode, ReviewRuntimeInput, SourceReference} from './model';

export type ReviewUpstreamVerification = {pass: boolean; errors: string[]; derivedReviewInputStatus: 'READY' | 'BLOCKED'};

const readExact = (path: string, errors: string[], label: string) => {
  const absolute = resolve(process.cwd(), path);
  if (!existsSync(absolute)) { errors.push(`${label} does not exist: ${path}`); return undefined; }
  return {absolute, buffer: readFileSync(absolute)};
};

const chainItem = (sourceChain: SourceReference[], stage: SourceReference['stage'], errors: string[]): SourceReference | undefined => {
  const matches = sourceChain.filter((item) => item.stage === stage);
  if (matches.length !== 1) errors.push(`Source chain requires exactly one ${stage} reference`);
  return matches[0];
};

const assertRelativeReference = (ownerPath: string, reference: string | undefined, expectedPath: string, errors: string[], label: string): void => {
  if (!reference || resolve(dirname(resolve(process.cwd(), ownerPath)), reference) !== resolve(process.cwd(), expectedPath)) errors.push(`${label} reference mismatch`);
};

const technicalVoiceState = (plan: VoicePlan): string => {
  const copy = structuredClone(plan) as VoicePlan & {finalReviewExportHandoffStatus?: string};
  copy.voiceReview = 'pending'; copy.humanDecision = 'pending'; copy.unresolvedBlockers = [];
  copy.finalReviewInputStatus = 'BLOCKED'; delete copy.finalReviewExportHandoffStatus;
  return JSON.stringify(copy);
};

export const verifyReviewUpstream = ({review, voicePlan, animation}: ReviewRuntimeInput, mode: ReviewMode): ReviewUpstreamVerification => {
  const errors: string[] = [];
  const stages = ['script', 'storyboard', 'visual-direction', 'animation', 'voice'] as const;
  const refs = Object.fromEntries(stages.map((stage) => [stage, chainItem(review.sourceChain, stage, errors)])) as Record<typeof stages[number], SourceReference | undefined>;
  for (const stage of stages) {
    const ref = refs[stage];
    if (!ref) continue;
    const source = readExact(ref.path, errors, `${stage} source`);
    if (source && sha256(source.buffer) !== ref.sha256) errors.push(`${stage} source checksum mismatch`);
  }

  const snapshotFile = readExact(review.sourceVoiceSnapshot, errors, 'Voice Plan snapshot');
  const audioFile = readExact(review.sourceVoiceAudio, errors, 'Voice master audio');
  const previewFile = readExact(review.sourceVoicePreview, errors, 'Voice preview');
  if (snapshotFile) {
    if (sha256(snapshotFile.buffer) !== review.sourceVoiceSnapshotSha256) errors.push('Voice Plan snapshot checksum mismatch');
    try {
      const snapshot = JSON.parse(snapshotFile.buffer.toString('utf8')) as VoicePlan;
      if (!snapshot.finalReviewInputStatus) snapshot.finalReviewInputStatus = 'BLOCKED';
      if (technicalVoiceState(snapshot) !== technicalVoiceState(voicePlan)) errors.push('Runtime Voice Plan differs from verified technical snapshot outside delegated acceptance state');
    } catch { errors.push('Voice Plan snapshot is not valid JSON'); }
  }
  if (audioFile && sha256(audioFile.buffer) !== review.sourceVoiceAudioSha256) errors.push('Voice master audio checksum mismatch');
  if (previewFile && sha256(previewFile.buffer) !== review.sourceVoicePreviewSha256) errors.push('Voice preview checksum mismatch');

  if (review.contentId !== voicePlan.contentId || review.id !== `${review.contentId}-FinalReview`) errors.push('Final Review/Voice Content ID mismatch');
  if (review.sourceVoiceAudio !== voicePlan.assembledAudioPath) errors.push('Final Review audio reference differs from Voice Plan');
  if (review.sourceVoicePreview !== voicePlan.previewPath) errors.push('Final Review preview reference differs from Voice Plan');
  if (refs.animation?.path !== voicePlan.sourceAnimationArtifact) errors.push('Final Review Animation reference differs from Voice Plan');
  if (refs.script?.path !== voicePlan.sourceScript) errors.push('Final Review Script reference differs from Voice Plan');
  if (refs['visual-direction']?.path !== animation.sourceVisualDirection) errors.push('Final Review Visual Direction reference differs from Animation');

  if (refs.voice && refs.animation && refs.storyboard && refs['visual-direction'] && refs.script) {
    const voiceFm = parseFrontmatter(readFileSync(resolve(process.cwd(), refs.voice.path), 'utf8'));
    const animationFm = parseFrontmatter(readFileSync(resolve(process.cwd(), refs.animation.path), 'utf8'));
    const visualFm = parseFrontmatter(readFileSync(resolve(process.cwd(), refs['visual-direction'].path), 'utf8'));
    const storyboardFm = parseFrontmatter(readFileSync(resolve(process.cwd(), refs.storyboard.path), 'utf8'));
    assertRelativeReference(refs.voice.path, voiceFm.source_animation_artifact, refs.animation.path, errors, 'Voice→Animation');
    if (animationFm.source_visual_direction) assertRelativeReference(refs.animation.path, animationFm.source_visual_direction, refs['visual-direction'].path, errors, 'Animation→Visual Direction');
    assertRelativeReference(refs['visual-direction'].path, visualFm.source_approved_storyboard ?? visualFm.source_storyboard, refs.storyboard.path, errors, 'Visual Direction→Storyboard');
    assertRelativeReference(refs.storyboard.path, storyboardFm.source_approved_script ?? storyboardFm.source_script_contract ?? storyboardFm.source_script, refs.script.path, errors, 'Storyboard→Script');

    if (mode === 'production') {
      const expected: Record<string, string> = {
        input_eligibility: 'production', voice_selection_check: 'PASS', provider_input_check: 'PASS',
        segments_generated_check: 'PASS', audio_technical_qa: 'PASS', timing_fit_check: 'PASS',
        pronunciation_check: 'PASS', proof_caveat_check: 'PASS', voice_review: 'pass',
        human_decision: 'approved', final_review_input_status: 'READY',
      };
      for (const [field, value] of Object.entries(expected)) if (voiceFm[field] !== value) errors.push(`Voice.${field} must be ${value}`);
      if (String(voiceFm.operator_acceptance_source_sha256 ?? '').toUpperCase() !== review.sourceVoiceSnapshotSha256) errors.push('Voice delegated acceptance is not bound to the exact technical snapshot');
      if (voiceFm.operator_acceptance_by !== 'chatgpt-work' || !Number.isFinite(Date.parse(String(voiceFm.operator_acceptance_at ?? ''))) || !String(voiceFm.operator_acceptance_basis ?? '').trim()) errors.push('Voice delegated acceptance provenance is incomplete');
    } else if (voiceFm.input_eligibility !== 'legacy-approved-reverse-audit' || voiceFm.human_decision !== 'not-applicable' || (voiceFm.final_review_input_status ?? 'BLOCKED') !== 'BLOCKED') {
      errors.push('Reverse-audit Voice artifact gained production authority');
    }
  }

  const voiceUpstream = verifyVoiceUpstream({plan: voicePlan, animation}, mode);
  if (!voiceUpstream.pass) errors.push(...voiceUpstream.errors.map((error) => `STEP06 source: ${error}`));
  if (mode === 'production' && !isFinalReviewInputReady(voicePlan, voiceUpstream)) errors.push('Canonical STEP06 Final Review input invariant is not READY');
  if (mode === 'reverse-audit-proof') {
    if (review.inputEligibility !== 'legacy-approved-reverse-audit' || voicePlan.inputEligibility !== 'legacy-approved-reverse-audit') errors.push('Reverse-audit Final Review was relabeled');
    if (voicePlan.humanDecision !== 'not-applicable' || (voicePlan.finalReviewInputStatus ?? 'BLOCKED') !== 'BLOCKED') errors.push('Reverse-audit Voice Plan gained production authority');
  }
  const ready = mode === 'production' && errors.length === 0;
  return {pass: errors.length === 0, errors, derivedReviewInputStatus: ready ? 'READY' : 'BLOCKED'};
};
