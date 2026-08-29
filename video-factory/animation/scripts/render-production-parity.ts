import {existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import {basename, dirname, join, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {deriveCanonicalAnimationManifest} from '../../../runtime/production-bridge/src/canonical-adapter';
import {sha256File} from '../../../runtime/production-bridge/src/core.mjs';
import {GENERIC_ART_DIRECTION_GALLERY} from '../src/GenericArtDirectionGallery';
import {capabilityPresence, evaluateProductionParity, type ParityCapabilities} from '../src/visual-system/production-parity';

const root = process.cwd();
const contentId = process.argv[2] ?? 'CKAI-0004';
const version = process.argv[3] ?? 'v3';
if (!/^CKAI-\d{4}$/.test(contentId) || !/^v\d+$/.test(version)) throw new Error('Usage: render-production-parity.ts CKAI-0004 v3');

const atomicWrite = (path: string, value: string) => { mkdirSync(dirname(path), {recursive: true}); const temporary = `${path}.${process.pid}.tmp`; writeFileSync(temporary, value, 'utf8'); renameSync(temporary, path); };
const approvedDirectory = join(root, 'content/approved');
const approvedNames = readdirSync(approvedDirectory).filter((name) => name.startsWith(`${contentId}_`) && name.endsWith('.md'));
if (approvedNames.length !== 1) throw new Error(`Exactly one approved STEP 02 artifact is required for ${contentId}`);
const approvedPath = join(approvedDirectory, approvedNames[0]);
const approvedShaBefore = sha256File(approvedPath);
const job = {contentId, requestedAction: 'produce-to-review-package' as const, source: {artifactPath: relative(root, approvedPath).replaceAll('\\', '/'), sha256: approvedShaBefore}, approval: {}, providerPolicy: {allowVbeeQuota: false, autoPurchaseCredits: false, allowPaidFallback: false}};
const derived = deriveCanonicalAnimationManifest(job, root);

const productionDirectory = join(root, 'generated/production', contentId, version);
const fullDirectory = join(root, 'generated/previews', `${contentId}-${version}-production-frames`);
const mobileDirectory = join(root, 'generated/previews', `${contentId}-${version}-production-frames-mobile`);
const montagePath = join(root, 'generated/previews', `${contentId}-${version}-production-parity-montage.png`);
const manifestPath = join(productionDirectory, 'animation-manifest.generated.json');
const propsPath = join(productionDirectory, 'animation-props.json');
mkdirSync(productionDirectory, {recursive: true});
atomicWrite(manifestPath, `${JSON.stringify(derived.manifest, null, 2)}\n`);
atomicWrite(propsPath, `${JSON.stringify({manifest: derived.manifest, audioPublicPath: null, captions: [], stage: 'animation'}, null, 2)}\n`);

const frames = derived.manifest.scenes.map((scene) => Math.floor(((scene.startSeconds + scene.endSeconds) / 2) * derived.manifest.fps));
const remotionEntrypoint = join(root, 'node_modules/@remotion/cli/remotion-cli.js');
if (!existsSync(remotionEntrypoint)) throw new Error('Local Remotion CLI is missing');
const run = (command: string, args: string[], code: string) => { const result = spawnSync(command, args, {cwd: root, encoding: 'utf8', timeout: 600_000}); if (result.status !== 0) throw new Error(`${code}: ${(result.stderr || result.stdout).slice(-2000)}`); };
const renderFrames = (output: string, scale?: number) => run(process.execPath, [remotionEntrypoint, 'render', 'video-factory/animation/src/index.ts', 'CKAI-Generic-Pipeline', output, `--props=${propsPath}`, `--frames=${frames.join(',')}`, '--sequence', '--image-format=png', ...(scale ? [`--scale=${scale}`] : [])], 'PRODUCTION_PARITY_RENDER_FAILED');
renderFrames(fullDirectory);
renderFrames(mobileDirectory, 1 / 3);
const pngs = (directory: string) => readdirSync(directory).filter((name) => name.endsWith('.png')).sort().map((name) => join(directory, name));
const fullFrames = pngs(fullDirectory); const mobileFrames = pngs(mobileDirectory);
if (fullFrames.length !== derived.manifest.scenes.length || mobileFrames.length !== derived.manifest.scenes.length) throw new Error('Rendered frame count does not match production scene count');
run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...mobileFrames.flatMap((path) => ['-i', path]), '-filter_complex', 'xstack=inputs=6:layout=0_0|360_0|720_0|0_640|360_640|720_640', '-frames:v', '1', montagePath], 'PRODUCTION_PARITY_MONTAGE_FAILED');

const galleryCapabilities = GENERIC_ART_DIRECTION_GALLERY.scenes.map((scene, index) => capabilityPresence(scene, GENERIC_ART_DIRECTION_GALLERY.voiceHandoff.sceneSlots[index].spokenCopy));
const capabilityKeys = Object.keys(galleryCapabilities[0]) as Array<keyof ParityCapabilities>;
const referenceBaseline = Object.fromEntries(capabilityKeys.map((key) => [key, galleryCapabilities.every((capability) => capability[key])])) as ParityCapabilities;
const rendererSource = readFileSync(join(root, 'video-factory/animation/src/GenericPipeline.tsx'), 'utf8');
const report = evaluateProductionParity({contentId, manifest: derived.manifest, fullFrames, mobileFrames, referenceBaseline, noDemoOnlyBranch: !/manifest\.id\s*===|CKAI0004Film/.test(rendererSource)});
const reportPath = join(productionDirectory, 'visual-parity-report.json');
atomicWrite(reportPath, `${JSON.stringify({...report, approvedSourceSha256: approvedShaBefore, montagePath: relative(root, montagePath).replaceAll('\\', '/')}, null, 2)}\n`);
const markdownPath = join(productionDirectory, 'visual-parity-report.md');
atomicWrite(markdownPath, `# ${contentId} ${version.toUpperCase()} Production Visual Parity\n\n- Status: **${report.pass ? 'PASS' : 'FAIL'}**\n- Approved STEP 02 SHA-256: \`${approvedShaBefore}\`\n- Full-size frames: \`${relative(root, fullDirectory).replaceAll('\\', '/')}\`\n- Mobile frames: \`${relative(root, mobileDirectory).replaceAll('\\', '/')}\`\n- Montage: \`${relative(root, montagePath).replaceAll('\\', '/')}\`\n- No demo-only renderer branch: **${report.noDemoOnlyBranch ? 'PASS' : 'FAIL'}**\n- Composition diversity: **${report.compositionDiversity ? 'PASS' : 'FAIL'}**\n\n${report.scenes.map((scene) => `- ${scene.sceneId}: **${scene.pass ? 'PASS' : 'FAIL'}**${scene.failures.length ? ` — ${scene.failures.join(', ')}` : ''}`).join('\n')}\n`);
const slug = basename(approvedPath, '.md').replace(new RegExp(`^${contentId}_?`), '');
const animationArtifact = join(root, 'content/animations', `${contentId}_${slug}_animation-${version}.md`);
atomicWrite(animationArtifact, `---\nid: ${contentId}\ntype: short-form-animation-parity-candidate\nsource_visual_direction: ${relative(dirname(animationArtifact), derived.canonical.visual.path).replaceAll('\\', '/')}\nsource_visual_direction_sha256: ${sha256File(derived.canonical.visual.path)}\nexecutable_manifest: ${relative(dirname(animationArtifact), manifestPath).replaceAll('\\', '/')}\ncomposition_id: CKAI-Generic-Pipeline\nformat: 1080x1920\nfps: 30\ntotal_seconds: ${derived.manifest.totalSeconds}\nvisual_parity_qa: ${report.pass ? 'PASS' : 'BLOCKED'}\nanimation_review: pending\nhuman_decision: pending\nvoice_handoff_status: BLOCKED\nunresolved_blockers: ${report.pass ? 'Product Owner and ChatGPT visual review pending' : 'VISUAL_PARITY_FAILED'}\n---\n\n# Production Visual Parity Candidate\n\nNo audio was generated or muxed. This candidate cannot confer Voice, Final Review, Export or Release authority.\n`);
if (sha256File(approvedPath) !== approvedShaBefore) throw new Error('Approved STEP 02 content changed during production parity render');
console.log(JSON.stringify({status: report.pass ? 'PASS' : 'FAIL', contentId, version, manifest: relative(root, manifestPath).replaceAll('\\', '/'), fullFrames: fullFrames.map((path) => relative(root, path).replaceAll('\\', '/')), mobileFrames: mobileFrames.map((path) => relative(root, path).replaceAll('\\', '/')), montage: relative(root, montagePath).replaceAll('\\', '/'), report: relative(root, reportPath).replaceAll('\\', '/')}, null, 2));
if (!report.pass) process.exitCode = 2;
