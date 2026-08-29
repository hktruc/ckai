import type {AnimationManifest, Scene} from '../../animation/src/model';
import type {FinishingAudioAsset, SfxCueType} from './model';

export type SemanticSfxBinding={assetId:string;cueType:SfxCueType;sceneId:string;motionPhase:string;semanticEventSeconds:number};

const matches=(cue:SfxCueType,scene:Scene):boolean=>{
  const archetype=scene.artDirection?.semanticArchetype; const pacing=scene.artDirection?.pacingIntent; const proof=scene.artDirection?.proof.classification;
  if(cue==='warning-tension') return archetype==='warning-tension'||pacing==='interrupt';
  if(cue==='thesis-emphasis') return archetype==='thesis-declaration'||pacing==='hold';
  if(cue==='proof-reveal') return archetype==='evidence-proof'||proof==='actual-proof'||proof==='visual-representation';
  if(cue==='closing-payoff') return archetype==='conclusion-distillation'||pacing==='resolve';
  if(cue==='comparison-shift'||cue==='contrast-tension') return archetype==='contrast-before-after';
  return cue==='transition-accent';
};

const phaseFor=(cue:SfxCueType)=>cue==='warning-tension'?'ENTER':cue==='transition-accent'||cue==='comparison-shift'?'TRANSITION':'EMPHASIZE';

export const bindSfxToSemanticEvents=(assets:FinishingAudioAsset[],animation:AnimationManifest):{assets:FinishingAudioAsset[];bindings:SemanticSfxBinding[]}=>{
  const bindings:SemanticSfxBinding[]=[];
  const rebound=assets.map((asset)=>{
    if(asset.type!=='sfx'||!asset.cueType) return {...asset};
    const candidates=animation.scenes.filter((scene)=>matches(asset.cueType!,scene));
    if(candidates.length!==1) throw new Error(`${asset.id} semantic cue ${asset.cueType} requires exactly one matching scene, found ${candidates.length}`);
    const scene=candidates[0]!; const phase=phaseFor(asset.cueType); const event=scene.motionPlan?.events.find((item)=>item.phase===phase)??scene.motionPlan?.events.find((item)=>item.phase==='EMPHASIZE');
    if(!event) throw new Error(`${asset.id} semantic cue has no ${phase} motion event`);
    const local=asset.cueType==='warning-tension'?event.startSeconds+(event.endSeconds-event.startSeconds)*.35:event.startSeconds;
    const latest=Math.max(scene.startSeconds,animation.totalSeconds-(asset.durationSeconds??0)); const startSeconds=Number(Math.min(scene.startSeconds+local,latest).toFixed(3));
    bindings.push({assetId:asset.id,cueType:asset.cueType,sceneId:scene.id,motionPhase:event.phase,semanticEventSeconds:startSeconds});
    return {...asset,sceneId:scene.id,startSeconds};
  });
  return {assets:rebound,bindings};
};
