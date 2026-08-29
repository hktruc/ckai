import {existsSync, readFileSync} from 'node:fs';
import {probeAudio, probeAudioLevels} from './media';
import {assertFinalGate} from './gates';
import {loadVoiceRegistry, resolveVoiceAlias} from './registry';
import {segmentCacheKey} from './segment';
import {evaluateFit} from './timing';
import type {VoiceMode, VoiceRuntimeInput} from './model';
import {verifyVoiceUpstream} from './upstream';
import {sha256} from './segment';

export type VoiceQaResult = {pass: boolean; errors: string[]};

export const validateAudibleLevels = (levels: {meanVolumeDb: number; maxVolumeDb: number; zeroDbSampleRatio: number}, label: string): string[] => {
  const errors: string[] = [];
  if (levels.meanVolumeDb < -60 || levels.maxVolumeDb < -60) errors.push(`${label} is effectively silent`);
  if (levels.maxVolumeDb > 0.1 || levels.zeroDbSampleRatio > 0.005) errors.push(`${label} has severe clipping indicators`);
  return errors;
};

export const runVoiceQa = (input: VoiceRuntimeInput, mode: VoiceMode, requireAudio = true, requireMuxedPreview = false): VoiceQaResult => {
  const {plan} = input;
  const errors: string[] = [];
  const upstream = verifyVoiceUpstream(input, mode);
  errors.push(...upstream.errors);
  const registry = loadVoiceRegistry();
  const selection = plan.voiceSelection;
  const candidateSet = new Set(selection.candidateAliases);
  const auditionedSet = new Set(selection.auditionedAliases);
  const selectedSet = new Set(selection.selectedAliases);
  for (const alias of new Set([...candidateSet, ...auditionedSet, ...selectedSet])) {
    if (!registry[alias]) errors.push(`Voice selection alias is not registered: ${alias}`);
  }
  for (const alias of auditionedSet) if (!candidateSet.has(alias)) errors.push(`Auditioned voice was not declared as a candidate: ${alias}`);
  for (const alias of selectedSet) if (!auditionedSet.has(alias)) errors.push(`Selected voice was not auditioned: ${alias}`);
  for (const alias of new Set(plan.segments.map((segment) => segment.speakerAlias))) {
    if (!selectedSet.has(alias)) errors.push(`Segment voice alias is not in the selected mapping: ${alias}`);
  }
  if (mode === 'production' && (!selection.productionApprovedMapping || plan.voiceSelectionCheck !== 'PASS')) {
    errors.push('Production Voice requires explicit Product Owner-approved voice mapping');
  }
  const sorted = [...plan.segments].sort((a, b) => a.slotStartSeconds - b.slotStartSeconds);
  sorted.forEach((segment, index) => {
    let voice;
    try { voice = resolveVoiceAlias(segment.speakerAlias, mode); } catch (error) { errors.push((error as Error).message); return; }
    if (segment.cacheKey !== segmentCacheKey(segment, voice)) errors.push(`${segment.id} cache key is stale`);
    if (!segment.synthesisText.trim()) errors.push(`${segment.id} synthesis text is empty`);
    if (index > 0 && segment.slotStartSeconds < sorted[index - 1].slotEndSeconds) errors.push(`${segment.id} overlaps prior approved slot`);
    if (requireAudio) {
      if (!segment.providerMetadata) errors.push(`${segment.id} provider metadata trace is missing`);
      else if (segment.providerMetadata.outputPath !== segment.generatedAudioPath) errors.push(`${segment.id} provider metadata output is stale`);
      try {
        const probe = probeAudio(segment.generatedAudioPath);
        const fit = evaluateFit(segment.slotStartSeconds, segment.slotEndSeconds, probe.duration, segment.requiredEndSeconds);
        segment.measuredDurationSeconds = Number(probe.duration.toFixed(3));
        segment.fitDeltaSeconds = fit.fitDeltaSeconds;
        segment.fitStatus = fit.fitStatus;
        const levels = probeAudioLevels(segment.generatedAudioPath);
        errors.push(...validateAudibleLevels(levels, segment.id));
        if (fit.fitStatus !== 'PASS') errors.push(`${segment.id} audio exceeds slot by ${Math.abs(fit.fitDeltaSeconds)}s`);
        if (probe.sampleRate < 16000 || probe.channels < 1) errors.push(`${segment.id} audio format is invalid`);
      } catch (error) { errors.push((error as Error).message); }
    }
    if (!registry[segment.speakerAlias]) errors.push(`${segment.id} speaker alias missing`);
  });
  if (plan.segments.some((segment) => segment.originalText.includes('OCR')) && !plan.segments.some((segment) => segment.pronunciationTerms.includes('OCR'))) errors.push('OCR pronunciation normalization was not applied');
  if (plan.segments.some((segment) => segment.originalText.includes('PDF')) && !plan.segments.some((segment) => segment.pronunciationTerms.includes('PDF'))) errors.push('PDF pronunciation normalization was not applied');
  if (plan.segments.some((segment) => segment.originalText.includes('Markdown')) && !plan.segments.some((segment) => segment.pronunciationTerms.includes('Markdown'))) errors.push('Markdown pronunciation normalization was not applied');
  if (requireAudio && !existsSync(plan.assembledAudioPath)) errors.push('Assembled Voice audio is missing');
  if (requireAudio && existsSync(plan.assembledAudioPath)) {
    try {
      const master = probeAudio(plan.assembledAudioPath);
      const levels = probeAudioLevels(plan.assembledAudioPath);
      if (master.sampleRate !== 48000 || master.channels < 1) errors.push('Assembled Voice audio must be 48 kHz and decodable');
      errors.push(...validateAudibleLevels(levels, 'Assembled Voice audio'));
    } catch (error) { errors.push((error as Error).message); }
  }
  if (requireMuxedPreview) {
    try {
      if (!existsSync(plan.previewPath)) throw new Error('Muxed Voice preview is missing');
      const preview = probeAudio(plan.previewPath);
      const levels = probeAudioLevels(plan.previewPath);
      errors.push(...validateAudibleLevels(levels, 'Muxed Voice preview narration'));
      if (preview.sampleRate !== 48000 || preview.channels < 1) errors.push('Muxed Voice preview audio must be 48 kHz and decodable');
      if (!plan.previewMediaQa) errors.push('Muxed Voice preview QA metadata is missing');
      else {
        if (plan.previewMediaQa.sha256 !== sha256(readFileSync(plan.previewPath))) errors.push('Muxed Voice preview checksum is stale');
        if (plan.previewMediaQa.codec !== preview.codec || plan.previewMediaQa.sampleRate !== preview.sampleRate || plan.previewMediaQa.channels !== preview.channels) errors.push('Muxed Voice preview format metadata is stale');
        if (plan.previewMediaQa.meanVolumeDb !== levels.meanVolumeDb || plan.previewMediaQa.maxVolumeDb !== levels.maxVolumeDb || plan.previewMediaQa.zeroDbSampleRatio !== levels.zeroDbSampleRatio) errors.push('Muxed Voice preview loudness metadata is stale');
      }
      const sourceLevels = probeAudioLevels(plan.assembledAudioPath);
      if (Math.abs(sourceLevels.meanVolumeDb - levels.meanVolumeDb) > 3.1 || Math.abs(sourceLevels.maxVolumeDb - levels.maxVolumeDb) > 3.1) errors.push('Muxed Voice preview loudness diverges materially from the assembled narration');
    } catch (error) { errors.push((error as Error).message); }
  }
  try { assertFinalGate(plan, upstream); } catch (error) { errors.push((error as Error).message); }
  return {pass: errors.length === 0, errors};
};
