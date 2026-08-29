import type {FinishingAudioAsset} from './model';

export const linearGain = (gainDb: number): number => 10 ** (gainDb / 20);

export const finishingGainAtTime = (
  asset: FinishingAudioAsset,
  absoluteSeconds: number,
  voiceWindows: Array<{startSeconds: number; endSeconds: number}> = [],
): number => {
  const localSeconds = absoluteSeconds - asset.startSeconds;
  if (localSeconds < 0 || (asset.durationSeconds !== undefined && localSeconds >= asset.durationSeconds)) return 0;
  const fadeIn = asset.fadeInSeconds ? Math.min(1, Math.max(0, localSeconds / asset.fadeInSeconds)) : 1;
  const remaining = asset.durationSeconds === undefined ? Number.POSITIVE_INFINITY : asset.durationSeconds - localSeconds;
  const fadeOut = asset.fadeOutSeconds ? Math.min(1, Math.max(0, remaining / asset.fadeOutSeconds)) : 1;
  const underVoice = voiceWindows.some((window) => absoluteSeconds >= window.startSeconds && absoluteSeconds < window.endSeconds);
  const duck = asset.type === 'music' && underVoice ? linearGain(asset.duckUnderVoiceDb ?? -8) : 1;
  return linearGain(asset.gainDb) * fadeIn * fadeOut * duck;
};
