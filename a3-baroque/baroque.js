/* ================= 巴洛克：乐器 ================= */
Object.assign(INST,{
  hp:{bright:.995,decay:.9966,dur:1.8,vol:.24,peak:[2800,4]},
  hp4:{bright:.998,decay:.995,dur:1.1,vol:.11,peak:[4000,3]},
  pk:{bright:.92,decay:.9992,dur:1.8,vol:.16,drive:14,lp:3600}
});
INST.ac.peak=[220,5];
function hpsi(t,m,o={}){pluck(t,m,"hp",{vol:o.vol||1,dur:o.dur});pluck(t+.003,m+12,"hp4",{vol:o.vol||1,dur:o.dur?Math.min(o.dur,1.1):undefined});}
function hchord(t,notes,o={}){notes.forEach((m,k)=>hpsi(t+k*(o.spread==null?.028:o.spread),m,{vol:(o.vol||.75)}));}
/* 拉弦乐器：o.ens 多把齐奏，o.vib 揉弦深度（巴洛克默认很小） */
function bow(t,midi,dur,o={}){
  const a=A(),f=mf(midi),n=o.ens?3:2,oscs=[];
  for(let k=0;k<n;k++){const x=a.createOscillator();x.type="sawtooth";const ff=f*(1+(k-(n-1)/2)*(o.ens?.004:.0025));
    if(o.from){x.frequency.setValueAtTime(ff*Math.pow(2,o.from/12),t);x.frequency.linearRampToValueAtTime(ff,t+(o.glide||.08));}else x.frequency.setValueAtTime(ff,t);oscs.push(x);}
  const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=5.6;lg.gain.setValueAtTime(0,t);lg.gain.setValueAtTime(0,t+Math.min(.25,dur*.5));lg.gain.linearRampToValueAtTime(o.vib==null?5:o.vib,t+Math.min(.6,dur));lfo.connect(lg);oscs.forEach(x=>lg.connect(x.detune));
  const low=midi<57,hp=a.createBiquadFilter();hp.type="highpass";hp.frequency.value=low?60:180;
  const p1=a.createBiquadFilter();p1.type="peaking";p1.frequency.value=low?260:560;p1.Q.value=1.1;p1.gain.value=5;
  const p2=a.createBiquadFilter();p2.type="peaking";p2.frequency.value=low?1500:2800;p2.Q.value=1.2;p2.gain.value=low?3:5;
  const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=o.lp||(low?2600:5200);
  const g=a.createGain(),v=(o.vol||1)*(o.ens?.05:.075)*(low?1.6:1),at=o.att||.06;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*1.15,t+at);g.gain.linearRampToValueAtTime(v,t+at+.08);g.gain.setValueAtTime(v,t+Math.max(at+.09,dur-.08));g.gain.linearRampToValueAtTime(0,t+dur);
  oscs.forEach(x=>x.connect(hp));hp.connect(p1).connect(p2).connect(lp).connect(g).connect(bus);
  [...oscs,lfo].forEach(x=>{x.start(t);x.stop(t+dur+.05);track(x);});
}
function piano(t,midi,dur,vel=.6){
  const a=A(),f=mf(midi),g=a.createGain(),lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.value=700+vel*4200;
  [[f,"triangle",1],[f*2,"sine",.28],[f*3,"sine",.1],[f*1.002,"sine",.5]].forEach(([fr,ty,am])=>{const o=a.createOscillator(),og=a.createGain();o.type=ty;o.frequency.value=fr;og.gain.value=am;o.connect(og).connect(lp);o.start(t);o.stop(t+dur+.1);track(o);});
  const v=.04+vel*.26,dec=Math.min(dur,1.2+(72-Math.min(midi,72))*.03);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.005);g.gain.exponentialRampToValueAtTime(v*.25,t+dec*.4);g.gain.exponentialRampToValueAtTime(.0008,t+dur);
  lp.connect(g).connect(bus);
}
function organ(t,midi,dur,o={}){
  const a=A(),f=mf(midi),g=a.createGain(),stops=o.stops||[[1,.5],[2,.3]],v=(o.vol||1)*.11;
  stops.forEach(([h,am])=>{const x=a.createOscillator();x.type="sine";x.frequency.value=f*h;const xg=a.createGain();xg.gain.value=am;x.connect(xg).connect(g);x.start(t);x.stop(t+dur+.1);track(x);});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.setValueAtTime(v,t+dur-.06);g.gain.linearRampToValueAtTime(0,t+dur);g.connect(bus);
  const n=a.createBufferSource();n.buffer=noise();const bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=Math.min(6000,f*4);bp.Q.value=4;const ng=a.createGain();ng.gain.setValueAtTime(.05*(o.vol||1),t);ng.gain.exponentialRampToValueAtTime(.001,t+.06);n.connect(bp).connect(ng).connect(bus);n.start(t);n.stop(t+.08);track(n);
}
function recorder(t,midi,dur,o={}){
  const a=A(),f=mf(midi),x=a.createOscillator(),x2=a.createOscillator();x.type="sine";x2.type="triangle";x.frequency.value=f;x2.frequency.value=f;
  const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=5;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(dur>.6?9:0,t+Math.min(.5,dur));lfo.connect(lg);lg.connect(x.detune);lg.connect(x2.detune);
  const g=a.createGain(),v=(o.vol||1)*.12;const m2=a.createGain();m2.gain.value=.18;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.035);g.gain.setValueAtTime(v,t+dur-.05);g.gain.linearRampToValueAtTime(0,t+dur);
  x.connect(g);x2.connect(m2).connect(g);
  const n=a.createBufferSource();n.buffer=noise();n.loop=true;const bp=a.createBiquadFilter();bp.type="bandpass";bp.frequency.value=f*2;bp.Q.value=2;const ng=a.createGain();ng.gain.value=.012*(o.vol||1);n.connect(bp).connect(ng).connect(g);
  g.connect(bus);[x,x2,lfo].forEach(z=>{z.start(t);z.stop(t+dur+.05);track(z);});n.start(t);n.stop(t+dur+.05);track(n);
}
function trumpet(t,midi,dur,o={}){
  const a=A(),f=mf(midi),x=a.createOscillator();x.type="sawtooth";x.frequency.setValueAtTime(f*.985,t);x.frequency.linearRampToValueAtTime(f,t+.04);
  const lp=a.createBiquadFilter();lp.type="lowpass";lp.Q.value=2;lp.frequency.setValueAtTime(500,t);lp.frequency.linearRampToValueAtTime(3600,t+.05);lp.frequency.linearRampToValueAtTime(2600,t+.25);
  const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=1300;pk.gain.value=6;
  const g=a.createGain(),v=(o.vol||1)*.12;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.setValueAtTime(v*.85,t+Math.max(.05,dur-.06));g.gain.linearRampToValueAtTime(0,t+dur);
  x.connect(lp).connect(pk).connect(g).connect(bus);x.start(t);x.stop(t+dur+.05);track(x);
}
function crash(t,v=1){const a=A(),n=a.createBufferSource();n.buffer=noise();const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=4500;const g=a.createGain();g.gain.setValueAtTime(.25*v,t);g.gain.exponentialRampToValueAtTime(.001,t+1.3);n.connect(f).connect(g).connect(bus);n.start(t);n.stop(t+1.35);track(n);}

/* ================= 和弦工具 ================= */
const PCN={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function chordPcs(name){let i=1,r=PCN[name[0]];if(name[1]==="#"){r++;i++;}else if(name[1]==="b"){r--;i++;}const rest=name.slice(i),m=rest.startsWith("m"),q=rest.includes("7");
  const pcs=[r,r+(m?3:4),r+7];if(q)pcs.push(r+10);return pcs.map(x=>(x+12)%12);}
function place(pcs,lo,hi){const out=[];for(let m=lo;m<hi;m++)if(pcs.includes(m%12))out.push(m);return out;}
function rootNear(name,lo){const p=chordPcs(name)[0];let m=lo;while(m%12!==p)m++;return m;}
const bt=b=>60/b;
function stripNear(btn){const lab=btn.closest(".lab");return lab?lab.querySelector("[data-strip]"):null;}

/* ================= 示例 ================= */
const DEMOS={};
/* 通奏低音 */
const CB_N=[50,49,47,45,43,42,43,45],CB_C=["D","A","Bm","F#m","G","D","G","A7"];
const CONT_MEL=[[0,78,1],[1,76,1],[2,74,1],[3,73,1],[4,71,.5],[4.5,73,.5],[5,74,1],[6,71,.5],[6.5,73,.5],[7,76,1]];
function contDemo(t,layer){const beat=bt(76);
  for(let p=0;p<2;p++){const tp=t+p*8*beat;
    CB_N.forEach((m,i)=>{const tb=tp+i*beat;bow(tb,m,beat*.92,{vol:1.1,att:.04,vib:0});
      if(layer>=2){hpsi(tb,m-12,{vol:.7});hchord(tb+.02,place(chordPcs(CB_C[i]),62,75).slice(0,3),{vol:.6});}});
    if(layer>=3)CONT_MEL.forEach(([b,m,d])=>bow(tp+b*beat,m,d*beat*.96,{vol:1,vib:4,att:.04}));}
  const end=t+16*beat;bow(end,38,beat*3,{vol:1.1,vib:0});if(layer>=2){hpsi(end,38,{vol:.8});hchord(end+.02,[62,66,69,74],{vol:.65,spread:.05});}if(layer>=3)bow(end,74,beat*3,{vol:1,vib:6});
  return 19*beat+.6;}
DEMOS["cont-bass"]=t=>contDemo(t,1);DEMOS["cont-harp"]=t=>contDemo(t,2);DEMOS["cont-full"]=t=>contDemo(t,3);
/* 卡农（帕赫贝尔，公有领域） */
const CN_B=[50,45,47,42,43,38,43,45],CN_C=["D","A","Bm","F#m","G","D","G","A"];
const CN_V1=[78,76,74,73,71,69,71,73],CN_V2=[74,73,71,69,67,66,67,64];
function canonBass(tc,beat,chords){CN_B.forEach((m,i)=>{const tb=tc+i*beat;bow(tb,m,beat*.95,{vol:1.1,vib:0,att:.05});hpsi(tb,m,{vol:.55});
  if(chords){hchord(tb+.03,place(chordPcs(CN_C[i]),62,75).slice(0,3),{vol:.5,spread:.04});bow(tb,place(chordPcs(CN_C[i]),57,69)[1],beat*.98,{ens:1,vol:.5,vib:2,att:.15});}});}
function canonVoice(tc,beat,line,o={}){line.forEach((m,i)=>bow(tc+i*beat,m,beat*.98,{vol:o.vol||1,vib:6,att:.07}));}
DEMOS["canon-bass"]=(t,btn)=>{const beat=bt(66),cyc=8*beat;for(let c=0;c<2;c++)canonBass(t+c*cyc,beat,false);return 2*cyc+.8;};
DEMOS["canon-chords"]=(t,btn)=>{const beat=bt(66),cyc=8*beat;for(let c=0;c<2;c++)canonBass(t+c*cyc,beat,true);hchord(t+2*cyc,[62,66,69,74],{vol:.6,spread:.05});bow(t+2*cyc,38,2.4,{vol:1,vib:0});return 2*cyc+2.6;};
DEMOS["canon-1"]=(t,btn)=>{const beat=bt(66),cyc=8*beat;canonBass(t,beat,true);for(let c=1;c<3;c++){canonBass(t+c*cyc,beat,true);canonVoice(t+c*cyc,beat,c===1?CN_V1:CN_V2);}
  bow(t+3*cyc,38,2.4,{vol:1,vib:0});hchord(t+3*cyc,[62,66,69,74],{vol:.6});bow(t+3*cyc,74,2.4,{vol:1,vib:8});return 3*cyc+2.6;};
DEMOS["canon-3"]=(t,btn)=>{const beat=bt(72),cyc=8*beat,N=5;for(let c=0;c<N;c++)canonBass(t+c*cyc,beat,true);
  const seq=c=>c%2===0?CN_V1:CN_V2;
  for(let v=0;v<3;v++)for(let c=v+1;c<N;c++)canonVoice(t+c*cyc,beat,seq(c-v-1),{vol:[1,.85,.75][v]});
  lightStrip(stripNear(btn),t,4*beat,10);const end=t+N*cyc;bow(end,38,3,{vol:1,vib:0});hchord(end,[62,66,69,74],{vol:.6,spread:.06});[78,74,69].forEach(m=>bow(end,m,3,{vol:.8,vib:8}));return N*cyc+3.2;};
/* 哀歌低音 */
function groundDemo(t,bass,chords){const beat=bt(60);let x=t;
  bass.forEach((m,i)=>{const d=2*beat;bow(x,m,d*.97,{vol:1.2,vib:0,att:.08});hpsi(x,m-12,{vol:.5});const up=place(chordPcs(chords[i]),62,75).slice(0,3);hchord(x+.03,up,{vol:.45,spread:.06});up.forEach(n=>bow(x,n,d*.98,{ens:1,vol:.55,vib:3,att:.2}));x+=d;});
  return x-t+.8;}
DEMOS.lament=t=>groundDemo(t,[55,54,53,52,51,50,46,48,50,43],["Gm","D","Dm","C","Cm","D","Bb","Cm","D","Gm"]);
DEMOS["plain-desc"]=t=>groundDemo(t,[55,53,51,50,46,48,50,43],["Gm","F","Cm","D","Bb","Cm","D","Gm"]);
/* 力度 */
const SCALE_D=[62,64,66,67,69,71,73,74];
DEMOS["dyn-harpsi"]=t=>{SCALE_D.forEach((m,i)=>hpsi(t+i*.42,m,{vol:1}));hchord(t+8*.42,[62,66,69,74],{vol:1});return 5.4;};
DEMOS["dyn-piano"]=t=>{SCALE_D.forEach((m,i)=>piano(t+i*.42,m,1.2,.08+i*.13));[62,66,69,74].forEach((m,k)=>piano(t+8*.42+k*.01,m,2.2,1));return 5.8;};
const TER=[[0,79,1],[1,78,.5],[1.5,76,.5],[2,74,1],[3,71,1],[4,72,1],[5,76,1],[6,74,2]],TER_C=["G","G","G","G","C","C","D","D"];
DEMOS.terrace=t=>{const beat=bt(96);
  for(let r=0;r<2;r++){const tl=t+r*16*beat,te=tl+8*beat;
    TER.forEach(([b,m,d])=>{bow(tl+b*beat,m,d*beat*.95,{ens:1,vol:1.2,vib:3});hpsi(te+b*beat,m,{vol:1});});
    for(let b=0;b<8;b++){const ch=TER_C[b],r0=rootNear(ch,43);bow(tl+b*beat,r0,beat*.92,{vol:1.2,vib:0});hchord(tl+b*beat+.02,place(chordPcs(ch),55,67),{vol:.55,spread:.02});bow(tl+b*beat,place(chordPcs(ch),62,72)[0],beat*.95,{ens:1,vol:.5,vib:0});
      if(b%2===0)hpsi(te+b*beat,r0,{vol:.7});}}
  const end=t+32*beat;hchord(end,[55,59,62,67],{vol:.8});return 32*beat+1.6;};
/* 乐器 */
DEMOS["i-harpsi"]=t=>{const s=bt(100)/4;let k=0;["D","G","A7","D"].forEach((ch,i)=>{const tn=place(chordPcs(ch),62,80).slice(0,4),pat=[tn[0],tn[1],tn[2],tn[3]||tn[0]+12,tn[2],tn[1]];for(let r=0;r<16;r++)hpsi(t+(i*16+r)*s,pat[r%pat.length],{vol:.95});hpsi(t+i*16*s,rootNear(ch,38),{vol:.8});});hchord(t+64*s,[50,62,66,69,74],{vol:.9,spread:.05});return 64*s+1.8;};
DEMOS["i-organ"]=t=>{const d=1.6,regs=[[[1,.5],[2,.25]],[[1,.45],[2,.3],[4,.2]],[[1,.4],[2,.32],[3,.14],[4,.22],[6,.08],[8,.1]]];
  ["D","G","A","D"].forEach((ch,i)=>{const st=regs[Math.min(2,i)];place(chordPcs(ch),57,70).slice(0,3).forEach(m=>organ(t+i*d,m,d*.98,{stops:st}));organ(t+i*d,rootNear(ch,38),d*.98,{stops:[[1,.6],[2,.3]],vol:1.2});});
  [50,57,62,66].forEach(m=>organ(t+4*d,m,2.4,{stops:regs[2]}));organ(t+4*d,38,2.4,{stops:[[1,.6],[2,.3]],vol:1.2});return 4*d+2.6;};
DEMOS["i-violin"]=t=>{const e=bt(112)/2;[74,76,78,79,81,79,78,76,78,74,71,74,79,78,76,74,73,76,74].forEach((m,i)=>bow(t+i*e,m,e*(i===18?4:.95),{vol:1,vib:i===18?7:0,att:.025}));return 23*e+.6;};
DEMOS["i-cello"]=t=>{const b=bt(80);[50,52,54,55,57,55,54,52,50,49,47,45,43,45,38].forEach((m,i)=>bow(t+i*b*.5,m,b*(i===14?3:.48),{vol:1.2,vib:i===14?5:0,att:.03}));return 7*b+3*b+.4;};
DEMOS["i-recorder"]=t=>{const b=bt(84);[[0,79,1],[1,81,.5],[1.5,79,.5],[2,78,1],[3,76,1],[4,74,1.5],[5.5,76,.5],[6,78,2],[8,79,1],[9,76,1],[10,74,2]].forEach(([s,m,d])=>recorder(t+s*b,m,d*b*.95));hchord(t,[55,59,62],{vol:.4});hchord(t+4*b,[50,54,57],{vol:.4});hchord(t+8*b,[55,59,62],{vol:.4});return 12*b+.5;};
DEMOS["i-trumpet"]=t=>{const b=bt(100);[[0,69,.5],[.5,74,.5],[1,78,1],[2,74,.5],[2.5,78,.5],[3,81,2],[5,78,.5],[5.5,81,.5],[6,74,2]].forEach(([s,m,d])=>trumpet(t+s*b,m,d*b*.92));[[0,"D"],[3,"D"],[5,"A"],[6,"D"]].forEach(([s,ch])=>{hchord(t+s*b,place(chordPcs(ch),57,69),{vol:.55});bow(t+s*b,rootNear(ch,38),b*.9,{vol:1,vib:0});});return 8*b+.6;};
/* 两只老虎（Frère Jacques，公有领域） */
const RND=[[[0,72,1],[1,74,1],[2,76,1],[3,72,1]],[[0,72,1],[1,74,1],[2,76,1],[3,72,1]],[[0,76,1],[1,77,1],[2,79,2]],[[0,76,1],[1,77,1],[2,79,2]],[[0,79,.5],[.5,81,.5],[1,79,.5],[1.5,77,.5],[2,76,1],[3,72,1]],[[0,79,.5],[.5,81,.5],[1,79,.5],[1.5,77,.5],[2,76,1],[3,72,1]],[[0,72,1],[1,67,1],[2,72,2]],[[0,72,1],[1,67,1],[2,72,2]]];
function roundDemo(t,n){const beat=bt(116),ins=[(x,m,d)=>recorder(x,m,d,{vol:1.1}),(x,m,d)=>bow(x,m-12,d,{vol:.9,vib:3,att:.04}),(x,m,d)=>bow(x,m-24,d,{vol:1,vib:0,att:.04})];
  for(let v=0;v<n;v++)RND.forEach((bar,i)=>bar.forEach(([b,m,d])=>ins[v](t+((v*2+i)*4+b)*beat,m,d*beat*.92)));
  const bars=8+2*(n-1);for(let i=0;i<bars;i++)hchord(t+i*4*beat,[48,55,64],{vol:.35,spread:.05});return bars*4*beat+.6;}
DEMOS.round1=t=>roundDemo(t,1);DEMOS.round3=t=>roundDemo(t,3);
/* 赋格（原创主题） */
const SUBJ=[[0,62,1],[1,69,1],[2,65,.5],[2.5,64,.5],[3,62,.5],[3.5,61,.5],[4,62,1],[5,64,.5],[5.5,65,.5],[6,67,.5],[6.5,65,.5],[7,64,.5],[7.5,62,.5]];
const CS=[[0,77,1],[1,79,1],[2,76,1],[3,77,1],[4,76,1],[5,74,1],[6,77,1],[7,76,.5],[7.5,73,.5]];
function line(t,beat,notes,shift,vol){notes.forEach(([b,m,d])=>hpsi(t+b*beat,m+shift,{vol:vol||1,dur:Math.max(.5,d*beat+.4)}));}
DEMOS.subject=t=>{const beat=bt(96);line(t,beat,SUBJ,0,1.1);hpsi(t+8*beat,62,{vol:1});return 9*beat+.8;};
DEMOS.fugue=t=>{const beat=bt(96);
  line(t,beat,SUBJ,0,1);                                   // 声部二：主题
  line(t+8*beat,beat,SUBJ,7,1);                            // 声部一：答题（高五度）
  line(t+8*beat,beat,CS,-7,.9);                            // 声部二：对题
  line(t+16*beat,beat,SUBJ,-12,1.1);                       // 声部三：主题（低八度）
  line(t+16*beat,beat,CS,-5,.85);                          // 声部一：对题（移位）
  line(t+16*beat,beat,[[0,70,2],[2,69,2],[4,67,2],[6,65,1],[7,64,1]],0,.8);
  const c=t+24*beat;line(c,beat,[[0,73,1],[1,76,1],[2,74,2]],0,1);line(c,beat,[[0,69,2],[2,65,2]],0,.9);line(c,beat,[[0,45,1],[1,45,1],[2,38,2]],0,1.1);hpsi(c+2*beat,50,{vol:.9});
  return 28*beat+1.4;};
/* 装饰音 */
const ORN_C=["G","G","G","D","G","D","G","G"];
function ornBack(t,beat){ORN_C.forEach((ch,i)=>{hpsi(t+i*beat,rootNear(ch,43),{vol:.7});hchord(t+i*beat+.02,place(chordPcs(ch),55,67),{vol:.4,spread:.02});});hpsi(t+8*beat,43,{vol:.7});}
DEMOS["orn-plain"]=t=>{const beat=bt(72);ornBack(t,beat);[[0,74,1],[1,72,1],[2,71,1],[3,69,1],[4,71,2],[6,67,2]].forEach(([b,m,d])=>bow(t+b*beat,m,d*beat*.95,{vol:1,vib:0,att:.04}));return 8*beat+.8;};
const ORN_F=[[0,76,.5],[.5,74,.5],[1,72,.12],[1.12,71,.12],[1.24,72,.76],[2,71,.5],[2.5,72,.25],[2.75,71,.25],[3,69,1],[4,72,.125],[4.125,71,.125],[4.25,72,.125],[4.375,71,.125],[4.5,72,.125],[4.625,71,.125],[4.75,72,.125],[4.875,71,.125],[5,69,.5],[5.5,71,.5],[6,67,2]];
DEMOS["orn-fancy"]=t=>{const beat=bt(72);ornBack(t,beat);ORN_F.forEach(([b,m,d])=>bow(t+b*beat,m,d*beat*.97,{vol:1,vib:d>1?6:0,att:.02}));return 8*beat+.8;};
/* 马达节奏 */
DEMOS.motor=t=>{const beat=bt(120),s=beat/4,CH=["Am","Dm","G","C","F","Dm","E","Am"];
  CH.forEach((ch,i)=>{const tb=t+i*4*beat,tn=place(chordPcs(ch),69,82).slice(0,3),pat=[tn[0],tn[1],tn[2],tn[1]];
    for(let r=0;r<16;r++)bow(tb+r*s,pat[r%4]+(r>=8&&r%4===2?12:0),s*.9,{vol:.75,vib:0,att:.012});
    for(let k=0;k<8;k++)bow(tb+k*beat/2,rootNear(ch,40)+(k%2?12:0),beat*.42,{vol:1,vib:0,att:.02});
    for(let k=0;k<4;k++)hchord(tb+k*beat,place(chordPcs(ch),57,69).slice(0,3),{vol:.5,spread:.01});});
  const end=t+32*beat;[57,64,69,72].forEach(m=>bow(end,m,1.4,{vol:.9,vib:4}));bow(end,45,1.4,{vol:1.1});hchord(end,[57,64,69,72],{vol:.7});return 32*beat+1.6;};
/* 宣叙调与咏叹调 */
DEMOS.recit=t=>{const R=[[0,72,.16],[.17,72,.16],[.34,72,.16],[.51,72,.32],[.85,74,.18],[1.05,72,.16],[1.23,71,.4],[1.9,71,.16],[2.07,71,.16],[2.24,72,.16],[2.41,74,.32],[2.75,74,.16],[2.93,76,.4],[3.6,74,.16],[3.77,74,.16],[3.94,72,.2],[4.16,71,.3],[4.5,69,.5],[5.05,67,.7]];
  R.forEach(([s,m,d])=>voice(t+s,m,d,{from:0,glide:.03,vibDepth:0,vowel:"a",vol:.9}));
  hchord(t,[55,59,62],{vol:.7});bow(t,43,1.8,{vol:.9,vib:0});hchord(t+1.85,[54,57,60,62],{vol:.7});bow(t+1.85,50,1.7,{vol:.9,vib:0});hchord(t+4.45,[54,57,60],{vol:.7});bow(t+4.45,50,.55,{vol:.9,vib:0});hchord(t+5.05,[55,59,62],{vol:.7});bow(t+5.05,43,1,{vol:.9,vib:0});return 6.4;};
const ARIA=[[0,67,2],[2,70,1],[3,74,2],[5,72,1],[6,75,2],[8,72,1],[9,74,1.5],[10.5,72,.5],[11,69,1],[12,70,2],[14,67,1],[15,66,2],[17,69,1],[18,67,3]],ARIA_C=["Gm","Gm","Cm","D","Gm","D","Gm"];
DEMOS.aria=t=>{const beat=bt(63);ARIA.forEach(([b,m,d],i)=>voice(t+b*beat,m,d*beat*.97,{from:-1,glide:.12,vibDepth:30,vowel:i%3===2?"o":"a",vol:.95}));
  ARIA_C.forEach((ch,i)=>{const tb=t+i*3*beat,up=place(chordPcs(ch),55,67).slice(0,3);bow(tb,rootNear(ch,43),3*beat*.97,{vol:1,vib:2});hchord(tb,up,{vol:.4,spread:.05});up.forEach(m=>bow(tb,m,3*beat*.98,{ens:1,vol:.4,vib:3,att:.25}));});
  return 21*beat+.8;};
/* 回归段 */
const RIT=[79,78,79,74,71,74,67,71,72,76,74,72,71,69,67,66];
const RIT_C=["G","G","G","G","C","D","G","G"];
function tutti(t,beat,shift){RIT.forEach((m,k)=>bow(t+k*beat/2,m+shift,beat*.46,{ens:1,vol:1.3,vib:0,att:.02}));
  for(let q=0;q<8;q++){const ch=shiftChord(RIT_C[q],shift),r=rootNear(ch,40);bow(t+q*beat,r,beat*.9,{vol:1.2,vib:0});bow(t+q*beat+beat/2,r+12,beat*.4,{vol:.8,vib:0});hchord(t+q*beat+.02,place(chordPcs(ch),57,69).slice(0,3),{vol:.6,spread:.015});}}
const NOTE_NAMES=["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"];
function shiftChord(ch,s){const p=chordPcs(ch)[0],m=ch.replace(/^[A-G][#b]?/,"");return NOTE_NAMES[(p+s+120)%12]+m;}
function solo(t,beat,chords){const s=beat/4;chords.forEach((ch,i)=>{const tb=t+i*2*beat,tn=place(chordPcs(ch),74,88).slice(0,3),pat=[tn[0],tn[1],tn[2],tn[1]+(i%2?0:0)];
  for(let r=0;r<8;r++)bow(tb+r*s,pat[r%4]+(r===4?(tn[2]+12-pat[0]>12?0:0):0),s*.92,{vol:.95,vib:0,att:.015});
  bow(tb,rootNear(ch,40),beat*1.8,{vol:.8,vib:0});hchord(tb,place(chordPcs(ch),57,69).slice(0,3),{vol:.45});});}
DEMOS.ritornello=(t,btn)=>{const beat=bt(116),seg=8*beat;
  tutti(t,beat,0);solo(t+seg,beat,["G","Em","A","A7"]);tutti(t+2*seg,beat,-5);solo(t+3*seg,beat,["D","Bm","D7","D7"]);tutti(t+4*seg,beat,0);
  lightStrip(stripNear(btn),t,seg,5);const end=t+5*seg;bow(end,67,1.6,{ens:1,vol:1.2,vib:4});bow(end,43,1.6,{vol:1.2});hchord(end,[55,59,62,67],{vol:.8});return 5*seg+1.8;};
/* 卡农和弦的三个时代 */
const POP_MEL=[[0,78,1.5],[1.5,76,.5],[2,76,1],[3,73,1],[4,74,1.5],[5.5,73,.5],[6,73,2],[8,71,1],[9,74,1],[10,78,1],[11,74,1],[12,79,1.5],[13.5,78,.5],[14,76,2]];
DEMOS["canon-pop"]=t=>{const beat=bt(80),cyc=16*beat;
  for(let c=0;c<2;c++){const tc=t+c*cyc;CN_C.forEach((ch,i)=>{const tb=tc+i*2*beat,up=place(chordPcs(ch),57,70).slice(0,3),r=rootNear(ch,38);
    piano(tb,r,2*beat,.5);piano(tb,r+12,2*beat,.35);up.forEach((m,k)=>{piano(tb+beat*.5,m,beat*1.4,.32);piano(tb+beat*1.5,m,beat*.6,.25);});
    pluck(tb,r,"bass",{vol:.9,dur:2*beat});
    if(c===1){kick(tb,.8);snare(tb+beat,.5);for(let k=0;k<4;k++)hat(tb+k*beat/2,.5);}});
    POP_MEL.forEach(([b,m,d])=>voice(tc+b*beat,m-12,d*beat*.95,{from:-1,glide:.1,vibDepth:16,vowel:"a",vol:.85}));}
  piano(t+2*cyc,38,2.5,.6);[62,66,69,74].forEach(m=>piano(t+2*cyc,m,2.5,.5));return 2*cyc+2.6;};
DEMOS["canon-rock"]=t=>{const beat=bt(120),cyc=16*beat,PR=[50,45,47,42,43,50,43,45];crash(t);
  for(let c=0;c<2;c++){const tc=t+c*cyc;PR.forEach((r,i)=>{const tb=tc+i*2*beat;
    for(let k=0;k<4;k++)strum(tb+k*beat/2,[r,r+7,r+12],"pk",{vol:1,mute:beat*.45,spread:.004});
    for(let k=0;k<4;k++){pluck(tb+k*beat/2,r-12,"bass",{vol:.9,mute:beat*.45});hat(tb+k*beat/2,.8);}
    kick(tb);snare(tb+beat,1);kick(tb+beat*1.5,.7);
    const mel=c===0?CN_V1:CN_V2;pluck(tb,mel[i]+12,"dr",{vol:1.2,from:i%2?-1:0,glide:.12,vib:1,vibAt:.4,dur:2*beat+.4});});}
  const end=t+2*cyc;crash(end,1.2);kick(end);strum(end,[50,57,62],"pk",{vol:1.2,dur:2});pluck(end,86,"dr",{vol:1.2,vib:1,dur:2.2});return 2*cyc+2.2;};

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
  {side:"A",q:"Monteverdi L'Orfeo Toccata",title:"《奥菲欧》序曲（Toccata）",by:"蒙特威尔第",yr:"1607",style:"早期歌剧",
   txt:"第一部成熟歌剧的开场。一段号角般的音乐重复三遍，据说是用来提醒观众：演出要开始了。",
   listen:["几乎只有一个和弦，靠小号和鼓的节奏撑起来","对比后面的作品：巴洛克刚开始时，和声还很简单"]},
  {side:"A",q:"Purcell Dido's Lament When I am laid in earth",title:"When I am laid in earth（狄朵的哀歌）",by:"珀塞尔",yr:"约 1689",style:"歌剧 · 哀歌低音",
   txt:"歌剧《狄朵与埃涅阿斯》里女王临死前的咏叹调。下面那条半音下行的低音从头到尾重复，上面的歌声越来越悲伤。",
   listen:["先只听低音：数一数它重复了几次","对照实验 III 的“哀歌低音”"]},
  {side:"A",q:"Pachelbel Canon in D",title:"D 大调卡农",by:"帕赫贝尔",yr:"约 1680–1706",style:"卡农 · 固定低音",
   txt:"本章的主角之一。八个低音，三把小提琴，二十多次变奏。注意它的原版速度通常比婚礼上的慢。",
   listen:["跟着低音数 1 到 8","找到第二、第三把小提琴进来的时刻"]},
  {side:"A",q:"Vivaldi Four Seasons Spring Allegro",title:"《四季》·“春” 第一乐章",by:"维瓦尔第",yr:"1725",style:"协奏曲 · 标题音乐",
   txt:"乐队奏出春天的主题，独奏小提琴模仿鸟叫、流水和雷雨。最容易上手的回归段形式例子。",
   listen:["开头的主题一共回来了几次？","独奏小提琴什么时候在学鸟叫？"]},
  {side:"A",q:"Bach Brandenburg Concerto No. 3 Allegro",title:"《勃兰登堡协奏曲》第三号 第一乐章",by:"巴赫",yr:"1721",style:"协奏曲",
   txt:"只有弦乐和通奏低音，三组小提琴、三组中提琴、三组大提琴彼此传球，马达节奏一刻不停。",
   listen:["听那种持续不断的推进感，对照实验 IX","各声部像在接力传同一个动机"]},
  {side:"A",q:"Bach Toccata and Fugue in D minor BWV 565",title:"D 小调托卡塔与赋格",by:"传为巴赫",yr:"18 世纪初",style:"管风琴",
   txt:"恐怖片里常用的那段管风琴开头。值得一提的是，学者们至今对它是不是巴赫写的还有争论。",
   listen:["开头的托卡塔像即兴，后面的赋格才是严格的对位","注意管风琴可以把一个音无限延长"]},
  {side:"B",q:"Bach Cello Suite No. 1 Prelude",title:"无伴奏大提琴组曲第一号 · 前奏曲",by:"巴赫",yr:"约 1720",style:"独奏",
   txt:"只有一把大提琴，却能同时听出低音、和声和旋律：靠的是快速的分解和弦。",
   listen:["一把琴，怎么让你“听见”和弦？","对比实验 I：一个人同时扮演了通奏低音和旋律"]},
  {side:"B",q:"Bach Air on the G String Orchestral Suite No. 3",title:"G 弦上的咏叹调",by:"巴赫",yr:"约 1730",style:"管弦乐组曲",
   txt:"原本是《第三号管弦乐组曲》里的慢乐章。低音一步一步往下走，上面的旋律长长地延展。",
   listen:["低音像在走路，一拍一步","练习 4 会把它和一首 1967 年的流行歌对比"]},
  {side:"B",q:"Bach Goldberg Variations Aria Glenn Gould",title:"哥德堡变奏曲 · 咏叹调",by:"巴赫",yr:"1741",style:"键盘变奏曲",
   txt:"一段咏叹调加三十个变奏，所有变奏都建立在同一个低音和和声框架上。加拿大钢琴家 Glenn Gould 1955 年的录音让它家喻户晓。",
   listen:["可以搜羽管键琴版和钢琴版对比，对照实验 IV","这又是一个“固定低音”的大型版本"]},
  {side:"B",q:"Handel Messiah Hallelujah Chorus",title:"《弥赛亚》· 哈利路亚",by:"亨德尔",yr:"1742",style:"清唱剧",
   txt:"本章讲过的“起立”传统就来自这一段。合唱在齐唱和对位之间来回切换。",
   listen:["“哈利路亚”这个词被重复了多少次？","注意小号和定音鼓在最后进来"]},
  {side:"B",q:"Procol Harum A Whiter Shade of Pale",title:"A Whiter Shade of Pale",by:"Procol Harum",yr:"1967",style:"巴洛克流行",
   txt:"那段管风琴前奏带着明显的巴赫味道，下行的低音线和《G 弦上的咏叹调》很像。",
   listen:["先听管风琴的低音，再回去听《G 弦上的咏叹调》","一首摇滚歌里藏着的通奏低音"]},
  {side:"B",q:"JerryC Canon Rock",title:"Canon Rock",by:"JerryC",yr:"2005",style:"摇滚改编",
   txt:"台湾吉他手 JerryC 的摇滚版《卡农》。网友翻弹的视频在 YouTube 早期疯传，让很多年轻人第一次知道了这串和弦。",
   listen:["和弦进行和帕赫贝尔一模一样","对照实验 XII 的“摇滚”版本"]}
];
const ICON="M8 5v14l11-7z";
const ROM=["I","II","III","IV","V","VI"];let numA=0,numB=0;
SONGS.forEach(s=>{
  const el=document.createElement("div");el.className="song";const no=ROM[s.side==="A"?numA++:numB++];
  const q=encodeURIComponent(s.q||`${s.title} ${s.by}`);
  const yt=s.yt?`https://www.youtube.com/watch?v=${s.yt}`:`https://www.youtube.com/results?search_query=${q}`;
  el.innerHTML=`<div class="pnum">${no}</div>
  <div><div class="meta"><span class="title">${s.title}</span><span class="by">${s.by}</span><span class="yr">${s.yr}</span><span class="style">${s.style}</span></div>
  <p>${s.txt}</p><ul class="listen">${s.listen.map(x=>`<li>${x}</li>`).join("")}</ul>
  <div class="listen-links"><a class="main" href="${yt}" target="_blank" rel="noopener">${s.yt?"YouTube 官方音源":"YouTube 搜索"}</a>
  <a href="https://music.163.com/#/search/m/?s=${q}&type=1" target="_blank" rel="noopener">网易云</a>
  <a href="https://y.qq.com/n/ryqq/search?w=${q}" target="_blank" rel="noopener">QQ音乐</a></div></div>
  <a class="playlink" href="${yt}" target="_blank" rel="noopener" aria-label="在 YouTube 收听 ${s.title}"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="${ICON}"/></svg></a>`;
  document.getElementById(s.side==="A"?"songsA":"songsB").appendChild(el);
});

/* ================= 原创图解 ================= */
const NS="http://www.w3.org/2000/svg";
function S(p,tag,a,txt){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e;}
/* 图 1 时间轴 */
(()=>{const g=document.getElementById("tl-fig");if(!g)return;const x=y=>40+(y-1500)/400*600;
  S(g,"line",{x1:40,y1:120,x2:640,y2:120,class:"sv-l","stroke-width":1.5});
  for(let y=1500;y<=1900;y+=50){S(g,"line",{x1:x(y),y1:116,x2:x(y),y2:124,class:"sv-l","stroke-width":1});S(g,"text",{x:x(y),y:140,"text-anchor":"middle",class:"sv-m"},String(y));}
  [[1500,1600,"文艺复兴","sv-card"],[1600,1750,"巴洛克","sv-red"],[1750,1820,"古典","sv-card"],[1820,1900,"浪漫","sv-card"]].forEach(([a,b,t,c])=>{S(g,"rect",{x:x(a),y:62,width:x(b)-x(a)-2,height:44,class:c});if(c!=="sv-red")S(g,"rect",{x:x(a),y:62,width:x(b)-x(a)-2,height:44,class:"sv-l","stroke-width":1});
    S(g,"text",{x:(x(a)+x(b))/2,y:89,"text-anchor":"middle",class:c==="sv-red"?"sv-on":"sv-t",style:c==="sv-red"?"font-size:15px":""},t);});
  [[1607,"《奥菲欧》"],[1685,"巴赫、亨德尔出生"],[1750,"巴赫去世"]].forEach(([y,t],i)=>{S(g,"line",{x1:x(y),y1:30+i*0,x2:x(y),y2:62,class:"sv-lr","stroke-width":1.5});S(g,"text",{x:x(y)+4,y:28+(i%2)*14,class:"sv-r"},y+" "+t);});
  [[1500,1644,"明"],[1644,1661,"顺治"],[1661,1722,"康熙"],[1722,1735,"雍正"],[1735,1796,"乾隆"],[1796,1900,"嘉庆 · 道光 · 咸丰 · 同治 · 光绪"]].forEach(([a,b,t],i)=>{const c=t==="康熙"?"sv-must":"sv-soft";S(g,"rect",{x:x(a),y:160,width:x(b)-x(a)-2,height:34,class:c});
    S(g,"text",{x:(x(a)+x(b))/2,y:182,"text-anchor":"middle",class:"sv-t",style:"font-size:"+(x(b)-x(a)<40?"10px":"12.5px")},t);});
  S(g,"text",{x:40,y:218,class:"sv-ts"},"中国");S(g,"text",{x:40,y:56,class:"sv-ts"},"欧洲音乐");
})();
/* 图 2 数字低音 */
(()=>{const g=document.getElementById("fig-bass");if(!g)return;
  const L="CDEFGAB",bottom=110,gap=14,x0=110,cw=58;
  for(let i=0;i<5;i++)S(g,"line",{x1:40,y1:bottom-i*gap,x2:640,y2:bottom-i*gap,class:"sv-l","stroke-width":1});
  S(g,"text",{x:48,y:bottom-gap*2.6,class:"sv-tb",style:"font-size:34px;font-family:serif"},"𝄢");
  const notes=[["D",3,0,""],["C",3,1,"6"],["B",2,0,""],["A",2,0,"6"],["G",2,0,""],["F",2,1,"6"],["G",2,0,""],["A",2,0,"7"],["D",2,0,""]];
  const chords=["D","A/C♯","Bm","F♯m/A","G","D/F♯","G","A7","D"];
  notes.forEach(([l,o,sh,fig],i)=>{const step=(o*7+L.indexOf(l))-(2*7+4),y=bottom-step*gap/2,x=x0+i*cw;
    if(y>bottom+gap/2)for(let ly=bottom+gap;ly<=y+1;ly+=gap)S(g,"line",{x1:x-14,y1:ly,x2:x+14,y2:ly,class:"sv-l","stroke-width":1});
    S(g,"ellipse",{cx:x,cy:y,rx:8,ry:6,class:"sv-ink",transform:`rotate(-20 ${x} ${y})`});S(g,"line",{x1:x+7,y1:y,x2:x+7,y2:y-38,class:"sv-l","stroke-width":1.4});
    if(sh)S(g,"text",{x:x-24,y:y+5,class:"sv-tb",style:"font-size:16px"},"♯");
    if(fig)S(g,"text",{x,y:168,"text-anchor":"middle",class:"sv-r",style:"font-size:16px;font-family:var(--font-mono)"},fig);
    S(g,"text",{x,y:228,"text-anchor":"middle",class:"sv-t",style:"font-weight:700"},chords[i]);});
  S(g,"text",{x:20,y:172,class:"sv-ts"},"数字低音");S(g,"text",{x:20,y:232,class:"sv-ts"},"今天的写法");
  S(g,"line",{x1:20,y1:196,x2:660,y2:196,class:"sv-lline","stroke-width":1,"stroke-dasharray":"4 4"});
  S(g,"text",{x:340,y:258,"text-anchor":"middle",class:"sv-ts"},"“6”的意思：低音上面弹第一转位和弦；“7”：加上七音。没写数字就弹原位三和弦。");
})();
/* 图 3 卡农低音循环 */
(()=>{const g=document.getElementById("canon-fig");if(!g)return;const cx=340,cy=160,R=98;
  S(g,"circle",{cx,cy,r:R,class:"sv-lline","stroke-width":2});
  const nm=["D","A","B","F♯","G","D","G","A"];
  CN_C.forEach((ch,i)=>{const a=-Math.PI/2+i*Math.PI/4,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);
    S(g,"circle",{cx:x,cy:y,r:24,class:i===0?"sv-red":"sv-card"});if(i)S(g,"circle",{cx:x,cy:y,r:24,class:"sv-l","stroke-width":1.5});
    S(g,"text",{x,y:y+6,"text-anchor":"middle",class:i===0?"sv-on":"sv-tb",style:"font-size:17px"},nm[i]);
    const lx=cx+(R+40)*Math.cos(a)*1.25,ly=cy+(R+40)*Math.sin(a);S(g,"text",{x:lx,y:ly+4,"text-anchor":"middle",class:"sv-r"},ch.replace("#","♯"));
    S(g,"text",{x:cx+(R-40)*Math.cos(a),y:cy+(R-40)*Math.sin(a)+4,"text-anchor":"middle",class:"sv-m"},String(i+1));});
  S(g,"text",{x:cx,y:cy-6,"text-anchor":"middle",class:"sv-tb"},"八个低音");S(g,"text",{x:cx,y:cy+16,"text-anchor":"middle",class:"sv-ts"},"转一圈 · 再转一圈");
  S(g,"text",{x:20,y:300,class:"sv-ts"},"黑字：低音　红字：上面对应的和弦");
})();
/* 图 4 力度 */
(()=>{const g=document.getElementById("dyn-fig");if(!g)return;
  const panel=(y0,title,pts)=>{S(g,"text",{x:20,y:y0+14,class:"sv-tb"},title);S(g,"line",{x1:180,y1:y0+80,x2:650,y2:y0+80,class:"sv-l","stroke-width":1});S(g,"line",{x1:180,y1:y0,x2:180,y2:y0+80,class:"sv-l","stroke-width":1});
    S(g,"text",{x:170,y:y0+12,"text-anchor":"end",class:"sv-m"},"强");S(g,"text",{x:170,y:y0+78,"text-anchor":"end",class:"sv-m"},"弱");
    S(g,"path",{d:pts.map((p,i)=>(i?"L":"M")+(180+p[0]*470)+" "+(y0+80-p[1]*72)).join(" "),class:"sv-lr","stroke-width":3,"stroke-linejoin":"round"});};
  panel(20,"阶梯式（巴洛克）",[[0,.85],[.25,.85],[.25,.35],[.5,.35],[.5,.85],[.75,.85],[.75,.35],[1,.35]]);
  panel(130,"渐强渐弱（后来）",[[0,.2],[.45,.9],[.6,.9],[1,.15]]);
  S(g,"text",{x:190,y:32,class:"sv-ts"},"全体齐奏");S(g,"text",{x:300,y:96,class:"sv-ts"},"只剩羽管键琴（回声）");
})();
/* 图 5 赋格 */
(()=>{const g=document.getElementById("fugue-fig");if(!g)return;const x0=110,w=170;
  const rows=[["声部一（高）",[[1,"答题 · A 小调","sv-red"],[2,"对题","sv-soft"]]],["声部二（中）",[[0,"主题 · D 小调","sv-red"],[1,"对题","sv-soft"],[2,"自由声部","sv-card"]]],["声部三（低）",[[2,"主题 · D 小调","sv-red"]]]];
  rows.forEach(([n,cells],r)=>{const y=24+r*56;S(g,"text",{x:20,y:y+26,class:"sv-t"},n);
    cells.forEach(([c,t,cl])=>{const x=x0+c*w;S(g,"rect",{x,y,width:w-8,height:38,class:cl});if(cl!=="sv-red")S(g,"rect",{x,y,width:w-8,height:38,class:"sv-l","stroke-width":1});S(g,"text",{x:x+(w-8)/2,y:y+24,"text-anchor":"middle",class:cl==="sv-red"?"sv-on":"sv-t"},t);});});
  [0,1,2].forEach(c=>S(g,"text",{x:x0+c*w,y:208,class:"sv-m"},`第 ${c*2+1}–${c*2+2} 小节`));
})();
/* 图 6 装饰音 */
(()=>{const g=document.getElementById("orn-fig");if(!g)return;
  const plot=(y0,notes,title,cls)=>{S(g,"text",{x:20,y:y0+40,class:"sv-tb"},title);let d="";notes.forEach(([b,m,dd],i)=>{const x1=140+b*62,x2=140+(b+dd)*62,y=y0+70-(m-66)*5;d+=(i?" L ":"M ")+x1+" "+y+" L "+x2+" "+y;});S(g,"path",{d,class:cls,"stroke-width":3,"stroke-linejoin":"round"});};
  plot(10,[[0,74,1],[1,72,1],[2,71,1],[3,69,1],[4,71,2],[6,67,2]],"乐谱上","sv-ld");
  plot(120,ORN_F,"演奏时","sv-lr");
  S(g,"text",{x:140+0*62,y:120,class:"sv-ts"},"倚音");S(g,"text",{x:140+1*62,y:132,class:"sv-ts"},"波音");S(g,"text",{x:140+4*62,y:126,class:"sv-ts"},"颤音");
})();
/* 图 7 回归段 */
(()=>{const g=document.getElementById("rit-fig");if(!g)return;
  [["乐队","G 大调","T"],["独奏","→ 转调","S"],["乐队","D 大调","T"],["独奏","→ 回来","S"],["乐队","G 大调","T"]].forEach(([a,b,k],i)=>{const x=20+i*130,y=k==="T"?40:90;
    S(g,"rect",{x,y,width:120,height:60,class:k==="T"?"sv-red":"sv-card"});if(k!=="T")S(g,"rect",{x,y,width:120,height:60,class:"sv-l","stroke-width":1.5});
    S(g,"text",{x:x+60,y:y+26,"text-anchor":"middle",class:k==="T"?"sv-on":"sv-tb",style:k==="T"?"font-size:15px":""},a);S(g,"text",{x:x+60,y:y+46,"text-anchor":"middle",class:k==="T"?"sv-on":"sv-ts",style:k==="T"?"font-weight:400;font-size:12px":""},b);});
  S(g,"text",{x:20,y:180,class:"sv-ts"},"红色：回归段（同一段主题，像副歌）　白色：独奏段（像主歌，自由发挥）");
})();
/* 图 8 生卒年 */
(()=>{const g=document.getElementById("life-fig");if(!g)return;const x=y=>150+(y-1650)/120*490;
  for(let y=1650;y<=1770;y+=20){S(g,"line",{x1:x(y),y1:20,x2:x(y),y2:220,class:"sv-lline","stroke-width":1});S(g,"text",{x:x(y),y:240,"text-anchor":"middle",class:"sv-m"},String(y));}
  [["帕赫贝尔",1653,1706,"sv-card"],["维瓦尔第",1678,1741,"sv-card"],["巴赫",1685,1750,"sv-red"],["亨德尔",1685,1759,"sv-card"],["康熙在位",1661,1722,"sv-must"]].forEach(([n,a,b,c],i)=>{const y=30+i*38+(i===4?10:0);
    S(g,"text",{x:20,y:y+18,class:"sv-t",style:"font-weight:700"},n);S(g,"rect",{x:x(a),y,width:x(b)-x(a),height:26,class:c});if(c==="sv-card")S(g,"rect",{x:x(a),y,width:x(b)-x(a),height:26,class:"sv-l","stroke-width":1});
    S(g,"text",{x:x(a)+6,y:y+18,class:c==="sv-red"?"sv-on":"sv-m",style:c==="sv-red"?"font-weight:400;font-size:11px;font-family:var(--font-mono)":""},a+"–"+b);});
  S(g,"line",{x1:x(1711),y1:20,x2:x(1711),y2:220,class:"sv-lr","stroke-width":1.5,"stroke-dasharray":"4 3"});S(g,"text",{x:x(1711)+4,y:212,class:"sv-r"},"1711 德理格到北京");
})();
/* 外部图片 */
document.querySelectorAll(".photo img").forEach(img=>{
  const fail=()=>{const d=document.createElement("div");d.className="photo-fallback";d.innerHTML=`图片待放入：${img.getAttribute("src")}<br><a href="https://commons.wikimedia.org/wiki/File:${img.dataset.file}" target="_blank" rel="noopener">在维基共享资源查看这张图片</a>`;img.replaceWith(d);};
  if(img.complete&&img.naturalWidth===0)fail();else img.addEventListener("error",fail);
});
