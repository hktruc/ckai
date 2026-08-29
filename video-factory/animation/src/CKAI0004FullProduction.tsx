import type {CSSProperties} from 'react';
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
const gold = '#e7bd7e';
const ivory = '#f6f0e8';

type Line = {text: string; size: number; gold?: boolean; tracking?: string};
type Mode = 'cinematic' | 'near-black' | 'macro' | 'wide' | 'split' | 'prompt' | 'proof' | 'aperture';
type Entrance = 'snap' | 'rise' | 'focus' | 'depth';

type BeatProps = {
  plate: string;
  lines: Line[];
  mode?: Mode;
  entrance?: Entrance;
  kicker?: string;
  support?: string;
  truth?: string;
  promptIndex?: number;
  imageScale?: number;
  imageX?: number;
  imageY?: number;
  accent?: 'bar' | 'seam' | 'frame' | 'fracture' | 'aperture';
};

const stage: CSSProperties = {
  position: 'absolute',
  left: 64,
  top: 400,
  width: 940,
  height: 880,
};

const modeStyle: Record<Mode, {opacity: number; brightness: number; contrast: number; overlay: string}> = {
  cinematic: {opacity: 0.92, brightness: 0.92, contrast: 1.3, overlay: 'linear-gradient(90deg, rgba(0,0,0,.84), rgba(0,0,0,.45) 62%, rgba(0,0,0,.08))'},
  'near-black': {opacity: 0.25, brightness: 0.66, contrast: 1.42, overlay: 'linear-gradient(90deg, rgba(0,0,0,.96), rgba(0,0,0,.84) 74%, rgba(0,0,0,.58))'},
  macro: {opacity: 0.95, brightness: 1.03, contrast: 1.4, overlay: 'linear-gradient(90deg, rgba(0,0,0,.87), rgba(0,0,0,.5) 58%, rgba(0,0,0,.08))'},
  wide: {opacity: 0.79, brightness: 0.97, contrast: 1.22, overlay: 'linear-gradient(90deg, rgba(0,0,0,.86), rgba(0,0,0,.36) 65%, rgba(0,0,0,.04))'},
  split: {opacity: 0.86, brightness: 0.9, contrast: 1.36, overlay: 'linear-gradient(90deg, rgba(0,0,0,.94) 0 50%, rgba(0,0,0,.44) 72%, rgba(0,0,0,.12))'},
  prompt: {opacity: 0.36, brightness: 0.7, contrast: 1.46, overlay: 'linear-gradient(90deg, rgba(0,0,0,.96), rgba(0,0,0,.8) 72%, rgba(0,0,0,.54))'},
  proof: {opacity: 0.72, brightness: 0.88, contrast: 1.36, overlay: 'linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,.55) 66%, rgba(0,0,0,.14))'},
  aperture: {opacity: 0.54, brightness: 0.92, contrast: 1.42, overlay: 'radial-gradient(ellipse at 76% 50%, rgba(0,0,0,.08), rgba(0,0,0,.92) 62%, #000 88%)'},
};

const promptDescriptions = [
  'Những điều được cung cấp hoặc có thể xác nhận trực tiếp.',
  'Những giả thuyết hợp lý nhưng chưa được chứng minh.',
  'Thông tin còn thiếu khiến chưa thể kết luận.',
  'Những câu hỏi hoặc dữ liệu cần thu thập tiếp.',
];

const MaterialAccent = ({kind = 'bar'}: {kind?: BeatProps['accent']}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 10], [0, 1], {...clamp, easing: ease});
  if (kind === 'seam') return <div style={{position: 'absolute', left: 790, top: -140, width: 16, height: 2240, transform: `rotate(16deg) scaleY(${p})`, background: 'linear-gradient(90deg, transparent, #f1c681, transparent)', filter: 'blur(1px)', boxShadow: '0 0 42px rgba(231,189,126,.42)'}} />;
  if (kind === 'frame') return <div style={{position: 'absolute', right: -80, top: 230, width: 430, height: 1120, border: '3px solid rgba(231,189,126,.44)', transform: `perspective(900px) rotateY(-18deg) translateX(${(1 - p) * 180}px)`, boxShadow: 'inset 0 0 50px rgba(231,189,126,.12), 0 0 55px rgba(0,0,0,.8)'}} />;
  if (kind === 'fracture') return <div style={{position: 'absolute', left: 620, top: 220, width: 170, height: 1420, clipPath: 'polygon(45% 0, 72% 25%, 48% 44%, 83% 65%, 34% 100%, 45% 68%, 12% 45%, 52% 23%)', background: 'linear-gradient(90deg, transparent, rgba(238,197,132,.72), transparent)', filter: 'blur(2px)', opacity: p}} />;
  if (kind === 'aperture') return <AbsoluteFill style={{background: `radial-gradient(ellipse at 76% 50%, transparent ${10 + p * 25}%, rgba(0,0,0,.93) ${25 + p * 35}%)`}} />;
  return <div style={{position: 'absolute', left: 64, top: 574, width: 108 * p, height: 9, borderRadius: 99, background: 'linear-gradient(90deg, #8f6335, #f3cf94)', boxShadow: '0 0 34px rgba(229,180,108,.38)'}} />;
};

const Beat = ({
  plate,
  lines,
  mode = 'cinematic',
  entrance = 'snap',
  kicker,
  support,
  truth,
  promptIndex,
  imageScale = 1.1,
  imageX = 0,
  imageY = 0,
  accent = 'bar',
}: BeatProps) => {
  const frame = useCurrentFrame();
  const style = modeStyle[mode];
  const fast = entrance === 'snap';
  const reveal = interpolate(frame, fast ? [0, 3, 7] : [0, 6, 12], [0, 0.88, 1], {...clamp, easing: ease});
  const x = entrance === 'rise' ? 0 : interpolate(frame, [0, fast ? 7 : 12], [entrance === 'depth' ? -18 : 54, 0], {...clamp, easing: ease});
  const y = entrance === 'rise' ? interpolate(frame, [0, 12], [58, 0], {...clamp, easing: ease}) : 0;
  const blur = entrance === 'focus' ? interpolate(frame, [0, 5, 12], [10, 2, 0], clamp) : 0;
  const drift = interpolate(frame, [0, 75], [0, mode === 'macro' ? 42 : 20], clamp);
  const flash = interpolate(frame, [0, 2, 7], [mode === 'near-black' ? 0.05 : 0.22, 0.04, 0], clamp);

  return <AbsoluteFill style={{backgroundColor: '#010202', overflow: 'hidden'}}>
    <Img src={staticFile(`${assetRoot}/${plate}`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: style.opacity, transform: `translate3d(${imageX + drift}px, ${imageY - drift * .25}px,0) scale(${imageScale + frame * .00045})`, filter: `brightness(${style.brightness}) contrast(${style.contrast}) saturate(.72) blur(${blur}px)`}} />
    <AbsoluteFill style={{background: style.overlay}} />
    <MaterialAccent kind={accent} />
    <div style={stage}>
      <div style={{height: 810, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: reveal, transform: `translate(${x}px,${y}px)`}}>
        {kicker ? <div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 27, lineHeight: 1.3, letterSpacing: '.13em', fontWeight: 900, color: gold, marginBottom: 28, textTransform: 'uppercase'}}>{kicker}</div> : null}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          {lines.map((line, index) => <div key={`${line.text}-${index}`} style={{color: line.gold ? gold : ivory, fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 900, fontSize: line.size, lineHeight: 1.12, letterSpacing: line.tracking ?? '-.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', textShadow: line.gold ? '0 0 38px rgba(225,171,94,.28), 0 8px 42px rgba(0,0,0,.98)' : '0 8px 42px rgba(0,0,0,.98)'}}>{line.text}</div>)}
        </div>
        {promptIndex !== undefined ? <div style={{marginTop: 30, width: 835, fontFamily: 'Arial, Helvetica, sans-serif', color: '#e7dfd3', fontSize: 34, lineHeight: 1.3, fontWeight: 700}}>{promptDescriptions[promptIndex]}</div> : null}
        {support ? <div style={{marginTop: 34, width: 830, color: '#d8d0c5', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 32, lineHeight: 1.3, fontWeight: 700}}>{support}</div> : null}
        {promptIndex !== undefined ? <div style={{marginTop: 28, color: '#a99d8e', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 24, lineHeight: 1.3, fontWeight: 700}}>KHÔNG BIẾN SUY LUẬN THÀNH SỰ THẬT. NẾU DỮ KIỆN CHƯA ĐỦ, HÃY NÓI RÕ LÀ CHƯA ĐỦ.</div> : null}
        {truth ? <div style={{marginTop: 28, color: '#aa9f91', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 23, lineHeight: 1.3, fontWeight: 700, letterSpacing: '.04em'}}>{truth}</div> : null}
      </div>
    </div>
    <AbsoluteFill style={{background: `rgba(255,229,187,${flash})`, mixBlendMode: 'screen'}} />
  </AbsoluteFill>;
};

type BridgeKind = 'hard' | 'object' | 'match' | 'passage' | 'material' | 'type' | 'light';

const Bridge = ({kind}: {kind: BridgeKind}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 8], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const pulse = interpolate(frame, [0, 4, 8], [0, 1, 0], clamp);
  if (kind === 'hard') return <AbsoluteFill style={{background: `rgba(0,0,0,${pulse})`}} />;
  if (kind === 'object') return <div style={{position: 'absolute', inset: '-260px -450px', transform: `translateX(${-1520 + p * 3150}px) rotate(-13deg)`, background: 'linear-gradient(90deg,#020303,#151515 38%,#b98d52 49%,#151515 57%,#020303)', boxShadow: '0 0 52px rgba(229,180,108,.28)'}} />;
  if (kind === 'match') return <div style={{position: 'absolute', left: -520 + p * 2050, top: -360, width: 230, height: 2700, transform: 'rotate(27deg)', background: 'linear-gradient(90deg,transparent,#030303,#e4b979,#030303,transparent)', filter: 'blur(3px)', opacity: pulse}} />;
  if (kind === 'passage') return <AbsoluteFill style={{background: `radial-gradient(ellipse at 58% 50%, transparent ${p * 72}%, rgba(0,0,0,.98) ${Math.min(100, p * 72 + 16)}%)`, opacity: pulse}} />;
  if (kind === 'material') return <AbsoluteFill style={{background: `linear-gradient(${98 + p * 45}deg, rgba(0,0,0,.95), rgba(231,189,126,${pulse * .68}), rgba(0,0,0,.98))`, transform: `scale(${1 + pulse * .18})`}} />;
  if (kind === 'type') return <AbsoluteFill style={{display: 'grid', placeItems: 'center', overflow: 'hidden', opacity: pulse}}><div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 900, fontSize: 220, letterSpacing: '-.07em', color: ivory, transform: `scale(${.45 + p * 5.8})`}}>KIỂM CHỨNG</div></AbsoluteFill>;
  return <AbsoluteFill style={{background: `rgba(247,213,162,${pulse * .5})`, mixBlendMode: 'screen'}} />;
};

const Texture = () => <>
  <AbsoluteFill style={{opacity: .052, backgroundImage: 'radial-gradient(circle at 25% 25%,rgba(255,255,255,.2) 0 .55px,transparent .75px),radial-gradient(circle at 65% 65%,rgba(255,255,255,.12) 0 .5px,transparent .7px)', backgroundSize: '5px 5px,7px 7px', mixBlendMode: 'soft-light'}} />
  <AbsoluteFill style={{boxShadow: 'inset 0 0 150px 44px rgba(0,0,0,.52)'}} />
</>;

type TimedBeat = BeatProps & {from: number; to: number; name: string};

const beats: TimedBeat[] = [
  {from: 0, to: 42, name: '01 Hook interrupt', plate: 'shot-01-apparent-continuity.png', mode: 'cinematic', entrance: 'snap', accent: 'seam', lines: [{text: 'ĐỪNG HỎI', size: 152}, {text: 'A.I:', size: 232, gold: true}]},
  {from: 42, to: 84, name: '02 Cause question', plate: 'shot-02-locked-certainty.png', mode: 'macro', entrance: 'focus', accent: 'frame', lines: [{text: '“NGUYÊN NHÂN', size: 108}, {text: 'LÀ GÌ?”', size: 194, gold: true}]},
  {from: 84, to: 126, name: '03 Missing data reset', plate: 'shot-04-missing-volume.png', mode: 'wide', entrance: 'depth', accent: 'bar', lines: [{text: 'KHI DỮ KIỆN', size: 132}, {text: 'CÒN THIẾU', size: 176, gold: true}]},
  {from: 126, to: 170, name: '04 Plausible answer', plate: 'shot-02-locked-certainty.png', mode: 'near-black', entrance: 'rise', accent: 'aperture', lines: [{text: 'NGHE', size: 202}, {text: 'HỢP LÝ', size: 214, gold: true}]},
  {from: 170, to: 222, name: '05 Not necessarily true', plate: 'shot-03-fracture-reveal.png', mode: 'cinematic', entrance: 'snap', accent: 'fracture', lines: [{text: 'CHƯA CHẮC', size: 164}, {text: 'ĐÃ ĐÚNG', size: 206, gold: true}]},

  {from: 222, to: 252, name: '06 Example reset', plate: 'shot-07-missing-causal-bridge.png', mode: 'near-black', entrance: 'depth', accent: 'bar', kicker: 'MỘT VÍ DỤ', lines: [{text: 'HAI DỮ KIỆN', size: 148}]},
  {from: 252, to: 300, name: '07 Revenue fact', plate: 'shot-05-unsupported-leap.png', mode: 'macro', entrance: 'snap', accent: 'seam', lines: [{text: 'DOANH THU', size: 132}, {text: 'GIẢM 20%', size: 180, gold: true}]},
  {from: 300, to: 322, name: '08 Conjunction', plate: 'shot-05-unsupported-leap.png', mode: 'near-black', entrance: 'focus', accent: 'aperture', lines: [{text: 'VÀ...', size: 272, gold: true}]},
  {from: 322, to: 376, name: '09 Advertising fact', plate: 'shot-06-parallel-events.png', mode: 'wide', entrance: 'rise', accent: 'frame', lines: [{text: 'CÔNG TY ĐỔI MẪU', size: 96}, {text: 'QUẢNG CÁO', size: 154, gold: true}]},
  {from: 376, to: 420, name: '10 Temporal proximity', plate: 'shot-07-missing-causal-bridge.png', mode: 'split', entrance: 'depth', accent: 'seam', lines: [{text: 'XẢY RA', size: 204}, {text: 'GẦN NHAU', size: 180, gold: true}]},
  {from: 420, to: 466, name: '11 Causality boundary', plate: 'shot-03-fracture-reveal.png', mode: 'near-black', entrance: 'snap', accent: 'fracture', lines: [{text: 'CHƯA ĐỦ', size: 182}, {text: 'KẾT LUẬN', size: 180}, {text: 'NGUYÊN NHÂN', size: 110, gold: true}]},

  {from: 466, to: 500, name: '12 Method reset', plate: 'shot-04-missing-volume.png', mode: 'wide', entrance: 'rise', accent: 'aperture', lines: [{text: 'THAY VÀO ĐÓ', size: 132, gold: true}]},
  {from: 500, to: 536, name: '13 Four-part instruction', plate: 'shot-01-apparent-continuity.png', mode: 'prompt', entrance: 'snap', accent: 'frame', lines: [{text: 'ĐỪNG KẾT LUẬN', size: 110}, {text: 'TRẢ LỜI THEO', size: 120}, {text: '4 PHẦN', size: 210, gold: true}]},
  {from: 536, to: 570, name: '14 Fact prompt', plate: 'shot-01-apparent-continuity.png', mode: 'prompt', entrance: 'depth', accent: 'bar', promptIndex: 0, lines: [{text: '1. DỮ KIỆN', size: 176, gold: true}]},
  {from: 570, to: 604, name: '15 Inference prompt', plate: 'shot-02-locked-certainty.png', mode: 'prompt', entrance: 'rise', accent: 'seam', promptIndex: 1, lines: [{text: '2. SUY LUẬN', size: 132, gold: true}]},
  {from: 604, to: 638, name: '16 Unknown prompt', plate: 'shot-04-missing-volume.png', mode: 'prompt', entrance: 'focus', accent: 'frame', promptIndex: 2, lines: [{text: '3. CHƯA BIẾT', size: 142, gold: true}]},
  {from: 638, to: 672, name: '17 Verification prompt', plate: 'shot-03-fracture-reveal.png', mode: 'prompt', entrance: 'snap', accent: 'fracture', promptIndex: 3, lines: [{text: '4. KIỂM CHỨNG', size: 124, gold: true}]},

  {from: 672, to: 714, name: '18 Direct test', plate: 'shot-06-parallel-events.png', mode: 'wide', entrance: 'depth', accent: 'frame', kicker: 'DIRECT TEST · CHATGPT · 24/08/2026', lines: [{text: 'THỬ TRONG', size: 140}, {text: 'CHATGPT', size: 170, gold: true}], truth: 'KẾT QUẢ CỦA PHÉP THỬ HIỆN TẠI — KHÔNG PHẢI BẢO ĐẢM CHO MỌI LẦN CHẠY.'},
  {from: 714, to: 760, name: '19 No causal conclusion', plate: 'shot-07-missing-causal-bridge.png', mode: 'proof', entrance: 'snap', accent: 'seam', lines: [{text: 'KHÔNG KẾT LUẬN', size: 98}, {text: 'QUẢNG CÁO', size: 160}, {text: 'LÀ NGUYÊN NHÂN', size: 100, gold: true}], truth: 'DIRECT TEST TRONG CHATGPT · 24/08/2026'},
  {from: 760, to: 804, name: '20 Hypothesis state', plate: 'shot-03-fracture-reveal.png', mode: 'split', entrance: 'focus', accent: 'fracture', kicker: 'QUẢNG CÁO', lines: [{text: 'GIẢ THUYẾT', size: 196}, {text: 'CHƯA PHẢI', size: 138}, {text: 'KẾT LUẬN', size: 170, gold: true}], truth: 'KẾT QUẢ PHÉP THỬ HIỆN TẠI'},
  {from: 804, to: 834, name: '21 Ask for more', plate: 'shot-04-missing-volume.png', mode: 'near-black', entrance: 'rise', accent: 'aperture', lines: [{text: 'NÓ HỎI', size: 202}, {text: 'THÊM:', size: 230, gold: true}]},
  {from: 834, to: 868, name: '22 Traffic', plate: 'shot-01-apparent-continuity.png', mode: 'macro', entrance: 'snap', accent: 'seam', lines: [{text: 'LƯỢT', size: 204}, {text: 'TRUY CẬP', size: 188, gold: true}]},
  {from: 868, to: 902, name: '23 Conversion', plate: 'shot-02-locked-certainty.png', mode: 'wide', entrance: 'depth', accent: 'frame', lines: [{text: 'TỶ LỆ', size: 196}, {text: 'CHUYỂN ĐỔI', size: 118, gold: true}]},
  {from: 902, to: 930, name: '24 Price', plate: 'shot-05-unsupported-leap.png', mode: 'macro', entrance: 'focus', accent: 'bar', lines: [{text: 'GIÁ BÁN', size: 220, gold: true}]},
  {from: 930, to: 958, name: '25 Inventory', plate: 'shot-06-parallel-events.png', mode: 'split', entrance: 'snap', accent: 'seam', lines: [{text: 'TỒN KHO', size: 196, gold: true}], truth: 'CẦN THÊM DỮ LIỆU TRƯỚC KHI KẾT LUẬN.'},

  {from: 958, to: 1008, name: '26 Caveat reset', plate: 'shot-02-locked-certainty.png', mode: 'near-black', entrance: 'rise', accent: 'aperture', lines: [{text: 'CÁCH NÀY', size: 156}, {text: 'KHÔNG LÀM', size: 156}, {text: 'A.I LUÔN ĐÚNG', size: 108, gold: true}]},
  {from: 1008, to: 1046, name: '27 Visibility benefit', plate: 'shot-01-apparent-continuity.png', mode: 'cinematic', entrance: 'depth', accent: 'frame', kicker: 'NHƯNG CHO MÌNH', lines: [{text: 'NHÌN RÕ', size: 190, gold: true}]},
  {from: 1046, to: 1090, name: '28 AI knows', plate: 'shot-06-parallel-events.png', mode: 'wide', entrance: 'snap', accent: 'seam', kicker: 'PHẦN A.I BIẾT', lines: [{text: 'DỮ KIỆN', size: 228, gold: true}]},
  {from: 1090, to: 1134, name: '29 AI infers', plate: 'shot-03-fracture-reveal.png', mode: 'split', entrance: 'focus', accent: 'fracture', kicker: 'PHẦN A.I ĐANG ĐOÁN', lines: [{text: 'SUY LUẬN', size: 190, gold: true}]},

  {from: 1134, to: 1170, name: '30 Next time', plate: 'shot-04-missing-volume.png', mode: 'near-black', entrance: 'rise', accent: 'bar', lines: [{text: 'LẦN TỚI', size: 236, gold: true}]},
  {from: 1170, to: 1210, name: '31 Add four lines', plate: 'shot-07-missing-causal-bridge.png', mode: 'wide', entrance: 'snap', accent: 'frame', lines: [{text: 'HÃY THÊM', size: 150}, {text: '4 DÒNG NÀY', size: 136, gold: true}]},
  {from: 1210, to: 1240, name: '32 Four-part convergence', plate: 'shot-01-apparent-continuity.png', mode: 'prompt', entrance: 'depth', accent: 'seam', lines: [{text: 'DỮ KIỆN · SUY LUẬN', size: 72}, {text: 'CHƯA BIẾT', size: 130}, {text: 'KIỂM CHỨNG', size: 110, gold: true}]},
  {from: 1240, to: 1272, name: '33 Final verification', plate: 'shot-01-apparent-continuity.png', mode: 'aperture', entrance: 'focus', accent: 'aperture', lines: [{text: 'ĐỪNG VỘI TIN', size: 126}, {text: 'HÃY KIỂM CHỨNG', size: 110, gold: true}]},
];

const bridges: Array<{from: number; kind: BridgeKind}> = [
  {from: 38, kind: 'object'}, {from: 80, kind: 'match'}, {from: 122, kind: 'hard'}, {from: 166, kind: 'material'},
  {from: 218, kind: 'passage'}, {from: 296, kind: 'light'}, {from: 372, kind: 'object'}, {from: 416, kind: 'match'},
  {from: 462, kind: 'type'}, {from: 532, kind: 'light'}, {from: 600, kind: 'material'}, {from: 668, kind: 'passage'},
  {from: 756, kind: 'match'}, {from: 830, kind: 'object'}, {from: 898, kind: 'light'}, {from: 954, kind: 'hard'},
  {from: 1042, kind: 'material'}, {from: 1130, kind: 'passage'}, {from: 1206, kind: 'type'}, {from: 1236, kind: 'light'},
];

export const CKAI0004FullProduction = () => <AbsoluteFill style={{backgroundColor: '#010202'}}>
  {beats.map((beat) => <Sequence key={beat.name} from={beat.from} durationInFrames={beat.to - beat.from} name={beat.name}><Beat {...beat} /></Sequence>)}
  {bridges.map((bridge, index) => <Sequence key={`${bridge.from}-${index}`} from={bridge.from} durationInFrames={9}><Bridge kind={bridge.kind} /></Sequence>)}
  <Texture />
  <Audio src={staticFile('voice/CKAI-0004/v5/master.wav')} volume={1} />
</AbsoluteFill>;
