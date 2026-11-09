/* ================= 另类：乐器与效果 ================= */
Object.assign(INST,{
  cl:{bright:.72,decay:.9988,dur:2.4,vol:.34,lp:4200},
  cj:{bright:.92,decay:.9988,dur:2,vol:.24,lp:7000,peak:[3200,4]},
  bh:{bright:.62,decay:.997,dur:1,vol:.62,drive:1.6,lp:2600},
  bs2:{bright:.32,decay:.996,dur:1.2,vol:.78,drive:1.4,lp:1000},
  gd:{bright:.86,decay:.999,dur:1.8,vol:.1,drive:20,lp:2500,peak:[420,4]},
  dm:{bright:.9,decay:.9993,dur:3,vol:.09,drive:32,lp:2000,peak:[300,5]},
  fz:{bright:.92,decay:.999,dur:1.6,vol:.09,drive:34,lp:3200},
  sw:{bright:.8,decay:.9994,dur:3,vol:.06,drive:22,lp:2300}
});
/* 带音高摇晃的拨弦（盯鞋、卧室流行的磁带感） */
function gpluck(t,midi,inst,o,lfoG){const a=A(),I=INST[inst],s=a.createBufferSource();s.buffer=ksBuf(midi,o.dur||I.dur,I.bright,I.decay);if(o.det)s.playbackRate.value=Math.pow(2,o.det/1200);if(lfoG)lfoG.forEach(l=>l.connect(s.playbackRate));
  const g=a.createGain();g.gain.value=(o.vol||1)*I.vol;let node=g;s.connect(g);
  if(I.drive){const sh=a.createWaveShaper();sh.curve=shaper(I.drive);node.connect(sh);node=sh;}if(I.lp){const f=a.createBiquadFilter();f.type="lowpass";f.frequency.value=I.lp;node.connect(f);node=f;}
  if(o.swell){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((o.vol||1)*I.vol,t+o.swell);}if(o.mute){g.gain.setValueAtTime((o.vol||1)*I.vol,t);g.gain.exponentialRampToValueAtTime(.001,t+o.mute);}
  node.connect(bus);s.start(t);s.stop(t+(o.dur||I.dur));track(s);}
function wobble(t,dur,rate,depth){const a=A(),l=a.createOscillator(),g=a.createGain();l.frequency.value=rate;g.gain.value=depth;l.connect(g);l.start(t);l.stop(t+dur);track(l);return g;}
function chorusChain(t,dur,depth=.0035,rate=.8){const a=A(),inp=a.createGain(),out=a.createGain(),d=a.createDelay(.05);d.delayTime.value=.016;const l=a.createOscillator(),lg=a.createGain();l.frequency.value=rate;lg.gain.value=depth;l.connect(lg).connect(d.delayTime);l.start(t);l.stop(t+dur);track(l);
  const wet=a.createGain();wet.gain.value=.8;const pan=a.createStereoPanner();pan.pan.value=.45;inp.connect(out);inp.connect(d).connect(wet).connect(pan).connect(out);return [inp,out];}
function delayChain(time,fb=.4,mix=.45){const a=A(),inp=a.createGain(),out=a.createGain(),d=a.createDelay(2);d.delayTime.value=time;const f=a.createGain();f.gain.value=fb;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=2800;const w=a.createGain();w.gain.value=mix;
  inp.connect(out);inp.connect(d);d.connect(lp).connect(f).connect(d);d.connect(w).connect(out);return [inp,out];}
function lofi(hp=120,lp=3400,drv=1.8){const a=A(),inp=a.createGain(),h=a.createBiquadFilter();h.type="highpass";h.frequency.value=hp;const l=a.createBiquadFilter();l.type="lowpass";l.frequency.value=lp;const sh=a.createWaveShaper();sh.curve=shaper(drv);const out=a.createGain();out.gain.value=.8;inp.connect(h).connect(l).connect(sh).connect(out);return [inp,out];}
function synth(t,midi,dur,o={}){const a=A(),f=mf(midi),g=a.createGain(),v=(o.vol||1)*.05,lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=o.q||2;lp.frequency.setValueAtTime(o.cut||900,t);lp.frequency.linearRampToValueAtTime(o.open||2600,t+(o.att||.08));lp.frequency.exponentialRampToValueAtTime(o.cut||900,t+Math.max(.2,dur));
  (o.waves||[["sawtooth",-8],["sawtooth",8]]).forEach(([w,dt])=>{const x=a.createOscillator();x.type=w;x.frequency.value=f;x.detune.value=dt;x.connect(lp);x.start(t);x.stop(t+dur+.06);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(o.att||.01));g.gain.setValueAtTime(v,t+dur-.05);g.gain.linearRampToValueAtTime(0,t+dur);lp.connect(g).connect(bus);}
function piano(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain();[[1,.6,"triangle"],[2,.25,"sine"],[3,.08,"sine"]].forEach(([h,am,w])=>{const x=a.createOscillator();x.type=w;x.frequency.value=f*h;const xg=a.createGain();xg.gain.value=am;x.connect(xg).connect(g);x.start(t);x.stop(t+dur+.1);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*v,t+.005);g.gain.exponentialRampToValueAtTime(.03*v,t+.4);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);g.connect(bus);}
function epiano(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain();const x=a.createOscillator();x.type="sine";x.frequency.value=f;const m=a.createOscillator();m.frequency.value=f*2;const mg=a.createGain();mg.gain.setValueAtTime(f*1.2,t);mg.gain.exponentialRampToValueAtTime(f*.1,t+.5);m.connect(mg).connect(x.frequency);x.connect(g);[x,m].forEach(o=>{o.start(t);o.stop(t+dur+.1);track(o);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.13*v,t+.006);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);g.connect(bus);}
function tamb(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=8500;f.Q.value=1.5;const g=a.createGain();g.gain.setValueAtTime(.2*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+.13);track(n);}
function trumpet(t,midi,dur,o={}){const a=A(),f=mf(midi),x=a.createOscillator();x.type="sawtooth";x.frequency.setValueAtTime(f*Math.pow(2,(o.from||-.4)/12),t);x.frequency.linearRampToValueAtTime(f,t+.07);
  const l=a.createOscillator(),lg=a.createGain();l.frequency.value=5.2;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(14,t+Math.min(.5,dur));l.connect(lg).connect(x.detune);
  const lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=1.5;lp.frequency.setValueAtTime(500,t);lp.frequency.linearRampToValueAtTime(2600,t+.12);lp.frequency.linearRampToValueAtTime(1900,t+dur);
  const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=1300;pk.gain.value=6;const g=a.createGain(),v=(o.vol||1)*.12;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.06);g.gain.setValueAtTime(v*.9,t+dur-.1);g.gain.linearRampToValueAtTime(0,t+dur);
  x.connect(lp).connect(pk).connect(g).connect(bus);[x,l].forEach(o=>{o.start(t);o.stop(t+dur+.05);track(o);});}
function staticNoise(t,dur){const a=A(),n=a.createBufferSource();n.buffer=noise();n.loop=true;const f=a.createBiquadFilter();f.type="bandpass";f.Q.value=2;f.frequency.setValueAtTime(800,t);f.frequency.exponentialRampToValueAtTime(5000,t+dur*.5);f.frequency.exponentialRampToValueAtTime(1500,t+dur);const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+.05);g.gain.setValueAtTime(.35,t+dur-.1);g.gain.linearRampToValueAtTime(0,t+dur);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+dur+.05);track(n);
  for(let i=0;i<5;i++){const o=a.createOscillator();o.frequency.value=600+Math.random()*1800;const og=a.createGain();const s=t+Math.random()*dur*.8;og.gain.setValueAtTime(0,s);og.gain.linearRampToValueAtTime(.03,s+.05);og.gain.linearRampToValueAtTime(0,s+.25);o.connect(og).connect(bus);o.start(s);o.stop(s+.3);track(o);}}
function plainBeat(tb,beat,o={}){for(let k=0;k<8;k++)hat(tb+k*beat/2,(k%2?.45:.8)*(o.hv||1));kick(tb,o.kv||1);kick(tb+2*beat,o.kv||1);if(o.push)kick(tb+2.5*beat,.7*(o.kv||1));snare(tb+beat,o.sv||1);snare(tb+3*beat,o.sv||1);if(o.crash)crash(tb,o.crash);}

const DEMOS={};
/* 01 收音机 */
DEMOS.radio=t=>{staticNoise(t,1.8);
  const b1=bt(118),t1=t+1.8,P=[[48,[60,64,67]],[43,[59,62,67]],[45,[60,64,69]],[41,[60,65,69]]];
  P.forEach(([r,ch],i)=>{const tb=t1+i*4*b1;ch.forEach(m=>synth(tb,m+12,4*b1*.98,{vol:.7,cut:1400,open:3200,att:.2}));for(let k=0;k<8;k++)synth(tb+k*b1/2,r-12,b1*.42,{vol:1.1,cut:300,open:1400,att:.01});
    for(let k=0;k<8;k++)hat(tb+k*b1/2,.6);kick(tb);kick(tb+2*b1);through(gatedChain(),()=>{snare(tb+b1,1.3);snare(tb+3*b1,1.3);});clap(tb+b1,.6);clap(tb+3*b1,.6);
    [[0,72],[1,74],[1.5,76],[2,79],[3,76]].forEach(([b,m])=>synth(tb+b*b1,m+(i%2?-3:0),b1*.45,{vol:.5,cut:2000,open:5000,waves:[["square",0],["sawtooth",5]]}));});
  const t2=t1+16*b1;staticNoise(t2,1.2);
  const b2=bt(132),t3=t2+1.2,J=[[43,[55,59,62,67,71,67,62,59]],[38,[50,57,62,66,69,66,62,57]],[40,[52,59,64,67,71,67,64,59]],[36,[48,55,60,64,67,64,60,55]]];
  through(lofi(220,3000,2.2),()=>{J.forEach(([r,ar],i)=>{const tb=t3+i*4*b2;ar.forEach((m,k)=>pluck(tb+k*b2/2,m,"cj",{vol:.75,dur:1.3}));pluck(tb,r,"bs2",{vol:.55,mute:b2*1.6});pluck(tb+2*b2,r,"bs2",{vol:.55,mute:b2*1.6});plainBeat(tb,b2,{hv:.45,kv:.5,sv:.5});});});
  return 1.8+16*b1+1.2+16*b2+1;};
/* 02 后朋克 */
const PPB=[[50,[62,null,60,62,65,null,64,62]],[46,[58,null,57,58,62,null,60,58]],[41,[57,null,55,57,60,null,62,60]],[48,[55,null,57,60,64,null,62,60]]];
const PPG=[[74,77],[74,77],[72,76],[72,79]];
function ppDemo(t,lvl){const beat=bt(132),bars=8;
  for(let b=0;b<bars;b++){const tb=t+b*4*beat,[r,mel]=PPB[b%4];
    mel.forEach((m,k)=>{if(m!=null){const len=mel[k+1]===null?beat*.95:beat*.46;pluck(tb+k*beat/2,m-12,"bh",{vol:1.1,mute:len});}});
    for(let k=0;k<8;k++)hat(tb+k*beat/2,.55);kick(tb,.9);kick(tb+2*beat,.9);snare(tb+beat,.85);snare(tb+3*beat,.85);
    if(lvl>=1)through(chorusChain(tb,4*beat+2.6,.004,.9),()=>{const [x,y]=PPG[b%4];pluck(tb,x,"cl",{vol:.85,dur:2.4});pluck(tb+.012,y,"cl",{vol:.7,dur:2.4});pluck(tb+2.5*beat,y+(b%2?2:0),"cl",{vol:.6,dur:2});});
    if(lvl>=2){synth(tb,r+12,4*beat*.99,{vol:.45,cut:700,open:1100,att:.4,waves:[["square",0],["sawtooth",7]]});if(b%2===0)voice(tb+.5*beat,r+12,beat*3.2,{vowel:"o",vol:.45,vibDepth:6,from:0});else voice(tb+.5*beat,r+12+(b%4===3?-2:0),beat*1.4,{vowel:"o",vol:.4,vibDepth:6,from:0});}}
  return bars*4*beat+1.6;}
DEMOS["pp-bass"]=t=>ppDemo(t,0);DEMOS["pp-gtr"]=t=>ppDemo(t,1);DEMOS["pp-full"]=t=>ppDemo(t,2);
/* 03 叮当 */
const JG=[[43,[55,59,62,67,71,67,62,59]],[38,[50,57,62,66,69,66,62,57]],[40,[52,59,64,67,71,67,64,59]],[36,[48,55,60,64,67,64,60,55]]];
function jangle(t,twelve){const beat=bt(126),bars=8;
  const play=()=>{for(let b=0;b<bars;b++){const tb=t+b*4*beat,[,ar]=JG[b%4];ar.forEach((m,k)=>{const tt=tb+k*beat/2;
      if(twelve){pluck(tt,m,"cj",{vol:1,dur:1.4});if(m<64)pluck(tt+.007,m+12,"cj",{vol:.75,dur:1.2,det:4});else pluck(tt+.006,m,"cj",{vol:.8,dur:1.3,det:7});}
      else pluck(tt,m,"cl",{vol:1.1,dur:1.4});});}};
  if(twelve)through(chorusChain(t,bars*4*beat+2,.003,1.1),play);else play();
  for(let b=0;b<bars;b++){const tb=t+b*4*beat,[r]=JG[b%4];for(let k=0;k<4;k++)pluck(tb+k*beat,r,"bs2",{vol:.8,mute:beat*.9});plainBeat(tb,beat,{hv:.6,kv:.7,sv:.7});}
  return bars*4*beat+1.4;}
DEMOS["jangle-6"]=t=>jangle(t,false);DEMOS["jangle-12"]=t=>jangle(t,true);
/* 04 大小声 */
const DYN=[41,49,44,39];
function quietBar(tb,beat,r){const R=r<40?r+12:r;[0,7,12,15,12,7,0,7].forEach((iv,k)=>pluck(tb+k*beat/2,R+iv+12,"cl",{vol:.75,dur:1.6}));pluck(tb,r,"bs2",{vol:.75,mute:beat*1.8});pluck(tb+2*beat,r,"bs2",{vol:.65,mute:beat*1.8});for(let q=0;q<4;q++)hat(tb+q*beat,.35);kick(tb,.5);snare(tb+2*beat,.35,true);}
function loudBar(tb,beat,r,first){const R=r<40?r+12:r;for(let k=0;k<8;k++){strum(tb+k*beat/2,[R,R+7,R+12],"gd",{vol:1.15,mute:beat*.48,spread:.004});pluck(tb+k*beat/2,r,"bs2",{vol:1,mute:beat*.45});}plainBeat(tb,beat,{kv:1.25,sv:1.4,hv:1.1,push:true,crash:first?1:.5});}
function fill(tb,beat){for(let k=0;k<4;k++)snare(tb+3*beat+k*beat/4,.5+k*.2);}
DEMOS["dyn-quiet"]=t=>{const beat=bt(116);for(let b=0;b<4;b++)quietBar(t+b*4*beat,beat,DYN[b]);return 16*beat+1.4;};
DEMOS["dyn-loud"]=t=>{const beat=bt(116);for(let b=0;b<4;b++)loudBar(t+b*4*beat,beat,DYN[b],b===0);const e=t+16*beat;strum(e,[41,48,53],"gd",{vol:1.2,dur:2});crash(e);kick(e);return 16*beat+2.2;};
DEMOS["dyn-full"]=t=>{const beat=bt(116);for(let s=0;s<4;s++)for(let b=0;b<2;b++){const tb=t+(s*2+b)*4*beat,r=DYN[(s*2+b)%4];if(s%2===0){quietBar(tb,beat,r);if(b===1)fill(tb,beat);}else loudBar(tb,beat,r,b===0);}
  const e=t+32*beat;strum(e,[41,48,53],"gd",{vol:1.2,dur:2});crash(e);kick(e);return 32*beat+2.2;};
/* 05 调弦与音墙 */
DEMOS["tune-std"]=t=>{const S=[40,45,50,55,59,64];strum(t,S,"cl",{vol:1,dur:3,spread:.035});strum(t+3.2,S,"cl",{vol:1,dur:3,spread:.035});return 6.6;};
DEMOS["tune-alt"]=t=>{const S=[40,52,47,59,64,64],D=[4,-3,6,-5,3,-6];const st=(tt,ns)=>ns.forEach((m,k)=>pluck(tt+k*.035,m,"cl",{vol:1,dur:3.4,det:D[k]}));
  st(t,S);st(t+3.4,[40,52,47+5,59+5,64,64]);st(t+6.8,S);return 10.4;};
DEMOS.shoe=t=>{const beat=bt(92),bars=8,CH=[[47,[59,63,66,71,73]],[40,[56,59,64,68,71]],[44,[56,59,63,68,71]],[40,[56,59,64,66,71]]],dur=bars*4*beat+3;
  const lf=[wobble(t,dur,.55,.018),wobble(t,dur,4.5,.002)];
  through(lofi(90,2600,1.5),()=>{for(let b=0;b<bars;b++){const tb=t+b*4*beat,[r,ch]=CH[b%4];
      for(let k=0;k<8;k++)ch.forEach((m,i)=>{gpluck(tb+k*beat/2+i*.006,m-12,"sw",{vol:.8,dur:1.4,det:(i%2?7:-7)},lf);gpluck(tb+k*beat/2+i*.008,m,"sw",{vol:.5,dur:1.4,det:(i%2?-5:5)},lf);});
      const rv=revPluck(tb+4*beat-1.6,ch[3],"cl",1.6);pluck(tb,r-12,"bs2",{vol:.9,dur:4*beat});
      for(let k=0;k<8;k++)hat(tb+k*beat/2,.35);kick(tb,.8);kick(tb+2*beat,.8);snare(tb+beat,.7);snare(tb+3*beat,.7);if(b%4===0)crash(tb,.6);
      [[0,71,2],[2,68,2]].forEach(([x,m,d])=>voice(tb+x*beat,m-(b%2?3:0),d*beat*.95,{vowel:"o",vol:.18,vibDepth:8,from:-.5}));}});
  return dur;};
/* 06 垃圾摇滚 */
const GR=[[0,38,.5],[.5,38,.5],[1,41,1],[2,43,.5],[2.5,41,.5],[3,38,1],[4,38,.5],[4.5,38,.5],[5,46,1],[6,45,1],[7,38,1]];
function grRiff(t,beat,inst,o={}){GR.forEach(([b,r,d])=>{const tt=t+b*beat,len=d*beat*(o.leg||.9);if(o.eighths&&d>.5){for(let k=0;k<d*2;k++){strum(tt+k*beat/2,[r,r+7,r+12],inst,{vol:o.vol||1,mute:beat*.45,spread:.004});pluck(tt+k*beat/2,r-12,"bs2",{vol:.95,mute:beat*.45});}}
  else{strum(tt,[r,r+7,r+12],inst,{vol:o.vol||1,mute:len,spread:o.spread||.004,dur:o.dur});pluck(tt,r-12,"bs2",{vol:1,mute:len,dur:o.dur});}});}
DEMOS["gr-punk"]=t=>{const beat=bt(184);for(let c=0;c<4;c++){const tb=t+c*8*beat;grRiff(tb,beat,"gd",{eighths:true,vol:1});for(let b=0;b<2;b++)plainBeat(tb+b*4*beat,beat,{kv:1.1,sv:1.2,push:true,crash:b===0&&c%2===0?.8:0});}
  const e=t+32*beat;strum(e,[38,45,50],"gd",{dur:2});crash(e);kick(e);return 32*beat+2.2;};
DEMOS["gr-doom"]=t=>{const beat=bt(58);for(let c=0;c<2;c++){const tb=t+c*8*beat;grRiff(tb,beat,"dm",{leg:1,dur:3,spread:.02,vol:1.1});for(let b=0;b<2;b++){const x=tb+b*4*beat;kick(x,1.2);snare(x+2*beat,1.3);crash(x,.7);for(let q=0;q<4;q++)hat(x+q*beat,.6);}}
  return 16*beat+2.5;};
DEMOS["gr-mix"]=t=>{const beat=bt(100);
  const t0=t;GR.forEach(([b,r,d])=>{pluck(t0+b*beat,r+12,"cl",{vol:1.7,dur:1.4,mute:d*beat*.95});pluck(t0+b*beat,r-12,"bs2",{vol:1.15,mute:d*beat*.9});});GR.forEach(([b,r,d])=>{pluck(t0+8*beat+b*beat,r+12,"cl",{vol:1.7,dur:1.4,mute:d*beat*.95});pluck(t0+8*beat+b*beat,r-12,"bs2",{vol:1.15,mute:d*beat*.9});});
  for(let b=0;b<4;b++){const tb=t0+b*4*beat;for(let q=0;q<4;q++)hat(tb+q*beat,.45);kick(tb,.6);snare(tb+2*beat,.45,true);}fill(t0+12*beat,beat);
  const t1=t0+16*beat;for(let c=0;c<2;c++){const tb=t1+c*8*beat;grRiff(tb,beat,"gd",{eighths:true,vol:1.15});for(let b=0;b<2;b++)plainBeat(tb+b*4*beat,beat,{kv:1.3,sv:1.4,push:true,crash:b===0?1:.5});}
  const e=t1+16*beat;strum(e,[38,45,50],"gd",{vol:1.2,dur:2.2});crash(e);kick(e);return 32*beat+2.4;};
/* 07 英国 */
DEMOS.brit=t=>{const beat=bt(120),CH=[[43,[55,59,62,67]],[47,[54,59,63,66]],[48,[55,60,64,67]],[48,[55,60,63,67]],[43,[55,59,62,67]],[40,[55,59,64,67]],[45,[57,61,64,69]],[50,[57,62,66,69]]];
  CH.forEach(([r,ch],b)=>{const tb=t+b*4*beat;[0,1,2,3].forEach(q=>ch.forEach(m=>piano(tb+q*beat,m,beat*.9,.75)));[0,.5,1.5,2,2.5,3.5].forEach(x=>strum(tb+x*beat,ch,"ac",{vol:.55,mute:beat*.45,spread:.01}));
    for(let k=0;k<8;k++)pluck(tb+k*beat/2,r-12+(r<40?12:0),"bass",{vol:.9,mute:beat*.42});plainBeat(tb,beat,{hv:.8,kv:.9,sv:1,crash:b===0?.6:0});tamb(tb+beat);tamb(tb+3*beat);for(let k=0;k<8;k++)tamb(tb+k*beat/2+beat/4,.35);});
  const e=t+32*beat;[55,59,62,67].forEach(m=>piano(e,m,2.4,.9));strum(e,[43,50,55,59,62,67],"ac",{dur:2.4});crash(e,.6);kick(e);return 32*beat+2.6;};
DEMOS.five=t=>{const beat=bt(132),bars=6,AR=[[45,[57,60,64,67,72,67,64,60,64,67]],[41,[57,60,64,65,69,65,64,60,64,65]]];
  for(let b=0;b<bars;b++){const tb=t+b*5*beat,[r,ar]=AR[b%2];ar.forEach((m,k)=>epiano(tb+k*beat/2,m,beat*.9,k===0||k===6?1.1:.75));synth(tb,r-12,beat*2.8,{vol:1.1,cut:250,open:900,waves:[["sine",0],["triangle",0]]});synth(tb+3*beat,r-12,beat*1.8,{vol:1.1,cut:250,open:900,waves:[["sine",0],["triangle",0]]});
    kick(tb,1);kick(tb+3*beat,1);snare(tb+2*beat,.8);snare(tb+4*beat,.8);for(let k=0;k<10;k++)hat(tb+k*beat/2,(k===0||k===6)?.8:.4);for(let k=0;k<20;k++)if((k*7+b)%5===0)hat(tb+k*beat/4,.25);}
  const e=t+bars*5*beat;[57,60,64,69].forEach(m=>epiano(e,m,2.2));return bars*5*beat+2.4;};
DEMOS.postrock=t=>{const beat=bt(100),bars=12,CH=[[40,[64,67,71,74]],[36,[64,67,72,76]],[43,[62,67,71,74]],[38,[62,66,69,74]]],dly=bt(100)*.75;
  through(delayChain(dly,.45,.5),()=>{for(let b=0;b<bars;b++){const tb=t+b*4*beat,[,ch]=CH[b%4];[0,1,2,3,2,1,0,1].forEach((i,k)=>pluck(tb+k*beat/2,ch[i],"cl",{vol:.55+b*.04,dur:1.6}));
      if(b>=2){const m=ch[3]+12;if(b<6){pluck(tb,m,"cl",{vol:.6,dur:3});pluck(tb+2*beat,m-2,"cl",{vol:.5,dur:2.5});}else for(let k=0;k<16;k++)pluck(tb+k*beat/4,k<8?m:m-(b%2?3:2),"cl",{vol:.38+(b-6)*.05,mute:beat*.24,dur:.6});}}});
  for(let b=0;b<bars;b++){const tb=t+b*4*beat,[r,ch]=CH[b%4];
    if(b>=4){pluck(tb,r,"bs2",{vol:.7+(b-4)*.05,dur:4*beat});pluck(tb+2*beat,r,"bs2",{vol:.6+(b-4)*.05,mute:beat*1.9});}
    if(b>=4&&b<6){tom(tb,95,.5);tom(tb+2*beat,95,.4);tom(tb+3.5*beat,120,.4);}
    if(b>=6){plainBeat(tb,beat,{hv:.5+(b-6)*.08,kv:.7+(b-6)*.07,sv:.6+(b-6)*.1,crash:b>=9?.7:0});}
    if(b===8)for(let k=0;k<8;k++)snare(tb+3*beat+k*beat/8,.3+k*.08);
    if(b>=9)for(let k=0;k<8;k++){strum(tb+k*beat/2,[r+12,r+19,ch[1],ch[2]],"sw",{vol:.55,mute:beat*.6,spread:.006});}}
  const e=t+bars*4*beat;strum(e,[40,47,52,64,67,71],"sw",{vol:1.1,dur:3});pluck(e,40,"bs2",{vol:1,dur:3});crash(e);kick(e,1.2);return bars*4*beat+3.4;};
/* 08 两个人的乐队 */
const DUO=[[0,40,.5],[.5,40,.25],[.75,43,.25],[1,45,.5],[1.5,40,.5],[2,46,.25],[2.25,45,.25],[2.5,43,.5],[3,40,.75],[3.75,38,.25]];
function duo(t,oct){const beat=bt(124),bars=8;for(let b=0;b<bars;b++){const tb=t+b*4*beat,up=b%4===3?5:0;
    DUO.forEach(([x,m,d])=>{const mm=m+(x<2?up:0);pluck(tb+x*beat,mm,"fz",{vol:1.4,mute:d*beat*.92});if(oct)pluck(tb+x*beat+.002,mm-12,"fz",{vol:1.5,mute:d*beat*.92});});
    kick(tb,1.3);kick(tb+1.5*beat,1);kick(tb+2*beat,1.3);snare(tb+beat,1.4);snare(tb+3*beat,1.4);for(let q=0;q<8;q++)hat(tb+q*beat/2,q%2?.5:.9);if(b%4===0)crash(tb,.8);}
  const e=t+bars*4*beat;pluck(e,40,"fz",{vol:1.4,dur:2});if(oct)pluck(e,28,"fz",{vol:1.5,dur:2});crash(e);kick(e,1.3);return bars*4*beat+2.2;}
DEMOS.duo=t=>duo(t,false);DEMOS["duo-oct"]=t=>duo(t,true);
/* 09 卧室流行 */
DEMOS.bedroom=t=>{const beat=bt(82),bars=8,CH=[[39,[58,62,63,67]],[36,[58,63,67,70]],[44,[60,63,67,72]],[46,[58,62,65,70]]],dur=bars*4*beat+3;
  const lf=[wobble(t,dur,.45,.0065),wobble(t,dur,6.2,.0015)];
  through(lofi(110,3300,1.6),()=>{through(chorusChain(t,dur,.004,.6),()=>{for(let b=0;b<bars;b++){const tb=t+b*4*beat,[r,ch]=CH[b%4];
        [0,1.5,2.5,3].forEach(x=>ch.forEach((m,i)=>gpluck(tb+x*beat+i*.012,m,"cl",{vol:.7,dur:1.8},lf)));
        const ln=(b%2?[[0,70,1],[1,67,1],[2,65,2]]:[[0,67,1.5],[1.5,70,.5],[2,72,2]]);if(b>=2)ln.forEach(([x,m,d])=>voice(tb+x*beat,m,d*beat*.95,{vowel:"o",vol:.38,vibDepth:10,from:-.6}));
        synth(tb,r-12,beat*1.9,{vol:1.1,cut:220,open:600,waves:[["sine",0]]});synth(tb+2*beat,r-12,beat*1.9,{vol:1,cut:220,open:600,waves:[["sine",0]]});
        kick(tb,.7);kick(tb+2.5*beat,.6);clap(tb+beat,.6);clap(tb+3*beat,.6);for(let k=0;k<8;k++)hat(tb+swing8(0,beat,k,true)-0+0,.3);}});});
  return dur;};
/* 10 小号 */
const CNCH=[[45,[57,60,64,69]],[41,[57,60,65,69]],[48,[55,60,64,67]],[43,[55,59,62,67]]];
const TPT=[[3,[[0,76,1.5],[1.5,74,.5],[2,72,2]]],[4,[[0,69,1],[1,72,1],[2,74,1.5],[3.5,76,.5]]],[5,[[0,79,2],[2,76,1],[3,74,1]]],[6,[[0,72,1.5],[1.5,74,.5],[2,76,2]]],[7,[[0,74,1],[1,72,1],[2,69,2]]]];
DEMOS.cn=t=>{const beat=bt(78),bars=8;
  through(delayChain(beat*.75,.35,.35),()=>{for(let b=0;b<bars;b++){const tb=t+b*4*beat,[,ch]=CNCH[b%4];[0,1,2,3,2,1,2,3].forEach((i,k)=>pluck(tb+k*beat/2,ch[i],"cl",{vol:.8,dur:1.6}));}});
  for(let b=0;b<bars;b++){const tb=t+b*4*beat,[r]=CNCH[b%4];if(b>=1){pluck(tb,r-12+(r<40?12:0),"bs2",{vol:.85,mute:beat*1.9});pluck(tb+2.5*beat,r-12+(r<40?12:0),"bs2",{vol:.75,mute:beat*1.4});}
    if(b===2){tom(tb,100,.5);tom(tb+2*beat,100,.5);tom(tb+3*beat,130,.4);tom(tb+3.5*beat,130,.4);}if(b>=3)plainBeat(tb,beat,{hv:.6,kv:.85,sv:.8,crash:b===3?.7:0});}
  TPT.forEach(([b,ln])=>ln.forEach(([x,m,d])=>trumpet(t+(b*4+x)*beat,m,d*beat*.96,{vol:1})));
  const e=t+bars*4*beat;strum(e,[45,52,57,60,64,69],"cl",{vol:.9,dur:3});trumpet(e,69,2.8);pluck(e,33,"bs2",{vol:.9,dur:3});crash(e,.6);kick(e);return bars*4*beat+3.2;};

/* ================= 调度 ================= */
const GAIN={radio:1.5,"pp-bass":2,"pp-gtr":1.6,"pp-full":1.4,"jangle-6":1.3,"jangle-12":1.1,"dyn-quiet":.9,"dyn-loud":.9,"dyn-full":.9,"tune-std":1.6,"tune-alt":1.6,shoe:.27,"gr-punk":.65,"gr-doom":.55,"gr-mix":.65,brit:1.6,five:1.5,postrock:.85,duo:.7,"duo-oct":.55,bedroom:1.1,cn:1.4};
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
function runDemo(name,btn){newBus();bus.gain.value=GAIN[name]||.9;if(name==="shoe"||name==="postrock")addRoom(3.6,.8);if(name==="jangle-12"||name==="bedroom"||name==="cn"||name==="pp-gtr"||name==="pp-full")addRoom(2,.35);setActive(btn);const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;later(()=>clearActive(),d+.4);}
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);

/* ================= 推荐曲目：合辑磁带卡 ================= */
const SONGS=[
  {side:"A",q:"Joy Division Love Will Tear Us Apart",title:"Love Will Tear Us Apart",by:"Joy Division",yr:"1980",style:"后朋克",
   txt:"曼彻斯特乐队 Joy Division 最有名的单曲。规整的鼓、走在前面的贝斯、冷冷的合成器长音，是后朋克的标本。",
   listen:["前奏里最好记的旋律是谁弹的？对照 Lab 02","人声低沉，几乎不“唱”"]},
  {side:"A",q:"R.E.M. Radio Free Europe",title:"Radio Free Europe",by:"R.E.M.",yr:"1981",style:"大学摇滚 · jangle",
   txt:"R.E.M. 的第一张单曲，最早由一家小厂牌发行，1983 年重新录进首张专辑。主唱的咬字含糊，几乎听不清在唱什么，当时也成了一种标志。",
   listen:["明亮的吉他分解和弦，对照 Lab 03","这是大学电台时代的声音：不打磨，但很抓耳"]},
  {side:"A",q:"Pixies Where Is My Mind",title:"Where Is My Mind?",by:"Pixies",yr:"1988",style:"另类摇滚",
   txt:"来自波士顿的 Pixies 的首张正式专辑里的一首。安静与爆发交替，后来因为一部 1999 年电影的结尾被更多人知道。",
   listen:["主歌和副歌的响度差别，对照 Lab 04","背景里飘着的“呜—”是一段和声人声"]},
  {side:"A",q:"Sonic Youth Teen Age Riot",title:"Teen Age Riot",by:"Sonic Youth",yr:"1988",style:"噪音摇滚",
   txt:"专辑《Daydream Nation》的开场曲：先是一段漂浮的、几乎没有节奏的引子，然后进入另类调弦的吉他 riff。",
   listen:["引子和正歌的对比","吉他的和弦听起来“不标准”：对照 Lab 05"]},
  {side:"A",q:"Nirvana Smells Like Teen Spirit",title:"Smells Like Teen Spirit",by:"Nirvana",yr:"1991",style:"垃圾摇滚",
   txt:"本章开头那张专辑的第一首歌，也是让“另类”突然变成主流的那首歌。",
   listen:["四个和弦，先干净地弹一遍，再失真地砸一遍","主歌、副歌的大小声，对照图 4"]},
  {side:"A",q:"My Bloody Valentine Only Shallow",title:"Only Shallow",by:"My Bloody Valentine",yr:"1991",style:"盯鞋",
   txt:"专辑《Loveless》的开场曲，比《Nevermind》晚两个月发行。人声被吉他的音墙包住，像隔着一层雾。",
   listen:["吉他音高的轻微摇晃，对照 Lab 05 的“盯鞋音墙”","试着在音墙里找到人声"]},
  {side:"B",q:"张楚 姐姐",title:"姐姐",by:"张楚",yr:"1994",style:"中文摇滚 · 民谣色彩",
   txt:"收在张楚 1994 年的专辑《孤独的人是可耻的》里。几乎没有摇滚的“架势”，安静、内省，却是那个年代最被记住的中文歌之一。",
   listen:["它“另类”在哪里？声音还是态度？","和同年的唐朝乐队比一比"]},
  {side:"B",q:"Radiohead Paranoid Android",title:"Paranoid Android",by:"Radiohead",yr:"1997",style:"另类摇滚 · 前卫",
   txt:"六分多钟，由几段截然不同的部分拼起来：安静的木吉他、尖锐的失真、合唱般的慢板。《OK Computer》的核心。",
   listen:["数一数有几个“段落”","找到拍子“不对劲”的地方，对照图 7"]},
  {side:"B",q:"The Strokes Last Nite",title:"Last Nite",by:"The Strokes",yr:"2001",style:"车库摇滚复兴",
   txt:"纽约乐队 The Strokes 首张专辑里的单曲。短、快、干，两把吉他互相咬合，人声像从老式电话里传出来。",
   listen:["两把吉他各弹什么？","录音故意“扁”：和同时期的主流摇滚比"]},
  {side:"B",q:"The White Stripes Seven Nation Army",title:"Seven Nation Army",by:"The White Stripes",yr:"2003",style:"车库摇滚",
   txt:"开头那条听起来像贝斯的 riff，其实是吉他接了八度效果器。这条 riff 后来成了全世界体育场里的齐唱。",
   listen:["对照 Lab 08：“贝斯”在哪里？","全曲只有两个人"]},
  {side:"B",q:"万能青年旅店 杀死那个石家庄人",title:"杀死那个石家庄人",by:"万能青年旅店",yr:"2010",style:"中文独立摇滚",
   txt:"来自石家庄的乐队首张专辑中最广为人知的一首。歌的后半段是一段小号独奏。",
   listen:["小号出现在哪里？对照 Lab 10","乐器一层层加进来的方式，和后摇有什么相似？"]},
  {side:"B",q:"草东没有派对 山海",title:"山海",by:"草东没有派对",yr:"2016",style:"台湾独立摇滚",
   txt:"首张专辑《丑奴儿》里的一首。乐队第二年拿下了金曲奖最佳新人、最佳乐团和年度歌曲。",
   listen:["主歌和副歌的大小声，对照 Lab 04","和二十多年前的张楚比：哪里变了，哪里没变？"]}
];
const ICON="M8 5v14l11-7z";
SONGS.forEach(s=>{
  const el=document.createElement("div");el.className="song";
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<span class="spine" aria-hidden="true">${s.yr} · ${s.by}</span><div class="meta"><span class="title">${s.title}</span><span class="by">${s.by}</span><div class="pmeta"><span class="yr">${s.yr}</span><span class="style">${s.style}</span></div></div>
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
/* 图 1 时间线 */
(()=>{const g=document.getElementById("time-fig");if(!g)return;const X=y=>82+(y-1978)*14.4;
  const L=[["美国",80],["英国",175],["中文",270]];
  L.forEach(([n,y])=>{S(g,"text",{x:16,y:y+5,class:"sv-t",style:TB},n);S(g,"line",{x1:62,y1:y,x2:660,y2:y,class:"sv-lline","stroke-width":2});});
  const E=[[0,1981,"R.E.M. 首张单曲",-14],[0,1988,"Pixies 首张专辑",24,0,"end"],[0,1991,"《Nevermind》",-14,1],[0,1994,"Cobain 去世",24,0,"start"],[0,2001,"The Strokes",-14],
    [1,1978,"后朋克兴起",-14],[1,1980,"Joy Division",24],[1,1991,"盯鞋《Loveless》",-14,0,"end"],[1,1995,"Britpop 之战",-14,0,"start"],[1,1997,"《OK Computer》",24,0,"start"],[1,2006,"Arctic Monkeys",-14],
    [2,1994,"红磡演唱会",-14,1],[2,2010,"万青首张专辑",-14],[2,2016,"草东《丑奴儿》",24]];
  [[1,1978,0,1981],[0,1991,1,1995],[0,2001,1,2006]].forEach(([l1,y1,l2,y2])=>{const x1=X(y1),x2=X(y2),a=L[l1][1],b=L[l2][1];S(g,"path",{d:`M ${x1} ${a+(b>a?8:-8)} C ${x1} ${(a+b)/2}, ${x2} ${(a+b)/2}, ${x2} ${b+(b>a?-8:8)}`,class:"sv-lr","stroke-width":1.6,"stroke-dasharray":"4 4",fill:"none"});});
  E.forEach(([l,y,t,dy,hot,anc])=>{const x=X(y),yy=L[l][1],tx=anc==="end"?x+8:anc==="start"?x-8:x,an=anc||"middle";S(g,"circle",{cx:x,cy:yy,r:hot?8:6,class:hot?"sv-red":"sv-ink"});
    S(g,"text",{x:tx,y:yy+dy,"text-anchor":an,class:hot?"sv-r":"sv-t",style:"font-size:12.5px;font-weight:700"},t);S(g,"text",{x:tx,y:yy+dy+(dy<0?-15:15),"text-anchor":an,class:"sv-m",style:"font-size:10.5px"},String(y));});
  S(g,"text",{x:660,y:346,"text-anchor":"end",class:"sv-ts"},"虚线箭头：影响或回应");
})();
/* 图 2 分工 */
(()=>{const g=document.getElementById("roles-fig");if(!g)return;
  const P=[["普通摇滚",60,[["贝斯",205,250,0],["吉他",130,205,0],["人声",60,130,1]]],["后朋克",380,[["贝斯",110,165,1],["吉他",40,90,0,1],["人声",170,225,0]]]];
  P.forEach(([n,x0,R])=>{S(g,"text",{x:x0,y:22,class:"sv-t",style:TB},n);S(g,"line",{x1:x0,y1:270,x2:x0,y2:36,class:"sv-l","stroke-width":1.4});S(g,"text",{x:x0-6,y:44,"text-anchor":"end",class:"sv-m"},"高");S(g,"text",{x:x0-6,y:268,"text-anchor":"end",class:"sv-m"},"低");
    R.forEach(([l,y1,y2,mel,thin],i)=>{const x=x0+20+i*78;S(g,"rect",{x,y:y1,width:64,height:y2-y1,rx:3,class:mel?"sv-red":"sv-ink",opacity:thin?.35:1,"stroke-dasharray":thin?"3 3":"none"});
      S(g,"text",{x:x+32,y:(y1+y2)/2+5,"text-anchor":"middle",class:thin?"sv-t":"sv-on",style:"font-size:13px;font-weight:700"},l);S(g,"text",{x:x+32,y:288,"text-anchor":"middle",class:"sv-m",style:"font-size:11px"},mel?"旋律":thin?"氛围":l==="吉他"?"和弦":l==="贝斯"?"根音":"低吟");});});
})();
/* 图 3 十二弦 */
(()=>{const g=document.getElementById("twelve-fig");if(!g)return;const N=["E","A","D","G","B","E"];
  N.forEach((n,i)=>{const x=90+i*66,oct=i<4;S(g,"line",{x1:x,y1:36,x2:x,y2:200,class:"sv-l","stroke-width":5-i*.6});S(g,"line",{x1:x+14,y1:36,x2:x+14,y2:200,class:oct?"sv-lr":"sv-l","stroke-width":oct?1.2:5-i*.6});
    S(g,"text",{x:x+7,y:222,"text-anchor":"middle",class:"sv-t",style:"font-size:15px;font-weight:700"},n);S(g,"text",{x:x+7,y:242,"text-anchor":"middle",class:oct?"sv-r":"sv-m",style:"font-size:11px"},oct?"+ 高八度":"同音");});
  S(g,"rect",{x:76,y:28,width:376,height:8,rx:2,class:"sv-ink"});
  S(g,"text",{x:490,y:80,class:"sv-t",style:TB},"每组两根弦");S(g,"text",{x:490,y:104,class:"sv-ts"},"红色细线：高八度的弦");S(g,"text",{x:490,y:124,class:"sv-ts"},"弹一个低音，");S(g,"text",{x:490,y:144,class:"sv-ts"},"同时响起它的高八度：");S(g,"text",{x:490,y:164,class:"sv-ts"},"声音更亮、更宽");
})();
/* 图 4 响度 */
(()=>{const g=document.getElementById("dyn-fig");if(!g)return;const x0=130,W=500,sec=["主歌","副歌","主歌","副歌","尾声"];
  const R=[["硬摇滚",30,[.62,.78,.66,.8,.84]],["另类",150,[.18,.92,.16,.94,.2]]];
  R.forEach(([n,y,lv],r)=>{S(g,"text",{x:20,y:y+50,class:"sv-t",style:TB},n);S(g,"line",{x1:x0,y1:y+90,x2:x0+W,y2:y+90,class:"sv-l"});let d="";lv.forEach((v,i)=>{const xa=x0+i*W/5,xb=xa+W/5,yy=y+90-v*82;d+=(i?` L ${xa} ${yy}`:`M ${xa} ${yy}`)+` L ${xb} ${yy}`;});
    S(g,"path",{d:d+` L ${x0+W} ${y+90} L ${x0} ${y+90} Z`,style:FILL(r?"red":"ink"),opacity:.16});S(g,"path",{d,class:r?"sv-lr":"sv-l","stroke-width":2.6,fill:"none"});
    sec.forEach((s,i)=>S(g,"text",{x:x0+(i+.5)*W/5,y:y+106,"text-anchor":"middle",class:"sv-m",style:"font-size:11px"},s));});
})();
/* 图 5 调弦 */
(()=>{const g=document.getElementById("tuning-fig");if(!g)return;
  const R=[["标准调弦",["E","A","D","G","B","E"],null],["同音调弦（举例）",["E","E","B","B","E","E"],1]];
  R.forEach(([n,ns,alt],r)=>{const y=40+r*104;S(g,"text",{x:20,y:y+26,class:"sv-t",style:TB},n);ns.forEach((s,i)=>{const x=210+i*70,c=alt?(s==="E"?"red":"denim"):null;
      S(g,"rect",{x,y,width:58,height:40,rx:4,style:c?FILL(c):"",class:c?"":"sv-card"});if(!c)S(g,"rect",{x,y,width:58,height:40,rx:4,class:"sv-l"});S(g,"text",{x:x+29,y:y+26,"text-anchor":"middle",class:c?"sv-on":"sv-t",style:"font-size:16px;font-weight:700"},s);
      S(g,"text",{x:x+29,y:y+58,"text-anchor":"middle",class:"sv-m",style:"font-size:10.5px"},`${6-i} 弦`);});});
})();
/* 图 6 坐标 */
(()=>{const g=document.getElementById("grunge-fig");if(!g)return;
  S(g,"line",{x1:80,y1:300,x2:640,y2:300,class:"sv-l","stroke-width":1.6});S(g,"line",{x1:80,y1:300,x2:80,y2:24,class:"sv-l","stroke-width":1.6});
  S(g,"text",{x:640,y:322,"text-anchor":"end",class:"sv-ts"},"速度：慢 → 快");S(g,"text",{x:90,y:30,class:"sv-ts"},"重量：轻 → 重（失真、调低的弦）");
  const P=[["毁灭金属",160,70],["激流金属",560,70],["硬摇滚",330,190],["朋克",540,230],["后朋克",420,262],["垃圾摇滚",320,110,1]];
  [[160,70],[540,230]].forEach(([x,y])=>S(g,"path",{d:`M ${x} ${y} Q ${(x+320)/2} ${y<110?70:200} ${x<320?296:350} ${y<110?102:122}`,class:"sv-lr","stroke-width":1.8,"stroke-dasharray":"5 4",fill:"none"}));
  P.forEach(([n,x,y,hot])=>{S(g,"circle",{cx:x,cy:y,r:hot?16:9,class:hot?"sv-red":"sv-ink"});S(g,"text",{x:x+(hot?22:14),y:y+5,class:hot?"sv-r":"sv-t",style:`font-size:${hot?16:13}px;font-weight:700`},n);});
})();
/* 图 7 拍号 */
(()=>{const g=document.getElementById("meter-fig");if(!g)return;
  const R=[["4/4",[2,2]],["5/4",[3,2]]];R.forEach(([n,grp],r)=>{const y=34+r*96;S(g,"text",{x:24,y:y+32,class:"sv-t",style:"font-family:var(--font-vhs);font-size:34px"},n);let i=0,x=130;
    grp.forEach((gl,gi)=>{for(let k=0;k<gl;k++){const acc=k===0;S(g,"rect",{x,y,width:84,height:48,rx:4,class:acc?"sv-ink":"sv-card"});if(!acc)S(g,"rect",{x,y,width:84,height:48,rx:4,class:"sv-l"});S(g,"text",{x:x+42,y:y+31,"text-anchor":"middle",class:acc?"sv-on":"sv-t",style:"font-size:18px;font-weight:700"},String(k+1));i++;x+=90;}
      S(g,"text",{x:x-gl*45-3,y:y+70,"text-anchor":"middle",class:"sv-m",style:"font-size:11px"},`${gl} 拍一组`);x+=14;});});
})();
/* 图 8 渐强层次 */
(()=>{const g=document.getElementById("layers-fig");if(!g)return;const x0=70,W=560,bars=12,base=250,bx=b=>x0+b*W/bars;
  const L=[["吉他 1",0,22,"denim",.75],["吉他 2",2,18,"denim",.45],["贝斯",4,22,"ink",.55],["鼓",6,30,"ink",.3],["失真音墙",9,58,"red",.8]];
  let under=Array(bars*4+1).fill(0);
  L.forEach(([n,st,th,c,op])=>{const top=under.map((u,i)=>{const b=i/4;const f=b<st?0:b<st+1?(b-st):1;const grow=1+(b-st>0?(b-st)*.06:0);return u+f*th*grow;});
    let d=`M ${bx(0)} ${base-under[0]}`;top.forEach((v,i)=>d+=` L ${bx(i/4)} ${base-v}`);for(let i=under.length-1;i>=0;i--)d+=` L ${bx(i/4)} ${base-under[i]}`;S(g,"path",{d:d+" Z",style:FILL(c),opacity:op});
    const lx=bx(Math.min(st+1.2,bars-1.6));S(g,"text",{x:lx,y:base-top[Math.round((st+1.2)*4)]-6+(n==="失真音墙"?0:0),class:"sv-t",style:"font-size:12px;font-weight:700"},n);under=top;});
  S(g,"line",{x1:x0,y1:base,x2:x0+W,y2:base,class:"sv-l","stroke-width":1.4});for(let b=0;b<=bars;b+=2)S(g,"text",{x:bx(b),y:base+18,"text-anchor":"middle",class:"sv-m",style:"font-size:11px"},`${b}`);
  S(g,"text",{x:x0+W,y:base+36,"text-anchor":"end",class:"sv-ts"},"小节 →");
})();
/* 外部照片 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`照片待放入：${img.getAttribute("src")}<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张照片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
