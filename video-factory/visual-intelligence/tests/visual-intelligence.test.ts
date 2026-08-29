import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import type {AnimationManifest} from '../../animation/src/model';
import type {SceneArtDirection} from '../../animation/src/visual-system/grammar';
import {evaluateHybridSource} from '../../animation/src/visual-system/hybrid-source';
import {GenerationBudget, visualIntelligenceConfig} from '../src/config';
import {compileImagePrompt, type OpenAiLike} from '../src/openai-service';
import {prepareVisualIntelligence} from '../src/pipeline';
import {planRetention, planRetentionExecution, planSceneSemantics, planSemanticMechanisms, routeVisualSources, validateSourceDecision} from '../src/planning';
import {validateRetentionExecution,validateSemanticMechanism} from '../../animation/src/retention-execution';
import {enforceVisionHardGates, evaluateActualRenderedVideo, failureRoute, redactSecrets, retryInstruction} from '../src/qa';
import {isPerceptuallyDistinct,normalizePerceptualSceneQa,selectPerceptualSamples,type PerceptualSceneVisionQa} from '../src/perceptual-qa';

const direction = (proof: 'none' | 'actual-proof' = 'none'): SceneArtDirection => ({
  objective: proof === 'none' ? 'tension' : 'proof', pattern: proof === 'none' ? 'asymmetric-tension' : 'evidence-forward', primaryFocus: 'Missing causal evidence', supportingElements: ['claim', 'gap'], hierarchy: 'one focus', emotionalTone: 'controlled tension', continuity: 'one unresolved relationship persists', strongAttractors: 1,
  archetype: proof === 'none' ? 'object-metaphor' : 'proof-artifact', primaryVisualConcept: 'A polished claim remains visibly unable to close across an evidence gap', primaryVisualObject: 'incomplete evidentiary circuit', visualMetaphor: 'unclosed causal circuit', compositionStrategy: 'portrait semantic field', lightingStrategy: 'directional-edge', depthStrategy: 'foreground-background', linePurpose: 'connect',
  semanticArchetype: proof === 'none' ? 'warning-tension' : 'evidence-proof', visualMode: proof === 'none' ? 'object-metaphor-cinematic' : 'proof-evidence-presentation', semanticObject: proof === 'none' ? 'none' : 'document-field', objectRationale: 'The unresolved relationship is the exact semantic subject, not decorative anatomy.', centralTension: 'Fluent certainty versus missing evidence', typographyStrategy: 'short approved phrase', pacingIntent: 'interrupt', proofPolicy: 'never fabricate proof', negativeSpaceRole: 'the missing link', eyePath: 'claim to gap', accentRationale: 'none', sourceStrategy: proof === 'none' ? 'approved-local-asset' : 'canonical-evidence-representation', forbiddenFallbackAnatomy: 'generic shape; generic card',
  proof: {classification: proof, truthLabel: proof === 'none' ? '' : 'ACTUAL SOURCE', provenance: proof === 'none' ? '' : 'fixture', evidenceAssetAvailable: proof !== 'none'},
});

const manifest = (id = 'CKAI-0199'): AnimationManifest => ({
  id: `${id}-Animation`, type: 'short-form-animation', sourceVisualDirection: 'content/visual-directions/source.md', sourceVisualDirectionSha256: 'A'.repeat(64), inputEligibility: 'production', upstreamAnimationHandoffStatus: 'READY', width: 1080, height: 1920, fps: 30, totalSeconds: 9,
  scenes: [
    {id:'SC-01',startSeconds:0,endSeconds:3,purpose:'Hook contradiction',requiredAssetIds:['A1'],requiredProofIds:[],requiredCaveatIds:[],motion:['reveal'],displayCopy:'CÂU TRẢ LỜI TRÔI CHẢY',artDirection:direction(),hybridSource:{choice:'GENERATED_KEY_VISUAL',rationale:'A rich focal relationship creates an immediate unresolved question.',keyVisualBrief:{contentId:id,sceneId:'SC-01',semanticObjective:'interrupt false certainty',emotionalObjective:'controlled unease',keyVisualIdea:'unclosed evidence circuit',metaphor:'incomplete circuit',subject:'claim and missing interval',environment:'dark editorial field',visualTension:'fluency versus evidence',composition:'portrait asymmetric',cameraFraming:'close portrait',lighting:'directional',depthMateriality:'matte graphite',negativeSpace:'active gap',colorTreatment:'graphite amber',typographyRelationship:'negative space for native type',cropSafeRegions:'central safe field',animationOpportunities:['reveal'],truthStatus:'CONCEPTUAL',forbiddenCliches:['AI brain']}}},
    {id:'SC-02',startSeconds:3,endSeconds:6,purpose:'Proof check',requiredAssetIds:['A2'],requiredProofIds:['P1'],requiredCaveatIds:[],motion:['compare'],displayCopy:'BẰNG CHỨNG THẬT',artDirection:direction('actual-proof'),hybridSource:{choice:'REAL_EVIDENCE',rationale:'Proof must use real evidence'}},
    {id:'SC-03',startSeconds:6,endSeconds:9,purpose:'Payoff conclusion',requiredAssetIds:['A3'],requiredProofIds:[],requiredCaveatIds:[],motion:['emphasis'],displayCopy:'ĐỪNG VỘI TIN',artDirection:{...direction(),objective:'conclusion',pattern:'distilled-statement',semanticArchetype:'conclusion-distillation',visualMode:'typographic-editorial',archetype:'conclusion-payoff',primaryVisualObject:'editorial typography',sourceStrategy:'typography-only'},hybridSource:{choice:'CODE_NATIVE',rationale:'Exact concise conclusion is code-native typography'}},
  ],
  assets:{A1:{id:'A1',kind:'text',value:'hook',source:'approved',truthLabel:'approved'},A2:{id:'A2',kind:'text',value:'proof',source:'approved',truthLabel:'actual'},A3:{id:'A3',kind:'text',value:'payoff',source:'approved',truthLabel:'approved'}},proofIds:['P1'],caveatIds:[],technicalQa:'PASS',animationReview:'pass',humanDecision:'approved',unresolvedBlockers:[],voiceHandoffStatus:'READY',voiceHandoff:{sourceScript:'approved.md',implementationRef:'GenericPipeline',technicalPreviewLocation:'preview.mp4',totalDurationSeconds:9,hardMaximumSecondsExclusive:60,sceneSlots:[{sceneId:'SC-01',startSeconds:0,endSeconds:3,spokenCopy:'Một câu trả lời trôi chảy vẫn có thể thiếu mắt xích bằng chứng.',pauseWindows:[]},{sceneId:'SC-02',startSeconds:3,endSeconds:6,spokenCopy:'Hãy nhìn nguồn thật trước khi kết luận.',pauseWindows:[]},{sceneId:'SC-03',startSeconds:6,endSeconds:9,spokenCopy:'Đừng vội tin. Hãy kiểm chứng.',pauseWindows:[]}],pronunciationSensitiveText:[],proofCaveatTiming:[],audioGenerated:false},
});

test('semantic planner creates viewer-visible meaning and whole-video retention roles', () => {
  const scenes = planSceneSemantics(manifest()); const retention = planRetention(scenes);
  assert.equal(scenes[0]?.retention_role, 'HOOK'); assert.equal(scenes.at(-1)?.retention_role, 'PAYOFF');
  assert.notEqual(scenes[0]?.viewer_should_see, scenes[0]?.spoken_meaning);
  assert.equal(retention.open_loops[0]?.closed_scene, 'SC-03'); assert.equal(retention.dead_zone_risks.length, 0);
});

test('retention execution makes scene and viewer-attention state distinct',()=>{
  const source=manifest();const semantics=planSceneSemantics(source);const routes=routeVisualSources(source,semantics);const mechanisms=planSemanticMechanisms(source,semantics,routes);const execution=planRetentionExecution(source,semantics,mechanisms);
  assert.equal(execution[0]?.beats.length,3);assert.ok(execution[0]!.beats.every((beat,index)=>index===0||beat.visual_state!==execution[0]!.beats[index-1]!.visual_state));
  source.scenes.forEach((scene)=>{scene.retentionExecution=execution.find((item)=>item.scene_id===scene.id);scene.semanticMechanism=mechanisms.find((item)=>item.scene_id===scene.id);assert.deepEqual(validateRetentionExecution(scene),[]);assert.deepEqual(validateSemanticMechanism(scene),[]);});
});

const perceptualRaw=(sceneId:string,beatIds:string[],overrides:Partial<PerceptualSceneVisionQa>={}):PerceptualSceneVisionQa=>({scene_id:sceneId,summary:'Actual sampled states visibly progress.',beats:beatIds.map((beat_id)=>({beat_id,visual_delta:8,semantic_delta:7,attention_delta:8,expectation_delta:6,change_level:2,perceptually_distinct:true,dominant_state:beat_id,reading_burden:3,failure_reasons:[]})),hook_strong_event:true,long_scene_reengagement:true,evidence_payload_complete_at_beat:null,post_information_linger:false,mechanism_visually_underpowered:false,microcopy_overload:false,payoff_visual_impact:8,payoff_as_end_card:false,...overrides});

test('executed Level 1 cosmetic beat does not satisfy perceptual progression',()=>{
  assert.equal(isPerceptuallyDistinct({visual_delta:3,semantic_delta:1,attention_delta:2,expectation_delta:1,change_level:1}),false);
  assert.equal(isPerceptuallyDistinct({visual_delta:7,semantic_delta:2,attention_delta:6,expectation_delta:2,change_level:2}),true);
});

test('executed but perceptually indistinct beat reduces perceived beat ratio',()=>{
  const source=manifest();const execution=planRetentionExecution(source,planSceneSemantics(source),[]);source.scenes.forEach((scene)=>scene.retentionExecution=execution.find((item)=>item.scene_id===scene.id));const ids=source.scenes[0]!.retentionExecution!.beats.map((beat)=>beat.beat_id);const raw=perceptualRaw('SC-01',ids);raw.beats[1]={...raw.beats[1]!,change_level:1,visual_delta:2,semantic_delta:1,attention_delta:2,expectation_delta:2,perceptually_distinct:true,failure_reasons:['Only opacity and minor scale changed']};const qa=normalizePerceptualSceneQa(source,raw);assert.equal(qa.perceptually_distinct_beats,2);assert.equal(qa.perceived_beat_ratio,.667);assert.ok(qa.failure_classes.includes('BEAT_EXECUTED_BUT_NOT_PERCEPTUALLY_DISTINCT'));
});

test('perceptual hold, static hook and long-scene re-engagement are hard gates',()=>{
  const source=manifest();source.scenes[0]!.endSeconds=6;source.scenes[1]!.startSeconds=6;source.scenes[1]!.endSeconds=9;source.scenes[2]!.startSeconds=9;source.scenes[2]!.endSeconds=12;source.totalSeconds=12;const execution=planRetentionExecution(source,planSceneSemantics(source),[]);source.scenes.forEach((scene)=>scene.retentionExecution=execution.find((item)=>item.scene_id===scene.id));const ids=source.scenes[0]!.retentionExecution!.beats.map((beat)=>beat.beat_id);const raw=perceptualRaw('SC-01',ids,{hook_strong_event:false,long_scene_reengagement:false});raw.beats=raw.beats.map((beat)=>({...beat,change_level:1 as const,visual_delta:2,semantic_delta:1,attention_delta:2,expectation_delta:2}));const qa=normalizePerceptualSceneQa(source,raw);assert.ok(qa.failure_classes.includes('PERCEPTUAL_HOLD_TOO_LONG'));assert.ok(qa.failure_classes.includes('HOOK_VISUALLY_STATIC'));assert.ok(qa.failure_classes.includes('LONG_SCENE_NO_REENGAGEMENT'));
});

test('evidence linger, underpowered CODE_NATIVE, microcopy and end-card payoff are detected generically',()=>{
  const source=manifest();const semantics=planSceneSemantics(source);const mechanisms=planSemanticMechanisms(source,semantics,routeVisualSources(source,semantics));const execution=planRetentionExecution(source,semantics,mechanisms);source.scenes.forEach((scene)=>{scene.retentionExecution=execution.find((item)=>item.scene_id===scene.id);scene.semanticMechanism=mechanisms.find((item)=>item.scene_id===scene.id);});
  const evidence=normalizePerceptualSceneQa(source,perceptualRaw('SC-02',source.scenes[1]!.retentionExecution!.beats.map((beat)=>beat.beat_id),{post_information_linger:true}));assert.ok(evidence.failure_classes.includes('POST_INFORMATION_LINGER'));
  const payoff=normalizePerceptualSceneQa(source,perceptualRaw('SC-03',source.scenes[2]!.retentionExecution!.beats.map((beat)=>beat.beat_id),{mechanism_visually_underpowered:true,microcopy_overload:true,payoff_visual_impact:4,payoff_as_end_card:true}));assert.ok(payoff.failure_classes.includes('SEMANTIC_MECHANISM_VISUALLY_UNDERPOWERED'));assert.ok(payoff.failure_classes.includes('MICROCOPY_OVERLOAD'));assert.ok(payoff.failure_classes.includes('PAYOFF_AS_END_CARD'));
});

test('Vision sampling is cost-aware and has no CKAI-0004 runtime special case',()=>{
  const source=manifest('CKAI-8821');const semantics=planSceneSemantics(source);const execution=planRetentionExecution(source,semantics,[]);source.scenes.forEach((scene)=>scene.retentionExecution=execution.find((item)=>item.scene_id===scene.id));const samples=selectPerceptualSamples(source);assert.ok(source.scenes.every((scene)=>samples.filter((item)=>item.scene_id===scene.id).length<=4));assert.equal(samples.some((item)=>item.scene_id.includes('0004')),false);
});

test('CODE_NATIVE requires expressive relationships and transformation',()=>{
  const source=manifest();const semantics=planSceneSemantics(source);const routes=routeVisualSources(source,semantics);const mechanisms=planSemanticMechanisms(source,semantics,routes);const scene=source.scenes[2]!;scene.semanticMechanism=mechanisms.find((item)=>item.scene_id===scene.id);assert.equal(validateSemanticMechanism(scene).length,0);
  scene.semanticMechanism=undefined;assert.match(validateSemanticMechanism(scene).join('\n'),/CODE_NATIVE_NOT_EXPRESSIVE_ENOUGH/);
});

test('stale beat timing is a hard execution mismatch',()=>{
  const source=manifest();const semantics=planSceneSemantics(source);const execution=planRetentionExecution(source,semantics,[]);source.scenes[0]!.retentionExecution={...execution[0]!,duration_target:8};assert.match(validateRetentionExecution(source.scenes[0]!).join('\n'),/RETENTION_PLAN_EXECUTION_MISMATCH/);
});

test('source router enforces generated != evidence and evidence_required blocking', () => {
  const source = manifest(); const routes = routeVisualSources(source, planSceneSemantics(source));
  assert.deepEqual(routes.map((item) => item.visual_source), ['GENERATED_KEY_VISUAL', 'REAL_EVIDENCE', 'CODE_NATIVE']);
  assert.deepEqual(validateSourceDecision({...routes[1]!, visual_source:'GENERATED_KEY_VISUAL', generation_allowed:true}), ['EVIDENCE_REQUIRED_BLOCKING','GENERATED_VISUAL_CANNOT_SATISFY_EVIDENCE']);
  const findings = evaluateHybridSource({contentId:'CKAI-0199',sceneId:'SC-02',direction:source.scenes[1]!.artDirection!,proofClass:'actual-proof',workspace:process.cwd(),plan:{choice:'GENERATED_KEY_VISUAL',rationale:'wrong source',asset:{assetId:'X',contentId:'CKAI-0199',sceneId:'SC-02',sourceType:'GENERATED',source:'missing.png',provenance:'fixture',sha256:'A'.repeat(64),rightsStatus:'APPROVED_INTERNAL',truthStatus:'GENERATED_CONCEPT',evidence:false,productionApproval:{status:'APPROVED',by:'canonical-content-approval',at:new Date().toISOString(),basis:'fixture'},cropMetadata:{mobileSafe:true,safeRegion:'center',focalRegion:'center'},safeAnimationMetadata:{allowed:[],prohibited:[],maximumScale:1.1}}}});
  assert.ok(findings.some((finding) => finding.code === 'GENERATED_VISUAL_AS_PROOF' && finding.severity === 'BLOCKER'));
});

test('budget guards hard max, per-asset attempts and total calls', () => {
  const config = {...visualIntelligenceConfig({}), generatedAssetsHardMax:1, maxGenerationAttemptsPerAsset:2, maxGenerationCallsPerVideo:2}; const budget = new GenerationBudget(config);
  budget.beforeCall(1); budget.recordAccepted(null);
  assert.throws(() => budget.beforeCall(1), /hard maximum/);
  const attempts = new GenerationBudget({...config,generatedAssetsHardMax:5}); attempts.beforeCall(1); attempts.beforeCall(2);
  assert.throws(() => attempts.beforeCall(3), /attempts exhausted|call guard/i);
});

test('hard QA gates cannot be averaged away and retries need diagnosis', () => {
  const config = visualIntelligenceConfig({});
  const qa = enforceVisionHardGates({interpretation:'generic beautiful object',semantic_relevance:5,semantic_specificity:9,factual_integrity:'PASS',visual_magnetism:10,motion_potential:10,ckai_dna_fit:10,video_usability:9,verdict:'PASS',failure_reasons:[],revision_instructions:[],failure_class:null,recommended_return_layer:null},config);
  assert.equal(qa.verdict,'REJECT'); assert.equal(qa.failure_class,'SEMANTIC_ASSET_MISMATCH');
  assert.match(retryInstruction({...qa,verdict:'RETRY'}),/Semantic relevance/);
  assert.throws(()=>retryInstruction({...qa,verdict:'RETRY',failure_reasons:['make it better']}),/concrete diagnosed failure/);
  assert.equal(failureRoute('RETENTION_DEAD_ZONE'),'Retention Director');
});

test('raw image prompt reserves critical display copy for native composition', () => {
  const source=manifest(); const semantic=planSceneSemantics(source)[0]!; const route=routeVisualSources(source,[semantic])[0]!;
  assert.equal(route.visual_source,'GENERATED_KEY_VISUAL');
  const brief=source.scenes[0]!.hybridSource!.keyVisualBrief!;
  const prompt=compileImagePrompt({scene_id:'SC-01',semantic_core:semantic.semantic_core,viewer_should_see:semantic.viewer_should_see,primary_visual_idea:brief.keyVisualIdea,must_show:semantic.must_show,must_not_show:semantic.must_not_show,composition:{focal_subject:brief.subject,subject_position:brief.cameraFraming,foreground:brief.subject,background:brief.environment,negative_space:brief.negativeSpace},visual_magnetism:{tension:brief.visualTension,contrast:'semantic contrast',reveal_potential:'reveal',depth:brief.depthMateriality,focal_strength:'single focus'},motion_headroom:{push_in:true,pan:false,parallax:true,mask_reveal:true,typography_space:brief.typographyRelationship},style:{dna:'CKAI_DARK_PREMIUM_EDITORIAL_V1',mood:brief.emotionalObjective,realism:'conceptual',texture:brief.depthMateriality},output_fit:{target:'9:16',crop_tolerance:brief.cropSafeRegions,safe_zone:brief.cropSafeRegions}});
  assert.doesNotMatch(prompt,/CÂU TRẢ LỜI TRÔI CHẢY/u);
  assert.match(prompt,/reserve all exact display copy/i);
});

test('actual rendered-video QA treats measured dead air as a retention failure', () => {
  const plan=planRetention(planSceneSemantics(manifest()));
  const qa=evaluateActualRenderedVideo(plan,{durationSeconds:9,audioCodec:'aac',audioSampleRate:48000,audioChannels:2,meanVolumeDb:-18,maxVolumeDb:-2,silenceSpans:[],freezeSpans:[{startSeconds:1,endSeconds:2,durationSeconds:1}],nonSemanticDeadAirSpans:[{startSeconds:1,endSeconds:2,durationSeconds:1}],longestSilenceSeconds:1,longestFreezeSeconds:1,longestNonSemanticDeadAirSeconds:1,averageNonSemanticGapSeconds:1,pass:false,errors:['Static visual and speech silence overlap without semantic progression']});
  assert.equal(qa.actual_binary,true); assert.equal(qa.verdict,'RETRY'); assert.equal(qa.failure_class,'VIDEO_RETENTION_FAILURE');
});

test('secret redaction removes explicit and key-shaped secrets', () => {
  const secret='sk-example_SUPERSECRET123'; const result=redactSecrets(`token=${secret} second=sk-anotherSecret999`,[secret]);
  assert.equal(result.includes(secret),false); assert.equal(result.includes('sk-anotherSecret999'),false);
});

test('mocked API produces stable provenance, SHA256 and arbitrary Content-ID artifacts', async () => {
  const root=mkdtempSync(join(tmpdir(),'ckai-visual-'));
  try {
    let imageCalls=0; let visionCalls=0;
    const client={images:{generate:async()=>{imageCalls+=1;return {created:1700000000,data:[{b64_json:Buffer.from('actual-image-binary').toString('base64')}],usage:{total_tokens:12}};}},responses:{create:async()=>{visionCalls+=1;return {id:'resp_mock',output_text:JSON.stringify({interpretation:'An incomplete causal claim visibly stops at a missing evidence interval.',semantic_relevance:9,semantic_specificity:8,factual_integrity:'PASS',visual_magnetism:8,motion_potential:8,ckai_dna_fit:8,video_usability:8,verdict:'PASS',failure_reasons:[],revision_instructions:[],failure_class:null,recommended_return_layer:null}),usage:{input_tokens:1,output_tokens:1}};}},models:{list:async()=>({data:[]})}} as unknown as OpenAiLike;
    const source=manifest('CKAI-7712'); const result=await prepareVisualIntelligence({repoRoot:root,manifest:source,config:visualIntelligenceConfig({}),client,allowImageGeneration:true,now:()=>new Date('2026-08-27T00:00:00Z')});
    assert.equal(result.artifact.content_id,'CKAI-7712'); assert.equal(result.artifact.generated_assets.length,1); assert.equal(result.artifact.generated_assets[0]?.evidence,false);
    assert.match(result.artifact.generated_assets[0]!.sha256,/^[A-F0-9]{64}$/); assert.equal(result.artifact.generated_assets[0]?.estimated_cost_usd,null);
    const metadata=JSON.parse(readFileSync(join(root,'generated/visual-assets/CKAI-7712/SC-01/kv_001.json'),'utf8'));
    assert.equal(metadata.sha256,result.artifact.generated_assets[0]?.sha256); assert.equal(source.scenes[0]?.hybridSource?.choice,'GENERATED_KEY_VISUAL');
    const second=await prepareVisualIntelligence({repoRoot:root,manifest:manifest('CKAI-7712'),config:visualIntelligenceConfig({}),client,allowImageGeneration:true,now:()=>new Date('2026-08-27T00:01:00Z')});
    assert.equal(second.artifact.generated_assets[0]?.sha256,result.artifact.generated_assets[0]?.sha256);
    assert.equal(imageCalls,1); assert.equal(visionCalls,1);
  } finally { rmSync(root,{recursive:true,force:true}); }
});
