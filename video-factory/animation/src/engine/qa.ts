import type {AnimationManifest} from '../model';
import {assertGateConsistency, assertRenderInput} from './gates';
import {getSceneFrames, getTotalFrames} from './timeline';
import {verifyCanonicalUpstream} from './upstream';
import {validateDisplayCopy, validateSceneArtDirection} from '../visual-system/grammar';
import {getVisualPreset} from '../visual-system/preset';
import {validateArtDirectionSequence} from '../visual-system/art-quality';
import {evaluateHybridSource} from '../visual-system/hybrid-source';
import {validateMotionSequence} from '../motion-system';
import {getSignatureProfile} from '../visual-system/signature';
import {validateRetentionExecution,validateSemanticMechanism} from '../retention-execution';

export type QaResult = {pass: boolean; errors: string[]};

export const runTechnicalQa = (manifest: AnimationManifest, proofMode = false): QaResult => {
  const errors: string[] = [];
  const add = (condition: boolean, message: string) => { if (!condition) errors.push(message); };
  const mode = proofMode ? 'reverse-audit-proof' : 'production';
  const upstream = verifyCanonicalUpstream(manifest, mode);
  errors.push(...upstream.errors);

  add(manifest.width === 1080 && manifest.height === 1920, 'Format must be native 1080x1920');
  add(manifest.fps === 30, 'Planning baseline must be 30 fps');
  add(getTotalFrames(manifest) > 0 && manifest.totalSeconds < 60, 'Timeline must be positive and remain under 60 seconds');

  const frames = getSceneFrames(manifest);
  add(frames.length > 0, 'At least one scene is required');
  add(frames[0]?.startFrame === 0, 'Timeline must start at frame 0');
  frames.forEach((scene, index) => {
    add(scene.durationInFrames > 0, `${scene.id} must have positive duration`);
    if (index > 0) add(scene.startFrame === frames[index - 1].endFrame, `${scene.id} creates a gap or overlap`);
    scene.requiredAssetIds.forEach((id) => {
      const asset = manifest.assets[id];
      add(Boolean(asset?.value.trim()), `${scene.id} missing required asset ${id}`);
      add(Boolean(asset?.source.trim() && asset?.truthLabel.trim()), `${id} missing provenance/truth label`);
      add(!/^https?:\/\//i.test(asset?.value.trim() ?? ''), `${id} must resolve locally; remote runtime assets are forbidden`);
    });
    scene.requiredProofIds.forEach((id) => add(manifest.proofIds.includes(id), `${scene.id} missing proof ${id}`));
    scene.requiredCaveatIds.forEach((id) => add(manifest.caveatIds.includes(id), `${scene.id} missing caveat ${id}`));
    if (manifest.visualPresetId) {
      add(Boolean(scene.artDirection), `${scene.id} missing semantic art direction for ${manifest.visualPresetId}`);
      if (scene.artDirection) errors.push(...validateSceneArtDirection(scene.artDirection, getVisualPreset(manifest.visualPresetId)).map((error) => `${scene.id}: ${error}`));
      if (!proofMode && scene.artDirection) errors.push(...validateDisplayCopy(scene.displayCopy, manifest.voiceHandoff.sceneSlots[index]?.spokenCopy ?? '', scene.artDirection).map((error) => `${scene.id}: ${error}`));
      if (!proofMode && scene.artDirection) {
        add(Boolean(scene.hybridSource), `${scene.id} missing hybrid visual source plan`);
        if (scene.hybridSource) errors.push(...evaluateHybridSource({contentId: manifest.id.replace(/-Animation$/, ''), sceneId: scene.id, direction: scene.artDirection, proofClass: scene.artDirection.proof.classification, plan: scene.hybridSource, workspace: process.cwd()}).filter((finding) => finding.severity === 'BLOCKER').map((finding) => `${scene.id}: ${finding.code}: ${finding.message}`));
      }
    }
  });
  if (manifest.visualPresetId) errors.push(...validateArtDirectionSequence(manifest.scenes.map((scene) => scene.artDirection).filter((scene): scene is NonNullable<typeof scene> => Boolean(scene))).map((error) => `Art quality: ${error}`));
  if (!proofMode) {
    add(Boolean(manifest.signatureProfileId), 'Production manifest requires a versioned CKAI signature profile');
    if (manifest.signatureProfileId) try { getSignatureProfile(manifest.signatureProfileId); } catch (error) { errors.push((error as Error).message); }
    errors.push(...validateMotionSequence(manifest.scenes));
    if(manifest.scenes.some((scene)=>scene.retentionExecution))errors.push(...manifest.scenes.flatMap((scene)=>[...validateRetentionExecution(scene),...validateSemanticMechanism(scene)].map((error)=>`${scene.id}: ${error}`)));
  }
  add(frames.at(-1)?.endFrame === getTotalFrames(manifest), 'Last scene must end at composition duration');
  const handoff = manifest.voiceHandoff;
  add(Boolean(handoff.sourceScript && handoff.implementationRef && handoff.technicalPreviewLocation), 'Voice handoff references are incomplete');
  add(handoff.totalDurationSeconds === manifest.totalSeconds, 'Voice handoff duration must match animation duration');
  add(handoff.hardMaximumSecondsExclusive === 60 && handoff.totalDurationSeconds < 60, 'Voice handoff must remain under 60 seconds');
  add(handoff.audioGenerated === false, 'STEP 05 must not generate audio');
  add(handoff.sceneSlots.length === manifest.scenes.length, 'Voice handoff must cover every scene');
  handoff.sceneSlots.forEach((slot, index) => {
    const scene = manifest.scenes[index];
    add(slot.sceneId === scene?.id && slot.startSeconds === scene?.startSeconds && slot.endSeconds === scene?.endSeconds, `${slot.sceneId} Voice slot does not match scene timing`);
    add(Boolean(slot.spokenCopy.trim()), `${slot.sceneId} is missing exact Spoken Copy`);
    slot.pauseWindows.forEach((pause) => add(pause.startSeconds >= slot.startSeconds && pause.endSeconds <= slot.endSeconds && pause.endSeconds > pause.startSeconds, `${slot.sceneId} has invalid pause/hold window`));
  });
  const timedRequirements = handoff.proofCaveatTiming.flatMap(({requirementIds}) => requirementIds);
  [...manifest.proofIds, ...manifest.caveatIds].forEach((id) => add(timedRequirements.includes(id), `Voice handoff missing proof/caveat timing ${id}`));

  try { assertGateConsistency(manifest, upstream); } catch (error) { errors.push((error as Error).message); }
  try { assertRenderInput(manifest, mode, upstream); } catch (error) { errors.push((error as Error).message); }
  return {pass: errors.length === 0, errors};
};
