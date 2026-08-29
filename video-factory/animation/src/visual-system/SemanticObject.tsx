import type {SceneArtDirection} from './grammar';

const focusToken = (text: string, emphasis?: string) => {
  if (emphasis?.trim()) return emphasis.trim().replace(/[.!?]+$/u, '');
  return text.replace(/\n/g, ' ').split(/\s+/u).filter(Boolean).sort((a, b) => b.length - a.length)[0]?.replace(/[.!?]+$/u, '') ?? '';
};

const Lens = ({text, direction}: {text: string; direction: SceneArtDirection}) => <>
  <div style={{position: 'absolute', width: 650, height: 650, right: -65, top: 550, borderRadius: '50%', background: 'rgba(18,25,34,.86)', border: '32px solid #202833', boxShadow: 'inset 76px 0 120px rgba(244,240,232,.07), inset -65px -34px 96px rgba(0,0,0,.68), -58px 88px 140px rgba(0,0,0,.62), -12px -18px 0 #B77D35', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(112deg,rgba(244,240,232,.24),transparent 27%,rgba(183,125,53,.10) 62%,transparent 75%)'}} />
    <div style={{position: 'absolute', left: 42, right: 34, top: 246, fontSize: focusToken(text,direction.emphasisText).length > 8 ? 72 : 104, letterSpacing: -3.2, fontWeight: 900, color: '#F4F0E8', whiteSpace: 'nowrap'}}>{focusToken(text, direction.emphasisText)}</div>
  </div>
  <div style={{position: 'absolute', width: 154, height: 600, right: -20, top: 1110, borderRadius: 80, background: 'linear-gradient(90deg,#090C11,#35404E 48%,#121820)', boxShadow: '-34px 32px 70px rgba(0,0,0,.66)', transform: 'rotate(-34deg)', transformOrigin: 'top center'}} />
</>;

const Balance = () => <>
  <div style={{position:'absolute',left:84,right:84,top:850,height:18,background:'linear-gradient(90deg,#343C47,#D2C7B5,#343C47)',transform:'rotate(-6deg)',boxShadow:'0 32px 55px rgba(0,0,0,.5)'}} />
  <div style={{position:'absolute',left:505,top:830,width:70,height:430,clipPath:'polygon(50% 0,100% 100%,0 100%)',background:'linear-gradient(90deg,#10151C,#59616B,#121820)'}} />
  <div style={{position:'absolute',left:110,top:610,width:360,height:230,background:'linear-gradient(145deg,#1D2530,#0B0F15)',transform:'rotate(-6deg)',boxShadow:'28px 42px 80px rgba(0,0,0,.58)'}} />
  <div style={{position:'absolute',right:90,top:760,width:310,height:170,background:'linear-gradient(145deg,#D8D0C2,#797467)',transform:'rotate(-6deg)',boxShadow:'28px 42px 80px rgba(0,0,0,.58)'}} />
</>;

const Layers = ({text, direction}: {text: string; direction: SceneArtDirection}) => <>
  {[0,1,2].map((index)=><div key={index} style={{position:'absolute',width:660,height:820,left:260+index*80,top:330+index*95,background:`rgba(${28+index*8},${36+index*8},${48+index*9},${.56-index*.08})`,border:'1px solid rgba(244,240,232,.14)',boxShadow:'-38px 45px 95px rgba(0,0,0,.38)',transform:`perspective(1200px) rotateY(-18deg) rotateZ(${5-index*3}deg)`,backdropFilter:'blur(5px)'}} />)}
  <div style={{position:'absolute',left:470,top:850,fontSize:96,fontWeight:900,letterSpacing:-4,color:'#F4F0E8',textShadow:'0 0 45px rgba(244,240,232,.18)'}}>{focusToken(text,direction.emphasisText)}</div>
</>;

const Fracture = () => <>
  <div style={{position:'absolute',inset:'130px -80px 180px -120px',clipPath:'polygon(0 0,62% 0,49% 46%,58% 100%,0 100%)',background:'linear-gradient(145deg,#171E28,#090C11)',boxShadow:'45px 0 100px rgba(0,0,0,.65)'}} />
  <div style={{position:'absolute',inset:'130px -120px 180px 350px',clipPath:'polygon(38% 0,100% 0,100% 100%,32% 100%,45% 47%)',background:'linear-gradient(145deg,#222832,#0A0D12)',boxShadow:'-45px 0 100px rgba(0,0,0,.65)'}} />
  <div style={{position:'absolute',left:545,top:150,bottom:200,width:18,background:'linear-gradient(transparent,#E7DDCC 28%,#9C552E 58%,transparent)',transform:'rotate(8deg)',filter:'blur(1px)',boxShadow:'0 0 55px rgba(156,85,46,.36)'}} />
</>;

const DominoChain = () => <>
  {[0,1,2,3,4].map((index)=><div key={index} style={{position:'absolute',width:150-index*8,height:430-index*25,left:55+index*190,top:660+index*88,background:index===4?'linear-gradient(145deg,#D6C8B3,#695F51)':'linear-gradient(145deg,#242D39,#0C1118)',boxShadow:'28px 45px 80px rgba(0,0,0,.58)',transform:`perspective(900px) rotateY(-12deg) rotateZ(${index*7-8}deg)`,transformOrigin:'bottom center'}} />)}
</>;

const Aperture = () => <>
  <div style={{position:'absolute',top:-100,bottom:-100,left:690,width:22,background:'#EEE5D6',boxShadow:'0 0 65px rgba(238,229,214,.48),0 0 160px rgba(183,125,53,.24)',transform:'rotate(5deg)'}} />
  <div style={{position:'absolute',inset:0,clipPath:'polygon(66% 0,100% 0,100% 100%,59% 100%)',background:'linear-gradient(100deg,rgba(183,125,53,.04),rgba(183,125,53,.22) 58%,rgba(244,240,232,.07))'}} />
</>;

const Reassembly = () => <>
  {[0,1,2,3].map((index)=><div key={index} style={{position:'absolute',width:420-index*35,height:130,left:-80+index*105,top:420+index*185,background:'linear-gradient(145deg,#202834,#0C1118)',boxShadow:'20px 35px 70px rgba(0,0,0,.5)',transform:`rotate(${[-11,7,-5,3][index]}deg)`,opacity:.86}} />)}
  <div style={{position:'absolute',right:-90,bottom:310,width:690,height:520,background:'linear-gradient(145deg,#D6CFC3,#777166)',clipPath:'polygon(8% 0,100% 0,100% 100%,0 100%)',boxShadow:'-45px 55px 110px rgba(0,0,0,.6)'}} />
</>;

export const SemanticObject = ({text, direction}: {text: string; direction: SceneArtDirection}) => {
  switch (direction.semanticObject) {
    case 'lens': return <Lens text={text} direction={direction}/>;
    case 'balance': return <Balance/>;
    case 'layers': return <Layers text={text} direction={direction}/>;
    case 'fracture': return <Fracture/>;
    case 'domino-chain': return <DominoChain/>;
    case 'aperture': return <Aperture/>;
    case 'reassembly-field': return <Reassembly/>;
    default: return null;
  }
};
