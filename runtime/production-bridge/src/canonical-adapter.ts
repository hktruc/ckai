import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {contentApprovalFingerprint, parseFrontmatter, sha256File, validateApprovedSource} from './core.mjs';
import {runTechnicalQa} from '../../../video-factory/animation/src/engine/qa';
import {isVoiceHandoffReady} from '../../../video-factory/animation/src/engine/gates';
import {verifyCanonicalUpstream} from '../../../video-factory/animation/src/engine/upstream';
import type {AnimationManifest, Scene} from '../../../video-factory/animation/src/model';
import {createSceneArtDirection, proofClassFromText, type DepthStrategy, type KineticRole, type LightingStrategy, type LinePurpose, type SourceStrategy} from '../../../video-factory/animation/src/visual-system/grammar';
import {DEFAULT_VISUAL_PRESET_ID} from '../../../video-factory/animation/src/visual-system/preset';
import type {PacingIntent, SemanticArchetype, SemanticObjectId, VisualMode} from '../../../video-factory/animation/src/visual-system/art-direction';
import {readAssetContract, readKeyVisualBrief, type HybridVisualSourceChoice, type HybridVisualSourcePlan} from '../../../video-factory/animation/src/visual-system/hybrid-source';
import {createMotionPlan} from '../../../video-factory/animation/src/motion-system';
import {CKAI_SIGNATURE_V1} from '../../../video-factory/animation/src/visual-system/signature';

type ProductionJob = {
  contentId: string;
  requestedAction: 'produce-to-review-package';
  source: {artifactPath: string; sha256: string};
  approval: Record<string, unknown>;
  providerPolicy: Record<string, unknown>;
};

type CanonicalStage = {path: string; relativePath: string; markdown: string; fields: Record<string, unknown>; sha256: string};

const canonicalOne = (repoRoot: string, directory: string, contentId: string, label: string): CanonicalStage => {
  const root = join(repoRoot, directory);
  const names = existsSync(root) ? readdirSync(root).filter((name) => name.startsWith(`${contentId}_`) && name.endsWith('.md')).sort() : [];
  if (names.length !== 1) throw Object.assign(new Error(`Exactly one canonical ${label} artifact is required for ${contentId}`), {code: `${label.toUpperCase().replaceAll(' ', '_')}_MISSING`});
  const path = join(root, names[0]);
  const markdown = readFileSync(path, 'utf8');
  return {path, relativePath: relative(repoRoot, path).replaceAll('\\', '/'), markdown, fields: parseFrontmatter(markdown), sha256: sha256File(path)};
};

const resolveReference = (owner: CanonicalStage, reference: unknown): string | null => typeof reference === 'string' && reference.trim() ? resolve(dirname(owner.path), reference) : null;
const requireEqual = (actual: unknown, expected: unknown, message: string) => { if (actual !== expected) throw Object.assign(new Error(message), {code: 'CANONICAL_CHAIN_BLOCKED'}); };
const requireSha = (actual: unknown, expected: string, message: string) => requireEqual(String(actual ?? '').toUpperCase(), expected, message);

const validateDelegatedAcceptance = (artifact: CanonicalStage, upstreamSha256: string, label: string) => {
  requireEqual(artifact.fields.operator_acceptance_by, 'chatgpt-work', `${label} canonical delegated acceptance provenance is missing`);
  if (!artifact.fields.operator_acceptance_at || !Number.isFinite(Date.parse(String(artifact.fields.operator_acceptance_at)))) throw Object.assign(new Error(`${label} operator_acceptance_at is invalid`), {code: 'CANONICAL_CHAIN_BLOCKED'});
  if (typeof artifact.fields.operator_acceptance_basis !== 'string' || !artifact.fields.operator_acceptance_basis.trim()) throw Object.assign(new Error(`${label} operator_acceptance_basis is missing`), {code: 'CANONICAL_CHAIN_BLOCKED'});
  requireSha(artifact.fields.operator_acceptance_source_sha256, upstreamSha256, `${label} delegated acceptance is stale or not bound to its canonical upstream artifact`);
};

const section = (markdown: string, headings: string[]): string | null => {
  const escaped = headings.map((heading) => heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return markdown.match(new RegExp(`^##\\s+(?:${escaped})\\s*\\r?\\n([\\s\\S]*?)(?=^##\\s+|(?![\\s\\S]))`, 'mi'))?.[1].replace(/\r\n/g, '\n').trim() ?? null;
};

const approvedSpokenCopy = (markdown: string) => {
  const value = section(markdown, ['4. SPOKEN COPY', 'Final Spoken Copy', 'Spoken Copy', 'Full Script']);
  if (!value) throw Object.assign(new Error('Canonical approved Spoken Copy is missing'), {code: 'SPOKEN_COPY_MISSING'});
  return value;
};

const productionSpokenCopy = (value: string) => value
  .split('\n')
  .filter((line) => !/^\s*\[(?:B\d+\b[^\]]*|pause|hold)\]\s*$/i.test(line))
  .join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const timeSeconds = (value: string): number => {
  if (/^\d+(?:\.\d+)?$/.test(value.trim())) return Number(value);
  const match = value.trim().match(/^(\d{1,2}):(\d{2}(?:\.\d+)?)$/);
  if (!match) throw Object.assign(new Error(`Invalid canonical Storyboard timing: ${value}`), {code: 'STORYBOARD_TIMING_BLOCKED'});
  return Number(match[1]) * 60 + Number(match[2]);
};

const storyboardScenes = (markdown: string) => {
  const blocks = [...markdown.matchAll(/^###\s+(SC-\d+)\s*\r?\n([\s\S]*?)(?=^###\s+SC-\d+|^##\s+|(?![\s\S]))/gmi)];
  if (!blocks.length) throw Object.assign(new Error('Canonical Storyboard has no SC-* blocks'), {code: 'STORYBOARD_SCHEMA_BLOCKED'});
  return blocks.map((block) => {
    const timing = block[2].match(/^-\s+\*\*Timing:\*\*[ \t]*([0-9:.]+)[ \t]*[–—-][ \t]*([0-9:.]+)/mi);
    const spoken = block[2].match(/^-\s+\*\*Spoken Copy:\*\*[ \t]*\r?\n(?:[ \t]*\r?\n)?([\s\S]*?)(?=\r?\n-\s+\*\*|(?![\s\S]))/mi);
    if (!timing || !spoken) throw Object.assign(new Error(`${block[1]} must contain Timing and Spoken Copy`), {code: 'STORYBOARD_SCHEMA_BLOCKED'});
    return {id: block[1] as Scene['id'], startSeconds: timeSeconds(timing[1]), endSeconds: timeSeconds(timing[2]), spokenCopy: spoken[1].split(/\r?\n/).map((line) => line.replace(/^>\s?/, '')).join('\n').trim()};
  });
};

const visualSceneBlock = (markdown: string, sceneId: string) => markdown.match(new RegExp(`^###\\s+${sceneId}\\s*\\r?\\n([\\s\\S]*?)(?=^###\\s+SC-\\d+|^##\\s+|(?![\\s\\S]))`, 'mi'))?.[1] ?? '';
const bulletValue = (block: string, labels: string[]) => {
  const escaped = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return block.match(new RegExp(`^-\\s+\\*\\*(?:${escaped}):\\*\\*\\s*([^\\r\\n]+)`, 'mi'))?.[1].trim() ?? '';
};
const kineticRoleFor = (semantic: string): KineticRole => /kết luận|chốt|cta|nguyên tắc cuối/i.test(semantic) ? 'short-conclusion' : /so sánh|đối lập|khác biệt|phân tách/i.test(semantic) ? 'contrast' : /proof|evidence|kiểm chứng|kết quả|audit/i.test(semantic) ? 'key-claim' : 'keyword';
const canonicalChoice = <T extends string>(value: string, allowed: readonly T[], fallback: T): T => allowed.includes(value as T) ? value as T : fallback;
const canonicalOptional = <T extends string>(value: string, allowed: readonly T[]): T | undefined => allowed.includes(value as T) ? value as T : undefined;
const deriveSceneArtDirection = (visual: CanonicalStage, scene: {id: Scene['id']; purpose: string}, focusFallback: string) => {
  const block = visualSceneBlock(visual.markdown, scene.id);
  const semanticFunction = bulletValue(block, ['Semantic visual function']) || scene.purpose;
  const focal = bulletValue(block, ['Focal / supporting elements', 'Focal element']);
  const [primaryFocus, ...supporting] = focal.split(/\s*\/\s*/).filter(Boolean);
  const proofText = bulletValue(block, ['Proof representation']);
  const proofClass = proofClassFromText(proofText);
  const raw = {
    displayCopy: bulletValue(block, ['Display copy']), semanticArchetype: bulletValue(block, ['Semantic archetype']), visualMode: bulletValue(block, ['Visual mode']), semanticObject: bulletValue(block, ['Semantic object']).toLowerCase(),
    primaryVisualConcept: bulletValue(block, ['Primary visual concept']), primaryVisualObject: bulletValue(block, ['Primary visual object']), objectRationale: bulletValue(block, ['Object rationale', 'Why this object']), centralTension: bulletValue(block, ['Central tension', 'Primary tension']),
    compositionStrategy: bulletValue(block, ['Composition strategy']), lightingStrategy: bulletValue(block, ['Lighting strategy']), depthStrategy: bulletValue(block, ['Depth strategy']), typographyStrategy: bulletValue(block, ['Typography strategy']), proofPolicy: bulletValue(block, ['Proof strategy', 'Proof policy']),
    negativeSpaceRole: bulletValue(block, ['Negative-space intent', 'Negative-space role']), sourceStrategy: bulletValue(block, ['Source strategy']), forbiddenFallbackAnatomy: bulletValue(block, ['Forbidden fallback anatomy']),
    hybridSourceChoice: bulletValue(block, ['Hybrid source choice']), sourceChoiceRationale: bulletValue(block, ['Source choice rationale']),
  };
  const missing = Object.entries(raw).filter(([, value]) => !value.trim()).map(([field]) => field);
  if (missing.length) throw Object.assign(new Error(`${scene.id} canonical Visual Direction is insufficient for production: ${missing.join(', ')}`), {code: 'VISUAL_DIRECTION_INSUFFICIENT_FOR_PRODUCTION'});
  const semanticArchetype = canonicalOptional<SemanticArchetype>(raw.semanticArchetype, ['thesis-declaration', 'contrast-before-after', 'investigation-verification', 'transformation', 'consequence-payoff', 'evidence-proof', 'reflection-insight', 'warning-tension', 'conclusion-distillation']);
  const visualMode = canonicalOptional<VisualMode>(raw.visualMode, ['typographic-editorial', 'object-metaphor-cinematic', 'proof-evidence-presentation', 'transformation-comparison']);
  const semanticObject = canonicalOptional<SemanticObjectId>(raw.semanticObject, ['none', 'lens', 'balance', 'layers', 'fracture', 'domino-chain', 'aperture', 'document-field', 'reassembly-field']);
  const lightingStrategy = canonicalOptional<LightingStrategy>(raw.lightingStrategy, ['directional-edge', 'backlight', 'localized-glow', 'dark-to-light', 'shadow-separation', 'restrained-ambient']);
  const depthStrategy = canonicalOptional<DepthStrategy>(raw.depthStrategy, ['foreground-background', 'occlusion', 'perspective', 'atmospheric', 'shadow-separation', 'flat-intentional']);
  const sourceStrategy = canonicalOptional<SourceStrategy>(raw.sourceStrategy, ['typography-only', 'procedural-semantic-object', 'canonical-evidence-representation', 'approved-local-asset']);
  const hybridChoice = canonicalOptional<HybridVisualSourceChoice>(raw.hybridSourceChoice, ['CODE_NATIVE', 'REAL_EVIDENCE', 'GENERATED_KEY_VISUAL', 'CURATED_OR_GENERATED_KEY_VISUAL']);
  if (!semanticArchetype || !visualMode || !semanticObject || !lightingStrategy || !depthStrategy || !sourceStrategy || !hybridChoice) throw Object.assign(new Error(`${scene.id} canonical Visual Direction contains an unsupported production art-direction value`), {code: 'VISUAL_DIRECTION_INSUFFICIENT_FOR_PRODUCTION'});
  const artDirection = createSceneArtDirection({semanticFunction, primaryFocus: raw.displayCopy, supportingElements: supporting,
    semanticArchetype, visualMode, semanticObject,
    primaryVisualConcept: raw.primaryVisualConcept,
    primaryVisualObject: /^none$/i.test(raw.primaryVisualObject) ? 'editorial typography' : raw.primaryVisualObject,
    visualMetaphor: bulletValue(block, ['Visual metaphor']) || '',
    objectRationale: raw.objectRationale,
    centralTension: raw.centralTension,
    compositionStrategy: raw.compositionStrategy,
    lightingStrategy,
    depthStrategy,
    linePurpose: canonicalChoice<LinePurpose>(bulletValue(block, ['Line purpose']), ['connect', 'reveal', 'separate', 'directional-tension', 'none'], 'none'),
    typographyStrategy: raw.typographyStrategy,
    pacingIntent: canonicalOptional<PacingIntent>(bulletValue(block, ['Pacing intent']), ['hold', 'scan', 'investigate', 'accumulate', 'cascade', 'reveal', 'reflect', 'interrupt', 'resolve']),
    proofPolicy: raw.proofPolicy,
    negativeSpaceRole: raw.negativeSpaceRole,
    sourceStrategy,
    forbiddenFallbackAnatomy: raw.forbiddenFallbackAnatomy,
    eyePath: bulletValue(block, ['Eye path']) || 'dominant focal element to the single supporting evidence or conclusion',
    accentRationale: bulletValue(block, ['Accent rationale']) || 'none',
    hierarchy: bulletValue(block, ['Composition / hierarchy', 'Spatial hierarchy']) || 'One dominant focus; supporting information recedes',
    emotionalTone: bulletValue(block, ['Emotional tone']) || 'calm, confident, restrained',
    continuity: bulletValue(block, ['Continuity notes']) || 'Preserve semantic identity into the next scene',
    occupiedRatio: 0.55, strongAttractors: supporting.length ? 2 : 1, kineticRole: kineticRoleFor(semanticFunction),
    proof: {classification: proofClass, truthLabel: proofClass === 'none' ? '' : bulletValue(block, ['Proof truth label']) || proofText, provenance: proofClass === 'none' ? '' : visual.relativePath, evidenceAssetAvailable: proofClass !== 'actual-proof' || /\|\s*AVAILABLE\s*\|/i.test(visual.markdown)}});
  const assetContractPath = bulletValue(block, ['Visual asset contract']);
  const keyVisualBriefPath = bulletValue(block, ['Key visual brief']);
  const workspace = resolve(dirname(visual.path), '../..');
  const hybridSource: HybridVisualSourcePlan = {choice: hybridChoice, rationale: raw.sourceChoiceRationale};
  if (assetContractPath && !/^none$/i.test(assetContractPath)) {
    hybridSource.assetContractPath = relative(workspace, resolve(dirname(visual.path), assetContractPath)).replaceAll('\\', '/');
    hybridSource.asset = readAssetContract(workspace, hybridSource.assetContractPath);
  }
  if (keyVisualBriefPath && !/^none$/i.test(keyVisualBriefPath)) {
    hybridSource.keyVisualBriefPath = relative(workspace, resolve(dirname(visual.path), keyVisualBriefPath)).replaceAll('\\', '/');
    hybridSource.keyVisualBrief = readKeyVisualBrief(workspace, hybridSource.keyVisualBriefPath);
  }
  if ((hybridChoice === 'CURATED_OR_GENERATED_KEY_VISUAL' || hybridChoice === 'GENERATED_KEY_VISUAL') && !hybridSource.asset) hybridSource.creativeLimitation = 'KEY_VISUAL_ASSET_REQUIRED';
  return {artDirection, displayCopy: raw.displayCopy.replace(/\\n/g, '\n'), hybridSource, semanticMotionIntent: bulletValue(block, ['Motion intent'])};
};

export const deriveCanonicalAnimationManifest = (job: ProductionJob, repoRoot: string) => {
  const approval = validateApprovedSource(job, repoRoot);
  if (!approval.ok) throw Object.assign(new Error(approval.message), {code: approval.code});
  const script: CanonicalStage = {path: approval.sourcePath, relativePath: job.source.artifactPath, markdown: readFileSync(approval.sourcePath, 'utf8'), fields: approval.fields, sha256: approval.sourceSha256};
  const storyboard = canonicalOne(repoRoot, 'content/storyboards', job.contentId, 'Storyboard');
  const visual = canonicalOne(repoRoot, 'content/visual-directions', job.contentId, 'Visual Direction');

  requireEqual(storyboard.fields.id, job.contentId, 'Storyboard Content ID mismatch');
  requireEqual(resolveReference(storyboard, storyboard.fields.source_approved_script), script.path, 'Storyboard does not reference canonical STEP 02');
  requireSha(storyboard.fields.source_approved_script_sha256, script.sha256, 'Storyboard STEP 02 reference hash is stale');
  requireSha(storyboard.fields.content_approval_fingerprint_sha256, contentApprovalFingerprint(script.markdown), 'Storyboard Content Approval anchor is stale');
  for (const [field, value] of Object.entries({input_eligibility: 'production', storyboard_review: 'pass', human_decision: 'approved', visual_director_handoff_status: 'READY', input_check: 'PASS', spoken_mapping_check: 'PASS', timing_check: 'PASS', proof_evidence_check: 'PASS', caveat_check: 'PASS', storyboard_quality_check: 'PASS', boundary_check: 'PASS', unresolved_issues: 'none'})) requireEqual(storyboard.fields[field], value, `Storyboard.${field} must be ${value}`);
  validateDelegatedAcceptance(storyboard, script.sha256, 'Storyboard');

  requireEqual(visual.fields.id, job.contentId, 'Visual Direction Content ID mismatch');
  requireEqual(resolveReference(visual, visual.fields.source_approved_storyboard), storyboard.path, 'Visual Direction does not reference canonical Storyboard');
  requireEqual(resolveReference(visual, visual.fields.source_approved_script), script.path, 'Visual Direction does not reference canonical STEP 02');
  requireSha(visual.fields.source_approved_storyboard_sha256, storyboard.sha256, 'Visual Direction Storyboard hash is stale');
  requireSha(visual.fields.source_approved_script_sha256, script.sha256, 'Visual Direction STEP 02 hash is stale');
  for (const [field, value] of Object.entries({visual_input_eligibility: 'production', visual_review: 'pass', human_decision: 'approved', animation_handoff_status: 'READY', visual_input_check: 'PASS', storyboard_trace_check: 'PASS', proof_evidence_check: 'PASS', caveat_check: 'PASS', asset_provenance_check: 'PASS', native_vertical_check: 'PASS', continuity_check: 'PASS', readability_density_check: 'PASS', brand_check: 'PASS', boundary_check: 'PASS', visual_quality_check: 'PASS', unresolved_issues: 'none'})) requireEqual(visual.fields[field], value, `VisualDirection.${field} must be ${value}`);
  validateDelegatedAcceptance(visual, storyboard.sha256, 'Visual Direction');
  const scenes = storyboardScenes(storyboard.markdown);
  if (scenes.map((scene) => scene.spokenCopy).join('\n\n') !== approvedSpokenCopy(script.markdown)) throw Object.assign(new Error('Storyboard changed exact approved Spoken Copy'), {code: 'SPOKEN_COPY_IMMUTABILITY_FAILURE'});
  if (scenes[0].startSeconds !== 0 || scenes.some((scene, index) => scene.endSeconds <= scene.startSeconds || (index > 0 && scene.startSeconds !== scenes[index - 1].endSeconds))) throw Object.assign(new Error('Storyboard timeline is not positive and contiguous'), {code: 'STORYBOARD_TIMING_BLOCKED'});
  const totalSeconds = scenes.at(-1)!.endSeconds;
  if (!(totalSeconds > 0 && totalSeconds < 60)) throw Object.assign(new Error('Storyboard duration must be positive and under 60 seconds'), {code: 'DURATION_GATE_BLOCKED'});
  const productionCopy = scenes.map((scene) => productionSpokenCopy(scene.spokenCopy));
  const purposes = ['Đặt vấn đề', 'Phân biệt đồng thời và nhân quả', 'Khung bốn phần', 'Kết quả kiểm chứng trực tiếp', 'Giới hạn và vai trò con người', 'Hành động tiếp theo'];
  const assets = Object.fromEntries(scenes.map((scene, index) => [`A${index + 1}`, {id: `A${index + 1}`, kind: 'text' as const, value: productionCopy[index], source: script.relativePath, truthLabel: 'Nội dung đã được duyệt'}]));
  const draft: AnimationManifest = {
    id: `${job.contentId}-Animation`, type: 'short-form-animation', sourceVisualDirection: visual.relativePath, sourceVisualDirectionSha256: visual.sha256,
    inputEligibility: 'production', upstreamAnimationHandoffStatus: 'READY', width: 1080, height: 1920, fps: 30, totalSeconds, visualPresetId: DEFAULT_VISUAL_PRESET_ID,
    signatureProfileId: CKAI_SIGNATURE_V1.id,
    scenes: scenes.map((scene, index) => {
      const purpose = purposes[index] ?? 'Phát triển nội dung';
      const direction = deriveSceneArtDirection(visual, {id: scene.id, purpose}, productionCopy[index]);
      return {id: scene.id, startSeconds: scene.startSeconds, endSeconds: scene.endSeconds, purpose, requiredAssetIds: [`A${index + 1}`], requiredProofIds: [], requiredCaveatIds: [], motion: ['reveal', 'emphasis'], displayCopy: direction.displayCopy, artDirection: direction.artDirection, hybridSource: direction.hybridSource, motionPlan: createMotionPlan(scene.endSeconds - scene.startSeconds, direction.semanticMotionIntent, index)};
    }),
    assets, proofIds: [], caveatIds: [], technicalQa: 'BLOCKED', animationReview: 'pending', humanDecision: 'pending', unresolvedBlockers: ['technical QA and canonical runtime delegation pending'], voiceHandoffStatus: 'BLOCKED',
    voiceHandoff: {sourceScript: script.relativePath, implementationRef: 'video-factory/animation/src/GenericPipeline.tsx', technicalPreviewLocation: `generated/previews/${job.contentId}-animation.mp4`, totalDurationSeconds: totalSeconds, hardMaximumSecondsExclusive: 60, sceneSlots: scenes.map((scene, index) => ({sceneId: scene.id, startSeconds: scene.startSeconds, endSeconds: scene.endSeconds, spokenCopy: productionCopy[index], pauseWindows: []})), pronunciationSensitiveText: [], proofCaveatTiming: [], audioGenerated: false},
  };
  const qa = runTechnicalQa(draft, false);
  if (!qa.pass) throw Object.assign(new Error(`Canonical Animation hard gate blocked:\n${qa.errors.join('\n')}`), {code: 'ANIMATION_HARD_GATE_BLOCKED'});
  requireEqual(visual.fields.runtime_delegation_by, 'chatgpt-work', 'Canonical runtime delegation provenance is missing');
  if (!visual.fields.runtime_delegation_at || !Number.isFinite(Date.parse(String(visual.fields.runtime_delegation_at)))) throw Object.assign(new Error('Canonical runtime_delegation_at is invalid'), {code: 'CANONICAL_CHAIN_BLOCKED'});
  if (typeof visual.fields.runtime_delegation_basis !== 'string' || !visual.fields.runtime_delegation_basis.trim()) throw Object.assign(new Error('Canonical runtime_delegation_basis is missing'), {code: 'CANONICAL_CHAIN_BLOCKED'});
  requireEqual(visual.fields.runtime_delegation_scope, 'STEP05,STEP06,STEP07', 'Canonical runtime delegation scope must be exactly STEP05,STEP06,STEP07');
  requireSha(visual.fields.runtime_delegation_content_approval_fingerprint_sha256, contentApprovalFingerprint(script.markdown), 'Canonical runtime delegation is stale against Content Approval');
  const upstream = verifyCanonicalUpstream(draft, 'production');
  if (!upstream.pass) throw Object.assign(new Error(`Canonical Animation upstream blocked:\n${upstream.errors.join('\n')}`), {code: 'ANIMATION_HARD_GATE_BLOCKED'});
  const manifest: AnimationManifest = {...draft, technicalQa: 'PASS', animationReview: 'pass', humanDecision: 'approved', unresolvedBlockers: []};
  manifest.voiceHandoffStatus = isVoiceHandoffReady(manifest, upstream) ? 'READY' : 'BLOCKED';
  if (manifest.voiceHandoffStatus !== 'READY') throw Object.assign(new Error('Canonical Animation READY conjunction did not derive READY'), {code: 'ANIMATION_HARD_GATE_BLOCKED'});
  return {manifest, canonical: {script, storyboard, visual}, runtimeDelegation: {by: visual.fields.runtime_delegation_by, at: visual.fields.runtime_delegation_at, basis: visual.fields.runtime_delegation_basis, scope: visual.fields.runtime_delegation_scope}};
};
