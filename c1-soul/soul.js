/* ================= 灵魂乐与放克：乐器 ================= */
Object.assign(INST,{
  cl:{bright:.72,decay:.9988,dur:1.8,vol:.3,lp:4000},
  sc:{bright:.9,decay:.995,dur:.3,vol:.22,lp:3800,peak:[1800,6]},
  slp:{bright:.96,decay:.9975,dur:.9,vol:.75,lp:5200,peak:[2200,6]},
  pop:{bright:.99,decay:.997,dur:.45,vol:.42,lp:7000,peak:[2800,7]},
  fb:{bright:.38,decay:.996,dur:1,vol:.8,lp:1100},
  clv:{bright:.99,decay:.9955,dur:.5,vol:.3,lp:6500,peak:[1400,9],drive:2.2}
});
function tamb(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=8200;f.Q.value=1.4;const g=a.createGain();g.gain.setValueAtTime(.2*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.14);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+.15);track(n);}
function ohat(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=7000;const g=a.createGain();g.gain.setValueAtTime(.13*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+.33);track(n);}
function ghost(t,v=1){snare(t,.16*v);}
function brass(t,notes,len,v=1){const a=A();notes.forEach(m=>{const x=a.createOscillator();x.type="sawtooth";x.frequency.setValueAtTime(mf(m)*.985,t);x.frequency.linearRampToValueAtTime(mf(m),t+.03);const lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=1.2;lp.frequency.setValueAtTime(600,t);lp.frequency.linearRampToValueAtTime(3200,t+.03);lp.frequency.exponentialRampToValueAtTime(1100,t+len);
  const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=1200;pk.gain.value=5;const g=a.createGain(),vv=.055*v;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vv,t+.015);g.gain.setValueAtTime(vv*.9,t+Math.max(.03,len-.04));g.gain.linearRampToValueAtTime(0,t+len);x.connect(lp).connect(pk).connect(g).connect(bus);x.start(t);x.stop(t+len+.02);track(x);});}
function strings(t,notes,dur,v=1){const a=A();notes.forEach(m=>[-7,0,7].forEach(dt=>{const o=a.createOscillator();o.type="sawtooth";o.frequency.value=mf(m);o.detune.value=dt;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=2200;const g=a.createGain(),vv=.012*v;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vv,t+.25);g.gain.setValueAtTime(vv,t+Math.max(.26,dur-.2));g.gain.linearRampToValueAtTime(0,t+dur);o.connect(lp).connect(g).connect(bus);o.start(t);o.stop(t+dur+.05);track(o);}));}
function epiano(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain(),x=a.createOscillator();x.type="sine";x.frequency.value=f;const m=a.createOscillator();m.frequency.value=f*2;const mg=a.createGain();mg.gain.setValueAtTime(f*1.1,t);mg.gain.exponentialRampToValueAtTime(f*.08,t+.5);m.connect(mg).connect(x.frequency);x.connect(g);[x,m].forEach(o=>{o.start(t);o.stop(t+dur+.1);track(o);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.11*v,t+.006);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);g.connect(bus);}
function piano(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain();[[1,.6,"triangle"],[2,.25,"sine"],[3,.08,"sine"]].forEach(([h,am,w])=>{const x=a.createOscillator();x.type=w;x.frequency.value=f*h;const xg=a.createGain();xg.gain.value=am;x.connect(xg).connect(g);x.start(t);x.stop(t+dur+.1);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.11*v,t+.005);g.gain.exponentialRampToValueAtTime(.03*v,t+.4);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);g.connect(bus);}
/* 一条连续的人声线，音与音之间滑动 */
function voxLine(t,beat,segs,o={}){const a=A(),os=a.createOscillator();os.type="sawtooth";const end=t+segs.reduce((m,[b,,d])=>Math.max(m,b+d),0)*beat,tr=o.tr||0;
  segs.forEach(([b,m,d],i)=>{const tt=t+b*beat,f=mf(m+tr);if(i===0){os.frequency.setValueAtTime(f*.95,tt);os.frequency.linearRampToValueAtTime(f,tt+.08);}else{os.frequency.setValueAtTime(mf(segs[i-1][1]+tr),tt);os.frequency.linearRampToValueAtTime(f,tt+Math.min(.07,d*beat*.4));}});
  const l=a.createOscillator(),lg=a.createGain();l.frequency.value=5.4;lg.gain.value=o.vib==null?20:o.vib;l.connect(lg).connect(os.detune);
  const g=a.createGain(),v=(o.vol||1)*.45;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.06);g.gain.setValueAtTime(v,end-.12);g.gain.linearRampToValueAtTime(0,end);
  const out=a.createGain();[[o.vowel==="o"?500:750,7,1],[o.vowel==="o"?900:1250,9,.6],[2700,10,.3]].forEach(([fr,q,amt])=>{const bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=fr;bp.Q.value=q;const gg=a.createGain();gg.gain.value=amt*3;os.connect(bp).connect(gg).connect(out);});
  out.connect(g).connect(bus);[os,l].forEach(x=>{x.start(t);x.stop(end+.05);track(x);});}
function choir(t,notes,dur,v=1){notes.forEach((m,i)=>voice(t+i*.01,m,dur,{vowel:"o",vol:.32*v,vibDepth:12,from:-.3}));}
function backbeat(tb,beat,o={}){kick(tb,o.kv||.9);kick(tb+2*beat,o.kv||.9);if(o.push)kick(tb+2.5*beat,.6);snare(tb+beat,o.sv||.9);snare(tb+3*beat,o.sv||.9);for(let k=0;k<8;k++)hat(tb+k*beat/2,(k%2?.4:.7)*(o.hv||1));}

const DEMOS={};
/* 01 呼应、转音、拍手 */
const EB=[[39,[63,67,70]],[44,[63,68,72]],[39,[63,67,70]],[46,[62,65,70]]];
function gospelBed(tb,beat,i,o={}){const [r,ch]=EB[i%4];hammond(tb,ch[0]-12,beat*1.9,{vol:.75});ch.forEach(m=>hammond(tb,m-12,beat*3.9,{vol:.55}));pluck(tb,r-12,"fb",{vol:1,mute:beat*1.8});pluck(tb+2*beat,r-12,"fb",{vol:.9,mute:beat*1.4});pluck(tb+3.5*beat,r-10,"fb",{vol:.7,mute:beat*.4});
  if(o.piano)[.5,1.5,2.5,3.5].forEach(x=>ch.forEach(m=>piano(tb+x*beat,m,beat*.4,.55)));}
DEMOS.call=t=>{const beat=bt(100),CALL=[[[0,70,.5],[.5,72,.5],[1,70,1]],[[0,67,.5],[.5,70,.5],[1,72,.5],[1.5,70,.5]],[[0,75,1],[1,72,.5],[1.5,70,.5]],[[0,70,.5],[.5,67,.5],[1,63,1]]];
  for(let i=0;i<8;i++){const tb=t+i*4*beat;gospelBed(tb,beat,i,{piano:true});clap(tb+beat,.9);clap(tb+3*beat,.9);kick(tb,.6);
    const c=CALL[i%4],gap=i<4?2:1;voxLine(tb,beat,c,{vol:.85});const [,ch]=EB[i%4];choir(tb+gap*beat+(i<4?0:.5*beat),ch.map(m=>m),beat*(i<4?1.6:1),.9);if(i>=4)choir(tb+3*beat,ch,beat*.9,.9);}
  const e=t+32*beat;hammond(e,51,3,{vol:.8});[63,67,70].forEach(m=>hammond(e,m-12,3,{vol:.6}));choir(e,[63,67,70,75],3);voxLine(e,1,[[0,75,.6],[.6,77,.3],[.9,75,2]],{vol:.85});pluck(e,27,"fb",{dur:3});return 32*beat+3.4;};
const PLAIN=[[0,63,1],[1,65,1],[2,67,2],[4,70,1],[5,67,1],[6,65,2]],RUN=[[0,63,1],[1,65,1],[2,67,.5],[2.5,70,.25],[2.75,72,.25],[3,70,.25],[3.25,67,.25],[3.5,65,.5],[4,70,1],[5,67,1],[6,67,.25],[6.25,65,.25],[6.5,63,.25],[6.75,60,.25],[7,63,1]];
function melDemo(t,run){const beat=bt(72);for(let r=0;r<2;r++)for(let i=0;i<2;i++){const tb=t+(r*2+i)*4*beat;gospelBed(tb,beat,i*2);snare(tb+beat,.35,true);snare(tb+3*beat,.35,true);}
  voxLine(t,beat,run?RUN:PLAIN,{vol:.85});voxLine(t+8*beat,beat,(run?RUN:PLAIN).map(([b,m,d])=>[b,m+(m>=67?0:0),d]),{vol:.85,tr:run?0:0});return 16*beat+1.2;}
DEMOS["mel-plain"]=t=>melDemo(t,false);DEMOS["mel-run"]=t=>melDemo(t,true);
function clapDemo(t,on24){const beat=bt(104);for(let i=0;i<8;i++){const tb=t+i*4*beat;gospelBed(tb,beat,i,{piano:true});(on24?[1,3]:[0,2]).forEach(x=>{clap(tb+x*beat,1.1);tamb(tb+x*beat,.9);});kick(tb,.5);}return 32*beat+1;}
DEMOS["clap-13"]=t=>clapDemo(t,false);DEMOS["clap-24"]=t=>clapDemo(t,true);
/* 03 Motown 与 Stax */
const MT=[[36,[60,64,67]],[45,[60,64,69]],[41,[60,65,69]],[43,[59,62,67]]];
const JAM=[[[0,36],[1,40],[1.5,43],[2,45],[2.75,43],[3,40],[3.5,38]],[[0,45],[.75,45],[1,40],[1.5,43],[2,45],[2.5,48],[3,47],[3.5,43]],[[0,41],[1,45],[1.5,48],[2,41],[2.75,41],[3,43],[3.5,44]],[[0,43],[1,47],[1.5,50],[2,43],[2.5,41],[3,40],[3.5,38]]];
const MEL=[[[0,72,1],[1,76,.5],[1.5,74,.5],[2,72,2]],[[0,72,.5],[.5,74,.5],[1,76,1],[2,79,1.5],[3.5,76,.5]],[[0,77,1],[1,76,.5],[1.5,74,.5],[2,72,1],[3,69,1]],[[0,71,1],[1,72,1],[2,74,2]]];
function motown(t,jam){const beat=bt(122);for(let i=0;i<8;i++){const tb=t+i*4*beat,[r,ch]=MT[i%4];
    for(let q=0;q<4;q++){tamb(tb+q*beat,1);snare(tb+q*beat,q%2?.85:.45);hat(tb+q*beat+beat/2,.4);}kick(tb,.8);kick(tb+2*beat,.8);
    [.5,1.5,2.5,3.5].forEach(x=>ch.forEach(m=>piano(tb+x*beat,m,beat*.4,.5)));strings(tb,ch.map(m=>m+12),4*beat,.7);
    if(jam)JAM[i%4].forEach(([b,m])=>pluck(tb+b*beat,m-12+12,"fb",{vol:1.05,mute:beat*.45}));else for(let q=0;q<4;q++)pluck(tb+q*beat,r,"fb",{vol:1.05,mute:beat*.9});
    voxLine(tb,beat,MEL[i%4],{vol:.7,vib:18});}
  const e=t+32*beat;[48,60,64,67,72].forEach(m=>piano(e,m,2.4));strings(e,[72,76,79],2.4);pluck(e,36,"fb",{dur:2.4});return 32*beat+2.6;}
DEMOS["mt-root"]=t=>motown(t,false);DEMOS["mt-jam"]=t=>motown(t,true);
DEMOS.stax=t=>{const beat=bt(94),CH=[[43,[53,59,62,65]],[43,[53,59,62,65]],[48,[52,58,60,64]],[43,[53,59,62,65]]];for(let i=0;i<8;i++){const tb=t+i*4*beat,[r,ch]=CH[i%4];
    ch.forEach(m=>hammond(tb,m,beat*3.9,{vol:.55}));[1,3].forEach(x=>strum(tb+x*beat,ch.map(m=>m+12),"cl",{vol:.8,mute:beat*.3,spread:.008}));
    [[0,r],[.75,r],[1.5,r+7],[2,r+10],[2.5,r+12],[3,r+10],[3.5,r+7]].forEach(([b,m])=>pluck(tb+b*beat,m-12,"fb",{vol:1,mute:beat*.42}));
    kick(tb,1);kick(tb+.75*beat,.6);kick(tb+2*beat,1);snare(tb+beat,1.2);snare(tb+3*beat,1.2);for(let k=0;k<8;k++)hat(tb+k*beat/2,k%2?.4:.7);
    if(i%2===1){brass(tb+2.5*beat,ch.map(m=>m+12),beat*.35,1);brass(tb+3.5*beat,ch.map(m=>m+12),beat*.7,1.1);}else brass(tb+3.5*beat,ch.map(m=>m+12),beat*.3,.9);}
  const e=t+32*beat;brass(e,[65,71,74,77],1.6,1.2);[55,59,62,65].forEach(m=>hammond(e,m,2,{vol:.6}));pluck(e,31,"fb",{dur:2});crash(e,.6);kick(e);return 32*beat+2.2;};
/* 05 放克 */
const FKCH=[56,62,66,71];
const FKB=[[0,28],[3,28],[4,40],[6,38],[7,35],[10,28],[11,31],[13,33],[14,35]];
const FKG=[2,3,6,8,10,11,14];
function fkBar(tb,beat,L,b){const s=beat/4;
  kick(tb,1.2);kick(tb+3*s,.6);kick(tb+10*s,.9);kick(tb+11*s,.5);snare(tb+4*s,1);snare(tb+12*s,1);[7,9,14].forEach(k=>ghost(tb+k*s,1.1));for(let k=0;k<16;k++)hat(tb+k*s,k%4===0?.7:k%2?.3:.45);if(b===0)crash(tb,.6);
  if(L>=1)FKB.forEach(([k,m])=>pluck(tb+k*s,m,"fb",{vol:1.1,mute:s*(k===0?2.6:1.2)}));
  if(L>=2)for(let k=0;k<16;k++){const acc=FKG.includes(k);strum(tb+k*s,FKCH.map(m=>m+12),"sc",{vol:acc?1:.45,mute:acc?s*.9:s*.35,spread:.003});}
  if(L>=3){if(b%2===1){brass(tb+6*s,[68,74,78],s*.9,1);brass(tb+11*s,[68,74,78],s*.9,1);brass(tb+14*s,[71,76,80],s*1.6,1.1);}else brass(tb,[68,74,78],s*1.5,1.1);}}
function fkDemo(t,L){const beat=bt(104);for(let b=0;b<8;b++)fkBar(t+b*4*beat,beat,L,b);const e=t+32*beat;kick(e,1.2);crash(e);if(L>=1)pluck(e,28,"fb",{dur:1.6});if(L>=2)strum(e,FKCH.map(m=>m+12),"cl",{dur:1.6,vol:.9});if(L>=3)brass(e,[68,74,78,83],1.4,1.2);return 32*beat+2;}
DEMOS["fk-drum"]=t=>fkDemo(t,0);DEMOS["fk-bass"]=t=>fkDemo(t,1);DEMOS["fk-gtr"]=t=>fkDemo(t,2);DEMOS["fk-full"]=t=>fkDemo(t,3);
/* 06 鬼音与 break */
function brBar(tb,beat,ghosts,v=1){const s=beat/4;kick(tb,1.2*v);kick(tb+6*s,.7*v);kick(tb+10*s,1*v);kick(tb+11*s,.6*v);snare(tb+4*s,1.1*v);snare(tb+12*s,1.1*v);if(ghosts){[2,7,9,13,15].forEach(k=>ghost(tb+k*s,1.2*v));}
  for(let k=0;k<8;k++)k===7?ohat(tb+k*beat/2,.8*v):hat(tb+k*beat/2,(k%2?.5:.85)*v);}
DEMOS["ghost-off"]=t=>{const beat=bt(94);for(let b=0;b<4;b++)brBar(t+b*4*beat,beat,false);return 16*beat+1;};
DEMOS["ghost-on"]=t=>{const beat=bt(94);for(let b=0;b<4;b++)brBar(t+b*4*beat,beat,true);return 16*beat+1;};
DEMOS.break=(t,btn)=>{const beat=bt(94),bar=4*beat,st=stripNear(btn);lightStrip(st,t,bar,8);
  through(lofiChain(),()=>{for(let b=0;b<8;b++){const tb=t+b*bar,s=beat/4;if(b%2===0)brBar(tb,beat,true);else{kick(tb,1.2);snare(tb+4*s,1.1);ghost(tb+7*s,1.2);kick(tb+8*s,.9);kick(tb+10*s,.8);snare(tb+12*s,1.1);ghost(tb+14*s,1.2);snare(tb+15*s,.5);for(let k=0;k<8;k++)hat(tb+k*beat/2,k%2?.5:.85);}}
    crackle(t,8*bar+.5);});return 8*bar+1;};
function lofiChain(){const a=A(),inp=a.createGain(),h=a.createBiquadFilter();h.type="highpass";h.frequency.value=60;const l=a.createBiquadFilter();l.type="lowpass";l.frequency.value=6000;const sh=a.createWaveShaper();sh.curve=shaper(1.8);const out=a.createGain();out.gain.value=.9;inp.connect(h).connect(l).connect(sh).connect(out);return [inp,out];}
function crackle(t,dur){const a=A(),n=a.createBufferSource(),len=Math.floor(a.sampleRate*Math.min(dur,30)),b=a.createBuffer(1,len,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()<.0009?(Math.random()*2-1)*.9:(Math.random()*2-1)*.012;n.buffer=b;const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=1500;const g=a.createGain();g.gain.value=.5;n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+dur);track(n);}
/* 07 贝斯与键盘 */
const SL=[[0,28,"T"],[.5,40,"P"],[.75,28,"T"],[1,31,"T"],[1.5,43,"P"],[2,33,"T"],[2.25,33,"T"],[2.5,45,"P"],[3,35,"T"],[3.5,38,"T"],[3.75,40,"P"]];
function bassDemo(t,slap){const beat=bt(100);for(let b=0;b<4;b++){const tb=t+b*4*beat;backbeat(tb,beat,{kv:.9,sv:1,hv:.8});
    SL.forEach(([x,m,k])=>{const tt=tb+x*beat;if(!slap)pluck(tt,m,"fb",{vol:1.1,mute:beat*.4});else if(k==="T"){pluck(tt,m,"slp",{vol:1.1,mute:beat*.42});const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=2500;const g=a.createGain();g.gain.setValueAtTime(.18,tt);g.gain.exponentialRampToValueAtTime(.001,tt+.02);n.connect(f).connect(g).connect(bus);n.start(tt);n.stop(tt+.03);track(n);}else pluck(tt,m,"pop",{vol:1.2,mute:beat*.2});});}
  const e=t+16*beat;pluck(e,28,slap?"slp":"fb",{vol:1.1,dur:1.6});kick(e);crash(e,.5);return 16*beat+1.8;}
DEMOS.finger=t=>bassDemo(t,false);DEMOS.slap=t=>bassDemo(t,true);
DEMOS.clav=t=>{const beat=bt(98),s=beat/4,R=[[0,52],[2,55],[3,57],[5,52],[6,59],[8,62],[9,59],[10,57],[12,55],[14,52],[15,50]];for(let b=0;b<4;b++){const tb=t+b*4*beat;R.forEach(([k,m])=>{pluck(tb+k*s,m+(b===3&&k>=8?2:0),"clv",{vol:1.2,mute:s*.9});if(k%4===2)pluck(tb+k*s,m+7,"clv",{vol:.7,mute:s*.7});});
    backbeat(tb,beat,{kv:.9,sv:1,hv:.7});pluck(tb,28,"fb",{vol:1,mute:beat*.9});pluck(tb+1.75*beat,28,"fb",{vol:.8,mute:beat*.3});pluck(tb+2.5*beat,40,"fb",{vol:.8,mute:beat*.3});}
  const e=t+16*beat;strum(e,[52,59,62,64],"clv",{vol:1,dur:.8});kick(e);return 16*beat+1.2;};
/* 09 费城、扩展和弦、新灵魂 */
DEMOS.philly=t=>{const beat=bt(116),CH=[[38,[60,65,69,72]],[43,[59,62,65,71]],[36,[59,64,67,71]],[45,[60,64,67,69]]];for(let i=0;i<8;i++){const tb=t+i*4*beat,[r,ch]=CH[i%4];
    for(let q=0;q<4;q++){kick(tb+q*beat,1);ohat(tb+q*beat+beat/2,1);hat(tb+q*beat,.4);}snare(tb+beat,.8);snare(tb+3*beat,.8);
    strings(tb,ch.map(m=>m+12),4*beat,1.1);if(i%2)[2.5,3].forEach(x=>strings(tb+x*beat,[ch[3]+24],beat*.45,1.4));
    for(let k=0;k<8;k++)pluck(tb+k*beat/2,r-12+(k%2?12:0),"fb",{vol:1,mute:beat*.4});[.5,1.5,2.5,3.5].forEach(x=>strum(tb+x*beat,ch,"cl",{vol:.55,mute:beat*.25,spread:.006}));}
  const e=t+32*beat;strings(e,[72,77,81,84],2.6,1.2);kick(e);crash(e,.5);pluck(e,26,"fb",{dur:2.4});return 32*beat+2.8;};
const TRI=[[39,[51,55,58]],[38,[50,53,57]],[36,[48,51,55]],[41,[53,57,60]]];
const EXT=[[39,[55,58,62,65]],[38,[53,57,60,64]],[36,[51,55,58,62]],[41,[53,58,63,67]]];
function chordDemo(t,set,neo){const beat=bt(neo?84:80);for(let i=0;i<(neo?8:4);i++){const tb=t+i*4*beat,[r,ch]=set[i%4];
    if(neo){const late=.035;kick(tb-.008,1);kick(tb+1.75*beat-.008,.7);kick(tb+2.5*beat,.8);snare(tb+beat+late,.9);snare(tb+3*beat+late,.9);ghost(tb+1.75*beat+late,1);ghost(tb+3.75*beat+late,1);for(let k=0;k<8;k++)hat(swing8(tb,beat,k,true)+(Math.random()-.5)*.012+(k%2?.02:0),k%2?.35:.6);
      ch.forEach((m,j)=>epiano(tb+j*.012,m,beat*1.8,.8));ch.forEach((m,j)=>epiano(tb+2.5*beat+j*.015,m,beat*1.3,.6));pluck(tb,r-12,"fb",{vol:1,mute:beat*1.4});pluck(tb+1.5*beat,r-12+(i%2?7:10),"fb",{vol:.8,mute:beat*.4});pluck(tb+2.5*beat,r-12,"fb",{vol:.9,mute:beat*1.2});}
    else{ch.forEach((m,j)=>epiano(tb+j*.01,m,beat*3.8,.85));pluck(tb,r-12,"fb",{vol:.9,dur:4*beat});}}
  const n=neo?8:4,e=t+n*4*beat;set[0][1].forEach(m=>epiano(e,m,2.6));pluck(e,27,"fb",{dur:2.4});return n*4*beat+2.8;}
DEMOS.triads=t=>chordDemo(t,TRI,false);DEMOS.ext=t=>chordDemo(t,EXT,false);DEMOS.neo=t=>chordDemo(t,EXT,true);

/* ================= 调度 ================= */
const GAIN={call:1.05,"mel-plain":.8,"mel-run":.9,"clap-13":1.8,"clap-24":1.8,"mt-root":.85,"mt-jam":.85,stax:1.4,"fk-drum":1.4,"fk-bass":1.4,"fk-gtr":1.4,"fk-full":1.4,"ghost-off":1.5,"ghost-on":1.5,break:1.4,finger:1.7,slap:1.3,clav:1.3,philly:1.4,triads:1.6,ext:1.6,neo:1.6};
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
function runDemo(name,btn){newBus();bus.gain.value=GAIN[name]||1;if(["call","mel-plain","mel-run","clap-13","clap-24","mt-root","mt-jam","philly"].includes(name))addRoom(2,.35);setActive(btn);const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;later(()=>clearActive(),d+.4);}
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);

/* ================= 推荐曲目：45 转单曲 ================= */
const SONGS=[
  {side:"A",q:"Ray Charles What'd I Say",title:"What'd I Say",by:"Ray Charles",yr:"1959",style:"R&B · 灵魂乐前夜",
   txt:"据说是在一场演出快结束、歌已经唱完的时候即兴拉长出来的。后半段 Ray Charles 和女声合唱 The Raelettes 的一问一答，把教堂的气氛搬进了舞厅。",
   listen:["后半段的呼应，对照图 2","电钢琴的切分 riff"]},
  {side:"A",q:"Sam Cooke A Change Is Gonna Come",title:"A Change Is Gonna Come",by:"Sam Cooke",yr:"1964",style:"灵魂乐",
   txt:"福音歌手出身的 Sam Cooke 最沉重的一首歌，弦乐和圆号开场，嗓音克制而深情。后来成了民权运动最常被提起的歌曲之一。",
   listen:["他怎样从轻声唱到用力唱","和同年的摇滚乐比一比"]},
  {side:"A",q:"The Temptations My Girl",title:"My Girl",by:"The Temptations",yr:"1964",style:"Motown",
   txt:"Smokey Robinson 写的 Motown 经典。开头那条贝斯线和吉他 riff，几乎人人都能哼出来。",
   listen:["开头的贝斯线，对照 Lab 03","四个人的和声怎样回应主唱"]},
  {side:"A",q:"James Brown Papa's Got a Brand New Bag",title:"Papa's Got a Brand New Bag",by:"James Brown",yr:"1965",style:"灵魂乐 → 放克",
   txt:"常被看作放克的起点之一。吉他短促地切，铜管短促地刺，一切都在为节奏服务。",
   listen:["跟着第一拍点头，对照图 6","吉他在“做”什么？"]},
  {side:"A",q:"Aretha Franklin Respect",title:"Respect",by:"Aretha Franklin",yr:"1967",style:"灵魂乐",
   txt:"原本是 Otis Redding 的歌，Aretha 重新编排，加入了拼写出来的副歌和姐妹们的和声，唱成了一首关于尊严的宣言。",
   listen:["和声女声怎样和她呼应","找一处转音"]},
  {side:"A",q:"Otis Redding Dock of the Bay",title:"(Sittin' On) The Dock of the Bay",by:"Otis Redding",yr:"1968",style:"南方灵魂乐",
   txt:"Otis Redding 去世前几天录下的歌，海浪和海鸥的声音、口哨的结尾，安静得不像他平常的风格。成为美国史上第一首在歌手去世后登上榜首的单曲。",
   listen:["Steve Cropper 的吉他","和 Lab 03 的 Stax 片段比，哪里像？"]},
  {side:"B",q:"Sly and the Family Stone Thank You Falettinme Be Mice Elf Agin",title:"Thank You (Falettinme Be Mice Elf Agin)",by:"Sly & the Family Stone",yr:"1969",style:"放克",
   txt:"Larry Graham 的击弦贝斯在这首歌里非常突出。整首歌几乎只有一个和弦的律动。",
   listen:["贝斯的“嘭—啪”，对照 Lab 06","全曲有几个和弦？"]},
  {side:"B",q:"James Brown Funky Drummer",title:"Funky Drummer",by:"James Brown",yr:"1970",style:"放克",
   txt:"中间有一段 Clyde Stubblefield 的鼓独奏，后来成为被采样最多的鼓点之一。",
   listen:["找到只剩鼓的那段 break","对照 Lab 05 的鬼音"]},
  {side:"B",q:"Marvin Gaye What's Going On",title:"What's Going On",by:"Marvin Gaye",yr:"1971",style:"灵魂乐",
   txt:"同名专辑的开场曲，以一种温柔的方式问时代的问题。萨克斯、多层叠录的人声和松弛的律动，是灵魂乐走向“作者”的标志。",
   listen:["开头的人声和萨克斯","贝斯手 James Jamerson 又出现了"]},
  {side:"B",q:"Stevie Wonder Superstition",title:"Superstition",by:"Stevie Wonder",yr:"1972",style:"放克",
   txt:"开头那段克拉维内特 riff 由 Stevie Wonder 自己演奏，鼓也是他打的。",
   listen:["克拉维内特，对照 Lab 06","铜管什么时候进来？"]},
  {side:"B",q:"Parliament Give Up the Funk Tear the Roof off the Sucker",title:"Give Up the Funk (Tear the Roof off the Sucker)",by:"Parliament",yr:"1976",style:"P-Funk",
   txt:"George Clinton 的“外太空放克”。合唱般的大合唱、厚重的低音合成器和一刻不停的律动。",
   listen:["数一数有多少层人声","节奏为什么让人想一直跳？"]},
  {side:"B",q:"陶喆 爱很简单",title:"爱很简单",by:"陶喆",yr:"1997",style:"华语 R&B",
   txt:"陶喆首张专辑中的歌。他把美国 R&B 和灵魂乐的和声、转音和律动带进华语流行，影响了之后一整代歌手。",
   listen:["和声编排里的灵魂乐痕迹","找一处转音，对照图 3"]}
];
const ICON="M8 5v14l11-7z";
SONGS.forEach((s,i)=>{
  const el=document.createElement("div");el.className="song";
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<div class="disc" style="--h:${[18,40,170,8,30,190,350,25,160,45,280,10][i]}" aria-hidden="true"><b>${s.side}-${(i%6)+1}</b><i>${s.yr}</i></div><div class="meta"><span class="title">${s.title}</span><span class="by">${s.by}</span><div class="pmeta"><span class="yr">${s.yr}</span><span class="style">${s.style}</span></div></div>
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
function pill(g,x,y,w,t,c,sub){S(g,"rect",{x:x-w/2,y:y-17,width:w,height:34,rx:17,style:c?FILL(c):"",class:c?"":"sv-card"});if(!c)S(g,"rect",{x:x-w/2,y:y-17,width:w,height:34,rx:17,class:"sv-l"});S(g,"text",{x,y:y+5,"text-anchor":"middle",class:c?"sv-on":"sv-t",style:"font-size:13px;font-weight:900"},t);}
/* 图 1 家谱 */
(()=>{const g=document.getElementById("tree-fig");if(!g)return;
  const N={gos:[80,80,"福音音乐"],rb:[80,200,"节奏布鲁斯"],soul:[230,140,"灵魂乐","red"],mt:[380,50,"Motown"],stax:[380,110,"Stax · 南方"],phil:[380,170,"费城灵魂乐"],funk:[380,250,"放克","red"],
    disco:[570,50,"迪斯科 → C3"],hh:[570,120,"嘻哈 → C2"],rnb:[570,190,"当代 R&B"],neo:[570,260,"新灵魂乐"]};
  const E=[["gos","soul"],["rb","soul"],["soul","mt"],["soul","stax"],["soul","phil"],["soul","funk"],["phil","disco"],["funk","disco"],["funk","hh"],["mt","rnb"],["funk","rnb"],["funk","neo"]];
  E.forEach(([a,b])=>{const [x1,y1]=N[a],[x2,y2]=N[b],sx=x1+62,ex=x2-62,mx=(sx+ex)/2;S(g,"path",{d:`M ${sx} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${ex} ${y2}`,class:"sv-l","stroke-width":1.5,fill:"none"});});
  Object.values(N).forEach(([x,y,t,c])=>pill(g,x,y,124,t,c||null));
  S(g,"text",{x:570,y:310,"text-anchor":"middle",class:"sv-ts"},"本书后面的章节");
})();
/* 图 2 呼应 */
(()=>{const g=document.getElementById("call-fig");if(!g)return;const ev=[[0,1],[1.6,0],[2.8,1],[4.2,0],[5.2,1],[6.3,0],[7,1],[7.7,0],[8.25,1],[8.75,0],[9.15,1],[9.5,0],[9.8,1]];const x0=110,sc=52;
  S(g,"text",{x:20,y:70,class:"sv-t",style:TB},"主唱");S(g,"text",{x:20,y:150,class:"sv-t",style:TB},"合唱");S(g,"line",{x1:x0,y1:110,x2:640,y2:110,class:"sv-lline"});
  ev.forEach(([x,who],i)=>{const w=Math.max(18,(i<ev.length-1?ev[i+1][0]-x:.8)*sc*.85),y=who?48:128;S(g,"rect",{x:x0+x*sc,y,width:w,height:30,rx:15,style:FILL(who?"red":"denim"),opacity:.9});});
  S(g,"text",{x:x0,y:196,class:"sv-ts"},"开始：一句一句，间隔宽");S(g,"text",{x:640,y:196,"text-anchor":"end",class:"sv-ts"},"高潮：越来越密，几乎重叠");
})();
/* 图 3 转音 */
(()=>{const g=document.getElementById("mel-fig");if(!g)return;const y=(m)=>150-(m-60)*7;
  S(g,"text",{x:20,y:40,class:"sv-t",style:TB},"一字一音");S(g,"text",{x:20,y:140,class:"sv-t",style:TB},"转音");
  [["我",63],["的",65],["心",67]].forEach(([c,m],i)=>{const x=150+i*60;S(g,"circle",{cx:x,cy:y(m)-90,r:9,style:FILL("ink")});S(g,"text",{x,y:y(m)-66,"text-anchor":"middle",class:"sv-t",style:"font-size:14px;font-weight:700"},c);});
  const R=[67,70,72,70,67,65,63],xs=R.map((m,i)=>300+i*44);let d="";R.forEach((m,i)=>{d+=(i?" L ":"M ")+`${xs[i]} ${y(m)+20}`;});S(g,"path",{d,class:"sv-lr","stroke-width":2.4,fill:"none"});
  R.forEach((m,i)=>S(g,"circle",{cx:xs[i],cy:y(m)+20,r:8,style:FILL("red")}));S(g,"path",{d:`M ${xs[0]-6} 214 Q ${(xs[0]+xs[6])/2} 228 ${xs[6]+6} 214`,class:"sv-l","stroke-width":1.4,fill:"none"});S(g,"text",{x:(xs[0]+xs[6])/2,y:206,"text-anchor":"middle",class:"sv-t",style:"font-size:15px;font-weight:900"},"啊——");
})();
/* 图 4 拍手 */
(()=>{const g=document.getElementById("clap-fig");if(!g)return;[["拍在 1、3",[0,2],0],["拍在 2、4",[1,3],1]].forEach(([n,on,r])=>{const y=30+r*80;S(g,"text",{x:20,y:y+30,class:"sv-t",style:TB},n);
  for(let q=0;q<4;q++){const x=160+q*112,h=on.includes(q);S(g,"rect",{x,y,width:100,height:48,rx:24,style:h?FILL(r?"red":"ink"):"",class:h?"":"sv-card"});if(!h)S(g,"rect",{x,y,width:100,height:48,rx:24,class:"sv-l"});S(g,"text",{x:x+50,y:y+31,"text-anchor":"middle",class:h?"sv-on":"sv-m",style:"font-size:16px;font-weight:900"},h?`${q+1} 👏`:String(q+1));}});})();
/* 图 5 Motown 生产线 */
(()=>{const g=document.getElementById("line-fig");if(!g)return;const B=[["词曲团队","写歌、分配给歌手"],["录音乐队","The Funk Brothers"],["歌手录唱","在地下室录音室"],["质量控制会","每周投票"],["艺人发展","台风、礼仪、舞步"],["发行","“年轻美国之声”"]];
  B.forEach(([a,b],i)=>{const row=i<3?0:1,col=row?5-i:i,x=40+col*210,y=60+row*120;S(g,"rect",{x,y,width:180,height:66,rx:33,style:i===5?FILL("red"):"",class:i===5?"":"sv-card"});if(i!==5)S(g,"rect",{x,y,width:180,height:66,rx:33,class:"sv-l","stroke-width":1.5});
    S(g,"text",{x:x+90,y:y+30,"text-anchor":"middle",class:i===5?"sv-on":"sv-t",style:"font-size:15px;font-weight:900"},a);S(g,"text",{x:x+90,y:y+50,"text-anchor":"middle",class:i===5?"sv-on":"sv-m",style:"font-size:11.5px"},b);});
  arrow(g,222,93,248,93);arrow(g,432,93,458,93);arrow(g,550,128,550,178);arrow(g,458,213,432,213);arrow(g,248,213,222,213);
  S(g,"text",{x:40,y:30,class:"sv-ts"},"Hitsville U.S.A. · 底特律 · 1960 年代");
})();
/* 图 6 放克格子 */
(()=>{const g=document.getElementById("funk-fig");if(!g)return;const x0=110,cw=33,lh=26;
  const L=[["底鼓",[0,3,10,11],[],"ink"],["军鼓",[4,12],[7,9,14],"ink"],["吉他",FKG,[0,1,4,5,9,12,13,15],"denim"],["贝斯",FKB.map(x=>x[0]),[],"red"],["铜管",[6,11,14],[],"mustard"]];
  S(g,"rect",{x:x0-3,y:30,width:cw,height:L.length*(lh+10)+12,rx:10,style:FILL("mustard"),opacity:.3});S(g,"text",{x:x0+cw/2-3,y:22,"text-anchor":"middle",class:"sv-r",style:"font-family:var(--font-wood);font-size:15px"},"一");
  for(let k=0;k<16;k++)if(k%4===0&&k)S(g,"text",{x:x0+k*cw+cw/2-3,y:22,"text-anchor":"middle",class:"sv-m"},String(k/4+1));
  L.forEach(([n,on,soft,c],li)=>{const y=38+li*(lh+10);S(g,"text",{x:x0-12,y:y+18,"text-anchor":"end",class:"sv-t",style:"font-size:13px;font-weight:700"},n);
    for(let k=0;k<16;k++){const h=on.includes(k),sf=soft.includes(k);S(g,"rect",{x:x0+k*cw,y,width:cw-6,height:lh,rx:8,style:h?FILL(c):sf?FILL(c):"",class:h||sf?"":"sv-card",opacity:sf?.28:1});if(!h&&!sf)S(g,"rect",{x:x0+k*cw,y,width:cw-6,height:lh,rx:8,class:"sv-lline"});}});
  S(g,"text",{x:x0,y:238,class:"sv-ts"},"吉他：深色是重音，浅色是闷住的“嚓”；军鼓：浅色是鬼音");
  S(g,"text",{x:x0,y:262,class:"sv-ts"},"每件乐器都很简单，但它们几乎从不在同一格里撞车，只在“一”上会合");
})();
/* 图 7 叠三度 */
(()=>{const g=document.getElementById("stack-fig");if(!g)return;const N=[["C","根音"],["E♭","三度"],["G","五度"],["B♭","七度"],["D","九度"],["F","十一度"]],names=["","","Cm 三和弦","Cm7 七和弦","Cm9 九和弦","Cm11 十一和弦"];
  N.forEach(([n,r],i)=>{const y=220-i*34,c=i<3?"ink":i===3?"denim":i===4?"mustard":"red";S(g,"rect",{x:200,y,width:120,height:28,rx:14,style:FILL(c)});S(g,"text",{x:260,y:y+19,"text-anchor":"middle",class:"sv-on",style:"font-size:14px;font-weight:900"},n);S(g,"text",{x:190,y:y+19,"text-anchor":"end",class:"sv-m"},r);
    if(i>=2){S(g,"path",{d:`M 330 ${y+14} L 352 ${y+14}`,class:"sv-l"});S(g,"text",{x:360,y:y+19,class:i===2?"sv-t":"sv-r",style:"font-size:13px;font-weight:700"},names[i]);}});
  S(g,"text",{x:500,y:120,class:"sv-ts"},"每层隔一个音");S(g,"text",{x:500,y:140,class:"sv-ts"},"（三度）往上叠");S(g,"text",{x:500,y:170,class:"sv-ts"},"越往上，颜色越多");
})();
/* 图 8 时间线 */
(()=>{const g=document.getElementById("time-fig");if(!g)return;const X=y=>50+(y-1952)*12.4;S(g,"line",{x1:40,y1:110,x2:650,y2:110,class:"sv-l","stroke-width":2});
  const E=[[1954,"《I Got a Woman》",-1],[1959,"Motown 成立",1],[1965,"放克萌芽",-1],[1967,"《Respect》",1],[1970,"《Funky Drummer》",-1],[1971,"《What's Going On》",1],[1974,"费城灵魂",-1],[1997,"陶喆首张专辑",1],[2000,"新灵魂乐",-1]];
  E.forEach(([y,t,s],i)=>{const x=X(y);S(g,"circle",{cx:x,cy:110,r:7,style:FILL(i%3===0?"red":i%3===1?"mustard":"denim")});S(g,"text",{x,y:110+s*26+(s>0?8:0),"text-anchor":"middle",class:"sv-t",style:"font-size:12px;font-weight:700"},t);S(g,"text",{x,y:110+s*44+(s>0?8:0),"text-anchor":"middle",class:"sv-m",style:"font-size:10.5px"},String(y));});
})();
