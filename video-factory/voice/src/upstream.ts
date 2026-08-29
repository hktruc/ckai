import {existsSync, readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {parseFrontmatter, verifyCanonicalUpstream} from '../../animation/src/engine/upstream';
import {isVoiceHandoffReady} from '../../animation/src/engine/gates';
import type {VoiceMode, VoiceRuntimeInput} from './model';
import {sha256, voiceHandoffHash} from './segment';

export type VoiceUpstreamVerification = {pass: boolean; errors: string[]; derivedVoiceInputStatus: 'READY' | 'BLOCKED'};

const readExact = (reference: string, errors: string[], label: string, parseYaml = true) => {
  const path = resolve(process.cwd(), reference);
  if (!existsSync(path)) { errors.push(`${label} does not exist: ${reference}`); return undefined; }
  const buffer = readFileSync(path);
  return {path, buffer, frontmatter: parseYaml ? parseFrontmatter(buffer.toString('utf8')) : {}};
};

export const verifyVoiceUpstream = ({plan, animation}: VoiceRuntimeInput, mode: VoiceMode): VoiceUpstreamVerification => {
  const errors: string[] = [];
  const artifact = readExact(plan.sourceAnimationArtifact, errors, 'Animation artifact');
  const executable = readExact(plan.sourceAnimationManifest, errors, 'Animation manifest', false);
  if (!artifact || !executable) return {pass: false, errors, derivedVoiceInputStatus: 'BLOCKED'};
  if (sha256(artifact.buffer) !== plan.sourceAnimationArtifactSha256) errors.push('Animation artifact checksum mismatch');
  if (sha256(executable.buffer) !== plan.sourceAnimationManifestSha256) errors.push('Animation manifest checksum mismatch');
  if (voiceHandoffHash(animation.voiceHandoff) !== plan.sourceAnimationVoiceHandoffSha256) errors.push('Animation Voice handoff snapshot mismatch');

  const record = artifact.frontmatter;
  if (record.id !== plan.contentId) errors.push(`Voice/Animation Content ID mismatch: ${plan.contentId} != ${record.id ?? 'missing'}`);
  if (animation.id !== `${plan.contentId}-Animation`) errors.push(`Executable Animation ID mismatch: ${animation.id}`);
  if (record.executable_manifest && resolve(dirname(artifact.path), record.executable_manifest) !== executable.path) errors.push('Animation executable manifest reference mismatch');
  if (animation.voiceHandoff.sourceScript !== plan.sourceScript) errors.push('Voice Plan source Script mismatch');

  const upstreamMode = mode === 'production' ? 'production' : 'reverse-audit-proof';
  const visualVerification = verifyCanonicalUpstream(animation, upstreamMode);
  if (!visualVerification.pass) errors.push(...visualVerification.errors.map((error) => `STEP05 source: ${error}`));

  if (mode === 'production') {
    const expected: Record<string, string> = {
      input_eligibility: 'production', upstream_animation_handoff_status: 'READY', technical_qa: 'PASS',
      animation_review: 'pass', human_decision: 'approved', voice_handoff_status: 'READY'
    };
    for (const [field, value] of Object.entries(expected)) if (record[field] !== value) errors.push(`Animation.${field} must be ${value}`);
    if (record.unresolved_blockers !== 'none') errors.push('Animation.unresolved_blockers must be none');
    if (!isVoiceHandoffReady(animation, visualVerification)) errors.push('Executable STEP05 Voice handoff invariant is not READY');
  } else {
    if (plan.inputEligibility !== 'legacy-approved-reverse-audit') errors.push('Proof Voice Plan eligibility was relabeled');
    if (record.input_eligibility !== 'legacy-approved-reverse-audit') errors.push('Proof Animation source eligibility was relabeled');
    if (record.human_decision !== 'not-applicable' || record.voice_handoff_status !== 'BLOCKED') errors.push('Proof Animation must remain human not-applicable and Voice BLOCKED');
    if (animation.humanDecision !== 'not-applicable' || animation.voiceHandoffStatus !== 'BLOCKED') errors.push('Executable proof Animation has production authority');
  }

  const slots = new Map<string, (typeof animation.voiceHandoff.sceneSlots)[number]>(animation.voiceHandoff.sceneSlots.map((slot) => [slot.sceneId, slot]));
  for (const segment of plan.segments) {
    const slot = slots.get(segment.sceneId);
    if (!slot) { errors.push(`${segment.id} references missing scene slot ${segment.sceneId}`); continue; }
    if (segment.originalText !== slot.spokenCopy) errors.push(`${segment.id} changed exact approved Spoken Copy`);
    if (segment.slotStartSeconds !== slot.startSeconds || segment.slotEndSeconds !== slot.endSeconds) errors.push(`${segment.id} timing differs from Animation`);
    const required = animation.voiceHandoff.proofCaveatTiming.find((item) => item.sceneId === segment.sceneId)?.requirementIds ?? [];
    if (required.some((id) => !segment.requiredProofCaveatIds.includes(id))) errors.push(`${segment.id} dropped proof/caveat timing requirements`);
  }
  if (plan.segments.length !== animation.voiceHandoff.sceneSlots.length) errors.push('Voice Plan must cover every Animation scene slot');
  const ready = mode === 'production' && errors.length === 0;
  return {pass: errors.length === 0, errors, derivedVoiceInputStatus: ready ? 'READY' : 'BLOCKED'};
};
