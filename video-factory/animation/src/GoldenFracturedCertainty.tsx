import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 0.82, 0.18, 1);

const imagePath = 'golden/CKAI-0004/sprint-01/selected-styleframe/A-selected.png';

const labelBase: React.CSSProperties = {
  position: 'absolute',
  color: '#f3eadc',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  textShadow: '0 2px 24px rgba(0,0,0,.9)',
};

const EditorialLabel = ({
  children,
  left,
  right,
  top,
  bottom,
  opacity,
  size = 30,
}: React.PropsWithChildren<{
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  opacity: number;
  size?: number;
}>) => (
  <div style={{...labelBase, left, right, top, bottom, opacity, fontSize: size}}>{children}</div>
);

export const GoldenFracturedCertainty = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const reveal = interpolate(t, [0, 0.45, 1.45], [0, 0.28, 1], {...clamp, easing: ease});
  const fracture = interpolate(t, [2.18, 2.72, 4.35], [0, 0.45, 1], {...clamp, easing: ease});
  const travel = interpolate(t, [4.25, 6.3, 8.35], [0, 0.55, 1], {...clamp, easing: ease});
  const inference = interpolate(t, [8.55, 10.45, 11.5], [0, 0.88, 1], {...clamp, easing: ease});
  const fail = interpolate(t, [11.5, 12.1, 13.7], [0, 1, 1], {...clamp, easing: ease});

  const cameraScale = interpolate(t, [0, 2.2, 4.4, 8.4, 14], [1.17, 1.08, 1.13, 1.42, 1.5], {...clamp, easing: ease});
  const cameraX = interpolate(t, [0, 4.4, 8.4, 14], [-18, -8, 42, 48], {...clamp, easing: ease});
  const cameraY = interpolate(t, [0, 4.4, 8.4, 14], [26, 4, -82, -90], {...clamp, easing: ease});
  const pulse = Math.sin(frame * 0.52) * (fracture > 0.15 && fracture < 0.92 ? 1.6 : 0);

  const planeStyle: React.CSSProperties = {
    position: 'absolute',
    inset: -90,
    width: 'calc(100% + 180px)',
    height: 'calc(100% + 180px)',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    transformOrigin: '50% 50%',
    filter: `brightness(${0.54 + reveal * 0.38}) contrast(1.18) saturate(.72)`,
  };

  const evidenceOpacity = interpolate(t, [4.6, 5.15, 8.3, 9.1], [0, 1, 1, 0.48], clamp);
  const inferenceOpacity = interpolate(t, [5.4, 6.1, 8.4, 9.2], [0, 0.76, 0.76, 0.28], clamp);
  const unknownOpacity = interpolate(t, [6.4, 7.1, 9.5, 11.65], [0, 1, 0.8, 0], clamp);
  const openLoopOpacity = interpolate(t, [12.0, 12.7, 14], [0, 1, 1], {...clamp, easing: ease});

  return (
    <AbsoluteFill style={{backgroundColor: '#020303', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `translate3d(${cameraX}px, ${cameraY}px, 0) scale(${cameraScale})`,
          transformOrigin: '50% 52%',
        }}
      >
        <Img
          src={staticFile(imagePath)}
          style={{
            ...planeStyle,
            clipPath: 'polygon(0 0, 100% 0, 100% 43%, 58% 58%, 46% 100%, 0 100%)',
            transform: `translate3d(${-fracture * 28 + pulse}px, ${fracture * 34}px, 0) rotate(${fracture * -0.42}deg)`,
          }}
        />
        <Img
          src={staticFile(imagePath)}
          style={{
            ...planeStyle,
            clipPath: 'polygon(100% 39%, 100% 100%, 45% 100%, 57% 56%)',
            transform: `translate3d(${fracture * 31 - pulse}px, ${-fracture * 42}px, 0) rotate(${fracture * 0.62}deg)`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 48% 57%, rgba(204,154,92,.11) 0%, rgba(0,0,0,0) 25%), linear-gradient(180deg, rgba(0,0,0,.24), rgba(0,0,0,.06) 44%, rgba(0,0,0,.58))',
          opacity: reveal,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 462,
          top: 555,
          width: 24 + fracture * 92,
          height: 820,
          transform: `rotate(25deg) translateY(${-travel * 35}px)`,
          transformOrigin: '50% 0%',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,.82) 24%, #000 52%, rgba(0,0,0,.76) 78%, transparent)',
          boxShadow: `0 0 ${28 + fracture * 44}px rgba(0,0,0,.84), inset 1px 0 rgba(231,184,117,${0.18 * fracture})`,
          filter: 'blur(3px)',
          opacity: fracture * 0.82,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 186,
          top: 1108,
          width: 560 * inference,
          height: 26,
          transform: `rotate(-22deg) translateY(${fail * 38}px) rotate(${fail * 2.8}deg)`,
          transformOrigin: '0 50%',
          opacity: interpolate(t, [8.5, 9.2, 13.4, 14], [0, 0.88, 0.68, 0], clamp),
          background: 'linear-gradient(90deg, rgba(218,176,112,.12), rgba(233,202,158,.72) 15%, rgba(204,225,224,.24) 67%, rgba(255,255,255,0) 100%)',
          borderTop: '1px solid rgba(255,234,201,.72)',
          boxShadow: '0 -2px 18px rgba(226,176,104,.18)',
          clipPath: 'polygon(0 5%, 94% 0, 100% 50%, 94% 100%, 0 86%)',
        }}
      />

      <EditorialLabel left={92} bottom={252} opacity={interpolate(t, [0.55, 1.15, 3.9, 4.55], [0, 0.88, 0.7, 0], clamp)} size={24}>
        Dữ kiện
      </EditorialLabel>
      <EditorialLabel right={76} top={258} opacity={interpolate(t, [0.9, 1.5, 3.75, 4.45], [0, 0.82, 0.52, 0], clamp)} size={24}>
        Kết luận
      </EditorialLabel>

      <EditorialLabel left={72} bottom={300} opacity={evidenceOpacity} size={32}>
        Dữ kiện
      </EditorialLabel>
      <div style={{position: 'absolute', left: 72, bottom: 250, width: 142, height: 2, background: '#dab47a', opacity: evidenceOpacity}} />

      <EditorialLabel right={62} top={274} opacity={inferenceOpacity} size={29}>
        Suy luận
      </EditorialLabel>
      <div
        style={{
          position: 'absolute',
          left: 431,
          top: 870,
          width: 380,
          color: '#cabda9',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 26,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          transform: 'rotate(25deg)',
          opacity: unknownOpacity,
          textShadow: '0 3px 20px #000',
        }}
      >
        Chưa biết
      </div>

      <div
        style={{
          position: 'absolute',
          left: 76,
          right: 76,
          bottom: 148,
          color: '#f4ecdf',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 54,
          fontWeight: 750,
          lineHeight: 1.04,
          letterSpacing: '-.025em',
          opacity: openLoopOpacity,
          transform: `translateY(${(1 - openLoopOpacity) * 24}px)`,
          textShadow: '0 3px 30px rgba(0,0,0,.95)',
        }}
      >
        Chưa đủ dữ kiện.
        <span style={{display: 'block', marginTop: 14, color: '#d2ae77', fontSize: 22, letterSpacing: '.18em', textTransform: 'uppercase'}}>
          Mối liên hệ vẫn còn thiếu
        </span>
      </div>

      <AbsoluteFill
        style={{
          opacity: 0.11,
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,.22) 0 0.6px, transparent .8px), radial-gradient(circle at 70% 60%, rgba(255,255,255,.16) 0 0.5px, transparent .7px)',
          backgroundSize: '5px 5px, 7px 7px',
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 180px 70px rgba(0,0,0,.78)', pointerEvents: 'none'}} />
      <Audio src={staticFile('voice/CKAI-0004/v5/master.wav')} volume={1} />
    </AbsoluteFill>
  );
};
