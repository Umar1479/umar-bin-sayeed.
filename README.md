# Umar Bin Sayeed: Motive client page

Static site: `index.html`, `style.css`, `script.js`, `assets/`. No build step.

## Preview locally
    cd landing-page
    python -m http.server 8000
Open http://localhost:8000

## PDF / tender copy
Open the page in Chrome or Edge, Print, Save as PDF, A4, background graphics on. A print layout is built in.

## Deploy
Import the repo in Vercel, Framework: Other, Output directory: `landing-page` (or repo root if you push this folder alone). Then update the URL and QR (see PLACEHOLDERS.md).

## Editing projects
Project data lives in `data/projects.json`. After editing run `python tools/build_gallery.py` to refresh the cards and popups in `index.html`.

## PDF of the page
`python tools/make_pdf.py` rebuilds `assets/Umar-Bin-Sayeed-Motive-Page.pdf` from the print layout. The page's "Download this page (PDF)" buttons point to it.
