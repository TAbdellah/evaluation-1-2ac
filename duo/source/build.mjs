import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {integrateRequirements} from './requirements-build.mjs';
const source=fileURLToPath(new URL('.',import.meta.url)),output=path.resolve(source,'..'),root=path.resolve(output,'..');
const basePath=path.join(root,'tmp/base-app.js'),qa=process.argv.includes('--qa');
await fs.mkdir(path.dirname(basePath),{recursive:true});
let base;
try{base=await fs.readFile(basePath,'utf8');}catch{const r=await fetch('https://raw.githubusercontent.com/TAbdellah/evaluation-1-2ac/f647d4c0f5fb33f1ca8c947274f60729e9bb6e1a/duo/app.js');if(!r.ok)throw new Error('Runtime de référence indisponible.');base=await r.text();await fs.writeFile(basePath,base);}
const bytes=Buffer.from(base),sha=createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
if(sha!=='89a6ea862d03adb647e8e23dd6d5c20dea049499')throw new Error('Le runtime de référence a changé.');
function replaceOnce(before,after){if(base.split(before).length!==2)throw new Error('Point d’intégration introuvable ou ambigu : '+before.slice(0,80));base=base.replace(before,after);}
replaceOnce('function r9(){','function r9(){if(zr===2&&ri===3&&iA._schema===_quizVersion)return _quizExercise(iA);if(zr===2&&ri===3&&iA._schema===_clubVersion)return _clubExercise(iA.operations||[]);');
replaceOnce('function Pm(){','function Pm(){if(zr===2&&[\u005fquizVersion,_clubVersion].includes(iA._schema))return Object.entries(iA).filter(([k,v])=>k!=="operations"&&k!=="_schema"&&v!=="").length+(iA._schema===_quizVersion?_quizAnsweredCount(iA.operations||[]):_clubAnsweredCount(iA.operations||[]));');
replaceOnce('"begin_second",{sessionId:hr.sessionId}', '"begin_second",{sessionId:hr.sessionId,networkVersion:_quizVersion}');
replaceOnce('function Jk(t){','function Jk(t){if(t.type?.startsWith("club_"))return _clubOperationLabel(t);');
replaceOnce('if(e.type.includes("svg")){let r=new Image;', 'if(e.type.includes("svg")||e.type.includes("webp")){let r=new Image;');
replaceOnce('F.id==="component_roles"?id:F.id==="system_tree"?ad:null','F.id==="network_club"?_clubPhotoCards:F.id==="component_roles"?id:F.id==="system_tree"?ad:null');
replaceOnce('aa=t=>"./assets/"+t+','aa=t=>t.startsWith("net5-")?"./assets/"+t+".webp":"./assets/"+t+');
integrateRequirements(replaceOnce);
if(qa){replaceOnce('https://xrwtcyliibooudyoovqo.supabase.co/functions/v1/evaluations-duo-api','/__qa-api');replaceOnce('fh=()=>{try{','fh=()=>{return {token:"qa-teacher",expiresAt:"2099-01-01T00:00:00Z"};try{');}
const imports=`import {completion as _completion} from ${JSON.stringify(path.join(source,'completion.js'))};\nimport {NETWORK_VERSION as _clubVersion,renderClubExercise as _clubExercise,renderClubNetwork as _clubNetworkHTML,setupClubNetwork as _setupClubNetwork,clubPhotoCards as _clubPhotoCards,clubOperationLabel as _clubOperationLabel,clubAnsweredCount as _clubAnsweredCount} from ${JSON.stringify(path.join(source,'network-club.js'))};\nimport {NETWORK_QUIZ_VERSION as _quizVersion,renderQuizExercise as _quizExercise,renderQuizNetwork as _quizNetworkHTML,setupQuizNetwork as _setupQuizNetwork,quizCableCount as _quizAnsweredCount} from ${JSON.stringify(path.join(source,'network-quiz.js'))};\n`;
const setup=`\n_setupClubNetwork({active:()=>Mn==="exam"&&zr===2&&ri===3&&iA._schema===_clubVersion,operations:()=>iA.operations||[],add:to,redraw:()=>{const region=document.getElementById("club-lab");if(region)region.innerHTML=_clubNetworkHTML(iA.operations||[]);},notify:HA});\n_setupQuizNetwork({active:()=>Mn==="exam"&&zr===2&&ri===3&&iA._schema===_quizVersion,answers:()=>iA,operations:()=>iA.operations||[],add:to,redraw:()=>{const region=document.getElementById("quiz-network");if(region)region.innerHTML=_quizNetworkHTML(iA.operations||[]);}});\n`;
const entry=path.join(root,'tmp/network-entry.js');await fs.writeFile(entry,imports+base+setup+'\n'+await fs.readFile(path.join(source,'requirements-runtime.txt'),'utf8'));
const target=qa?path.join(root,'.preview/app.js'):path.join(output,'app.js');
await build({entryPoints:[entry],outfile:target,bundle:true,minify:true,format:'esm',target:['chrome100','firefox102','safari15'],legalComments:'none'});
console.log(qa?'Aperçu de vérification compilé.':'Exercice réseau intégré au runtime existant.');
