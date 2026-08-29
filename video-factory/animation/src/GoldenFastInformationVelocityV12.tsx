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
const easeOut = Easing.bezier(0.16, 0.86, 0.18, 1);
const assetRoot = 'golden/CKAI-0004/sprint-01-2/shot-assets';

type Placement = 'top' | 'middle' | 'bottom';

type BeatProps = {
  image: string;
  children: React.ReactNode;
  placement?: Placement;
  align?: 'left' | 'right';
  accent?: React.ReactNode;
  imageScale?: number;
  imageX?: number;
  imageY?: number;
  dim?: number;
  wipe?: 'left' | 'right' | 'none';
};

const placementStyle: Record<Placement, React.CSSProperties> = {
  top: {top: 156},
  middle: {top: 708},
  bottom: {bottom: 176},
};

const Beat = ({
  image,
  children,
  placement = 'middle',
  align = 'left',
  accent,
  imageScale = 1.05,
  imageX = 0,
  imageY = 0,
  dim = 0.28,
  wipe = 'none',
}: BeatProps) => {
  const frame = useCurrentFrame();
  const entry = interpolate(frame, [0, 4, 10], [0, 0.7, 1], {...clamp, easing: easeOut});
  const textY = interpolate(frame, [0, 8], [56, 0], {...clamp, easing: easeOut});
  const drift = interpolate(frame, [0, 60], [0, 22], clamp);
  const flash = interpolate(frame, [0, 2, 7], [0.48, 0.18, 0], clamp);
  const wipeX = interpolate(frame, [0, 7], [wipe === 'right' ? -1160 : 1160, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

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
          transform: `translate3d(${imageX + drift}px, ${imageY - drift * 0.35}px, 0) scale(${imageScale + frame * 0.00045})`,
          filter: 'brightness(.84) contrast(1.18) saturate(.74)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            align === 'left'
              ? `linear-gradient(90deg, rgba(0,0,0,${0.72 + dim}) 0%, rgba(0,0,0,.66) 47%, rgba(0,0,0,.06) 83%), linear-gradient(180deg, rgba(0,0,0,.1), transparent 38%, rgba(0,0,0,.28))`
              : `linear-gradient(270deg, rgba(0,0,0,${0.72 + dim}) 0%, rgba(0,0,0,.66) 47%, rgba(0,0,0,.06) 83%), linear-gradient(180deg, rgba(0,0,0,.1), transparent 38%, rgba(0,0,0,.28))`,
        }}
      />
      {wipe !== 'none' ? (
        <div
          style={{
            position: 'absolute',
            inset: '-120px -250px',
            transform: `translateX(${wipeX}px) skewX(-13deg)`,
            background: 'linear-gradient(90deg, transparent 0%, rgba(212,165,100,.1) 47%, rgba(255,231,196,.34) 50%, rgba(212,165,100,.07) 53%, transparent 100%)',
            mixBlendMode: 'screen',
            opacity: interpolate(frame, [0, 4, 9], [0, 1, 0], clamp),
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: align === 'left' ? 72 : 112,
          right: align === 'right' ? 72 : 82,
          width: 916,
          textAlign: align,
          opacity: entry,
          transform: `translateY(${textY}px)`,
          ...placementStyle[placement],
        }}
      >
        <div
          style={{
            width: 94,
            height: 7,
            marginLeft: align === 'right' ? 'auto' : 0,
            marginBottom: 28,
            borderRadius: 999,
            background: 'linear-gradient(90deg, #9d6f39, #f4d29b)',
            boxShadow: '0 0 28px rgba(226,178,111,.36)',
            transform: `scaleX(${entry})`,
            transformOrigin: align,
          }}
        />
        <div
          style={{
            color: '#f5efe6',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontWeight: 850,
            fontSize: 96,
            lineHeight: 0.94,
            letterSpacing: '-0.048em',
            textTransform: 'uppercase',
            textWrap: 'balance',
            textShadow: '0 6px 38px rgba(0,0,0,.98)',
          }}
        >
          {children}
        </div>
        {accent ? (
          <div
            style={{
              marginTop: 28,
              color: '#d9b37b',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 750,
              fontSize: 34,
              lineHeight: 1,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              textShadow: '0 4px 24px rgba(0,0,0,.95)',
            }}
          >
            {accent}
          </div>
        ) : null}
      </div>
      <AbsoluteFill style={{background: `rgba(255,232,198,${flash})`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

const Gold = ({children}: React.PropsWithChildren) => (
  <span style={{color: '#e6bd82', textShadow: '0 0 34px rgba(224,171,96,.3)'}}>{children}</span>
);

const Texture = () => (
  <>
    <AbsoluteFill
      style={{
        opacity: 0.065,
        backgroundImage:
          'radial-gradient(circle at 25% 25%, rgba(255,255,255,.22) 0 .55px, transparent .75px), radial-gradient(circle at 65% 65%, rgba(255,255,255,.13) 0 .5px, transparent .7px)',
        backgroundSize: '5px 5px, 7px 7px',
        mixBlendMode: 'soft-light',
      }}
    />
    <AbsoluteFill style={{boxShadow: 'inset 0 0 145px 44px rgba(0,0,0,.55)'}} />
  </>
);

export const GoldenFastInformationVelocityV12 = () => (
  <AbsoluteFill style={{backgroundColor: '#020303'}}>
    <Sequence from={0} durationInFrames={42} name="BEAT 01 · Opening question">
      <Beat image="shot-01-apparent-continuity.png" placement="top" imageScale={1.12} imageX={-42} imageY={30}>
        ĐỪNG HỎI <Gold>A.I</Gold>:<br />“NGUYÊN NHÂN<br />LÀ GÌ?”
      </Beat>
    </Sequence>
    <Sequence from={42} durationInFrames={42} name="BEAT 02 · Plausible question">
      <Beat image="shot-02-locked-certainty.png" placement="top" imageScale={1.08} imageX={-12} wipe="right">
        CÂU HỎI NGHE<br /><Gold>RẤT HỢP LÝ</Gold>
      </Beat>
    </Sequence>
    <Sequence from={84} durationInFrames={36} name="BEAT 03 · Missing data">
      <Beat image="shot-04-missing-volume.png" placement="bottom" imageScale={1.16} imageX={-34} imageY={-26}>
        KHI DỮ KIỆN<br /><Gold>CÒN THIẾU</Gold>
      </Beat>
    </Sequence>
    <Sequence from={120} durationInFrames={33} name="BEAT 04 · Plausible answer">
      <Beat image="shot-02-locked-certainty.png" placement="middle" align="right" imageScale={1.26} imageX={-110} imageY={-54} wipe="left">
        CÂU TRẢ LỜI<br />VẪN NGHE<br /><Gold>HỢP LÝ</Gold>
      </Beat>
    </Sequence>
    <Sequence from={153} durationInFrames={31} name="BEAT 05 · Fracture">
      <Beat image="shot-03-fracture-reveal.png" placement="bottom" imageScale={1.11} imageX={-40} imageY={-18}>
        NHƯNG CHƯA CHẮC<br /><Gold>ĐÃ ĐÚNG</Gold>
      </Beat>
    </Sequence>
    <Sequence from={184} durationInFrames={38} name="BEAT 06 · Consequence">
      <Beat image="shot-07-missing-causal-bridge.png" placement="top" imageScale={1.08} imageX={-22} imageY={25} wipe="right">
        NGHE HỢP LÝ<br />KHÔNG CÓ NGHĨA<br /><Gold>LÀ ĐÚNG</Gold>
      </Beat>
    </Sequence>
    <Sequence from={222} durationInFrames={58} name="BEAT 07 · Revenue fact">
      <Beat image="shot-05-unsupported-leap.png" placement="bottom" imageScale={1.12} imageX={-30}>
        DOANH THU<br /><Gold>GIẢM 20%</Gold>
      </Beat>
    </Sequence>
    <Sequence from={280} durationInFrames={60} name="BEAT 08 · Advertising fact">
      <Beat image="shot-06-parallel-events.png" placement="top" imageScale={1.09} imageX={-25} imageY={20} align="left" wipe="left">
        CÔNG TY VỪA ĐỔI<br /><Gold>MẪU QUẢNG CÁO</Gold>
      </Beat>
    </Sequence>
    <Sequence from={340} durationInFrames={59} name="BEAT 09 · Proximity without bridge">
      <Beat image="shot-07-missing-causal-bridge.png" placement="bottom" imageScale={1.16} imageX={-80} imageY={-34}>
        HAI VIỆC XẢY RA<br /><Gold>GẦN NHAU</Gold>
      </Beat>
    </Sequence>
    <Texture />
    <Audio src={staticFile('voice/CKAI-0004/v5/master.wav')} volume={1} />
  </AbsoluteFill>
);
