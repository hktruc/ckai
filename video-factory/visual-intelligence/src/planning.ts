import type {AnimationManifest} from '../../animation/src/model';
import type {PerceptualDimension,RetentionBeatPurpose,RetentionExecutionContract,SemanticMechanismFamily,SemanticMechanismPlan} from '../../animation/src/retention-execution';
import type {KeyVisualBriefV1, RetentionDirectorPlan, RetentionRole, SceneSemanticPlan, VisualSourceDecision} from './model';

const clean = (value: string) => value.replace(/\s+/gu, ' ').trim();
const firstSentence = (value: string) => clean(value).split(/(?<=[.!?…])\s+/u)[0] || clean(value);

const roleFor = (index: number, total: number, purpose: string): RetentionRole => {
  if (index === 0) return 'HOOK';
  if (index === total - 1) return 'PAYOFF';
  const text = purpose.toLocaleLowerCase('vi');
  if (/proof|evidence|kiểm chứng|kết quả|test/.test(text)) return 'PROOF';
  if (/reveal|mấu chốt|nhận ra|chưa biết/.test(text)) return 'REVEAL';
  if (/contrast|so sánh|đối lập|phân biệt/.test(text)) return 'CONTRAST';
  if (/pause|breath|ngẫm/.test(text)) return 'BREATH';
  return index < Math.ceil(total / 2) ? 'CURIOSITY' : 'ESCALATION';
};

export const planSceneSemantics = (manifest: AnimationManifest): SceneSemanticPlan[] => manifest.scenes.map((scene, index) => {
  const direction = scene.artDirection;
  const spoken = manifest.voiceHandoff.sceneSlots.find((slot) => slot.sceneId === scene.id)?.spokenCopy || scene.purpose;
  const semanticCore = clean(direction?.primaryVisualConcept || scene.purpose);
  const visual = direction?.primaryVisualObject && direction.primaryVisualObject !== 'NONE'
    ? `${direction.primaryVisualObject}: ${direction.centralTension}`
    : `${scene.displayCopy || direction?.primaryFocus || firstSentence(spoken)} presented as the dominant semantic relationship`;
  return {
    scene_id: scene.id,
    spoken_meaning: firstSentence(spoken),
    semantic_core: semanticCore,
    viewer_should_see: clean(visual),
    retention_role: roleFor(index, manifest.scenes.length, `${scene.purpose} ${direction?.semanticArchetype || ''}`),
    must_show: [scene.displayCopy, direction?.proof.truthLabel, ...(direction?.supportingElements || [])].filter((item): item is string => Boolean(item?.trim())),
    must_not_show: ['fabricated evidence', 'decorative geometry without semantic purpose', ...(direction?.forbiddenFallbackAnatomy.split(';').map((item) => item.trim()).filter(Boolean) || [])],
  };
});

export const planRetention = (scenes: SceneSemanticPlan[]): RetentionDirectorPlan => {
  if (!scenes.length) throw new Error('Retention Director requires at least one semantic scene');
  const final = scenes.at(-1)!;
  const risks = scenes.filter((scene) => !scene.viewer_should_see.trim() || scene.viewer_should_see === scene.spoken_meaning).map((scene) => ({scene_id: scene.scene_id, reason: 'Visual does not add an inspectable semantic state beyond narration.'}));
  return {
    hook: {scene_id: scenes[0]!.scene_id, tension: scenes[0]!.semantic_core, promise: `Resolve: ${final.semantic_core}`},
    open_loops: [{id: 'LOOP-01', opened_scene: scenes[0]!.scene_id, question: scenes[0]!.semantic_core, closed_scene: final.scene_id}],
    semantic_beats: scenes.map((scene, index) => ({scene_id: scene.scene_id, beat: scene.semantic_core, reason_to_continue: index === scenes.length - 1 ? 'The open loop closes with a usable reframe.' : `A new ${scene.retention_role.toLowerCase()} state advances the unresolved question.`})),
    pattern_interrupts: scenes.slice(1).filter((_, index) => index % 2 === 0).map((scene) => ({scene_id: scene.scene_id, kind: scene.retention_role === 'PROOF' ? 'new-evidence' : 'visual-mode-switch', purpose: `Move attention through ${scene.semantic_core}.`})),
    intensity_curve: scenes.map((scene, index) => ({scene_id: scene.scene_id, intensity: (scene.retention_role === 'HOOK' || scene.retention_role === 'REVEAL' || scene.retention_role === 'PAYOFF') ? 'HIGH' : scene.retention_role === 'BREATH' ? 'BREATHE' : index % 3 === 2 ? 'BREAK' : 'MEDIUM', rationale: scene.retention_role})),
    payoff: {scene_id: final.scene_id, closure: final.semantic_core},
    dead_zone_risks: risks,
  };
};

const requiresEvidence = (scene: AnimationManifest['scenes'][number]) => {
  const proof = scene.artDirection?.proof.classification;
  return proof === 'actual-proof' || proof === 'visual-representation' || Boolean(scene.requiredProofIds.length);
};

export const routeVisualSources = (manifest: AnimationManifest, semantics: SceneSemanticPlan[]): VisualSourceDecision[] => manifest.scenes.map((scene, index) => {
  const evidence = requiresEvidence(scene);
  const legacyChoice = scene.hybridSource?.choice;
  const native = scene.artDirection?.objective && ['comparison', 'process', 'proof', 'conclusion', 'key-insight'].includes(scene.artDirection.objective);
  const source = evidence || legacyChoice === 'REAL_EVIDENCE' ? 'REAL_EVIDENCE' : legacyChoice === 'CURATED_OR_GENERATED_KEY_VISUAL' || legacyChoice === 'GENERATED_KEY_VISUAL' ? 'GENERATED_KEY_VISUAL' : native ? 'CODE_NATIVE' : 'CODE_NATIVE';
  return {scene_id: scene.id, visual_source: source, source_reason: source === 'REAL_EVIDENCE' ? 'The scene carries factual/proof authority and must preserve canonical evidence.' : source === 'GENERATED_KEY_VISUAL' ? 'The approved semantic concept benefits from one rich focal image and has no evidence burden.' : 'The meaning is best expressed as exact logic, relationship, transformation or typography.', evidence_required: evidence, generation_allowed: source === 'GENERATED_KEY_VISUAL' && !evidence};
});

export const createKeyVisualBrief = (semantic: SceneSemanticPlan, scene: AnimationManifest['scenes'][number]): KeyVisualBriefV1 => {
  const legacy = scene.hybridSource?.keyVisualBrief;
  return {
    scene_id: scene.id,
    semantic_core: semantic.semantic_core,
    viewer_should_see: semantic.viewer_should_see,
    primary_visual_idea: legacy?.keyVisualIdea || scene.artDirection?.primaryVisualConcept || semantic.semantic_core,
    must_show: semantic.must_show,
    must_not_show: semantic.must_not_show,
    composition: {focal_subject: legacy?.subject || scene.artDirection?.primaryVisualObject || semantic.semantic_core, subject_position: 'central portrait-safe field', foreground: legacy?.subject || 'semantic focal subject', background: legacy?.environment || 'restrained dark editorial depth', negative_space: legacy?.negativeSpace || scene.artDirection?.negativeSpaceRole || 'active typography space'},
    visual_magnetism: {tension: legacy?.visualTension || scene.artDirection?.centralTension || semantic.semantic_core, contrast: 'one dominant semantic contrast, no decorative competition', reveal_potential: legacy?.animationOpportunities.join('; ') || 'focus-to-reveal progression', depth: legacy?.depthMateriality || scene.artDirection?.depthStrategy || 'controlled editorial depth', focal_strength: 'single unmistakable focal subject'},
    motion_headroom: {push_in: true, pan: false, parallax: true, mask_reveal: true, typography_space: legacy?.typographyRelationship || 'reserve safe negative space; no critical text in generated pixels'},
    style: {dna: 'CKAI_DARK_PREMIUM_EDITORIAL_V1', mood: legacy?.emotionalObjective || scene.artDirection?.emotionalTone || 'calm intellectual tension', realism: 'editorial conceptual realism; never documentary evidence', texture: legacy?.depthMateriality || 'matte graphite with restrained tactile detail'},
    output_fit: {target: '9:16', crop_tolerance: legacy?.cropSafeRegions || 'central subject remains intact across portrait crop', safe_zone: 'critical subject inside central 70% width and 68% height'},
  };
};

export const validateSourceDecision = (decision: VisualSourceDecision) => {
  const errors: string[] = [];
  if (decision.evidence_required && decision.visual_source !== 'REAL_EVIDENCE') errors.push('EVIDENCE_REQUIRED_BLOCKING');
  if (decision.evidence_required && decision.generation_allowed) errors.push('GENERATED_VISUAL_CANNOT_SATISFY_EVIDENCE');
  if (decision.visual_source === 'GENERATED_KEY_VISUAL' && !decision.generation_allowed) errors.push('GENERATION_MUST_BE_OPT_IN');
  return errors;
};

const mechanismFamily=(scene:AnimationManifest['scenes'][number],semantic:SceneSemanticPlan):SemanticMechanismFamily=>{
  const value=`${scene.artDirection?.semanticArchetype??''} ${scene.artDirection?.semanticObject??''} ${scene.artDirection?.objective??''} ${semantic.semantic_core}`.toLocaleLowerCase('vi');
  if(/proof|evidence|document|bằng chứng|kiểm chứng/u.test(value))return 'evidence_accumulation';
  if(/uncertain|confidence|biết|đoán|chưa biết/u.test(value))return 'confidence_uncertainty';
  if(/filter|noise|signal|phân loại/u.test(value))return 'filtering';
  if(/causal|nhân quả|nguyên nhân|balance/u.test(value))return 'missing_causal_link';
  if(/contrast|comparison|so sánh|đối lập/u.test(value))return 'comparison';
  if(/conclusion|payoff|aperture|kết/u.test(value))return 'convergence';
  if(/hierarchy|thesis|layers|bốn|trật tự/u.test(value))return 'hierarchy';
  if(/branch|hypothesis|giả thuyết/u.test(value))return 'hypothesis_branching';
  return 'state_transition';
};

const entityTokens=(scene:AnimationManifest['scenes'][number],semantic:SceneSemanticPlan)=>{
  const lines=(scene.displayCopy??'').split(/\n+|→|≠|=/u).map(clean).filter(Boolean);
  const support=scene.artDirection?.supportingElements.map(clean).filter(Boolean)??[];
  const values=[...lines,...support,semantic.semantic_core].filter((value,index,all)=>all.indexOf(value)===index);
  return values.slice(0,4);
};

export const planSemanticMechanisms=(manifest:AnimationManifest,semantics:SceneSemanticPlan[],routes:VisualSourceDecision[]):SemanticMechanismPlan[]=>manifest.scenes.flatMap((scene)=>{
  const route=routes.find((item)=>item.scene_id===scene.id);if(route?.visual_source!=='CODE_NATIVE')return [];
  const semantic=semantics.find((item)=>item.scene_id===scene.id)!;const family=mechanismFamily(scene,semantic);const rawEntities=entityTokens(scene,semantic);const entities=family==='hierarchy'||family==='filtering'?['dòng trả lời chưa phân loại','lớp dữ kiện quan sát được','lớp suy luận cần tách','khoảng chưa biết cần kiểm chứng']:rawEntities;
  const typographyFirst=scene.artDirection?.semanticArchetype==='conclusion-distillation'||(scene.artDirection?.visualMode==='typographic-editorial'&&family==='state_transition');
  return [{version:1,scene_id:scene.id,family,viewer_question:`What relationship must change for the viewer to understand: ${semantic.semantic_core}?`,entities:entities.length>=2?entities:[semantic.semantic_core,scene.artDirection?.centralTension||'unresolved state'],relationships:[scene.artDirection?.centralTension||semantic.viewer_should_see],initial_state:`The viewer first sees ${entities[0]||semantic.semantic_core} as an unresolved state.`,transformation:`${family} changes the relationship by revealing ${scene.artDirection?.centralTension||semantic.semantic_core}.`,final_state:`The relationship resolves into ${semantic.viewer_should_see}.`,insight_revealed:semantic.semantic_core,typography_first:typographyFirst,typography_exception_basis:typographyFirst?`${semantic.retention_role} is an intentional distilled editorial statement; typography must transform rather than remain static.`:null}];
});

const beatCountFor=(duration:number)=>duration<3?2:duration<=6?3:duration<=10?4:5;
const beatPurposes=(role:RetentionRole,count:number):RetentionBeatPurpose[]=>{
  if(role==='HOOK')return ['HOOK','QUESTION','REVEAL','BRIDGE'].slice(0,count) as RetentionBeatPurpose[];
  if(role==='PROOF')return ['ESTABLISH','FOCUS','PROOF','REVEAL','BRIDGE'].slice(0,count) as RetentionBeatPurpose[];
  if(role==='CONTRAST')return ['ESTABLISH','QUESTION','CONTRAST','TRANSFORM','BRIDGE'].slice(0,count) as RetentionBeatPurpose[];
  if(role==='PAYOFF')return ['ESTABLISH','TRANSFORM','PAYOFF','BREATHE'].slice(0,count) as RetentionBeatPurpose[];
  return ['ESTABLISH','FOCUS','REVEAL','TRANSFORM','BRIDGE'].slice(0,count) as RetentionBeatPurpose[];
};

export const planRetentionExecution=(manifest:AnimationManifest,semantics:SceneSemanticPlan[],mechanisms:SemanticMechanismPlan[]):RetentionExecutionContract[]=>manifest.scenes.map((scene)=>{
  const semantic=semantics.find((item)=>item.scene_id===scene.id)!;const mechanism=mechanisms.find((item)=>item.scene_id===scene.id);const duration=Number((scene.endSeconds-scene.startSeconds).toFixed(3));const count=beatCountFor(duration);const purposes=beatPurposes(semantic.retention_role,count);const boundaries=Array.from({length:count+1},(_,index)=>Number((duration*index/count).toFixed(3)));boundaries[boundaries.length-1]=duration;
  const beats=purposes.map((purpose,index)=>{const dimensions:PerceptualDimension[]=purpose==='PROOF'?['PROOF','FOCAL_ATTENTION']:purpose==='CONTRAST'?['CONTRADICTION','SEMANTIC_MEANING']:purpose==='QUESTION'||purpose==='HOOK'?['EXPECTATION','FOCAL_ATTENTION']:purpose==='PAYOFF'?['PAYOFF','SEMANTIC_MEANING']:purpose==='REVEAL'||purpose==='TRANSFORM'?['SEMANTIC_MEANING','VISUAL_STATE']:['FOCAL_ATTENTION','VISUAL_STATE'];return {beat_id:`${scene.id}-B${String(index+1).padStart(2,'0')}`,start:boundaries[index]!,end:boundaries[index+1]!,purpose,semantic_event:index===0?`Establish ${semantic.viewer_should_see}`:index===count-1?`Advance into ${semantic.retention_role} closure`:`${mechanism?.transformation||semantic.semantic_core} — state ${index+1}`,visual_state:index===0?mechanism?.initial_state||`Initial ${semantic.retention_role.toLowerCase()} focal state`:index===count-1?mechanism?.final_state||`Resolved ${semantic.retention_role.toLowerCase()} state`:`${mechanism?.family||'visual'} progression state ${index+1}`,visual_state_change:index===0?'Focal subject enters with the unresolved relationship visible':index===count-1?'The scene exposes its consequence and exits immediately after the completed beat':mechanism?.transformation||'A new focal relationship replaces the prior reading',motion_purpose:(purpose==='REVEAL'?'REVEAL':purpose==='CONTRAST'?'BREAK':purpose==='TRANSFORM'?'TRANSFORM':purpose==='PAYOFF'?'FOCUS':purpose==='BREATHE'?'BREATHE':purpose==='BRIDGE'?'CONNECT':index===0?'FOCUS':'ESCALATE') as RetentionExecutionContract['beats'][number]['motion_purpose'],required_progression:(purpose==='PROOF'?'PROOF':purpose==='CONTRAST'?'CONTRAST':purpose==='QUESTION'?'UNCERTAINTY':purpose==='PAYOFF'?'PAYOFF':purpose==='HOOK'?'OPEN_LOOP':purpose==='REVEAL'?'MEANING':'FOCAL_RELATIONSHIP') as RetentionExecutionContract['beats'][number]['required_progression'],perceptual_target:{minimum_change_level:(purpose==='CONTRAST'||purpose==='PROOF'||purpose==='TRANSFORM'||purpose==='PAYOFF'?3:2) as 2|3,dimensions,dominant_state_key:`${scene.id}:${purpose}:${index+1}`}};});
  return {version:1,scene_id:scene.id,duration_target:duration,beats,pause_budget:{max_unmotivated_pause:.6,justified_pauses:[]},exit_condition:'Exit as soon as narration and the final required semantic progression complete; never preserve an empty legacy scene tail.'};
});
