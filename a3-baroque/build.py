a=open('a1-blues/index.html').read()
start=a.index('/* ================= 合成音频引擎')
end=a.index('\n}',a.index('function lightStrip',start))+2
eng=a[start:end]
assert eng.rstrip().endswith('}') and 'function lightStrip' in eng
old='if(inst==="ac"){const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=220;pk.gain.value=5;node.connect(pk);node=pk;}'
assert old in eng
eng=eng.replace(old,'if(I.peak){const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=I.peak[0];pk.gain.value=I.peak[1];node.connect(pk);node=pk;}')
o2='s.buffer=ksBuf(midi,o.dur||I.dur,I.bright,I.decay);'
assert o2 in eng
eng=eng.replace(o2,o2+'if(o.det&&!o.from)s.playbackRate.value=Math.pow(2,o.det/1200);')
o3='if(o.mute){'
assert o3 in eng
eng=eng.replace(o3,'if(o.swell){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((o.vol||1)*I.vol,t+o.swell);}\n  '+o3,1)
s=open('a3-baroque/body.html').read().replace('/*__CSS__*/',open('a3-baroque/skin.css').read())
s=s.replace('/*__ENGINE__*/',eng).replace('/*__BAROQUE__*/',open('a3-baroque/baroque.js').read())
open('a3-baroque/index.html','w').write(s)
