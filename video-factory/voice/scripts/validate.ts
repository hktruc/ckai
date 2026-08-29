import {existsSync, readFileSync} from 'node:fs';
import {TEST_0002} from '../../animation/src/manifest/test0002';
import {createTest0002VoicePlan} from '../src/manifest/test0002';
import {probeAudio} from '../src/media';
import {runVoiceQa} from '../src/qa';
import type {VoicePlan} from '../src/model';
import {evaluateFit} from '../src/timing';

const requireAudio = process.argv.includes('--require-audio');
const generatedPlanPath = 'generated/voice/TEST-0002/voice-plan.generated.json';
const plan: VoicePlan = requireAudio && existsSync(generatedPlanPath)
  ? JSON.parse(readFileSync(generatedPlanPath, 'utf8')) as VoicePlan
  : createTest0002VoicePlan();
if (requireAudio) {
  for (const segment of plan.segments) {
    if (!existsSync(segment.generatedAudioPath)) continue;
    const probe = probeAudio(segment.generatedAudioPath);
    const fit = evaluateFit(segment.slotStartSeconds, segment.slotEndSeconds, probe.duration, segment.requiredEndSeconds);
    segment.measuredDurationSeconds = probe.duration;
    segment.fitDeltaSeconds = fit.fitDeltaSeconds;
    segment.fitStatus = fit.fitStatus;
  }
  plan.segmentsGeneratedCheck = plan.segments.every((segment) => existsSync(segment.generatedAudioPath)) ? 'PASS' : 'BLOCKED';
  plan.audioTechnicalQa = plan.segmentsGeneratedCheck;
  plan.timingFitCheck = plan.segments.every((segment) => segment.fitStatus === 'PASS') ? 'PASS' : 'REVISE';
}
const result = runVoiceQa({plan, animation: TEST_0002}, 'reverse-audit-proof', requireAudio);
console.log(`mode=reverse-audit-proof audio=${requireAudio ? 'required' : 'not-required'} final_review_input=${plan.finalReviewInputStatus}`);
if (!result.pass) { result.errors.forEach((error) => console.error(`BLOCKED: ${error}`)); process.exitCode = 1; }
else console.log('voice_qa=PASS');
