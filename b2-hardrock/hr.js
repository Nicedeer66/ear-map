/* ================= 硬摇滚：补充 ================= */
INST.pmu={bright:.85,decay:.999,dur:1.2,vol:.17,drive:14,lp:1500};
function tom(t,f=120,v=1){const a=A(),o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(f*1.6,t);o.frequency.exponentialRampToValueAtTime(f,t+.08);g.gain.setValueAtTime(.6*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.4);o.connect(g).connect(bus);o.start(t);o.stop(t+.45);track(o);}
function clap(t,v=1){const a=A();[0,.011,.022].forEach((d,i)=>{const n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=1300;f.Q.value=.9;const g=a.createGain();g.gain.setValueAtTime(.45*v*(i===2?1:.6),t+d);g.gain.exponentialRampToValueAtTime(.001,t+d+(i===2?.14:.02));n.connect(f).connect(g).connect(bus);n.start(t+d);n.stop(t+d+.16);track(n);});}
function makeIR(sec,gated){const a=A(),len=Math.floor(a.sampleRate*sec),b=a.createBuffer(2,len,a.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++){const x=i/len;d[i]=(Math.random()*2-1)*(gated?(x<.85?1:(1-x)/.15):Math.pow(1-x,2.2));}}return b;}
function addRoom(sec,amt){const a=A(),cv=a.createConvolver();cv.buffer=makeIR(sec,false);const g=a.createGain();g.gain.value=amt;bus.connect(cv).connect(g).connect(master);}
function gatedChain(){const a=A(),inp=a.createGain(),cv=a.createConvolver();cv.buffer=makeIR(.32,true);const wet=a.createGain();wet.gain.value=.9;inp.connect(cv).connect(wet);const out=a.createGain();inp.connect(out);wet.connect(out);return [inp,out];}
/* 哈蒙德风琴 */
function hammond(t,midi,dur,o={}){const a=A(),f=mf(midi),g=a.createGain(),v=(o.vol||1)*.09;
  [[1,.5],[2,.35],[3,.22],[4,.18],[6,.08],[8,.1]].forEach(([h,am])=>{const x=a.createOscillator();x.type="sine";x.frequency.value=f*h;const xg=a.createGain();xg.gain.value=am;x.connect(xg).connect(g);x.start(t);x.stop(t+dur+.05);track(x);});
  const p=a.createOscillator();p.type="sine";p.frequency.value=f*3;const pg=a.createGain();pg.gain.setValueAtTime(.35,t);pg.gain.exponentialRampToValueAtTime(.001,t+.25);p.connect(pg).connect(g);p.start(t);p.stop(t+.3);track(p);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.setValueAtTime(v,t+dur-.03);g.gain.linearRampToValueAtTime(0,t+dur);g.connect(bus);}
function leslieChain(t,speed){const a=A(),inp=a.createGain(),trem=a.createGain();trem.gain.value=.75;const l1=a.createOscillator(),lg1=a.createGain();l1.frequency.value=speed;lg1.gain.value=.3;l1.connect(lg1).connect(trem.gain);
  const dl=a.createDelay(.05);dl.delayTime.value=.006;const l2=a.createOscillator(),lg2=a.createGain();l2.frequency.value=speed;lg2.gain.value=.0025;l2.connect(lg2).connect(dl.delayTime);
  const pan=a.createStereoPanner();const l3=a.createOscillator();l3.frequency.value=speed;const lg3=a.createGain();lg3.gain.value=.6;l3.connect(lg3).connect(pan.pan);
  inp.connect(dl).connect(trem).connect(pan);[l1,l2,l3].forEach(x=>{x.start(t);x.stop(t+20);track(x);});return [inp,pan];}
function driveChain(amt){const a=A(),inp=a.createGain();inp.gain.value=2.2;const sh=a.createWaveShaper();sh.curve=shaper(amt);const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=3200;const out=a.createGain();out.gain.value=.35;inp.connect(sh).connect(lp).connect(out);return [inp,out];}
function through([inp,out],fn){const keep=bus;out.connect(keep);bus=inp;try{fn();}finally{bus=keep;}}

/* ================= 示例 ================= */
const DEMOS={};
const RS=[[40,40,43,40,45,40,46,45],[40,40,43,40,47,45,43,45]];
function playRiff(t,beat,sw,inst="cr",o={}){RS.forEach((bar,bi)=>bar.forEach((m,k)=>{const tt=swing8(t+bi*4*beat,beat,k,sw);pluck(tt,m,inst,{vol:1.1,mute:beat*.46});pluck(tt+.003,m+12,inst,{vol:.55,mute:beat*.46});if(o.bass!==false)pluck(tt,m-12,"bass",{vol:.9,mute:beat*.42});}));}
function beatBar(tb,beat,sw,o={}){for(let k=0;k<8;k++)hat(swing8(tb,beat,k,sw),k%2?.5:.9);kick(tb,o.kv||1);kick(swing8(tb,beat,5,sw),.7);kick(tb+2*beat,o.kv||1);snare(tb+beat,o.sv||1.1);snare(tb+3*beat,o.sv||1.1);}
function fill(tb,beat){[[0,200],[.5,170],[1,140],[1.5,110]].forEach(([b,f])=>tom(tb+(2+b)*beat,f,1));}
/* power trio */
DEMOS.trio=t=>{const beat=bt(108),CH=["E","E","A","A","E","B","A","E"];
  CH.forEach((ch,i)=>{const tb=t+i*4*beat,r=rootNear(ch,28)+(rootNear(ch,28)<31?12:0);
    const line=i%2?[0,3,5,7,10,7,5,3]:[0,0,12,10,7,5,3,2];line.forEach((x,k)=>pluck(swing8(tb,beat,k,true),r+x,"bass",{vol:1.05,mute:beat*.42}));
    if(i%4===3){for(let k=0;k<4;k++)hat(tb+k*beat,.8);kick(tb);snare(tb+beat);fill(tb,beat);}else beatBar(tb,beat,true);
    if(i<4)[[0,52],[.5,52],[.67,55],[1,57],[1.5,58],[1.67,57],[2,55],[2.5,52]].forEach(([b,m])=>pluck(tb+b*beat,m+(ch==="A"?5:0),"cr",{vol:1,mute:beat*.42}));
    else [[[0,76,1,{from:-2,glide:.2,vib:1}],[1,74,.5],[1.5,71,.5],[2,74,1,{from:-1}],[3,71,1]],[[0,78,1.5,{from:-2,glide:.25,vib:1}],[1.5,76,.5],[2,74,.5],[2.5,71,.5],[3,69,1]],[[0,79,.5],[.5,76,.5],[1,74,.5],[1.5,71,.5],[2,69,1,{from:-2,glide:.2}],[3,67,1]],[[0,64,3,{from:-2,glide:.3,vib:1}]]][i-4].forEach(([b,m,d,o])=>pluck(tb+b*beat,m,"ld",Object.assign({vol:1.1,dur:d*beat+.3},o||{})));});
  const end=t+32*beat;crash(end);kick(end);strum(end,[40,47,52],"cr",{vol:1,dur:2});pluck(end,28,"bass",{vol:1.1});return 32*beat+2.2;};
/* 三种 riff */
DEMOS["riff-single"]=t=>{const beat=bt(112);for(let r=0;r<2;r++){playRiff(t+r*8*beat,beat,false);for(let q=0;q<2;q++)beatBar(t+r*8*beat+q*4*beat,beat,false);}const e=t+16*beat;crash(e);strum(e,[40,47,52],"cr",{vol:1,dur:2});return 16*beat+2;};
DEMOS["riff-power"]=t=>{const beat=bt(116),H=[[[0,"E"],[.75,"E"],[1.5,"G"],[2.5,"A"],[3,"A"],[3.5,"G"]],[[0,"E"],[.75,"E"],[1.5,"D"],[2,"D"],[2.5,"C"],[3,"B"]]];
  for(let r=0;r<2;r++)H.forEach((bar,bi)=>{const tb=t+(r*2+bi)*4*beat;bar.forEach(([b,ch],k)=>{const root=rootNear(ch,40),d=(bar[k+1]?bar[k+1][0]:4)-b;strum(tb+b*beat,[root,root+7,root+12],"pk",{vol:1.1,mute:beat*d*.9,spread:.004});pluck(tb+b*beat,root-12,"bass",{vol:1,mute:beat*d*.9});});beatBar(tb,beat,false);});
  const e=t+16*beat;crash(e);strum(e,[40,47,52],"pk",{vol:1.2,dur:2});return 16*beat+2;};
DEMOS["riff-call"]=t=>{const beat=bt(104);for(let r=0;r<4;r++){const tc=t+r*4*beat;voiceLine(tc,beat,[[0,76,.5],[.5,79,.5],[1,81,.75],[1.75,79,.25]].map(([b,m,d])=>[b,m-(r%2?2:0),d]),-12,{vol:1,vib:20});
  const ta=tc+2*beat;[40,43,45,46,45,43,40,47].forEach((m,k)=>{pluck(ta+k*beat/4,m,"cr",{vol:1.1,mute:beat*.24});pluck(ta+k*beat/4,m-12,"bass",{vol:.9,mute:beat*.24});});kick(ta);snare(ta+beat);kick(ta+1.5*beat,.7);crash(ta,.5);}
  return 16*beat+.8;};
/* 闷音 */
function pmDemo(t,pm){const beat=bt(126);for(let r=0;r<4;r++){const tb=t+r*4*beat;for(let k=0;k<6;k++)strum(tb+k*beat/2,[40,47,52],pm?"pmu":"pk",{vol:pm?1.4:1,mute:pm?.08:beat*.45,spread:.003});
  [[3,r%2?"G":"D"],[3.5,r%2?"A":"E"]].forEach(([b,ch])=>{const root=rootNear(ch,40);strum(tb+b*beat,[root,root+7,root+12],"pk",{vol:1.1,mute:beat*.48,spread:.004});});
  for(let k=0;k<8;k++)pluck(tb+k*beat/2,28,"bass",{vol:.9,mute:beat*.4});beatBar(tb,beat,false);}return 16*beat+.6;}
DEMOS["pm-off"]=t=>pmDemo(t,false);DEMOS["pm-on"]=t=>pmDemo(t,true);
/* 直与晃 */
function feelDemo(t,sw){const beat=bt(116);for(let r=0;r<2;r++){playRiff(t+r*8*beat,beat,sw);for(let q=0;q<2;q++)beatBar(t+r*8*beat+q*4*beat,beat,sw);}return 16*beat+.6;}
DEMOS["hr-straight"]=t=>feelDemo(t,false);DEMOS["hr-shuffle"]=t=>feelDemo(t,true);
/* 房间 */
function roomGroove(t){const beat=bt(84);for(let b=0;b<4;b++){const tb=t+b*4*beat;for(let k=0;k<8;k++)hat(tb+k*beat/2,k%2?.4:.7);kick(tb,1.2);kick(tb+.5*beat,.8);kick(tb+2.5*beat,1);snare(tb+beat,1.3);snare(tb+3*beat,1.3);if(b===3)fill(tb,beat);}crash(t+16*beat);kick(t+16*beat,1.2);return 16*beat+2.6;}
DEMOS["drums-dry"]=roomGroove;DEMOS["drums-big"]=roomGroove;
/* 嘶吼 */
DEMOS.wail=t=>{strum(t,[45,52,57],"pk",{vol:1.1,dur:3});pluck(t,33,"bass",{vol:1,dur:3});crash(t,.8);
  through(driveChain(3),()=>{voice(t+.2,76,.5,{from:-3,glide:.12,vibDepth:10,vol:.8});voice(t+.75,79,2.4,{from:-2,glide:.2,fall:-5,vibDepth:45,vol:.9});voice(t+3.4,81,1.8,{from:-1,glide:.1,fall:-12,vibDepth:50,vol:.9});});
  strum(t+3.2,[45,52,57],"pk",{vol:1,dur:2.2});crash(t+3.2,1);kick(t+3.2);return 5.6;};
/* 风琴 */
const ORG=[["E",[64,67,71,76]],["G",[67,71,74,79]],["A",[69,72,76,81]],["E",[64,67,71,76]]];
function organDemo(t,mode){const beat=bt(110);const play=()=>ORG.forEach(([ch,ns],i)=>{const tb=t+i*4*beat;ns.forEach(m=>hammond(tb,m-12,beat*1.9));ns.forEach(m=>hammond(tb+2*beat,m-12,beat*.45));ns.forEach(m=>hammond(tb+2.5*beat,m-12,beat*1.4));hammond(tb,rootNear(ch,40),4*beat*.98,{vol:.9});
    [[3.5,ns[3]+12],[3.75,ns[2]+12]].forEach(([b,m])=>hammond(tb+b*beat,m-12,beat*.24));});
  if(mode==="clean")play();else if(mode==="leslie")through(leslieChain(t,6.2),play);else{const lc=leslieChain(t,6.2),dc=driveChain(6);lc[1].connect(dc[0]);const keep=bus;dc[1].connect(keep);bus=lc[0];try{play();}finally{bus=keep;}}
  if(mode==="drive"){for(let i=0;i<4;i++){const tb=t+i*4*beat;beatBar(tb,beat,false,{sv:.9});pluck(tb,rootNear(ORG[i][0],28)+12,"bass",{vol:1,dur:2});}}
  return 16*beat+.6;}
DEMOS["organ-clean"]=t=>organDemo(t,"clean");DEMOS["organ-leslie"]=t=>organDemo(t,"leslie");DEMOS["organ-drive"]=t=>organDemo(t,"drive");
/* 点弦与俯冲 */
DEMOS.tapping=t=>{const s=.095,T=[["Am",[81,72,76]],["F",[81,72,77]],["G",[83,74,79]],["E",[80,71,76]]];let x=t;
  T.forEach(([ch,tri])=>{pluck(x,rootNear(ch,28)+12,"bass",{vol:1,dur:24*s});kick(x,.8);for(let k=0;k<24;k++)pluck(x+k*s,tri[k%3],"ld",{vol:k%3===0?1.1:.85,mute:s*1.05});x+=24*s;});
  pluck(x,76,"ld",{vol:1.2,dur:2,vib:1,vibAt:.3});pluck(x,28,"bass",{vol:1,dur:2});crash(x);return x-t+2.2;};
DEMOS.dive=t=>{const a=A(),I=INST.ld,s=a.createBufferSource();s.buffer=ksBuf(88,4,I.bright,I.decay);const g=a.createGain();g.gain.value=I.vol*1.3;
  const l=a.createOscillator(),lg=a.createGain();l.frequency.value=6;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(.012,t+.5);lg.gain.setValueAtTime(0,t+.9);l.connect(lg).connect(s.playbackRate);l.start(t);l.stop(t+4);track(l);
  s.playbackRate.setValueAtTime(1,t);s.playbackRate.setValueAtTime(1,t+.9);s.playbackRate.exponentialRampToValueAtTime(.12,t+3.2);
  const sh=a.createWaveShaper();sh.curve=shaper(I.drive);const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=I.lp;s.connect(g).connect(sh).connect(lp).connect(bus);s.start(t);s.stop(t+4);track(s);
  crash(t+3.3,1.2);kick(t+3.3);strum(t+3.3,[40,47,52],"pk",{vol:1.2,dur:2});return 5.4;};
/* 对讲盒 */
const VOW={a:[730,1090,2440],o:[570,840,2410],i:[300,2250,3010],u:[300,870,2240],e:[530,1840,2480]};
DEMOS.talkbox=t=>{const a=A(),inp=a.createGain(),out=a.createGain();out.gain.value=2.2;const bps=[0,1,2].map(j=>{const b=a.createBiquadFilter();b.type="bandpass";b.Q.value=[7,9,11][j];const gg=a.createGain();gg.gain.value=[1,.7,.35][j];inp.connect(b).connect(gg).connect(out);return b;});
  const seq=[[0,"o"],[.35,"a"],[.9,"i"],[1.3,"a"],[1.9,"o"],[2.5,"u"],[2.9,"a"],[3.5,"e"],[3.9,"a"],[4.6,"o"]];
  seq.forEach(([s,v])=>bps.forEach((b,j)=>{b.frequency.setValueAtTime(b.frequency.value||VOW[v][j],t);b.frequency.linearRampToValueAtTime(VOW[v][j],t+s+.08);}));
  const keep=bus;out.connect(keep);bus=inp;try{[[0,64,1.3],[1.3,67,.6],[1.9,69,1],[2.9,67,.6],[3.5,64,.4],[3.9,62,.7],[4.6,64,1.4]].forEach(([s,m,d])=>pluck(t+s,m,"ld",{vol:1.4,dur:d+.25,from:-1,glide:.08}));}finally{bus=keep;}
  const beat=bt(104);for(let b=0;b<3;b++){const tb=t+b*4*beat;beatBar(tb,beat,false,{sv:.8,kv:.8});strum(tb,[40,47,52],"cr",{vol:.5,dur:4*beat});pluck(tb,28,"bass",{vol:.9,dur:4*beat});}return 6.4;};
/* 跺跺拍 */
DEMOS.stomp=t=>{const beat=bt(81);let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  for(let b=0;b<6;b++){const tb=t+b*4*beat;[0,.5,2,2.5].forEach(x=>{for(let k=0;k<5;k++){stomp(tb+x*beat+rnd()*.025);}kick(tb+x*beat,.8);});[1,3].forEach(x=>{for(let k=0;k<6;k++)clap(tb+x*beat+rnd()*.03,.55);});}
  const ch=t+4*4*beat;[52,56,59,64].forEach((m,i)=>voice(ch,m,8*beat,{from:-2,glide:.3,vibDepth:25,vowel:"o",vol:.45}));[52,59].forEach(m=>voice(ch+.04,m-12,8*beat,{from:-2,glide:.3,vibDepth:18,vowel:"o",vol:.45}));
  const e=t+24*beat;stomp(e);kick(e,1.2);clap(e+beat);return 24*beat+2.8;};
/* 强力抒情曲 */
const BC=["C","G","Am","F"];
const BV=[[[0,64,1],[1,67,1],[2,72,1.5],[3.5,71,.5]],[[0,71,2],[2,67,1],[3,69,1]],[[0,72,1.5],[1.5,71,.5],[2,69,1],[3,67,1]],[[0,65,1],[1,67,1],[2,69,2]]];
const BCH=[[[0,76,2],[2,74,1],[3,72,1]],[[0,74,1.5],[1.5,72,.5],[2,71,2]],[[0,72,1],[1,74,1],[2,76,1],[3,79,1]],[[0,77,3],[3,76,1]]];
DEMOS.ballad=t=>{const beat=bt(76);
  BC.forEach((ch,i)=>{const tb=t+i*4*beat,c=place(chordPcs(ch),52,72);[c[0],c[1],c[2],c[3]||c[0]+12,c[2],c[1],c[2],c[3]||c[0]+12].forEach((m,k)=>pluck(tb+k*beat/2,m,"el",{vol:.75,dur:1.4}));pluck(tb,rootNear(ch,28)+12,"bass",{vol:.6,dur:4*beat});voiceLine(tb,beat,BV[i],-12,{vol:.9,vib:20});});
  const t2=t+16*beat;crash(t2,1.1);BC.forEach((ch,i)=>{const tb=t2+i*4*beat;powerBar(tb,beat,ch,"pk",{vol:.8,mute:.9});bass8(tb,beat,ch);beatBar(tb,beat,false,{sv:1.2});voiceLine(tb,beat,BCH[i],-12,{vol:1,vib:26});});
  const t3=t2+16*beat;crash(t3);[[[0,84,1,{from:-2,glide:.25,vib:1}],[1,83,.5],[1.5,81,.5],[2,79,2,{vib:1}]],[[0,83,1.5,{from:-1}],[1.5,81,.5],[2,79,1],[3,74,1]]].forEach((bar,i)=>{const tb=t3+i*4*beat,ch=["C","G"][i];powerBar(tb,beat,ch,"pk",{vol:.7,mute:.9});bass8(tb,beat,ch);beatBar(tb,beat,false,{sv:1.2});bar.forEach(([b,m,d,o])=>pluck(tb+b*beat,m,"ld",Object.assign({vol:1.15,dur:d*beat+.4},o||{})));});
  const e=t3+8*beat;crash(e,1.2);kick(e);strum(e,[48,55,60,64],"pk",{vol:1,dur:2.6});pluck(e,36,"bass",{vol:1,dur:2.6});pluck(e,84,"ld",{vol:1.1,dur:2.6,vib:1});return 40*beat+2.8;};
/* 1980 年代 */
function pad(t,notes,dur){const a=A();notes.forEach(m=>[-8,0,8].forEach(dt=>{const o=a.createOscillator();o.type="sawtooth";o.frequency.value=mf(m);o.detune.value=dt;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=1800;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.018,t+.3);g.gain.setValueAtTime(.018,t+dur-.2);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(lp).connect(g).connect(bus);o.start(t);o.stop(t+dur+.05);track(o);}));}
DEMOS.hair=t=>{const beat=bt(122),CH=["A","D","F#m","E","A","D","E","E"],gc=gatedChain();
  CH.forEach((ch,i)=>{const tb=t+i*4*beat,c=place(chordPcs(ch),57,72).slice(0,3),r=rootNear(ch,40);
    pad(tb,c,4*beat);for(let k=0;k<8;k++){strum(tb+k*beat/2,[r,r+7],"pmu",{vol:1.2,mute:.09,spread:.003});pluck(tb+k*beat/2,rootNear(ch,28)+(rootNear(ch,28)<31?12:0),"bass",{vol:.9,mute:beat*.42});hat(tb+k*beat/2,k%2?.5:.8);}
    kick(tb,1.1);kick(tb+2*beat,1.1);kick(tb+2.5*beat,.7);through(gc,()=>{snare(tb+beat,1.2);snare(tb+3*beat,1.2);});
    if(i>=4)[[0,81,1],[1,80,.5],[1.5,78,.5],[2,76,1.5],[3.5,78,.5]].forEach(([b,m,d])=>pluck(tb+b*beat,m+(i===6?-2:0),"ld",{vol:1,dur:d*beat+.3,from:d>1?-1:0,glide:.1,vib:d>1}));
    else c.concat([c[0]+12]).forEach((m,k)=>{pluck(tb+k*beat,m+12,"el",{vol:.6,dur:1.2});pluck(tb+k*beat+.012,m+12,"el",{vol:.4,det:9,dur:1.2});});});
  const e=t+32*beat;crash(e,1.2);kick(e);strum(e,[45,52,57],"pk",{vol:1,dur:2.2});pad(e,[57,61,64],2.2);return 32*beat+2.4;};

/* ================= 调度 ================= */
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
function runDemo(name,btn){newBus();if(name==="drums-big")addRoom(3.2,1.1);if(name==="stomp")addRoom(3.6,1);setActive(btn);const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;later(()=>clearActive(),d+.4);}
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);

/* ================= 推荐曲目 ================= */
const SONGS=[
  {side:"A",q:"Cream Sunshine of Your Love",title:"Sunshine of Your Love",by:"Cream",yr:"1967",style:"布鲁斯摇滚 · power trio",
   txt:"一个吉他和贝斯齐奏的低音 riff，几乎贯穿全曲。三人乐队的标准声音。",
   listen:["对照实验 02 的“低音单音 riff”","鼓的节奏有点特别：重音不完全在 2、4 拍"]},
  {side:"A",q:"Black Sabbath Paranoid",title:"Paranoid",by:"Black Sabbath",yr:"1970",style:"硬摇滚 / 早期重金属",
   txt:"不到三分钟，快速的闷音 riff 一路推进。Black Sabbath 是硬摇滚通向重金属的那座桥。",
   listen:["吉他的闷音和放开交替，对照实验 03","和 Cream 比：布鲁斯的“晃”少了"]},
  {side:"A",q:"Led Zeppelin Black Dog",title:"Black Dog",by:"Led Zeppelin",yr:"1971",style:"硬摇滚",
   txt:"主唱一句，乐队一句，轮流说话。而且乐队的 riff 拍子很“绕”，很难跟着数。",
   listen:["对照实验 02 的“呼应式 riff”","试着跟着 riff 打拍子，会发现它像是在拍子之间“滑”"]},
  {side:"A",q:"Deep Purple Highway Star",title:"Highway Star",by:"Deep Purple",yr:"1972",style:"硬摇滚",
   txt:"一首关于开快车的歌。中间先是一段失真风琴独奏，再是一段吉他独奏，两段都带着巴洛克式的快速琶音。",
   listen:["风琴独奏：对照实验 07 的“+ 失真”","主唱在副歌里的高音嘶吼，对照实验 06"]},
  {side:"A",q:"Aerosmith Dream On",title:"Dream On",by:"Aerosmith",yr:"1973",style:"强力抒情曲",
   txt:"从钢琴和干净吉他的低语开始，越唱越高，最后是一声撕裂般的高音。强力抒情曲的范本之一。",
   listen:["画一张地形图：从哪里开始变响？","对照实验 11"]},
  {side:"A",q:"Queen We Will Rock You",title:"We Will Rock You",by:"Queen",yr:"1977",style:"体育场颂歌",
   txt:"几乎只有跺脚、拍手和人声。直到最后，吉他才进来弹一段独奏。",
   listen:["数“跺、跺、拍”的循环","对照实验 10：人越多，声音越“大”"]},
  {side:"B",q:"Van Halen Eruption",title:"Eruption",by:"Van Halen",yr:"1978",style:"吉他独奏",
   txt:"一首不到两分钟的吉他独奏曲，点弦段落让整整一代吉他手重新开始练琴。",
   listen:["找到点弦那一段，对照实验 08","听摇把带来的音高起伏"]},
  {side:"B",q:"AC/DC Back in Black",title:"Back in Black",by:"AC/DC",yr:"1980",style:"硬摇滚",
   txt:"新主唱加入后的第一张专辑同名曲。riff 简单、干净、有空隙，每一下都打在点上。",
   listen:["riff 里有很多“停顿”，空白和音符一样重要","鼓几乎一直是最基本的后拍"]},
  {side:"B",q:"Bon Jovi Livin' on a Prayer",title:"Livin' on a Prayer",by:"Bon Jovi",yr:"1986",style:"1980 年代硬摇滚",
   txt:"开头那个“哇哇”说话般的吉他声来自对讲盒。副歌是全场合唱的设计。",
   listen:["对照实验 09 的对讲盒","最后一段副歌升了调，这是 1980 年代流行的“加码”手法"]},
  {side:"B",q:"Guns N' Roses Sweet Child o' Mine",title:"Sweet Child o' Mine",by:"Guns N' Roses",yr:"1987",style:"硬摇滚",
   txt:"那段开头的吉他分解琶音，据说原本是吉他手的手指热身练习。",
   listen:["开头的琶音一直在重复同一个形状，只是底下的和弦在变","对比 1980 年代的华丽：这首歌的声音更“脏”"]},
  {side:"B",q:"黑豹 无地自容",title:"无地自容",by:"黑豹乐队",yr:"1992",style:"中文硬摇滚",
   txt:"失真吉他的前奏、高亢的嗓音和强力抒情的副歌，是 1990 年代初中文硬摇滚最有代表性的一首。",
   listen:["和《Dream On》比较：哪里像强力抒情曲？","吉他独奏用的还是五声音阶吗？"]},
  {side:"B",q:"B'z ultra soul",title:"ultra soul",by:"B'z",yr:"2001",style:"日本硬摇滚",
   txt:"硬摇滚的吉他 riff 加上日本流行的旋律，副歌那一声“ultra soul”是体育赛事的常用曲。",
   listen:["吉他 riff 是哪种类型？","对比美国的体育场颂歌：一样是为了让全场一起喊"]}
];
const ICON="M8 5v14l11-7z";
SONGS.forEach(s=>{
  const el=document.createElement("div");el.className="song";
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<div class="tdate"><b>${s.yr}</b><span>${s.style}</span></div>
  <div><div class="meta"><span class="title">${s.title}</span><span class="by">${s.by}</span></div>
  <p>${s.txt}</p><ul class="listen">${s.listen.map(x=>`<li>${x}</li>`).join("")}</ul>
  <div class="listen-links"><a class="main" href="${yt}" target="_blank" rel="noopener">${s.yt?"YouTube 官方音源":"YouTube 搜索"}</a>
  <a href="https://music.163.com/#/search/m/?s=${q}&type=1" target="_blank" rel="noopener">网易云</a>
  <a href="https://y.qq.com/n/ryqq/search?w=${q}" target="_blank" rel="noopener">QQ音乐</a></div></div>
  <a class="playlink" href="${yt}" target="_blank" rel="noopener" aria-label="在 YouTube 收听 ${s.title}"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="${ICON}"/></svg></a>`;
  document.getElementById(s.side==="A"?"songsA":"songsB").appendChild(el);
});

/* ================= 原创图解 ================= */
const NS="http://www.w3.org/2000/svg";
function S(p,tag,a,txt){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e;}
const TB="font-family:var(--font-body);font-size:14px;font-weight:900";
/* 图 1 光谱 */
(()=>{const g=document.getElementById("spec-fig");if(!g)return;
  const seg=[["布鲁斯",.25,["Muddy Waters","B.B. King"]],["摇滚",.45,["Chuck Berry","The Beatles"]],["硬摇滚",.72,["Cream","Led Zeppelin","AC/DC"]],["重金属",1,["Black Sabbath","Iron Maiden","Metallica"]]];
  seg.forEach(([t,h,ex],i)=>{const x=30+i*160,H=h*120;S(g,"rect",{x,y:150-H,width:148,height:H,class:i===2?"sv-red":"sv-card"});if(i!==2)S(g,"rect",{x,y:150-H,width:148,height:H,class:"sv-l","stroke-width":1.2});
    S(g,"text",{x:x+74,y:174,"text-anchor":"middle",class:"sv-t",style:TB},t);ex.forEach((e,j)=>S(g,"text",{x:x+74,y:196+j*18,"text-anchor":"middle",class:"sv-ts"},e));});
  S(g,"path",{d:"M 30 22 L 640 22 M 630 16 L 640 22 L 630 28",class:"sv-l","stroke-width":1.5});
  S(g,"text",{x:30,y:16,class:"sv-m"},"更重 · 更响 · 离布鲁斯越来越远 →");
  S(g,"text",{x:30,y:270,class:"sv-ts"},"柱子高度：大致的“重量感”");
})();
/* 图 2 六线谱 */
(()=>{const g=document.getElementById("tab-fig");if(!g)return;const x0=70,top=30,gap=20,cw=34;
  ["e","B","G","D","A","E"].forEach((n,s)=>{S(g,"line",{x1:x0,y1:top+s*gap,x2:x0+16*cw+20,y2:top+s*gap,class:"sv-l","stroke-width":1});S(g,"text",{x:x0-12,y:top+s*gap+4,"text-anchor":"middle",class:"sv-m"},n);});
  S(g,"line",{x1:x0+8*cw+10,y1:top,x2:x0+8*cw+10,y2:top+5*gap,class:"sv-l","stroke-width":2});
  RS.flat().forEach((m,k)=>{const x=x0+20+k*cw+(k>=8?10:0),y=top+5*gap,f=m-40;S(g,"rect",{x:x-9,y:y-9,width:18,height:18,class:"sv-card"});S(g,"text",{x,y:y+5,"text-anchor":"middle",class:"sv-r",style:"font-family:var(--font-mono);font-size:14px;font-weight:700"},String(f));
    S(g,"text",{x,y:top+5*gap+34,"text-anchor":"middle",class:"sv-m"},k%2?"&":String(Math.floor((k%8)/2)+1));});
  S(g,"text",{x:x0,y:top+5*gap+64,class:"sv-ts"},"全部在第 6 弦（最粗的 E 弦）上：0 是空弦 E，3 是 G，5 是 A，6 是 B♭（蓝调音），7 是 B");
})();
/* 图 3 房间 */
(()=>{const g=document.getElementById("room-fig");if(!g)return;
  const env=(y0,title,tail)=>{S(g,"text",{x:20,y:y0+20,class:"sv-t",style:TB},title);S(g,"line",{x1:170,y1:y0+80,x2:650,y2:y0+80,class:"sv-l","stroke-width":1});
    let d=`M 170 ${y0+80}`;for(let x=0;x<=480;x+=4){const v=x<6?x/6:Math.exp(-(x-6)/(tail*480));d+=` L ${170+x} ${y0+80-v*70}`;}d+=` L 650 ${y0+80} Z`;S(g,"path",{d,class:tail>.1?"sv-red":"sv-ink",opacity:.85});};
  env(10,"小录音间",.04);env(120,"大楼梯间",.35);S(g,"text",{x:170,y:230,class:"sv-ts"},"时间 →（约 2 秒）");
})();
/* 图 4 Leslie */
(()=>{const g=document.getElementById("leslie-fig");if(!g)return;
  S(g,"rect",{x:220,y:20,width:200,height:230,rx:8,class:"sv-card"});S(g,"rect",{x:220,y:20,width:200,height:230,rx:8,class:"sv-l","stroke-width":2});
  S(g,"ellipse",{cx:320,cy:80,rx:70,ry:16,class:"sv-lline","stroke-width":2});S(g,"path",{d:"M 320 80 L 380 74 L 384 86 Z",class:"sv-red"});S(g,"path",{d:"M 320 80 L 260 86 L 256 74 Z",class:"sv-ink"});
  S(g,"path",{d:"M 250 60 A 70 16 0 0 1 390 60",class:"sv-lr","stroke-width":2});S(g,"path",{d:"M 384 54 L 392 60 L 383 65",class:"sv-lr","stroke-width":2});
  S(g,"text",{x:320,y:122,"text-anchor":"middle",class:"sv-t"},"高音号角（快速旋转）");
  S(g,"ellipse",{cx:320,cy:190,rx:62,ry:22,class:"sv-soft"});S(g,"ellipse",{cx:320,cy:190,rx:62,ry:22,class:"sv-l","stroke-width":1.5});S(g,"path",{d:"M 262 172 A 62 22 0 0 1 378 172",class:"sv-lr","stroke-width":2});
  S(g,"text",{x:320,y:232,"text-anchor":"middle",class:"sv-t"},"低音转筒（较慢）");
  S(g,"text",{x:30,y:130,class:"sv-t",style:TB},"风琴 →");S(g,"line",{x1:100,y1:126,x2:216,y2:126,class:"sv-l","stroke-width":2});
  S(g,"text",{x:450,y:90,class:"sv-ts"},"喇叭转向你：更响、音高略升");S(g,"text",{x:450,y:112,class:"sv-ts"},"转离你：更轻、音高略降");S(g,"text",{x:450,y:150,class:"sv-r"},"→ 声音“转”起来");
})();
/* 图 5 点弦 */
(()=>{const g=document.getElementById("tap-fig");if(!g)return;const x0=40,fw=40;
  S(g,"line",{x1:x0,y1:100,x2:x0+15*fw,y2:100,class:"sv-l","stroke-width":2});for(let f=0;f<=15;f++){S(g,"line",{x1:x0+f*fw,y1:85,x2:x0+f*fw,y2:115,class:"sv-lline","stroke-width":1.5});if(f)S(g,"text",{x:x0+(f-.5)*fw,y:140,"text-anchor":"middle",class:"sv-m"},String(f));}
  [[5,"L","sv-ink","左手食指"],[8,"L","sv-ink","左手小指"],[12,"R","sv-red","右手点下"]].forEach(([f,t,c,lab])=>{const x=x0+(f-.5)*fw;S(g,"circle",{cx:x,cy:100,r:15,class:c});S(g,"text",{x,y:105,"text-anchor":"middle",class:"sv-on",style:"font-size:13px"},t);S(g,"text",{x,y:62,"text-anchor":"middle",class:"sv-ts"},lab);});
  S(g,"path",{d:`M ${x0+11.5*fw} 128 Q ${x0+8*fw} 175 ${x0+4.5*fw} 128`,class:"sv-lr","stroke-width":2});S(g,"text",{x:x0+8*fw,y:186,"text-anchor":"middle",class:"sv-r"},"点下 → 勾弦落到 5 品 → 左手按 8 品 → 再点");
  S(g,"text",{x:x0,y:210,class:"sv-ts"},"一根弦上三个音快速循环，像琶音被“甩”出来");
})();
/* 图 6 场地 */
(()=>{const g=document.getElementById("venue-fig");if(!g)return;
  [["小酒吧",300],["剧院",3000],["室内体育馆",20000],["室外体育场",70000]].forEach(([n,v],i)=>{const y=20+i*52,w=Math.log10(v)/Math.log10(70000)*440;S(g,"text",{x:20,y:y+24,class:"sv-t",style:TB},n);S(g,"rect",{x:160,y,width:w,height:34,class:i===3?"sv-red":"sv-ink",opacity:i===3?1:.75});S(g,"text",{x:168+w,y:y+23,class:"sv-m",style:"font-size:12px"},"约 "+v.toLocaleString());});
  S(g,"text",{x:160,y:240,class:"sv-ts"},"横轴为对数刻度：每多一格，人数大约乘以十");
})();
/* 图 7 版权时间线 */
(()=>{const g=document.getElementById("court-fig");if(!g)return;
  const row=(y,title,ev)=>{S(g,"text",{x:20,y,class:"sv-t",style:TB},title);S(g,"line",{x1:30,y1:y+50,x2:650,y2:y+50,class:"sv-l","stroke-width":1.5});
    ev.forEach(([x,yr,t1,t2,c])=>{S(g,"circle",{cx:x,cy:y+50,r:7,class:c||"sv-ink"});S(g,"text",{x,y:y+30,"text-anchor":"middle",class:"sv-m",style:"font-size:12px"},yr);S(g,"text",{x,y:y+76,"text-anchor":"middle",class:"sv-t",style:"font-size:12px"},t1);if(t2)S(g,"text",{x,y:y+94,"text-anchor":"middle",class:"sv-ts"},t2);});};
  row(24,"《Whole Lotta Love》",[[90,"1962","Muddy Waters 录制","Willie Dixon 作"],[300,"1969","Led Zeppelin 发行",""],[540,"1980 年代","Dixon 起诉 → 庭外和解","Dixon 被加进作者署名","sv-red"]]);
  row(170,"《Stairway to Heaven》",[[80,"1968","Spirit《Taurus》",""],[220,"1971","《Stairway》发行",""],[380,"2016","陪审团：不侵权","","sv-red"],[530,"2020","上诉法院全院庭审维持","废除“反比例规则”","sv-red"]]);
})();
/* 外部照片 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`照片待放入：${img.getAttribute("src")}<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张照片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
