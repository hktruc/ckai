import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import type {ProofClass, SceneArtDirection} from './grammar';

export type HybridVisualSourceChoice = 'CODE_NATIVE' | 'REAL_EVIDENCE' | 'GENERATED_KEY_VISUAL' | 'CURATED_OR_GENERATED_KEY_VISUAL';
export type VisualAssetSourceType = 'GENERATED' | 'LICENSED' | 'PRODUCT_OWNER_SUPPLIED' | 'REAL_CAPTURE';

export type ProductionVisualAsset = {
  assetId: string;
  contentId: string;
  sceneId: string;
  sourceType: VisualAssetSourceType;
  source: string;
  provenance: string;
  sha256: string;
  rightsStatus: 'APPROVED_INTERNAL' | 'LICENSED' | 'PRODUCT_OWNER_APPROVED';
  truthStatus: 'ACTUAL_EVIDENCE' | 'ILLUSTRATIVE' | 'GENERATED_CONCEPT';
  evidence?: false;
  productionApproval: {status: 'APPROVED'; by: 'product-owner' | 'canonical-content-approval'; at: string; basis: string};
  cropMetadata: {mobileSafe: boolean; safeRegion: string; focalRegion: string};
  safeAnimationMetadata: {allowed: string[]; prohibited: string[]; maximumScale: number};
};

export type KeyVisualBrief = {
  contentId: string;
  sceneId: string;
  semanticObjective: string;
  emotionalObjective: string;
  keyVisualIdea: string;
  metaphor: string;
  subject: string;
  environment: string;
  visualTension: string;
  composition: string;
  cameraFraming: string;
  lighting: string;
  depthMateriality: string;
  negativeSpace: string;
  colorTreatment: string;
  typographyRelationship: string;
  cropSafeRegions: string;
  animationOpportunities: string[];
  truthStatus: 'CONCEPTUAL' | 'ILLUSTRATIVE';
  forbiddenCliches: string[];
};

export type HybridVisualSourcePlan = {
  choice: HybridVisualSourceChoice;
  rationale: string;
  assetContractPath?: string;
  asset?: ProductionVisualAsset;
  keyVisualBriefPath?: string;
  keyVisualBrief?: KeyVisualBrief;
  creativeLimitation?: 'KEY_VISUAL_ASSET_REQUIRED';
};

export type HybridQaCode = 'CREATIVE_WEAK_SOURCE_CHOICE' | 'LITERAL_METAPHOR_CLICHE' | 'REAL_EVIDENCE_IGNORED' | 'UNAPPROVED_VISUAL_ASSET' | 'UNSAFE_CROP' | 'GENERATED_VISUAL_AS_PROOF' | 'KEY_VISUAL_ASSET_REQUIRED';
export type HybridQaFinding = {code: HybridQaCode; severity: 'BLOCKER' | 'LIMITATION'; message: string};

const literalObjects = new Set(['lens', 'balance', 'layers', 'fracture', 'domino-chain']);
const sha256 = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex').toUpperCase();
const nonEmpty = (value: unknown): boolean => typeof value === 'string' && value.trim().length > 0;

export const readAssetContract = (workspace: string, path: string): ProductionVisualAsset => JSON.parse(readFileSync(resolve(workspace, path), 'utf8')) as ProductionVisualAsset;
export const readKeyVisualBrief = (workspace: string, path: string): KeyVisualBrief => JSON.parse(readFileSync(resolve(workspace, path), 'utf8')) as KeyVisualBrief;

export const validateProductionVisualAsset = (asset: ProductionVisualAsset, workspace: string, contentId: string, sceneId: string): HybridQaFinding[] => {
  const findings: HybridQaFinding[] = [];
  if (asset.contentId !== contentId || asset.sceneId !== sceneId || !nonEmpty(asset.assetId) || !nonEmpty(asset.provenance)) findings.push({code: 'UNAPPROVED_VISUAL_ASSET', severity: 'BLOCKER', message: 'Visual asset identity/provenance does not match its canonical scene.'});
  const source = resolve(workspace, asset.source);
  if (!existsSync(source) || !/^[A-F0-9]{64}$/.test(asset.sha256) || (existsSync(source) && sha256(readFileSync(source)) !== asset.sha256)) findings.push({code: 'UNAPPROVED_VISUAL_ASSET', severity: 'BLOCKER', message: 'Visual asset source is missing or its SHA-256 is stale.'});
  if (asset.productionApproval?.status !== 'APPROVED' || !nonEmpty(asset.productionApproval.basis) || !Number.isFinite(Date.parse(asset.productionApproval.at)) || !['APPROVED_INTERNAL', 'LICENSED', 'PRODUCT_OWNER_APPROVED'].includes(asset.rightsStatus)) findings.push({code: 'UNAPPROVED_VISUAL_ASSET', severity: 'BLOCKER', message: 'Visual asset lacks traceable production approval or rights status.'});
  if (!asset.cropMetadata?.mobileSafe || !nonEmpty(asset.cropMetadata.safeRegion) || !nonEmpty(asset.cropMetadata.focalRegion) || !(asset.safeAnimationMetadata?.maximumScale >= 1 && asset.safeAnimationMetadata.maximumScale <= 1.25)) findings.push({code: 'UNSAFE_CROP', severity: 'BLOCKER', message: 'Visual asset lacks a mobile-safe crop and conservative animation boundary.'});
  return findings;
};

export const validateKeyVisualBrief = (brief: KeyVisualBrief, contentId: string, sceneId: string): HybridQaFinding[] => {
  const required = [brief.semanticObjective, brief.emotionalObjective, brief.keyVisualIdea, brief.subject, brief.environment, brief.visualTension, brief.composition, brief.cameraFraming, brief.lighting, brief.depthMateriality, brief.negativeSpace, brief.colorTreatment, brief.typographyRelationship, brief.cropSafeRegions];
  return brief.contentId === contentId && brief.sceneId === sceneId && required.every(nonEmpty) && brief.forbiddenCliches.length > 0
    ? []
    : [{code: 'CREATIVE_WEAK_SOURCE_CHOICE', severity: 'BLOCKER', message: 'Provider-agnostic Key Visual Brief is incomplete or bound to the wrong scene.'}];
};

export const evaluateHybridSource = (input: {contentId: string; sceneId: string; direction: SceneArtDirection; proofClass: ProofClass; plan: HybridVisualSourcePlan; workspace: string}): HybridQaFinding[] => {
  const {contentId, sceneId, direction, proofClass, plan, workspace} = input;
  const findings: HybridQaFinding[] = [];
  if (!nonEmpty(plan.rationale)) findings.push({code: 'CREATIVE_WEAK_SOURCE_CHOICE', severity: 'BLOCKER', message: 'Hybrid source choice requires a scene-specific rationale.'});
  if (plan.choice === 'CODE_NATIVE' && direction.visualMode === 'object-metaphor-cinematic' && direction.semanticObject !== 'none') findings.push({code: 'CREATIVE_WEAK_SOURCE_CHOICE', severity: 'LIMITATION', message: 'Code-native object metaphor is retained only as an honest limited fallback, not artwork-grade imagery.'});
  if (literalObjects.has(direction.semanticObject) && !/context|because|relationship|ngưỡng|dữ kiện|kết luận|causal|specific|semantic|trạng thái|kiểm chứng/i.test(direction.objectRationale)) findings.push({code: 'LITERAL_METAPHOR_CLICHE', severity: 'BLOCKER', message: 'Literal dictionary metaphor lacks a contextual second-order rationale.'});
  if (plan.choice === 'REAL_EVIDENCE') {
    if (!plan.asset) findings.push({code: 'REAL_EVIDENCE_IGNORED', severity: 'BLOCKER', message: 'REAL_EVIDENCE requires a canonical asset contract.'});
    else findings.push(...validateProductionVisualAsset(plan.asset, workspace, contentId, sceneId));
  }
  if (plan.asset?.sourceType === 'GENERATED' && (plan.asset.evidence !== false || proofClass === 'actual-proof' || proofClass === 'visual-representation' || plan.asset.truthStatus === 'ACTUAL_EVIDENCE')) findings.push({code: 'GENERATED_VISUAL_AS_PROOF', severity: 'BLOCKER', message: 'Generated imagery must declare evidence=false and cannot confer proof authority.'});
  if (plan.choice === 'CURATED_OR_GENERATED_KEY_VISUAL' || plan.choice === 'GENERATED_KEY_VISUAL') {
    if (!plan.keyVisualBrief) findings.push({code: 'CREATIVE_WEAK_SOURCE_CHOICE', severity: 'BLOCKER', message: 'Rich key-visual source choice requires a provider-agnostic Key Visual Brief.'});
    else findings.push(...validateKeyVisualBrief(plan.keyVisualBrief, contentId, sceneId));
    if (!plan.asset) findings.push({code: 'KEY_VISUAL_ASSET_REQUIRED', severity: 'LIMITATION', message: 'The richer key visual is not available; retain only an explicitly limited existing-source preview.'});
  }
  return findings;
};
