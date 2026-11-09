/* ================= 摇滚：乐器 ================= */
INST.ac.peak=[220,5];
Object.assign(INST,{
  cr:{bright:.88,decay:.999,dur:2,vol:.24,drive:4.5,lp:3400},
  fz:{bright:.9,decay:.9993,dur:2.2,vol:.12,drive:45,lp:2400},
  pk:{bright:.92,decay:.9992,dur:1.8,vol:.15,drive:14,lp:3600},
  ub:{bright:.3,decay:.993,dur:.9,vol:.9,lp:700},
  ld:{bright:.88,decay:.9993,dur:2.4,vol:.2,drive:9,lp:3000}
});
function crash(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=4500;const g=a.createGain();g.gain.setValueAtTime(.25*v,t);g.gain.exponentialRampToValueAtTime(.001,t+1.3);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+1.35);track(n);}
/* 临时把声音送进一条效果链（哇音、声像） */
function via(node,fn){const keep=bus;node.connect(keep);bus=node;try{fn();}finally{bus=keep;}}
/* 倒放：把拨弦样本反过来 */
function revPluck(t,midi,inst,dur){const a=A(),I=INST[inst],src=ksBuf(midi,dur,I.bright,I.decay),b=a.createBuffer(1,src.length,src.sampleRate),s=src.getChannelData(0),d=b.getChannelData(0);
  for(let i=0;i<s.length;i++)d[i]=s[s.length-1-i];const fade=Math.floor(a.sampleRate*.01);for(let i=0;i<fade;i++)d[d.length-1-i]*=i/fade;
  const n=a.createBufferSource();n.buffer=b;const g=a.createGain();g.gain.value=I.vol*1.3;let node=g;n.connect(g);
  if(I.drive){const sh=a.createWaveShaper();sh.curve=shaper(I.drive);node.connect(sh);node=sh;}if(I.lp){const f=a.createBiquadFilter();f.type="lowpass";f.frequency.value=I.lp;node.connect(f);node=f;}
  node.connect(bus);n.start(t);n.stop(t+dur);track(n);}
const bt=b=>60/b;
const PCN={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function chordPcs(name){let i=1,r=PCN[name[0]];if(name[1]==="#"){r++;i++;}else if(name[1]==="b"){r--;i++;}const rest=name.slice(i),m=rest.startsWith("m"),q=rest.includes("7");const p=[r,r+(m?3:4),r+7];if(q)p.push(r+10);return p.map(x=>(x+12)%12);}
function place(pcs,lo,hi){const o=[];for(let m=lo;m<hi;m++)if(pcs.includes(m%12))o.push(m);return o;}
function rootNear(name,lo){const p=chordPcs(name)[0];let m=lo;while(m%12!==p)m++;return m;}
function stripNear(btn){const lab=btn.closest(".lab");return lab?lab.querySelector("[data-strip]"):null;}
function swing8(t,beat,k,sw){return t+Math.floor(k/2)*beat+(k%2?(sw?beat*2/3:beat/2):0);}
function rockBeat(tb,beat,o={}){for(let k=0;k<8;k++){hat(tb+k*beat/2,(k%2?.55:.9)*(o.hv||1));}kick(tb,o.kv||1);kick(tb+2*beat,o.kv||1);if(o.push)kick(tb+2.5*beat,.7);snare(tb+beat,o.sv||1);snare(tb+3*beat,o.sv||1);}
function powerBar(tb,beat,ch,inst="pk",o={}){const r=rootNear(ch,40);for(let k=0;k<8;k++)strum(tb+k*beat/2,[r,r+7,r+12],inst,{vol:o.vol||1,mute:beat*(o.mute||.45),spread:.004});}
function bass8(tb,beat,ch,o={}){const r=rootNear(ch,28)+(rootNear(ch,28)<31?12:0);for(let k=0;k<8;k++)pluck(tb+k*beat/2,r,"bass",{vol:o.vol||.95,mute:beat*.42});}
function voiceLine(t,beat,notes,shift=-12,o={}){notes.forEach(([b,m,d])=>voice(t+b*beat,m+shift,d*beat*.95,{from:-1,glide:.08,vibDepth:o.vib||16,vowel:o.vowel||"a",vol:o.vol||.85}));}

/* ================= 示例 ================= */
const DEMOS={};
const BOOG=[0,4,7,9,10,9,7,4];
/* 后拍 */
DEMOS["bb-soft"]=t=>{const beat=bt(126),CH=["A","D","A","A"];CH.forEach((ch,i)=>{const tb=t+i*4*beat,r=rootNear(ch,33);
  for(let k=0;k<8;k++){pluck(swing8(tb,beat,k,true),r+BOOG[k],"ub",{vol:1.1});hat(swing8(tb,beat,k,true),k%2?.35:.6);}
  kick(tb,.6);kick(tb+2*beat,.6);snare(tb+beat,.35,true);snare(tb+3*beat,.35,true);
  strum(tb+beat,place(chordPcs(ch+"7"),57,69),"el",{vol:.3,mute:.15});strum(tb+3*beat,place(chordPcs(ch+"7"),57,69),"el",{vol:.3,mute:.15});});return 16*beat+.6;};
function berryRhythm(tb,beat,ch){const r=rootNear(ch,40);for(let k=0;k<8;k++)strum(tb+k*beat/2,[r,r+(Math.floor(k/2)%2?9:7)],"cr",{vol:.9,mute:beat*.42,spread:.003});}
DEMOS["bb-hard"]=t=>{const beat=bt(160),CH=["A","D","A","A"];CH.forEach((ch,i)=>{const tb=t+i*4*beat,r=rootNear(ch,33);
  for(let k=0;k<8;k++)pluck(tb+k*beat/2,r+BOOG[k],"bass",{vol:1,mute:beat*.42});rockBeat(tb,beat,{sv:1.25});berryRhythm(tb,beat,ch);});
  const e=t+16*beat;crash(e);kick(e);strum(e,[45,52,57],"cr",{vol:1,dur:1.6});return 16*beat+1.6;};
DEMOS.berry=t=>{const beat=bt(168),e=beat/2;
  const L=[[0,[74,81],-2],[1,[74,81],-2],[2,[74,81],-2],[3,[74,81],-2],[4,[76,81],0],[5,[74,79],0],[6,[72,76],0],[7,[69,76],0],[8,[72,76],-1],[9,[69,72],0],[10,[67,72],0],[11,[64,69],0],[12,[69,76],-2],[13,[69,76],0],[14,[69,76],-1],[15,[69,76],0]];
  L.forEach(([k,ns,f])=>ns.forEach((m,j)=>pluck(t+k*e+j*.004,m,"cr",{vol:1,from:j===0?f:0,glide:.09,mute:e*.95})));
  const t2=t+16*e;["A","A","D","A"].forEach((ch,i)=>{const tb=t2+i*4*beat,r=rootNear(ch,33);for(let k=0;k<8;k++)pluck(tb+k*beat/2,r+BOOG[k],"bass",{vol:1,mute:beat*.42});rockBeat(tb,beat,{sv:1.2});berryRhythm(tb,beat,ch);});
  if(true){crash(t2);}const end=t2+16*beat;crash(end);kick(end);strum(end,[45,52,57,61],"cr",{vol:1,dur:1.8});return 16*e+16*beat+1.8;};
/* 乐队位置 */
const POP_C=["E","B","C#m","A"];
const POP_V=[[[0,71,1],[1,71,.5],[1.5,73,.5],[2,71,1],[3,68,1]],[[0,71,1.5],[1.5,73,.5],[2,75,1],[3,73,1]],[[0,76,1],[1,75,.5],[1.5,73,.5],[2,73,2]],[[0,73,1],[1,71,1],[2,69,1],[3,68,1]]];
const POP_L={E:[83,81,80],B:[83,78,75],"C#m":[80,76,73],A:[81,76,73]};
function bandDemo(t,layers){const beat=bt(120);
  for(let r=0;r<2;r++)POP_C.forEach((ch,i)=>{const tb=t+(r*4+i)*4*beat,root=rootNear(ch,40);
    if(layers>=1){rockBeat(tb,beat,{push:true});if(r===0&&i===0&&layers>=3)crash(tb,.8);}
    if(layers>=2)for(let k=0;k<8;k++)pluck(tb+k*beat/2,rootNear(ch,28)<31?rootNear(ch,28)+12:rootNear(ch,28),"bass",{vol:.95,mute:beat*.42});
    if(layers>=3){const up=place(chordPcs(ch),52,66);[0,1,1.5,2.5,3,3.5].forEach((b,j)=>strum(tb+b*beat,[root,...up],"el",{vol:j%2?.32:.42,mute:beat*.45,spread:j%2?.006:.012}));}
    if(layers>=4)POP_L[ch].forEach((m,j)=>pluck(tb+(2.5+j*.5)*beat,m,"ld",{vol:.8,from:j===0?-1:0,glide:.08,vib:j===2,mute:j===2?undefined:beat*.48}));
    if(layers>=5)voiceLine(tb,beat,POP_V[i],-12,{vol:.95});});
  const end=t+32*beat;if(layers>=3){crash(end);strum(end,[40,47,52,56],"el",{vol:.6,dur:2});}kick(end);if(layers>=2)pluck(end,40,"bass",{vol:1});return 32*beat+1.8;}
["r-drums","r-bass","r-rhythm","r-lead","r-all"].forEach((k,i)=>DEMOS[k]=t=>bandDemo(t,i+1));
/* 音色 */
const RIFF=[[0,40],[.5,40],[1,43],[1.5,45],[2,40],[2.5,46],[3,45],[3.5,43],[4,40],[4.5,40],[5,43],[5.5,45],[6,47],[6.5,45],[7,43],[7.5,45]];
function riffDemo(t,inst){const beat=bt(112);for(let r=0;r<2;r++){const tr=t+r*8*beat;RIFF.forEach(([b,m])=>{pluck(tr+b*beat,m,inst,{vol:1.1,mute:beat*.48});if(inst!=="el")pluck(tr+b*beat+.003,m+12,inst,{vol:.6,mute:beat*.48});});
  for(let q=0;q<2;q++){const tb=tr+q*4*beat;kick(tb,.8);snare(tb+beat,.8);kick(tb+2*beat,.8);snare(tb+3*beat,.8);for(let k=0;k<8;k++)hat(tb+k*beat/2,.6);}}
  pluck(t+16*beat,40,inst,{vol:1.1,dur:2});pluck(t+16*beat,47,inst,{vol:.8,dur:2});crash(t+16*beat,.7);return 16*beat+2;}
DEMOS["tone-clean"]=t=>riffDemo(t,"el");DEMOS["tone-crunch"]=t=>riffDemo(t,"cr");DEMOS["tone-fuzz"]=t=>riffDemo(t,"fz");
/* 倒放与双轨 */
const PHR=[[0,76,.5],[.4,79,.5],[.8,81,.8],[1.5,83,1.6]];
DEMOS["rev-off"]=t=>{PHR.forEach(([s,m,d])=>pluck(t+s,m,"el",{vol:1.2,dur:d+.6}));return 3.6;};
DEMOS["rev-on"]=t=>{PHR.forEach(([s,m,d])=>revPluck(t+s,m,"el",d+.4));return 3.8;};
const ADT=[[0,64,.4],[.45,67,.4],[.9,69,.8],[1.8,67,.4],[2.25,64,1.3]];
function adtDemo(t,two){strum(t,[52,56,59,64],"ac",{vol:.5,dur:3});strum(t+1.8,[50,57,62,66],"ac",{vol:.45,dur:2});
  if(!two){ADT.forEach(([s,m,d])=>voice(t+s,m-12,d,{from:-1,glide:.08,vibDepth:14,vowel:"a",vol:.9}));return 4;}
  const a=A(),L=a.createStereoPanner(),R=a.createStereoPanner();L.pan.value=-.7;R.pan.value=.7;
  via(L,()=>ADT.forEach(([s,m,d])=>voice(t+s,m-12,d,{from:-1,glide:.08,vibDepth:14,vowel:"a",vol:.75})));
  via(R,()=>ADT.forEach(([s,m,d])=>voice(t+s+.038,m-12,d,{from:-1.15,glide:.1,vibDepth:18,vowel:"a",vol:.7})));return 4;}
DEMOS["adt-1"]=t=>adtDemo(t,false);DEMOS["adt-2"]=t=>adtDemo(t,true);
/* 哇音 */
function funk(t,wah){const beat=bt(100),s=beat/4,acc=[1,0,0,1,0,0,1,0,0,1,0,1,1,0,0,1];const ch=[52,56,62,66,71];
  let tgt=null;if(wah){const a=A();tgt=a.createBiquadFilter();tgt.type="bandpass";tgt.Q.value=5;const g=a.createGain();g.gain.value=2.6;tgt.connect(g);
    for(let b=0;b<16;b++){tgt.frequency.setValueAtTime(380,t+b*beat);tgt.frequency.linearRampToValueAtTime(2300,t+b*beat+beat*.5);tgt.frequency.linearRampToValueAtTime(380,t+b*beat+beat);}tgt=[tgt,g];}
  const play=()=>{for(let b=0;b<4;b++)for(let k=0;k<16;k++){const tt=t+b*4*beat+k*s;strum(tt,ch,"el",{vol:acc[k]?.55:.2,mute:acc[k]?s*1.4:s*.4,spread:.003});}};
  if(wah){const [f,g]=tgt;const keep=bus;g.connect(keep);bus=f;try{play();}finally{bus=keep;}}else play();
  for(let b=0;b<4;b++){const tb=t+b*4*beat;[[0,40],[.75,40],[1.5,52],[2,40],[2.75,43],[3,45],[3.5,47]].forEach(([q,m])=>pluck(tb+q*beat,m-12+12,"bass",{vol:1,mute:beat*.3}));
    kick(tb);kick(tb+1.75*beat,.7);kick(tb+2.5*beat,.8);snare(tb+beat);snare(tb+3*beat);for(let k=0;k<16;k++)hat(tb+k*s,k%2?.3:.6);}
  return 16*beat+.6;}
DEMOS["wah-off"]=t=>funk(t,false);DEMOS["wah-on"]=t=>funk(t,true);
DEMOS.feedback=t=>{const a=A();pluck(t,45,"ld",{vol:1.2,dur:5.5});pluck(t,52,"ld",{vol:.9,dur:5.5});
  const o=a.createOscillator();o.type="sine";o.frequency.value=mf(76);const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=5.5;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(18,t+4);lfo.connect(lg).connect(o.detune);
  const sh=a.createWaveShaper();sh.curve=shaper(6);const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=3500;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.setValueAtTime(0,t+1);g.gain.linearRampToValueAtTime(.09,t+3.6);g.gain.setValueAtTime(.09,t+5);g.gain.linearRampToValueAtTime(0,t+5.5);
  o.connect(sh).connect(lp).connect(g).connect(bus);[o,lfo].forEach(x=>{x.start(t);x.stop(t+5.6);track(x);});return 5.8;};
/* 五声音阶与独奏 */
const BOX=[45,48,50,52,55,57,60,62,64,67,69,72];
DEMOS["solo-box"]=t=>{const s=.2;[...BOX,...BOX.slice(0,-1).reverse()].forEach((m,i)=>pluck(t+i*s,m,"el",{vol:1.1,mute:s*1.1}));pluck(t+23*s,45,"el",{vol:1.1,dur:1.6});return 23*s+1.8;};
const SOLO=[[[0,69,.5,{from:-2,glide:.14}],[.5,72,.5],[1,74,1,{from:-2,glide:.22,vib:1}],[2.5,72,.5],[3,69,1]],
  [[0,76,1.5,{from:-2,hold:.05,glide:.25,vib:1}],[1.5,74,.25],[1.75,72,.25],[2,74,.5],[2.5,72,.5],[3,69,1,{vib:1}]],
  [[0,72,.5],[.5,74,.5],[1,77,1,{from:-1,glide:.15}],[2,76,.5],[2.5,74,.5],[3,72,1,{vib:1}]],
  [[0,69,.25],[.25,72,.25],[.5,74,.25],[.75,75,.25],[1,76,1,{vib:1}],[2,74,.5],[2.5,72,.5],[3,69,1,{from:-2,glide:.2,vib:1}]],
  [[0,81,1.5,{from:-2,glide:.3,vib:1}],[1.5,79,.5],[2,76,.5],[2.5,79,.5],[3,81,1,{from:-2,glide:.2}]],
  [[0,84,2,{from:-2,hold:.1,glide:.3,vib:1}],[2,81,.5],[2.5,79,.5],[3,76,1]],
  [[0,77,.5],[.5,76,.5],[1,74,.5],[1.5,72,.5],[2,74,1,{from:-2,glide:.2,vib:1}],[3,72,1]],
  [[0,69,4,{from:-2,glide:.3,vib:1}]]];
DEMOS["jam-solo"]=t=>{const beat=bt(96),CH=["Am","Am","Dm","Am","Am","Am","Dm","Am"];
  CH.forEach((ch,i)=>{const tb=t+i*4*beat,r=rootNear(ch,40);rockBeat(tb,beat,{hv:.8,sv:.8,kv:.8});for(let k=0;k<8;k++)pluck(tb+k*beat/2,rootNear(ch,28)<31?rootNear(ch,28)+12:rootNear(ch,28),"bass",{vol:.85,mute:beat*.42});
    [0,1.5,2.5].forEach(b=>strum(tb+b*beat,[r,r+7,r+12],"cr",{vol:.55,mute:beat*.4,spread:.004}));
    SOLO[i].forEach(([b,m,d,o])=>pluck(tb+b*beat,m,"ld",Object.assign({vol:1.15,dur:d*beat+.3},o||{})));});
  const end=t+32*beat;crash(end);kick(end);strum(end,[45,52,57],"cr",{vol:.8,dur:2});return 32*beat+2.2;};
/* 拍子 */
function meterDemo(t,seven){const e=.17,bar=seven?[40,47,40,50,40,47,45]:[40,40,47,40,50,40,47,45],n=bar.length;
  for(let r=0;r<6;r++){const tb=t+r*n*e;bar.forEach((m,k)=>{pluck(tb+k*e,m,"bass",{vol:1.05,mute:e*.9});hat(tb+k*e,k===0?1:.5);});
    if(seven){kick(tb);snare(tb+2*e);kick(tb+4*e);snare(tb+5*e,.8);}else{kick(tb);snare(tb+2*e);kick(tb+4*e);snare(tb+6*e);}
    if(r%2===0)strum(tb,[52,59,64,67],"el",{vol:.4,dur:n*e*1.8});}
  return 6*n*e+.6;}
DEMOS.four4=t=>meterDemo(t,false);DEMOS.seven=t=>meterDemo(t,true);
/* 迷你摇滚歌 */
const VER=[[[0,64,1],[1,64,.5],[1.5,66,.5],[2,68,1],[3,66,1]],[[0,69,1],[1,68,.5],[1.5,66,.5],[2,64,2]]];
const CHO=[[[0,73,1.5],[1.5,71,.5],[2,73,1],[3,76,1]],[[0,75,2],[2,73,1],[3,71,1]]];
DEMOS["song-map"]=(t,btn)=>{const beat=bt(126),seg=8*beat;
  const riffSeg=(ts,full)=>{for(let r=0;r<2;r++){RIFF.slice(0,8).forEach(([b,m])=>{pluck(ts+(r*4+b)*beat,m,"cr",{vol:1,mute:beat*.48});pluck(ts+(r*4+b)*beat+.003,m+12,"cr",{vol:.5,mute:beat*.48});});rockBeat(ts+r*4*beat,beat,{hv:full?1:.6,sv:full?1:.6,kv:.9});}};
  const verse=ts=>["E","A"].forEach((ch,i)=>{const tb=ts+i*4*beat,up=place(chordPcs(ch),52,66);for(let k=0;k<8;k++){hat(tb+k*beat/2,.45);pluck(tb+k*beat/2,rootNear(ch,28)<31?rootNear(ch,28)+12:rootNear(ch,28),"bass",{vol:.8,mute:beat*.42});}kick(tb,.8);kick(tb+2*beat,.8);snare(tb+beat,.4,true);snare(tb+3*beat,.4,true);
    up.forEach((m,k)=>pluck(tb+k*beat*.5,m,"el",{vol:.6,dur:1.2}));voiceLine(tb,beat,VER[i],-12,{vol:.9});});
  const chorus=ts=>{crash(ts);["A","B"].forEach((ch,i)=>{const tb=ts+i*4*beat;powerBar(tb,beat,ch);bass8(tb,beat,ch);rockBeat(tb,beat,{push:true,sv:1.2});voiceLine(tb,beat,CHO[i],-12,{vol:1,vib:22});});};
  const solo=ts=>{crash(ts);["A","B"].forEach((ch,i)=>{const tb=ts+i*4*beat;powerBar(tb,beat,ch,"pk",{vol:.7});bass8(tb,beat,ch);rockBeat(tb,beat,{sv:1.1});
    (i?[[0,83,2,{from:-2,glide:.25,vib:1}],[2,80,.5],[2.5,78,.5],[3,76,1]]:[[0,76,.5],[.5,78,.5],[1,80,1,{from:-2,glide:.2,vib:1}],[2,83,.5],[2.5,80,.5],[3,78,1]]).forEach(([b,m,d,o])=>pluck(tb+b*beat,m,"ld",Object.assign({vol:1.1,dur:d*beat+.3},o||{})));});};
  riffSeg(t,false);verse(t+seg);chorus(t+2*seg);verse(t+3*seg);chorus(t+4*seg);solo(t+5*seg);riffSeg(t+6*seg,true);
  lightStrip(stripNear(btn),t,seg,7);const end=t+7*seg;crash(end,1.2);kick(end);strum(end,[40,47,52,56],"pk",{vol:1.2,dur:2.2});pluck(end,28,"bass",{vol:1});return 7*seg+2.4;};
/* 安静—大声—安静 */
DEMOS.ql=t=>{const beat=bt(112),CH=["E","C","A","G"];
  const quiet=(ts,bars)=>{for(let i=0;i<bars;i++){const ch=CH[i%4],tb=ts+i*4*beat,c=place(chordPcs(ch),52,71);
    [c[0],c[1],c[2],c[3]||c[0]+12,c[2],c[1],c[2],c[3]||c[0]+12].forEach((m,k)=>pluck(tb+k*beat/2,m,"el",{vol:.7,dur:1.4}));
    pluck(tb,rootNear(ch,28)<31?rootNear(ch,28)+12:rootNear(ch,28),"bass",{vol:.8,dur:4*beat});kick(tb,.5);kick(tb+2*beat,.5);for(let k=0;k<4;k++)hat(tb+k*beat,.3);}};
  const loud=(ts,bars)=>{crash(ts,1.3);for(let i=0;i<bars;i++){const ch=CH[i%4],tb=ts+i*4*beat;powerBar(tb,beat,ch,"pk",{vol:1.15});bass8(tb,beat,ch,{vol:1.1});rockBeat(tb,beat,{push:true,sv:1.3,kv:1.1,hv:1.1});if(i===2)crash(tb,.8);}};
  quiet(t,4);loud(t+16*beat,4);quiet(t+32*beat,2);pluck(t+40*beat,40,"el",{vol:.8,dur:2.4});return 40*beat+2.6;};

/* 踏板：把标题搬到踏板面上 */
document.querySelectorAll(".lab").forEach(l=>{const h=l.querySelector(".head");if(!h)return;const t=document.createElement("p");t.className="pedal-title";t.textContent=h.querySelector("strong")?.textContent||"";const sb=document.createElement("p");sb.className="pedal-sub";sb.textContent=h.querySelector("small")?.textContent||"";h.after(t,sb);});
/* ================= 调度 ================= */
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
function runDemo(name,btn){newBus();setActive(btn);const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;later(()=>clearActive(),d+.4);}
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);

/* ================= 推荐曲目 ================= */
const SONGS=[
  {side:"A",q:"Elvis Presley That's All Right 1954",title:"That's All Right",by:"Elvis Presley",yr:"1954",style:"山区摇滚（rockabilly）",
   txt:"本章开头那个晚上录下的歌。一把电吉他、一把低音提琴、一把木吉他，没有鼓，却已经是摇滚乐的样子。",
   listen:["低音提琴“啪啪”地拍弦，代替了鼓","原曲是黑人布鲁斯歌手 Arthur Crudup 的歌，可以搜来对比"]},
  {side:"A",q:"Chuck Berry Johnny B. Goode",title:"Johnny B. Goode",by:"Chuck Berry",yr:"1958",style:"摇滚乐",
   txt:"一个乡下穷孩子靠弹吉他出人头地的故事。开头的吉他前奏可能是摇滚史上被模仿最多的一段。",
   listen:["数一数：它的结构就是十二小节布鲁斯","对照实验 01 的“Chuck Berry 式的开场”"]},
  {side:"A",q:"The Kinks You Really Got Me",title:"You Really Got Me",by:"The Kinks",yr:"1964",style:"英国入侵",
   txt:"割破音箱喇叭录出来的失真 riff。两个强力和弦来回推，是后来硬摇滚和朋克的祖先之一。",
   listen:["整首歌几乎就靠一个 riff 撑起来","副歌时 riff 整体往上移了一个调"]},
  {side:"A",q:"The Rolling Stones Satisfaction",title:"(I Can't Get No) Satisfaction",by:"The Rolling Stones",yr:"1965",style:"英国入侵",
   txt:"那个毛茸茸的吉他 riff 来自一个法兹效果器。据说吉他手原本只想用它做个“小样”，提醒自己以后用管乐来吹这句。",
   listen:["对照实验 03 的“法兹”音色","听鼓：后拍砸得很重"]},
  {side:"A",q:"The Beatles Tomorrow Never Knows",title:"Tomorrow Never Knows",by:"The Beatles",yr:"1966",style:"迷幻 · 录音棚实验",
   txt:"几乎只有一个和弦，上面飘着磁带循环、倒放的吉他和经过特殊处理的人声。录音棚第一次成了主角。",
   listen:["鼓一直在重复同一个节奏型，像一个 loop","找找倒放的吉他声在哪里，对照实验 04"]},
  {side:"A",q:"Jimi Hendrix Purple Haze",title:"Purple Haze",by:"The Jimi Hendrix Experience",yr:"1967",style:"迷幻摇滚",
   txt:"开头两个音形成刺耳的“三全音”，然后是一个布鲁斯 riff。Hendrix 把失真、推弦和噪音都变成了语言。",
   listen:["吉他独奏里大量的推弦和揉弦","和布鲁斯那章的电吉他对比：一样的语言，大了好几倍的声音"]},
  {side:"B",q:"Led Zeppelin Whole Lotta Love",title:"Whole Lotta Love",by:"Led Zeppelin",yr:"1969",style:"硬摇滚",
   txt:"一个低沉的 riff 反复轰鸣，中间一大段几乎没有节奏的噪音和回声实验。硬摇滚的起点之一。",
   listen:["数 riff 出现的次数","中段的声音在左右声道之间来回飞，最好戴耳机"]},
  {side:"B",q:"Pink Floyd Money",title:"Money",by:"Pink Floyd",yr:"1973",style:"前卫摇滚",
   txt:"开头是收银机和硬币的声音拼成的节奏，接着是 7 拍一小节的贝斯 riff。",
   listen:["跟着贝斯数 7，对照实验 07","吉他独奏开始时，拍子变了吗？"]},
  {side:"B",q:"Queen Bohemian Rhapsody",title:"Bohemian Rhapsody",by:"Queen",yr:"1975",style:"体育场摇滚",
   txt:"抒情曲、歌剧、硬摇滚三段拼在一起，六分钟，没有副歌。它几乎违反了本章说的所有“结构规则”，却成了最有名的摇滚歌之一。",
   listen:["数一数它有几个完全不同的段落","中间的“歌剧”段，是录音棚里一层一层叠出来的上百轨人声"]},
  {side:"B",q:"崔健 一无所有",title:"一无所有",by:"崔健",yr:"1986",style:"中国摇滚",
   txt:"中国摇滚的起点。旋律里有北方民歌的味道，间奏里能听到唢呐。",
   listen:["主歌和副歌的强弱对比","唢呐出现的地方：摇滚的编制里多了一件中国乐器"]},
  {side:"B",q:"Radiohead Creep",title:"Creep",by:"Radiohead",yr:"1992",style:"另类摇滚",
   txt:"主歌几乎只有干净的分解和弦，副歌前吉他突然“咔咔”两下，接着是一堵失真的墙。",
   listen:["对照实验 09 的“安静—大声”","副歌前那两下噪音，是整首歌最有名的瞬间"]},
  {side:"B",q:"万能青年旅店 杀死那个石家庄人",title:"杀死那个石家庄人",by:"万能青年旅店",yr:"2010",style:"中文独立摇滚",
   txt:"一个北方工业城市里普通人的故事。小号、贝斯和越来越大的乐队，从安静一路推到爆发。",
   listen:["小号在摇滚乐队里扮演了什么角色？","画一张它的地形图，对照图 7"]}
];
const ICON="M8 5v14l11-7z";
SONGS.forEach(s=>{
  const el=document.createElement("div");el.className="song";
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<div class="tdate"><b>${s.yr}</b><span>ADMIT ONE</span></div>
  <div><div class="meta"><span class="title">${s.title}</span><span class="by">${s.by}</span><span class="style">${s.style}</span></div>
  <p>${s.txt}</p><ul class="listen">${s.listen.map(x=>`<li>${x}</li>`).join("")}</ul>
  <div class="listen-links"><a class="main" href="${yt}" target="_blank" rel="noopener">${s.yt?"YouTube 官方音源":"YouTube 搜索"}</a>
  <a href="https://music.163.com/#/search/m/?s=${q}&type=1" target="_blank" rel="noopener">网易云</a>
  <a href="https://y.qq.com/n/ryqq/search?w=${q}" target="_blank" rel="noopener">QQ音乐</a></div></div>
  <a class="playlink" href="${yt}" target="_blank" rel="noopener" aria-label="在 YouTube 收听 ${s.title}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="${ICON}"/></svg></a>`;
  document.getElementById(s.side==="A"?"songsA":"songsB").appendChild(el);
});

/* ================= 原创图解 ================= */
const NS="http://www.w3.org/2000/svg";
function S(p,tag,a,txt){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e;}
/* 图 1 三条支流 */
(()=>{const g=document.getElementById("fam-fig");if(!g)return;
  [[90,"布鲁斯 · 节奏布鲁斯","A1 · 后拍的前身、十二小节","sv-ld"],[340,"福音","教堂的尖叫和合唱","sv-ld"],[590,"乡村 · 蓝草","A2 · 讲故事、吉他、快节奏","sv-ld"]].forEach(([x,t,s])=>{
    S(g,"rect",{x:x-95,y:20,width:190,height:56,rx:6,class:"sv-card"});S(g,"rect",{x:x-95,y:20,width:190,height:56,rx:6,class:"sv-l","stroke-width":1.5});
    S(g,"text",{x,y:44,"text-anchor":"middle",class:"sv-tb",style:"font-family:var(--font-body);font-size:14px;font-weight:900"},t);S(g,"text",{x,y:64,"text-anchor":"middle",class:"sv-ts"},s);
    S(g,"path",{d:`M ${x} 76 C ${x} 140, 340 140, 340 196`,class:"sv-lr","stroke-width":x===340?6:9,"stroke-linecap":"round",fill:"none"});});
  S(g,"rect",{x:210,y:196,width:260,height:62,rx:8,class:"sv-red"});
  S(g,"text",{x:340,y:226,"text-anchor":"middle",class:"sv-on",style:"font-family:var(--font-display);font-size:24px;font-weight:400"},"摇滚乐 · 1954");
  S(g,"text",{x:340,y:248,"text-anchor":"middle",class:"sv-on",style:"font-size:11.5px;font-weight:400"},"孟菲斯 · 太阳唱片");
  S(g,"text",{x:340,y:286,"text-anchor":"middle",class:"sv-ts"},"再加上：电吉他、电贝斯、青少年和收音机");
})();
/* 图 2 后拍 */
(()=>{const g=document.getElementById("bb-fig");if(!g)return;
  const row=(y,title,acc)=>{S(g,"text",{x:20,y:y+30,class:"sv-tb",style:"font-family:var(--font-body);font-size:14px;font-weight:900"},title);
    [1,2,3,4].forEach((n,i)=>{const x=200+i*112,on=acc.includes(n);S(g,"rect",{x,y,width:100,height:48,rx:6,class:on?"sv-red":"sv-card"});if(!on)S(g,"rect",{x,y,width:100,height:48,rx:6,class:"sv-l","stroke-width":1});
      S(g,"text",{x:x+50,y:y+31,"text-anchor":"middle",class:on?"sv-on":"sv-t",style:on?"font-size:18px":"font-size:18px"},on?n+" ●":String(n));});};
  row(24,"进行曲 · 波尔卡",[1,3]);row(110,"摇滚 · 后拍",[2,4]);
  S(g,"text",{x:200,y:200,class:"sv-ts"},"红色 = 重音。摇滚的重音由军鼓打出来，落在 2 和 4");
})();
/* 图 3 舞台 */
(()=>{const g=document.getElementById("stage-fig");if(!g)return;
  S(g,"rect",{x:40,y:16,width:600,height:230,rx:8,class:"sv-card"});S(g,"rect",{x:40,y:16,width:600,height:230,rx:8,class:"sv-l","stroke-width":2});
  const amp=(x,y,t)=>{S(g,"rect",{x,y,width:70,height:34,class:"sv-ink"});S(g,"text",{x:x+35,y:y+22,"text-anchor":"middle",class:"sv-on",style:"font-size:11px;font-weight:400"},t);};
  amp(80,30,"贝斯音箱");amp(450,30,"吉他音箱");amp(530,30,"吉他音箱");
  S(g,"circle",{cx:340,cy:80,r:42,class:"sv-soft"});S(g,"circle",{cx:340,cy:80,r:42,class:"sv-l","stroke-width":1.5});[[310,62],[370,62],[340,100],[300,96],[380,96]].forEach(([x,y])=>S(g,"circle",{cx:x,cy:y,r:10,class:"sv-l","stroke-width":1.5}));
  S(g,"text",{x:340,y:140,"text-anchor":"middle",class:"sv-t"},"鼓");
  const p=(x,y,t,c)=>{S(g,"circle",{cx:x,cy:y,r:20,class:c});S(g,"text",{x,y:y+38,"text-anchor":"middle",class:"sv-t"},t);};
  p(140,130,"贝斯","sv-must");p(470,130,"节奏吉他","sv-must");p(560,150,"主音吉他","sv-red");p(340,200,"主唱","sv-red");
  S(g,"line",{x1:340,y1:178,x2:340,y2:190,class:"sv-l","stroke-width":3});
  S(g,"text",{x:340,y:278,"text-anchor":"middle",class:"sv-ts"},"▼ 观众 ▼");
  S(g,"text",{x:56,y:236,class:"sv-ts"},"节奏组：鼓 + 贝斯（+ 节奏吉他）");
})();
/* 图 4 信号链与削波 */
(()=>{const g=document.getElementById("chain-fig");if(!g)return;
  ["吉他","效果器","音箱","喇叭"].forEach((t,i)=>{const x=40+i*160;S(g,"rect",{x,y:20,width:120,height:44,rx:6,class:i===1?"sv-red":"sv-card"});if(i!==1)S(g,"rect",{x,y:20,width:120,height:44,rx:6,class:"sv-l","stroke-width":1.5});
    S(g,"text",{x:x+60,y:48,"text-anchor":"middle",class:i===1?"sv-on":"sv-t",style:"font-size:14px"},t);if(i<3)S(g,"path",{d:`M ${x+122} 42 L ${x+156} 42 M ${x+148} 36 L ${x+156} 42 L ${x+148} 48`,class:"sv-l","stroke-width":2});});
  const wave=(x0,clip,title)=>{S(g,"text",{x:x0,y:104,class:"sv-tb",style:"font-family:var(--font-body);font-size:14px;font-weight:900"},title);
    S(g,"line",{x1:x0,y1:176,x2:x0+260,y2:176,class:"sv-lline","stroke-width":1});
    if(clip){S(g,"line",{x1:x0,y1:150,x2:x0+260,y2:150,class:"sv-lr","stroke-width":1,"stroke-dasharray":"4 3"});S(g,"line",{x1:x0,y1:202,x2:x0+260,y2:202,class:"sv-lr","stroke-width":1,"stroke-dasharray":"4 3"});}
    let d="";for(let i=0;i<=260;i+=2){let v=Math.sin(i/260*Math.PI*6)*48;if(clip)v=Math.max(-26,Math.min(26,v*1.6));d+=(i?" L ":"M ")+(x0+i)+" "+(176-v);}S(g,"path",{d,class:clip?"sv-lr":"sv-ld","stroke-width":2.5});};
  wave(40,false,"干净：圆润的波形");wave(380,true,"失真：顶部被削平");
  S(g,"text",{x:380,y:246,class:"sv-ts"},"被削平的波形多出很多高频泛音，声音变得毛糙、厚重");
})();
/* 图 5 五声音阶方块 */
(()=>{const g=document.getElementById("penta-fig");if(!g)return;
  const x0=110,top=34,fw=90,sg=30;
  ["e","B","G","D","A","E"].forEach((n,s)=>{S(g,"line",{x1:x0,y1:top+s*sg,x2:x0+fw*4,y2:top+s*sg,class:"sv-l","stroke-width":.8+s*.3});S(g,"text",{x:x0-16,y:top+s*sg+4,"text-anchor":"middle",class:"sv-m"},n);});
  for(let f=0;f<=4;f++)S(g,"line",{x1:x0+f*fw,y1:top,x2:x0+f*fw,y2:top+5*sg,class:"sv-l","stroke-width":1.5});
  for(let f=0;f<4;f++)S(g,"text",{x:x0+(f+.5)*fw,y:top+5*sg+24,"text-anchor":"middle",class:"sv-m"},(5+f)+" 品");
  const dots=[[0,5,"A"],[0,8,"C"],[1,5,"E"],[1,8,"G"],[2,5,"C"],[2,7,"D"],[3,5,"G"],[3,7,"A"],[4,5,"D"],[4,7,"E"],[5,5,"A"],[5,8,"C"]];
  dots.forEach(([s,f,n])=>{const cx=x0+(f-5+.5)*fw,cy=top+s*sg,root=n==="A";S(g,"circle",{cx,cy,r:12,class:root?"sv-red":"sv-ink"});S(g,"text",{x:cx,y:cy+4,"text-anchor":"middle",class:"sv-on",style:"font-size:11px;font-weight:700"},n);});
  [[4,6],[2,8]].forEach(([s,f])=>{const cx=x0+(f-5+.5)*fw,cy=top+s*sg;S(g,"circle",{cx,cy,r:12,class:"sv-card"});S(g,"circle",{cx,cy,r:12,class:"sv-lr","stroke-width":2,"stroke-dasharray":"3 2"});S(g,"text",{x:cx,y:cy+4,"text-anchor":"middle",class:"sv-r",style:"font-size:10px"},"E♭");});
  S(g,"text",{x:x0+4*fw+20,y:top+40,class:"sv-r"},"红：根音 A");S(g,"text",{x:x0+4*fw+20,y:top+64,class:"sv-ts"},"虚线：蓝调音 E♭");S(g,"text",{x:x0+4*fw+20,y:top+88,class:"sv-ts"},"一根手指管一品，");S(g,"text",{x:x0+4*fw+20,y:top+106,class:"sv-ts"},"整个方块不用移动手");
})();
/* 图 6 拍子分组 */
(()=>{const g=document.getElementById("meter-fig");if(!g)return;
  const row=(y,title,groups)=>{S(g,"text",{x:20,y:y+26,class:"sv-tb",style:"font-family:var(--font-body);font-size:14px;font-weight:900"},title);let x=150;
    groups.forEach((n,gi)=>{for(let k=0;k<n;k++){S(g,"circle",{cx:x+k*44,cy:y+20,r:16,class:k===0?"sv-red":"sv-card"});if(k)S(g,"circle",{cx:x+k*44,cy:y+20,r:16,class:"sv-l","stroke-width":1.2});S(g,"text",{x:x+k*44,y:y+25,"text-anchor":"middle",class:k===0?"sv-on":"sv-t",style:"font-size:13px"},String(k+1));}
      x+=n*44+26;});};
  row(30,"4/4（八分音符）",[2,2,2,2]);row(110,"7/8",[2,2,3]);
  S(g,"text",{x:150,y:190,class:"sv-ts"},"红色是每组的重音。7/8 的最后一组多一个音，像总在“赶”");
})();
/* 图 7 歌曲地形 */
(()=>{const g=document.getElementById("map-fig");if(!g)return;
  const P=[["前奏",.45,60],["主歌",.35,90],["副歌",.95,70],["主歌",.35,90],["副歌",.95,70],["独奏",.85,70],["桥段",.55,60],["副歌",1,70],["尾奏",.5,50]];let x=24;
  S(g,"line",{x1:20,y1:200,x2:660,y2:200,class:"sv-l","stroke-width":1.5});
  P.forEach(([t,h,w])=>{const H=h*160;S(g,"rect",{x,y:200-H,width:w-4,height:H,rx:3,class:t==="副歌"?"sv-red":t==="独奏"?"sv-must":"sv-card"});if(t!=="副歌"&&t!=="独奏")S(g,"rect",{x,y:200-H,width:w-4,height:H,rx:3,class:"sv-l","stroke-width":1});
    S(g,"text",{x:x+(w-4)/2,y:222,"text-anchor":"middle",class:"sv-t"},t);x+=w;});
  S(g,"text",{x:24,y:250,class:"sv-ts"},"副歌最高、出现最多；主歌收着，是为了让副歌“放出来”");
})();
/* 图 8 家族树 */
(()=>{const g=document.getElementById("tree-fig");if(!g)return;
  const rows=[["1950s",[["摇滚乐",1]]],["1960s",[["英国入侵",0],["民谣摇滚",0],["迷幻摇滚",0]]],["1970s",[["硬摇滚",1],["重金属",1],["前卫摇滚",0],["朋克",1]]],["1980s",[["新浪潮",0],["后朋克",0],["硬核",0],["华语摇滚",0]]],["1990s",[["另类",0],["垃圾摇滚",0],["英伦摇滚",0]]],["2000s",[["车库复兴",0],["独立摇滚",0]]]];
  rows.forEach(([yr,items],r)=>{const y=20+r*62;S(g,"text",{x:20,y:y+26,class:"sv-m",style:"font-size:13px"},yr);
    const w=128,tot=items.length*w+(items.length-1)*10,x0=100+(560-tot)/2;
    items.forEach(([t,hi],i)=>{const x=x0+i*(w+10);S(g,"rect",{x,y,width:w,height:40,rx:6,class:hi?"sv-red":"sv-card"});if(!hi)S(g,"rect",{x,y,width:w,height:40,rx:6,class:"sv-l","stroke-width":1.2});
      S(g,"text",{x:x+w/2,y:y+25,"text-anchor":"middle",class:hi?"sv-on":"sv-t",style:"font-size:13.5px"},t);});
    if(r<rows.length-1)S(g,"line",{x1:380,y1:y+40,x2:380,y2:y+62,class:"sv-l","stroke-width":2});});
  S(g,"text",{x:100,y:394,class:"sv-ts"},"红色：本书已有或计划中的章节（摇滚、硬摇滚、金属、朋克）");
})();
/* 外部照片 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`照片待放入：${img.getAttribute("src")}<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张照片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
