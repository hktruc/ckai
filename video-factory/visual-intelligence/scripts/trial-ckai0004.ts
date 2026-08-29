import {resolve} from 'node:path';
import {sha256File} from '../../../runtime/production-bridge/src/core.mjs';
import {runGenericRuntime} from '../../../runtime/production-bridge/src/generic-runtime';

const main=async()=>{
  const root=process.cwd(); const source='content/approved/CKAI-0004_tach-du-kien-suy-luan-chua-biet.md'; const fingerprint=sha256File(resolve(root,source));
  const job={jobId:`JOB-CKAI0004-PHASE1-${Date.now()}`,contentId:'CKAI-0004',requestedAction:'produce-to-review-package',source:{artifactPath:source,sha256:fingerprint},approval:{type:'content-approval',decision:'approved',approvedBy:'product-owner',approvedAt:'2026-08-24T08:38:05.3270355Z',basis:'Existing direct Product Owner Content Approval; Phase 1 trial does not modify approved wording.',contentFingerprintSha256:fingerprint},providerPolicy:{allowVbeeQuota:false,allowOpenAIImageGeneration:true,allowOpenAIVision:true,maxOpenAIImageUsd:null,autoPurchaseCredits:false as const,allowPaidFallback:false as const}};
  const result=await runGenericRuntime(job,root,false); console.log(JSON.stringify(result,null,2)); if(result.status==='FAILED')process.exitCode=1;
};
void main();
