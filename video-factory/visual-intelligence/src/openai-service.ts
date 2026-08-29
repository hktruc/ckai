import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import OpenAI from 'openai';
import type {KeyVisualBriefV1, SemanticVisionQa} from './model';

export type OpenAiLike = Pick<OpenAI, 'images' | 'responses' | 'models'>;

export const loadLocalEnv = (path: string) => {
  const text = readFileSync(path, 'utf8');
  for (const line of text.split(/\r?\n/u)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/u);
    if (!match || process.env[match[1]!]) continue;
    let value = match[2]!.trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[match[1]!] = value;
  }
};

export const createOpenAiClient = () => {
  if (!process.env.OPENAI_API_KEY?.trim()) throw Object.assign(new Error('OPENAI_API_KEY detected: NO'), {code: 'OPENAI_API_KEY_MISSING'});
  return new OpenAI({apiKey: process.env.OPENAI_API_KEY});
};

export const compileImagePrompt = (brief: KeyVisualBriefV1, revisionInstruction?: string) => [
  'Create one raw production key visual for a vertical short-form video. Do not create a completed Reel.',
  `Semantic core: ${brief.semantic_core}`,
  `The viewer must immediately see: ${brief.viewer_should_see}`,
  `Primary visual idea: ${brief.primary_visual_idea}`,
  'Show the approved semantic relationship as objects, material, depth and negative space; reserve all exact display copy and truth labels for the native compositor.',
  `Must not show: ${brief.must_not_show.join('; ')}`,
  `Composition: focal subject=${brief.composition.focal_subject}; position=${brief.composition.subject_position}; foreground=${brief.composition.foreground}; background=${brief.composition.background}; negative space=${brief.composition.negative_space}.`,
  `Magnetism: tension=${brief.visual_magnetism.tension}; contrast=${brief.visual_magnetism.contrast}; reveal=${brief.visual_magnetism.reveal_potential}; depth=${brief.visual_magnetism.depth}; focal strength=${brief.visual_magnetism.focal_strength}.`,
  `Style constraint only: ${brief.style.dna}; ${brief.style.mood}; ${brief.style.realism}; ${brief.style.texture}.`,
  `Output: ${brief.output_fit.target}; crop=${brief.output_fit.crop_tolerance}; safe zone=${brief.output_fit.safe_zone}.`,
  'No critical display typography inside the generated image. No logos, dashboards, screenshots, charts, documents or other pseudo-evidence. This is conceptual imagery and evidence=false.',
  revisionInstruction || '',
].filter(Boolean).join('\n');

export const generateImageBinary = async (client: OpenAiLike, model: string, prompt: string) => {
  const response = await client.images.generate({model, prompt, n: 1, size: '1024x1536', quality: 'medium', output_format: 'png'});
  const encoded = response.data?.[0]?.b64_json;
  if (!encoded) throw Object.assign(new Error('Image API response did not contain image binary'), {code: 'GENERATION_EXECUTION_FAILURE'});
  return {binary: Buffer.from(encoded, 'base64'), usage: response.usage ? JSON.parse(JSON.stringify(response.usage)) as Record<string, unknown> : {}, createdAt: new Date(response.created * 1000).toISOString()};
};

const qaSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    interpretation: {type: 'string'}, semantic_relevance: {type: 'integer', minimum: 0, maximum: 10}, semantic_specificity: {type: 'integer', minimum: 0, maximum: 10},
    factual_integrity: {type: 'string', enum: ['PASS', 'FAIL']}, visual_magnetism: {type: 'integer', minimum: 0, maximum: 10}, motion_potential: {type: 'integer', minimum: 0, maximum: 10},
    ckai_dna_fit: {type: 'integer', minimum: 0, maximum: 10}, video_usability: {type: 'integer', minimum: 0, maximum: 10}, verdict: {type: 'string', enum: ['PASS', 'RETRY', 'REJECT']},
    failure_reasons: {type: 'array', items: {type: 'string'}}, revision_instructions: {type: 'array', items: {type: 'string'}},
    failure_class: {anyOf: [{type: 'string', enum: ['GENERATION_EXECUTION_FAILURE', 'SEMANTIC_ASSET_MISMATCH', 'WRONG_VISUAL_SOURCE', 'RETENTION_DEAD_ZONE', 'SCRIPT_NOT_VISUALIZABLE', 'FAKE_OR_PSEUDO_EVIDENCE', 'COMPOSED_FRAME_FAILURE', 'VIDEO_RETENTION_FAILURE']}, {type: 'null'}]},
    recommended_return_layer: {anyOf: [{type: 'string'}, {type: 'null'}]},
  },
  required: ['interpretation', 'semantic_relevance', 'semantic_specificity', 'factual_integrity', 'visual_magnetism', 'motion_potential', 'ckai_dna_fit', 'video_usability', 'verdict', 'failure_reasons', 'revision_instructions', 'failure_class', 'recommended_return_layer'],
} as const;

export const visionQaActualBinary = async (client: OpenAiLike, model: string, binary: Buffer, mime: 'image/png' | 'image/jpeg', brief: KeyVisualBriefV1, kind: 'ASSET' | 'COMPOSED_FRAME' = 'ASSET') => {
  const boundaryRequirements = kind === 'ASSET'
    ? 'Judge the raw semantic object/relationship and usable typography-safe space. Exact display copy and truth labels are compositor responsibilities; do not require them inside the image.'
    : `The completed composition must show: ${brief.must_show.join('; ')}.`;
  const response = await client.responses.create({
    model,
    instructions: 'You are CKAI Semantic Vision QA. Judge the actual image pixels, never the filename. First independently state what the image communicates. Do not infer from any generation prompt; no generation prompt is provided. A beautiful but semantically wrong image fails. Generated imagery must never be treated as factual evidence.',
    input: [{role: 'user', content: [
      {type: 'input_text', text: `QA boundary: ${kind}. Compare your independent interpretation against semantic_core=${brief.semantic_core} and viewer_should_see=${brief.viewer_should_see}. ${boundaryRequirements} Must not show: ${brief.must_not_show.join('; ')}. Check portrait crop, dominant object, hierarchy, motion headroom, fake/pseudo evidence and CKAI_DARK_PREMIUM_EDITORIAL_V1 fit.`},
      {type: 'input_image', detail: 'high', image_url: `data:${mime};base64,${binary.toString('base64')}`},
    ]}],
    text: {format: {type: 'json_schema', name: 'ckai_semantic_vision_qa', strict: true, schema: qaSchema}},
  });
  if (!response.output_text?.trim()) throw Object.assign(new Error('Vision response contained no structured output'), {code: 'VISION_QA_EMPTY'});
  return {qa: JSON.parse(response.output_text) as SemanticVisionQa, usage: response.usage ? JSON.parse(JSON.stringify(response.usage)) as Record<string, unknown> : {}, responseId: response.id};
};

export const sha256 = (binary: Buffer | string) => createHash('sha256').update(binary).digest('hex').toUpperCase();
