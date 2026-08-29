import {sha256} from '../../voice/src/segment';
import type {FinalReviewManifest} from '../../review/src/model';

const digest = (value: unknown): string => sha256(Buffer.from(JSON.stringify(value)));

export const reviewDigests = (review: FinalReviewManifest) => ({
  timeline: digest({contentId: review.contentId, sourceChain: review.sourceChain, cues: review.captions.map((cue) => [cue.voiceSegmentId, cue.startSeconds, cue.endSeconds])}),
  captions: digest({mode: review.captionMode, policy: review.captionPolicy, cues: review.captions}),
  finishing: digest({musicMode: review.musicMode, sfxMode: review.sfxMode, voiceGainDb: review.voiceGainDb, assets: review.finishingAudioAssets}),
});
