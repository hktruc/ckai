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
const assetRoot = 'golden/CKAI-0004/sprint-01-3/shot-assets';

// Product Owner content-stage interpretation for the supplied text-only brief:
// x=64..1004, y=400..1280. App chrome stays above; page/caption chrome stays below.
const contentStage: React.CSSProperties = {
  position: 'absolute',
  left: 64,
  top: 400,
  width: 940,
  height: 880,
};

type BeatProps = {
  image: string;
  children: React.ReactNode;
  imageScale?: number;
  imageX?: number;
  imageY?: number;
  focus?: string;
  textScale?: number;
  entrance?: 'settle' | 'snap' | 'focus' | 'depth';
};

const Gold = ({children}: React.PropsWithChildren) => (
  <span style={{color: '#e7be82', textShadow: '0 0 34px rgba(226,174,98,.28)'}}>{children}</span>
);

const Beat = ({
  image,
  children,
  imageScale = 1.08,
  imageX = 0,
  imageY = 0,
  focus = '50% 50%',
  textScale = 1,
  entrance = 'settle',
}: BeatProps) => {
  const frame = useCurrentFrame();
  const textIn = interpolate(frame, entrance === 'snap' ? [0, 2, 6] : [0, 5, 10], [0, 0.82, 1], {
    ...clamp,
    easing: ease,
  });
  const textShift = interpolate(frame, [0, entrance === 'snap' ? 5 : 9], [entrance === 'depth' ? 0 : 32, 0], {
    ...clamp,
    easing: ease,
  });
  const backgroundDrift = interpolate(frame, [0, 60], [0, entrance === 'focus' ? 30 : 16], clamp);
  const focusBlur = entrance === 'focus' ? interpolate(frame, [0, 4, 10], [7, 2, 0], clamp) : 0;
  const impact = interpolate(frame, [0, 2, 7], [entrance === 'snap' ? 0.28 : 0.13, 0.06, 0], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#020303', overflow: 'hidden'}}>
      <Img
        src={staticFile(`${assetRoot}/${image}`)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: focus,
          transform: `translate3d(${imageX + backgroundDrift}px, ${imageY - backgroundDrift * 0.3}px, 0) scale(${imageScale + frame * 0.00042})`,
          filter: `brightness(.88) contrast(1.2) saturate(.74) blur(${focusBlur}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,.84) 0%, rgba(0,0,0,.67) 52%, rgba(0,0,0,.12) 88%), linear-gradient(180deg, rgba(0,0,0,.18), transparent 30%, rgba(0,0,0,.34))',
        }}
      />
      <div style={contentStage}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 900,
            height: 650,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            opacity: textIn,
            transform: `translateY(${textShift}px) scale(${textScale})`,
            transformOrigin: 'left center',
          }}
        >
          <div
            style={{
              width: 96,
              height: 7,
              marginBottom: 28,
              borderRadius: 999,
              background: 'linear-gradient(90deg, #956737, #f2ce94)',
              boxShadow: '0 0 30px rgba(226,177,105,.32)',
              transform: `scaleX(${textIn})`,
              transformOrigin: 'left',
            }}
          />
          <div
            style={{
              color: '#f6f0e8',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 850,
              fontSize: 92,
              lineHeight: 0.96,
              letterSpacing: '-0.046em',
              textTransform: 'uppercase',
              textAlign: 'left',
              textShadow: '0 6px 40px rgba(0,0,0,.98)',
            }}
          >
            {children}
          </div>
        </div>
      </div>
      <AbsoluteFill style={{background: `rgba(255,232,198,${impact})`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

type BridgeKind = 'object' | 'match' | 'type' | 'fracture' | 'aperture' | 'impact' | 'vertical' | 'extrusion';

const TransitionBridge = ({kind}: {kind: BridgeKind}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 9], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const pulse = interpolate(frame, [0, 4, 9], [0, 1, 0], clamp);

  if (kind === 'object') {
    return (
      <div style={{position: 'absolute', inset: '-200px -330px', transform: `translateX(${-1450 + progress * 2840}px) rotate(-12deg)`, background: 'linear-gradient(90deg, #020303, #111313 38%, #382c20 49%, #111313 55%, #020303)', boxShadow: '0 0 42px rgba(221,174,109,.28)'}} />
    );
  }

  if (kind === 'match') {
    return (
      <div style={{position: 'absolute', left: -480 + progress * 1900, top: -380, width: 250, height: 2700, transform: 'rotate(28deg)', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,.92), #d2a56b, rgba(0,0,0,.94), transparent)', filter: 'blur(4px)', opacity: pulse}} />
    );
  }

  if (kind === 'type') {
    const scale = interpolate(frame, [0, 4, 9], [0.55, 2.4, 5.8], {...clamp, easing: ease});
    return (
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', opacity: pulse}}>
        <div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 900, fontSize: 170, letterSpacing: '-.06em', color: '#f5eadb', transform: `scale(${scale})`, textShadow: '0 0 50px #000'}}>HỢP LÝ</div>
      </AbsoluteFill>
    );
  }

  if (kind === 'fracture') {
    const split = interpolate(frame, [0, 4, 9], [0, 1, 2.2], clamp);
    return (
      <AbsoluteFill style={{opacity: pulse}}>
        <div style={{position: 'absolute', inset: 0, background: '#080807', clipPath: 'polygon(0 0, 57% 0, 49% 46%, 43% 100%, 0 100%)', transform: `translate(${-split * 40}px, ${split * 24}px)`}} />
        <div style={{position: 'absolute', inset: 0, background: '#15120e', clipPath: 'polygon(57% 0, 100% 0, 100% 100%, 43% 100%, 49% 46%)', transform: `translate(${split * 44}px, ${-split * 28}px)`}} />
        <div style={{position: 'absolute', left: 475, top: 200, width: 80, height: 1450, transform: 'rotate(12deg)', background: 'linear-gradient(90deg, transparent, #e0b477, transparent)', filter: 'blur(7px)'}} />
      </AbsoluteFill>
    );
  }

  if (kind === 'aperture') {
    const radius = interpolate(frame, [0, 4, 9], [92, 5, 92], {...clamp, easing: ease});
    return <AbsoluteFill style={{background: `radial-gradient(circle at 53% 49%, transparent ${radius}%, rgba(0,0,0,.98) ${Math.min(radius + 9, 100)}%)`}} />;
  }

  if (kind === 'impact') {
    return <AbsoluteFill style={{background: `rgba(241,208,158,${pulse * 0.45})`, mixBlendMode: 'screen'}} />;
  }

  if (kind === 'vertical') {
    return (
      <div style={{position: 'absolute', left: -420 + progress * 1800, top: -80, width: 360, height: 2100, background: 'linear-gradient(90deg, #020303, #151514 65%, #e3b674 69%, #171614 72%, #020303)', boxShadow: '0 0 35px rgba(228,179,108,.25)'}} />
    );
  }

  return (
    <div style={{position: 'absolute', left: -960 + progress * 2150, top: 680, width: 1550, height: 150, transform: 'rotate(-32deg)', background: 'linear-gradient(180deg, rgba(0,0,0,.9), rgba(236,194,134,.68), rgba(0,0,0,.94))', filter: 'blur(3px)', opacity: pulse, boxShadow: '0 0 60px rgba(227,175,105,.34)'}} />
  );
};

const Texture = () => (
  <>
    <AbsoluteFill style={{opacity: 0.06, backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,.2) 0 .55px, transparent .75px), radial-gradient(circle at 65% 65%, rgba(255,255,255,.12) 0 .5px, transparent .7px)', backgroundSize: '5px 5px, 7px 7px', mixBlendMode: 'soft-light'}} />
    <AbsoluteFill style={{boxShadow: 'inset 0 0 145px 44px rgba(0,0,0,.55)'}} />
  </>
);

export const GoldenFacebookRealV13 = () => (
  <AbsoluteFill style={{backgroundColor: '#020303'}}>
    <Sequence from={0} durationInFrames={42} name="BEAT 01 · Opening question">
      <Beat image="shot-01-apparent-continuity.png" imageScale={1.13} imageX={-45} imageY={18} entrance="snap">
        ĐỪNG HỎI <Gold>A.I</Gold>:<br />“NGUYÊN NHÂN<br />LÀ GÌ?”
      </Beat>
    </Sequence>
    <Sequence from={42} durationInFrames={42} name="BEAT 02 · Plausible question">
      <Beat image="shot-02-locked-certainty.png" imageScale={1.08} imageX={-12} entrance="settle">
        CÂU HỎI NGHE<br /><Gold>RẤT HỢP LÝ</Gold>
      </Beat>
    </Sequence>
    <Sequence from={84} durationInFrames={36} name="BEAT 03 · Missing data">
      <Beat image="shot-04-missing-volume.png" imageScale={1.14} imageX={-28} imageY={-24} entrance="depth">
        KHI DỮ KIỆN<br /><Gold>CÒN THIẾU</Gold>
      </Beat>
    </Sequence>
    <Sequence from={120} durationInFrames={33} name="BEAT 04 · Plausible answer">
      <Beat image="shot-02-locked-certainty.png" imageScale={1.23} imageX={-96} imageY={-50} entrance="focus">
        CÂU TRẢ LỜI<br />VẪN NGHE<br /><Gold>HỢP LÝ</Gold>
      </Beat>
    </Sequence>
    <Sequence from={153} durationInFrames={31} name="BEAT 05 · Fracture">
      <Beat image="shot-03-fracture-reveal.png" imageScale={1.1} imageX={-36} imageY={-18} entrance="snap">
        NHƯNG CHƯA CHẮC<br /><Gold>ĐÃ ĐÚNG</Gold>
      </Beat>
    </Sequence>
    <Sequence from={184} durationInFrames={38} name="BEAT 06 · Consequence">
      <Beat image="shot-07-missing-causal-bridge.png" imageScale={1.08} imageX={-22} imageY={18} entrance="depth" textScale={0.94}>
        NGHE HỢP LÝ<br />KHÔNG CÓ NGHĨA<br /><Gold>LÀ ĐÚNG</Gold>
      </Beat>
    </Sequence>
    <Sequence from={222} durationInFrames={58} name="BEAT 07 · Revenue fact">
      <Beat image="shot-05-unsupported-leap.png" imageScale={1.11} imageX={-26} entrance="snap">
        DOANH THU<br /><Gold>GIẢM 20%</Gold>
      </Beat>
    </Sequence>
    <Sequence from={280} durationInFrames={60} name="BEAT 08 · Advertising fact">
      <Beat image="shot-06-parallel-events.png" imageScale={1.08} imageX={-20} imageY={14} entrance="settle" textScale={0.94}>
        CÔNG TY VỪA ĐỔI<br /><Gold>MẪU QUẢNG CÁO</Gold>
      </Beat>
    </Sequence>
    <Sequence from={340} durationInFrames={59} name="BEAT 09 · Proximity without bridge">
      <Beat image="shot-07-missing-causal-bridge.png" imageScale={1.14} imageX={-68} imageY={-30} entrance="focus">
        HAI VIỆC XẢY RA<br /><Gold>GẦN NHAU</Gold>
      </Beat>
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
