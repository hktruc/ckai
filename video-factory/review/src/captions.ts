import type {CaptionCue, CaptionZone, FinalReviewManifest} from './model';
import type {VoicePlan, VoiceSegment} from '../../voice/src/model';

const normalizeSpaces = (text: string): string => text.trim().replace(/\s+/g, ' ');

const chunkWords = (text: string, maxCharacters: number): string[] => {
  const words = normalizeSpaces(text).split(' ');
  const chunks: string[] = [];
  let current = '';
  for (const word of words) {
    if (word.length > maxCharacters) throw new Error(`Caption token exceeds deterministic width: ${word}`);
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharacters && current) { chunks.push(current); current = word; }
    else current = next;
  }
  if (current) chunks.push(current);
  return chunks;
};

export const wrapCaption = (text: string, maxLineCharacters: number, maxLines: number): string[] => {
  const lines = chunkWords(text, maxLineCharacters);
  if (lines.length > maxLines) throw new Error(`Caption requires ${lines.length} lines; maximum is ${maxLines}`);
  return lines;
};

const captionDuration = (segment: VoiceSegment): number => Math.min(
  segment.measuredDurationSeconds ?? segment.slotEndSeconds - segment.slotStartSeconds,
  segment.slotEndSeconds - segment.slotStartSeconds,
);

export const deriveSegmentCaptions = (
  segment: VoiceSegment,
  zone: CaptionZone,
  maxLineCharacters = 28,
  maxLines = 2,
): CaptionCue[] => {
  const wrappedLines = chunkWords(segment.originalText, maxLineCharacters);
  const chunks = Array.from({length: Math.ceil(wrappedLines.length / maxLines)}, (_, index) => {
    const lines = wrappedLines.slice(index * maxLines, (index + 1) * maxLines);
    return {sourceText: lines.join(' '), lines};
  });
  const totalWeight = chunks.reduce((sum, chunk) => sum + normalizeSpaces(chunk.sourceText).length, 0);
  const duration = captionDuration(segment);
  let elapsed = 0;
  return chunks.map(({sourceText, lines}, index) => {
    const isLast = index === chunks.length - 1;
    const share = isLast ? duration - elapsed : duration * normalizeSpaces(sourceText).length / totalWeight;
    const startSeconds = segment.slotStartSeconds + elapsed;
    elapsed += share;
    return {
      id: `CAP-${segment.id}-${String(index + 1).padStart(2, '0')}`,
      voiceSegmentId: segment.id,
      sceneId: segment.sceneId,
      sourceText,
      lines,
      startSeconds: Number(startSeconds.toFixed(3)),
      endSeconds: Number((segment.slotStartSeconds + elapsed).toFixed(3)),
      zone,
    };
  });
};

export const deriveCaptions = (plan: VoicePlan, policy: FinalReviewManifest['captionPolicy']): CaptionCue[] =>
  plan.segments.flatMap((segment) => deriveSegmentCaptions(
    segment,
    policy.sceneZones[segment.sceneId] ?? 'lower-safe',
    policy.maxLineCharacters,
    policy.maxLines,
  ));

export const validateCaptions = (review: FinalReviewManifest, plan: VoicePlan): string[] => {
  const errors: string[] = [];
  if (review.captionMode === 'off-approved') {
    if (review.captions.length) errors.push('Caption mode off-approved must not contain rendered cues');
    return errors;
  }
  for (const segment of plan.segments) {
    const cues = review.captions.filter((cue) => cue.voiceSegmentId === segment.id).sort((a, b) => a.startSeconds - b.startSeconds);
    if (!cues.length) { errors.push(`${segment.id} has no caption cues`); continue; }
    const reconstructed = normalizeSpaces(cues.map((cue) => cue.sourceText).join(' '));
    if (reconstructed !== normalizeSpaces(segment.originalText)) errors.push(`${segment.id} captions changed exact Spoken Copy`);
    for (const cue of cues) {
      if (cue.startSeconds < segment.slotStartSeconds || cue.endSeconds > segment.slotEndSeconds || cue.endSeconds <= cue.startSeconds) errors.push(`${cue.id} timing is outside Voice segment`);
      if (cue.lines.length > review.captionPolicy.maxLines || cue.lines.some((line) => line.length > review.captionPolicy.maxLineCharacters)) errors.push(`${cue.id} exceeds caption layout limits`);
      if ((review.captionPolicy.protectedZones[cue.sceneId] ?? []).includes(cue.zone)) errors.push(`${cue.id} collides with protected ${cue.zone}`);
    }
  }
  if (new Set(review.captions.map((cue) => cue.id)).size !== review.captions.length) errors.push('Caption cue IDs must be unique');
  return errors;
};
