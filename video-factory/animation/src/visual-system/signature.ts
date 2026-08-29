export const CKAI_SIGNATURE_V1 = Object.freeze({
  id: 'CKAI_SIGNATURE_V1' as const,
  version: 1,
  visual: ['restrained-amber-attention', 'dark-spatial-depth', 'evidence-first-honesty'] as const,
  motion: ['controlled-reveal', 'editorial-typography-rhythm', 'purposeful-negative-space'] as const,
  audio: ['voice-first', 'precise-optional-accents', 'silence-only-with-semantic-purpose'] as const,
  rule: 'Use only the recurring qualities supported by the scene; never force every motif into every video.',
});

export type SignatureProfileId = typeof CKAI_SIGNATURE_V1.id;

export const getSignatureProfile = (id: SignatureProfileId) => {
  if (id !== CKAI_SIGNATURE_V1.id) throw new Error(`Unknown CKAI signature profile: ${id}`);
  return CKAI_SIGNATURE_V1;
};
