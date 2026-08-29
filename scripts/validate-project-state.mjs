import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {dirname, extname, join, resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const read=(p)=>readFileSync(join(root,p),'utf8');
const blueprint=read('MASTER_BLUEPRINT.md');
const ldp=read('ldp.html');
const failures=[];
const check=(condition,message)=>{if(!condition)failures.push(message)};

const arcs=[...blueprint.matchAll(/^## ARC-\d+\b/gm)];
const phases=[...blueprint.matchAll(/^### PHASE-\d+\.\d+\b/gm)];
const taskRows=[...blueprint.matchAll(/^\| ([A-Z]{3}-\d{2}) \|[^\n]*\| (DONE|VALIDATED|IN_PROGRESS|NOT_STARTED|CANDIDATE|FROZEN|BLOCKED|NEEDS_RECONCILIATION) \|/gm)].map(m=>({id:m[1],state:m[2]}));
const ids=taskRows.map(t=>t.id);
check(new Set(ids).size===ids.length,'Duplicate canonical task ID');

const states=['DONE','VALIDATED','IN_PROGRESS','NOT_STARTED','CANDIDATE','FROZEN','BLOCKED','NEEDS_RECONCILIATION'];
const counts=Object.fromEntries(states.map(s=>[s,taskRows.filter(t=>t.state===s).length]));
const meta=(name)=>Number(ldp.match(new RegExp(`<meta name="${name}" content="(\\d+)">`))?.[1]);
check(meta('ckai-arc-count')===arcs.length,`LDP ARC count drift: ${meta('ckai-arc-count')} != ${arcs.length}`);
check(meta('ckai-phase-count')===phases.length,`LDP phase count drift: ${meta('ckai-phase-count')} != ${phases.length}`);
check(meta('ckai-task-count')===taskRows.length,`LDP task count drift: ${meta('ckai-task-count')} != ${taskRows.length}`);
for(const [state,metaName] of Object.entries({DONE:'ckai-task-done',VALIDATED:'ckai-task-validated',IN_PROGRESS:'ckai-task-in-progress',NOT_STARTED:'ckai-task-not-started',CANDIDATE:'ckai-task-candidate',FROZEN:'ckai-task-frozen',BLOCKED:'ckai-task-blocked',NEEDS_RECONCILIATION:'ckai-task-needs-reconciliation'})) check(meta(metaName)===counts[state],`LDP ${state} count drift: ${meta(metaName)} != ${counts[state]}`);

const walk=(dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()&&!['node_modules','.git','generated'].includes(entry.name)?walk(join(dir,entry.name)):entry.isFile()&&extname(entry.name)==='.md'?[join(dir,entry.name)]:[]);
for(const file of walk(root)){
  const text=readFileSync(file,'utf8');
  for(const m of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
    const target=m[1].split('#')[0].trim();
    if(!target||/^(?:https?:|mailto:)/i.test(target)||target.includes('YYYY')||target.includes('000N')||target.includes('slug'))continue;
    check(existsSync(resolve(dirname(file),decodeURIComponent(target))),`Broken Markdown reference: ${file.slice(root.length+1)} -> ${target}`);
  }
}

const musicRoot=join(root,'content/references/audio/music-library-v1');
const mp3s=[]; const collect=(dir)=>{for(const e of readdirSync(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())collect(p);else if(e.name.toLowerCase().endsWith('.mp3'))mp3s.push(p)}}; collect(musicRoot);
const catalog=JSON.parse(readFileSync(join(musicRoot,'03_catalog/music-library.json'),'utf8'));
const tracks=Array.isArray(catalog)?catalog:(catalog.tracks??catalog.music_library??[]);
check(mp3s.length===22,`Music local asset count ${mp3s.length} != 22`);
check(tracks.length===22,`Music catalog count ${tracks.length} != 22`);
check(catalog.phase_2_audio_engine_status==='VALIDATED','Music registry Phase 2 Audio Engine state is not VALIDATED');
check(catalog.phase_2_audio_engine_document==='engine/audio-engine-v1.md','Music registry Audio Engine document reference is missing');

for(const required of [
  ['PROJECT.md','CKAI-0005 FINAL AUDIO V2: PUBLISHED'],
  ['PROJECT.md','CKAI-0006 PRACTICAL CONSISTENCY TEST 01: V1.2 LOCKED'],
  ['PROJECT.md','AUDIO DIRECTION V1: VALIDATED'],
  ['PROJECT.md','PHASE 2 AUDIO ENGINE V1: VALIDATED'],
  ['MASTER_BLUEPRINT.md','AUD-03 | Audio Direction V1 evidence consolidation | VALIDATED'],
  ['MASTER_BLUEPRINT.md','AUD-04 | Phase 2 Audio Engine | VALIDATED'],
  ['engine/audio-direction-v1.md','Status: `VALIDATED`'],
  ['engine/audio-engine-v1.md','Status: `VALIDATED`'],
  ['engine/visual-director.md','Practical != dashboard']
]) check(read(required[0]).includes(required[1]),`Canonical state missing: ${required[0]} -> ${required[1]}`);

for(const openTaskId of ['PUB-01','VIS-13','LRN-02','AUT-02','GLD-02']) check(ldp.includes(openTaskId),`LDP missing open task: ${openTaskId}`);
check(ldp.includes('Golden remains unawarded'),'LDP does not show Golden as unawarded');
check(read('content/reviews/GLD-02_golden-master-qualification.md').includes('GOLDEN MASTER NOT YET QUALIFIED'),'Golden qualification decision record missing');
check(ldp.includes('Chưa chọn được nội dung đủ tốt để làm bài thử Golden 8/10.'),'LDP does not show Golden Candidate as not yet selected');
check(blueprint.includes('Golden Candidate = NOT YET SELECTED'),'Blueprint does not show Golden Candidate as not yet selected');
check(read('content/reviews/CKAI-0001_golden-production-preflight.md').includes('REJECTED_AS_GOLDEN_CANDIDATE_BY_PRODUCT_OWNER'),'CKAI-0001 historical preflight is not marked rejected');

if(failures.length){console.error(JSON.stringify({status:'FAIL',failures},null,2));process.exit(1)}
console.log(JSON.stringify({status:'PASS',arcs:arcs.length,phases:phases.length,tasks:taskRows.length,counts,musicTracks:tracks.length,musicLocalAssets:mp3s.length},null,2));
