import type {DepthStrategy, LightingStrategy, LinePurpose, ProofClass, VisualArchetype} from './grammar';

export type SemanticArchetype = 'thesis-declaration' | 'contrast-before-after' | 'investigation-verification' | 'transformation' | 'consequence-payoff' | 'evidence-proof' | 'reflection-insight' | 'warning-tension' | 'conclusion-distillation';
export type VisualMode = 'typographic-editorial' | 'object-metaphor-cinematic' | 'proof-evidence-presentation' | 'transformation-comparison';
export type SemanticObjectId = 'none' | 'lens' | 'balance' | 'layers' | 'fracture' | 'domino-chain' | 'aperture' | 'document-field' | 'reassembly-field';
export type PacingIntent = 'hold' | 'scan' | 'investigate' | 'accumulate' | 'cascade' | 'reveal' | 'reflect' | 'interrupt' | 'resolve';

export type ArtDirectionPolicy = {
  semanticArchetype: SemanticArchetype;
  visualMode: VisualMode;
  legacyArchetype: VisualArchetype;
  compositionalTendencies: readonly string[];
  objectPolicy: {recommended: SemanticObjectId; allowed: readonly SemanticObjectId[]; requireRationale: boolean};
  lightingStrategy: LightingStrategy;
  depthStrategy: DepthStrategy;
  typographyStrategy: string;
  pacingIntent: PacingIntent;
  proofPolicy: ProofClass | 'honest-if-used';
  linePurpose: LinePurpose;
  negativeSpaceRole: string;
  eyePath: string;
};

export const ART_DIRECTION_POLICIES: Readonly<Record<SemanticArchetype, ArtDirectionPolicy>> = Object.freeze({
  'thesis-declaration': {semanticArchetype: 'thesis-declaration', visualMode: 'typographic-editorial', legacyArchetype: 'typography-hero', compositionalTendencies: ['overscale type mass', 'asymmetric rag', 'off-frame crop'], objectPolicy: {recommended: 'none', allowed: ['none'], requireRationale: false}, lightingStrategy: 'restrained-ambient', depthStrategy: 'flat-intentional', typographyStrategy: 'declaration-led scale rhythm; semantic phrase carries weight contrast', pacingIntent: 'hold', proofPolicy: 'none', linePurpose: 'none', negativeSpaceRole: 'build authority and anticipation around the declaration', eyePath: 'dominant phrase to semantic emphasis'},
  'contrast-before-after': {semanticArchetype: 'contrast-before-after', visualMode: 'transformation-comparison', legacyArchetype: 'comparison-transformation', compositionalTendencies: ['shared field', 'state collision', 'controlled reveal boundary'], objectPolicy: {recommended: 'balance', allowed: ['none', 'balance', 'reassembly-field'], requireRationale: true}, lightingStrategy: 'dark-to-light', depthStrategy: 'perspective', typographyStrategy: 'opposed phrases differ by weight, position and spatial stability', pacingIntent: 'scan', proofPolicy: 'honest-if-used', linePurpose: 'separate', negativeSpaceRole: 'hold the unresolved interval between states', eyePath: 'unstable state through boundary to resolved state'},
  'investigation-verification': {semanticArchetype: 'investigation-verification', visualMode: 'object-metaphor-cinematic', legacyArchetype: 'object-metaphor', compositionalTendencies: ['cropped optical object', 'focal isolation', 'foreground overlap'], objectPolicy: {recommended: 'lens', allowed: ['none', 'lens', 'layers'], requireRationale: true}, lightingStrategy: 'directional-edge', depthStrategy: 'occlusion', typographyStrategy: 'question or claim supports the investigative object; exact signal may be magnified', pacingIntent: 'investigate', proofPolicy: 'honest-if-used', linePurpose: 'none', negativeSpaceRole: 'hide irrelevant information while concentrating scrutiny', eyePath: 'claim to optical object to isolated signal'},
  transformation: {semanticArchetype: 'transformation', visualMode: 'transformation-comparison', legacyArchetype: 'comparison-transformation', compositionalTendencies: ['fragment field', 'spatial reorganisation', 'aligned resolved mass'], objectPolicy: {recommended: 'reassembly-field', allowed: ['none', 'reassembly-field', 'layers'], requireRationale: true}, lightingStrategy: 'dark-to-light', depthStrategy: 'perspective', typographyStrategy: 'source language fragments; output language resolves into one stable group', pacingIntent: 'accumulate', proofPolicy: 'honest-if-used', linePurpose: 'none', negativeSpaceRole: 'make the reorganisation legible rather than merely empty', eyePath: 'fragment scatter to ordered focal result'},
  'consequence-payoff': {semanticArchetype: 'consequence-payoff', visualMode: 'object-metaphor-cinematic', legacyArchetype: 'object-metaphor', compositionalTendencies: ['directional cascade', 'off-frame continuation', 'impact isolation'], objectPolicy: {recommended: 'domino-chain', allowed: ['none', 'domino-chain', 'aperture'], requireRationale: true}, lightingStrategy: 'directional-edge', depthStrategy: 'foreground-background', typographyStrategy: 'cause remains restrained; consequence receives terminal scale', pacingIntent: 'cascade', proofPolicy: 'honest-if-used', linePurpose: 'none', negativeSpaceRole: 'extend the implied consequence beyond the visible frame', eyePath: 'initiating cause along cascade to impact phrase'},
  'evidence-proof': {semanticArchetype: 'evidence-proof', visualMode: 'proof-evidence-presentation', legacyArchetype: 'proof-artifact', compositionalTendencies: ['single source field', 'signal/noise separation', 'overlapping resolved state'], objectPolicy: {recommended: 'document-field', allowed: ['document-field'], requireRationale: true}, lightingStrategy: 'shadow-separation', depthStrategy: 'perspective', typographyStrategy: 'artifact text is reduced to trust-bearing signals; honesty label remains prominent', pacingIntent: 'reveal', proofPolicy: 'visual-representation', linePurpose: 'separate', negativeSpaceRole: 'separate evidence from annotation and preserve hierarchy of trust', eyePath: 'source signal to changed value to honest label'},
  'reflection-insight': {semanticArchetype: 'reflection-insight', visualMode: 'object-metaphor-cinematic', legacyArchetype: 'object-metaphor', compositionalTendencies: ['layered transparency', 'quiet offset', 'partial occlusion'], objectPolicy: {recommended: 'layers', allowed: ['none', 'layers', 'aperture'], requireRationale: true}, lightingStrategy: 'localized-glow', depthStrategy: 'atmospheric', typographyStrategy: 'measured phrase rhythm with one quiet semantic reveal', pacingIntent: 'reflect', proofPolicy: 'none', linePurpose: 'none', negativeSpaceRole: 'create contemplative distance between surface answer and deeper insight', eyePath: 'surface phrase through layers to core insight'},
  'warning-tension': {semanticArchetype: 'warning-tension', visualMode: 'object-metaphor-cinematic', legacyArchetype: 'object-metaphor', compositionalTendencies: ['diagonal fracture', 'compressed crop', 'unstable weight'], objectPolicy: {recommended: 'fracture', allowed: ['none', 'fracture', 'balance'], requireRationale: true}, lightingStrategy: 'directional-edge', depthStrategy: 'occlusion', typographyStrategy: 'compressed declaration with one destabilised semantic break', pacingIntent: 'interrupt', proofPolicy: 'honest-if-used', linePurpose: 'directional-tension', negativeSpaceRole: 'create pressure around the unstable claim', eyePath: 'warning phrase into fracture and unresolved edge'},
  'conclusion-distillation': {semanticArchetype: 'conclusion-distillation', visualMode: 'typographic-editorial', legacyArchetype: 'conclusion-payoff', compositionalTendencies: ['distilled phrase', 'off-centre aperture', 'terminal scale contrast'], objectPolicy: {recommended: 'aperture', allowed: ['none', 'aperture'], requireRationale: true}, lightingStrategy: 'backlight', depthStrategy: 'atmospheric', typographyStrategy: 'premise recedes; final phrase resolves with optical grouping', pacingIntent: 'resolve', proofPolicy: 'none', linePurpose: 'reveal', negativeSpaceRole: 'let the conclusion land before the frame closes', eyePath: 'quiet premise to final phrase through aperture'},
});

export const inferSemanticArchetype = (value: string): SemanticArchetype => {
  const text = value.toLocaleLowerCase('vi');
  if (/proof|evidence|bằng chứng|direct test|source artifact|kết quả kiểm chứng/.test(text)) return 'evidence-proof';
  if (/investigat|verify|verification|kiểm chứng|điều tra|truy vết|audit/.test(text)) return 'investigation-verification';
  if (/transform|restructur|reassembl|chuyển đổi|tái cấu trúc|sắp xếp|quy trình|process/.test(text)) return 'transformation';
  if (/contrast|before|after|so sánh|trước|sau|đối lập|khác biệt|phân biệt|nhân quả/.test(text)) return 'contrast-before-after';
  if (/consequence|payoff|hệ quả|kéo theo|tác động|kết quả cuối/.test(text)) return 'consequence-payoff';
  if (/warning|risk|tension|cảnh báo|rủi ro|căng|nghịch lý|giả thuyết/.test(text)) return 'warning-tension';
  if (/reflection|insight|reflect|chiêm nghiệm|nhận ra|mấu chốt|suy ngẫm/.test(text)) return 'reflection-insight';
  if (/conclusion|distill|kết luận|chốt|nguyên tắc cuối|cta/.test(text)) return 'conclusion-distillation';
  return 'thesis-declaration';
};

export const getArtDirectionPolicy = (archetype: SemanticArchetype) => ART_DIRECTION_POLICIES[archetype];

export const inferSemanticObject = (value: string): SemanticObjectId => {
  const text = value.toLocaleLowerCase('vi');
  if (/lens|magnif|thấu kính|kính lúp/.test(text)) return 'lens';
  if (/balance|cân bằng|cán cân/.test(text)) return 'balance';
  if (/layer|lớp|tầng|strata/.test(text)) return 'layers';
  if (/fracture|crack|vết nứt|đứt gãy/.test(text)) return 'fracture';
  if (/domino|cascade|chuỗi đổ|dây chuyền/.test(text)) return 'domino-chain';
  if (/aperture|threshold|khe sáng|cánh cửa|ngưỡng/.test(text)) return 'aperture';
  if (/document|artifact|tài liệu|chứng từ/.test(text)) return 'document-field';
  if (/reassembl|reorgani|fragment|tái cấu trúc|mảnh rời/.test(text)) return 'reassembly-field';
  return 'none';
};
