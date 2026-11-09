/* ================= 数据（由 build.py 从各章自动读出） ================= */
const CH=/*__DATA__*/;
const BY={};CH.forEach(c=>BY[c.code]=c);
const href=c=>`${c.dir}/index.html`;
const tgt="";
const SIDES=[
  {k:"A",disc:1,name:"根源",note:"后来几乎所有流行音乐，都能往回追到这四条河。",codes:["A1","A2","A3","A4"]},
  {k:"B",disc:1,name:"摇滚家族",note:"电吉他和乐队怎样占领了半个世纪。",codes:["B1","B2","B3","B4"]},
  {k:"C",disc:2,name:"律动",note:"节奏和身体成了主角。",codes:["C1","C2","C3"]},
  {k:"D",disc:2,name:"今天",note:"所有支流汇进你的手机。",codes:["D1","D2"]}];
const SC=k=>`var(--${k})`;

/* 总数 */
(()=>{const min=CH.reduce((s,c)=>s+c.min,0),demos=CH.reduce((s,c)=>s+c.demos,0),figs=CH.reduce((s,c)=>s+c.figs,0),songs=CH.reduce((s,c)=>s+c.songs,0);
  document.getElementById("totals").innerHTML=[[CH.length,"章"],[`约 ${Math.round(min/60)}`,"小时阅读"],[`${Math.floor(demos/10)*10}+`,"个可听示例"],[figs,"幅图解"],[songs,"首推荐曲目"]].map(([b,s])=>`<div><b>${b}</b><span>${s}</span></div>`).join("");
  document.getElementById("startLink").href=href(BY.Intro);
})();

/* 曲目单 */
(()=>{const box=document.getElementById("tracklist");const stat=c=>`<div class="stats"><span>${c.min} 分钟</span><span>${c.demos}${c.dplus?"+":""} 个示例</span><span>${c.figs} 幅图</span><span>${c.songs} 首歌</span></div>`;
  const row=(c,no,cls="")=>`<a class="track ${cls}" href="${href(c)}"${tgt} style="--sc:${c.code==="Intro"?"var(--ink)":SC(c.code[0])}"><span class="no">${no}</span><div><h4>${c.code==="Intro"?"Intro · ":""}${c.name}<span class="go">进入这一章 →</span></h4><p>${c.lede}</p>${stat(c)}</div></a>`;
  let h=row(BY.Intro,"00","intro-track");
  [1,2].forEach(d=>{h+=`<div class="disc-block"><div class="disc-head"><b>Disc ${d}</b><span>${d===1?"SIDE A · SIDE B":"SIDE C · SIDE D"}</span></div>`;
    SIDES.filter(s=>s.disc===d).forEach(s=>{h+=`<div class="side" style="--sc:${SC(s.k)}"><div class="side-label"><div class="label-disc" data-side="${s.k}"></div><div><h3>SIDE ${s.k} · ${s.name}</h3><p>${s.note}</p></div></div><div>${s.codes.map(k=>row(BY[k],k)).join("")}</div></div>`;});h+=`</div>`;});
  box.innerHTML=h;})();

/* 读法 */
(()=>{const R=[["时间不多：五章","先调好耳朵，再各挑一站：根源、摇滚、律动、今天。",["Intro","A1","B1","C2","D2"]],
  ["吉他的路","从三个和弦，一路放大到失真的墙，再回到地下室。",["A1","A2","B1","B2","B3","B4","D1"]],
  ["舞池的路","从教堂到舞厅，从唱机到鼓机，节奏怎样接管了一切。",["A1","A4","C1","C2","C3","D2"]],
  ["和声的路","和弦是怎么来的，又怎样变得越来越复杂。",["Intro","A3","A1","A4","B4"]]];
  document.getElementById("routes").innerHTML=R.map(([t,p,cs])=>`<div class="route"><b>${t}</b><p>${p}</p><div class="chips">${cs.map((k,i)=>`${i?"<i>→</i>":""}<a href="${href(BY[k])}"${tgt} style="--sc:${k==="Intro"?"var(--ink)":SC(k[0])}">${k==="Intro"?"Intro":k} ${BY[k].name}</a>`).join("")}</div></div>`).join("");})();

/* 地图 */
const NS="http://www.w3.org/2000/svg";
function S(p,tag,a,txt){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e;}

/* 封面上的地名，坐标与底图黑点对齐 */
const coverLabels=document.getElementById("cover-labels");
const coverPoints=[
  ["A1",372,46],["A2",430,120,-1],["A3",570,122],["A4",179,217,-1,26],
  ["B1",465,255],["B2",282,260,-1],["B3",606,328],["B4",513,371],
  ["C1",289,436,-1],["C2",447,456,1,42],["C3",329,506],
  ["D1",203,595,-1],["D2",303,700]
];
coverPoints.forEach(([code,x,y,side=1,gap=15])=>{
  S(coverLabels,"text",{x:x+side*gap,y,"text-anchor":side===1?"start":"end"},BY[code].name);
});

(()=>{const g=document.getElementById("map-fig");if(!g)return;const COL=[[170,"SIDE A · 根源","A"],[320,"SIDE B · 摇滚家族","B"],[470,"SIDE C · 律动","C"],[610,"SIDE D · 今天","D"]];
  COL.forEach(([x,t,c])=>{S(g,"rect",{x:x-68,y:34,width:136,height:356,rx:6,style:`fill:var(--${c})`,opacity:.08});S(g,"text",{x,y:24,"text-anchor":"middle",class:"sv-t",style:"font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em"},t);});
  const N={A1:[0,75],A2:[0,155],A3:[0,235],A4:[0,315],B1:[1,95],B2:[1,175],B3:[1,255],B4:[1,335],C1:[2,115],C2:[2,205],C3:[2,295],D1:[3,140],D2:[3,265]};
  const P=k=>[COL[N[k][0]][0],N[k][1]];
  const E=[["A1","B1"],["A1","A4",-1],["A1","C1"],["A2","B1"],["A2","D1"],["A3","B4"],["A4","C1"],["A4","C2"],["B1","B2",1],["B1","B3",-1],["B2","B4",1],["B3","D1"],["C1","C2",1],["C1","C3",-1],["C2","D2"],["C3","D2"],["D1","D2",1]];
  E.forEach(([a,b,side])=>{const [x1,y1]=P(a),[x2,y2]=P(b);let d;if(x1===x2){const cx=x1+(side||1)*84;d=`M ${x1} ${y1} Q ${cx} ${(y1+y2)/2} ${x2} ${y2}`;}else{const mx=(x1+x2)/2;d=`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;}S(g,"path",{d,class:"sv-l","stroke-width":1.4,opacity:.45});});
  const start=S(g,"a",{href:href(BY.Intro),class:"node"});S(start,"circle",{cx:46,cy:200,r:30,style:"fill:var(--ink)"});S(start,"text",{x:46,y:205,"text-anchor":"middle",style:"fill:var(--paper);font-size:13px;font-weight:900"},"怎么听");
  ["A1","A2","A3","A4"].forEach(k=>S(g,"path",{d:`M 76 200 L ${P(k)[0]-56} ${P(k)[1]}`,class:"sv-l","stroke-dasharray":"3 4",opacity:.5}));
  Object.keys(N).forEach(k=>{const [x,y]=P(k),c=BY[k],t=`${k} ${c.name}`,w=t.length>6?124:104;const a=S(g,"a",{href:href(c),class:"node"});
    S(a,"rect",{x:x-w/2,y:y-15,width:w,height:30,rx:4,style:`fill:var(--${k[0]})`});S(a,"text",{x,y:y+5,"text-anchor":"middle",class:"sv-on",style:`font-size:12px;font-weight:900;${k[0]==="B"?"fill:var(--paper)":""}`},t);});
})();
