import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.2, 0.82, 0.18, 1);
const assetRoot = 'golden/CKAI-0004/sprint-01-1/shot-assets';

const fillImage: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const ShotFrame = ({children}: React.PropsWithChildren) => (
  <AbsoluteFill style={{backgroundColor: '#020303', overflow: 'hidden'}}>{children}</AbsoluteFill>
);

const Shot01Continuity = () => {
  const frame = useCurrentFrame();
  const entrance = interpolate(frame, [0, 8, 22], [0, 0.45, 1], {...clamp, easing: ease});
  const sweep = interpolate(frame, [12, 52], [-420, 1320], {...clamp, easing: Easing.inOut(Easing.cubic)});

  return (
    <ShotFrame>
      <Img
        src={staticFile(`${assetRoot}/shot-01-apparent-continuity.png`)}
        style={{...fillImage, opacity: entrance, filter: 'brightness(.84) contrast(1.22) saturate(.7)'}}
      />
      <div
        style={{
          position: 'absolute',
          left: sweep,
          top: -380,
          width: 170,
          height: 2600,
          transform: 'rotate(-31deg)',
          background: 'linear-gradient(90deg, transparent, rgba(255,229,189,.05), rgba(255,220,168,.44), rgba(255,239,210,.08), transparent)',
          filter: 'blur(12px)',
          mixBlendMode: 'screen',
          opacity: interpolate(frame, [8, 16, 48, 58], [0, 1, 1, 0], clamp),
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 52% 49%, transparent 20%, rgba(0,0,0,.08) 50%, rgba(0,0,0,.62) 100%)'}} />
    </ShotFrame>
  );
};

const Shot02Fracture = () => {
  const frame = useCurrentFrame();
  const reframe = interpolate(frame, [0, 5, 18], [1.33, 1.2, 1.02], {...clamp, easing: ease});
  const split = interpolate(frame, [14, 27, 55], [0, 0.38, 1], {...clamp, easing: ease});
  const impact = interpolate(frame, [0, 3, 8], [1, 0.72, 0], clamp);
  const shake = split > 0.1 && split < 0.85 ? Math.sin(frame * 1.9) * (1 - split) * 4 : 0;
  const image = staticFile(`${assetRoot}/shot-02-fracture-reveal.png`);

  return (
    <ShotFrame>
      <AbsoluteFill style={{transform: `scale(${reframe})`, transformOrigin: '51% 51%'}}>
        <Img
          src={image}
          style={{
            ...fillImage,
            clipPath: 'polygon(0 0, 100% 0, 100% 42%, 58% 58%, 46% 100%, 0 100%)',
            transform: `translate3d(${-split * 30 + shake}px, ${split * 38}px, 0) rotate(${split * -0.5}deg)`,
            filter: 'brightness(.92) contrast(1.2) saturate(.72)',
          }}
        />
        <Img
          src={image}
          style={{
            ...fillImage,
            clipPath: 'polygon(100% 38%, 100% 100%, 44% 100%, 57% 56%)',
            transform: `translate3d(${split * 34 - shake}px, ${-split * 45}px, 0) rotate(${split * 0.7}deg)`,
            filter: 'brightness(.88) contrast(1.23) saturate(.68)',
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 438,
          top: 480,
          width: 112,
          height: 930,
          transform: 'rotate(25deg)',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,.82), #000, rgba(0,0,0,.72), transparent)',
          filter: 'blur(5px)',
          opacity: split * 0.88,
          boxShadow: `0 0 ${36 + split * 42}px rgba(0,0,0,.9)`,
        }}
      />
      <AbsoluteFill style={{background: `rgba(255,235,205,${impact * 0.64})`, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 51% 53%, rgba(217,165,98,.12), transparent 25%), radial-gradient(ellipse, transparent 34%, rgba(0,0,0,.72) 100%)'}} />
    </ShotFrame>
  );
};

const BigLabel = ({children, style}: React.PropsWithChildren<{style: React.CSSProperties}>) => (
  <div
    style={{
      position: 'absolute',
      color: '#f7efe3',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 800,
      fontSize: 64,
      lineHeight: 0.95,
      letterSpacing: '-.025em',
      textTransform: 'uppercase',
      textShadow: '0 4px 30px rgba(0,0,0,.96)',
      ...style,
    }}
  >
    {children}
  </div>
);

const Shot03MissingVolume = () => {
  const frame = useCurrentFrame();
  const depthMove = interpolate(frame, [34, 54, 78], [0, 0.4, 1], {...clamp, easing: ease});
  const evidence = interpolate(frame, [8, 16, 92, 104], [0, 1, 1, 0], clamp);
  const inference = interpolate(frame, [20, 31, 92, 104], [0, 1, 1, 0], clamp);

  return (
    <ShotFrame>
      <Img
        src={staticFile(`${assetRoot}/shot-03-missing-volume.png`)}
        style={{
          ...fillImage,
          opacity: 1,
          transform: `translate3d(${depthMove * -20}px, ${depthMove * 18}px, 0) scale(${1 + depthMove * 0.1})`,
          transformOrigin: '48% 54%',
          filter: 'brightness(.83) contrast(1.18) saturate(.72)',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 51%, rgba(0,0,0,.03), rgba(0,0,0,.26) 58%, rgba(0,0,0,.72) 100%)'}} />
      <BigLabel style={{left: 70, bottom: 190, opacity: evidence, transform: `translateY(${(1 - evidence) * 24}px)`}}>Dữ kiện</BigLabel>
      <BigLabel style={{right: 62, top: 184, opacity: inference * 0.94, transform: `translateY(${(1 - inference) * -20}px)`, color: '#e1c69f'}}>Suy luận</BigLabel>
    </ShotFrame>
  );
};

const Shot04UnsupportedLeap = () => {
  const frame = useCurrentFrame();
  const settle = interpolate(frame, [0, 5, 18], [1.08, 1.03, 1], {...clamp, easing: ease});
  const growth = interpolate(frame, [10, 38, 62], [0, 0.72, 1], {...clamp, easing: ease});
  const tipX = 90 + growth * 640;
  const tipY = 1160 - growth * 610;
  const pulse = frame > 62 ? (Math.sin((frame - 62) * 0.34) + 1) / 2 : 0;
  const image = staticFile(`${assetRoot}/shot-04-unsupported-leap.png`);

  return (
    <ShotFrame>
      <Img src={image} style={{...fillImage, transform: `scale(${settle})`, filter: 'brightness(.78) contrast(1.2) saturate(.7)'}} />
      <Img
        src={image}
        style={{
          ...fillImage,
          clipPath: `polygon(0 49%, ${tipX}px ${tipY - 120}px, ${tipX}px ${tipY + 105}px, 0 69%)`,
          filter: `brightness(${1.24 + pulse * 0.1}) contrast(1.15) saturate(.86)`,
          opacity: interpolate(frame, [6, 12], [0, 1], clamp),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 676,
          top: 494,
          width: 70,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(239,205,153,.18), rgba(0,0,0,0) 68%)',
          filter: 'blur(11px)',
          opacity: growth * (0.38 + pulse * 0.25),
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 42% 50%, rgba(219,169,98,.1), transparent 39%), radial-gradient(ellipse at 72% 30%, rgba(0,0,0,.04), rgba(0,0,0,.34) 84%), linear-gradient(180deg, rgba(0,0,0,.1), transparent 44%, rgba(0,0,0,.22))'}} />
    </ShotFrame>
  );
};

const FilmTexture = () => (
  <>
    <AbsoluteFill
      style={{
        opacity: 0.08,
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,.22) 0 .55px, transparent .75px), radial-gradient(circle at 65% 65%, rgba(255,255,255,.13) 0 .5px, transparent .7px)',
        backgroundSize: '5px 5px, 7px 7px',
        mixBlendMode: 'soft-light',
      }}
    />
    <AbsoluteFill style={{boxShadow: 'inset 0 0 165px 62px rgba(0,0,0,.62)'}} />
  </>
);

export const GoldenFracturedCertaintyV11 = () => (
  <AbsoluteFill style={{backgroundColor: '#020303'}}>
    <Sequence from={0} durationInFrames={66} name="SHOT 01 · Apparent continuity"><Shot01Continuity /></Sequence>
    <Sequence from={66} durationInFrames={78} name="SHOT 02 · Fracture reveal"><Shot02Fracture /></Sequence>
    <Sequence from={144} durationInFrames={111} name="SHOT 03 · Missing relationship"><Shot03MissingVolume /></Sequence>
    <Sequence from={255} durationInFrames={135} name="SHOT 04 · Unsupported leap"><Shot04UnsupportedLeap /></Sequence>
    <FilmTexture />
    <Audio src={staticFile('voice/CKAI-0004/v5/master.wav')} volume={1} />
  </AbsoluteFill>
);
