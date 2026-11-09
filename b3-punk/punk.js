/* 原创旋律：以 E 布鲁斯音阶为基础，[拍, midi, 时值, 选项] */
const CALL_A=[[0,67,.6,{}],[.67,69,.33,{}],[1,67,.9,{}],[2,64,1.7,{fall:-1}]];
const CALL_B=[[0,71,.6,{}],[.67,74,.33,{}],[1,71,.6,{}],[1.67,69,.33,{}],[2,67,.6,{}],[2.67,64,1.4,{fall:-1}]];
const ANS_SLIDE=[[0,67,{from:-2,glide:.2}],[.67,64,{}],[1,62,{}],[1.67,64,{from:-1}],[2.33,59,{}],[3,64,{from:-2,glide:.3}]];
const ANS_HARP=[[0,67,.5,{from:-1}],[.67,64,.3,{}],[1,62,.6,{}],[2,64,1.2,{from:-1.5,glide:.25}]];
const ANS_EL=[[0,79,{from:-2,glide:.15,vib:1}],[.67,76,{}],[1,74,{}],[1.33,76,{}],[2,71,{from:-1,vib:1}],[3,76,{vib:1}]];

function sing(t0,beat,bar,phrase){phrase.forEach(([b,m,d,o])=>voice(t0+(bar*4+b)*beat,m,d*beat,o));}
function answer(t0,beat,bar,kind){
  if(kind==="slide")ANS_SLIDE.forEach(([b,m,o])=>pluck(t0+(bar*4+b)*beat,m,"ac",Object.assign({vol:.9},o)));
  if(kind==="harp")ANS_HARP.forEach(([b,m,d,o])=>harp(t0+(bar*4+b)*beat,m+12,d*beat,o));
  if(kind==="ampharp")ANS_HARP.forEach(([b,m,d,o])=>harp(t0+(bar*4+b)*beat,m+12,d*beat,Object.assign({amp:1},o)));
  if(kind==="el")ANS_EL.forEach(([b,m,o])=>pluck(t0+(bar*4+b)*beat,m,"dr",Object.assign({vol:1.1},o)));
}
/* 三角洲：木吉他拇指低音 + 高音和弦切分 + 人声 + 滑棒回答 */
function playDelta(t0,o={}){
  const key=40,bpm=o.bpm||76,beat=60/bpm,bars=PROG.std.bars;
  bars.forEach((f,bi)=>{
    const ch=chordOf(key,f),root=ch[0],bt=t0+bi*4*beat;
    for(let k=0;k<4;k++){const t=bt+k*beat;pluck(t,root,"ac",{vol:.85,mute:beat*.9});stomp(t);
      if(k%2===1||o.full)strum(t+beat*2/3,[ch[1]+12,ch[2]+12,ch[3]+12],"ac",{vol:.35,mute:.25});}
  });
  if(o.vox!==false){[0,4].forEach(b=>sing(t0,beat,b,CALL_A));sing(t0,beat,8,CALL_B);}
  [2,6,10].forEach(b=>answer(t0,beat,b,o.ans||"slide"));
  return 12*4*beat;
}
/* 芝加哥：过载吉他 boogie（5-6 交替）、贝斯 boogie、鼓 shuffle、口琴 */
const BOOGIE=[0,4,7,9,10,9,7,4];
function chicagoBar(t,key,f,beat,o){
  const r=key+DEG[f][0];
  for(let k=0;k<8;k++){const t2=eighth(t,beat,k,o.swing);
    if(o.bass)pluck(t2,r-12+BOOGIE[k],"bass",{vol:.9,mute:beat*.6});
    if(o.gtr)strum(t2,[r,r+(k%4<2?7:9)],"dr",{vol:.55,mute:beat*.35,spread:.006});
    if(o.drums){hat(t2,k%2?.6:1);}
  }
  if(o.drums)for(let k=0;k<4;k++){const tb=t+k*beat;if(k%2===0)kick(tb,.9);else snare(tb,o.rock?1.1:.8,!o.rock&&o.brush);}
}
function playChicago(t0,o={}){
  const key=40,bpm=o.bpm||100,beat=60/bpm,bars=PROG.std.bars;
  bars.forEach((f,bi)=>chicagoBar(t0+bi*4*beat,key,f,beat,{swing:true,bass:true,gtr:o.gtr!==false,drums:true}));
  if(o.vox!==false){[0,4].forEach(b=>sing(t0,beat,b,CALL_A));sing(t0,beat,8,CALL_B);}
  if(o.ans!==false)[2,6,10].forEach(b=>answer(t0,beat,b,"ampharp"));
  return 12*4*beat;
}
function playRock(t0){
  const key=40,bpm=168,beat=60/bpm,bars=PROG.std.bars;
  bars.forEach((f,bi)=>{const t=t0+bi*4*beat,r=key+DEG[f][0];
    for(let k=0;k<8;k++){const t2=eighth(t,beat,k,false);
      pluck(t2,r-12+BOOGIE[k],"bass",{vol:.9,mute:beat*.45});
      strum(t2,[r+12+(k%4<2?7:9),r+24],"dr",{vol:.5,mute:beat*.3,spread:.004});
      hat(t2,k%2?.5:.9);}
    for(let k=0;k<4;k++){const tb=t+k*beat;if(k%2===0)kick(tb,1);else snare(tb,1.2);}
  });
  return 12*4*beat;
}
function playStop(t0){
  const key=40,bpm=96,beat=60/bpm,bars=PROG.std.bars;
  for(let bi=0;bi<4;bi++){const t=t0+bi*4*beat,r=key;
    pluck(t,r-12,"bass",{vol:1,mute:beat*.5});strum(t,[r,r+7,r+12],"dr",{vol:.7,mute:beat*.5});kick(t,1);snare(t,.8);
    pluck(t+beat*2/3,r-12,"bass",{vol:.9,mute:beat*.4});strum(t+beat*2/3,[r,r+7,r+12],"dr",{vol:.6,mute:beat*.4});kick(t+beat*2/3,.8);
    voice(t+beat*1.4,bi%2?69:67,beat*.9,{});voice(t+beat*2.4,bi%2?67:64,beat*1.3,{fall:-1});}
  for(let bi=4;bi<12;bi++)chicagoBar(t0+bi*4*beat,key,bars[bi],beat,{swing:true,bass:true,gtr:true,drums:true});
  sing(t0,beat,4,CALL_A);sing(t0,beat,8,CALL_B);answer(t0,beat,6,"ampharp");answer(t0,beat,10,"ampharp");
  return 12*4*beat;
}
/* 实验 01：网格 */
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
function stripNear(btn){const lab=btn.closest(".lab");return lab?lab.querySelector("[data-strip]"):null;}
const DEMOS={
  chicago:(t,btn)=>{const d=playChicago(t,{});lightStrip(stripNear(btn),t,4*60/100,12);return d;},
  rocknroll:(t,btn)=>{const d=playRock(t);lightStrip(stripNear(btn),t,4*60/168,12);return d;}
};
function runDemo(name,btn){
  newBus();setActive(btn);
  const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;
  later(()=>{clearActive();},d+.4);
}

/* ================= 朋克章：乐器补充 ================= */
INST.pk={bright:.92,decay:.9992,dur:1.8,vol:.17,drive:14,lp:3600};
INST.cl={bright:.85,decay:.9985,dur:2,vol:.45,lp:5200};
function crash(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=4500;const g=a.createGain();g.gain.setValueAtTime(.32*v,t);g.gain.exponentialRampToValueAtTime(.001,t+1.3);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+1.35);track(n);}
function stick(t){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=2600;f.Q.value=3;const g=a.createGain();g.gain.setValueAtTime(.6,t);g.gain.exponentialRampToValueAtTime(.001,t+.05);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+.06);track(n);
  const o=a.createOscillator(),og=a.createGain();o.frequency.value=1900;og.gain.setValueAtTime(.12,t);og.gain.exponentialRampToValueAtTime(.001,t+.03);o.connect(og).connect(bus);o.start(t);o.stop(t+.04);track(o);}
function tom(t,f=120,v=1){const a=A(),o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(f*1.6,t);o.frequency.exponentialRampToValueAtTime(f,t+.08);g.gain.setValueAtTime(.55*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g).connect(bus);o.start(t);o.stop(t+.4);track(o);}
function shout(t,midi,dur,o={}){
  const a=A(),os=a.createOscillator(),os2=a.createOscillator();os.type="sawtooth";os2.type="sawtooth";const f=mf(midi)*(o.det||1);
  os.frequency.setValueAtTime(f*1.03,t);os.frequency.linearRampToValueAtTime(f,t+.04);os.frequency.linearRampToValueAtTime(f*Math.pow(2,(o.fall||-2)/12),t+dur);
  os2.frequency.setValueAtTime(f*1.012,t);os2.frequency.linearRampToValueAtTime(f*Math.pow(2,(o.fall||-2)/12)*1.01,t+dur);
  const sh=a.createWaveShaper();sh.curve=shaper(o.drive||5);
  const g=a.createGain(),v=(o.vol||1)*.32;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.setValueAtTime(v,t+dur*.7);g.gain.linearRampToValueAtTime(0,t+dur);
  const out=a.createGain();
  [[780,5,1],[1250,7,.7],[2700,8,.35]].forEach(([fr,q,amt])=>{const bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=fr;bp.Q.value=q;const gg=a.createGain();gg.gain.value=amt*3;sh.connect(bp).connect(gg).connect(out);});
  os.connect(sh);os2.connect(sh);out.connect(g).connect(bus);
  [os,os2].forEach(x=>{x.start(t);x.stop(t+dur+.05);track(x);});
}
function lofiBus(){
  const b=newBus();b.disconnect();
  const hp=ac.createBiquadFilter();hp.type="highpass";hp.frequency.value=450;
  const lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.value=2600;
  const sh=ac.createWaveShaper();sh.curve=shaper(2.2);const g=ac.createGain();g.gain.value=.95;
  b.connect(hp).connect(lp).connect(sh).connect(g).connect(master);
  const n=ac.createBufferSource();n.buffer=noise();n.loop=true;const nf=ac.createBiquadFilter();nf.type="highpass";nf.frequency.value=4000;const ng=ac.createGain();ng.gain.value=.035;
  n.connect(nf).connect(ng).connect(b);n.start();track(n);
  return n;
}
/* ================= 朋克章：节奏型 ================= */
function pcBar(t,beat,root,o={}){for(let k=0;k<8;k++){strum(t+k*beat/2,[root,root+7,root+12],"pk",{vol:o.vol||1,mute:o.mute?beat*.2:beat*.47,spread:.004});}}
function bassBar(t,beat,root,o={}){for(let k=0;k<8;k++)pluck(t+k*beat/2,root-12,"bass",{vol:o.vol||1.1,mute:beat*.42});}
function drumBar(t,beat,style,v=1){
  for(let k=0;k<8;k++){const t2=t+k*beat/2;
    if(style==="rock"){hat(t2,(k%2?.5:.9)*v);if(k===0||k===4)kick(t2,v);if(k===2||k===6)snare(t2,.9*v);}
    if(style==="punk"){hat(t2,1*v);if(k===0||k===3||k===4)kick(t2,v);if(k===2||k===6)snare(t2,1.15*v);}
    if(style==="hc"){hat(t2,.55*v);if(k%2===0)kick(t2,.95*v);else snare(t2,1*v);}
    if(style==="verse"){hat(t2,.6*v);if(k===0||k===4||k===5)kick(t2,.8*v);if(k===2||k===6)snare(t2,.8*v);}
    if(style==="post"){if(k%2===0)hat(t2,.5*v);if(k===0||k===4)kick(t2,v);if(k===2||k===6)snare(t2,.6*v);if(k===3)tom(t2,140,v);if(k===5)tom(t2,110,v);if(k===7)tom(t2,90,v);}
  }
}
function countIn(t,beat){for(let k=0;k<4;k++)stick(t+k*beat);return t+4*beat;}
function bpmP(){return +document.getElementById("bpmP").value;}
const PROGS={prog1:[45,50,52,50],prog2:[40,38,45,45],prog3:[40,47,49,45]};
function playProg(t0,roots,bpm){
  const beat=60/bpm;let t=countIn(t0,beat);
  for(let c=0;c<2;c++){roots.forEach((r,i)=>{const tb=t+(c*4+i)*4*beat;if(i===0)crash(tb);pcBar(tb,beat,r);bassBar(tb,beat,r);drumBar(tb,beat,"punk");});}
  const end=t+8*4*beat;strum(end,[roots[0],roots[0]+7,roots[0]+12],"pk",{vol:1.1,dur:1.8});crash(end,1.2);kick(end);
  return end-t0+1.8;
}
function play12punk(t0,btn){
  const beat=60/192,bars=PROG.std.bars;
  bars.forEach((f,bi)=>{const r=40+DEG[f][0],tb=t0+bi*4*beat;if(bi===0||bi===4||bi===8)crash(tb);pcBar(tb,beat,r);bassBar(tb,beat,r);drumBar(tb,beat,"punk");});
  lightStrip(stripNear(btn),t0,4*beat,12);
  return 48*beat+.5;
}
/* ================= 朋克章：示例 ================= */
Object.assign(DEMOS,{
  "triad-clean":t=>{strum(t,[40,47,52,56,59,64],"cl",{vol:.8,dur:2.2,spread:.02});return 2.4;},
  "triad-dist":t=>{strum(t,[40,47,52,56,59,64],"pk",{vol:.9,dur:2.2,spread:.02});return 2.4;},
  "power-dist":t=>{strum(t,[40,47,52],"pk",{vol:1.3,dur:2.2,spread:.015});return 2.4;},
  prog1:t=>playProg(t,PROGS.prog1,bpmP()),
  prog2:t=>playProg(t,PROGS.prog2,bpmP()),
  prog3:t=>playProg(t,PROGS.prog3,bpmP()),
  "beat-rock":t=>{const beat=60/120;for(let b=0;b<4;b++){const tb=t+b*4*beat;drumBar(tb,beat,"rock");bassBar(tb,beat,b===2?45:40,{vol:.9});}return 16*beat+.3;},
  "beat-punk":t=>{const beat=60/180;for(let b=0;b<4;b++){const tb=t+b*4*beat;if(b===0)crash(tb);drumBar(tb,beat,"punk");bassBar(tb,beat,b===2?45:40);pcBar(tb,beat,b===2?45:40,{vol:.7});}return 16*beat+.3;},
  "beat-hc":t=>{const beat=60/220;for(let b=0;b<4;b++){const tb=t+b*4*beat;if(b===0)crash(tb);drumBar(tb,beat,"hc");bassBar(tb,beat,[40,41,43,41][b]);pcBar(tb,beat,[40,41,43,41][b],{vol:.75});}return 16*beat+.6;},
  studio:t=>{const beat=60/170;PROGS.prog2.forEach((r,i)=>{const tb=t+i*4*beat;if(i===0)crash(tb);pcBar(tb,beat,r);bassBar(tb,beat,r);drumBar(tb,beat,"punk");});return 16*beat+.6;},
  garage:t=>DEMOS.studio(t),
  sing:t=>{[[0,64,.9],[.9,67,.5],[1.4,69,1.4]].forEach(([s,m,d])=>voice(t+s,m,d,{from:-1,vibDepth:30}));return 3.2;},
  shout:t=>{[[0,64,.5],[.6,67,.35],[1,69,.9]].forEach(([s,m,d])=>shout(t+s,m,d,{}));return 2.3;},
  gang:t=>{const beat=60/150;for(let r=0;r<4;r++){const tb=t+r*2*beat;kick(tb);snare(tb+beat,1.1);[0,1,2,3,4].forEach(i=>shout(tb+i*.012,r%2?60:57,beat*.55,{det:1+(i-2)*.006,vol:.55,drive:4+i}));}return 8*beat+.5;},
  punk12:(t,btn)=>play12punk(t,btn),
  postpunk:t=>{const beat=60/132,bl=[52,52,55,57,59,57,55,50];
    for(let b=0;b<4;b++){const tb=t+b*4*beat;drumBar(tb,beat,"post");
      bl.forEach((m,k)=>pluck(tb+k*beat/2,m-(b===3?2:0),"bass",{vol:1.2,mute:beat*.45}));
      [64,71,74,78,74,71,64,67].forEach((m,k)=>{pluck(tb+k*beat/2,m+12,"cl",{vol:.5});pluck(tb+k*beat/2+.018,m+12,"cl",{vol:.3,from:.08,glide:.01});});}
    return 16*beat+1;},
  hardcore:t=>{const beat=60/225,rs=[40,41,43,41,40,41,43,46];rs.forEach((r,i)=>{const tb=t+i*4*beat;if(i%4===0)crash(tb);drumBar(tb,beat,"hc");pcBar(tb,beat,r);bassBar(tb,beat,r);});
    const end=t+32*beat;strum(end,[40,47,52],"pk",{vol:1.2,mute:.25});crash(end,1.3);kick(end);return 32*beat+1.2;},
  poppunk:t=>{const beat=60/178,rs=[40,47,49,45];
    rs.forEach((r,i)=>{const tb=t+i*4*beat;drumBar(tb,beat,"verse",.85);pcBar(tb,beat,r,{mute:true,vol:.8});bassBar(tb,beat,r,{vol:.9});});
    const t2=t+16*beat;rs.forEach((r,i)=>{const tb=t2+i*4*beat;if(i===0)crash(tb,1.2);drumBar(tb,beat,"punk");pcBar(tb,beat,r);bassBar(tb,beat,r);});
    [[0,68,1.5],[1.5,68,.5],[2,71,1],[3,69,1],[4,71,1.5],[5.5,71,.5],[6,73,1],[7,71,1],[8,68,2],[10,66,1],[11,64,1],[12,64,2],[14,66,1],[15,68,1]].forEach(([b,m,d])=>voice(t2+b*beat,m,d*beat*.95,{from:-1,vibDepth:14,vol:.8}));
    return 32*beat+.8;}
});
document.getElementById("bpmP").addEventListener("input",e=>document.getElementById("bpmPv").textContent=e.target.value);
/* 车库版：重写运行逻辑，使用低保真总线 */
const _run=runDemo;
runDemo=function(name,btn){
  if(name!=="garage")return _run(name,btn);
  const hiss=lofiBus();setActive(btn);const t=A().currentTime+.12,d=DEMOS.studio(t);
  hiss.stop(t+d);
  later(stopDemos,d+.4);
};

/* ================= 推荐曲目 ================= */
const SONGS=[
  {side:"A",q:"The Stooges I Wanna Be Your Dog 1969",title:"I Wanna Be Your Dog",by:"The Stooges",yr:"1969",style:"原型朋克",
   txt:"底特律的 The Stooges 首张专辑里的歌。三个和弦反复轰鸣，加上一个单调到催眠的钢琴音，比朋克早了七年，却已经是朋克的样子。",
   listen:["整首歌几乎就是三个和弦不停地循环","吉他失真粗糙，没有任何修饰","对比本章实验 02：这就是“三和弦生成器”的原始版本"]},
  {side:"A",yt:"268C3N2dDYk",title:"Blitzkrieg Bop",by:"Ramones",yr:"1976",style:"纽约朋克",
   txt:"Ramones 首张专辑的第一首歌，通常被当作朋克的起点。开头那句全员团唱的口号，是朋克最有名的开场之一。",
   listen:["吉他全部下拨，像机关枪一样平均密集","整首歌只有两分多钟，没有吉他独奏","注意团唱：所有人一起喊同一句"]},
  {side:"A",yt:"YJRnwaEUNkM",title:"Anarchy in the U.K.",by:"Sex Pistols",yr:"1976",style:"伦敦朋克",
   txt:"Sex Pistols 的第一张单曲。Johnny Rotten 那种尖利、嘲讽、故意拖长音的唱法，和 Ramones 的憨直完全不同。",
   listen:["开头的吉他下行和弦，像一堵墙压过来","主唱不是在唱，是在“演”：嘲笑、挑衅","对比 Ramones：伦敦朋克更愤怒，也更像一场表演"]},
  {side:"A",q:"The Damned New Rose 1976",title:"New Rose",by:"The Damned",yr:"1976",style:"伦敦朋克",
   txt:"通常被认为是英国第一张朋克单曲，比《Anarchy in the U.K.》还早一个月发行。",
   listen:["鼓的开场非常有冲击力","速度比 Sex Pistols 更快，更接近后来的硬核"]},
  {side:"A",q:"Buzzcocks Ever Fallen in Love 1978",title:"Ever Fallen in Love (With Someone You Shouldn't've)",by:"Buzzcocks",yr:"1978",style:"曼彻斯特 · 流行朋克先驱",
   txt:"本章开头那场演出的组织者。Buzzcocks 把朋克的速度和吉他，配上了一段好记到让人忘不掉的旋律，唱的是爱上不该爱的人。",
   listen:["朋克的编制，流行歌的旋律","对比后面的 Green Day：二十年后的流行朋克几乎就是这首歌的后代"]},
  {side:"A",yt:"EfK-WX2pa8c",title:"London Calling",by:"The Clash",yr:"1979",style:"伦敦朋克 · 融合",
   txt:"同名双专辑的主打歌。The Clash 在这张专辑里把朋克和雷鬼、斯卡、山区摇滚、爵士都融在了一起，证明朋克不只是三个和弦。",
   listen:["节奏是一种行进式的、略带雷鬼味的律动","Joe Strummer 的嗓音沙哑、带着末日感","对比 Sex Pistols：同样愤怒，但音乐性更丰富"]},
  {side:"B",q:"Joy Division Love Will Tear Us Apart 1980",title:"Love Will Tear Us Apart",by:"Joy Division",yr:"1980",style:"后朋克",
   txt:"曼彻斯特的 Joy Division，成员据说就在本章开头那场 Sex Pistols 演出的台下。几年后，他们做出了和朋克完全不同的东西：冷、阴郁、充满疏离感。",
   listen:["贝斯弹的是旋律，而不只是根音（对照实验 07 的后朋克）","合成器和清亮的吉他，取代了失真的强力和弦","速度放慢了，情绪却更沉重"]},
  {side:"B",q:"Black Flag Rise Above 1981",title:"Rise Above",by:"Black Flag",yr:"1981",style:"洛杉矶硬核",
   txt:"Black Flag 是美国硬核的代表，吉他手 Greg Ginn 还创办了独立厂牌 SST。这首歌是硬核圈子里的团结口号。",
   listen:["速度极快，鼓几乎不停","团唱的副歌像一场集会","对比实验 03 的“硬核”鼓型"]},
  {side:"B",q:"Minor Threat Straight Edge 1981",title:"Straight Edge",by:"Minor Threat",yr:"1981",style:"华盛顿硬核",
   txt:"一首不到一分钟的歌，却催生了一整个拒绝烟酒和毒品的青年亚文化。主唱 Ian MacKaye 后来创办了独立厂牌 Dischord。",
   listen:["数一数它有多短","对比图 3：这就是“不到 1 分钟”的那首"]},
  {side:"B",q:"THE BLUE HEARTS リンダリンダ",title:"リンダリンダ（Linda Linda）",by:"THE BLUE HEARTS",yr:"1987",style:"日本朋克",
   txt:"THE BLUE HEARTS 的出道单曲，日本最国民级的朋克歌曲之一。真诚、简单，带着一点笨拙的温柔。",
   listen:["主歌安静，副歌一下子爆发，全场一起喊","朋克的简单直接，配上日语的直白歌词"]},
  {side:"B",q:"Nirvana Smells Like Teen Spirit",title:"Smells Like Teen Spirit",by:"Nirvana",yr:"1991",style:"垃圾摇滚",
   txt:"Kurt Cobain 是朋克的信徒。这首歌把朋克的态度、金属的厚重和流行的旋律揉在一起，让“另类”音乐冲进了主流。",
   listen:["主歌安静、副歌爆炸的强弱对比","吉他用的仍然是强力和弦"]},
  {side:"B",yt:"NUTGr5t3MoY",title:"Basket Case",by:"Green Day",yr:"1994",style:"流行朋克",
   txt:"专辑《Dookie》里的歌，让流行朋克在 1990 年代红遍全球。很多人说它的和弦进行和帕赫贝尔的《卡农》很像。",
   listen:["主歌闷音、副歌全开，对照实验 07 的流行朋克","速度很快，旋律却非常好记","这类歌就是美国酒吧翻唱乐队的常备曲目"]}
];
const ICON="M8 5v14l11-7z";
SONGS.forEach(s=>{
  const el=document.createElement("div");el.className="song";
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<div class="gigdate">${[...s.yr].map(c=>`<i>${c}</i>`).join("")}<small>${s.side==="A"?"SIDE A":"SIDE B"} · NO FUTURE</small></div>
  <div><div class="meta"><span class="by">${s.by}</span><span class="title">${s.title}</span><span class="yr">${s.yr}</span><span class="style">${s.style}</span></div>
  <p>${s.txt}</p><ul class="listen">${s.listen.map(x=>`<li>${x}</li>`).join("")}</ul>
  <div class="listen-links"><a class="main" href="${yt}" target="_blank" rel="noopener">${s.yt?"YouTube 官方音源":"YouTube 搜索"}</a>
  <a href="https://music.163.com/#/search/m/?s=${q}&type=1" target="_blank" rel="noopener">网易云</a>
  <a href="https://y.qq.com/n/ryqq/search?w=${q}" target="_blank" rel="noopener">QQ音乐</a></div></div>
  <a class="playlink" href="${yt}" target="_blank" rel="noopener" aria-label="在 YouTube 收听 ${s.title}"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="${ICON}"/></svg></a>`;
  document.getElementById(s.side==="A"?"songsA":"songsB").appendChild(el);
});

/* ================= 示例调度 ================= */
document.querySelectorAll("[data-strip]").forEach(s=>{for(let i=0;i<12;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
document.getElementById("stopAll").addEventListener("click",stopDemos);

/* ================= 原创图解 ================= */
const NS="http://www.w3.org/2000/svg";
function S(p,tag,a,txt){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e;}
/* 图 1 */
(()=>{const g=document.getElementById("kbc");if(!g)return;
  const kb=(x0,title,on,cross,label)=>{S(g,"text",{x:x0,y:22,class:"sv-tb"},title);
    for(let i=0;i<8;i++){const x=x0+i*36,hit=on.includes("w"+i);S(g,"rect",{x,y:36,width:36,height:130,class:hit?"sv-hi":"sv-paper"});S(g,"rect",{x,y:36,width:36,height:130,class:"sv-l","stroke-width":1.5});
      if(hit)S(g,"circle",{cx:x+18,cy:146,r:7,class:"sv-ink"});}
    [[1,"b1"],[2,"b2"],[3,"b3"],[5,"b5"],[6,"b6"]].forEach(([after,id])=>{const x=x0+after*36-11;S(g,"rect",{x,y:36,width:22,height:80,class:on.includes(id)?"sv-pink":"sv-ink"});
      if(cross===id){S(g,"rect",{x,y:36,width:22,height:80,class:"sv-p2"});S(g,"path",{d:`M${x-4} 60 L${x+26} 96 M${x+26} 60 L${x-4} 96`,class:"sv-lp","stroke-width":4});}});
    S(g,"text",{x:x0,y:196,class:"sv-t"},label);};
  kb(30,"普通和弦（E 大三和弦）",["w0","b2","w4"],null,"E · G♯ · B　三个音");
  kb(370,"强力和弦（E5）",["w0","w4","w7"],"b2","E · B · E　没有三音 G♯");
  S(g,"text",{x:370,y:222,class:"sv-r"},"没有三音 → 不分明亮还是忧伤");
  S(g,"text",{x:30,y:222,class:"sv-ts"},"G♯ 决定了它是明亮的大调");
})();
/* 图 2 */
(()=>{const g=document.getElementById("fbp");if(!g)return;
  const board=(x0,fr0,title,dots,mute)=>{S(g,"text",{x:x0,y:22,class:"sv-tb"},title);
    const fw=56,top=50;for(let s=0;s<6;s++)S(g,"line",{x1:x0,y1:top+s*26,x2:x0+fw*4,y2:top+s*26,class:"sv-l","stroke-width":.8+s*.3});
    for(let f=0;f<=4;f++)S(g,"line",{x1:x0+f*fw,y1:top,x2:x0+f*fw,y2:top+130,class:"sv-l","stroke-width":f===0&&fr0===0?6:1.2});
    for(let f=1;f<=4;f++)S(g,"text",{x:x0+(f-.5)*fw,y:top+156,"text-anchor":"middle",class:"sv-m"},(fr0+f)+" 品");
    ["e","B","G","D","A","E"].forEach((n,s)=>S(g,"text",{x:x0-40,y:top+s*26+4,class:"sv-m"},n));
    mute.forEach(s=>S(g,"text",{x:x0-16,y:top+s*26+4,"text-anchor":"middle",class:"sv-r"},"×"));
    dots.forEach(([s,f,lab])=>{const cx=f===0?x0-8:x0+(f-fr0-.5)*fw,cy=top+s*26;S(g,"circle",{cx,cy,r:11,class:f===0?"sv-paper":"sv-ink"});if(f===0)S(g,"circle",{cx,cy,r:11,class:"sv-l","stroke-width":2});
      S(g,"text",{x:cx,y:cy+4,"text-anchor":"middle",class:f===0?"sv-m":"sv-on"},lab);});};
  board(70,0,"E5 · 开放把位",[[5,0,"E"],[4,2,"B"],[3,2,"E"]],[0,1,2]);
  board(400,4,"A5 · 第 5 品（同一个手形）",[[5,5,"A"],[4,7,"E"],[3,7,"A"]],[0,1,2]);
  S(g,"path",{d:"M 310 110 L 380 110",class:"sv-lp","stroke-width":3});S(g,"path",{d:"M 372 102 L 382 110 L 372 118",class:"sv-lp","stroke-width":3});
  S(g,"text",{x:316,y:98,class:"sv-r"},"平移");
})();
/* 图 3 */
(()=>{const g=document.getElementById("len");if(!g)return;
  const D=[["Yes《Close to the Edge》· 1972",1123,"18:43"],["Led Zeppelin《Stairway to Heaven》· 1971",482,"8:02"],["Sex Pistols《Anarchy in the U.K.》· 1976",212,"3:32"],["Ramones《Blitzkrieg Bop》· 1976",132,"2:12"],["Minor Threat《Straight Edge》· 1981",46,"约 0:46"]];
  const x0=40,W=540;D.forEach(([l,s,v],i)=>{const y=20+i*50,w=Math.max(6,s/1123*W);S(g,"text",{x:x0,y,class:"sv-t"},l);
    S(g,"rect",{x:x0,y:y+8,width:w,height:18,class:i<2?"sv-ink":"sv-hi"});if(i>=2)S(g,"rect",{x:x0,y:y+8,width:w,height:18,class:"sv-l","stroke-width":1.5});
    S(g,"text",{x:x0+w+8,y:y+22,class:"sv-m"},v);});
  S(g,"text",{x:40,y:266,class:"sv-ts"},"黑色：1970 年代初的大型摇滚　黄色：朋克与硬核");
})();
/* 图 4 */
(()=>{const g=document.getElementById("drm");if(!g)return;
  const G=[["基本摇滚 · ~120",[0,1,2,3,4,5,6,7],[2,6],[0,4]],["朋克 · ~180",[0,1,2,3,4,5,6,7],[2,6],[0,3,4]],["硬核 · 200+",[0,1,2,3,4,5,6,7],[1,3,5,7],[0,2,4,6]]];
  const x0=170,cw=56,rh=22;G.forEach(([t,h,s,k],gi)=>{const y0=14+gi*106;S(g,"text",{x:20,y:y0+40,class:"sv-tb"},t);
    for(let c=0;c<8;c++)S(g,"text",{x:x0+c*cw+cw/2,y:y0+4,"text-anchor":"middle",class:"sv-m"},["1","&","2","&","3","&","4","&"][c]);
    [["踩镲",h,"sv-ink"],["军鼓",s,"sv-pink"],["底鼓",k,"sv-ink"]].forEach(([n,arr,cls],r)=>{const y=y0+12+r*(rh+4);S(g,"text",{x:x0-10,y:y+15,"text-anchor":"end",class:"sv-ts"},n);
      for(let c=0;c<8;c++){const on=arr.includes(c);S(g,"rect",{x:x0+c*cw+2,y,width:cw-4,height:rh,class:on?cls:"sv-card"});if(!on)S(g,"rect",{x:x0+c*cw+2,y,width:cw-4,height:rh,class:"sv-lline","stroke-width":1});}});});
})();
/* 图 5 */
(()=>{const g=document.getElementById("zine");if(!g)return;
  S(g,"rect",{x:30,y:20,width:620,height:262,class:"sv-paper",transform:"rotate(-1 340 150)"});S(g,"rect",{x:30,y:20,width:620,height:262,class:"sv-l","stroke-width":2,transform:"rotate(-1 340 150)"});
  S(g,"rect",{x:70,y:10,width:90,height:22,class:"sv-hi",opacity:.85,transform:"rotate(-8 115 21)"});S(g,"rect",{x:520,y:10,width:90,height:22,class:"sv-hi",opacity:.85,transform:"rotate(6 565 21)"});
  S(g,"text",{x:60,y:62,class:"sv-m"},"第 1 期 · 复印 50 份 · 免费拿");
  const chord=(x0,name,frets)=>{const top=90,sw=18,fh=26;
    for(let s=0;s<6;s++)S(g,"line",{x1:x0+s*sw,y1:top,x2:x0+s*sw,y2:top+fh*4,class:"sv-l","stroke-width":1.2});
    for(let f=0;f<=4;f++)S(g,"line",{x1:x0,y1:top+f*fh,x2:x0+sw*5,y2:top+f*fh,class:"sv-l","stroke-width":f===0?5:1.2});
    frets.forEach((f,s)=>{const x=x0+s*sw;if(f==="x")S(g,"text",{x,y:top-8,"text-anchor":"middle",class:"sv-r"},"×");else if(f===0){S(g,"circle",{cx:x,cy:top-12,r:5,class:"sv-l","stroke-width":1.5});}else S(g,"circle",{cx:x,cy:top+(f-.5)*fh,r:7,class:"sv-ink"});});
    S(g,"text",{x:x0+sw*2.5,y:top+fh*4+38,"text-anchor":"middle",class:"sv-mk"},name);};
  chord(90,"A",["x",0,2,2,2,0]);chord(250,"D",["x","x",0,2,3,2]);chord(410,"E",[0,2,2,1,0,0]);
  S(g,"text",{x:540,y:150,class:"sv-mk",transform:"rotate(-8 560 150)"},"组乐队");S(g,"text",{x:550,y:182,class:"sv-mk",transform:"rotate(-8 570 182)"},"吧！");
  S(g,"path",{d:"M 528 196 Q 560 210 610 190",class:"sv-lp","stroke-width":3});
})();
/* 图 6 */
(()=>{const g=document.getElementById("cut");if(!g)return;
  [["D",60,"sv-ink","sv-on",-6],["I",170,"sv-hi","sv-onhi",4],["Y",270,"sv-pink","sv-on",-3]].forEach(([c,x,bg,fg,r])=>{
    const tr=`rotate(${r} ${x+45} 110)`;S(g,"rect",{x,y:40,width:90,height:120,class:bg,transform:tr});if(bg!=="sv-ink")S(g,"rect",{x,y:40,width:90,height:120,class:"sv-l","stroke-width":2,transform:tr});
    S(g,"text",{x:x+45,y:136,"text-anchor":"middle",class:fg,style:"font-family:var(--font-display);font-weight:900;font-size:86px",transform:tr},c);});
  S(g,"text",{x:60,y:205,class:"sv-ts"},"从不同报纸上剪下来、贴在一起的字");
  S(g,"path",{d:"M 420 150 L 600 70",class:"sv-l","stroke-width":4,"stroke-linecap":"round"});
  S(g,"path",{d:"M 430 160 L 610 80 Q 640 70 630 98 Q 622 116 600 120 L 440 175",class:"sv-l","stroke-width":4,"stroke-linecap":"round"});
  S(g,"rect",{x:405,y:150,width:34,height:26,rx:6,class:"sv-ink",transform:"rotate(-24 422 163)"});
  S(g,"text",{x:440,y:205,class:"sv-ts"},"别针：别住撕破的衣服");
})();
/* 图 7 */
(()=>{const g=document.getElementById("atl");if(!g)return;
  const city=(x,name,items)=>{S(g,"rect",{x,y:30,width:170,height:220,class:"sv-card"});S(g,"rect",{x,y:30,width:170,height:220,class:"sv-l","stroke-width":2});
    S(g,"rect",{x,y:30,width:170,height:40,class:"sv-ink"});S(g,"text",{x:x+85,y:56,"text-anchor":"middle",class:"sv-on",style:"font-size:15px;font-family:var(--font-body);font-weight:700"},name);
    items.forEach((t,i)=>S(g,"text",{x:x+14,y:96+i*28,class:"sv-t"},t));};
  city(30,"纽约",["CBGB 酒吧","Ramones","Patti Smith","Television","Talking Heads","Blondie"]);
  city(480,"伦敦",["国王路 SEX 服装店","Sex Pistols","The Clash","The Damned","Buzzcocks（曼彻斯特）"]);
  for(let i=0;i<2;i++)S(g,"path",{d:`M 220 ${226+i*16} q 15 -10 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0`,class:"sv-lline","stroke-width":2});
  S(g,"text",{x:316,y:276,class:"sv-ts"},"大西洋");
  const arr=(y,dir,txt,txt2)=>{const x1=dir>0?210:470,x2=dir>0?470:210;S(g,"line",{x1,y1:y,x2,y2:y,class:"sv-lp","stroke-width":3});
    S(g,"path",{d:dir>0?`M ${x2-10} ${y-8} L ${x2} ${y} L ${x2-10} ${y+8}`:`M ${x2+10} ${y-8} L ${x2} ${y} L ${x2+10} ${y+8}`,class:"sv-lp","stroke-width":3});
    S(g,"text",{x:222,y:y-24,class:"sv-r"},txt);S(g,"text",{x:222,y:y-8,class:"sv-ts"},txt2);};
  arr(70,1,"1975 · McLaren 管理 New York Dolls 后回伦敦","把纽约的样子带回伦敦，组建 Sex Pistols");
  arr(124,1,"1976.7.4 · Ramones 首次在伦敦演出","很多英国乐手在台下");
  arr(196,-1,"1977 · 英国朋克的唱片和丑闻","反过来影响美国");
})();
/* 图 8 */
(()=>{const g=document.getElementById("tree");if(!g)return;
  const box=(x,y,w,t,dark)=>{S(g,"rect",{x,y,width:w,height:46,class:dark?"sv-ink":"sv-card"});if(!dark)S(g,"rect",{x,y,width:w,height:46,class:"sv-l","stroke-width":2});
    S(g,"text",{x:x+w/2,y:y+28,"text-anchor":"middle",class:dark?"sv-on":"sv-t",style:dark?"font-size:16px;font-family:var(--font-body);font-weight:900":""},t);};
  const link=(x1,y1,x2,y2)=>S(g,"path",{d:`M${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`,class:"sv-lp","stroke-width":2.5});
  [43,163,283].forEach(y=>link(150,163,200,y));[43,163,283].forEach(y=>link(350,y,400,y));
  box(20,140,130,"朋克 1976",true);
  box(200,20,150,"后朋克");box(200,140,150,"硬核");box(200,260,150,"流行朋克");
  box(400,20,260,"新浪潮 · 哥特 · 独立摇滚");box(400,140,260,"Emo · 垃圾摇滚 · 金属核");box(400,260,260,"Green Day · Blink-182");
  S(g,"text",{x:200,y:86,class:"sv-ts"},"Joy Division · The Cure");S(g,"text",{x:200,y:206,class:"sv-ts"},"Black Flag · Minor Threat");S(g,"text",{x:200,y:326,class:"sv-ts"},"Buzzcocks 为先驱");
})();
/* 外部照片 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`照片待放入：${img.getAttribute("src")}<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张照片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
