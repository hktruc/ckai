export type ReferenceMode = 'REFERENCE_ONLY' | 'PRODUCTION_ASSET_APPROVED';
export type ReferenceType = 'pptx' | 'pdf' | 'slide-screenshot' | 'image' | 'video';
export type VisualReference = {id: string; type: ReferenceType; path: string; mode: ReferenceMode; influence: string; provenance: string; license: string; sha256?: string; approvedBy?: 'product-owner'; approvedAt?: string};

export const validateVisualReference = (reference: VisualReference): string[] => {
  const errors: string[] = [];
  if (!reference.id.trim() || !reference.path.trim() || !reference.influence.trim()) errors.push('Reference identity, path and intended influence are required');
  if (/^https?:\/\//i.test(reference.path)) errors.push('Reference ingestion is local-first; remote URLs are not production paths');
  if (reference.mode === 'PRODUCTION_ASSET_APPROVED') {
    if (reference.approvedBy !== 'product-owner' || !reference.approvedAt || !Number.isFinite(Date.parse(reference.approvedAt))) errors.push('Production asset use requires direct Product Owner approval provenance');
    if (!/^[A-Fa-f0-9]{64}$/.test(reference.sha256 ?? '')) errors.push('Production asset use requires an exact SHA-256');
    if (!reference.provenance.trim() || !reference.license.trim()) errors.push('Production asset use requires provenance and license metadata');
  }
  return errors;
};

export const canUseAsProductionAsset = (reference: VisualReference) => reference.mode === 'PRODUCTION_ASSET_APPROVED' && validateVisualReference(reference).length === 0;
