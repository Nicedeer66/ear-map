/* ================= 一首歌走遍地图 · 地图与播放 =================
   点地名：同一段旋律换成那一站的风格，下一小节生效。
   播放旅程：亮点按书的顺序走完 14 站，旋律走四遍。 */
(()=>{
const svg=document.getElementById("cover-labels"),panel=document.getElementById("jr");if(!svg||!panel)return;
const NAME=c=>c==="Intro"?"原样旋律":BY[c].name;
const WHAT={
  Intro:"只有旋律：没有和弦，没有鼓。后面每一站都只换衣服，不换旋律。",
  A1:"shuffle 三连音律动，七和弦；推弦把 C 往上推一点，就是蓝调音。",
  A2:"换上大调和弦，同样的音一下子亮了；嘭–恰的低音和扫弦，曼陀林在长音上快速轮拨。",
  A3:"羽管键琴；低音不停地走八分音符；旋律晚两拍、低八度再进一次，就是卡农。",
  A4:"摇摆八分音符、行走贝斯、叮–叮嗒的吊镲；和弦加上九度和十三度。",
  B1:"直八分，军鼓打在第二、四拍（后拍）；过载吉他弹强力和弦。",
  B2:"更慢更重：吉他和贝斯一起弹 riff，哈蒙德风琴垫底，每两小节砸一次吊镲。",
  B3:"176 BPM，全下拨的强力和弦；旋律也用两个音的强力和弦弹，不加任何技巧。",
  B4:"闷音奔马节奏（一个八分加两个十六分），砰嚓鼓，两把高增益吉他八度齐奏。",
  C1:"重音落在每小节第一拍；十六分音符的切分贝斯和闷音吉他，风琴唱旋律。",
  C2:"boom-bap 鼓带一点“醉”的摇摆；整首像从旧唱片上采下来的：发闷、有底噪。",
  C3:"四拍底鼓、反拍开镲；和弦每拍被底鼓“压”一下（侧链压缩）。",
  D1:"安静、爆发：一小节干净的十二弦分解和弦，一小节失真全开。",
  D2:"四个和弦的流行进行，808 低音、碎拍踩镲，旋律交给明亮的合成器。"};
/* 地图上的点：13 个地名沿用封面坐标，原样旋律放在指北针 */
const PT={Intro:[717,62]};coverPoints.forEach(([c,x,y])=>PT[c]=[x,y]);
const S2=(p,tag,a,txt)=>{const e=S(p,tag,a,txt);return e;};

/* 路线、亮点、点击区 */
const routeD=JORDER.map((c,i)=>`${i?"L":"M"} ${PT[c][0]} ${PT[c][1]}`).join(" ");
const segLen=JORDER.map((c,i)=>i?Math.hypot(PT[c][0]-PT[JORDER[i-1]][0],PT[c][1]-PT[JORDER[i-1]][1]):0);
const cum=[];segLen.reduce((s,l,i)=>(cum[i]=s+l),0);const total=cum[cum.length-1];
const gRoute=document.createElementNS(NS,"g");svg.insertBefore(gRoute,svg.firstChild);
S2(gRoute,"path",{d:routeD,class:"jr-route-base"});
const routeOn=S2(gRoute,"path",{d:routeD,class:"jr-route-on","stroke-dasharray":total,"stroke-dashoffset":total});
S2(svg,"text",{x:690,y:62,"text-anchor":"end",class:"jr-start","data-code":"Intro"},"原样");
const dot=S2(svg,"g",{class:"jr-dot",transform:`translate(${PT.Intro[0]} ${PT.Intro[1]})`,opacity:0});
const halo=S2(dot,"circle",{r:22,class:"jr-halo"});S2(dot,"circle",{r:10,class:"jr-core"});
const hits=S2(svg,"g",{class:"jr-hits"});
function addHits(){hits.textContent="";
  Object.keys(PT).forEach(code=>{const [x,y]=PT[code];
    const lab=svg.querySelector(`text[data-code="${code}"]`);let box=null;try{box=lab&&lab.getBBox();}catch(e){}
    const g=S2(hits,"g",{"data-code":code});S2(g,"circle",{cx:x,cy:y,r:30});
    if(box&&box.width)S2(g,"rect",{x:box.x-8,y:box.y-6,width:box.width+16,height:box.height+12,rx:8});
    g.addEventListener("click",()=>pick(code));});}
addHits();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(addHits);

/* 面板 */
const $=id=>document.getElementById(id);
const go=$("jrGo"),stopB=$("jrStop"),now=$("jrNow"),steps=$("jrSteps"),badge=$("jrBadge");
steps.innerHTML=JORDER.map(c=>`<li><button type="button" data-code="${c}" title="${c==="Intro"?"原样旋律":c+" "+BY[c].name}">${c==="Intro"?"原样":c}</button></li>`).join("");
steps.addEventListener("click",e=>{const b=e.target.closest("button[data-code]");if(b)pick(b.dataset.code);});
go.addEventListener("click",()=>start("tour"));
stopB.addEventListener("click",()=>stop(true));

/* 播放状态：按小节排程，每 50 毫秒看一次，提前约 0.3 秒排下一小节 */
const J={on:false,mode:null,pi:0,code:null,bar:0,left:0,next:0,timer:null,vis:[],raf:0,cur:null,last:null,bpm:92,barT:0,
  pos:PT.Intro.slice(),from:PT.Intro.slice(),to:PT.Intro.slice(),moveT:0,tailUntil:0};
function unlock(){try{if(navigator.audioSession)navigator.audioSession.type="playback";}catch(e){}A();}
function start(mode,code){unlock();stop(false);newBus();
  Object.assign(J,{on:true,mode,pi:0,code:code||"Intro",bar:0,left:8,next:ac.currentTime+.12,vis:[],last:null,tailUntil:0});
  if(mode==="tour")routeOn.style.transition="none",routeOn.setAttribute("stroke-dashoffset",total);
  panel.classList.add("playing");panel.classList.toggle("touring",mode==="tour");stopB.hidden=false;go.textContent="▶ 从头再走";
  svg.classList.add("jr-active");dot.setAttribute("opacity",1);J.timer=setInterval(tick,50);tick();cancelAnimationFrame(J.raf);J.raf=requestAnimationFrame(frame);}
function pick(code){
  if(!J.on){start("free",code);return;}
  if(J.mode==="tour"){J.mode="free";panel.classList.remove("touring");}   /* 旅程中点别处：从当前位置接着走这一站 */
  J.code=code;J.left=8;
  steps.querySelectorAll("button").forEach(b=>b.classList.toggle("queued",b.dataset.code===code&&code!==J.cur));
  svg.querySelectorAll("text[data-code]").forEach(t=>t.classList.toggle("jr-queued",t.dataset.code===code&&code!==J.cur));}
function tick(){if(!J.on)return;const t=ac.currentTime;
  while(J.on&&J.next<t+.3){let item;
    if(J.mode==="tour"){if(J.pi>=JPLAN.length){finish();break;}item=JPLAN[J.pi++];}
    else{if(J.left<=0){finish();break;}item={code:J.code,bar:J.bar};J.left--;}
    const first=item.code!==J.last;J.last=item.code;
    const dur=jBar(item.code,item.bar,J.next,{first,mode:J.mode});
    J.vis.push({t:J.next,code:item.code,bar:item.bar,bpm:STY[item.code].bpm});
    J.next+=dur;J.bar=(item.bar+1)%8;}}
function finish(){if(!J.on)return;J.on=false;clearInterval(J.timer);
  if(J.mode==="tour"){STY.D2.end(J.next);J.tailUntil=J.next+2.6;J.vis.push({t:J.next,end:true});}
  else J.tailUntil=J.next+.4;}
function stop(user){const was=J.on||J.tailUntil>0;J.on=false;clearInterval(J.timer);J.vis=[];J.tailUntil=0;
  if(ac&&(user||was))stopDemos();reset();}
function reset(){cancelAnimationFrame(J.raf);svg.classList.remove("jr-active");panel.classList.remove("playing","touring","ended");stopB.hidden=true;go.textContent="▶ 播放旅程";
  dot.setAttribute("opacity",0);J.cur=null;mark(null);now.hidden=true;badge.hidden=true;}
function mark(code){svg.querySelectorAll("text[data-code]").forEach(t=>{t.classList.toggle("jr-on",t.dataset.code===code);t.classList.remove("jr-queued");});
  steps.querySelectorAll("button").forEach(b=>{b.classList.toggle("on",b.dataset.code===code);b.classList.remove("queued");});}
function show(v){
  if(v.end){panel.classList.add("ended");badge.hidden=false;badge.innerHTML="<small>END</small><b>同一首歌 · 14 种穿法</b>";now.hidden=false;now.innerHTML=`<div class="jr-tag">旅程结束</div><p class="jr-what">同一段旋律，换了 14 种穿法，一共走了四遍。点地图上任何一站，可以再单独听一遍。</p>`;return;}
  J.bpm=v.bpm;J.barT=v.t;
  if(v.code!==J.cur){const prev=J.cur;J.cur=v.code;J.from=J.pos.slice();J.to=PT[v.code].slice();J.moveT=performance.now();
    mark(v.code);const c=v.code,st=STY[c];
    badge.hidden=false;badge.innerHTML=`<small>${c==="Intro"?"START":c} · ${st.bpm} BPM</small><b>${NAME(c)}</b>`;
    now.hidden=false;now.innerHTML=`<div class="jr-tag">${c==="Intro"?"起点":c} · ${st.bpm} BPM</div><div class="jr-name">${NAME(c)}</div><p class="jr-what">${WHAT[c]}</p>${c==="Intro"?"":`<a class="jr-read" href="${href(BY[c])}">读这一章 →</a>`}`;
    if(J.mode==="tour"||panel.classList.contains("touring")){const i=JORDER.indexOf(c);routeOn.style.transition="stroke-dashoffset .6s ease";routeOn.setAttribute("stroke-dashoffset",total-cum[i]);}}}
const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function frame(){const t=ac.currentTime;
  while(J.vis.length&&J.vis[0].t<=t+.02)show(J.vis.shift());
  const k=reduce?1:Math.min(1,(performance.now()-J.moveT)/450),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
  J.pos=[J.from[0]+(J.to[0]-J.from[0])*e,J.from[1]+(J.to[1]-J.from[1])*e];dot.setAttribute("transform",`translate(${J.pos[0].toFixed(1)} ${J.pos[1].toFixed(1)})`);
  const beat=60/J.bpm,ph=t>=J.barT?((t-J.barT)/beat)%1:1;halo.setAttribute("r",(reduce?24:20+12*Math.pow(1-ph,3)).toFixed(1));   /* 亮点跟着拍子呼吸 */
  if(J.on||J.vis.length||t<J.tailUntil)J.raf=requestAnimationFrame(frame);
  else if(panel.classList.contains("ended")){svg.classList.remove("jr-active");badge.hidden=true;dot.setAttribute("opacity",0);mark(null);stopB.hidden=true;go.textContent="▶ 再走一遍";panel.classList.remove("playing","touring");}
  else reset();}
})();
