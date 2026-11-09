from pathlib import Path

chapter = Path(__file__).resolve().parent
blues_script = (chapter.parent / "a1-blues" / "blues.js").read_text(encoding="utf-8")
start = blues_script.index("/* ================= 合成音频引擎")
end = blues_script.index("/* 原创旋律：以 E 布鲁斯音阶", start)
engine = blues_script[start:end].rstrip("\n")
template = (chapter / "src.html").read_text(encoding="utf-8")
script = (chapter / "punk.js").read_text(encoding="utf-8")
(chapter / "index.html").write_text(
    template.replace("/*__ENGINE__*/", engine).replace("/*__PUNK__*/", script),
    encoding="utf-8",
)
