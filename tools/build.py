"""Builds prototype/index.html from the three source files."""
from pathlib import Path
root=Path(__file__).resolve().parent.parent/"prototype"
shell=(root/"src"/"shell.html").read_text()
expat=(root/"src"/"expat.js").read_text()
prov=(root/"src"/"provider.js").read_text()
out=shell.replace("</script>\n</body>","</script>\n<script>\n"+expat+"\n</script>\n<script>\n"+prov+"\n</script>\n</body>")
(root/"index.html").write_text(out)
print("built prototype/index.html",len(out),"bytes")
