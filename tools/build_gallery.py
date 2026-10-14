"""Rebuild the project gallery and popup data inside index.html from data/projects.json.
Run from the landing-page folder:  python tools/build_gallery.py
Edit data/projects.json to change a project (set "role": false to hide Umar's name on it)."""
import json, html, re, os
from PIL import Image
P = json.load(open("data/projects.json", encoding="utf-8"))
sectors = []
for p in P:
    if p["sector"] not in sectors: sectors.append(p["sector"])
chips = ['<button type="button" class="chip is-on" data-filter="all" aria-pressed="true">All projects <span>%d</span></button>' % len(P)]
for s in sectors:
    n = sum(1 for p in P if p["sector"] == s)
    chips.append('<button type="button" class="chip" data-filter="%s" aria-pressed="false">%s <span>%d</span></button>' % (html.escape(s), html.escape(s), n))
cards = []
for p in P:
    f = "assets/projects/" + p["photos"][0]
    w, h = Image.open(f).size
    n = len(p["photos"])
    cards.append(f'''<button type="button" class="proj" data-id="{p['id']}" data-sector="{html.escape(p['sector'])}" aria-haspopup="dialog" aria-label="Open {html.escape(p['name'])}: {n} photo{'s' if n != 1 else ''}">
  <span class="ph-wrap"><img src="{f}" width="{w}" height="{h}" loading="lazy" alt="{html.escape(p['name'])}: project photograph"><span class="count">{n} photo{'s' if n != 1 else ''}</span></span>
  <span class="b"><span class="sector">{html.escape(p['sector'])}</span><span class="t">{html.escape(p['name'])}</span>
  <span class="scope">{html.escape(', '.join(p['scope']))}. {html.escape(p['location'])}.</span>
  {'<span class="role"><b>Planning &amp; controls:</b> Umar Bin Sayeed, Lead Planning Engineer</span>' if p.get('role') else ''}
  <span class="more">View project</span></span></button>''')
STRIP_IDS = ["01", "02", "03", "04", "06", "12", "14", "17", "18", "24", "27", "28"]
byid = {p["id"]: p for p in P}
def tile(p, hidden):
    f = "assets/projects/" + p["photos"][0]
    ar = ' aria-hidden="true" tabindex="-1"' if hidden else ''
    return (f'<button type="button" class="tile" data-id="{p["id"]}"{ar} aria-label="Open {html.escape(p["name"])}">'
            f'<img src="{f}" width="320" height="213" loading="lazy" alt=""><span>{html.escape(p["name"])}</span></button>')
strip = [tile(byid[i], False) for i in STRIP_IDS if i in byid] + [tile(byid[i], True) for i in STRIP_IDS if i in byid]
s = open("index.html", encoding="utf-8").read()
def swap(s, tag, body):
    return re.sub(r"(<!--%s:START-->).*?(<!--%s:END-->)" % (tag, tag), lambda m: m.group(1) + "\n" + body + "\n" + m.group(2), s, flags=re.S)
s = swap(s, "STRIP", "\n".join(strip))
s = swap(s, "CHIPS", "\n".join(chips))
s = swap(s, "GALLERY", "\n".join(cards))
data = json.dumps(P, ensure_ascii=False).replace("</", "<\\/")
s = swap(s, "DATA", '<script type="application/json" id="project-data">' + data + "</script>")
open("index.html", "w", encoding="utf-8").write(s)
print(len(P), "projects written")
