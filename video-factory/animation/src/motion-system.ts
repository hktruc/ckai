import type {Scene} from './model';

export type MotionPhase = 'ENTER' | 'SETTLE' | 'EMPHASIZE' | 'TRANSITION' | 'EXIT';
export type SemanticTransition = 'CUT' | 'PUSH' | 'SLIDE' | 'FOCUS' | 'MASK_REVEAL' | 'WIPE' | 'ZOOM' | 'FADE' | 'TRANSFORM';
export type SemanticPauseReason = 'INTENTIONAL_EMPHASIS' | 'REFLECTION' | 'TENSION_HOLD';
export type MotionEvent = {phase: MotionPhase; startSeconds: number; endSeconds: number; channels: Array<'visual' | 'typography' | 'proof' | 'camera' | 'transition' | 'emphasis'>};
export type SceneMotionPlan = {events: MotionEvent[]; transitionOut: SemanticTransition; anticipationSeconds: number; intentionalPauses: Array<{startSeconds: number; endSeconds: number; reason: SemanticPauseReason}>};

const transitionFor = (intent: string, index: number): SemanticTransition => {
  if (/replace|proof|evidence/i.test(intent)) return 'MASK_REVEAL';
  if (/compare|transform/i.test(intent)) return 'TRANSFORM';
  if (/focus|emphas/i.test(intent)) return 'FOCUS';
  if (/collapse|resolve/i.test(intent)) return 'ZOOM';
  return (['CUT', 'PUSH', 'SLIDE', 'WIPE'] as const)[index % 4];
};

export const createMotionPlan = (durationSeconds: number, semanticIntent: string, index: number): SceneMotionPlan => {
  const enterEnd = Math.min(0.55, durationSeconds * 0.16);
  const exitStart = Math.max(enterEnd + 0.2, durationSeconds - Math.min(0.42, durationSeconds * 0.1));
  const middle = (enterEnd + exitStart) / 2;
  return {
    events: [
      {phase: 'ENTER', startSeconds: 0, endSeconds: enterEnd, channels: ['visual', 'typography']},
      {phase: 'SETTLE', startSeconds: enterEnd, endSeconds: middle, channels: ['camera']},
      {phase: 'EMPHASIZE', startSeconds: middle, endSeconds: exitStart, channels: [/proof|evidence|progress/i.test(semanticIntent) ? 'proof' : 'emphasis', 'camera']},
      {phase: 'TRANSITION', startSeconds: exitStart, endSeconds: durationSeconds, channels: ['transition']},
      {phase: 'EXIT', startSeconds: exitStart, endSeconds: durationSeconds, channels: ['visual']},
    ],
    transitionOut: transitionFor(semanticIntent, index), anticipationSeconds: index === 0 ? 0 : 0.18, intentionalPauses: [],
  };
};

export const validateMotionPlan = (scene: Scene): string[] => {
  const plan = scene.motionPlan;
  if (!plan) return ['motion plan is missing'];
  const duration = scene.endSeconds - scene.startSeconds;
  const errors: string[] = [];
  if (!plan.events.length || plan.events[0].startSeconds !== 0 || Math.abs(Math.max(...plan.events.map((event) => event.endSeconds)) - duration) > 0.001) errors.push('motion plan does not cover the full scene timeline');
  if (plan.events.some((event) => event.endSeconds <= event.startSeconds || event.startSeconds < 0 || event.endSeconds > duration)) errors.push('motion event timing is invalid');
  if (plan.events.some((event) => event.channels.length > 3)) errors.push('excessive simultaneous movement');
  const boundaries = new Set([0, duration, ...plan.events.flatMap((event) => [event.startSeconds, event.endSeconds])]);
  const sorted = [...boundaries].sort((a, b) => a - b);
  for (let index = 1; index < sorted.length; index++) {
    const start = sorted[index - 1]; const end = sorted[index]; const mid = (start + end) / 2;
    const active = plan.events.some((event) => event.startSeconds <= mid && event.endSeconds >= mid && event.channels.length);
    const intentional = plan.intentionalPauses.some((pause) => pause.startSeconds <= start && pause.endSeconds >= end);
    if (!active && !intentional) errors.push(`dead-air motion gap ${start.toFixed(2)}-${end.toFixed(2)}s`);
  }
  if (plan.anticipationSeconds < 0 || plan.anticipationSeconds > 0.35) errors.push('anticipation exceeds restrained clarity boundary');
  return errors;
};

export const validateMotionSequence = (scenes: Scene[]): string[] => {
  const errors = scenes.flatMap((scene) => validateMotionPlan(scene).map((error) => `${scene.id}: ${error}`));
  for (let index = 2; index < scenes.length; index++) {
    const current = scenes[index].motionPlan?.transitionOut; const previous = scenes[index - 1].motionPlan?.transitionOut; const before = scenes[index - 2].motionPlan?.transitionOut;
    if (current && current === previous && previous === before) errors.push(`${scenes[index].id}: repeated transition used three times consecutively`);
  }
  return errors;
};
