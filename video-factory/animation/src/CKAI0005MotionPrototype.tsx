import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 0.84, 0.2, 1);
const snap = Easing.bezier(0.12, 0.9, 0.16, 1);

const root = 'golden/CKAI-0005/creative-upgrade-day/styleframes';
const assets = {
  a: `${root}/A/CKAI-0005-styleframe-A-perfect-surface.png`,
  b: `${root}/B/CKAI-0005-styleframe-B-pattern-assembly.png`,
  c: `${root}/C/CKAI-0005-styleframe-C-context-stress-test.png`,
  d: `${root}/D/CKAI-0005-styleframe-D-hollow-core-reveal.png`,
};

const contentStage: React.CSSProperties = {
  position: 'absolute',
  left: 64,
  top: 400,
  width: 940,
  height: 880,
};

const Gold = ({children}: React.PropsWithChildren) => (
  <span style={{color: '#e6ba76', textShadow: '0 0 36px rgba(230,178,99,.34), 0 8px 48px rgba(0,0,0,.92)'}}>
    {children}
  </span>
);

const Headline = ({children, dark = false, align = 'left', size = 112}: React.PropsWithChildren<{
  dark?: boolean;
  align?: 'left' | 'center';
  size?: number;
}>) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 4, 11], [0, 0.78, 1], {...clamp, easing: ease});
  const settle = interpolate(frame, [0, 11], [34, 0], {...clamp, easing: ease});
  return (
    <div style={contentStage}>
      <div
        style={{
          position: 'absolute',
          left: align === 'center' ? 0 : 12,
          top: 0,
          width: align === 'center' ? 940 : 880,
          height: 810,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: align === 'center' ? 'center' : 'flex-start',
          color: dark ? '#16120d' : '#f7f1e8',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.12,
          letterSpacing: '-0.06em',
          textTransform: 'uppercase',
          textAlign: align,
          opacity: enter,
          transform: `translate3d(0, ${settle}px, 0)`,
          textShadow: dark ? '0 3px 24px rgba(255,255,255,.34)' : '0 8px 48px rgba(0,0,0,.96)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Texture = () => (
  <>
    <AbsoluteFill style={{opacity: 0.045, backgroundImage: 'radial-gradient(circle at 20% 25%, rgba(255,255,255,.22) 0 .55px, transparent .8px), radial-gradient(circle at 72% 62%, rgba(255,255,255,.12) 0 .5px, transparent .75px)', backgroundSize: '5px 5px, 7px 7px', mixBlendMode: 'soft-light'}} />
    <AbsoluteFill style={{boxShadow: 'inset 0 0 150px 40px rgba(0,0,0,.48)'}} />
  </>
);

const PerfectSurface = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 3, 14], [0, 0.72, 1], {...clamp, easing: ease});
  const lock = interpolate(frame, [0, 7, 18], [0, 0.76, 1], {...clamp, easing: snap});
  const sweep = interpolate(frame, [4, 18, 31], [-380, 480, 1440], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const clips = [
    {clipPath: 'polygon(0 0, 34% 0, 34% 100%, 0 100%)', x: -78 * (1 - lock)},
    {clipPath: 'polygon(33% 0, 67% 0, 67% 100%, 33% 100%)', x: 0},
    {clipPath: 'polygon(66% 0, 100% 0, 100% 100%, 66% 100%)', x: 78 * (1 - lock)},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#050505', overflow: 'hidden'}}>
      {clips.map((panel, index) => (
        <Img key={index} src={staticFile(assets.a)} style={{position: 'absolute', inset: -8, width: 1096, height: 1936, objectFit: 'cover', clipPath: panel.clipPath, transform: `translate3d(${panel.x}px, ${18 - reveal * 18}px, 0) scale(${1.04 - reveal * 0.02})`, filter: `brightness(${0.62 + reveal * 0.36}) contrast(1.14) saturate(.82)`}} />
      ))}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.84), rgba(0,0,0,.42) 58%, rgba(0,0,0,.08)), linear-gradient(180deg, rgba(0,0,0,.18), transparent 34%, rgba(0,0,0,.36))'}} />
      <div style={{position: 'absolute', left: sweep, top: -180, width: 86, height: 2300, transform: 'rotate(15deg)', background: 'linear-gradient(90deg, transparent, rgba(255,244,220,.5), transparent)', filter: 'blur(8px)', mixBlendMode: 'screen'}} />
      <Headline size={116}><div><Gold>A.I</Gold> CÓ THỂ</div><div>TRẢ LỜI</div><div>ĐÚNG.</div></Headline>
    </AbsoluteFill>
  );
};

const PatternAssembly = () => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [0, 72], [-56, 52], {...clamp, easing: Easing.inOut(Easing.quad)});
  const align = interpolate(frame, [3, 24, 42], [0, 0.76, 1], {...clamp, easing: snap});
  return (
    <AbsoluteFill style={{backgroundColor: '#050403', overflow: 'hidden'}}>
      <Img src={staticFile(assets.b)} style={{position: 'absolute', inset: -90, width: 1260, height: 2100, objectFit: 'cover', transform: `translate3d(${travel}px, ${22 - travel * 0.22}px, 0) scale(1.05)`, filter: 'brightness(.72) contrast(1.25) saturate(.74)'}} />
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const width = 190;
        const left = 70 + index * 168;
        const offset = (index % 2 === 0 ? -1 : 1) * (72 + index * 8) * (1 - align);
        return <Img key={index} src={staticFile(assets.b)} style={{position: 'absolute', inset: -90, width: 1260, height: 2100, objectFit: 'cover', clipPath: `polygon(${left / 12.6}% 0, ${(left + width) / 12.6}% 0, ${(left + width) / 12.6}% 100%, ${left / 12.6}% 100%)`, transform: `translate3d(${travel + offset}px, ${22 - travel * 0.22 + (1 - align) * (index - 2.5) * 12}px, 0) scale(1.05)`, filter: 'brightness(1.02) contrast(1.2) saturate(.78)'}} />;
      })}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.86), rgba(0,0,0,.5) 63%, rgba(0,0,0,.05)), linear-gradient(180deg, rgba(0,0,0,.12), transparent 56%, rgba(0,0,0,.54))'}} />
      <Headline size={104}><div>CÓ KHI</div><div>CHỈ VÌ NÓ</div><div><Gold>BẮT ĐƯỢC MẪU.</Gold></div></Headline>
    </AbsoluteFill>
  );
};

const ContextChange = () => {
  const frame = useCurrentFrame();
  const withdraw = interpolate(frame, [8, 20, 46], [0, 0.32, 1], {...clamp, easing: ease});
  const doubt = interpolate(frame, [24, 52, 72], [0, 0.7, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{backgroundColor: '#e9e5dc', overflow: 'hidden'}}>
      <Img src={staticFile(assets.c)} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', clipPath: 'polygon(0 0, 58% 0, 58% 100%, 0 100%)', transform: `translate3d(${-withdraw * 18}px, 0, 0) scale(${1.02 + doubt * 0.025})`, transformOrigin: '28% 55%', filter: `brightness(${1 - doubt * 0.12}) contrast(${1.04 + doubt * 0.12}) saturate(.72)`}} />
      <div style={{position: 'absolute', left: 548 - withdraw * 20, top: 330, width: 238 + withdraw * 48, height: 1180, transform: `skewY(-4deg) scaleX(${0.18 + withdraw * 0.82})`, transformOrigin: 'left center', background: 'linear-gradient(90deg, rgba(15,13,10,.94), rgba(49,43,35,.86) 46%, rgba(125,111,91,.34) 78%, transparent)', borderLeft: '2px solid rgba(219,184,131,.48)', boxShadow: 'inset 24px 0 54px rgba(0,0,0,.58), 18px 0 42px rgba(0,0,0,.22)', opacity: interpolate(frame, [8, 26, 70], [0, 0.82, 0.96], clamp)}} />
      <Img src={staticFile(assets.c)} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', clipPath: 'polygon(48% 0, 100% 0, 100% 100%, 48% 100%)', transform: `translate3d(${withdraw * 150}px, ${-withdraw * 14}px, 0) rotate(${withdraw * 1.7}deg)`, transformOrigin: '74% 52%', filter: 'brightness(1.06) contrast(1.08) saturate(.76)', boxShadow: '-18px 0 55px rgba(27,20,11,.26)'}} />
      <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(255,251,241,.08), rgba(255,251,241,.36) 58%, rgba(0,0,0,${0.1 + doubt * 0.18}))`}} />
      <div style={{position: 'absolute', right: 78 + withdraw * 78, top: 1210 - withdraw * 20, color: '#9b6b30', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 800, fontSize: 24, letterSpacing: '.18em', textTransform: 'uppercase', opacity: interpolate(frame, [12, 22, 68], [0, 1, 0.72], clamp), transform: `rotate(${withdraw * 1.7}deg)`}}>GIẢ ĐỊNH</div>
      <Headline dark size={112}><div>NHƯNG THỬ</div><div><Gold>ĐỔI NGỮ CẢNH.</Gold></div></Headline>
    </AbsoluteFill>
  );
};

const CoreTest = () => {
  const frame = useCurrentFrame();
  const approach = interpolate(frame, [0, 72, 94], [0, 0.82, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const retract = interpolate(frame, [26, 54, 86], [0, 0.52, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{backgroundColor: '#070604', overflow: 'hidden'}}>
      <Img src={staticFile(assets.c)} style={{position: 'absolute', inset: -110, width: 1300, height: 2140, objectFit: 'cover', transform: `translate3d(${-90 - approach * 220}px, ${approach * 18}px, 0) scale(${1.2 + approach * 0.34})`, transformOrigin: '28% 52%', filter: `brightness(${0.82 - approach * 0.22}) contrast(1.28) saturate(.64)`}} />
      <div style={{position: 'absolute', left: 360 - approach * 95, top: 452, width: 480 + approach * 240, height: 900, borderRadius: '48% 52% 44% 56%', background: `radial-gradient(ellipse at 42% 48%, rgba(0,0,0,${0.64 + approach * 0.28}) 0%, rgba(7,6,4,.72) 43%, transparent 72%)`, filter: 'blur(10px)'}} />
      {[0, 1, 2, 3].map((index) => (
        <div key={index} style={{position: 'absolute', left: 410 + index * 34 - retract * (70 + index * 22), top: 675 + index * 92, width: 390 - index * 40, height: 7, borderRadius: 99, background: 'linear-gradient(90deg, rgba(242,222,190,.04), rgba(220,181,119,.72), rgba(120,113,99,.08))', boxShadow: '0 0 18px rgba(222,178,108,.2)', opacity: 0.78 - index * 0.11}} />
      ))}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.78), rgba(0,0,0,.28) 68%, rgba(0,0,0,.08)), linear-gradient(180deg, rgba(0,0,0,.24), transparent 48%, rgba(0,0,0,.56))'}} />
      <Headline size={104}><div>NẾU THỰC SỰ</div><div><Gold>HIỂU...</Gold></div></Headline>
    </AbsoluteFill>
  );
};

const HollowCore = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 9, 30], [0, 0.62, 1], {...clamp, easing: ease});
  const settle = interpolate(frame, [0, 58, 104], [1.075, 1.025, 1.015], {...clamp, easing: Easing.out(Easing.cubic)});
  const absence = interpolate(frame, [22, 48, 76], [0.5, 0.88, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{backgroundColor: '#030302', overflow: 'hidden'}}>
      <Img src={staticFile(assets.d)} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', transform: `translate3d(0, ${18 - reveal * 18}px, 0) scale(${settle})`, filter: `brightness(${0.7 + reveal * 0.25}) contrast(1.2) saturate(.72)`}} />
      <div style={{position: 'absolute', left: 356, top: 550, width: 368, height: 540, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(0,0,0,${absence}) 0%, rgba(0,0,0,${absence * 0.92}) 54%, transparent 72%)`, filter: 'blur(8px)', boxShadow: `0 0 ${40 + absence * 70}px rgba(0,0,0,.95)`}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.8), rgba(0,0,0,.42) 62%, rgba(0,0,0,.08)), linear-gradient(180deg, rgba(0,0,0,.18), transparent 52%, rgba(0,0,0,.62))'}} />
      <Headline size={100}><div>PHẦN LÕI</div><div>CÓ THỰC SỰ</div><div><Gold>HIỂU KHÔNG?</Gold></div></Headline>
      <div style={{position: 'absolute', left: 64, top: 1310, width: 112, height: 7, borderRadius: 99, background: 'linear-gradient(90deg, #8c6031, #f0c989)', boxShadow: '0 0 28px rgba(229,177,103,.32)', opacity: interpolate(frame, [22, 36, 96, 104], [0, 1, 1, 0], clamp)}} />
    </AbsoluteFill>
  );
};

const ShellEdgeWipe = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <div style={{position: 'absolute', left: -530 + p * 1780, top: -250, width: 430, height: 2420, transform: 'rotate(13deg)', background: 'linear-gradient(90deg, #020202, #171511 20%, #f4eee4 45%, #bf9b66 51%, #191612 62%, #020202)', boxShadow: '0 0 72px rgba(238,210,167,.38)'}} />;
};

const ContextCut = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 8], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{background: `linear-gradient(${102 - p * 12}deg, #050403 ${48 - p * 44}%, #f1ede4 ${50 - p * 8}%, #e4ded3 100%)`, clipPath: `polygon(0 0, ${38 + p * 62}% 0, ${10 + p * 90}% 100%, 0 100%)`}} />;
};

const ShellOpening = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 20], [0, 1], {...clamp, easing: ease});
  const inner = interpolate(frame, [5, 22], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -110 - p * 500, top: -100, width: 700, height: 2150, borderRadius: '0 52% 52% 0', background: 'linear-gradient(90deg, #11100d, #e9e0d2 70%, #bc9259 84%, #16130f)', boxShadow: '20px 0 70px rgba(0,0,0,.72)'}} />
      <div style={{position: 'absolute', right: -110 - p * 500, top: -100, width: 700, height: 2150, borderRadius: '52% 0 0 52%', background: 'linear-gradient(90deg, #16130f, #bc9259 16%, #e9e0d2 30%, #11100d)', boxShadow: '-20px 0 70px rgba(0,0,0,.72)'}} />
      {[0, 1, 2].map((index) => <div key={index} style={{position: 'absolute', left: 220 + index * 58 - inner * (170 + index * 48), right: 220 + index * 58 - inner * (170 + index * 48), top: 520 + index * 104, height: 14, borderRadius: 99, background: 'linear-gradient(90deg, transparent, rgba(237,211,170,.78), rgba(85,75,61,.2), rgba(237,211,170,.78), transparent)', opacity: 1 - inner * 0.72}} />)}
    </AbsoluteFill>
  );
};

export const CKAI0005MotionPrototype = () => (
  <AbsoluteFill style={{backgroundColor: '#030302'}}>
    <Sequence from={0} durationInFrames={74} name="01 · Perfect surface"><PerfectSurface /></Sequence>
    <Sequence from={66} durationInFrames={84} name="02 · Pattern assembly"><PatternAssembly /></Sequence>
    <Sequence from={144} durationInFrames={82} name="03 · Change context"><ContextChange /></Sequence>
    <Sequence from={216} durationInFrames={96} name="04 · Test core"><CoreTest /></Sequence>
    <Sequence from={300} durationInFrames={105} name="05 · Hollow core"><HollowCore /></Sequence>

    <Sequence from={62} durationInFrames={13} name="Transition · shell edge"><ShellEdgeWipe /></Sequence>
    <Sequence from={138} durationInFrames={9} name="Transition · hard reframe"><ContextCut /></Sequence>
    <Sequence from={292} durationInFrames={23} name="Transition · shell opening"><ShellOpening /></Sequence>
    <Texture />
  </AbsoluteFill>
);
