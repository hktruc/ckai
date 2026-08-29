import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createOpenAiClient, generateImageBinary, loadLocalEnv, sha256, visionQaActualBinary} from '../src/openai-service';
import {visualIntelligenceConfig} from '../src/config';
import {enforceVisionHardGates, redactSecrets} from '../src/qa';
import type {KeyVisualBriefV1} from '../src/model';

const root = process.cwd();
const envPath = resolve(root, '.env');
if (existsSync(envPath)) loadLocalEnv(envPath);
const detected = Boolean(process.env.OPENAI_API_KEY?.trim());
const config = visualIntelligenceConfig();
const outputDir = resolve(root, 'generated', 'visual-intelligence', 'openai-smoke');
mkdirSync(outputDir, {recursive: true});

const report: Record<string, unknown> = {
  openai_api_key_detected: detected ? 'YES' : 'NO', image_model: config.imageModel, vision_model: config.visionModel,
  connectivity: 'FAIL', image_model_call: 'FAIL', vision_model_call: 'FAIL', generated_asset: null, qa_artifact: null,
};

const brief: KeyVisualBriefV1 = {
  scene_id:'SMOKE-SC-01', semantic_core:'A confident statement remains unresolved because its evidence link is missing', viewer_should_see:'One polished graphite chain of reasoning that visibly stops before a missing evidentiary interval', primary_visual_idea:'An incomplete evidentiary circuit whose missing interval controls the composition',
  must_show:['one incomplete relationship','one dominant missing interval'], must_not_show:['text','logo','screenshot','dashboard','chart','document','generic AI brain','fake evidence'],
  composition:{focal_subject:'incomplete graphite evidence circuit',subject_position:'centered slightly above mid-frame',foreground:'one unresolved connection',background:'dark restrained editorial depth',negative_space:'clean lower-right typography-safe field'},
  visual_magnetism:{tension:'near closure versus visible absence',contrast:'polished certainty against unlit missing link',reveal_potential:'the gap becomes apparent after the whole form',depth:'subtle tactile graphite layers',focal_strength:'one unmistakable broken semantic relationship'},
  motion_headroom:{push_in:true,pan:false,parallax:true,mask_reveal:true,typography_space:'lower-right safe area'},
  style:{dna:'CKAI_DARK_PREMIUM_EDITORIAL_V1',mood:'calm intellectual tension',realism:'conceptual editorial realism, never documentary',texture:'matte graphite and restrained amber edge light'},
  output_fit:{target:'9:16',crop_tolerance:'central subject survives portrait crop',safe_zone:'critical relationship inside central 70% width and 68% height'},
};

const main=async()=>{try {
  const client = createOpenAiClient();
  await client.models.list(); report.connectivity = 'PASS';
  const prompt = (await import('../src/openai-service')).compileImagePrompt(brief);
  const generated = await generateImageBinary(client, config.imageModel, prompt);
  const imagePath = resolve(outputDir, 'gpt-image-2-connectivity.png'); writeFileSync(imagePath, generated.binary); report.image_model_call = 'PASS'; report.generated_asset = imagePath; report.generated_asset_sha256 = sha256(generated.binary); report.image_usage = generated.usage;
  const vision = await visionQaActualBinary(client, config.visionModel, generated.binary, 'image/png', brief, 'ASSET');
  const qa = enforceVisionHardGates(vision.qa, config); report.vision_model_call = 'PASS'; report.vision_qa = qa; report.vision_usage = vision.usage;
  const qaPath = resolve(outputDir, 'vision-qa.json'); writeFileSync(qaPath, `${JSON.stringify({actual_binary:imagePath,actual_binary_sha256:sha256(generated.binary),qa,usage:vision.usage},null,2)}\n`); report.qa_artifact = qaPath;
} catch (error) {
  const value = error as Error & {status?: number; code?: string; type?: string};
  report.error = redactSecrets(`${value.name}: ${value.message}`, [process.env.OPENAI_API_KEY]); report.error_status = value.status ?? null; report.error_code = value.code ?? value.type ?? null;
}
const reportPath = resolve(outputDir, 'connectivity-report.json'); writeFileSync(reportPath, `${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify({...report, report_path: reportPath}, null, 2));
if (report.connectivity !== 'PASS' || report.image_model_call !== 'PASS' || report.vision_model_call !== 'PASS') process.exitCode = 1;
};
void main();
