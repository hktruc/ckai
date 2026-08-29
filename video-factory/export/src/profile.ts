import type {DeliveryProfile} from './model';

export const CKAI_VERTICAL_MASTER_V1: DeliveryProfile = {
  id: 'CKAI_VERTICAL_MASTER_V1', version: 1, container: 'mp4', videoCodec: 'h264', videoEncoder: 'libx264',
  pixelFormat: 'yuv420p', width: 1080, height: 1920, aspectRatio: '9:16', fps: 30,
  crf: 18, preset: 'medium', audioCodec: 'aac', audioSampleRate: 48000, audioChannels: 2,
  audioBitrateKbps: 192, fastStart: true, maximumDurationSeconds: 60, durationToleranceSeconds: 0.12,
};

export const validateDeliveryProfile = (profile: DeliveryProfile): string[] => {
  const expected = CKAI_VERTICAL_MASTER_V1;
  const errors: string[] = [];
  for (const key of Object.keys(expected) as Array<keyof DeliveryProfile>) {
    if (profile[key] !== expected[key]) errors.push(`Delivery profile ${key} must be ${expected[key]}`);
  }
  return errors;
};

export const ffmpegArguments = (source: string, output: string): string[] => [
  '-hide_banner', '-y', '-i', source, '-map', '0:v:0', '-map', '0:a:0',
  '-c:v', 'libx264', '-vf', 'scale=in_range=pc:out_range=tv', '-color_range', 'tv', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
  '-r', '30', '-fps_mode', 'cfr', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
  '-movflags', '+faststart', '-map_metadata', '-1', output,
];
