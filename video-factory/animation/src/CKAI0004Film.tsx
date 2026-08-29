import type {CSSProperties, PropsWithChildren, ReactNode} from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame} from 'remotion';

const palette = {
  navy: '#071B2B',
  navy2: '#102F45',
  cream: '#F7F2E8',
  paper: '#FFFDF8',
  teal: '#12C7A2',
  tealSoft: '#DDF8F0',
  coral: '#FF6B57',
  coralSoft: '#FFE5DF',
  yellow: '#FFD166',
  ink: '#0B1F2A',
  muted: '#55717D',
  white: '#FFFFFF',
};

const font = '"Segoe UI", "Arial", sans-serif';

const appear = (frame: number, delay = 0, distance = 34): CSSProperties => {
  const p = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  return {opacity: p, transform: `translateY(${(1 - p) * distance}px) scale(${0.97 + p * 0.03})`};
};

const Scene = ({children, dark = false, accent = palette.teal}: PropsWithChildren<{dark?: boolean; accent?: string}>) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const drift = Math.sin(frame / 34) * 18;
  return <AbsoluteFill style={{fontFamily: font, background: dark ? palette.navy : palette.cream, color: dark ? palette.white : palette.ink, opacity: fade, overflow: 'hidden'}}>
    <div style={{position: 'absolute', width: 760, height: 760, borderRadius: '50%', top: -330 + drift, right: -310, background: accent, opacity: dark ? 0.18 : 0.12, filter: 'blur(3px)'}} />
    <div style={{position: 'absolute', width: 520, height: 520, borderRadius: '50%', bottom: -280 - drift, left: -260, border: `2px solid ${accent}`, opacity: 0.24}} />
    <div style={{position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${dark ? 'rgba(255,255,255,.035)' : 'rgba(7,27,43,.035)'} 1px, transparent 1px), linear-gradient(90deg, ${dark ? 'rgba(255,255,255,.035)' : 'rgba(7,27,43,.035)'} 1px, transparent 1px)`, backgroundSize: '72px 72px', maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'}} />
    <div style={{position: 'absolute', top: 72, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 21, letterSpacing: 3.6, fontWeight: 800, color: dark ? '#B8D2DD' : palette.muted}}>
      <span>CHÁNH KIẾN · AI</span><span style={{width: 44, height: 8, borderRadius: 99, background: accent}} />
    </div>
    <div style={{position: 'absolute', inset: '150px 72px 120px'}}>{children}</div>
  </AbsoluteFill>;
};

const Kicker = ({children, color = palette.teal, delay = 0}: PropsWithChildren<{color?: string; delay?: number}>) => {
  const frame = useCurrentFrame();
  return <div style={{...appear(frame, delay), color, fontSize: 24, letterSpacing: 3.4, fontWeight: 850, textTransform: 'uppercase', marginBottom: 26}}>{children}</div>;
};

const Pill = ({children, color = palette.teal, inverse = false, style}: PropsWithChildren<{color?: string; inverse?: boolean; style?: CSSProperties}>) => (
  <div style={{display: 'inline-flex', alignItems: 'center', borderRadius: 999, padding: '13px 22px', background: inverse ? color : `${color}20`, color: inverse ? palette.navy : color, border: `2px solid ${color}`, fontSize: 24, lineHeight: 1, fontWeight: 850, ...style}}>{children}</div>
);

const BigTitle = ({children, size = 100, style}: {children: ReactNode; size?: number; style?: CSSProperties}) => (
  <div style={{fontSize: size, lineHeight: 0.98, letterSpacing: -4.2, fontWeight: 900, ...style}}>{children}</div>
);

const SceneOne = () => {
  const frame = useCurrentFrame();
  const stamp = spring({frame: frame - 46, fps: 30, config: {damping: 13, stiffness: 130}});
  return <Scene dark accent={palette.coral}>
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Kicker color={palette.yellow}>Một câu hỏi nghe rất hợp lý</Kicker>
      <div style={appear(frame, 8)}><BigTitle size={114}>NGUYÊN NHÂN<br /><span style={{color: palette.coral}}>LÀ GÌ?</span></BigTitle></div>
      <div style={{...appear(frame, 28), marginTop: 54, height: 3, background: 'linear-gradient(90deg, #FFFFFF 0 45%, transparent 45% 53%, #FFFFFF 53%)', opacity: 0.35}} />
      <div style={{transform: `scale(${stamp}) rotate(-3deg)`, transformOrigin: 'left center', marginTop: 58}}>
        <div style={{display: 'inline-block', padding: '22px 30px', border: `4px solid ${palette.yellow}`, color: palette.yellow, fontSize: 38, fontWeight: 900, letterSpacing: 1.2}}>CHƯA ĐỦ DỮ KIỆN</div>
      </div>
      <div style={{...appear(frame, 64), marginTop: 70, fontSize: 36, lineHeight: 1.3, color: '#C9D9DF', fontWeight: 650}}>Nghe hợp lý <span style={{color: palette.coral, fontWeight: 900}}>≠</span> đã được chứng minh</div>
    </div>
  </Scene>;
};

const FactCard = ({label, value, color, delay}: {label: string; value: ReactNode; color: string; delay: number}) => {
  const frame = useCurrentFrame();
  return <div style={{...appear(frame, delay), background: palette.paper, borderRadius: 34, padding: '34px 38px', boxShadow: '0 24px 70px rgba(7,27,43,.13)', borderLeft: `10px solid ${color}`}}>
    <div style={{fontSize: 21, letterSpacing: 2.6, fontWeight: 850, color: palette.muted}}>{label}</div>
    <div style={{fontSize: 52, lineHeight: 1.1, marginTop: 14, fontWeight: 900, color: palette.ink}}>{value}</div>
  </div>;
};

const SceneTwo = () => {
  const frame = useCurrentFrame();
  const cross = spring({frame: frame - 58, fps: 30, config: {damping: 12}});
  return <Scene accent={palette.coral}>
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Kicker color={palette.coral}>Hai việc xảy ra gần nhau</Kicker>
      <BigTitle size={82}>CHƯA CHỨNG MINH<br />QUAN HỆ NHÂN QUẢ</BigTitle>
      <div style={{marginTop: 74, display: 'grid', gap: 28}}>
        <FactCard label="DỮ KIỆN 01" color={palette.coral} delay={18} value={<>Doanh thu <span style={{color: palette.coral}}>↓ 20%</span></>} />
        <div style={{height: 70, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'absolute', top: 34, left: 160, right: 160, borderTop: `3px dashed ${palette.muted}`, opacity: 0.35}} />
          <div style={{transform: `scale(${cross}) rotate(-5deg)`, zIndex: 1, background: palette.cream, padding: '0 22px', fontSize: 52, fontWeight: 900, color: palette.coral}}>≠ NGUYÊN NHÂN</div>
        </div>
        <FactCard label="DỮ KIỆN 02" color={palette.yellow} delay={34} value="Vừa đổi mẫu quảng cáo" />
      </div>
      <div style={{...appear(frame, 84), marginTop: 58, textAlign: 'center'}}><Pill color={palette.coral}>CHƯA THỂ KẾT LUẬN</Pill></div>
    </div>
  </Scene>;
};

const FrameworkCard = ({number, title, text, color, delay}: {number: string; title: string; text: string; color: string; delay: number}) => {
  const frame = useCurrentFrame();
  return <div style={{...appear(frame, delay, 24), background: palette.paper, borderRadius: 28, padding: 28, minHeight: 250, boxShadow: '0 14px 40px rgba(7,27,43,.09)', borderTop: `8px solid ${color}`}}>
    <div style={{display: 'flex', gap: 18, alignItems: 'center'}}><div style={{width: 42, height: 42, borderRadius: 14, background: color, color: palette.navy, display: 'grid', placeItems: 'center', fontWeight: 900}}>{number}</div><div style={{fontSize: 28, fontWeight: 900, letterSpacing: .5}}>{title}</div></div>
    <div style={{fontSize: 25, lineHeight: 1.34, color: palette.muted, marginTop: 22, fontWeight: 600}}>{text}</div>
  </div>;
};

const SceneThree = () => {
  const frame = useCurrentFrame();
  return <Scene dark accent={palette.teal}>
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Kicker color={palette.teal}>Đừng xin kết luận ngay</Kicker>
      <BigTitle size={84}>BUỘC AI TÁCH<br /><span style={{color: palette.teal}}>BỐN PHẦN</span></BigTitle>
      <div style={{marginTop: 58, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, color: palette.ink}}>
        <FrameworkCard number="1" title="DỮ KIỆN" color={palette.teal} delay={14} text="Những điều được cung cấp hoặc có thể xác nhận trực tiếp." />
        <FrameworkCard number="2" title="SUY LUẬN" color={palette.yellow} delay={24} text="Những giả thuyết hợp lý nhưng chưa được chứng minh." />
        <FrameworkCard number="3" title="CHƯA BIẾT" color={palette.coral} delay={34} text="Thông tin còn thiếu khiến chưa thể kết luận." />
        <FrameworkCard number="4" title="KIỂM CHỨNG" color="#81A8FF" delay={44} text="Những câu hỏi hoặc dữ liệu cần thu thập tiếp." />
      </div>
      <div style={{...appear(frame, 70), marginTop: 36, padding: '24px 30px', borderRadius: 22, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', fontSize: 26, lineHeight: 1.35, color: '#DCEAF0', fontWeight: 700}}>Không biến suy luận thành sự thật. Nếu dữ kiện chưa đủ, hãy nói rõ là chưa đủ.</div>
    </div>
  </Scene>;
};

const CheckItem = ({children, delay}: PropsWithChildren<{delay: number}>) => {
  const frame = useCurrentFrame();
  return <div style={{...appear(frame, delay, 20), display: 'flex', alignItems: 'center', gap: 16, background: palette.paper, borderRadius: 22, padding: '22px 24px', fontSize: 29, fontWeight: 750, boxShadow: '0 12px 30px rgba(7,27,43,.08)'}}><div style={{width: 34, height: 34, borderRadius: '50%', background: palette.teal, color: palette.navy, display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 950}}>?</div>{children}</div>;
};

const SceneFour = () => {
  const frame = useCurrentFrame();
  return <Scene accent={palette.teal}>
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Kicker>Thử trực tiếp trong ChatGPT · 24.08.2026</Kicker>
      <BigTitle size={79}>AI KHÔNG VỘI<br />CHỐT NGUYÊN NHÂN</BigTitle>
      <div style={{...appear(frame, 18), marginTop: 58, padding: '32px 34px', borderRadius: 30, background: palette.coralSoft, border: `2px solid ${palette.coral}`}}>
        <div style={{fontSize: 24, fontWeight: 850, color: palette.coral, letterSpacing: 2}}>GIẢ THUYẾT</div>
        <div style={{fontSize: 42, lineHeight: 1.14, fontWeight: 900, marginTop: 10}}>“Quảng cáo là nguyên nhân”</div>
        <div style={{marginTop: 20}}><Pill color={palette.coral}>CHƯA PHẢI KẾT LUẬN</Pill></div>
      </div>
      <div style={{marginTop: 42, fontSize: 27, fontWeight: 850, color: palette.muted}}>AI yêu cầu kiểm tra thêm:</div>
      <div style={{marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
        <CheckItem delay={40}>Lượt truy cập</CheckItem><CheckItem delay={48}>Tỷ lệ chuyển đổi</CheckItem><CheckItem delay={56}>Giá bán</CheckItem><CheckItem delay={64}>Tồn kho</CheckItem>
      </div>
      <div style={{...appear(frame, 82), marginTop: 38, color: palette.muted, fontSize: 23, lineHeight: 1.35}}>Kết quả của phép thử hiện tại — không phải bảo đảm cho mọi lần chạy.</div>
    </div>
  </Scene>;
};

const SceneFive = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [54, 86], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return <Scene dark accent={palette.yellow}>
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <Kicker color={palette.yellow}>Giới hạn quan trọng nhất</Kicker>
      <div style={appear(frame, 10)}><BigTitle size={91}>KHÔNG LÀM AI<br /><span style={{color: palette.yellow}}>LUÔN ĐÚNG</span></BigTitle></div>
      <div style={{...appear(frame, 34), marginTop: 72, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
        <div style={{background: 'rgba(18,199,162,.13)', border: `2px solid ${palette.teal}`, borderRadius: 32, padding: 34, minHeight: 300}}><div style={{fontSize: 24, color: palette.teal, fontWeight: 900, letterSpacing: 2}}>PHẦN AI BIẾT</div><div style={{fontSize: 42, lineHeight: 1.12, fontWeight: 900, marginTop: 90}}>DỮ KIỆN</div></div>
        <div style={{background: 'rgba(255,107,87,.13)', border: `2px solid ${palette.coral}`, borderRadius: 32, padding: 34, minHeight: 300}}><div style={{fontSize: 24, color: palette.coral, fontWeight: 900, letterSpacing: 2}}>PHẦN AI ĐOÁN</div><div style={{fontSize: 42, lineHeight: 1.12, fontWeight: 900, marginTop: 90}}>SUY LUẬN</div></div>
      </div>
      <div style={{marginTop: 54, height: 4, width: `${line}%`, background: `linear-gradient(90deg, ${palette.teal}, ${palette.yellow}, ${palette.coral})`, borderRadius: 99}} />
      <div style={{...appear(frame, 74), marginTop: 34, fontSize: 32, lineHeight: 1.35, color: '#D5E3E8', fontWeight: 650}}>Con người vẫn phải quyết định<br />điều gì cần kiểm chứng tiếp.</div>
    </div>
  </Scene>;
};

const SceneSix = () => {
  const frame = useCurrentFrame();
  const zoom = spring({frame: frame - 30, fps: 30, config: {damping: 16, stiffness: 100}});
  const labels = ['DỮ KIỆN', 'SUY LUẬN', 'CHƯA BIẾT', 'KIỂM CHỨNG'];
  return <Scene dark accent={palette.teal}>
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14}}>{labels.map((label, index) => <div key={label} style={{...appear(frame, index * 5), padding: '13px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,.25)', color: '#CDE0E7', fontSize: 20, fontWeight: 800, letterSpacing: 1.5}}>{label}</div>)}</div>
      <div style={{transform: `scale(${zoom})`, marginTop: 84}}>
        <BigTitle size={113}>ĐỪNG VỘI TIN.</BigTitle>
        <BigTitle size={113} style={{color: palette.teal, marginTop: 20}}>HÃY KIỂM CHỨNG.</BigTitle>
      </div>
      <div style={{...appear(frame, 68), marginTop: 86, fontSize: 29, lineHeight: 1.4, color: '#C3D8E0', fontWeight: 650}}>Thêm bốn dòng trước khi<br />biến câu trả lời thành quyết định.</div>
      <div style={{...appear(frame, 88), margin: '74px auto 0', width: 88, height: 8, borderRadius: 99, background: palette.yellow}} />
    </div>
  </Scene>;
};

export const CKAI0004Film = () => {
  const scenes: Array<{start: number; end: number; node: ReactNode}> = [
    {start: 0, end: 9, node: <SceneOne />},
    {start: 9, end: 18, node: <SceneTwo />},
    {start: 18, end: 27, node: <SceneThree />},
    {start: 27, end: 37, node: <SceneFour />},
    {start: 37, end: 45, node: <SceneFive />},
    {start: 45, end: 50, node: <SceneSix />},
  ];
  return <AbsoluteFill>{scenes.map((scene, index) => <Sequence key={index} from={scene.start * 30} durationInFrames={(scene.end - scene.start) * 30}>{scene.node}</Sequence>)}</AbsoluteFill>;
};
