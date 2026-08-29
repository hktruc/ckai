import {existsSync, readFileSync} from 'node:fs';
import {probeAudioLevels} from '../../voice/src/media';
import {sha256} from '../../voice/src/segment';
import {inspectDecodedMediaEquivalence, validateDecodedMediaEquivalence, validateSourceEquivalence} from './equivalence';
import {assertPublishGate} from './gates';
import {inspectExportMedia} from './media';
import type {ExportMode, ExportRuntimeInput} from './model';
import {validateDeliveryProfile} from './profile';
import {verifyExportUpstream} from './upstream';

export const runExportQa = (input: ExportRuntimeInput, mode: ExportMode, requireOutput = false) => {
  const {exportManifest: manifest} = input;
  const errors: string[] = [];
  const upstream = verifyExportUpstream(input, mode);
  errors.push(...upstream.errors, ...validateDeliveryProfile(manifest.deliveryProfile));
  if (manifest.outputFilename !== `${manifest.contentId}_v${manifest.releaseVersion}_master.mp4` || manifest.outputPath !== `generated/exports/${manifest.contentId}/${manifest.outputFilename}`) errors.push('Export output identity/path is not deterministic');
  if (requireOutput) {
    if (!existsSync(manifest.outputPath)) errors.push('Export output is missing');
    else {
      const inspection = inspectExportMedia(manifest.outputPath);
      if (!manifest.mediaInspection || JSON.stringify(manifest.mediaInspection) !== JSON.stringify(inspection)) errors.push('Recorded media inspection is missing or stale');
      if (!manifest.outputSha256 || sha256(readFileSync(manifest.outputPath)) !== manifest.outputSha256) errors.push('Recorded output SHA-256 is missing or stale');
      if (!inspection.formatName.includes('mp4') || inspection.videoCodec !== 'h264' || inspection.pixelFormat !== 'yuv420p') errors.push('Export video/container profile mismatch');
      if (inspection.audioCodec !== 'aac' || inspection.audioSampleRate !== 48000 || inspection.audioChannels !== 2) errors.push('Export audio profile mismatch');
      if (inspection.width !== 1080 || inspection.height !== 1920 || inspection.displayAspectRatio !== '9:16' || inspection.sampleAspectRatio !== '1:1') errors.push('Export dimensions/aspect mismatch');
      if (inspection.fps !== 30 || inspection.durationSeconds >= 60 || inspection.decodeCheck !== 'PASS') errors.push('Export fps/duration/decode mismatch');
      const levels = probeAudioLevels(manifest.outputPath);
      if (levels.meanVolumeDb < -60 || levels.maxVolumeDb > 0.1 || levels.zeroDbSampleRatio > 0.005) errors.push('Export introduced silence or severe clipping indicators');
      const decodedEquivalence = inspectDecodedMediaEquivalence(manifest.sourceReviewPreview, manifest.outputPath);
      if (!manifest.decodedMediaEquivalence || JSON.stringify(manifest.decodedMediaEquivalence) !== JSON.stringify(decodedEquivalence)) errors.push('Recorded decoded-media equivalence inspection is missing or stale');
      errors.push(...validateDecodedMediaEquivalence(decodedEquivalence, manifest.deliveryProfile.durationToleranceSeconds));
      errors.push(...validateSourceEquivalence(manifest, inspection));
    }
  }
  try { assertPublishGate(manifest, upstream); } catch (error) { errors.push((error as Error).message); }
  return {pass: errors.length === 0, errors, upstream};
};
