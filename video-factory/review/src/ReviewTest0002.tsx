import {AbsoluteFill} from 'remotion';
import {VoiceTest0002Preview} from '../../animation/src/VoiceTest0002';
import {CaptionLayer} from './CaptionLayer';
import {FinishingAudioLayer} from './FinishingAudioLayer';
import {TEST_0002_REVIEW_RENDER} from './manifest/test0002';

export const ReviewTest0002Preview = () => <AbsoluteFill>
  <VoiceTest0002Preview />
  <CaptionLayer cues={TEST_0002_REVIEW_RENDER.captions} />
  <FinishingAudioLayer assets={TEST_0002_REVIEW_RENDER.finishingAudioAssets} fps={30} />
</AbsoluteFill>;
