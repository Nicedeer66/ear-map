/* ================= 推荐曲目（链接收听） ================= */
const SONGS=[
  {side:"A",yt:"TJly4gM-2mI",title:"St. Louis Blues",by:"Bessie Smith 与 Louis Armstrong",yr:"1925",style:"经典女声布鲁斯",
   txt:"W.C. Handy 1914 年发表的名曲，由“布鲁斯女皇”演唱，年轻的 Louis Armstrong 吹短号伴奏，伴奏乐器还有一架簧风琴。这份录音已于 2026 年在美国进入公有领域。",
   listen:["Bessie Smith 每唱完一句，短号就在后面回答一句：最标准的呼应","她的声音宽厚、沉稳，和后来三角洲男歌手的粗粝完全不同","录音很旧，有沙沙声。那时用的是声学录音，歌手对着一个大喇叭唱"],
   cues:[[0,"簧风琴前奏"]]},
  {side:"A",q:"Charley Patton Pony Blues 1929",title:"Pony Blues",by:"Charley Patton",yr:"1929",style:"三角洲",
   txt:"Charley Patton 常被称为“三角洲布鲁斯之父”，Son House 和 Howlin' Wolf 都受过他的影响。他是出了名的表演者，会把吉他背在身后弹、用拳头敲琴身。",
   listen:["他的嗓音沙哑粗粝，很多词含混不清，这是三角洲布鲁斯的典型声音","吉他像鼓一样，节奏感很强，低音一直在“咚咚”地推着走"]},
  {side:"A",yt:"3gLf3tKgREY",title:"Cross Road Blues",by:"Robert Johnson",yr:"1936",style:"三角洲",
   txt:"本章开头那个旅馆房间里录下的歌。“十字路口”传说常被附会到这首歌上，但歌词本身讲的其实是天黑前在路口拦不到车的焦虑。",
   listen:["注意吉他的滑音，像人在哭","数一数小节：他的乐句长短并不总是规整的十二小节","吉他的低音和高音是同时进行的：一个人弹出了两个人的效果"],
   cues:[[0,"一个人一把吉他"],[10,"约 · 人声进入"]]},
  {side:"A",q:"Son House Death Letter 1965",title:"Death Letter",by:"Son House",yr:"1965",style:"三角洲 · 晚年重录",
   txt:"Son House 是 Robert Johnson 的前辈和老师之一。他在 1940 年代后消失在公众视野里，1964 年被乐迷重新找到，第二年录下了这个版本。",
   listen:["吉他的扫弦和滑棒极其用力，几乎是在“砸”琴","整首歌情绪极度强烈，讲的是收到一封爱人死讯的信","对比 Robert Johnson：同样是三角洲，House 更粗犷、更像布道"]},
  {side:"B",q:"John Lee Hooker Boogie Chillen 1948",title:"Boogie Chillen'",by:"John Lee Hooker",yr:"1948",style:"底特律 · boogie",
   txt:"John Lee Hooker 从密西西比搬到底特律，在工厂上班，晚上在酒吧弹琴。这首歌几乎只有他一个人、一把电吉他和一只踩地板的脚，却登上了 R&amp;B 榜首。",
   listen:["整首歌几乎只用一个和弦，靠律动推着走","他的脚一直在踩地板打拍子，你能清楚地听见","这是三角洲和城市之间的过渡：一个人，但已经插了电"]},
  {side:"B",q:"Little Walter Juke 1952",title:"Juke",by:"Little Walter",yr:"1952",style:"芝加哥 · 口琴",
   txt:"一首没有歌词的口琴独奏曲，登上了 R&amp;B 榜首。Little Walter 把口琴对着麦克风吹，再接进音箱，让一件口袋大小的乐器拥有了萨克斯一样的音量和音色。",
   listen:["对比实验 07 里的“原声口琴”和“接麦克风口琴”","注意他的推音：口琴也能吹出蓝调音","背后是完整的芝加哥乐队：吉他、贝斯、鼓"]},
  {side:"B",yt:"sSnxwnPkgas",title:"Hoochie Coochie Man",by:"Muddy Waters",yr:"1954",style:"芝加哥",
   txt:"Willie Dixon 作曲，Chess 唱片发行，芝加哥布鲁斯最有代表性的作品之一。",
   listen:["开头就是停顿式：全乐队一起打一下，然后安静，留给人声","几个小节后乐队一起冲进来，对照实验 09","注意口琴、钢琴和电吉他在人声空隙里的回答"],
   cues:[[0,"停顿式开头"]]},
  {side:"B",q:"Howlin' Wolf Smokestack Lightnin' 1956",title:"Smokestack Lightnin'",by:"Howlin' Wolf",yr:"1956",style:"芝加哥",
   txt:"Howlin' Wolf 身材高大，嗓音粗哑得像砂纸，招牌是像狼一样的长嚎。这首歌有一种催眠般的力量。",
   listen:["整首歌几乎围绕一个和弦和一段重复的吉他乐句","听他的狼嚎：这是从田野呼喊一路传下来的声音","对比 Muddy Waters：同在 Chess 唱片，风格更原始、更狂野"]},
  {side:"B",yt:"kpC69qIe02E",title:"The Thrill Is Gone",by:"B.B. King",yr:"1969",style:"孟菲斯 · 小调布鲁斯",
   txt:"小调布鲁斯，配了弦乐，是 B.B. King 最大的热门歌之一，让布鲁斯进入了更主流的听众群。",
   listen:["这是小调布鲁斯，对照实验 01 的“小调”变体","他几乎从不边唱边弹：唱完一句停下，让吉他 Lucille 接话","注意他推弦后在音尾加的颤音，非常有辨识度"],
   cues:[[0,"弦乐与吉他"]]},
  {side:"B",yt:"uFeZ_x--aRg",title:"Johnny B. Goode",by:"Chuck Berry",yr:"1958",style:"早期摇滚",
   txt:"提速的十二小节布鲁斯，就是摇滚乐。歌词讲一个乡下穷孩子靠一把吉他出人头地的故事，带着 Chuck Berry 自己的影子。",
   listen:["开头那段吉他前奏是摇滚史上最有名的前奏之一","节奏是直八分，对照实验 10","用它来做练习 1：数一轮十二小节"],
   cues:[[0,"吉他前奏"],[17,"约 · 人声进入，开始数"]]}
];
const fmt=t=>{t=Math.max(0,Math.floor(t||0));return `${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`};
const ICON_PLAY="M8 5v14l11-7z";
SONGS.forEach(s=>{
  const el=document.createElement("div");el.className="song";
  const q=encodeURIComponent(s.q||`${s.title} ${s.by.split(" 与 ")[0]}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  const cues=(s.yt&&s.cues)?s.cues.filter(c=>c[0]>0).map(c=>`<a href="${yt}&t=${c[0]}s" target="_blank" rel="noopener"><b>${fmt(c[0])}</b>${c[1]}</a>`).join(""):"";
  el.innerHTML=`<a class="playbtn" href="${yt}" target="_blank" rel="noopener" aria-label="在 YouTube 收听 ${s.title}" style="display:grid;place-items:center;border-radius:50%;width:44px;height:44px;background:var(--indigo);color:var(--paper)"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="${ICON_PLAY}"/></svg></a>
  <div><div class="meta"><span class="title">${s.title}</span><span class="by">${s.by}</span><span class="yr">${s.yr}</span><span class="style">${s.style}</span></div>
  <p>${s.txt}</p><ul class="listen">${s.listen.map(x=>`<li>${x}</li>`).join("")}</ul>
  <div class="listen-links"><a class="main" href="${yt}" target="_blank" rel="noopener">${s.yt?"YouTube 官方音源":"YouTube 搜索"}</a>${cues}
  <a href="https://music.163.com/#/search/m/?s=${q}&type=1" target="_blank" rel="noopener">网易云</a>
  <a href="https://y.qq.com/n/ryqq/search?w=${q}" target="_blank" rel="noopener">QQ音乐</a></div></div>`;
  document.getElementById(s.side==="A"?"songsA":"songsB").appendChild(el);
});
/* ================= 合成音频引擎 ================= */
let ac=null,master,verbIn;
function A(){
  if(!ac){
    ac=new (window.AudioContext||window.webkitAudioContext)();
    const comp=ac.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(ac.destination);
    master=ac.createGain();master.gain.value=.85;master.connect(comp);
    const cv=ac.createConvolver(),len=ac.sampleRate*1.8,b=ac.createBuffer(2,len,ac.sampleRate);
    for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2);}
    cv.buffer=b;const vg=ac.createGain();vg.gain.value=.22;cv.connect(vg).connect(comp);verbIn=cv;
  }
  if(ac.state==="suspended")ac.resume();
  return ac;
}
const mf=m=>440*Math.pow(2,(m-69)/12);
let bus=null,timers=[],srcs=[],loopTimer=null,activeBtn=null;
function newBus(){
  stopDemos();A();
  bus=ac.createGain();bus.gain.value=1;bus.connect(master);
  const s=ac.createGain();s.gain.value=1;bus.connect(s);s.connect(verbIn);
  return bus;
}
function stopDemos(){
  timers.forEach(clearTimeout);timers=[];clearTimeout(loopTimer);loopTimer=null;
  srcs.forEach(s=>{try{s.stop()}catch(e){}});srcs=[];
  if(bus){const b=bus;b.gain.setTargetAtTime(0,ac.currentTime,.03);setTimeout(()=>b.disconnect(),300);bus=null;}
  document.querySelectorAll(".bar.now,.strip i.now").forEach(x=>x.classList.remove("now"));
  if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}
  const f=document.getElementById("stopAll");f&&f.classList.remove("on");
}
function later(fn,sec){timers.push(setTimeout(fn,Math.max(0,sec*1000)));}
function track(n){srcs.push(n);return n;}

/* Karplus-Strong 拨弦 */
const ksCache={};
function ksBuf(midi,dur,bright,decay){
  const key=midi+"|"+dur+"|"+bright+"|"+decay;if(ksCache[key])return ksCache[key];
  const sr=ac.sampleRate,N=Math.max(2,Math.round(sr/mf(midi))),len=Math.floor(sr*dur);
  const b=ac.createBuffer(1,len,sr),d=b.getChannelData(0),buf=new Float32Array(N);
  for(let i=0;i<N;i++)buf[i]=Math.random()*2-1;
  const smooth=Math.round((1-bright)*5);
  for(let k=0;k<smooth;k++)for(let i=0;i<N;i++)buf[i]=(buf[i]+buf[(i+1)%N])*.5;
  let idx=0;
  for(let i=0;i<len;i++){const nx=(idx+1)%N,v=buf[idx];d[i]=v;buf[idx]=decay*.5*(v+buf[nx]);idx=nx;}
  const fade=Math.min(len,Math.floor(sr*.03));for(let i=0;i<fade;i++)d[len-1-i]*=i/fade;
  return ksCache[key]=b;
}
let shaperCache={};
function shaper(amount){
  if(shaperCache[amount])return shaperCache[amount];
  const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(x*amount)/Math.tanh(amount);}
  return shaperCache[amount]=c;
}
/* 乐器：ac 木吉他 / el 电吉他干净 / dr 电吉他过载 / bass 贝斯 */
const INST={
  ac:{bright:.62,decay:.9965,dur:1.8,vol:.55},
  el:{bright:.8,decay:.9985,dur:2.2,vol:.4,drive:1.6,lp:3200},
  dr:{bright:.85,decay:.999,dur:2.4,vol:.22,drive:7,lp:2600},
  bass:{bright:.25,decay:.995,dur:1.2,vol:.75,lp:900}
};
function pluck(t,midi,inst,o={}){
  const a=A(),I=INST[inst],s=a.createBufferSource();
  s.buffer=ksBuf(midi,o.dur||I.dur,I.bright,I.decay);
  const g=a.createGain();g.gain.value=(o.vol||1)*I.vol;
  let node=g;
  if(o.from){s.playbackRate.setValueAtTime(Math.pow(2,o.from/12),t);s.playbackRate.setValueAtTime(Math.pow(2,o.from/12),t+(o.hold||0));s.playbackRate.linearRampToValueAtTime(1,t+(o.hold||0)+(o.glide||.18));}
  if(o.vib){const l=a.createOscillator(),lg=a.createGain();l.frequency.value=5.5;lg.gain.value=.008;l.connect(lg).connect(s.playbackRate);l.start(t+(o.vibAt||.4));l.stop(t+(o.dur||I.dur));track(l);}
  s.connect(g);
  if(I.drive){const sh=a.createWaveShaper();sh.curve=shaper(I.drive);sh.oversample="2x";node.connect(sh);node=sh;}
  if(I.lp){const f=a.createBiquadFilter();f.type="lowpass";f.frequency.value=I.lp;node.connect(f);node=f;}
  if(inst==="ac"){const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=220;pk.gain.value=5;node.connect(pk);node=pk;}
  if(o.mute){g.gain.setValueAtTime((o.vol||1)*I.vol,t);g.gain.exponentialRampToValueAtTime(.001,t+o.mute);}
  node.connect(bus);s.start(t);s.stop(t+(o.dur||I.dur));track(s);
}
function strum(t,notes,inst,o={}){notes.forEach((m,k)=>pluck(t+k*(o.spread||.014),m,inst,{vol:o.vol||.6,mute:o.mute,dur:o.dur}));}
/* 口琴 */
function harp(t,midi,dur,o={}){
  const a=A(),os=a.createOscillator(),os2=a.createOscillator();os.type="sawtooth";os2.type="square";
  const f=mf(midi);
  [os,os2].forEach((x,k)=>{const ff=f*(k?1.002:1);
    if(o.from){x.frequency.setValueAtTime(ff*Math.pow(2,o.from/12),t);x.frequency.linearRampToValueAtTime(ff,t+(o.glide||.15));}else x.frequency.setValueAtTime(ff,t);});
  const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=5.2;lg.gain.value=12;lfo.connect(lg);lg.connect(os.detune);lg.connect(os2.detune);
  const bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=o.amp?1100:1500;bp.Q.value=o.amp?1.6:1.1;
  const g=a.createGain(),v=(o.vol||1)*(o.amp?.13:.16);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.setValueAtTime(v,t+dur-.06);g.gain.linearRampToValueAtTime(0,t+dur);
  const m2=a.createGain();m2.gain.value=.4;
  os.connect(bp);os2.connect(m2).connect(bp);let node=bp;
  if(o.amp){const sh=a.createWaveShaper();sh.curve=shaper(4);const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=2200;bp.connect(sh).connect(lp);node=lp;}
  node.connect(g).connect(bus);
  [os,os2,lfo].forEach(x=>{x.start(t);x.stop(t+dur+.05);track(x);});
}
/* 人声（元音“啊”） */
function voice(t,midi,dur,o={}){
  const a=A(),os=a.createOscillator();os.type="sawtooth";const f=mf(midi);
  os.frequency.setValueAtTime(f*Math.pow(2,(o.from==null?-1:o.from)/12),t);os.frequency.linearRampToValueAtTime(f,t+(o.glide||.09));
  if(o.fall){os.frequency.setValueAtTime(f,t+dur*.6);os.frequency.linearRampToValueAtTime(f*Math.pow(2,o.fall/12),t+dur);}
  const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=5;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(o.vibDepth||22,t+Math.min(dur,.5));lfo.connect(lg).connect(os.detune);
  const g=a.createGain(),v=(o.vol||1)*.5;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.06);g.gain.setValueAtTime(v,t+dur-.1);g.gain.linearRampToValueAtTime(0,t+dur);
  const out=a.createGain();out.gain.value=1;
  [[o.vowel==="o"?500:750,7,1],[o.vowel==="o"?900:1200,9,.6],[2600,10,.25]].forEach(([fr,q,amt])=>{const bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=fr;bp.Q.value=q;const gg=a.createGain();gg.gain.value=amt*3;os.connect(bp).connect(gg).connect(out);});
  out.connect(g).connect(bus);
  [os,lfo].forEach(x=>{x.start(t);x.stop(t+dur+.05);track(x);});
}
/* 鼓 */
let noiseBuf=null;
function noise(){if(!noiseBuf){const a=A(),len=a.sampleRate;noiseBuf=a.createBuffer(1,len,a.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;}return noiseBuf;}
function kick(t,v=1){const a=A(),o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);g.gain.setValueAtTime(.9*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);o.connect(g).connect(bus);o.start(t);o.stop(t+.35);track(o);}
function snare(t,v=1,brush){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type=brush?"bandpass":"highpass";f.frequency.value=brush?2500:1200;const g=a.createGain();g.gain.setValueAtTime((brush?.18:.42)*v,t);g.gain.exponentialRampToValueAtTime(.001,t+(brush?.16:.2));n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+.25);track(n);
  if(!brush){const o=a.createOscillator(),og=a.createGain();o.frequency.value=190;og.gain.setValueAtTime(.25*v,t);og.gain.exponentialRampToValueAtTime(.001,t+.09);o.connect(og).connect(bus);o.start(t);o.stop(t+.1);track(o);}}
function hat(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=7500;const g=a.createGain();g.gain.setValueAtTime(.16*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.05);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+.07);track(n);}
function stomp(t){const a=A(),o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(90,t);o.frequency.exponentialRampToValueAtTime(50,t+.08);g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g).connect(bus);o.start(t);o.stop(t+.2);track(o);}

/* ================= 和弦进行与编曲 ================= */
const PROG={
  std:{bars:["I","I","I","I","IV","IV","I","I","V","IV","I","I"]},
  quick:{bars:["I","IV","I","I","IV","IV","I","I","V","IV","I","V"]},
  minor:{bars:["i","i","i","i","iv","iv","i","i","bVI","V","i","V"]}
};
const DEG={I:[0,"dom"],IV:[5,"dom"],V:[7,"dom"],i:[0,"min"],iv:[5,"min"],bVI:[8,"dom"]};
const SHAPE={dom:[0,4,7,10],min:[0,3,7,10]};
function chordOf(key,f){const [r,q]=DEG[f];return SHAPE[q].map(x=>key+r+x);}
function eighth(t,beat,k,swing){return t+Math.floor(k/2)*beat+(k%2?(swing?beat*2/3:beat/2):0);}
function lightStrip(strip,t0,barLen,n){
  if(!strip)return;const cells=[...strip.children];const a=A();
  for(let b=0;b<n;b++)later(()=>{cells.forEach(c=>c.classList.remove("now"));cells[b]&&cells[b].classList.add("now");},t0-a.currentTime+b*barLen);
  later(()=>cells.forEach(c=>c.classList.remove("now")),t0-a.currentTime+n*barLen);
}
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
let curVar="std";
const VAR_NOTE={std:"走到第 5 格，和声“离开了家”；第 9 格最紧张；然后一路回家。",
  quick:"第 2 格提前跳到 IV（快四），最后一格停在 V（回转），听起来“还没完”，引出下一轮。",
  minor:"换成小调后，整体变暗。第 9、10 格换成了 ♭VI 和 V，这是小调布鲁斯常见的走法。"};
const NAME={0:"C",5:"F",7:"G",8:"A♭"};
function drawGrid(){
  const g=document.getElementById("grid12"),bars=PROG[curVar].bars,rows=["<b>第 1 句（A）</b>唱出处境","<b>第 2 句（A）</b>重复一遍","<b>第 3 句（B）</b>转折、结论"];
  let h="";for(let r=0;r<3;r++){h+=`<div class="rowlab">${rows[r]}</div>`;
    for(let c=0;c<4;c++){const i=r*4+c,f=bars[i],[st,q]=DEG[f];const fam=f.toUpperCase().replace("B","").replace("VI","V");
      h+=`<div class="bar" data-f="${["I","IV","V"].includes(fam)?fam:"V"}"><span class="c">${NAME[st]}${q==="min"?"m7":"7"}</span><span class="r">${f} · ${i+1}</span></div>`;}}
  g.innerHTML=h;document.getElementById("varNote").textContent=VAR_NOTE[curVar];
}
drawGrid();
document.querySelectorAll("[data-var]").forEach(b=>b.addEventListener("click",()=>{curVar=b.dataset.var;document.querySelectorAll("[data-var]").forEach(x=>x.setAttribute("aria-pressed",x===b));stopDemos();drawGrid();}));
const bpm12=document.getElementById("bpm12");bpm12.addEventListener("input",()=>document.getElementById("bpm12v").textContent=bpm12.value);
document.getElementById("play12").addEventListener("click",e=>{
  newBus();setActive(e.currentTarget);
  const a=A(),beat=60/+bpm12.value,t0=a.currentTime+.12,key=48,bars=PROG[curVar].bars,cells=[...document.querySelectorAll("#grid12 .bar")];
  bars.forEach((f,bi)=>{const ch=chordOf(key,f),bt=t0+bi*4*beat;
    for(let k=0;k<4;k++){const t=bt+k*beat;pluck(t,ch[0]-12,"ac",{vol:.9,mute:beat*.9});
      strum(t,[ch[0],ch[1],ch[3]],"ac",{vol:.42,mute:beat*.55});strum(t+beat*2/3,[ch[1],ch[3]],"ac",{vol:.28,mute:.2});}
    later(()=>{cells.forEach(c=>c.classList.remove("now"));cells[bi].classList.add("now");},bt-a.currentTime);});
  later(()=>{cells.forEach(c=>c.classList.remove("now"));clearActive();},t0-a.currentTime+48*beat);
});
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}

/* 实验 04：音阶板 */
const PADS=[[64,"E","根音",0],[67,"G","♭3",0],[69,"A","4",0],[70,"B♭","♭5",1],[71,"B","5",0],[74,"D","♭7",0],[76,"E","高八度",0]];
const KEYS="asdfghj";let padTone="el";
const padWrap=document.getElementById("pads");
PADS.forEach(([m,n,deg,blue],i)=>{const b=document.createElement("button");b.type="button";b.className="pad"+(blue?" blue":"");b.innerHTML=`${n}<small>${deg} · ${KEYS[i].toUpperCase()}</small>`;
  b.addEventListener("pointerdown",()=>hitPad(i));padWrap.appendChild(b);});
function hitPad(i){
  A();if(!bus){bus=ac.createGain();bus.connect(master);const s=ac.createGain();bus.connect(s);s.connect(verbIn);}
  const m=PADS[i][0],t=ac.currentTime+.01,bend=document.getElementById("bendPad").checked;
  if(padTone==="harp")harp(t,m+12,.7,bend?{from:-1.5,glide:.2}:{});
  else if(padTone==="ac")pluck(t,m,"ac",bend?{from:-1.5,glide:.18,vol:1}:{vol:1});
  else pluck(t,m+12,"dr",bend?{from:-1.5,glide:.18,vib:1,vol:1.2}:{vib:1,vol:1.2});
  const el=padWrap.children[i];el.classList.add("hit");setTimeout(()=>el.classList.remove("hit"),140);
}
addEventListener("keydown",e=>{if(e.target.tagName==="INPUT"||e.repeat||e.metaKey||e.ctrlKey)return;const i=KEYS.indexOf(e.key.toLowerCase());if(i>=0){hitPad(i);}});
document.querySelectorAll("[data-padtone]").forEach(b=>b.addEventListener("click",()=>{padTone=b.dataset.padtone;document.querySelectorAll("[data-padtone]").forEach(x=>x.setAttribute("aria-pressed",x===b));}));

/* ================= 示例调度 ================= */
function stripNear(btn){const lab=btn.closest(".lab");return lab?lab.querySelector("[data-strip]"):null;}
document.querySelectorAll("[data-strip]").forEach(s=>{for(let i=0;i<12;i++)s.appendChild(document.createElement("i"));});
const DEMOS={
  "third-major":t=>{strum(t,[48,52,55,58],"ac",{vol:.4,dur:2.6});pluck(t+.5,64,"el",{vol:1.4});return 2.6;},
  "third-minor":t=>{strum(t,[48,52,55,58],"ac",{vol:.4,dur:2.6});pluck(t+.5,63,"el",{vol:1.4});return 2.6;},
  "third-bend":t=>{strum(t,[48,52,55,58],"ac",{vol:.4,dur:2.8});pluck(t+.5,64,"el",{vol:1.4,from:-1,hold:.25,glide:.7,vib:1,vibAt:1.2,dur:2.4});return 2.8;},
  "third-slide":t=>{strum(t,[48,52,55,58],"ac",{vol:.4,dur:2.8});pluck(t+.5,64,"ac",{vol:1.6,from:-2,glide:.5,dur:2.2});pluck(t+1.6,67,"ac",{vol:1.2,from:-1,glide:.25});return 2.8;},
  "scale-major":t=>{[64,66,68,69,71,73,75,76].forEach((m,i)=>pluck(t+i*.32,m,"ac",{vol:1}));return 3;},
  "scale-blues":t=>{[64,67,69,70,71,74,76].forEach((m,i)=>pluck(t+i*.36,m,"ac",{vol:1,from:i===3?-.5:0,glide:.1}));return 3;},
  "cr-guitar":(t,btn)=>{const d=playDelta(t,{});lightStrip(stripNear(btn),t,4*60/76,12);return d;},
  "cr-harp":(t,btn)=>{const d=playDelta(t,{ans:"harp"});lightStrip(stripNear(btn),t,4*60/76,12);return d;},
  straight:t=>{const beat=60/96;for(let b=0;b<4;b++){const f=["I","I","IV","I"][b];for(let k=0;k<8;k++){const t2=eighth(t+b*4*beat,beat,k,false);pluck(t2,28+DEG[f][0]+BOOGIE[k],"bass",{vol:1,mute:beat*.45});hat(t2,k%2?.5:.9);}}return 16*beat;},
  shuffle:t=>{const beat=60/96;for(let b=0;b<4;b++){const f=["I","I","IV","I"][b];for(let k=0;k<8;k++){const t2=eighth(t+b*4*beat,beat,k,true);pluck(t2,28+DEG[f][0]+BOOGIE[k],"bass",{vol:1,mute:beat*.45});hat(t2,k%2?.5:.9);}}return 16*beat;},
  both:t=>{const d=DEMOS.straight(t);voiceTag(t,"直八分");voiceTag(t+d+.4,"shuffle");return d+.4+DEMOS.shuffle(t+d+.4);},
  "g-holler":t=>{voice(t,64,1.6,{from:-3,glide:.4,fall:-2,vowel:"o"});voice(t+1.9,69,1,{from:-2,glide:.25});voice(t+2.9,67,2,{from:1,glide:.3,fall:-4,vowel:"o"});return 5;},
  "g-diddley":t=>{pluck(t,52,"ac",{vol:1.6,from:-3,glide:.4,dur:1.6});pluck(t+1.2,55,"ac",{vol:1.4,from:-1,glide:.2,dur:1.2});pluck(t+2,52,"ac",{vol:1.6,from:2,glide:.6,dur:1.8});return 3.8;},
  "g-acoustic":t=>{const beat=60/84;for(let k=0;k<8;k++){pluck(t+k*beat,40,"ac",{vol:.9,mute:beat*.9});if(k%2)strum(t+k*beat+beat*2/3,[56,59,62],"ac",{vol:.4,mute:.25});}[[1.5,67],[1.83,64],[2.5,62],[3,64]].forEach(([b,m])=>pluck(t+b*beat,m,"ac",{vol:1}));return 8*beat+.5;},
  "g-slide":t=>{[[0,64,-2],[.6,67,-1],[1.1,64,0],[1.8,71,-3],[2.6,69,-2],[3.3,64,-2]].forEach(([s,m,f])=>pluck(t+s,m,"ac",{vol:1.2,from:f,glide:.22,dur:1.4}));return 4.6;},
  "g-clean":t=>{[[0,76],[.3,74],[.6,71],[1,69],[1.3,71],[2,64]].forEach(([s,m],i)=>pluck(t+s,m,"el",{vol:1.3,from:i===0?-1:0,vib:i>3}));return 3.5;},
  "g-drive":t=>{[[0,79,-2],[.35,76,0],[.6,74,0],[.85,76,-1],[1.4,71,-1],[2,64,0]].forEach(([s,m,f])=>pluck(t+s,m,"dr",{vol:1.3,from:f,glide:.15,vib:1}));strum(t+2.6,[40,47,52],"dr",{vol:.8,dur:2});return 4.6;},
  "g-harp":t=>{ANS_HARP.forEach(([b,m,d,o])=>harp(t+b*.6,m+12,d*.6,o));harp(t+2.6,76,1.4,{from:-1.5,glide:.3});return 4.2;},
  "g-ampharp":t=>{ANS_HARP.forEach(([b,m,d,o])=>harp(t+b*.6,m+12,d*.6,Object.assign({amp:1},o)));harp(t+2.6,76,1.4,{amp:1,from:-1.5,glide:.3});return 4.2;},
  "g-bass":t=>{const beat=60/100;for(let b=0;b<2;b++)for(let k=0;k<8;k++)pluck(eighth(t+b*4*beat,beat,k,true),28+BOOGIE[k],"bass",{vol:1,mute:beat*.5});return 8*beat+.3;},
  "g-drums":t=>{const beat=60/100;for(let b=0;b<2;b++){const tb=t+b*4*beat;for(let k=0;k<8;k++)hat(eighth(tb,beat,k,true),k%2?.6:1);for(let k=0;k<4;k++){if(k%2===0)kick(tb+k*beat);else snare(tb+k*beat,.9);}}return 8*beat+.3;},
  delta:(t,btn)=>{const d=playDelta(t,{});lightStrip(stripNear(btn),t,4*60/76,12);return d;},
  chicago:(t,btn)=>{const d=playChicago(t,{});lightStrip(stripNear(btn),t,4*60/100,12);return d;},
  rocknroll:(t,btn)=>{const d=playRock(t);lightStrip(stripNear(btn),t,4*60/168,12);return d;},
  stoptime:(t,btn)=>{const d=playStop(t);lightStrip(stripNear(btn),t,4*60/96,12);return d;}
};
function voiceTag(){}
function runDemo(name,btn){
  newBus();setActive(btn);
  const t=A().currentTime+.12,d=DEMOS[name](t,btn)||3;
  later(()=>{clearActive();},d+.4);
}
function jamLoop(btn){
  newBus();setActive(btn);
  const beat=60/96,len=48*beat;let t=A().currentTime+.12;
  const go=()=>{playChicago(t,{bpm:96,gtr:true,vox:false,ans:false});t+=len;loopTimer=setTimeout(go,(t-ac.currentTime-1)*1000);};
  go();
}
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{
  if(b.classList.contains("playing")){stopDemos();return;}
  b.dataset.demo==="jam-loop"?jamLoop(b):runDemo(b.dataset.demo,b);
}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
document.getElementById("stopAll").addEventListener("click",stopDemos);

/* ================= 原创图解 ================= */
const NS="http://www.w3.org/2000/svg";
function S(p,tag,a,txt){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e;}
/* 图 3 键盘 */
(()=>{const g=document.getElementById("kb");if(!g)return;
  const W=[[0,"C"],[2,"D"],[4,"E"],[5,"F"],[7,"G"],[9,"A"],[11,"B"],[12,"C"],[14,"D"],[16,"E"]];
  const B=[[1,1],[3,2],[6,4],[8,5],[10,6],[13,8],[15,9]];
  const HL={4:"根音",7:"♭3",9:"4",11:"5",14:"♭7",16:"根音"};
  W.forEach(([n,name],i)=>{const x=40+i*60,on=n in HL;
    S(g,"rect",{x,y:46,width:60,height:150,class:on?"sv-soft":"sv-paper"});
    S(g,"rect",{x,y:46,width:60,height:150,class:"sv-l","stroke-width":1});
    if(on){S(g,"circle",{cx:x+30,cy:170,r:13,class:n%12===4?"sv-ink":"sv-ind"});S(g,"text",{x:x+30,y:174,"text-anchor":"middle",class:"sv-on"},name);
      S(g,"text",{x:x+30,y:216,"text-anchor":"middle",class:"sv-ts"},HL[n]);}});
  B.forEach(([n,after])=>{const x=40+after*60-18,blue=n===10;
    S(g,"rect",{x,y:46,width:36,height:95,rx:2,class:blue?"sv-rust":"sv-ink"});
    if(blue){S(g,"text",{x:x+18,y:128,"text-anchor":"middle",class:"sv-on"},"B♭");S(g,"text",{x:x+18,y:236,"text-anchor":"middle",class:"sv-r"},"♭5 魔鬼音");S(g,"line",{x1:x+18,y1:142,x2:x+18,y2:224,class:"sv-lr","stroke-dasharray":"3 3"});}});
  S(g,"path",{d:"M 300 30 L 300 40 L 352 40 L 352 30",class:"sv-lr","stroke-width":1.5});
  S(g,"text",{x:362,y:30,class:"sv-r"},"蓝调音落在 G 与 G♯ 之间的“缝”里");
})();
/* 图 4 指板 */
(()=>{const g=document.getElementById("fb");if(!g)return;
  const strs=[["e",[[0,"E"],[3,"G"]]],["B",[[0,"B"],[3,"D"]]],["G",[[0,"G"],[2,"A"],[3,"B♭"]]],["D",[[0,"D"],[2,"E"]]],["A",[[0,"A"],[1,"B♭"],[2,"B"]]],["E",[[0,"E"],[3,"G"]]]];
  for(let f=1;f<=4;f++){S(g,"line",{x1:110+120*f,y1:30,x2:110+120*f,y2:218,class:"sv-l","stroke-width":1.5,opacity:.5});S(g,"text",{x:110+120*(f-.5),y:242,"text-anchor":"middle",class:"sv-m"},f+" 品");}
  S(g,"text",{x:84,y:242,"text-anchor":"middle",class:"sv-m"},"空弦");
  S(g,"line",{x1:110,y1:30,x2:110,y2:218,class:"sv-l","stroke-width":6});
  strs.forEach(([nm,notes],i)=>{const y=40+i*34;
    S(g,"line",{x1:110,y1:y,x2:640,y2:y,class:"sv-l","stroke-width":.8+i*.35});
    S(g,"text",{x:40,y:y+4,class:"sv-m"},nm);
    notes.forEach(([f,n])=>{const x=f===0?84:110+120*(f-.5);
      S(g,"circle",{cx:x,cy:y,r:13,class:n==="E"?"sv-ink":n==="B♭"?"sv-rust":"sv-ind"});
      S(g,"text",{x,y:y+4,"text-anchor":"middle",class:"sv-on"},n);});});
})();
/* 图 5 呼应 */
(()=>{const g=document.getElementById("crl");if(!g)return;const x0=110,w=47;
  for(let i=0;i<12;i++){S(g,"text",{x:x0+i*w+w/2,y:30,"text-anchor":"middle",class:"sv-m"},String(i+1));
    S(g,"rect",{x:x0+i*w,y:44,width:w,height:104,class:"sv-lline","stroke-width":1});}
  [4,8].forEach(i=>S(g,"line",{x1:x0+i*w,y1:38,x2:x0+i*w,y2:154,class:"sv-l","stroke-width":1.5}));
  S(g,"text",{x:10,y:74,class:"sv-t"},"人声 · 问");S(g,"text",{x:10,y:130,class:"sv-t"},"乐器 · 答");
  [[0,"A"],[4,"A 重复"],[8,"B 转折"]].forEach(([b,t])=>{S(g,"rect",{x:x0+b*w+3,y:50,width:w*2-6,height:38,rx:6,class:"sv-ind"});S(g,"text",{x:x0+b*w+w,y:73,"text-anchor":"middle",class:"sv-on"},t);});
  [2,6,10].forEach(b=>{S(g,"rect",{x:x0+b*w+3,y:106,width:w*2-6,height:38,rx:6,class:"sv-rust"});S(g,"text",{x:x0+b*w+w,y:129,"text-anchor":"middle",class:"sv-on"},"回答");});
})();
/* 图 6 节奏 */
(()=>{const g=document.getElementById("rhy");if(!g)return;
  [[120,"第 1 拍"],[390,"第 2 拍"]].forEach(([x,t])=>S(g,"text",{x:x+130,y:30,"text-anchor":"middle",class:"sv-m"},t));
  S(g,"text",{x:10,y:72,class:"sv-t"},"直八分");S(g,"text",{x:10,y:152,class:"sv-t"},"shuffle");
  [120,390].forEach(x=>{
    S(g,"rect",{x:x+2,y:46,width:126,height:44,rx:4,class:"sv-soft"});S(g,"rect",{x:x+132,y:46,width:126,height:44,rx:4,class:"sv-soft"});
    S(g,"text",{x:x+65,y:73,"text-anchor":"middle",class:"sv-t"},"哒");S(g,"text",{x:x+195,y:73,"text-anchor":"middle",class:"sv-t"},"哒");
    S(g,"rect",{x:x+2,y:126,width:169,height:44,rx:4,class:"sv-ind"});S(g,"rect",{x:x+175,y:126,width:83,height:44,rx:4,class:"sv-rust"});
    S(g,"text",{x:x+86,y:153,"text-anchor":"middle",class:"sv-on"},"哒——（长）");S(g,"text",{x:x+216,y:153,"text-anchor":"middle",class:"sv-on"},"哒（短）");
    [1,2].forEach(k=>S(g,"line",{x1:x+k*86.7,y1:120,x2:x+k*86.7,y2:176,class:"sv-l","stroke-width":.8,"stroke-dasharray":"2 3",opacity:.6}));
  });
  S(g,"text",{x:120,y:110,class:"sv-ts"},"每拍平均分成 2 份");S(g,"text",{x:390,y:110,class:"sv-ts"},"每拍分成 3 份（虚线），前两份连在一起");
})();
/* 图 7 编制 */
(()=>{const g=document.getElementById("lineup");if(!g)return;
  S(g,"rect",{x:14,y:14,width:232,height:232,rx:12,class:"sv-lline","stroke-width":1.5});
  S(g,"rect",{x:262,y:14,width:404,height:232,rx:12,class:"sv-lline","stroke-width":1.5});
  S(g,"text",{x:30,y:40,class:"sv-r"},"三角洲 · 1930s");S(g,"text",{x:278,y:40,class:"sv-r"},"芝加哥 · 1950s");
  const ac=(cx,cy)=>{S(g,"rect",{x:cx-5,y:cy-96,width:10,height:66,class:"sv-ink"});S(g,"rect",{x:cx-8,y:cy-114,width:16,height:20,rx:2,class:"sv-ink"});
    S(g,"circle",{cx,cy:cy+22,r:32,class:"sv-p2"});S(g,"circle",{cx,cy:cy+22,r:32,class:"sv-l","stroke-width":1.5});
    S(g,"circle",{cx,cy:cy-10,r:23,class:"sv-p2"});S(g,"circle",{cx,cy:cy-10,r:23,class:"sv-l","stroke-width":1.5});
    S(g,"circle",{cx,cy:cy+6,r:8,class:"sv-ink"});};
  const foot=(cx,cy)=>{S(g,"path",{d:`M${cx-28} ${cy+42} L${cx+26} ${cy+42} Q${cx+36} ${cy+42} ${cx+34} ${cy+32} L${cx+4} ${cy+22} L${cx-6} ${cy-24} L${cx-24} ${cy-24} Z`,class:"sv-ink"});
    S(g,"path",{d:`M${cx-36} ${cy+52} L${cx+38} ${cy+52}`,class:"sv-l","stroke-width":2});S(g,"text",{x:cx+16,y:cy-6,class:"sv-r"},"咚");};
  const el=(cx,cy)=>{S(g,"rect",{x:cx-4,y:cy-96,width:8,height:76,class:"sv-ink"});S(g,"rect",{x:cx-7,y:cy-112,width:14,height:18,rx:2,class:"sv-ink"});
    S(g,"ellipse",{cx,cy:cy+12,rx:24,ry:32,class:"sv-rust"});S(g,"rect",{x:cx-10,y:cy+4,width:20,height:5,class:"sv-ink"});};
  const amp=(x,y)=>{S(g,"rect",{x,y,width:58,height:66,rx:5,class:"sv-ink"});S(g,"circle",{cx:x+29,cy:y+38,r:20,class:"sv-p2"});
    [10,20,30].forEach(d=>S(g,"circle",{cx:x+d+4,cy:y+9,r:3,class:"sv-p2"}));};
  const harp=(cx,cy)=>{S(g,"line",{x1:cx,y1:cy-40,x2:cx,y2:cy-6,class:"sv-l","stroke-width":3});S(g,"circle",{cx,cy:cy-50,r:12,class:"sv-ink"});
    S(g,"rect",{x:cx-30,y:cy+8,width:60,height:18,rx:4,class:"sv-ind"});for(let i=0;i<6;i++)S(g,"rect",{x:cx-24+i*9,y:cy+13,width:5,height:8,class:"sv-paper"});};
  const bass=(cx,cy)=>{S(g,"rect",{x:cx-4,y:cy-100,width:8,height:74,class:"sv-ink"});S(g,"circle",{cx,cy:cy-104,r:7,class:"sv-ink"});
    S(g,"ellipse",{cx,cy:cy+28,rx:24,ry:30,class:"sv-p2"});S(g,"ellipse",{cx,cy:cy+28,rx:24,ry:30,class:"sv-l","stroke-width":1.5});
    S(g,"ellipse",{cx,cy:cy-14,rx:17,ry:20,class:"sv-p2"});S(g,"ellipse",{cx,cy:cy-14,rx:17,ry:20,class:"sv-l","stroke-width":1.5});};
  const drums=(cx,cy)=>{S(g,"line",{x1:cx-34,y1:cy-46,x2:cx-6,y2:cy-52,class:"sv-l","stroke-width":2.5});S(g,"line",{x1:cx-20,y1:cy-49,x2:cx-20,y2:cy+10,class:"sv-l","stroke-width":1});
    S(g,"circle",{cx,cy:cy+28,r:28,class:"sv-p2"});S(g,"circle",{cx,cy:cy+28,r:28,class:"sv-l","stroke-width":1.5});S(g,"circle",{cx,cy:cy+28,r:8,class:"sv-ind"});
    S(g,"ellipse",{cx:cx+30,cy:cy-6,rx:16,ry:6,class:"sv-ink"});S(g,"rect",{x:cx+14,y:cy-6,width:32,height:14,class:"sv-ink"});};
  ac(90,140);foot(190,150);
  el(312,150);amp(342,148);S(g,"path",{d:"M312 190 Q 320 230 352 214",class:"sv-l","stroke-width":1.2});
  harp(450,150);bass(530,140);drums(612,140);
  [[90,"木吉他"],[190,"踩地板"],[340,"电吉他 + 音箱"],[450,"口琴 + 麦克风"],[530,"贝斯"],[612,"鼓"]].forEach(([x,t])=>S(g,"text",{x,y:236,"text-anchor":"middle",class:"sv-ts"},t));
})();
/* 图 8 家谱 */
(()=>{const g=document.getElementById("tree");if(!g)return;
  const box=(x,y,w,t,dark)=>{S(g,"rect",{x,y,width:w,height:44,rx:8,class:dark?"sv-ink":"sv-card"});if(!dark)S(g,"rect",{x,y,width:w,height:44,rx:8,class:"sv-l","stroke-width":1.2});
    S(g,"text",{x:x+w/2,y:y+27,"text-anchor":"middle",class:dark?"sv-on":"sv-t",style:dark?"font-size:15px":""},t);};
  const link=(x1,y1,x2,y2)=>S(g,"path",{d:`M${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`,class:"sv-lr","stroke-width":1.8});
  [52,147,242].forEach(y=>link(150,147,200,y));
  link(350,147,385,147);link(525,147,555,147);link(350,242,385,242);link(525,242,555,242);
  box(20,125,130,"布鲁斯",true);
  box(200,30,150,"爵士");box(200,125,150,"节奏布鲁斯 R&B");box(200,220,150,"摇滚乐");
  box(385,125,140,"灵魂乐 · 放克");box(385,220,140,"布鲁斯摇滚");
  box(555,125,115,"嘻哈");box(555,220,115,"硬摇滚 · 金属");
  S(g,"text",{x:385,y:57,class:"sv-ts"},"与布鲁斯同时代、互相影响");
})();
/* 外部照片：加载失败时显示链接 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`当前环境无法加载外部图片<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张照片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
