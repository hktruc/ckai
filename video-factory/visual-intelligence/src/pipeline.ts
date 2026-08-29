import {copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import {dirname, relative, resolve} from 'node:path';
import type {AnimationManifest} from '../../animation/src/model';
import type {ProductionVisualAsset} from '../../animation/src/visual-system/hybrid-source';
import {GenerationBudget, type VisualIntelligenceConfig} from './config';
import type {GeneratedAssetMetadata, KeyVisualBriefV1, SemanticVisionQa, VisualIntelligenceArtifact} from './model';
import {createKeyVisualBrief, planRetention, planRetentionExecution, planSceneSemantics, planSemanticMechanisms, routeVisualSources, validateSourceDecision} from './planning';
import {validateRetentionExecution,validateSemanticMechanism} from '../../animation/src/retention-execution';
import {compileImagePrompt, generateImageBinary, sha256, visionQaActualBinary, type OpenAiLike} from './openai-service';
import {enforceVisionHardGates, evaluateRetentionPlan, retryInstruction} from './qa';

const rel = (root: string, path: string) => relative(root, path).replaceAll('\\', '/');
const atomicJson = (path: string, value: unknown) => {
  mkdirSync(dirname(path), {recursive: true});
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  renameSync(temporary, path);
};

export type VisualIntelligenceRunOptions = {
  repoRoot: string;
  manifest: AnimationManifest;
  config: VisualIntelligenceConfig;
  client?: OpenAiLike;
  allowImageGeneration: boolean;
  now?: () => Date;
};

const generatedContract = (metadata: GeneratedAssetMetadata): ProductionVisualAsset => ({
  assetId: metadata.asset_id,
  contentId: metadata.content_id,
  sceneId: metadata.scene_id,
  sourceType: 'GENERATED',
  source: metadata.source_path,
  provenance: `OpenAI ${metadata.model}; brief ${metadata.brief_version}; prompt ${metadata.prompt_version}; asset metadata ${metadata.sha256}`,
  sha256: metadata.sha256,
  rightsStatus: 'APPROVED_INTERNAL',
  truthStatus: 'GENERATED_CONCEPT',
  evidence: false,
  productionApproval: {status: 'APPROVED', by: 'canonical-content-approval', at: metadata.created_at, basis: 'Generated only from an already-approved, non-evidentiary semantic Key Visual Brief.'},
  cropMetadata: {mobileSafe: true, safeRegion: 'central 70% width and 68% height', focalRegion: 'single focal subject specified by approved brief'},
  safeAnimationMetadata: {allowed: ['push-in', 'parallax', 'mask-reveal', 'detail-crop'], prohibited: ['claim rewrite', 'evidence relabel', 'crop away focal subject'], maximumScale: 1.12},
});

const reuseAcceptedAsset = (input: {brief: KeyVisualBriefV1; repoRoot: string; contentId: string; config: VisualIntelligenceConfig}): GeneratedAssetMetadata | null => {
  const {brief, repoRoot, contentId, config} = input;
  const sceneDir = resolve(repoRoot, 'generated', 'visual-assets', contentId, brief.scene_id);
  const metadataPath = resolve(sceneDir, 'kv_001.json');
  const binaryPath = resolve(sceneDir, 'kv_001.png');
  if (!existsSync(metadataPath) || !existsSync(binaryPath)) return null;
  try {
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf8')) as GeneratedAssetMetadata;
    const binary = readFileSync(binaryPath);
    const valid = metadata.content_id === contentId
      && metadata.scene_id === brief.scene_id
      && metadata.asset_type === 'GENERATED_KEY_VISUAL'
      && metadata.provider === 'openai'
      && metadata.model === config.imageModel
      && metadata.brief_version === 'CKAI_KEY_VISUAL_BRIEF_V1'
      && metadata.evidence === false
      && metadata.qa_status === 'PASS'
      && metadata.semantic_qa?.verdict === 'PASS'
      && metadata.brief_sha256 === sha256(JSON.stringify(brief))
      && metadata.sha256 === sha256(binary);
    return valid ? {...metadata, source_path: rel(repoRoot, binaryPath)} : null;
  } catch {
    return null;
  }
};

const generateAcceptedAsset = async (input: {client: OpenAiLike; config: VisualIntelligenceConfig; budget: GenerationBudget; brief: KeyVisualBriefV1; repoRoot: string; contentId: string; now: () => Date}) => {
  const {client, config, budget, brief, repoRoot, contentId, now} = input;
  const sceneDir = resolve(repoRoot, 'generated', 'visual-assets', contentId, brief.scene_id);
  mkdirSync(sceneDir, {recursive: true});
  let revision: string | undefined;
  let lastQa: SemanticVisionQa | undefined;
  for (let attempt = 1; attempt <= config.maxGenerationAttemptsPerAsset; attempt += 1) {
    budget.beforeCall(attempt);
    const prompt = compileImagePrompt(brief, revision);
    const generated = await generateImageBinary(client, config.imageModel, prompt);
    const attemptPath = resolve(sceneDir, `kv_001_attempt_${attempt}.png`);
    writeFileSync(attemptPath, generated.binary);
    const vision = await visionQaActualBinary(client, config.visionModel, generated.binary, 'image/png', brief, 'ASSET');
    const qa = enforceVisionHardGates(vision.qa, config);
    lastQa = qa;
    const metadata: GeneratedAssetMetadata = {
      asset_id: `KV_${brief.scene_id.replace('-', '')}_001`, content_id: contentId, scene_id: brief.scene_id, asset_type: 'GENERATED_KEY_VISUAL', provider: 'openai', model: config.imageModel,
      created_at: generated.createdAt || now().toISOString(), brief_version: 'CKAI_KEY_VISUAL_BRIEF_V1', prompt_version: `CKAI_IMAGE_PROMPT_V1_ATTEMPT_${attempt}`,
      sha256: sha256(generated.binary), attempt, usage: {image: generated.usage, vision: vision.usage, vision_response_id: vision.responseId}, estimated_cost_usd: null,
      semantic_qa: qa, retention_qa: {motion_headroom: brief.motion_headroom, visual_magnetism: brief.visual_magnetism}, qa_status: qa.verdict, evidence: false,
      source_path: rel(repoRoot, attemptPath), generation_prompt_sha256: sha256(prompt), brief_sha256:sha256(JSON.stringify(brief)),
    };
    atomicJson(resolve(sceneDir, `kv_001_attempt_${attempt}.json`), metadata);
    if (qa.verdict === 'PASS') {
      const finalPath = resolve(sceneDir, 'kv_001.png'); const finalMetadataPath = resolve(sceneDir, 'kv_001.json');
      copyFileSync(attemptPath, finalPath);
      const accepted = {...metadata, source_path: rel(repoRoot, finalPath)};
      atomicJson(finalMetadataPath, accepted);
      budget.recordAccepted(accepted.estimated_cost_usd);
      return accepted;
    }
    if (qa.verdict === 'REJECT') break;
    revision = retryInstruction(qa);
  }
  throw Object.assign(new Error(`Generated key visual did not pass after bounded QA: ${lastQa?.failure_reasons.join('; ') || 'unknown failure'}`), {code: lastQa?.failure_class || 'SEMANTIC_ASSET_MISMATCH', qa: lastQa});
};

export const prepareVisualIntelligence = async (options: VisualIntelligenceRunOptions) => {
  const {repoRoot, manifest, config, client, allowImageGeneration} = options;
  const now = options.now || (() => new Date());
  const contentId = manifest.id.replace(/-Animation$/u, '');
  const semantics = planSceneSemantics(manifest);
  const retention = planRetention(semantics);
  const retentionQa = evaluateRetentionPlan(retention);
  const routes = routeVisualSources(manifest, semantics);
  const routeErrors = routes.flatMap(validateSourceDecision);
  if (routeErrors.length) throw Object.assign(new Error(routeErrors.join('\n')), {code: 'WRONG_VISUAL_SOURCE'});
  const briefs = routes.filter((route) => route.visual_source === 'GENERATED_KEY_VISUAL').map((route) => createKeyVisualBrief(semantics.find((item) => item.scene_id === route.scene_id)!, manifest.scenes.find((item) => item.id === route.scene_id)!));
  const mechanisms=planSemanticMechanisms(manifest,semantics,routes);const execution=planRetentionExecution(manifest,semantics,mechanisms);
  manifest.scenes.forEach((scene)=>{scene.semanticMechanism=mechanisms.find((item)=>item.scene_id===scene.id);scene.retentionExecution=execution.find((item)=>item.scene_id===scene.id);});
  const executionErrors=manifest.scenes.flatMap((scene)=>[...validateRetentionExecution(scene),...validateSemanticMechanism(scene)].map((error)=>`${scene.id}: ${error}`));
  if(executionErrors.length)throw Object.assign(new Error(executionErrors.join('\n')),{code:'RETENTION_PLAN_EXECUTION_MISMATCH'});
  const artifact: VisualIntelligenceArtifact = {version: 1, content_id: contentId, created_at: now().toISOString(), semantic_plan: semantics, retention_plan: retention, retention_execution:execution, semantic_mechanisms:mechanisms, source_routes: routes, key_visual_briefs: briefs, generated_assets: [], machine_acceptance: 'NOT_YET_PASS', human_acceptance: 'PENDING'};
  const outputDir = resolve(repoRoot, 'generated', 'production', contentId, 'visual-intelligence');
  atomicJson(resolve(outputDir, 'semantic-plan.json'), semantics);
  atomicJson(resolve(outputDir, 'retention-plan.json'), {...retention, qa: retentionQa});
  atomicJson(resolve(outputDir, 'retention-execution.json'), execution);
  atomicJson(resolve(outputDir, 'semantic-mechanisms.json'), mechanisms);
  atomicJson(resolve(outputDir, 'source-routing.json'), routes);
  atomicJson(resolve(outputDir, 'key-visual-briefs.json'), briefs);
  if (retentionQa.verdict !== 'PASS') { atomicJson(resolve(outputDir, 'visual-intelligence.json'), artifact); throw Object.assign(new Error(retentionQa.reasons.join('\n')), {code: 'RETENTION_DEAD_ZONE'}); }
  if (briefs.length && !allowImageGeneration) { atomicJson(resolve(outputDir, 'visual-intelligence.json'), artifact); throw Object.assign(new Error('Generated key visual is opt-in and the job does not authorize OpenAI image generation.'), {code: 'OPENAI_IMAGE_GENERATION_NOT_AUTHORIZED'}); }
  if (briefs.length && !client) throw Object.assign(new Error('OpenAI client is required for an authorized generated visual route.'), {code: 'OPENAI_CLIENT_REQUIRED'});
  const budget = new GenerationBudget(config);
  for (const brief of briefs) {
    const cached = reuseAcceptedAsset({brief, repoRoot, contentId, config});
    const metadata = cached ?? await generateAcceptedAsset({client: client!, config, budget, brief, repoRoot, contentId, now});
    if (cached) budget.recordAccepted(cached.estimated_cost_usd);
    artifact.generated_assets.push(metadata);
    const scene = manifest.scenes.find((item) => item.id === brief.scene_id)!;
    scene.hybridSource = {...scene.hybridSource!, choice: 'GENERATED_KEY_VISUAL', asset: generatedContract(metadata), creativeLimitation: undefined};
  }
  artifact.machine_acceptance = 'PASS';
  atomicJson(resolve(outputDir, 'budget.json'), budget.snapshot());
  atomicJson(resolve(outputDir, 'visual-intelligence.json'), artifact);
  return {artifact, outputDir, manifest};
};

export const qaComposedFrame = async (input: {client: OpenAiLike; config: VisualIntelligenceConfig; framePath: string; brief: KeyVisualBriefV1; outputPath: string}) => {
  const binary = readFileSync(input.framePath);
  const vision = await visionQaActualBinary(input.client, input.config.visionModel, binary, input.framePath.toLowerCase().endsWith('.jpg') ? 'image/jpeg' : 'image/png', input.brief, 'COMPOSED_FRAME');
  const qa = enforceVisionHardGates(vision.qa, input.config);
  const result = {...qa, actual_binary_path: input.framePath, actual_binary_sha256: sha256(binary), brief_sha256:sha256(JSON.stringify(input.brief)),usage: vision.usage};
  atomicJson(input.outputPath, result);
  return result;
};
