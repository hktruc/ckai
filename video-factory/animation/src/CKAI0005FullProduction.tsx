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
const snap = Easing.bezier(0.12, 0.9, 0.16, 1);

const sf = 'golden/CKAI-0005/creative-upgrade-day/styleframes';
const assets = {
  surface: `${sf}/A/CKAI-0005-styleframe-A-perfect-surface.png`,
  pattern: `${sf}/B/CKAI-0005-styleframe-B-pattern-assembly.png`,
  context: `${sf}/C/CKAI-0005-styleframe-C-context-stress-test.png`,
  hollow: `${sf}/D/CKAI-0005-styleframe-D-hollow-core-reveal.png`,
  probability: 'final/CKAI-0005/v1/shot-assets/shot-05-probability-stack.png',
  sideCutaway: 'final/CKAI-0005/v1/shot-assets/shot-10-side-cutaway-empty-chamber.png',
  callback: 'final/CKAI-0005/v1/shot-assets/shot-18-final-callback-cutaway.png',
};

type Beat = {from: number; to: number; lines: React.ReactNode[]; size?: number; align?: 'left' | 'center'; dark?: boolean};

const Gold = ({children}: React.PropsWithChildren) => (
  <span style={{color: '#e6ba76', textShadow: '0 0 34px rgba(230,178,99,.3), 0 8px 44px rgba(0,0,0,.9)'}}>{children}</span>
);

const BeatText = ({beats}: {beats: Beat[]}) => {
  const frame = useCurrentFrame();
  return <>{beats.map((beat, index) => {
    const enter = interpolate(frame, [beat.from, beat.from + 7], [0, 1], {...clamp, easing: ease});
    const exit = interpolate(frame, [beat.to - 6, beat.to], [1, 0], {...clamp, easing: ease});
    const y = interpolate(frame, [beat.from, beat.from + 10], [28, 0], {...clamp, easing: ease});
    const align = beat.align ?? 'left';
    return <div key={index} style={{
      position: 'absolute', left: 64, top: 400, width: 940, height: 880,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      color: beat.dark ? '#17130e' : '#f6f0e7', fontFamily: '"CKAI Calibri", Calibri, sans-serif',
      fontWeight: 700, fontSize: beat.size ?? 106, lineHeight: 1.12,
      letterSpacing: '0', textAlign: align,
      opacity: enter * exit, transform: `translate3d(0, ${y}px, 0)`,
      textShadow: beat.dark ? '0 3px 22px rgba(255,255,255,.34)' : '0 8px 48px rgba(0,0,0,.96)',
    }}>{beat.lines.map((line, lineIndex) => <div key={lineIndex}>{line}</div>)}</div>;
  })}</>;
};

const Texture = () => <>
  <AbsoluteFill style={{opacity: .045, backgroundImage: 'radial-gradient(circle at 20% 25%, rgba(255,255,255,.22) 0 .55px, transparent .8px), radial-gradient(circle at 72% 62%, rgba(255,255,255,.12) 0 .5px, transparent .75px)', backgroundSize: '5px 5px, 7px 7px', mixBlendMode: 'soft-light'}} />
  <AbsoluteFill style={{boxShadow: 'inset 0 0 160px 46px rgba(0,0,0,.5)'}} />
</>;

const Plate = ({src, brightness = .78, scaleFrom = 1.06, scaleTo = 1.015, xFrom = 0, xTo = 0}: {
  src: string; brightness?: number; scaleFrom?: number; scaleTo?: number; xFrom?: number; xTo?: number;
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <Img src={staticFile(src)} style={{position: 'absolute', inset: -20, width: 1120, height: 1960, objectFit: 'cover', transform: `translate3d(${xFrom + (xTo - xFrom) * p}px, 0, 0) scale(${scaleFrom + (scaleTo - scaleFrom) * p})`, filter: `brightness(${brightness}) contrast(1.18) saturate(.76)`}} />;
};

const Opening = () => {
  const frame = useCurrentFrame();
  const lock = interpolate(frame, [0, 12, 28], [0, .75, 1], {...clamp, easing: snap});
  const sweep = interpolate(frame, [5, 44], [-300, 1400], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{backgroundColor: '#030303', overflow: 'hidden'}}>
    {[0, 1, 2].map((i) => <Img key={i} src={staticFile(assets.surface)} style={{position: 'absolute', inset: -18, width: 1116, height: 1956, objectFit: 'cover', clipPath: `inset(0 ${i === 0 ? 66 : i === 1 ? 33 : 0}% 0 ${i === 0 ? 0 : i === 1 ? 33 : 66}%)`, transform: `translateX(${(i - 1) * 80 * (1 - lock)}px) scale(1.04)`, filter: 'brightness(.82) contrast(1.16) saturate(.8)'}} />)}
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.83), rgba(0,0,0,.38) 67%, rgba(0,0,0,.06)), linear-gradient(180deg, rgba(0,0,0,.18), transparent 58%, rgba(0,0,0,.48))'}} />
    <div style={{position: 'absolute', left: sweep, top: -180, width: 78, height: 2250, transform: 'rotate(14deg)', background: 'linear-gradient(90deg, transparent, rgba(255,242,215,.47), transparent)', filter: 'blur(8px)', mixBlendMode: 'screen'}} />
    <BeatText beats={[
      {from: 0, to: 62, lines: [<><Gold>A.I</Gold> CÓ THỂ</>, 'TRẢ LỜI ĐÚNG.'], size: 112},
      {from: 62, to: 118, lines: ['NHƯNG ĐÚNG', 'CHƯA CHẮC', <Gold>LÀ HIỂU.</Gold>], size: 104},
    ]} />
  </AbsoluteFill>;
};

const PatternRepair = () => {
  const frame = useCurrentFrame();
  const align = interpolate(frame, [38, 66, 94], [0, .58, 1], {...clamp, easing: snap});
  const collapse = interpolate(frame, [96, 122, 150], [0, .72, 1], {...clamp, easing: snap});
  const visibility = interpolate(frame, [30, 42, 154, 170], [0, 1, 1, 0], clamp);
  const starts = [
    {x: 610, y: 420, r: -18},
    {x: 850, y: 470, r: 14},
    {x: 650, y: 940, r: 11},
    {x: 870, y: 1040, r: -12},
    {x: 760, y: 720, r: 3},
  ];
  return <AbsoluteFill style={{opacity: visibility, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', right: 0, top: 300, width: 590, height: 1180, background: 'radial-gradient(ellipse at 65% 48%,rgba(0,0,0,.78),rgba(0,0,0,.18) 54%,transparent 76%)'}} />
    {starts.map((start, index) => {
      const alignedX = 786 + (index - 2) * 10;
      const alignedY = 680 + (index - 2) * 19;
      const x = start.x + (alignedX - start.x) * align;
      const y = start.y + (alignedY - start.y) * align;
      const finalX = 788;
      const finalY = 684;
      const opacity = index === 2 ? 1 : 1 - collapse;
      const scale = 1 - collapse * (index === 2 ? -.2 : .32);
      return <div key={index} style={{
        position: 'absolute', left: x + (finalX - x) * collapse, top: y + (finalY - y) * collapse,
        width: 148, height: 292, borderRadius: 76,
        transform: `translate(-50%,-50%) rotate(${start.r * (1 - align)}deg) scale(${scale})`,
        transformOrigin: '50% 50%', opacity,
        background: 'linear-gradient(100deg,#201b15 0%,#efe5d6 22%,#9c7a4d 27%,#17130f 38%,#4b4033 68%,#ead9c1 88%,#1a1611 100%)',
        border: '2px solid rgba(234,199,145,.62)',
        boxShadow: '0 22px 55px rgba(0,0,0,.78), inset 0 0 0 12px rgba(0,0,0,.56), 0 0 24px rgba(229,179,105,.15)',
      }} />;
    })}
    <div style={{
      position: 'absolute', left: 788, top: 684, width: 202, height: 390, borderRadius: 106,
      transform: `translate(-50%,-50%) scale(${.72 + collapse * .28})`, opacity: collapse,
      background: 'linear-gradient(105deg,#f0e6d7 0%,#5e5040 16%,#15120e 26%,#24201a 70%,#d5b27b 91%,#f4eadb 100%)',
      border: '3px solid rgba(241,211,166,.72)',
      boxShadow: '0 34px 90px rgba(0,0,0,.86), inset 0 0 0 18px rgba(7,6,4,.72), 0 0 42px rgba(229,179,105,.23)',
    }}>
      <div style={{position: 'absolute', inset: 42, borderRadius: 72, background: 'linear-gradient(90deg,#0c0a08,#42382c 52%,#090806)', border: '1px solid rgba(236,199,140,.34)'}} />
    </div>
  </AbsoluteFill>;
};

const PatternField = ({repaired = false}: {repaired?: boolean}) => {
  const frame = useCurrentFrame();
  const align = interpolate(frame, [0, 30, 62], [0, .7, 1], {...clamp, easing: snap});
  const drift = interpolate(frame, [0, 191], [-48, 58], {...clamp, easing: Easing.inOut(Easing.quad)});
  return <AbsoluteFill style={{backgroundColor: '#050403', overflow: 'hidden'}}>
    <Plate src={assets.pattern} brightness={.66} scaleFrom={1.12} scaleTo={1.04} xFrom={-30} xTo={35} />
    {[0, 1, 2, 3, 4, 5].map((i) => <Img key={i} src={staticFile(assets.pattern)} style={{position: 'absolute', inset: -70, width: 1220, height: 2060, objectFit: 'cover', clipPath: `inset(0 ${100 - (i + 1) * 16.67}% 0 ${i * 16.67}%)`, transform: `translate3d(${drift + (i % 2 ? 1 : -1) * (80 + i * 8) * (1 - align)}px, ${(i - 2.5) * 15 * (1 - align)}px, 0) scale(1.08)`, filter: 'brightness(.98) contrast(1.22) saturate(.72)'}} />)}
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.88), rgba(0,0,0,.46) 68%, rgba(0,0,0,.08)), linear-gradient(180deg, rgba(0,0,0,.15), transparent 55%, rgba(0,0,0,.58))'}} />
    {repaired ? <PatternRepair /> : null}
    <BeatText beats={[
      {from: 0, to: 64, lines: ['KHI ĐÃ XEM', 'RẤT NHIỀU', 'VÍ DỤ TƯƠNG TỰ.'], size: 94},
      {from: 64, to: 128, lines: ['NÓ NHẬN RA', <Gold>MỘT MẪU</Gold>, 'QUEN THUỘC.'], size: 98},
      {from: 128, to: 191, lines: ['RỒI CHỌN', 'CÂU TRẢ LỜI', 'PHÙ HỢP.'], size: 96},
    ]} />
  </AbsoluteFill>;
};

const ProbabilityStack = () => {
  const frame = useCurrentFrame();
  const compress = interpolate(frame, [0, 30, 72], [1.12, 1.04, 1], {...clamp, easing: snap});
  const result = interpolate(frame, [92, 130], [0, 1], {...clamp, easing: ease});
  return <AbsoluteFill style={{backgroundColor: '#050403', overflow: 'hidden'}}>
    <Img src={staticFile(assets.probability)} style={{position: 'absolute', inset: -25, width: 1130, height: 1970, objectFit: 'cover', transform: `scale(${compress}) translateY(${(1 - result) * 18}px)`, filter: 'brightness(.7) contrast(1.23) saturate(.68)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,.86), rgba(0,0,0,.44) 62%, rgba(0,0,0,.06)), linear-gradient(180deg, rgba(0,0,0,.18), transparent 52%, rgba(0,0,0,.62))'}} />
    <div style={{position: 'absolute', left: 64, top: 1318, width: 120 + result * 310, height: 6, borderRadius: 9, background: 'linear-gradient(90deg,#8b6031,#efc987)', boxShadow: '0 0 26px rgba(229,177,103,.3)'}} />
    <BeatText beats={[
      {from: 0, to: 82, lines: ['KHẢ NĂNG', 'TIẾP THEO', <Gold>XÁC SUẤT CAO.</Gold>], size: 98},
      {from: 82, to: 148, lines: ['KẾT QUẢ', 'VẪN CÓ THỂ', <Gold>ĐÚNG.</Gold>], size: 104},
    ]} />
  </AbsoluteFill>;
};

const AssumptionReaction = () => {
  const frame = useCurrentFrame();
  const remove = interpolate(frame, [48, 72, 96], [0, .62, 1], {...clamp, easing: snap});
  const visibility = interpolate(frame, [36, 48, 154, 172], [0, 1, 1, 0], clamp);
  return <div style={{position: 'absolute', right: 78, top: 318, width: 300, height: 1190, opacity: visibility, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 132, top: 78 - remove * 1100, width: 36, height: 940, borderRadius: 22, background: 'linear-gradient(90deg,#211b14,#e8bd78 45%,#70542f 60%,#14110d)', boxShadow: '0 0 28px rgba(190,135,65,.32), 0 28px 70px rgba(0,0,0,.38)', opacity: 1 - remove * .16}} />
    {[0, 1, 2].map((index) => <div key={index} style={{
      position: 'absolute', left: 70 - index * 9, top: 356 + index * 190,
      width: 160 + index * 18, height: 5, borderRadius: 8,
      transform: `translateX(${remove * (index - 1) * 18}px) rotate(${remove * (index - 1) * 3}deg)`,
      background: 'linear-gradient(90deg,transparent,rgba(126,90,44,.72),rgba(242,210,155,.56),transparent)',
      boxShadow: '0 0 18px rgba(173,119,53,.2)', opacity: .72 - remove * .42,
    }} />)}
  </div>;
};

const ContextStress = ({repaired = false}: {repaired?: boolean}) => {
  const frame = useCurrentFrame();
  const pull = interpolate(frame, [0, 42, 116], [0, .35, 1], {...clamp, easing: ease});
  const reaction = repaired ? interpolate(frame, [84, 116, 152], [0, .72, 1], {...clamp, easing: ease}) : 0;
  return <AbsoluteFill style={{backgroundColor: '#eae6dd', overflow: 'hidden'}}>
    <Img src={staticFile(assets.context)} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', clipPath: 'polygon(0 0,58% 0,58% 100%,0 100%)', transform: `translateX(${-pull * 45 - reaction * 24}px) scale(${1.01 + pull * .035 + reaction * .012}) rotate(${-reaction * .65}deg)`, filter: 'brightness(.98) contrast(1.08) saturate(.72)'}} />
    <div style={{position: 'absolute', left: 530, top: 250, width: 180 + pull * 120 + reaction * 74, height: 1380, background: 'linear-gradient(90deg,rgba(25,21,16,.94),rgba(82,72,58,.58),transparent)', transform: `scaleX(${.08 + pull * .92})`, transformOrigin: 'left', borderLeft: '2px solid rgba(184,136,70,.5)'}} />
    <Img src={staticFile(assets.context)} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', clipPath: 'polygon(48% 0,100% 0,100% 100%,48% 100%)', transform: `translate3d(${pull * 180 + reaction * 82}px,${-pull * 20 + reaction * 18}px,0) rotate(${pull * 2 + reaction * 2.2}deg)`, filter: 'brightness(1.04) contrast(1.1) saturate(.72)'}} />
    {repaired ? <AssumptionReaction /> : null}
    <AbsoluteFill style={{background: 'linear-gradient(90deg,rgba(255,252,246,.08),rgba(255,252,246,.35) 58%,rgba(0,0,0,.18))'}} />
    <BeatText beats={[
      {from: 0, to: 62, lines: ['NHƯNG THỬ', <Gold>ĐỔI NGỮ CẢNH.</Gold>], size: 106, dark: true},
      {from: 62, to: 122, lines: ['ĐỔI MỘT', <Gold>GIẢ ĐỊNH.</Gold>], size: 112, dark: true},
      {from: 122, to: 186, lines: ['HỎI LẠI', 'THEO CÁCH KHÁC.'], size: 102, dark: true},
    ]} />
  </AbsoluteFill>;
};

const CoreTest = ({repaired = false}: {repaired?: boolean}) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [5, 32, 86], [0, .62, 1], {...clamp, easing: ease});
  const complexReveal = repaired ? interpolate(frame, [38, 52, 66], [0, .55, 1], {...clamp, easing: ease}) : 1;
  return <AbsoluteFill style={{backgroundColor: '#040302', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, opacity: complexReveal}}><Plate src={assets.sideCutaway} brightness={.68} scaleFrom={1.14} scaleTo={1.04} xFrom={40} xTo={-34} /></div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: 390 + i * 34 - open * (80 + i * 28), top: 660 + i * 92, width: 420 - i * 45, height: 8, borderRadius: 99, background: 'linear-gradient(90deg,rgba(242,222,190,.04),rgba(220,181,119,.7),rgba(100,92,78,.05))', opacity: complexReveal * (.8 - i * .12), boxShadow: '0 0 18px rgba(222,178,108,.18)'}} />)}
    {repaired ? <>
      <AbsoluteFill style={{opacity: 1 - complexReveal, background: 'radial-gradient(ellipse at 82% 50%,rgba(54,43,29,.48),rgba(5,4,3,.94) 43%,#020202 78%)'}} />
      <div style={{position: 'absolute', right: 118, top: 390, width: 52, height: 1060, borderRadius: 28, transform: `scaleY(${.18 + (1 - complexReveal) * .82})`, background: 'linear-gradient(90deg,#17130f,#f0d2a2 46%,#7e5d35 58%,#0c0a08)', boxShadow: '0 0 44px rgba(226,180,112,.28)', opacity: 1 - complexReveal * .7}} />
    </> : null}
    <AbsoluteFill style={{background: 'linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.33) 68%,rgba(0,0,0,.08)),linear-gradient(180deg,rgba(0,0,0,.18),transparent 50%,rgba(0,0,0,.62))'}} />
    <BeatText beats={[
      {from: 0, to: 50, lines: ['NẾU THỰC SỰ', <Gold>HIỂU...</Gold>], size: 108},
      {from: 50, to: 96, lines: ['PHẦN CỐT LÕI', 'PHẢI', <Gold>ĐỨNG VỮNG.</Gold>], size: 96},
    ]} />
  </AbsoluteFill>;
};

const HollowReveal = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 28, 110], [.5, .84, 1], {...clamp, easing: ease});
  return <AbsoluteFill style={{backgroundColor: '#020202', overflow: 'hidden'}}>
    <Plate src={assets.hollow} brightness={.72} scaleFrom={1.11} scaleTo={1.015} xFrom={25} xTo={-20} />
    <div style={{position: 'absolute', left: 344, top: 535, width: 390, height: 570, borderRadius: '48%', background: `radial-gradient(ellipse,rgba(0,0,0,${reveal}) 0%,rgba(0,0,0,${reveal * .9}) 54%,transparent 73%)`, filter: 'blur(8px)', boxShadow: `0 0 ${60 + reveal * 65}px rgba(0,0,0,.95)`}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.4) 66%,rgba(0,0,0,.08)),linear-gradient(180deg,rgba(0,0,0,.2),transparent 52%,rgba(0,0,0,.64))'}} />
    <BeatText beats={[
      {from: 0, to: 76, lines: ['VẺ CHẮC CHẮN', 'VẪN', <Gold>NGUYÊN VẸN.</Gold>], size: 98},
      {from: 76, to: 142, lines: ['NHƯNG', 'BÊN TRONG...'], size: 112},
      {from: 142, to: 204, lines: ['KHÔNG CÓ THỨ', 'TA TƯỞNG LÀ', <Gold>“HIỂU”.</Gold>], size: 94},
    ]} />
  </AbsoluteFill>;
};

const Questions = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [0, 155], [0, 780], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 48%,#17130e 0%,#050403 48%,#010101 100%)', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 150, top: 884, width: line, height: 2, background: 'linear-gradient(90deg,transparent,#e6ba76,transparent)', boxShadow: '0 0 30px rgba(230,186,118,.42)'}} />
    <BeatText beats={[
      {from: 0, to: 82, lines: ['ĐÁP ÁN', 'CÓ ĐÚNG KHÔNG?'], size: 112, align: 'center'},
      {from: 82, to: 157, lines: ['NÓ ĐÚNG', <Gold>VÌ HIỂU...</Gold>], size: 112, align: 'center'},
    ]} />
  </AbsoluteFill>;
};

const FinalCallback = ({repaired = false}: {repaired?: boolean}) => {
  const frame = useCurrentFrame();
  const pull = interpolate(frame, [0, 198], [1.08, 1.015], {...clamp, easing: Easing.out(Easing.cubic)});
  const uncover = repaired ? interpolate(frame, [64, 96, 158], [0, .42, 1], {...clamp, easing: snap}) : 1;
  return <AbsoluteFill style={{backgroundColor: '#030302', overflow: 'hidden'}}>
    <Img src={staticFile(assets.callback)} style={{position: 'absolute', inset: -10, width: 1100, height: 1940, objectFit: 'cover', transform: `scale(${pull})`, filter: 'brightness(.7) contrast(1.18) saturate(.7)'}} />
    {repaired ? <>
      <div style={{
        position: 'absolute', left: 95 - uncover * 360, top: 374 - uncover * 24, width: 500, height: 1240,
        borderRadius: '58% 43% 48% 52% / 18% 20% 32% 30%', transform: `rotate(${-4 - uncover * 3}deg)`,
        background: 'linear-gradient(104deg,#1b1712 0%,#f2e8d9 18%,#a98c62 24%,#f5ecdf 52%,#8b7658 78%,#18140f 100%)',
        border: '2px solid rgba(239,210,165,.68)',
        boxShadow: '18px 16px 75px rgba(0,0,0,.82), inset -32px 0 70px rgba(24,19,13,.52), 0 0 35px rgba(227,184,119,.18)',
        opacity: 1 - uncover * .82,
      }} />
      <div style={{position: 'absolute', left: 500 + uncover * 340, top: 250, width: 18, height: 1470, transform: 'rotate(8deg)', background: 'linear-gradient(180deg,transparent,#e9c58d 22%,#524028 72%,transparent)', boxShadow: '0 0 36px rgba(229,187,123,.42)', opacity: interpolate(frame, [56, 86, 160, 190], [0, 1, .5, 0], clamp)}} />
      <div style={{position: 'absolute', left: 164, top: 640, width: 330, height: 670, borderRadius: '44%', background: `radial-gradient(ellipse,rgba(0,0,0,${.16 + uncover * .76}),rgba(0,0,0,${uncover * .72}) 56%,transparent 74%)`, filter: 'blur(7px)', opacity: uncover}} />
    </> : null}
    <AbsoluteFill style={{background: 'linear-gradient(90deg,rgba(0,0,0,.88),rgba(0,0,0,.46) 70%,rgba(0,0,0,.1)),linear-gradient(180deg,rgba(0,0,0,.16),transparent 50%,rgba(0,0,0,.65))'}} />
    <BeatText beats={[
      {from: 0, to: 86, lines: ['...HAY CHỈ VÌ', <Gold>BẮT ĐÚNG MẪU?</Gold>], size: 102},
      {from: 86, to: 198, lines: ['ĐÚNG KẾT QUẢ', 'CHƯA CHẮC LÀ', <Gold>ĐÚNG HIỂU BIẾT.</Gold>], size: 94},
    ]} />
  </AbsoluteFill>;
};

const ResetWipe = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 12], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return <div style={{position: 'absolute', left: -650 + p * 1900, top: -260, width: 420, height: 2450, transform: 'rotate(12deg)', background: 'linear-gradient(90deg,#020202,#171511 20%,#f0e9dd 46%,#b79059 52%,#17140f 66%,#020202)', boxShadow: '0 0 70px rgba(238,210,167,.3)'}} />;
};

const CKAI0005Film = ({repaired}: {repaired: boolean}) => <AbsoluteFill style={{backgroundColor: '#020202'}}>
  <Audio src={staticFile('voice/CKAI-0005/master.wav')} />
  <Sequence from={0} durationInFrames={118} name="01 · Correct is not understanding"><Opening /></Sequence>
  <Sequence from={118} durationInFrames={191} name="02 · Pattern assembly"><PatternField repaired={repaired} /></Sequence>
  <Sequence from={309} durationInFrames={148} name="03 · Probability stack"><ProbabilityStack /></Sequence>
  <Sequence from={457} durationInFrames={186} name="04 · Context stress test"><ContextStress repaired={repaired} /></Sequence>
  <Sequence from={643} durationInFrames={96} name="05 · Core test"><CoreTest repaired={repaired} /></Sequence>
  <Sequence from={739} durationInFrames={204} name="06 · Hollow reveal"><HollowReveal /></Sequence>
  <Sequence from={943} durationInFrames={157} name="07 · Reflective questions"><Questions /></Sequence>
  <Sequence from={1100} durationInFrames={198} name="08 · Final callback"><FinalCallback repaired={repaired} /></Sequence>
  {[112, 303, 451, 637, 733, 937, 1094].map((from, index) => <Sequence key={index} from={from} durationInFrames={14} name={`Reset ${index + 1}`}><ResetWipe /></Sequence>)}
  <Texture />
</AbsoluteFill>;

export const CKAI0005FullProduction = () => <CKAI0005Film repaired={false} />;
export const CKAI0005FullProductionV11 = () => <CKAI0005Film repaired />;
