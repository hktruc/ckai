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
const ease = Easing.bezier(0.16, 0.84, 0.2, 1);
const assetRoot = 'golden/CKAI-0004/sprint-01-4/shot-assets';

const contentStage: React.CSSProperties = {
  position: 'absolute',
  left: 64,
  top: 400,
  width: 940,
  height: 880,
};

type Tone = 'dense' | 'minimal' | 'bright' | 'macro' | 'type-first' | 'wide';
type Entrance = 'snap' | 'settle' | 'focus' | 'depth';

type HeroLine = {
  text: string;
  size: number;
  gold?: boolean;
  tracking?: string;
  indent?: number;
};

type HeroBeatProps = {
  image: string;
  lines: HeroLine[];
  tone: Tone;
  lineHeight?: number;
  imageScale?: number;
  imageX?: number;
  imageY?: number;
  entrance?: Entrance;
};

const toneStyle: Record<Tone, {opacity: number; brightness: number; contrast: number; overlay: string}> = {
  dense: {
    opacity: 0.96,
    brightness: 0.92,
    contrast: 1.28,
    overlay: 'linear-gradient(90deg, rgba(0,0,0,.8), rgba(0,0,0,.48) 62%, rgba(0,0,0,.08))',
  },
  minimal: {
    opacity: 0.5,
    brightness: 0.72,
    contrast: 1.34,
    overlay: 'linear-gradient(90deg, rgba(0,0,0,.9), rgba(0,0,0,.7) 68%, rgba(0,0,0,.34))',
  },
  bright: {
    opacity: 1,
    brightness: 1.16,
    contrast: 1.24,
    overlay: 'linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.3) 64%, rgba(0,0,0,.02))',
  },
  macro: {
    opacity: 0.92,
    brightness: 1.02,
    contrast: 1.38,
    overlay: 'linear-gradient(90deg, rgba(0,0,0,.83), rgba(0,0,0,.54) 58%, rgba(0,0,0,.08))',
  },
  'type-first': {
    opacity: 0.28,
    brightness: 0.7,
    contrast: 1.42,
    overlay: 'radial-gradient(ellipse at 88% 50%, rgba(183,131,67,.13), transparent 34%), linear-gradient(90deg, rgba(0,0,0,.94), rgba(0,0,0,.82) 70%, rgba(0,0,0,.56))',
  },
  wide: {
    opacity: 0.86,
    brightness: 0.98,
    contrast: 1.2,
    overlay: 'linear-gradient(90deg, rgba(0,0,0,.82), rgba(0,0,0,.42) 60%, rgba(0,0,0,.04))',
  },
};

const HeroBeat = ({
  image,
  lines,
  tone,
  lineHeight = 0.84,
  imageScale = 1.08,
  imageX = 0,
  imageY = 0,
  entrance = 'settle',
}: HeroBeatProps) => {
  const frame = useCurrentFrame();
  const style = toneStyle[tone];
  const fast = entrance === 'snap';
  const textIn = interpolate(frame, fast ? [0, 2, 6] : [0, 5, 10], [0, 0.84, 1], {
    ...clamp,
    easing: ease,
  });
  const textX = interpolate(frame, [0, fast ? 5 : 9], [entrance === 'depth' ? -12 : 42, 0], {
    ...clamp,
    easing: ease,
  });
  const drift = interpolate(frame, [0, 60], [0, entrance === 'focus' ? 34 : 18], clamp);
  const blur = entrance === 'focus' ? interpolate(frame, [0, 4, 10], [8, 2, 0], clamp) : 0;
  const impact = interpolate(frame, [0, 2, 7], [tone === 'bright' ? 0.34 : fast ? 0.19 : 0.08, 0.05, 0], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#010202', overflow: 'hidden'}}>
      <Img
        src={staticFile(`${assetRoot}/${image}`)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: style.opacity,
          transform: `translate3d(${imageX + drift}px, ${imageY - drift * 0.28}px, 0) scale(${imageScale + frame * 0.0005})`,
          filter: `brightness(${style.brightness}) contrast(${style.contrast}) saturate(.74) blur(${blur}px)`,
        }}
      />
      <AbsoluteFill style={{background: style.overlay}} />
      <div style={contentStage}>
        <div
          style={{
            width: 914,
            height: 810,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            opacity: textIn,
            transform: `translateX(${textX}px)`,
          }}
        >
          <div
            style={{
              width: tone === 'type-first' ? 164 : 108,
              height: 9,
              marginBottom: 32,
              borderRadius: 999,
              background: 'linear-gradient(90deg, #8f6335, #f3cf94)',
              boxShadow: '0 0 34px rgba(229,180,108,.38)',
              transform: `scaleX(${textIn})`,
              transformOrigin: 'left',
            }}
          />
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            {lines.map((line, index) => (
              <div
                key={`${line.text}-${index}`}
                style={{
                  marginLeft: line.indent ?? 0,
                  color: line.gold ? '#e7bd7e' : '#f6f0e8',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontWeight: 900,
                  fontSize: line.size,
                  lineHeight,
                  letterSpacing: line.tracking ?? '-0.06em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  textShadow: line.gold
                    ? '0 0 38px rgba(225,171,94,.3), 0 7px 44px rgba(0,0,0,.98)'
                    : '0 7px 44px rgba(0,0,0,.98)',
                }}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>
      <AbsoluteFill style={{background: `rgba(255,231,194,${impact})`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

type BridgeKind = 'object' | 'match' | 'type' | 'fracture' | 'aperture' | 'impact' | 'vertical' | 'extrusion';

const TransitionBridge = ({kind}: {kind: BridgeKind}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 9], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const pulse = interpolate(frame, [0, 4, 9], [0, 1, 0], clamp);

  if (kind === 'object') {
    return <div style={{position: 'absolute', inset: '-220px -360px', transform: `translateX(${-1480 + progress * 2900}px) rotate(-12deg)`, background: 'linear-gradient(90deg, #020303, #111313 38%, #463624 49%, #111313 55%, #020303)', boxShadow: '0 0 46px rgba(221,174,109,.3)'}} />;
  }
  if (kind === 'match') {
    return <div style={{position: 'absolute', left: -500 + progress * 1940, top: -400, width: 260, height: 2740, transform: 'rotate(28deg)', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,.94), #dcb174, rgba(0,0,0,.94), transparent)', filter: 'blur(4px)', opacity: pulse}} />;
  }
  if (kind === 'type') {
    const scale = interpolate(frame, [0, 4, 9], [0.45, 2.2, 5.6], {...clamp, easing: ease});
    return (
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', opacity: pulse}}>
        <div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 900, fontSize: 210, letterSpacing: '-.07em', color: '#f7eee2', transform: `scale(${scale})`, textShadow: '0 0 54px #000'}}>HỢP LÝ</div>
      </AbsoluteFill>
    );
  }
  if (kind === 'fracture') {
    const split = interpolate(frame, [0, 4, 9], [0, 1, 2.2], clamp);
    return (
      <AbsoluteFill style={{opacity: pulse}}>
        <div style={{position: 'absolute', inset: 0, background: '#080807', clipPath: 'polygon(0 0, 57% 0, 49% 46%, 43% 100%, 0 100%)', transform: `translate(${-split * 44}px, ${split * 26}px)`}} />
        <div style={{position: 'absolute', inset: 0, background: '#17130e', clipPath: 'polygon(57% 0, 100% 0, 100% 100%, 43% 100%, 49% 46%)', transform: `translate(${split * 48}px, ${-split * 30}px)`}} />
        <div style={{position: 'absolute', left: 475, top: 170, width: 92, height: 1510, transform: 'rotate(12deg)', background: 'linear-gradient(90deg, transparent, #edc27e, transparent)', filter: 'blur(7px)'}} />
      </AbsoluteFill>
    );
  }
  if (kind === 'aperture') {
    const radius = interpolate(frame, [0, 4, 9], [92, 5, 92], {...clamp, easing: ease});
    return <AbsoluteFill style={{background: `radial-gradient(circle at 53% 49%, transparent ${radius}%, rgba(0,0,0,.98) ${Math.min(radius + 9, 100)}%)`}} />;
  }
  if (kind === 'impact') {
    return <AbsoluteFill style={{background: `rgba(245,213,166,${pulse * 0.54})`, mixBlendMode: 'screen'}} />;
  }
  if (kind === 'vertical') {
    return <div style={{position: 'absolute', left: -420 + progress * 1800, top: -80, width: 370, height: 2100, background: 'linear-gradient(90deg, #020303, #171615 65%, #e7ba78 69%, #171614 72%, #020303)', boxShadow: '0 0 38px rgba(228,179,108,.28)'}} />;
  }
  return <div style={{position: 'absolute', left: -980 + progress * 2190, top: 680, width: 1580, height: 170, transform: 'rotate(-32deg)', background: 'linear-gradient(180deg, rgba(0,0,0,.92), rgba(242,201,140,.76), rgba(0,0,0,.94))', filter: 'blur(3px)', opacity: pulse, boxShadow: '0 0 64px rgba(227,175,105,.38)'}} />;
};

const Texture = () => (
  <>
    <AbsoluteFill style={{opacity: 0.055, backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,.2) 0 .55px, transparent .75px), radial-gradient(circle at 65% 65%, rgba(255,255,255,.12) 0 .5px, transparent .7px)', backgroundSize: '5px 5px, 7px 7px', mixBlendMode: 'soft-light'}} />
    <AbsoluteFill style={{boxShadow: 'inset 0 0 145px 42px rgba(0,0,0,.5)'}} />
  </>
);

type GoldenTypographyHeroV14Props = {
  lineHeight?: number;
};

export const GoldenTypographyHeroV14 = ({lineHeight = 0.84}: GoldenTypographyHeroV14Props) => (
  <AbsoluteFill style={{backgroundColor: '#010202'}}>
    <Sequence from={0} durationInFrames={42} name="BEAT 01 · Hero question">
      <HeroBeat lineHeight={lineHeight} image="shot-01-apparent-continuity.png" tone="bright" imageScale={1.13} imageX={-45} imageY={18} entrance="snap" lines={[
        {text: 'ĐỪNG HỎI A.I:', size: 104},
        {text: '“NGUYÊN NHÂN', size: 104, gold: true},
        {text: 'LÀ GÌ?”', size: 174, gold: true},
      ]} />
    </Sequence>
    <Sequence from={42} durationInFrames={42} name="BEAT 02 · Typography reset">
      <HeroBeat lineHeight={lineHeight} image="shot-02-locked-certainty.png" tone="minimal" imageScale={1.07} imageX={-8} entrance="settle" lines={[
        {text: 'CÂU HỎI', size: 94},
        {text: 'NGHE RẤT', size: 156},
        {text: 'HỢP LÝ', size: 190, gold: true},
      ]} />
    </Sequence>
    <Sequence from={84} durationInFrames={36} name="BEAT 03 · Wide missing data">
      <HeroBeat lineHeight={lineHeight} image="shot-04-missing-volume.png" tone="wide" imageScale={1.13} imageX={-28} imageY={-24} entrance="depth" lines={[
        {text: 'KHI DỮ KIỆN', size: 132},
        {text: 'CÒN THIẾU', size: 174, gold: true},
      ]} />
    </Sequence>
    <Sequence from={120} durationInFrames={33} name="BEAT 04 · Macro plausible answer">
      <HeroBeat lineHeight={lineHeight} image="shot-02-locked-certainty.png" tone="macro" imageScale={1.28} imageX={-108} imageY={-56} entrance="focus" lines={[
        {text: 'CÂU TRẢ LỜI', size: 118},
        {text: 'NGHE', size: 176},
        {text: 'HỢP LÝ', size: 196, gold: true},
      ]} />
    </Sequence>
    <Sequence from={153} durationInFrames={31} name="BEAT 05 · Bright fracture">
      <HeroBeat lineHeight={lineHeight} image="shot-03-fracture-reveal.png" tone="bright" imageScale={1.1} imageX={-36} imageY={-18} entrance="snap" lines={[
        {text: 'CHƯA CHẮC', size: 160},
        {text: 'ĐÃ ĐÚNG', size: 204, gold: true},
      ]} />
    </Sequence>
    <Sequence from={184} durationInFrames={38} name="BEAT 06 · Typography-first consequence">
      <HeroBeat lineHeight={lineHeight} image="shot-07-missing-causal-bridge.png" tone="type-first" imageScale={1.07} imageX={-18} imageY={18} entrance="depth" lines={[
        {text: 'NGHE HỢP LÝ', size: 126},
        {text: 'CHƯA CHẮC', size: 160},
        {text: 'ĐÚNG', size: 232, gold: true},
      ]} />
    </Sequence>
    <Sequence from={222} durationInFrames={58} name="BEAT 07 · 20 percent hero">
      <HeroBeat lineHeight={lineHeight} image="shot-05-unsupported-leap.png" tone="minimal" imageScale={1.1} imageX={-24} entrance="snap" lines={[
        {text: 'DOANH THU', size: 132},
        {text: 'GIẢM', size: 186},
        {text: '20%', size: 326, gold: true, tracking: '-0.075em'},
      ]} />
    </Sequence>
    <Sequence from={280} durationInFrames={60} name="BEAT 08 · Wide advertising fact">
      <HeroBeat lineHeight={lineHeight} image="shot-06-parallel-events.png" tone="wide" imageScale={1.07} imageX={-16} imageY={12} entrance="settle" lines={[
        {text: 'CÔNG TY VỪA ĐỔI', size: 102},
        {text: 'MẪU', size: 188},
        {text: 'QUẢNG CÁO', size: 154, gold: true},
      ]} />
    </Sequence>
    <Sequence from={340} durationInFrames={59} name="BEAT 09 · Proximity hero">
      <HeroBeat lineHeight={lineHeight} image="shot-07-missing-causal-bridge.png" tone="dense" imageScale={1.14} imageX={-68} imageY={-30} entrance="focus" lines={[
        {text: 'HAI VIỆC', size: 174},
        {text: 'XẢY RA', size: 202},
        {text: 'GẦN NHAU', size: 178, gold: true},
      ]} />
    </Sequence>

    <Sequence from={37} durationInFrames={10}><TransitionBridge kind="object" /></Sequence>
    <Sequence from={79} durationInFrames={10}><TransitionBridge kind="match" /></Sequence>
    <Sequence from={115} durationInFrames={10}><TransitionBridge kind="type" /></Sequence>
    <Sequence from={148} durationInFrames={10}><TransitionBridge kind="fracture" /></Sequence>
    <Sequence from={179} durationInFrames={10}><TransitionBridge kind="aperture" /></Sequence>
    <Sequence from={217} durationInFrames={10}><TransitionBridge kind="impact" /></Sequence>
    <Sequence from={275} durationInFrames={10}><TransitionBridge kind="vertical" /></Sequence>
    <Sequence from={335} durationInFrames={10}><TransitionBridge kind="extrusion" /></Sequence>

    <Texture />
    <Audio src={staticFile('voice/CKAI-0004/v5/master.wav')} volume={1} />
  </AbsoluteFill>
);

export const GoldenTypographyHeroV141 = () => <GoldenTypographyHeroV14 lineHeight={1.12} />;
