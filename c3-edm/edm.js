/* ================= 电子舞曲：合成器与鼓机 ================= */
function voiceOsc(t,dur,wave,f,o={}){const a=A(),x=a.createOscillator();x.type=wave;if(o.from!=null){x.frequency.setValueAtTime(o.from,t);x.frequency.exponentialRampToValueAtTime(f,t+(o.glide||.06));}else x.frequency.setValueAtTime(f,t);if(o.dt)x.detune.value=o.dt;x.start(t);x.stop(t+dur+.05);track(x);return x;}
/* 通用减法合成：振荡器 → 低通（可共振、可扫）→ 包络 */
function sub(t,midi,dur,o={}){const a=A(),f=mf(midi),lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=o.q||1;const c0=o.cut||800,c1=o.peak||c0*3;lp.frequency.setValueAtTime(c0,t);lp.frequency.linearRampToValueAtTime(c1,t+(o.fa||.005));lp.frequency.exponentialRampToValueAtTime(Math.max(60,c0),t+(o.fd||.25));
  (o.waves||[["sawtooth",0]]).forEach(([w,dt])=>voiceOsc(t,dur,w,f,{dt,from:o.from!=null?mf(o.from):null,glide:o.glide}).connect(lp));
  const g=a.createGain(),v=(o.vol||1)*.06;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(o.att||.004));g.gain.setValueAtTime(v,t+Math.max(o.att||.004,dur-.03));g.gain.linearRampToValueAtTime(0,t+dur);
  let n=lp;if(o.drive){const sh=a.createWaveShaper();sh.curve=shaper(o.drive);lp.connect(sh);n=sh;}n.connect(g).connect(o.out||bus);return lp;}
function supersaw(t,notes,dur,o={}){notes.forEach(m=>sub(t,m,dur,{waves:[["sawtooth",-18],["sawtooth",-7],["sawtooth",0],["sawtooth",7],["sawtooth",18]],cut:o.cut||1800,peak:o.peak||5000,fa:.02,fd:dur,vol:(o.vol||1)*.45,att:o.att||.01,out:o.out}));}
function strings(t,notes,dur,v=1){notes.forEach(m=>sub(t,m,dur,{waves:[["sawtooth",-8],["sawtooth",8]],cut:1600,peak:2200,fa:.4,fd:dur,vol:.4*v,att:.3}));}
function piano(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain();[[1,.6,"triangle"],[2,.25,"sine"],[3,.08,"sine"]].forEach(([h,am,w])=>{const x=a.createOscillator();x.type=w;x.frequency.value=f*h;const xg=a.createGain();xg.gain.value=am;x.connect(xg).connect(g);x.start(t);x.stop(t+dur+.1);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.11*v,t+.005);g.gain.exponentialRampToValueAtTime(.03*v,t+.4);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);g.connect(bus);}
/* 909 式鼓 */
function k909(t,v=1){const a=A(),o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(52,t+.07);g.gain.setValueAtTime(.95*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);const sh=a.createWaveShaper();sh.curve=shaper(1.6);o.connect(sh).connect(g).connect(bus);o.start(t);o.stop(t+.34);track(o);}
function oh(t,v=1,len=.22){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=7500;const g=a.createGain();g.gain.setValueAtTime(.14*v,t);g.gain.exponentialRampToValueAtTime(.001,t+len);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+len+.01);track(n);}
function ch(t,v=1){oh(t,v*.8,.04);}
function rim(t,v=1){const a=A(),o=a.createOscillator();o.frequency.value=1700;const g=a.createGain();g.gain.setValueAtTime(.18*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.03);o.connect(g).connect(bus);o.start(t);o.stop(t+.04);track(o);}
function riser(t,dur,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();n.loop=true;const f=a.createBiquadFilter();f.type="bandpass";f.Q.value=3;f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(9000,t+dur);const g=a.createGain();g.gain.setValueAtTime(.01,t);g.gain.exponentialRampToValueAtTime(.4*v,t+dur);g.gain.linearRampToValueAtTime(0,t+dur+.02);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+dur+.05);track(n);
  const o=a.createOscillator();o.type="sawtooth";o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(1760,t+dur);const og=a.createGain();og.gain.setValueAtTime(.001,t);og.gain.exponentialRampToValueAtTime(.05*v,t+dur);og.gain.linearRampToValueAtTime(0,t+dur+.02);o.connect(og).connect(bus);o.start(t);o.stop(t+dur+.05);track(o);}
function subBass(t,midi,dur,v=1,o={}){const a=A(),x=a.createOscillator();x.type="sine";x.frequency.setValueAtTime(mf(o.from!=null?o.from:midi),t);if(o.from!=null)x.frequency.exponentialRampToValueAtTime(mf(midi),t+(o.glide||.08));const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.55*v,t+.01);g.gain.setValueAtTime(.55*v,t+dur-.05);g.gain.linearRampToValueAtTime(0,t+dur);x.connect(g).connect(bus);x.start(t);x.stop(t+dur+.02);track(x);}
function four(tb,beat,o={}){for(let q=0;q<4;q++){k909(tb+q*beat,o.kv||1);oh(tb+q*beat+beat/2,o.ov||.9);if(o.ch)for(let s=0;s<4;s+=2)ch(tb+q*beat+s*beat/4,.5);}if(o.clap!==false){clap(tb+beat,o.cv||.8);clap(tb+3*beat,o.cv||.8);}if(o.crash)crash(tb,o.crash);}
/* 声码器式机器人声：方波 + 不断变化的共振峰 */
function robot(t,midi,dur,vow){const a=A(),f=mf(midi),x=a.createOscillator();x.type="square";x.frequency.value=f;const n=a.createBufferSource();n.buffer=noise();const ng=a.createGain();ng.gain.value=.08;n.connect(ng);const out=a.createGain();
  const F={a:[730,1090,2440],i:[300,2300,3000],o:[500,880,2400],u:[320,800,2240],e:[530,1840,2480]};const fs=F[vow]||F.a;fs.forEach((fr,i)=>{const bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=fr;bp.Q.value=12;const g=a.createGain();g.gain.value=[2.4,1.6,.9][i];x.connect(bp);ng.connect(bp);bp.connect(g).connect(out);});
  const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.45,t+.02);g.gain.setValueAtTime(.45,t+dur-.04);g.gain.linearRampToValueAtTime(0,t+dur);out.connect(g).connect(bus);[x,n].forEach(z=>{z.start(t);z.stop(t+dur+.02);track(z);});}

const DEMOS={};
/* 01 迪斯科、音序器、声码器 */
const DCH=[[45,[60,64,69]],[41,[60,65,69]],[43,[59,62,67]],[40,[59,64,67]]];
DEMOS.disco=t=>{const beat=bt(120),bar=4*beat;for(let i=0;i<8;i++){const tb=t+i*bar,[r,c]=DCH[i%4];for(let q=0;q<4;q++){kick(tb+q*beat,1);oh(tb+q*beat+beat/2,1);}snare(tb+beat,.8);snare(tb+3*beat,.8);
    for(let k=0;k<8;k++)pluck(tb+k*beat/2,r-12+(k%2?12:0),"bass",{vol:1,mute:beat*.42});strings(tb,c.map(m=>m+12),bar,1.1);[.5,1.5,2.5,3.5].forEach(x=>strum(tb+x*beat,c,"ac",{vol:.35,mute:beat*.2,spread:.004}));if(i%2)[3,3.5].forEach(x=>strings(tb+x*beat,[c[2]+24],beat*.45,1.4));}
  return 8*bar+1;};
DEMOS.seq=t=>{const beat=bt(126),s=beat/4,bar=4*beat,R=[33,33,36,31];for(let i=0;i<8;i++){const tb=t+i*bar,r=R[Math.floor(i/2)%4];for(let k=0;k<16;k++){const m=r+[0,12,7,12][k%4];sub(tb+k*s,m,s*.9,{cut:300,peak:1400+i*250,fd:.12,q:4,vol:1.2,waves:[["sawtooth",0],["square",-6]]});}
    if(i>=2){for(let q=0;q<4;q++)kick(tb+q*beat,1);oh(tb+beat/2,.6);oh(tb+2.5*beat,.6);snare(tb+beat,.6);snare(tb+3*beat,.6);}
    if(i>=4)[[0,72,1.5],[2,69,1],[3,67,1]].forEach(([b,m,d])=>sub(tb+b*beat,m+(i%2?-2:0),d*beat,{waves:[["sine",0],["triangle",4]],cut:2200,peak:2600,fd:d*beat,vol:.9,att:.08}));}
  return 8*bar+1;};
DEMOS.vocoder=t=>{const beat=bt(110),bar=4*beat,L=[["a",62,1],["o",62,1],["i",65,.5],["o",62,.5],["u",60,1],["e",62,1],["a",62,1],["i",67,1],["o",65,2]];for(let i=0;i<4;i++){const tb=t+i*bar;for(let q=0;q<4;q++)kick(tb+q*beat,.8);snare(tb+beat,.6);snare(tb+3*beat,.6);for(let k=0;k<8;k++)ch(tb+k*beat/2,.8);
    for(let k=0;k<8;k++)sub(tb+k*beat/2,[38,38,45,38,41,38,45,43][k],beat*.4,{cut:400,peak:1600,fd:.12,q:3,vol:1.1});}
  let x=0;for(let r=0;r<2;r++)L.forEach(([v,m,d])=>{robot(t+bar*(r*2)+x*beat,m,d*beat*.9,v);x+=d;if(x>=8)x=0;});
  for(let i=0;i<4;i++)[[0,74,1],[1,72,1],[2,69,2]].forEach(([b,m,d])=>sub(t+i*bar+b*beat,m,d*beat*.95,{waves:[["square",0]],cut:2500,peak:3000,fd:d*beat,vol:.45,att:.01}));
  return 4*bar+1;};
/* 02 浩室与 303 */
DEMOS.house=t=>{const beat=bt(124),bar=4*beat,C=[[45,[60,64,67,71]],[41,[60,64,65,69]],[43,[59,62,65,71]],[45,[60,64,67,71]]];for(let i=0;i<8;i++){const tb=t+i*bar,[r,c]=C[i%4];four(tb,beat,{ch:true,crash:i===0?.6:0});
    [.75,1.5,2.75,3.5].forEach(x=>c.forEach(m=>piano(tb+x*beat,m,beat*.4,.75)));[0,.75,1.5,2.5,3.25].forEach((x,j)=>sub(tb+x*beat,r-12+(j===3?12:0),beat*.45,{waves:[["square",0],["sine",0]],cut:250,peak:900,fd:.15,vol:1.3}));}
  return 8*bar+1;};
const ACID=[[0,33,0],[1,33,1],[2,45,0],[3,33,0],[4,36,1],[5,33,0],[6,43,1],[7,33,0],[8,45,0],[9,33,1],[10,40,0],[11,33,0],[12,46,1],[13,45,0],[14,33,1],[15,38,0]];
function tb303(t,beat,bars,acid){const s=beat/4;for(let i=0;i<bars;i++){const tb=t+i*4*beat;four(tb,beat,{ch:true,clap:i>=1,crash:i===0?.5:0});
    const sw=acid?.5+.5*Math.sin(i/bars*Math.PI*2-1.5):0;ACID.forEach(([k,m,slide],j)=>{const acc=j%3===0;sub(tb+k*s,m,s*(slide?1.6:.85),acid?{waves:[["sawtooth",0]],q:14,cut:220+sw*900,peak:(acc?2200:900)+sw*2600,fd:.12,vol:acc?1.35:1,drive:2.5,from:slide&&j?ACID[j-1][1]:null,glide:.06}:{waves:[["sawtooth",0]],q:1,cut:600,peak:900,fd:.12,vol:1.2});});}
  return bars*4*beat+1;}
DEMOS.flat303=t=>tb303(t,bt(126),8,false);DEMOS.acid=t=>tb303(t,bt(126),8,true);
/* 03 Techno */
DEMOS.detroit=t=>{const beat=bt(130),bar=4*beat,s=beat/4,C=[[57,[69,72,76]],[53,[69,72,77]],[55,[67,71,74]],[52,[67,71,76]]];for(let i=0;i<8;i++){const tb=t+i*bar,[r,c]=C[i%4];for(let q=0;q<4;q++){k909(tb+q*beat,1);oh(tb+q*beat+beat/2,.8);}clap(tb+beat,.7);clap(tb+3*beat,.7);for(let k=0;k<16;k++)ch(tb+k*s,k%4===2?.7:.35);
    [0,1.5,3].forEach(x=>c.forEach(m=>sub(tb+x*beat,m,beat*1.2,{waves:[["sawtooth",-6],["sawtooth",6]],cut:1600,peak:3200,fd:beat,vol:.55,att:.03})));[0,.75,2,2.75].forEach(x=>sub(tb+x*beat,r-24,beat*.5,{waves:[["square",0]],cut:200,peak:700,fd:.15,vol:1.2}));}
  return 8*bar+1;};
DEMOS.berlin=t=>{const beat=bt(132),bar=4*beat,s=beat/4;for(let i=0;i<8;i++){const tb=t+i*bar;for(let q=0;q<4;q++){k909(tb+q*beat,1.2);sub(tb+q*beat+beat*.25,28,beat*.7,{waves:[["sine",0],["triangle",0]],cut:120,peak:240,fd:.4,vol:2,drive:3});oh(tb+q*beat+beat/2,.6);}for(let k=0;k<16;k++)ch(tb+k*s,k%2?.3:.45);if(i>=2)[1,3].forEach(x=>rim(tb+x*beat+s,.8));
    if(i>=2)[0,3,6,10,13].forEach(k=>sub(tb+k*s,52,s*.8,{waves:[["sawtooth",0]],q:9,cut:300+i*80,peak:900+i*180,fd:.08,vol:.8}));}
  return 8*bar+1;};
/* 05 DJ */
DEMOS.build=(t,btn)=>{const beat=bt(126),bar=4*beat,st=stripNear(btn);lightStrip(st,t,bar,8);const C=[45,41,43,40];
  for(let i=0;i<2;i++)four(t+i*bar,beat,{ch:true});for(let i=0;i<2;i++)[0,.5,1,1.5,2,2.5,3,3.5].forEach(x=>sub(t+i*bar+x*beat,33,beat*.4,{cut:200,peak:700,fd:.1,vol:1.2,waves:[["square",0]]}));
  const b0=t+2*bar;riser(b0,4*bar-beat,1);for(let i=0;i<4;i++){const tb=b0+i*bar,n=[4,8,16,32][i];for(let k=0;k<n;k++){if(i===3&&k>=24)continue;snare(tb+k*bar/n,.35+i*.15+k/n*.2);}supersaw(tb,[57,60,64],bar,{cut:500+i*600,peak:900+i*900,vol:.6});}
  const d=t+6*bar;for(let i=0;i<2;i++){const tb=d+i*bar;four(tb,beat,{ch:true,crash:i===0?1.2:0,kv:1.3});supersaw(tb,[57,60,64,69],bar,{cut:3000,peak:6000,vol:.8});[0,.5,1,1.5,2,2.5,3,3.5].forEach(x=>sub(tb+x*beat,C[i]-12,beat*.45,{cut:300,peak:1200,fd:.1,vol:1.4,waves:[["sawtooth",0]]}));}
  return 8*bar+1;};
DEMOS.filter=t=>{const beat=bt(124),bar=4*beat,a=A(),lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=6;lp.frequency.setValueAtTime(180,t);lp.frequency.exponentialRampToValueAtTime(16000,t+6*bar);lp.frequency.setValueAtTime(16000,t+7*bar);lp.connect(bus);
  via(lp,()=>{for(let i=0;i<8;i++){const tb=t+i*bar;four(tb,beat,{ch:true});[.75,1.5,2.75,3.5].forEach(x=>[60,64,67,71].forEach(m=>piano(tb+x*beat,m,beat*.4,.8)));[0,.75,1.5,2.5,3.25].forEach(x=>sub(tb+x*beat,33,beat*.45,{waves:[["square",0]],cut:250,peak:900,fd:.15,vol:1.3}));}});
  return 8*bar+1;};
DEMOS.mix=(t,btn)=>{const beat=bt(124),bar=4*beat,a=A(),gA=a.createGain(),gB=a.createGain();gA.connect(bus);gB.connect(bus);const st=stripNear(btn);lightStrip(st,t,bar,8);
  gA.gain.setValueAtTime(1,t);gA.gain.setValueAtTime(1,t+2*bar);gA.gain.linearRampToValueAtTime(0,t+6*bar);gB.gain.setValueAtTime(0,t);gB.gain.setValueAtTime(0,t+2*bar);gB.gain.linearRampToValueAtTime(1,t+6*bar);
  via(gA,()=>{for(let i=0;i<6;i++){const tb=t+i*bar;four(tb,beat,{ch:true});[.75,1.5,2.75,3.5].forEach(x=>[60,64,67,71].forEach(m=>piano(tb+x*beat,m,beat*.4,.7)));[0,.75,1.5,2.5,3.25].forEach(x=>sub(tb+x*beat,33,beat*.45,{waves:[["square",0]],cut:250,peak:900,fd:.15,vol:1.2}));}});
  via(gB,()=>{for(let i=2;i<8;i++){const tb=t+i*bar,s=beat/4;for(let q=0;q<4;q++){k909(tb+q*beat,1);oh(tb+q*beat+beat/2,.6);}[0,3,6,10,13].forEach(k=>sub(tb+k*s,40,s*.8,{waves:[["sawtooth",0]],q:9,cut:500,peak:1800,fd:.08,vol:.9}));[0,1,2,3].forEach(q=>sub(tb+q*beat+beat/2,28,beat*.4,{waves:[["sine",0]],cut:200,peak:300,fd:.3,vol:1.6}));}});
  return 8*bar+1;};
/* 06 英国 */
DEMOS.jungle=t=>{const beat=bt(170),bar=4*beat,s=beat/4,P=[[0,"k"],[2,"s",.5],[4,"s"],[6,"k"],[7,"s",.4],[9,"s",.5],[10,"k"],[12,"s"],[14,"s",.5],[15,"k",.6]],P2=[[0,"k"],[3,"s",.5],[4,"s"],[5,"s",.3],[6,"k"],[8,"k"],[10,"s",.6],[11,"s",.3],[12,"s"],[13,"s",.4],[14,"k"],[15,"s",.6]];
  for(let i=0;i<8;i++){const tb=t+i*bar;(i%2?P2:P).forEach(([k,w,v=1])=>w==="k"?kick(tb+k*s,v*1.1):snare(tb+k*s,v*1.05));for(let k=0;k<16;k+=2)ch(tb+k*s,.5);if(i%2===0){subBass(tb,[26,26,29,24][i/2%4],bar*.95,1);}
    if(i>=2&&i%2===0)strings(tb,[[62,65,69],[60,64,67]][i/2%2],2*bar,.8);if(i===0||i===4)crash(tb,.5);}
  return 8*bar+1;};
DEMOS.garage=t=>{const beat=bt(132),bar=4*beat,s=beat/4,sw=.18;const pos=k=>k*s+(k%2?s*sw:0);for(let i=0;i<8;i++){const tb=t+i*bar;[0,7,10].forEach(k=>k909(tb+pos(k),k?.8:1.1));[4,12].forEach(k=>{snare(tb+pos(k),.9);clap(tb+pos(k),.6);});[15].forEach(k=>rim(tb+pos(k),1));for(let k=0;k<16;k+=2)ch(tb+pos(k+1),.45);
    [[0,33,.6],[3,36,.3],[7,33,.3],[10,40,.5],[13,38,.3]].forEach(([k,m,d])=>sub(tb+pos(k),m,beat*d*2,{waves:[["sine",0],["square",0]],cut:180,peak:600,fd:.2,vol:1.5}));
    if(i>=2)[[2,[64,67,71]],[9,[62,65,69]]].forEach(([k,c])=>c.forEach(m=>piano(tb+pos(k),m,s*1.5,.8)));}
  return 8*bar+1;};
DEMOS.dubstep=t=>{const beat=bt(140),bar=4*beat,a=A();for(let i=0;i<8;i++){const tb=t+i*bar;kick(tb,1.2);if(i%2)kick(tb+2.5*beat,.8);snare(tb+2*beat,1.3);clap(tb+2*beat,.6);for(let k=0;k<8;k++)ch(tb+k*beat/2,.45);if(i%4===0)crash(tb,.7);
    const rate=[1,2,3,4,2,6,1,4][i]/beat*.5,root=[28,28,31,26][i%4],lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=9;lp.frequency.value=500;const l=a.createOscillator(),lg=a.createGain();l.frequency.value=rate*2;lg.gain.value=420;l.connect(lg).connect(lp.frequency);l.start(tb);l.stop(tb+bar);track(l);
    const g=a.createGain();g.gain.value=.11;const sh=a.createWaveShaper();sh.curve=shaper(4);lp.connect(sh).connect(g).connect(bus);[["sawtooth",-10],["sawtooth",10],["square",0]].forEach(([w,dt])=>{const x=voiceOsc(tb,bar*.98,w,mf(root+12),{dt});x.connect(lp);});
    subBass(tb,root,bar*.98,.8);}
  return 8*bar+1;};
/* 07 Trance、drop */
DEMOS.trance=t=>{const beat=bt(138),bar=4*beat,s=beat/4,C=[[45,[57,60,64]],[41,[57,60,65]],[48,[55,60,64]],[43,[55,59,62]]],ARP=[0,1,2,1,0,2,1,2];
  for(let i=0;i<8;i++){const tb=t+i*bar,[r,c]=C[i%4];four(tb,beat,{clap:true,cv:.6,crash:i%4===0?.7:0});for(let q=0;q<4;q++)sub(tb+q*beat+beat/2,r-12,beat*.45,{waves:[["sawtooth",0]],cut:300,peak:1100,fd:.1,vol:1.2});
    supersaw(tb,c.map(m=>m+12),bar,{cut:2200,peak:4800,vol:.55,att:.02});for(let k=0;k<16;k++)sub(tb+k*s,c[ARP[k%8]]+24,s*.85,{waves:[["sawtooth",-5],["sawtooth",5]],cut:1500,peak:5200,fd:.09,vol:.42});
    if(i>=4)[[0,81,1.5],[1.5,79,.5],[2,76,1],[3,79,1]].forEach(([b,m,d])=>sub(tb+b*beat,m-(i===5?2:i===6?5:0),d*beat*.95,{waves:[["sawtooth",-9],["sawtooth",9],["square",0]],cut:3000,peak:6000,fd:d*beat,vol:.55,att:.01}));}
  return 8*bar+1;};
DEMOS.drop=t=>{const beat=bt(128),bar=4*beat;riser(t,4*bar-beat,1.1);for(let i=0;i<4;i++){const tb=t+i*bar,n=[4,8,16,16][i];for(let k=0;k<n;k++){if(i===3&&k>=12)continue;snare(tb+k*bar/n,.35+i*.18);}supersaw(tb,[69,72,76],bar,{cut:500+i*500,peak:800+i*1000,vol:.5});}
  const d=t+4*bar,a=A();for(let i=0;i<4;i++){const tb=d+i*bar;four(tb,beat,{kv:1.4,cv:1,crash:i===0?1.3:0});const roots=[33,29,36,31];
    [0,.5,1,1.5,2,2.5,3,3.5].forEach((x,j)=>{const m=roots[i]+12+(j%4===3?12:0);sub(tb+x*beat,m,beat*.42,{waves:[["sawtooth",-14],["sawtooth",14],["square",0]],cut:600,peak:7000,fd:.18,q:4,vol:1.2,drive:3});subBass(tb+x*beat,roots[i],beat*.42,.8);});}
  return 8*bar+1.2;};
/* 08 氛围与芯片 */
DEMOS.ambient=t=>{const beat=bt(72),total=56*beat,L=[[7,[[0,72],[2,76],[4.5,79]]],[9,[[1,67],[5,71]]],[11,[[0,60],[3,64],[7,62]]]];
  L.forEach(([len,notes])=>{for(let st=0;st<total;st+=len*beat)notes.forEach(([b,m])=>{if(st+b*beat<total)piano(t+st+b*beat,m,4,.7);});});
  [[0,[48,55,64]],[16,[45,52,60]],[32,[41,48,57]],[44,[43,50,59]]].forEach(([b,c])=>strings(t+b*beat,c,Math.min(16,56-b)*beat,.9));return total+3;};
DEMOS.chip=t=>{const beat=bt(140),bar=4*beat,s=beat/4,M=[72,76,79,84,79,76,72,76,74,77,81,86,81,77,74,77],B=[48,48,55,55,50,50,57,57];
  for(let i=0;i<8;i++){const tb=t+i*bar;for(let k=0;k<16;k++){const m=M[(k+i*4)%16]-(i>=4?5:0);sub(tb+k*s,m,s*.8,{waves:[["square",0]],cut:6000,peak:6000,fd:.1,vol:.45});}
    for(let k=0;k<8;k++)sub(tb+k*beat/2,B[k]-12-(i>=4?5:0),beat*.45,{waves:[["triangle",0]],cut:3000,peak:3000,fd:.1,vol:1.4});
    for(let q=0;q<4;q++){const a=A(),n=a.createBufferSource();n.buffer=noise();const g=a.createGain(),tt=tb+q*beat,sn=q%2;g.gain.setValueAtTime(sn?.2:.0,tt);g.gain.exponentialRampToValueAtTime(.001,tt+(sn?.12:.02));n.connect(g).connect(bus);n.start(tt);n.stop(tt+.13);track(n);if(!sn)subBass(tt,24,.08,1,{from:48,glide:.06});ch(tt+beat/2,.6);}}
  return 8*bar+1;};

/* ================= 调度 ================= */
const GAIN={disco:1.5,seq:1.6,vocoder:1,house:1.1,flat303:1.3,acid:1.25,detroit:1.2,berlin:.95,build:1.1,filter:1,mix:1.3,jungle:.55,garage:.95,dubstep:.5,trance:1.3,drop:.85,ambient:4,chip:2.2};
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
function runDemo(name,btn){newBus();bus.gain.value=GAIN[name]||1;if(["ambient","trance","detroit","jungle","seq"].includes(name))addRoom(2.6,.4);setActive(btn);const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;later(()=>clearActive(),d+.4);}
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);

/* ================= 推荐曲目：霓虹传单 ================= */
const SONGS=[
  {side:"A",q:"Donna Summer I Feel Love",title:"I Feel Love",by:"Donna Summer",yr:"1977",style:"迪斯科 · 合成器",
   txt:"本章开头那首歌。Giorgio Moroder 用 Moog 合成器做出的、像机器一样永不停歇的贝斯线，常被看作电子舞曲的起点之一。",listen:["跟着贝斯线拍桌子，对照 Lab 01 的音序器","人声飘在机器上面"]},
  {side:"A",q:"Kraftwerk Trans-Europe Express",title:"Trans-Europe Express",by:"Kraftwerk",yr:"1977",style:"德国电子乐",
   txt:"德国杜塞尔多夫乐队 Kraftwerk 的代表作。像火车车轮一样的节奏和冷静的合成器，影响了 Techno、早期嘻哈和电子流行。",listen:["节奏像什么？","和《I Feel Love》比，“温度”有什么不同？"]},
  {side:"A",q:"Yellow Magic Orchestra Rydeen",title:"Rydeen",by:"Yellow Magic Orchestra",yr:"1979",style:"日本电子流行",
   txt:"日本乐队 YMO 的器乐曲，明亮的合成器旋律和电子鼓。它和很多日本游戏音乐听起来是一家人。",listen:["旋律是用什么音色演奏的？","对照 Lab 07 的芯片音乐"]},
  {side:"A",q:"Frankie Knuckles Your Love",title:"Your Love",by:"Frankie Knuckles",yr:"1987",style:"芝加哥浩室",
   txt:"浩室“教父”的经典之作。一条不断循环的合成器琶音，加上温暖的人声和四拍底鼓。",listen:["四拍底鼓和反拍的开镲，对照图 2","那条琶音循环了多久？"]},
  {side:"A",q:"Phuture Acid Tracks",title:"Acid Tracks",by:"Phuture",yr:"1987",style:"酸性浩室",
   txt:"十多分钟几乎只有鼓机和一台 TB-303。它给“酸性浩室”起了名字。",listen:["303 什么时候变亮、什么时候变闷？对照图 3","对照 Lab 02 的“酸性”"]},
  {side:"A",q:"Rhythim Is Rhythim Strings of Life",title:"Strings of Life",by:"Rhythim Is Rhythim（Derrick May）",yr:"1987",style:"底特律 Techno",
   txt:"Derrick May 的作品，钢琴和合成器弦乐充满激情，证明了 Techno 也可以很浪漫。",listen:["弦乐段落的旋律","和 Lab 03 的“底特律”比一比"]},
  {side:"B",q:"Goldie Inner City Life",title:"Inner City Life",by:"Goldie",yr:"1994",style:"丛林 / 鼓打贝斯",
   txt:"快速切碎的 breakbeat，深沉的低音，加上温柔的灵魂乐人声。鼓打贝斯从地下走向主流的代表作之一。",listen:["鼓的速度和低音的速度“不一样”","对照 Lab 05 的丛林"]},
  {side:"B",q:"Daft Punk Around the World",title:"Around the World",by:"Daft Punk",yr:"1997",style:"法国浩室",
   txt:"法国二人组 Daft Punk 的作品。一句经过处理的人声重复了很多遍，各种乐器像积木一样轮流进出。",listen:["那句人声重复了几次？","贝斯、鼓、键盘各在什么时候进来？"]},
  {side:"B",q:"Darude Sandstorm",title:"Sandstorm",by:"Darude",yr:"1999",style:"Trance",
   txt:"芬兰制作人的器乐作品，快速的合成器 riff 和不断的积累，后来成了体育场和网络上无处不在的“背景音乐”。",listen:["积累段怎样推高张力？","和 Lab 06 的 Trance 比一比"]},
  {side:"B",q:"Burial Archangel",title:"Archangel",by:"Burial",yr:"2007",style:"英国车库 · 后 dubstep",
   txt:"伦敦制作人 Burial 的作品，摇摆的车库节奏、切碎的人声采样和唱片的沙沙声，像深夜伦敦街头的雨。",listen:["鼓为什么“一步一顿”？对照 Lab 05 的 2-step","人声是完整的句子吗？"]},
  {side:"B",q:"Skrillex Scary Monsters and Nice Sprites",title:"Scary Monsters and Nice Sprites",by:"Skrillex",yr:"2010",style:"美式 dubstep / EDM",
   txt:"把英国的 dubstep 变成了更响、更激烈的美国 EDM。积累、一声尖叫，然后是扭曲的低音 drop。",listen:["drop 前的那一拍安静","低音怎样“扭动”？对照图 6"]},
  {side:"B",q:"Avicii Levels",title:"Levels",by:"Avicii",yr:"2011",style:"EDM · 前卫浩室",
   txt:"瑞典制作人 Avicii 的代表作，明亮的钢琴式合成器旋律和巨大的 drop，是 2010 年代 EDM 浪潮的标志之一。",listen:["旋律第一次出现时是什么音色？","drop 来的时候你在哪一拍举手？"]}
];
const NC=["#FF4FD8","#2FE3FF","#E6FF3A","#FF6A1F","#8C5CFF","#35F29A"];
const ICON="M8 5v14l11-7z";
SONGS.forEach((s,i)=>{
  const el=document.createElement("div");el.className="song";el.style.setProperty("--nc",NC[i%NC.length]);
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<div class="meta"><span class="yr">${s.yr}</span><span class="title">${s.title}</span><span class="by">${s.by}</span><div class="pmeta"><span class="style">${s.style}</span></div></div>
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
function pill(g,x,y,w,t,c){S(g,"rect",{x:x-w/2,y:y-16,width:w,height:32,rx:4,style:c?FILL(c):"",class:c?"":"sv-card"});if(!c)S(g,"rect",{x:x-w/2,y:y-16,width:w,height:32,rx:4,class:"sv-l"});S(g,"text",{x,y:y+5,"text-anchor":"middle",class:c?"sv-on":"sv-t",style:"font-size:12.5px;font-weight:900"},t);}
/* 图 1 家谱 */
(()=>{const g=document.getElementById("tree-fig");if(!g)return;const N={disco:[70,90,"迪斯科"],kw:[70,250,"德国电子乐"],house:[210,90,"芝加哥浩室","red"],techno:[210,250,"底特律 Techno","red"],acid:[350,50,"酸性浩室"],berlin:[350,300,"柏林 Techno"],rave:[350,150,"英国锐舞"],hh:[350,215,"嘻哈 breakbeat（C2）"],
  jungle:[510,110,"丛林 / 鼓打贝斯"],garage:[510,170,"英国车库"],dub:[510,230,"dubstep"],trance:[510,50,"Trance"],edm:[618,140,"EDM"]};
  const E=[["disco","house"],["kw","techno"],["kw","house"],["disco","techno"],["house","acid"],["techno","berlin"],["acid","rave"],["rave","jungle"],["hh","jungle"],["rave","garage"],["garage","dub"],["techno","trance"],["house","trance"],["trance","edm"],["dub","edm"],["house","edm"]];
  E.forEach(([a,b])=>{const [x1,y1]=N[a],[x2,y2]=N[b];const sx=x1+56,ex=x2-56,mx=(sx+ex)/2;S(g,"path",{d:`M ${sx} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${ex} ${y2}`,class:"sv-l","stroke-width":1.3,fill:"none",opacity:.7});});
  Object.entries(N).forEach(([k,[x,y,t,c]])=>pill(g,x,y,k==="edm"?96:t.length>7?136:112,t,c||null));
  [["1970s",70],["1980s",210],["1990s",430],["2010s",630]].forEach(([t,x])=>S(g,"text",{x,y:345,"text-anchor":"middle",class:"sv-m",style:"font-family:var(--font-lcd);font-size:11px"},t));
})();
/* 图 2 鼓型 */
(()=>{const g=document.getElementById("beat-fig");if(!g)return;const x0=180,cw=29,all=[...Array(16).keys()];
  const B=[["迪斯科（真鼓）",{开镲:[2,6,10,14],军鼓:[4,12],底鼓:[0,4,8,12]}],["浩室（鼓机）",{踩镲:all.filter(k=>k%2===0),开镲:[2,6,10,14],拍手:[4,12],底鼓:[0,4,8,12]}]];
  B.forEach(([n,L],b)=>{const y=18+b*118;S(g,"text",{x:20,y:y+20,class:"sv-t",style:TB},n);Object.entries(L).forEach(([lane,hits],li)=>{const yy=y+li*24;S(g,"text",{x:x0-8,y:yy+14,"text-anchor":"end",class:"sv-ts"},lane);
    all.forEach(k=>{const on=hits.includes(k);S(g,"rect",{x:x0+k*cw,y:yy,width:cw-4,height:18,rx:2,style:on?FILL(lane==="底鼓"?"red":lane==="开镲"?"denim":"ink"):"",class:on?"":"sv-card"});if(!on)S(g,"rect",{x:x0+k*cw,y:yy,width:cw-4,height:18,rx:2,class:"sv-lline"});});});});
})();
/* 图 3 滤波 */
(()=>{const g=document.getElementById("filter-fig");if(!g)return;const x0=70,W=560,base=220;S(g,"line",{x1:x0,y1:base,x2:x0+W,y2:base,class:"sv-l"});S(g,"line",{x1:x0,y1:base,x2:x0,y2:30,class:"sv-l"});
  S(g,"text",{x:x0+W,y:base+20,"text-anchor":"end",class:"sv-ts"},"频率 →");S(g,"text",{x:x0+6,y:40,class:"sv-ts"},"音量 ↑");
  [[.3,"ink",.35],[.55,"red",1],[.8,"denim",.5]].forEach(([fc,c,op],i)=>{let d="";for(let x=0;x<=W;x+=4){const r=x/W,dist=(r-fc)/.05,peak=Math.exp(-dist*dist)*110,y=r<fc?base-100-peak:base-Math.max(0,100*Math.exp(-(r-fc)*14))-peak;d+=(x?" L ":"M ")+`${x0+x} ${y.toFixed(1)}`;}S(g,"path",{d,style:`stroke:var(--${c});fill:none`,"stroke-width":i===1?3:1.8,opacity:op});});
  S(g,"text",{x:x0+.55*W+28,y:46,class:"sv-r",style:"font-size:13px;font-weight:900"},"← 共振峰");
  S(g,"path",{d:`M ${x0+.3*W} 250 L ${x0+.8*W} 250`,class:"sv-l","stroke-width":1.6});S(g,"text",{x:x0+.55*W,y:266,"text-anchor":"middle",class:"sv-ts"},"转动 CUTOFF：峰左右移动");
})();
/* 图 4 能量 */
(()=>{const g=document.getElementById("energy-fig");if(!g)return;const x0=40,W=600,base=210,P=[[0,.3],[.12,.32],[.14,.35],[.3,.8],[.31,.05],[.32,1],[.5,1],[.52,.25],[.62,.3],[.76,.85],[.77,.05],[.78,1],[.92,.95],[1,.3]];
  let d=`M ${x0} ${base}`;P.forEach(([x,y])=>d+=` L ${x0+x*W} ${base-y*160}`);d+=` L ${x0+W} ${base} Z`;S(g,"path",{d,style:FILL("red"),opacity:.2});let l="";P.forEach(([x,y],i)=>l+=(i?" L ":"M ")+`${x0+x*W} ${base-y*160}`);S(g,"path",{d:l,style:"stroke:var(--red);fill:none","stroke-width":2.6});
  S(g,"line",{x1:x0,y1:base,x2:x0+W,y2:base,class:"sv-l"});[["前奏",.06],["积累",.22],["DROP",.41],["间歇",.57],["积累",.69],["DROP",.85],["尾奏",.96]].forEach(([t,x])=>S(g,"text",{x:x0+x*W,y:base+20,"text-anchor":"middle",class:t==="DROP"?"sv-r":"sv-ts",style:t==="DROP"?"font-weight:900;font-size:12px":""},t));
  [.31,.77].forEach(x=>S(g,"text",{x:x0+x*W,y:base-12,"text-anchor":"middle",class:"sv-m",style:"font-size:10.5px"},"静"));
})();
/* 图 5 混音 */
(()=>{const g=document.getElementById("mix-fig");if(!g)return;const x0=60,W=580;S(g,"rect",{x:x0,y:30,width:W*.7,height:40,rx:4,style:FILL("red"),opacity:.85});S(g,"text",{x:x0+10,y:55,class:"sv-on",style:"font-weight:900;font-size:13px"},"歌曲 A");
  S(g,"rect",{x:x0+W*.35,y:84,width:W*.65,height:40,rx:4,style:FILL("denim"),opacity:.85});S(g,"text",{x:x0+W*.35+10,y:109,class:"sv-on",style:"font-weight:900;font-size:13px"},"歌曲 B");
  S(g,"path",{d:`M ${x0+W*.35} 140 L ${x0+W*.7} 190`,style:"stroke:var(--red)","stroke-width":2.4});S(g,"path",{d:`M ${x0+W*.35} 190 L ${x0+W*.7} 140`,style:"stroke:var(--denim)","stroke-width":2.4});
  S(g,"text",{x:x0+W*.525,y:210,"text-anchor":"middle",class:"sv-ts"},"交叉渐变：16 小节");for(let k=0;k<=32;k++)S(g,"line",{x1:x0+k*W/32,y1:220,x2:x0+k*W/32,y2:k%4?226:230,class:"sv-l"});
})();
/* 图 6 摇摆低音 */
(()=>{const g=document.getElementById("wobble-fig");if(!g)return;const x0=110,W=520;S(g,"text",{x:20,y:66,class:"sv-t",style:TB},"LFO");S(g,"text",{x:20,y:176,class:"sv-t",style:TB},"低音亮度");
  [1,2,3].forEach((r,ri)=>{const seg=W/3,xs=x0+ri*seg;let d="",e="";for(let x=0;x<=seg;x+=3){const ph=x/seg*4*r*Math.PI*.5;d+=(x?" L ":"M ")+`${xs+x} ${(64-Math.sin(ph*2)*26).toFixed(1)}`;const v=.5+.5*Math.sin(ph*2);e+=(x?" L ":"M ")+`${xs+x} ${(210-v*70).toFixed(1)}`;}
    S(g,"path",{d,style:"stroke:var(--denim);fill:none","stroke-width":2.2});S(g,"path",{d:e+` L ${xs+seg} 210 L ${xs} 210 Z`,style:FILL("red"),opacity:.25});S(g,"path",{d:e,style:"stroke:var(--red);fill:none","stroke-width":2});
    S(g,"text",{x:xs+seg/2,y:240,"text-anchor":"middle",class:"sv-ts"},`每拍 ${r} 次`);if(ri)S(g,"line",{x1:xs,y1:30,x2:xs,y2:220,class:"sv-lline"});});
  S(g,"path",{d:`M 300 100 L 300 128`,class:"sv-l","stroke-width":1.4});S(g,"text",{x:308,y:120,class:"sv-m",style:"font-size:11px"},"控制");
})();
/* 图 7 速度地图 */
(()=>{const g=document.getElementById("bpm-fig");if(!g)return;const X=b=>150+(b-60)*3.4;const R=[["浩室",118,128,"red"],["Techno",125,140,"ink"],["Trance",130,140,"denim"],["Dubstep（听起来半速）",138,142,"mustard"],["丛林 / 鼓打贝斯",160,180,"red"],["硬核",160,200,"ink"]];
  [60,80,100,120,140,160,180,200].forEach(b=>{S(g,"line",{x1:X(b),y1:16,x2:X(b),y2:262,class:"sv-lline"});S(g,"text",{x:X(b),y:282,"text-anchor":"middle",class:"sv-m",style:"font-family:var(--font-lcd);font-size:11px"},String(b));});
  R.forEach(([n,a,b,c],i)=>{const y=24+i*40;S(g,"text",{x:140,y:y+17,"text-anchor":"end",class:"sv-t",style:"font-size:12.5px;font-weight:700"},n);S(g,"rect",{x:X(a),y,width:Math.max(10,X(b)-X(a)),height:24,rx:3,style:FILL(c)});if(i===3){S(g,"rect",{x:X(69),y,width:X(71)-X(69),height:24,rx:3,style:FILL(c),opacity:.35});S(g,"text",{x:X(72)+6,y:y+17,class:"sv-m",style:"font-size:11px"},"← 感觉上");}});
  S(g,"text",{x:660,y:302,"text-anchor":"end",class:"sv-ts"},"BPM");
})();
/* 图 8 循环 */
(()=>{const g=document.getElementById("loops-fig");if(!g)return;const x0=110,W=540,T=40;[[7,"red"],[9,"denim"],[11,"mustard"]].forEach(([len,c],i)=>{const y=40+i*60;S(g,"text",{x:20,y:y+18,class:"sv-t",style:TB},`${len} 秒循环`);
  for(let st=0;st<T;st+=len){const x=x0+st/T*W,w=Math.min(len,T-st)/T*W;S(g,"rect",{x:x+1,y,width:w-2,height:26,rx:3,style:FILL(c),opacity:.7});}});
  S(g,"text",{x:x0,y:232,class:"sv-ts"},"前 40 秒：三条循环的起点几乎从不对齐");})();
/* 外部照片 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`照片待放入：${img.getAttribute("src")}<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张照片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
