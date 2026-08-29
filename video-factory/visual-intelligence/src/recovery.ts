import type {AnimationManifest,Scene} from '../../animation/src/model';
import type {SemanticMechanismFamily} from '../../animation/src/retention-execution';
import type {PerceptualProgressionQa} from './perceptual-qa';
import {compileRepresentationPlans,creativeReplanDistance} from './representation';

export const RECOVERY_MODES=['DETERMINISTIC_FIX','CREATIVE_REPLAN','SOURCE_REPLAN','RUNTIME_FIX','HUMAN_REVIEW'] as const;
export type RecoveryMode=typeof RECOVERY_MODES[number];
export type RecoveryPriority='P0'|'P1'|'P2';
export type RecoveryLayer='Retention Director + Visual Director'|'CODE_NATIVE Semantic Mechanism Planner'|'Key Visual Brief / Asset layer'|'Whole-video Visual Director'|'runtime / renderer'|'Timing Director'|'ChatGPT Creative Director';
export type FailureRecoveryRule={failure_class:string;priority:RecoveryPriority;recovery_mode:RecoveryMode;return_layer:RecoveryLayer;allowed_actions:string[];forbidden_actions:string[];max_rounds:number;escalation:string};

const rule=(failure_class:string,priority:RecoveryPriority,recovery_mode:RecoveryMode,return_layer:RecoveryLayer,allowed_actions:string[],forbidden_actions:string[]=[]):FailureRecoveryRule=>({failure_class,priority,recovery_mode,return_layer,allowed_actions,forbidden_actions,max_rounds:2,escalation:'NEEDS_CHATGPT_CREATIVE_REVIEW'});
export const FAILURE_RECOVERY_REGISTRY:Record<string,FailureRecoveryRule>={
  HOOK_VISUALLY_STATIC:rule('HOOK_VISUALLY_STATIC','P0','CREATIVE_REPLAN','Retention Director + Visual Director',['Level 2/3 event in first 3s','expectation break','earlier reveal','source replan if required'],['same hook plus cosmetic animation']),
  SEMANTIC_MECHANISM_VISUALLY_UNDERPOWERED:rule('SEMANTIC_MECHANISM_VISUALLY_UNDERPOWERED','P1','CREATIVE_REPLAN','CODE_NATIVE Semantic Mechanism Planner',['replace labels with object/process/state transformation','reduce reading burden','dominant focal event','Round 2 source replan'],['same cards plus stronger animation']),
  MICROCOPY_OVERLOAD:rule('MICROCOPY_OVERLOAD','P1','CREATIVE_REPLAN','CODE_NATIVE Semantic Mechanism Planner',['one dominant payload per beat','distribute secondary information','visual encoding'],['reduce font size']),
  PERCEPTUAL_HOLD_TOO_LONG:rule('PERCEPTUAL_HOLD_TOO_LONG','P0','CREATIVE_REPLAN','Retention Director + Visual Director',['earlier semantic event','new state','scene compression','earlier exit'],['cosmetic motion']),
  LONG_SCENE_NO_REENGAGEMENT:rule('LONG_SCENE_NO_REENGAGEMENT','P1','CREATIVE_REPLAN','Retention Director + Visual Director',['meaningful mid-scene re-engagement','compress scene'],['particles','idle zoom']),
  POST_INFORMATION_LINGER:rule('POST_INFORMATION_LINGER','P1','DETERMINISTIC_FIX','Timing Director',['timing compression','earlier scene exit'],['add animation']),
  UNMOTIVATED_SCENE_TAIL:rule('UNMOTIVATED_SCENE_TAIL','P1','DETERMINISTIC_FIX','Timing Director',['earlier scene exit'],['add animation']),
  PAYOFF_AS_END_CARD:rule('PAYOFF_AS_END_CARD','P0','CREATIVE_REPLAN','Retention Director + Visual Director',['callback','convergence','transformation','typography emerges from resolution'],['animate slogan more aggressively']),
  SOURCE_SWITCH_QUALITY_GAP:rule('SOURCE_SWITCH_QUALITY_GAP','P1','CREATIVE_REPLAN','Whole-video Visual Director',['normalize framing, energy, scale, contrast and typography integration']),
  HERO_SCENE_QUALITY_DROP:rule('HERO_SCENE_QUALITY_DROP','P0','CREATIVE_REPLAN','Whole-video Visual Director',['re-sequence visual modes','strengthen hero representation']),
  VISUAL_PATTERN_FATIGUE:rule('VISUAL_PATTERN_FATIGUE','P1','CREATIVE_REPLAN','Whole-video Visual Director',['vary semantic mechanism and source cadence']),
  MID_VIDEO_RETENTION_COLLAPSE:rule('MID_VIDEO_RETENTION_COLLAPSE','P0','CREATIVE_REPLAN','Whole-video Visual Director',['compress scenes','move re-engagement event','replan source sequence']),
  RETENTION_PLAN_EXECUTION_MISMATCH:rule('RETENTION_PLAN_EXECUTION_MISMATCH','P0','RUNTIME_FIX','runtime / renderer',['repair renderer/contract execution'],['change creative plan to hide runtime failure']),
  SEMANTIC_ASSET_MISMATCH:rule('SEMANTIC_ASSET_MISMATCH','P0','SOURCE_REPLAN','Key Visual Brief / Asset layer',['retry execution when brief is valid','replan brief when concept is wrong','replan source when source is wrong']),
  WRONG_VISUAL_SOURCE:rule('WRONG_VISUAL_SOURCE','P0','SOURCE_REPLAN','Key Visual Brief / Asset layer',['reroute at Source Router'],['generated proof']),
  FAKE_OR_PSEUDO_EVIDENCE:rule('FAKE_OR_PSEUDO_EVIDENCE','P0','HUMAN_REVIEW','ChatGPT Creative Director',[],['generated proof','automatic semantic override']),
  BEAT_EXECUTED_BUT_NOT_PERCEPTUALLY_DISTINCT:rule('BEAT_EXECUTED_BUT_NOT_PERCEPTUALLY_DISTINCT','P1','CREATIVE_REPLAN','Retention Director + Visual Director',['replace state rather than restyle state'],['opacity-only','minor-scale-only']),
};
for(const failure of ['PROCESS_EVENT_NOT_VISUALLY_REALIZED','OBJECT_STATE_NOT_PERCEPTIBLE','RELATIONSHIP_NOT_PERCEPTIBLE','LABEL_CARRYING_SEMANTIC_LOAD','PROCESS_COLLAPSED_TO_CARD_LAYOUT','SCENE_ROLE_GRAMMAR_MISMATCH','CROSS_SCENE_MOTIF_BROKEN','EVIDENCE_REGION_NOT_PERCEPTIBLE','EVIDENCE_PAYLOAD_COMPLETE_BUT_SCENE_CONTINUES','HOOK_NO_MEANINGFUL_EVENT','HOOK_TEXT_DEPENDENT','HOOK_PROMISE_UNCLEAR','HOOK_BODY_GRAMMAR_FALLBACK','PAYOFF_NOT_EARNED','PAYOFF_NO_VISUAL_RESOLUTION','PAYOFF_TEXT_ONLY','PAYOFF_CALLBACK_MISSING','PAYOFF_EXCESSIVE_HOLD','REPRESENTATION_GRAMMAR_FATIGUE','REPLAN_ANATOMY_NOT_DISTINCT','CREATIVE_REPLAN_DISTANCE_TOO_LOW'])FAILURE_RECOVERY_REGISTRY[failure]=rule(failure,/HOOK_|PAYOFF_|PROCESS_EVENT|OBJECT_STATE|RELATIONSHIP/.test(failure)?'P0':'P1','CREATIVE_REPLAN',/GRAMMAR_FATIGUE|CROSS_SCENE/.test(failure)?'Whole-video Visual Director':'Retention Director + Visual Director',['select a capability-matched alternate grammar','change object/process model','change viewer-facing anatomy'],['mechanism-name-only change','silent card fallback']);
for(const failure of ['EVIDENCE_PRESENTATION_MISLEADING','EVIDENCE_TOO_DENSE_TO_READ','EVIDENCE_CONTEXT_LOST','ANNOTATION_CONFUSED_WITH_SOURCE','DERIVED_VISUAL_NOT_DISCLOSED','EVIDENCE_PROVENANCE_INCOMPLETE'])FAILURE_RECOVERY_REGISTRY[failure]=rule(failure,'P0',failure==='EVIDENCE_PROVENANCE_INCOMPLETE'||failure==='DERIVED_VISUAL_NOT_DISCLOSED'?'HUMAN_REVIEW':'CREATIVE_REPLAN','Key Visual Brief / Asset layer',['preserve source pixels/context','use disclosed external annotations','focus semantic evidence regions'],['generated proof','redrawn evidence']);
FAILURE_RECOVERY_REGISTRY.REPRESENTATION_CAPABILITY_MISSING=rule('REPRESENTATION_CAPABILITY_MISSING','P0','HUMAN_REVIEW','ChatGPT Creative Director',[],['silent fallback']);

export const recoveryRuleFor=(failureClass:string):FailureRecoveryRule=>FAILURE_RECOVERY_REGISTRY[failureClass]??rule(failureClass,'P0','HUMAN_REVIEW','ChatGPT Creative Director',[],['unregistered automatic mutation']);
export type FailureDiagnosis={scene_id:string|null;failure_class:string;priority:RecoveryPriority;qa_evidence:string[]};
export type ReplanAttempt={round:number;scene_id:string;source:string;concept:string;mechanism:string;visual_states:string[];failures:string[];qa_evidence:string[]};
export type ReplanContext={round:1|2;scene_id:string;previous_attempt:ReplanAttempt;do_not_repeat:string[];required_improvement:string[];allowed_source_escalation:boolean};
export type RecoveryAction={scene_id:string|null;failures:string[];priority:RecoveryPriority;recovery_mode:RecoveryMode;return_layer:RecoveryLayer;variant?:NonNullable<Scene['visualRecovery']>['variant'];deterministic?:{compress_seconds:number};source_before?:string;source_after?:string;mechanism_before?:SemanticMechanismFamily;mechanism_after?:SemanticMechanismFamily;do_not_repeat:string[];required_improvement:string[]};
export type RecoveryPlan={version:1;round:1|2;whole_video:boolean;actions:RecoveryAction[];contexts:ReplanContext[];image_generation_attempts:number};

const uniq=<T>(values:T[])=>[...new Set(values)];
const failureMemory:Record<string,string[]>={HOOK_VISUALLY_STATIC:['static centered typography','same hook plus more animation'],SEMANTIC_MECHANISM_VISUALLY_UNDERPOWERED:['label-heavy hierarchy','four-card grid','same dominant composition'],MICROCOPY_OVERLOAD:['dense multi-line copy','smaller-font workaround'],PERCEPTUAL_HOLD_TOO_LONG:['minor-scale-only progression','cosmetic motion'],PAYOFF_AS_END_CARD:['slogan-only payoff','static centered typography'],BEAT_EXECUTED_BUT_NOT_PERCEPTUALLY_DISTINCT:['opacity-only progression','minor-scale-only progression']};

export const diagnoseVisualFailures=(perceptual:Pick<PerceptualProgressionQa,'scenes'|'failure_classes'>,retentionFailures:string[]=[],continuityFailures:string[]=[]):FailureDiagnosis[]=>{
  const sceneFailures=perceptual.scenes.flatMap(scene=>scene.failure_classes.map(failure_class=>({scene_id:scene.scene_id,failure_class,priority:recoveryRuleFor(failure_class).priority,qa_evidence:scene.beats.flatMap(beat=>beat.failure_reasons).slice(0,6)})));
  const sceneClasses=new Set<string>(sceneFailures.map(item=>item.failure_class));
  const detailedPerceptualFailure=sceneFailures.length>0;
  const global=uniq([...retentionFailures,...continuityFailures]).filter(failure_class=>!sceneClasses.has(failure_class)).filter(failure_class=>failure_class!=='RETENTION_PLAN_EXECUTION_MISMATCH'||!detailedPerceptualFailure).map(failure_class=>({scene_id:null,failure_class,priority:recoveryRuleFor(failure_class).priority,qa_evidence:[`Whole-video QA reported ${failure_class}`]}));
  return [...sceneFailures,...global];
};

const nextMechanism=(current:SemanticMechanismFamily|undefined,round:1|2):SemanticMechanismFamily=>{
  const first:Partial<Record<SemanticMechanismFamily,SemanticMechanismFamily>>={hierarchy:'filtering',missing_causal_link:'hypothesis_branching',confidence_uncertainty:'before_after',convergence:'evidence_accumulation',comparison:'contradiction'};
  const second:Partial<Record<SemanticMechanismFamily,SemanticMechanismFamily>>={filtering:'elimination',hypothesis_branching:'evidence_accumulation',before_after:'state_transition',evidence_accumulation:'convergence',contradiction:'hidden_variable_reveal'};
  return (round===1?first[current!]:second[current!])??(round===1?'state_transition':'convergence');
};

export const createRecoveryPlan=(manifest:AnimationManifest,diagnoses:FailureDiagnosis[],round:1|2,history:ReplanAttempt[]=[]):RecoveryPlan=>{
  const whole=diagnoses.some(item=>['SOURCE_SWITCH_QUALITY_GAP','HERO_SCENE_QUALITY_DROP','VISUAL_PATTERN_FATIGUE','MID_VIDEO_RETENTION_COLLAPSE'].includes(item.failure_class));
  const grouped=new Map<string|null,FailureDiagnosis[]>();for(const item of diagnoses){const key=whole?null:item.scene_id;grouped.set(key,[...(grouped.get(key)??[]),item]);}
  const actions=[...grouped.entries()].flatMap(([sceneId,items])=>{
    const relevant=items.filter(item=>item.priority!=='P2');if(!relevant.length)return [];
    const failures=uniq(relevant.map(item=>item.failure_class));const rules=failures.map(recoveryRuleFor);const mode=rules.some(r=>r.recovery_mode==='RUNTIME_FIX')?'RUNTIME_FIX':rules.some(r=>r.recovery_mode==='HUMAN_REVIEW')?'HUMAN_REVIEW':rules.some(r=>r.recovery_mode==='SOURCE_REPLAN')?'SOURCE_REPLAN':rules.every(r=>r.recovery_mode==='DETERMINISTIC_FIX')?'DETERMINISTIC_FIX':'CREATIVE_REPLAN';
    const scene=sceneId?manifest.scenes.find(item=>item.id===sceneId):undefined;const prior=history.filter(item=>!sceneId||item.scene_id===sceneId);const memory=uniq([...failures.flatMap(f=>failureMemory[f]??[]),...prior.flatMap(item=>item.visual_states)]);
    const variant:RecoveryAction['variant']=whole?'WHOLE_VIDEO_RESET':failures.includes('HOOK_VISUALLY_STATIC')?'HOOK_EXPECTATION_BREAK':failures.includes('PAYOFF_AS_END_CARD')?'PAYOFF_CALLBACK':scene?.hybridSource?.choice==='REAL_EVIDENCE'?'EVIDENCE_REVEAL':'OBJECT_PROCESS';
    const sourceBefore=scene?.hybridSource?.choice??'WHOLE_VIDEO';let sourceAfter=sourceBefore;
    if(round===2&&mode==='SOURCE_REPLAN'&&scene&&scene.hybridSource?.choice==='CODE_NATIVE'&&scene.artDirection?.proof.classification==='none')sourceAfter='GENERATED_KEY_VISUAL';
    const mechanismBefore=scene?.semanticMechanism?.family;const mechanismAfter=scene&&mode==='CREATIVE_REPLAN'?nextMechanism(mechanismBefore,round):mechanismBefore;
    return [{scene_id:sceneId,failures,priority:relevant.some(i=>i.priority==='P0')?'P0':'P1',recovery_mode:mode,return_layer:rules[0]!.return_layer,variant,deterministic:mode==='DETERMINISTIC_FIX'?{compress_seconds:round===1?.6:1}:undefined,source_before:sourceBefore,source_after:sourceAfter,mechanism_before:mechanismBefore,mechanism_after:mechanismAfter,do_not_repeat:memory,required_improvement:uniq(rules.flatMap(r=>r.allowed_actions))} satisfies RecoveryAction];
  });
  const contexts=actions.flatMap(action=>action.scene_id?[{round,scene_id:action.scene_id,previous_attempt:history.filter(item=>item.scene_id===action.scene_id).at(-1)??{round:round-1,scene_id:action.scene_id,source:action.source_before??'unknown',concept:'initial production representation',mechanism:action.mechanism_before??'none',visual_states:action.do_not_repeat,failures:action.failures,qa_evidence:diagnoses.filter(d=>d.scene_id===action.scene_id).flatMap(d=>d.qa_evidence)},do_not_repeat:action.do_not_repeat,required_improvement:action.required_improvement,allowed_source_escalation:round===2&&action.source_before!=='REAL_EVIDENCE'}]:[]);
  return {version:1,round,whole_video:whole,actions,contexts,image_generation_attempts:0};
};

const clone=<T>(value:T):T=>JSON.parse(JSON.stringify(value)) as T;
export const applyRecoveryPlan=(source:AnimationManifest,plan:RecoveryPlan):AnimationManifest=>{
  const manifest=clone(source);
  const rejected_by_scene=Object.fromEntries(source.scenes.flatMap(scene=>scene.representationPlan?[[scene.id,[scene.representationPlan.representation.anatomy]]]:[]));
  for(const action of plan.actions){
    const targets=action.scene_id?manifest.scenes.filter(scene=>scene.id===action.scene_id):manifest.scenes;
    for(const scene of targets){
      if(action.recovery_mode==='RUNTIME_FIX'||action.recovery_mode==='HUMAN_REVIEW')continue;
      if(action.deterministic){const duration=scene.endSeconds-scene.startSeconds;const reduction=Math.min(action.deterministic.compress_seconds,Math.max(0,duration-2));if(reduction>0){const index=manifest.scenes.indexOf(scene);scene.endSeconds-=reduction;for(const later of manifest.scenes.slice(index+1)){later.startSeconds-=reduction;later.endSeconds-=reduction;}manifest.totalSeconds-=reduction;}}
      if(scene.semanticMechanism&&action.mechanism_after)scene.semanticMechanism={...scene.semanticMechanism,family:action.mechanism_after,transformation:`Objects physically change relationship through ${action.mechanism_after}; labels only confirm the visible result.`,initial_state:`Unresolved objects enter as one mixed state.`,final_state:`Objects resolve into a materially different, inspectable state.`,typography_first:false,typography_exception_basis:null};
      scene.visualRecovery={round:plan.round,variant:action.variant??'OBJECT_PROCESS',cause:action.failures,doNotRepeat:action.do_not_repeat};
      if(scene.retentionExecution)scene.retentionExecution={...scene.retentionExecution,beats:scene.retentionExecution.beats.map((beat,index)=>({...beat,semantic_event:`Recovery round ${plan.round}: ${action.required_improvement[index%action.required_improvement.length]??'new semantic state'}`,visual_state:`${action.variant} state ${index+1} round ${plan.round}`,visual_state_change:index===0?'A new unresolved object relationship enters':`Prior composition is replaced by semantic state ${index+1}`,perceptual_target:{...beat.perceptual_target,minimum_change_level:(index===0||index===scene.retentionExecution!.beats.length-1?3:2),dominant_state_key:`${scene.id}:R${plan.round}:${action.variant}:${index+1}`}}))};
    }
  }
  manifest.voiceHandoff.totalDurationSeconds=manifest.totalSeconds;manifest.voiceHandoff.sceneSlots=manifest.scenes.map((scene,index)=>({...manifest.voiceHandoff.sceneSlots[index]!,sceneId:scene.id,startSeconds:scene.startSeconds,endSeconds:scene.endSeconds}));
  compileRepresentationPlans(manifest,process.cwd(),{round:plan.round,rejected_by_scene});
  for(const scene of manifest.scenes){const before=source.scenes.find(item=>item.id===scene.id)?.representationPlan;const after=scene.representationPlan;if(before&&after&&creativeReplanDistance(before,after)==='LOW')after.compile_failures.push(plan.round===1?'REPLAN_ANATOMY_NOT_DISTINCT':'CREATIVE_REPLAN_DISTANCE_TOO_LOW');}
  return manifest;
};

export type RecoveryRoundResult={manifest:AnimationManifest;diagnoses:FailureDiagnosis[];machine_pass:boolean;qa:unknown;attempts:ReplanAttempt[]};
export const executeAutomaticReplanLoop=async(input:{initial:RecoveryRoundResult;max_rounds?:number;runRound:(manifest:AnimationManifest,plan:RecoveryPlan)=>Promise<RecoveryRoundResult>}):Promise<{status:'MACHINE_VISUAL_ACCEPTANCE'|'NEEDS_CHATGPT_CREATIVE_REVIEW';rounds_used:number;rounds:Array<{plan:RecoveryPlan;result:RecoveryRoundResult}>;final:RecoveryRoundResult}>=>{
  const max=Math.max(0,Math.min(2,input.max_rounds??2));let current=input.initial;const rounds:Array<{plan:RecoveryPlan;result:RecoveryRoundResult}>=[];let history=[...current.attempts];
  if(current.machine_pass)return {status:'MACHINE_VISUAL_ACCEPTANCE',rounds_used:0,rounds,final:current};
  for(let round=1;round<=max;round++){const plan=createRecoveryPlan(current.manifest,current.diagnoses,round as 1|2,history);if(!plan.actions.length||plan.actions.some(a=>a.recovery_mode==='HUMAN_REVIEW'||a.recovery_mode==='RUNTIME_FIX'))break;const result=await input.runRound(applyRecoveryPlan(current.manifest,plan),plan);rounds.push({plan,result});current=result;history=[...history,...result.attempts];if(result.machine_pass)return {status:'MACHINE_VISUAL_ACCEPTANCE',rounds_used:round,rounds,final:result};}
  return {status:'NEEDS_CHATGPT_CREATIVE_REVIEW',rounds_used:rounds.length,rounds,final:current};
};

export const createCreativeReviewEscalation=(contentId:string,result:Awaited<ReturnType<typeof executeAutomaticReplanLoop>>)=>({content_id:contentId,status:'NEEDS_CHATGPT_CREATIVE_REVIEW',failed_scenes:result.final.diagnoses.filter(item=>item.scene_id).map(item=>item.scene_id).filter((value,index,all)=>all.indexOf(value)===index).map(scene_id=>({scene_id,source:result.final.manifest.scenes.find(scene=>scene.id===scene_id)?.hybridSource?.choice??'unknown',attempts:result.rounds_used,final_failure:result.final.diagnoses.filter(item=>item.scene_id===scene_id).map(item=>item.failure_class),attempts_summary:result.rounds.map(({plan},index)=>{const action=plan.actions.find(item=>item.scene_id===scene_id)??plan.actions.find(item=>item.scene_id===null);return {round:index+1,concept:action?.variant,mechanism:action?.mechanism_after,failure:action?.failures};}),do_not_repeat:uniq(result.rounds.flatMap(({plan})=>plan.actions.filter(action=>action.scene_id===scene_id||action.scene_id===null).flatMap(action=>action.do_not_repeat))),recommended_review:'Choose a materially different semantic representation while preserving approved meaning and evidence integrity.'}))});
