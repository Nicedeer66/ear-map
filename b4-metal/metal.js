/* ================= 金属：乐器 ================= */
Object.assign(INST,{
  mt:{bright:.93,decay:.9992,dur:1.6,vol:.1,drive:42,lp:4300,peak:[750,-7]},
  mpm:{bright:.88,decay:.999,dur:.7,vol:.13,drive:42,lp:1500},
  ml:{bright:.9,decay:.9994,dur:2.4,vol:.11,drive:26,lp:3700},
  bk:{bright:.96,decay:.999,dur:.6,vol:.075,drive:30,lp:5200,peak:[2600,5]},
  bsd:{bright:.4,decay:.996,dur:1,vol:.7,drive:3,lp:1100}
});
/* 金属底鼓：短、带“咔”的点击声 */
function mkick(t,v=1){const a=A(),o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(170,t);o.frequency.exponentialRampToValueAtTime(48,t+.05);g.gain.setValueAtTime(.9*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g).connect(bus);o.start(t);o.stop(t+.18);track(o);
  const n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=3200;f.Q.value=1.2;const ng=a.createGain();ng.gain.setValueAtTime(.35*v,t);ng.gain.exponentialRampToValueAtTime(.001,t+.015);n.connect(f).connect(ng).connect(bus);n.start(t);n.stop(t+.02);track(n);}
function ride(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=6500;f.Q.value=.8;const g=a.createGain();g.gain.setValueAtTime(.12*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+.36);track(n);}
function pc(t,r,inst,o={}){strum(t,[r,r+7,r+12],inst,{vol:o.vol||1,mute:o.mute,dur:o.dur,spread:.003});}
function chug(t,r,len,v=1){strum(t,[r,r+7],"mpm",{vol:1.25*v,mute:len||.09,spread:.002});}
function bassN(t,r,len){pluck(t,r-12,"bsd",{vol:.9,mute:len});}
function panned(p,fn){const n=A().createStereoPanner();n.pan.value=p;via(n,fn);}
/* 三个“段落型”工具：按 [拍, 种类, 音, 时值] 演奏 */
function playSeq(t,beat,seq,o={}){seq.forEach(([b,k,m,d=.5])=>{const tt=t+b*beat,len=d*beat*.92;
  if(k==="c"){chug(tt,m,Math.min(len,.12));if(o.bass!==false)bassN(tt,m,len);}
  else if(k==="p"){pc(tt,m,"mt",{mute:len,vol:1.1});if(o.bass!==false)bassN(tt,m,len);}
  else if(k==="n"){pluck(tt,m,"mt",{vol:1.5,mute:len,dur:Math.max(.4,len+.1),vib:d>=1});if(o.bass!==false)bassN(tt,m,len);}});}
function metalBar(tb,beat,type,o={}){const s=beat/4;
  if(type==="rock"){for(let k=0;k<8;k++)hat(tb+k*beat/2,k%2?.5:.9);mkick(tb);mkick(tb+2*beat);mkick(tb+2.5*beat,.7);snare(tb+beat,1.1);snare(tb+3*beat,1.1);}
  if(type==="half"){for(let k=0;k<8;k++)hat(tb+k*beat/2,k%2?.4:.8);mkick(tb);mkick(tb+.5*beat,.8);mkick(tb+1.5*beat,.8);snare(tb+2*beat,1.3);}
  if(type==="skank"){for(let q=0;q<4;q++){mkick(tb+q*beat);snare(tb+q*beat+beat/2,1);ride(tb+q*beat,.8);hat(tb+q*beat+beat/2,.6);}}
  if(type==="double"){for(let k=0;k<16;k++)mkick(tb+k*s,k%4?.7:1);for(let q=0;q<4;q++)ride(tb+q*beat,.9);snare(tb+beat,1.2);snare(tb+3*beat,1.2);}
  if(type==="blast"){for(let k=0;k<16;k++){mkick(tb+k*s,.75);hat(tb+k*s,.7);if(k%2)snare(tb+k*s,.85);}}
  if(type==="dk8"){for(let k=0;k<8;k++)mkick(tb+k*beat/2,k%2?.7:1);for(let q=0;q<4;q++)hat(tb+q*beat,.8);snare(tb+beat,1.2);snare(tb+3*beat,1.2);}
  if(o.crash)crash(tb,.9);}

/* ================= 示例 ================= */
const DEMOS={};
/* 暴风雨与钟 */
function rain(t,dur){const a=A(),n=a.createBufferSource();n.buffer=noise();n.loop=true;const hp=a.createBiquadFilter();hp.type="highpass";hp.frequency.value=900;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=6000;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.09,t+1.5);g.gain.setValueAtTime(.09,t+dur-2);g.gain.linearRampToValueAtTime(0,t+dur);n.connect(hp).connect(lp).connect(g).connect(bus);n.start(t);n.stop(t+dur+.1);track(n);}
function thunder(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();n.loop=true;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.setValueAtTime(900,t);lp.frequency.exponentialRampToValueAtTime(120,t+1.2);const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.7*v,t+.08);g.gain.setValueAtTime(.45*v,t+.4);g.gain.linearRampToValueAtTime(.55*v,t+.9);g.gain.exponentialRampToValueAtTime(.001,t+4);n.connect(lp).connect(g).connect(bus);n.start(t);n.stop(t+4.1);track(n);}
function bell(t,midi,v=1){const a=A(),f=mf(midi);[[.5,.5,7],[1,.6,5],[1.19,.35,4],[1.5,.25,3.5],[2,.3,3],[2.74,.15,2],[3.76,.08,1.5]].forEach(([h,am,dc])=>{const o=a.createOscillator();o.type="sine";o.frequency.value=f*h;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(am*.22*v,t+.005);g.gain.exponentialRampToValueAtTime(.001,t+dc);o.connect(g).connect(bus);o.start(t);o.stop(t+dc+.05);track(o);});}
DEMOS.storm=t=>{const beat=bt(64),t0=t+7.5,len=16*beat;rain(t,7.5+len+2.5);thunder(t+.6,1);thunder(t+3.4,.6);bell(t+2.2,52);bell(t+4.6,52,.9);bell(t+7,52,.8);
  const A1=[[0,"p",40,1.5],[1.5,"n",52,.5],[2,"n",46,2]],B1=[[0,"p",40,1.5],[1.5,"n",52,.5],[2,"n",41,1],[3,"n",40,1]];
  [A1,B1,A1,B1].forEach((s,i)=>{const tb=t0+i*4*beat;playSeq(tb,beat,s);crash(tb,.8);mkick(tb,1.2);snare(tb+2*beat,1.3);if(i%2)mkick(tb+3.5*beat,.8);});
  pc(t0+len,40,"mt",{dur:3,vol:1.2});bassN(t0+len,40,3);crash(t0+len);mkick(t0+len,1.2);return 7.5+len+3;};
/* 五度与三全音 */
function intervalDemo(t,top){const r=40;strum(t,[r,top,r+12],"mt",{dur:2.4,vol:1.1});bassN(t,r,2.2);pluck(t+2.8,r,"mt",{vol:1.5,dur:1,mute:.9});pluck(t+3.8,top,"mt",{vol:1.5,dur:1.2,mute:1.1,vib:true});strum(t+5.2,[r,top,r+12],"mt",{dur:2.6,vol:1.1});bassN(t+5.2,r,2.4);return 8;}
DEMOS["int-5th"]=t=>intervalDemo(t,47);DEMOS["int-tt"]=t=>intervalDemo(t,46);
DEMOS["int-riff"]=t=>{const beat=bt(100),RA=[[0,"c",40],[.5,"c",40],[1,"p",47,1],[2,"c",40],[2.5,"c",40],[3,"n",46,1]],RB=[[0,"c",40],[.5,"c",40],[1,"p",43,.5],[1.5,"p",42,.5],[2,"c",40],[2.5,"c",40],[3,"p",46,1]];
  [RA,RB,RA,RB].forEach((s,i)=>{const tb=t+i*4*beat;playSeq(tb,beat,s);metalBar(tb,beat,"rock",{crash:i===0});});pc(t+16*beat,40,"mt",{dur:2.2});crash(t+16*beat);mkick(t+16*beat);return 16*beat+2.4;};
/* 三种音阶 */
const SCALES={aeo:[0,2,3,5,7,8,10,12],phr:[0,1,3,5,7,8,10,12],phd:[0,1,4,5,7,8,10,12]};
function modeRiff(t,sc){const beat=bt(132),P="P",bars=[[P,P,1,P,P,2,P,1],[P,P,2,P,3,2,1,P],[P,P,1,P,P,2,P,1],[P,1,2,4,5,4,2,1]];
  bars.forEach((bar,bi)=>{const tb=t+bi*4*beat;bar.forEach((d,k)=>{const tt=tb+k*beat/2;if(d===P){chug(tt,40);bassN(tt,40,beat*.45);}else{const m=40+sc[d];pluck(tt,m,"mt",{vol:1.5,mute:beat*.46});pluck(tt,m+12,"mt",{vol:.6,mute:beat*.46});bassN(tt,m,beat*.45);}});
    for(let k=0;k<8;k++)hat(tb+k*beat/2,k%2?.45:.85);mkick(tb);mkick(tb+.5*beat,.8);mkick(tb+2*beat);mkick(tb+2.5*beat,.8);snare(tb+beat,1.1);snare(tb+3*beat,1.1);if(bi===0)crash(tb,.8);});
  const e=t+16*beat;pc(e,40,"mt",{dur:2});pluck(e,40+sc[1]+12,"ml",{vol:1.2,dur:2,vib:true});crash(e);mkick(e);return 16*beat+2.2;}
DEMOS["mode-aeo"]=t=>modeRiff(t,SCALES.aeo);DEMOS["mode-phr"]=t=>modeRiff(t,SCALES.phr);DEMOS["mode-phd"]=t=>modeRiff(t,SCALES.phd);
/* 奔马与双吉他 */
const GROOTS=[40,48,50,47];
const TWIN=[[[0,71,1],[1,72,.5],[1.5,71,.5],[2,67,1],[3,71,1]],[[0,72,1.5],[1.5,71,.5],[2,69,1],[3,67,1]],[[0,74,1],[1,72,.5],[1.5,71,.5],[2,69,1],[3,66,1]],[[0,66,1.5],[1.5,67,.5],[2,69,1],[3,71,1]],
  [[0,71,1],[1,72,.5],[1.5,71,.5],[2,67,1],[3,71,1]],[[0,72,1.5],[1.5,71,.5],[2,69,1],[3,67,1]],[[0,74,1],[1,76,.5],[1.5,74,.5],[2,72,1],[3,71,1]],[[0,69,1],[1,67,1],[2,66,2]]];
const EMIN=[40,42,43,45,47,48,50];
function third(m){const pcs=EMIN.map(x=>x%12);let i=pcs.indexOf(m%12);if(i<0)return m+3;const j=i+2,up=EMIN[j%7]%12;let r=m;while(r%12!==up||r<=m)r++;return r;}
function gallop(t,beat,gal,bars=8){for(let b=0;b<bars;b++){const tb=t+b*4*beat,r=GROOTS[b%4],hits=gal?[0,.5,.75]:[0,.5];
    for(let q=0;q<4;q++)hits.forEach(h=>{const tt=tb+(q+h)*beat,len=(h===0?(gal?.5:.5):.25)*beat*.85;strum(tt,[r,r+7],"mpm",{vol:1.2,mute:Math.min(len,.12),spread:.002});pluck(tt,r-12,"bsd",{vol:.85,mute:len});});
    for(let k=0;k<8;k++)hat(tb+k*beat/2,k%2?.45:.85);mkick(tb);mkick(tb+2*beat);snare(tb+beat,1.1);snare(tb+3*beat,1.1);if(b%4===0)crash(tb,.8);}
  return bars*4*beat;}
DEMOS["gal-8"]=t=>{const beat=bt(160);return gallop(t,beat,false)+.6;};
DEMOS["gal-run"]=t=>{const beat=bt(160);return gallop(t,beat,true)+.6;};
function twinDemo(t,two){const beat=bt(160),d=gallop(t,beat,true);TWIN.forEach((bar,bi)=>bar.forEach(([b,m,du])=>{const tt=t+(bi*4+b)*beat,dur=du*beat*.95+.1;
    panned(two?-.55:0,()=>pluck(tt,m,"ml",{vol:1.4,dur,mute:dur,vib:du>=2}));if(two)panned(.55,()=>pluck(tt+.006,third(m),"ml",{vol:1.25,dur,mute:dur,vib:du>=2}));}));
  const e=t+d;pc(e,40,"mt",{dur:2.4});crash(e);mkick(e);panned(two?-.55:0,()=>pluck(e,71,"ml",{vol:1.3,dur:2.4,vib:true}));if(two)panned(.55,()=>pluck(e,74,"ml",{vol:1.2,dur:2.4,vib:true}));return d+2.6;}
DEMOS["twin-1"]=t=>twinDemo(t,false);DEMOS["twin-2"]=t=>twinDemo(t,true);
/* 越来越快 */
DEMOS["sp-rock"]=t=>{const beat=bt(120),R=[40,40,43,45];for(let b=0;b<4;b++){const tb=t+b*4*beat,r=R[b];for(let k=0;k<8;k++){pc(tb+k*beat/2,r,"mt",{mute:beat*.42,vol:.85});bassN(tb+k*beat/2,r,beat*.4);}metalBar(tb,beat,"rock",{crash:b===0});}
  const e=t+16*beat;pc(e,40,"mt",{dur:2});crash(e);mkick(e);return 16*beat+2.2;};
DEMOS["sp-thrash"]=t=>{const beat=bt(190),RA=[[0,"c",40],[.5,"c",40],[1,"c",40],[1.5,"n",43],[2,"c",40],[2.5,"c",40],[3,"n",46],[3.5,"n",45]],RB=[[0,"c",40],[.5,"c",40],[1,"c",40],[1.5,"n",43],[2,"c",40],[2.5,"n",41],[3,"p",47,.5],[3.5,"p",46,.5]];
  for(let b=0;b<8;b++){const tb=t+b*4*beat;playSeq(tb,beat,b%2?RB:RA);metalBar(tb,beat,"skank",{crash:b%4===0});}const e=t+32*beat;pc(e,40,"mt",{dur:2});crash(e);mkick(e);return 32*beat+2.2;};
DEMOS["sp-double"]=t=>{const beat=bt(150),s=beat/4;for(let b=0;b<4;b++){const tb=t+b*4*beat;for(let k=0;k<16;k++){const tt=tb+k*s;if(k===12||k===14)pc(tt,b%2?43:41,"mt",{mute:s*1.8});else if(k!==13&&k!==15)chug(tt,40,.07,.9);bassN(tt,k>=12?(b%2?43:41):40,s*.9);}metalBar(tb,beat,"double",{crash:b===0||b===2});}
  const e=t+16*beat;pc(e,40,"mt",{dur:2});crash(e);mkick(e);return 16*beat+2.2;};
DEMOS["sp-blast"]=t=>{const beat=bt(180),s=beat/4,CH=[[52,59,64],[52,59,64],[48,55,60],[47,54,59]];for(let b=0;b<4;b++){const tb=t+b*4*beat;for(let k=0;k<16;k++)strum(tb+k*s,CH[b],"mt",{vol:.55,mute:s*.95,spread:.002});pluck(tb,CH[b][0]-24,"bsd",{vol:.9,dur:4*beat});metalBar(tb,beat,"blast",{crash:true});}
  const e=t+16*beat;pc(e,40,"mt",{dur:2.2});crash(e);mkick(e);return 16*beat+2.4;};
/* 嘶吼与干净人声 */
const VLINE=[[[0,52,1],[1,53,1],[2,52,2]],[[0,55,1.5],[1.5,53,.5],[2,52,2]],[[0,57,1],[1,55,1],[2,53,1],[3,52,1]],[[0,52,3]]];
function slowRiff(t,beat){const R=[[0,"p",40,1],[1,"c",40],[1.5,"c",40],[2,"p",41,1],[3,"c",40],[3.5,"c",40]];for(let b=0;b<4;b++){const tb=t+b*4*beat;playSeq(tb,beat,b===3?[[0,"p",40,4]]:R);metalBar(tb,beat,"half",{crash:b===0||b===3});}}
function growl(t,midi,dur,v=1){const a=A(),f=mf(midi),out=a.createGain();
  const o1=a.createOscillator();o1.type="sawtooth";o1.frequency.setValueAtTime(f*1.05,t);o1.frequency.linearRampToValueAtTime(f,t+.08);o1.frequency.linearRampToValueAtTime(f*.94,t+dur);
  const o2=a.createOscillator();o2.type="square";o2.frequency.value=f/2;const g2=a.createGain();g2.gain.value=.5;
  const n=a.createBufferSource();n.buffer=noise();n.loop=true;const ng=a.createGain();ng.gain.value=.55;
  const rough=a.createGain();rough.gain.value=.6;const l=a.createOscillator();l.type="square";l.frequency.value=31;const lg=a.createGain();lg.gain.value=.4;l.connect(lg).connect(rough.gain);
  o1.connect(rough);o2.connect(g2).connect(rough);n.connect(ng).connect(rough);
  const sh=a.createWaveShaper();sh.curve=shaper(6);rough.connect(sh);
  [[420,4,1],[780,5,.8],[2500,3,.35]].forEach(([fr,q,am])=>{const bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=fr;bp.Q.value=q;const gg=a.createGain();gg.gain.value=am*2.2;sh.connect(bp).connect(gg).connect(out);});
  const g=a.createGain(),vv=.32*v;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vv,t+.05);g.gain.setValueAtTime(vv,t+dur-.12);g.gain.linearRampToValueAtTime(0,t+dur);out.connect(g).connect(bus);
  [o1,o2,n,l].forEach(x=>{x.start(t);x.stop(t+dur+.05);track(x);});}
function vocDemo(t,grr){const beat=bt(90);slowRiff(t,beat);VLINE.forEach((bar,bi)=>bar.forEach(([b,m,d])=>{const tt=t+(bi*4+b)*beat,du=d*beat*.92;if(grr)growl(tt,m-12,du);else voice(tt,m+12,du,{vowel:"a",vol:.8,vibDepth:18});}));return 16*beat+1;}
DEMOS["voc-clean"]=t=>vocDemo(t,false);DEMOS["voc-growl"]=t=>vocDemo(t,true);
function lofiChain(){const a=A(),inp=a.createGain(),hp=a.createBiquadFilter();hp.type="highpass";hp.frequency.value=380;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=3800;const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=2400;pk.gain.value=7;const sh=a.createWaveShaper();sh.curve=shaper(2.2);const out=a.createGain();out.gain.value=.7;inp.connect(hp).connect(pk).connect(lp).connect(sh).connect(out);return [inp,out];}
DEMOS.tremolo=t=>{const beat=bt(168),s=beat/4,CH=[[52,59,64,67],[52,59,64,67],[48,55,60,64],[48,55,60,64],[45,52,57,60],[45,52,57,60],[47,54,59,63],[47,54,59,66]];
  through(lofiChain(),()=>{CH.forEach((ch,b)=>{const tb=t+b*4*beat;for(let k=0;k<16;k++)strum(tb+k*s,ch,"bk",{vol:.8,mute:s*1.1,spread:.0015});pluck(tb,ch[0]-24,"bsd",{vol:.7,dur:4*beat});
    for(let k=0;k<16;k++){mkick(tb+k*s,.5);if(k%2)snare(tb+k*s,.7);}if(b%2===0)crash(tb,.7);});
    const e=t+32*beat;strum(e,[52,59,64,67],"bk",{vol:.9,dur:3});crash(e);});return 32*beat+3.2;};
/* 往下调 */
function lowRiff(t,r){const beat=bt(112),s=beat/4,C=[0,2,3,6,8,9,11];for(let b=0;b<4;b++){const tb=t+b*4*beat;
    C.forEach(k=>{chug(tb+k*s,r,.08);pluck(tb+k*s,r-12,"bsd",{vol:.9,mute:s*.9});mkick(tb+k*s,.85);});
    const c1=b%2?r+1:r+3;pc(tb+12*s,c1,"mt",{mute:s*1.8});pluck(tb+12*s,c1-12,"bsd",{vol:.9,mute:s*1.8});pc(tb+14*s,r+(b%2?0:5),"mt",{mute:s*1.8});mkick(tb+12*s);
    for(let q=0;q<4;q++)hat(tb+q*beat,.8);snare(tb+beat,1.2);snare(tb+3*beat,1.2);if(b===0)crash(tb,.8);}
  const e=t+16*beat;pc(e,r,"mt",{dur:2.2});pluck(e,r-12,"bsd",{vol:1,dur:2});crash(e);mkick(e);return 16*beat+2.4;}
DEMOS["tune-e"]=t=>lowRiff(t,40);DEMOS["tune-d"]=t=>lowRiff(t,38);DEMOS["tune-b"]=t=>lowRiff(t,35);
/* 错位的循环 */
const CYC=[0,1,3];
DEMOS.poly=(t,btn)=>{const beat=bt(120),s=beat/4,bar=4*beat,st=stripNear(btn);lightStrip(st,t,bar,3);lightStrip(st,t+3*bar,bar,3);
  for(let i=0;i<96;i++){const tt=t+i*s,c=i%6;if(CYC.includes(c)){const acc=c===0;if(acc)pc(tt,35,"mt",{mute:s*.9,vol:1});else chug(tt,35,.06,.95);pluck(tt,23,"bsd",{vol:acc?1:.8,mute:s*.8});mkick(tt,acc?1:.75);}}
  for(let b=0;b<6;b++){const tb=t+b*bar;for(let q=0;q<4;q++)ride(tb+q*beat,q?.7:1);snare(tb+2*beat,1.3);if(b%3===0)crash(tb,.9);}
  const e=t+6*bar;pc(e,35,"mt",{dur:2});pluck(e,23,"bsd",{vol:1,dur:2});crash(e);mkick(e);return 6*bar+2.2;};
/* 扫拨与交响 */
DEMOS.neo=t=>{const beat=bt(112),s=beat/6,AR=[[57,60,64,69,72,76],[62,65,69,74,77,81],[56,59,64,68,71,76],[57,60,64,69,72,76]],ROOT=[45,50,52,45];
  AR.forEach((ar,b)=>{const tb=t+b*4*beat,seq=ar.concat(ar.slice(1,5).reverse());for(let q=0;q<4;q++){const notes=q%2?seq.slice(6).concat(ar.slice(0,1)):ar;(q%2?[...ar].reverse():ar).forEach((m,i)=>pluck(tb+q*beat+i*s,m,"ml",{vol:1.15,mute:s*1.6,dur:.5}));}
    for(let k=0;k<8;k++){pc(tb+k*beat/2,ROOT[b]-12+ (ROOT[b]<40?12:0),"mpm",{mute:.08,vol:.8});}pluck(tb,ROOT[b]-24,"bsd",{vol:.9,dur:4*beat});metalBar(tb,beat,"double",{crash:b===0});});
  const e=t+16*beat;pc(e,45,"mt",{dur:2.6});pluck(e,81,"ml",{vol:1.4,dur:2.6,vib:true,from:-1,glide:.15,hold:.05});crash(e);mkick(e);return 16*beat+2.8;};
function strings(t,notes,dur,v=1){const a=A();notes.forEach(m=>[-7,0,7].forEach(dt=>{const o=a.createOscillator();o.type="sawtooth";o.frequency.value=mf(m);o.detune.value=dt;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=2200;const g=a.createGain(),vv=.016*v;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vv,t+.35);g.gain.setValueAtTime(vv,t+dur-.25);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(lp).connect(g).connect(bus);o.start(t);o.stop(t+dur+.05);track(o);}));}
const SYM_CH=[[38,[62,65,69]],[34,[58,62,65]],[36,[60,64,67]],[33,[57,61,64]]];
const SOP=[[[0,74,2],[2,76,1],[3,77,1]],[[0,77,2],[2,74,2]],[[0,76,1.5],[1.5,72,.5],[2,74,1],[3,76,1]],[[0,73,3],[3,76,1]],
  [[0,81,2],[2,79,1],[3,77,1]],[[0,77,1],[1,76,1],[2,74,2]],[[0,72,1],[1,74,1],[2,76,2]],[[0,73,2],[2,76,2]]];
DEMOS.sym=t=>{const beat=bt(96);for(let b=0;b<8;b++){const tb=t+b*4*beat,[r,ch]=SYM_CH[b%4];strings(tb,ch.concat(ch.map(x=>x-12)),4*beat+.05);ch.forEach(m=>voice(tb,m-12,4*beat*.98,{vowel:"o",vol:.22,vibDepth:10,from:0}));
    for(let k=0;k<8;k++){if(k===3||k===7)continue;chug(tb+k*beat/2,r,.09,.9);pluck(tb+k*beat/2,r-12,"bsd",{vol:.85,mute:beat*.4});}pc(tb+1.5*beat,r,"mt",{mute:beat*.45,vol:.8});pc(tb+3.5*beat,r,"mt",{mute:beat*.45,vol:.8});
    metalBar(tb,beat,b<4?"half":"dk8",{crash:b%4===0});}
  SOP.forEach((bar,bi)=>bar.forEach(([b,m,d])=>voice(t+(bi*4+b)*beat,m,d*beat*.95,{vowel:"a",vol:.75,vibDepth:34,glide:.12})));
  const e=t+32*beat;strings(e,[62,65,69,50,57],3.2);voice(e,74,3,{vowel:"a",vol:.75,vibDepth:34});pc(e,38,"mt",{dur:3});crash(e);mkick(e);return 32*beat+3.4;};
/* breakdown */
DEMOS.breakdown=t=>{const beat=bt(150),s=beat/4,r=36;
  for(let b=0;b<2;b++){const tb=t+b*4*beat;for(let k=0;k<16;k++){if(k>=12&&k%2)continue;k>=12?pc(tb+k*s,b?39:37,"mt",{mute:s*1.8}):chug(tb+k*s,r,.07,.9);pluck(tb+k*s,r-12,"bsd",{vol:.8,mute:s*.9});}metalBar(tb,beat,"double",{crash:b===0});}
  const t2=t+8*beat,H=[0,3,6,10,11,14];for(let b=0;b<4;b++){const tb=t2+b*4*beat;crash(tb,1);H.forEach(k=>{const tt=tb+k*s;chug(tt,r,.11,1.15);pluck(tt,r-12,"bsd",{vol:1,mute:s*1.5});mkick(tt,1.1);});
    if(b===3)pc(tb+12*s,r+6,"mt",{mute:beat*.9});snare(tb+2*beat,1.5);for(let q=0;q<4;q++)hat(tb+q*beat,.6);}
  const e=t2+16*beat;pc(e,r,"mt",{dur:2.4});pluck(e,r-12,"bsd",{vol:1,dur:2.2});crash(e);mkick(e,1.2);return 24*beat+2.6;};
/* 五声旋律 */
function erhu(t,midi,dur,o={}){const a=A(),f=mf(midi),g=a.createGain(),v=(o.vol||1)*.11;
  const o1=a.createOscillator(),o2=a.createOscillator();o1.type="sawtooth";o2.type="sawtooth";o2.detune.value=6;
  [o1,o2].forEach(x=>{if(o.from){x.frequency.setValueAtTime(f*Math.pow(2,o.from/12),t);x.frequency.linearRampToValueAtTime(f,t+.2);}else x.frequency.setValueAtTime(f,t);});
  const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=5.8;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(28,t+Math.min(.45,dur*.6));lfo.connect(lg);lg.connect(o1.detune);lg.connect(o2.detune);
  const hp=a.createBiquadFilter();hp.type="highpass";hp.frequency.value=350;const bp=a.createBiquadFilter();bp.type="peaking";bp.frequency.value=1100;bp.gain.value=9;bp.Q.value=1.4;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=4200;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.09);g.gain.setValueAtTime(v,t+dur-.12);g.gain.linearRampToValueAtTime(0,t+dur);
  o1.connect(hp);o2.connect(hp);hp.connect(bp).connect(lp).connect(g).connect(bus);[o1,o2,lfo].forEach(x=>{x.start(t);x.stop(t+dur+.05);track(x);});}
const CN=[[[0,76,1.5,-2],[1.5,74,.5],[2,71,1],[3,74,1]],[[0,76,3,-3],[3,79,1]],[[0,81,1],[1,79,.5],[1.5,76,.5],[2,74,1],[3,71,1]],[[0,69,2,-2],[2,71,1],[3,67,1]],
  [[0,64,1.5,-3],[1.5,67,.5],[2,69,1],[3,71,1]],[[0,74,1],[1,76,1],[2,79,2,-2]],[[0,81,1.5],[1.5,79,.5],[2,76,1],[3,74,1]],[[0,76,4,-2]]];
DEMOS.cn=t=>{const beat=bt(100),R=[40,40,43,45,40,43,38,40];for(let b=0;b<8;b++){const tb=t+b*4*beat,r=R[b];
    playSeq(tb,beat,[[0,"p",r,.5],[.5,"c",r],[1,"c",r],[1.5,"c",r],[2,"p",r,.5],[2.5,"c",r],[3,"p",r+3,.5],[3.5,"p",r+5,.5]]);metalBar(tb,beat,"dk8",{crash:b%4===0});}
  CN.forEach((bar,bi)=>bar.forEach(([b,m,d,fr])=>erhu(t+(bi*4+b)*beat,m,d*beat*.97,{from:fr,vol:1.1})));
  const e=t+32*beat;pc(e,40,"mt",{dur:2.6});erhu(e,76,2.6,{vol:1.1});crash(e);mkick(e);return 32*beat+2.8;};

/* ================= 调度 ================= */
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
const GAIN={storm:.8,"int-5th":.4,"int-tt":.37,"int-riff":.9,"mode-aeo":.9,"mode-phr":.9,"mode-phd":.9,"gal-8":1,"gal-run":.85,"twin-1":.7,"twin-2":.65,"sp-rock":.7,"sp-thrash":.7,"sp-double":.62,"sp-blast":.45,"voc-clean":.65,"voc-growl":.72,tremolo:.37,"tune-e":.95,"tune-d":1,"tune-b":1,poly:1.1,neo:.45,sym:.55,breakdown:.65,cn:.66};
function runDemo(name,btn){newBus();bus.gain.value=GAIN[name]||.8;if(name==="storm"||name==="sym")addRoom(3.4,.7);if(name==="tremolo")addRoom(3,.8);setActive(btn);const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;later(()=>clearActive(),d+.4);}
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);

/* ================= 推荐曲目：战衣补丁 ================= */
const SONGS=[
  {side:"A",q:"Black Sabbath Black Sabbath 1970",title:"Black Sabbath",by:"Black Sabbath",yr:"1970",style:"重金属 · 毁灭",
   txt:"本章开头那首：雨声、钟声，然后是三个音的 riff。很多人把它当作第一首真正的重金属。",
   listen:["开头 riff 里的三全音，对照 Lab II","速度很慢，中段突然加速：慢和快的对比"]},
  {side:"A",q:"Judas Priest Breaking the Law",title:"Breaking the Law",by:"Judas Priest",yr:"1980",style:"英国重金属",
   txt:"不到三分钟，riff 简单、直接。Judas Priest 也是皮衣和铆钉造型的源头。",
   listen:["和 B2 的硬摇滚比：还有多少“晃”？","副歌是全场齐喊的设计"]},
  {side:"A",q:"Ozzy Osbourne Crazy Train",title:"Crazy Train",by:"Ozzy Osbourne",yr:"1980",style:"重金属 · 新古典色彩",
   txt:"Ozzy 离开 Black Sabbath 后的第一张个人专辑。吉他手 Randy Rhoads 的 riff 和独奏里有明显的古典训练痕迹。",
   listen:["独奏里有快速的音阶和琶音，对照 Lab IX","开头 riff 是闷音和单音的组合"]},
  {side:"A",q:"Iron Maiden The Trooper",title:"The Trooper",by:"Iron Maiden",yr:"1983",style:"NWOBHM",
   txt:"一首关于 19 世纪克里米亚战争骑兵冲锋的歌。奔马节奏和双吉他和声的教科书。",
   listen:["对照 Lab IV：吉他、贝斯一起奔跑","开头两把吉他的旋律相隔三度"]},
  {side:"A",q:"Metallica Master of Puppets",title:"Master of Puppets",by:"Metallica",yr:"1986",style:"激流金属",
   txt:"八分多钟，快速的全下拨 riff，中间却有一大段安静、旋律性的段落。激流金属最有名的专辑同名曲。",
   listen:["吉他的闷音几乎全是下拨，对照 Lab V","找到中段的安静部分：金属也讲“地形”"]},
  {side:"A",q:"Slayer Raining Blood",title:"Raining Blood",by:"Slayer",yr:"1986",style:"激流金属",
   txt:"以雷雨声开场，然后是极快的鼓和 riff。和 Black Sabbath 的雨夜放在一起听，十六年里金属快了多少？",
   listen:["鼓的速度对照图 5","riff 里大量半音移动，几乎没有布鲁斯的影子"]},
  {side:"B",q:"Death Pull the Plug",title:"Pull the Plug",by:"Death",yr:"1988",style:"死亡金属",
   txt:"来自佛罗里达的 Death 被很多人看作死亡金属的奠基者之一。乐队核心 Chuck Schuldiner 后来把这种音乐带向了更复杂、更有旋律的方向。",
   listen:["人声是嘶吼：对照 Lab VI","鼓在冲击鼓和普通节奏之间切换"]},
  {side:"B",q:"唐朝 梦回唐朝",title:"梦回唐朝",by:"唐朝乐队",yr:"1992",style:"中文重金属",
   txt:"七分多钟，失真吉他、五声音阶的旋律和京剧式的唱腔。第一张中文重金属专辑的同名曲。",
   listen:["哪些段落来自金属，哪些来自中国的传统？对照 Lab XI","吉他独奏用了什么音阶？"]},
  {side:"B",q:"Dimmu Borgir Progenies of the Great Apocalypse",title:"Progenies of the Great Apocalypse",by:"Dimmu Borgir",yr:"2003",style:"交响黑金属",
   txt:"挪威乐队，和布拉格的管弦乐团合作录音。黑金属的冲击鼓和尖叫，加上整支管弦乐团。",
   listen:["管弦乐和金属乐队谁在“领奏”？","对照 Lab VI 的颤音拨弦和 Lab IX 的交响"]},
  {side:"B",q:"Nightwish Nemo",title:"Nemo",by:"Nightwish",yr:"2004",style:"交响金属",
   txt:"芬兰的交响金属乐队，旋律性很强，管弦乐和合唱的分量很重。这是他们最广为人知的歌之一。",
   listen:["人声是干净的旋律唱法，和死亡金属完全不同","对照 Lab IX 的“交响金属”"]},
  {side:"B",q:"Meshuggah Bleed",title:"Bleed",by:"Meshuggah",yr:"2008",style:"djent · 极端前卫金属",
   txt:"几乎整首歌都是同一种快速的双踩和吉他节奏型，但吉他的循环和 4/4 拍不同步。是很多鼓手心中最难的歌之一。",
   listen:["对照 Lab VIII 和图 7","只跟着军鼓数拍，再只跟着吉他点头"]},
  {side:"B",q:"The HU Wolf Totem",title:"Wolf Totem",by:"The HU",yr:"2019",style:"蒙古民族金属",
   txt:"马头琴、口簧、呼麦和金属的节奏。The HU 的视频 2018 年在网上传开，第二年出了首张专辑。",
   listen:["呼麦：一个人同时唱出两个音","哪些声音是金属的“骨架”，哪些是蒙古的“血肉”？"]}
];
const ICON="M8 5v14l11-7z";
SONGS.forEach(s=>{
  const el=document.createElement("div");el.className="song";
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<div class="meta"><span class="by">${s.by}</span><span class="title">${s.title}</span><div class="pmeta"><span class="yr">${s.yr}</span><span class="style">${s.style}</span></div></div>
  <p>${s.txt}</p><ul class="listen">${s.listen.map(x=>`<li>${x}</li>`).join("")}</ul>
  <div class="listen-links"><a class="main" href="${yt}" target="_blank" rel="noopener">${s.yt?"YouTube 官方音源":"YouTube 搜索"}</a>
  <a href="https://music.163.com/#/search/m/?s=${q}&type=1" target="_blank" rel="noopener">网易云</a>
  <a href="https://y.qq.com/n/ryqq/search?w=${q}" target="_blank" rel="noopener">QQ音乐</a></div>
  <a class="playlink" href="${yt}" target="_blank" rel="noopener" aria-label="在 YouTube 收听 ${s.title}"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="${ICON}"/></svg></a>`;
  document.getElementById(s.side==="A"?"songsA":"songsB").appendChild(el);
});

/* ================= 原创图解 ================= */
const NS="http://www.w3.org/2000/svg";
function S(p,tag,a,txt){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e;}
const TB="font-family:var(--font-body);font-size:14px;font-weight:900";
/* 图 1 家谱 */
(()=>{const g=document.getElementById("tree-fig");if(!g)return;const X=y=>110+(y-1970)*12;
  S(g,"line",{x1:40,y1:372,x2:650,y2:372,class:"sv-l","stroke-width":1.2});[1970,1980,1990,2000,2010].forEach(y=>{S(g,"line",{x1:X(y),y1:366,x2:X(y),y2:378,class:"sv-l"});S(g,"text",{x:X(y),y:394,"text-anchor":"middle",class:"sv-m"},String(y));});
  const N={hr:["硬摇滚",48,120,1],pk:["硬核朋克",X(1981),330,1],cl:["巴洛克 / 古典",X(2004),46,1],
    hm:["重金属",X(1970),190],doom:["毁灭金属",X(1979),80],nw:["NWOBHM",X(1979),190],th:["激流金属",X(1983),260],pw:["力量金属",X(1987),130],
    de:["死亡金属",X(1989),320],bl:["黑金属",X(1992),260],nu:["新金属",X(1995),190],sy:["交响金属",X(1998),110],dj:["djent",X(2008),300]};
  const E=[["hr","hm",1],["hm","doom"],["hm","nw"],["nw","th"],["nw","pw"],["pk","th",1],["th","de"],["th","bl"],["th","nu"],["pw","sy"],["cl","sy",1],["cl","pw",1],["de","dj"]];
  const W=n=>N[n][0].length>4?96:84;
  E.forEach(([a,b,ext])=>{const [,x1,y1]=N[a],[,x2,y2]=N[b];let sx=x1+W(a)/2,sy=y1,ex=x2-W(b)/2,ey=y2;if(ex<sx+10){sx=x1;sy=y1+(y2>y1?14:-14);ex=x2;ey=y2+(y2>y1?-14:14);}
    const mx=(sx+ex)/2;S(g,"path",{d:`M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ey}, ${ex} ${ey}`,class:ext?"sv-lline":"sv-l","stroke-width":ext?2:1.4,"stroke-dasharray":ext?"5 4":"none"});});
  Object.entries(N).forEach(([k,[t,x,y,ext]])=>{const w=W(k);S(g,"rect",{x:x-w/2,y:y-14,width:w,height:28,rx:3,class:k==="hm"?"sv-red":ext?"sv-card":"sv-ink"});if(ext)S(g,"rect",{x:x-w/2,y:y-14,width:w,height:28,rx:3,class:"sv-l","stroke-dasharray":"4 3"});
    S(g,"text",{x,y:y+5,"text-anchor":"middle",class:ext?"sv-t":"sv-on",style:"font-size:13px;font-weight:700"},t);});
  S(g,"text",{x:40,y:24,class:"sv-ts"},"虚线框：金属之外的“输入”");
})();
/* 图 2 三全音 */
(()=>{const g=document.getElementById("tt-fig");if(!g)return;const x0=100,w=60,y0=50,H=130;
  ["E","F","G","A","B","C","D","E"].forEach((n,i)=>{const x=x0+i*w;S(g,"rect",{x,y:y0,width:w-2,height:H,rx:3,class:"sv-card"});S(g,"rect",{x,y:y0,width:w-2,height:H,rx:3,class:"sv-l","stroke-width":1.2});
    const c=i===0||i===7?"sv-ink":i===4?"sv-ink":null;if(c){S(g,"circle",{cx:x+29,cy:y0+H-24,r:13,class:c});S(g,"text",{x:x+29,y:y0+H-19,"text-anchor":"middle",class:"sv-on"},n);}else S(g,"text",{x:x+29,y:y0+H-19,"text-anchor":"middle",class:"sv-ts"},n);});
  [[2,"F♯"],[3,"G♯"],[4,"A♯"],[6,"C♯"],[7,"D♯"]].forEach(([i,n])=>{const x=x0+i*w-18;S(g,"rect",{x,y:y0,width:36,height:80,rx:2,class:i===4?"sv-red":"sv-ink"});if(i===4)S(g,"text",{x:x+18,y:y0+70,"text-anchor":"middle",class:"sv-on",style:"font-size:11.5px"},"A♯");});
  S(g,"path",{d:`M ${x0+29} ${y0-4} Q ${(x0+29+x0+4*w+29)/2} ${y0-46} ${x0+4*w+29} ${y0-4}`,class:"sv-l","stroke-width":1.8});S(g,"text",{x:x0+4*w+44,y:y0-18,class:"sv-t",style:TB},"五度 · 7 个半音 · 稳");
  const ax=x0+4*w;S(g,"path",{d:`M ${x0+29} ${y0+H+6} Q ${(x0+29+ax)/2} ${y0+H+40} ${ax} ${y0+H+6}`,class:"sv-lr","stroke-width":2.2});S(g,"path",{d:`M ${ax} ${y0+H+6} Q ${(ax+x0+7*w+29)/2} ${y0+H+40} ${x0+7*w+29} ${y0+H+6}`,class:"sv-lr","stroke-width":1.6,"stroke-dasharray":"5 4"});
  S(g,"text",{x:(x0+29+ax)/2,y:y0+H+56,"text-anchor":"middle",class:"sv-r",style:"font-weight:700"},"三全音 · 6 个半音");S(g,"text",{x:(ax+x0+7*w+29)/2,y:y0+H+56,"text-anchor":"middle",class:"sv-r"},"再 6 个半音，回到 E");
  S(g,"text",{x:20,y:y0+70,class:"sv-m"},"一个八度");S(g,"text",{x:20,y:y0+86,class:"sv-m"},"= 12 个半音");
})();
/* 图 3 音阶 */
(()=>{const g=document.getElementById("modes-fig");if(!g)return;const x0=170,w=56,gap=64;
  const R=[["自然小调",["E","F♯","G","A","B","C","D","E"],["全","半","全","全","半","全","全"],-1],["弗里吉亚",["E","F","G","A","B","C","D","E"],["半","全","全","全","半","全","全"],1],["弗里吉亚属",["E","F","G♯","A","B","C","D","E"],["半","增二","半","全","半","全","全"],2]];
  R.forEach(([name,ns,st,ch],r)=>{const y=24+r*84;S(g,"text",{x:20,y:y+26,class:"sv-t",style:TB},name);
    ns.forEach((n,i)=>{const x=x0+i*gap;S(g,"rect",{x,y,width:w,height:38,rx:3,class:i===ch?"sv-red":i===0||i===7?"sv-ink":"sv-card"});if(i!==ch&&i&&i<7)S(g,"rect",{x,y,width:w,height:38,rx:3,class:"sv-l"});S(g,"text",{x:x+w/2,y:y+25,"text-anchor":"middle",class:i===ch||i===0||i===7?"sv-on":"sv-t",style:"font-size:15px;font-weight:700"},n);});
    st.forEach((s,i)=>{const x=x0+i*gap+w+4;S(g,"text",{x,y:y+56,"text-anchor":"middle",class:s==="半"||s==="增二"?"sv-r":"sv-m",style:"font-size:12px"},s);});});
})();
/* 图 4 奔马 */
(()=>{const g=document.getElementById("gallop-fig");if(!g)return;const x0=170,cw=29;
  const R=[["八分音符",[0,2,4,6,8,10,12,14]],["奔马",[0,2,3,4,6,7,8,10,11,12,14,15]],["反奔马",[0,1,2,4,5,6,8,9,10,12,13,14]]];
  [0,4,8,12].forEach((k,q)=>S(g,"text",{x:x0+k*cw+cw/2,y:20,"text-anchor":"middle",class:"sv-m"},String(q+1)));
  R.forEach(([n,hits],r)=>{const y=34+r*70;S(g,"text",{x:20,y:y+22,class:"sv-t",style:TB},n);for(let k=0;k<16;k++){const on=hits.includes(k);S(g,"rect",{x:x0+k*cw,y,width:cw-3,height:32,rx:2,class:on?(r===1?"sv-red":"sv-ink"):"sv-card"});if(!on)S(g,"rect",{x:x0+k*cw,y,width:cw-3,height:32,rx:2,class:"sv-lline"});}
    [4,8,12].forEach(k=>S(g,"line",{x1:x0+k*cw-1.5,y1:y-4,x2:x0+k*cw-1.5,y2:y+36,class:"sv-l","stroke-width":1}));});
  S(g,"text",{x:x0,y:240,class:"sv-ts"},"奔马：每拍“长、短短”（哒——哒哒）；反奔马：“短短、长”（哒哒哒——）");
})();
/* 图 5 鼓 */
(()=>{const g=document.getElementById("drum-fig");if(!g)return;const x0=190,cw=27,lh=15,all=[...Array(16).keys()],ev=all.filter(k=>k%2===0),od=all.filter(k=>k%2);
  const B=[["摇滚","约 100–140 BPM",{镲:ev,军鼓:[4,12],底鼓:[0,8,10]}],["激流 · 砰嚓","约 170–220 BPM",{镲:[0,4,8,12],军鼓:[2,6,10,14],底鼓:[0,4,8,12]}],["双踩","约 140–200 BPM",{镲:[0,4,8,12],军鼓:[4,12],底鼓:all}],["冲击鼓","约 180–250 BPM 以上",{镲:all,军鼓:od,底鼓:all}]];
  B.forEach(([n,bpm,L],b)=>{const y=14+b*96;S(g,"text",{x:20,y:y+18,class:"sv-t",style:TB},n);S(g,"text",{x:20,y:y+38,class:"sv-m"},bpm);
    Object.entries(L).forEach(([lane,hits],li)=>{const yy=y+li*(lh+5);S(g,"text",{x:x0-8,y:yy+12,"text-anchor":"end",class:"sv-ts"},lane);for(let k=0;k<16;k++){const on=hits.includes(k);S(g,"rect",{x:x0+k*cw,y:yy,width:cw-3,height:lh,rx:2,class:on?(li===2&&b>=2?"sv-red":"sv-ink"):"sv-card"});if(!on)S(g,"rect",{x:x0+k*cw,y:yy,width:cw-3,height:lh,rx:2,class:"sv-lline"});}});});
})();
/* 图 6 调弦 */
(()=>{const g=document.getElementById("tune-fig");if(!g)return;const x0=230,W=400;
  [["标准 E","E2",82.4],["Drop D","D2",73.4],["七弦 B","B1",61.7],["八弦 F♯","F♯1",46.2]].forEach(([n,nt,f],i)=>{const y=40+i*64;S(g,"text",{x:20,y:y+2,class:"sv-t",style:TB},n);S(g,"text",{x:20,y:y+20,class:"sv-m"},`${nt} · 约 ${Math.round(f)} 赫兹`);
    let d=`M ${x0} ${y}`;const cyc=f*.05;for(let x=0;x<=W;x+=2)d+=` L ${x0+x} ${(y-Math.sin(x/W*cyc*2*Math.PI)*22).toFixed(1)}`;S(g,"path",{d,class:i===3?"sv-lr":"sv-l","stroke-width":1.4+i*.9});
    S(g,"line",{x1:x0,y1:y,x2:x0+W,y2:y,class:"sv-lline"});});
  S(g,"text",{x:x0,y:282,class:"sv-ts"},"同样的时间窗口（0.05 秒）里，频率越低，波峰越少");
})();
/* 图 7 错位 */
(()=>{const g=document.getElementById("poly-fig");if(!g)return;const x0=90,cw=11.4,n=48;
  S(g,"text",{x:20,y:66,class:"sv-t",style:TB},"鼓");S(g,"text",{x:20,y:136,class:"sv-t",style:TB},"吉他");
  for(let b=0;b<3;b++)S(g,"text",{x:x0+b*16*cw+4,y:30,class:"sv-m"},`第 ${b+1} 小节`);
  for(let i=0;i<n;i++){const x=x0+i*cw,sn=i%16===8,q=i%4===0;S(g,"rect",{x,y:50,width:cw-2,height:24,rx:1.5,class:sn?"sv-ink":q?"sv-must":"sv-card",opacity:sn?1:q?.45:1});if(!sn)S(g,"rect",{x,y:50,width:cw-2,height:24,rx:1.5,class:"sv-lline"});
    const c=i%6,cy=Math.floor(i/6);if(c===0)S(g,"rect",{x:x-1,y:114,width:6*cw,height:32,class:"sv-must",opacity:cy%2?.28:.08});}
  for(let i=0;i<n;i++){const x=x0+i*cw,c=i%6;if(CYC.includes(c))S(g,"rect",{x,y:120,width:cw-2,height:20,rx:1.5,class:c===0?"sv-red":"sv-ink"});}
  for(let b=0;b<=3;b++)S(g,"line",{x1:x0+b*16*cw-1,y1:40,x2:x0+b*16*cw-1,y2:156,class:"sv-l","stroke-width":b%3?1.4:2.4});
  S(g,"text",{x:x0,y:178,class:"sv-ts"},"鼓：最醒目的格子是第 3 拍的军鼓，灰格是每一拍");S(g,"text",{x:x0,y:198,class:"sv-ts"},"红格（吉他）：每个 6 格循环的第一下。看它在每一小节里落在不同的位置");
  const ex=x0+n*cw;
  S(g,"text",{x:ex+4,y:240,"text-anchor":"end",class:"sv-r",style:"font-weight:700"},"48 格 = 3 小节 = 8 个循环 → 第 4 小节重新对齐");
})();
/* 图 8 现场 */
(()=>{const g=document.getElementById("pit-fig");if(!g)return;
  S(g,"rect",{x:140,y:14,width:400,height:40,rx:3,class:"sv-ink"});S(g,"text",{x:340,y:40,"text-anchor":"middle",class:"sv-on",style:"font-size:14px"},"舞台");
  S(g,"ellipse",{cx:340,cy:196,rx:318,ry:112,class:"sv-lline","stroke-width":1.5,"stroke-dasharray":"6 4"});
  let seed=4;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  for(let i=0;i<260;i++){const a=rnd()*Math.PI*2,rr=.88+rnd()*.11,x=340+Math.cos(a)*318*rr,y=196+Math.sin(a)*112*rr;if(y>66)S(g,"circle",{cx:x,cy:y,r:2.6,class:"sv-ink",opacity:.55});}
  // 绕圈跑
  const cx=220,cy=196;for(let i=0;i<22;i++){const a=i/22*Math.PI*2;S(g,"circle",{cx:cx+Math.cos(a)*58,cy:cy+Math.sin(a)*40,r:3.2,class:"sv-red"});}
  [0,1,2,3].forEach(i=>{const a=i*Math.PI/2+.4,px=cx+Math.cos(a)*76,py=cy+Math.sin(a)*54,tx=-Math.sin(a),ty=Math.cos(a)*.7;S(g,"path",{d:`M ${px-tx*10-ty*6} ${py-ty*10+tx*6} L ${px} ${py} L ${px-tx*10+ty*6} ${py-ty*10-tx*6}`,class:"sv-lr","stroke-width":2.2});});
  S(g,"text",{x:cx,y:cy+5,"text-anchor":"middle",class:"sv-r",style:"font-weight:700"},"绕圈跑");
  // 死亡之墙
  const wx=470;for(let r=0;r<4;r++)for(let c=0;c<8;c++){S(g,"circle",{cx:wx-70+r*9,cy:150+c*13,r:3,class:"sv-ink"});S(g,"circle",{cx:wx+70-r*9,cy:150+c*13,r:3,class:"sv-ink"});}
  [[wx-34,1],[wx+34,-1]].forEach(([x,d])=>{S(g,"path",{d:`M ${x} 196 L ${x+d*22} 196`,class:"sv-lr","stroke-width":2.4});S(g,"path",{d:`M ${x+d*16} 190 L ${x+d*22} 196 L ${x+d*16} 202`,class:"sv-lr","stroke-width":2.4});});
  S(g,"text",{x:wx,y:140,"text-anchor":"middle",class:"sv-r",style:"font-weight:700"},"死亡之墙");S(g,"text",{x:wx,y:262,"text-anchor":"middle",class:"sv-ts"},"先分开，riff 落下时冲向中间");
  S(g,"text",{x:340,y:338,"text-anchor":"middle",class:"sv-ts"},"虚线外圈：只想听歌、甩头的人");
})();
/* 外部照片 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`照片待放入：${img.getAttribute("src")}<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张照片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
