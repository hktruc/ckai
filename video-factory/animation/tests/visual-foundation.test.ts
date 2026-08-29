import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {createSceneArtDirection, planKineticTypography, SEMANTIC_ARCHETYPE, SEMANTIC_COMPOSITION, validateDisplayCopy, validateProofPresentation, validateSceneArtDirection} from '../src/visual-system/grammar';
import {canUseAsProductionAsset, validateVisualReference} from '../src/visual-system/reference';
import {CKAI_DARK_PREMIUM_EDITORIAL_V1, getVisualPreset} from '../src/visual-system/preset';
import {CREATIVE_PROOF_FRAMES} from '../src/CreativeCorrectionPreview';
import {FINAL_POLISH_REVIEW} from '../src/FinalCreativePolishPreview';
import {GENERIC_ART_DIRECTION_GALLERY, GENERIC_GALLERY_REVIEW} from '../src/GenericArtDirectionGallery';
import {ART_DIRECTION_POLICIES} from '../src/visual-system/art-direction';
import {evaluateArtQuality, validateArtDirectionSequence} from '../src/visual-system/art-quality';
import {validateRendererLayoutFit} from '../src/visual-system/production-parity';
import {evaluateHybridSource, readAssetContract, readKeyVisualBrief} from '../src/visual-system/hybrid-source';
import {createMotionPlan, validateMotionSequence} from '../src/motion-system';
import {CKAI_SIGNATURE_V1, getSignatureProfile} from '../src/visual-system/signature';

const luminance = (hex: string) => {
  const channels = hex.slice(1).match(/.{2}/g)!.map((value) => Number.parseInt(value, 16) / 255).map((value) => value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
};
const contrast = (a: string, b: string) => { const [bright, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (bright + .05) / (dark + .05); };

test('CKAI Visual DNA V1 loads from one versioned token source', () => {
  const preset = getVisualPreset('CKAI_DARK_PREMIUM_EDITORIAL_V1');
  assert.equal(preset, CKAI_DARK_PREMIUM_EDITORIAL_V1);
  assert.equal(preset.version, 1);
  assert.deepEqual(preset.format, {width: 1080, height: 1920, mobileFirst: true});
  assert.throws(() => getVisualPreset('CKAI_UNKNOWN_V2' as never), /Unknown visual preset/);
});

test('dark hierarchy, restrained light and material tokens are internally consistent without a numeric occupancy gate', () => {
  const preset = CKAI_DARK_PREMIUM_EDITORIAL_V1;
  assert.ok(contrast(preset.color.canvas, preset.color.ink) >= 7);
  assert.ok(preset.lighting.maximumLitAreaRatio <= .2);
  assert.match(preset.density.occupiedGuidance, /never enforce a numeric occupancy target/);
  assert.equal(preset.lineTreatment.hudAllowed, false);
  assert.equal(preset.material.surface, 'matte-graphite');
});

test('Vietnamese typography and expressive emphasis preserve exact text while captions stay separate', () => {
  const exact = 'Đừng vội tin — hãy kiểm chứng.';
  const plan = planKineticTypography(exact, 'short-conclusion', 'hãy kiểm chứng');
  assert.equal(plan.exactText, exact);
  assert.equal(plan.mode, 'expressive-kinetic');
  assert.ok(CKAI_DARK_PREMIUM_EDITORIAL_V1.typography.displayFamily.includes('Segoe UI'));
  assert.equal(CKAI_DARK_PREMIUM_EDITORIAL_V1.typography.caption.maxLines, 2);
  assert.throws(() => planKineticTypography('Một hai ba bốn năm', 'keyword', 'Một hai ba bốn'), /cannot animate most words/);
});

test('semantic objectives map to distinct composition grammar and enforce visual hierarchy', () => {
  assert.equal(SEMANTIC_COMPOSITION.comparison, 'split-contrast');
  assert.equal(SEMANTIC_COMPOSITION.process, 'progression-flow');
  assert.equal(SEMANTIC_COMPOSITION.proof, 'evidence-forward');
  assert.equal(SEMANTIC_COMPOSITION.conclusion, 'distilled-statement');
  assert.equal(SEMANTIC_ARCHETYPE.proof, 'proof-artifact');
  assert.equal(SEMANTIC_ARCHETYPE.conclusion, 'conclusion-payoff');
  const scene = createSceneArtDirection({semanticFunction: 'proof result reveal', primaryFocus: 'KẾT QUẢ', supportingElements: ['source'], hierarchy: 'proof first', emotionalTone: 'confident', continuity: 'stable source', occupiedRatio: .55, strongAttractors: 2, proof: {classification: 'visual-representation', truthLabel: 'Biểu diễn từ kết quả đã kiểm chứng', provenance: 'local/result.json', evidenceAssetAvailable: true}});
  assert.deepEqual(validateSceneArtDirection(scene, CKAI_DARK_PREMIUM_EDITORIAL_V1), []);
  assert.equal(scene.pattern, 'evidence-forward');
  assert.equal(scene.archetype, 'proof-artifact');
});

test('density is creative guidance, while concept, object and proof gates remain hard', () => {
  const scene = createSceneArtDirection({semanticFunction: 'key insight', primaryFocus: 'MỘT TRỌNG TÂM', supportingElements: [], hierarchy: 'one focus', emotionalTone: 'calm', continuity: 'none', occupiedRatio: .12, strongAttractors: 1, proof: {classification: 'none', truthLabel: '', provenance: '', evidenceAssetAvailable: false}});
  assert.deepEqual(validateSceneArtDirection(scene, CKAI_DARK_PREMIUM_EDITORIAL_V1), []);
  const forgedProof = {...scene, archetype: 'proof-artifact' as const};
  assert.match(validateSceneArtDirection(forgedProof, CKAI_DARK_PREMIUM_EDITORIAL_V1).join('\n'), /honest proof classification/);
});

test('five creative correction frames are meaningfully varied and survive phone review rules', () => {
  assert.deepEqual(CREATIVE_PROOF_FRAMES.map((frame) => frame.archetype), ['typography-hero', 'object-metaphor', 'proof-artifact', 'comparison-transformation', 'conclusion-payoff']);
  assert.ok(CREATIVE_PROOF_FRAMES.filter((frame) => frame.nonTextObjects >= 2).length >= 2);
  assert.ok(CREATIVE_PROOF_FRAMES.every((frame) => frame.minimumFontSize >= 34));
  assert.ok(CREATIVE_PROOF_FRAMES.flatMap((frame) => frame.marketText).every((text) => !/SC-\d|CHÁNH KIẾN\s*·\s*AI|debug|metadata/i.test(text)));
  assert.match(CREATIVE_PROOF_FRAMES[2].truthLabel!, /KHÔNG PHẢI ẢNH CHỤP/);
});

test('final polish contains exactly three release-review stills with explicit object rationale', () => {
  assert.equal(FINAL_POLISH_REVIEW.length, 3);
  assert.ok(FINAL_POLISH_REVIEW.every((frame) => frame.objectRationale.length > 30));
  assert.ok(FINAL_POLISH_REVIEW.every((frame) => frame.amberIndependent && frame.meaningfulDepth));
  assert.ok(FINAL_POLISH_REVIEW.every((frame) => frame.visibleTextCount <= 6));
});

test('generic art-direction policies cover nine semantic archetypes and all four visual modes', () => {
  assert.equal(Object.keys(ART_DIRECTION_POLICIES).length, 9);
  assert.deepEqual(new Set(Object.values(ART_DIRECTION_POLICIES).map((policy) => policy.visualMode)), new Set(['typographic-editorial', 'object-metaphor-cinematic', 'proof-evidence-presentation', 'transformation-comparison']));
  assert.ok(Object.values(ART_DIRECTION_POLICIES).every((policy) => policy.compositionalTendencies.length && policy.typographyStrategy && policy.pacingIntent && policy.proofPolicy));
});

test('cross-topic gallery proves generic policies and art-quality sequence gates', () => {
  assert.equal(GENERIC_GALLERY_REVIEW.length, 9);
  const directions = GENERIC_ART_DIRECTION_GALLERY.scenes.map((scene) => scene.artDirection!);
  assert.deepEqual(validateArtDirectionSequence(directions), []);
  assert.ok(directions.every((direction) => validateSceneArtDirection(direction, CKAI_DARK_PREMIUM_EDITORIAL_V1).length === 0));
  assert.equal(new Set(directions.map((direction) => direction.semanticArchetype)).size, 9);
});

test('gallery and production share display-copy, art-direction, source-strategy, renderer and QA machinery', () => {
  for (const [index, scene] of GENERIC_ART_DIRECTION_GALLERY.scenes.entries()) {
    assert.ok(scene.displayCopy);
    assert.deepEqual(validateDisplayCopy(scene.displayCopy, GENERIC_ART_DIRECTION_GALLERY.voiceHandoff.sceneSlots[index].spokenCopy, scene.artDirection!), []);
    assert.ok(scene.artDirection!.sourceStrategy);
    assert.match(scene.artDirection!.forbiddenFallbackAnatomy, /text wall/i);
  }
  const renderer = readFileSync('video-factory/animation/src/GenericPipeline.tsx', 'utf8');
  assert.doesNotMatch(renderer, /manifest\.id\s*===|CKAI0004Film/);
  assert.match(renderer, /VisualScene/);
});

test('production renderer layout contract blocks copy that would collapse at mobile size', () => {
  const scene = structuredClone(GENERIC_ART_DIRECTION_GALLERY.scenes[2]);
  scene.displayCopy = 'ĐÂY LÀ MỘT DÒNG QUÁ DÀI ĐỂ GIỮ HERO TYPOGRAPHY TRÊN MOBILE';
  assert.match(validateRendererLayoutFit(scene).join('\n'), /safe layout/);
  assert.deepEqual(GENERIC_ART_DIRECTION_GALLERY.scenes.flatMap(validateRendererLayoutFit), []);
});

test('art-quality lint blocks generic objects, UI anatomy and repeated adjacent anatomy', () => {
  const base = GENERIC_ART_DIRECTION_GALLERY.scenes[0].artDirection!;
  const generic = {...base, semanticObject: 'lens' as const, primaryVisualObject: 'generic sphere', objectRationale: 'A generic sphere was added because the frame felt empty.'};
  assert.match(evaluateArtQuality(generic).critique.join('\n'), /semantic-object-fit|aesthetic-integrity/);
  const uiLike = {...base, compositionStrategy: 'rounded card to arrow to card'};
  assert.match(evaluateArtQuality(uiLike).critique.join('\n'), /not-template/);
  assert.match(evaluateArtQuality(base, base).critique.join('\n'), /variation-integrity/);
});

test('mockup and metaphor can never silently acquire actual-proof authority', () => {
  assert.match(validateProofPresentation({classification: 'illustrative-mockup', truthLabel: 'Actual verified proof', provenance: 'local/mockup.png', evidenceAssetAvailable: true}).join('\n'), /cannot be labelled as actual proof/);
  assert.match(validateProofPresentation({classification: 'actual-proof', truthLabel: 'Actual proof', provenance: 'local/result.json', evidenceAssetAvailable: false}).join('\n'), /requires an available evidence asset/);
  assert.deepEqual(validateProofPresentation({classification: 'actual-proof', truthLabel: 'Kết quả kiểm chứng trực tiếp', provenance: 'local/result.json', evidenceAssetAvailable: true}), []);
});

test('reference-only material cannot become a production asset without direct approval, hash and rights', () => {
  const referenceOnly = {id: 'REF-001', type: 'pdf' as const, path: 'references/editorial.pdf', mode: 'REFERENCE_ONLY' as const, influence: 'lighting and hierarchy only', provenance: 'Product Owner supplied', license: 'reference only'};
  assert.deepEqual(validateVisualReference(referenceOnly), []);
  assert.equal(canUseAsProductionAsset(referenceOnly), false);
  const forged = {...referenceOnly, mode: 'PRODUCTION_ASSET_APPROVED' as const};
  assert.equal(canUseAsProductionAsset(forged), false);
  assert.match(validateVisualReference(forged).join('\n'), /Product Owner approval|SHA-256/);
});

test('hybrid source QA prioritizes real evidence and reports missing richer artwork honestly', () => {
  const proofDirection = GENERIC_ART_DIRECTION_GALLERY.scenes.find((scene) => scene.artDirection?.semanticArchetype === 'evidence-proof')!.artDirection!;
  const asset = readAssetContract(process.cwd(), 'content/visual-assets/CKAI-0004/SC-04-evidence.asset.json');
  const real = evaluateHybridSource({contentId:'CKAI-0004',sceneId:'SC-04',direction:proofDirection,proofClass:'visual-representation',plan:{choice:'REAL_EVIDENCE',rationale:'Proof is central and the canonical direct-test record exists.',assetContractPath:'content/visual-assets/CKAI-0004/SC-04-evidence.asset.json',asset},workspace:process.cwd()});
  assert.deepEqual(real.filter((finding) => finding.severity === 'BLOCKER'), []);
  const ignored = evaluateHybridSource({contentId:'CKAI-0004',sceneId:'SC-04',direction:proofDirection,proofClass:'actual-proof',plan:{choice:'REAL_EVIDENCE',rationale:'Proof is central.'},workspace:process.cwd()});
  assert.ok(ignored.some((finding) => finding.code === 'REAL_EVIDENCE_IGNORED' && finding.severity === 'BLOCKER'));

  const hookDirection = {...GENERIC_ART_DIRECTION_GALLERY.scenes.find((scene) => scene.artDirection?.semanticArchetype === 'warning-tension')!.artDirection!, objectRationale:'The context-specific evidence gap interrupts causal closure; it is not a dictionary warning symbol.'};
  const brief = readKeyVisualBrief(process.cwd(), 'content/visual-assets/CKAI-0004/SC-01-key-visual-brief.json');
  const missingArtwork = evaluateHybridSource({contentId:'CKAI-0004',sceneId:'SC-01',direction:hookDirection,proofClass:'conceptual-metaphor',plan:{choice:'CURATED_OR_GENERATED_KEY_VISUAL',rationale:'Atmosphere and second-order tension require richer materiality.',keyVisualBriefPath:'content/visual-assets/CKAI-0004/SC-01-key-visual-brief.json',keyVisualBrief:brief,creativeLimitation:'KEY_VISUAL_ASSET_REQUIRED'},workspace:process.cwd()});
  assert.ok(missingArtwork.some((finding) => finding.code === 'KEY_VISUAL_ASSET_REQUIRED' && finding.severity === 'LIMITATION'));
  assert.deepEqual(missingArtwork.filter((finding) => finding.severity === 'BLOCKER'), []);
});

test('generated imagery can never acquire proof authority through a valid-looking asset contract', () => {
  const direction = GENERIC_ART_DIRECTION_GALLERY.scenes.find((scene) => scene.artDirection?.semanticArchetype === 'evidence-proof')!.artDirection!;
  const actual = readAssetContract(process.cwd(), 'content/visual-assets/CKAI-0004/SC-04-evidence.asset.json');
  const generated = {...actual, sourceType:'GENERATED' as const, truthStatus:'GENERATED_CONCEPT' as const};
  const findings = evaluateHybridSource({contentId:'CKAI-0004',sceneId:'SC-04',direction,proofClass:'actual-proof',plan:{choice:'REAL_EVIDENCE',rationale:'forged generated proof',asset:generated},workspace:process.cwd()});
  assert.ok(findings.some((finding) => finding.code === 'GENERATED_VISUAL_AS_PROOF' && finding.severity === 'BLOCKER'));
});

test('motion grammar covers every scene and rejects repeated or empty progression', () => {
  const scenes = structuredClone(GENERIC_ART_DIRECTION_GALLERY.scenes.slice(0, 4));
  scenes.forEach((scene,index) => { scene.motionPlan = createMotionPlan(scene.endSeconds-scene.startSeconds, scene.purpose, index); });
  assert.deepEqual(validateMotionSequence(scenes), []);
  scenes[1].motionPlan!.events = [];
  assert.match(validateMotionSequence(scenes).join('\n'), /does not cover|dead-air/);
});

test('CKAI signature is small, versioned and does not force every motif', () => {
  assert.equal(getSignatureProfile('CKAI_SIGNATURE_V1'), CKAI_SIGNATURE_V1);
  assert.equal(CKAI_SIGNATURE_V1.version, 1);
  assert.match(CKAI_SIGNATURE_V1.rule, /never force every motif/i);
});
