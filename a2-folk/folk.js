/* ================= 民歌与乡村：乐器补充 ================= */
INST.ac.peak=[220,5];
Object.assign(INST,{
  bj:{bright:.97,decay:.9925,dur:.9,vol:.36,lp:7500,peak:[1900,6]},
  md:{bright:.92,decay:.9955,dur:1.1,vol:.26,lp:6500,peak:[1500,4]},
  dul:{bright:.82,decay:.997,dur:1.8,vol:.4,lp:5000,peak:[700,4]},
  dobro:{bright:.86,decay:.999,dur:2.4,vol:.36,lp:4200,peak:[900,6]},
  steel:{bright:.7,decay:.9994,dur:3.2,vol:.3,lp:3000},
  tw:{bright:.92,decay:.998,dur:1.6,vol:.3,drive:1.4,lp:4800,peak:[2100,5]},
  ub:{bright:.3,decay:.993,dur:.9,vol:.9,lp:700}
});
const fx=x=>x;
function clap(t,v=1){const a=A();[0,.012,.024].forEach((d,i)=>{const n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=1300;f.Q.value=.9;const g=a.createGain();g.gain.setValueAtTime(.45*v*(i===2?1:.6),t+d);g.gain.exponentialRampToValueAtTime(.001,t+d+(i===2?.14:.02));n.connect(f).connect(g).connect(bus);n.start(t+d);n.stop(t+d+.16);track(n);});}
function swish(t,dur,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();n.loop=true;const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=3500;f.Q.value=.7;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05*v,t+dur*.6);g.gain.linearRampToValueAtTime(0,t+dur);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+dur+.02);track(n);}
/* 小提琴（fiddle）：两个锯齿波 + 琴身共鸣 + 延迟揉弦 */
function fiddle(t,midi,dur,o={}){
  const a=A(),f=mf(midi),oscs=[a.createOscillator(),a.createOscillator()];
  oscs.forEach((x,k)=>{x.type="sawtooth";const ff=f*(k?1.0035:1);
    if(o.from){x.frequency.setValueAtTime(ff*Math.pow(2,o.from/12),t);x.frequency.linearRampToValueAtTime(ff,t+(o.glide||.12));}else x.frequency.setValueAtTime(ff,t);});
  const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=5.8;lg.gain.setValueAtTime(0,t);lg.gain.setValueAtTime(0,t+Math.min(.18,dur*.5));lg.gain.linearRampToValueAtTime(o.vib===0?0:16,t+Math.min(.45,dur));lfo.connect(lg);oscs.forEach(x=>lg.connect(x.detune));
  const hp=a.createBiquadFilter();hp.type="highpass";hp.frequency.value=200;
  const p1=a.createBiquadFilter();p1.type="peaking";p1.frequency.value=560;p1.Q.value=1.2;p1.gain.value=5;
  const p2=a.createBiquadFilter();p2.type="peaking";p2.frequency.value=2900;p2.Q.value=1.3;p2.gain.value=6;
  const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=6000;
  const g=a.createGain(),v=(o.vol||1)*.085,at=o.att||.05;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*1.25,t+at);g.gain.linearRampToValueAtTime(v,t+at+.08);g.gain.setValueAtTime(v,t+Math.max(at+.09,dur-.07));g.gain.linearRampToValueAtTime(0,t+dur);
  oscs.forEach(x=>x.connect(hp));hp.connect(p1).connect(p2).connect(lp).connect(g).connect(bus);
  [...oscs,lfo].forEach(x=>{x.start(t);x.stop(t+dur+.05);track(x);});
}
/* 留声机总线：带通 + 噼啪声 */
let crackleBuf=null;
function crackle(){if(crackleBuf)return crackleBuf;const sr=ac.sampleRate,len=sr*2;crackleBuf=ac.createBuffer(1,len,sr);const d=crackleBuf.getChannelData(0);for(let i=0;i<len;i++){d[i]=(Math.random()*2-1)*.02;if(Math.random()<.0009)d[i]=(Math.random()*2-1)*.9;}return crackleBuf;}
function phonoBus(){
  const b=newBus();b.disconnect();
  const hp=ac.createBiquadFilter();hp.type="highpass";hp.frequency.value=320;
  const lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.value=3000;
  const pk=ac.createBiquadFilter();pk.type="peaking";pk.frequency.value=1200;pk.gain.value=5;
  const sh=ac.createWaveShaper();sh.curve=shaper(1.6);const g=ac.createGain();g.gain.value=1.1;
  b.connect(hp).connect(lp).connect(pk).connect(sh).connect(g).connect(master);
  const n=ac.createBufferSource();n.buffer=crackle();n.loop=true;const ng=ac.createGain();ng.gain.value=.5;n.connect(ng).connect(g);n.start();track(n);
  return n;
}

/* ================= 和弦与律动 ================= */
const PC={C:0,"C#":1,D:2,"D#":3,E:4,F:5,"F#":6,G:7,"G#":8,A:9,"A#":10,B:11};
function tri(name){
  const m=name.endsWith("m"),root=PC[m?name.slice(0,-1):name];
  const r=40+((root-4+12)%12),fifth=r+7>52?r-5:r+7;
  const tones=[root,root+(m?3:4),root+7].map(pc=>{let x=55+((pc-55)%12+12)%12;return x;}).sort((a,b)=>a-b);
  return {r,fifth,s:tones,ub:r-12};
}
const bt=bpm=>60/bpm;
function boomBar(t,beat,ch,o={}){
  const c=tri(ch),alt=o.alt?c.fifth:c.r,inst=o.inst||"ac",bv=o.bv||1.1,sv=o.sv||.42;
  pluck(t,o.alt?c.fifth:c.r,inst,{vol:bv,mute:beat*(o.mute?.4:.95)});
  strum(t+beat,c.s,inst,{vol:sv,mute:beat*(o.mute?.25:.6),spread:.01});
  pluck(t+2*beat,o.alt?c.r:c.fifth,inst,{vol:bv*.95,mute:beat*(o.mute?.4:.95)});
  strum(t+3*beat,c.s,inst,{vol:sv,mute:beat*(o.mute?.25:.6),spread:.01});
}
function ubBar(t,beat,ch,o={}){const c=tri(ch);pluck(t,c.ub,"ub",{vol:o.vol||1});pluck(t+2*beat,c.fifth-12,"ub",{vol:(o.vol||1)*.9});}
function chopBar(t,beat,ch){const c=tri(ch);[1,3].forEach(b=>strum(t+b*beat,c.s.map(x=>x+12),"md",{vol:.5,mute:.07,spread:.006}));}
const BJ={G:{4:50,3:55,2:59,1:62},C:{4:52,3:55,2:60,1:64},D:{4:54,3:57,2:62,1:66},A:{4:52,3:57,2:61,1:64},E:{4:52,3:56,2:59,1:64}};
const ROLL=[[3,"T"],[2,"I"],[1,"M"],[5,"T"],[2,"I"],[1,"M"],[5,"T"],[1,"M"]];
function rollBar(t,step,ch,vol=1){ROLL.forEach(([s],k)=>pluck(t+k*step,s===5?67:BJ[ch][s],"bj",{vol:vol*(k===0||k===3||k===6?1.15:.9)}));}
/* 原创旋律：G 调，八小节，和弦 1 4 1 5 | 1 4 5 1 */
const MEL_CH=["G","C","G","D","G","C","D","G"];
const MEL=[
  [[0,67,1],[1,71,1],[2,74,2]],
  [[0,76,1.5],[1.5,74,.5],[2,72,1],[3,71,1]],
  [[0,67,1],[1,71,1],[2,74,1],[3,79,1]],
  [[0,78,2],[2,76,1],[3,74,1]],
  [[0,74,1],[1,71,1],[2,67,2]],
  [[0,72,1],[1,76,1],[2,74,1],[3,72,1]],
  [[0,71,1],[1,69,1],[2,66,1],[3,69,1]],
  [[0,67,4]]
];
function stripNear(btn){const lab=btn.closest(".lab");return lab?lab.querySelector("[data-strip]"):null;}
/* 调式 */
const MODES={ion:[0,2,4,5,7,9,11,12],mix:[0,2,4,5,7,9,10,12],dor:[0,2,3,5,7,9,10,12]};
const PHR_A=[[0,1],[2,1],[4,1.5],[4,.5],[5,1],[4,1],[2,2],[4,1],[6,1],[7,1],[6,1],[4,1],[2,1],[1,.5],[0,1.5]];
const PHR_B=[[7,1],[6,1],[4,1],[5,1],[4,1],[2,1],[1,2],[2,1],[4,1],[2,1],[1,1],[0,4]];
function degMidi(d,mode,base=62){return base+MODES[mode][d];}
function playPhrase(t,beat,phr,mode,fn){let x=t;phr.forEach(([d,len])=>{fn(x,degMidi(d,mode),len*beat);x+=len*beat;});return x-t;}

/* ================= 示例 ================= */
const DEMOS={};
function voiceLine(t,beat,phr,mode,o={}){return playPhrase(t,beat,phr,mode,(x,m,d)=>voice(x,m,d*.96,{from:-1,glide:.08,vibDepth:o.vib||18,vowel:o.vowel||"a",vol:o.vol||.85}));}
DEMOS.ballad=t=>{
  const beat=bt(96),vl=16*beat,chs=["D","G","C","D"];
  for(let v=0;v<3;v++){const tv=t+v*(vl+beat);
    voiceLine(tv,beat,PHR_A,"mix",{vowel:v===1?"o":"a"});
    if(v>=1)chs.forEach((c,i)=>{const tb=tv+i*4*beat,ch=tri(c);[0,1,2,3].forEach(k=>strum(tb+k*beat,k%2?ch.s:[ch.r,...ch.s],"ac",{vol:k%2?.28:.36,mute:beat*.9,spread:.02}));});
    if(v===2)chs.forEach((c,i)=>{const tb=tv+i*4*beat,ch=tri(c);fiddle(tb,ch.s[0]+12,4*beat,{vol:.55,att:.2,vib:0});fiddle(tb,ch.s[2]+12,4*beat,{vol:.4,att:.25,vib:0});pluck(tb,ch.ub,"ub",{vol:.9});pluck(tb+2*beat,ch.fifth-12,"ub",{vol:.8});});
  }
  return 3*(vl+beat)+.5;
};
["ion","mix","dor"].forEach(m=>{DEMOS["mode-"+m]=t=>{const beat=bt(150);let d=playPhrase(t,beat,PHR_A,m,(x,n,l)=>pluck(x,n,"dul",{vol:1.1}));d+=playPhrase(t+d,beat,PHR_B,m,(x,n,l)=>pluck(x,n,"dul",{vol:1.1,dur:l>2?2.4:1.6}));return d+.5;};});
DEMOS.drone=t=>{const beat=bt(140),total=32*beat;let d=playPhrase(t,beat,PHR_A,"mix",(x,n)=>pluck(x,n+12,"dul",{vol:1.1}));playPhrase(t+d,beat,PHR_B,"mix",(x,n,l)=>pluck(x,n+12,"dul",{vol:1.1,dur:l>2?2.4:1.6}));
  for(let b=0;b<total/beat;b+=2){pluck(t+b*beat,50,"dul",{vol:.75,dur:2});pluck(t+b*beat+.01,57,"dul",{vol:.6,dur:2});}return total+.8;};
/* 乐器 */
DEMOS["i-guitar"]=t=>{const beat=bt(110);["G","G","C","G"].forEach((c,i)=>boomBar(t+i*4*beat,beat,c,{alt:i%2}));return 16*beat+.6;};
DEMOS["i-banjo"]=t=>{const beat=bt(120),step=beat/2;["G","C","G","D","G"].forEach((c,i)=>{if(i<4)rollBar(t+i*4*beat,step,c);});pluck(t+16*beat,55,"bj",{vol:1.2});pluck(t+16*beat,62,"bj",{vol:1});return 16*beat+1;};
DEMOS["i-fiddle"]=t=>{const beat=bt(118),e=beat/2;
  const L=[[67,0],[69,0],[71,0],[67,0],[74,-1],[71,0],[72,0],[69,0],[67,0],[66,0],[67,0],[69,0],[71,-1],[74,0],[71,0],[67,0],[69,0],[71,0],[72,0],[74,0],[76,-2],[74,0],[71,0],[69,0]];
  L.forEach(([m,f],k)=>fiddle(t+k*e,m,e*1.02,{from:f,glide:.07,vib:0,att:.02}));
  const te=t+L.length*e;fiddle(te,67,beat*2.4,{vol:.9});fiddle(te,74,beat*2.4,{vol:.7});return L.length*e+beat*2.6;};
DEMOS["i-mando"]=t=>{const beat=bt(96);let x=t;
  [[74,1],[76,1],[79,2],[78,1],[76,1],[74,2]].forEach(([m,l])=>{const n=Math.round(l*6);for(let k=0;k<n;k++){const tt=x+k*beat/6;pluck(tt,m,"md",{vol:k%2?.75:.95,mute:beat/6*.95});pluck(tt+.004,m,"md",{vol:.6,det:7,mute:beat/6*.9});}x+=l*beat;});
  const c=tri("G");[0,1].forEach(k=>strum(x+k*beat,c.s.map(n=>n+12),"md",{vol:.6,mute:.08,spread:.006}));return x-t+2*beat;};
DEMOS["i-dobro"]=t=>{[[0,74,-2,.24],[.55,71,0],[.8,69,0],[1.1,67,-1.5,.2],[1.7,64,0],[2,62,-2,.3],[2.7,67,-2,.35],[3.3,71,-1,.25],[3.8,67,0]].forEach(([s,m,f,g])=>pluck(t+s,m,"dobro",{vol:1.3,from:f,glide:g||.15,vib:s>3.5,vibAt:.5}));return 6;};
DEMOS["i-harp"]=t=>{[[0,67,.4,{from:-1}],[.5,71,.3,{}],[.85,74,.6,{}],[1.55,72,.3,{}],[1.9,71,.9,{from:-1,glide:.25}],[3,67,.35,{}],[3.4,69,.35,{}],[3.8,67,1.2,{from:-1.5,glide:.3}]].forEach(([s,m,d,o])=>harp(t+s,m+12,d,o));return 5.3;};
DEMOS["i-bass"]=t=>{const beat=bt(110);["G","G","C","D"].forEach((c,i)=>{const ch=tri(c),tb=t+i*4*beat;[ch.ub,ch.fifth-12,ch.ub,ch.ub+(c==="D"?-1:2)].forEach((m,k)=>pluck(tb+k*beat,m,"ub",{vol:1.1}));});pluck(t+16*beat,tri("G").ub,"ub",{vol:1.2});return 17*beat;};
function melFiddle(t,beat,shift=0,o={}){MEL.forEach((bar,i)=>bar.forEach(([b,m,d])=>fiddle(t+(i*4+b)*beat,m+shift,d*beat*.98,{from:d>=2?-1:0,glide:.1,vol:o.vol||.9,att:.035})));}
DEMOS.bluegrass=(t,btn)=>{const beat=bt(150);
  MEL_CH.forEach((c,i)=>{const tb=t+i*4*beat;rollBar(tb,beat/2,c,.75);boomBar(tb,beat,c,{alt:i%2,bv:.9,sv:.32});ubBar(tb,beat,c);chopBar(tb,beat,c);});
  melFiddle(t,beat,0,{vol:.8});const end=t+32*beat;strum(end,tri("G").s,"ac",{vol:.6});pluck(end,tri("G").ub,"ub",{vol:1.2});pluck(end,55,"bj");pluck(end,67,"bj");fiddle(end,67,1.6,{vol:.8});fiddle(end,74,1.6,{vol:.6});return 32*beat+1.8;};
/* 律动 */
DEMOS.boomchick=t=>{const beat=bt(112);MEL_CH.forEach((c,i)=>boomBar(t+i*4*beat,beat,c,{alt:i%2}));strum(t+32*beat,tri("G").s.concat([43]),"ac",{vol:.5,dur:2});return 32*beat+2;};
DEMOS.carter=t=>{const beat=bt(108);
  const M=[[[0,47,1],[1,50,1],[2,55,2]],[[0,52,1],[1,55,1],[2,52,1],[3,48,1]],[[0,50,1],[1,54,1],[2,57,1],[3,54,1]],[[0,55,1],[1,50,1],[2,47,2]]],CH=["G","C","D","G"];
  for(let rep=0;rep<2;rep++)M.forEach((bar,i)=>{const tb=t+(rep*4+i)*4*beat,c=tri(CH[i]),starts=bar.map(x=>x[0]);
    bar.forEach(([b,m,d])=>pluck(tb+b*beat,m,"ac",{vol:1.5,dur:d*beat+.3}));
    [.5,1.5,2.5,3.5,1,2,3].forEach(b=>{if(b%1===0&&starts.includes(b))return;if(b%1===0&&!bar.some(([s,,d])=>b>s&&b<s+d))return;strum(tb+b*beat,c.s,"ac",{vol:.3,mute:.12,spread:.008});});});
  pluck(t+32*beat,43,"ac",{vol:1.4,dur:2});strum(t+32*beat+.05,tri("G").s,"ac",{vol:.4,dur:2});return 32*beat+2;};
DEMOS.waltz=t=>{const beat=bt(132),CH=["G","G","C","G","D","D","G","G"];
  const W=[[[0,71,2],[2,74,1]],[[0,79,3]],[[0,76,2],[2,72,1]],[[0,71,3]],[[0,69,2],[2,72,1]],[[0,74,1],[1,72,1],[2,69,1]],[[0,67,2],[2,71,1]],[[0,67,3]]];
  CH.forEach((ch,i)=>{const c=tri(ch),tb=t+i*3*beat;pluck(tb,i%2?c.fifth:c.r,"ac",{vol:1.1,mute:beat*.9});strum(tb+beat,c.s,"ac",{vol:.32,mute:beat*.6,spread:.012});strum(tb+2*beat,c.s,"ac",{vol:.28,mute:beat*.6,spread:.012});pluck(tb,c.ub,"ub",{vol:.9});
    W[i].forEach(([b,m,d])=>fiddle(tb+b*beat,m,d*beat*.98,{from:d>=2?-1:0,vol:.85,att:.06}));});
  return 24*beat+.8;};
DEMOS.train=t=>{const beat=bt(112),CH=["E","E","A","E","B","A","E","E"];
  CH.forEach((ch,i)=>{const tb=t+i*4*beat;boomBar(tb,beat,ch,{inst:"tw",mute:true,alt:i%2,bv:1.2,sv:.55});ubBar(tb,beat,ch,{vol:.9});
    for(let k=0;k<8;k++){snare(tb+k*beat/2,k%2?.35:(k===2||k===6?.95:.55),true);}});
  return 32*beat+.6;};
/* 约德尔 */
DEMOS.yodel=t=>{const beat=bt(92);
  const Y=[[0,64,.5,"o"],[.5,71,.5,"a"],[1,69,.5,"o"],[1.5,76,1,"a"],[2.5,73,.5,"o"],[3,71,.5,"a"],[3.5,64,1.5,"o"],[6,64,.5,"o"],[6.5,71,.5,"a"],[7,68,.5,"o"],[7.5,76,.75,"a"],[8.25,71,.25,"o"],[8.5,69,.5,"a"],[9,64,2.5,"o"]];
  Y.forEach(([b,m,d,v])=>voice(t+b*beat,m,d*beat*.97,{from:v==="a"?-1.6:-.4,glide:.035,vowel:v,vibDepth:v==="a"?6:14,vol:v==="a"?.75:.95}));
  ["E","E","A","E","B","E"].forEach((c,i)=>boomBar(t+i*2*beat,beat/2,c,{alt:i%2,bv:.8,sv:.3}));return 12*beat+.8;};
/* 踏板电吉他 */
function steelChord(t,notes,o={}){notes.forEach(([m,f,g])=>pluck(t,m,"steel",{vol:o.vol||1,from:f||0,hold:o.hold||.15,glide:g||.45,vib:1,vibAt:.8,swell:o.swell==null?.28:o.swell,dur:o.dur||3}));}
DEMOS.steel=t=>{steelChord(t,[[55],[59],[62]]);steelChord(t+1.7,[[55],[60,-1,.4],[64,-2,.5]]);steelChord(t+3.4,[[54,1,.4],[57,-2,.5],[62]]);steelChord(t+5.1,[[55],[59,-1,.3],[62],[67,-2,.6]],{dur:3.4});return 8.6;};
DEMOS.honky=t=>{const beat=bt(88),CH=["G","C","G","D","G","C","D","G"];
  CH.forEach((ch,i)=>{const tb=t+i*4*beat,c=tri(ch);pluck(tb,c.ub,"ub",{vol:1});pluck(tb+2*beat,c.fifth-12,"ub",{vol:.9});
    [1,3].forEach(k=>{strum(tb+k*beat,c.s,"tw",{vol:.35,mute:.18,spread:.008});snare(tb+k*beat,.5,true);});swish(tb,4*beat,1);
    if(i===0||ch!==CH[i-1])steelChord(tb,c.s.map(m=>[m+12,i%2?-1:0,.4]),{vol:.45,swell:.4,dur:4*beat});});
  MEL.forEach((bar,i)=>bar.forEach(([b,m,d])=>pluck(t+(i*4+b)*beat,m,"steel",{vol:1.1,from:d>=2?-1:0,glide:.3,vib:1,vibAt:.4,swell:.12,dur:d*beat+.4})));
  return 32*beat+1;};
/* 纳什维尔数字 */
const KEYS={G:{shift:0,ch:{1:"G",4:"C",5:"D"}},D:{shift:-5,ch:{1:"D",4:"G",5:"A"}},A:{shift:2,ch:{1:"A",4:"D",5:"E"}}};
const NUMS=[1,4,1,5,1,4,5,1];
["G","D","A"].forEach(k=>{DEMOS["nash-"+k]=(t,btn)=>{const beat=bt(108),K=KEYS[k];
  NUMS.forEach((n,i)=>{const tb=t+i*4*beat,ch=K.ch[n];boomBar(tb,beat,ch,{alt:i%2});ubBar(tb,beat,ch,{vol:.85});});
  melFiddle(t,beat,K.shift,{vol:.8});lightStrip(stripNear(btn),t,4*beat,8);
  const end=t+32*beat;strum(end,tri(K.ch[1]).s,"ac",{vol:.5,dur:2});pluck(end,tri(K.ch[1]).ub,"ub");return 32*beat+2;};});
/* 滚奏 */
DEMOS["roll-slow"]=t=>{const beat=bt(66);["G","C","G","D"].forEach((c,i)=>rollBar(t+i*4*beat,beat/2,c));return 16*beat+.8;};
DEMOS["roll-fast"]=t=>{const beat=bt(160);for(let r=0;r<2;r++)["G","C","G","D"].forEach((c,i)=>{const tb=t+(r*4+i)*4*beat;rollBar(tb,beat/2,c);boomBar(tb,beat,c,{bv:.7,sv:.25,alt:i%2});ubBar(tb,beat,c,{vol:.8});});
  const end=t+32*beat;pluck(end,55,"bj",{vol:1.2});pluck(end,67,"bj");pluck(end,tri("G").ub,"ub");return 32*beat+1;};
/* 和声 */
const HARM=[["G",71,74,67,1],["G",74,79,71,1],["C",76,79,72,2],["G",74,79,71,2],["D",74,78,69,1],["D",69,74,66,1],["G",71,74,67,2],["G",67,71,62,4]];
function harmDemo(t,n){const beat=bt(84);let x=t;
  HARM.forEach(([ch,l,te,ba,d])=>{const dur=d*beat*.97,c=tri(ch);
    voice(x,l,dur,{from:-1,glide:.1,vibDepth:24,vowel:"a",vol:.85});
    if(n>=2)voice(x,te,dur,{from:-.5,glide:.08,vibDepth:20,vowel:"a",vol:.55});
    if(n>=3)voice(x,ba,dur,{from:-.5,glide:.08,vibDepth:18,vowel:"o",vol:.6});
    for(let k=0;k<d;k++){if(k%2===0)pluck(x+k*beat,c.r,"ac",{vol:.8,mute:beat*.9});else strum(x+k*beat,c.s,"ac",{vol:.25,mute:beat*.5});}
    x+=d*beat;});
  return x-t+.6;}
DEMOS.h1=t=>harmDemo(t,1);DEMOS.h2=t=>harmDemo(t,2);DEMOS.h3=t=>harmDemo(t,3);
/* Travis 指弹 */
const TRAV={C:{th:[48,52,43,52],f:[[0,64],[1.5,67],[2.5,64],[3.5,60]]},Am:{th:[45,52,40,52],f:[[0,64],[1.5,69],[2.5,64],[3.5,60]]},F:{th:[41,53,48,53],f:[[0,65],[1.5,69],[2.5,65],[3.5,60]]},G:{th:[43,50,47,50],f:[[0,62],[1.5,67],[2.5,71],[3.5,67]]}};
function travisDemo(t,fingers){const beat=bt(100),seq=["C","Am","F","G","C","Am","F","G"];
  seq.forEach((c,i)=>{const tb=t+i*4*beat,P=TRAV[c];P.th.forEach((m,k)=>pluck(tb+k*beat,m,"ac",{vol:1.15,mute:beat*.85}));if(fingers)P.f.forEach(([b,m])=>pluck(tb+b*beat,m,"ac",{vol:.95,dur:1.4}));});
  const end=t+32*beat;pluck(end,48,"ac",{vol:1.1,dur:2});if(fingers){pluck(end+.02,64,"ac",{vol:.9,dur:2});pluck(end+.04,72,"ac",{vol:.7,dur:2});}return 32*beat+2;}
DEMOS["travis-thumb"]=t=>travisDemo(t,false);DEMOS.travis=t=>travisDemo(t,true);
/* 十二弦 */
function janglePattern(t,beat,inst,twelve){["D","G","A","D"].forEach((ch,i)=>{const c=tri(ch),tb=t+i*4*beat,pat=[c.r,c.s[0],c.s[1],c.s[2],c.s[0]+12,c.s[2],c.s[1],c.s[0]];
  pat.forEach((m,k)=>{const tt=tb+k*beat/2;pluck(tt,m,inst,{vol:twelve?.9:1.05,dur:1.4});if(twelve&&k>0){pluck(tt+.007,m+12,inst,{vol:.55,det:6,dur:1.2});}});});}
DEMOS["jangle-ac"]=t=>{const beat=bt(118);janglePattern(t,beat,"ac",false);pluck(t+16*beat,50,"ac",{dur:2});return 16*beat+1.6;};
DEMOS["jangle-12"]=t=>{const beat=bt(118);janglePattern(t,beat,"el",true);
  ["D","G","A","D"].forEach((ch,i)=>{const tb=t+i*4*beat,c=tri(ch);for(let k=0;k<4;k++){pluck(tb+k*beat,k%2?c.fifth:c.r,"bass",{vol:.9,mute:beat*.8});if(k%2)snare(tb+k*beat,.75);else kick(tb+k*beat,.8);}for(let k=0;k<8;k++)hat(tb+k*beat/2,k%2?.8:1.2);});
  pluck(t+16*beat,62,"el",{vol:1,dur:2});pluck(t+16*beat+.01,74,"el",{vol:.6,det:6,dur:2});kick(t+16*beat);return 16*beat+1.6;};
/* 跺脚拍手 */
DEMOS.stomp=t=>{const beat=bt(124),CH=["G","G","C","G","Em","C","G","D"];
  CH.forEach((ch,i)=>{const tb=t+i*4*beat,c=tri(ch);
    for(let k=0;k<4;k++){stomp(tb+k*beat);kick(tb+k*beat,.55);if(k%2)clap(tb+k*beat);}
    for(let k=0;k<8;k++)strum(tb+k*beat/2,[c.r,...c.s],"ac",{vol:k%2?.24:.36,mute:beat*.4,spread:k%2?.006:.012});
    if(i>=4)for(let k=0;k<8;k++)pluck(tb+k*beat/2,(ROLL[k][0]===5?67:BJ[ch==="Em"?"G":ch]&&BJ[ch==="Em"?"G":ch][ROLL[k][0]])||67,"bj",{vol:.6});
    pluck(tb,c.ub,"ub",{vol:.9});
    if(i%2===1){[55,59,62,67].forEach((m,j)=>voice(tb+3*beat,m+(j===3?0:12),beat*.45,{from:-2,glide:.05,vibDepth:0,vowel:"a",vol:.4}));}});
  const end=t+32*beat;stomp(end);kick(end);clap(end);[55,59,62,67].forEach(m=>voice(end,m+12,1.4,{from:-2,glide:.08,vowel:"o",vol:.38}));strum(end,tri("G").s,"ac",{vol:.6,dur:2});return 32*beat+1.8;};
/* 三个时代 */
DEMOS["evo-old"]=(t,btn)=>{const beat=bt(112);MEL_CH.forEach((c,i)=>boomBar(t+i*4*beat,beat,c,{alt:i%2,bv:1,sv:.38}));melFiddle(t,beat,0,{vol:1});lightStrip(stripNear(btn),t,4*beat,8);
  fiddle(t+32*beat,67,1.4,{vol:.9});fiddle(t+32*beat,74,1.4,{vol:.7});strum(t+32*beat,tri("G").s,"ac",{vol:.5});return 32*beat+1.6;};
DEMOS["evo-honky"]=(t,btn)=>{const beat=bt(92);
  MEL_CH.forEach((ch,i)=>{const tb=t+i*4*beat,c=tri(ch);pluck(tb,c.ub,"ub",{vol:1});pluck(tb+2*beat,c.fifth-12,"ub",{vol:.9});
    [1,3].forEach(k=>{strum(tb+k*beat,c.s,"tw",{vol:.32,mute:.18,spread:.008});snare(tb+k*beat,.45,true);});swish(tb,4*beat,.8);
    steelChord(tb,c.s.map(m=>[m+12,0]),{vol:.28,swell:.5,dur:4*beat});});
  MEL.forEach((bar,i)=>bar.forEach(([b,m,d])=>voice(t+(i*4+b)*beat,m-12,d*beat*.95,{from:-1,glide:.12,vibDepth:26,vowel:i%2?"o":"a",vol:.9})));
  [[3.5,74],[7.5,79]].forEach(([bar,m])=>{pluck(t+bar*4*beat-0*beat,m,"steel",{vol:.9,from:-2,glide:.4,vib:1,swell:.1,dur:2});});
  lightStrip(stripNear(btn),t,4*beat,8);return 32*beat+1.2;};
DEMOS["evo-modern"]=(t,btn)=>{const beat=bt(100);crash(t);
  MEL_CH.forEach((ch,i)=>{const tb=t+i*4*beat,c=tri(ch);
    for(let k=0;k<8;k++){hat(tb+k*beat/2,k%2?.6:1);pluck(tb+k*beat/2,c.r,"bass",{vol:.85,mute:beat*.42});}
    [0,2.5].forEach(b=>kick(tb+b*beat));[1,3].forEach(b=>{snare(tb+b*beat,1);clap(tb+b*beat,.5);});
    [0,1.5,2,3,3.5].forEach(b=>strum(tb+b*beat,c.s,"el",{vol:.32,mute:beat*.45,spread:.008}));
    rollBar(tb,beat/2,ch==="G"||ch==="C"||ch==="D"?ch:"G",.45);});
  MEL.forEach((bar,i)=>bar.forEach(([b,m,d])=>voice(t+(i*4+b)*beat,m-12,d*beat*.95,{from:-.8,glide:.07,vibDepth:14,vowel:"a",vol:.9})));
  [[3,3.5,79],[7,3.5,74]].forEach(([bar,b,m])=>pluck(t+(bar*4+b)*beat,m,"tw",{vol:1.2,from:-2,glide:.2,vib:1}));
  lightStrip(stripNear(btn),t,4*beat,8);const end=t+32*beat;crash(end);kick(end);strum(end,tri("G").s,"el",{vol:.5,dur:2});pluck(end,43,"bass");return 32*beat+1.8;};
function crash(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=4500;const g=a.createGain();g.gain.setValueAtTime(.25*v,t);g.gain.exponentialRampToValueAtTime(.001,t+1.3);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+1.35);track(n);}

/* 传单：把实验内容包进一张纸 */
document.querySelectorAll(".lab").forEach(l=>{const f=document.createElement("div");f.className="flyer";while(l.firstChild)f.appendChild(l.firstChild);l.appendChild(f);});
/* ================= 调度 ================= */
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
function runDemo(name,btn){
  const crackleSource=name==="evo-old"?phonoBus():null;
  if(!crackleSource)newBus();
  setActive(btn);const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;
  if(crackleSource)crackleSource.stop(t+d);
  later(crackleSource?stopDemos:clearActive,d+.4);
}
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);

/* ================= 推荐曲目 ================= */
const SONGS=[
  {side:"A",q:"Carter Family Wildwood Flower 1928",title:"Wildwood Flower",by:"The Carter Family",yr:"1928",style:"山地音乐 · Carter 式扫弦",
   txt:"Maybelle Carter 的吉他教科书。拇指在低音弦上弹旋律，其他手指扫弦，一把吉他把旋律和伴奏都包了。",
   listen:["只听吉他：旋律在低音区，高音区是“刷刷”的扫弦","对照实验 04 的“Carter 式扫弦”"]},
  {side:"A",q:"Jimmie Rodgers Blue Yodel T for Texas",title:"Blue Yodel（T for Texas）",by:"Jimmie Rodgers",yr:"1928",style:"早期乡村 · 约德尔",
   txt:"“乡村音乐之父”的成名曲。结构其实是十二小节布鲁斯，每段结尾接一段约德尔。",
   listen:["数一数：是不是布鲁斯那章的十二小节？","听约德尔里胸声和假声之间的“翻”"]},
  {side:"A",q:"Woody Guthrie This Land Is Your Land",title:"This Land Is Your Land",by:"Woody Guthrie",yr:"1944",style:"民谣",
   txt:"1940 年写成，1944 年录音。一把吉他，一段反复的旋律，每一段歌词都在讲美国的土地属于谁。",
   listen:["这是一首分节歌：旋律反复，歌词往前走","Guthrie 的唱法几乎是在“说”，咬字比旋律更重要"]},
  {side:"A",q:"Bill Monroe Blue Moon of Kentucky",title:"Blue Moon of Kentucky",by:"Bill Monroe & His Blue Grass Boys",yr:"1946",style:"蓝草",
   txt:"Bill Monroe 的招牌曲，原版是一首 3/4 拍的慢华尔兹。八年后，Elvis 把它改成了 4/4 拍的快歌，放在自己第一张单曲的 B 面。",
   listen:["原版是三拍子：嘭、恰、恰","再去搜 Elvis 1954 年的版本对比：一首歌是怎么从蓝草变成摇滚的"]},
  {side:"A",q:"Hank Williams I'm So Lonesome I Could Cry",title:"I'm So Lonesome I Could Cry",by:"Hank Williams",yr:"1949",style:"honky-tonk",
   txt:"乡村音乐里最孤独的歌之一。3/4 拍，几个简单的和弦，歌词全是夜晚、火车和落叶这样的画面。",
   listen:["踏板电吉他在歌词之间“叹气”","Hank 的声音里有一种轻微的颤和“破”"]},
  {side:"A",q:"Johnny Cash Folsom Prison Blues 1955",title:"Folsom Prison Blues",by:"Johnny Cash",yr:"1955",style:"乡村 · 火车节奏",
   txt:"一个囚犯在牢里听着火车经过。Cash 的三人乐队用最少的乐器，做出了最有画面感的节奏。",
   listen:["吉他手 Luther Perkins 的闷音“咔恰咔恰”","对照实验 04 的“火车节奏”"]},
  {side:"B",q:"Bob Dylan Blowin' in the Wind",title:"Blowin' in the Wind",by:"Bob Dylan",yr:"1963",style:"民谣 · 抗议歌曲",
   txt:"整首歌由一连串的问题组成，没有给出答案。它成了 1960 年代民权运动和反战运动的代表歌曲之一。",
   listen:["一把吉他加口琴，和 Woody Guthrie 一脉相承","旋律非常简单，任何人都能跟着唱，这正是重点"]},
  {side:"B",q:"Simon & Garfunkel The Sound of Silence 1965",title:"The Sound of Silence",by:"Simon & Garfunkel",yr:"1965",style:"民谣摇滚",
   txt:"本章讲过它的故事：原本是安静的木吉他歌，被制作人加上了电吉他和鼓之后成了全美第一。",
   listen:["先搜 1964 年专辑里的原版，再听 1965 年的单曲版","对照实验 11：插电之后，同一首歌的“气场”完全不同"]},
  {side:"B",q:"Dolly Parton Jolene",title:"Jolene",by:"Dolly Parton",yr:"1973",style:"乡村",
   txt:"Dolly Parton 写给一位“情敌”的恳求。快速的分解和弦吉他和一个不断重复的名字，让它成为乡村音乐里最有名的歌之一。",
   listen:["吉他的分解和弦一直在快速流动，像心跳","2024 年 Beyoncé 在《Cowboy Carter》里重新改写了这首歌，可以对比"]},
  {side:"B",q:"齐豫 橄榄树",title:"橄榄树",by:"齐豫",yr:"1979",style:"台湾校园民歌",
   txt:"三毛作词，李泰祥作曲。“不要问我从哪里来”，流浪和远方，是那一代台湾年轻人的心事。",
   listen:["比起美国民谣，它的编曲更接近艺术歌曲","齐豫的声音清亮、悠远，和本章的“高而寂寞”可以对比"]},
  {side:"B",q:"赵雷 成都",title:"成都",by:"赵雷",yr:"2016",style:"城市民谣",
   txt:"一座城市、一条街、一个人。木吉他、口琴和讲述式的唱法，几乎就是中文版的创作歌手传统。",
   listen:["和《Blowin' in the Wind》对比：一个问“我们”，一个讲“我”","注意歌里的具体地名：民谣喜欢具体的地方"]},
  {side:"B",q:"Lil Nas X Old Town Road Remix Billy Ray Cyrus",title:"Old Town Road（Remix）",by:"Lil Nas X ft. Billy Ray Cyrus",yr:"2019",style:"乡村说唱",
   txt:"说唱的鼓点，乡村的意象和班卓琴采样。它被移出乡村榜的争议，让人们重新讨论“什么才算乡村”。",
   listen:["鼓是说唱的，但歌词全是马、牛仔帽和拖拉机","对照本章图 6：九十年前的货架问题"]}
];
const ICON="M8 5v14l11-7z";
let snA=0,snB=0;
SONGS.forEach(s=>{
  const el=document.createElement("div");el.className="song";const sn=s.side==="A"?++snA:++snB;
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<div class="snum">${sn}.</div>
  <div><div class="meta"><span class="title">${s.title}</span><span class="by">${s.by}</span><span class="yr">${s.yr}</span><span class="style">${s.style}</span></div>
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
/* 图 1 两条根 */
(()=>{const g=document.getElementById("roots-fig");if(!g)return;
  S(g,"line",{x1:20,y1:200,x2:660,y2:200,class:"sv-lline","stroke-width":2,"stroke-dasharray":"4 4"});
  S(g,"text",{x:24,y:194,class:"sv-m"},"地面 · 美国南方");
  S(g,"path",{d:"M 340 200 C 336 150, 344 120, 340 70",class:"sv-l","stroke-width":10,"stroke-linecap":"round"});
  [[200,46,"乡村"],[340,30,"摇滚"],[480,46,"民谣"]].forEach(([x,y,t])=>{S(g,"path",{d:`M 340 80 Q ${(340+x)/2} ${y+30} ${x} ${y+12}`,class:"sv-l","stroke-width":4,"stroke-linecap":"round"});
    S(g,"circle",{cx:x,cy:y,r:28,class:x===340?"sv-red":"sv-must"});S(g,"text",{x,y:y+5,"text-anchor":"middle",class:"sv-on",style:"fill:#FAF5EA"},t);});
  const root=(side,label,items)=>{const sx=side<0?160:520;
    S(g,"path",{d:`M 340 200 C 340 240, ${sx} 230, ${sx} 300`,class:side<0?"sv-ld":"sv-lr","stroke-width":5,"stroke-linecap":"round"});
    S(g,"path",{d:`M ${(340+sx)/2} 232 q ${side*20} 30 ${side*60} 40`,class:side<0?"sv-ld":"sv-lr","stroke-width":2.5});
    S(g,"text",{x:sx,y:322,"text-anchor":"middle",class:"sv-tb"},label);
    items.forEach((t,i)=>S(g,"text",{x:sx,y:342+i*0,"text-anchor":"middle",class:"sv-ts"},t));};
  root(-1,"西非 → 灵歌 · 劳动号子 · 布鲁斯",["奴隶制、棉花田、教堂"]);
  root(1,"英格兰 · 苏格兰 · 爱尔兰 → 山地民歌",["叙事曲、小提琴舞曲、阿巴拉契亚山区"]);
  S(g,"path",{d:"M 200 262 C 280 228, 400 228, 480 262",class:"sv-l","stroke-width":1.5,"stroke-dasharray":"5 4"});
  S(g,"text",{x:340,y:268,"text-anchor":"middle",class:"sv-r"},"班卓琴：从左边的根走到右边");
  S(g,"text",{x:24,y:120,class:"sv-ts"},"两条根在南方缠了一百多年");
})();
/* 图 2 分节歌 */
(()=>{const g=document.getElementById("strophic");if(!g)return;
  const contour=[0,2,4,4,5,4,2,2,4,6,7,6,4,2,1,0];
  const L=["第一段：一个姑娘住在山谷里……","第二段：一个陌生人骑马来了……","第三段：他说要带她去远方……","第四段：后来，山谷里只剩下风……"];
  L.forEach((txt,r)=>{const y0=20+r*52;S(g,"text",{x:20,y:y0+26,class:"sv-m"},`${r+1}`);
    let d="";contour.forEach((c,i)=>{const x=50+i*16,y=y0+34-c*4;d+=(i?" L ":"M ")+x+" "+y;});
    S(g,"path",{d,class:r===0?"sv-lr":"sv-ld","stroke-width":2.5,"stroke-linejoin":"round"});
    S(g,"text",{x:320,y:y0+26,class:"sv-t"},txt);});
  S(g,"text",{x:50,y:16,class:"sv-r"},"同一条旋律线 ↓");
  const y=244;S(g,"text",{x:20,y:y-8,class:"sv-ts"},"流行歌：");
  [["主歌",70,"sv-card"],["副歌",70,"sv-must"],["主歌",70,"sv-card"],["副歌",70,"sv-must"],["桥段",60,"sv-soft"],["副歌",70,"sv-must"],["副歌",70,"sv-must"]].reduce((x,[t,w,c])=>{S(g,"rect",{x,y,width:w-4,height:34,rx:4,class:c});S(g,"rect",{x,y,width:w-4,height:34,rx:4,class:"sv-l","stroke-width":1});S(g,"text",{x:x+(w-4)/2,y:y+22,"text-anchor":"middle",class:"sv-t"},t);return x+w;},20);
})();
/* 图 3 调式 */
(()=>{const g=document.getElementById("modes-fig");if(!g)return;
  const N=["D","E","F♯","G","A","B","C♯","D"];
  const rows=[["D 伊奥尼亚（大调）",{}],["D 混合利底亚",{6:"C"}],["D 多利亚",{2:"F",6:"C"}]];
  rows.forEach(([name,chg],r)=>{const y=24+r*72;S(g,"text",{x:20,y:y+30,class:"sv-tb"},name);
    N.forEach((n,i)=>{const x=220+i*54,c=chg[i];S(g,"rect",{x,y,width:46,height:46,rx:6,class:c?"sv-red":"sv-card"});if(!c)S(g,"rect",{x,y,width:46,height:46,rx:6,class:"sv-l","stroke-width":1});
      S(g,"text",{x:x+23,y:y+29,"text-anchor":"middle",class:c?"sv-on":"sv-t",style:c?"fill:#FAF5EA;font-size:15px":"font-size:15px"},c||n);
      if(r===0)S(g,"text",{x:x+23,y:y-6,"text-anchor":"middle",class:"sv-m"},String(i+1));});});
})();
/* 图 4 乐器 */
(()=>{const g=document.getElementById("inst-fig");if(!g)return;
  let q=g;const grp=dx=>{q=S(g,"g",{transform:`translate(${dx},0)`});};const lab=(x,t)=>S(q,"text",{x,y:286,"text-anchor":"middle",class:"sv-t"},t);
  const st={class:"sv-l","stroke-width":2};
  // 木吉他
  grp(-26);
  S(q,"path",Object.assign({d:"M 60 150 C 30 150 30 190 50 205 C 25 225 30 270 62 270 C 75 270 82 262 95 262 C 108 262 115 270 128 270 C 160 270 165 225 140 205 C 160 190 160 150 130 150 C 115 150 108 158 95 158 C 82 158 75 150 60 150 Z"},st));
  S(q,"circle",{cx:95,cy:200,r:14,class:"sv-l","stroke-width":2});S(q,"rect",{x:89,y:40,width:12,height:112,class:"sv-l","stroke-width":2});lab(95,"木吉他");
  // 班卓琴
  grp(-50);
  S(q,"circle",{cx:200,cy:225,r:42,class:"sv-soft"});S(q,"circle",{cx:200,cy:225,r:42,class:"sv-l","stroke-width":3});S(q,"rect",{x:195,y:40,width:10,height:144,class:"sv-l","stroke-width":2});
  S(q,"circle",{cx:212,cy:110,r:3,class:"sv-red"});S(q,"line",{x1:212,y1:110,x2:203,y2:250,class:"sv-lr","stroke-width":1});lab(200,"班卓琴");
  S(q,"text",{x:218,y:108,class:"sv-r"},"第五弦");
  // 小提琴
  grp(-65);
  S(q,"path",Object.assign({d:"M 290 150 C 270 150 268 175 280 185 C 266 195 266 225 292 228 C 300 228 304 222 310 222 C 316 222 320 228 328 228 C 354 225 354 195 340 185 C 352 175 350 150 330 150 C 322 150 318 156 310 156 C 302 156 298 150 290 150 Z"},st));
  S(q,"rect",{x:306,y:90,width:8,height:62,class:"sv-l","stroke-width":2});S(q,"path",{d:"M 270 120 L 360 250",class:"sv-ld","stroke-width":2});lab(310,"小提琴");
  // 曼陀林
  grp(-75);
  S(q,"path",Object.assign({d:"M 400 260 C 368 260 368 200 400 170 C 432 200 432 260 400 260 Z"},st));S(q,"rect",{x:396,y:90,width:8,height:82,class:"sv-l","stroke-width":2});S(q,"circle",{cx:400,cy:220,r:8,class:"sv-l","stroke-width":2});lab(400,"曼陀林");
  // Dobro
  grp(-90);
  S(q,"path",Object.assign({d:"M 470 160 C 445 160 445 195 460 205 C 442 222 448 265 474 265 L 526 265 C 552 265 558 222 540 205 C 555 195 555 160 530 160 Z"},st));
  S(q,"circle",{cx:500,cy:222,r:26,class:"sv-must"});S(q,"circle",{cx:500,cy:222,r:26,class:"sv-l","stroke-width":2});S(q,"rect",{x:495,y:60,width:10,height:102,class:"sv-l","stroke-width":2});lab(500,"共鸣吉他");
  // 口琴
  grp(-100);
  S(q,"rect",{x:572,y:200,width:72,height:20,rx:3,class:"sv-l","stroke-width":2});for(let i=0;i<10;i++)S(q,"rect",{x:576+i*6.8,y:207,width:4,height:6,class:"sv-ink"});lab(608,"口琴");
  // 低音提琴
  grp(0);
  S(q,"path",Object.assign({d:"M 590 196 C 570 196 568 222 580 232 C 566 244 568 268 592 268 L 624 268 C 648 268 650 244 636 232 C 648 222 646 196 626 196 Z",transform:"translate(0,-8) scale(1)"},st));
  S(q,"rect",{x:604,y:40,width:8,height:150,class:"sv-l","stroke-width":2});lab(608,"低音提琴");
})();
/* 图 5 律动格子 */
(()=>{const g=document.getElementById("bc-fig");if(!g)return;
  const row=(y,title,cells,w)=>{S(g,"text",{x:20,y:y+26,class:"sv-tb"},title);
    cells.forEach(([t,c],i)=>{const x=190+i*w;S(g,"rect",{x,y,width:w-6,height:40,rx:4,class:c});if(c==="sv-card")S(g,"rect",{x,y,width:w-6,height:40,rx:4,class:"sv-l","stroke-width":1});
      S(g,"text",{x:x+(w-6)/2,y:y+25,"text-anchor":"middle",class:c==="sv-card"||c==="sv-soft"?"sv-t":"sv-on",style:c==="sv-card"||c==="sv-soft"?"":"fill:#FAF5EA"},t);});};
  row(20,"boom-chick（4/4）",[["嘭 · 根音","sv-denim"],["恰","sv-must"],["嘭 · 五音","sv-denim"],["恰","sv-must"]],116);
  row(100,"华尔兹（3/4）",[["嘭","sv-denim"],["恰","sv-must"],["恰","sv-must"]],116);
  row(180,"火车节奏",[["·","sv-soft"],["·","sv-soft"],["咔","sv-red"],["·","sv-soft"],["·","sv-soft"],["·","sv-soft"],["咔","sv-red"],["·","sv-soft"]],58);
  S(g,"text",{x:190,y:244,class:"sv-ts"},"刷子在军鼓上一直扫（八分音符），第 2、4 拍重一点");
  S(g,"text",{x:190,y:166,class:"sv-ts"},"一小节三拍：第一拍低音，后两拍扫弦");
})();
/* 图 6 两个货架 */
(()=>{const g=document.getElementById("split-fig");if(!g)return;
  S(g,"rect",{x:190,y:14,width:300,height:56,rx:6,class:"sv-soft"});S(g,"text",{x:340,y:38,"text-anchor":"middle",class:"sv-tb"},"美国南方的音乐人");S(g,"text",{x:340,y:58,"text-anchor":"middle",class:"sv-ts"},"同样的矿区、铁路、工厂和电台");
  const shelf=(x,col,a,b,c)=>{S(g,"path",{d:`M 340 70 C 340 100, ${x+110} 90, ${x+110} 120`,class:col==="d"?"sv-ld":"sv-lr","stroke-width":3});
    S(g,"rect",{x,y:120,width:220,height:94,rx:6,class:"sv-card"});S(g,"rect",{x,y:120,width:220,height:94,rx:6,class:col==="d"?"sv-ld":"sv-lr","stroke-width":2});
    S(g,"text",{x:x+110,y:146,"text-anchor":"middle",class:"sv-tb"},a);S(g,"text",{x:x+110,y:170,"text-anchor":"middle",class:"sv-t"},b);S(g,"text",{x:x+110,y:196,"text-anchor":"middle",class:col==="d"?"sv-d":"sv-r"},c);};
  shelf(60,"d","“hillbilly 唱片”","白人音乐人","1949 年改名：乡村与西部");
  shelf(400,"r","“race 唱片”","黑人音乐人","1949 年改名：节奏布鲁斯");
  S(g,"line",{x1:340,y1:120,x2:340,y2:214,class:"sv-l","stroke-width":2,"stroke-dasharray":"6 5"});
  S(g,"text",{x:340,y:244,"text-anchor":"middle",class:"sv-t"},"分类依据是肤色，不是音乐");
  S(g,"text",{x:340,y:272,"text-anchor":"middle",class:"sv-ts"},"2019 年：《Old Town Road》被移出乡村榜，同一个问题再次出现");
})();
/* 图 7 数字谱 */
(()=>{const g=document.getElementById("nns-fig");if(!g)return;
  const x0=110,w=66;S(g,"text",{x:20,y:46,class:"sv-tb"},"数字谱");
  NUMS.forEach((n,i)=>{const x=x0+i*w+(i>=4?14:0);S(g,"rect",{x,y:20,width:w-8,height:40,rx:5,class:"sv-denim"});S(g,"text",{x:x+(w-8)/2,y:47,"text-anchor":"middle",class:"sv-on",style:"fill:#FAF5EA;font-size:18px;font-family:var(--font-mono)"},String(n));});
  S(g,"line",{x1:x0+4*w+3,y1:16,x2:x0+4*w+3,y2:250,class:"sv-l","stroke-width":2});
  ["G","D","A"].forEach((k,r)=>{const y=86+r*58;S(g,"text",{x:20,y:y+26,class:"sv-t"},k+" 调");
    NUMS.forEach((n,i)=>{const x=x0+i*w+(i>=4?14:0),ch=KEYS[k].ch[n];S(g,"rect",{x,y,width:w-8,height:40,rx:5,class:"sv-card"});S(g,"rect",{x,y,width:w-8,height:40,rx:5,class:n===1?"sv-ld":n===4?"sv-lr":"sv-l","stroke-width":n===5?1:2});
      S(g,"text",{x:x+(w-8)/2,y:y+26,"text-anchor":"middle",class:"sv-t",style:"font-size:15px;font-weight:700"},ch);});});
})();
/* 图 8 滚奏六线谱 */
(()=>{const g=document.getElementById("roll-fig");if(!g)return;
  const x0=70,top=30,gap=26,cw=34;
  ["1 (D)","2 (B)","3 (G)","4 (D)","5 (g)"].forEach((n,s)=>{S(g,"line",{x1:x0,y1:top+s*gap,x2:x0+16*cw+30,y2:top+s*gap,class:"sv-l","stroke-width":1});S(g,"text",{x:x0-8,y:top+s*gap+4,"text-anchor":"end",class:"sv-m"},n);});
  S(g,"line",{x1:x0+8*cw+15,y1:top,x2:x0+8*cw+15,y2:top+4*gap,class:"sv-l","stroke-width":2});
  const fret={G:{1:0,2:0,3:0,5:0},C:{1:2,2:1,3:0,5:0}};
  ["G","C"].forEach((ch,bi)=>{S(g,"text",{x:x0+bi*(8*cw+30)+10,y:top-10,class:"sv-tb"},ch);
    ROLL.forEach(([s,f],k)=>{const x=x0+20+bi*(8*cw+30)+k*cw,y=top+(s-1)*gap;S(g,"circle",{cx:x,cy:y,r:10,class:k===0||k===3||k===6?"sv-red":"sv-card"});S(g,"circle",{cx:x,cy:y,r:10,class:"sv-l","stroke-width":1});
      S(g,"text",{x,y:y+4,"text-anchor":"middle",class:"sv-m",style:k===0||k===3||k===6?"fill:#FAF5EA":""},String(fret[ch][s]));
      S(g,"text",{x,y:top+4*gap+30,"text-anchor":"middle",class:f==="T"?"sv-r":f==="I"?"sv-d":"sv-t",style:"font-family:var(--font-mono);font-size:13px;font-weight:700"},f);});});
  S(g,"text",{x:x0,y:top+4*gap+62,class:"sv-ts"},"红色圆点是每组的第一个音：3 + 3 + 2，八个音一小节。第 5 弦是那根短弦，永远弹同一个高音 g。");
})();
/* 外部照片 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`照片待放入：${img.getAttribute("src")}<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张照片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
