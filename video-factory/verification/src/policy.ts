export type VerificationBasis = 'independent-evidence' | 'product-owner-confirmed' | 'unverified';
export type ClaimRisk = 'LOW_RISK_FAMILIAR' | 'PRICING' | 'QUOTA' | 'ACCESS_OR_ROLLOUT' | 'STATISTIC' | 'BENCHMARK' | 'NEW_OR_TIME_SENSITIVE' | 'MEDICAL' | 'LEGAL' | 'FINANCIAL' | 'HIGH_IMPACT' | 'DIRECT_VISUAL_PROOF';
export type VerificationDecision = {pass:boolean; basisAccepted:boolean; independentVerificationRequired:boolean; reason:string};

const independentRequired = new Set<ClaimRisk>(['PRICING','QUOTA','ACCESS_OR_ROLLOUT','STATISTIC','BENCHMARK','NEW_OR_TIME_SENSITIVE','MEDICAL','LEGAL','FINANCIAL','HIGH_IMPACT','DIRECT_VISUAL_PROOF']);

export const evaluateVerificationBasis = (input: {basis: VerificationBasis; risk: ClaimRisk; productOwnerConfirmed: boolean; contradictoryEvidence: boolean; knownFalse: boolean; familiar: boolean; nonControversial: boolean}): VerificationDecision => {
  if (input.knownFalse) return {pass:false,basisAccepted:false,independentVerificationRequired:true,reason:'Known falsehood cannot be approved into truth.'};
  if (input.contradictoryEvidence) return {pass:false,basisAccepted:false,independentVerificationRequired:true,reason:'Contradictory evidence requires independent resolution.'};
  const required = independentRequired.has(input.risk);
  if (input.basis === 'independent-evidence') return {pass:true,basisAccepted:true,independentVerificationRequired:required,reason:'Traceable independent evidence is present.'};
  const trusted = input.basis === 'product-owner-confirmed' && input.productOwnerConfirmed && input.risk === 'LOW_RISK_FAMILIAR' && input.familiar && input.nonControversial;
  if (trusted) return {pass:true,basisAccepted:true,independentVerificationRequired:false,reason:'Direct Product Owner confirmation is sufficient for this low-risk familiar capability claim.'};
  return {pass:false,basisAccepted:false,independentVerificationRequired:required,reason:required ? 'Independent verification is mandatory for this claim category.' : 'Trusted Product Owner confirmation is incomplete or inapplicable.'};
};
