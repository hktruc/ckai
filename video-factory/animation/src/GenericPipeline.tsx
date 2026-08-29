import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import type {AnimationManifest} from './model';
import {getSceneFrames} from './engine/timeline';
import {theme} from './theme';
import {VisualScene} from './visual-system/VisualScene';
import {FinishingAudioLayer} from '../../review/src/FinishingAudioLayer';
import type {FinishingAudioAsset} from '../../review/src/model';
import type {RenderMode} from './spatial-motion';

export type GenericCaption = {id: string; lines: string[]; startSeconds: number; endSeconds: number; zone: 'upper-safe' | 'lower-safe'};
export type GenericPipelineProps = {manifest: AnimationManifest; audioPublicPath: string | null; captions: GenericCaption[]; stage: 'animation' | 'voice' | 'review'; renderMode?:RenderMode; suppressEditorialLabels?:boolean; finishingAudioAssets?: FinishingAudioAsset[]; voiceWindows?: Array<{startSeconds:number;endSeconds:number}>};

const base: React.CSSProperties = {background: theme.color.background, color: theme.color.ink, fontFamily: theme.font.sans};

const CaptionOverlay = ({captions, fps}: {captions: GenericCaption[]; fps: number}) => {
  const seconds = useCurrentFrame() / fps;
  const cue = captions.find((item) => seconds >= item.startSeconds && seconds < item.endSeconds);
  if (!cue) return null;
  const upper = cue.zone === 'upper-safe';
  return <div style={{position: 'absolute', left: 70, right: 70, top: upper ? 210 : undefined, bottom: upper ? undefined : 210, textAlign: 'center'}}>
    <span style={{display: 'inline-block', padding: '18px 28px', borderRadius: 20, background: 'rgba(9,15,24,.88)', color: '#fff', fontSize: 43, lineHeight: 1.25, fontWeight: 750}}>
      {cue.lines.map((line) => <span key={line} style={{display: 'block'}}>{line}</span>)}
    </span>
  </div>;
};

export const GenericPipeline = ({manifest, audioPublicPath, captions, stage, renderMode='PRODUCTION', suppressEditorialLabels=false, finishingAudioAssets = [], voiceWindows = []}: GenericPipelineProps) => <AbsoluteFill style={base}>
  {getSceneFrames(manifest).map((scene, index) => <Sequence key={scene.id} name={`${scene.id} · ${scene.purpose}`} from={scene.startFrame} durationInFrames={scene.durationInFrames}>
    <VisualScene manifest={manifest} index={index} renderMode={renderMode} suppressEditorialLabels={suppressEditorialLabels} />
  </Sequence>)}
  {audioPublicPath ? <Audio src={staticFile(audioPublicPath)} /> : null}
  {stage === 'review' && finishingAudioAssets.length ? <FinishingAudioLayer assets={finishingAudioAssets} fps={manifest.fps} voiceWindows={voiceWindows}/> : null}
  {stage === 'review' ? <CaptionOverlay captions={captions} fps={manifest.fps} /> : null}
</AbsoluteFill>;

// Registration-only default. It is intentionally non-production and BLOCKED;
// production props are supplied only after canonical source validation.
export const DEFAULT_GENERIC_PROPS: GenericPipelineProps = {
  manifest: {
    id: 'GENERIC-REGISTRATION-Animation', type: 'short-form-animation', sourceVisualDirection: 'not-a-production-source', sourceVisualDirectionSha256: '0'.repeat(64),
    inputEligibility: 'legacy-approved-reverse-audit', upstreamAnimationHandoffStatus: 'BLOCKED', width: 1080, height: 1920, fps: 30, totalSeconds: 1,
    scenes: [{id: 'SC-01', startSeconds: 0, endSeconds: 1, purpose: 'Registration placeholder', requiredAssetIds: ['A1'], requiredProofIds: [], requiredCaveatIds: [], motion: ['reveal']}],
    assets: {A1: {id: 'A1', kind: 'text', value: 'No production authority.', source: 'registration-only default', truthLabel: 'BLOCKED fixture'}},
    proofIds: [], caveatIds: [], technicalQa: 'BLOCKED', animationReview: 'pending', humanDecision: 'not-applicable', unresolvedBlockers: ['registration-only default'], voiceHandoffStatus: 'BLOCKED',
    voiceHandoff: {sourceScript: 'none', implementationRef: 'video-factory/animation/src/GenericPipeline.tsx', technicalPreviewLocation: 'none', totalDurationSeconds: 1, hardMaximumSecondsExclusive: 60, sceneSlots: [{sceneId: 'SC-01', startSeconds: 0, endSeconds: 1, spokenCopy: 'No production authority.', pauseWindows: []}], pronunciationSensitiveText: [], proofCaveatTiming: [], audioGenerated: false},
  }, audioPublicPath: null, captions: [], stage: 'animation', renderMode:'PRODUCTION', suppressEditorialLabels:false, finishingAudioAssets: [], voiceWindows: [],
};
