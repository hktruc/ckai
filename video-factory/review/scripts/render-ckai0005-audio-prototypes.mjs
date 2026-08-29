import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root = process.cwd();
const sampleRate = 48_000;
const durationSeconds = 43.328;
const totalFrames = Math.round(sampleRate * durationSeconds);
const sourceVideo = resolve(root, 'generated/final/CKAI-0005/v1-1/CKAI-0005-full-production-v1-1.mp4');
const narrationPath = resolve(root, 'generated/voice/CKAI-0005/master.wav');
const outputDir = resolve(root, 'generated/audio-prototypes/CKAI-0005/v1');
const ffmpeg = resolve(root, 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const ffprobe = resolve(root, 'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');

for (const path of [sourceVideo, narrationPath, ffmpeg, ffprobe]) {
  if (!existsSync(path)) throw new Error(`Required input missing: ${path}`);
}
mkdirSync(outputDir, {recursive: true});

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase();
const rel = (path) => relative(root, path).replaceAll('\\', '/');
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (value) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const windowEnvelope = (time, start, end, fade = 0.25) => {
  if (time < start || time > end) return 0;
  return Math.min(smooth((time - start) / fade), smooth((end - time) / fade));
};

const readPcm16MonoWav = (path) => {
  const buffer = readFileSync(path);
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') throw new Error('Narration is not RIFF/WAVE');
  let offset = 12; let fmt; let data;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (id === 'fmt ') fmt = {format: buffer.readUInt16LE(start), channels: buffer.readUInt16LE(start + 2), sampleRate: buffer.readUInt32LE(start + 4), bits: buffer.readUInt16LE(start + 14)};
    if (id === 'data') data = buffer.subarray(start, start + size);
    offset = start + size + (size % 2);
  }
  if (!fmt || !data || fmt.format !== 1 || fmt.channels !== 1 || fmt.sampleRate !== sampleRate || fmt.bits !== 16) throw new Error(`Unsupported narration WAV: ${JSON.stringify(fmt)}`);
  const samples = new Float32Array(totalFrames);
  const available = Math.min(totalFrames, Math.floor(data.length / 2));
  for (let index = 0; index < available; index++) samples[index] = data.readInt16LE(index * 2) / 32768;
  return samples;
};

const writeStereoWav = (path, samples) => {
  const dataBytes = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataBytes);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + dataBytes, 4); buffer.write('WAVE', 8);
  buffer.write('fmt ', 12); buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 4, 28); buffer.writeUInt16LE(4, 32); buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36); buffer.writeUInt32LE(dataBytes, 40);
  for (let index = 0; index < samples.length; index++) buffer.writeInt16LE(Math.round(clamp(samples[index], -1, 0.999969) * 32767), 44 + index * 2);
  writeFileSync(path, buffer);
};

const run = (binary, args, label) => {
  const result = spawnSync(binary, args, {cwd: root, encoding: 'utf8', timeout: 300_000, maxBuffer: 20 * 1024 * 1024});
  if (result.status !== 0) throw new Error(`${label} failed:\n${result.stderr || result.stdout}`);
  return result.stdout;
};

const addTone = (side, {start, duration, frequency, endFrequency = frequency, amplitude, pan = 0, attack = 0.02, release = 0.15, harmonics = []}) => {
  const begin = Math.max(0, Math.floor(start * sampleRate));
  const end = Math.min(totalFrames, Math.ceil((start + duration) * sampleRate));
  let phase = 0;
  for (let frame = begin; frame < end; frame++) {
    const local = (frame - begin) / sampleRate;
    const progress = local / duration;
    const freq = frequency + (endFrequency - frequency) * progress;
    phase += 2 * Math.PI * freq / sampleRate;
    const envelope = Math.min(1, local / attack, (duration - local) / release);
    let value = Math.sin(phase);
    for (const [multiple, level] of harmonics) value += Math.sin(phase * multiple) * level;
    value *= amplitude * smooth(envelope);
    const left = Math.sqrt((1 - pan) / 2); const right = Math.sqrt((1 + pan) / 2);
    side[frame * 2] += value * left;
    side[frame * 2 + 1] += value * right;
  }
};

const addNoise = (side, {start, duration, amplitude, pan = 0, attack = 0.08, release = 0.25, seed = 1, color = 0.82}) => {
  const begin = Math.max(0, Math.floor(start * sampleRate));
  const end = Math.min(totalFrames, Math.ceil((start + duration) * sampleRate));
  let state = seed >>> 0; let filtered = 0;
  for (let frame = begin; frame < end; frame++) {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    const white = ((state >>> 0) / 0xFFFFFFFF) * 2 - 1;
    filtered = filtered * color + white * (1 - color);
    const local = (frame - begin) / sampleRate;
    const envelope = Math.min(1, local / attack, (duration - local) / release);
    const value = filtered * amplitude * smooth(envelope);
    const left = Math.sqrt((1 - pan) / 2); const right = Math.sqrt((1 + pan) / 2);
    side[frame * 2] += value * left; side[frame * 2 + 1] += value * right;
  }
};

const addClickCluster = (side, time, intensity, spacing, count, panSpread = 0.5) => {
  for (let index = 0; index < count; index++) {
    const pan = count === 1 ? 0 : -panSpread + (2 * panSpread * index) / (count - 1);
    addTone(side, {start: time + index * spacing, duration: 0.11, frequency: 920 + index * 170, endFrequency: 640 + index * 130, amplitude: intensity, pan, attack: 0.002, release: 0.095, harmonics: [[2, 0.35], [3, 0.12]]});
  }
};

const createA = () => {
  const side = new Float32Array(totalFrames * 2);
  let phase55 = 0; let phase82 = 0; let phase165 = 0; let phase220 = 0;
  for (let frame = 0; frame < totalFrames; frame++) {
    const time = frame / sampleRate;
    const opening = windowEnvelope(time, 0, 5.0, 0.8);
    const pattern = windowEnvelope(time, 4.55, 15.25, 0.7);
    const context = windowEnvelope(time, 14.75, 21.45, 0.7);
    const core = windowEnvelope(time, 21.1, 31.45, 0.8);
    const reflective = windowEnvelope(time, 31.15, 36.75, 0.7);
    const ending = windowEnvelope(time, 36.35, durationSeconds, 0.8);
    const drop = 1 - 0.94 * windowEnvelope(time, 29.42, 30.18, 0.12);
    const amp = (0.010 * opening + 0.015 * pattern + 0.012 * context + 0.008 * core + 0.006 * reflective + 0.010 * ending) * drop;
    const detune = context * 0.55;
    phase55 += 2 * Math.PI * (55 + detune) / sampleRate;
    phase82 += 2 * Math.PI * (82.4069 - detune * 0.45) / sampleRate;
    phase165 += 2 * Math.PI * 164.8138 / sampleRate;
    phase220 += 2 * Math.PI * (ending ? 219.2 : 220) / sampleRate;
    const slow = 0.88 + 0.12 * Math.sin(2 * Math.PI * 0.071 * time);
    const left = amp * (Math.sin(phase55) * 0.78 * slow + Math.sin(phase82 + 0.25) * 0.42 + Math.sin(phase165) * 0.17 + Math.sin(phase220) * ending * 0.08);
    const right = amp * (Math.sin(phase55 + 0.02) * 0.78 * slow + Math.sin(phase82 + 0.58) * 0.42 + Math.sin(phase165 + 0.12) * 0.17 + Math.sin(phase220 + 0.2) * ending * 0.08);
    side[frame * 2] += left; side[frame * 2 + 1] += right;
  }
  for (let time = 5.15; time < 14.8; time += 1.05) addClickCluster(side, time, 0.017, 0.055, 2, 0.32);
  for (const time of [6.1, 8.2, 10.3, 12.4, 14.5]) addTone(side, {start: time, duration: 0.34, frequency: 110, endFrequency: 82.4, amplitude: 0.018, pan: time % 2 > 1 ? -0.2 : 0.2, attack: 0.01, release: 0.28, harmonics: [[2, 0.22]]});
  addClickCluster(side, 1.82, 0.052, 0.035, 2, 0.16);
  addClickCluster(side, 5.20, 0.043, 0.075, 3, 0.48);
  addTone(side, {start: 8.40, duration: 0.52, frequency: 180, endFrequency: 92, amplitude: 0.066, attack: 0.008, release: 0.42, harmonics: [[2, 0.28], [6, 0.07]]});
  addTone(side, {start: 16.74, duration: 1.12, frequency: 430, endFrequency: 105, amplitude: 0.048, pan: 0.28, attack: 0.04, release: 0.34, harmonics: [[2, 0.15]]});
  addNoise(side, {start: 16.72, duration: 1.22, amplitude: 0.035, pan: 0.35, attack: 0.04, release: 0.38, seed: 5005, color: 0.94});
  addTone(side, {start: 18.34, duration: 0.82, frequency: 104, endFrequency: 78, amplitude: 0.055, pan: -0.18, attack: 0.035, release: 0.62, harmonics: [[2, 0.26], [5, 0.08]]});
  addNoise(side, {start: 22.04, duration: 0.95, amplitude: 0.030, pan: -0.15, attack: 0.12, release: 0.46, seed: 2205, color: 0.91});
  addTone(side, {start: 22.13, duration: 0.55, frequency: 330, endFrequency: 148, amplitude: 0.032, pan: 0.1, attack: 0.02, release: 0.44});
  addNoise(side, {start: 29.56, duration: 0.62, amplitude: 0.008, attack: 0.15, release: 0.18, seed: 3005, color: 0.975});
  addTone(side, {start: 30.20, duration: 0.9, frequency: 72, endFrequency: 55, amplitude: 0.062, attack: 0.018, release: 0.75, harmonics: [[3, 0.24], [5, 0.07]]});
  addClickCluster(side, 38.86, 0.034, 0.055, 2, 0.12);
  addTone(side, {start: 38.90, duration: 2.6, frequency: 220, endFrequency: 164.8, amplitude: 0.014, pan: 0, attack: 0.3, release: 1.4, harmonics: [[2, 0.18]]});
  addTone(side, {start: 10.22, duration: 0.5, frequency: 960, endFrequency: 1460, amplitude: 0.012, pan: 0.55, attack: 0.08, release: 0.25});
  addTone(side, {start: 36.58, duration: 0.7, frequency: 740, endFrequency: 440, amplitude: 0.010, pan: -0.5, attack: 0.08, release: 0.42});
  return side;
};

const createB = () => {
  const side = new Float32Array(totalFrames * 2);
  let phase73 = 0; let phase110 = 0; let phase175 = 0; let phase233 = 0;
  for (let frame = 0; frame < totalFrames; frame++) {
    const time = frame / sampleRate;
    const opening = windowEnvelope(time, 0, 5.0, 0.7);
    const pattern = windowEnvelope(time, 4.45, 15.25, 0.7);
    const context = windowEnvelope(time, 14.65, 21.5, 0.55);
    const coreBuild = windowEnvelope(time, 20.9, 29.35, 0.8) * (0.65 + 0.35 * clamp((time - 21) / 8));
    const reflective = windowEnvelope(time, 30.85, 36.8, 0.7);
    const ending = windowEnvelope(time, 36.25, durationSeconds, 0.8);
    const stop = 1 - 0.82 * windowEnvelope(time, 15.02, 15.58, 0.08);
    const drop = 1 - 0.975 * windowEnvelope(time, 29.12, 30.36, 0.12);
    const amp = (0.015 * opening + 0.024 * pattern + 0.022 * context + 0.026 * coreBuild + 0.009 * reflective + 0.014 * ending) * stop * drop;
    const destabilize = context * 1.6;
    phase73 += 2 * Math.PI * (73.416 + destabilize) / sampleRate;
    phase110 += 2 * Math.PI * (110 - destabilize * 0.4) / sampleRate;
    phase175 += 2 * Math.PI * (174.614 + destabilize * 0.2) / sampleRate;
    phase233 += 2 * Math.PI * (ending ? 231.5 : 233.082) / sampleRate;
    const breath = 0.82 + 0.18 * Math.sin(2 * Math.PI * 0.095 * time);
    side[frame * 2] += amp * (Math.sin(phase73) * 0.78 * breath + Math.sin(phase110 + 0.24) * 0.48 + Math.sin(phase175) * 0.25 + Math.sin(phase233) * ending * 0.12);
    side[frame * 2 + 1] += amp * (Math.sin(phase73 + 0.025) * 0.78 * breath + Math.sin(phase110 + 0.64) * 0.48 + Math.sin(phase175 + 0.18) * 0.25 + Math.sin(phase233 + 0.28) * ending * 0.12);
  }
  for (let time = 4.95; time < 14.9; time += 0.72) {
    addTone(side, {start: time, duration: 0.28, frequency: 148, endFrequency: 96, amplitude: 0.036, pan: Math.sin(time) * 0.28, attack: 0.008, release: 0.22, harmonics: [[2, 0.28], [6, 0.06]]});
    if (Math.round(time * 100) % 2 === 0) addClickCluster(side, time + 0.04, 0.019, 0.045, 2, 0.4);
  }
  for (const time of [21.9, 23.0, 24.1, 25.2, 26.3, 27.4, 28.35]) addTone(side, {start: time, duration: 0.48, frequency: 92, endFrequency: 74, amplitude: 0.038 + (time - 21.9) * 0.002, attack: 0.02, release: 0.36, harmonics: [[2, 0.32], [4, 0.08]]});
  addTone(side, {start: 0.58, duration: 1.45, frequency: 146.8, endFrequency: 110, amplitude: 0.034, pan: -0.12, attack: 0.2, release: 0.8, harmonics: [[2, 0.22]]});
  addClickCluster(side, 2.02, 0.057, 0.052, 2, 0.22);
  addClickCluster(side, 5.12, 0.049, 0.065, 4, 0.56);
  addTone(side, {start: 8.36, duration: 0.66, frequency: 220, endFrequency: 82, amplitude: 0.078, attack: 0.01, release: 0.5, harmonics: [[2, 0.32], [5, 0.09]]});
  addTone(side, {start: 14.48, duration: 0.72, frequency: 180, endFrequency: 640, amplitude: 0.030, pan: -0.35, attack: 0.18, release: 0.12, harmonics: [[2, 0.15]]});
  addNoise(side, {start: 14.42, duration: 0.82, amplitude: 0.032, pan: -0.4, attack: 0.18, release: 0.12, seed: 1405, color: 0.93});
  addTone(side, {start: 16.72, duration: 1.28, frequency: 520, endFrequency: 88, amplitude: 0.058, pan: 0.3, attack: 0.025, release: 0.42, harmonics: [[2, 0.2]]});
  addNoise(side, {start: 16.66, duration: 1.34, amplitude: 0.041, pan: 0.38, attack: 0.04, release: 0.42, seed: 1605, color: 0.92});
  addTone(side, {start: 18.30, duration: 1.0, frequency: 126, endFrequency: 69, amplitude: 0.071, pan: -0.2, attack: 0.035, release: 0.74, harmonics: [[2, 0.31], [5, 0.1]]});
  addNoise(side, {start: 22.00, duration: 1.16, amplitude: 0.038, pan: -0.25, attack: 0.16, release: 0.5, seed: 2206, color: 0.9});
  addTone(side, {start: 22.05, duration: 0.72, frequency: 420, endFrequency: 132, amplitude: 0.042, pan: 0.18, attack: 0.03, release: 0.55});
  addNoise(side, {start: 29.26, duration: 0.95, amplitude: 0.006, attack: 0.2, release: 0.24, seed: 3006, color: 0.98});
  addTone(side, {start: 30.34, duration: 1.18, frequency: 78, endFrequency: 55, amplitude: 0.086, attack: 0.016, release: 0.96, harmonics: [[2, 0.32], [4, 0.11], [7, 0.04]]});
  addClickCluster(side, 38.78, 0.039, 0.065, 3, 0.2);
  addTone(side, {start: 38.80, duration: 3.1, frequency: 146.8, endFrequency: 116.5, amplitude: 0.024, attack: 0.34, release: 1.5, harmonics: [[2, 0.22], [3, 0.08]]});
  return side;
};

const narration = readPcm16MonoWav(narrationPath);

const renderVersion = ({id, slug, side, voiceGain, sideGain, duckDepth, targetLufs, cues, drop}) => {
  const sidePath = join(outputDir, `${id}-music-sfx-mix.wav`);
  const rawMixPath = join(outputDir, `.${id}-raw-mix.wav`);
  const mixPath = join(outputDir, `${id}-final-mix.wav`);
  const mp4Path = join(outputDir, `CKAI-0005-audio-prototype-${slug}.mp4`);
  writeStereoWav(sidePath, side);
  const mixed = new Float32Array(totalFrames * 2);
  let envelope = 0;
  for (let frame = 0; frame < totalFrames; frame++) {
    const voice = narration[frame] ?? 0;
    const absolute = Math.abs(voice);
    const coefficient = absolute > envelope ? 0.00208 : 0.00016;
    envelope += (absolute - envelope) * coefficient;
    const activity = smooth((envelope - 0.004) / 0.045);
    const duck = 1 - duckDepth * activity;
    const left = voice * voiceGain + side[frame * 2] * sideGain * duck;
    const right = voice * voiceGain + side[frame * 2 + 1] * sideGain * duck;
    mixed[frame * 2] = Math.tanh(left * 1.06) / 1.06;
    mixed[frame * 2 + 1] = Math.tanh(right * 1.06) / 1.06;
  }
  writeStereoWav(rawMixPath, mixed);
  run(ffmpeg, ['-hide_banner','-loglevel','error','-y','-i',rawMixPath,'-af',`loudnorm=I=${targetLufs}:TP=-1.5:LRA=7`,'-ar','48000','-ac','2','-c:a','pcm_s16le',mixPath], `${id} loudness normalization`);
  run(ffmpeg, ['-hide_banner','-loglevel','error','-y','-i',sourceVideo,'-i',mixPath,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-ac','2','-t',String(durationSeconds),'-movflags','+faststart',mp4Path], `${id} mux`);
  return {id, sidePath: rel(sidePath), sideSha256: sha256(sidePath), mixPath: rel(mixPath), mixSha256: sha256(mixPath), mp4Path: rel(mp4Path), mp4Sha256: sha256(mp4Path), cues, drop};
};

const versionA = renderVersion({
  id: 'A', slug: 'A-precision-minimal', side: createA(), voiceGain: 0.70, sideGain: 0.86, duckDepth: 0.46, targetLufs: -15.5,
  cues: [
    ['01: surface lock', 1.82], ['02: pattern assembly', 5.20], ['03: confident collapse', 8.40], ['04: assumption withdrawal', 16.74],
    ['05: structural reaction', 18.34], ['06: shell/core open', 22.04], ['07: hollow-core absence/impact', 29.56], ['08: transformed callback', 38.86],
  ], drop: [29.42, 30.20],
});
const versionB = renderVersion({
  id: 'B', slug: 'B-tension-editorial', side: createB(), voiceGain: 0.68, sideGain: 0.75, duckDepth: 0.54, targetLufs: -15.4,
  cues: [
    ['01: warm opening motif/lock', 0.58], ['02: pattern drive', 5.12], ['03: confident collapse', 8.36], ['04: context destabilization', 14.42],
    ['05: assumption withdrawal', 16.66], ['06: structural reaction/core open', 18.30], ['07: hollow-core drop/impact', 29.26], ['08: transformed callback', 38.78],
  ], drop: [29.12, 30.34],
});

const manifestPath = join(outputDir, 'audio-prototype-manifest.json');
const manifest = {
  id: 'CKAI-0005-AUDIO-PROTOTYPE-AB-V1', status: 'PENDING_HUMAN_REVIEW',
  sourceVisualMaster: rel(sourceVideo), sourceVisualMasterSha256: sha256(sourceVideo), visualPolicy: 'H264 video stream copied without re-render',
  narration: {path: rel(narrationPath), sha256: sha256(narrationPath), treatment: 'exact samples and timing preserved; centered; gain-only narration-first mix; no TTS, stretch, pitch or identity change'},
  musicAndSfx: {source: 'CKAI_PROCEDURAL_GENERATION', generator: 'one-off CKAI-0005 hand-authored local synthesis', rightsStatus: 'CKAI_ORIGINAL_INTERNAL', containsExternalSamples: false, license: 'project-original internal asset; no attribution required', externalProvider: null},
  versions: [versionA, versionB],
  providerUsage: {vbeeCalls: 0, generatedProviderAudioCalls: 0, externalMusicCalls: 0, externalSfxCalls: 0, paidCalls: 0, unexpectedPaidActions: 0},
  boundaries: {phase2AudioEngine: 'NOT_STARTED', publishing: 'NOT_PERFORMED', releaseApproval: 'NOT_SELF_GRANTED'},
};
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({status: 'PASS', outputDir: rel(outputDir), manifest: rel(manifestPath), sourceVideoSha256: manifest.sourceVisualMasterSha256, narrationSha256: manifest.narration.sha256, versions: [versionA, versionB]}, null, 2));
