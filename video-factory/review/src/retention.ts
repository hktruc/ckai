import type {AnimationManifest} from '../../animation/src/model';
import type {VoicePlan} from '../../voice/src/model';

export const SHORT_FORM_RETENTION_POLICY_V1 = {
  id: 'SHORT_FORM_RETENTION_POLICY_V1',
  version: 1,
  platformMaximumSeconds: 60,
  defaultSpokenUnitsPerMinute: 170,
  leadingTrimToleranceSeconds: 0.35,
  trailingTrimToleranceSeconds: 0.45,
  naturalTransitionMaximumSeconds: 0.75,
  intentionalEmphasisMaximumSeconds: 1.35,
  proofReadingBaseSeconds: 0.35,
  proofReadingWordsPerSecond: 3.5,
  proofReadingMaximumSeconds: 2.4,
  visualAnticipationMaximumSeconds: 0.35,
  durationRoundingSeconds: 0.1,
} as const;

export type RetentionPauseClassification = 'intentional-emphasis' | 'proof-reading' | 'motion-only' | 'music-only' | 'unclassified';
export type RetentionNarrationUnit = {id:string; startSeconds:number; endSeconds:number};
export type DeclaredRetentionPause = {startSeconds:number; endSeconds:number; classification:RetentionPauseClassification; basis:string; readingWordCount?:number};
export type RetentionTimeline = {durationSeconds:number; narrationUnits:RetentionNarrationUnit[]; declaredPauses:DeclaredRetentionPause[]};
export type RetentionFinding = {code:'RETENTION_TIMELINE_INVALID'|'RETENTION_PAUSE_EXCESSIVE'|'RETENTION_PAUSE_UNJUSTIFIED'; startSeconds:number; endSeconds:number; durationSeconds:number; message:string};
export type RetentionQaRecord = {policyId:typeof SHORT_FORM_RETENTION_POLICY_V1.id; policyVersion:1; status:'PASS'|'BLOCKED'; recommendedMaximumDurationSeconds:number; findings:RetentionFinding[]};
export type DurationSceneNeed = {spokenUnitCount:number; spokenUnitsPerMinute?:number; measuredNarrationSeconds?:number; proofReadingWordCount?:number; semanticEmphasisSeconds?:number};
export type ProductionPauseClassification = 'NORMAL_CONTINUATION'|'IDEA_BOUNDARY'|'INTENTIONAL_EMPHASIS'|'PROOF_READING'|'TENSION_HOLD'|'EXCESSIVE_RETENTION_PAUSE';
export type RetimedPause = {afterNarrationId:string; originalStartSeconds:number; originalEndSeconds:number; originalDurationSeconds:number; originalClassification:ProductionPauseClassification; finalStartSeconds:number; finalEndSeconds:number; finalDurationSeconds:number; finalClassification:Exclude<ProductionPauseClassification,'EXCESSIVE_RETENTION_PAUSE'>; semanticBasis:string};
export type RetentionMeasurements = {totalDurationSeconds:number;totalSpeechDurationSeconds:number;totalMeasuredPauseDurationSeconds:number;longestSpeechGapSeconds:number;gapsOver075:number;gapsOver100:number;gapsOver150:number;excessiveRetentionPauses:number;semanticPauseClassifications:ProductionPauseClassification[];retentionPolicyResult:'PASS'|'BLOCKED';recommendedMaximumDurationSeconds:number};

const rounded=(value:number,step=SHORT_FORM_RETENTION_POLICY_V1.durationRoundingSeconds)=>Number((Math.ceil(value/step)*step).toFixed(3));
const gapDuration=(start:number,end:number)=>Number(Math.max(0,end-start).toFixed(3));
const declaredFor=(timeline:RetentionTimeline,start:number,end:number)=>timeline.declaredPauses.find((pause)=>pause.startSeconds<=start+.05&&pause.endSeconds>=end-.05);

export const recommendShortFormDuration = (scenes:DurationSceneNeed[]):number => {
  if(!scenes.length) throw new Error('Retention duration planning requires at least one semantic scene');
  const semanticSeconds=scenes.reduce((sum,scene)=>{
    const pace=scene.spokenUnitsPerMinute??SHORT_FORM_RETENTION_POLICY_V1.defaultSpokenUnitsPerMinute;
    if(!(scene.spokenUnitCount>=0&&pace>0)) throw new Error('Retention duration inputs must be non-negative with positive pacing');
    const narration=scene.measuredNarrationSeconds??scene.spokenUnitCount/pace*60;
    const proof=(scene.proofReadingWordCount??0)/SHORT_FORM_RETENTION_POLICY_V1.proofReadingWordsPerSecond;
    const emphasis=Math.min(scene.semanticEmphasisSeconds??0,SHORT_FORM_RETENTION_POLICY_V1.intentionalEmphasisMaximumSeconds);
    return sum+Math.max(narration,proof)+emphasis;
  },0);
  const transitionBudget=Math.max(0,scenes.length-1)*(SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds-SHORT_FORM_RETENTION_POLICY_V1.visualAnticipationMaximumSeconds);
  const duration=rounded(semanticSeconds+transitionBudget);
  if(duration>=SHORT_FORM_RETENTION_POLICY_V1.platformMaximumSeconds) throw new Error('Semantic needs exceed the short-form platform boundary; revise content density instead of adding speed pressure');
  return duration;
};

export const evaluateRetentionTimeline = (timeline:RetentionTimeline):RetentionQaRecord => {
  const units=[...timeline.narrationUnits].sort((a,b)=>a.startSeconds-b.startSeconds); const findings:RetentionFinding[]=[];
  if(!(timeline.durationSeconds>0&&timeline.durationSeconds<SHORT_FORM_RETENTION_POLICY_V1.platformMaximumSeconds)||!units.length||units.some((unit,index)=>unit.startSeconds<0||unit.endSeconds<=unit.startSeconds||unit.endSeconds>timeline.durationSeconds||(index>0&&unit.startSeconds<units[index-1]!.endSeconds))) {
    findings.push({code:'RETENTION_TIMELINE_INVALID',startSeconds:0,endSeconds:timeline.durationSeconds,durationSeconds:timeline.durationSeconds,message:'Retention timeline must be ordered, non-overlapping, positive and inside the short-form boundary'});
  }
  const gaps=[
    {kind:'leading',start:0,end:units[0]?.startSeconds??0},
    ...units.slice(1).map((unit,index)=>({kind:'transition',start:units[index]!.endSeconds,end:unit.startSeconds})),
    {kind:'trailing',start:units.at(-1)?.endSeconds??timeline.durationSeconds,end:timeline.durationSeconds},
  ].filter((gap)=>gap.end-gap.start>.001);
  for(const gap of gaps){
    const duration=gapDuration(gap.start,gap.end); const declared=declaredFor(timeline,gap.start,gap.end);
    let maximum:number=gap.kind==='leading'?SHORT_FORM_RETENTION_POLICY_V1.leadingTrimToleranceSeconds:gap.kind==='trailing'?SHORT_FORM_RETENTION_POLICY_V1.trailingTrimToleranceSeconds:SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds;
    if(declared?.classification==='intentional-emphasis'&&declared.basis.trim()) maximum=SHORT_FORM_RETENTION_POLICY_V1.intentionalEmphasisMaximumSeconds;
    else if(declared?.classification==='proof-reading'&&declared.basis.trim()&&(declared.readingWordCount??0)>0) maximum=Math.min(SHORT_FORM_RETENTION_POLICY_V1.proofReadingMaximumSeconds,SHORT_FORM_RETENTION_POLICY_V1.proofReadingBaseSeconds+(declared.readingWordCount??0)/SHORT_FORM_RETENTION_POLICY_V1.proofReadingWordsPerSecond);
    else if(declared&&duration>SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds) findings.push({code:'RETENTION_PAUSE_UNJUSTIFIED',startSeconds:gap.start,endSeconds:gap.end,durationSeconds:duration,message:`${declared.classification} cannot justify viewer waiting; motion/music are not semantic progress`});
    if(duration>maximum+.001) findings.push({code:'RETENTION_PAUSE_EXCESSIVE',startSeconds:gap.start,endSeconds:gap.end,durationSeconds:duration,message:`${gap.kind} retention pause ${duration.toFixed(3)}s exceeds the policy allowance ${maximum.toFixed(3)}s`});
  }
  const semanticDuration=units.reduce((sum,unit)=>sum+(unit.endSeconds-unit.startSeconds),0);
  const recommendedMaximumDurationSeconds=rounded(semanticDuration+SHORT_FORM_RETENTION_POLICY_V1.leadingTrimToleranceSeconds+SHORT_FORM_RETENTION_POLICY_V1.trailingTrimToleranceSeconds+Math.max(0,units.length-1)*SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds);
  return {policyId:SHORT_FORM_RETENTION_POLICY_V1.id,policyVersion:1,status:findings.length?'BLOCKED':'PASS',recommendedMaximumDurationSeconds,findings};
};

export const retentionTimelineFromRuntime = (voicePlan:VoicePlan,animation:AnimationManifest):RetentionTimeline => ({
  durationSeconds:animation.totalSeconds,
  narrationUnits:voicePlan.segments.map((segment)=>({id:segment.id,startSeconds:segment.slotStartSeconds,endSeconds:Number((segment.slotStartSeconds+(segment.measuredDurationSeconds??segment.slotEndSeconds-segment.slotStartSeconds)).toFixed(3))})),
  declaredPauses:animation.voiceHandoff.sceneSlots.flatMap((slot)=>slot.pauseWindows.map((pause)=>({startSeconds:pause.startSeconds,endSeconds:pause.endSeconds,classification:pause.classification??'unclassified',basis:pause.semanticBasis??'',readingWordCount:pause.readingWordCount}))),
});

export const evaluateRuntimeRetention = (voicePlan:VoicePlan,animation:AnimationManifest):RetentionQaRecord => evaluateRetentionTimeline(retentionTimelineFromRuntime(voicePlan,animation));

const words=(value:string)=>value.trim().split(/\s+/u).filter(Boolean).length;
const round3=(value:number)=>Number(value.toFixed(3));
const finalClassificationFor=(scene:AnimationManifest['scenes'][number],originalGap:number,isLast:boolean):Exclude<ProductionPauseClassification,'EXCESSIVE_RETENTION_PAUSE'>=>{
  if(isLast) return 'IDEA_BOUNDARY';
  if(originalGap<=SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds) return 'NORMAL_CONTINUATION';
  const proof=scene.artDirection?.proof.classification;
  if(proof==='actual-proof'||proof==='visual-representation') return 'PROOF_READING';
  if(scene.artDirection?.pacingIntent==='interrupt'||scene.artDirection?.semanticArchetype==='warning-tension') return 'TENSION_HOLD';
  if(['hold','reflect','resolve'].includes(scene.artDirection?.pacingIntent??'')||['thesis-declaration','conclusion-distillation'].includes(scene.artDirection?.semanticArchetype??'')) return 'INTENTIONAL_EMPHASIS';
  return 'IDEA_BOUNDARY';
};
const targetPauseFor=(classification:Exclude<ProductionPauseClassification,'EXCESSIVE_RETENTION_PAUSE'>,scene:AnimationManifest['scenes'][number],originalGap:number,isLast:boolean)=>{
  if(isLast) return Math.min(originalGap,SHORT_FORM_RETENTION_POLICY_V1.trailingTrimToleranceSeconds);
  const naturalTarget=SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds-SHORT_FORM_RETENTION_POLICY_V1.visualAnticipationMaximumSeconds;
  if(classification==='NORMAL_CONTINUATION'||classification==='IDEA_BOUNDARY') return Math.min(originalGap,naturalTarget);
  if(classification==='TENSION_HOLD') return Math.min(originalGap,SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds);
  if(classification==='INTENTIONAL_EMPHASIS') return Math.min(originalGap,SHORT_FORM_RETENTION_POLICY_V1.intentionalEmphasisMaximumSeconds-SHORT_FORM_RETENTION_POLICY_V1.visualAnticipationMaximumSeconds);
  const readingAllowance=Math.min(SHORT_FORM_RETENTION_POLICY_V1.proofReadingMaximumSeconds,SHORT_FORM_RETENTION_POLICY_V1.proofReadingBaseSeconds+words(scene.displayCopy??'')/SHORT_FORM_RETENTION_POLICY_V1.proofReadingWordsPerSecond);
  return Math.min(originalGap,readingAllowance,SHORT_FORM_RETENTION_POLICY_V1.intentionalEmphasisMaximumSeconds);
};
const semanticBasisFor=(classification:Exclude<ProductionPauseClassification,'EXCESSIVE_RETENTION_PAUSE'>,scene:AnimationManifest['scenes'][number])=>classification==='PROOF_READING'?`Read ${words(scene.displayCopy??'')} visible proof words before advancing`:classification==='INTENTIONAL_EMPHASIS'?`Bounded emphasis for ${scene.artDirection?.semanticArchetype??'semantic beat'}`:classification==='TENSION_HOLD'?`Bounded tension for ${scene.artDirection?.semanticArchetype??'warning beat'}`:classification==='NORMAL_CONTINUATION'?'Natural continuation between spoken ideas':'Bounded idea boundary';

export const retimeAnimationForRetention = (animation:AnimationManifest,voicePlan:VoicePlan):{animation:AnimationManifest;pauses:RetimedPause[]}=>{
  if(animation.scenes.length!==voicePlan.segments.length||animation.voiceHandoff.sceneSlots.length!==voicePlan.segments.length) throw new Error('Generic retention retiming requires one canonical narration unit per semantic scene');
  const output=structuredClone(animation); const pauses:RetimedPause[]=[]; let cursor=0;
  output.scenes.forEach((scene,index)=>{
    const sourceScene=animation.scenes[index]!; const sourceSegment=voicePlan.segments[index]!; const duration=sourceSegment.measuredDurationSeconds??sourceSegment.slotEndSeconds-sourceSegment.slotStartSeconds;
    if(sourceSegment.sceneId!==sourceScene.id||!(duration>0)) throw new Error('Retention retiming Voice/Animation identity mismatch');
    const originalSpeechEnd=sourceSegment.slotStartSeconds+duration; const originalGap=Math.max(0,(index===voicePlan.segments.length-1?animation.totalSeconds:voicePlan.segments[index+1]!.slotStartSeconds)-originalSpeechEnd);
    const finalClassification=finalClassificationFor(sourceScene,originalGap,index===voicePlan.segments.length-1); const pause=round3(targetPauseFor(finalClassification,sourceScene,originalGap,index===voicePlan.segments.length-1));
    const start=round3(cursor); const speechEnd=round3(start+duration); const end=round3(speechEnd+pause); const oldDuration=sourceScene.endSeconds-sourceScene.startSeconds; const newDuration=end-start;
    scene.startSeconds=start; scene.endSeconds=end;
    if(scene.motionPlan){
      // Use the exact local duration produced by the assigned absolute bounds. Decimal
      // subtraction can differ by a few ulps; normalizing every terminal event to this
      // value keeps the existing strict motion gate authoritative without phantom gaps.
      const localDuration=scene.endSeconds-scene.startSeconds; const scale=localDuration/oldDuration;
      scene.motionPlan.events=scene.motionPlan.events.map((event)=>({...event,startSeconds:round3(event.startSeconds*scale),endSeconds:event.endSeconds===oldDuration?localDuration:round3(event.endSeconds*scale)}));
      const transitionStart=Math.max(0,round3(duration-Math.min(scene.motionPlan.anticipationSeconds,SHORT_FORM_RETENTION_POLICY_V1.visualAnticipationMaximumSeconds)));
      scene.motionPlan.events=scene.motionPlan.events.map((event)=>['TRANSITION','EXIT'].includes(event.phase)?{...event,startSeconds:Math.min(event.startSeconds,transitionStart)}:event);
    }
    if(scene.retentionExecution){
      const localDuration=scene.endSeconds-scene.startSeconds;const scale=localDuration/oldDuration;
      scene.retentionExecution.duration_target=localDuration;
      scene.retentionExecution.beats=scene.retentionExecution.beats.map((beat,index)=>({...beat,start:round3(beat.start*scale),end:index===scene.retentionExecution!.beats.length-1?localDuration:round3(beat.end*scale)}));
      scene.retentionExecution.pause_budget.justified_pauses=scene.retentionExecution.pause_budget.justified_pauses.map((pause)=>({...pause,start:round3(pause.start*scale),end:round3(pause.end*scale)}));
    }
    const slot=output.voiceHandoff.sceneSlots[index]!; slot.startSeconds=start; slot.endSeconds=end; slot.pauseWindows=[];
    if(pause>SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds&&finalClassification==='INTENTIONAL_EMPHASIS') slot.pauseWindows.push({startSeconds:speechEnd,endSeconds:end,sourceMarker:'[hold]',classification:'intentional-emphasis',semanticBasis:semanticBasisFor(finalClassification,sourceScene)});
    if(pause>SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds&&finalClassification==='PROOF_READING') slot.pauseWindows.push({startSeconds:speechEnd,endSeconds:end,sourceMarker:'[hold]',classification:'proof-reading',semanticBasis:semanticBasisFor(finalClassification,sourceScene),readingWordCount:words(sourceScene.displayCopy??'')});
    pauses.push({afterNarrationId:sourceSegment.id,originalStartSeconds:round3(originalSpeechEnd),originalEndSeconds:round3(originalSpeechEnd+originalGap),originalDurationSeconds:round3(originalGap),originalClassification:originalGap>(index===voicePlan.segments.length-1?SHORT_FORM_RETENTION_POLICY_V1.trailingTrimToleranceSeconds:SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds)?'EXCESSIVE_RETENTION_PAUSE':finalClassification,finalStartSeconds:speechEnd,finalEndSeconds:end,finalDurationSeconds:pause,finalClassification,semanticBasis:semanticBasisFor(finalClassification,sourceScene)});
    cursor=end;
  });
  output.totalSeconds=round3(cursor); output.voiceHandoff.totalDurationSeconds=output.totalSeconds; output.technicalQa='BLOCKED'; output.animationReview='pending'; output.humanDecision='pending'; output.unresolvedBlockers=['retention-retimed technical QA pending']; output.voiceHandoffStatus='BLOCKED';
  return {animation:output,pauses};
};

export const measureRuntimeRetention=(voicePlan:VoicePlan,animation:AnimationManifest):RetentionMeasurements=>{
  const timeline=retentionTimelineFromRuntime(voicePlan,animation); const evaluation=evaluateRetentionTimeline(timeline); const units=[...timeline.narrationUnits].sort((a,b)=>a.startSeconds-b.startSeconds);
  const gaps=[units[0]!.startSeconds,...units.slice(1).map((unit,index)=>unit.startSeconds-units[index]!.endSeconds),timeline.durationSeconds-units.at(-1)!.endSeconds].map(round3);
  const speech=round3(units.reduce((sum,unit)=>sum+unit.endSeconds-unit.startSeconds,0));
  const classifications=gaps.map((gap,index)=>index===gaps.length-1?'IDEA_BOUNDARY':gap<=SHORT_FORM_RETENTION_POLICY_V1.naturalTransitionMaximumSeconds?'NORMAL_CONTINUATION':'EXCESSIVE_RETENTION_PAUSE') as ProductionPauseClassification[];
  return {totalDurationSeconds:timeline.durationSeconds,totalSpeechDurationSeconds:speech,totalMeasuredPauseDurationSeconds:round3(timeline.durationSeconds-speech),longestSpeechGapSeconds:Math.max(...gaps),gapsOver075:gaps.filter((gap)=>gap>.75).length,gapsOver100:gaps.filter((gap)=>gap>1).length,gapsOver150:gaps.filter((gap)=>gap>1.5).length,excessiveRetentionPauses:evaluation.findings.filter((finding)=>finding.code==='RETENTION_PAUSE_EXCESSIVE').length,semanticPauseClassifications:classifications,retentionPolicyResult:evaluation.status,recommendedMaximumDurationSeconds:evaluation.recommendedMaximumDurationSeconds};
};
