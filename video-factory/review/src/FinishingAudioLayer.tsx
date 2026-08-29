import {Audio, Sequence, staticFile} from 'remotion';
import type {FinishingAudioAsset} from './model';
import {finishingGainAtTime} from './mix';

const publicPath = (path: string): string => path.replace(/^generated[\\/]/, '').replace(/\\/g, '/');

export const FinishingAudioLayer = ({assets, fps, voiceWindows = []}: {assets: FinishingAudioAsset[]; fps: number; voiceWindows?: Array<{startSeconds:number;endSeconds:number}>}) => <>
  {assets.map((asset) => <Sequence
    key={asset.id}
    from={Math.round(asset.startSeconds * fps)}
    durationInFrames={asset.durationSeconds === undefined ? undefined : Math.round(asset.durationSeconds * fps)}
  >
    <Audio src={staticFile(publicPath(asset.localPath))} volume={(frame) => {
      const localSeconds = frame / fps; const absoluteSeconds = asset.startSeconds + localSeconds;
      return finishingGainAtTime(asset, absoluteSeconds, voiceWindows);
    }} />
  </Sequence>)}
</>;
