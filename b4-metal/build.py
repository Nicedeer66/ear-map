import re
a=open('a1-blues/index.html').read()
i=a.index('/* ================= 合成音频引擎');j=a.index('function lightStrip');k=a.index('\n}',j)+2
eng=a[i:k]
old='if(inst==="ac"){const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=220;pk.gain.value=5;node.connect(pk);node=pk;}'
assert old in eng
eng=eng.replace(old,'if(I.peak){const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=I.peak[0];pk.gain.value=I.peak[1];node.connect(pk);node=pk;}')
o2='s.buffer=ksBuf(midi,o.dur||I.dur,I.bright,I.decay);'
assert o2 in eng
eng=eng.replace(o2,o2+'if(o.det&&!o.from)s.playbackRate.value=Math.pow(2,o.det/1200);')
o3='if(o.mute){'
eng=eng.replace(o3,'if(o.swell){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((o.vol||1)*I.vol,t+o.swell);}\n  '+o3,1)
hr=open('b2-hardrock/hr.js').read();hr=hr[:hr.index('/* ================= 示例')]
js=open('b2-hardrock/helpers.js').read()+hr+open('b4-metal/metal.js').read()
s=open('b4-metal/body.html').read().replace('/*__CSS__*/',open('b4-metal/skin.css').read())
s=s.replace('/*__ENGINE__*/',eng).replace('/*__METAL__*/',js)
open('b4-metal/index.html','w').write(s);print(len(s))
