import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import type {AnimationManifest} from '../../animation/src/model';
import type {VoicePlan} from '../../voice/src/model';
import {evaluateRetentionTimeline, evaluateRuntimeRetention, recommendShortFormDuration, SHORT_FORM_RETENTION_POLICY_V1} from '../src/retention';
import {createGenericReviewDraft} from '../src/manifest/generic';
import {retimeAnimationForRetention} from '../src/retention';
import {bindSfxToSemanticEvents} from '../src/semantic-audio';
import type {FinishingAudioAsset} from '../src/model';

test('CKAI-0004 production learning case detects viewer-perceived retention pauses',()=>{
  const animation=JSON.parse(readFileSync('generated/production/CKAI-0004/v3/animation-manifest.generated.json','utf8')) as AnimationManifest;
  const voice=JSON.parse(readFileSync('generated/voice/CKAI-0004/v3/voice-plan.generated.json','utf8')) as VoicePlan;
  const result=evaluateRuntimeRetention(voice,animation);
  assert.equal(result.policyId,SHORT_FORM_RETENTION_POLICY_V1.id);
  assert.equal(result.status,'BLOCKED');
  assert.ok(result.findings.some((finding)=>finding.code==='RETENTION_PAUSE_EXCESSIVE'&&finding.durationSeconds>=3));
});

test('generic short-form timing with different scene lengths passes',()=>{
  const result=evaluateRetentionTimeline({durationSeconds:7.9,narrationUnits:[{id:'A',startSeconds:.2,endSeconds:2.6},{id:'B',startSeconds:3.1,endSeconds:5.4},{id:'C',startSeconds:5.95,endSeconds:7.5}],declaredPauses:[]});
  assert.equal(result.status,'PASS',JSON.stringify(result.findings));
});

test('legitimate bounded intentional emphasis passes with a semantic basis',()=>{
  const result=evaluateRetentionTimeline({durationSeconds:6.8,narrationUnits:[{id:'A',startSeconds:.1,endSeconds:2.2},{id:'B',startSeconds:3.35,endSeconds:6.4}],declaredPauses:[{startSeconds:2.2,endSeconds:3.35,classification:'intentional-emphasis',basis:'Let the central contrast land before the consequence'}]});
  assert.equal(result.status,'PASS',JSON.stringify(result.findings));
});

test('unclassified excessive pause fails even if motion or music could continue',()=>{
  const result=evaluateRetentionTimeline({durationSeconds:7,narrationUnits:[{id:'A',startSeconds:.1,endSeconds:2},{id:'B',startSeconds:4,endSeconds:6.6}],declaredPauses:[{startSeconds:2,endSeconds:4,classification:'motion-only',basis:'camera continues moving'}]});
  assert.equal(result.status,'BLOCKED');
  assert.ok(result.findings.some((finding)=>finding.code==='RETENTION_PAUSE_UNJUSTIFIED'));
  assert.ok(result.findings.some((finding)=>finding.code==='RETENTION_PAUSE_EXCESSIVE'));
});

test('duration recommendation is driven by semantic needs instead of one template length',()=>{
  const concise=recommendShortFormDuration([{spokenUnitCount:48},{spokenUnitCount:22}]);
  const proofHeavy=recommendShortFormDuration([{spokenUnitCount:48,proofReadingWordCount:60},{spokenUnitCount:22,semanticEmphasisSeconds:1.1}]);
  const dense=recommendShortFormDuration([{spokenUnitCount:70},{spokenUnitCount:55},{spokenUnitCount:40,proofReadingWordCount:30}]);
  assert.ok(concise<proofHeavy&&proofHeavy<dense);
  assert.ok(dense<SHORT_FORM_RETENTION_POLICY_V1.platformMaximumSeconds);
});

test('arbitrary Content ID inherits a policy-bound retention record from the generic Review factory',()=>{
  const animation={totalSeconds:5.8,scenes:[{id:'SC-01'},{id:'SC-02'}],voiceHandoff:{sceneSlots:[{pauseWindows:[]},{pauseWindows:[]}]}} as unknown as AnimationManifest;
  const voicePlan={contentId:'CKAI-8123',finalReviewInputStatus:'READY',assembledAudioPath:'generated/voice/CKAI-8123/master.wav',previewPath:'generated/previews/CKAI-8123-voice.mp4',segments:[{id:'VO-01',sceneId:'SC-01',slotStartSeconds:.1,slotEndSeconds:2.5,measuredDurationSeconds:2.1,originalText:'Một ý ngắn.'},{id:'VO-02',sceneId:'SC-02',slotStartSeconds:2.7,slotEndSeconds:5.6,measuredDurationSeconds:2.7,originalText:'Một ý khác.'}]} as unknown as VoicePlan;
  const review=createGenericReviewDraft({contentId:'CKAI-8123',animation,voicePlan,sourceChain:[],sourceVoiceSnapshot:'snapshot.json',sourceVoiceSnapshotSha256:'A'.repeat(64),sourceVoiceAudioSha256:'B'.repeat(64),sourceVoicePreviewSha256:'C'.repeat(64)});
  assert.equal(review.retentionQa?.policyId,SHORT_FORM_RETENTION_POLICY_V1.id);
  assert.equal(review.retentionQa?.status,'PASS');
});

test('generic retiming and semantic SFX binding follow changed events without fixed timestamps',()=>{
  const animation={totalSeconds:9,scenes:[{id:'SC-01',startSeconds:0,endSeconds:4.5,displayCopy:'A',artDirection:{semanticArchetype:'thesis-declaration',pacingIntent:'hold',proof:{classification:'none'}},motionPlan:{anticipationSeconds:.2,transitionOut:'FOCUS',intentionalPauses:[],events:[{phase:'ENTER',startSeconds:0,endSeconds:.5,channels:['visual']},{phase:'EMPHASIZE',startSeconds:2,endSeconds:4,channels:['emphasis']},{phase:'TRANSITION',startSeconds:4,endSeconds:4.5,channels:['transition']},{phase:'EXIT',startSeconds:4,endSeconds:4.5,channels:['visual']}]}},{id:'SC-02',startSeconds:4.5,endSeconds:9,displayCopy:'B',artDirection:{semanticArchetype:'conclusion-distillation',pacingIntent:'resolve',proof:{classification:'none'}},motionPlan:{anticipationSeconds:.2,transitionOut:'FOCUS',intentionalPauses:[],events:[{phase:'ENTER',startSeconds:0,endSeconds:.5,channels:['visual']},{phase:'EMPHASIZE',startSeconds:2,endSeconds:4,channels:['emphasis']},{phase:'TRANSITION',startSeconds:4,endSeconds:4.5,channels:['transition']},{phase:'EXIT',startSeconds:4,endSeconds:4.5,channels:['visual']}]}}],voiceHandoff:{totalDurationSeconds:9,sceneSlots:[{sceneId:'SC-01',startSeconds:0,endSeconds:4.5,pauseWindows:[]},{sceneId:'SC-02',startSeconds:4.5,endSeconds:9,pauseWindows:[]}]}} as unknown as AnimationManifest;
  const voice={segments:[{id:'VO-01',sceneId:'SC-01',slotStartSeconds:0,slotEndSeconds:4.5,measuredDurationSeconds:2.5},{id:'VO-02',sceneId:'SC-02',slotStartSeconds:4.5,slotEndSeconds:9,measuredDurationSeconds:3}]} as VoicePlan;
  const retimed=retimeAnimationForRetention(animation,voice).animation;
  const assets=[{id:'generic-thesis',type:'sfx',cueType:'thesis-emphasis',durationSeconds:.4,startSeconds:99},{id:'generic-payoff',type:'sfx',cueType:'closing-payoff',durationSeconds:.4,startSeconds:99}] as FinishingAudioAsset[];
  const first=bindSfxToSemanticEvents(assets,retimed);
  assert.equal(first.bindings.length,2);
  assert.ok(first.bindings.every((binding)=>binding.semanticEventSeconds!==99));
  assert.equal(first.bindings[0]!.sceneId,'SC-01'); assert.equal(first.bindings[1]!.sceneId,'SC-02');
  const shifted=structuredClone(retimed); shifted.scenes[1]!.startSeconds+=1; shifted.scenes[1]!.endSeconds+=1; shifted.totalSeconds+=1;
  const second=bindSfxToSemanticEvents(assets,shifted);
  assert.equal(Number((second.bindings[1]!.semanticEventSeconds-first.bindings[1]!.semanticEventSeconds).toFixed(3)),1);
});
