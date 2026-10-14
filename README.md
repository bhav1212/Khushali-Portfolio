# Khushali Jain portfolio

An interior-design portfolio in English and German, built with Astro, React, TypeScript, Tailwind CSS and GSAP. English is the default; German pages live under `/de`.

The site contains 28 project stories, 187 selected image views, an autoplay eight-project carousel, an editorial paired-image catalogue with compact sticky filters, and complete image boards with inline expansion and side-by-side comparison. It also includes 20 anonymised plan previews and both landscape films with original audio and visible navigation links. Two-image boards remain horizontal on phones, tablets and desktop. Contact uses direct email and phone links. The public location is Heilbronn; a one-page German résumé is available from About. All 33 source folders are represented, with 360° room exploration and native-size study images.

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

The editorial catalogue and inline-board refinement passes 211 interaction checks and 272 layout checks across all 68 pages at desktop, tablet, phone and 320px widths. Nine representative accessibility scans report no violations. Both landscape films are checked for playback with native controls and sound enabled. Device checks use browser emulation, not physical-device certification.

The sitewide motion pass adds an immersive opening, scroll-linked image framing, connected board/viewer/comparison transitions, quicker filter reflow and animated native disclosures. The homepage and two matching projects include a real sketch-to-space sequence with a fixed colour palette. No smooth-scroll hijacking or long pinned sections are used.

The 14 October 2026 production build passed 163 interaction assertions across English/German desktop, phone and iPad layouts, plus 204 layout checks over all 68 pages. Six representative accessibility scans reported no violations. The final suite reported no browser errors. JavaScript-disabled homepage navigation and touch comparison without View Transitions passed. These checks use Chromium device emulation, not physical devices or field-performance measurements.
