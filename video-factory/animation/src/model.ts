export type PassBlock = 'PASS' | 'BLOCKED';
export type HumanDecision = 'pending' | 'approved' | 'rejected' | 'needs-changes' | 'not-applicable';
export type InputEligibility = 'production' | 'legacy-approved-reverse-audit';
export type RenderMode = 'production' | 'reverse-audit-proof';

export type Asset = {
  id: string;
  kind: 'text';
  value: string;
  source: string;
  truthLabel: string;
};

export type Scene = {
  id: `SC-0${number}`;
  startSeconds: number;
  endSeconds: number;
  purpose: string;
  requiredAssetIds: string[];
  requiredProofIds: string[];
  requiredCaveatIds: string[];
  motion: Array<'reveal' | 'emphasis' | 'compare'>;
  displayCopy?: string;
  artDirection?: SceneArtDirection;
  hybridSource?: HybridVisualSourcePlan;
  motionPlan?: SceneMotionPlan;
  retentionExecution?: RetentionExecutionContract;
  semanticMechanism?: SemanticMechanismPlan;
  visualRecovery?: {
    round: 1 | 2;
    variant: 'HOOK_EXPECTATION_BREAK' | 'OBJECT_PROCESS' | 'EVIDENCE_REVEAL' | 'PAYOFF_CALLBACK' | 'WHOLE_VIDEO_RESET';
    cause: string[];
    doNotRepeat: string[];
  };
  representationPlan?: import('./representation').ProcessPlan;
};

export type VoiceTimingSlot = {
  sceneId: Scene['id'];
  startSeconds: number;
  endSeconds: number;
  spokenCopy: string;
  pauseWindows: Array<{startSeconds: number; endSeconds: number; sourceMarker: '[pause]' | '[hold]'; classification?: 'intentional-emphasis' | 'proof-reading'; semanticBasis?: string; readingWordCount?: number}>;
};

export type VoiceHandoffPackage = {
  sourceScript: string;
  implementationRef: string;
  technicalPreviewLocation: string;
  totalDurationSeconds: number;
  hardMaximumSecondsExclusive: 60;
  sceneSlots: VoiceTimingSlot[];
  pronunciationSensitiveText: string[];
  proofCaveatTiming: Array<{sceneId: Scene['id']; requirementIds: string[]}>;
  audioGenerated: false;
};

export type AnimationManifest = {
  id: string;
  type: 'short-form-animation';
  sourceVisualDirection: string;
  sourceVisualDirectionSha256: string;
  inputEligibility: InputEligibility;
  upstreamAnimationHandoffStatus: 'READY' | 'BLOCKED';
  width: number;
  height: number;
  fps: number;
  totalSeconds: number;
  visualPresetId?: VisualPresetId;
  signatureProfileId?: SignatureProfileId;
  scenes: Scene[];
  assets: Record<string, Asset>;
  proofIds: string[];
  caveatIds: string[];
  technicalQa: PassBlock;
  animationReview: 'pending' | 'pass' | 'revise';
  humanDecision: HumanDecision;
  unresolvedBlockers: string[];
  voiceHandoffStatus: 'READY' | 'BLOCKED';
  voiceHandoff: VoiceHandoffPackage;
};
import type {SceneArtDirection} from './visual-system/grammar';
import type {VisualPresetId} from './visual-system/preset';
import type {HybridVisualSourcePlan} from './visual-system/hybrid-source';
import type {SceneMotionPlan} from './motion-system';
import type {RetentionExecutionContract,SemanticMechanismPlan} from './retention-execution';
import type {SignatureProfileId} from './visual-system/signature';
