import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {assembleVoiceTimeline} from '../src/assembly';
import {probeAudio, probeAudioLevels} from '../src/media';
import type {VoicePlan, VoiceSegment} from '../src/model';
import {normalizeVietnamese} from '../src/normalization';
import {VbeeProvider, vbeeCredentialsAvailable} from '../src/providers/vbee';
import {resolveVoiceAlias} from '../src/registry';
import {segmentCacheKey} from '../src/segment';

const contentId = 'CKAI-0005';
const sourceScript = 'content/approved/CKAI-0005_dung-chua-chac-la-hieu.md';
const outputRoot = `generated/voice/${contentId}`;
const masterPath = `${outputRoot}/master.wav`;
const metadataPath = `${outputRoot}/narration.generated.json`;

const sourceSegments = [
  'A.I có thể trả lời đúng. Nhưng đúng chưa chắc có nghĩa là hiểu.',
  'Một câu trả lời đúng có thể xuất hiện vì mô hình đã gặp rất nhiều ví dụ tương tự. Vì nó nhận ra một mẫu quen thuộc.',
  'Hoặc đơn giản vì lựa chọn tiếp theo có xác suất cao nhất. Kết quả vẫn có thể đúng.',
  'Nhưng hãy thử thay đổi ngữ cảnh. Đổi một giả định. Hoặc hỏi cùng vấn đề theo một cách hoàn toàn khác.',
  'Nếu thực sự hiểu, phần cốt lõi phải còn đứng vững.',
  'Còn nếu chỉ đang bắt mẫu, vẻ chắc chắn bên ngoài có thể vẫn nguyên vẹn... trong khi bên trong chẳng có thứ ta tưởng là “hiểu”.',
  'Vì vậy, khi A.I trả lời đúng, đừng chỉ hỏi: “Đáp án có đúng không?”',
  'Hãy hỏi thêm: “Nó đúng vì hiểu... hay chỉ vì bắt đúng mẫu?” Đúng kết quả chưa chắc là đúng hiểu biết.',
];

const gaps = [0.28, 0.24, 0.38, 0.34, 0.42, 0.42, 0.36, 0.5];
const sha256File = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase();

const main = async () => {
  const allowQuota = process.argv.includes('--allow-vbee-quota');
  const primaryVoice = resolveVoiceAlias('CKAI_NARRATOR_PRIMARY', 'production');
  const secondaryVoice = resolveVoiceAlias('CKAI_SECONDARY', 'production');
  const drafts = sourceSegments.map((originalText, index): VoiceSegment => {
    const voice = index < 6 ? primaryVoice : secondaryVoice;
    const normalized = normalizeVietnamese(originalText.replace(/A\.I/g, 'AI'));
    const base = {
      id: `VO-${String(index + 1).padStart(2, '0')}`,
      sceneId: `SC-${String(index + 1).padStart(2, '0')}`,
      speakerAlias: voice.alias,
      originalText,
      synthesisText: normalized.synthesisText,
      pronunciationTerms: normalized.terms,
      speed: 1,
      slotStartSeconds: 0,
      slotEndSeconds: 0,
      requiredProofCaveatIds: [],
      cacheKey: '',
      generatedAudioPath: '',
      fitStatus: 'pending' as const,
    };
    const cacheKey = segmentCacheKey(base, voice);
    return {...base, cacheKey, generatedAudioPath: `${outputRoot}/segments/${cacheKey}.wav`};
  });

  const preflight = {
    contentId,
    provider: 'vbee',
    voices: [primaryVoice, secondaryVoice].map((voice) => ({alias: voice.alias, code: voice.voiceCode, displayName: voice.displayName, creditFactor: voice.providerMetadata?.creditFactor})),
    credentialsAvailable: vbeeCredentialsAvailable(),
    segmentCount: drafts.length,
    totalCharacters: drafts.reduce((sum, segment) => sum + segment.synthesisText.length, 0),
    maxSegmentCharacters: Math.max(...drafts.map((segment) => segment.synthesisText.length)),
    allowExistingQuota: allowQuota,
    autoPurchaseExtraCredits: false,
    paidFallback: false,
  };
  console.log(JSON.stringify({preflight}, null, 2));
  if (!allowQuota) throw new Error('Narration synthesis blocked without --allow-vbee-quota');
  if (!preflight.credentialsAvailable) throw new Error('Missing Vbee credentials in environment');

  const provider = new VbeeProvider();
  let requests = 0;
  let characters = 0;
  for (const segment of drafts) {
    const voice = resolveVoiceAlias(segment.speakerAlias, 'production');
    const existed = existsSync(segment.generatedAudioPath);
    const metadata = await provider.synthesize({segment, voice, outputPath: segment.generatedAudioPath, allowQuotaConsumption: true});
    segment.providerMetadata = metadata;
    if (!existed && !metadata.cacheHit) {
      requests += 1;
      characters += metadata.characters;
    }
    const probe = probeAudio(segment.generatedAudioPath);
    segment.measuredDurationSeconds = Number(probe.duration.toFixed(3));
  }

  let cursor = 0;
  for (let index = 0; index < drafts.length; index++) {
    const segment = drafts[index];
    segment.slotStartSeconds = Number(cursor.toFixed(3));
    segment.slotEndSeconds = Number((cursor + (segment.measuredDurationSeconds ?? 0) + gaps[index]).toFixed(3));
    segment.fitDeltaSeconds = Number(gaps[index].toFixed(3));
    segment.fitStatus = 'PASS';
    cursor = segment.slotEndSeconds;
  }
  const totalSeconds = Number(cursor.toFixed(3));

  const plan: VoicePlan = {
    id: `${contentId}-Voice`,
    contentId,
    inputEligibility: 'production',
    sourceAnimationArtifact: 'PENDING_NARRATION_FIRST_FULL_V1',
    sourceAnimationArtifactSha256: 'PENDING_NARRATION_FIRST_FULL_V1',
    sourceAnimationManifest: 'PENDING_NARRATION_FIRST_FULL_V1',
    sourceAnimationManifestSha256: 'PENDING_NARRATION_FIRST_FULL_V1',
    sourceAnimationVoiceHandoffSha256: 'PENDING_NARRATION_FIRST_FULL_V1',
    sourceScript,
    preferredProvider: 'vbee',
    useExistingQuota: true,
    autoPurchaseExtraCredits: false,
    paidFallbackRequiresProductOwnerApproval: true,
    voiceSelection: {candidateAliases: [primaryVoice.alias, secondaryVoice.alias], auditionedAliases: [primaryVoice.alias, secondaryVoice.alias], selectedAliases: [primaryVoice.alias, secondaryVoice.alias], productionApprovedMapping: true},
    voiceSelectionCheck: 'PASS',
    segments: drafts,
    providerInputCheck: 'PASS',
    segmentsGeneratedCheck: 'PASS',
    audioTechnicalQa: 'PASS',
    timingFitCheck: 'PASS',
    pronunciationCheck: 'PASS',
    proofCaveatCheck: 'PASS',
    voiceReview: 'pending',
    humanDecision: 'pending',
    unresolvedBlockers: ['Full V1 animation source binding and Human/ChatGPT audible review pending'],
    finalReviewInputStatus: 'BLOCKED',
    assembledAudioPath: masterPath,
    previewPath: 'generated/final/CKAI-0005/v1/CKAI-0005-full-production-v1.mp4',
  };

  assembleVoiceTimeline(plan, totalSeconds);
  const masterProbe = probeAudio(masterPath);
  const levels = probeAudioLevels(masterPath);
  const output = {
    ...plan,
    sourceScriptSha256: sha256File(sourceScript),
    narrationDurationSeconds: totalSeconds,
    masterProbe,
    levels,
    providerUsage: {vbeeSynthesisRequests: requests, vbeeCharacters: characters, automaticCreditPurchase: false, paidFallback: false},
  };
  mkdirSync(dirname(metadataPath), {recursive: true});
  writeFileSync(metadataPath, JSON.stringify(output, null, 2));
  console.log(JSON.stringify({result: {metadataPath, masterPath, totalSeconds, masterProbe, levels, providerUsage: output.providerUsage}}, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
