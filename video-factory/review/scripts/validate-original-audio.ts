import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {probeAudio, probeAudioLevels} from '../../voice/src/media';
import {sha256} from '../../voice/src/segment';

const registryPath = resolve('generated/audio/ckai-original/library.generated.json');
if (!existsSync(registryPath)) throw new Error('CKAI original audio registry is missing');
const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as {provenance:string;assets:Array<Record<string, unknown>>};
if (!/no downloaded, sampled, provider-generated or copyrighted external media/i.test(registry.provenance)) throw new Error('Original-audio provenance boundary is missing');
const errors: string[] = [];
for (const asset of registry.assets) {
  const id = String(asset.assetId); const path = resolve(String(asset.path));
  if (!existsSync(path)) { errors.push(`${id}: missing`); continue; }
  if (sha256(readFileSync(path)) !== asset.sha256) errors.push(`${id}: checksum mismatch`);
  if (asset.source !== 'CKAI_PROCEDURAL_GENERATION' || asset.rightsStatus !== 'CKAI_ORIGINAL_INTERNAL' || asset.containsExternalSamples !== false || asset.productionApproved !== true || asset.technicalValidation !== 'PASS') errors.push(`${id}: provenance/rights/approval boundary invalid`);
  try {
    const media = probeAudio(path); const levels = probeAudioLevels(path);
    if (media.codec !== 'pcm_s24le' || media.sampleRate !== 48000 || ![1,2].includes(media.channels)) errors.push(`${id}: format mismatch`);
    if (levels.meanVolumeDb < -70 || levels.maxVolumeDb < -60 || levels.maxVolumeDb > -0.5 || levels.zeroDbSampleRatio > .005) errors.push(`${id}: audibility/clipping mismatch`);
  } catch (error) { errors.push(`${id}: ${(error as Error).message}`); }
}
if (registry.assets.length !== 6) errors.push('Original library must contain one music bed and five SFX assets');
if (errors.length) throw new Error(errors.join('\n'));
console.log(JSON.stringify({status:'PASS',assets:registry.assets.map((asset) => ({assetId:asset.assetId,path:asset.path,sha256:asset.sha256}))}, null, 2));
