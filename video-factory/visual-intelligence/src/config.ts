export type VisualIntelligenceConfig = {
  imageModel: string;
  visionModel: string;
  generatedAssetsTargetMin: number;
  generatedAssetsTargetMax: number;
  generatedAssetsHardMax: number;
  maxGenerationAttemptsPerAsset: number;
  maxGenerationCallsPerVideo: number;
  maxEstimatedUsdPerVideo: number | null;
  semanticRelevanceMin: number;
  semanticSpecificityMin: number;
  visualMagnetismMin: number;
  videoUsabilityMin: number;
};

const integer = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};
const optionalUsd = (value: string | undefined): number | null => {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export const visualIntelligenceConfig = (env: NodeJS.ProcessEnv = process.env): VisualIntelligenceConfig => ({
  imageModel: env.CKAI_IMAGE_MODEL?.trim() || 'gpt-image-2',
  visionModel: env.CKAI_VISION_MODEL?.trim() || 'gpt-5.6-terra',
  generatedAssetsTargetMin: integer(env.CKAI_GENERATED_ASSETS_TARGET_MIN, 2),
  generatedAssetsTargetMax: integer(env.CKAI_GENERATED_ASSETS_TARGET_MAX, 4),
  generatedAssetsHardMax: integer(env.CKAI_GENERATED_ASSETS_HARD_MAX, 5),
  maxGenerationAttemptsPerAsset: integer(env.CKAI_MAX_GENERATION_ATTEMPTS, 3),
  maxGenerationCallsPerVideo: integer(env.CKAI_MAX_GENERATION_CALLS, 9),
  maxEstimatedUsdPerVideo: optionalUsd(env.CKAI_MAX_IMAGE_USD_PER_VIDEO),
  semanticRelevanceMin: integer(env.CKAI_SEMANTIC_RELEVANCE_MIN, 8),
  semanticSpecificityMin: integer(env.CKAI_SEMANTIC_SPECIFICITY_MIN, 7),
  visualMagnetismMin: integer(env.CKAI_VISUAL_MAGNETISM_MIN, 7),
  videoUsabilityMin: integer(env.CKAI_VIDEO_USABILITY_MIN, 7),
});

export class GenerationBudget {
  private accepted = 0;
  private calls = 0;
  private estimatedUsd = 0;
  constructor(readonly config: VisualIntelligenceConfig) {}
  beforeCall(assetAttempt: number) {
    if (this.accepted >= this.config.generatedAssetsHardMax) throw Object.assign(new Error('Generated visual hard maximum reached'), {code: 'GENERATED_ASSET_HARD_MAX'});
    if (assetAttempt > this.config.maxGenerationAttemptsPerAsset) throw Object.assign(new Error('Generation attempts exhausted; replan visual'), {code: 'GENERATION_ATTEMPTS_EXHAUSTED'});
    if (this.calls >= this.config.maxGenerationCallsPerVideo) throw Object.assign(new Error('Finite generation-call guard reached'), {code: 'GENERATION_CALL_BUDGET_REVIEW'});
    if (this.config.maxEstimatedUsdPerVideo !== null && this.estimatedUsd >= this.config.maxEstimatedUsdPerVideo) throw Object.assign(new Error('Configured image budget reached'), {code: 'GENERATION_USD_BUDGET_REVIEW'});
    this.calls += 1;
  }
  recordAccepted(estimatedCostUsd: number | null) {
    this.accepted += 1;
    if (estimatedCostUsd !== null) this.estimatedUsd += estimatedCostUsd;
  }
  snapshot() { return {accepted: this.accepted, calls: this.calls, estimated_usd: this.estimatedUsd || null}; }
}

