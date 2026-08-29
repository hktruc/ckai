import {join} from 'node:path';

export const configureDefaultPiperEnvironment = (): void => {
  const root = join(process.env.LOCALAPPDATA ?? '', 'CKAI', 'voice-runtime');
  process.env.PIPER_PYTHON ||= join(root, 'Scripts', 'python.exe');
  process.env.PIPER_VAIS1000_MODEL ||= join(root, 'models', 'vi_VN-vais1000-medium.onnx');
  process.env.PIPER_VIVOS_MODEL ||= join(root, 'models', 'vi_VN-vivos-x_low.onnx');
};
