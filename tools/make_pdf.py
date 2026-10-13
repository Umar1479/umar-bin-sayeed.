"""Create assets/Umar-Bin-Sayeed-Motive-Page.pdf from the page's print layout using Chrome or Edge.
Run from the landing-page folder:  python tools/make_pdf.py
Needs Chrome or Edge installed. Starts a temporary local server, prints, then stops it."""
import os, re, subprocess, sys, threading, http.server, socketserver, functools, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
browsers = [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"]
exe = next((b for b in browsers if os.path.exists(b)), shutil.which("chrome") or shutil.which("google-chrome") or shutil.which("msedge"))
if not exe:
    sys.exit("Chrome or Edge not found.")
# temporary copy without lazy loading so every image is in the PDF
html = open("index.html", encoding="utf-8").read()
html = html.replace(' loading="lazy"', "").replace(' decoding="async"', "")
open("_pdf.html", "w", encoding="utf-8").write(html)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
handler.log_message = lambda *a, **k: None
srv = socketserver.TCPServer(("127.0.0.1", 0), handler)
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
out = os.path.join(ROOT, "assets", "Umar-Bin-Sayeed-Motive-Page.pdf")
try:
    subprocess.run([exe, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=40000",
                    "--print-to-pdf=" + out, "http://127.0.0.1:%d/_pdf.html?pdf" % port], check=True, timeout=240)
finally:
    srv.shutdown()
    os.remove("_pdf.html")
try:  # shrink the images (optional: pip install PyMuPDF)
    import pymupdf
    d = pymupdf.open(out)
    d.rewrite_images(dpi_threshold=130, dpi_target=110, quality=72)
    d.save(out + ".tmp", garbage=4, deflate=True)
    d.close()
    os.replace(out + ".tmp", out)
except Exception as e:
    print("Image compression skipped:", e)
print("PDF written:", out, os.path.getsize(out) // 1024, "KB")
