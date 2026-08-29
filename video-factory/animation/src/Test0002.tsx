import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {TEST_0002} from './manifest/test0002';
import {getSceneFrames} from './engine/timeline';
import {Card, CodeText, SafeArea, SceneHeader, TruthLabel} from './primitives';
import {theme} from './theme';

const base: React.CSSProperties = {background: theme.color.background, fontFamily: theme.font.sans, color: theme.color.ink};
const body: React.CSSProperties = {fontSize: 42, lineHeight: 1.28, margin: 0};

const Scene1 = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 45, [0, 22, 44], [1, 1.018, 1]);
  return <AbsoluteFill style={base}><SafeArea style={{gap: 64}}>
    <SceneHeader scene="SC-01" kicker="Problem" title={<>Text lộn xộn làm bạn<br/>mất thời gian?</>} />
    <Card delay={12} style={{transform: `scale(${pulse})`, marginTop: 16}}><CodeText size={37}>{TEST_0002.assets.A1.value}</CodeText></Card>
    <div style={{marginTop: 'auto', fontSize: 34, color: theme.color.muted}}>Cùng một sample document xuyên suốt 5 scene.</div>
  </SafeArea></AbsoluteFill>;
};

const Scene2 = () => <AbsoluteFill style={base}><SafeArea style={{justifyContent: 'center', gap: 46}}>
  <SceneHeader scene="SC-02" kicker="Scope" title={<>Chỉ dọn<br/><span style={{color: theme.color.green}}>phần định dạng.</span></>} />
  <Card delay={8}><p style={body}>Nội dung và ý nghĩa giữ nguyên.</p></Card>
  <TruthLabel>Không quyết định nội dung</TruthLabel>
</SafeArea></AbsoluteFill>;

const Scene3 = () => <AbsoluteFill style={base}><SafeArea style={{gap: 42}}>
  <SceneHeader scene="SC-03" kicker="Action" title="Dùng instruction đã test" />
  <Card delay={10} tone="proof" style={{padding: 42}}><CodeText size={35}>{TEST_0002.assets.A2.value}</CodeText></Card>
  <div style={{display: 'flex', gap: 18, alignItems: 'center'}}><TruthLabel>{TEST_0002.assets.A2.truthLabel}</TruthLabel><span style={{fontSize: 28, color: theme.color.muted}}>actual-proof · repo-backed text</span></div>
  <Card delay={24} style={{marginTop: 'auto'}}><div style={{fontSize: 28, color: theme.color.muted, marginBottom: 12}}>INPUT CONTEXT</div><CodeText size={28}>{TEST_0002.assets.A1.value}</CodeText></Card>
</SafeArea></AbsoluteFill>;

const Scene4 = () => <AbsoluteFill style={base}><SafeArea style={{gap: 30}}>
  <SceneHeader scene="SC-04" kicker="Result" title="Before → verified output" />
  <Card delay={8} style={{padding: 28}}><div style={{fontSize: 25, fontWeight: 700, color: theme.color.muted, marginBottom: 12}}>BEFORE · A1</div><CodeText size={27}>{TEST_0002.assets.A1.value}</CodeText></Card>
  <Card delay={18} tone="proof" style={{padding: 32}}><div style={{fontSize: 25, fontWeight: 700, color: theme.color.green, marginBottom: 12}}>OBSERVED OUTPUT · A3</div><CodeText size={31}>{TEST_0002.assets.A3.value}</CodeText></Card>
  <Card delay={28} tone="proof" style={{padding: 28}}><CodeText size={28}>{TEST_0002.assets.A4.value}</CodeText></Card>
  <TruthLabel warning>E2 direct test · sample ngắn · 4/4</TruthLabel>
</SafeArea></AbsoluteFill>;

const Scene5 = () => <AbsoluteFill style={base}><SafeArea style={{gap: 44}}>
  <SceneHeader scene="SC-05" kicker="Limit" title="Đừng biến kết quả mẫu thành lời hứa." />
  <Card delay={10} tone="warning" style={{padding: 42}}><TruthLabel warning>CAVEAT BẮT BUỘC</TruthLabel><p style={{...body, fontSize: 45, fontWeight: 700, marginTop: 28}}>{TEST_0002.assets.A5.value}</p></Card>
  <div style={{display: 'flex', flexDirection: 'column', gap: 20, marginTop: 'auto'}}>
    <Card delay={22} tone="proof" style={{padding: 28}}><p style={{...body, fontSize: 36}}><b>AI:</b> dọn cấu trúc theo instruction.</p></Card>
    <Card delay={30} style={{padding: 28}}><p style={{...body, fontSize: 36}}><b>Con người:</b> kiểm tra nghĩa và quyết định dùng.</p></Card>
  </div>
  <div style={{fontSize: 28, color: theme.color.muted}}>{TEST_0002.assets.A5.truthLabel} · không mở rộng sang OCR/bảng/tài liệu dài.</div>
</SafeArea></AbsoluteFill>;

const components = [Scene1, Scene2, Scene3, Scene4, Scene5];

const ProofMotion = ({children}: {children: React.ReactNode}) => {
  const frame = useCurrentFrame();
  const cycle = frame % 120;
  const drift = interpolate(cycle, [0, 60, 119], [0, -16, 0]);
  const scale = interpolate(cycle, [0, 60, 119], [1.002, 1.045, 1.002]);
  return <AbsoluteFill style={{transform:`translateY(${drift}px) scale(${scale})`,transformOrigin:'50% 50%'}}>{children}</AbsoluteFill>;
};

export const Test0002Animation = () => <AbsoluteFill style={base}>
  {getSceneFrames(TEST_0002).map((scene, index) => {
    const Component = components[index];
    return <Sequence key={scene.id} name={`${scene.id} · ${scene.purpose}`} from={scene.startFrame} durationInFrames={scene.durationInFrames}><ProofMotion><Component /></ProofMotion></Sequence>;
  })}
</AbsoluteFill>;
