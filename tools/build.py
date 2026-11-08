"""Builds prototype/index.html from the source files."""
from pathlib import Path
root=Path(__file__).resolve().parent.parent/"prototype"
shell=(root/"src"/"shell.html").read_text()
order=["svc.js","expat.js","provider.js","legal.js","help.js","present.js"]
scripts="".join("\n<script>\n"+(root/"src"/f).read_text()+"\n</script>" for f in order)
out=shell.replace("</script>\n</body>","</script>"+scripts+"\n</body>")
(root/"index.html").write_text(out)
print("built prototype/index.html",len(out),"bytes")
