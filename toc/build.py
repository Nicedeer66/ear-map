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
out=open(os.path.join(ROOT,'toc','body.html')).read().replace('/*__CSS__*/',open(os.path.join(ROOT,'toc','toc.css')).read()).replace('/*__JS__*/',js)
open(os.path.join(ROOT,'index.html'),'w').write(out);print(len(out),sum(x['min'] for x in data),sum(x['demos'] for x in data),sum(x['figs'] for x in data),sum(x['songs'] for x in data))
