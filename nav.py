# 统一全书导航：顶部曲目栏（本面曲目，可点）+ 页脚上一章/下一章 + 缺图时隐藏照片框
import re,glob,json,os
ROOT=os.path.dirname(os.path.abspath(__file__))
CH=[("Intro","intro","怎么听"),
("A1","a1-blues","布鲁斯"),("A2","a2-folk","民歌与乡村"),("A3","a3-baroque","巴洛克"),("A4","a4-jazz","爵士"),
("B1","b1-rock","摇滚"),("B2","b2-hardrock","硬摇滚"),("B3","b3-punk","朋克"),("B4","b4-metal","金属"),
("C1","c1-soul","灵魂乐与放克"),("C2","c2-hiphop","嘻哈"),("C3","c3-edm","电子舞曲"),
("D1","d1-alt","另类"),("D2","d2-pop","当代流行")]
SIDE=lambda c:"A" if c in("Intro",) else c[0]
DISC={"A":"第一张唱片 · SIDE A 根源","B":"第一张唱片 · SIDE B 摇滚家族","C":"第二张唱片 · SIDE C 律动","D":"第二张唱片 · SIDE D 今天"}
def label(c,n):return f"Intro 怎么听" if c=="Intro" else f"{c} {n}"
def label2(c,n):return f"Intro · 怎么听" if c=="Intro" else f"{c} · {n}"
CSS="/*nav-unify*/.albumbar a{color:inherit;text-decoration:none}.albumbar a.book:hover{text-decoration:underline}.tracks span a{color:inherit;text-decoration:none;display:block}.tracks span:not(.on):hover{opacity:.72}.next a{color:inherit;text-decoration:none;border-bottom:1px solid currentColor}.next a:hover{opacity:.7}"
JS='<script id="nav-guard">(()=>{document.querySelectorAll(".photo img, figure img").forEach(i=>{const hide=()=>{const f=i.closest("figure")||i.closest(".photo");if(f)f.style.display="none";};if(i.complete&&i.naturalWidth===0&&i.getAttribute("src"))hide();else i.addEventListener("error",hide);});})();</script>'
def link(d,text,cur=False):
    if cur:return f'<a aria-current="page">{text}</a>'
    href="../index.html" if d=="toc" else f"../{d}/index.html"
    return f'<a href="{href}" data-nav="{d}">{text}</a>'
changed=[]
for i,(code,d,name) in enumerate(CH):
    sd=SIDE(code);mates=[x for x in CH if SIDE(x[0])==sd]
    track_items=[]
    for track_code, track_dir, track_name in mates:
        current=track_code==code
        active_class=' class="on"' if current else ''
        track_link=link(track_dir,label(track_code,track_name),current)
        track_items.append(f'      <span{active_class}>{track_link}</span>')
    tracks="\n".join(track_items)
    header=f'''<header class="albumbar">
  <div class="wide">
    <a class="book" href="../index.html" data-nav="toc">耳朵的地图 · {DISC[sd]} · 目录</a>
    <nav class="tracks" aria-label="本面曲目">
{tracks}
    </nav>
  </div>
</header>'''
    prev=CH[i-1] if i>0 else None;nxt=CH[i+1] if i<len(CH)-1 else None
    pl=link(prev[1],"← "+label2(prev[0],prev[2])) if prev else link("toc","← 目录")
    nl=link(nxt[1],label2(nxt[0],nxt[2])+" →") if nxt else link("toc","回到目录 →")
    footer=f'<div class="next"><span>{pl}</span><span>{nl}</span></div>'
    for f in ["index.html","body.html","src.html"]:
        p=os.path.join(ROOT,d,f)
        if not os.path.exists(p):continue
        s=open(p).read();o=s
        s,n1=re.subn(r'<header class="albumbar">.*?</header>',header,s,count=1,flags=re.S)
        s,n2=re.subn(r'<div class="next">.*?</div>',footer,s,count=1,flags=re.S)
        assert n1==1 and n2==1,(p,n1,n2)
        if "/*nav-unify*/" in s:s=re.sub(r'/\*nav-unify\*/[^<]*','',s)
        s=s.replace("</style>",CSS+"</style>",1)
        s=re.sub(r'<script id="nav-(online|guard)">.*?</script>\n?','',s,flags=re.S)
        s=s.replace("</body>",JS+"\n</body>",1)
        if s!=o:open(p,"w").write(s);changed.append(p)
print("\n".join(changed))
