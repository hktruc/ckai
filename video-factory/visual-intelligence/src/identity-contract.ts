import {createHash} from 'node:crypto';
import type {AnimationManifest} from '../../animation/src/model';

const canonicalize=(value:unknown):unknown=>{
  if(Array.isArray(value))return value.map(canonicalize);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>[key,canonicalize(item)]));
  return value;
};

export const deterministicContractHash=(value:unknown)=>createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex').toUpperCase();

export const identityEmbodimentContract=(manifest:AnimationManifest)=>manifest.scenes.map(scene=>({scene_id:scene.id,decisions:scene.representationPlan?.embodiment?.decisions??{}}));
export const identitySemanticSignatureContract=(manifest:AnimationManifest)=>manifest.scenes.map(scene=>({scene_id:scene.id,signatures:scene.representationPlan?.embodiment?.signatures??{}}));

// Deliberately excludes repair.pass/diagnosis: only values consumed by production rendering
// belong in this contract. Metadata-only changes must therefore remain a detectable no-op.
export const viewerFacingRenderContract=(manifest:AnimationManifest)=>({
  version:1,
  manifest_id:manifest.id,
  width:manifest.width,
  height:manifest.height,
  fps:manifest.fps,
  scenes:manifest.scenes.map(scene=>{
    const plan=scene.representationPlan;
    return {
      scene_id:scene.id,
      start_seconds:scene.startSeconds,
      end_seconds:scene.endSeconds,
      renderer:plan?.representation.renderer??null,
      grammar:plan?.grammar??null,
      material_source:plan?.material_source??null,
      objects:(plan?.objects??[]).map(object=>({id:object.id,type:object.type,label:object.label,state:object.state,visual_encoding:object.visual_encoding,embodiment_decision:object.embodiment_decision??null,semantic_signature:object.semantic_signature??null})),
      relationships:plan?.relationships??[],
      events:plan?.events??[],
      evidence:plan?.evidence??null,
      spatial_motion:plan?.spatial_motion??null,
    };
  }),
});

export type IdentityBoundaryHashes={
  embodiment_contract_hash:string;
  semantic_signature_hash:string;
  scene_render_contract_hash:string;
  compiled_remotion_props_hash:string;
  render_cache_key:string;
  video_sha256?:string;
};

export const createIdentityBoundaryHashes=(manifest:AnimationManifest,compiledProps:unknown,videoSha256?:string):IdentityBoundaryHashes=>{
  const renderHash=deterministicContractHash(viewerFacingRenderContract(manifest));
  return {
    embodiment_contract_hash:deterministicContractHash(identityEmbodimentContract(manifest)),
    semantic_signature_hash:deterministicContractHash(identitySemanticSignatureContract(manifest)),
    scene_render_contract_hash:renderHash,
    compiled_remotion_props_hash:deterministicContractHash(compiledProps),
    render_cache_key:`identity-render-v1:${renderHash}`,
    ...(videoSha256?{video_sha256:videoSha256}:{}),
  };
};

export type RepairPropagationFailure='IDENTITY_REPAIR_NOT_PROPAGATED'|'REPAIR_NO_OP_BEFORE_RENDER'|'IDENTITY_REPAIR_PIXEL_NO_OP';
export const validateRepairPropagation=(before:IdentityBoundaryHashes,after:IdentityBoundaryHashes,repairClaimsViewerFacingChange=true):RepairPropagationFailure[]=>{
  if(!repairClaimsViewerFacingChange)return [];
  const failures:RepairPropagationFailure[]=[];
  if(before.scene_render_contract_hash===after.scene_render_contract_hash)failures.push('IDENTITY_REPAIR_NOT_PROPAGATED','REPAIR_NO_OP_BEFORE_RENDER');
  if(before.scene_render_contract_hash!==after.scene_render_contract_hash&&before.video_sha256&&after.video_sha256&&before.video_sha256===after.video_sha256)failures.push('IDENTITY_REPAIR_PIXEL_NO_OP');
  return failures;
};

