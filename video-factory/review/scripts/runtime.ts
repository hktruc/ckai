import {readFileSync} from 'node:fs';
import {TEST_0002} from '../../animation/src/manifest/test0002';
import type {VoicePlan} from '../../voice/src/model';
import {createTest0002ReviewManifest} from '../src/manifest/test0002';
import {probeVideo} from '../src/media';
import {sha256} from '../../voice/src/segment';

export const loadTest0002ReviewInput = () => {
  const voicePlan = JSON.parse(readFileSync('generated/voice/TEST-0002/voice-plan.generated.json', 'utf8')) as VoicePlan;
  const review = createTest0002ReviewManifest(voicePlan);
  return {review, voicePlan, animation: TEST_0002};
};

export const hydrateReviewPreview = <T extends ReturnType<typeof loadTest0002ReviewInput>>(input: T): T => {
  const probe = probeVideo(input.review.reviewPreview.path);
  input.review.reviewPreview = {
    ...input.review.reviewPreview,
    sha256: sha256(readFileSync(input.review.reviewPreview.path)), codec: probe.videoCodec, audioCodec: probe.audioCodec,
    width: probe.width, height: probe.height, fps: probe.fps, durationSeconds: Number(probe.durationSeconds.toFixed(3)),
  };
  return input;
};
