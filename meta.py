# 给全书页面补上分享预览信息（description / Open Graph / 网站图标），并把 Google 字体改成不阻塞页面显示的加载方式。
# 可重复运行：会先删掉旧的 <!--share--> 块再写入。部署后把 SITE_URL 填成网站地址（例如 "https://book.example.com"），
# 再运行一次，分享卡片的图片和链接就会变成完整网址。
import re,os,html
ROOT=os.path.dirname(os.path.abspath(__file__))
SITE_URL="https://earmap.liangdeer.com"
CHAPTERS=["intro","a1-blues","a2-folk","a3-baroque","a4-jazz","b1-rock","b2-hardrock","b3-punk","b4-metal","c1-soul","c2-hiphop","c3-edm","d1-alt","d2-pop"]
FONT=re.compile(r'(?<!<noscript>)<link href="(https://fonts\.googleapis\.com/css2[^"]*)" rel="stylesheet">')
def clip(t,n=110):
    t=re.sub(r'<[^>]+>','',t);t=html.unescape(re.sub(r'\s+',' ',t)).strip()
    return t if len(t)<=n else t[:n].rstrip('，、；：')+'……'
def block(title,desc,img,url,icon):
    a=lambda p:(SITE_URL.rstrip('/')+'/'+p) if SITE_URL else p
    e=lambda s:html.escape(s,quote=True)
    lines=['<!--share-->',f'<meta name="description" content="{e(desc)}">','<meta property="og:type" content="article">','<meta property="og:site_name" content="耳朵的地图">',
      f'<meta property="og:title" content="{e(title)}">',f'<meta property="og:description" content="{e(desc)}">']
    if img:lines.append(f'<meta property="og:image" content="{e(a(img) if SITE_URL else img)}">')
    if SITE_URL:lines.append(f'<meta property="og:url" content="{e(a(url))}">')
    lines+=['<meta name="twitter:card" content="summary_large_image">',f'<link rel="icon" href="{icon}favicon.svg" type="image/svg+xml">',f'<link rel="apple-touch-icon" href="{icon}apple-touch-icon.png">','<!--/share-->']
    return '\n'.join(lines)
def patch(path,title,desc,img,url,icon):
    s=open(path).read();o=s
    s=re.sub(r'\n?<!--share-->.*?<!--/share-->','',s,flags=re.S)
    s=re.sub(r'\n?<meta name="description" content="[^"]*">','',s)
    s=s.replace('</title>','</title>\n'+block(title,desc,img,url,icon),1)
    s=FONT.sub(lambda m:f'<link href="{m.group(1)}" rel="stylesheet" media="print" onload="this.media=\'all\'"><noscript><link href="{m.group(1)}" rel="stylesheet"></noscript>',s)
    if s!=o:open(path,'w').write(s);return True
    return False
n=0
for d in CHAPTERS:
    built=open(os.path.join(ROOT,d,'index.html')).read()
    title=re.search(r'<title>(.*?)</title>',built).group(1)
    desc=clip(re.search(r'class="lede">(.*?)</p>',built,re.S).group(1))
    m=re.search(r'<img class="art" src="(img/[^"]+)"',built)
    img=(d+'/'+m.group(1)) if SITE_URL and m else (m.group(1) if m else None)
    for f in ("index.html","body.html","src.html"):
        p=os.path.join(ROOT,d,f)
        if os.path.exists(p):n+=patch(p,title,desc,img,d+'/',"../")
desc="耳朵的地图：一本可以边读边听的音乐入门书。十四章，从布鲁斯到当代流行，配浏览器里直接播放的示例、图解和推荐歌单。"
for p in (os.path.join(ROOT,"index.html"),os.path.join(ROOT,"toc","body.html")):
    n+=patch(p,"耳朵的地图 · 目录",desc,"toc/img/cover.jpg","","")
print("updated",n)
