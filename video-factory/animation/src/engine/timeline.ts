import type {AnimationManifest} from '../model';

export const secondsToFrame = (seconds: number, fps: number): number => {
  if (!Number.isFinite(seconds) || seconds < 0 || !Number.isInteger(fps) || fps <= 0) {
    throw new Error(`Invalid timeline value: seconds=${seconds}, fps=${fps}`);
  }
  return Math.round(seconds * fps);
};

export const getTotalFrames = (manifest: AnimationManifest): number =>
  secondsToFrame(manifest.totalSeconds, manifest.fps);

export const getSceneFrames = (manifest: AnimationManifest) => manifest.scenes.map((scene) => {
  const startFrame = secondsToFrame(scene.startSeconds, manifest.fps);
  const endFrame = secondsToFrame(scene.endSeconds, manifest.fps);
  return {...scene, startFrame, endFrame, durationInFrames: endFrame - startFrame};
});
