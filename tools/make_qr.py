"""Regenerate assets/qr.svg for the live URL.  Usage: python tools/make_qr.py https://your-site.vercel.app/
Needs:  pip install segno"""
import sys, segno
url = sys.argv[1] if len(sys.argv) > 1 else "https://REPLACE-WITH-VERCEL-URL"
segno.make(url, error="m").save("assets/qr.svg", scale=8, border=2, dark="#1B2A3B")
print("QR written for", url)
