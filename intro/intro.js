/* ================= Intro：通用小工具 ================= */
function into(node,fn){const keep=bus;bus=node;try{fn();}finally{bus=keep;}}
function organ(t,midi,dur,v=1){const a=A(),f=mf(midi),g=a.createGain();[[1,"sine",.7],[2,"sine",.18],[3,"triangle",.06]].forEach(([h,w,am])=>{const x=a.createOscillator();x.type=w;x.frequency.value=f*h;const xg=a.createGain();xg.gain.value=am;x.connect(xg).connect(g);x.start(t);x.stop(t+dur+.1);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*v,t+.05);g.gain.setValueAtTime(.12*v,t+Math.max(.06,dur-.08));g.gain.linearRampToValueAtTime(0,t+dur);g.connect(bus);}
function sine(t,midi,dur,v=1){const a=A(),x=a.createOscillator();x.type="sine";x.frequency.value=mf(midi);const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2*v,t+.02);g.gain.setValueAtTime(.2*v,t+Math.max(.03,dur-.05));g.gain.linearRampToValueAtTime(0,t+dur);x.connect(g).connect(bus);x.start(t);x.stop(t+dur+.02);track(x);}
const CHD={C:[60,64,67],G:[59,62,67],Am:[60,64,69],F:[60,65,69],Dm:[62,65,69],Em:[59,64,67],Cm:[60,63,67],Fm:[60,65,68],G7:[59,62,65,67]};
const ROOT={C:36,G:43,Am:45,F:41,Dm:38,Em:40,Cm:36,Fm:41,G7:43};
function popBar(tb,beat,o={}){const v=o.v||1;for(let k=0;k<8;k++)hat(tb+k*beat/2,(k%2?.5:.85)*v);kick(tb,v);kick(tb+2*beat,v);if(o.push)kick(tb+2.5*beat,.6*v);snare(tb+beat,.85*v);snare(tb+3*beat,.85*v);}
function playLine(t,beat,line,fn){line.forEach(([b,m,d])=>fn(t+b*beat,m,d*beat*.95));}
function chordBar(tb,beat,name,o={}){const c=CHD[name];if(o.half){chord(tb,c,beat*1.9,o.v||.7,.01);chord(tb+2*beat,c,beat*1.9,(o.v||.7)*.8,.01);}else chord(tb,c,beat*3.9,o.v||.7,.012);}
function bassBar(tb,beat,name,o={}){const r=ROOT[name];if(o.eighth){for(let k=0;k<8;k++)pluck(tb+k*beat/2,r,"bass",{vol:.95,mute:beat*.42});}else{pluck(tb,r,"bass",{vol:1,mute:beat*1.8});pluck(tb+2*beat,r+(o.fifth?7:0),"bass",{vol:.9,mute:beat*1.8});}}

const DEMOS={};
/* 01 找拍子（速度随机） */
let TRUE_BPM=0,taps=[];
const SONG4=["C","G","Am","F"];
function groove(t,bpm,bars,o={}){const beat=bt(bpm);for(let i=0;i<bars;i++){const tb=t+i*4*beat,n=SONG4[i%4];popBar(tb,beat,{push:true});bassBar(tb,beat,n,{eighth:true});chordBar(tb,beat,n,{half:true,v:.6});}
  if(o.mel)for(let r=0;r<bars/4;r++)playLine(t+r*16*beat,beat,MEL4,(tt,m,d)=>sax(tt,m,d,{vol:.85}));return bars*4*beat+.6;}
const MEL4=[[0,72,1],[1,71,.5],[1.5,67,.5],[2,67,1.5],[3.5,64,.5],[4,67,1],[5,71,1],[6,74,2],[8,72,1],[9,69,.5],[9.5,72,.5],[10,76,1.5],[11.5,74,.5],[12,72,1],[13,69,1],[14,65,1],[15,67,1]];
DEMOS.groove=t=>{TRUE_BPM=76+Math.floor(Math.random()*56);taps=[];document.getElementById("tapout").textContent="跟着拍子点大按钮……";return groove(t,TRUE_BPM,12);};
DEMOS.t70=t=>groove(t,70,4,{mel:true});DEMOS.t110=t=>groove(t,110,8,{mel:true});DEMOS.t160=t=>groove(t,160,8,{mel:true});
/* 02 拍号 */
DEMOS.m3=t=>{const beat=bt(156),P=["C","C","G7","G7","G7","G7","C","C"],M=[[0,64,1],[1,67,1],[2,72,1],[3,71,2],[5,67,1],[6,65,2],[8,67,1],[9,71,3],[12,74,2],[14,72,1],[15,71,2],[17,69,1],[18,67,3],[21,64,1],[22,62,1],[23,60,1]];
  P.forEach((n,i)=>{const tb=t+i*3*beat,c=CHD[n].map(x=>x+(n==="C"?0:0));pluck(tb,ROOT[n]+(i%2?7:0),"bass",{vol:1,mute:beat*.9});[1,2].forEach(q=>chord(tb+q*beat,c,beat*.45,.55,.004));kick(tb,.55);hat(tb+beat,.5);hat(tb+2*beat,.5);});
  playLine(t,beat,M,(tt,m,d)=>sax(tt,m,d,{vol:.85}));return 24*beat+.8;};
DEMOS.m4=t=>{const beat=bt(112);for(let i=0;i<4;i++){const tb=t+i*4*beat,n=SONG4[i];popBar(tb,beat);bassBar(tb,beat,n,{eighth:true});chordBar(tb,beat,n,{half:true,v:.6});}playLine(t,beat,MEL4,(tt,m,d)=>sax(tt,m,d,{vol:.85}));return 16*beat+.8;};
DEMOS.m5=t=>{const beat=bt(168),bars=8;for(let i=0;i<bars;i++){const tb=t+i*5*beat,n=i%2?"Fm":"Cm";for(let q=0;q<5;q++)ride(tb+q*beat,q===0||q===3?1:.6);kick(tb,1);kick(tb+3*beat,.8);snare(tb+2*beat,.5);snare(tb+4*beat,.6);
    chord(tb,CHD[n],beat*1.4,.7,.006);chord(tb+1.5*beat,CHD[n],beat*.4,.45,.004);chord(tb+3*beat,CHD[n],beat*1.4,.6,.006);pluck(tb,ROOT[n],"bass",{vol:1,mute:beat*2.8});pluck(tb+3*beat,ROOT[n]+7,"bass",{vol:.9,mute:beat*1.8});}
  const M=[[10,67,1.5],[11.5,68,.5],[12,67,1],[13,63,2],[20,72,1.5],[21.5,70,.5],[22,68,1],[23,67,2],[30,67,1],[31,70,1],[32,72,3],[35,75,2],[37,72,3]];playLine(t,beat,M,(tt,m,d)=>sax(tt,m,d,{vol:.85}));return bars*5*beat+.8;};
/* 03 切分 */
const ON=[[0,67,1],[1,69,1],[2,72,1],[3,69,1],[4,74,2],[6,72,2]],SY=[[0,67,.5],[.5,69,1],[1.5,72,1],[2.5,69,1],[3.5,74,2.5],[6,72,2]];
function syncDemo(t,line){const beat=bt(100);["C","F","C","G"].forEach((n,i)=>{const tb=t+i*4*beat;popBar(tb,beat,{v:.8});bassBar(tb,beat,n,{fifth:true});chordBar(tb,beat,n,{v:.5});});
  [0,8].forEach(o=>playLine(t+o*beat,beat,line,(tt,m,d)=>{sax(tt,m,d,{vol:.95});}));return 16*beat+.8;}
DEMOS.onbeat=t=>syncDemo(t,ON);DEMOS.synco=t=>syncDemo(t,SY);
/* 04 八度 */
DEMOS.octave=t=>{const beat=bt(100);[36,48,60,72,84].forEach((b,i)=>[[0,0,.5],[.5,4,.5],[1,7,.5],[1.5,12,1.5]].forEach(([x,m,d])=>pno(t+(i*3.5+x)*beat,b+m,d*beat,1.1)));return 17.5*beat+1;};
DEMOS.oct2=t=>{organ(t,60,1.6);organ(t,72,1.6);organ(t+2.2,60,1.6);organ(t+2.2,61,1.6);return 4.2;};
/* 05 音阶 */
const SCL={maj:[0,2,4,5,7,9,11,12],min:[0,2,3,5,7,8,10,12],pen:[0,2,4,7,9,12],blu:[0,3,5,6,7,10,12]};
function scaleRun(t,s){const st=bt(150)/2*1.4,up=s.map(x=>60+x),seq=up.concat(up.slice(0,-1).reverse());seq.forEach((m,i)=>pno(t+i*st,m,i===seq.length-1?1.2:st*1.1,1));organ(t,48,seq.length*st+.6,.35);return seq.length*st+1.2;}
DEMOS["sc-maj"]=t=>scaleRun(t,SCL.maj);DEMOS["sc-min"]=t=>scaleRun(t,SCL.min);DEMOS["sc-pen"]=t=>scaleRun(t,SCL.pen);DEMOS["sc-blu"]=t=>scaleRun(t,SCL.blu);
/* 06 大调与小调：原创旋律 */
const MM=[[0,60,.5],[.5,64,.5],[1,67,1],[2,69,.5],[2.5,67,.5],[3,64,1],[4,65,.5],[4.5,64,.5],[5,62,1],[6,67,.5],[6.5,65,.5],[7,64,1],[8,62,.5],[8.5,64,.5],[9,65,.5],[9.5,62,.5],[10,60,2]];
function mmDemo(t,minor){const beat=bt(92),fix=m=>minor&&[4,9,11].includes(pcOf(m))?m-1:m,P=minor?[["Cm",4],["Fm",2],["G7",2],["G7",2],["Cm",2]]:[["C",4],["F",2],["G7",2],["G7",2],["C",2]];
  for(let rep=0;rep<2;rep++){const t0=t+rep*13*beat;let x=0;P.forEach(([n,len])=>{const tb=t0+x*beat;chord(tb,CHD[n],len*beat*.95,.6,.015);pluck(tb,ROOT[n],"bass",{vol:1,mute:len*beat*.9});for(let q=0;q<len;q++)swish(tb+q*beat,beat*.9,.6);x+=len;});
    playLine(t0,beat,MM,(tt,m,d)=>pno(tt,fix(m)+12,d,1.1));}
  return 26*beat+.5;}
DEMOS.major=t=>mmDemo(t,false);DEMOS.minor=t=>mmDemo(t,true);
/* 07 音程 */
DEMOS.intervals=t=>{let x=0;[12,7,4,6,1].forEach(iv=>{organ(t+x,60,.55);organ(t+x+.6,60+iv,.55);organ(t+x+1.3,60,1.5);organ(t+x+1.3,60+iv,1.5);x+=3.3;});return x+.3;};
/* 08 四个和弦 */
const POPM=[[0,64,1],[1,67,1],[2,72,1.5],[3.5,71,.5],[4,71,1],[5,67,1],[6,62,2],[8,69,1],[9,72,1],[10,76,1.5],[11.5,74,.5],[12,72,1],[13,69,1],[14,65,1.5],[15.5,67,.5],
  [16,72,1],[17,74,.5],[17.5,76,1.5],[19,72,1],[20,74,2],[22,71,1],[23,67,1],[24,72,1],[25,69,1],[26,72,1],[27,76,1],[28,77,1],[29,76,1],[30,72,2]];
function pop4(t,full){const beat=bt(92);for(let i=0;i<8;i++){const tb=t+i*4*beat,n=SONG4[i%4];chordBar(tb,beat,n,{half:true,v:.75});if(full){popBar(tb,beat,{v:.85,push:true});bassBar(tb,beat,n,{eighth:true});}else pluck(tb,ROOT[n],"bass",{vol:.9,mute:beat*3.6});}
  if(full)playLine(t,beat,POPM,(tt,m,d)=>sax(tt,m,d,{vol:.95}));const e=t+32*beat;chord(e,[60,64,67,72],2.4,.8,.02);pluck(e,36,"bass",{vol:1,dur:2.4});if(full){crash(e,.5);kick(e);sax(e,72,2.2);}return 32*beat+2.6;}
DEMOS.pop4=t=>pop4(t,false);DEMOS.pop4b=t=>pop4(t,true);
/* 09 音色 */
const TPH=[[0,67,.5],[.5,69,.5],[1,72,1],[2,69,.5],[2.5,67,.5],[3,64,1.8]];
function tim(t,fn){const beat=bt(100);playLine(t,beat,TPH,fn);return 5*beat+.8;}
DEMOS["tim-sine"]=t=>tim(t,(tt,m,d)=>sine(tt,m,d));DEMOS["tim-pno"]=t=>tim(t,(tt,m,d)=>pno(tt,m,d,1.2));DEMOS["tim-gtr"]=t=>tim(t,(tt,m,d)=>pluck(tt,m,"ac",{vol:1.1,dur:Math.max(.8,d*1.3)}));
DEMOS["tim-sax"]=t=>tim(t,(tt,m,d)=>sax(tt,m-12,d,{vol:1}));DEMOS["tim-tpt"]=t=>tim(t,(tt,m,d)=>tpt(tt,m,d,{vol:1}));DEMOS["tim-voice"]=t=>tim(t,(tt,m,d)=>voice(tt,m,d,{from:-.6,glide:.06,vibDepth:d>.5?20:0,vowel:"a",vol:.9}));
/* 10 渐强 */
DEMOS.cresc=t=>{const a=A(),g=a.createGain(),beat=bt(96),T=16*beat;g.gain.setValueAtTime(.015,t);g.gain.exponentialRampToValueAtTime(1,t+T);g.gain.setValueAtTime(1,t+T+beat*.6);g.gain.linearRampToValueAtTime(.06,t+T+beat*.62);g.connect(bus);
  into(g,()=>{for(let k=0;k<T/(beat/4);k++)snare(t+k*beat/4,k%4?.5:.7);for(let b=0;b<16;b+=2){[48,55,60,64,67].forEach(m=>organ(t+b*beat,m,2*beat*.98,.7));tbn(t+b*beat,48,2*beat*.96,{vol:.8});tpt(t+b*beat,67,2*beat*.96,{vol:.6});tom(t+b*beat,70,.8);}
    crash(t+T,1);kick(t+T,1.2);[48,55,60,64,67,72].forEach(m=>{organ(t+T,m,beat*.5,1);tpt(t+T,m+12,beat*.5,{vol:.5});});
    const e=t+T+beat*1.2;[60,64,67].forEach(m=>pno(e,m,2.5,.6));});return T+beat*1.2+3;};
/* 11 频率 */
function mixDemo(t,mode){const a=A(),beat=bt(104),nodes=[];let inp=a.createGain(),out=inp;const F=(type,f,q=.7)=>{const x=a.createBiquadFilter();x.type=type;x.frequency.value=f;x.Q.value=q;out.connect(x);out=x;};
  if(mode==="low"){F("lowpass",200);F("lowpass",200);}else if(mode==="mid"){F("highpass",400);F("highpass",400);F("lowpass",2600);F("lowpass",2600);}else if(mode==="high"){F("highpass",4000);F("highpass",4000);}
  const mk=a.createGain();mk.gain.value=mode==="mid"?1.6:mode==="high"?2.4:mode==="low"?1.3:1;out.connect(mk).connect(bus);
  into(inp,()=>{for(let i=0;i<8;i++){const tb=t+i*4*beat,n=SONG4[i%4];popBar(tb,beat,{push:true});bassBar(tb,beat,n,{eighth:true});chordBar(tb,beat,n,{half:true,v:.6});}playLine(t,beat,POPM,(tt,m,d)=>sax(tt,m,d,{vol:.9}));});return 32*beat+.6;}
["full","low","mid","high"].forEach(m=>DEMOS["eq-"+m]=t=>mixDemo(t,m));
/* 12 空间 */
function panned(p){const a=A(),sp=a.createStereoPanner();sp.pan.value=p;sp.connect(bus);return sp;}
DEMOS.stereo=t=>{const a=A(),beat=bt(96),L=panned(-.9),R=panned(.9),M=a.createStereoPanner();M.connect(bus);const T=32*beat;M.pan.setValueAtTime(-1,t);M.pan.linearRampToValueAtTime(1,t+T/2);M.pan.linearRampToValueAtTime(-1,t+T);
  for(let i=0;i<8;i++){const tb=t+i*4*beat,n=SONG4[i%4];via(L,()=>[0,1.5,2,3].forEach(x=>strum(tb+x*beat,place(CHD[n].map(pcOf),52,68).slice(0,4),"ac",{vol:.8,spread:.012,mute:beat*.8})));
    via(R,()=>[.5,2.5].forEach(x=>chord(tb+x*beat,CHD[n].map(m=>m+12),beat*1.2,.6,.006)));via(M,()=>{for(let k=0;k<16;k++)hat(tb+k*beat/4,k%2?.5:1);});kick(tb,.8);kick(tb+2*beat,.8);pluck(tb,ROOT[n],"bass",{vol:1,mute:beat*3.6});}
  return T+.6;};
function roomPhrase(t){const beat=bt(84);["C","Am","F","G"].forEach((n,i)=>chord(t+i*2*beat,CHD[n],2*beat*.9,.75,.02));playLine(t,beat,[[0,72,1],[1,76,1],[2,74,1.5],[3.5,72,.5],[4,69,2],[6,71,1.5]],(tt,m,d)=>sax(tt,m-12,d,{vol:.95}));return 8*beat+.3;}
DEMOS.dry=t=>roomPhrase(t)+.2;DEMOS.hall=t=>roomPhrase(t)+3.5;
/* 13 织体：《两只老虎》（公有领域） */
const TIG=[[0,60,1],[1,62,1],[2,64,1],[3,60,1],[4,60,1],[5,62,1],[6,64,1],[7,60,1],[8,64,1],[9,65,1],[10,67,2],[12,64,1],[13,65,1],[14,67,2],
  [16,67,.5],[16.5,69,.5],[17,67,.5],[17.5,65,.5],[18,64,1],[19,60,1],[20,67,.5],[20.5,69,.5],[21,67,.5],[21.5,65,.5],[22,64,1],[23,60,1],[24,60,1],[25,55,1],[26,60,2],[28,60,1],[29,55,1],[30,60,2]];
DEMOS.mono=t=>{const beat=bt(120);playLine(t,beat,TIG,(tt,m,d)=>clr(tt,m+12,d,{vol:1.2}));return 32*beat+.6;};
DEMOS.homo=t=>{const beat=bt(120);playLine(t,beat,TIG,(tt,m,d)=>sax(tt,m+12,d,{vol:.9}));for(let b=0;b<32;b++){chord(t+b*beat,b%2?[55,60,64]:[52,55,60],beat*.6,.45,.004);if(b%2===0)pluck(t+b*beat,b%4?43:36,"bass",{vol:1,mute:beat*1.8});}return 32*beat+.6;};
DEMOS.poly=t=>{const beat=bt(120),V=[(tt,m,d)=>sax(tt,m+12,d,{vol:.85}),(tt,m,d)=>tpt(tt,m+12,d,{vol:.75}),(tt,m,d)=>clr(tt,m+24,d,{vol:1}),(tt,m,d)=>pno(tt,m,d,1.1)];
  V.forEach((fn,i)=>playLine(t+i*8*beat,beat,TIG,fn));for(let b=0;b<56;b+=2)pluck(t+b*beat,b%4?43:36,"bass",{vol:.8,mute:beat*1.8});return 56*beat+.6;};
/* 14 主歌与副歌 */
const VERSE=[[0,64,1],[1,64,.5],[1.5,67,.5],[2,69,1.5],[4,65,1],[5,64,.5],[5.5,62,.5],[6,60,1.5],[8,64,1],[9,67,1],[10,64,1.5],[12,62,1],[13,59,1],[14,62,2]];
const CHOR=[[0,72,1.5],[1.5,74,.5],[2,76,2],[4,74,1],[5,71,1],[6,67,2],[8,72,1.5],[9.5,74,.5],[10,76,1],[11,79,1],[12,77,1.5],[13.5,76,.5],[14,72,2]];
DEMOS.form=(t,btn)=>{const beat=bt(120),bar=4*beat,st=stripNear(btn);lightStrip(st,t,bar,18);const plan=["i","i","v","v","v","v","c","c","c","c","v","v","v","v","c","c","c","c"];const VC=["Am","F","C","G"],CC=["C","G","Am","F"];
  plan.forEach((p,i)=>{const tb=t+i*bar;if(p==="i"){chordBar(tb,beat,i?"G":"Am",{v:.6});return;}const k=(i-2)%4,n=p==="v"?VC[k]:CC[k];
    if(p==="v"){kick(tb,.7);kick(tb+2*beat,.7);for(let q=0;q<4;q++)hat(tb+q*beat,.5);pluck(tb,ROOT[n],"bass",{vol:.9,mute:beat*1.8});pluck(tb+2*beat,ROOT[n],"bass",{vol:.8,mute:beat*1.8});chord(tb,CHD[n],beat*3.6,.4,.02);}
    else{popBar(tb,beat,{push:true});bassBar(tb,beat,n,{eighth:true});chordBar(tb,beat,n,{half:true,v:.7});organ(tb,CHD[n][0]-12,bar*.95,.25);if(k===0)crash(tb,.6);}});
  [2,10].forEach(b=>playLine(t+b*bar,beat,VERSE,(tt,m,d)=>sax(tt,m,d,{vol:.8,bright:.85})));[6,14].forEach(b=>playLine(t+b*bar,beat,CHOR,(tt,m,d)=>{sax(tt,m,d,{vol:1,bright:1.1});pno(tt,m+12,d,.6);}));
  const e=t+18*bar;chord(e,[60,64,67,72],2.4,.8,.02);pluck(e,36,"bass",{vol:1,dur:2.4});crash(e,.6);kick(e);sax(e,72,2.2);return 18*bar+2.6;};

/* ================= 调度与电平表 ================= */
const GAIN={groove:1.2,t70:.9,t110:.8,t160:.75,m3:1,m4:.85,m5:1.3,onbeat:.8,synco:.8,octave:3.5,oct2:1.2,"sc-maj":2.5,"sc-min":2.5,"sc-pen":2.5,"sc-blu":2.5,major:2.2,minor:2.2,intervals:1.4,pop4:2.5,pop4b:.8,"tim-sine":.9,"tim-pno":3.5,"tim-gtr":1.4,"tim-sax":1.8,"tim-tpt":1.6,"tim-voice":.85,"eq-full":.8,"eq-low":.9,"eq-mid":.5,"eq-high":1.8,stereo:1.4,dry:1.3,hall:1.2,mono:1.6,homo:1,poly:1.1,form:1.1};
const ROOM={dry:[.3,0],hall:[3.8,.9],intervals:[1,.05],oct2:[1,.05],poly:[1.6,.25]};
const fab=document.getElementById("stopAll");
let an=null,vuLab=null,vuVal=0;
function vuLoop(){if(!an)return;const buf=new Float32Array(an.fftSize);an.getFloatTimeDomainData(buf);let s=0;for(const x of buf)s+=x*x;const rms=Math.sqrt(s/buf.length),db=20*Math.log10(rms+1e-6);const target=Math.max(-45,Math.min(48,(db+42)/38*90-45));vuVal+=(target-vuVal)*.35;
  document.querySelectorAll(".vu i").forEach(n=>{const on=vuLab&&n.closest(".lab")===vuLab;n.style.transform=`rotate(${on?vuVal:-45}deg)`;});requestAnimationFrame(vuLoop);}
function ensureVU(){if(an)return;A();an=ac.createAnalyser();an.fftSize=1024;master.connect(an);requestAnimationFrame(vuLoop);}
function setActive(b){activeBtn=b;b&&b.classList.add("playing");fab.classList.add("on");vuLab=b&&b.closest(".lab");}
function clearActive(){if(activeBtn){activeBtn.classList.remove("playing");activeBtn=null;}fab.classList.remove("on");vuLab=null;}
function runDemo(name,btn){newBus();ensureVU();bus.gain.value=GAIN[name]||1;const rm=ROOM[name]||[1.3,.15];if(rm[1])addRoom(rm[0],rm[1]);setActive(btn);const t=A().currentTime+.15,d=DEMOS[name](t,btn)||3;later(()=>clearActive(),d+.4);}
document.querySelectorAll(".lab .head").forEach(h=>{const v=document.createElement("div");v.className="vu";v.setAttribute("aria-hidden","true");v.appendChild(document.createElement("i"));h.appendChild(v);});
document.querySelectorAll("[data-strip]").forEach(s=>{const n=+s.dataset.strip||12;for(let i=0;i<n;i++)s.appendChild(document.createElement("i"));});
document.querySelectorAll("[data-demo]").forEach(b=>b.addEventListener("click",()=>{if(b.classList.contains("playing")){stopDemos();return;}runDemo(b.dataset.demo,b);}));
document.querySelectorAll("[data-stop]").forEach(b=>b.addEventListener("click",stopDemos));
fab.addEventListener("click",stopDemos);
/* 跟拍 */
document.getElementById("tap").addEventListener("click",()=>{const out=document.getElementById("tapout"),now=performance.now();if(taps.length&&now-taps[taps.length-1]>2000)taps=[];taps.push(now);if(taps.length>9)taps.shift();
  if(taps.length<3){out.textContent=`再点几下……（${taps.length}）`;return;}const iv=(taps[taps.length-1]-taps[0])/(taps.length-1),bpm=Math.round(60000/iv);out.textContent=`你点的速度：约 ${bpm} BPM`;});
document.getElementById("reveal").addEventListener("click",()=>{const out=document.getElementById("tapout");if(!TRUE_BPM){out.textContent="先按“开始”";return;}let mine="";if(taps.length>=3){const bpm=Math.round(60000/((taps[taps.length-1]-taps[0])/(taps.length-1)));const r=bpm/TRUE_BPM;
    mine=Math.abs(r-1)<.08?"，你点得很准":Math.abs(r-2)<.12?"，你点的是它的两倍：每拍点了两下，也没错":Math.abs(r-.5)<.06?"，你点的是它的一半：隔一拍点一下，也算对":"，再试一次？";}out.textContent=`实际速度：${TRUE_BPM} BPM${mine}`;});
/* 小游戏 */
function quizSound(fn){newBus();ensureVU();bus.gain.value=1.6;addRoom(1.2,.12);vuLab=document.activeElement&&document.activeElement.closest(".lab");const t=A().currentTime+.1;fn(t);}
const HI={gap:7,ok:0,n:0,cur:null};
document.getElementById("hiAsk").addEventListener("click",()=>{const base=55+Math.floor(Math.random()*18),up=Math.random()<.5,a=base,b=base+(up?HI.gap:-HI.gap);HI.cur={ans:up?"2":"1",a,b};quizSound(t=>{pno(t,a,.7,1.3);pno(t+.9,b,.7,1.3);});document.getElementById("hiOut").textContent=`听！两个音相差 ${HI.gap} 个半音`;});
["hi1","hi2"].forEach(id=>document.getElementById(id).addEventListener("click",e=>{const out=document.getElementById("hiOut");if(!HI.cur){out.textContent="先按“出题”";return;}HI.n++;const ok=e.currentTarget.dataset.ans===HI.cur.ans;if(ok){HI.ok++;HI.gap=Math.max(1,HI.gap-1);}else HI.gap=Math.min(12,HI.gap+2);
  out.textContent=`${ok?"答对了":"不对，是"+(HI.cur.ans==="1"?"第一个":"第二个")+"高"} · 得分 ${HI.ok}/${HI.n} · 下一题相差 ${HI.gap} 个半音`;HI.cur=null;}));
const MMQ={ok:0,n:0,cur:null};
document.getElementById("mmAsk").addEventListener("click",()=>{const r=52+Math.floor(Math.random()*12),maj=Math.random()<.5,c=[r,r+(maj?4:3),r+7];MMQ.cur=maj?"M":"m";quizSound(t=>{c.forEach((m,i)=>pno(t+i*.35,m,.5,1.1));chord(t+1.2,c,1.6,1.1,.01);});document.getElementById("mmOut").textContent="听！先分开弹，再一起弹";});
["mmM","mmm"].forEach(id=>document.getElementById(id).addEventListener("click",e=>{const out=document.getElementById("mmOut");if(!MMQ.cur){out.textContent="先按“出题”";return;}MMQ.n++;const ok=e.currentTarget.dataset.ans===MMQ.cur;if(ok)MMQ.ok++;
  out.textContent=`${ok?"答对了":"不对，是"+(MMQ.cur==="M"?"大三和弦（明亮）":"小三和弦（暗淡）")} · 得分 ${MMQ.ok}/${MMQ.n}`;MMQ.cur=null;}));

/* ================= 推荐曲目：电台预设卡 ================= */
const SONGS=[
  {side:"A",el:"节拍",q:"Queen We Will Rock You",title:"We Will Rock You",by:"Queen",yr:"1977",style:"摇滚",
   txt:"几乎没有乐器，只有跺脚和拍手：“咚 咚 啪”。全世界的体育场都会跟着它打拍子，是找拍子最好的起点。",listen:["跟着跺脚拍手，数“一二三四”","最后吉他进来时，拍子变了吗？"]},
  {side:"A",el:"三拍子",q:"Strauss An der schönen blauen Donau Vienna Philharmonic",title:"An der schönen blauen Donau（蓝色多瑙河）",by:"Johann Strauss II",yr:"1867",style:"圆舞曲",
   txt:"最有名的华尔兹之一，每年维也纳新年音乐会几乎都会演奏。“嘭 恰 恰”的三拍子贯穿全曲，旋律慢慢升起，像在河上漂。",listen:["跟着数“一二三”，对照 Lab 03","找出低音只在第一拍响的地方"]},
  {side:"A",el:"七拍子 · 立体声",q:"Pink Floyd Money",title:"Money",by:"Pink Floyd",yr:"1973",style:"前卫摇滚",
   txt:"开头是收银机和硬币的声音循环，用耳机听会在左右之间跳。主要段落是少见的七拍一组，吉他独奏时又换成四拍。",listen:["戴耳机，听收银机在哪边响","试着数到七"]},
  {side:"A",el:"旋律",q:"邓丽君 月亮代表我的心",title:"月亮代表我的心",by:"邓丽君",yr:"1977",style:"华语流行",
   txt:"这首歌最早由陈芬兰在 1973 年演唱，邓丽君的版本让它传遍了华语世界。旋律起伏平缓、好记，是练习“哼出来”的好材料。",listen:["跟着哼，找出旋律最高的一个音","副歌和主歌的旋律有什么不同？"]},
  {side:"A",el:"五声音阶",q:"周杰伦 青花瓷",title:"青花瓷",by:"周杰伦",yr:"2007",style:"华语流行 · 中国风",
   txt:"方文山作词的“中国风”代表作。旋律大量使用五声音阶，伴奏里有古筝、琵琶的音色，但和弦和节奏仍是流行歌的做法。",listen:["对照 Lab 06 的大调五声示例","哪些乐器的音色是“中国”的？"]},
  {side:"A",el:"大调 · 律动",q:"Pharrell Williams Happy",title:"Happy",by:"Pharrell Williams",yr:"2013",style:"流行 · 灵魂乐",
   txt:"拍手、轻快的贝斯和和声合唱，几乎是“开心”的标准答案。它的节奏在拍子之间有不少切分，让人想跟着动。",listen:["拍手落在哪几拍？","听和声合唱的“回应”"]},
  {side:"B",el:"和弦进行",q:"The Beatles Let It Be",title:"Let It Be",by:"The Beatles",yr:"1970",style:"摇滚 · 流行",
   txt:"钢琴弹出的和弦进行，就是 Lab 09 那四个和弦的一种排列：1 → 5 → 6m → 4。听完你会在很多歌里认出它。",listen:["跟着钢琴，找出和弦换的位置","对照 Lab 09"]},
  {side:"B",el:"音色 · 渐强",q:"Ravel Bolero",title:"Boléro（波莱罗）",by:"Maurice Ravel",yr:"1928",style:"管弦乐",
   txt:"十几分钟里，同一条旋律被一件又一件乐器轮流演奏，小军鼓的节奏从头到尾不变，音量从极轻一路渐强到极响。它几乎是为“听音色”而写的。",listen:["数一数旋律换了几种乐器","对照 Lab 10 和 Lab 11"]},
  {side:"B",el:"复调",q:"Bach Fugue in G minor BWV 578 organ",title:"G 小调赋格（“小赋格”）BWV 578",by:"Johann Sebastian Bach",yr:"约 1703–1707",style:"巴洛克 · 管风琴",
   txt:"一条旋律先单独出现，然后在不同的高度一次次进来，几条线互相缠绕。A3 巴洛克会细讲赋格。",listen:["主题第二次进来时，是更高还是更低？","对照图 7 和 Lab 14"]},
  {side:"B",el:"低音 · 曲式",q:"Michael Jackson Billie Jean",title:"Billie Jean",by:"Michael Jackson",yr:"1983",style:"流行 · 放克",
   txt:"一开始是鼓，然后是一条几乎贯穿全曲的贝斯线。主歌、预副歌、副歌层次分明，是练习“只听贝斯”和“找段落”的经典。",listen:["只跟着贝斯哼","对照图 8 找出副歌"]},
  {side:"B",el:"力度",q:"Nirvana Smells Like Teen Spirit",title:"Smells Like Teen Spirit",by:"Nirvana",yr:"1991",style:"另类 · Grunge",
   txt:"主歌安静、几乎只剩贝斯和鼓，副歌突然爆发。这种“安静—爆发”的对比，D1 另类那一章会细讲。",listen:["主歌和副歌的音量差多少？","对照 Lab 11"]},
  {side:"B",el:"频率 · 制作",q:"Billie Eilish bad guy",title:"bad guy",by:"Billie Eilish",yr:"2019",style:"当代流行",
   txt:"人声像贴着耳朵的低语，低音却非常深。用手机扬声器和耳机各听一遍，差别会很明显，这就是 Lab 12 说的低频。",listen:["用手机扬声器和耳机各听一次","人声在左右的什么位置？"]}
];
const ICON="M8 5v14l11-7z";
SONGS.forEach(s=>{
  const el=document.createElement("div");el.className="song";
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<div class="meta"><span class="yr">${s.yr}</span><span class="el">听：${s.el}</span><span class="title">${s.title}</span><span class="by">${s.by}</span><div class="pmeta"><span class="style">${s.style}</span></div></div>
  <p>${s.txt}</p><ul class="listen">${s.listen.map(x=>`<li>${x}</li>`).join("")}</ul>
  <div class="listen-links"><a class="main" href="${yt}" target="_blank" rel="noopener">YouTube 搜索</a>
  <a href="https://music.163.com/#/search/m/?s=${q}&type=1" target="_blank" rel="noopener">网易云</a>
  <a href="https://y.qq.com/n/ryqq/search?w=${q}" target="_blank" rel="noopener">QQ音乐</a></div>
  <a class="playlink" href="${yt}" target="_blank" rel="noopener" aria-label="在 YouTube 收听 ${s.title}"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="${ICON}"/></svg></a>`;
  document.getElementById(s.side==="A"?"songsA":"songsB").appendChild(el);
});

/* ================= 原创图解 ================= */
const NS="http://www.w3.org/2000/svg";
function S(p,tag,a,txt){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e;}
const TB="font-family:var(--font-body);font-size:14px;font-weight:900",MONO="font-family:var(--font-mono);font-size:11.5px";
const FILL=c=>`fill:var(--${c})`,STK=c=>`stroke:var(--${c});fill:none`;
function box(g,x,y,w,h,t,c,fs=12.5){S(g,"rect",{x:x-w/2,y:y-h/2,width:w,height:h,rx:4,style:c?FILL(c):"",class:c?"":"sv-card"});if(!c)S(g,"rect",{x:x-w/2,y:y-h/2,width:w,height:h,rx:4,class:"sv-l"});S(g,"text",{x,y:y+fs*.38,"text-anchor":"middle",class:c?"sv-on":"sv-t",style:`font-size:${fs}px;font-weight:900`},t);}
const NOTE=["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"];
/* 键盘 */
function keyboard(g,x0,y0,kw,kh,startPc,nWhite,mark){const W=[0,2,4,5,7,9,11];let pcs=[],x=x0;const s=W.indexOf(startPc);const whites=[];for(let i=0;i<nWhite;i++){const pc=W[(s+i)%7];whites.push([x,pc]);x+=kw;}
  whites.forEach(([x,pc])=>{S(g,"rect",{x,y:y0,width:kw-2,height:kh,rx:3,class:"sv-card"});S(g,"rect",{x,y:y0,width:kw-2,height:kh,rx:3,class:"sv-l"});mark&&mark(x+kw/2-1,y0+kh,pc,false);});
  whites.forEach(([x,pc],i)=>{if(i===whites.length-1)return;const nx=whites[i+1][1];if(pcOf(nx-pc)===2){const bx=x+kw-kw*.3-1;S(g,"rect",{x:bx,y:y0,width:kw*.6,height:kh*.6,rx:2,style:FILL("ink")});mark&&mark(bx+kw*.3,y0+kh*.6,pc+1,true);}});}
/* 图 1 地图 */
(()=>{const g=document.getElementById("map-fig");if(!g)return;const COL=[[170,"SIDE A · 根源","red"],[320,"SIDE B · 摇滚家族","ink"],[470,"SIDE C · 律动","mustard"],[610,"SIDE D · 今天","denim"]];
  COL.forEach(([x,t,c],i)=>{S(g,"rect",{x:x-68,y:34,width:136,height:356,rx:6,style:FILL(c),opacity:.07});S(g,"text",{x,y:24,"text-anchor":"middle",class:"sv-t",style:"font-family:var(--font-wood);font-size:10.5px;letter-spacing:.12em"},t);});
  const N={blues:[0,75,"A1 布鲁斯"],folk:[0,155,"A2 民歌与乡村"],baroque:[0,235,"A3 巴洛克"],jazz:[0,315,"A4 爵士"],rock:[1,95,"B1 摇滚"],hard:[1,175,"B2 硬摇滚"],punk:[1,255,"B3 朋克"],metal:[1,335,"B4 金属"],
    soul:[2,115,"C1 灵魂乐与放克"],hh:[2,205,"C2 嘻哈"],edm:[2,295,"C3 电子舞曲"],alt:[3,140,"D1 另类"],pop:[3,265,"D2 当代流行"]};
  const P=k=>[COL[N[k][0]][0],N[k][1]];
  const E=[["blues","rock"],["blues","jazz",-1],["blues","soul"],["folk","rock"],["folk","alt"],["baroque","metal"],["jazz","soul"],["jazz","hh"],["rock","hard",1],["rock","punk",-1],["hard","metal",1],["punk","alt"],["soul","hh",1],["soul","edm",-1],["hh","pop"],["edm","pop"],["alt","pop",1]];
  E.forEach(([a,b,side])=>{const [x1,y1]=P(a),[x2,y2]=P(b);let d;if(x1===x2){const cx=x1+(side||1)*84;d=`M ${x1} ${y1} Q ${cx} ${(y1+y2)/2} ${x2} ${y2}`;}else{const mx=(x1+x2)/2;d=`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;}S(g,"path",{d,class:"sv-l","stroke-width":1.4,fill:"none",opacity:.55});});
  S(g,"circle",{cx:46,cy:200,r:30,style:FILL("mustard")});S(g,"text",{x:46,y:205,"text-anchor":"middle",class:"sv-on",style:"font-size:13px;font-weight:900"},"怎么听");
  ["blues","folk","baroque","jazz"].forEach(k=>S(g,"path",{d:`M 76 200 L ${P(k)[0]-56} ${P(k)[1]}`,class:"sv-lline","stroke-dasharray":"3 4"}));
  Object.keys(N).forEach(k=>{const [x,y]=P(k),c=COL[N[k][0]][2];box(g,x,y,N[k][2].length>6?124:104,30,N[k][2],c,12);});
})();
/* 图 2 拍子 */
(()=>{const g=document.getElementById("beat-fig");if(!g)return;const x0=150,dx=29;
  const R=[["拍子",null,16,40],["4/4",[4],16,110],["3/4",[3],15,175],["5/4",[3,2],15,240]];
  R.forEach(([n,grp,cnt,y])=>{S(g,"text",{x:28,y:y+6,class:"sv-t",style:"font-family:var(--font-wood);font-size:14px"},n);let pos=0,gi=0;
    for(let i=0;i<cnt;i++){let acc=0;if(grp){const cyc=grp.reduce((a,b)=>a+b,0),p=i%cyc;acc=p===0?2:(grp.length>1&&p===grp[0])?1:0;if(p===0&&i>0)S(g,"line",{x1:x0+i*dx-dx/2,y1:y-20,x2:x0+i*dx-dx/2,y2:y+20,class:"sv-l","stroke-width":1.6});}
      S(g,"circle",{cx:x0+i*dx,cy:y,r:acc===2?11:acc===1?8:5.5,style:FILL(acc===2?"red":acc===1?"mustard":"ink"),opacity:grp?1:.75});}});
  S(g,"text",{x:x0,y:78,class:"sv-ts"},"一小节");S(g,"path",{d:`M ${x0-6} 86 L ${x0+3*dx+6} 86`,class:"sv-l","stroke-width":1.4});
  S(g,"text",{x:640,y:14,"text-anchor":"end",class:"sv-m",style:MONO},"BPM = 每分钟有多少个点");
})();
/* 图 3 音高 */
(()=>{const g=document.getElementById("pitch-fig");if(!g)return;const kw=27,x0=56,y0=70,kh=120;const J=["1","2","3","4","5","6","7"],NN=["C","D","E","F","G","A","B"];let wi=0;const Apos=[];
  keyboard(g,x0,y0,kw,kh,0,21,(x,y,pc,blk)=>{if(blk)return;const i=wi++;S(g,"text",{x,y:y-26,"text-anchor":"middle",class:"sv-ts",style:"font-size:10.5px"},NN[i%7]);S(g,"text",{x,y:y-10,"text-anchor":"middle",class:"sv-t",style:"font-size:11px;font-weight:900"},J[i%7]);if(i%7===5)Apos.push(x);});
  Apos.forEach((x,i)=>{S(g,"circle",{cx:x,cy:y0+kh-44,r:8,style:FILL("red")});S(g,"text",{x,y:y0-12,"text-anchor":"middle",class:"sv-r",style:"font-family:var(--font-mono);font-size:12px;font-weight:500"},`${[220,440,880][i]} Hz`);
    if(i)S(g,"path",{d:`M ${Apos[i-1]+10} ${y0-32} Q ${(Apos[i-1]+x)/2} ${y0-58} ${x-10} ${y0-32}`,style:STK("ink"),"stroke-width":1.2});if(i)S(g,"text",{x:(Apos[i-1]+x)/2,y:y0-52,"text-anchor":"middle",class:"sv-m",style:"font-size:11px"},"八度：×2");});
  S(g,"text",{x:x0,y:262,class:"sv-ts"},"白键上的数字是简谱：1 = C（do）");
})();
/* 图 4 音阶 */
(()=>{const g=document.getElementById("scale-fig");if(!g)return;const x0=150,w=38,R=[["大调",SCL.maj,"red"],["自然小调",SCL.min,"denim"],["大调五声",SCL.pen,"mustard"],["小调布鲁斯",SCL.blu,"ink"]];
  for(let i=0;i<=12;i++)S(g,"text",{x:x0+i*w+w/2,y:26,"text-anchor":"middle",class:"sv-m",style:"font-size:11px"},NOTE[i%12]);
  R.forEach(([n,s,c],r)=>{const y=40+r*64;S(g,"text",{x:x0-12,y:y+21,"text-anchor":"end",class:"sv-t",style:"font-size:13px;font-weight:900"},n);
    for(let i=0;i<=12;i++){const on=s.includes(i);S(g,"rect",{x:x0+i*w+1,y,width:w-2,height:30,rx:3,style:on?FILL(c):"",class:on?"":"sv-card"});if(!on)S(g,"rect",{x:x0+i*w+1,y,width:w-2,height:30,rx:3,class:"sv-lline"});}
    for(let k=1;k<s.length;k++){const d=s[k]-s[k-1],xm=x0+(s[k-1]+s[k])/2*w+w/2;S(g,"text",{x:xm,y:y+46,"text-anchor":"middle",class:d===1?"sv-r":"sv-ts",style:"font-size:11px;"+(d===1?"font-weight:900":"")},d===1?"半":d===2?"全":"全半");}});
})();
/* 图 5 音色 */
(()=>{const g=document.getElementById("timbre-fig");if(!g)return;const H=[["正弦波",[1]],["像长笛",[1,.3,.12,.05]],["像单簧管",[1,0,.55,0,.35,0,.2,0]],["像小号",[1,.8,.65,.5,.4,.3,.22,.15]]];
  H.forEach(([n,amps],i)=>{const cx=30+(i%2)*170,cy=40+Math.floor(i/2)*140;S(g,"text",{x:cx,y:cy,class:"sv-t",style:"font-size:13px;font-weight:900"},n);S(g,"line",{x1:cx,y1:cy+92,x2:cx+140,y2:cy+92,class:"sv-l"});
    for(let h=0;h<8;h++){const a=amps[h]||0;if(a)S(g,"rect",{x:cx+h*17+2,y:cy+92-a*76,width:12,height:a*76,style:FILL(h?"denim":"red")});}S(g,"text",{x:cx,y:cy+108,class:"sv-m",style:"font-size:10px"},"基音 2× 3× 4× …");});
  const ex=390,ew=260;S(g,"text",{x:ex,y:40,class:"sv-t",style:"font-size:13px;font-weight:900"},"包络：声音的形状");
  [[110,"拨弦 / 敲击","red",x=>x<.03?x/.03:Math.exp(-(x-.03)*4)],[230,"吹奏 / 拉弦","denim",x=>x<.25?x/.25:x<.8?1:Math.max(0,1-(x-.8)/.2)]].forEach(([by,n,c,f])=>{let d="";for(let k=0;k<=100;k++){const x=k/100;d+=(k?" L ":"M ")+`${ex+x*ew} ${(by-f(x)*60).toFixed(1)}`;}
    S(g,"line",{x1:ex,y1:by,x2:ex+ew,y2:by,class:"sv-l"});S(g,"path",{d,style:STK(c),"stroke-width":2.6});S(g,"text",{x:ex,y:by+18,class:"sv-ts"},n);});
  S(g,"text",{x:ex+ew,y:268,"text-anchor":"end",class:"sv-m",style:"font-size:11px"},"时间 →");
})();
/* 图 6 频率 */
(()=>{const g=document.getElementById("freq-fig");if(!g)return;const X=f=>120+(Math.log10(f)-Math.log10(20))/3*530,top=36,bot=262;
  [[20,250,"低频","red"],[250,4000,"中频","mustard"],[4000,20000,"高频","denim"]].forEach(([a,b,n,c])=>{S(g,"rect",{x:X(a),y:top-20,width:X(b)-X(a),height:bot-top+20,style:FILL(c),opacity:.07});S(g,"text",{x:(X(a)+X(b))/2,y:top-6,"text-anchor":"middle",class:"sv-t",style:"font-size:12px;font-weight:900"},n);});
  const I=[["底鼓",40,150],["贝斯",41,400],["男声",85,520],["女声",165,1050],["吉他",82,1200],["钢琴",27.5,4186],["小提琴",196,3500],["镲片",3000,16000]];
  I.forEach(([n,a,b],i)=>{const y=top+14+i*26;S(g,"text",{x:110,y:y+13,"text-anchor":"end",class:"sv-t",style:"font-size:12px;font-weight:700"},n);S(g,"rect",{x:X(Math.min(b*4,20000))>X(b)?X(b):X(b),y:y+3,width:Math.max(0,X(Math.min(b*4,20000))-X(b)),height:12,rx:2,style:FILL("ink"),opacity:.15});S(g,"rect",{x:X(a),y,width:X(b)-X(a),height:18,rx:3,style:FILL("ink"),opacity:.8});});
  [20,50,100,200,500,1000,2000,5000,10000,20000].forEach(f=>{S(g,"line",{x1:X(f),y1:bot,x2:X(f),y2:bot+6,class:"sv-l"});S(g,"text",{x:X(f),y:bot+20,"text-anchor":"middle",class:"sv-m",style:MONO},f>=1000?f/1000+"k":String(f));});
  S(g,"text",{x:650,y:bot+38,"text-anchor":"end",class:"sv-ts"},"频率（Hz，对数刻度）· 浅色 = 泛音延伸");
})();
/* 图 7 织体 */
(()=>{const g=document.getElementById("texture-fig");if(!g)return;const P=[["单声部",20],["主调",245],["复调",470]],W=190;
  const wave=(x0,y,amp,ph,from=0)=>{let d="";for(let k=0;k<=60;k++){const x=from+k/60*(1-from);d+=(k?" L ":"M ")+`${x0+x*W} ${(y-Math.sin(x*9+ph)*amp-Math.sin(x*23+ph)*amp*.3).toFixed(1)}`;}return d;};
  P.forEach(([n,x0])=>S(g,"text",{x:x0,y:28,class:"sv-t",style:"font-family:var(--font-wood);font-size:13px"},n));
  S(g,"path",{d:wave(20,130,22,0),style:STK("red"),"stroke-width":3});
  S(g,"path",{d:wave(245,90,18,1),style:STK("red"),"stroke-width":3});for(let k=0;k<6;k++)S(g,"rect",{x:245+k*W/6+3,y:150,width:W/6-6,height:60,rx:3,style:FILL("denim"),opacity:.75-(k%2)*.2});
  ["red","denim","mustard","ink"].forEach((c,i)=>S(g,"path",{d:wave(470,70+i*42,13,i*1.7,i*.18),style:STK(c),"stroke-width":2.6}));
  S(g,"text",{x:245,y:232,class:"sv-ts"},"旋律 + 和弦伴奏");S(g,"text",{x:470,y:240,class:"sv-ts"},"四条线依次进入");
})();
/* 图 8 曲式 */
(()=>{const g=document.getElementById("form-fig");if(!g)return;const B=[["前奏",1,"ink",.2],["主歌",2,"denim",.35],["副歌",2,"red",.85],["主歌",2,"denim",.45],["副歌",2,"red",.9],["桥段",1.5,"mustard",.6],["副歌",2,"red",1],["尾奏",1,"ink",.3]];
  const tot=B.reduce((s,b)=>s+b[1],0),W=620,x0=30;let x=x0;const pts=[];B.forEach(([n,w,c,e])=>{const ww=W*w/tot;S(g,"rect",{x:x+1,y:30,width:ww-2,height:40,rx:3,style:FILL(c)});S(g,"text",{x:x+ww/2,y:55,"text-anchor":"middle",class:"sv-on",style:"font-size:13px;font-weight:900"},n);pts.push([x+ww*.15,e],[x+ww*.85,e]);x+=ww;});
  const base=190;let d=`M ${x0} ${base}`;pts.forEach(([px,e])=>d+=` L ${px} ${base-e*90}`);d+=` L ${x0+W} ${base}`;S(g,"path",{d:d+" Z",style:FILL("red"),opacity:.12});S(g,"path",{d,style:STK("red"),"stroke-width":2.4});S(g,"line",{x1:x0,y1:base,x2:x0+W,y2:base,class:"sv-l"});
  S(g,"text",{x:x0,y:base+20,class:"sv-ts"},"能量 ↑");S(g,"text",{x:x0,y:238,class:"sv-m",style:"font-size:11.5px"},"A1 布鲁斯：12 小节一圈，反复");S(g,"text",{x:x0,y:258,class:"sv-m",style:"font-size:11.5px"},"A4 爵士标准曲：A A B A，每段 8 小节");
})();
/* 图 9 调音台 */
(()=>{const g=document.getElementById("desk-fig");if(!g)return;const F=[["节奏","拍子多快？","几拍一组？",.7],["旋律","哼得出来吗？","往哪里走？",.55],["和声","明亮还是暗淡？","换得快吗？",.4],["音色","有哪些乐器？","像什么？",.62],["力度 · 空间","哪里最响？","在什么位置？",.35],["织体 · 曲式","几条线？","到哪一段了？",.5]];
  F.forEach(([n,q1,q2,v],i)=>{const x=60+i*112;S(g,"text",{x,y:26,"text-anchor":"middle",class:"sv-t",style:"font-size:13.5px;font-weight:900"},n);S(g,"rect",{x:x-4,y:44,width:8,height:150,rx:4,style:FILL("ink"),opacity:.85});
    for(let k=0;k<=10;k++)S(g,"line",{x1:x-18,y1:44+k*15,x2:x-10,y2:44+k*15,class:"sv-l"});const ky=44+(1-v)*150;S(g,"rect",{x:x-20,y:ky-10,width:40,height:20,rx:3,style:FILL(i===0?"red":"mustard")});S(g,"line",{x1:x-16,y1:ky,x2:x+16,y2:ky,style:"stroke:#1E1C1A","stroke-width":2});
    S(g,"text",{x,y:222,"text-anchor":"middle",class:"sv-ts"},q1);S(g,"text",{x,y:240,"text-anchor":"middle",class:"sv-ts"},q2);});
  S(g,"text",{x:340,y:278,"text-anchor":"middle",class:"sv-m",style:MONO},"每次只推一个推子");
})();
