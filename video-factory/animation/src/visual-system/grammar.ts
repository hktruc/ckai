import type {VisualPreset} from './preset';
import {getArtDirectionPolicy, inferSemanticArchetype, inferSemanticObject, type PacingIntent, type SemanticArchetype, type SemanticObjectId, type VisualMode} from './art-direction';
import {evaluateArtQuality} from './art-quality';

export type SemanticVisualObjective = 'comparison' | 'process' | 'abstract-concept' | 'proof' | 'key-insight' | 'tension' | 'conclusion';
export type CompositionPattern = 'split-contrast' | 'progression-flow' | 'symbolic-focus' | 'evidence-forward' | 'focus-reveal' | 'asymmetric-tension' | 'distilled-statement';
export type ProofClass = 'actual-proof' | 'visual-representation' | 'illustrative-mockup' | 'conceptual-metaphor' | 'none';
export type KineticRole = 'keyword' | 'number' | 'contrast' | 'before-after' | 'short-conclusion' | 'key-claim' | 'reveal-phrase';
export type VisualArchetype = 'typography-hero' | 'object-metaphor' | 'proof-artifact' | 'comparison-transformation' | 'conclusion-payoff';
export type LightingStrategy = 'directional-edge' | 'backlight' | 'localized-glow' | 'dark-to-light' | 'shadow-separation' | 'restrained-ambient';
export type DepthStrategy = 'foreground-background' | 'occlusion' | 'perspective' | 'atmospheric' | 'shadow-separation' | 'flat-intentional';
export type LinePurpose = 'connect' | 'reveal' | 'separate' | 'directional-tension' | 'none';
export type SourceStrategy = 'typography-only' | 'procedural-semantic-object' | 'canonical-evidence-representation' | 'approved-local-asset';
export type ProofPresentation = {classification: ProofClass; truthLabel: string; provenance: string; evidenceAssetAvailable: boolean};
export type SceneArtDirection = {
  objective: SemanticVisualObjective; pattern: CompositionPattern; primaryFocus: string; supportingElements: string[];
  hierarchy: string; emotionalTone: string; continuity: string; occupiedRatio?: number; strongAttractors: number;
  archetype: VisualArchetype; primaryVisualConcept: string; primaryVisualObject: string; visualMetaphor: string;
  compositionStrategy: string; lightingStrategy: LightingStrategy; depthStrategy: DepthStrategy; linePurpose: LinePurpose;
  semanticArchetype: SemanticArchetype; visualMode: VisualMode; semanticObject: SemanticObjectId; objectRationale: string;
  centralTension: string; typographyStrategy: string; pacingIntent: PacingIntent; proofPolicy: string;
  negativeSpaceRole: string; eyePath: string; accentRationale: string;
  sourceStrategy: SourceStrategy; forbiddenFallbackAnatomy: string;
  kineticRole?: KineticRole; emphasisText?: string; proof: ProofPresentation;
};

export const SEMANTIC_COMPOSITION: Readonly<Record<SemanticVisualObjective, CompositionPattern>> = Object.freeze({
  comparison: 'split-contrast', process: 'progression-flow', 'abstract-concept': 'symbolic-focus', proof: 'evidence-forward',
  'key-insight': 'focus-reveal', tension: 'asymmetric-tension', conclusion: 'distilled-statement',
});

export const SEMANTIC_ARCHETYPE: Readonly<Record<SemanticVisualObjective, VisualArchetype>> = Object.freeze({
  comparison: 'comparison-transformation', process: 'comparison-transformation', 'abstract-concept': 'object-metaphor', proof: 'proof-artifact',
  'key-insight': 'typography-hero', tension: 'object-metaphor', conclusion: 'conclusion-payoff',
});

export const inferSemanticObjective = (value: string): SemanticVisualObjective => {
  const text = value.toLocaleLowerCase('vi');
  if (/proof|evidence|bằng chứng|kiểm chứng|kết quả|result|audit|direct test/.test(text)) return 'proof';
  if (/so sánh|comparison|before|after|trước|sau|đối lập|khác biệt|phân tách|phân biệt|nhân quả/.test(text)) return 'comparison';
  if (/quy trình|process|tiến trình|bước|flow|progress|chuỗi|hệ bốn/.test(text)) return 'process';
  if (/căng|tension|mất cân bằng|xung đột|nghịch lý|chưa đủ|giả thuyết/.test(text)) return 'tension';
  if (/kết luận|conclusion|chốt|cta|hành động|nguyên tắc cuối/.test(text)) return 'conclusion';
  if (/insight|trọng tâm|reveal|nhận ra|mấu chốt|ý chính/.test(text)) return 'key-insight';
  return 'abstract-concept';
};

export const proofClassFromText = (value: string): ProofClass => {
  const normalized = value.toLocaleLowerCase('en');
  return (['actual-proof', 'visual-representation', 'illustrative-mockup', 'conceptual-metaphor'] as const).find((item) => normalized.includes(item)) ?? 'none';
};

export const validateProofPresentation = (proof: ProofPresentation): string[] => {
  const errors: string[] = [];
  if (proof.classification === 'none') return errors;
  if (!proof.truthLabel.trim()) errors.push('Proof presentation requires a visible truth label');
  if (!proof.provenance.trim()) errors.push('Proof presentation requires traceable provenance');
  if (proof.classification === 'actual-proof' && !proof.evidenceAssetAvailable) errors.push('Actual proof requires an available evidence asset');
  if (proof.classification === 'illustrative-mockup' && /actual|verified|direct proof/i.test(proof.truthLabel)) errors.push('Illustrative mockup cannot be labelled as actual proof');
  if (proof.classification === 'conceptual-metaphor' && /evidence|proof|verified/i.test(proof.truthLabel)) errors.push('Conceptual metaphor cannot claim evidentiary authority');
  return errors;
};

export const validateSceneArtDirection = (scene: SceneArtDirection, preset: VisualPreset): string[] => {
  const errors = validateProofPresentation(scene.proof);
  if (scene.pattern !== SEMANTIC_COMPOSITION[scene.objective]) errors.push('Composition pattern does not match semantic objective');
  if (!scene.primaryFocus.trim()) errors.push('Scene requires one primary visual focus');
  if (!scene.primaryVisualConcept.trim()) errors.push('Scene requires a primary visual concept');
  if (!scene.primaryVisualObject.trim()) errors.push('Scene requires a primary visual object');
  if (!scene.compositionStrategy.trim()) errors.push('Scene requires a composition strategy');
  if (!scene.sourceStrategy.trim()) errors.push('Scene requires a source strategy');
  if (!scene.forbiddenFallbackAnatomy.trim()) errors.push('Scene requires explicit forbidden fallback anatomy');
  const policy = getArtDirectionPolicy(scene.semanticArchetype);
  if (!policy.objectPolicy.allowed.includes(scene.semanticObject)) errors.push(`Semantic object ${scene.semanticObject} is not allowed for ${scene.semanticArchetype}`);
  if (scene.semanticObject !== 'none' && scene.objectRationale.trim().length < 24) errors.push('Semantic object requires a specific why-this-object rationale');
  if (scene.emphasisText && scene.accentRationale.trim().length < 8) errors.push('Semantic accent requires a rationale');
  if (scene.strongAttractors < 1 || scene.strongAttractors > preset.density.maximumStrongAttractors) errors.push('Scene must have only one or two strong attractors');
  if (scene.archetype === 'proof-artifact' && scene.proof.classification === 'none') errors.push('Proof archetype requires an honest proof classification');
  if (scene.emphasisText && !scene.primaryFocus.includes(scene.emphasisText)) errors.push('Kinetic emphasis must preserve text within the primary focus');
  if (scene.emphasisText) try { planKineticTypography(scene.primaryFocus, scene.kineticRole, scene.emphasisText); } catch (error) { errors.push((error as Error).message); }
  errors.push(...evaluateArtQuality(scene).critique);
  return errors;
};

export const planKineticTypography = (exactText: string, role?: KineticRole, emphasisText?: string) => {
  if (!role || !emphasisText) return {mode: 'caption-independent' as const, exactText, emphasizedRanges: [] as Array<{start: number; end: number}>};
  const first = exactText.indexOf(emphasisText);
  if (first < 0) throw new Error('Kinetic emphasis text must be an exact substring');
  if (exactText.indexOf(emphasisText, first + emphasisText.length) >= 0) throw new Error('Kinetic emphasis must identify one unambiguous phrase');
  const wordCount = exactText.trim().split(/\s+/u).length;
  const emphasisWords = emphasisText.trim().split(/\s+/u).length;
  if (wordCount > 3 && emphasisWords / wordCount > 0.5) throw new Error('Kinetic emphasis cannot animate most words');
  return {mode: 'expressive-kinetic' as const, exactText, role, emphasizedRanges: [{start: first, end: first + emphasisText.length}]};
};

type SceneDirectionInput = Omit<SceneArtDirection, 'objective' | 'pattern' | 'archetype' | 'primaryVisualConcept' | 'primaryVisualObject' | 'visualMetaphor' | 'compositionStrategy' | 'lightingStrategy' | 'depthStrategy' | 'linePurpose' | 'semanticArchetype' | 'visualMode' | 'semanticObject' | 'objectRationale' | 'centralTension' | 'typographyStrategy' | 'pacingIntent' | 'proofPolicy' | 'negativeSpaceRole' | 'eyePath' | 'accentRationale' | 'sourceStrategy' | 'forbiddenFallbackAnatomy'> &
  Partial<Pick<SceneArtDirection, 'archetype' | 'primaryVisualConcept' | 'primaryVisualObject' | 'visualMetaphor' | 'compositionStrategy' | 'lightingStrategy' | 'depthStrategy' | 'linePurpose' | 'semanticArchetype' | 'visualMode' | 'semanticObject' | 'objectRationale' | 'centralTension' | 'typographyStrategy' | 'pacingIntent' | 'proofPolicy' | 'negativeSpaceRole' | 'eyePath' | 'accentRationale' | 'sourceStrategy' | 'forbiddenFallbackAnatomy'>> & {semanticFunction: string};

export const createSceneArtDirection = (input: SceneDirectionInput): SceneArtDirection => {
  const objective = inferSemanticObjective(input.semanticFunction);
  const semanticArchetype = input.semanticArchetype ?? inferSemanticArchetype(input.semanticFunction);
  const policy = getArtDirectionPolicy(semanticArchetype);
  const objectRationale = input.objectRationale ?? input.visualMetaphor ?? '';
  const inferredObject = inferSemanticObject(`${input.primaryVisualObject ?? ''} ${input.visualMetaphor ?? ''}`);
  const semanticObject = input.semanticObject ?? (inferredObject !== 'none' ? inferredObject : policy.visualMode === 'proof-evidence-presentation' ? policy.objectPolicy.recommended : objectRationale.trim().length >= 24 ? policy.objectPolicy.recommended : 'none');
  const visualMode = input.visualMode ?? (policy.visualMode === 'object-metaphor-cinematic' && semanticObject === 'none' ? 'typographic-editorial' : policy.visualMode);
  const modeArchetype: Record<VisualMode, VisualArchetype> = {'typographic-editorial': semanticArchetype === 'conclusion-distillation' ? 'conclusion-payoff' : 'typography-hero', 'object-metaphor-cinematic': 'object-metaphor', 'proof-evidence-presentation': 'proof-artifact', 'transformation-comparison': 'comparison-transformation'};
  const archetype = input.archetype ?? modeArchetype[visualMode];
  const defaults: Record<VisualArchetype, Pick<SceneArtDirection, 'primaryVisualObject' | 'compositionStrategy' | 'lightingStrategy' | 'depthStrategy' | 'linePurpose'>> = {
    'typography-hero': {primaryVisualObject: 'editorial typography', compositionStrategy: 'asymmetric editorial scale with intentional counter-space', lightingStrategy: 'restrained-ambient', depthStrategy: 'flat-intentional', linePurpose: 'none'},
    'object-metaphor': {primaryVisualObject: 'semantic dimensional object', compositionStrategy: 'object-led field with text in a supporting role', lightingStrategy: 'directional-edge', depthStrategy: 'foreground-background', linePurpose: 'none'},
    'proof-artifact': {primaryVisualObject: 'traceable evidence artifact', compositionStrategy: 'evidence-first input, transformation and output relationship', lightingStrategy: 'localized-glow', depthStrategy: 'shadow-separation', linePurpose: 'connect'},
    'comparison-transformation': {primaryVisualObject: 'before and after states', compositionStrategy: 'vertical transformation with distinct states', lightingStrategy: 'dark-to-light', depthStrategy: 'perspective', linePurpose: 'connect'},
    'conclusion-payoff': {primaryVisualObject: 'resolved statement and light aperture', compositionStrategy: 'distilled full-frame payoff', lightingStrategy: 'backlight', depthStrategy: 'atmospheric', linePurpose: 'reveal'},
  };
  return {...input, ...defaults[archetype], ...input, objective, pattern: SEMANTIC_COMPOSITION[objective], archetype,
    semanticArchetype, visualMode, semanticObject,
    primaryVisualConcept: input.primaryVisualConcept ?? input.primaryFocus,
    visualMetaphor: input.visualMetaphor ?? (archetype === 'object-metaphor' ? input.primaryFocus : ''),
    primaryVisualObject: input.primaryVisualObject ?? (semanticObject === 'none' ? 'editorial typography' : `${semanticObject} semantic object`),
    objectRationale: semanticObject === 'none' ? 'No object: typography carries the central idea more honestly.' : objectRationale || 'A traceable source artifact carries the evidence relationship without decorative substitution.',
    compositionStrategy: input.compositionStrategy ?? policy.compositionalTendencies.join('; '),
    lightingStrategy: input.lightingStrategy ?? policy.lightingStrategy,
    depthStrategy: input.depthStrategy ?? policy.depthStrategy,
    linePurpose: input.linePurpose ?? policy.linePurpose,
    centralTension: input.centralTension ?? input.emotionalTone,
    typographyStrategy: input.typographyStrategy ?? policy.typographyStrategy,
    pacingIntent: input.pacingIntent ?? policy.pacingIntent,
    proofPolicy: input.proofPolicy ?? policy.proofPolicy,
    negativeSpaceRole: input.negativeSpaceRole ?? policy.negativeSpaceRole,
    eyePath: input.eyePath ?? policy.eyePath,
    accentRationale: input.accentRationale ?? (input.emphasisText ? 'Accent isolates the exact semantic emphasis phrase.' : 'none'),
    sourceStrategy: input.sourceStrategy ?? (visualMode === 'proof-evidence-presentation' ? 'canonical-evidence-representation' : semanticObject === 'none' ? 'typography-only' : 'procedural-semantic-object'),
    forbiddenFallbackAnatomy: input.forbiddenFallbackAnatomy ?? 'text wall; generic shape; generic card; generic geometry; default typography block',
  };
};

export const validateDisplayCopy = (displayCopy: string | undefined, spokenCopy: string, direction: SceneArtDirection): string[] => {
  const errors: string[] = [];
  const copy = displayCopy?.trim() ?? '';
  if (!copy) return ['displayCopy is required for production'];
  const lines = copy.split(/\r?\n/).filter((line) => line.trim());
  const words = copy.split(/\s+/u).filter(Boolean);
  const maximumWords = direction.visualMode === 'proof-evidence-presentation' ? 24 : direction.visualMode === 'typographic-editorial' ? 16 : 14;
  if (words.length > maximumWords) errors.push(`displayCopy exceeds ${maximumWords} words for ${direction.visualMode}`);
  if (lines.length > 4) errors.push('displayCopy exceeds four intentional lines');
  if (lines.some((line) => line.trim().length > 34)) errors.push('displayCopy contains a line longer than 34 characters');
  const normalize = (value: string) => value.toLocaleLowerCase('vi').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
  if (words.length > 12 && normalize(copy) === normalize(spokenCopy)) errors.push('Spoken Copy was dumped into displayCopy');
  return errors;
};
