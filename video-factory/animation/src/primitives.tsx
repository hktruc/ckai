import type {CSSProperties, PropsWithChildren, ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {theme} from './theme';

export const revealStyle = (frame: number, delay = 0): CSSProperties => {
  const progress = interpolate(frame, [delay, delay + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return {opacity: progress, transform: `translateY(${(1 - progress) * 32}px)`};
};

export const SafeArea = ({children, style}: PropsWithChildren<{style?: CSSProperties}>) => (
  <div style={{position: 'absolute', inset: `${theme.safe.top}px ${theme.safe.right}px ${theme.safe.bottom}px ${theme.safe.left}px`, display: 'flex', flexDirection: 'column', overflow: 'hidden', ...style}}>{children}</div>
);

export const SceneHeader = ({scene, kicker, title}: {scene: string; kicker: string; title: ReactNode}) => {
  const frame = useCurrentFrame();
  return <div style={revealStyle(frame)}>
    <div style={{fontSize: 28, letterSpacing: 2.4, textTransform: 'uppercase', color: theme.color.green, fontWeight: 700}}>{scene} · {kicker}</div>
    <div style={{fontSize: 78, lineHeight: 1.04, letterSpacing: -2.4, marginTop: 24, fontWeight: 800, color: theme.color.ink}}>{title}</div>
  </div>;
};

export const Card = ({children, delay = 0, tone = 'plain', style}: PropsWithChildren<{delay?: number; tone?: 'plain' | 'proof' | 'warning'; style?: CSSProperties}>) => {
  const frame = useCurrentFrame();
  const colors = tone === 'warning' ? {background: theme.color.amberSoft, border: theme.color.amber} : tone === 'proof' ? {background: theme.color.greenSoft, border: theme.color.green} : {background: theme.color.card, border: theme.color.line};
  return <div style={{...revealStyle(frame, delay), background: colors.background, border: `2px solid ${colors.border}`, borderRadius: theme.radius.card, padding: 36, boxShadow: theme.shadow, overflow: 'hidden', ...style}}>{children}</div>;
};

export const TruthLabel = ({children, warning = false}: PropsWithChildren<{warning?: boolean}>) => (
  <div style={{display: 'inline-flex', alignSelf: 'flex-start', background: warning ? theme.color.amber : theme.color.green, color: '#fff', borderRadius: theme.radius.pill, padding: '12px 20px', fontSize: 26, lineHeight: 1.15, fontWeight: 700}}>{children}</div>
);

export const CodeText = ({children, size = 34}: PropsWithChildren<{size?: number}>) => (
  <pre style={{fontFamily: theme.font.mono, fontSize: size, lineHeight: 1.42, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', margin: 0, color: theme.color.ink}}>{children}</pre>
);
