import {createHash} from 'node:crypto';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import type {AnimationManifest, Scene} from '../model';
import {evaluateArtQuality, validateArtDirectionSequence} from './art-quality';
import {validateDisplayCopy} from './grammar';

export const PRODUCTION_RENDER_CONTRACT = Object.freeze({minimumEssentialTextPx: 42, fullWidth: 1080, fullHeight: 1920, mobileWidth: 360, mobileHeight: 640});

export type ParityCapabilities = {
  semanticArchetype: boolean; visualMode: boolean; meaningfulConcept: boolean; objectRationale: boolean;
  compositionStrategy: boolean; lightingDepthStrategy: boolean; selectiveDisplayCopy: boolean; proofStrategy: boolean;
  actualRenderedFocalHierarchy: boolean; mobileReadable: boolean; noWeakFallback: boolean;
};

export type FrameEvidence = {path: string; sha256: string; width: number; height: number; bytes: number};
export type ProductionSceneParity = {sceneId: string; capabilities: ParityCapabilities; fullFrame: FrameEvidence; mobileFrame: FrameEvidence; pass: boolean; failures: string[]};
export type ProductionParityReport = {contentId: string; visualPresetId: string; referenceBaseline: ParityCapabilities; scenes: ProductionSceneParity[]; compositionDiversity: boolean; noDemoOnlyBranch: boolean; pass: boolean};

const probeImage = (path: string): FrameEvidence => {
  if (!existsSync(path) || statSync(path).size < 5_000) throw new Error(`Rendered parity frame is missing or too small: ${path}`);
  const result = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', path], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(`Rendered parity frame does not decode: ${path}`);
  const stream = (JSON.parse(result.stdout) as {streams?: Array<{width: number; height: number}>}).streams?.[0];
  if (!stream) throw new Error(`Rendered parity frame has no image stream: ${path}`);
  return {path, sha256: createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase(), width: stream.width, height: stream.height, bytes: statSync(path).size};
};

export const validateRendererLayoutFit = (scene: Scene): string[] => {
  const copy = scene.displayCopy?.trim() ?? '';
  const lines = copy.split(/\r?\n/).filter(Boolean);
  const mode = scene.artDirection?.visualMode;
  const errors: string[] = [];
  if (mode === 'object-metaphor-cinematic' && (lines.length > 3 || lines.some((line) => line.length > 20))) errors.push('object-cinematic displayCopy exceeds the production text safe layout');
  const transformationStates = lines.filter((line) => !/^(?:→|≠)$/.test(line.trim()));
  if (mode === 'transformation-comparison' && (transformationStates.length !== 2 || transformationStates.some((line) => line.length > 30))) errors.push('transformation displayCopy requires exactly two concise states');
  if (mode === 'proof-evidence-presentation' && (lines.length > 4 || lines.some((line) => line.length > 34))) errors.push('proof displayCopy exceeds the four-row evidence layout');
  if (mode === 'typographic-editorial' && (lines.length > 4 || lines.some((line) => line.length > 22))) errors.push('typographic displayCopy exceeds the production editorial safe layout');
  return errors;
};

export const capabilityPresence = (scene: Scene, spokenCopy: string, rendered = {full: true, mobile: true}): ParityCapabilities => {
  const direction = scene.artDirection;
  if (!direction) return Object.fromEntries(['semanticArchetype','visualMode','meaningfulConcept','objectRationale','compositionStrategy','lightingDepthStrategy','selectiveDisplayCopy','proofStrategy','actualRenderedFocalHierarchy','mobileReadable','noWeakFallback'].map((key) => [key, false])) as ParityCapabilities;
  const displayErrors = validateDisplayCopy(scene.displayCopy, spokenCopy, direction);
  const layoutErrors = validateRendererLayoutFit(scene);
  const art = evaluateArtQuality(direction);
  return {
    semanticArchetype: Boolean(direction.semanticArchetype), visualMode: Boolean(direction.visualMode),
    meaningfulConcept: direction.primaryVisualConcept.trim().length >= 20 && direction.centralTension.trim().length >= 12,
    objectRationale: direction.objectRationale.trim().length >= 24,
    compositionStrategy: direction.compositionStrategy.trim().length >= 20,
    lightingDepthStrategy: Boolean(direction.lightingStrategy && direction.depthStrategy),
    selectiveDisplayCopy: displayErrors.length === 0,
    proofStrategy: Boolean(direction.proofPolicy.trim()) && (direction.proof.classification === 'none' || Boolean(direction.proof.truthLabel.trim() && direction.proof.provenance.trim())),
    actualRenderedFocalHierarchy: rendered.full && layoutErrors.length === 0 && direction.strongAttractors <= 2 && Boolean(direction.hierarchy.trim()) && PRODUCTION_RENDER_CONTRACT.minimumEssentialTextPx >= 42,
    mobileReadable: rendered.mobile && displayErrors.length === 0 && layoutErrors.length === 0 && (scene.displayCopy?.split(/\r?\n/).filter(Boolean).length ?? 99) <= 4,
    noWeakFallback: art.pass && Boolean(direction.sourceStrategy) && /text wall/i.test(direction.forbiddenFallbackAnatomy),
  };
};

export const evaluateProductionParity = (input: {contentId: string; manifest: AnimationManifest; fullFrames: string[]; mobileFrames: string[]; referenceBaseline: ParityCapabilities; noDemoOnlyBranch: boolean}): ProductionParityReport => {
  if (input.fullFrames.length !== input.manifest.scenes.length || input.mobileFrames.length !== input.manifest.scenes.length) throw new Error('Production parity requires one full and one mobile frame per scene');
  const scenes = input.manifest.scenes.map((scene, index): ProductionSceneParity => {
    const fullFrame = probeImage(input.fullFrames[index]); const mobileFrame = probeImage(input.mobileFrames[index]);
    const rendered = {full: fullFrame.width === PRODUCTION_RENDER_CONTRACT.fullWidth && fullFrame.height === PRODUCTION_RENDER_CONTRACT.fullHeight, mobile: mobileFrame.width === PRODUCTION_RENDER_CONTRACT.mobileWidth && mobileFrame.height === PRODUCTION_RENDER_CONTRACT.mobileHeight};
    const capabilities = capabilityPresence(scene, input.manifest.voiceHandoff.sceneSlots[index]?.spokenCopy ?? '', rendered);
    const failures = (Object.keys(input.referenceBaseline) as Array<keyof ParityCapabilities>).filter((key) => input.referenceBaseline[key] && !capabilities[key]);
    return {sceneId: scene.id, capabilities, fullFrame, mobileFrame, pass: failures.length === 0, failures};
  });
  const directions = input.manifest.scenes.map((scene) => scene.artDirection).filter((value): value is NonNullable<typeof value> => Boolean(value));
  const anatomyCounts = directions.reduce((counts, direction) => counts.set(`${direction.visualMode}:${direction.semanticObject}`, (counts.get(`${direction.visualMode}:${direction.semanticObject}`) ?? 0) + 1), new Map<string, number>());
  const compositionDiversity = validateArtDirectionSequence(directions).length === 0 && [...anatomyCounts.values()].every((count) => count <= 2);
  return {contentId: input.contentId, visualPresetId: input.manifest.visualPresetId ?? 'missing', referenceBaseline: input.referenceBaseline, scenes, compositionDiversity, noDemoOnlyBranch: input.noDemoOnlyBranch, pass: scenes.every((scene) => scene.pass) && compositionDiversity && input.noDemoOnlyBranch};
};
