/* ================= 当代流行：乐器与效果 ================= */
Object.assign(INST,{
  cl:{bright:.72,decay:.9988,dur:2.4,vol:.32,lp:4200},
  zh:{bright:.95,decay:.9986,dur:2.2,vol:.3,lp:7000,peak:[2400,5]},
  sb:{bright:.4,decay:.997,dur:1,vol:.7,lp:900}
});
function synth(t,midi,dur,o={}){const a=A(),f=mf(midi),g=a.createGain(),v=(o.vol||1)*.05,lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=o.q||2;lp.frequency.setValueAtTime(o.cut||900,t);lp.frequency.linearRampToValueAtTime(o.open||2600,t+(o.att||.08));lp.frequency.exponentialRampToValueAtTime(o.cut||900,t+Math.max(.2,dur));
  (o.waves||[["sawtooth",-8],["sawtooth",8]]).forEach(([w,dt])=>{const x=a.createOscillator();x.type=w;x.frequency.value=f;x.detune.value=dt;x.connect(lp);x.start(t);x.stop(t+dur+.06);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(o.att||.01));g.gain.setValueAtTime(v,t+Math.max(o.att||.01,dur-.05));g.gain.linearRampToValueAtTime(0,t+dur);lp.connect(g).connect(o.out||bus);}
function pad(t,notes,dur,o={}){notes.forEach(m=>synth(t,m,dur,{vol:(o.vol||1)*.55,cut:o.cut||700,open:o.open||1600,att:o.att||.35,out:o.out}));}
function stab(t,notes,len,v=1){notes.forEach(m=>synth(t,m,len,{vol:.75*v,cut:600,open:4200,att:.005,q:3}));}
function piano(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain();[[1,.6,"triangle"],[2,.25,"sine"],[3,.08,"sine"]].forEach(([h,am,w])=>{const x=a.createOscillator();x.type=w;x.frequency.value=f*h;const xg=a.createGain();xg.gain.value=am;x.connect(xg).connect(g);x.start(t);x.stop(t+dur+.1);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*v,t+.005);g.gain.exponentialRampToValueAtTime(.03*v,t+.4);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);g.connect(bus);}
function epiano(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain(),x=a.createOscillator();x.type="sine";x.frequency.value=f;const m=a.createOscillator();m.frequency.value=f*2;const mg=a.createGain();mg.gain.setValueAtTime(f*1.1,t);mg.gain.exponentialRampToValueAtTime(f*.08,t+.5);m.connect(mg).connect(x.frequency);x.connect(g);[x,m].forEach(o=>{o.start(t);o.stop(t+dur+.1);track(o);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*v,t+.006);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);g.connect(bus);}
function strings(t,notes,dur,v=1){const a=A();notes.forEach(m=>[-7,0,7].forEach(dt=>{const o=a.createOscillator();o.type="sawtooth";o.frequency.value=mf(m);o.detune.value=dt;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=2000;const g=a.createGain(),vv=.012*v;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vv,t+.4);g.gain.setValueAtTime(vv,t+dur-.3);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(lp).connect(g).connect(bus);o.start(t);o.stop(t+dur+.05);track(o);}));}
/* 808：长、低、可以滑音 */
function b808(t,midi,dur,o={}){const a=A(),f=mf(midi),x=a.createOscillator();x.type="sine";if(o.from!=null){x.frequency.setValueAtTime(mf(o.from),t);x.frequency.exponentialRampToValueAtTime(f,t+(o.glide||.12));}else{x.frequency.setValueAtTime(f*2.4,t);x.frequency.exponentialRampToValueAtTime(f,t+.03);}
  const g=a.createGain(),v=(o.vol||1)*.7;g.gain.setValueAtTime(v,t);g.gain.setValueAtTime(v*.9,t+Math.max(.05,dur-.12));g.gain.exponentialRampToValueAtTime(.001,t+dur);const sh=a.createWaveShaper();sh.curve=shaper(2.4);x.connect(sh).connect(g).connect(bus);x.start(t);x.stop(t+dur+.02);track(x);}
function popKick(t,v=1){kick(t,v*1.1);}
function four(tb,beat,o={}){for(let q=0;q<4;q++){popKick(tb+q*beat,o.kv||1);hat(tb+q*beat+beat/2,(o.hv||1)*.9);if(o.out){}}clap(tb+beat,o.cv||.9);clap(tb+3*beat,o.cv||.9);if(o.crash)crash(tb,o.crash);}
function popBeat(tb,beat,o={}){for(let k=0;k<8;k++)hat(tb+k*beat/2,(k%2?.45:.75)*(o.hv||1));popKick(tb,o.kv||1);popKick(tb+1.5*beat,(o.kv||1)*.7);popKick(tb+2*beat,o.kv||1);clap(tb+beat,o.cv||.8);snare(tb+beat,.5);clap(tb+3*beat,o.cv||.8);snare(tb+3*beat,.5);if(o.crash)crash(tb,o.crash);}
function trapBar(tb,beat,o={}){const s=beat/4;for(let k=0;k<16;k++){if(k===6||k===14){for(let r=0;r<3;r++)hat(tb+k*s+r*s/1.5*1,.5);}else if(k%2===0)hat(tb+k*s,.7);}if(o.roll)for(let r=0;r<8;r++)hat(tb+12*s+r*s/2,.35+r*.06);clap(tb+2*beat,1.1);snare(tb+2*beat,.5);if(o.crash)crash(tb,o.crash);}
function dembow(tb,beat,o={}){const s=beat/4;[0,4,8,12].forEach(k=>popKick(tb+k*s,.9));[3,6,11,14].forEach(k=>{snare(tb+k*s,.7);clap(tb+k*s,.4);});for(let k=0;k<16;k+=2)hat(tb+k*s,.55);if(o.crash)crash(tb,o.crash);}
function vline(t,beat,notes,o={}){notes.forEach(([b,m,d])=>voice(t+b*beat,m+(o.tr||0),d*beat*.94,{vowel:o.vowel||"a",vol:o.vol||.7,vibDepth:o.vib||14,from:o.from==null?-.6:o.from,glide:.07}));}
function bars(t,beat,arr){return arr.map((x,i)=>[t+i*4*beat,x]);}
const C=[[48,[60,64,67]],[43,[59,62,67]],[45,[57,60,64]],[41,[57,60,65]]];
const AMC=[[45,[57,60,64]],[41,[57,60,65]],[48,[60,64,67]],[43,[59,62,67]]];
function markCells(btn,times){const st=stripNear(btn);if(!st)return;const cells=[...st.children],a=A();times.forEach((tt,i)=>later(()=>{cells.forEach(c=>c.classList.remove("now"));cells[i]&&cells[i].classList.add("now");},tt-a.currentTime));}

const DEMOS={};
/* 01 浓缩的一首歌 */
const VER=[[[0,64,.5],[.5,64,.5],[1,67,1],[2,64,.5],[2.5,62,1.5]],[[0,62,.5],[.5,62,.5],[1,64,1],[2,62,.5],[2.5,59,1.5]],[[0,60,.5],[.5,60,.5],[1,64,1],[2,67,.5],[2.5,65,1.5]],[[0,64,1],[1,62,1],[2,60,2]]];
const PRE=[[[0,64,.5],[.5,65,.5],[1,67,.5],[1.5,69,.5],[2,67,1],[3,69,1]],[[0,69,.5],[.5,71,.5],[1,72,1],[2,71,1],[3,74,1]]];
const CHO=[[[0,72,.5],[.5,72,.5],[1,76,1],[2,74,.5],[2.5,72,1.5]],[[0,71,.5],[.5,71,.5],[1,74,1],[2,72,.5],[2.5,71,1.5]],[[0,72,.5],[.5,72,.5],[1,76,1],[2,79,.5],[2.5,77,1.5]],[[0,76,1],[1,74,1],[2,72,2]]];
const POST=[[0,79,.25],[.5,79,.25],[.75,76,.25],[1.5,79,.25],[2,74,.5],[3,72,.5]];
function sing(tb,beat,bar,o={}){vline(tb,beat,bar,o);}
function chorusBar(tb,beat,i,o={}){const [r,ch]=C[i%4];four(tb,beat,{crash:i===0&&o.crash?.8:0});[.5,1.5,2.5,3.5].forEach(x=>stab(tb+x*beat,ch,beat*.35,.8));for(let k=0;k<8;k++)pluck(tb+k*beat/2,r-12+(k%2?12:0),"sb",{vol:1,mute:beat*.4});pad(tb,ch.map(x=>x+12),4*beat,{vol:.6});}
DEMOS.form=(t,btn)=>{const beat=bt(112);let x=t;const marks=[];
  marks.push(x);for(let i=0;i<4;i++){const tb=x+i*4*beat,[r,ch]=C[i];ch.forEach(m=>piano(tb,m,beat*3.6,.8));piano(tb,r,beat*3.6,.9);popKick(tb,.8);for(let q=0;q<4;q++)hat(tb+q*beat+beat/2,.4);sing(tb,beat,VER[i],{tr:0});}x+=16*beat;
  marks.push(x);[[45,[57,60,64]],[41,[57,60,65]]].forEach(([r,ch],i)=>{const tb=x+i*4*beat;pad(tb,ch.map(m=>m+12),4*beat,{vol:.7,open:1000+i*1500});pluck(tb,r-12,"sb",{vol:1,dur:4*beat});for(let k=0;k<(i?16:8);k++)snare(tb+k*beat/(i?4:2),.25+k*(i?.03:.04));popKick(tb,.8);popKick(tb+2*beat,.8);sing(tb,beat,PRE[i]);});x+=8*beat;
  marks.push(x);for(let i=0;i<4;i++){chorusBar(x+i*4*beat,beat,i,{crash:1});sing(x+i*4*beat,beat,CHO[i],{vol:.8});}x+=16*beat;
  marks.push(x);for(let i=0;i<2;i++){chorusBar(x+i*4*beat,beat,i);vline(x+i*4*beat,beat,POST,{vowel:"o",vol:.75,from:0,vib:0});}x+=8*beat;
  marks.push(x);[[45,[57,60,64]],[43,[59,62,67]]].forEach(([r,ch],i)=>{const tb=x+i*4*beat;pad(tb,ch,4*beat,{vol:.8,cut:400,open:800});piano(tb,r,beat*3.6,.7);sing(tb,beat,i?[[0,71,2],[2,67,2]]:[[0,69,2],[2,72,2]],{vol:.6});});for(let k=0;k<8;k++)popKick(x+4*beat+k*beat/2,.3+k*.08);x+=8*beat;
  marks.push(x);for(let i=0;i<4;i++){chorusBar(x+i*4*beat,beat,i,{crash:1});sing(x+i*4*beat,beat,CHO[i],{vol:.8});}x+=16*beat;
  [60,64,67,72].forEach(m=>piano(x,m,2.4));pad(x,[60,64,67,72],2.4);crash(x);popKick(x);voice(x,72,2.2,{vol:.75,vibDepth:20});
  markCells(btn,marks);later(()=>{const st=stripNear(btn);st&&[...st.children].forEach(c=>c.classList.remove("now"));},x-A().currentTime+.5);return x-t+2.6;};
/* 02 钩子 */
const HOOK_OFF=[[[0,64,1],[1,67,.5],[1.5,71,.5],[2,74,1],[3,72,1]],[[0,71,.5],[.5,67,1],[1.5,62,.5],[2,65,1.5],[3.5,67,.5]],[[0,72,1.5],[1.5,76,.5],[2,69,.5],[2.5,64,1.5]],[[0,65,.5],[.5,69,.5],[1,77,1],[2,74,.5],[2.5,72,1.5]],
  [[0,79,1],[1,76,.5],[1.5,74,1],[2.5,71,1.5]],[[0,62,.5],[.5,64,.5],[1,71,1],[2,67,2]],[[0,64,1],[1,72,1],[2,76,.5],[2.5,69,1.5]],[[0,65,1],[1,64,1],[2,60,2]]];
const M=[[0,76,.5],[.5,74,.5],[1,72,1],[2.5,74,.5],[3,72,1]];
const HOOK_ON=[M,M,M,[[0,72,1],[1,71,1],[2,72,2]],M,M,M,[[0,76,.5],[.5,77,.5],[1,79,2.5]]];
function hookDemo(t,lines){const beat=bt(110);lines.forEach((ln,i)=>{const tb=t+i*4*beat,[r,ch]=C[i%4];popBeat(tb,beat,{crash:i===0?.6:0});ch.forEach(m=>epiano(tb,m,beat*1.8,.7));ch.forEach(m=>epiano(tb+2*beat,m,beat*1.8,.6));for(let k=0;k<4;k++)pluck(tb+k*beat,r-12,"sb",{vol:1,mute:beat*.9});vline(tb,beat,ln,{vol:.8});});
  const e=t+32*beat;[60,64,67].forEach(m=>epiano(e,m,2));pluck(e,36,"sb",{vol:1,dur:2});return 32*beat+2.2;}
DEMOS["hook-off"]=t=>hookDemo(t,HOOK_OFF);DEMOS["hook-on"]=t=>hookDemo(t,HOOK_ON);
/* 03 四和弦 */
DEMOS["axis-a"]=t=>{const beat=bt(124),L=[[0,79,.5],[.5,76,.5],[1,72,.5],[1.5,76,.5],[2,79,.75],[2.75,81,.25],[3,79,1]];
  for(let i=0;i<8;i++){const tb=t+i*4*beat,[r,ch]=C[i%4];four(tb,beat,{crash:i%4===0?.6:0});[.5,1.5,2.5,3.5].forEach(x=>stab(tb+x*beat,ch.map(m=>m+12),beat*.3,.9));[.5,1.5,2.5,3.5].forEach(x=>pluck(tb+x*beat,r-12,"sb",{vol:1.1,mute:beat*.4}));
    if(i>=4)L.forEach(([b,m,d])=>synth(tb+b*beat,m-(i%4===1?2:i%4===3?3:0),d*beat*.9,{vol:.55,cut:1500,open:5000,waves:[["square",0],["sawtooth",6]]}));}
  const e=t+32*beat;stab(e,[60,64,67,72],1.6);popKick(e);crash(e);return 32*beat+2;};
DEMOS["axis-b"]=t=>{const beat=bt(70),L=[[[0,76,2],[2,74,1],[3,72,1]],[[0,74,3],[3,71,1]],[[0,72,2],[2,76,1],[3,79,1]],[[0,77,2],[2,76,1],[3,74,1]]];
  for(let i=0;i<4;i++){const tb=t+i*4*beat,[r,ch]=C[i];[0,1,2,3,2,1,2,3].forEach((j,k)=>piano(tb+k*beat/2,[r+12,...ch][j],beat*.9,.7));piano(tb,r,beat*3.8,.9);strings(tb,ch,4*beat+.05,.9);vline(tb,beat,L[i],{vol:.75,vib:22});}
  const e=t+16*beat;[48,60,64,67,72].forEach(m=>piano(e,m,3));strings(e,[60,64,67],3);voice(e,72,2.8,{vol:.7,vibDepth:22});return 16*beat+3.2;};
DEMOS["axis-c"]=t=>{const beat=bt(92),L=[[[0,72,.5],[.5,72,.5],[1,71,.5],[1.5,69,1.5],[3,64,1]],[[0,65,.5],[.5,69,.5],[1,72,1],[2,69,2]],[[0,67,.5],[.5,67,.5],[1,72,1],[2,76,1],[3,74,1]],[[0,74,1],[1,71,1],[2,67,2]]];
  for(let i=0;i<8;i++){const tb=t+i*4*beat,[r,ch]=AMC[i%4];ch.forEach(m=>epiano(tb,m+12,beat*3.6,.6));b808(tb,r-12,beat*1.4,{vol:.9});b808(tb+2.5*beat,r-12,beat*1.2,{vol:.8});trapBar(tb,beat,{roll:i%4===3,crash:i===0?.5:0});popKick(tb,.6);popKick(tb+2.5*beat,.5);if(i>=2)vline(tb,beat,L[i%4],{vol:.75,vib:16});}
  const e=t+32*beat;[57,60,64].forEach(m=>epiano(e,m+12,2.4));b808(e,33,2);return 32*beat+2.6;};
/* 04 卡农 */
const CAN=[[48,[60,64,67],[76,74]],[47,[59,62,67],[74,71]],[45,[57,60,64],[72,76]],[43,[59,64,67],[74,71]],[41,[57,60,65],[72,69]],[40,[55,60,64],[67,72]],[41,[57,60,65],[69,72]],[43,[59,62,67],[74,71]]];
const CAN2=[[79,77],[74,79],[76,72],[71,74],[69,72],[76,79],[77,76],[74,74]];
DEMOS.canon=t=>{const beat=bt(80);for(let p=0;p<2;p++)CAN.forEach(([b,ch,mel],i)=>{const tb=t+(p*8+i)*2*beat;piano(tb,b,beat*1.9,1);piano(tb+beat,b+12,beat*.9,.6);ch.forEach(m=>piano(tb+.5*beat,m,beat*1.4,.55));strings(tb,ch,2*beat+.05,p?1.1:.7);
    const mm=p?CAN2[i]:mel;piano(tb,mm[0]+(p?0:0),beat*.95,1.05);piano(tb+beat,mm[1],beat*.95,.95);});
  const e=t+32*beat;[36,48,60,64,67,72].forEach(m=>piano(e,m,3));strings(e,[60,64,67],3);return 32*beat+3.2;};
/* 05 Auto-Tune、侧链、808 */
const TUNE=[[0,67,1],[1,69,.5],[1.5,72,1.5],[3,71,1],[4,69,.5],[4.5,67,1.5],[6,64,1],[7,67,1],[8,69,1],[9,72,.5],[9.5,74,1.5],[11,72,1],[12,71,.5],[12.5,69,.5],[13,67,3]];
function vox(t,beat,segs,tuned,vol=.75){const a=A(),os=a.createOscillator();os.type="sawtooth";const end=t+segs.reduce((m,[b,,d])=>Math.max(m,b+d),0)*beat;
  segs.forEach(([b,m,d],i)=>{const tt=t+b*beat,f=mf(m);if(tuned){os.frequency.setValueAtTime(f,tt);}else{const prev=i?mf(segs[i-1][1]):f*.94;os.frequency.setValueAtTime(prev,tt);os.frequency.linearRampToValueAtTime(f*Math.pow(2,(Math.random()-.5)*.25/12),tt+.13);os.frequency.linearRampToValueAtTime(f*Math.pow(2,(Math.random()-.5)*.15/12),tt+d*beat*.9);}});
  const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol*.5,t+.06);
  segs.forEach(([b,,d],i)=>{const tt=t+b*beat;if(i){g.gain.setValueAtTime(vol*.5,tt-.03);g.gain.linearRampToValueAtTime(vol*.38,tt);g.gain.linearRampToValueAtTime(vol*.5,tt+.04);}});g.gain.setValueAtTime(vol*.5,end-.12);g.gain.linearRampToValueAtTime(0,end);
  if(!tuned){const l=a.createOscillator(),lg=a.createGain();l.frequency.value=5.3;lg.gain.value=24;l.connect(lg).connect(os.detune);l.start(t);l.stop(end);track(l);}
  const out=a.createGain();[[750,7,1],[1200,9,.6],[2600,10,.3]].forEach(([fr,q,amt])=>{const bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=fr;bp.Q.value=q;const gg=a.createGain();gg.gain.value=amt*3;os.connect(bp).connect(gg).connect(out);});
  out.connect(g).connect(bus);os.start(t);os.stop(end+.05);track(os);}
function tuneDemo(t,tuned){const beat=bt(96);for(let i=0;i<4;i++){const tb=t+i*4*beat,[r,ch]=C[i];pad(tb,ch.map(m=>m+12),4*beat,{vol:.6});b808(tb,r-12,beat*1.8,{vol:.7});b808(tb+2*beat,r-12,beat*1.5,{vol:.6});for(let k=0;k<8;k++)hat(tb+k*beat/2,.45);popKick(tb,.7);clap(tb+2*beat,.8);}
  vox(t,beat,TUNE,tuned);return 16*beat+1.5;}
DEMOS["tune-off"]=t=>tuneDemo(t,false);DEMOS["tune-on"]=t=>tuneDemo(t,true);
function scDemo(t,on){const beat=bt(124),a=A(),duck=a.createGain();duck.connect(bus);const n=8;
  for(let i=0;i<n;i++){const tb=t+i*4*beat,[r,ch]=C[i%4];pad(tb,ch.concat(ch.map(m=>m+12)),4*beat+.02,{vol:1.4,cut:1400,open:2600,att:.05,out:duck});for(let q=0;q<4;q++){const tt=tb+q*beat;popKick(tt,1);if(on){duck.gain.setValueAtTime(1,tt-.005);duck.gain.linearRampToValueAtTime(.08,tt+.01);duck.gain.linearRampToValueAtTime(1,tt+beat*.85);}hat(tt+beat/2,.7);}clap(tb+beat,.7);clap(tb+3*beat,.7);pluck(tb,r-12,"sb",{vol:1,dur:4*beat});}
  return n*4*beat+1;}
DEMOS["sc-off"]=t=>scDemo(t,false);DEMOS["sc-on"]=t=>scDemo(t,true);
DEMOS["808"]=t=>{b808(t,33,2.2,{vol:1});b808(t+2.6,33,1.6,{vol:1,from:45,glide:.25});const beat=bt(140),t0=t+4.8,P=[[0,33,1.5],[1.5,33,.5],[2,40,1,33],[3,31,1]],Q=[[0,33,.75],[.75,33,.75],[1.5,36,1,33],[2.5,38,.5],[3,31,1,38]];
  for(let i=0;i<4;i++){const tb=t0+i*4*beat;(i%2?Q:P).forEach(([b,m,d,fr])=>b808(tb+b*beat,m,d*beat*.98,{vol:1,from:fr,glide:.1}));trapBar(tb,beat,{roll:i===3});popKick(tb,.5);}return 4.8+16*beat+1.2;};
/* 06 三种节奏 */
function grooveDemo(t,kind){const tempo={disco:120,trap:140,dembow:95}[kind],beat=bt(tempo),n=kind==="trap"?4:8;
  for(let i=0;i<n;i++){const tb=t+i*4*beat,[r,ch]=AMC[i%4];
    if(kind==="disco"){four(tb,beat,{crash:i%4===0?.6:0});for(let k=0;k<8;k++)pluck(tb+k*beat/2,r-12+(k%2?12:0),"sb",{vol:1,mute:beat*.4});[0,1.5,2.5,3.5].forEach(x=>stab(tb+x*beat,ch.map(m=>m+12),beat*.35,.8));}
    if(kind==="trap"){trapBar(tb,beat,{roll:i%2===1,crash:i===0?.5:0});popKick(tb,.6);popKick(tb+1.75*beat,.5);b808(tb,r-12,beat*1.5,{vol:1});b808(tb+1.75*beat,r-12,beat*.7,{vol:.9});b808(tb+2.5*beat,r-5,beat*1.4,{vol:.9,from:r-12,glide:.12});pad(tb,ch.map(m=>m+12),4*beat,{vol:.55,cut:500,open:1200});}
    if(kind==="dembow"){dembow(tb,beat,{crash:i%4===0?.5:0});[0,.75,1.5,2,2.75,3.5].forEach(x=>stab(tb+x*beat,ch.map(m=>m+12),beat*.25,.6));pluck(tb,r-12,"sb",{vol:1,mute:beat*.7});pluck(tb+.75*beat,r-12,"sb",{vol:.8,mute:beat*.6});pluck(tb+2*beat,r-12,"sb",{vol:1,mute:beat*.7});pluck(tb+2.75*beat,r-12,"sb",{vol:.8,mute:beat*.6});}}
  return n*4*beat+1;}
DEMOS["b-disco"]=t=>grooveDemo(t,"disco");DEMOS["b-trap"]=t=>grooveDemo(t,"trap");DEMOS["b-dembow"]=t=>grooveDemo(t,"dembow");
/* 07 K-pop 段落切换 */
DEMOS.kpop=(t,btn)=>{const beat=bt(120),st=stripNear(btn);lightStrip(st,t,16*beat,3);
  for(let i=0;i<4;i++){const tb=t+i*4*beat,[r,ch]=AMC[i];four(tb,beat,{crash:i===0?.8:0});[.5,1.5,2.5,3.5].forEach(x=>stab(tb+x*beat,ch.map(m=>m+12),beat*.3,.9));for(let k=0;k<8;k++)pluck(tb+k*beat/2,r-12+(k%2?12:0),"sb",{vol:1,mute:beat*.4});vline(tb,beat,[[0,76,.5],[.5,76,.5],[1,79,1],[2,76,.5],[2.5,74,1.5]].map(([b,m,d])=>[b,m-(i===1?1:i===2?0:2),d]),{vol:.75});}
  const t2=t+16*beat;for(let i=0;i<4;i++){const tb=t2+i*4*beat,[r]=AMC[i];trapBar(tb,beat,{roll:i%2===1,crash:i===0?.8:0});popKick(tb,.7);b808(tb,r-12,beat*1.6,{vol:1});b808(tb+2.5*beat,r-12,beat*1.2,{vol:.9});
    for(let k=0;k<16;k++)if(k%4!==3)voice(tb+k*beat/4,64+(k%8===6?2:0),beat*.2,{vowel:k%2?"o":"a",vol:.5,vibDepth:0,from:0,glide:.01});}
  const t3=t2+16*beat,BL=[0,0,12,0,10,0,7,5];for(let i=0;i<4;i++){const tb=t3+i*4*beat;for(let q=0;q<4;q++)popKick(tb+q*beat,1.2);clap(tb+beat,1.1);clap(tb+3*beat,1.1);snare(tb+beat,.8);snare(tb+3*beat,.8);for(let k=0;k<16;k++)hat(tb+k*beat/4,k%4===2?.8:.35);if(i%2===0)crash(tb,.7);
    BL.forEach((iv,k)=>synth(tb+k*beat/2,33+iv,beat*.42,{vol:1.6,cut:300,open:2200,att:.005,q:6,waves:[["sawtooth",0],["square",-5]]}));}
  const e=t3+16*beat;stab(e,[57,60,64,69],1.5);popKick(e,1.2);crash(e);return 48*beat+2;};
/* 08 中国风 */
const ZH=[[[0,76,1,-2],[1,74,.5],[1.5,72,.5],[2,74,1.5],[3.5,76,.5]],[[0,79,1.5],[1.5,76,.5],[2,74,1],[3,72,1]],[[0,69,1,-2],[1,72,.5],[1.5,74,.5],[2,76,1],[3,74,1]],[[0,72,1],[1,69,.5],[1.5,67,.5],[2,69,2,-2]],
  [[0,72,.5],[.5,74,.5],[1,76,1],[2,79,1],[3,81,1]],[[0,79,1.5,-2],[1.5,76,.5],[2,74,1],[3,76,1]],[[0,74,1],[1,72,1],[2,69,1],[3,67,1]],[[0,69,1],[1,72,1],[2,72,2,-2]]];
const ZHC=[[48,[64,67,71,74]],[45,[60,64,67,72]],[41,[57,60,64,69]],[43,[59,62,65,69]]];
DEMOS.cnstyle=t=>{const beat=bt(78);[60,62,64,67,69,72,74,76,79,81,84].forEach((m,i)=>pluck(t+i*.045,m,"zh",{vol:.8,dur:1.6}));const t0=t+1.2;
  for(let i=0;i<8;i++){const tb=t0+i*4*beat,[r,ch]=ZHC[i%4];ch.forEach(m=>epiano(tb,m,beat*1.8,.6));ch.forEach(m=>epiano(tb+2.5*beat,m,beat*1.3,.5));pluck(tb,r-12,"sb",{vol:1,mute:beat*1.4});pluck(tb+1.75*beat,r-12,"sb",{vol:.8,mute:beat*.6});pluck(tb+2.5*beat,r-12,"sb",{vol:.9,mute:beat*1.2});
    popKick(tb,.9);popKick(tb+1.75*beat,.6);popKick(tb+2.5*beat,.7);snare(tb+beat,.7);clap(tb+beat,.5);snare(tb+3*beat,.7);clap(tb+3*beat,.5);for(let k=0;k<8;k++)hat(swing8(tb,beat,k,true),k%2?.35:.6);
    ZH[i].forEach(([b,m,d,fr])=>{pluck(tb+b*beat,m,"zh",{vol:1.2,dur:Math.max(.8,d*beat+.4),from:fr,hold:.04,glide:.16,vib:d>=1.5});});}
  const e=t0+32*beat;[48,60,64,67,72].forEach(m=>epiano(e,m,2.6));pluck(e,72,"zh",{vol:1.2,dur:2.6,vib:true});return 1.2+32*beat+2.8;};
/* 09 前奏与加速版 */
function hookChorus(t,tempo,tr,n=4){const beat=bt(tempo);for(let i=0;i<n;i++){const tb=t+i*4*beat,[r,ch]=C[i%4];four(tb,beat,{crash:i===0?.6:0});[.5,1.5,2.5,3.5].forEach(x=>stab(tb+x*beat,ch.map(m=>m+12+tr),beat*.3,.8));for(let k=0;k<8;k++)pluck(tb+k*beat/2,r-12+tr+(k%2?12:0),"sb",{vol:1,mute:beat*.4});vline(tb,beat,CHO[i%4],{vol:.8,tr});}return n*4*beat;}
DEMOS["intro-80s"]=t=>{const beat=bt(104);for(let i=0;i<8;i++){const tb=t+i*4*beat,[r,ch]=C[i%4];pad(tb,ch.map(m=>m+12),4*beat,{vol:2,cut:600,open:1400+i*200,att:.6});if(i>=2){for(let k=0;k<8;k++)pluck(tb+k*beat/2,r-12,"sb",{vol:.9,mute:beat*.4});}if(i>=4){popKick(tb);popKick(tb+2*beat);through(gatedChain(),()=>{snare(tb+beat,1.2);snare(tb+3*beat,1.2);});for(let k=0;k<8;k++)hat(tb+k*beat/2,.5);}if(i===4)crash(tb,.7);
    if(i>=2&&i<6)[[0,79,1],[1,76,1],[2,74,2]].forEach(([b,m,d])=>synth(tb+b*beat,m-(i%2?3:0),d*beat*.9,{vol:.45,cut:1500,open:3500,waves:[["square",0],["sawtooth",6]]}));}
  const t1=t+32*beat;return 32*beat+hookChorus(t1,104,0,2)+1;};
DEMOS["intro-now"]=t=>hookChorus(t,104,0,4)+1;
DEMOS["speed-orig"]=t=>hookChorus(t,104,0,4)+1;
DEMOS["speed-up"]=t=>hookChorus(t,125,3,4)+1;

/* ================= 调度 ================= */
const GAIN={form:1.4,"hook-off":1,"hook-on":1,"axis-a":1.6,"axis-b":.95,"axis-c":.5,canon:4,"tune-off":.43,"tune-on":.43,"sc-off":1.1,"sc-on":1.1,"808":.35,"b-disco":1.8,"b-trap":.4,"b-dembow":2,kpop:.75,cnstyle:1.8,"intro-80s":1,"intro-now":1,"speed-orig":1,"speed-up":.8};
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
function runDemo(name,btn){newBus();bus.gain.value=GAIN[name]||1;if(["axis-b","canon","cnstyle","form","tune-off","tune-on","intro-80s"].includes(name))addRoom(2.2,.35);setActive(btn);const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;later(()=>clearActive(),d+.4);}
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);
/* 小节标题的“播放进度” */
(()=>{const hs=[...document.querySelectorAll("article h2")];hs.forEach((h,i)=>h.style.setProperty("--pos",`${Math.round((i+1)/hs.length*100)}%`));})();

/* ================= 推荐曲目：歌单 ================= */
const SONGS=[
  {side:"A",q:"邓丽君 月亮代表我的心",title:"月亮代表我的心",by:"邓丽君",yr:"1977",style:"华语流行",
   txt:"这首歌最早由陈芬兰在 1973 年演唱，1977 年邓丽君的版本让它传遍整个华语世界。轻、柔、几乎不用力的唱法，是邓丽君的标志。",
   listen:["数一数前奏多长，对照图 9","嗓音的“气声”和轻柔的颤音"]},
  {side:"A",q:"Michael Jackson Billie Jean",title:"Billie Jean",by:"Michael Jackson",yr:"1983",style:"流行 · 放克",
   txt:"专辑《Thriller》中的单曲。贝斯线和鼓点几乎从头到尾不变，整首歌的张力靠人声和编曲一层层叠出来。它的 MV 也是 MTV 早期最重要的视频之一。",
   listen:["贝斯线就是钩子之一","鼓的节奏几乎不变，什么在变？"]},
  {side:"A",q:"Madonna Like a Prayer",title:"Like a Prayer",by:"Madonna",yr:"1989",style:"流行 · 福音",
   txt:"把教堂合唱团式的福音和声和舞曲节奏放在一起。Madonna 是 1980 年代最懂得用形象和视频制造话题的流行歌手。",
   listen:["合唱团什么时候进来？","安静的开头和满的副歌"]},
  {side:"A",q:"Britney Spears Baby One More Time",title:"…Baby One More Time",by:"Britney Spears",yr:"1998",style:"青少年流行",
   txt:"本章开头那首歌，由 Max Martin 在斯德哥尔摩写成。开头三个钢琴音就是一个钩子。",
   listen:["对照图 2，画出它的结构","开头的钢琴音和之后的钩子"]},
  {side:"A",q:"Cher Believe",title:"Believe",by:"Cher",yr:"1998",style:"流行 · 舞曲",
   txt:"第一首把极端设置的 Auto-Tune 当作卖点的热门单曲。四拍底鼓，是标准的电子舞曲流行。",
   listen:["主歌里人声“一格一格跳”的地方，对照 Lab 05","节奏是哪一种？对照图 7"]},
  {side:"A",q:"周杰伦 东风破",title:"东风破",by:"周杰伦",yr:"2003",style:"华语流行 · 中国风",
   txt:"方文山作词，周杰伦作曲。R&amp;B 的节奏和编曲，加上五声音阶的旋律和二胡、琵琶的音色，常被看作“中国风”的代表作。",
   listen:["旋律用了几个音？对照 Lab 08","哪些声音是“西方”的，哪些是“东方”的？"]},
  {side:"B",q:"PSY Gangnam Style",title:"江南 Style",by:"PSY",yr:"2012",style:"K-pop · 电子舞曲",
   txt:"第一个播放量突破十亿次的 YouTube 视频。大多数听众听不懂韩语，却记住了它的舞蹈和那句钩子。",
   listen:["四拍底鼓和“掉落”段","钩子是一句歌词、一个声音，还是一个舞蹈动作？"]},
  {side:"B",q:"邓紫棋 光年之外",title:"光年之外",by:"G.E.M. 邓紫棋",yr:"2016",style:"华语流行",
   txt:"为电影《太空旅客》中文版写的主题曲。抒情的主歌和爆发力很强的副歌，是 2010 年代华语流行抒情歌的典型写法。",
   listen:["主歌、导歌、副歌的“能量”变化，对照图 2","鼓什么时候进来？"]},
  {side:"B",q:"Luis Fonsi Despacito Daddy Yankee",title:"Despacito",by:"Luis Fonsi ft. Daddy Yankee",yr:"2017",style:"拉丁流行 · 雷鬼动",
   txt:"西班牙语歌曲，在美国单曲榜连续 16 周第一。前半段是吉他伴奏的拉丁流行，进入副歌后变成雷鬼动的节奏。",
   listen:["找到 dembow 节奏，对照 Lab 06","前奏的吉他和后面的节奏有什么不同？"]},
  {side:"B",q:"Billie Eilish bad guy",title:"bad guy",by:"Billie Eilish",yr:"2019",style:"流行 · 卧室流行",
   txt:"由 Billie Eilish 和哥哥 Finneas 在家里的卧室录音室完成。低语般的人声、极简的低音和鼓，结尾突然换成另一种速度和风格。",
   listen:["人声为什么这么“近”？","结尾的风格切换，对照 Lab 07"]},
  {side:"B",q:"The Weeknd Blinding Lights",title:"Blinding Lights",by:"The Weeknd",yr:"2019",style:"合成器流行",
   txt:"1980 年代式的合成器和鼓机，配上当代的制作。2021 年被美国 Billboard 评为其单曲榜史上成绩最好的歌曲。",
   listen:["这些合成器声音像哪个年代？对照 Lab 09 的“1980 年代式”","节奏是四拍底鼓吗？"]},
  {side:"B",q:"BTS Dynamite",title:"Dynamite",by:"BTS",yr:"2020",style:"K-pop · 迪斯科流行",
   txt:"BTS 第一首全英文单曲，也是第一首登上美国单曲榜第一的全韩国人组合的歌。复古的迪斯科编曲和明亮的铜管。",
   listen:["迪斯科的四拍底鼓和八度跳动的贝斯","后副歌的小钩子在哪里？"]}
];
const ICON="M8 5v14l11-7z";
SONGS.forEach((s,i)=>{
  const el=document.createElement("div");el.className="song";
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<div class="cover" style="--h:${(i*37+300)%360}" aria-hidden="true">${String(i+1).padStart(2,"0")}</div><div class="meta"><span class="title">${s.title}</span><span class="by">${s.by}</span><div class="pmeta"><span class="yr">${s.yr}</span><span class="style">${s.style}</span></div></div>
  <p>${s.txt}</p><ul class="listen">${s.listen.map(x=>`<li>${x}</li>`).join("")}</ul>
  <div class="listen-links"><a class="main" href="${yt}" target="_blank" rel="noopener">${s.yt?"YouTube 官方音源":"YouTube 搜索"}</a>
  <a href="https://music.163.com/#/search/m/?s=${q}&type=1" target="_blank" rel="noopener">网易云</a>
  <a href="https://y.qq.com/n/ryqq/search?w=${q}" target="_blank" rel="noopener">QQ音乐</a></div>
  <a class="playlink" href="${yt}" target="_blank" rel="noopener" aria-label="在 YouTube 收听 ${s.title}"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="${ICON}"/></svg></a>`;
  document.getElementById(s.side==="A"?"songsA":"songsB").appendChild(el);
});

/* ================= 原创图解 ================= */
const NS="http://www.w3.org/2000/svg";
function S(p,tag,a,txt){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e;}
const TB="font-family:var(--font-body);font-size:14px;font-weight:900";
const FILL=c=>`fill:var(--${c})`;
function arrow(g,x1,y1,x2,y2,cls="sv-l"){S(g,"line",{x1,y1,x2,y2,class:cls,"stroke-width":1.8});const a=Math.atan2(y2-y1,x2-x1),l=8;S(g,"path",{d:`M ${x2-l*Math.cos(a-.45)} ${y2-l*Math.sin(a-.45)} L ${x2} ${y2} L ${x2-l*Math.cos(a+.45)} ${y2-l*Math.sin(a+.45)}`,class:cls,"stroke-width":1.8,fill:"none"});}
/* 图 1 生产线 */
(()=>{const g=document.getElementById("pipe-fig");if(!g)return;const B=[["伴奏","beat / track","制作人",0],["topline","旋律与歌词","词曲作者",0],["录人声","一句唱很多遍","歌手",1],["修音与编辑","Auto-Tune、拼接","人声制作",0],["混音","平衡几十条音轨","混音师",0],["母带","最终的响度与质感","母带工程师",0],["发行","流媒体 · 短视频","听众",1]];
  const W=136,H=64,pos=[[30,50],[196,50],[362,50],[528,50],[528,190],[362,190],[196,190]];
  B.forEach(([a,b,who,hot],i)=>{const [x,y]=pos[i];S(g,"rect",{x,y,width:W-14,height:H,rx:16,style:hot?FILL("red"):"",class:hot?"":"sv-card"});if(!hot)S(g,"rect",{x,y,width:W-14,height:H,rx:16,class:"sv-l"});
    S(g,"text",{x:x+(W-14)/2,y:y+28,"text-anchor":"middle",class:hot?"sv-on":"sv-t",style:"font-size:14px;font-weight:900"},a);S(g,"text",{x:x+(W-14)/2,y:y+48,"text-anchor":"middle",class:hot?"sv-on":"sv-m",style:"font-size:11px"},b);
    S(g,"text",{x:x+(W-14)/2,y:y-10,"text-anchor":"middle",class:"sv-r",style:"font-size:11.5px;font-weight:700"},who);});
  for(let i=0;i<3;i++)arrow(g,pos[i][0]+W-12,82,pos[i+1][0]-4,82,"sv-l");arrow(g,589,116,589,174,"sv-l");for(let i=4;i<6;i++)arrow(g,pos[i][0]-2,222,pos[i+1][0]+W-12,222,"sv-l");
  S(g,"text",{x:30,y:290,class:"sv-ts"},"红色：歌手和听众，是大多数人唯一看得到的两端");
})();
/* 图 2 结构 */
(()=>{const g=document.getElementById("form-fig");if(!g)return;const F=[["前奏",2,.3],["主歌",8,.35],["导歌",4,.6],["副歌",8,.95,1],["后副歌",4,.8,1],["主歌",8,.45],["导歌",4,.65],["副歌",8,1,1],["后副歌",4,.85,1],["桥段",8,.4],["副歌",8,1,1],["结尾",4,.3]];
  const x0=40,W=600,tot=F.reduce((s,f)=>s+f[1],0),base=170;let x=x0;
  F.forEach(([n,b,e,hook])=>{const w=b/tot*W,h=e*130;S(g,"rect",{x:x+1,y:base-h,width:w-2,height:h,rx:6,style:FILL(hook?"red":n==="导歌"?"denim":"ink"),opacity:hook?.95:n==="导歌"?.8:.22});
    S(g,"text",{x:x+w/2,y:base+18,"text-anchor":"middle",class:"sv-t",style:`font-size:${w<30?10:11.5}px;font-weight:700`},n);x+=w;});
  S(g,"line",{x1:x0,y1:base,x2:x0+W,y2:base,class:"sv-l"});S(g,"text",{x:x0,y:base+44,class:"sv-ts"},"宽度 = 小节数　高度 = 能量");S(g,"text",{x:x0,y:24,class:"sv-m"},"能量 ↑");
})();
/* 图 3 四和弦循环 */
(()=>{const g=document.getElementById("loop-fig");if(!g)return;const cx=340,cy=140,R=86,N=[["C","I",-90,"ink"],["G","V",0,"ink"],["Am","vi",90,"red"],["F","IV",180,"ink"]];
  S(g,"circle",{cx,cy,r:R,class:"sv-lline","stroke-width":2,fill:"none"});
  N.forEach(([n,rn,deg,c],i)=>{const a=deg*Math.PI/180,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);const a2=(deg+90)*Math.PI/180;
    const mid=(deg+45)*Math.PI/180;arrow(g,cx+R*Math.cos(mid-.18)+0,cy+R*Math.sin(mid-.18),cx+R*Math.cos(mid+.18),cy+R*Math.sin(mid+.18),"sv-lr");
    S(g,"circle",{cx:x,cy:y,r:30,style:FILL(c==="red"?"red":"ink")});S(g,"text",{x,y:y+2,"text-anchor":"middle",class:"sv-on",style:"font-size:17px;font-weight:900"},n);S(g,"text",{x,y:y+18,"text-anchor":"middle",class:"sv-on",style:"font-size:10.5px;opacity:.85"},rn);});
  S(g,"text",{x:cx,y:cy+5,"text-anchor":"middle",class:"sv-ts"},"循环");
  S(g,"text",{x:40,y:60,class:"sv-t",style:TB},"从 C 进入");S(g,"text",{x:40,y:82,class:"sv-m"},"C – G – Am – F");S(g,"text",{x:40,y:102,class:"sv-m"},"明亮、向上");
  S(g,"text",{x:480,y:200,class:"sv-r",style:TB},"从 Am 进入");S(g,"text",{x:480,y:222,class:"sv-m"},"Am – F – C – G");S(g,"text",{x:480,y:242,class:"sv-m"},"忧伤、内省");
})();
/* 图 4 卡农低音 */
(()=>{const g=document.getElementById("canon-fig");if(!g)return;const CH=["C","G/B","Am","Em/G","F","C/E","F","G"],BN=["C","B","A","G","F","E","F","G"],BV=[7,6,5,4,3,2,3,4],x0=60,w=72;
  CH.forEach((c,i)=>{const x=x0+i*w;S(g,"rect",{x:x+4,y:20,width:w-8,height:40,rx:12,class:"sv-ink"});S(g,"text",{x:x+w/2,y:46,"text-anchor":"middle",class:"sv-on",style:"font-size:14px;font-weight:900"},c);});
  let d="";BN.forEach((n,i)=>{const x=x0+i*w+w/2,y=230-BV[i]*20;d+=(i?" L ":"M ")+`${x} ${y}`;});S(g,"path",{d,class:"sv-lr","stroke-width":2.4,fill:"none"});
  BN.forEach((n,i)=>{const x=x0+i*w+w/2,y=230-BV[i]*20;S(g,"line",{x1:x,y1:62,x2:x,y2:y-12,class:"sv-lline"});S(g,"circle",{cx:x,cy:y,r:12,style:FILL("red")});S(g,"text",{x,y:y+4.5,"text-anchor":"middle",class:"sv-on",style:"font-size:12px;font-weight:900"},n);});
  S(g,"text",{x:x0,y:258,class:"sv-ts"},"低音：C B A G F E 一级一级往下，然后 F G 往上，回到开头");
})();
/* 图 5 音高曲线 */
(()=>{const g=document.getElementById("tune-fig");if(!g)return;const segs=[[0,67,1],[1,69,.5],[1.5,72,1.5],[3,71,1],[4,69,.5],[4.5,67,1.5],[6,64,2]],x0=140,W=500,tb=8,yOf=(m,base)=>base-(m-64)*7;
  [["自然人声",80,0],["Auto-Tune 开到最快",200,1]].forEach(([n,base,tuned])=>{S(g,"text",{x:20,y:base-30,class:"sv-t",style:TB},n);
    segs.forEach(([b,m,d])=>{const x1=x0+b/tb*W,x2=x0+(b+d)/tb*W,y=yOf(m,base);S(g,"line",{x1,y1:y,x2,y2:y,style:"stroke:var(--ink-2)",opacity:.55,"stroke-width":1.2,"stroke-dasharray":"4 3"});});
    let p="";segs.forEach(([b,m,d],i)=>{const x1=x0+b/tb*W,x2=x0+(b+d)/tb*W,y=yOf(m,base),py=i?yOf(segs[i-1][1],base):y+8;
      if(tuned){p+=(i?` L ${x1} ${py} L ${x1} ${y}`:`M ${x1} ${y}`)+` L ${x2} ${y}`;}
      else{p+=(i?` L ${x1} ${py+2}`:`M ${x1} ${py}`)+` Q ${x1+8} ${y+3} ${x1+16} ${y}`;for(let x=x1+16;x<x2;x+=4)p+=` L ${x} ${(y+Math.sin((x-x1)/6)*2.2*Math.min(1,(x-x1)/40)).toFixed(1)}`;}});
    S(g,"path",{d:p,class:tuned?"sv-lr":"sv-l","stroke-width":2.6,fill:"none"});});
})();
/* 图 6 侧链 */
(()=>{const g=document.getElementById("sc-fig");if(!g)return;const x0=110,W=520,n=8;
  S(g,"text",{x:20,y:46,class:"sv-t",style:TB},"底鼓");S(g,"text",{x:20,y:150,class:"sv-t",style:TB},"和弦音量");
  for(let i=0;i<n;i++){const x=x0+i*W/n;S(g,"rect",{x:x,y:28,width:14,height:28,rx:4,style:FILL("ink")});}
  let d=`M ${x0} 110`;for(let i=0;i<n;i++){const x=x0+i*W/n,nx=x0+(i+1)*W/n;d+=` L ${x} 110 L ${x+3} 178 Q ${x+(nx-x)*.35} 112 ${nx} 110`;}
  S(g,"path",{d:d+` L ${x0+W} 190 L ${x0} 190 Z`,style:FILL("red"),opacity:.15});S(g,"path",{d,class:"sv-lr","stroke-width":2.4,fill:"none"});
  S(g,"line",{x1:x0,y1:190,x2:x0+W,y2:190,class:"sv-l"});S(g,"text",{x:x0,y:212,class:"sv-ts"},"底鼓一响，和弦被压下去，然后“吸一口气”涨回来");
})();
/* 图 7 三种节奏 */
(()=>{const g=document.getElementById("beat-fig");if(!g)return;const x0=170,cw=28,lh=18,all=[...Array(16).keys()];
  const B=[["四拍底鼓","迪斯科 · 浩室",{踩镲:[2,6,10,14],拍手:[4,12],底鼓:[0,4,8,12]},[]],["Trap","嘻哈 · 半速感",{踩镲:[0,2,4,6,8,10,12,14],拍手:[8],"808 低音":[0,3,10]},[6,14]],["雷鬼动","dembow · 3+3+2",{踩镲:[0,2,4,6,8,10,12,14],军鼓:[3,6,11,14],底鼓:[0,4,8,12]},[]]];
  B.forEach(([n,sub,L,rolls],b)=>{const y=16+b*122;S(g,"text",{x:20,y:y+20,class:"sv-t",style:TB},n);S(g,"text",{x:20,y:y+40,class:"sv-m"},sub);
    Object.entries(L).forEach(([lane,hits],li)=>{const yy=y+li*(lh+6);S(g,"text",{x:x0-8,y:yy+13,"text-anchor":"end",class:"sv-ts"},lane);
      all.forEach(k=>{const on=hits.includes(k),roll=li===0&&rolls.includes(k);if(roll){for(let r=0;r<3;r++)S(g,"rect",{x:x0+k*cw+r*8,y:yy,width:6.5,height:lh,rx:2,style:FILL("red")});return;}
        S(g,"rect",{x:x0+k*cw,y:yy,width:cw-4,height:lh,rx:5,style:on?FILL(li===2?"red":"denim"):"",class:on?"":"sv-card"});if(!on)S(g,"rect",{x:x0+k*cw,y:yy,width:cw-4,height:lh,rx:5,class:"sv-lline"});});});});
})();
/* 图 8 华语时间线 */
(()=>{const g=document.getElementById("cn-fig");if(!g)return;const X=y=>60+(y-1972)*11.3;
  S(g,"line",{x1:50,y1:120,x2:650,y2:120,class:"sv-l","stroke-width":2});
  const E=[[1977,"邓丽君",-1],[1984,"罗大佑",1],[1992,"四大天王",-1],[2003,"周杰伦 · 中国风",1],[2005,"选秀 · 网络歌曲",-1],[2020,"短视频",-1]];
  E.forEach(([y,t,s],i)=>{const x=X(y);S(g,"circle",{cx:x,cy:120,r:8,style:FILL(i===3?"red":"denim")});S(g,"line",{x1:x,y1:120+s*10,x2:x,y2:120+s*34,class:"sv-lline"});S(g,"text",{x,y:120+s*44+(s>0?6:0),"text-anchor":"middle",class:"sv-t",style:"font-size:13px;font-weight:900"},t);S(g,"text",{x,y:120+s*60+(s>0?6:0),"text-anchor":"middle",class:"sv-m",style:"font-size:11px"},`${y} 年前后`);});
  const M=[[1972,1995,"磁带"],[1995,2005,"CD"],[2005,2012,"MP3 · 网络"],[2012,2019,"流媒体"],[2019,2025,"短视频"]];
  M.forEach(([a,b,t],i)=>{S(g,"rect",{x:X(a)+1,y:212,width:X(b)-X(a)-2,height:26,rx:13,style:FILL(["ink","denim","mustard","denim","red"][i]),opacity:.85});S(g,"text",{x:(X(a)+X(b))/2,y:229,"text-anchor":"middle",class:"sv-on",style:"font-size:11.5px;font-weight:700"},t);});
  S(g,"text",{x:50,y:205,class:"sv-ts"},"主要媒介（大致）");
})();
/* 图 9 前奏长度 */
(()=>{const g=document.getElementById("intro-fig");if(!g)return;const x0=120,sc=20;
  [["1986",23,"约 23 秒"],["2015",5,"约 5 秒"]].forEach(([y,v,t],i)=>{const yy=40+i*76;S(g,"text",{x:20,y:yy+26,class:"sv-t",style:"font-family:var(--font-wood);font-size:20px;font-weight:700"},y);S(g,"rect",{x:x0,y:yy,width:v*sc,height:40,rx:20,style:FILL(i?"red":"denim")});S(g,"text",{x:x0+v*sc+12,y:yy+26,class:"sv-t",style:"font-size:15px;font-weight:900"},t);});
  S(g,"text",{x:x0,y:206,class:"sv-ts"},"歌手开口前的器乐前奏，美国年度前十热门歌曲的平均值");
})();
/* 外部照片 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`照片待放入：${img.getAttribute("src")}<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张照片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
