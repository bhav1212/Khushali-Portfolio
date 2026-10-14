# Khushali Jain portfolio

An interior-design portfolio in English and German, built with Astro, React, TypeScript, Tailwind CSS and GSAP. English is the default; German pages live under `/de`.

The site contains 28 project stories, 187 selected image views, an autoplay eight-project carousel, conditional room/mood/concept filters, complete image boards and a fixed-screen viewer with side-by-side comparison, 20 anonymised plan previews and landscape films with original audio. Two-image boards remain horizontal on phones, tablets and desktop. Contact uses direct email and phone links. The public location is Heilbronn; a one-page German résumé is available from About. All 33 source folders are represented, with 360° room exploration and native-size study images.

## Local development

Use Node.js 24 LTS.

```bash
npm ci
npm run dev
```

Open http://localhost:4321.

```bash
npm run check
npm test
npm run build
npm run check:seo
npm run preview
```

## Deployment

Push to `main` to build, verify and deploy through GitHub Actions to GitHub Pages. The custom domain is https://iamkhushali.com. Cloudflare manages DNS; GitHub Pages hosts the site. Canonical URLs, German search metadata, language alternatives, structured data, sitemap.xml and robots.txt use this domain.

This repository contains website code and prepared public assets. Original client documents, private source archives, audit material and credentials are retained outside this repository. Public plan previews have identifying client/contact text removed and offer no PDF downloads.

DESIGN.md and .impeccable/design.json document the visual system. PRODUCT.md records the confirmed content constraints.

## Gallery verification

The 14 October 2026 gallery release passed 79 focused browser assertions across English and German desktop, phone, iPad and 320px phone layouts. Six further checks cover nonblank, interactive panorama rendering and reduced-motion operation with mouse or touch. The suite reported no browser errors; automated accessibility scans of the tested board and panorama surfaces reported no violations. These checks use Chromium device emulation, not physical devices.
