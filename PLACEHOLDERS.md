# Placeholders and items to confirm

## Visible [PLACEHOLDER] / [CONFIRM] tags on the page
1. **Vercel URL**: set to https://umar-bin-sayeed.vercel.app/ (share tags, QR code, PDF). Done.
2. **Growing with Motive**: done. The "Since joining" card now says what you own at Motive, using only CV facts. The CV shows one Motive role, no promotions, so none is claimed.
3. **Motive results lane (Gantt)**: dates for the four results are not in the CV, so they are shown numbered and not date-scaled.
4. **Your name on projects (please check):** every project popup and card says "Umar Bin Sayeed, Lead Planning Engineer", as you asked for all projects since you joined in January 2024. The Company Profile gives no project dates, so I cannot check this. Any project that finished before Jan 2024 should be switched off: open `data/projects.json`, set `"role": false` for it, then run `python tools/build_gallery.py`.
5. **PepsiCo** photos are design visuals, not site photos.

## Project photos and names (decision made)
- You chose to show the project photos and names without permission tags, so everyone can see Motive's work. The tags and review note are removed from the page.
- Still worth knowing: the gallery names client projects (PepsiCo, Aramex, Salasa, Patchi, Four Seasons venues, NEOM, FEI, Taawuniya, Amana). "D Offices" is client-confidential in the profile. R&D and the four private residences were left out.
- Company figures (est. 2008, 120+ projects, 80+ clients, 500+ employees) come from the Company Profile. The value-proposition file says to verify figures before external use.
- Motive logo was cropped from page 1 of the Company Profile (vector render).

## Your CV download (assets/Umar-Bin-Sayeed-CV.pdf)
- Kept as you decided (client names stay). Redacted copy: personal Gmail replaced with usayeed@motiveint.com; Personal Details (nationality, marital status) removed. Your original is untouched.
- It still contains your phone number and **client/consultant names** (PepsiCo, DDC, Pinsent Masons, JLL, Savills, Richmond, Echalle). The page itself anonymises these. You chose to keep it as is.

## Personal data on the page
- Email, LinkedIn and phone/WhatsApp (+966 54 647 5093, as you confirmed). No ID, address, nationality or marital status.

## Other notes
- Brand: the Motive website shows no colours or fonts. Navy #1B2A3B, teal #1A7C8F and a gold accent (#C8A24A) come from your brief.
- Sample dashboard numbers are invented and labelled "Sample data".
- The AI Copilot is labelled "In development". Nothing is claimed as delivered.
- "~15% less delay exposure" is an estimate per your CV.
- Gallery shows 20 of 58 extracted photos. All 58 are in `assets/projects/` with `assets/projects/photos.csv`.

## Popup and gallery (v2)
- 33 projects, 144 photos (up to 6 per project, all under 300 KB). Source of truth: `data/projects.json`. Rebuild with `python tools/build_gallery.py` (needs `pip install Pillow`).
- "How I plan and control a project like this" in each popup is built from the project's stated scope and your CV method. It makes no claims about results, dates or values.
- Left out: R&D (confidential), four private residences, and projects with no usable photo (Burger Boutique, MOE, PNU Villas, NASC).
- The career chart no longer shows a critical path. The red in the sample dashboard is just the "actual" line.

## v3: dark look, slideshow, map, charts, PDF
- **Hero slideshow, photo strip, map:** all use photos and city names from the Company Profile. The map is a simplified outline with pins for Riyadh (30), Khobar (1), Yanbu (1) and NEOM (1). Patchi Villaggio is in Khobar and Patchi Yanbu is in Yanbu, as the profile states.
- **Page PDF:** `assets/Umar-Bin-Sayeed-Motive-Page.pdf` (11 pages, about 0.7 MB). It is a snapshot of the page's print layout, with the first 12 projects. It contains the QR code and the remaining visible note (Gantt result dates). **Regenerate it after you change the page :** `python tools/make_pdf.py` (needs Chrome or Edge; `pip install PyMuPDF` shrinks the images).
- Chart read-outs and role details use only CV facts and the labelled sample data.
