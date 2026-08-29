import type {SceneArtDirection} from './grammar';
import {getArtDirectionPolicy} from './art-direction';

export type ArtQualityCheckId = 'not-template' | 'semantic-object-fit' | 'poster-strength' | 'mobile-stop-power' | 'hierarchy-clarity' | 'aesthetic-integrity' | 'variation-integrity' | 'proof-honesty' | 'content-genericity' | 'source-strategy-fit' | 'fallback-prohibition';
export type ArtQualityCheck = {id: ArtQualityCheckId; pass: boolean; note: string};
export type ArtQualityResult = {pass: boolean; checks: ArtQualityCheck[]; critique: string[]};

const genericObject = /\b(?:sphere|blob|generic|decorative geometry|abstract glow|floating geometry|semantic dimensional object)\b/i;
const templateAnatomy = /\b(?:rounded card|card\s*(?:→|->|to)\s*arrow|dashboard|ui panel|stacked cards?|box\s*(?:→|->|to)\s*box)\b/i;
const caseSpecificImplementation = /\b(?:exact sentence|fixture-only|hardcoded copy|content-id-specific|test-0002)\b/i;

export const evaluateArtQuality = (scene: SceneArtDirection, previous?: SceneArtDirection): ArtQualityResult => {
  const policy = getArtDirectionPolicy(scene.semanticArchetype);
  const objectUsed = scene.semanticObject !== 'none';
  const proofUsed = scene.proof.classification !== 'none';
  const checks: ArtQualityCheck[] = [
    {id: 'not-template', pass: !templateAnatomy.test(scene.compositionStrategy), note: 'Composition must not resolve to a card/UI/box anatomy.'},
    {id: 'semantic-object-fit', pass: !objectUsed || (!genericObject.test(scene.primaryVisualObject) && scene.objectRationale.trim().length >= 24), note: 'Objects require a specific semantic identity and rationale; otherwise typography leads.'},
    {id: 'poster-strength', pass: scene.primaryVisualConcept.trim().length >= 5 && scene.centralTension.trim().length >= 4 && scene.eyePath.trim().length >= 8, note: 'A standalone frame needs concept, tension and an intentional eye path.'},
    {id: 'mobile-stop-power', pass: scene.primaryFocus.trim().length > 0 && scene.primaryFocus.trim().length <= 260 && scene.strongAttractors <= 2, note: 'One immediate message and no more than two strong attractors.'},
    {id: 'hierarchy-clarity', pass: Boolean(scene.hierarchy.trim() && scene.typographyStrategy.trim() && scene.negativeSpaceRole.trim()), note: 'Hierarchy, type strategy and active negative space must be explicit.'},
    {id: 'aesthetic-integrity', pass: !genericObject.test(scene.primaryVisualObject) && (scene.linePurpose === 'none' || scene.linePurpose === policy.linePurpose), note: 'No generic geometry, purposeless line or decorative-light shortcut.'},
    {id: 'variation-integrity', pass: !previous || previous.visualMode !== scene.visualMode || previous.compositionStrategy !== scene.compositionStrategy || /intentional continuation/i.test(scene.continuity), note: 'Adjacent scenes cannot repeat both mode and anatomy without an explicit continuity reason.'},
    {id: 'proof-honesty', pass: !proofUsed || Boolean(scene.proof.truthLabel.trim() && scene.proof.provenance.trim() && (scene.proof.classification !== 'actual-proof' || scene.proof.evidenceAssetAvailable)), note: 'Evidence authority follows classification, provenance and asset availability.'},
    {id: 'content-genericity', pass: !caseSpecificImplementation.test(`${scene.compositionStrategy} ${scene.objectRationale} ${scene.typographyStrategy}`) && policy.objectPolicy.allowed.includes(scene.semanticObject) && (scene.visualMode === policy.visualMode || (scene.semanticObject === 'none' && scene.visualMode === 'typographic-editorial')), note: 'Rules must resolve from the reusable semantic policy, never a fixture, exact sentence or incompatible mode/object.'},
    {id: 'source-strategy-fit', pass: scene.visualMode === 'proof-evidence-presentation' ? scene.sourceStrategy === 'canonical-evidence-representation' || scene.sourceStrategy === 'approved-local-asset' : scene.semanticObject === 'none' ? scene.sourceStrategy === 'typography-only' : scene.sourceStrategy === 'procedural-semantic-object' || scene.sourceStrategy === 'approved-local-asset', note: 'Source strategy must match proof authority, typography-only intent or the selected semantic object.'},
    {id: 'fallback-prohibition', pass: /text wall/i.test(scene.forbiddenFallbackAnatomy) && /generic (?:shape|card|geometry)/i.test(scene.forbiddenFallbackAnatomy), note: 'Production direction must explicitly forbid weak text-wall and generic fallback anatomy.'},
  ];
  return {pass: checks.every((check) => check.pass), checks, critique: checks.filter((check) => !check.pass).map((check) => `${check.id}: ${check.note}`)};
};

export const validateArtDirectionSequence = (scenes: SceneArtDirection[]): string[] => scenes.flatMap((scene, index) => evaluateArtQuality(scene, scenes[index - 1]).critique.map((note) => `scene ${index + 1} ${note}`));
