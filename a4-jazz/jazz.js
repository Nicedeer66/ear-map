/* ================= 爵士：乐器 ================= */
Object.assign(INST,{
  jb:{bright:.34,decay:.9952,dur:1.2,vol:1.05,lp:950,peak:[110,4]},
  bj:{bright:.97,decay:.993,dur:.7,vol:.3,lp:5200},
  ny:{bright:.42,decay:.9976,dur:1.8,vol:.62,peak:[220,3]},
  gt:{bright:.55,decay:.994,dur:.5,vol:.42,lp:2600}
});
const pcOf=m=>((m%12)+12)%12;
const QI={maj7:[0,4,7,11],"6":[0,4,7,9],m7:[0,3,7,10],m6:[0,3,7,9],"7":[0,4,7,10],m7b5:[0,3,6,10],"":[0,4,7],m:[0,3,7]};
const SC={maj7:[0,2,4,5,7,9,11],"6":[0,2,4,5,7,9,11],m7:[0,2,3,5,7,9,10],m6:[0,2,3,5,7,9,10],"7":[0,2,4,5,7,9,10],m7b5:[0,1,3,5,6,8,10],"":[0,2,4,5,7,9,11],m:[0,2,3,5,7,8,10]};
const RL={maj7:[4,7,11,14],"6":[4,7,9,14],m7:[3,7,10,14],m6:[3,7,9,14],"7":[4,9,10,14],m7b5:[3,6,10,12],"":[0,4,7],m:[0,3,7]};
function CH(n){let i=1,r=PCN[n[0]];if(n[1]==="b"){r--;i++;}else if(n[1]==="#"){r++;i++;}return{n,r:pcOf(r),q:n.slice(i)};}
const tonesOf=c=>QI[c.q].map(x=>pcOf(c.r+x)),scaleOf=c=>SC[c.q].map(x=>pcOf(c.r+x));
function near(pc,target){let m=target-6;while(pcOf(m)!==pc)m++;return m;}
function deg(c,r,k){const s=SC[c.q],o=Math.floor(k/7),i=((k%7)+7)%7;return r+s[i]+12*o;}
/* 钢琴：有声部进行的无根音排列 */
function voiceLead(chs,lo=50,prev=null){return chs.map(c=>{const pcs=RL[c.q].map(x=>pcOf(c.r+x));let best=null,bs=1e9;
  for(let k=0;k<pcs.length;k++){const ord=pcs.slice(k).concat(pcs.slice(0,k));let v=[],m=lo;ord.forEach(pc=>{while(pcOf(m)!==pc)m++;v.push(m);m++;});
    const sc=prev?v.reduce((s,x,i)=>s+Math.abs(x-(prev[i]!=null?prev[i]:prev[prev.length-1])),0):Math.abs(v[0]-(lo+4));if(sc<bs){bs=sc;best=v;}}
  prev=best;return best;});}
let RNG=Math.random;function seeded(s){return()=>{s=(s*16807)%2147483647;return s/2147483647;};}
const pick=a=>a[Math.floor(RNG()*a.length)];

/* 原声钢琴 */
function pno(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain();[[1,.6,"triangle"],[2,.2,"sine"],[3,.07,"sine"],[4,.025,"sine"]].forEach(([h,am,w])=>{const x=a.createOscillator();x.type=w;x.frequency.value=f*h*(h>1?1.0009:1);const xg=a.createGain();xg.gain.value=am;x.connect(xg).connect(g);x.start(t);x.stop(t+dur+.6);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.1*v,t+.004);g.gain.setTargetAtTime(.028*v,t+.006,.22);g.gain.setTargetAtTime(0,t+dur,.08);g.connect(bus);}
function chord(t,notes,dur,v=1,roll=0){notes.forEach((m,i)=>pno(t+i*roll,m,dur,v*(i===notes.length-1?1.1:.85)));}
/* 电钢琴：调频 */
function rho(t,midi,dur,v=1){const a=A(),f=mf(midi),c=a.createOscillator(),m=a.createOscillator(),mg=a.createGain();c.type="sine";m.type="sine";c.frequency.value=f;m.frequency.value=f;mg.gain.setValueAtTime(f*2.2,t);mg.gain.exponentialRampToValueAtTime(f*.25,t+.5);m.connect(mg).connect(c.frequency);
  const b=a.createOscillator(),bg=a.createGain();b.frequency.value=f*7;bg.gain.setValueAtTime(.05*v,t);bg.gain.exponentialRampToValueAtTime(.0005,t+.12);b.connect(bg).connect(bus);
  const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.13*v,t+.005);g.gain.setTargetAtTime(.05*v,t+.01,.4);g.gain.setTargetAtTime(0,t+dur,.12);c.connect(g).connect(bus);[c,m,b].forEach(x=>{x.start(t);x.stop(t+dur+.7);track(x);});}
/* 叮叮镲、刷子、踩镲 */
function ride(t,v=1){const a=A(),out=a.createGain();out.gain.value=.09;[263,400,421,474,587,845].forEach(f=>{const o=a.createOscillator();o.type="square";o.frequency.value=f*2.3;o.connect(out);o.start(t);o.stop(t+1.1);track(o);});
  const hp=a.createBiquadFilter();hp.type="highpass";hp.frequency.value=5600;const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=8600;pk.gain.value=5;const g=a.createGain();
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.3*v,t+.002);g.gain.exponentialRampToValueAtTime(.07*v,t+.1);g.gain.exponentialRampToValueAtTime(.001,t+1);out.connect(hp).connect(pk).connect(g).connect(bus);
  const n=a.createBufferSource();n.buffer=noise();const nf=a.createBiquadFilter();nf.type="highpass";nf.frequency.value=9000;const ng=a.createGain();ng.gain.setValueAtTime(.07*v,t);ng.gain.exponentialRampToValueAtTime(.001,t+.04);n.connect(nf).connect(ng).connect(bus);n.start(t);n.stop(t+.05);track(n);}
function chick(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=7000;f.Q.value=1.4;const g=a.createGain();g.gain.setValueAtTime(.2*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.035);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+.05);track(n);}
function swish(t,dur,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();n.loop=true;const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=3200;f.Q.value=.6;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05*v,t+dur*.5);g.gain.linearRampToValueAtTime(0,t+dur);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+dur+.02);track(n);}
function cross(t,v=1){const a=A(),o=a.createOscillator();o.type="triangle";o.frequency.value=1250;const g=a.createGain();g.gain.setValueAtTime(.16*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.05);const n=a.createBufferSource();n.buffer=noise();const nf=a.createBiquadFilter();nf.type="bandpass";nf.frequency.value=2200;nf.Q.value=3;const ng=a.createGain();ng.gain.setValueAtTime(.12*v,t);ng.gain.exponentialRampToValueAtTime(.001,t+.04);n.connect(nf).connect(ng).connect(bus);o.connect(g).connect(bus);[o,n].forEach(x=>{x.start(t);x.stop(t+.06);track(x);});}
/* 低音提琴 */
function ub(t,m,dur,v=1){pluck(t,m,"jb",{vol:v,mute:Math.max(.12,dur)});}
/* 萨克斯：锯齿波 + 共振峰 + 气声 + 延迟颤音 */
function sax(t,midi,dur,o={}){const a=A(),f=mf(midi),x=a.createOscillator();x.type="sawtooth";const sc=o.scoop==null?-.5:o.scoop;x.frequency.setValueAtTime(f*Math.pow(2,sc/12),t);x.frequency.linearRampToValueAtTime(f,t+.05);
  if(o.fall){x.frequency.setValueAtTime(f,t+dur*.55);x.frequency.exponentialRampToValueAtTime(f*Math.pow(2,o.fall/12),t+dur);}
  const l=a.createOscillator(),lg=a.createGain();l.frequency.value=5.3;lg.gain.setValueAtTime(0,t);lg.gain.setValueAtTime(0,t+Math.min(.22,dur*.5));lg.gain.linearRampToValueAtTime(dur>.35?(o.vib||18):0,t+dur);l.connect(lg).connect(x.detune);
  const br=o.bright||1,lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=1.6;lp.frequency.setValueAtTime(800*br,t);lp.frequency.linearRampToValueAtTime(2900*br,t+.035);lp.frequency.linearRampToValueAtTime(1700*br,t+Math.max(.06,dur));
  const p1=a.createBiquadFilter();p1.type="peaking";p1.frequency.value=o.f1||520;p1.Q.value=1.4;p1.gain.value=7;const p2=a.createBiquadFilter();p2.type="peaking";p2.frequency.value=1650;p2.Q.value=2;p2.gain.value=4;
  const g=a.createGain(),v=(o.vol||1)*.1;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.022);g.gain.setValueAtTime(v*.82,t+Math.max(.03,dur-.04));g.gain.linearRampToValueAtTime(0,t+dur+.02);
  let node=x.connect(lp).connect(p1).connect(p2);if(o.drive){const sh=a.createWaveShaper();sh.curve=shaper(o.drive);node.connect(sh);node=sh;}node.connect(g).connect(bus);
  const n=a.createBufferSource();n.buffer=noise();const nf=a.createBiquadFilter();nf.type="bandpass";nf.frequency.value=Math.max(2800,f*4);nf.Q.value=1;const ng=a.createGain(),air=(o.vol||1)*(o.air||1);ng.gain.setValueAtTime(0,t);ng.gain.linearRampToValueAtTime(.022*air,t+.02);ng.gain.linearRampToValueAtTime(.007*air,t+dur);ng.gain.linearRampToValueAtTime(0,t+dur+.02);n.connect(nf).connect(ng).connect(bus);
  [x,l,n].forEach(z=>{z.start(t);z.stop(t+dur+.06);track(z);});}
/* 小号（可加哈蒙弱音器）、长号、单簧管、大号 */
function tpt(t,midi,dur,o={}){const a=A(),f=mf(midi),x=a.createOscillator();x.type="sawtooth";x.frequency.setValueAtTime(f*Math.pow(2,(o.from||-.4)/12),t);x.frequency.linearRampToValueAtTime(f,t+(o.glide||.06));
  if(o.fall){x.frequency.setValueAtTime(f,t+dur*.5);x.frequency.exponentialRampToValueAtTime(f*Math.pow(2,o.fall/12),t+dur);}
  const l=a.createOscillator(),lg=a.createGain();l.frequency.value=5.2;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(dur>.4?14:0,t+Math.min(.6,dur));l.connect(lg).connect(x.detune);
  const lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=1.5;lp.frequency.setValueAtTime(500,t);lp.frequency.linearRampToValueAtTime(o.harmon?3200:2700*(o.br||1),t+.05);lp.frequency.linearRampToValueAtTime(o.harmon?2600:1900*(o.br||1),t+dur);
  const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=o.harmon?1800:1300;pk.Q.value=o.harmon?6:1;pk.gain.value=o.harmon?14:6;
  let node=x.connect(lp).connect(pk);if(o.harmon){const hp=a.createBiquadFilter();hp.type="highpass";hp.frequency.value=900;node.connect(hp);node=hp;}
  const g=a.createGain(),v=(o.vol||1)*(o.harmon?.11:.12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.setValueAtTime(v*.9,t+Math.max(.035,dur-.05));g.gain.linearRampToValueAtTime(0,t+dur+.02);
  node.connect(g).connect(bus);[x,l].forEach(z=>{z.start(t);z.stop(t+dur+.05);track(z);});}
function tbn(t,midi,dur,o={}){const a=A(),f=mf(midi),x=a.createOscillator();x.type="sawtooth";x.frequency.setValueAtTime(f*Math.pow(2,(o.slide||-.3)/12),t);x.frequency.linearRampToValueAtTime(f,t+(o.slide?o.glide||.22:.05));
  if(o.fall){x.frequency.setValueAtTime(f,t+dur*.5);x.frequency.linearRampToValueAtTime(f*Math.pow(2,o.fall/12),t+dur);}
  const lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=2;lp.frequency.setValueAtTime(300,t);lp.frequency.linearRampToValueAtTime(1500*(o.br||1),t+.06);lp.frequency.linearRampToValueAtTime(1000*(o.br||1),t+dur);
  const g=a.createGain(),v=(o.vol||1)*.13;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.setValueAtTime(v*.9,t+Math.max(.045,dur-.05));g.gain.linearRampToValueAtTime(0,t+dur+.02);x.connect(lp).connect(g).connect(bus);x.start(t);x.stop(t+dur+.05);track(x);}
function clr(t,midi,dur,o={}){const a=A(),f=mf(midi),x=a.createOscillator();x.type="square";x.frequency.setValueAtTime(f*Math.pow(2,-.3/12),t);x.frequency.linearRampToValueAtTime(f,t+.04);
  const l=a.createOscillator(),lg=a.createGain();l.frequency.value=5.8;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(dur>.4?12:0,t+dur);l.connect(lg).connect(x.detune);
  const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=2400;lp.Q.value=.8;const g=a.createGain(),v=(o.vol||1)*.055;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.setValueAtTime(v,t+Math.max(.035,dur-.04));g.gain.linearRampToValueAtTime(0,t+dur+.02);
  x.connect(lp).connect(g).connect(bus);[x,l].forEach(z=>{z.start(t);z.stop(t+dur+.05);track(z);});}
function tuba(t,midi,dur,v=1){const a=A(),f=mf(midi),x=a.createOscillator(),s=a.createOscillator();x.type="sawtooth";s.type="sine";x.frequency.value=f;s.frequency.value=f;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.setValueAtTime(200,t);lp.frequency.linearRampToValueAtTime(600,t+.04);lp.frequency.linearRampToValueAtTime(350,t+dur);
  const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2*v,t+.03);g.gain.linearRampToValueAtTime(.12*v,t+dur*.8);g.gain.linearRampToValueAtTime(0,t+dur);x.connect(lp).connect(g);const sg=a.createGain();sg.gain.value=.5;s.connect(sg).connect(g);g.connect(bus);[x,s].forEach(z=>{z.start(t);z.stop(t+dur+.03);track(z);});}
/* 拟声唱：辅音 + 元音 */
function scatNote(t,midi,dur,vow){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=vow==="o"?1200:2400;f.Q.value=2;const g=a.createGain();g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.025);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+.03);track(n);
  voice(t+.012,midi,Math.max(.09,dur),{from:-.6,glide:.04,vibDepth:dur>.4?18:0,vowel:vow,vol:.75});}

/* ================= 节奏组 ================= */
const SWR=2/3;
function ep(beat,k,r=SWR){return Math.floor(k/2)*beat+(k%2?beat*r:0);}  // 第 k 个八分音符（摇摆）
function rideBar(tb,beat,o={}){const v=o.v||1,r=o.straight?.5:(o.r||SWR);if(o.straight){for(let k=0;k<8;k++)ride(tb+k*beat/2,v*(k%2?.55:.8));}
  else{for(let q=0;q<4;q++)ride(tb+q*beat,v*(q%2?1:.78));[1,3].forEach(q=>ride(tb+q*beat+beat*r,v*.5));}
  chick(tb+beat,o.hv||.8);chick(tb+3*beat,o.hv||.8);if(o.feather)for(let q=0;q<4;q++)kick(tb+q*beat,.12);}
function brushBar(tb,beat,v=1){for(let q=0;q<4;q++){swish(tb+q*beat,beat*.95,v);if(q%2)snare(tb+q*beat,.55*v,true);}chick(tb+beat,.5);chick(tb+3*beat,.5);}
/* 行走贝斯：根音—经过—经过—半音进入下一个根音 */
function walk(seq){const out=[];let prev=40;const OPT=[[2,4],[1,2],[4,5],[4,2],[-1,-3],[2,1],[-2,-1]];
  seq.forEach((s,i)=>{let r=near(s.c.r,prev);if(r<33)r+=12;if(r>48)r-=12;const nx=seq[(i+1)%seq.length].c;let nr=near(nx.r,r);if(nr<33)nr+=12;if(nr>49)nr-=12;
    if(s.b===2){const app=nr===r?r+7>50?r-5:r+7:nr+(nr>r?-1:1);out.push(r,app);prev=r;return;}
    if(s.b===1){out.push(r);prev=r;return;}
    const app=nr===r?r+(RNG()<.5?1:-1):nr+(nr>r?-1:1);let best=null,bs=1e9;
    OPT.forEach(([x,y],j)=>{const b2=deg(s.c,r,x),b3=deg(s.c,r,y);if(b2===r||b3===b2||b3===app||b2<31||b3<31||b2>55||b3>55)return;const sc=Math.abs(b3-app)+Math.abs(b2-(r+app)/2)*.3+(RNG()*1.4)+j*.05;if(sc<bs){bs=sc;best=[b2,b3];}});
    best=best||[r+7,r+5];out.push(r,best[0],best[1],app);for(let k=4;k<s.b;k++)out.push(deg(s.c,r,k-2));prev=r;});
  return out;}
/* seq：[{c,b}] → 时间轴；按拍铺贝斯、钢琴、鼓 */
function rhythm(t,beat,seq,o={}){let x=0;const lines=o.bass==="two"?null:walk(seq);const vs=voiceLead(seq.map(s=>s.c),o.lo||51);let bi=0,beatsTotal=seq.reduce((s,q)=>s+q.b,0);
  if(o.drums!==false)for(let b=0;b<beatsTotal;b+=4){if(o.brush)brushBar(t+b*beat,beat,o.dv||1);else rideBar(t+b*beat,beat,{v:o.dv||1,r:o.r,straight:o.straight,feather:!o.straight});}
  seq.forEach((s,i)=>{const tb=t+x*beat;
    if(o.bass==="two"){const r=near(s.c.r,40)<36?near(s.c.r,40)+12:near(s.c.r,40);ub(tb,r,beat*1.9,o.bv||1);if(s.b>=4)ub(tb+2*beat,r+(RNG()<.5?7:-5),beat*1.9,o.bv||1);}
    else if(o.bass!==false){for(let k=0;k<s.b;k++){const off=o.straight?0:(k%2&&RNG()<.15?beat*SWR:0);ub(tb+k*beat,lines[bi+k],beat*.92,(o.bv||1)*(k===0?1.08:.96));if(off)ub(tb+k*beat+off,lines[bi+k],beat*.25,.4);}}
    bi+=s.b;
    if(o.comp!==false){const v=vs[i],cv=o.cv||.8;let pats=s.b>=4?[[0,3],[3,6],[1,4],[2,5],[0,5],[3],[0,4,7]]:[[0],[1],[3]];if(o.sparse)pats=s.b>=4?[[0],[3],[5]]:[[0]];const P=o.charleston?(s.b>=4?[0,3]:[0]):pick(pats);
      P.forEach(k=>{if(k/2>=s.b)return;const tt=tb+(o.straight?k*beat/2:ep(beat,k,o.r||SWR));chord(tt,v,k%2?beat*.45:beat*.8,cv,.006);});}
    x+=s.b;});
  return beatsTotal*beat;}
const SEQ=(names,b=4)=>names.map(n=>Array.isArray(n)?{c:CH(n[0]),b:n[1]}:{c:CH(n),b});

/* ================= 示例 ================= */
const DEMOS={};
/* 01 平直与摇摆：原创旋律 */
const MEL=[[64,67,69,67,64,62,60,null],[69,72,76,74,72,69,67,null],[65,69,72,71,69,65,64,62],[65,64,62,59,67,0,0,null],[67,71,74,72,71,67,64,62],[64,69,72,76,74,72,69,67],[65,69,72,74,72,69,65,64],[62,0,0,null,71,0,72,0]];
function playSlots(t,beat,bars,fn,r){const ev=[];bars.forEach((bar,i)=>bar.forEach((m,k)=>{const at=i*8+k;if(m===0){if(ev.length)ev[ev.length-1].e=at+1;return;}if(m==null){return;}ev.push({s:at,e:at+1,m});}));
  const pos=g=>t+Math.floor(g/8)*4*beat+ep(beat,g%8,r);ev.forEach(e=>{const t0=pos(e.s),t1=pos(e.e);fn(t0,e.m,Math.max(.08,(t1-t0)*.9),e);});}
function swingDemo(t,straight){RNG=seeded(7);const beat=bt(140),seq=SEQ(["Cmaj7","Am7","Dm7","G7","Cmaj7","Am7","Dm7","G7"]);rhythm(t,beat,seq,{straight,cv:.6,charleston:true});
  playSlots(t,beat,MEL,(tt,m,d,e)=>sax(tt,m,d,{vol:e.s%2?.82:1}),straight?.5:SWR);const e=t+8*4*beat;chord(e,[52,55,59,62],2.4,.8);ub(e,36,2.4);ride(e,.8);sax(e,72,2.2,{vib:22});return 8*4*beat+2.6;}
DEMOS.straight=t=>swingDemo(t,true);DEMOS.swing=t=>swingDemo(t,false);
/* 02 两拍感与行走 */
const WSEQ=["Cmaj7","A7","Dm7","G7","Em7","A7","Dm7","G7"];
DEMOS.two=t=>{RNG=seeded(11);const beat=bt(132);rhythm(t,beat,SEQ(WSEQ),{bass:"two",dv:.75,sparse:true,cv:.7});const e=t+32*beat;chord(e,[52,55,59,62],2,.7);ub(e,36,2);return 32*beat+2.2;};
DEMOS.four=t=>{RNG=seeded(11);const beat=bt(132);rhythm(t,beat,SEQ(WSEQ),{dv:1,cv:.75});const e=t+32*beat;chord(e,[52,55,59,62],2,.7);ub(e,36,2);ride(e,.8);return 32*beat+2.2;};
/* 03 新奥尔良：公有领域旋律《When the Saints Go Marching In》 */
const SAINTS=[[1,60,1],[2,64,1],[3,65,1],[4,67,4],[9,60,1],[10,64,1],[11,65,1],[12,67,4],[17,60,1],[18,64,1],[19,65,1],[20,67,2],[22,64,2],[24,60,2],[26,64,2],[28,62,4],
  [33,64,1],[34,64,1],[35,62,1],[36,60,3],[39,60,1],[40,64,2],[42,67,1],[43,67,1],[44,65,4],[49,64,1],[50,65,1],[51,67,2],[53,64,2],[55,60,1],[56,62,2],[58,60,4]];
const SCH=["C","C","C","C","C","C","G7","G7","C","C7","F","F","C","G7","C","C"];
DEMOS.nola=t=>{RNG=seeded(3);const beat=bt(104),bars=16;
  for(let i=0;i<bars;i++){const tb=t+i*4*beat,c=CH(SCH[i]),tn=tonesOf(c);const r=near(c.r,38);
    tuba(tb,r,beat*.9);tuba(tb+2*beat,r+(i%2?7:-5),beat*.9);for(let q=0;q<4;q++){strum(tb+q*beat,place(tn,55,68).slice(0,4),"bj",{vol:q%2?1:.8,spread:.008,mute:beat*.35});kick(tb+q*beat,q%2?.3:.5);}
    snare(tb+beat,.35);snare(tb+3*beat,.35);snare(tb+3*beat+beat*SWR,.18);
    // 单簧管：高处的琶音装饰
    const arp=place(tn.concat([pcOf(c.r+2)]),74,88);for(let k=0;k<8;k++){if(RNG()<.18)continue;const m=arp[(k*(i%2?3:2)+i)%arp.length];clr(tb+ep(beat,k),m,beat*.42,{vol:.8});}
    // 长号：滑音推根音
    tbn(tb+beat*.0,near(c.r,46),beat*1.6,{slide:-5,glide:.25,vol:.85});tbn(tb+2*beat+beat*SWR,near(tn[1],50),beat*1.1,{vol:.75,fall:i%4===3?-3:0});}
  SAINTS.forEach(([b,m,d])=>tpt(t+b*beat,m+5,d*beat*.92,{vol:1.05,br:1.1}));
  const e=t+bars*4*beat;tpt(e,72,2.4,{vol:1});clr(e,84,2.4);tbn(e,55,2.4,{slide:-7,glide:.4});tuba(e,36,2.4);strum(e,[55,60,64,67],"bj",{vol:1});crash(e,.5);return bars*4*beat+2.6;};
/* 04 ii–V–I 三种颜色 */
function iiVI(t,voices,bass,o={}){const beat=bt(84);voices.forEach((v,i)=>{const tb=t+i*4*beat,len=i===2?8:4;chord(tb,v,len*beat*.95,o.v||.9,o.roll||.018);if(i<2||o.ext)chord(tb+2.5*beat,v,(i===2?5.5:1.5)*beat*.95,(o.v||.9)*.55,.01);ub(tb,bass[i],len*beat*.9,1.05);
    if(o.ext){for(let b=0;b<len;b+=4)brushBar(tb+b*beat,beat,.6);}});return 16*beat+1.5;}
DEMOS.triad=t=>iiVI(t,[[62,65,69],[62,67,71],[60,64,67]],[38,31,36]);
DEMOS.sev=t=>iiVI(t,[[60,65,69,74],[59,65,67,71],[59,64,67,72]],[38,31,36]);
DEMOS.ext=t=>iiVI(t,[[65,69,72,76],[65,69,71,76],[64,67,71,74]],[38,31,36],{ext:true,v:.8});
function triSub(t,sub){const beat=bt(96),V=[[65,69,72,76],sub?[65,68,71,75]:[65,69,71,76],[64,67,71,74]],B=[38,sub?37:31,36];
  for(let rep=0;rep<2;rep++){const t0=t+rep*16*beat;V.forEach((v,i)=>{const tb=t0+i*4*beat,len=i===2?8:4;chord(tb,v,len*beat*.9,.85,.012);chord(tb+2.5*beat,v,1.2*beat,.45,.006);ub(tb,B[i],beat*1.9,1.1);ub(tb+2*beat,i===2?43:B[i]+7,beat*1.9,.9);for(let b=0;b<len;b+=4)rideBar(tb+b*beat,beat,{v:.6});});
    tpt(t0+2*4*beat+beat*.0,76,beat*3,{vol:.6,harmon:true});}
  return 32*beat+1.5;}
DEMOS.tri0=t=>triSub(t,false);DEMOS.tri1=t=>triSub(t,true);
/* 05 大乐队：F 调布鲁斯，原创 riff */
const BBS=["F7","Bb7","F7","F7","Bb7","Bb7","F7","D7","Gm7","C7","F7","C7"];
function section(c,lead,n=4){const tn=tonesOf(c).concat([pcOf(c.r+2)]),out=[lead];let m=lead-1;while(out.length<n&&m>lead-14){if(tn.includes(pcOf(m))&&lead-m>=2&&(out.length===1||out[out.length-1]-m>=2))out.push(m);m--;}return out;}
DEMOS.bigband=t=>{RNG=seeded(21);const beat=bt(152),seq=SEQ(BBS);rhythm(t,beat,seq,{cv:.55,sparse:true,lo:62,dv:1.1});
  seq.forEach((s,i)=>{const tb=t+i*4*beat;for(let q=0;q<4;q++)strum(tb+q*beat,place(tonesOf(s.c),50,62).slice(0,3),"gt",{vol:.55,spread:.004,mute:beat*.3});});
  const RIFF=[[0,72,1],[1,72,1],[3,70,1],[4,68,1],[5,65,2]];
  for(let i=0;i<8;i+=2){const tb=t+i*4*beat;RIFF.forEach(([k,m,d])=>{const c=seq[i].c;section(c,m).forEach((mm,j)=>sax(tb+ep(beat,k),mm,d*beat*.45+(d>1?beat*.3:0),{vol:j?.55:.75,vib:8,f1:j===3?400:520}));});
    const t2=tb+4*beat,c2=seq[i+1].c,vb=voiceLead([c2],66)[0],vt=voiceLead([c2],53)[0];
    [[1,.32],[2,.5,true]].forEach(([k,d,f])=>{const tt=t2+ep(beat,k);vb.forEach((m,j)=>tpt(tt,m,beat*d,{vol:.55,fall:f&&j===vb.length-1?-4:0}));vt.slice(0,3).forEach(m=>tbn(tt,m,beat*d,{vol:.6}));});}
  for(let i=8;i<12;i++){const tb=t+i*4*beat,c=seq[i].c,vb=voiceLead([c],67)[0],vt=voiceLead([c],52)[0],sx=voiceLead([c],58)[0];
    const HITS=i<11?[[0,.6],[3,.35],[5,1.2]]:[[0,.6],[3,.35],[4,2.4]];HITS.forEach(([k,d])=>{const tt=tb+ep(beat,k);vb.forEach(m=>tpt(tt,m+(i===11&&k===4?0:0),beat*d,{vol:.6}));vt.slice(0,3).forEach(m=>tbn(tt,m,beat*d,{vol:.65}));sx.forEach(m=>sax(tt,m,beat*d,{vol:.5,vib:6}));});if(i===8)crash(tb,.6);}
  const e=t+48*beat;crash(e,.8);kick(e,1);[60,65,69,72,75].forEach(m=>tpt(e,m+5,2.6,{vol:.5,fall:0}));[53,57,63].forEach(m=>tbn(e,m,2.6,{vol:.6}));[57,60,63,65].forEach(m=>sax(e,m,2.6,{vol:.45}));ub(e,29,2.6);return 48*beat+2.8;};
/* 06 比波普：按比波普音阶生成的原创旋律 */
function bebopScale(c){const s=scaleOf(c).slice();if(c.q==="7")s.push(pcOf(c.r+11));else if(c.q==="m7")s.push(pcOf(c.r+4));else s.push(pcOf(c.r+8));return s;}
function stepFrom(m,set,dir){let x=m+dir;while(!set.includes(pcOf(x)))x+=dir;return x;}
function bopLine(seq,start=70){let p=start;const out=[];seq.forEach((s,i)=>{const c=s.c,tn=tonesOf(c),bs=bebopScale(c);
    const cand=[];for(let m=p-4;m<=p+4;m++)if(tn.includes(pcOf(m))&&m!==p)cand.push(m);cand.sort((a,b)=>Math.abs(a-p)-Math.abs(b-p));let tg=cand[0]!=null?cand[0]:p;
    const mode=tg>79?"down":tg<62?"up":(RNG()<.55?"down":"up");let seqn=[tg];
    if(mode==="down"){let x=tg;for(let k=0;k<3;k++){x=stepFrom(x,bs,-1);seqn.push(x);}}else{let x=tg;for(let k=0;k<3;k++){x=stepFrom(x,tn,1);seqn.push(x);}}
    const nx=seq[i+1];if(nx&&RNG()<.38){const ntn=tonesOf(nx.c);let nt=seqn[1];while(!ntn.includes(pcOf(nt)))nt--;seqn[2]=nt+1;seqn[3]=nt-1;}
    seqn.forEach(m=>out.push(m));p=seqn[3];});return out;}
const BOP=["Bb6","G7","Cm7","F7","Dm7","G7","Cm7","F7","Fm7","Bb7","Eb7","Ab7","Dm7","G7","Cm7","F7"];
DEMOS.bebop=t=>{RNG=seeded(1945);const beat=bt(232),seq=SEQ(BOP,2),line=bopLine(seq,74),r=.6;
  RNG=seeded(52);const L=2*16*beat;for(let rep=0;rep<2;rep++){const t0=t+rep*L;rhythm(t0,beat,seq,{r,cv:.6,dv:.9});
    for(let k=0;k<line.length;k++){const tt=t0+ep(beat,k,r);if(rep===1&&k>=line.length-3)continue;if(k%16===15&&RNG()<.5)continue;const acc=k%2?.75:1;sax(tt,line[k],beat*.46,{vol:acc*.9,bright:1.2,vib:0,scoop:-.2,f1:620});tpt(tt,line[k],beat*.46,{vol:acc*.65,from:-.2});}
    for(let b=0;b<32;b++){if(RNG()<.16)snare(t0+b*beat+beat*r,.35);if(RNG()<.07)kick(t0+b*beat+(RNG()<.5?beat*r:0),.9);}}
  const e=t+2*L-beat*1.5;sax(e,77,2.2,{vib:24});tpt(e,77,2.2,{vol:.7});const e2=e+beat*1.5;chord(e2,[62,67,69,74],2,.8);ub(e2,34,2);crash(e2,.5);kick(e2,.9);return 2*L+2.4;};
/* 07 调式与自由 */
DEMOS.modal=t=>{RNG=seeded(59);const beat=bt(138);const plan=[..."DDDDDDDD","EEEE","DDDD"].map(x=>x==="D"?"Dm7":"Ebm7");const seq=SEQ(plan);
  rhythm(t,beat,seq,{comp:false,dv:.85});const Q={Dm7:[[57,62,67,72],[59,64,69,74]],Ebm7:[[58,63,68,73],[60,65,70,75]]};
  plan.forEach((n,i)=>{const tb=t+i*4*beat,[a,b]=Q[n];if(i%2===0){chord(tb+ep(beat,3),a,beat*.5,.65,.004);chord(tb+ep(beat,4),b,beat*1.6,.6,.004);}else if(RNG()<.6)chord(tb+ep(beat,6),a,beat*1,.5,.004);});
  const TP=[[4,[[0,69,2],[2.67,67,.33],[3,65,1]]],[6,[[0,62,3]]],[8,[[1,72,.67],[1.67,71,.33],[2,69,1],[3,67,1.5]]],[10,[[.67,64,.33],[1,62,2]]],[12,[[0,65,1],[1,67,1],[2,69,2.5]]],[14,[[0,69,1.5],[2,67,.67],[2.67,65,.33],[3,64,1]]],[15,[[2,62,2]]]];
  TP.forEach(([bar,ns])=>ns.forEach(([b,m,d])=>tpt(t+(bar*4+b)*beat,m+(bar>=8&&bar<12?1:0),d*beat*.95,{harmon:true,vol:.9,fall:d>2?-1:0})));
  const e=t+64*beat;chord(e,[57,62,67,72,76],3,.7,.03);ub(e,38,3);ride(e,.7);return 64*beat+3.2;};
DEMOS.free=t=>{RNG=Math.random;const T=13;for(let x=0;x<T;){const d=.08+RNG()*.4;const m=62+Math.floor(RNG()*24);sax(t+x,m,d,{vol:.9,drive:RNG()<.3?4:0,fall:RNG()<.2?-5:0,scoop:RNG()<.3?-3:-.4,bright:1.3,vib:RNG()<.2?60:0});x+=d+(RNG()<.15?RNG()*.8:0);}
  for(let x=.3;x<T;x+=.6+RNG()*1.3){const lo=40+Math.floor(RNG()*36);const cl=[];for(let k=0;k<3+Math.floor(RNG()*4);k++)cl.push(lo+k*(1+Math.floor(RNG()*2)));chord(t+x,cl,.2+RNG()*.6,.7);}
  for(let x=0;x<T;x+=.15+RNG()*.5)ub(t+x,31+Math.floor(RNG()*22),.2,.9);
  for(let x=0;x<T;x+=.07+RNG()*.25){const r=RNG();if(r<.3)snare(t+x,.2+RNG()*.4);else if(r<.45)tom(t+x,90+RNG()*120,.4);else if(r<.55)kick(t+x,.6);else ride(t+x,.3+RNG()*.4);}
  [0,4.5,9].forEach(x=>crash(t+x+RNG(),.4));return T+1.2;};
/* 08 巴萨诺瓦与融合 */
DEMOS.bossa=t=>{RNG=seeded(64);const beat=bt(136),plan=["Fmaj7","Fmaj7","G7","G7","Gm7","C7","Fmaj7","C7"],seq=SEQ(plan),V=voiceLead(seq.map(s=>s.c),55);
  plan.forEach((n,i)=>{const tb=t+i*4*beat,c=CH(n),r=near(c.r,41)<36?near(c.r,41)+12:near(c.r,41),P=i%2?[1,3,6]:[0,2,5];
    pluck(tb,r,"ny",{vol:1,mute:beat*1.4});pluck(tb+1.5*beat,r+7>52?r-5:r+7,"ny",{vol:.7,mute:beat*.45});pluck(tb+2*beat,r+7>52?r-5:r+7,"ny",{vol:.9,mute:beat*1.4});
    P.forEach(k=>strum(tb+k*beat/2,V[i],"ny",{vol:.55,spread:.007,mute:beat*.42}));
    for(let k=0;k<8;k++)swish(tb+k*beat/2,beat*.45,.5);[[0,3,6],[2,4]][i%2].forEach(k=>cross(tb+k*beat/2,.8));chick(tb+beat,.3);chick(tb+3*beat,.3);});
  const ML=[[0,76,1.5],[1.5,74,.5],[2,72,2],[4.5,69,.5],[5,72,1],[6,74,2],[8,74,1.5],[9.5,71,.5],[10,69,2],[12.5,71,.5],[13,74,1],[14,77,2],[16,77,1.5],[17.5,74,.5],[18,70,2],[20.5,72,.5],[21,70,1],[22,67,2],[24,69,3],[27,72,1],[28,70,1.5],[29.5,67,.5],[30,64,2]];
  ML.forEach(([b,m,d])=>sax(t+b*beat,m-12,d*beat*.92,{vol:.75,air:2.2,bright:.75,vib:14,scoop:-.3}));
  const e=t+32*beat;pluck(e,41,"ny",{vol:1,dur:3});strum(e,[52,57,60,64],"ny",{vol:.7,spread:.03});sax(e,65-12,2.6,{vol:.7,air:2.2,bright:.75});return 32*beat+3;};
DEMOS.fusion=t=>{RNG=seeded(73);const beat=bt(100),s=beat/4,plan=["Ebm7","Ebm7","Ab7","Ab7","Ebm7","Ebm7","Ab7","Ab7"];
  const BL=[[0,0,2],[3,0,1],[4,12,1],[6,10,1],[7,0,1],[10,7,1],[11,10,1],[12,0,1],[14,12,1],[15,13,1]];
  plan.forEach((n,i)=>{const tb=t+i*4*beat,c=CH(n),r=near(c.r,39),V=voiceLead([c],58)[0];
    for(let k=0;k<16;k++)hat(tb+k*s,k%2?.45:.85);[0,7,10].forEach(k=>kick(tb+k*s,k?.75:1.1));[4,12].forEach(k=>snare(tb+k*s,.85));[3,9,15].forEach(k=>RNG()<.6&&snare(tb+k*s,.13));
    BL.forEach(([k,x,d])=>pluck(tb+k*s,r+x,"bass",{vol:k?1:1.15,mute:s*d*.9}));
    [[0,.9],[3,.35],[6,.35],[10,.6],[14,.3]].forEach(([k,d])=>V.forEach(m=>rho(tb+k*s,m,beat*d,.7)));if(i%2===1)crash(tb,.25);});
  const ML=[[8,75,.5],[8.5,73,.5],[9,70,1],[10.5,73,.5],[11,75,1.5],[14,78,.5],[14.5,77,.5],[15,75,1],[24,82,.5],[24.5,80,.5],[25,78,.5],[25.5,75,.5],[26,73,1],[27,75,2],[30,70,1],[31,73,1]];
  ML.forEach(([b,m,d])=>{const a=A(),x=a.createOscillator(),y=a.createOscillator(),f=mf(m),lp=a.createBiquadFilter(),g=a.createGain(),tt=t+b*beat,dd=d*beat*.95;x.type="sawtooth";y.type="square";x.frequency.value=f;y.frequency.value=f*1.003;lp.type="lowpass";lp.Q.value=4;lp.frequency.setValueAtTime(900,tt);lp.frequency.linearRampToValueAtTime(3000,tt+.05);lp.frequency.linearRampToValueAtTime(1400,tt+dd);g.gain.setValueAtTime(0,tt);g.gain.linearRampToValueAtTime(.05,tt+.01);g.gain.setValueAtTime(.045,tt+dd-.03);g.gain.linearRampToValueAtTime(0,tt+dd);x.connect(lp);y.connect(lp);lp.connect(g).connect(bus);[x,y].forEach(z=>{z.start(tt);z.stop(tt+dd+.02);track(z);});});
  const e=t+32*beat;voiceLead([CH("Ebm7")],58)[0].forEach(m=>rho(e,m,2.6,.8));pluck(e,39,"bass",{vol:1.1,dur:2.5});crash(e,.6);kick(e,1.1);return 32*beat+2.8;};
/* 09 即兴生成器 */
function improvise(seq,beat,o={}){const ev=[],total=seq.reduce((s,q)=>s+q.b,0),chAt=[];let x=0;seq.forEach(s=>{for(let k=0;k<s.b;k++)chAt.push(s.c);x+=s.b;});
  const lo=o.lo||57,hi=o.hi||81;let p=o.start||67,b=o.rest0||0,last=null;
  while(b<total-1.5){const plen=1.5+Math.floor(RNG()*7)/2;let dir=RNG()<.5?1:-1;const pe=Math.min(total-1,b+plen);const motif=[];
    const reuse=last&&RNG()<.3;let tpl=reuse?last.map(z=>z.slice()):null,shift=reuse?pick([2,-2,3,-3,5]):0;
    if(tpl){tpl.forEach(([db,dm,dd])=>{const bb=b+db;if(bb>=pe)return;ev.push({b:bb,m:Math.max(lo,Math.min(hi,dm+shift)),d:dd});});b=b+tpl[tpl.length-1][0]+tpl[tpl.length-1][2];}
    else{while(b<pe){const c=chAt[Math.floor(b)],tn=tonesOf(c),sc=scaleOf(c),onBeat=Math.abs(b-Math.round(b))<.01;
      const r=RNG();let d=r<.62?SWR:r<.86?1:(1/3);if(!onBeat)d=1-(b%1);
      if(onBeat&&RNG()<.75){let m=p;for(let k=0;k<6&&!tn.includes(pcOf(m));k++)m+=dir;p=m;}else{let m=p+dir;for(let k=0;k<3&&!sc.includes(pcOf(m));k++)m+=dir;if(RNG()<.12)m=p+dir;p=m;}
      if(p>hi){p-=RNG()<.5?12:4;dir=-1;}if(p<lo){p+=RNG()<.5?12:4;dir=1;}if(RNG()<.15)dir=-dir;
      motif.push([b-(motif.length?motif[0][3]:b),p,d*.95,b]);ev.push({b,m:p,d:d*.95});
      if(d===(1/3)){for(let z=1;z<3;z++){p+=dir*2;ev.push({b:b+z/3,m:p,d:.3});}b+=1;}else b+=d;}
      last=motif.length>2?motif.map(([db,m,d])=>[db,m,d]):last;}
    b+=pick([.5,1,1,1.5,2]);if(RNG()<.3)b=Math.ceil(b)+(RNG()<.5?SWR:0);}
  const c=chAt[total-1],tn=tonesOf(c);let m=p;while(!tn.includes(pcOf(m)))m--;ev.push({b:total-1.33,m:m+2,d:.3},{b:total-1,m,d:1.9,end:true});return ev;}
const IMP=["Gm7","C7","Fmaj7","D7","Gm7","C7","Fmaj7","Fmaj7"];
DEMOS.improv=(t,btn)=>{RNG=Math.random;const beat=bt(160),seq=SEQ(IMP.concat(IMP)),st=stripNear(btn);lightStrip(st,t,4*beat,16);rhythm(t,beat,seq,{cv:.6,dv:.9});
  improvise(seq,beat,{start:65+Math.floor(RNG()*8)}).forEach(e=>sax(t+e.b*beat,e.m,e.d*beat*(e.end?1:.95),{vol:e.end?.9:.85+RNG()*.25,vib:e.end?24:14,fall:e.end&&RNG()<.4?-2:0}));
  const e=t+64*beat;chord(e,[52,57,60,64],2.2,.7);ub(e,29,2.2);ride(e,.8);return 64*beat+2.4;};
DEMOS.scat=(t,btn)=>{RNG=Math.random;const beat=bt(150),seq=SEQ(IMP),st=stripNear(btn);lightStrip(st,t,4*beat,8);rhythm(t,beat,seq,{cv:.55,brush:true,dv:.9,bv:1.05});
  let i=0;improvise(seq,beat,{lo:55,hi:72,start:62,rest0:.5}).forEach(e=>{scatNote(t+e.b*beat,e.m,e.d*beat*.9,e.end?"a":(i++%3===2?"a":"o"));});return 32*beat+2.4;};
function drumSolo(t,beat,bars){for(let i=0;i<bars;i++){const tb=t+i*4*beat;for(let q=0;q<4;q++){const tt=tb+q*beat,r=RNG();
    if(r<.3){for(let z=0;z<3;z++)snare(tt+z*beat/3,z===0?.9:.45);}else if(r<.5){[180,140,100].forEach((f,z)=>tom(tt+z*beat/3,f,.7));}else if(r<.65){kick(tt,1);crash(tt,.35);}else if(r<.85){snare(tt,.8);snare(tt+beat*SWR,.5);kick(tt+beat*SWR,.6);}else{tom(tt,110,.8);kick(tt+beat*SWR,.8);}
    if(q%2)chick(tt,.6);}}}
DEMOS.trade=(t,btn)=>{RNG=Math.random;const beat=bt(176),st=stripNear(btn);lightStrip(st,t,4*beat,16);const half=SEQ(IMP.slice(0,4));
  [0,2].forEach(seg=>{const t0=t+seg*16*beat;rhythm(t0,beat,half,{cv:.6});improvise(half,beat,{start:66}).forEach(e=>seg===0?sax(t0+e.b*beat,e.m,e.d*beat,{vol:.95,vib:14}):tpt(t0+e.b*beat,e.m+5,e.d*beat,{vol:1}));});
  [1,3].forEach(seg=>drumSolo(t+seg*16*beat,beat,4));const e=t+64*beat;chord(e,[52,57,60,64],2,.75);ub(e,29,2);crash(e,.6);kick(e,1);sax(e,69,2,{vol:.7});tpt(e,72,2,{vol:.7});return 64*beat+2.4;};

/* ================= 调度 ================= */
const GAIN={straight:1.15,swing:1.1,two:1.8,four:1.75,nola:.7,triad:1.8,sev:1.75,ext:1.8,tri0:1.8,tri1:1.8,bigband:1.2,bebop:.85,modal:1.9,free:.9,bossa:1.3,fusion:.75,improv:1.25,scat:1.0,trade:1.2};
const ROOM={nola:[1.8,.3],modal:[2.2,.35],bossa:[1.6,.25],ext:[2.2,.35],triad:[2,.3],sev:[2,.3],tri0:[2,.3],tri1:[2,.3],free:[2.4,.4],bigband:[1.8,.3]};
const fab=document.getElementById("stopAll");
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");}
function runDemo(name,btn){newBus();bus.gain.value=GAIN[name]||1;const rm=ROOM[name]||[1.4,.2];addRoom(rm[0],rm[1]);setActive(btn);const t=A().currentTime+.15,d=DEMOS[name](t,btn)||3;later(()=>clearActive(),d+.4);}
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);

/* ================= 推荐曲目：俱乐部火柴盒 ================= */
const SONGS=[
  {side:"A",q:"Louis Armstrong West End Blues 1928",title:"West End Blues",by:"Louis Armstrong & His Hot Five",yr:"1928",style:"新奥尔良 · 芝加哥",
   txt:"开头那段无伴奏的小号华彩，常被看作爵士史上最著名的十几秒。之后是慢慢的布鲁斯，中间还有 Armstrong 的拟声唱。",listen:["开头的华彩里，速度是自由的还是固定的？","找到拟声唱的那一段，对照 Lab 10"]},
  {side:"A",q:"Billie Holiday Strange Fruit 1939",title:"Strange Fruit",by:"Billie Holiday",yr:"1939",style:"爵士歌唱",
   txt:"一首关于美国南方私刑的歌，Holiday 唱得非常克制，几乎没有炫技。它常被称为美国民权运动之前最有力量的抗议歌曲之一。听之前可以先读一读它的背景。",listen:["她的声音在哪里最“轻”？","伴奏为什么这么少？"]},
  {side:"A",q:"Duke Ellington Take the A Train 1941",title:"Take the “A” Train",by:"Duke Ellington Orchestra",yr:"1941",style:"摇摆时代 · 大乐队",
   txt:"Billy Strayhorn 为 Ellington 乐队写的主题曲，名字来自纽约通往哈莱姆的地铁 A 线。一听就能分出萨克斯、小号、长号三个声部。",listen:["主旋律先由哪个声部吹？","找出铜管的“打击”，对照 Lab 06"]},
  {side:"A",q:"Charlie Parker Ko-Ko 1945",title:"Ko-Ko",by:"Charlie Parker",yr:"1945",style:"比波普",
   txt:"比波普的代表作。借用老歌《Cherokee》的和弦，写上全新的旋律，速度快得惊人。Parker 的独奏几乎没有一个多余的音。",listen:["开头和结尾的齐奏，对照 Lab 07","鼓手的拍子在哪里？底鼓在做什么？"]},
  {side:"A",q:"周璇 夜上海",title:"夜上海",by:"周璇",yr:"1947",style:"时代曲",
   txt:"电影《长相思》的插曲，陈歌辛作曲。舞厅乐队式的编配、狐步舞的节奏，唱的是上海的夜生活。和平饭店的老年爵士乐队至今常演奏它。",listen:["伴奏里能听出哪些爵士乐器？","和《Take the “A” Train》比，节奏有什么相同？"]},
  {side:"A",q:"Dave Brubeck Quartet Take Five",title:"Take Five",by:"The Dave Brubeck Quartet",yr:"1959",style:"冷爵士 · 五拍子",
   txt:"萨克斯手 Paul Desmond 写的五拍子名曲，钢琴不停重复一个“一二三 四五”的伴奏型。少有的进入流行排行榜的爵士单曲。",listen:["跟着钢琴数五拍","鼓独奏的时候，钢琴的伴奏型还在吗？"]},
  {side:"B",q:"Miles Davis So What",title:"So What",by:"Miles Davis",yr:"1959",style:"调式爵士",
   txt:"本章开头那张《Kind of Blue》的第一首。贝斯先“提问”，钢琴和管乐用两个音“回答”。之后每段独奏都在 D 多利亚和 E♭ 多利亚之间往返。",listen:["数一圈 32 小节，对照图 7","Miles 的独奏里有多少空白？"]},
  {side:"B",q:"Stan Getz João Gilberto The Girl from Ipanema",title:"The Girl from Ipanema",by:"Stan Getz & João Gilberto",yr:"1964",style:"巴萨诺瓦",
   txt:"Jobim 作曲的巴萨诺瓦名曲，出自专辑《Getz/Gilberto》。尼龙弦吉他、轻轻的人声和 Getz 柔和的萨克斯，让巴萨诺瓦风靡全世界。",listen:["吉他的低音落在哪几拍？对照 Lab 09","萨克斯和人声的音量差不多吗？"]},
  {side:"B",q:"John Coltrane A Love Supreme Part I Acknowledgement",title:"A Love Supreme, Pt. I – Acknowledgement",by:"John Coltrane",yr:"1965",style:"调式 · 精神爵士",
   txt:"四段组曲的第一段。贝斯手 Jimmy Garrison 反复一个四音动机，Coltrane 的萨克斯越来越激烈，最后乐手们低声唱出专辑的名字。",listen:["那个四音动机出现了多少次？","萨克斯在哪里最“满”？"]},
  {side:"B",q:"Herbie Hancock Chameleon",title:"Chameleon",by:"Herbie Hancock",yr:"1973",style:"融合 · 放克",
   txt:"《Head Hunters》的开场曲，十几分钟。一条合成器低音线和放克鼓贯穿始终，之后的很多放克、嘻哈都采样或借用过这种律动。",listen:["低音线是电贝斯还是合成器？","对照 Lab 09 的“融合”和 C1 的放克"]},
  {side:"B",q:"Robert Glasper Experiment Afro Blue Erykah Badu",title:"Afro Blue",by:"Robert Glasper Experiment（feat. Erykah Badu）",yr:"2012",style:"当代爵士 · R&B",
   txt:"出自《Black Radio》。原曲是古巴打击乐手 Mongo Santamaría 1959 年写的三拍子名曲，这里被改成了慢慢摇晃的 R&B 嘻哈律动。",listen:["鼓的手感像嘻哈还是像爵士？","三拍子还在吗？"]},
  {side:"B",q:"Kamasi Washington Truth",title:"Truth",by:"Kamasi Washington",yr:"2017",style:"当代爵士 · 大编制",
   txt:"出自 EP《Harmony of Difference》。前面几首各自不同的旋律，在这首里被叠在一起同时演奏，配上合唱和弦乐，越来越宏大。",listen:["你能同时听出几条旋律？","和 Lab 03 的集体即兴比一比"]}
];
const MC=["#1D3A6B","#8E2B22","#1F5A4A","#7A5A1C","#4A2347","#24505E"];
const ICON="M8 5v14l11-7z";
SONGS.forEach((s,i)=>{
  const el=document.createElement("div");el.className="song";el.style.setProperty("--mc",MC[i%MC.length]);
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
const FILL=c=>`fill:var(--${c})`,STK=c=>`stroke:var(--${c});fill:none`;
function pill(g,x,y,w,t,c){S(g,"rect",{x:x-w/2,y:y-15,width:w,height:30,rx:2,style:c?FILL(c):"",class:c?"":"sv-card"});if(!c)S(g,"rect",{x:x-w/2,y:y-15,width:w,height:30,rx:2,class:"sv-l"});S(g,"text",{x,y:y+5,"text-anchor":"middle",class:c?"sv-on":"sv-t",style:"font-size:12.5px;font-weight:900"},t);}
const NOTE=["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"];
/* 图 1 家谱 */
(()=>{const g=document.getElementById("tree-fig");if(!g)return;const X=[60,172,284,396,508,620];
  const N={blues:[0,70,"布鲁斯（A1）"],rag:[0,150,"拉格泰姆"],brass:[0,230,"铜管乐队"],nola:[1,150,"新奥尔良","red"],swing:[2,150,"摇摆 · 大乐队"],latin:[2,250,"拉丁爵士"],bop:[3,150,"比波普","red"],bossa:[3,250,"巴萨诺瓦"],
    cool:[4,70,"冷爵士"],hard:[4,160,"硬波普"],modal:[4,250,"调式爵士","denim"],free:[5,50,"自由爵士"],fus:[5,125,"融合爵士","red"],now:[5,200,"当代爵士"],soul:[5,275,"灵魂乐 · 放克（C1）"],hh:[5,345,"嘻哈（C2）"]};
  const E=[["blues","nola"],["rag","nola"],["brass","nola"],["nola","swing"],["nola","latin"],["swing","bop"],["latin","bossa"],["bop","cool"],["bop","hard"],["cool","modal"],["hard","modal"],["modal","free"],["modal","fus"],["hard","soul"],["hard","hh"],["hard","now"],["bossa","modal"]];
  const W=k=>N[k][2].length>7?112:96;
  E.forEach(([a,b])=>{const [ca,y1]=N[a],[cb,y2]=N[b];const sx=X[ca]+W(a)/2,ex=X[cb]-W(b)/2,mx=(sx+ex)/2;S(g,"path",{d:`M ${sx} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${ex} ${y2}`,class:"sv-l","stroke-width":1.3,fill:"none",opacity:.7});});
  Object.entries(N).forEach(([k,[c,y,t,col]])=>pill(g,X[c],y,W(k),t,col||null));
  [["1900 前后",0],["1910–20s",1],["1930s",2],["1940s",3],["1950s",4],["1960s 以后",5]].forEach(([t,c])=>S(g,"text",{x:X[c],y:376,"text-anchor":"middle",class:"sv-m",style:"font-family:var(--font-wood);font-size:15px;letter-spacing:.06em"},t));
})();
/* 图 2 平直与摇摆 */
(()=>{const g=document.getElementById("swing-fig");if(!g)return;const x0=150,bw=120;
  [["平直",40,[0,.5]],["摇摆",130,[0,2/3]],["叮叮镲",220,null]].forEach(([n,y,pos])=>{S(g,"text",{x:24,y:y+6,class:"sv-t",style:TB},n);
    for(let b=0;b<4;b++){const bx=x0+b*bw;S(g,"line",{x1:bx,y1:y-26,x2:bx,y2:y+26,class:"sv-l","stroke-width":b?1:2});
      if(n==="摇摆")[1,2].forEach(z=>S(g,"line",{x1:bx+z*bw/3,y1:y-12,x2:bx+z*bw/3,y2:y+12,class:"sv-lline"}));
      if(pos){pos.forEach((p,j)=>{const w=j?bw*(1-p)-8:bw*(pos[1])-8;S(g,"rect",{x:bx+p*bw+2,y:y-10,width:w,height:20,rx:10,style:FILL(j?"denim":"red"),opacity:j?.85:1});});}
      else{S(g,"circle",{cx:bx+12,cy:y,r:9,style:FILL("ink")});if(b%2)S(g,"circle",{cx:bx+bw*2/3+8,cy:y,r:6,style:FILL("mustard")});}}
    S(g,"line",{x1:x0+4*bw,y1:y-26,x2:x0+4*bw,y2:y+26,class:"sv-l","stroke-width":2});});
  [1,2,3,4].forEach(b=>S(g,"text",{x:x0+(b-1)*bw+6,y:278,class:"sv-m",style:"font-family:var(--font-wood);font-size:15px"},`拍 ${b}`));
  S(g,"text",{x:x0+bw*2/3,y:100,"text-anchor":"middle",class:"sv-ts"},"一拍分三份");S(g,"text",{x:x0+bw*1.5,y:186,"text-anchor":"middle",class:"sv-ts"},"叮　　叮-嗒　　叮　　叮-嗒");
})();
/* 图 3 导音 */
(()=>{const g=document.getElementById("guide-fig");if(!g)return;const X=[140,340,540],Y=m=>262-(m-60)*13.5;
  const C=[["Dm7",[[72,"C","7 音"],[65,"F","3 音"]]],["G7",[[71,"B","3 音"],[65,"F","7 音"]]],["Cmaj7",[[71,"B","7 音"],[64,"E","3 音"]]]];
  for(let m=62;m<=73;m++)if([62,64,65,67,69,71,72].includes(m))S(g,"line",{x1:60,y1:Y(m),x2:640,y2:Y(m),class:"sv-lline",opacity:.5});
  [[0,0,1,0,"半音"],[0,1,1,1,"不动"],[1,0,2,0,"不动"],[1,1,2,1,"半音"]].forEach(([a,i,b,j,t])=>{const m1=C[a][1][i][0],m2=C[b][1][j][0];S(g,"path",{d:`M ${X[a]+26} ${Y(m1)} L ${X[b]-26} ${Y(m2)}`,style:STK(t==="半音"?"red":"ink"),"stroke-width":t==="半音"?3:1.6,"stroke-dasharray":t==="半音"?"":"5 4"});
    S(g,"text",{x:(X[a]+X[b])/2,y:(Y(m1)+Y(m2))/2-8,"text-anchor":"middle",class:t==="半音"?"sv-r":"sv-ts",style:t==="半音"?"font-weight:900;font-size:12.5px":""},t);});
  C.forEach(([n,ns],i)=>{S(g,"text",{x:X[i],y:34,"text-anchor":"middle",class:"sv-t",style:"font-family:var(--font-wood);font-size:26px;letter-spacing:.06em"},n);
    ns.forEach(([m,l,r])=>{S(g,"circle",{cx:X[i],cy:Y(m),r:22,style:FILL(r==="3 音"?"denim":"mustard")});S(g,"text",{x:X[i],y:Y(m)+6,"text-anchor":"middle",class:"sv-on",style:"font-size:17px;font-weight:900"},l);S(g,"text",{x:X[i]+30,y:Y(m)+20,class:"sv-ts"},r);});});
})();
/* 键盘 */
function keyboard(g,x0,y0,kw,kh,startPc,nWhite,mark){const W=[0,2,4,5,7,9,11];let pcs=[],x=x0;const s=W.indexOf(startPc);const whites=[];for(let i=0;i<nWhite;i++){const pc=W[(s+i)%7];whites.push([x,pc]);x+=kw;}
  whites.forEach(([x,pc])=>{S(g,"rect",{x,y:y0,width:kw-2,height:kh,rx:3,class:"sv-card"});S(g,"rect",{x,y:y0,width:kw-2,height:kh,rx:3,class:"sv-l"});mark&&mark(x+kw/2-1,y0+kh,pc,false);});
  whites.forEach(([x,pc],i)=>{if(i===whites.length-1)return;const nx=whites[i+1][1];if(pcOf(nx-pc)===2){const bx=x+kw-kw*.3-1;S(g,"rect",{x:bx,y:y0,width:kw*.6,height:kh*.6,rx:2,style:FILL("ink")});mark&&mark(bx+kw*.3,y0+kh*.6,pc+1,true);}});}
/* 图 4 三全音替代 */
(()=>{const g=document.getElementById("tritone-fig");if(!g)return;const G7=[7,11,2,5],D7=[1,5,8,11];const kw=64,x0=116,y0=18,kh=130;const pos={};
  keyboard(g,x0,y0,kw,kh,0,7,(x,y,pc)=>{const p=pcOf(pc);if(!(p in pos))pos[p]=x;});
  [5,11].forEach(pc=>S(g,"rect",{x:pos[pc]-24,y:y0+kh+10,width:48,height:84,rx:24,style:FILL("soft"),opacity:.9}));
  [["G7",G7,"red",186],["D♭7",D7,"denim",226]].forEach(([n,ps,c,y])=>{S(g,"text",{x:24,y:y+6,class:"sv-t",style:"font-family:var(--font-wood);font-size:22px"},n);ps.forEach(pc=>{S(g,"circle",{cx:pos[pc],cy:y,r:15,style:FILL(c)});S(g,"text",{x:pos[pc],y:y+5,"text-anchor":"middle",class:"sv-on",style:"font-size:12px;font-weight:900"},NOTE[pc].replace("C♯","D♭").replace("B","B"));});});
  [5,11].forEach(pc=>S(g,"text",{x:pos[pc],y:y0+kh+108,"text-anchor":"middle",class:"sv-r",style:"font-size:12.5px;font-weight:900"},"共有"));
})();
/* 图 5 大乐队座位 */
(()=>{const g=document.getElementById("band-fig");if(!g)return;const rows=[["小号",4,70,"red"],["长号",4,140,"denim"],["萨克斯",5,215,"mustard"]];
  rows.forEach(([n,k,y,c],ri)=>{S(g,"rect",{x:230-ri*14,y:y-28,width:340+ri*28,height:56,rx:3,class:"sv-card"});S(g,"rect",{x:230-ri*14,y:y-28,width:340+ri*28,height:56,rx:3,class:"sv-lline"});
    const sp=(300+ri*24)/k;for(let i=0;i<k;i++){const cx=250-ri*14+sp*(i+.5);S(g,"circle",{cx,cy:y,r:16,style:FILL(c)});}
    S(g,"text",{x:662,y:y+5,"text-anchor":"end",class:"sv-t",style:"font-size:13px;font-weight:900"},`${n} ×${k}`);});
  [["鼓",120,70],["贝斯",70,130],["吉他",150,150],["钢琴",90,215]].forEach(([n,x,y])=>{S(g,"rect",{x:x-30,y:y-18,width:60,height:36,rx:3,style:FILL("ink")});S(g,"text",{x,y:y+5,"text-anchor":"middle",class:"sv-on",style:"font-size:12.5px;font-weight:900"},n);});
  S(g,"text",{x:110,y:262,"text-anchor":"middle",class:"sv-ts"},"节奏组");S(g,"circle",{cx:430,cy:272,r:9,style:FILL("ink")});S(g,"text",{x:446,y:277,class:"sv-ts"},"队长 / 指挥（常常也弹钢琴）");
  S(g,"text",{x:30,y:24,class:"sv-m",style:"font-family:var(--font-wood);font-size:15px;letter-spacing:.08em"},"BACK");S(g,"text",{x:30,y:292,class:"sv-m",style:"font-family:var(--font-wood);font-size:15px;letter-spacing:.08em"},"FRONT · 观众");
})();
/* 图 6 演出结构 */
(()=>{const g=document.getElementById("form-fig");if(!g)return;const B=[["主题","red",1],["萨克斯","denim",2],["小号","denim",2],["钢琴","denim",1],["交换四小节","mustard",1],["主题","red",1]];const tot=8,W=620,x0=30;let x=x0;const rects=[];
  B.forEach(([n,c,k])=>{const w=W*k/tot;for(let z=0;z<k;z++){S(g,"rect",{x:x+z*w/k+1,y:30,width:w/k-2,height:46,rx:2,style:FILL(c),opacity:z?.75:1});}S(g,"text",{x:x+w/2,y:58,"text-anchor":"middle",class:"sv-on",style:"font-size:13px;font-weight:900"},k>1?`${n} ×${k}`:n);rects.push([x,w]);x+=w;});
  const [sx,sw]=rects[1];S(g,"path",{d:`M ${sx} 78 L ${x0} 128 M ${sx+sw/2} 78 L ${x0+W} 128`,class:"sv-lline"});
  ["A","A","B","A"].forEach((n,i)=>{const bx=x0+i*W/4;S(g,"rect",{x:bx+2,y:130,width:W/4-4,height:40,rx:2,class:"sv-card"});S(g,"rect",{x:bx+2,y:130,width:W/4-4,height:40,rx:2,class:n==="B"?"":"sv-l",style:n==="B"?"stroke:var(--red);fill:none;stroke-width:2.4":""});S(g,"text",{x:bx+W/8,y:157,"text-anchor":"middle",class:n==="B"?"sv-r":"sv-t",style:"font-family:var(--font-wood);font-size:22px"},n);
    for(let k=1;k<8;k++)S(g,"line",{x1:bx+2+k*(W/4-4)/8,y1:164,x2:bx+2+k*(W/4-4)/8,y2:170,class:"sv-l"});});
  S(g,"text",{x:x0,y:196,class:"sv-ts"},"一圈 = 32 小节：A（8）A（8）B 桥（8）A（8）");S(g,"text",{x:x0+W,y:196,"text-anchor":"end",class:"sv-ts"},"萨克斯的第一圈，放大");
})();
/* 图 7 多利亚 */
(()=>{const g=document.getElementById("dorian-fig");if(!g)return;const kw=58,x0=110,y0=14,kh=120;const pos={};
  keyboard(g,x0,y0,kw,kh,2,8,(x,y,pc)=>{const p=pcOf(pc);if(!(p in pos))pos[p]=x;});
  const rows=[["D 多利亚",[2,4,5,7,9,11,0],"denim",170,11],["D 自然小调",[2,4,5,7,9,10,0],"ink",214,10]];
  rows.forEach(([n,ps,c,y,odd])=>{S(g,"text",{x:x0-10,y:y+5,"text-anchor":"end",class:"sv-t",style:"font-size:13px;font-weight:900"},n);ps.forEach(pc=>{const hi=pc===odd,cx=pc===10?pos[11]:pos[pc];S(g,"circle",{cx,cy:y,r:hi?16:13,style:FILL(hi?"red":c)});S(g,"text",{x:cx,y:y+5,"text-anchor":"middle",class:"sv-on",style:"font-size:12px;font-weight:900"},NOTE[pc]);});});
  S(g,"text",{x:x0+8*kw+8,y:196,class:"sv-r",style:"font-size:12.5px;font-weight:900"},"← 只差这一个音");
})();
/* 图 8 两条时间线 */
(()=>{const g=document.getElementById("world-fig");if(!g)return;const X=y=>40+(y-1910)*(600/110),ax=165;
  S(g,"rect",{x:X(1950),y:ax+4,width:X(1980)-X(1950),height:120,style:FILL("soft"),opacity:.8});S(g,"text",{x:(X(1950)+X(1980))/2,y:ax+118,"text-anchor":"middle",class:"sv-m",style:"font-size:11px"},"中断与沉寂");
  S(g,"line",{x1:X(1910),y1:ax,x2:X(2020),y2:ax,class:"sv-l","stroke-width":2});for(let y=1910;y<=2020;y+=10){S(g,"line",{x1:X(y),y1:ax-5,x2:X(y),y2:ax+5,class:"sv-l"});S(g,"text",{x:X(y),y:ax+(y%20?-10:20),"text-anchor":"middle",class:"sv-m",style:"font-family:var(--font-wood);font-size:13px"},String(y));}
  const top=[[1917,"第一张爵士唱片",1],[1928,"West End Blues",2],[1938,"卡内基音乐厅",1],[1945,"Ko-Ko",3],[1959,"Kind of Blue",1],[1964,"Getz/Gilberto",2],[1970,"Bitches Brew",3],[1991,"嘻哈采样爵士",1],[2015,"To Pimp a Butterfly",2]];
  const bot=[[1927,"《毛毛雨》",1],[1934,"Buck Clayton 在上海",2],[1946,"时代曲：《夜上海》",1],[1980,"和平饭店老年爵士乐队",2],[1986,"刘元、崔健乐队",3],[2005,"爵士俱乐部与音乐节",1]];
  top.forEach(([y,t,l])=>{const yy=ax-20-l*34;S(g,"line",{x1:X(y),y1:ax,x2:X(y),y2:yy+6,class:"sv-lline"});S(g,"circle",{cx:X(y),cy:ax,r:4,style:FILL("denim")});S(g,"text",{x:X(y)+(y>2000?-4:4),y:yy,"text-anchor":y>2000?"end":"start",class:"sv-t",style:"font-size:12px;font-weight:700"},t);});
  bot.forEach(([y,t,l])=>{const yy=ax+30+l*28;S(g,"line",{x1:X(y),y1:ax,x2:X(y),y2:yy-12,style:STK("red"),opacity:.6});S(g,"circle",{cx:X(y),cy:ax,r:4,style:FILL("red")});S(g,"text",{x:X(y)+4,y:yy,class:"sv-r",style:"font-size:12px;font-weight:700"},t);});
  S(g,"text",{x:20,y:20,class:"sv-t",style:"font-family:var(--font-wood);font-size:17px;letter-spacing:.08em"},"美国与世界");S(g,"text",{x:20,y:322,class:"sv-r",style:"font-family:var(--font-wood);font-size:17px;letter-spacing:.08em"},"中文世界");
})();
