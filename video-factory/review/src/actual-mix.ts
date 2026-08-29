import {spawnSync} from 'node:child_process';
import {devNull} from 'node:os';
import {resolveFfmpeg} from '../../shared/media-tools';

export type BinaryLevelWindow={startSeconds:number;durationSeconds:number;meanVolumeDb:number;maxVolumeDb:number};
export type ActualMixCue={id:string;semanticEventSeconds:number;durationSeconds:number};
export type ActualMixQaInput={mixedBinary:string;voiceBinary:string;activeWindow:{startSeconds:number;durationSeconds:number};pauseWindow:{startSeconds:number;durationSeconds:number};cues:ActualMixCue[]};

const levels=(path:string,startSeconds:number,durationSeconds:number,side=false):BinaryLevelWindow=>{
  const filters=side?'pan=mono|c0=c0-c1,volumedetect':'volumedetect';
  const result=spawnSync(resolveFfmpeg(),['-hide_banner','-nostats','-ss',String(startSeconds),'-t',String(durationSeconds),'-i',path,'-af',filters,'-f','null',devNull],{encoding:'utf8',timeout:120_000});
  if(result.status!==0)throw new Error(`Actual-binary mix analysis failed: ${(result.stderr??'').slice(-1000)}`);
  const meanLine=result.stderr.split(/\r?\n/).find((line)=>line.includes('mean_volume:'));const peakLine=result.stderr.split(/\r?\n/).find((line)=>line.includes('max_volume:'));
  if(!meanLine||!peakLine)throw new Error('Actual-binary mix analysis returned no loudness data');
  return{startSeconds,durationSeconds,meanVolumeDb:Number.parseFloat(meanLine.split('mean_volume:')[1]!),maxVolumeDb:Number.parseFloat(peakLine.split('max_volume:')[1]!)};
};

export const inspectActualMix=(input:ActualMixQaInput)=>{
  const activeMix=levels(input.mixedBinary,input.activeWindow.startSeconds,input.activeWindow.durationSeconds);const activeVoice=levels(input.voiceBinary,input.activeWindow.startSeconds,input.activeWindow.durationSeconds);const activeSide=levels(input.mixedBinary,input.activeWindow.startSeconds,input.activeWindow.durationSeconds,true);
  const pauseMix=levels(input.mixedBinary,input.pauseWindow.startSeconds,input.pauseWindow.durationSeconds);const pauseVoice=levels(input.voiceBinary,input.pauseWindow.startSeconds,input.pauseWindow.durationSeconds);const pauseSide=levels(input.mixedBinary,input.pauseWindow.startSeconds,input.pauseWindow.durationSeconds,true);
  const speechMeanDelta=Math.abs(activeMix.meanVolumeDb-activeVoice.meanVolumeDb);const speechPeakDelta=Math.abs(activeMix.maxVolumeDb-activeVoice.maxVolumeDb);const pauseLift=pauseMix.meanVolumeDb-pauseVoice.meanVolumeDb;const sideRecovery=pauseSide.meanVolumeDb-activeSide.meanVolumeDb;const activeDominance=activeMix.meanVolumeDb-pauseMix.meanVolumeDb;
  const cueEvidence=input.cues.map((cue)=>{const mixed=levels(input.mixedBinary,cue.semanticEventSeconds,cue.durationSeconds);const voice=levels(input.voiceBinary,cue.semanticEventSeconds,cue.durationSeconds);return{...cue,mixed,voice,meanLiftDb:Number((mixed.meanVolumeDb-voice.meanVolumeDb).toFixed(1)),peakLiftDb:Number((mixed.maxVolumeDb-voice.maxVolumeDb).toFixed(1))};});
  const checks={
    MUSIC_ACTUALLY_AUDIBLE:pauseMix.meanVolumeDb>-55&&pauseLift>=10,
    VOICE_REMAINS_DOMINANT:activeDominance>=12&&speechMeanDelta<=1&&speechPeakDelta<=1,
    MUSIC_DUCKING_WORKS:sideRecovery>=3,
    MUSIC_RECOVERS_DURING_PAUSES:sideRecovery>=3&&pauseLift>=10,
    NO_VOICE_MASKING:speechMeanDelta<=1&&speechPeakDelta<=1,
    SFX_AUDIBLE_AND_SEMANTIC:cueEvidence.length>0&&cueEvidence.every((cue)=>cue.meanLiftDb>=.4||cue.peakLiftDb>=.2),
  };
  return{status:Object.values(checks).every(Boolean)?'PASS':'BLOCKED',checks:Object.fromEntries(Object.entries(checks).map(([key,value])=>[key,value?'PASS':'BLOCKED'])),measurements:{activeMix,activeVoice,activeSide,pauseMix,pauseVoice,pauseSide,speechMeanDeltaDb:Number(speechMeanDelta.toFixed(1)),speechPeakDeltaDb:Number(speechPeakDelta.toFixed(1)),pauseLiftDb:Number(pauseLift.toFixed(1)),sideRecoveryDb:Number(sideRecovery.toFixed(1)),activeDominanceDb:Number(activeDominance.toFixed(1)),cueEvidence}};
};
