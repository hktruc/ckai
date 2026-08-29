import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root=process.cwd(), sampleRate=48000, duration=43.328, frames=Math.round(sampleRate*duration);
const sourceVideo=resolve(root,'generated/final/CKAI-0005/v1-1/CKAI-0005-full-production-v1-1.mp4');
const narrationPath=resolve(root,'generated/voice/CKAI-0005/master.wav');
const outputDir=resolve(root,'generated/audio-prototypes/CKAI-0005/library-round1-ab');
const ffmpeg=resolve(root,'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const tracks={
  A:{id:'CKAI-MUSIC-0007',title:'Other World',provider:'Mixkit',path:resolve(root,'content/references/audio/music-library-v1/01_original_audio/mixkit/CKAI-MUSIC-0007_mixkit_723_other-world.mp3'),sourceSha:'30EC101D866AE114060230179DFBCDB13EE95DD51AAB70FCA98B3F7002FC5C87'},
  B:{id:'CKAI-MUSIC-0005',title:'Torn Threads',provider:'Mixkit',path:resolve(root,'content/references/audio/music-library-v1/01_original_audio/mixkit/CKAI-MUSIC-0005_mixkit_73_torn-threads.mp3'),sourceSha:'1235607B51E5B94DBF6B837F4AD00CD19FF370CA110E90E6A6C8B9DADF0E6241'},
};
for(const path of [sourceVideo,narrationPath,ffmpeg,...Object.values(tracks).map(x=>x.path)])if(!existsSync(path))throw new Error(`Missing ${path}`);
mkdirSync(outputDir,{recursive:true});
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const sha=path=>createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase();
const rel=path=>relative(root,path).replaceAll('\\','/');
const run=(bin,args,label)=>{const r=spawnSync(bin,args,{cwd:root,encoding:'utf8',timeout:300000,maxBuffer:20*1024*1024});if(r.status!==0)throw new Error(`${label}: ${r.stderr||r.stdout}`);return r};

const readWav=path=>{const b=readFileSync(path);let o=12,fmt,data;while(o+8<=b.length){const id=b.toString('ascii',o,o+4),n=b.readUInt32LE(o+4),s=o+8;if(id==='fmt ')fmt={format:b.readUInt16LE(s),channels:b.readUInt16LE(s+2),rate:b.readUInt32LE(s+4),bits:b.readUInt16LE(s+14)};if(id==='data')data=b.subarray(s,s+n);o=s+n+n%2}if(!fmt||!data||fmt.format!==1||fmt.rate!==sampleRate||fmt.bits!==16)throw new Error(`Unsupported WAV ${path}`);const samples=new Float32Array(data.length/2);for(let i=0;i<samples.length;i++)samples[i]=data.readInt16LE(i*2)/32768;return {...fmt,samples,frames:samples.length/fmt.channels}};
const writeStereo=(path,s)=>{const b=Buffer.alloc(44+s.length*2);b.write('RIFF');b.writeUInt32LE(36+s.length*2,4);b.write('WAVE',8);b.write('fmt ',12);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(sampleRate,24);b.writeUInt32LE(sampleRate*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(s.length*2,40);for(let i=0;i<s.length;i++)b.writeInt16LE(Math.round(clamp(s[i],-1,.999969)*32767),44+i*2);writeFileSync(path,b)};

const decoded={};
for(const [id,t] of Object.entries(tracks)){if(sha(t.path)!==t.sourceSha)throw new Error(`${t.id} source hash drift`);const p=join(outputDir,`.${id}-source.wav`);run(ffmpeg,['-v','error','-y','-i',t.path,'-ar','48000','-ac','2','-c:a','pcm_s16le',p],`decode ${t.id}`);decoded[id]=readWav(p)}
const voice=readWav(narrationPath);if(voice.channels!==1)throw new Error('Narration must remain mono source master');

function addSegment(out,music,{at,end,src,gain,fade=.35,lowpass=20000,width=1}){
  const begin=Math.floor(at*sampleRate),finish=Math.min(frames,Math.floor(end*sampleRate));let lpL=0,lpR=0;const alpha=1-Math.exp(-2*Math.PI*lowpass/sampleRate);
  for(let f=begin;f<finish;f++){const local=(f-begin)/sampleRate,si=Math.floor((src+local)*sampleRate);if(si>=music.frames)break;const e=Math.min(smooth(local/fade),smooth(((finish-f)/sampleRate)/fade));const l=music.samples[si*2],r=music.samples[si*2+1];lpL+=alpha*(l-lpL);lpR+=alpha*(r-lpR);const mid=(lpL+lpR)/2,side=(lpL-lpR)/2;out[f*2]+=(mid+side*width)*gain*e;out[f*2+1]+=(mid-side*width)*gain*e}
}
function tone(out,{at,len=.3,f0=500,f1=f0,amp=.03,pan=0,attack=.01,release=.18}){let phase=0;for(let f=Math.floor(at*sampleRate),end=Math.min(frames,Math.floor((at+len)*sampleRate));f<end;f++){const x=(f/sampleRate-at)/len;phase+=2*Math.PI*(f0+(f1-f0)*x)/sampleRate;const e=smooth(Math.min((x*len)/attack,((1-x)*len)/release,1));const v=Math.sin(phase)*amp*e;out[f*2]+=v*Math.sqrt((1-pan)/2);out[f*2+1]+=v*Math.sqrt((1+pan)/2)}}
function noise(out,{at,len=.5,amp=.02,seed=5,color=.94,pan=0}){let state=seed>>>0,lp=0;for(let f=Math.floor(at*sampleRate),end=Math.min(frames,Math.floor((at+len)*sampleRate));f<end;f++){state^=state<<13;state^=state>>>17;state^=state<<5;lp=lp*color+((((state>>>0)/0xffffffff)*2-1))*(1-color);const x=(f/sampleRate-at)/len,e=smooth(Math.min(x/.15,(1-x)/.35,1)),v=lp*amp*e;out[f*2]+=v*Math.sqrt((1-pan)/2);out[f*2+1]+=v*Math.sqrt((1+pan)/2)}}
const click=(o,at,amp=.035)=>{tone(o,{at,len:.12,f0:1050,f1:610,amp,pan:-.12,release:.1});tone(o,{at:at+.055,len:.11,f0:1280,f1:760,amp:amp*.7,pan:.12,release:.09})};

function buildA(){const o=new Float32Array(frames*2),m=decoded.A;
  addSegment(o,m,{at:0,end:5.05,src:0,gain:.105,fade:.75,lowpass:6200,width:.75});
  addSegment(o,m,{at:4.65,end:15.35,src:7.6,gain:.145,fade:.55,lowpass:9000,width:.9});
  addSegment(o,m,{at:14.95,end:21.5,src:18.1,gain:.105,fade:.45,lowpass:4800,width:.65});
  addSegment(o,m,{at:21.15,end:29.46,src:25.0,gain:.09,fade:.6,lowpass:6200,width:.72});
  addSegment(o,m,{at:30.18,end:31.55,src:33.0,gain:.065,fade:.18,lowpass:4200,width:.55});
  addSegment(o,m,{at:31.2,end:36.82,src:0.3,gain:.052,fade:.65,lowpass:3300,width:.5});
  addSegment(o,m,{at:36.45,end:43.328,src:2.2,gain:.078,fade:.7,lowpass:5200,width:.62});
  click(o,1.82,.038); tone(o,{at:8.4,len:.55,f0:210,f1:82,amp:.043,release:.45}); noise(o,{at:16.74,len:1.0,amp:.021,seed:5007,pan:.25}); tone(o,{at:16.78,len:.9,f0:430,f1:105,amp:.026,pan:.2,release:.42}); noise(o,{at:29.56,len:.5,amp:.005,seed:2907,color:.98}); tone(o,{at:30.2,len:.9,f0:72,f1:53,amp:.047,release:.75}); click(o,38.86,.025);return o}
function buildB(){const o=new Float32Array(frames*2),m=decoded.B;
  addSegment(o,m,{at:0,end:5.05,src:0,gain:.095,fade:.7,lowpass:5800,width:.72});
  addSegment(o,m,{at:4.55,end:15.32,src:8.5,gain:.155,fade:.5,lowpass:9800,width:1});
  addSegment(o,m,{at:14.85,end:21.52,src:23.0,gain:.135,fade:.38,lowpass:7000,width:.85});
  addSegment(o,m,{at:21.05,end:29.18,src:32.0,gain:.17,fade:.55,lowpass:10000,width:1});
  addSegment(o,m,{at:30.34,end:31.58,src:40.2,gain:.09,fade:.15,lowpass:5400,width:.7});
  addSegment(o,m,{at:31.18,end:36.82,src:1.0,gain:.052,fade:.65,lowpass:3000,width:.48});
  addSegment(o,m,{at:36.42,end:43.328,src:10.5,gain:.085,fade:.7,lowpass:5600,width:.66});
  click(o,2.02,.043);tone(o,{at:8.36,len:.68,f0:245,f1:74,amp:.052,release:.55});noise(o,{at:16.66,len:1.18,amp:.028,seed:5005,pan:.32});tone(o,{at:16.72,len:1.05,f0:540,f1:88,amp:.034,pan:.28,release:.48});noise(o,{at:29.26,len:.72,amp:.004,seed:2905,color:.985});tone(o,{at:30.34,len:1.15,f0:79,f1:51,amp:.062,release:.95});click(o,38.78,.03);return o}

function render({id,slug,side,duckDepth,targetLufs,cues,drop}){const sidePath=join(outputDir,`${id}-music-sfx-only.wav`),raw=join(outputDir,`.${id}-raw.wav`),mix=join(outputDir,`${id}-final-mix.wav`),mp4=join(outputDir,`CKAI-0005-audio-prototype-${slug}.mp4`);writeStereo(sidePath,side);const out=new Float32Array(frames*2);let env=0;for(let f=0;f<frames;f++){const v=voice.samples[f]||0,a=Math.abs(v),coef=a>env?.00208:.00016;env+=(a-env)*coef;const activity=smooth((env-.004)/.045),duck=1-duckDepth*activity,female=f/sampleRate>=31.431?.72:1;out[f*2]=Math.tanh((v*.70+side[f*2]*duck*female)*1.04)/1.04;out[f*2+1]=Math.tanh((v*.70+side[f*2+1]*duck*female)*1.04)/1.04}writeStereo(raw,out);run(ffmpeg,['-v','error','-y','-i',raw,'-af',`loudnorm=I=${targetLufs}:TP=-1.5:LRA=7`,'-ar','48000','-ac','2','-c:a','pcm_s16le',mix],`${id} master`);run(ffmpeg,['-v','error','-y','-i',sourceVideo,'-i',mix,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-ac','2','-t',String(duration),'-movflags','+faststart',mp4],`${id} mux`);unlinkSync(raw);return{id,track:{...tracks[id],path:rel(tracks[id].path)},sidePath:rel(sidePath),sideSha256:sha(sidePath),mixPath:rel(mix),mixSha256:sha(mix),mp4Path:rel(mp4),mp4Sha256:sha(mp4),cues,drop}}
const versions=[
  render({id:'A',slug:'A-precision-minimal',side:buildA(),duckDepth:.52,targetLufs:-15.2,cues:[['surface lock',1.82],['pattern collapse',8.40],['assumption withdrawal',16.74],['Hollow Core reveal',29.56],['transformed callback',38.86]],drop:[29.46,30.18]}),
  render({id:'B',slug:'B-tension-editorial',side:buildB(),duckDepth:.60,targetLufs:-15.0,cues:[['surface lock',2.02],['pattern collapse',8.36],['assumption withdrawal',16.66],['Hollow Core reveal',29.26],['transformed callback',38.78]],drop:[29.18,30.34]})
];
for(const p of [join(outputDir,'.A-source.wav'),join(outputDir,'.B-source.wav')])unlinkSync(p);
const manifest={id:'CKAI-0005-LIBRARY-ROUND1-AB',status:'PENDING_HUMAN_AUDIO_DIRECTION_REVIEW',sourceVisualMaster:rel(sourceVideo),sourceVisualMasterSha256:sha(sourceVideo),visualPolicy:'H264 stream copy; no visual render',narration:{path:rel(narrationPath),sha256:sha(narrationPath),treatment:'same source samples/timing and voice identities; gain/ducking/mastering only; no TTS, stretch or pitch'},versions,license:{provider:'Mixkit',license:'Mixkit Stock Music Free License',attributionRequired:false,contentIdClaimStatus:'UNKNOWN'},providerUsage:{vbeeCalls:0,newDownloads:0,generatedMusicCalls:0,generatedSfxCalls:0,paidCalls:0},boundaries:{phase2AudioEngine:'NOT_STARTED',publishing:'NOT_PERFORMED',releaseApproval:'NOT_SELF_GRANTED'}};
writeFileSync(join(outputDir,'audio-library-ab-manifest.json'),`${JSON.stringify(manifest,null,2)}\n`);console.log(JSON.stringify({status:'PASS',outputDir:rel(outputDir),versions},null,2));
