from pathlib import Path

chapter = Path(__file__).resolve().parent
template = (chapter / "src.html").read_text(encoding="utf-8")
script = (chapter / "blues.js").read_text(encoding="utf-8")
(chapter / "index.html").write_text(
    template.replace("/*__BLUES__*/\n", script), encoding="utf-8"
)
