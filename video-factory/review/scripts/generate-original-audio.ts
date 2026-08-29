import {existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {probeAudio, probeAudioLevels} from '../../voice/src/media';
import {sha256} from '../../voice/src/segment';

const root = process.cwd();
const outputDirectory = resolve(root, 'generated/audio/ckai-original');
const registryPath = join(outputDirectory, 'library.generated.json');
const generator = 'CKAI_ORIGINAL_AUDIO_FFMPEG_V1';
mkdirSync(outputDirectory, {recursive: true});

type Definition = {
  id: string;
  filename: string;
  durationSeconds: number;
  channels: 1 | 2;
  intendedSemanticUse: string[];
  input: string;
  filters?: string;
};

const definitions: Definition[] = [
  {
    id: 'CKAI_AMBIENT_EDITORIAL_V1', filename: 'CKAI_AMBIENT_EDITORIAL_V1.wav', durationSeconds: 50.048, channels: 2,
    intendedSemanticUse: ['continuous modern-tech editorial bed', 'restrained tension', 'quiet confidence'],
    input: "aevalsrc=exprs='0.026*sin(2*PI*55*t)*(0.88+0.12*sin(2*PI*0.071*t))+0.011*sin(2*PI*82.4069*t+0.35)+0.006*sin(2*PI*110*t+0.1)+0.003*sin(2*PI*164.8138*t)*(0.75+0.25*sin(2*PI*0.113*t))|0.026*sin(2*PI*55*t+0.018)*(0.88+0.12*sin(2*PI*0.067*t))+0.011*sin(2*PI*82.4069*t+0.62)+0.006*sin(2*PI*110*t+0.28)+0.003*sin(2*PI*164.8138*t+0.15)*(0.75+0.25*sin(2*PI*0.109*t))':s=48000:d=50.048",
    filters: 'highpass=f=32,lowpass=f=11000,acompressor=threshold=0.08:ratio=2:attack=40:release=500,volume=4.5',
  },
  {
    id: 'CKAI_SFX_SOFT_WHOOSH_V1', filename: 'CKAI_SFX_SOFT_WHOOSH_V1.wav', durationSeconds: 0.82, channels: 2,
    intendedSemanticUse: ['controlled transition', 'subtle reveal'],
    input: "aevalsrc=exprs='0.08*sin(2*PI*(180*t+520*t*t))*sin(PI*t/0.82)^2|0.08*sin(2*PI*(190*t+500*t*t)+0.12)*sin(PI*t/0.82)^2':s=48000:d=0.82",
    filters: 'highpass=f=120,lowpass=f=5200,afade=t=in:d=0.12,afade=t=out:st=0.52:d=0.30,volume=3',
  },
  {
    id: 'CKAI_SFX_REVEAL_V1', filename: 'CKAI_SFX_REVEAL_V1.wav', durationSeconds: 0.72, channels: 2,
    intendedSemanticUse: ['proof reveal', 'precision cue'],
    input: "aevalsrc=exprs='0.07*(sin(2*PI*(260*t+300*t*t))+0.45*sin(2*PI*(520*t+420*t*t)))*exp(-1.5*t)|0.07*(sin(2*PI*(264*t+296*t*t)+0.08)+0.45*sin(2*PI*(528*t+414*t*t)+0.16))*exp(-1.5*t)':s=48000:d=0.72",
    filters: 'highpass=f=180,lowpass=f=6500,afade=t=in:d=0.06,afade=t=out:st=0.46:d=0.26,volume=3',
  },
  {
    id: 'CKAI_SFX_SOFT_IMPACT_V1', filename: 'CKAI_SFX_SOFT_IMPACT_V1.wav', durationSeconds: 0.48, channels: 1,
    intendedSemanticUse: ['thesis emphasis', 'restrained semantic punctuation'],
    input: "aevalsrc=exprs='0.16*sin(2*PI*74*t)*exp(-9*t)+0.045*sin(2*PI*148*t)*exp(-13*t)':s=48000:d=0.48",
    filters: 'highpass=f=35,lowpass=f=1800,afade=t=out:st=0.22:d=0.26,volume=1.8',
  },
  {
    id: 'CKAI_SFX_TENSION_RISE_V1', filename: 'CKAI_SFX_TENSION_RISE_V1.wav', durationSeconds: 1.18, channels: 2,
    intendedSemanticUse: ['opening tension', 'anticipation without alarm'],
    input: "aevalsrc=exprs='0.055*(t/1.18)*sin(2*PI*(105*t+115*t*t))+0.018*(t/1.18)*sin(2*PI*(315*t+180*t*t))|0.055*(t/1.18)*sin(2*PI*(108*t+112*t*t)+0.06)+0.018*(t/1.18)*sin(2*PI*(322*t+176*t*t)+0.12)':s=48000:d=1.18",
    filters: 'highpass=f=70,lowpass=f=4200,afade=t=in:d=0.18,afade=t=out:st=0.96:d=0.22,volume=4',
  },
  {
    id: 'CKAI_SFX_PAYOFF_V1', filename: 'CKAI_SFX_PAYOFF_V1.wav', durationSeconds: 0.92, channels: 2,
    intendedSemanticUse: ['closing payoff', 'quiet resolution'],
    input: "aevalsrc=exprs='0.06*(sin(2*PI*220*t)+0.55*sin(2*PI*330*t)+0.28*sin(2*PI*440*t))*exp(-2.8*t)|0.06*(sin(2*PI*220*t+0.05)+0.55*sin(2*PI*330*t+0.1)+0.28*sin(2*PI*440*t+0.15))*exp(-2.8*t)':s=48000:d=0.92",
    filters: 'highpass=f=110,lowpass=f=5200,afade=t=in:d=0.04,afade=t=out:st=0.56:d=0.36,volume=3',
  },
];

const generate = (definition: Definition) => {
  const output = join(outputDirectory, definition.filename); const temporary = `${output}.partial.wav`;
  if (existsSync(temporary)) unlinkSync(temporary);
  const args = ['-hide_banner','-loglevel','error','-y','-f','lavfi','-i',definition.input];
  if (definition.filters) args.push('-af', definition.filters);
  args.push('-ar','48000','-ac',String(definition.channels),'-c:a','pcm_s24le','-map_metadata','-1',temporary);
  const result = spawnSync('ffmpeg', args, {cwd:root,encoding:'utf8',timeout:180_000});
  if (result.status !== 0) throw new Error(`${definition.id} generation failed: ${result.stderr}`);
  const media = probeAudio(temporary); const levels = probeAudioLevels(temporary);
  if (media.sampleRate !== 48000 || media.channels !== definition.channels || media.codec !== 'pcm_s24le') throw new Error(`${definition.id} format validation failed`);
  if (Math.abs(media.duration - definition.durationSeconds) > 0.02) throw new Error(`${definition.id} duration validation failed`);
  if (levels.meanVolumeDb < -70 || levels.maxVolumeDb < -60 || levels.maxVolumeDb > -0.5 || levels.zeroDbSampleRatio > 0.005) throw new Error(`${definition.id} loudness validation failed`);
  renameSync(temporary, output);
  return {
    assetId: definition.id, path: relative(root, output).replaceAll('\\','/'), source: 'CKAI_PROCEDURAL_GENERATION', generator,
    generatorVersion: 1, generationParameters: {input:definition.input, filters:definition.filters ?? null, sampleFormat:'pcm_s24le'},
    createdAt: new Date().toISOString(), sha256: sha256(readFileSync(output)), sampleRate:media.sampleRate, channels:media.channels,
    durationSeconds:Number(media.duration.toFixed(3)), codec:media.codec, meanVolumeDb:levels.meanVolumeDb, maxVolumeDb:levels.maxVolumeDb,
    rightsStatus:'CKAI_ORIGINAL_INTERNAL', containsExternalSamples:false, productionApproved:true, technicalValidation:'PASS', intendedSemanticUse:definition.intendedSemanticUse,
  };
};

const assets = definitions.map(generate);
writeFileSync(registryPath, `${JSON.stringify({libraryId:'CKAI_ORIGINAL_AUDIO_V1',generator,provenance:'Deterministic local FFmpeg synthesis; no downloaded, sampled, provider-generated or copyrighted external media.',assets}, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({status:'PASS',registry:relative(root,registryPath).replaceAll('\\','/'),assets:assets.map(({assetId,path,sha256,sampleRate,channels,durationSeconds,meanVolumeDb,maxVolumeDb}) => ({assetId,path,sha256,sampleRate,channels,durationSeconds,meanVolumeDb,maxVolumeDb}))}, null, 2));
