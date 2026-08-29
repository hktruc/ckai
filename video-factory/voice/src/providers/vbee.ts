import {existsSync, mkdirSync, statSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import type {SynthRequest, SynthResult, VoiceProvider} from '../model';

const REALTIME_API_URL = 'https://api.vbee.vn/v1/tts';
const ASYNC_API_URL = 'https://vbee.vn/api/v1/tts';
const VOICES_URL = 'https://vbee.vn/api/public/v1/voices';

export const VBEE_REALTIME_SUPPORTED_VOICE_CODES = new Set([
  'hn_male_minhquan_yt-stable',
  'hn_female_ngochuyen_full_48k-fhg',
  'sg_female_tuongvy_call_44k-fhg',
  'hn_female_maiphuong_vdts_48k-fhg',
  'sg_female_lantrinh_vdts_48k-fhg',
  'sg_female_thaotrinh_full_48k-fhg',
]);

export type VbeeCatalogVoice = {
  code: string;
  displayName: string;
  language: string;
  gender: 'male' | 'female' | 'unknown';
  region: null;
  accent: null;
  style: null;
  voiceOwnership: 'VBEE';
  demoUrl: string | null;
  creditFactor: number | null;
  realtimeCompatible: boolean;
};

type VbeeCatalogResponse = {
  status: number;
  result?: {
    pagination?: {has_next_page?: boolean; next_cursor?: string | null};
    voices?: Array<{code?: unknown; name?: unknown; gender?: unknown; language_code?: unknown; demo?: unknown; credit_factor?: unknown}>;
  };
};

const credentials = () => {
  const appId = process.env.VBEE_APP_ID;
  const token = process.env.VBEE_ACCESS_TOKEN;
  if (!appId || !token) throw new Error('Missing VBEE_APP_ID or VBEE_ACCESS_TOKEN');
  return {appId, token};
};

export const vbeeCredentialsAvailable = (): boolean => Boolean(process.env.VBEE_APP_ID && process.env.VBEE_ACCESS_TOKEN);

export type VbeeListOptions = {gender?: 'male' | 'female'; limit?: number; cursor?: string; dryRun?: boolean};

export const listVbeeVoices = async (options: VbeeListOptions = {}) => {
  const limit = options.limit ?? 100;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('Vbee catalog limit must be 1–100');
  const filters = {voiceOwnership: 'VBEE', languageCode: 'vi-VN', gender: options.gender, limit, cursor: options.cursor};
  if (options.dryRun) return {mode: 'dry-run' as const, endpoint: VOICES_URL, credentialsAvailable: vbeeCredentialsAvailable(), filters, voices: [] as VbeeCatalogVoice[]};
  const {appId, token} = credentials();
  const url = new URL(VOICES_URL);
  url.searchParams.set('voiceOwnership', 'VBEE');
  url.searchParams.set('languageCode', 'vi-VN');
  url.searchParams.set('limit', String(limit));
  if (options.gender) url.searchParams.set('gender', options.gender);
  if (options.cursor) url.searchParams.set('cursor', options.cursor);
  const response = await fetch(url, {headers: {Authorization: `Bearer ${token}`, 'App-Id': appId}});
  if (!response.ok) throw new Error(`Vbee voice discovery failed: HTTP ${response.status}`);
  const payload = await response.json() as VbeeCatalogResponse;
  if (payload.status !== 1 || !Array.isArray(payload.result?.voices)) throw new Error('Vbee voice discovery returned an invalid catalog payload');
  const voices = payload.result.voices.map((voice): VbeeCatalogVoice => {
    if (typeof voice.code !== 'string' || typeof voice.name !== 'string' || typeof voice.language_code !== 'string') throw new Error('Vbee catalog voice is missing code/name/language_code');
    return {
      code: voice.code,
      displayName: voice.name,
      language: voice.language_code,
      gender: voice.gender === 'male' || voice.gender === 'female' ? voice.gender : 'unknown',
      region: null,
      accent: null,
      style: null,
      voiceOwnership: 'VBEE',
      demoUrl: typeof voice.demo === 'string' ? voice.demo : null,
      creditFactor: typeof voice.credit_factor === 'number' ? voice.credit_factor : null,
      realtimeCompatible: VBEE_REALTIME_SUPPORTED_VOICE_CODES.has(voice.code),
    };
  });
  return {mode: 'live' as const, endpoint: VOICES_URL, filters, pagination: payload.result.pagination ?? null, voices};
};

export class VbeeProvider implements VoiceProvider {
  readonly id = 'vbee' as const;

  async synthesize({segment, voice, outputPath, allowQuotaConsumption}: SynthRequest): Promise<SynthResult> {
    if (!allowQuotaConsumption) throw new Error('Vbee synthesis requires explicit quota-consumption approval');
    if (!voice.voiceCode) throw new Error(`Vbee alias ${voice.alias} has no voiceCode`);
    if (segment.synthesisText.length > 300) throw new Error(`Vbee realtime segment exceeds 300 characters: ${segment.id}`);
    if (existsSync(outputPath) && statSync(outputPath).size > 0) {
      return {provider: this.id, voiceCode: voice.voiceCode, outputPath, characters: segment.synthesisText.length, cacheHit: true};
    }
    const {appId, token} = credentials();
    const response = await fetch(REALTIME_API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'App-Id': appId},
      body: JSON.stringify({text: segment.synthesisText, mode: 'sync', voiceCode: voice.voiceCode, outputFormat: 'wav', speed: segment.speed})
    });
    const contentType = response.headers.get('content-type') ?? '';
    if (!response.ok || contentType.includes('application/json')) {
      const error = await response.text();
      if (response.status === 400 && /feature is not supported in user package/i.test(error)) {
        return this.synthesizeAsync({segment, voiceCode: voice.voiceCode, outputPath, appId, token});
      }
      const message = `Vbee synthesis blocked: HTTP ${response.status} ${error.slice(0, 300)}`;
      throw new Error(message);
    }
    const audio = Buffer.from(await response.arrayBuffer());
    if (!audio.length) throw new Error('Vbee returned empty audio');
    mkdirSync(dirname(outputPath), {recursive: true});
    writeFileSync(outputPath, audio);
    return {provider: this.id, voiceCode: voice.voiceCode, outputPath, characters: segment.synthesisText.length, cacheHit: false};
  }

  private async synthesizeAsync({segment, voiceCode, outputPath, appId, token}: {segment: SynthRequest['segment']; voiceCode: string; outputPath: string; appId: string; token: string}): Promise<SynthResult> {
    const response = await fetch(ASYNC_API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'App-Id': appId},
      body: JSON.stringify({
        app_id: appId,
        response_type: 'indirect',
        callback_url: 'https://vbee.vn',
        input_text: segment.synthesisText,
        voice_code: voiceCode,
        audio_type: 'wav',
        speed_rate: segment.speed,
      }),
    });
    const payload = await response.json() as {status?: number; error_code?: string; error_message?: string; result?: {request_id?: string; status?: string; audio_link?: string}};
    if (!response.ok || payload.status !== 1 || !payload.result?.request_id) {
      throw Object.assign(new Error(`Vbee asynchronous synthesis blocked: HTTP ${response.status} ${payload.error_message ?? payload.error_code ?? 'invalid response'}`), {code: 'VBEE_ASYNC_REQUEST_BLOCKED'});
    }
    const requestId = payload.result.request_id;
    let audioLink = payload.result.audio_link;
    for (let attempt = 0; !audioLink && attempt < 60; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
      const statusResponse = await fetch(`${ASYNC_API_URL}/${requestId}`, {headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'App-Id': appId}});
      if (!statusResponse.ok) continue;
      const statusPayload = await statusResponse.json() as {status?: number; error_message?: string; result?: {status?: string; audio_link?: string}};
      if (statusPayload.status === 1 && statusPayload.result?.status === 'SUCCESS' && statusPayload.result.audio_link) audioLink = statusPayload.result.audio_link;
      if (statusPayload.result?.status === 'FAILURE') throw Object.assign(new Error(`Vbee asynchronous synthesis failed: ${statusPayload.error_message ?? requestId}`), {code: 'VBEE_ASYNC_SYNTHESIS_FAILED'});
    }
    if (!audioLink) throw Object.assign(new Error(`Vbee asynchronous synthesis timed out: ${requestId}`), {code: 'VBEE_ASYNC_TIMEOUT'});
    const audioResponse = await fetch(audioLink);
    if (!audioResponse.ok) throw Object.assign(new Error(`Vbee audio download failed: HTTP ${audioResponse.status}`), {code: 'VBEE_AUDIO_DOWNLOAD_FAILED'});
    const audio = Buffer.from(await audioResponse.arrayBuffer());
    if (!audio.length) throw Object.assign(new Error('Vbee returned empty asynchronous audio'), {code: 'VBEE_EMPTY_AUDIO'});
    mkdirSync(dirname(outputPath), {recursive: true});
    writeFileSync(outputPath, audio);
    return {provider: this.id, voiceCode, outputPath, characters: segment.synthesisText.length, requestId, cacheHit: false};
  }
}
