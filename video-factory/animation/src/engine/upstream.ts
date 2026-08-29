import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {dirname, isAbsolute, relative, resolve} from 'node:path';
import type {AnimationManifest, RenderMode} from '../model';

type Frontmatter = Record<string, string>;

export type UpstreamVerification = {
  pass: boolean;
  errors: string[];
  sourceSha256?: string;
  derivedAnimationHandoffStatus: 'READY' | 'BLOCKED';
};

const STEP_04_PASS_FIELDS = [
  'visual_input_check',
  'storyboard_trace_check',
  'proof_evidence_check',
  'caveat_check',
  'asset_provenance_check',
  'native_vertical_check',
  'continuity_check',
  'readability_density_check',
  'brand_check',
  'boundary_check',
  'visual_quality_check'
] as const;

const STEP_03_PASS_FIELDS = [
  'input_check',
  'spoken_mapping_check',
  'timing_check',
  'proof_evidence_check',
  'caveat_check',
  'storyboard_quality_check',
  'boundary_check'
] as const;

export const parseFrontmatter = (text: string): Frontmatter => {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) throw new Error('Missing YAML frontmatter');
  const result: Frontmatter = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim() || /^\s/.test(line)) continue;
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    result[key] = value;
  }
  return result;
};

const sha256 = (content: Buffer): string => createHash('sha256').update(content).digest('hex').toUpperCase();

const resolveRepoPath = (reference: string, baseDirectory = process.cwd()): string => {
  const repoRoot = resolve(process.cwd());
  const target = resolve(baseDirectory, reference);
  const outside = relative(repoRoot, target).startsWith('..') || isAbsolute(relative(repoRoot, target));
  if (outside) throw new Error(`Source reference escapes repository: ${reference}`);
  return target;
};

const expectValue = (frontmatter: Frontmatter, field: string, expected: string, label: string, errors: string[]) => {
  if (frontmatter[field] !== expected) errors.push(`${label}.${field} must be ${expected}, got ${frontmatter[field] ?? 'missing'}`);
};

const readSource = (path: string, label: string, errors: string[]): {buffer: Buffer; frontmatter: Frontmatter} | undefined => {
  if (!existsSync(path)) {
    errors.push(`${label} source does not exist: ${path}`);
    return undefined;
  }
  try {
    const buffer = readFileSync(path);
    return {buffer, frontmatter: parseFrontmatter(buffer.toString('utf8'))};
  } catch (error) {
    errors.push(`${label} source cannot be parsed: ${(error as Error).message}`);
    return undefined;
  }
};


const resolveSourceReference = (
  reference: string,
  baseDirectory: string,
  label: string,
  errors: string[]
): string | undefined => {
  try {
    return resolveRepoPath(reference, baseDirectory);
  } catch (error) {
    errors.push(`${label} source reference is invalid: ${(error as Error).message}`);
    return undefined;
  }
};
export const verifyCanonicalUpstream = (manifest: AnimationManifest, mode: RenderMode): UpstreamVerification => {
  const errors: string[] = [];
  let visualPath: string;
  try {
    visualPath = resolveRepoPath(manifest.sourceVisualDirection);
  } catch (error) {
    return {pass: false, errors: [(error as Error).message], derivedAnimationHandoffStatus: 'BLOCKED'};
  }

  const visual = readSource(visualPath, 'Visual Direction', errors);
  if (!visual) return {pass: false, errors, derivedAnimationHandoffStatus: 'BLOCKED'};
  const sourceSha256 = sha256(visual.buffer);
  if (sourceSha256 !== manifest.sourceVisualDirectionSha256) {
    errors.push(`Visual Direction checksum mismatch: expected ${manifest.sourceVisualDirectionSha256}, got ${sourceSha256}`);
  }

  const vd = visual.frontmatter;
  if (manifest.id !== `${vd.id}-Animation`) {
    errors.push(`Animation/Visual Direction Content ID mismatch: ${manifest.id} != ${vd.id ?? 'missing'}-Animation`);
  }
  const storyboardReference = vd.source_approved_storyboard ?? vd.source_storyboard;
  if (!storyboardReference) errors.push('Visual Direction source storyboard reference is missing');
  const storyboardPath = storyboardReference
    ? resolveSourceReference(storyboardReference, dirname(visualPath), 'Storyboard', errors)
    : undefined;
  const storyboard = storyboardPath ? readSource(storyboardPath, 'Storyboard', errors) : undefined;

  if (mode === 'production') {
    expectValue(vd, 'visual_input_eligibility', 'production', 'Visual Direction', errors);
    STEP_04_PASS_FIELDS.forEach((field) => expectValue(vd, field, 'PASS', 'Visual Direction', errors));
    expectValue(vd, 'visual_review', 'pass', 'Visual Direction', errors);
    expectValue(vd, 'human_decision', 'approved', 'Visual Direction', errors);
    expectValue(vd, 'animation_handoff_status', 'READY', 'Visual Direction', errors);
    expectValue(vd, 'unresolved_issues', 'none', 'Visual Direction', errors);

    let storyboardScriptPath: string | undefined;
    if (storyboard) {
      const sb = storyboard.frontmatter;
      if (vd.id !== sb.id) errors.push(`Visual Direction/Storyboard Content ID mismatch: ${vd.id ?? 'missing'} != ${sb.id ?? 'missing'}`);
      expectValue(sb, 'input_eligibility', 'production', 'Storyboard', errors);
      STEP_03_PASS_FIELDS.forEach((field) => expectValue(sb, field, 'PASS', 'Storyboard', errors));
      expectValue(sb, 'storyboard_review', 'pass', 'Storyboard', errors);
      expectValue(sb, 'human_decision', 'approved', 'Storyboard', errors);
      expectValue(sb, 'visual_director_handoff_status', 'READY', 'Storyboard', errors);
      expectValue(sb, 'unresolved_issues', 'none', 'Storyboard', errors);
      const scriptReference = sb.source_approved_script;
      if (!scriptReference) errors.push('Storyboard canonical approved Script reference is missing');
      else {
        storyboardScriptPath = resolveSourceReference(scriptReference, dirname(storyboardPath!), 'Storyboard approved Script', errors);
        if (storyboardScriptPath) {
          const script = readSource(storyboardScriptPath, 'Storyboard approved Script', errors);
          if (script) {
            const sourceScript = script.frontmatter;
            if (sb.id !== sourceScript.id) errors.push(`Storyboard/Script Content ID mismatch: ${sb.id ?? 'missing'} != ${sourceScript.id ?? 'missing'}`);
            expectValue(sourceScript, 'format', 'vertical-9x16', 'Script', errors);
            expectValue(sourceScript, 'status', 'approved', 'Script', errors);
            expectValue(sourceScript, 'editorial_review', 'pass', 'Script', errors);
            expectValue(sourceScript, 'human_decision', 'approved', 'Script', errors);
            expectValue(sourceScript, 'duration_check', 'PASS', 'Script', errors);
            expectValue(sourceScript, 'claim_evidence_check', 'PASS', 'Script', errors);
            expectValue(sourceScript, 'storyboard_handoff_status', 'READY', 'Script', errors);
          }
        }
      }
    }
    const visualScriptReference = vd.source_approved_script;
    if (!visualScriptReference) errors.push('Visual Direction canonical approved Script reference is missing');
    else {
      const visualScriptPath = resolveSourceReference(visualScriptReference, dirname(visualPath), 'Visual Direction approved Script', errors);
      if (visualScriptPath && !existsSync(visualScriptPath)) errors.push(`Visual Direction approved Script source does not exist: ${visualScriptPath}`);
      if (storyboardScriptPath && visualScriptPath && visualScriptPath !== storyboardScriptPath) {
        errors.push('Visual Direction and Storyboard approved Script references do not match');
      }
    }
  } else {
    expectValue(vd, 'visual_input_eligibility', 'legacy-approved-reverse-audit', 'Visual Direction proof', errors);
    expectValue(vd, 'human_decision', 'not-applicable', 'Visual Direction proof', errors);
    expectValue(vd, 'animation_handoff_status', 'BLOCKED', 'Visual Direction proof', errors);
    if (storyboard) {
      expectValue(storyboard.frontmatter, 'input_eligibility', 'legacy-approved-reverse-audit', 'Storyboard proof', errors);
      expectValue(storyboard.frontmatter, 'human_decision', 'not-applicable', 'Storyboard proof', errors);
      expectValue(storyboard.frontmatter, 'visual_director_handoff_status', 'BLOCKED', 'Storyboard proof', errors);
    }
  }

  const sourceReady = mode === 'production' && errors.length === 0;
  const derivedAnimationHandoffStatus = sourceReady ? 'READY' : 'BLOCKED';
  if (manifest.upstreamAnimationHandoffStatus !== derivedAnimationHandoffStatus) {
    errors.push(`Declared upstream handoff ${manifest.upstreamAnimationHandoffStatus} does not match derived source state ${derivedAnimationHandoffStatus}`);
  }
  return {pass: errors.length === 0, errors, sourceSha256, derivedAnimationHandoffStatus};
};
