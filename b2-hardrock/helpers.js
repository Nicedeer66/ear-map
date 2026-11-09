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

