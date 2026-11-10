/* ================= 一首歌走遍地图 · 声音 =================
   同一段 8 小节原创旋律（A 小调五声音阶），14 种编配。
   旋律数据 JM 全程不变，各站只换节奏、和声、音色和速度。
   依赖：从 A1 截取的合成音频引擎（A、bus、pluck、strum、kick、snare、hat、shaper、noise、track、mf）。 */

/* [拍, MIDI, 时值（拍）]，共 32 拍 */
const JM=[
  [0,64,1],[1,67,.5],[1.5,69,1.5],[3,67,.5],[3.5,64,.5],
  [4,62,1],[5,60,.5],[5.5,62,1.5],
  [8,64,1],[9,67,.5],[9.5,69,1],[10.5,72,1],[11.5,69,.5],
  [12,67,2],[14,64,1],
  [16,69,.5],[16.5,69,.5],[17,67,.5],[17.5,64,1],[18.5,62,.5],[19,64,1],
  [20,67,1],[21,64,.5],[21.5,62,.5],[22,60,2],
  [24,62,.5],[24.5,64,.5],[25,67,1],[26,64,.5],[26.5,62,.5],[27,60,1],
  [28,57,3]
];

/* 和弦 */
const JPC={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const JQ={"":[0,4,7],m:[0,3,7],"7":[0,4,7,10],m7:[0,3,7,10],maj7:[0,4,7,11],m9:[0,3,7,10,14],"9":[0,4,7,10,14],
  "5":[0,7,12],"6":[0,4,7,9],m6:[0,3,7,9],"69":[0,4,7,9,14],"13":[0,4,10,14,21],m7b5:[0,3,6,10],"7#9":[0,4,10,15],
  "7#5":[0,4,8,10],"maj7#11":[0,4,11,14,18]};
function chd(s){const m=s.match(/^([A-G])(b|#)?(.*)$/);const r=(JPC[m[1]]+(m[2]==="#"?1:m[2]==="b"?-1:0)+12)%12;return {r,iv:JQ[m[3]],name:s};}
const bn=(c,lo)=>lo+((c.r-lo%12)%12+12)%12;                 /* 不低于 lo 的根音 */
const vo=(c,lo)=>{const b=bn(c,lo);return c.iv.map(i=>{let n=b+i;while(n>lo+20)n-=12;return n;});};
const swp=(p,sw)=>{const f=p-Math.floor(p);return Math.abs(f-.5)<1e-6?Math.floor(p)+.5+sw:p;};

/* 乐器补充：羽管键琴、闷音金属、朋克、干净电吉他、曼陀林、主音吉他 */
Object.assign(INST,{
  hp:{bright:.995,decay:.9966,dur:1.8,vol:.24,peak:[2800,4]},
  hp4:{bright:.998,decay:.995,dur:1.1,vol:.11,peak:[4000,3]},
  mpm:{bright:.88,decay:.999,dur:.7,vol:.13,drive:42,lp:1500},
  pk:{bright:.92,decay:.9992,dur:1.8,vol:.17,drive:14,lp:3600},
  cl:{bright:.85,decay:.9985,dur:2,vol:.45,lp:5200},
  bj:{bright:.97,decay:.993,dur:.7,vol:.22,peak:[2600,6]},
  ld:{bright:.9,decay:.9993,dur:2.4,vol:.16,drive:22,lp:4200}
});
/* 拨弦：补偿 Karplus-Strong 的整数周期误差，高音不跑调 */
function pl(t,m,inst,o={}){const ex=ac.sampleRate/mf(m),N=Math.max(2,Math.round(ex));pluck(t,m,inst,Object.assign({det:1200*Math.log2(N/ex)},o));}

let JFX={},JSTEM=null;
function fx(name){if(JFX[name])return JFX[name];const a=A(),inp=a.createGain();let out;
  if(name==="lofi"){const h=a.createBiquadFilter();h.type="highpass";h.frequency.value=90;const l=a.createBiquadFilter();l.type="lowpass";l.frequency.value=3600;const sh=a.createWaveShaper();sh.curve=shaper(1.8);out=a.createGain();out.gain.value=.9;inp.connect(h).connect(l).connect(sh).connect(out);}
  else{const d=a.createDelay(1);d.delayTime.value=.3;const fb=a.createGain();fb.gain.value=.3;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=3000;out=a.createGain();out.gain.value=.28;inp.connect(d).connect(lp).connect(fb).connect(d);lp.connect(out);}
  out.connect(bus);return JFX[name]=inp;}
function via(node,fn){const k=bus;bus=node;try{fn();}finally{bus=k;}}

/* 合成器 */
function syn(t,m,d,o={}){const a=A(),f=mf(m),lp=a.createBiquadFilter(),g=a.createGain(),W=o.w||[["sawtooth",0]];lp.type="lowpass";lp.Q.value=o.q||.7;
  const c0=o.cut||1500,c1=o.peak||c0;lp.frequency.setValueAtTime(c1,t);if(c1!==c0)lp.frequency.exponentialRampToValueAtTime(c0,t+(o.fd||.2));
  const rel=o.rel||.06,at=Math.min(o.att||.004,d*.9),end=t+d+rel*5+.05;
  W.forEach(([w,dt])=>{const x=a.createOscillator();x.type=w;x.detune.value=dt;if(o.from!=null){x.frequency.setValueAtTime(mf(o.from),t);x.frequency.exponentialRampToValueAtTime(f,t+(o.glide||.06));}else x.frequency.setValueAtTime(f,t);x.connect(lp);x.start(t);x.stop(end);track(x);});
  /* 包络只用线性/指数渐变：起音 → （衰减）→ 保持 → 释音 */
  const v=(o.vol||1)*.06/Math.sqrt(W.length),te=t+Math.max(at,d);let lv=v;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+at);
  if(o.dec){lv=v*(o.sus==null?.3:o.sus);g.gain.exponentialRampToValueAtTime(lv,Math.min(te,t+at+o.dec*3));}
  g.gain.setValueAtTime(lv,te);g.gain.exponentialRampToValueAtTime(.0001,te+rel*4);
  let n=lp;if(o.drive){const sh=a.createWaveShaper();sh.curve=shaper(o.drive);lp.connect(sh);n=sh;}n.connect(g).connect(bus);if(o.send)g.connect(fx(o.send));}
/* 八音盒（原样旋律） */
function bell(t,m,d,v=1){const a=A(),f=mf(m),L=Math.min(d+.5,2.2);
  [[1,1,1.6],[2,.28,.6],[3.01,.1,.35],[4.2,.05,.2]].forEach(([h,am,dc])=>{const x=a.createOscillator();x.type="sine";x.frequency.value=f*h;const g=a.createGain(),len=Math.max(.15,L*dc);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(am*.16*v,t+.006);g.gain.exponentialRampToValueAtTime(.0005,t+len+.2);x.connect(g).connect(bus);x.start(t);x.stop(t+len+.25);track(x);});}
/* 颤音琴 */
function vibe(t,m,d,v=1){const a=A(),f=mf(m),L=Math.min(d+.8,2.4),trem=a.createGain();trem.gain.value=.75;const l=a.createOscillator(),lg=a.createGain();l.frequency.value=5.2;lg.gain.value=.25;l.connect(lg).connect(trem.gain);
  [[1,1,L],[3.99,.18,.25]].forEach(([h,am,len])=>{const x=a.createOscillator();x.type="sine";x.frequency.value=f*h;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(am*.2*v,t+.004);g.gain.exponentialRampToValueAtTime(.0005,t+len);x.connect(g).connect(trem);x.start(t);x.stop(t+len+.05);track(x);});
  trem.connect(bus);l.start(t);l.stop(t+L+.05);track(l);}
/* 以下乐器取自本书各章（A4 爵士、B2 硬摇滚、C1 灵魂乐、C2 嘻哈、C3 电子舞曲） */
function ride(t,v=1){const a=A(),out=a.createGain();out.gain.value=.09;[263,400,421,474,587,845].forEach(f=>{const o=a.createOscillator();o.type="square";o.frequency.value=f*2.3;o.connect(out);o.start(t);o.stop(t+1.1);track(o);});
  const hp=a.createBiquadFilter();hp.type="highpass";hp.frequency.value=5600;const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=8600;pk.gain.value=5;const g=a.createGain();
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.3*v,t+.002);g.gain.exponentialRampToValueAtTime(.07*v,t+.1);g.gain.exponentialRampToValueAtTime(.001,t+1);out.connect(hp).connect(pk).connect(g).connect(bus);
  const n=a.createBufferSource();n.buffer=noise();const nf=a.createBiquadFilter();nf.type="highpass";nf.frequency.value=9000;const ng=a.createGain();ng.gain.setValueAtTime(.07*v,t);ng.gain.exponentialRampToValueAtTime(.001,t+.04);n.connect(nf).connect(ng).connect(bus);n.start(t);n.stop(t+.05);track(n);}
function rho(t,midi,dur,v=1){const a=A(),f=mf(midi),c=a.createOscillator(),m=a.createOscillator(),mg=a.createGain();c.type="sine";m.type="sine";c.frequency.value=f;m.frequency.value=f;mg.gain.setValueAtTime(f*2.2,t);mg.gain.exponentialRampToValueAtTime(f*.25,t+.5);m.connect(mg).connect(c.frequency);
  const b=a.createOscillator(),bg=a.createGain();b.frequency.value=f*7;bg.gain.setValueAtTime(.05*v,t);bg.gain.exponentialRampToValueAtTime(.0005,t+.12);b.connect(bg).connect(bus);
  const g=a.createGain(),te=t+Math.max(.02,Math.min(dur,.6)),lv=.05*v+.08*v*Math.exp(-(te-t-.005)/.4);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.13*v,t+.005);g.gain.exponentialRampToValueAtTime(lv,te);
  g.gain.setValueAtTime(lv,Math.max(te,t+dur));g.gain.exponentialRampToValueAtTime(.0001,Math.max(te,t+dur)+.4);c.connect(g).connect(bus);[c,m,b].forEach(x=>{x.start(t);x.stop(t+dur+.7);track(x);});}
function hammond(t,midi,dur,o={}){const a=A(),f=mf(midi),g=a.createGain(),v=(o.vol||1)*.09;
  [[1,.5],[2,.35],[3,.22],[4,.18],[6,.08],[8,.1]].forEach(([h,am])=>{const x=a.createOscillator();x.type="sine";x.frequency.value=f*h;const xg=a.createGain();xg.gain.value=am;x.connect(xg).connect(g);x.start(t);x.stop(t+dur+.05);track(x);});
  const p=a.createOscillator();p.type="sine";p.frequency.value=f*3;const pg=a.createGain();pg.gain.setValueAtTime(.35,t);pg.gain.exponentialRampToValueAtTime(.001,t+.25);p.connect(pg).connect(g);p.start(t);p.stop(t+.3);track(p);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.setValueAtTime(v,t+dur-.03);g.gain.linearRampToValueAtTime(0,t+dur);g.connect(bus);}
function epiano(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain(),x=a.createOscillator();x.type="sine";x.frequency.value=f;const m=a.createOscillator();m.frequency.value=f*2;const mg=a.createGain();mg.gain.setValueAtTime(f*1.1,t);mg.gain.exponentialRampToValueAtTime(f*.08,t+.5);m.connect(mg).connect(x.frequency);x.connect(g);[x,m].forEach(o=>{o.start(t);o.stop(t+dur+.1);track(o);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.11*v,t+.006);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);g.connect(bus);}
function clap(t,v=1){const a=A();[0,.011,.022].forEach((d,i)=>{const n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=1300;f.Q.value=.9;const g=a.createGain();g.gain.setValueAtTime(.45*v*(i===2?1:.6),t+d);g.gain.exponentialRampToValueAtTime(.001,t+d+(i===2?.14:.02));n.connect(f).connect(g).connect(bus);n.start(t+d);n.stop(t+d+.16);track(n);});}
function k909(t,v=1){const a=A(),o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(52,t+.07);g.gain.setValueAtTime(.95*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);const sh=a.createWaveShaper();sh.curve=shaper(1.6);o.connect(sh).connect(g).connect(bus);o.start(t);o.stop(t+.34);track(o);}
function oh(t,v=1,len=.22){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=7500;const g=a.createGain();g.gain.setValueAtTime(.14*v,t);g.gain.exponentialRampToValueAtTime(.001,t+len);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+len+.01);track(n);}
function b808(t,midi,dur,o={}){const a=A(),f=mf(midi),x=a.createOscillator();x.type="sine";x.frequency.setValueAtTime(f*2.4,t);x.frequency.exponentialRampToValueAtTime(f,t+.03);
  const g=a.createGain(),v=(o.vol||1)*.7;g.gain.setValueAtTime(v,t);g.gain.setValueAtTime(v*.9,t+Math.max(.05,dur-.12));g.gain.exponentialRampToValueAtTime(.001,t+dur);const sh=a.createWaveShaper();sh.curve=shaper(2.4);x.connect(sh).connect(g).connect(bus);x.start(t);x.stop(t+dur+.02);track(x);}
function crackle(t,dur,v=.5){const a=A(),n=a.createBufferSource(),len=Math.floor(a.sampleRate*Math.min(dur,40)),b=a.createBuffer(1,len,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()<.0008?(Math.random()*2-1)*.9:(Math.random()*2-1)*.01;n.buffer=b;const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=1500;const g=a.createGain();g.gain.value=v;n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+dur);track(n);}
function crash(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();n.loop=true;const hp=a.createBiquadFilter();hp.type="highpass";hp.frequency.value=5000;const g=a.createGain();g.gain.setValueAtTime(.2*v,t);g.gain.exponentialRampToValueAtTime(.001,t+1.8);n.connect(hp).connect(g).connect(bus);n.start(t);n.stop(t+1.9);track(n);}
function hpsi2(t,m,v,d){pl(t,m,"hp",{vol:v,dur:Math.min(1.8,(d||.4)+.6)});pl(t+.003,m+12,"hp4",{vol:v,dur:1});}

/* ================= 14 种编配 =================
   bar(X) 写伴奏，mel(t, 音高, 秒, 信息) 写旋律。X.at(拍) 把小节内的拍换成时间（含摇摆）。 */
const STY={
  Intro:{g:6,bpm:92,sw:0,mel:(t,m,d)=>bell(t,m+12,d,1.1)},

  A1:{g:2,bpm:84,sw:1/6,ch:["A7","D7","A7","E7","A7","A7","D7","A7 E7"],
    bar(X){for(let q=0;q<4;q++){const c=X.c(q),r=bn(c,38),six=q<2?7:9;
      [q,q+.5].forEach((p,k)=>strum(X.at(p),[r,r+six],"el",{vol:k?.36:.48,mute:.2,spread:.006}));
      const off=X.chs.length>1?[0,7,0,7][q]:[0,4,7,9][q];pl(X.at(q),bn(c,33)+off,"bass",{vol:.85,mute:X.bs*.9});
      hat(X.at(q),.7);hat(X.at(q+.5),.45);if(q%2===0)kick(X.at(q),.7);else snare(X.at(q),.55);}},
    mel(t,m,d,i){const long=i.beats>=1,blue=m%12===0;   /* C 是蓝调音：推弦往上推一点 */
      pl(t,blue?m+.3:m,"dr",{vol:1.2,mute:d+.06,vib:long,vibAt:.25,from:blue?-.3:(long&&i.q%1===0?-1:0),glide:blue?.18:.12});}},

  A2:{g:10,bpm:104,sw:0,ch:["C","G","C","C","F","C","G","Am"],
    bar(X){for(let q=0;q<4;q++){const c=X.c(q),b=bn(c,52),v=[b,b+c.iv[1],b+c.iv[2],b+12];
      if(q%2===0){pl(X.at(q),bn(c,40)+(q===2?7:0),"ac",{vol:.9,dur:1.2,mute:X.bs*1.6});kick(X.at(q),.3);}
      else{strum(X.at(q),v,"ac",{vol:.4,spread:.012,mute:.32});snare(X.at(q),.5,true);}
      strum(X.at(q+.5),v.slice(1).reverse(),"ac",{vol:.18,spread:.008,mute:.14});}},
    mel(t,m,d,i){if(i.beats>=1){const step=i.X.bs/6,n=Math.max(1,Math.floor(d/step));for(let k=0;k<n;k++)pl(t+k*step,m+12,"bj",{vol:k?1.25:2,mute:step*1.3});}
      else pl(t,m+12,"bj",{vol:2,mute:d+.08});}},

  A3:{g:6,bpm:84,sw:0,ch:["Am","Dm","Am","Em","Am","C","Dm","Am"],
    bar(X){for(let e=0;e<8;e++){const q=e/2,c=X.c(q);pl(X.at(q),bn(c,33)+[0,12,7,12][e%4],"hp",{vol:.7,dur:1.2});}
      [0,2].forEach(q=>vo(X.c(q),52).forEach((n,k)=>pl(X.at(q)+k*.025,n,"hp",{vol:.38,dur:1.4})));
      const lo=X.bar*4;   /* 卡农：旋律晚两拍、低八度再进一次 */
      JM.forEach(([b,m,d])=>[b+2,b+2-32].forEach(s=>{if(s>=lo&&s<lo+4)pl(X.at(s-lo),m-12,"hp",{vol:.6,dur:Math.min(1.6,d*X.bs+.4)});}));},
    mel(t,m,d,i){if(i.beats>=2&&i.beats<3){const s=i.X.bs/8;for(let k=0;k<6;k++)hpsi2(t+k*s,k%2?m+2:m,1.6,s);hpsi2(t+6*s,m,1.9,d-6*s);}
      else hpsi2(t,m,1.9,d);}},

  A4:{g:4,bpm:132,sw:1/6,ch:["Am9","Dm9 G13","C69","Bm7b5 E7#9","Am9","Fmaj7#11","Dm9 E7#5","Am6"],
    bar(X){const two=X.chs.length>1;
      for(let q=0;q<4;q++){const c=X.c(q),r=bn(c,33);let n=two?[r,r+7,r,0][q]:[r,r+c.iv[1],r+7,0][q];
        if(q===3){const nr=bn(X.nx,33);n=nr+(nr>r?-1:1);}       /* 半音走进下一小节的根音 */
        pl(X.at(q),n,"bass",{vol:.95,mute:X.bs*.95});ride(X.at(q),q%2?.8:.55);if(q%2)hat(X.at(q),.4);}
      ride(X.at(1.5),.4);ride(X.at(3.5),.4);
      (two?[[0,0,1.6],[2,1,1.6]]:[[0,0,1.2],[1.5,0,1.2]]).forEach(([p,k,len])=>vo(X.chs[k],53).forEach(n=>rho(X.at(p),n,X.bs*len,.5)));},
    mel(t,m,d){vibe(t,m+12,d,1.6);}},

  B1:{g:-3,bpm:120,sw:0,ch:["A5","D5","A5","E5","A5","C5","D5","A5"],
    bar(X){if(X.first||X.bar%4===0)crash(X.t0,.8);
      for(let e=0;e<8;e++){const q=e/2,c=X.c(q),r=bn(c,40);strum(X.at(q),[r,r+7,r+12],"dr",{vol:e%2?.4:.52,mute:.2,spread:.007});pl(X.at(q),r-12,"bass",{vol:.8,mute:.2});hat(X.at(q),e%2?.4:.7);}
      kick(X.at(0));kick(X.at(2));kick(X.at(2.5),.7);snare(X.at(1));snare(X.at(3));},
    mel(t,m,d,i){const long=i.beats>=1;pl(t,m+12,"ld",{vol:1.1,mute:d+.05,vib:long,vibAt:.3,from:long&&i.q%1===0?-1:0,glide:.1});}},

  B2:{g:-2.5,bpm:98,sw:.06,ch:["A5","D5","A5","E5","A5","C5 D5","D5","A5"],
    bar(X){if(X.first||X.bar%2===0)crash(X.t0,1);
      [[0,1.4,1],[1.5,.25,.7],[2,.9,1],[3,.22,.7],[3.5,.22,.75]].forEach(([p,len,v])=>{const r=bn(X.c(p),40);strum(X.at(p),[r,r+7,r+12],"dr",{vol:.58*v,mute:len*X.bs,spread:.008});pl(X.at(p),r-12,"bass",{vol:.9*v,mute:len*X.bs});});
      X.chs.forEach((c,k)=>{const r=bn(c,45),len=X.chs.length>1?2:4;[r+12,r+19,r+24].forEach(n=>hammond(X.at(k*2),n,len*X.bs*.97,{vol:.5}));});
      kick(X.at(0));kick(X.at(1.5),.8);kick(X.at(2));snare(X.at(1),1.1);snare(X.at(3),1.1);for(let e=0;e<8;e++)hat(X.at(e/2),e%2?.35:.55);},
    mel(t,m,d,i){const long=i.beats>=1;pl(t,m+12,"ld",{vol:1.15,mute:d+.08,vib:long,vibAt:.2,from:long?-2:0,glide:.2});}},

  B3:{g:-5,bpm:176,sw:0,ch:["A5","D5","A5","E5","A5","C5","D5","A5"],
    bar(X){if(X.first)crash(X.t0,1);
      for(let e=0;e<8;e++){const q=e/2,r=bn(X.c(q),40);strum(X.at(q),[r,r+7,r+12],"pk",{vol:.44,mute:.24,spread:.005});pl(X.at(q),r-12,"bass",{vol:.85,mute:.15});hat(X.at(q),.7);}
      kick(X.at(0));kick(X.at(2));kick(X.at(2.5),.8);snare(X.at(1),1.1);snare(X.at(3),1.1);},
    mel(t,m,d){strum(t,[m-7,m],"pk",{vol:1.25,mute:d+.03,spread:.004});}},   /* 旋律也用两个音的强力和弦弹 */

  B4:{g:-6,bpm:160,sw:0,ch:["A5","F5","A5","E5","A5","C5","D5","A5"],
    bar(X){if(X.first)crash(X.t0,1);
      for(let q=0;q<4;q++){const r=bn(X.c(q),33);
        [0,.5,.75].forEach(p=>{strum(X.at(q+p),[r,r+7],"mpm",{vol:1.15,mute:.09,spread:.002});pl(X.at(q+p),r,"bass",{vol:.7,mute:.1});});   /* 奔马：一个八分 + 两个十六分 */
        kick(X.at(q));snare(X.at(q+.5),.85);ride(X.at(q),.3);}},             /* 砰嚓 */
    mel(t,m,d,i){const long=i.beats>=1;[m+12,m].forEach((n,k)=>pl(t+k*.004,n,"ld",{vol:k?.95:1.25,mute:d+.05,vib:long,vibAt:.15}));}},

  C1:{g:3,bpm:100,sw:0,ch:["Am7","D9","Am7","Em7","Am7","Cmaj7","D9","Am7"],
    bar(X){const c=X.c(0),r=bn(c,33),s=i=>X.at(i/4);
      [[0,0,.6,1.15],[3,12,.2,.7],[6,0,.25,.75],[7,10,.2,.7],[10,12,.2,.75],[11,0,.2,.7],[13,7,.2,.7],[14,10,.25,.75]].forEach(([i,iv,len,v])=>pl(s(i),r+iv,"bass",{vol:v,mute:len*X.bs}));
      const top=vo(c,55).slice(-3);[2,6,7,10,14].forEach(i=>strum(s(i),top,"cl",{vol:.3,mute:.07,spread:.004}));
      [0,7,10].forEach(i=>kick(s(i),i?.75:1));snare(s(4));snare(s(12));[6,9,15].forEach(i=>snare(s(i),.15));
      for(let i=0;i<16;i++)hat(s(i),i%2?.2:.42);},
    mel(t,m,d){hammond(t,m+12,Math.max(.12,d*.95),{vol:2.2});}},

  C2:{g:-2.5,bpm:90,sw:.06,ch:["Am9","Dm9","Am9","Em7","Am9","Fmaj7","Dm9","Am9"],
    bar(X){const c=X.c(0),r=bn(c,33),s=i=>X.t0+(i/4+(i%2?.04:0)+(i%4===2?.06:0))*X.bs;   /* 带一点“醉”的摇摆 */
      via(fx("lofi"),()=>{crackle(X.t0,4*X.bs,.35);
        [0,6,10].forEach(i=>{kick(s(i),i?.85:1);b808(s(i),r,X.bs*.45,{vol:.5});});[4,12].forEach(i=>snare(s(i),1.05));for(let i=0;i<16;i+=2)hat(s(i),i%4?.32:.5);
        [[0,1.5],[2.5,1]].forEach(([p,len])=>vo(c,53).forEach(n=>rho(X.at(p),n,len*X.bs,.4)));});},
    mel(t,m,d){via(fx("lofi"),()=>epiano(t,m+12,d,6));}},

  C3:{g:0,bpm:124,sw:0,ch:["Am","F","C","G","Am","F","C","Am"],
    bar(X){const c=X.c(0),r=bn(c,33);if(X.first)crash(X.t0,.7);
      for(let q=0;q<4;q++){k909(X.at(q));oh(X.at(q+.5),.8);hat(X.at(q+.25),.25);hat(X.at(q+.75),.25);
        syn(X.at(q+.5),r+12,X.bs*.4,{w:[["sawtooth",0],["square",-5]],cut:500,peak:1600,fd:.12,vol:1.2,rel:.03});
        vo(c,52).forEach(n=>syn(X.at(q),n,X.bs*.98,{w:[["sawtooth",-12],["sawtooth",0],["sawtooth",12]],cut:1600,att:X.bs*.42,rel:.04,vol:.3}));}   /* 每拍被底鼓“压”一下 */
      clap(X.at(1),.85);clap(X.at(3),.85);},
    mel(t,m,d){syn(t,m+12,d*.95,{w:[["sawtooth",-18],["sawtooth",-7],["sawtooth",0],["sawtooth",7],["sawtooth",18]],cut:2600,peak:6000,fd:.15,vol:4.2,rel:.08,send:"dly"});}},

  D1:{g:-2,bpm:116,sw:0,ch:["Am","G","Am","Em","F","C","G","Am"],
    bar(X){const c=X.c(0),r=bn(c,33);
      if(!X.loud){const b=bn(c,52),ns=[b,b+c.iv[1],b+c.iv[2],b+12];
        [0,1,2,3,2,1,2,3].forEach((k,e)=>{pl(X.at(e/2),ns[k],"cl",{vol:.5,dur:1.6});pl(X.at(e/2)+.008,ns[k]+12,"cl",{vol:.2,dur:1.2});});   /* 十二弦分解和弦 */
        pl(X.at(0),r,"bass",{vol:.6,mute:2*X.bs});pl(X.at(2),r,"bass",{vol:.55,mute:2*X.bs});kick(X.at(0),.4);kick(X.at(2),.35);for(let e=0;e<8;e++)hat(X.at(e/2),.22);}
      else{crash(X.t0,1);
        for(let e=0;e<8;e++){const rr=bn(c,40);strum(X.at(e/2),[rr,rr+7,rr+12],"pk",{vol:.55,mute:.26,spread:.006});pl(X.at(e/2),rr-12,"bass",{vol:.85,mute:.2});hat(X.at(e/2),.65);}
        kick(X.at(0));kick(X.at(1.5),.8);kick(X.at(2));snare(X.at(1),1.15);snare(X.at(3),1.15);}},
    mel(t,m,d,i){if(i.X.loud){pl(t,m+12,"ld",{vol:1.2,mute:d+.05,vib:i.beats>=1});pl(t,m,"ld",{vol:.75,mute:d+.05});}
      else{pl(t,m+12,"cl",{vol:1.35,dur:Math.min(2.2,d+.8),det:-7});pl(t+.012,m+12,"cl",{vol:.75,dur:Math.min(2,d+.6),det:7});}}},

  D2:{g:-6.5,bpm:100,sw:0,ch:["F","G","C","Em","F","C","G","Am"],
    bar(X){const c=X.c(0),r=bn(c,33);
      kick(X.at(0));kick(X.at(2.5),.85);clap(X.at(1),.9);clap(X.at(3),.9);snare(X.at(1),.3);snare(X.at(3),.3);
      for(let i=0;i<16;i++)hat(X.at(i/4),i%4===0?.42:.2);if(X.bar%2===1)for(let k=0;k<6;k++)hat(X.at(3.5+k/12),.16+k*.04);   /* 碎拍踩镲 */
      b808(X.at(0),r,X.bs*1.8,{vol:.55});b808(X.at(2.5),r,X.bs*1.2,{vol:.45});
      for(let q=0;q<4;q++)vo(c,55).forEach(n=>syn(X.at(q),n,X.bs*.98,{w:[["sawtooth",-10],["sawtooth",10]],cut:1500,att:X.bs*.4,rel:.04,vol:.2}));},
    mel(t,m,d){syn(t,m+12,Math.max(.1,d*.9),{w:[["sawtooth",-6],["square",6]],cut:900,peak:4200,fd:.16,dec:.18,sus:.6,vol:6,rel:.1,send:"dly"});},
    end(t){via(jOut(STY.D2.g),()=>{crash(t,1);kick(t);b808(t,33,2.4,{vol:.8});vo(chd("Am"),55).forEach(n=>syn(t,n,2.2,{w:[["sawtooth",-10],["sawtooth",10]],cut:1400,att:.02,rel:.5,vol:.4}));});}}
};

/* 柔和限幅：0.7 以下原样通过，超出部分圆滑压回，最高到 1（输入先 ×0.5，曲线里再 ×2） */
let JSOFT=null;
function softCurve(){if(JSOFT)return JSOFT;const n=2048,c=new Float32Array(n);for(let i=0;i<n;i++){const u=(i/(n-1)*2-1)*2,a=Math.abs(u);c[i]=Math.sign(u)*(a<=.7?a:.7+.3*Math.tanh((a-.7)/.3));}return JSOFT=c;}
/* 每站输出：音量修正 → 25 Hz 高通（去掉拨弦带来的直流和次声）→ 柔和限幅 */
function jOut(db){const a=A(),g=a.createGain(),hp=a.createBiquadFilter(),sh=a.createWaveShaper();g.gain.value=.5*.8*Math.pow(10,(db||0)/20);hp.type="highpass";hp.frequency.value=25;hp.Q.value=.6;sh.curve=softCurve();g.connect(hp).connect(sh).connect(bus);return g;}
/* 排一小节：返回这一小节的时长（秒） */
function jBar(code,bar,t0,o={}){const st=STY[code],bs=60/st.bpm,chs=st.ch?st.ch[bar].split(" ").map(chd):null;
  const X={t0,bs,bar,chs,first:!!o.first,mode:o.mode,
    c:q=>chs.length>1&&q>=2?chs[1]:chs[0],
    nx:st.ch?chd(st.ch[(bar+1)%8].split(" ")[0]):null,
    at:(p,sw)=>t0+swp(p,sw==null?st.sw:sw)*bs};
  X.loud=o.mode==="tour"?bar%2===1:bar>=4;   /* D1：安静、爆发 */
  const tg=jOut(st.g);   /* 每站的音量修正，让 14 站响度接近 */
  via(tg,()=>{JFX={};
    if(JSTEM!=="mel"&&st.bar)st.bar(X);
    if(JSTEM!=="acc")JM.forEach(([b,m,d])=>{if(b>=bar*4&&b<bar*4+4){const q=b-bar*4;st.mel(X.at(q),m,d*bs,{q,beats:d,X});}});});
  return 4*bs;}

/* 旅程：按书的顺序走 14 站。Intro 和最后一站各 4 小节，其余各 2 小节；旋律从头到尾正好走四遍 */
const JORDER=["Intro","A1","A2","A3","A4","B1","B2","B3","B4","C1","C2","C3","D1","D2"];
const JPLAN=[];JORDER.forEach(c=>{const n=c==="Intro"||c==="D2"?4:2;for(let k=0;k<n;k++)JPLAN.push({code:c,bar:JPLAN.length%8});});
