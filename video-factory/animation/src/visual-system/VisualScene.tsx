import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {AnimationManifest} from '../model';
import {DEFAULT_VISUAL_PRESET_ID, getVisualPreset} from './preset';
import type {SceneArtDirection} from './grammar';
import {SemanticObject} from './SemanticObject';
import {SemanticMechanism} from './SemanticMechanism';
import {ProcessRenderer} from './process-renderers/ProcessRenderer';
import type {RenderMode} from '../spatial-motion';

const enter = (frame: number, delay = 0, distance = 26): CSSProperties => {
  const value = interpolate(frame, [delay, delay + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return {opacity: value, transform: `translateY(${(1 - value) * distance}px)`, filter: `blur(${(1 - value) * 6}px)`};
};

const AccentText = ({text, direction}: {text: string; direction: SceneArtDirection}) => {
  const emphasis = direction.emphasisText;
  if (!emphasis || !text.includes(emphasis)) return <>{text}</>;
  const start = text.indexOf(emphasis);
  const accentIsSemantic = direction.accentRationale !== 'none';
  return <>{text.slice(0, start)}<span style={{color: accentIsSemantic ? '#D99A43' : 'inherit', fontWeight: 900}}>{emphasis}</span>{text.slice(start + emphasis.length)}</>;
};

const lineSize = (line: string, index: number, total: number) => {
  const count = line.trim().length;
  const base = count <= 11 ? 132 : count <= 18 ? 112 : count <= 28 ? 92 : 76;
  return Math.max(70, base - (total > 3 ? index * 4 : 0));
};

const EditorialLines = ({text, direction, align = 'left'}: {text: string; direction: SceneArtDirection; align?: 'left' | 'right'}) => {
  const frame = useCurrentFrame();
  const lines = text.split('\n').filter(Boolean);
  return <div style={{textAlign: align}}>{lines.map((line, index) => <div key={`${line}-${index}`} style={{fontSize: lineSize(line, index, lines.length), lineHeight: .9, letterSpacing: -5, fontWeight: index === 0 && lines.length > 1 ? 730 : 870, color: index === 0 && lines.length > 1 ? '#B7BDC6' : '#F4F0E8', ...enter(frame, index * 3)}}><AccentText text={line} direction={direction}/></div>)}</div>;
};

const LightingField = ({direction}: {direction: SceneArtDirection}) => {
  const backgrounds: Record<SceneArtDirection['lightingStrategy'], string> = {
    'directional-edge': 'linear-gradient(112deg,transparent 35%,rgba(244,240,232,.05) 50%,transparent 63%)',
    backlight: 'radial-gradient(ellipse at 72% 55%,rgba(244,240,232,.12),rgba(217,154,67,.05) 24%,transparent 58%)',
    'localized-glow': 'radial-gradient(circle at 64% 47%,rgba(217,154,67,.13),transparent 32%)',
    'dark-to-light': 'linear-gradient(125deg,rgba(0,0,0,.52),transparent 49%,rgba(244,240,232,.08))',
    'shadow-separation': 'linear-gradient(118deg,rgba(0,0,0,.4),transparent 47%,rgba(244,240,232,.05) 58%,transparent)',
    'restrained-ambient': 'radial-gradient(circle at 62% 38%,rgba(244,240,232,.055),transparent 43%)',
  };
  return <div style={{position:'absolute',inset:0,background:backgrounds[direction.lightingStrategy]}}/>;
};

const TypographyEditorial = ({text, direction}: {text: string; direction: SceneArtDirection}) => {
  const isConclusion = direction.semanticArchetype === 'conclusion-distillation';
  const lines = text.split('\n').filter(Boolean);
  if (isConclusion) return <>
    {direction.semanticObject !== 'none' && <SemanticObject text={text} direction={direction}/>} 
    <div style={{position:'absolute',left:72,top:300,right:350,fontSize:76,lineHeight:.98,letterSpacing:-2.8,fontWeight:720,color:'#B7BDC6'}}>{lines[0]}</div>
    <div style={{position:'absolute',left:72,right:78,bottom:285}}><EditorialLines text={lines.slice(1).join('\n') || lines[0]} direction={direction}/></div>
  </>;
  return <div style={{position:'absolute',left:70,right:58,top:300,bottom:250,display:'flex',alignItems:'center'}}><EditorialLines text={text} direction={direction}/></div>;
};

const ObjectCinematic = ({text, direction}: {text: string; direction: SceneArtDirection}) => {
  if (direction.semanticObject === 'none') return <TypographyEditorial text={text} direction={direction}/>;
  const placements: Partial<Record<SceneArtDirection['semanticObject'], CSSProperties>> = {
    lens: {left:70,right:72,top:260,width:900},
    layers: {left:70,right:420,top:245,width:590},
    fracture: {left:72,right:80,top:330,width:900},
    'domino-chain': {left:70,right:80,top:235,width:900},
    aperture: {left:70,right:90,bottom:280,width:900},
  };
  return <>
    <SemanticObject text={text} direction={direction}/>
    <div style={{position:'absolute',...(placements[direction.semanticObject] ?? {left:70,right:70,top:260}),zIndex:2}}><EditorialLines text={text} direction={direction}/></div>
  </>;
};

type ProofRow = {kind: 'noise' | 'signal' | 'output'; value: string};
const proofRows = (text: string): ProofRow[] => text.split('\n').filter(Boolean).map((line) => {
  const match = line.match(/^(NOISE|SIGNAL|OUTPUT):\s*(.+)$/i);
  return match ? {kind: match[1].toLowerCase() as ProofRow['kind'], value: match[2]} : {kind: 'signal', value: line};
});

const ProofEvidence = ({text, truthLabel, direction, step=3}: {text: string; truthLabel: string; direction: SceneArtDirection; step?:number}) => {
  const frame = useCurrentFrame();
  const rows = proofRows(text);
  const source = rows.filter((row) => row.kind !== 'output').slice(0, 4);
  const output = rows.filter((row) => row.kind === 'output').map((row) => row.value).slice(0, 2);
  const resolved = output.length ? output : direction.supportingElements.slice(0, 2).length ? direction.supportingElements.slice(0, 2) : [direction.primaryVisualConcept];
  return <>
    {step>=3?<div style={{position:'absolute',inset:'180px 0 230px 300px',background:'linear-gradient(130deg,rgba(217,154,67,.48),rgba(47,57,70,.24))',borderLeft:'9px solid #D99A43',clipPath:'polygon(18% 0,100% 8%,100% 100%,0 88%)',boxShadow:'-45px 30px 120px rgba(217,154,67,.18)'}}/>:null}
    <div style={{position:'absolute',width:920,height:980,left:20,top:175,background:'#D8D1C5',color:'#171A1F',transform:'perspective(1200px) rotateY(7deg) rotateZ(-4deg)',boxShadow:'52px 72px 135px rgba(0,0,0,.62)'}}>
      <div style={{padding:'100px 62px',display:'grid',gap:28}}>{source.slice(0,Math.max(1,step+1)).map((row,index)=><div key={`${row.value}-${index}`} style={{fontFamily:'Consolas,monospace',fontSize:44,lineHeight:1.22,fontWeight:650,color:row.kind==='noise'?'#8E4D37':'#242A31',textDecoration:row.kind==='noise'?'line-through':'none',...enter(frame, 5 + index * 4, 18)}}>{row.value}</div>)}</div>
    </div>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(118deg,transparent 0%,transparent 45%,rgba(7,9,13,.73) 53%,#07090D 62%)'}}/>
    <div style={{position:'absolute',left:430,top:470,width:670,minHeight:570,background:'linear-gradient(142deg,#202833,#10151D)',transform:`rotate(-2deg) translateX(${step>=2?0:150}px)`,opacity:step>=1?1:.2,boxShadow:'-38px 52px 120px rgba(0,0,0,.64),-7px 0 0 #B77D35'}}>
      <div style={{padding:'78px 58px',display:'grid',gap:28}}>{resolved.map((row,index)=><div key={`${row}-${index}`} style={{whiteSpace:'pre-wrap',fontSize:index===0?62:52,lineHeight:.96,letterSpacing:-2.2,fontWeight:880,color:index===0?'#F4F0E8':'#D99A43',...enter(frame, 12 + index * 5, 20)}}>{row.replace(/\s*·\s*/gu,'\n')}</div>)}</div>
    </div>
    <div style={{position:'absolute',left:step>=3?76:420,right:76,bottom:135,fontSize:48,lineHeight:1.15,color:'#E4C58F',fontWeight:780,opacity:step>=3?1:.18}}>{truthLabel}</div>
  </>;
};

const TransformationComparison = ({text, direction}: {text: string; direction: SceneArtDirection}) => {
  const parts = text.split(/\n+|→/u).map((part)=>part.trim()).filter(Boolean);
  const before = parts[0] ?? text;
  const after = parts.at(-1) ?? text;
  const beforeSize = before.length > 22 ? 66 : before.length > 15 ? 76 : 86;
  const afterSize = after.length > 24 ? 86 : after.length > 16 ? 96 : 112;
  if (direction.semanticArchetype === 'contrast-before-after') return <>
    <SemanticObject text={text} direction={direction}/>
    <div style={{position:'absolute',left:64,top:320,width:560,fontSize:beforeSize,lineHeight:.94,letterSpacing:-3.2,fontWeight:780,color:'#8C95A2',transform:'rotate(-6deg)'}}>{before}</div>
    <div style={{position:'absolute',right:58,bottom:235,width:700,textAlign:'right',fontSize:afterSize,lineHeight:.92,letterSpacing:-3.8,fontWeight:900,color:'#F4F0E8'}}><AccentText text={after} direction={direction}/></div>
  </>;
  return <>
    <SemanticObject text={text} direction={direction}/>
    <div style={{position:'absolute',left:62,top:255,width:560,fontSize:76,lineHeight:.94,letterSpacing:-3,fontWeight:760,color:'#8C95A2',transform:'rotate(-5deg)'}}>{before}</div>
    <div style={{position:'absolute',left:500,right:35,bottom:325,textAlign:'center',fontSize:82,lineHeight:.9,letterSpacing:-3.5,fontWeight:900,color:direction.semanticObject==='reassembly-field'?'#171A1F':'#F4F0E8'}}>{after}</div>
  </>;
};

const GeneratedKeyVisual = ({source,step}: {source: string;step:number}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const reveal = interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {extrapolateRight: 'clamp'});
  const publicPath = source.replace(/^generated[\\/]/u, '').replaceAll('\\', '/');
  const scales=[1.28,1.08,1.18,1.02];const positions=['30% 38%','62% 43%','38% 72%','50% 50%'];
  return <>
    <Img src={staticFile(publicPath)} style={{position:'absolute',inset:step===2?'90px 360px 120px -70px':0,width:step===2?'790px':'100%',height:step===2?'1680px':'100%',objectFit:'cover',objectPosition:positions[Math.min(step,3)],opacity:reveal,transform:`translate3d(0,${progress*-3}px,0) scale(${scales[Math.min(step,3)]})`,filter:`saturate(${step===1?.45:.94}) contrast(${step===1?1.22:1.05}) brightness(${step===2?1.08:.9})`}}/>
    {step===1?<><div style={{position:'absolute',right:0,top:0,bottom:0,width:'48%',background:'rgba(5,8,13,.82)',clipPath:'polygon(22% 0,100% 0,100% 100%,0 100%)'}}/><div style={{position:'absolute',left:518,top:210,bottom:240,width:10,background:'repeating-linear-gradient(180deg,#D99A43 0 28px,transparent 28px 52px)',transform:'rotate(4deg)',boxShadow:'0 0 70px rgba(217,154,67,.52)'}}/><div style={{position:'absolute',left:450,top:780,fontSize:170,fontWeight:950,color:'#D99A43',textShadow:'0 20px 60px #000'}}>?</div></>:null}
    {step===2?<div style={{position:'absolute',right:0,top:0,bottom:0,width:470,background:'linear-gradient(150deg,#111924,#05080D)',borderLeft:'8px solid #D99A43',boxShadow:'-40px 0 100px rgba(0,0,0,.72)'}}/>:null}
    {step>=3?<div style={{position:'absolute',left:70,right:70,top:250,bottom:260,border:'8px solid rgba(217,154,67,.86)',clipPath:'polygon(0 0,80% 0,80% 9%,100% 9%,100% 100%,20% 100%,20% 91%,0 91%)',boxShadow:'inset 0 0 110px rgba(217,154,67,.15),0 0 80px rgba(217,154,67,.15)'}}/>:null}
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(5,8,13,.16),transparent 23%,transparent 76%,rgba(5,8,13,.46))'}}/>
  </>;
};

const GeneratedRecoveryOverlay=({scene,step}:{scene:AnimationManifest['scenes'][number];step:number})=>scene.visualRecovery?<>
  {step===0?<div style={{position:'absolute',left:90,top:300,width:220,height:220,border:'12px solid #A9654B',borderRadius:'50%',boxShadow:'0 0 90px rgba(169,101,75,.55)'}}/>:null}
  {step===1?<><div style={{position:'absolute',left:120,top:740,width:330,height:18,background:'#F4F0E8'}}/><div style={{position:'absolute',left:450,top:690,width:200,height:120,border:'8px dashed #D99A43',display:'grid',placeItems:'center',fontSize:75,fontWeight:950,color:'#D99A43'}}>?</div><div style={{position:'absolute',left:650,top:740,width:310,height:18,background:'#596676'}}/></>:null}
  {step===2?<><div style={{position:'absolute',left:90,right:90,top:1040,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:18}}>{['DỮ KIỆN','SUY LUẬN','CHƯA BIẾT'].map((label,index)=><div key={label} style={{padding:'28px 12px',background:index===2?'#D99A43':'#151D27',color:index===2?'#111':'#F4F0E8',fontSize:29,fontWeight:900,textAlign:'center',border:'3px solid rgba(244,240,232,.25)'}}>{label}</div>)}</div></>:null}
  {step>=3?<div style={{position:'absolute',left:70,right:70,bottom:290,height:160,background:'linear-gradient(90deg,#151D27,#D99A43)',clipPath:'polygon(0 15%,82% 15%,82% 0,100% 50%,82% 100%,82% 85%,0 85%)',display:'grid',placeItems:'center',fontSize:48,fontWeight:950,letterSpacing:-1,color:'#F4F0E8'}}>MỞ ĐƯỜNG KIỂM CHỨNG</div>:null}
</>:null;

const GeneratedNativeCopy=({text,truthLabel,step}:{text:string;truthLabel:string;step:number})=>{
  const lines=text.split('\n').filter(Boolean);return <>
    <div style={{position:'absolute',left:step>=3?100:515,right:48,top:step>=3?530:470,textAlign:step>=3?'left':'right',textShadow:'0 5px 26px rgba(0,0,0,.92)'}}>
      {lines.map((line,index)=><div key={line} style={{fontSize:step>=3?82:index===0?47:58,lineHeight:.9,letterSpacing:step>=3?-3.5:-2,fontWeight:900,color:index===1?'#D99A43':'#F4F0E8',opacity:index===0||step>=1?1:.08,transform:`translateX(${index===0||step>=1?0:46}px)`,marginBottom:14}}>{line}</div>)}
    </div>
    {step===2?<><div style={{position:'absolute',right:70,top:735,fontSize:150,fontWeight:950,color:'#A9654B'}}>≠</div><div style={{position:'absolute',right:42,top:990,width:360,color:'#F4F0E8',fontSize:50,lineHeight:.92,fontWeight:900,letterSpacing:-2}}>CHƯA ĐỦ<br/><span style={{color:'#D99A43'}}>DỮ KIỆN</span></div></>:null}
    {step>=2&&truthLabel?<div style={{position:'absolute',left:70,right:55,bottom:112,padding:'14px 18px',background:'rgba(7,9,13,.82)',color:'#E4C58F',fontSize:26,lineHeight:1.1,fontWeight:740,letterSpacing:.7,textAlign:'right'}}>{truthLabel}</div>:null}
  </>;
};

const Frame = ({direction,scene,children}: {direction: SceneArtDirection; scene: AnimationManifest['scenes'][number]; children: ReactNode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const durationFrames = Math.round((scene.endSeconds - scene.startSeconds) * fps);
  const exitStart = Math.max(0, durationFrames - Math.round(.42 * fps));
  const exit = interpolate(frame, [exitStart, durationFrames], [0, 1], {extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});
  const drift = interpolate(frame, [0, durationFrames], [1.002, 1.064], {extrapolateRight:'clamp'});
  const verticalDrift = interpolate(frame, [0, durationFrames], [8, -18], {extrapolateRight:'clamp'});
  const transition = scene.motionPlan?.transitionOut ?? 'CUT';
  const transitionStyle: CSSProperties = transition === 'PUSH' ? {transform:`translate(${-exit*42}px,${verticalDrift}px) scale(${drift})`,opacity:1-exit*.18}
    : transition === 'SLIDE' ? {transform:`translateY(${verticalDrift-exit*32}px) scale(${drift})`,opacity:1-exit*.16}
    : transition === 'FOCUS' ? {transform:`translateY(${verticalDrift}px) scale(${drift})`,filter:`blur(${exit*7}px)`,opacity:1-exit*.3}
    : transition === 'MASK_REVEAL' ? {transform:`translateY(${verticalDrift}px) scale(${drift})`,clipPath:`inset(0 ${exit*5}% 0 0)`}
    : transition === 'WIPE' ? {transform:`translateY(${verticalDrift}px) scale(${drift})`,clipPath:`inset(0 0 ${exit*6}% 0)`}
    : transition === 'ZOOM' ? {transform:`translateY(${verticalDrift}px) scale(${drift+exit*.025})`,opacity:1-exit*.2}
    : transition === 'TRANSFORM' ? {transform:`translateY(${verticalDrift-exit*18}px) scale(${drift+exit*.012})`,opacity:1-exit*.12}
    : transition === 'FADE' ? {transform:`translateY(${verticalDrift}px) scale(${drift})`,opacity:1-exit}
    : {transform:`translateY(${verticalDrift}px) scale(${drift})`};
  return <AbsoluteFill style={{background:'linear-gradient(155deg,#0C1119,#07090D 56%)',color:'#F4F0E8',fontFamily:'"Aptos","Segoe UI",Arial,sans-serif',overflow:'hidden',transformOrigin:'50% 50%',...transitionStyle}}>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 42%,rgba(31,38,49,.32),transparent 52%,rgba(2,3,5,.76) 100%)'}}/>
    <LightingField direction={direction}/>{children}
  </AbsoluteFill>;
};

export const VisualScene = ({manifest,index,renderMode='PRODUCTION',suppressEditorialLabels=false}: {manifest: AnimationManifest; index: number;renderMode?:RenderMode;suppressEditorialLabels?:boolean}) => {
  getVisualPreset(manifest.visualPresetId ?? DEFAULT_VISUAL_PRESET_ID);
  const scene = manifest.scenes[index];
  const direction = scene.artDirection!;
  const asset = scene.requiredAssetIds.map((id)=>manifest.assets[id]).find(Boolean);
  const text = scene.displayCopy ?? asset?.value ?? direction.primaryFocus;
  const truthLabel = direction.proof.truthLabel || asset?.truthLabel || '';
  const localSeconds=useCurrentFrame()/manifest.fps;const beats=scene.retentionExecution?.beats??[];const found=beats.findIndex((beat)=>localSeconds>=beat.start&&localSeconds<beat.end);const step=found<0?Math.max(0,beats.length-1):found;
  const generatedSource = scene.hybridSource?.asset?.sourceType === 'GENERATED' ? scene.hybridSource.asset.source : null;
  if(scene.representationPlan)return <Frame direction={direction} scene={scene}><ProcessRenderer plan={scene.representationPlan} renderMode={renderMode} suppressEditorialLabels={suppressEditorialLabels}/></Frame>;
  if (generatedSource) return <Frame direction={direction} scene={scene}>
    <GeneratedKeyVisual source={generatedSource} step={step}/>
    <GeneratedRecoveryOverlay scene={scene} step={step}/>
    <GeneratedNativeCopy text={text} truthLabel={truthLabel} step={step}/>
  </Frame>;
  if(scene.semanticMechanism)return <Frame direction={direction} scene={scene}><SemanticMechanism scene={scene}/></Frame>;
  return <Frame direction={direction} scene={scene}>
    {direction.visualMode === 'typographic-editorial' && <TypographyEditorial text={text} direction={direction}/>} 
    {direction.visualMode === 'object-metaphor-cinematic' && <ObjectCinematic text={text} direction={direction}/>} 
    {direction.visualMode === 'proof-evidence-presentation' && <ProofEvidence text={text} truthLabel={truthLabel} direction={direction} step={step}/>} 
    {direction.visualMode === 'transformation-comparison' && <TransformationComparison text={text} direction={direction}/>} 
  </Frame>;
};
