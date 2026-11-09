"""从章节源文件重建《耳朵的地图》的 14 章及首页。"""

from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
CHAPTERS = (
    "a1-blues", "intro", "a2-folk", "a3-baroque", "a4-jazz",
    "b1-rock", "b2-hardrock", "b3-punk", "b4-metal",
    "c1-soul", "c2-hiphop", "c3-edm", "d1-alt", "d2-pop",
)

if __name__ == "__main__":
    # 其余章节使用布鲁斯页中的音频引擎，目录在章节完成后读取统计。
    for chapter in (*CHAPTERS, "toc"):
        subprocess.run([sys.executable, str(ROOT / chapter / "build.py")], cwd=ROOT, check=True)
