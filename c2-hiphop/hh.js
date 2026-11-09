/* ================= 嘻哈：乐器与工具 ================= */
Object.assign(INST,{
  fb:{bright:.38,decay:.996,dur:1,vol:.8,lp:1100},
  zh:{bright:.95,decay:.9986,dur:2.2,vol:.3,lp:7000,peak:[2400,5]},
  dk:{bright:.8,decay:.998,dur:1.2,vol:.28,lp:3000}
});
function epiano(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain(),x=a.createOscillator();x.type="sine";x.frequency.value=f;const m=a.createOscillator();m.frequency.value=f*2;const mg=a.createGain();mg.gain.setValueAtTime(f*1.1,t);mg.gain.exponentialRampToValueAtTime(f*.08,t+.5);m.connect(mg).connect(x.frequency);x.connect(g);[x,m].forEach(o=>{o.start(t);o.stop(t+dur+.1);track(o);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.11*v,t+.006);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);g.connect(bus);}
function piano(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain();[[1,.6,"triangle"],[2,.25,"sine"],[3,.08,"sine"]].forEach(([h,am,w])=>{const x=a.createOscillator();x.type=w;x.frequency.value=f*h;const xg=a.createGain();xg.gain.value=am;x.connect(xg).connect(g);x.start(t);x.stop(t+dur+.1);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.11*v,t+.005);g.gain.exponentialRampToValueAtTime(.03*v,t+.4);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);g.connect(bus);}
function strings(t,notes,dur,v=1){const a=A();notes.forEach(m=>[-7,0,7].forEach(dt=>{const o=a.createOscillator();o.type="sawtooth";o.frequency.value=mf(m);o.detune.value=dt;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=2000;const g=a.createGain(),vv=.012*v;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vv,t+Math.min(.25,dur*.3));g.gain.setValueAtTime(vv,t+Math.max(.26,dur-.15));g.gain.linearRampToValueAtTime(0,t+dur);o.connect(lp).connect(g).connect(bus);o.start(t);o.stop(t+dur+.05);track(o);}));}
function synth(t,midi,dur,o={}){const a=A(),f=mf(midi),g=a.createGain(),v=(o.vol||1)*.05,lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=o.q||2;lp.frequency.setValueAtTime(o.cut||900,t);lp.frequency.linearRampToValueAtTime(o.open||2600,t+(o.att||.08));lp.frequency.exponentialRampToValueAtTime(o.cut||900,t+Math.max(.2,dur));
  (o.waves||[["sawtooth",-8],["sawtooth",8]]).forEach(([w,dt])=>{const x=a.createOscillator();x.type=w;if(o.from!=null){x.frequency.setValueAtTime(mf(o.from),t);x.frequency.linearRampToValueAtTime(f,t+(o.glide||.1));}else x.frequency.value=f;x.detune.value=dt;x.connect(lp);x.start(t);x.stop(t+dur+.06);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(o.att||.01));g.gain.setValueAtTime(v,t+Math.max(o.att||.01,dur-.05));g.gain.linearRampToValueAtTime(0,t+dur);lp.connect(g).connect(bus);}
function b808(t,midi,dur,o={}){const a=A(),f=mf(midi),x=a.createOscillator();x.type="sine";if(o.from!=null){x.frequency.setValueAtTime(mf(o.from),t);x.frequency.exponentialRampToValueAtTime(f,t+(o.glide||.12));}else{x.frequency.setValueAtTime(f*2.4,t);x.frequency.exponentialRampToValueAtTime(f,t+.03);}
  if(o.to!=null){x.frequency.setValueAtTime(f,t+dur*.55);x.frequency.exponentialRampToValueAtTime(mf(o.to),t+dur*.9);}
  const g=a.createGain(),v=(o.vol||1)*.7;g.gain.setValueAtTime(v,t);g.gain.setValueAtTime(v*.9,t+Math.max(.05,dur-.12));g.gain.exponentialRampToValueAtTime(.001,t+dur);const sh=a.createWaveShaper();sh.curve=shaper(2.4);x.connect(sh).connect(g).connect(bus);x.start(t);x.stop(t+dur+.02);track(x);}
function lofiChain(lp=5200){const a=A(),inp=a.createGain(),h=a.createBiquadFilter();h.type="highpass";h.frequency.value=70;const l=a.createBiquadFilter();l.type="lowpass";l.frequency.value=lp;const sh=a.createWaveShaper();sh.curve=shaper(1.8);const out=a.createGain();out.gain.value=.9;inp.connect(h).connect(l).connect(sh).connect(out);return [inp,out];}
function crackle(t,dur,v=.5){const a=A(),n=a.createBufferSource(),len=Math.floor(a.sampleRate*Math.min(dur,40)),b=a.createBuffer(1,len,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()<.0008?(Math.random()*2-1)*.9:(Math.random()*2-1)*.01;n.buffer=b;const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=1500;const g=a.createGain();g.gain.value=v;n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+dur);track(n);}
/* 合成音节：短促的元音 + 起首的辅音噪声，用来模拟说唱节奏 */
const VOW=[[730,1090],[300,2300],[570,840],[440,1020],[500,1700]];
function syl(t,dur,midi,vi,acc=1){const a=A(),f=mf(midi),o=a.createOscillator();o.type="sawtooth";o.frequency.setValueAtTime(f*1.04,t);o.frequency.linearRampToValueAtTime(f*.96,t+dur);const out=a.createGain();
  const [f1,f2]=VOW[vi%VOW.length];[[f1,6,1],[f2,8,.6],[2700,10,.25]].forEach(([fr,q,am])=>{const bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=fr;bp.Q.value=q;const g=a.createGain();g.gain.value=am*3;o.connect(bp).connect(g).connect(out);});
  const g=a.createGain(),v=.42*acc;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.012);g.gain.setValueAtTime(v*.8,t+dur*.6);g.gain.linearRampToValueAtTime(0,t+dur);out.connect(g).connect(bus);o.start(t);o.stop(t+dur+.02);track(o);
  const n=a.createBufferSource();n.buffer=noise();const nf=a.createBiquadFilter();nf.type="bandpass";nf.frequency.value=[3500,5500,2500][vi%3];nf.Q.value=1.5;const ng=a.createGain();ng.gain.setValueAtTime(.12*acc,t-.005);ng.gain.exponentialRampToValueAtTime(.001,t+.03);n.connect(nf).connect(ng).connect(bus);n.start(Math.max(0,t-.005));n.stop(t+.04);track(n);}
/* 鼓组 */
function bbBar(tb,beat,o={}){const s=beat/4,sw=o.swing||0,hum=o.hum||0,J=()=>(Math.random()-.5)*hum;const pos=k=>tb+k*s+(k%2?s*sw:0)+J();
  [0,7,10].forEach((k,i)=>kick(pos(k),i?.8:1.25));snare(pos(4)+(o.late||0),1.25);snare(pos(12)+(o.late||0),1.25);if(o.ghost)[6,15].forEach(k=>snare(pos(k),.2));for(let k=0;k<16;k+=2)hat(pos(k),k%4?.4:.7);if(o.hat16)for(let k=1;k<16;k+=2)hat(pos(k),.25);}
function trapBar(tb,beat,o={}){const s=beat/4;for(let k=0;k<16;k++){if(o.rolls&&o.rolls.includes(k)){for(let r=0;r<3;r++)hat(tb+k*s+r*s/3,.45);}else if(k%2===0)hat(tb+k*s,.7);}clap(tb+8*s,1.1);snare(tb+8*s,.5);if(o.crash)crash(tb,o.crash);}
function scratch(t,dur,midi=62){const a=A(),o=a.createOscillator();o.type="sawtooth";const f=mf(midi),g=a.createGain(),bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=1600;bp.Q.value=1.2;
  const n=a.createBufferSource();n.buffer=noise();const ng=a.createGain();ng.gain.value=.35;n.connect(ng).connect(bp);o.connect(bp);bp.connect(g).connect(bus);g.gain.value=0;
  const steps=Math.floor(dur/.09);for(let i=0;i<steps;i++){const tt=t+i*.09,fwd=i%2===0,r=fwd?1.6:.5;o.frequency.setValueAtTime(f*(fwd?.5:1.4),tt);o.frequency.exponentialRampToValueAtTime(f*(fwd?1.8:.4),tt+.08);bp.frequency.setValueAtTime(fwd?900:2400,tt);bp.frequency.linearRampToValueAtTime(fwd?2600:800,tt+.08);g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(.32,tt+.01);g.gain.setValueAtTime(.32,tt+.06);g.gain.linearRampToValueAtTime(0,tt+.085);}
  [o,n].forEach(x=>{x.start(t);x.stop(t+dur+.05);track(x);});}

const DEMOS={};
/* 01 两台唱机 */
const RECCH=[[38,[62,65,69,72]],[43,[59,65,69,71]],[36,[60,64,67,71]],[45,[61,64,67,71]]];
function bandBar(tb,beat,i){const [r,ch]=RECCH[i%4];[0,1.5,2.5].forEach(x=>strum(tb+x*beat,ch,"dk",{vol:.9,mute:beat*.4,spread:.006}));strings(tb,ch.map(m=>m+12),4*beat,.6);for(let k=0;k<8;k++)pluck(tb+k*beat/2,(k%3===2?r+7:r)-12,"fb",{vol:1,mute:beat*.4});bbBar(tb,beat,{ghost:true});[1.5,3.5].forEach(x=>brassStab(tb+x*beat,ch.map(m=>m+12),beat*.3));}
function brassStab(t,notes,len){notes.forEach(m=>synth(t,m,len,{vol:.5,cut:900,open:3200,att:.01,waves:[["sawtooth",0]]}));}
function breakBar(tb,beat){bbBar(tb,beat,{ghost:true,hat16:true});}
DEMOS["loop-off"]=(t,btn)=>{const beat=bt(100),bar=4*beat;through(lofiChain(),()=>{for(let i=0;i<2;i++)bandBar(t+i*bar,beat,i);for(let i=2;i<4;i++)breakBar(t+i*bar,beat);for(let i=4;i<6;i++)bandBar(t+i*bar,beat,i);crackle(t,6*bar);});return 6*bar+.8;};
DEMOS["loop-on"]=(t,btn)=>{const beat=bt(100),bar=4*beat,st=stripNear(btn);lightStrip(st,t,bar,8);through(lofiChain(),()=>{for(let i=0;i<8;i++){breakBar(t+i*bar,beat);if(i%2===1)scratch(t+i*bar+3.5*beat,.18,60);}crackle(t,8*bar);});return 8*bar+.8;};
DEMOS.scratch=t=>{const beat=bt(96),bar=4*beat;for(let i=0;i<4;i++){bbBar(t+i*bar,beat,{ghost:true});[0,.5,1,1.75,2.5,3,3.25].forEach((x,j)=>scratch(t+i*bar+x*beat,j%3===2?.36:.18,58+(i%2)*3));}return 4*bar+.8;};
/* 02 flow */
const FLOWS={a:[[0,1],[.5,0],[1,0],[1.5,0],[2,1],[2.5,0],[3,0],[3.5,2]],b:[0,1,2,3,4,5,6,7,8,9,10,11].map(k=>[k/3,k%3===0?1:0]),c:[[0,1],[.75,0],[1.25,0],[1.5,1],[2.25,0],[2.5,0],[3,0],[3.25,2],[3.75,0]]};
function flowDemo(t,kind){const beat=bt(92),bar=4*beat,P=[[38,[65,69,72]],[38,[65,69,72]],[34,[65,70,74]],[36,[64,67,72]]];
  for(let i=0;i<8;i++){const tb=t+i*bar,[r,ch]=P[i%4];bbBar(tb,beat,{swing:.12});ch.forEach(m=>epiano(tb,m,beat*3.6,.7));pluck(tb,r-12,"fb",{vol:1,mute:beat*1.5});pluck(tb+2.5*beat,r-12,"fb",{vol:.8,mute:beat*1});
    if(i>=1&&i<7){let v=0;FLOWS[kind].forEach(([b,acc])=>{const dur=kind==="b"?beat/3*.85:beat*.38;syl(tb+b*beat+(kind==="c"?.02:0),dur,acc===2?55:57+(acc?2:0)-(i%2?1:0),v++ +i,acc?1.15:.85);});}}
  return 8*bar+1;}
DEMOS["flow-a"]=t=>flowDemo(t,"a");DEMOS["flow-b"]=t=>flowDemo(t,"b");DEMOS["flow-c"]=t=>flowDemo(t,"c");
/* 03 采样 */
const REC=[[38,[62,65,69,72],[[0,74,1.5],[1.5,72,.5],[2,69,2]]],[43,[59,62,65,69],[[0,71,1],[1,72,1],[2,74,2]]],[36,[60,64,67,71],[[0,76,1.5],[1.5,74,.5],[2,72,2]]],[45,[61,64,67,71],[[0,73,3],[3,76,1]]]];
function recBar(tb,beat,i,o={}){const [r,ch,ln]=REC[i%4],tr=o.tr||0;ch.forEach(m=>piano(tb,m+tr,beat*1.8,.9));ch.forEach(m=>piano(tb+2*beat,m+tr,beat*1.8,.7));strings(tb,ch.map(m=>m+12+tr),4*beat,.8);ln.forEach(([b,m,d])=>voice(tb+b*beat,m+tr,d*beat*.95,{vowel:"o",vol:.5,vibDepth:18}));pluck(tb,r-12+tr,"fb",{vol:.8,mute:beat*3.5});}
function recSlice(t,beat,bar,half,len,tr=0){const [r,ch,ln]=REC[bar%4],t0=half*beat/2;ch.forEach(m=>piano(t,m+tr,len*.9,.85));strings(t,ch.map(m=>m+12+tr),len,.9);const v=ln.find(([b,,d])=>b*beat<=t0+1e-6&&t0<(b+d)*beat);if(v)voice(t,v[1]+tr,len*.92,{vowel:"o",vol:.5,vibDepth:10,from:0});pluck(t,r-12+tr,"fb",{vol:.9,mute:len});}
DEMOS["chop-orig"]=t=>{const beat=bt(84),bar=4*beat;through(lofiChain(4200),()=>{for(let i=0;i<4;i++)recBar(t+i*bar,beat,i);crackle(t,4*bar+1,.7);});return 4*bar+1.4;};
DEMOS["chop-loop"]=t=>{const beat=bt(88),bar=4*beat;through(lofiChain(4200),()=>{for(let i=0;i<8;i++)recBar(t+i*bar,beat,0);crackle(t,8*bar,.6);});for(let i=0;i<8;i++)bbBar(t+i*bar,beat,{swing:.1,ghost:true});return 8*bar+1;};
DEMOS["chop-flip"]=t=>{const beat=bt(90),bar=4*beat,h=beat/2,ORDER=[[2,0],[2,0],[0,2],[2,0],[3,0],[3,1],[1,4],[0,4]];
  through(lofiChain(4600),()=>{for(let i=0;i<8;i++){const tb=t+i*bar,pat=i%2?[[0,2,2],[2,3,1],[3,3,1],[4,0,2],[6,1,1],[7,1,1]]:[[0,2,2],[2,2,1],[3,3,1],[4,0,3],[7,1,1]];
      pat.forEach(([pos,sl,len])=>{const [bb,hh]=ORDER[sl*2%8];recSlice(tb+pos*h,beat,bb,hh,len*h*.95,sl===1?5:sl===3?-2:2);});}crackle(t,8*bar,.6);});
  for(let i=0;i<8;i++)bbBar(t+i*bar,beat,{swing:.14,ghost:true});return 8*bar+1;};
/* 04 摇摆 */
function swingDemo(t,on){const beat=bt(90),bar=4*beat,CH=[[36,[60,63,67,70,74]],[41,[60,63,65,69,72]]];for(let i=0;i<8;i++){const tb=t+i*bar,[r,ch]=CH[i%2];bbBar(tb,beat,on?{swing:.22,hum:.025,late:.03,hat16:true,ghost:true}:{hat16:true,ghost:true});
    ch.forEach((m,j)=>epiano(tb+(on?j*.012+.02:0),m,beat*1.8,.6));ch.forEach((m,j)=>epiano(tb+2.5*beat+(on?j*.015+.03:0),m,beat*1.2,.5));pluck(tb,r-12,"fb",{vol:1,mute:beat*1.4});pluck(tb+1.75*beat+(on?.03:0),r-12,"fb",{vol:.7,mute:beat*.5});pluck(tb+2.5*beat,r-12,"fb",{vol:.9,mute:beat*1.2});}
  return 8*bar+1;}
DEMOS["swing-off"]=t=>swingDemo(t,false);DEMOS["swing-on"]=t=>swingDemo(t,true);
DEMOS.breakfast=t=>{const b1=bt(90),b2=bt(170);for(let i=0;i<2;i++)bbBar(t+i*4*b1,b1,{ghost:true,hat16:true});const t2=t+8*b1+.4;for(let i=0;i<8;i++){const tb=t2+i*4*b2,s=b2/4;kick(tb,1.2);kick(tb+10*s,1);snare(tb+4*s,1.1);snare(tb+12*s,1.1);[6,7,14,15].forEach(k=>snare(tb+k*s,i%2?.5:.25));for(let k=0;k<16;k+=2)hat(tb+k*s,.6);if(i%2===0)b808(tb,26,4*b2,{vol:.8});if(i%4===0)crash(tb,.6);}return 8*b1+.4+32*b2+1;};
/* 05 东岸、西岸 */
DEMOS.boombap=t=>{const beat=bt(90),bar=4*beat,CH=[[45,[60,64,67,71,74]],[38,[60,65,69,72,76]]];through(lofiChain(4400),()=>{for(let i=0;i<8;i++){const tb=t+i*bar,[r,ch]=CH[i%2];ch.forEach(m=>epiano(tb,m,beat*1.9,.75));ch.forEach(m=>epiano(tb+2.5*beat,m,beat*1.4,.6));[0,1.5,2.5,3.25].forEach((x,j)=>pluck(tb+x*beat,r-12+(j===3?7:0),"fb",{vol:1.05,mute:beat*.9}));}crackle(t,8*bar,.6);});
  for(let i=0;i<8;i++){bbBar(t+i*bar,beat,{swing:.16,ghost:true});if(i%2===1)scratch(t+i*bar+3*beat,.36,59);}return 8*bar+1;};
DEMOS.gfunk=t=>{const beat=bt(94),bar=4*beat,CH=[[43,[58,62,65,69]],[48,[58,63,67,70]]],W=[[[0,79,1.5],[1.5,77,.5],[2,74,2]],[[0,72,1],[1,74,1],[2,79,1],[3,77,1]]];
  for(let i=0;i<8;i++){const tb=t+i*bar,[r,ch]=CH[i%2];ch.forEach(m=>epiano(tb,m,beat*3.6,.6));
    [[0,r,1],[1,r,.5],[1.75,r+12,.25],[2,r+10,.5],[2.5,r+7,.5],[3,r+5,.5],[3.5,r+7,.5]].forEach(([x,m,d],j)=>synth(tb+x*beat,m-24,d*beat*.9,{vol:2.2,cut:200,open:700,waves:[["square",0],["sine",0]],from:j===1?m-26:null,glide:.06}));
    kick(tb,1.1);kick(tb+1.5*beat,.8);kick(tb+2.5*beat,.9);clap(tb+beat,.9);snare(tb+beat,.6);clap(tb+3*beat,.9);snare(tb+3*beat,.6);for(let k=0;k<16;k++)hat(tb+k*beat/4+(k%2?.025:0),k%2?.25:.5);
    if(i>=2)W[i%2].forEach(([x,m,d])=>synth(tb+x*beat,m,d*beat*.95,{vol:.9,cut:2400,open:3000,att:.08,waves:[["sine",0],["sine",3]],from:m-2,glide:.12}));}
  return 8*bar+1;};
/* 06 南方 */
const TR=[[33,[57,60,64]],[29,[57,60,65]],[31,[55,59,62]],[28,[55,59,64]]];
function trapLoop(t,beat,n,o={}){const bar=4*beat,tr=o.tr||0;for(let i=0;i<n;i++){const tb=t+i*bar,[r,ch]=TR[i%4];
    [0,.75,1.5].forEach((x,j)=>ch.forEach(m=>synth(tb+x*beat,m+12+tr,beat*.5,{vol:.5,cut:700,open:2600,att:.005,q:4,waves:[["triangle",0],["square",5]]})));
    b808(tb,r+tr,beat*1.4,{vol:1});b808(tb+1.75*beat,r+tr,beat*.6,{vol:.9});b808(tb+2.5*beat,r+7+tr,beat*1.3,{vol:.9,from:r+tr,glide:.1});
    kick(tb,.6);kick(tb+1.75*beat,.5);trapBar(tb,beat,{rolls:i%2?[6,7,14]:[14],crash:i===0?.5:0});}}
DEMOS.trap=t=>{const beat=bt(140);trapLoop(t,beat,8);return 32*beat+1;};
DEMOS.screw=t=>{const beat=bt(140*.68);through(lofiChain(2200),()=>{trapLoop(t,beat,2,{tr:-4});const b2=t+8*beat,bar=4*beat;for(let k=0;k<3;k++)trapLoop(b2+k*beat*1,beat,1,{tr:-4});trapLoop(b2+3*beat,beat,2,{tr:-4});});return 8*beat+3*beat+8*beat+1.5;};
DEMOS.drill=t=>{const beat=bt(142),bar=4*beat,s=beat/4;for(let i=0;i<8;i++){const tb=t+i*bar,[r,ch]=TR[(i*3)%4];strings(tb,ch.map(m=>m+12),4*beat,1.1);
    b808(tb,r,beat*1.2,{vol:1,to:r+5});b808(tb+1.5*beat,r+5,beat*.8,{vol:.9,to:r-2});b808(tb+2.75*beat,r+3,beat*1.1,{vol:.9,from:r+8,glide:.15});
    kick(tb,.6);clap(tb+8*s,1.1);snare(tb+8*s,.6);snare(tb+14*s,.7);if(i%2)snare(tb+11*s,.5);for(let k=0;k<12;k++)hat(tb+k*beat/3,k%3?.35:.6);if(i===0)crash(tb,.5);}
  return 8*bar+1;};
/* 07 世界 */
DEMOS.grime=t=>{const beat=bt(140),bar=4*beat,s=beat/4;for(let i=0;i<8;i++){const tb=t+i*bar;
    [[0,40,2],[3,40,1],[6,43,1],[8,38,2],[11,38,1],[14,45,2]].forEach(([k,m,d])=>synth(tb+k*s,m-12+(i%4===3?-2:0),d*s*.9,{vol:2.2,cut:500,open:1600,att:.003,q:3,waves:[["square",0]]}));
    kick(tb,1.1);kick(tb+6*s,.8);snare(tb+4*s,1);snare(tb+12*s,1);snare(tb+15*s,.5);for(let k=0;k<16;k+=2)hat(tb+k*s+(k%4?s*.15:0),.5);
    if(i>=2)[[2,[64,67,71]],[10,[62,67,71]]].forEach(([k,ch])=>ch.forEach(m=>synth(tb+k*s,m+12,s*1.4,{vol:.45,cut:3000,open:6000,att:.002,q:6,waves:[["square",0]]})));}
  return 8*bar+1;};
const ZHS=[[0,76],[1,74],[2,72],[3,74],[4,79],[5,76],[6,74],[7,72],[8,69],[9,72],[10,74],[11,76]];
DEMOS.cnflip=t=>{const beat=bt(88),bar=4*beat,h=beat/2;[60,62,64,67,69,72,74,76,79,81].forEach((m,i)=>pluck(t+i*.05,m,"zh",{vol:.9,dur:1.4}));const t0=t+1.2;
  through(lofiChain(5000),()=>{for(let i=0;i<8;i++){const tb=t0+i*bar,ord=i%2?[4,4,5,2,8,9,10,11]:[0,1,0,1,2,3,6,7];ord.forEach((ix,k)=>{const [,m]=ZHS[ix];pluck(tb+k*h,m+(i>=4&&k>=6?2:0),"zh",{vol:1.15,mute:h*.95,dur:.8,from:k%4===3?-2:0,glide:.1,hold:.02});});
      epiano(tb,57,beat*3.6,.6);epiano(tb,64,beat*3.6,.5);pluck(tb,33,"fb",{vol:1,mute:beat*1.5});pluck(tb+2.5*beat,31,"fb",{vol:.9,mute:beat*1.2});}crackle(t0,8*bar,.5);});
  for(let i=0;i<8;i++)bbBar(t0+i*bar,beat,{swing:.14,ghost:true});return 1.2+8*bar+1;};

/* ================= 调度 ================= */
const GAIN={"loop-off":1.3,"loop-on":1.6,scratch:1.6,"flow-a":1.5,"flow-b":1.5,"flow-c":1.5,"chop-orig":.65,"chop-loop":.6,"chop-flip":.9,"swing-off":1.7,"swing-on":1.7,breakfast:1.8,boombap:1.3,gfunk:.95,trap:.42,screw:.42,drill:.45,grime:1.5,cnflip:1.3};
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
function runDemo(name,btn){newBus();bus.gain.value=GAIN[name]||1;if(["chop-orig","gfunk","drill"].includes(name))addRoom(2,.3);setActive(btn);const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;later(()=>clearActive(),d+.4);}
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);
/* 小节标题的地铁线路标志 */
(()=>{const C=["#E2302A","#FFC400","#12B76A","#1D5BFF","#FF6319","#B933AD","#00A1DE","#6CBE45","#A7A9AC","#EE352E"];document.querySelectorAll("article h2 .n").forEach((n,i)=>{n.dataset.b=String(i+1);n.style.setProperty("--bc",C[i%C.length]);});})();

/* ================= 推荐曲目：HELLO 贴纸 ================= */
const SONGS=[
  {side:"A",q:"Sugarhill Gang Rapper's Delight",title:"Rapper's Delight",by:"The Sugarhill Gang",yr:"1979",style:"早期说唱",
   txt:"第一首全国性的说唱热门歌，十几分钟长。伴奏是录音室乐队重新演奏的一段迪斯科贝斯线。",listen:["贝斯线从哪里来？对照上一章","三位 MC 轮流说唱"]},
  {side:"A",q:"Grandmaster Flash The Message",title:"The Message",by:"Grandmaster Flash & the Furious Five",yr:"1982",style:"早期说唱 · 社会题材",
   txt:"第一首广为人知的“社会写实”说唱，描写纽约贫困街区的日常压力。说唱从派对喊话变成了讲故事。",listen:["节奏很慢，为什么？","和《Rapper's Delight》的题材比一比"]},
  {side:"A",q:"Run-DMC Walk This Way Aerosmith",title:"Walk This Way",by:"Run-DMC × Aerosmith",yr:"1986",style:"说唱 × 摇滚",
   txt:"嘻哈和硬摇滚的握手。开头就是一段被 DJ 反复接起来的 break，对照 Lab 01。",listen:["开头的 break 和搓碟","摇滚吉他什么时候进来？"]},
  {side:"A",q:"Public Enemy Fight the Power",title:"Fight the Power",by:"Public Enemy",yr:"1989",style:"政治说唱",
   txt:"为电影《为所应为》（Do the Right Thing）录制。几十个采样叠成一堵嘈杂的“声墙”，是采样授权收紧之前的典型制作。",listen:["你能数出几层声音？","和 Lab 03 的“循环”比一比"]},
  {side:"A",q:"A Tribe Called Quest Can I Kick It",title:"Can I Kick It?",by:"A Tribe Called Quest",yr:"1990",style:"爵士说唱",
   txt:"开头的贝斯线来自一首 1970 年代摇滚老歌的采样。温和、松弛、聪明，是“爵士说唱”的代表。",listen:["贝斯线循环了多少次？","鼓是 boom bap 吗？对照 Lab 05"]},
  {side:"A",q:"Nas N.Y. State of Mind",title:"N.Y. State of Mind",by:"Nas",yr:"1994",style:"东岸 boom bap",
   txt:"专辑《Illmatic》的一首，阴暗的钢琴采样和密集的押韵，常被列为史上最好的说唱专辑之一。",listen:["钢琴的循环","句子里的内韵和多音节韵"]},
  {side:"B",q:"Lauryn Hill Doo Wop That Thing",title:"Doo Wop (That Thing)",by:"Lauryn Hill",yr:"1998",style:"说唱 × 灵魂乐",
   txt:"把 1960 年代的灵魂乐和声与说唱结合。它所在的专辑是第一张获得格莱美年度专辑的嘻哈专辑。",listen:["铜管和合唱像上一章的哪种音乐？","说唱和唱歌怎样交替"]},
  {side:"B",q:"OutKast Ms. Jackson",title:"Ms. Jackson",by:"OutKast",yr:"2000",style:"南方说唱",
   txt:"来自亚特兰大的二人组，把南方嘻哈带到了全国。旋律性很强，混合了灵魂乐、放克和流行。",listen:["副歌是唱的还是说的？","和纽约的 boom bap 比，节奏感有什么不同？"]},
  {side:"B",q:"Eminem Lose Yourself",title:"Lose Yourself",by:"Eminem",yr:"2002",style:"说唱",
   txt:"电影《8 英里》的主题曲，第一首获得奥斯卡最佳原创歌曲的说唱歌曲。flow 密集、押韵复杂。",listen:["数一数某一句里的韵脚","钢琴和吉他的循环"]},
  {side:"B",q:"Migos Bad and Boujee",title:"Bad and Boujee",by:"Migos",yr:"2016",style:"trap",
   txt:"三连音 flow 的代表作之一，阴郁的 trap 伴奏。2017 年初登上美国单曲榜第一。",listen:["跟着说唱数“1-2-3”，对照 Lab 02","踩镲的连音"]},
  {side:"B",q:"Kendrick Lamar HUMBLE.",title:"HUMBLE.",by:"Kendrick Lamar",yr:"2017",style:"说唱",
   txt:"简单而有力的钢琴 riff 和重低音。所在的专辑《DAMN.》获得了 2018 年普利策音乐奖。",listen:["钢琴只有几个音？","beat 什么时候突然停下？"]},
  {side:"B",q:"Higher Brothers Made in China",title:"Made in China",by:"Higher Brothers",yr:"2017",style:"中文说唱 · trap",
   txt:"成都组合，用四川话、普通话和英语说唱，trap 伴奏。他们是最早在海外拥有大量听众的中文说唱团体之一。",listen:["不同语言的押韵方式","对照 Lab 06 的 trap"]}
];
const HC=["#E2302A","#1D5BFF","#12B76A","#FF6319","#B933AD","#141414"];
const ICON="M8 5v14l11-7z";
SONGS.forEach((s,i)=>{
  const el=document.createElement("div");el.className="song";el.style.setProperty("--hc",HC[i%HC.length]);
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<span class="hello" aria-hidden="true">HELLO<small>my name is</small></span><div class="meta"><span class="by">${s.by}</span><span class="title">${s.title}</span><div class="pmeta"><span class="yr">${s.yr}</span><span class="style">${s.style}</span></div></div>
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
function box(g,x,y,w,h,c,rx=8){S(g,"rect",{x,y,width:w,height:h,rx,style:c?FILL(c):"",class:c?"":"sv-card"});S(g,"rect",{x,y,width:w,height:h,rx,class:"sv-l","stroke-width":2,fill:"none"});}
/* 图 1 四大元素 */
(()=>{const g=document.getElementById("four-fig");if(!g)return;const E=[["DJ","打碟 · 唱机变乐器","red",40,30],["MC","说唱 · 节拍上的语言","denim",380,30],["BREAKING","地板舞 · 在 break 里跳","mustard",40,170],["GRAFFITI","涂鸦 · 墙上的签名","ink",380,170]];
  E.forEach(([a,b,c,x,y])=>{box(g,x,y,260,100,c,12);S(g,"text",{x:x+20,y:y+46,class:c==="mustard"?"sv-t":"sv-on",style:"font-family:var(--font-wood);font-size:24px"},a);S(g,"text",{x:x+20,y:y+76,class:c==="mustard"?"sv-t":"sv-on",style:"font-size:14px;font-weight:700"},b);});
  S(g,"circle",{cx:340,cy:150,r:52,class:"sv-card"});S(g,"circle",{cx:340,cy:150,r:52,class:"sv-l","stroke-width":2.5,fill:"none"});S(g,"text",{x:340,y:146,"text-anchor":"middle",class:"sv-t",style:"font-size:15px;font-weight:900"},"知识");S(g,"text",{x:340,y:166,"text-anchor":"middle",class:"sv-m",style:"font-size:11px"},"第五元素");
})();
/* 图 2 两台唱机 */
(()=>{const g=document.getElementById("deck-fig");if(!g)return;const x0=110,w=66;
  S(g,"text",{x:20,y:56,class:"sv-t",style:TB},"唱机 A");S(g,"text",{x:20,y:116,class:"sv-t",style:TB},"唱机 B");S(g,"text",{x:20,y:206,class:"sv-t",style:TB},"观众听到");
  for(let i=0;i<8;i++){const x=x0+i*w,a=i%2===0;box(g,x,36,w-6,32,a?"red":null,6);box(g,x,96,w-6,32,a?null:"denim",6);S(g,"text",{x:x+(w-6)/2,y:57,"text-anchor":"middle",class:a?"sv-on":"sv-m",style:"font-size:11px;font-weight:700"},a?"break":"倒回");S(g,"text",{x:x+(w-6)/2,y:117,"text-anchor":"middle",class:a?"sv-m":"sv-on",style:"font-size:11px;font-weight:700"},a?"倒回":"break");
    box(g,x,186,w-6,32,a?"red":"denim",6);}
  S(g,"path",{d:`M ${x0} 160 L ${x0+8*w-6} 160`,class:"sv-l","stroke-width":2,"stroke-dasharray":"4 4"});S(g,"text",{x:x0+8*w-6,y:244,"text-anchor":"end",class:"sv-ts"},"两小节的鼓 → 无限长");
})();
/* 图 3 flow */
(()=>{const g=document.getElementById("flow-fig");if(!g)return;const x0=150,W=480;
  const R=[["规整",FLOWS.a],["三连音",FLOWS.b],["切分",FLOWS.c]];
  R.forEach(([n,ev],r)=>{const y=40+r*96;S(g,"text",{x:20,y:y+30,class:"sv-t",style:TB},n);
    const div=r===1?12:16;for(let k=0;k<div;k++){S(g,"rect",{x:x0+k*W/div+1,y,width:W/div-2,height:48,rx:4,class:"sv-card"});S(g,"rect",{x:x0+k*W/div+1,y,width:W/div-2,height:48,rx:4,class:"sv-lline"});}
    for(let q=1;q<4;q++)S(g,"line",{x1:x0+q*W/4,y1:y-6,x2:x0+q*W/4,y2:y+54,class:"sv-l","stroke-width":2});
    ev.forEach(([b,acc])=>{S(g,"circle",{cx:x0+b/4*W+W/div/2,cy:y+24,r:acc?11:8,style:FILL(acc===2?"mustard":acc?"red":"ink")});});});
  [1,2,3,4].forEach(q=>S(g,"text",{x:x0+(q-1)*W/4+6,y:30,class:"sv-m",style:"font-size:11px"},`第 ${q} 拍`));
})();
/* 图 4 押韵 */
(()=>{const g=document.getElementById("rhyme-fig");if(!g)return;const L=[["我在地铁的尽头 数着路过的灯光",1],["耳机里的鼓点 是我唯一的方向",1],["把没说出口的话 写进这段节拍上",1],["押着同一个韵脚 一路走到天亮",1],["别管昨天有多少迷茫",2],["抬头看看眼里的光芒",2]];
  L.forEach(([s,n],i)=>{const y=40+i*44+(i>=4?22:0),chars=[...s],fs=19;let x=40;chars.forEach((c,j)=>{const hot=j>=chars.length-n;if(c===" "){x+=10;return;}if(hot)S(g,"rect",{x:x-2,y:y-19,width:fs+4,height:26,rx:5,style:FILL(n===2?"denim":"red")});S(g,"text",{x,y,class:hot?"sv-on":"sv-t",style:`font-size:${fs}px;font-weight:${hot?900:500}`},c);x+=fs+1;});});
  S(g,"text",{x:520,y:110,class:"sv-r",style:"font-size:14px;font-weight:900"},"单押：ang");S(g,"text",{x:520,y:130,class:"sv-m"},"光 向 上 亮");
  S(g,"text",{x:520,y:268,style:FILL("denim")+";font-size:14px;font-weight:900"},"双押：ang ang");S(g,"text",{x:520,y:288,class:"sv-m"},"迷茫 / 光芒");
})();
/* 图 5 切片 */
(()=>{const g=document.getElementById("chop-fig");if(!g)return;const x0=60,W=560,n=8,cols=["red","mustard","denim","ink","red","mustard","denim","ink"];let seed=3;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const wave=[];for(let i=0;i<160;i++)wave.push(.25+rnd()*.75*Math.abs(Math.sin(i/9)));
  const drawSlice=(x,y,idx,w,tr)=>{box(g,x,y,w-4,60,null,6);for(let k=0;k<20;k++){const v=wave[idx*20+k]*(tr?.8:1),h=v*44;S(g,"rect",{x:x+4+k*(w-12)/20,y:y+30-h/2,width:(w-12)/20-1,height:h,style:FILL(cols[idx]),opacity:.85});}S(g,"text",{x:x+8,y:y+16,class:"sv-t",style:"font-size:12px;font-weight:900"},String(idx+1));};
  S(g,"text",{x:x0,y:24,class:"sv-t",style:TB},"原唱片");for(let i=0;i<n;i++)drawSlice(x0+i*W/n,34,i,W/n);
  S(g,"text",{x:x0,y:140,class:"sv-t",style:TB},"重新排列");[2,2,0,3,6,6,1,7].forEach((ix,i)=>drawSlice(x0+i*W/n,150,ix,W/n,i===6));
  S(g,"text",{x:x0,y:248,class:"sv-ts"},"3 被重复，7 被重复，2 被调高了音，4、5 没用上");
})();
/* 图 6 摇摆 */
(()=>{const g=document.getElementById("swing-fig");if(!g)return;const x0=130,W=500;[["对齐",0],["摇摆",.32]].forEach(([n,sw],r)=>{const y=50+r*80;S(g,"text",{x:20,y:y+6,class:"sv-t",style:TB},n);S(g,"line",{x1:x0,y1:y,x2:x0+W,y2:y,class:"sv-lline"});
  for(let k=0;k<=16;k++)S(g,"line",{x1:x0+k*W/16,y1:y-14,x2:x0+k*W/16,y2:y+14,class:"sv-lline"});for(let k=0;k<16;k++){const x=x0+(k+(k%2?sw:0))*W/16;S(g,"circle",{cx:x,cy:y,r:k%4===0?10:7,style:FILL(k%2&&sw?"red":"ink")});}});
  S(g,"text",{x:x0,y:200,class:"sv-ts"},"红点：被往后推的十六分音符");})();
/* 图 7 版权案件 */
(()=>{const g=document.getElementById("law-fig");if(!g)return;const C=[["1991",["Grand Upright Music","v. Warner Bros."],"纽约南区联邦地区法院",["未经许可采样一首老歌的","录音和旋律，被判侵权"],["判决书第一句：","“不可偷盗。”"],"red"],
  ["2005",["Bridgeport Music","v. Dimension Films"],"第六巡回上诉法院",["采样一段约 2 秒的吉他和弦，","也构成对录音的侵权"],["“要么取得许可，","要么不要采样。”"],"mustard"],
  ["2016",["VMG Salsoul","v. Ciccone"],"第九巡回上诉法院",["约 0.23 秒的铜管音被认为","“微不足道”，不构成侵权"],["与第六巡回的立场相反"],"denim"]];
  C.forEach(([y,n,ct,h,q,c],i)=>{const x=20+i*218;box(g,x,20,206,280,null,10);S(g,"rect",{x,y:20,width:206,height:46,rx:10,style:FILL(c)});S(g,"rect",{x,y:50,width:206,height:16,style:FILL(c)});S(g,"text",{x:x+14,y:52,style:`fill:${c==="mustard"?"#141414":"#fff"};font-family:var(--font-wood);font-size:22px`},y);
    let yy=90;n.forEach(l=>{S(g,"text",{x:x+14,y:yy,class:"sv-t",style:"font-size:13px;font-weight:900"},l);yy+=17;});S(g,"text",{x:x+14,y:yy+4,class:"sv-m",style:"font-size:11px"},ct);yy+=32;
    h.forEach(l=>{S(g,"text",{x:x+14,y:yy,class:"sv-t",style:"font-size:12.5px"},l);yy+=20;});yy+=10;q.forEach(l=>{S(g,"text",{x:x+14,y:yy,class:"sv-r",style:"font-size:13px;font-weight:700"},l);yy+=20;});});
})();
/* 图 8 速度地图 */
(()=>{const g=document.getElementById("bpm-fig");if(!g)return;const X=b=>150+(b-50)*4.6;const R=[["Chopped & Screwed",60,75,"ink"],["Boom bap",85,95,"red"],["G-funk",90,100,"mustard"],["Trap（听起来半速）",130,150,"denim"],["Drill",140,145,"denim"],["Grime",138,142,"red"]];
  [60,80,100,120,140,160].forEach(b=>{S(g,"line",{x1:X(b),y1:20,x2:X(b),y2:262,class:"sv-lline"});S(g,"text",{x:X(b),y:282,"text-anchor":"middle",class:"sv-m",style:"font-size:11px"},String(b));});
  R.forEach(([n,a,b,c],i)=>{const y=30+i*38;S(g,"text",{x:140,y:y+17,"text-anchor":"end",class:"sv-t",style:"font-size:12.5px;font-weight:700"},n);S(g,"rect",{x:X(a),y,width:Math.max(10,X(b)-X(a)),height:24,rx:12,style:FILL(c)});if(i===3){S(g,"rect",{x:X(a/2),y,width:X(b/2)-X(a/2),height:24,rx:12,style:FILL(c),opacity:.3});S(g,"text",{x:X(b/2)+8,y:y+17,class:"sv-m",style:"font-size:11px"},"← 感觉上");}});
  S(g,"text",{x:660,y:282,"text-anchor":"end",class:"sv-ts"},"BPM");
})();
/* 外部照片 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`照片待放入：${img.getAttribute("src")}<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张照片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
