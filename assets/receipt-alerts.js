(function(root){
 'use strict';
 class Tracker{
  constructor(){this.reset()}
  reset(){this.ready=false;this.seen=new Set();this.items=[];this.unread=0}
  ingest(rows){
   const submitted=rows.filter(r=>r.status==='submitted'&&r.id);
   const incoming=this.ready?submitted.filter(r=>!this.seen.has(r.id)):[];
   for(const row of submitted)this.seen.add(row.id);this.ready=true;
   incoming.sort((a,b)=>Date.parse(b.submitted_at)-Date.parse(a.submitted_at));
   this.items=[...incoming,...this.items].slice(0,30);this.unread+=incoming.length;return incoming;
  }
  markRead(){this.unread=0}
 }
 class Chime{
  constructor(){this.enabled=false;this.context=null}
  get ready(){return this.enabled&&this.context?.state==='running'}
  async toggle(){
   if(this.ready){this.enabled=false;return false}
   const Audio=root.AudioContext||root.webkitAudioContext;if(!Audio)throw new Error('Le son n’est pas disponible dans ce navigateur. Les notifications visuelles restent actives.');
   this.context??=new Audio();await this.context.resume();if(this.context.state!=='running')throw new Error('Le navigateur attend un clic pour autoriser le son. Réessayez le bouton Son.');
   this.enabled=true;this.play();return true;
  }
  play(){
   if(!this.ready)return false;const ctx=this.context,start=ctx.currentTime;
   [783.99,1046.5,1318.51].forEach((frequency,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain(),time=start+i*.16;osc.type='sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(.08,time+.015);gain.gain.exponentialRampToValueAtTime(.0001,time+.5);osc.connect(gain);gain.connect(ctx.destination);osc.start(time);osc.stop(time+.52);osc.onended=()=>{osc.disconnect();gain.disconnect()}});return true;
  }
  reset(){this.enabled=false;const context=this.context;this.context=null;if(context)context.close().catch(()=>{})}
 }
 root.EvalReceiptAlerts=Object.freeze({Tracker,Chime});
})(typeof window!=='undefined'?window:globalThis);
