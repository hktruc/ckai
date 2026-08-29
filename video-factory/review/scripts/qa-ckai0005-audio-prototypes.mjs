import {createHash} from 'node:crypto';
import {readFileSync, unlinkSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root = process.cwd();
const outputDir = resolve(root, 'generated/audio-prototypes/CKAI-0005/v1');
const ffmpeg = resolve(root, 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const ffprobe = resolve(root, 'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');
const manifestPath = join(outputDir, 'audio-prototype-manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const sampleRate = 48_000;
const rel = (path) => relative(root, path).replaceAll('\\', '/');
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase();
const db = (value) => value > 0 ? Number((20 * Math.log10(value)).toFixed(2)) : -Infinity;

const run = (binary, args, label) => {
  const result = spawnSync(binary, args, {cwd: root, encoding: 'utf8', timeout: 300_000, maxBuffer: 20 * 1024 * 1024});
  if (result.status !== 0) throw new Error(`${label} failed:\n${result.stderr || result.stdout || result.error}`);
  return result;
};

const readWav = (path) => {
  const buffer = readFileSync(path); let offset = 12; let fmt; let data;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString('ascii', offset, offset + 4); const size = buffer.readUInt32LE(offset + 4); const start = offset + 8;
    if (id === 'fmt ') fmt = {format:buffer.readUInt16LE(start),channels:buffer.readUInt16LE(start+2),sampleRate:buffer.readUInt32LE(start+4),bits:buffer.readUInt16LE(start+14)};
    if (id === 'data') data = buffer.subarray(start, start + size);
    offset = start + size + size % 2;
  }
  if (!fmt || !data || fmt.format !== 1 || fmt.bits !== 16 || fmt.sampleRate !== sampleRate) throw new Error(`Unsupported WAV ${path}: ${JSON.stringify(fmt)}`);
  const frames = Math.floor(data.length / (fmt.channels * 2)); const samples = new Float32Array(frames * fmt.channels);
  for (let index = 0; index < samples.length; index++) samples[index] = data.readInt16LE(index * 2) / 32768;
  return {...fmt, frames, durationSeconds: frames / sampleRate, samples};
};

const windowStats = (wav, start = 0, end = wav.durationSeconds, phoneBand = false) => {
  const begin = Math.max(0, Math.floor(start * sampleRate)); const finish = Math.min(wav.frames, Math.floor(end * sampleRate));
  let sum = 0; let peak = 0; let count = 0; let hpState = 0; let previous = 0; let lpState = 0;
  const hpAlpha = Math.exp(-2 * Math.PI * 180 / sampleRate); const lpAlpha = 1 - Math.exp(-2 * Math.PI * 7800 / sampleRate);
  for (let frame = begin; frame < finish; frame++) {
    let value = 0;
    for (let channel = 0; channel < wav.channels; channel++) value += wav.samples[frame * wav.channels + channel] / wav.channels;
    if (phoneBand) {
      hpState = hpAlpha * (hpState + value - previous); previous = value;
      lpState += lpAlpha * (hpState - lpState); value = lpState;
    }
    sum += value * value; peak = Math.max(peak, Math.abs(value)); count++;
  }
  return {rmsDb:db(Math.sqrt(sum / Math.max(1,count))),peakDb:db(peak)};
};

const correlation = (left, right) => {
  const length = Math.min(left.frames, right.frames); let ab = 0; let aa = 0; let bb = 0;
  for (let frame = 0; frame < length; frame += 48) {
    const a = (left.samples[frame*2] + left.samples[frame*2+1]) / 2;
    const b = (right.samples[frame*2] + right.samples[frame*2+1]) / 2;
    ab += a*b; aa += a*a; bb += b*b;
  }
  return Number((ab / Math.sqrt(aa*bb)).toFixed(4));
};

const voiceRelationship = (voice, side, {voiceGain, sideGain, duckDepth}) => {
  let envelope = 0; let voicePower = 0; let sidePower = 0; let count = 0; let phoneSidePower = 0; let hpState = 0; let previous = 0; let lpState = 0;
  const hpAlpha = Math.exp(-2*Math.PI*180/sampleRate); const lpAlpha = 1-Math.exp(-2*Math.PI*7800/sampleRate);
  const frames = Math.min(voice.frames, side.frames);
  for (let frame=0; frame<frames; frame++) {
    const v=voice.samples[frame]; const absolute=Math.abs(v); const coefficient=absolute>envelope?0.00208:0.00016; envelope+=(absolute-envelope)*coefficient;
    const x=Math.max(0,Math.min(1,(envelope-0.004)/0.045)); const activity=x*x*(3-2*x); const duck=1-duckDepth*activity;
    if (activity < 0.25) continue;
    const s=((side.samples[frame*2]+side.samples[frame*2+1])/2)*sideGain*duck;
    const vv=v*voiceGain; voicePower+=vv*vv; sidePower+=s*s;
    hpState=hpAlpha*(hpState+s-previous);previous=s;lpState+=lpAlpha*(hpState-lpState);phoneSidePower+=lpState*lpState;count++;
  }
  const voiceRms=Math.sqrt(voicePower/count); const sideRms=Math.sqrt(sidePower/count); const phoneSideRms=Math.sqrt(phoneSidePower/count);
  return {activeVoiceRmsDb:db(voiceRms),activeSideRmsDb:db(sideRms),voiceOverSideDb:Number((db(voiceRms)-db(sideRms)).toFixed(2)),phoneBandSideRmsDb:db(phoneSideRms)};
};

const loudness = (path) => {
  const result = run(ffmpeg, ['-hide_banner','-nostats','-i',path,'-vn','-af','loudnorm=I=-15:TP=-1.5:LRA=7:print_format=json','-f','null','NUL'], `loudness ${path}`);
  const match = result.stderr.match(/\{[\s\S]*?"target_offset"\s*:\s*"[^"]+"\s*\}/);
  if (!match) throw new Error(`Could not parse loudness output for ${path}`);
  const parsed = JSON.parse(match[0]);
  return {integratedLufs:Number(parsed.input_i),truePeakDbtp:Number(parsed.input_tp),lra:Number(parsed.input_lra),threshold:Number(parsed.input_thresh)};
};

const probe = (path) => JSON.parse(run(ffprobe, ['-v','error','-show_entries','format=duration,size,bit_rate:stream=index,codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels','-of','json',path], `probe ${path}`).stdout);
const decode = (path) => {run(ffmpeg, ['-v','error','-i',path,'-map','0:a:0','-c:a','pcm_s16le','-f','null','NUL'], `decode ${path}`); return 'PASS';};

const sourceVideo = resolve(root, manifest.sourceVisualMaster);
const streamPaths = [sourceVideo, ...manifest.versions.map((version) => resolve(root, version.mp4Path))].map((path,index) => ({input:path,output:join(outputDir,`.qa-video-${index}.h264`)}));
for (const item of streamPaths) run(ffmpeg, ['-v','error','-y','-i',item.input,'-map','0:v:0','-c:v','copy','-f','h264',item.output], `extract visual stream ${item.input}`);
const visualStreamHashes = streamPaths.map((item) => sha256(item.output));
for (const item of streamPaths) unlinkSync(item.output);

const voice = readWav(resolve(root, manifest.narration.path));
const chapters = [['opening',0,5],['pattern',5,15.229],['context',15.229,21.422],['core-hollow',21.422,31.431],['reflective',31.431,36.678],['callback',36.678,43.328]];
const settings = {A:{voiceGain:.70,sideGain:.86,duckDepth:.46},B:{voiceGain:.68,sideGain:.75,duckDepth:.54}};
const versionQa = {};
for (const version of manifest.versions) {
  const side = readWav(resolve(root,version.sidePath)); const mix = readWav(resolve(root,version.mixPath)); const mediaPath=resolve(root,version.mp4Path);
  const drop=[version.drop[0],version.drop[1]];
  versionQa[version.id]={
    status:'PASS', mp4Path:version.mp4Path, mp4Sha256:sha256(mediaPath), media:probe(mediaPath), decode:decode(mediaPath), loudness:loudness(mediaPath),
    mixPeak:windowStats(mix), voiceRelationship:voiceRelationship(voice,side,settings[version.id]),
    phoneOriented:{fullMix:windowStats(mix,0,mix.durationSeconds,true),sideStem:windowStats(side,0,side.durationSeconds,true)},
    sideChapterRms:Object.fromEntries(chapters.map(([name,start,end])=>[name,windowStats(side,start,end)])),
    dropContrast:{before:windowStats(side,drop[0]-.65,drop[0]),during:windowStats(side,drop[0],drop[1]),after:windowStats(side,drop[1],drop[1]+.8)},
    semanticSfxCount:version.cues.length, silenceDropSeconds:version.drop,
  };
}

const qa={
  id:'CKAI-0005-AUDIO-PROTOTYPE-AB-V1-QA',status:'PASS',technicalPassDoesNotEqualCreativePass:true,
  source:{visualMaster:manifest.sourceVisualMaster,visualMasterSha256:sha256(sourceVideo),narration:manifest.narration.path,narrationSha256:sha256(resolve(root,manifest.narration.path))},
  visualStream:{sourceSha256:visualStreamHashes[0],versionASha256:visualStreamHashes[1],versionBSha256:visualStreamHashes[2],identical:visualStreamHashes.every((hash)=>hash===visualStreamHashes[0])?'PASS':'FAIL'},
  abDifference:{sideStemCorrelation:correlation(readWav(resolve(root,manifest.versions[0].sidePath)),readWav(resolve(root,manifest.versions[1].sidePath))),requirement:'Materially different composition, rhythm, temperature, drop and SFX intensity; not gain-only.'},
  voiceSource:{overall:windowStats(voice),male:windowStats(voice,0,31.431),female:windowStats(voice,31.431,43.263)},
  versions:versionQa,
  providerUsage:manifest.providerUsage,boundaries:manifest.boundaries,
};
if(qa.visualStream.identical!=='PASS')throw new Error('Visual stream changed across A/B');
for(const version of Object.values(versionQa)){
  if(version.loudness.integratedLufs < -16.5 || version.loudness.integratedLufs > -13.5 || version.loudness.truePeakDbtp > -1)throw new Error(`Loudness/peak blocked for ${version.mp4Path}`);
  if(version.voiceRelationship.voiceOverSideDb < 12)throw new Error(`Voice dominance blocked for ${version.mp4Path}`);
  if(version.phoneOriented.sideStem.rmsDb < -50)throw new Error(`Phone-band side identity blocked for ${version.mp4Path}`);
  if(version.semanticSfxCount < 5 || version.semanticSfxCount > 8)throw new Error(`Semantic SFX count blocked for ${version.mp4Path}`);
}
if(Math.abs(qa.abDifference.sideStemCorrelation)>.72)throw new Error('A/B stems are too correlated');
const qaPath=join(outputDir,'technical-qa.json');writeFileSync(qaPath,`${JSON.stringify(qa,null,2)}\n`,'utf8');
console.log(JSON.stringify({status:'PASS',qaPath:rel(qaPath),visualStream:qa.visualStream,abDifference:qa.abDifference,versions:Object.fromEntries(Object.entries(versionQa).map(([id,value])=>[id,{mp4Path:value.mp4Path,mp4Sha256:value.mp4Sha256,loudness:value.loudness,voiceRelationship:value.voiceRelationship,phoneOriented:value.phoneOriented,dropContrast:value.dropContrast,semanticSfxCount:value.semanticSfxCount}]))},null,2));
