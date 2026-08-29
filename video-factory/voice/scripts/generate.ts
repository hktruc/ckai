import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {assembleVoiceTimeline} from '../src/assembly';
import {probeAudio} from '../src/media';
import {createTest0002VoicePlan} from '../src/manifest/test0002';
import type {SynthResult, VoiceProvider} from '../src/model';
import {PiperProvider} from '../src/providers/piper';
import {VbeeProvider} from '../src/providers/vbee';
import {resolveVoiceAlias} from '../src/registry';
import {configureDefaultPiperEnvironment} from '../src/runtime-env';
import {runVoiceQa} from '../src/qa';
import {evaluateFit} from '../src/timing';
import {TEST_0002} from '../../animation/src/manifest/test0002';

const main = async () => {
  configureDefaultPiperEnvironment();
  const plan = createTest0002VoicePlan();
  const allowQuota = process.argv.includes('--allow-vbee-quota');
  const providers: Record<string, VoiceProvider> = {piper: new PiperProvider(), vbee: new VbeeProvider()};

  for (const segment of plan.segments) {
    const voice = resolveVoiceAlias(segment.speakerAlias, 'reverse-audit-proof');
    let providerMetadata: SynthResult;
    if (!existsSync(segment.generatedAudioPath)) {
      providerMetadata = await providers[voice.provider].synthesize({segment, voice, outputPath: segment.generatedAudioPath, allowQuotaConsumption: allowQuota});
    } else {
      providerMetadata = {
        provider: voice.provider,
        voiceCode: voice.voiceCode ?? `${voice.provider}:${voice.speakerId ?? 'default'}`,
        outputPath: segment.generatedAudioPath,
        characters: segment.synthesisText.length,
        cacheHit: true,
      };
    }
    segment.providerMetadata = providerMetadata;
    const probe = probeAudio(segment.generatedAudioPath);
    const fit = evaluateFit(segment.slotStartSeconds, segment.slotEndSeconds, probe.duration, segment.requiredEndSeconds);
    segment.measuredDurationSeconds = Number(probe.duration.toFixed(3));
    segment.fitDeltaSeconds = fit.fitDeltaSeconds;
    segment.fitStatus = fit.fitStatus;
  }

  plan.segmentsGeneratedCheck = 'PASS';
  plan.audioTechnicalQa = 'PASS';
  plan.timingFitCheck = plan.segments.every((segment) => segment.fitStatus === 'PASS') ? 'PASS' : 'REVISE';
  if (plan.timingFitCheck !== 'PASS') throw new Error('One or more Voice segments exceed approved Animation slots');
  assembleVoiceTimeline(plan, TEST_0002.totalSeconds);
  const qa = runVoiceQa({plan, animation: TEST_0002}, 'reverse-audit-proof', true);
  if (!qa.pass) throw new Error(qa.errors.join('\n'));
  const metadataPath = 'generated/voice/TEST-0002/voice-plan.generated.json';
  mkdirSync(dirname(metadataPath), {recursive: true});
  writeFileSync(metadataPath, JSON.stringify(plan, null, 2));
  console.log(`voice_segments=${plan.segments.length} assembled=${plan.assembledAudioPath} final_review_input=${plan.finalReviewInputStatus}`);
};

main().catch((error) => { console.error(error); process.exitCode = 1; });
