import type {AudioProductionContract} from '../../audio/src/model';
import {resolveCanonicalTrack} from '../../audio/src/library';
import {validateAudioProductionContract} from '../../audio/src/qa';
import type {FinalReviewManifest, FinishingAudioAsset} from './model';

export const attachAudioProductionPlan = (
  review: FinalReviewManifest,
  contract: AudioProductionContract,
  finishingAssets: FinishingAudioAsset[],
  workspace = process.cwd(),
): FinalReviewManifest => {
  if (review.contentId !== contract.contentId) throw Object.assign(new Error('Audio contract Content ID does not match Final Review'), {code: 'AUDIO_CONTENT_ID_MISMATCH'});
  const contractQa = validateAudioProductionContract(contract, {workspace});
  if (!contractQa.pass) throw Object.assign(new Error(contractQa.errors.join('\n')), {code: 'AUDIO_PLAN_BLOCKED'});
  const musicAssets = finishingAssets.filter((asset) => asset.type === 'music');
  const sfxAssets = finishingAssets.filter((asset) => asset.type === 'sfx');
  if (contract.music.state === 'TRACK_APPROVED') {
    if (musicAssets.length !== 1) throw new Error('Approved music plan requires exactly one finishing music asset');
    const track = resolveCanonicalTrack(contract.music.selectedTrackId!, workspace);
    const asset = musicAssets[0]!;
    if (asset.canonicalTrackId !== track.library_track_id || asset.canonicalSourceSha256?.toUpperCase() !== track.sha256.toUpperCase()) throw new Error('Finishing music asset is not bound to the approved canonical track');
    if (JSON.stringify(asset.bedSegments ?? []) !== JSON.stringify(contract.bed.segments)) throw new Error('Finishing music automation is stale against the approved bed plan');
  } else if (musicAssets.length) throw new Error('Intentional music silence cannot contain a finishing music asset');
  if (contract.sfx.state === 'NO_SFX' && sfxAssets.length) throw new Error('NO_SFX plan cannot contain finishing SFX assets');
  if (contract.sfx.state === 'APPROVED') {
    const approved = new Set(contract.sfx.events.map((event) => event.assetId));
    if (sfxAssets.length !== approved.size || sfxAssets.some((asset) => !approved.has(asset.id))) throw new Error('Finishing SFX assets do not match the approved semantic SFX plan');
  }
  const next = structuredClone(review);
  next.audioProduction = structuredClone(contract);
  next.finishingAudioAssets = structuredClone(finishingAssets);
  next.musicMode = musicAssets.length ? 'local-approved' : 'none';
  next.sfxMode = sfxAssets.length ? 'local-approved' : 'none';
  next.reviewPreview.audioMixMode = finishingAssets.length ? 'voice-plus-local' : 'voice-only';
  return next;
};
