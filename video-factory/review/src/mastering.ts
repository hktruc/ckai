import {mkdirSync,renameSync} from 'node:fs';
import {dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {devNull} from 'node:os';
import {resolveFfmpeg} from '../../shared/media-tools';
import {probeAudioLevels} from '../../voice/src/media';

export const CKAI_SHORT_FORM_MASTERING_V1={
  id:'CKAI_SHORT_FORM_MASTERING_V1',version:1,targetIntegratedLufs:-15,integratedLufsMinimum:-16,integratedLufsMaximum:-14,truePeakMaximumDbtp:-1,
  voice:{highpassHz:70,presenceHz:3000,presenceGainDb:1.5,compressorThreshold:0.08,compressorRatio:2.2,attackMs:15,releaseMs:180,makeupLinear:1.6,knee:2},
  music:{baseGainDb:-14,duckUnderVoiceDb:-4,minimumBelowVoiceDb:12,maximumBelowVoiceDb:18,fadeInSeconds:1.5,fadeOutSeconds:2},
  bus:{compressorThreshold:0.2,compressorRatio:1.4,attackMs:25,releaseMs:250,knee:2,targetLra:7,limiterLinear:0.841395},
  qa:{minimumActiveSpeechMeanDb:-24,minimumPauseMusicMeanDb:-42,maximumSpeechToPauseMeanDb:22,minimumSpeechToPauseMeanDb:8,maximumIntegratedGainDb:12,minimumLra:2},humanAudioReviewRequired:true,
} as const;

const run=(args:string[],code:string)=>{const result=spawnSync(resolveFfmpeg(),args,{encoding:'utf8',timeout:600_000});if(result.status!==0)throw new Error(`${code}: ${(result.stderr??result.stdout??'').slice(-3000)}`);return result;};
const voiceFilter=()=>{const value=CKAI_SHORT_FORM_MASTERING_V1.voice;return`highpass=f=${value.highpassHz},equalizer=f=${value.presenceHz}:t=q:w=1.2:g=${value.presenceGainDb},acompressor=threshold=${value.compressorThreshold}:ratio=${value.compressorRatio}:attack=${value.attackMs}:release=${value.releaseMs}:makeup=${value.makeupLinear}:knee=${value.knee}`;};
const busCompressor=()=>{const value=CKAI_SHORT_FORM_MASTERING_V1.bus;return`acompressor=threshold=${value.compressorThreshold}:ratio=${value.compressorRatio}:attack=${value.attackMs}:release=${value.releaseMs}:knee=${value.knee}`;};

export const masterVoiceTimeline=(source:string,output:string)=>{mkdirSync(dirname(output),{recursive:true});run(['-hide_banner','-loglevel','error','-y','-i',source,'-af',voiceFilter(),'-c:a','pcm_s24le','-ar','48000','-ac','2',output],'VOICE_MASTERING_FAILED');};

type LoudnormPass={input_i:string;input_tp:string;input_lra:string;input_thresh:string;target_offset:string};
export const masterReviewBinary=(source:string,output:string)=>{
  const target=CKAI_SHORT_FORM_MASTERING_V1;const firstFilter=`${busCompressor()},loudnorm=I=${target.targetIntegratedLufs}:TP=${target.truePeakMaximumDbtp}:LRA=${target.bus.targetLra}:print_format=json`;
  const first=run(['-hide_banner','-nostats','-i',source,'-af',firstFilter,'-f','null','NUL'],'MASTERING_MEASUREMENT_FAILED');const blocks=[...first.stderr.matchAll(/\{[\s\S]*?"target_offset"\s*:\s*"[^"]+"[\s\S]*?\}/g)];if(!blocks.length)throw new Error('MASTERING_MEASUREMENT_FAILED: loudnorm JSON unavailable');const measured=JSON.parse(blocks.at(-1)![0]) as LoudnormPass;
  const loudnorm=`loudnorm=I=${target.targetIntegratedLufs}:TP=${target.truePeakMaximumDbtp}:LRA=${target.bus.targetLra}:measured_I=${measured.input_i}:measured_TP=${measured.input_tp}:measured_LRA=${measured.input_lra}:measured_thresh=${measured.input_thresh}:offset=${measured.target_offset}:linear=true:print_format=summary`;
  mkdirSync(dirname(output),{recursive:true});const partial=output.replace(/\.mp4$/i,'.partial.mp4');run(['-hide_banner','-loglevel','error','-y','-i',source,'-map','0:v:0','-map','0:a:0','-c:v','copy','-af',`${busCompressor()},${loudnorm},alimiter=limit=${target.bus.limiterLinear}:attack=5:release=50:level=false`,'-c:a','aac','-b:a','320k','-ar','48000','-ac','2','-movflags','+faststart',partial],'MASTERING_RENDER_FAILED');renameSync(partial,output);
  return{policyId:target.id,firstPass:{inputIntegratedLufs:Number(measured.input_i),inputTruePeakDbtp:Number(measured.input_tp),inputLra:Number(measured.input_lra),inputThresholdLufs:Number(measured.input_thresh),targetOffsetDb:Number(measured.target_offset)},voiceFilter:voiceFilter(),busFilter:`${busCompressor()} → two-pass loudnorm → true-peak limiter`};
};

export const inspectMasteredBinary=(path:string)=>{
  const result=run(['-hide_banner','-nostats','-i',path,'-filter_complex','ebur128=peak=true','-f','null',devNull],'MASTERING_BINARY_QA_FAILED');
  const integrated=[...result.stderr.matchAll(/I:\s*(-?\d+(?:\.\d+)?) LUFS/g)].at(-1);const peak=[...result.stderr.matchAll(/Peak:\s*(-?\d+(?:\.\d+)?) dBFS/g)].at(-1);const lra=[...result.stderr.matchAll(/LRA:\s*(-?\d+(?:\.\d+)?) LU/g)].at(-1);if(!integrated||!peak||!lra)throw new Error('MASTERING_BINARY_QA_FAILED: EBU R128 metrics unavailable');
  return{integratedLufs:Number(integrated[1]),truePeakDbtp:Number(peak[1]),lra:Number(lra[1]),...probeAudioLevels(path)};
};

export const evaluateMasteringCoreQa=(value:{integratedLufs:number;truePeakDbtp:number;lra:number;maxVolumeDb:number;integratedGainDb:number})=>{const p=CKAI_SHORT_FORM_MASTERING_V1;const checks={MASTER_INTEGRATED_LOUDNESS:value.integratedLufs>=p.integratedLufsMinimum&&value.integratedLufs<=p.integratedLufsMaximum,MASTER_TRUE_PEAK_SAFE:value.truePeakDbtp<=p.truePeakMaximumDbtp,NO_CLIPPING:value.maxVolumeDb<=0,NO_MASTERING_DISTORTION:value.truePeakDbtp<=p.truePeakMaximumDbtp,NO_EXCESSIVE_COMPRESSION:value.lra>=p.qa.minimumLra&&value.integratedGainDb<=p.qa.maximumIntegratedGainDb};return{policyId:p.id,status:Object.values(checks).every(Boolean)?'PASS':'BLOCKED',checks:Object.fromEntries(Object.entries(checks).map(([key,pass])=>[key,pass?'PASS':'BLOCKED'])),humanAudioReview:'REQUIRED'};};

export type MasteringQaMeasurements={
  integratedLufs:number;truePeakDbtp:number;meanVolumeDb:number;maxVolumeDb:number;lra:number;
  activeSpeechMeanDb:number;pauseMusicMeanDb:number;integratedGainDb:number;clipping:boolean;
  musicMidrangeUsable:boolean;musicDoesNotMaskVoice:boolean;duckingPerceptuallySmooth:boolean;sfxPerceptuallyPresent:boolean;
};
export const evaluateMasteringQa=(value:MasteringQaMeasurements)=>{
  const p=CKAI_SHORT_FORM_MASTERING_V1;const relationship=value.activeSpeechMeanDb-value.pauseMusicMeanDb;
  const checks={
    VOICE_PERCEPTUALLY_LOUD_ENOUGH:value.activeSpeechMeanDb>=p.qa.minimumActiveSpeechMeanDb,
    MUSIC_PERCEPTUALLY_PRESENT:value.pauseMusicMeanDb>=p.qa.minimumPauseMusicMeanDb&&value.musicMidrangeUsable,
    VOICE_REMAINS_DOMINANT:relationship>=p.qa.minimumSpeechToPauseMeanDb&&relationship<=p.qa.maximumSpeechToPauseMeanDb,
    MUSIC_DOES_NOT_MASK_VOICE:value.musicDoesNotMaskVoice,
    MASTER_INTEGRATED_LOUDNESS:value.integratedLufs>=p.integratedLufsMinimum&&value.integratedLufs<=p.integratedLufsMaximum,
    MASTER_TRUE_PEAK_SAFE:value.truePeakDbtp<=p.truePeakMaximumDbtp,
    NO_CLIPPING:!value.clipping&&value.maxVolumeDb<=0,
    NO_MASTERING_DISTORTION:value.truePeakDbtp<=p.truePeakMaximumDbtp,
    NO_EXCESSIVE_COMPRESSION:value.lra>=p.qa.minimumLra&&value.integratedGainDb<=p.qa.maximumIntegratedGainDb,
    DUCKING_PERCEPTUALLY_SMOOTH:value.duckingPerceptuallySmooth,
    SFX_PERCEPTUALLY_PRESENT:value.sfxPerceptuallyPresent,
  };
  return{policyId:p.id,status:Object.values(checks).every(Boolean)?'PASS':'BLOCKED',checks:Object.fromEntries(Object.entries(checks).map(([key,pass])=>[key,pass?'PASS':'BLOCKED'])),humanAudioReview:'REQUIRED'};
};
