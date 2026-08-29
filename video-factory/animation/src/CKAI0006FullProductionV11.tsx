import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const C={ink:'#EAF1F3',dark:'#071016',mid:'#13242A',glass:'rgba(226,244,242,.13)',teal:'#35D2B0',coral:'#FF735F',amber:'#FFD36A',ivory:'#F5F0E6',muted:'#91A5AA'};
export const S=[0,101,245,340,417,606,728,857,1068];
export const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
export const mix=(f:number,a:number,b:number,x:number,y:number)=>interpolate(f,[a,b],[x,y],clamp);
const sceneFade=(f:number,a:number,b:number)=>Math.min(mix(f,a,a+9,0,1),mix(f,b-9,b,1,0));

const Headline:React.FC<{kicker:string;children:React.ReactNode;accent?:string;align?:'left'|'right'}>=({kicker,children,accent=C.teal,align='left'})=><div style={{position:'absolute',top:146,[align]:70,width:900,textAlign:align,zIndex:30,textShadow:'0 5px 25px #000B'}}><div style={{fontSize:25,fontWeight:900,letterSpacing:3.5,color:accent,marginBottom:20}}>{kicker}</div><div style={{fontFamily:'Arial, sans-serif',fontSize:79,lineHeight:1.02,fontWeight:950,letterSpacing:-4,color:C.ink}}>{children}</div></div>;

export const Rows:React.FC<{strong?:boolean;weak?:boolean;progress?:number;split?:number}>=({strong,weak,progress=1,split=0})=><div style={{display:'grid',gap:21}}>{[.91,.76,.86,.62,.71].map((w,i)=><div key={i} style={{height:i===0?18:14,width:`${w*100}%`,borderRadius:20,background:weak&&(i===1||i===3)?C.coral:strong?C.teal:C.ivory,opacity:strong?.58:weak?.58:.42,filter:weak&&i===1?'blur(3px)':'none',transformOrigin:'left',transform:`translateX(${split*(i%2?28:-18)}px) scaleX(${Math.max(0,progress-i*.07)})`,boxShadow:strong?'0 0 22px #35D2B044':'none'}}/>)}</div>;

const Cursor:React.FC<{x:number;y:number;click?:number}>=({x,y,click=0})=><div style={{position:'absolute',left:x,top:y,width:0,height:0,borderLeft:'13px solid transparent',borderRight:'6px solid transparent',borderTop:`30px solid ${C.ivory}`,filter:'drop-shadow(0 5px 6px #000)',transform:`rotate(-18deg) scale(${1-click*.18})`,zIndex:20}}/>;

export const World:React.FC<{children:React.ReactNode;camera?:string;light?:string;floorShift?:number}>=({children,camera='translate3d(0,0,0) rotateX(0deg) rotateY(0deg)',light=C.teal,floorShift=0})=>{const nodes=React.Children.toArray(children),overlays=nodes.filter((node)=>React.isValidElement(node)&&node.type===Headline),stage=nodes.filter((node)=>!(React.isValidElement(node)&&node.type===Headline));return <AbsoluteFill style={{background:`radial-gradient(circle at 72% 20%,${light}28,transparent 34%),linear-gradient(155deg,#12252A 0%,${C.dark} 56%,#020709 100%)`,overflow:'hidden',perspective:1500,color:C.ink,fontFamily:'Arial, sans-serif'}}>
  <div style={{position:'absolute',inset:-80,backgroundImage:'linear-gradient(110deg,transparent 38%,rgba(255,255,255,.035) 44%,transparent 50%)',transform:`translateX(${floorShift}px)`}}/>
  <div style={{position:'absolute',left:-220,right:-220,bottom:-365,height:760,background:'linear-gradient(175deg,#26383B,#091316 63%)',transform:'rotateX(63deg)',transformOrigin:'top',boxShadow:'0 -40px 100px #0009',borderTop:'2px solid #FFFFFF18'}}/>
  <div style={{position:'absolute',left:80,bottom:165,width:740,height:170,borderRadius:'50%',background:`${light}16`,filter:'blur(38px)',transform:'rotateX(62deg)'}}/>
  <div style={{position:'absolute',inset:0,transformStyle:'preserve-3d',transform:camera}}><div style={{position:'absolute',left:505,top:1210,width:70,height:260,borderRadius:25,background:'linear-gradient(90deg,#071013,#38494C,#0A1417)',boxShadow:'0 20px 45px #000C',transform:'translateZ(-80px)'}}/><div style={{position:'absolute',left:355,top:1430,width:370,height:48,borderRadius:'50%',background:'linear-gradient(180deg,#34464A,#071013)',boxShadow:'0 25px 45px #000C',transform:'translateZ(-70px) rotateX(55deg)'}}/>{stage}</div>
  {overlays}
  <div style={{position:'absolute',left:-90,bottom:35,width:570,height:150,borderRadius:'30px 30px 0 0',background:'linear-gradient(180deg,#28363A,#090E10)',transform:'rotate(-7deg)',boxShadow:'0 -4px 25px #FFFFFF12,0 20px 60px #000',zIndex:40}}><div style={{margin:'35px 48px',display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:10}}>{Array.from({length:21}).map((_,i)=><i key={i} style={{height:13,borderRadius:4,background:i===13?`${light}88`:'#AFC1C321',boxShadow:'inset 0 1px #fff2'}}/>)}</div></div>
  <div style={{position:'absolute',right:-95,bottom:78,width:270,height:185,borderRadius:36,background:'linear-gradient(140deg,#25363A,#0B1416)',transform:'rotate(12deg)',boxShadow:'inset 0 1px #fff2,0 25px 60px #000',zIndex:42}}/>
  <div style={{position:'absolute',inset:0,boxShadow:'inset 0 0 180px #000B',zIndex:60,pointerEvents:'none'}}/>
</AbsoluteFill>};

export const Display:React.FC<{children:React.ReactNode;style?:React.CSSProperties;label?:string;glow?:string}>=({children,style,label='AI WORKSPACE',glow=C.teal})=><div style={{position:'absolute',left:140,top:510,width:800,height:820,borderRadius:40,background:'linear-gradient(145deg,rgba(239,251,248,.18),rgba(91,132,133,.075))',border:'2px solid #E8FFFF2C',boxShadow:`inset 0 1px #fff5,0 45px 110px #000A,0 0 65px ${glow}18`,backdropFilter:'blur(11px)',transformStyle:'preserve-3d',overflow:'hidden',...style}}><div style={{height:68,borderBottom:'1px solid #FFFFFF1C',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 30px',fontSize:17,fontWeight:900,letterSpacing:2.5,color:C.muted}}><span style={{display:'flex',gap:9}}><i style={{width:10,height:10,borderRadius:20,background:C.coral}}/><i style={{width:10,height:10,borderRadius:20,background:C.amber}}/><i style={{width:10,height:10,borderRadius:20,background:C.teal}}/></span>{label}</div>{children}<div style={{position:'absolute',inset:0,background:'linear-gradient(105deg,transparent 25%,#FFFFFF10 45%,transparent 62%)',pointerEvents:'none'}}/></div>;

const Scene:React.FC<{a:number;b:number;children:React.ReactNode}>=({a,b,children})=>{const f=useCurrentFrame();if(f<a||f>=b)return null;return <AbsoluteFill style={{opacity:sceneFade(f,a,b)}}>{children}</AbsoluteFill>};

export const CKAI0006FullProductionV11:React.FC=()=>{
 const f=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig();
 const sp=(at:number,damping=17)=>spring({frame:f-at,fps,config:{damping,stiffness:115}});
 const progress=f/durationInFrames;
 return <AbsoluteFill style={{background:C.dark}}>
  <Scene a={S[0]} b={S[1]}><World camera={`translate3d(${mix(f,0,100,70,-20)}px,${mix(f,0,100,55,-10)}px,${mix(f,0,100,-100,105)}px) rotateY(${mix(f,0,100,-8,1)}deg) rotateX(1deg)`} light={C.coral} floorShift={mix(f,0,100,-80,45)}>
    <Headline kicker="CÂU TRẢ LỜI ĐẦU TIÊN" accent={C.coral}>A.I trả lời hay…<br/><span style={{color:C.coral}}>chưa chắc tốt nhất.</span></Headline>
    <Display glow={C.coral} style={{transform:`rotateY(-8deg) rotateX(2deg) translateZ(${mix(f,0,60,-80,0)}px)`}} label="FIRST ANSWER · COMPLETE"><div style={{padding:'62px 50px'}}><div style={{fontSize:24,fontWeight:900,color:C.ivory,marginBottom:42}}>CÂU TRẢ LỜI ĐÃ SẴN SÀNG</div><Rows progress={sp(8)}/><div style={{marginTop:55,height:3,background:C.coral,transformOrigin:'left',transform:`scaleX(${sp(44)})`,boxShadow:`0 0 22px ${C.coral}`}}/><div style={{marginTop:20,fontSize:21,fontWeight:900,letterSpacing:2,color:C.coral}}>FINISHED LOOK ≠ BEST VERSION</div></div></Display>
  </World></Scene>

  <Scene a={S[1]} b={S[2]}><World camera={`translate3d(${mix(f,S[1],S[2],-110,-20)}px,40px,${mix(f,S[1],S[2],80,210)}px) rotateY(${mix(f,S[1],S[2],7,-3)}deg)`} light={C.coral} floorShift={mix(f,S[1],S[2],30,-70)}>
    <Headline kicker="SAI LẦM PHỔ BIẾN" accent={C.coral}>Dừng lại<br/>quá sớm.</Headline>
    <Display glow={C.coral} style={{left:210,top:575,width:760,height:720,transform:'rotateY(7deg)'}} label="ANSWER ACCEPTED"><div style={{padding:'55px 48px'}}><Rows/><div style={{marginTop:55,display:'flex',alignItems:'center',gap:20}}><div style={{width:46,height:46,borderRadius:50,background:C.teal,display:'grid',placeItems:'center',fontWeight:950,fontSize:25}}>✓</div><b style={{fontSize:25,color:C.teal}}>SẴN SÀNG ĐỂ DÙNG</b></div><div style={{marginTop:35,height:2,background:`linear-gradient(90deg,${C.coral},transparent)`,transformOrigin:'left',transform:`scaleX(${mix(f,S[1]+65,S[1]+90,0,1)})`}}/></div><Cursor x={560} y={530} click={sp(S[1]+38)}/></Display>
    <div style={{position:'absolute',left:0,right:0,top:690,height:7,background:C.coral,boxShadow:`0 0 45px ${C.coral}`,opacity:mix(f,S[1]+75,S[1]+88,0,.9),transform:`translateY(${mix(f,S[1]+75,S[1]+115,-180,350)}px)`,zIndex:25}}/>
  </World></Scene>

  <Scene a={S[2]} b={S[3]}><World camera={`translate3d(${mix(f,S[2],S[3],120,-150)}px,${mix(f,S[2],S[3],130,20)}px,160px) rotateY(-10deg) rotateX(4deg)`} floorShift={mix(f,S[2],S[3],-120,90)}>
    <Headline kicker="CÁCH TỐT HƠN">Bắt A.I làm<br/><span style={{color:C.teal}}>3 bước.</span></Headline>
    <div style={{position:'absolute',left:175,top:660,width:760,height:710,transformStyle:'preserve-3d',transform:'rotateY(-12deg)'}}>{['VIẾT BẢN ĐẦU','TỰ PHẢN BIỆN','VIẾT LẠI'].map((x,i)=><div key={x} style={{position:'absolute',left:i*48,top:i*170,width:660,height:130,borderRadius:28,background:i===1?'linear-gradient(120deg,#FF735F33,#20343A88)':'linear-gradient(120deg,#35D2B025,#20343A88)',border:`2px solid ${i===1?C.coral:C.teal}66`,boxShadow:'0 30px 60px #0008',backdropFilter:'blur(10px)',transform:`translateZ(${i*65}px) translateX(${(1-sp(S[2]+i*8))*180}px)`,display:'flex',alignItems:'center',gap:28,padding:'0 34px'}}><span style={{fontSize:61,fontWeight:950,color:i===1?C.coral:C.teal}}>0{i+1}</span><b style={{fontSize:31,letterSpacing:1}}>{x}</b></div>)}</div>
  </World></Scene>

  <Scene a={S[3]} b={S[4]}><World camera={`translate3d(-220px,${mix(f,S[3],S[4],110,5)}px,310px) rotateY(10deg) rotateX(${mix(f,S[3],S[4],3,-1)}deg)`}>
    <Headline kicker="BƯỚC 1 / 3">Viết bản trả lời<br/>đầu tiên.</Headline>
    <Display style={{left:245,top:600,width:720,height:690,transform:'rotateY(10deg)'}} label="DRAFT · V1"><div style={{padding:'58px 48px'}}><div style={{fontSize:20,color:C.muted,fontWeight:900,letterSpacing:2,marginBottom:38}}>LIVE DRAFT</div><Rows progress={sp(S[3]+6)}/><div style={{position:'absolute',left:48,top:226+mix(f,S[3]+10,S[4]-15,0,190),width:4,height:27,background:C.teal,boxShadow:`0 0 18px ${C.teal}`}}/></div></Display>
    <div style={{position:'absolute',left:155,top:1120,width:160,height:210,borderRadius:30,background:'#152429',transform:'rotate(-12deg) translateZ(180px)',boxShadow:'0 25px 45px #000A,inset 0 1px #fff2'}}/>
  </World></Scene>

  <Scene a={S[4]} b={S[5]}><World camera={`translate3d(${mix(f,S[4],S[5],-210,-380)}px,${mix(f,S[4],S[5],80,-30)}px,${mix(f,S[4],S[5],210,430)}px) rotateY(${mix(f,S[4],S[5],10,17)}deg) rotateX(-2deg)`} light={C.coral} floorShift={mix(f,S[4],S[5],-40,110)}>
    <Headline kicker="BƯỚC 2 / 3 · PHẢN BIỆN" accent={C.coral}>Đưa câu trả lời<br/>vào vùng kiểm tra.</Headline>
    <Display glow={C.coral} style={{left:255,top:610,width:710,height:700,transform:'rotateY(14deg)',overflow:'visible'}} label="ANALYSIS IN MOTION"><div style={{position:'absolute',inset:'70px 0 0',overflow:'hidden',borderRadius:'0 0 40px 40px'}}><div style={{position:'absolute',left:48,right:48,top:62,transform:`translateZ(${mix(f,S[4]+20,S[4]+90,0,85)}px)`}}><Rows weak split={mix(f,S[4]+24,S[4]+90,0,1)}/></div><div style={{position:'absolute',left:20,right:20,top:mix(f,S[4]+20,S[4]+130,95,390),height:74,background:`linear-gradient(180deg,transparent,${C.amber}38,transparent)`,borderTop:`2px solid ${C.amber}`,filter:'blur(.2px)',boxShadow:`0 -10px 35px ${C.amber}33`}}/></div>
      <div style={{position:'absolute',left:74,top:244,width:430,height:40,border:`2px solid ${C.coral}`,borderRadius:12,opacity:mix(f,S[4]+35,S[4]+60,0,1),transform:`translateZ(${mix(f,S[4]+35,S[4]+70,0,120)}px)`,boxShadow:`0 0 24px ${C.coral}55`}}/>
      <div style={{position:'absolute',left:500,top:235,width:150,height:44,color:C.coral,fontSize:18,fontWeight:900,letterSpacing:1.5,opacity:mix(f,S[4]+45,S[4]+65,0,1)}}>ĐIỂM YẾU</div>
    </Display>
    <div style={{position:'absolute',left:90,top:1260,width:850,height:265,transformStyle:'preserve-3d'}}>
      <div style={{position:'absolute',left:0,top:20,width:245,height:150,filter:`blur(${mix(f,S[4]+55,S[4]+95,0,4)}px)`,borderBottom:`4px solid ${C.coral}`,fontSize:24,fontWeight:900,padding:'18px'}}>CÂU CHƯA RÕ</div>
      <div style={{position:'absolute',left:295,top:5,width:245,height:170,fontSize:24,fontWeight:900,padding:'18px'}}><span>Ý A</span><span style={{display:'inline-block',width:65,margin:'0 12px',borderTop:`4px dashed ${C.coral}`}}/><span>Ý B</span><div style={{color:C.coral,fontSize:18,marginTop:48}}>THIẾU CẦU NỐI</div></div>
      <div style={{position:'absolute',left:590,top:0,width:245,height:170,border:`3px dashed ${C.coral}`,borderRadius:22,display:'grid',placeItems:'center',fontSize:20,fontWeight:900,color:C.coral}}>PHẦN CÒN THIẾU</div>
    </div>
  </World></Scene>

  <Scene a={S[5]} b={S[6]}><World camera={`translate3d(${mix(f,S[5],S[6],-330,-120)}px,${mix(f,S[5],S[6],-40,45)}px,${mix(f,S[5],S[6],400,150)}px) rotateY(${mix(f,S[5],S[6],16,2)}deg)`} floorShift={mix(f,S[5],S[6],100,-40)}>
    <Headline kicker="BƯỚC 3 / 3">Viết lại<br/><span style={{color:C.teal}}>tốt hơn.</span></Headline>
    <Display style={{left:210,top:600,width:760,height:720,transform:'rotateY(7deg)',overflow:'visible'}} label="REBUILD · IN PROGRESS"><div style={{position:'absolute',left:48,right:48,top:140}}>
      {[.91,.76,.86,.62,.71].map((w,i)=>{const q=mix(f,S[5]+12+i*6,S[5]+70+i*5,0,1),oldX=(1-q)*(i%2?-70:90),oldY=(1-q)*(i-2)*35;return <div key={i} style={{height:i===0?19:15,width:`${w*100}%`,borderRadius:20,background:q>.72?C.teal:(i===1||i===3?C.coral:C.ivory),opacity:.28+.42*q,marginBottom:24,transform:`translate3d(${oldX}px,${oldY}px,${(1-q)*130}px) scaleX(${.72+.28*q})`,transformOrigin:'left',boxShadow:q>.8?`0 0 22px ${C.teal}55`:'none'}}/>})}
      <div style={{height:64,marginTop:45,borderRadius:18,border:`2px dashed ${C.teal}`,overflow:'hidden',opacity:mix(f,S[5]+45,S[5]+75,0,1)}}><div style={{height:'100%',background:`linear-gradient(90deg,${C.teal}66,${C.teal}18)`,transformOrigin:'left',transform:`scaleX(${mix(f,S[5]+48,S[5]+95,0,1)})`}}/></div>
    </div><div style={{position:'absolute',left:48,right:48,bottom:45,display:'flex',justifyContent:'space-between',fontSize:18,fontWeight:900,letterSpacing:2,color:C.teal}}><span>RESTRUCTURE</span><span>{Math.round(mix(f,S[5]+10,S[6]-20,24,100))}%</span></div></Display>
    <div style={{position:'absolute',left:260,top:575,width:650,height:8,background:`linear-gradient(90deg,transparent,${C.teal},transparent)`,boxShadow:`0 0 35px ${C.teal}`,transform:`translateY(${mix(f,S[5]+18,S[5]+92,0,600)}px)`,opacity:mix(f,S[5]+15,S[5]+30,0,.8)}}/>
  </World></Scene>

  <Scene a={S[6]} b={S[7]}><World camera={`translate3d(${mix(f,S[6],S[7],-130,20)}px,${mix(f,S[6],S[7],40,-25)}px,${mix(f,S[6],S[7],160,40)}px) rotateY(${mix(f,S[6],S[7],4,0)}deg)`} floorShift={mix(f,S[6],S[7],-60,15)}>
    <Headline kicker="KẾT QUẢ">Một thay đổi nhỏ.<br/><span style={{color:C.teal}}>Khác hẳn.</span></Headline>
    <Display style={{left:155,top:590,width:790,height:770,transform:`rotateY(${mix(f,S[6],S[7],7,0)}deg) translateZ(${mix(f,S[6],S[7],-40,80)}px)`}} label="BETTER ANSWER · V2"><div style={{padding:'62px 55px'}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:45}}><b style={{fontSize:28}}>CÂU TRẢ LỜI HOÀN CHỈNH</b><span style={{width:48,height:48,borderRadius:50,background:C.teal,color:C.dark,display:'grid',placeItems:'center',fontSize:27,fontWeight:950}}>✓</span></div><Rows strong/><div style={{marginTop:52,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>{['RÕ','ĐỦ','CHẶT'].map(x=><div key={x} style={{padding:'17px 0',textAlign:'center',borderRadius:15,background:'#35D2B021',border:'1px solid #35D2B055',fontSize:20,fontWeight:950,color:C.teal}}>{x}</div>)}</div></div></Display>
    <div style={{position:'absolute',right:25,top:800,width:150,height:350,background:'linear-gradient(90deg,#0000,#000A)',filter:'blur(12px)',zIndex:22}}/>
  </World></Scene>

  <Scene a={S[7]} b={S[8]}><World camera={`translate3d(0,${mix(f,S[7],S[8],30,-25)}px,${mix(f,S[7],S[8],60,-80)}px) rotateY(0deg)`}>
    <Headline kicker="GHI NHỚ">Đừng chỉ hỏi A.I<br/>để lấy đáp án.</Headline>
    <Display style={{left:175,top:680,width:760,height:610,transform:'rotateY(-3deg)',background:'linear-gradient(145deg,rgba(31,54,58,.76),rgba(12,26,30,.78))'}} label="A BETTER AI HABIT"><div style={{padding:'65px 50px'}}><div style={{fontSize:29,color:C.teal,fontWeight:900,marginBottom:24}}>HÃY DÙNG A.I ĐỂ</div><div style={{fontSize:62,lineHeight:1.05,fontWeight:950,letterSpacing:-2}}>TỰ KIỂM TRA.<br/>TỰ NÂNG CẤP.</div><div style={{marginTop:52,height:5,borderRadius:10,background:`linear-gradient(90deg,${C.teal} 0 30%,${C.coral} 30% 65%,${C.teal} 65%)`}}/><div style={{display:'flex',justifyContent:'space-between',marginTop:17,fontSize:17,fontWeight:900,letterSpacing:1.5,color:C.muted}}><span>FIRST ANSWER</span><span>CRITIQUE</span><span>BETTER ANSWER</span></div></div></Display>
  </World></Scene>
  <div style={{position:'absolute',left:70,right:70,bottom:48,height:4,borderRadius:9,background:'#FFFFFF18',zIndex:100}}><div style={{height:'100%',width:`${progress*100}%`,background:C.teal,boxShadow:`0 0 15px ${C.teal}`}}/></div>
 </AbsoluteFill>;
};
