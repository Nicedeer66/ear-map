# 目录页：从各章 index.html 里自动读出标题、导语和统计数字
import re,json,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CH=[("Intro","intro","怎么听"),
("A1","a1-blues","布鲁斯"),("A2","a2-folk","民歌与乡村"),("A3","a3-baroque","巴洛克"),("A4","a4-jazz","爵士"),
("B1","b1-rock","摇滚"),("B2","b2-hardrock","硬摇滚"),("B3","b3-punk","朋克"),("B4","b4-metal","金属"),
("C1","c1-soul","灵魂乐与放克"),("C2","c2-hiphop","嘻哈"),("C3","c3-edm","电子舞曲"),
("D1","d1-alt","另类"),("D2","d2-pop","当代流行")]
data=[]
for code,d,name in CH:
    s=open(os.path.join(ROOT,d,'index.html')).read()
    m=re.search(r'class="meta-row">(.*?)</div>',s,re.S);meta=re.findall(r'<span>(.*?)</span>',m.group(1))
    num=lambda k:next((int(re.search(r'\d+',x).group()) for x in meta if k in x),0)
    plus=lambda k:any(k in x and '+' in x for x in meta)
    lede=re.sub(r'<[^>]+>','',re.search(r'class="lede">(.*?)</p>',s,re.S).group(1)).replace('&amp;','&').strip()
    data.append(dict(code=code,dir=d,name=name,min=num("阅读"),demos=num("示例"),dplus=plus("示例"),figs=num("插图"),songs=num("曲目"),lede=lede))
js=open(os.path.join(ROOT,'toc','toc.js')).read().replace('/*__DATA__*/',json.dumps(data,ensure_ascii=False))
# 一首歌走遍地图：从 A1 截取合成音频引擎（与 B1 相同的三处补丁），再接上旅程的声音和交互
a=open(os.path.join(ROOT,'a1-blues','index.html')).read()
s0=a.index('/* ================= 合成音频引擎');eng=a[s0:a.index('\n}',a.index('function lightStrip',s0))+2]
P=[('if(inst==="ac"){const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=220;pk.gain.value=5;node.connect(pk);node=pk;}',
    'if(I.peak){const pk=a.createBiquadFilter();pk.type="peaking";pk.frequency.value=I.peak[0];pk.gain.value=I.peak[1];node.connect(pk);node=pk;}'),
   ('s.buffer=ksBuf(midi,o.dur||I.dur,I.bright,I.decay);','s.buffer=ksBuf(midi,o.dur||I.dur,I.bright,I.decay);if(o.det&&!o.from)s.playbackRate.value=Math.pow(2,o.det/1200);'),
   ('if(o.mute){','if(o.swell){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime((o.vol||1)*I.vol,t+o.swell);}\n  if(o.mute){')]
for old,new in P:
    assert old in eng,old[:40];eng=eng.replace(old,new,1)
js+='\n'+eng+'\n'+open(os.path.join(ROOT,'toc','journey-audio.js')).read()+'\n'+open(os.path.join(ROOT,'toc','journey-ui.js')).read()
out=open(os.path.join(ROOT,'toc','body.html')).read().replace('/*__CSS__*/',open(os.path.join(ROOT,'toc','toc.css')).read()).replace('/*__JS__*/',js)
open(os.path.join(ROOT,'index.html'),'w').write(out);print(len(out),sum(x['min'] for x in data),sum(x['demos'] for x in data),sum(x['figs'] for x in data),sum(x['songs'] for x in data))
