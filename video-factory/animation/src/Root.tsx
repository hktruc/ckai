import {Composition} from 'remotion';
import {getTotalFrames} from './engine/timeline';
import {TEST_0002} from './manifest/test0002';
import {Test0002Animation} from './Test0002';
import {VoiceTest0002Preview} from './VoiceTest0002';
import {ReviewTest0002Preview} from '../../review/src/ReviewTest0002';
import {DEFAULT_GENERIC_PROPS, GenericPipeline} from './GenericPipeline';
import {VisualFoundationPreview} from './VisualFoundationPreview';
import {CreativeCorrectionPreview} from './CreativeCorrectionPreview';
import {FinalCreativePolishPreview} from './FinalCreativePolishPreview';
import {GenericArtDirectionGallery} from './GenericArtDirectionGallery';
import {GoldenFracturedCertainty} from './GoldenFracturedCertainty';
import {GoldenFracturedCertaintyV11} from './GoldenFracturedCertaintyV11';
import {GoldenFastInformationVelocityV12} from './GoldenFastInformationVelocityV12';
import {GoldenFacebookRealV13} from './GoldenFacebookRealV13';
import {GoldenTypographyHeroV14, GoldenTypographyHeroV141} from './GoldenTypographyHeroV14';
import {CKAI0004FullProduction} from './CKAI0004FullProduction';
import {CKAI0005MotionPrototype} from './CKAI0005MotionPrototype';
import {CKAI0005FullProduction, CKAI0005FullProductionV11} from './CKAI0005FullProduction';
import {CKAI0006FullProduction} from './CKAI0006FullProduction';
import {CKAI0006FullProductionV11} from './CKAI0006FullProductionV11';
import {CKAI0006FullProductionV12} from './CKAI0006FullProductionV12';

export const RemotionRoot = () => <>
  <Composition
    id={TEST_0002.id}
    component={Test0002Animation}
    durationInFrames={getTotalFrames(TEST_0002)}
    fps={TEST_0002.fps}
    width={TEST_0002.width}
    height={TEST_0002.height}
  />
  <Composition
    id="TEST-0002-Voice-Preview"
    component={VoiceTest0002Preview}
    durationInFrames={getTotalFrames(TEST_0002)}
    fps={TEST_0002.fps}
    width={TEST_0002.width}
    height={TEST_0002.height}
  />
  <Composition
    id="TEST-0002-Review-Preview"
    component={ReviewTest0002Preview}
    durationInFrames={getTotalFrames(TEST_0002)}
    fps={TEST_0002.fps}
    width={TEST_0002.width}
    height={TEST_0002.height}
  />
  <Composition
    id="CKAI-Visual-Foundation-V1"
    component={VisualFoundationPreview}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-Phase1-Creative-Correction"
    component={CreativeCorrectionPreview}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-Phase1-Final-Creative-Polish"
    component={FinalCreativePolishPreview}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-Generic-Art-Direction-Gallery"
    component={GenericArtDirectionGallery}
    durationInFrames={270}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0004-Golden-Fractured-Certainty"
    component={GoldenFracturedCertainty}
    durationInFrames={420}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0004-Golden-Fractured-Certainty-V11"
    component={GoldenFracturedCertaintyV11}
    durationInFrames={390}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0004-Golden-Fast-Information-V12"
    component={GoldenFastInformationVelocityV12}
    durationInFrames={399}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0004-Golden-Facebook-Real-V13"
    component={GoldenFacebookRealV13}
    durationInFrames={399}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0004-Golden-Typography-Hero-V14"
    component={GoldenTypographyHeroV14}
    durationInFrames={399}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0004-Golden-Typography-Hero-V141"
    component={GoldenTypographyHeroV141}
    durationInFrames={399}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0004-Full-Production-V1"
    component={CKAI0004FullProduction}
    durationInFrames={1272}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0005-Motion-Prototype-01"
    component={CKAI0005MotionPrototype}
    durationInFrames={405}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0005-Full-Production-V1"
    component={CKAI0005FullProduction}
    durationInFrames={1298}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0005-Full-Production-V1-1"
    component={CKAI0005FullProductionV11}
    durationInFrames={1298}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0006-Full-Production-V1"
    component={CKAI0006FullProduction}
    durationInFrames={1068}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0006-Full-Production-V1-1"
    component={CKAI0006FullProductionV11}
    durationInFrames={1068}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-0006-Full-Production-V1-2"
    component={CKAI0006FullProductionV12}
    durationInFrames={1068}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="CKAI-Generic-Pipeline"
    component={GenericPipeline}
    durationInFrames={30}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={DEFAULT_GENERIC_PROPS}
    calculateMetadata={({props}) => ({durationInFrames: getTotalFrames(props.manifest), fps: props.manifest.fps, width: props.manifest.width, height: props.manifest.height})}
  />
</>;
