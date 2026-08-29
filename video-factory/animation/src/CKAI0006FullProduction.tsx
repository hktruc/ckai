import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const C = {
  ink: '#101827', navy: '#17243A', cream: '#F6F3EC', paper: '#FFFCF6',
  teal: '#19A88D', mint: '#BCEBDD', coral: '#FF725E', amber: '#FFC857', muted: '#6E7786',
};

const scenes = [0, 101, 245, 340, 417, 606, 728, 857, 1068];
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const fade = (frame: number, start: number, end: number) => {
  const inOpacity = interpolate(frame, [start, start + 10], [0, 1], clamp);
  const outOpacity = interpolate(frame, [end - 10, end], [1, 0], clamp);
  return Math.min(inOpacity, outOpacity);
};

const Shell: React.FC<{children: React.ReactNode; accent?: string}> = ({children, accent = C.teal}) => (
  <AbsoluteFill style={{background: C.cream, color: C.ink, fontFamily: 'Inter, Arial, sans-serif', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#17243A14 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
    <div style={{position: 'absolute', width: 780, height: 780, borderRadius: 999, right: -390, top: -420, background: `${accent}1A`}} />
    <div style={{position: 'absolute', left: 72, right: 72, top: 58, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 24, letterSpacing: 2, color: C.navy}}>
      <span>CHÁNH KIẾN · AI</span><span style={{color: accent}}>THỰC HÀNH 01</span>
    </div>
    {children}
    <div style={{position: 'absolute', left: 72, right: 72, bottom: 54, height: 5, borderRadius: 8, background: '#17243A18'}}>
      <div style={{height: '100%', width: '100%', background: accent, borderRadius: 8, transformOrigin: 'left', transform: 'scaleX(var(--progress))'}} />
    </div>
  </AbsoluteFill>
);

const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.teal}) => (
  <div style={{fontSize: 27, fontWeight: 900, letterSpacing: 3, color, marginBottom: 24}}>{children}</div>
);

const Title: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 92}) => (
  <div style={{fontSize: size, lineHeight: 1.02, letterSpacing: -4, fontWeight: 950, maxWidth: 920}}>{children}</div>
);

const Window: React.FC<{children: React.ReactNode; title?: string; style?: React.CSSProperties}> = ({children, title = 'AI WORKSPACE', style}) => (
  <div style={{background: C.paper, border: '3px solid #17243A20', borderRadius: 30, boxShadow: '0 30px 80px #17243A20', overflow: 'hidden', ...style}}>
    <div style={{height: 68, padding: '0 25px', borderBottom: '2px solid #17243A14', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', gap: 10}}><i style={{width: 13, height: 13, borderRadius: 20, background: C.coral}} /><i style={{width: 13, height: 13, borderRadius: 20, background: C.amber}} /><i style={{width: 13, height: 13, borderRadius: 20, background: C.teal}} /></div>
      <b style={{fontSize: 18, letterSpacing: 2, color: C.muted}}>{title}</b>
    </div>
    {children}
  </div>
);

const AnswerLines: React.FC<{weak?: boolean; strong?: boolean; progress?: number}> = ({weak, strong, progress = 1}) => (
  <div style={{display: 'grid', gap: 17}}>
    {[.95, .78, .88, .62].map((w, i) => (
      <div key={i} style={{height: 19, width: `${w * 100}%`, borderRadius: 20, background: weak && (i === 1 || i === 3) ? C.coral : strong ? C.teal : C.navy, opacity: .17 + (strong ? .05 : 0), transformOrigin: 'left', transform: `scaleX(${Math.max(0, progress - i * .1)})`}} />
    ))}
  </div>
);

const StepPill: React.FC<{number: string; label: string; active?: boolean; done?: boolean}> = ({number, label, active, done}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '19px 22px', borderRadius: 22, background: active ? C.navy : done ? C.mint : C.paper, color: active ? 'white' : C.ink, border: `2px solid ${active ? C.navy : '#17243A18'}`, boxShadow: active ? '0 18px 40px #17243A30' : 'none'}}>
    <span style={{display: 'grid', placeItems: 'center', width: 48, height: 48, borderRadius: 50, fontWeight: 950, fontSize: 25, background: active ? C.teal : done ? C.teal : '#17243A10', color: active || done ? 'white' : C.navy}}>{done ? '✓' : number}</span>
    <b style={{fontSize: 29}}>{label}</b>
  </div>
);

const Scene: React.FC<{start: number; end: number; children: React.ReactNode}> = ({start, end, children}) => {
  const frame = useCurrentFrame();
  if (frame < start || frame >= end) return null;
  return <AbsoluteFill style={{opacity: fade(frame, start, end)}}>{children}</AbsoluteFill>;
};

export const CKAI0006FullProduction: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const p = frame / durationInFrames;
  const enter = (start: number) => spring({frame: frame - start, fps, config: {damping: 16, stiffness: 120}});

  return <AbsoluteFill style={{'--progress': p} as React.CSSProperties}>
    <Scene start={scenes[0]} end={scenes[1]}>
      <Shell accent={C.coral}>
        <div style={{position: 'absolute', left: 72, right: 72, top: 210}}>
          <Kicker color={C.coral}>CÂU TRẢ LỜI ĐẦU TIÊN</Kicker>
          <Title>A.I trả lời hay…</Title>
          <div style={{fontSize: 64, lineHeight: 1.08, fontWeight: 900, marginTop: 18, color: C.coral}}>chưa chắc đã tốt nhất.</div>
        </div>
        <Window style={{position: 'absolute', left: 72, right: 72, top: 760, paddingBottom: 46, transform: `translateY(${(1-enter(8))*90}px) rotate(-1deg)`}}>
          <div style={{padding: '40px 38px'}}><div style={{fontSize: 27, fontWeight: 900, marginBottom: 28}}>BẢN TRẢ LỜI #1</div><AnswerLines /></div>
          <div style={{margin: '0 38px', padding: '20px 24px', borderRadius: 18, color: C.coral, background: '#FF725E14', fontWeight: 900, fontSize: 26}}>HỢP LÝ ≠ TỐI ƯU</div>
        </Window>
      </Shell>
    </Scene>

    <Scene start={scenes[1]} end={scenes[2]}>
      <Shell accent={C.coral}>
        <div style={{position: 'absolute', left: 72, right: 72, top: 220}}><Kicker color={C.coral}>SAI LẦM PHỔ BIẾN</Kicker><Title size={82}>Hỏi một lần.<br/>Dùng luôn.</Title></div>
        <div style={{position: 'absolute', left: 72, right: 72, top: 690, display: 'grid', gap: 22}}>
          {['01  GỬI PROMPT', '02  NHẬN ĐÁP ÁN ĐẦU', '03  DÙNG NGAY'].map((x,i) => <div key={x} style={{padding: '32px 34px', borderRadius: 26, background: i===2 ? C.coral : C.paper, color: i===2 ? 'white' : C.ink, fontWeight: 950, fontSize: 38, transform: `translateX(${(1-enter(scenes[1]+i*10))*(i%2?-100:100)}px)`, boxShadow: '0 18px 48px #17243A16'}}>{x}</div>)}
        </div>
        <div style={{position: 'absolute', left: 115, top: 1125, width: 0, height: 170, borderLeft: `5px dashed ${C.coral}`, opacity: .55}} />
        <div style={{position: 'absolute', left: 72, right: 72, top: 1360, padding: '28px 34px', borderRadius: 26, border: `3px solid ${C.coral}`, fontSize: 34, fontWeight: 900}}>Bạn bỏ qua bước kiểm tra quan trọng nhất.</div>
      </Shell>
    </Scene>

    <Scene start={scenes[2]} end={scenes[3]}>
      <Shell>
        <div style={{position: 'absolute', left: 72, right: 72, top: 210}}><Kicker>CÁCH TỐT HƠN</Kicker><Title size={88}>Bắt A.I làm<br/><span style={{color: C.teal}}>3 bước.</span></Title></div>
        <div style={{position: 'absolute', left: 72, right: 72, top: 760, display: 'grid', gap: 25}}>
          <StepPill number="1" label="VIẾT BẢN ĐẦU" active/><StepPill number="2" label="TỰ PHẢN BIỆN"/><StepPill number="3" label="VIẾT LẠI TỐT HƠN"/>
        </div>
      </Shell>
    </Scene>

    <Scene start={scenes[3]} end={scenes[4]}>
      <Shell>
        <div style={{position: 'absolute', left: 72, right: 72, top: 180}}><Kicker>BƯỚC 1 / 3</Kicker><Title size={84}>Viết bản trả lời đầu tiên.</Title></div>
        <Window style={{position: 'absolute', left: 72, right: 72, top: 720}} title="DRAFT · V1">
          <div style={{padding: 42}}><div style={{fontSize: 26, fontWeight: 900, marginBottom: 28, color: C.muted}}>CÂU TRẢ LỜI NHÁP</div><AnswerLines progress={enter(scenes[3]+5)}/><div style={{marginTop: 38, display: 'inline-block', padding: '14px 20px', borderRadius: 50, background: '#17243A0D', fontWeight: 900, fontSize: 22}}>CHƯA KIỂM TRA</div></div>
        </Window>
      </Shell>
    </Scene>

    <Scene start={scenes[4]} end={scenes[5]}>
      <Shell accent={C.coral}>
        <div style={{position: 'absolute', left: 72, right: 72, top: 160}}><Kicker color={C.coral}>BƯỚC 2 / 3 · HERO MOMENT</Kicker><Title size={79}>Tự đóng vai<br/>người phản biện.</Title></div>
        <Window title="CRITIQUE MODE" style={{position: 'absolute', left: 72, right: 72, top: 650}}>
          <div style={{padding: 36, position: 'relative'}}>
            <AnswerLines weak/>
            <div style={{position: 'absolute', left: 25, right: 25, top: 28 + interpolate(frame,[scenes[4]+10, scenes[4]+105],[0,180],clamp), height: 70, borderRadius: 14, background: '#FFC85755', border: `3px solid ${C.amber}`}} />
          </div>
        </Window>
        <div style={{position: 'absolute', left: 72, right: 72, top: 1135, display: 'grid', gap: 18}}>
          {['ĐIỂM YẾU', 'CHỖ CHƯA RÕ', 'ĐIỀU CÒN THIẾU'].map((x,i) => <div key={x} style={{padding: '23px 27px', borderRadius: 20, background: i===Math.min(2,Math.floor((frame-scenes[4]-22)/35))?C.coral:C.paper, color: i===Math.min(2,Math.floor((frame-scenes[4]-22)/35))?'white':C.ink, fontSize: 29, fontWeight: 950, transform: `translateX(${(1-enter(scenes[4]+20+i*25))*80}px)`}}>◎ {x}</div>)}
        </div>
      </Shell>
    </Scene>

    <Scene start={scenes[5]} end={scenes[6]}>
      <Shell>
        <div style={{position: 'absolute', left: 72, right: 72, top: 155}}><Kicker>BƯỚC 3 / 3 · HERO MOMENT</Kicker><Title size={82}>Viết lại<br/><span style={{color: C.teal}}>tốt hơn.</span></Title></div>
        <div style={{position: 'absolute', left: 72, right: 72, top: 660, height: 660}}>
          <Window title="DRAFT · V1" style={{position: 'absolute', inset: 0, opacity: interpolate(frame,[scenes[5]+15, scenes[5]+55],[1,0],clamp), transform: `translateX(${interpolate(frame,[scenes[5]+15,scenes[5]+55],[0,-100],clamp)}px) rotate(-2deg)`}}><div style={{padding: 40}}><AnswerLines weak/></div></Window>
          <Window title="REWRITE · V2" style={{position: 'absolute', inset: 0, border: `3px solid ${C.teal}`, opacity: interpolate(frame,[scenes[5]+38, scenes[5]+70],[0,1],clamp), transform: `translateX(${interpolate(frame,[scenes[5]+38,scenes[5]+70],[110,0],clamp)}px)`}}><div style={{padding: 40}}><AnswerLines strong progress={enter(scenes[5]+45)}/><div style={{marginTop: 36, padding: '18px 22px', borderRadius: 18, background: C.mint, color: '#08715E', fontSize: 26, fontWeight: 950}}>✓ RÕ HƠN · ĐỦ HƠN · CHẶT HƠN</div></div></Window>
        </div>
        <div style={{position: 'absolute', left: 72, right: 72, top: 1400, display: 'flex', alignItems: 'center', gap: 20, fontSize: 29, fontWeight: 900}}><span style={{padding: '15px 20px', borderRadius: 18, background: C.navy, color: 'white'}}>PHẢN BIỆN</span><span>→</span><span style={{padding: '15px 20px', borderRadius: 18, background: C.teal, color: 'white'}}>NÂNG CẤP</span></div>
      </Shell>
    </Scene>

    <Scene start={scenes[6]} end={scenes[7]}>
      <Shell>
        <div style={{position: 'absolute', left: 72, right: 72, top: 180}}><Kicker>KẾT QUẢ</Kicker><Title size={83}>Một thay đổi nhỏ.<br/><span style={{color: C.teal}}>Khác hẳn.</span></Title></div>
        <div style={{position: 'absolute', left: 72, right: 72, top: 710, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
          <div style={{padding: '34px 28px', height: 530, borderRadius: 28, background: C.paper, border: '3px solid #17243A18'}}><b style={{fontSize: 27, color: C.muted}}>TRƯỚC</b><div style={{marginTop: 65}}><AnswerLines weak/></div><div style={{marginTop: 85, fontSize: 56, fontWeight: 950, color: C.coral}}>1×</div></div>
          <div style={{padding: '34px 28px', height: 530, borderRadius: 28, background: C.navy, color: 'white', border: `3px solid ${C.teal}`, transform: `scale(${.94+.06*enter(scenes[6]+12)})`}}><b style={{fontSize: 27, color: C.mint}}>SAU</b><div style={{marginTop: 65}}><AnswerLines strong/></div><div style={{marginTop: 85, fontSize: 56, fontWeight: 950, color: C.mint}}>↑</div></div>
        </div>
      </Shell>
    </Scene>

    <Scene start={scenes[7]} end={scenes[8]}>
      <Shell accent={C.teal}>
        <div style={{position: 'absolute', left: 72, right: 72, top: 190}}><Kicker>GHI NHỚ</Kicker><Title size={88}>Đừng chỉ hỏi A.I<br/>để lấy đáp án.</Title></div>
        <div style={{position: 'absolute', left: 72, right: 72, top: 750, padding: '55px 46px', borderRadius: 34, background: C.navy, color: 'white', boxShadow: '0 35px 90px #17243A35'}}>
          <div style={{fontSize: 35, fontWeight: 800, color: C.mint, marginBottom: 26}}>HÃY DÙNG A.I ĐỂ</div>
          <div style={{fontSize: 67, lineHeight: 1.08, letterSpacing: -2, fontWeight: 950}}>TỰ KIỂM TRA.<br/>TỰ NÂNG CẤP.</div>
          <div style={{marginTop: 46, display: 'flex', gap: 12}}>{['VIẾT', 'PHẢN BIỆN', 'VIẾT LẠI'].map((x,i)=><span key={x} style={{flex:1, textAlign:'center', padding:'16px 5px', borderRadius:16, background:i===1?C.coral:C.teal, fontSize:19, fontWeight:950}}>{x}</span>)}</div>
        </div>
        <div style={{position: 'absolute', left: 72, right: 72, top: 1435, fontSize: 31, lineHeight: 1.35, fontWeight: 800, color: C.muted}}>Prompt → First Answer → Self-Critique → Better Answer</div>
      </Shell>
    </Scene>
  </AbsoluteFill>;
};
