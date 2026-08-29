import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Test0002Animation} from './Test0002';

export const VoiceTest0002Preview = () => <AbsoluteFill>
  <Test0002Animation />
  <Audio src={staticFile('voice/TEST-0002/master.wav')} />
</AbsoluteFill>;
