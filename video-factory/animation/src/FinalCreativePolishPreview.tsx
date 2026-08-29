import {AbsoluteFill, Sequence} from 'remotion';
import type {AnimationManifest} from './model';
import {createSceneArtDirection} from './visual-system/grammar';
import {VisualScene} from './visual-system/VisualScene';
import {DEFAULT_VISUAL_PRESET_ID} from './visual-system/preset';

const copy = [
  'ĐỪNG VỘI TIN.\nHÃY KIỂM CHỨNG.',
  'BÁO CÁO\nNội dung cần giữ\nFOOTER',
  'CHẬM MỘT NHỊP.\nRÕ THÊM MỘT TẦNG.',
];

export const FINAL_POLISH_REVIEW = Object.freeze([
  {archetype: 'editorial-typography-meaningful-object', dominantFocus: 'verification lens integrated with the editorial claim', visibleTextCount: 3, objectRationale: 'The lens makes verification—the spoken action—physically visible.', amberIndependent: true, meaningfulDepth: true},
  {archetype: 'proof-transformation', dominantFocus: 'one document changing from noisy source to clean output', visibleTextCount: 5, objectRationale: 'The same document field exposes the removed noise and the resolved result.', amberIndependent: true, meaningfulDepth: true},
  {archetype: 'conclusion-payoff', dominantFocus: 'clarity statement revealed by a narrow pause-shaped aperture', visibleTextCount: 2, objectRationale: 'The slit turns a deliberate pause into the light that reveals clarity.', amberIndependent: true, meaningfulDepth: true},
]);

const directions = [
  createSceneArtDirection({semanticFunction: 'abstract concept tension', archetype: 'object-metaphor', primaryFocus: copy[0], primaryVisualConcept: 'Verification interrupts premature belief', primaryVisualObject: 'overscale cropped magnifying lens', visualMetaphor: 'A verification lens enlarges the evidence-bearing word inside the claim', compositionStrategy: 'asymmetric poster typography interrupted by an off-frame optical object', lightingStrategy: 'directional-edge', depthStrategy: 'occlusion', linePurpose: 'none', supportingElements: ['lens handle', 'magnified approved phrase'], hierarchy: 'Typography and lens form one dominant idea', emotionalTone: 'decisive scrutiny', continuity: 'standalone Phase 1 proof', strongAttractors: 2, kineticRole: 'key-claim', emphasisText: 'KIỂM CHỨNG.', proof: {classification: 'conceptual-metaphor', truthLabel: 'ẨN DỤ KIỂM CHỨNG', provenance: 'phase-1-final-polish-no-provider-fixture', evidenceAssetAvailable: false}}),
  createSceneArtDirection({semanticFunction: 'proof evidence transformation', archetype: 'proof-artifact', primaryFocus: copy[1], primaryVisualConcept: 'One source document visibly loses noise and resolves into clean content', primaryVisualObject: 'cropped paper artifact transforming across a diagonal evidence boundary', visualMetaphor: '', compositionStrategy: 'before and after share one field; the clean result occludes the noisy source', lightingStrategy: 'dark-to-light', depthStrategy: 'perspective', linePurpose: 'separate', supportingElements: ['crossed page noise', 'clean result'], hierarchy: 'Changed document state first; honest representation label second', emotionalTone: 'tactile verification', continuity: 'standalone Phase 1 proof', strongAttractors: 2, proof: {classification: 'visual-representation', truthLabel: 'BIỂU DIỄN TRUNG THỰC · KHÔNG PHẢI ẢNH CHỤP', provenance: 'phase-1-final-polish-no-provider-fixture', evidenceAssetAvailable: true}}),
  createSceneArtDirection({semanticFunction: 'conclusion final principle', archetype: 'conclusion-payoff', primaryFocus: copy[2], primaryVisualConcept: 'A deliberate pause opens a narrow field of clarity', primaryVisualObject: 'off-centre vertical light aperture', visualMetaphor: 'The pause is the opening through which clarity arrives', compositionStrategy: 'quiet upper premise, overscale lower payoff, cropped aperture at the right', lightingStrategy: 'backlight', depthStrategy: 'atmospheric', linePurpose: 'reveal', supportingElements: ['light falloff'], hierarchy: 'The payoff phrase dominates', emotionalTone: 'earned resolution', continuity: 'terminal Phase 1 proof', strongAttractors: 2, kineticRole: 'short-conclusion', emphasisText: 'RÕ THÊM', proof: {classification: 'none', truthLabel: '', provenance: '', evidenceAssetAvailable: false}}),
];

export const FINAL_CREATIVE_POLISH_MANIFEST: AnimationManifest = {
  id: 'CKAI-Phase1-Final-Creative-Polish', type: 'short-form-animation', sourceVisualDirection: 'phase-1-final-polish-no-provider-fixture', sourceVisualDirectionSha256: '0'.repeat(64), inputEligibility: 'legacy-approved-reverse-audit', upstreamAnimationHandoffStatus: 'BLOCKED', width: 1080, height: 1920, fps: 30, totalSeconds: 3, visualPresetId: DEFAULT_VISUAL_PRESET_ID,
  scenes: directions.map((artDirection, index) => ({id: `SC-0${index + 1}` as `SC-0${number}`, startSeconds: index, endSeconds: index + 1, purpose: FINAL_POLISH_REVIEW[index].archetype, requiredAssetIds: [`A${index + 1}`], requiredProofIds: [], requiredCaveatIds: [], motion: ['reveal'], artDirection})),
  assets: Object.fromEntries(copy.map((value, index) => [`A${index + 1}`, {id: `A${index + 1}`, kind: 'text' as const, value, source: 'phase-1-final-polish-no-provider-fixture', truthLabel: directions[index].proof.truthLabel || 'Phase 1 final creative polish'}])),
  proofIds: [], caveatIds: [], technicalQa: 'BLOCKED', animationReview: 'pending', humanDecision: 'not-applicable', unresolvedBlockers: ['creative evidence only; no production authority'], voiceHandoffStatus: 'BLOCKED',
  voiceHandoff: {sourceScript: 'none', implementationRef: 'video-factory/animation/src/FinalCreativePolishPreview.tsx', technicalPreviewLocation: 'generated/previews/visual-foundation-final-polish', totalDurationSeconds: 3, hardMaximumSecondsExclusive: 60, sceneSlots: copy.map((spokenCopy, index) => ({sceneId: `SC-0${index + 1}` as `SC-0${number}`, startSeconds: index, endSeconds: index + 1, spokenCopy, pauseWindows: []})), pronunciationSensitiveText: [], proofCaveatTiming: [], audioGenerated: false},
};

export const FinalCreativePolishPreview = () => <AbsoluteFill>{FINAL_CREATIVE_POLISH_MANIFEST.scenes.map((scene, index) => <Sequence key={scene.id} from={index * 30} durationInFrames={30}><VisualScene manifest={FINAL_CREATIVE_POLISH_MANIFEST} index={index} /></Sequence>)}</AbsoluteFill>;
