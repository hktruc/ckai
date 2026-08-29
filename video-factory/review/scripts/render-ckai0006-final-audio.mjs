import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root=process.cwd(), rate=48000, duration=35.579, frames=Math.round(rate*duration);
const source=resolve(root,'generated/final/CKAI-0006/qa/stills.mp4');
const voicePath=resolve(root,'generated/voice/CKAI-0006/master.wav');
const musicPath=resolve(root,'content/references/audio/music-library-v1/01_original_audio/mixkit/CKAI-MUSIC-0015_mixkit_1167_close-up.mp3');
const outDir=resolve(root,'generated/final/CKAI-0006'), assetDir=join(outDir,'audio');
const ffmpeg=resolve(root,'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
for(const p of [source,voicePath,musicPath,ffmpeg]) if(!existsSync(p)) throw Error(`Missing ${p}`);
mkdirSync(assetDir,{recursive:true});

const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex').toUpperCase();
const rel=p=>relative(root,p).replaceAll('\\','/');
const run=(bin,args,label)=>{const r=spawnSync(bin,args,{cwd:root,encoding:'utf8',timeout:300000,maxBuffer:20*1024*1024});if(r.status!==0)throw Error(`${label}: ${r.error||r.stderr||r.stdout}`);return r};
const readWav=p=>{const b=readFileSync(p);let o=12,fmt,data;while(o+8<=b.length){const id=b.toString('ascii',o,o+4),n=b.readUInt32LE(o+4),s=o+8;if(id==='fmt ')fmt={format:b.readUInt16LE(s),channels:b.readUInt16LE(s+2),rate:b.readUInt32LE(s+4),bits:b.readUInt16LE(s+14)};if(id==='data')data=b.subarray(s,s+n);o=s+n+n%2}if(!fmt||!data||fmt.format!==1||fmt.rate!==rate||fmt.bits!==16)throw Error('Unsupported WAV');const samples=new Float32Array(data.length/2);for(let i=0;i<samples.length;i++)samples[i]=data.readInt16LE(i*2)/32768;return{...fmt,samples}};
const writeStereo=(p,s)=>{const b=Buffer.alloc(44+s.length*2);b.write('RIFF');b.writeUInt32LE(36+s.length*2,4);b.write('WAVE',8);b.write('fmt ',12);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(s.length*2,40);for(let i=0;i<s.length;i++)b.writeInt16LE(Math.round(clamp(s[i],-1,.999969)*32767),44+i*2);writeFileSync(p,b)};

const decoded=join(assetDir,'.music-source.wav');
run(ffmpeg,['-v','error','-y','-i',musicPath,'-ar','48000','-ac','2','-c:a','pcm_s16le',decoded],'decode music');
const music=readWav(decoded), voice=readWav(voicePath);if(voice.channels!==1)throw Error('Voice master channel drift');
const bed=new Float32Array(frames*2);let lpL=0,lpR=0;
for(let f=0;f<frames;f++){
  const t=f/rate, src=Math.floor((t+3.2)*rate), l=music.samples[src*2]||0, r=music.samples[src*2+1]||0;
  const gain=(t<3.37?.148:t<8.15?.158:t<13.91?.165:t<20.21?.145:t<24.27?.158:t<28.57?.17:.15)*1.25;
  const fade=smooth(t/.22)*smooth((duration-t)/.65), cutoff=t>=13.91&&t<20.21?7600:10500, alpha=1-Math.exp(-2*Math.PI*cutoff/rate);
  lpL+=alpha*(l-lpL);lpR+=alpha*(r-lpR);bed[f*2]=lpL*gain*fade;bed[f*2+1]=lpR*gain*fade;
}
const tone=({at,len=.26,f0=600,f1=f0,amp=.025,pan=0,release=.16})=>{let ph=0;for(let f=Math.floor(at*rate),end=Math.min(frames,Math.floor((at+len)*rate));f<end;f++){const x=(f/rate-at)/len;ph+=2*Math.PI*(f0+(f1-f0)*x)/rate;const e=smooth(Math.min((x*len)/.012,((1-x)*len)/release,1)),v=Math.sin(ph)*amp*e;bed[f*2]+=v*Math.sqrt((1-pan)/2);bed[f*2+1]+=v*Math.sqrt((1+pan)/2)}};
const noise=({at,len=.4,amp=.012,seed=6,color=.94,pan=0})=>{let state=seed>>>0,lp=0;for(let f=Math.floor(at*rate),end=Math.min(frames,Math.floor((at+len)*rate));f<end;f++){state^=state<<13;state^=state>>>17;state^=state<<5;lp=lp*color+((((state>>>0)/0xffffffff)*2-1))*(1-color);const x=(f/rate-at)/len,e=smooth(Math.min(x/.14,(1-x)/.32,1)),v=lp*amp*e;bed[f*2]+=v*Math.sqrt((1-pan)/2);bed[f*2+1]+=v*Math.sqrt((1+pan)/2)}};
// Six semantic cues: answer arrival, workflow reveal, critique scan, issue flag, rewrite pass, completion.
tone({at:.82,len:.18,f0:900,f1:1280,amp:.026,pan:-.15});
tone({at:8.35,len:.38,f0:360,f1:720,amp:.03,pan:.18});
noise({at:14.55,len:.8,amp:.013,seed:1455,color:.93,pan:-.2});
tone({at:17.05,len:.22,f0:1080,f1:650,amp:.032,pan:.2});
noise({at:20.65,len:.95,amp:.016,seed:2065,color:.95,pan:.25});tone({at:20.68,len:.72,f0:320,f1:880,amp:.022,pan:.2});
tone({at:24.65,len:.42,f0:620,f1:1040,amp:.028,pan:0});

const stem=join(assetDir,'CKAI-0006-music-sfx.wav'), raw=join(assetDir,'.raw-mix.wav'), mix=join(assetDir,'CKAI-0006-final-mix.wav'), mp4=join(outDir,'CKAI-0006-full-production-v1.mp4');
writeStereo(stem,bed);
const final=new Float32Array(frames*2);let env=0;
for(let f=0;f<frames;f++){const v=voice.samples[f]||0,a=Math.abs(v),coef=a>env?.00208:.00018;env+=(a-env)*coef;const activity=smooth((env-.004)/.05),duck=1-.20*activity;final[f*2]=Math.tanh((v*.70+bed[f*2]*duck)*1.03)/1.03;final[f*2+1]=Math.tanh((v*.70+bed[f*2+1]*duck)*1.03)/1.03}
writeStereo(raw,final);
run(ffmpeg,['-v','error','-y','-i',raw,'-af','loudnorm=I=-15.2:TP=-1.5:LRA=7','-ar','48000','-ac','2','-c:a','pcm_s16le',mix],'master');
run(ffmpeg,['-v','error','-y','-i',source,'-i',mix,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-ac','2','-t',String(duration),'-movflags','+faststart',mp4],'mux');
for(const p of [decoded,raw]) unlinkSync(p);
const manifest={id:'CKAI-0006-FINAL-AUDIO-V1',status:'PENDING_PRODUCT_OWNER_RELEASE_APPROVAL',sourceVisual:{path:rel(source),sha256:sha(source),policy:'H264 stream copy'},narration:{path:rel(voicePath),sha256:sha(voicePath),voices:['HN - Minh Quân','HN - Ngọc Huyền'],authorization:'GLOBAL_CKAI_EXISTING_VBEE_QUOTA',autoPurchase:false,paidFallback:false,treatment:'same source samples and timing; centered; gain plus final mastering only'},music:{id:'CKAI-MUSIC-0015',title:'Close Up',creator:'Michael Ramir C.',provider:'Mixkit',family:'CORPORATE_UPBEAT_LIGHT',path:rel(musicPath),sha256:sha(musicPath),licenseEvidence:'content/references/audio/music-library-v1/02_license_evidence/track-specific/CKAI-MUSIC-0015.md',contentIdClaimStatus:'UNKNOWN',strategy:'single continuous full bed; opening/ending fades; chapter gain/filter automation; light 20% max narration duck'},sfx:{source:'CKAI deterministic local synthesis',rights:'CKAI_ORIGINAL_INTERNAL',count:6,cues:[['answer arrival',.82],['workflow reveal',8.35],['critique scan',14.55],['issue flag',17.05],['rewrite pass',20.65],['completion',24.65]]},outputs:{mp4:rel(mp4),mp4Sha256:sha(mp4),mix:rel(mix),mixSha256:sha(mix),stem:rel(stem),stemSha256:sha(stem)},providerUsage:{vbeeCallsThisMix:0,musicDownloads:0,externalSfxCalls:0,paidCalls:0},boundaries:{phase2AudioEngine:'NOT_STARTED',publishing:'NOT_PERFORMED',releaseApproval:'NOT_SELF_GRANTED'}};
writeFileSync(join(assetDir,'manifest.json'),`${JSON.stringify(manifest,null,2)}\n`);
console.log(JSON.stringify({status:'PASS',manifest},null,2));
