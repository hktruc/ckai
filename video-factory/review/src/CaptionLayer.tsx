import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CaptionCue} from './model';

export const captionStyle = {
  fontFamily: 'Arial, sans-serif', fontSize: 43, lineHeight: 1.18, fontWeight: 700,
  color: '#F7F4ED', background: 'rgba(13, 18, 28, 0.88)', border: '2px solid rgba(255,255,255,0.16)',
  borderRadius: 22, padding: '18px 26px', maxWidth: 900, textAlign: 'center' as const,
  boxShadow: '0 14px 38px rgba(0,0,0,0.34)',
};

export const CaptionLayer = ({cues}: {cues: CaptionCue[]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cue = cues.find((item) => frame >= Math.round(item.startSeconds * fps) && frame < Math.round(item.endSeconds * fps));
  if (!cue) return null;
  const start = Math.round(cue.startSeconds * fps);
  const opacity = interpolate(frame, [start, start + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{pointerEvents: 'none', justifyContent: cue.zone === 'upper-safe' ? 'flex-start' : 'flex-end', alignItems: 'center', paddingTop: 300, paddingBottom: 150}}>
    <div style={{...captionStyle, opacity}}>{cue.lines.map((line) => <div key={line}>{line}</div>)}</div>
  </AbsoluteFill>;
};
