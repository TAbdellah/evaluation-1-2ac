// Shared deterministic simulation. Scores and answer keys stay on the server.
export const NETWORK_VERSION='duo-2ac-2026-11-network-v1';
export const CLUB_SSID='CLUB-2AC';
export const CLUB_PRINTER='Imprimante Wi-Fi';
export const CLUB_FILES={pc1:'texte.txt',pc2:'photos.jpg'};
export const clubWifi=(s,device)=>s.wifi[device]?.enabled&&s.wifi[device].ssid===CLUB_SSID;
export const clubReachable=(s,source)=>!!(s.ports[source]&&s.ports.ap&&clubWifi(s,'laptop'));
export const clubCanPrint=s=>!!(s.files['texte.txt']&&s.files['photos.jpg']&&clubWifi(s,'laptop')&&clubWifi(s,'printer'));
export function validClubOperation(o){
 if(!o||typeof o!=='object'||Array.isArray(o))return false;
 const fields={club_cable:['type','device','port'],club_disconnect:['type','device'],club_wifi:['type','device','enabled','ssid'],club_copy:['type','source','file','destination'],club_print:['type','document','printer']};
 const allowed=fields[o.type];if(!allowed||Object.keys(o).some(k=>!allowed.includes(k)))return false;
 if(o.type==='club_cable')return ['pc1','pc2','ap'].includes(o.device)&&Number.isInteger(o.port)&&o.port>=1&&o.port<=8;
 if(o.type==='club_disconnect')return ['pc1','pc2','ap'].includes(o.device);
 if(o.type==='club_wifi')return ['laptop','printer'].includes(o.device)&&typeof o.enabled==='boolean'&&['',CLUB_SSID,'INVITES'].includes(o.ssid);
 if(o.type==='club_copy')return ['pc1','pc2'].includes(o.source)&&Object.values(CLUB_FILES).includes(o.file)&&o.destination==='Portable/Documents';
 return o.document==='affiche.pdf'&&[CLUB_PRINTER,'Microsoft Print to PDF'].includes(o.printer);
}
export function replayClubNetwork(operations=[]){
 const s={ports:{},wifi:{laptop:{enabled:false,ssid:''},printer:{enabled:false,ssid:''}},files:{'texte.txt':false,'photos.jpg':false},printed:false,attempted:{},lastResult:null};
 for(const o of operations){
  if(!validClubOperation(o))continue;
  if(o.type==='club_cable'){
   s.attempted[o.device]=true;
   const free=!Object.entries(s.ports).some(([device,port])=>device!==o.device&&port===o.port);
   if(free)s.ports[o.device]=o.port;
   s.lastResult={type:o.type,ok:free};
  }
  if(o.type==='club_disconnect'){s.attempted[o.device]=true;delete s.ports[o.device];s.lastResult={type:o.type,ok:true};}
  if(o.type==='club_wifi'){s.attempted[o.device]=true;s.wifi[o.device]={enabled:o.enabled,ssid:o.enabled?o.ssid:''};s.lastResult={type:o.type,ok:clubWifi(s,o.device)};}
  if(o.type==='club_copy'){
   s.attempted[o.file]=true;
   const ok=CLUB_FILES[o.source]===o.file&&clubReachable(s,o.source);
   if(ok)s.files[o.file]=true;
   s.lastResult={type:o.type,ok,file:o.file};
  }
  if(o.type==='club_print'){
   s.attempted.print=true;
   const ok=o.printer===CLUB_PRINTER&&clubCanPrint(s);
   if(ok)s.printed=true;
   s.lastResult={type:o.type,ok};
  }
 }
 return s;
}
export const clubAnsweredCount=operations=>Object.keys(replayClubNetwork(operations).attempted).length;
export function clubOperationLabel(o){
 const device={pc1:'PC-1',pc2:'PC-2',ap:'le point d’accès',laptop:'le portable',printer:'l’imprimante'}[o.device]||o.device;
 switch(o.type){
  case'club_cable':return `Brancher ${device} au port ${o.port} du switch`;
  case'club_disconnect':return `Débrancher ${device}`;
  case'club_wifi':if(o.enabled&&!o.ssid)return `Activer le Wi-Fi de ${device}`;return o.enabled?`Connecter ${device} au Wi-Fi ${o.ssid||'(aucun réseau)'}`:`Désactiver le Wi-Fi de ${device}`;
  case'club_copy':return `Copier ${o.file} depuis ${o.source==='pc1'?'PC-1':'PC-2'} vers Documents du portable`;
  case'club_print':return `Imprimer ${o.document} sur ${o.printer}`;
  default:return '';
 }
}
