import {AbsoluteFill, Sequence} from 'remotion';
import type {AnimationManifest} from './model';
import {createSceneArtDirection} from './visual-system/grammar';
import {VisualScene} from './visual-system/VisualScene';
import {DEFAULT_VISUAL_PRESET_ID} from './visual-system/preset';

const copy = [
  'ÍT HƠN.\nNHƯNG NẶNG HƠN.',
  'DỮ KIỆN\n→\nKẾT QUẢ',
  'ĐỪNG VỘI TIN.\nHÃY KIỂM CHỨNG.',
];

export const VISUAL_FOUNDATION_PREVIEW: AnimationManifest = {
  id: 'CKAI-Visual-Foundation-V1', type: 'short-form-animation', sourceVisualDirection: 'phase-1-deterministic-preview', sourceVisualDirectionSha256: '0'.repeat(64),
  inputEligibility: 'legacy-approved-reverse-audit', upstreamAnimationHandoffStatus: 'BLOCKED', width: 1080, height: 1920, fps: 30, totalSeconds: 3, visualPresetId: DEFAULT_VISUAL_PRESET_ID,
  scenes: [
    {id: 'SC-01', startSeconds: 0, endSeconds: 1, purpose: 'Visual hierarchy', requiredAssetIds: ['A1'], requiredProofIds: [], requiredCaveatIds: [], motion: ['reveal'], artDirection: createSceneArtDirection({semanticFunction: 'key insight focus reveal', primaryFocus: copy[0], supportingElements: [], hierarchy: 'Huge statement with restrained support', emotionalTone: 'calm authority', continuity: 'amber precision line', occupiedRatio: .55, strongAttractors: 1, kineticRole: 'key-claim', proof: {classification: 'none', truthLabel: '', provenance: '', evidenceAssetAvailable: false}})},
    {id: 'SC-02', startSeconds: 1, endSeconds: 2, purpose: 'Proof presentation', requiredAssetIds: ['A2'], requiredProofIds: [], requiredCaveatIds: [], motion: ['reveal'], artDirection: createSceneArtDirection({semanticFunction: 'proof evidence result', primaryFocus: copy[1], supportingElements: ['truth label'], hierarchy: 'Evidence first; label remains visible', emotionalTone: 'precise confidence', continuity: 'same dark material', occupiedRatio: .55, strongAttractors: 2, kineticRole: 'key-claim', proof: {classification: 'visual-representation', truthLabel: 'MINH HỌA HỆ THỐNG PROOF', provenance: 'phase-1-preview', evidenceAssetAvailable: true}})},
    {id: 'SC-03', startSeconds: 2, endSeconds: 3, purpose: 'Conclusion framing', requiredAssetIds: ['A3'], requiredProofIds: [], requiredCaveatIds: [], motion: ['emphasis'], artDirection: createSceneArtDirection({semanticFunction: 'conclusion final principle', primaryFocus: copy[2], supportingElements: [], hierarchy: 'One distilled statement', emotionalTone: 'restrained weight', continuity: 'close on amber line', occupiedRatio: .55, strongAttractors: 1, kineticRole: 'short-conclusion', emphasisText: 'HÃY KIỂM CHỨNG.', proof: {classification: 'none', truthLabel: '', provenance: '', evidenceAssetAvailable: false}})},
  ],
  assets: {
    A1: {id: 'A1', kind: 'text', value: copy[0], source: 'phase-1-preview', truthLabel: 'Visual DNA demonstration'},
    A2: {id: 'A2', kind: 'text', value: copy[1], source: 'phase-1-preview', truthLabel: 'MINH HỌA HỆ THỐNG PROOF'},
    A3: {id: 'A3', kind: 'text', value: copy[2], source: 'phase-1-preview', truthLabel: 'Visual DNA demonstration'},
  },
  proofIds: [], caveatIds: [], technicalQa: 'BLOCKED', animationReview: 'pending', humanDecision: 'not-applicable', unresolvedBlockers: ['deterministic visual foundation preview only'], voiceHandoffStatus: 'BLOCKED',
  voiceHandoff: {sourceScript: 'none', implementationRef: 'video-factory/animation/src/VisualFoundationPreview.tsx', technicalPreviewLocation: 'generated/previews/visual-foundation-v1', totalDurationSeconds: 3, hardMaximumSecondsExclusive: 60, sceneSlots: [0, 1, 2].map((index) => ({sceneId: `SC-0${index + 1}` as const, startSeconds: index, endSeconds: index + 1, spokenCopy: copy[index], pauseWindows: []})), pronunciationSensitiveText: [], proofCaveatTiming: [], audioGenerated: false},
};

export const VisualFoundationPreview = () => <AbsoluteFill>{VISUAL_FOUNDATION_PREVIEW.scenes.map((scene, index) => <Sequence key={scene.id} from={index * 30} durationInFrames={30}><VisualScene manifest={VISUAL_FOUNDATION_PREVIEW} index={index} /></Sequence>)}</AbsoluteFill>;
