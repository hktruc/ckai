import {spawnSync} from 'node:child_process';
import {existsSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';

let ffmpegPath:string|undefined;let ffprobePath:string|undefined;
const executableWorks=(path:string,args:string[],required?:RegExp)=>{const result=spawnSync(path,args,{encoding:'utf8'});return result.status===0&&(!required||required.test(`${result.stdout??''}\n${result.stderr??''}`));};
const capcutCandidates=()=>{const root=resolve(process.env.LOCALAPPDATA??'','CapCut/Apps');if(!existsSync(root))return[];return readdirSync(root).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true})).map((version)=>resolve(root,version,'ffmpeg.exe')).filter(existsSync);};

export const resolveFfmpeg=():string=>{
  if(ffmpegPath)return ffmpegPath;
  const candidates=[process.env.CKAI_FFMPEG_PATH,'ffmpeg',...capcutCandidates(),resolve('node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe')].filter((value):value is string=>Boolean(value));
  ffmpegPath=candidates.find((candidate)=>executableWorks(candidate,['-hide_banner','-filters'],/\bvolumedetect\b/)&&executableWorks(candidate,['-hide_banner','-encoders'],/\b(?:libx264|h264_nvenc|h264_qsv|h264_amf|h264_mf)\b/));
  if(!ffmpegPath)throw new Error('QA-capable FFmpeg is unavailable');
  return ffmpegPath;
};

export const resolveH264Encoder=():string=>{
  const ffmpeg=resolveFfmpeg();const result=spawnSync(ffmpeg,['-hide_banner','-encoders'],{encoding:'utf8'});const output=`${result.stdout??''}\n${result.stderr??''}`;
  const encoder=['libx264','h264_nvenc','h264_qsv','h264_amf','h264_mf'].find((candidate)=>new RegExp(`\\b${candidate}\\b`).test(output));
  if(!encoder)throw new Error('H.264 encoder is unavailable');return encoder;
};

export const resolveFfprobe=():string=>{
  if(ffprobePath)return ffprobePath;
  const candidates=[process.env.CKAI_FFPROBE_PATH,'ffprobe',resolve('node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe')].filter((value):value is string=>Boolean(value));
  ffprobePath=candidates.find((candidate)=>executableWorks(candidate,['-version']));
  if(!ffprobePath)throw new Error('FFprobe is unavailable');
  return ffprobePath;
};
