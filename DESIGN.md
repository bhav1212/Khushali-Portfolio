---
name: Khushali Jain portfolio
description: An editorial photo essay and room atlas for residential and commercial interiors.
colors:
  canvas: "#F3F5F2"
  ink: "#26332E"
  muted: "#5C6B62"
  accent: "#345E50"
  accent-hover: "#263F35"
  rule: "#CDD6CE"
  stone: "#E6E0D7"
  blue-grey: "#DCE5E8"
  sage: "#DDE3D8"
  control-border: "#88988C"
  sage-rule: "#91A08F"
  swatch-border: "#7A887C"
  footer-muted: "#CCD5CE"
  footer-rule: "#63746A"
  carousel-border: "#7C8E81"
  frame-rule: "#87958B"
  chapter-rule: "#AEBAB0"
  warm-neutrals: "#AA9580"
  light-airy: "#E5E5D9"
  green-botanical: "#7C8C72"
  blue-cool: "#6B8793"
  pastel-soft: "#D9BAB6"
  dark-moody: "#4B4D48"
  bold-colour: "#BE9852"
  monochrome: "#999A96"
typography:
  display:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "clamp(48px, 6.2vw, 88px)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-.025em"
  page-title:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "clamp(48px, 6.1vw, 88px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.025em"
  headline:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "clamp(34px, 4.1vw, 60px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.025em"
  title:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "clamp(24px, 2.2vw, 32px)"
    fontWeight: 400
    lineHeight: 1.25
  project-title:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "clamp(24px, 2.2vw, 31px)"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-.015em"
  project-index-title:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-.015em"
  carousel-title:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "clamp(28px, 2.7vw, 39px)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "normal"
  carousel-story:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  plan-title:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "clamp(25px, 2.8vw, 38px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.025em"
  lead:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "clamp(20px, 1.9vw, 26px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  micro-label:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  control:
    fontFamily: "'Hanken Grotesk', sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  square: "0"
  disc: "50%"
spacing:
  gutter: "clamp(24px, 4.45vw, 72px)"
  section: "clamp(40px, 5vw, 72px)"
  control-gap: "24px"
  pair-gap: "35px"
  stack-gap: "40px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.canvas}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "16px 25px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  link-inline:
    typography: "{typography.control}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "6px 0"
  carousel-image-control:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "8px"
    width: "44px"
    height: "44px"
  navigation:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
  filter-category:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.control}"
    padding: "7px 0"
  filter-category-selected:
    textColor: "{colors.accent}"
  filter-mood:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "6px 0"
  filter-facet:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "10px 16px"
  project-entry:
    textColor: "{colors.ink}"
    typography: "{typography.project-title}"
    rounded: "{rounded.square}"
  carousel-window:
    rounded: "{rounded.square}"
    height: "max(410px, calc(100svh - var(--header-height, 74px) - 108px))"
  view-board:
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  reader-window:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0"
    width: "min(1400px, calc(100vw - 40px))"
    height: "calc(100dvh - 40px)"
  board-room-filter:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "6px 0"
  panorama-window:
    rounded: "{rounded.square}"
    height: "clamp(280px, 62dvh, 650px)"
  panorama-zoom:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    width: "44px"
    height: "44px"
  language-menu:
    textColor: "{colors.ink}"
    typography: "{typography.micro-label}"
    padding: "8px"
  plan-collection:
    textColor: "{colors.ink}"
    typography: "{typography.plan-title}"
    rounded: "{rounded.square}"
    padding: "20px 0"
---

# Design System: Khushali Jain portfolio

## Overview

**Creative North Star: "Editorial photo essay and room atlas"**

The interiors are the visual material. An expressive serif supplies an authored voice; a clear sans-serif carries the practical information around it. The interface is quiet and editorial, with image scale and alignment creating the hierarchy. View boards, focused indexes and disclosures keep the work easy to compare. Opening a picture leads to a fixed proof table with a persistent overview and optional side-by-side comparison.

Sage-white and green ink provide a stable ground. Subdued stone, blue-grey and sage fields extend colours found in the work, while rectangular image windows retain room context. Depth comes from these tonal fields and the photographs and visualisations themselves. Borders mark controls and useful separations rather than enclosing every piece of content. Motion follows an architectural opening: a shutter, lateral picture movement and a caption reveal preserve continuity within a stable frame.

**Key Characteristics:**

- Actual project imagery integrated with adjacent colour fields.
- Gloock display headings paired with Hanken Grotesk copy and controls.
- Stable carousel windows, responsive view boards and precise caption alignment.
- Flat rectangular surfaces, sparse rules and image-derived palette samples.
- Sentence-case labels, visible keyboard focus and bounded architectural motion.

## Colors

The palette is a muted green framework with image-derived neutral surfaces and labelled mood samples. Frontmatter values are normative; the sidecar's tonal ramps are preview aids, not additional application colours.

### Primary

- **Deep studio green** (`accent`): primary actions, keyboard focus, native selection controls and the small wordmark dot. `accent-hover` supplies the darker primary-action hover state.

### Neutral

- **Sage-white paper** (`canvas`): the page ground, language menu, carousel image controls and fixed proof table.
- **Green ink** (`ink`): principal text and the inverted footer ground.
- **Muted green-grey** (`muted`): secondary copy, captions and unselected filters.
- **Pale green rule** (`rule`): quiet content dividers and plan collections. Use the darker `control-border` for facet, panorama-zoom and open-language-menu boundaries.
- **Warm stone**, **blue-grey** and **soft sage** (`stone`, `blue-grey`, `sage`): image-related fields. Project metadata selects the field; the type palette stays stable.
- **Sage rule** (`sage-rule`) and **swatch boundary** (`swatch-border`): separations on sage sections and outlines around small palette samples.
- **Pale footer copy** (`footer-muted`) and **footer rule** (`footer-rule`): secondary information and separation on the green-ink footer.
- **Carousel boundary**, **moving frame rule** and **chapter rule** (`carousel-border`, `frame-rule`, `chapter-rule`): readable carousel controls, the image/caption edge and chapter navigation separators.
- **Mood samples** (`warm-neutrals`, `light-airy`, `green-botanical`, `blue-cool`, `pastel-soft`, `dark-moody`, `bold-colour`, `monochrome`): literal, named samples used for discovery. They are not competing interface accents.

Each project's palette is content derived from its edited gallery images. Case-study swatches link to the image that supplies their evidence. Keep these per-project values in project data; they do not add global brand primitives or claim manufacturer paint or installed-material specifications.

The supporting sentence in a landscape-film section uses green ink on its sage field to retain contrast.

### Named Rules

**The Image Field Rule.** Select the subdued project field from the imagery and keep the text and control palette consistent across it.

**The Boundary Rule.** Pale editorial rules separate content; darker control boundaries identify facet menus, the open language menu, panorama zoom controls and carousel image-navigation buttons.

## Typography

**Display Font:** Gloock, with Georgia and serif fallbacks.

**Body Font:** Hanken Grotesk, with a sans-serif fallback.

Both fonts are self-hosted WOFF2 files with `font-display: swap`. Gloock is regular; Hanken Grotesk is a variable family. There is no separate mono voice.

**Character:** Gloock gives the larger statements contrast and character without heavy weight. Hanken Grotesk keeps the project names, descriptions, captions and controls direct and readable.

### Hierarchy

| Role | Use |
|---|---|
| `display` | The large name in the opening composition. |
| `page-title` | The general page-heading baseline; individual page openings use local size overrides. |
| `headline` | Editorial section headings. |
| `title` | Sans-serif subsection headings. |
| `project-title` | The project-caption baseline, used by related work and inherited by the index. |
| `project-index-title` | The compact, fixed-size project-index title. |
| `carousel-title` | The serif project title in the carousel caption window. |
| `carousel-story` | The bounded project introduction beside the carousel image. |
| `plan-title` | Serif collection titles in the Plans & sketches library. |
| `lead` | Larger introductory narrative copy. |
| `body` | Main prose and inherited primary-button text. |
| `label` | Short contextual metadata, not decorative heading prefixes. |
| `caption` | View-board captions with a tighter line height. |
| `micro-label` | Image kind, carousel authorship and footer notes. |
| `control` | Main navigation, inline links and category controls. |

The exact role values are in the frontmatter. This is a role-based ramp with deliberate page and component overrides, rather than a single geometric scale. The source-mapped sidecar records those overrides: case-study titles use `clamp(42px, 5vw, 70px)`, About titles use `clamp(45px, 4.6vw, 68px)`, and case-story headings use `clamp(34px, 3.5vw, 50px)`. Browse-view controls are (23px); chapter links are (16px). The wordmark is (25px, weight 500); the compact language code is (13px), with (16px) menu names and (12px) suffixes. Plan-sheet headings are (22px). View-board captions and room filters use (15px), their supplemental counts (12px), proof-table titles (17px), captions (15px), overview guidance (13px), and panorama actions (14px).

Body copy becomes (17px) on phones; the opening name becomes `clamp(47px, 12.7vw, 68px)`. General project-caption titles become (26px), while the more specific index title remains (23px). Carousel titles become (28px) when stacked and (27px) on phones. Plan-collection titles become (25px); the wordmark becomes (20px). Short contextual metadata becomes (14px), view-board captions (14px), proof-table titles (15px), captions and actions (13px), and carousel authorship (12px). These smaller labels accompany images or controls; they do not replace narrative copy. Narrative blocks commonly stop at (42–48ch); proof-table title lines allow (55ch). Headings balance their lines and use `overflow-wrap: anywhere` and `hyphens: auto`, including long German compounds; prose uses pretty wrapping.

### Named Rules

**The Two Voices Rule.** Use Gloock for major statements and Hanken Grotesk for project information, supporting headings and controls. Keep labels in ordinary sentence case.

## Layout

The shared gutter and section interval are fluid values in the frontmatter. The page has no general centred maximum-width container: image fields can reach both edges, and the shared gutter aligns their captions with surrounding copy.

The homepage uses a full-width image scene with the name over a pale upper scrim and project information in a translucent (116px) bottom band. The image window follows the frontmatter height with an (840px) maximum. The name uses discrete sizes of (88px), (96px) above (1600px), and (72px) below (1100px). Previous/next arrows sit at the image edges. The thumbnail strip remains outside the image. Changing projects must not move the frame, controls or strip. The complete image remains available in the project gallery.

Indexes use three columns with consistent landscape image windows. At (1100px) and below, room results reduce to two columns, room shortcuts use two columns, and career content stacks. At (900px) and below, project results reduce to two columns. Below (700px), result grids, plan sheets and primary content sequences become one column, filters expand within document flow, and footer/contact layouts stack. The header uses two rows. The homepage keeps its full-width image with a (110px) caption band, (52px) name and (23px) project title; below (360px) those become (44px) and (21px). Its palette is omitted on phones. The gutter becomes (22px), reducing to (18px) below (360px).

View boards show all project pictures by default in horizontal, wrapping flex rows, with (22px) gaps on wide screens and (18px / 14px) row/column gaps on phones. The default wide row uses three pictures; count-specific arrangements balance two- and four-picture rows. At (900px) and below, rows use two pictures. Two-picture filtered sets use an explicit two-column CSS grid and stay side by side at every size. Each picture retains its aspect ratio and source-width cap. Captions reserve up to two lines without forcing every image into one crop.

Opening a board picture enters a fixed-screen native proof table: a title/action row, one focused image and a persistent overview grid. Desktop overview columns are (230px), reducing to (180px) below (900px). On phones the overview moves beneath the image and is capped at (150px), with six thumbnail columns. Two-view comparison uses two equal image columns at every size. The single focused view keeps an (84px) scrollable caption slot. In comparison, each contained (16:10) image sits directly with its naturally sized caption, and the two picture/caption groups are vertically centred. Only the overview and single-focus long captions can scroll; the table is not a vertical photo sequence. The modal frame keeps its existing reader-window bounds, leaving (8px) at each phone viewport edge. Small-source case-study heroes use two-picture spreads when the first source is narrower than (1000px); phone layouts show the first image. Collection `33` uses this spread; collection `26` keeps its (1136px) first view with native-width caps. Project and room indexes initially show eight projects or twelve spaces, then expand on request. Career information, sketches and plan collections use disclosure. Contact places direct email and telephone links in a two-column composition that stacks on phones. Plan sheets use two columns on wide screens.

Dedicated text, filter and gallery controls reserve a (44px) target. Primary actions have a minimum height of (56px). Images reserve their dimensions, later images load lazily, and the first main image loads eagerly. Keep these layout behaviours when adding content.

## Elevation & Depth

There are no card or control shadows. Tonal page fields, a dark footer and the imagery create depth. The fixed proof table uses a nearly opaque green-ink backdrop (`#26332EEB`), with a flat sage-white interior, a fixed title/action row and an image-derived viewing field. Focus is an outline, not a shadow.

### Named Rules

**The Flat Field Rule.** Let imagery and tonal fields establish depth; keep project entries and controls free of card shadows.

## Shapes

Images, buttons, menus and dialogs use square corners. Circles are reserved for material or mood samples and the small wordmark dot. Project images remain open image-and-caption compositions rather than padded card shells. Borders are (1px) except selected view underlines and keyboard outlines, which are (2px).

The circular mood swatch is (22px), reducing to (16px) in phone discovery links. Case-study material samples are rectangular (44px × 44px); carousel samples are (30px × 25px). Arrow and close symbols are authored SVGs with consistent (1.5px) strokes.

## Components

### Buttons

Primary actions are plain green rectangles with pale text, an authored arrow and comfortable space. Their padding and colour variants are in the frontmatter; their minimum height is (56px). Hover darkens the background. Disabled buttons use opacity (.55) and a default cursor.

Inline links pair sentence-case text with a small arrow and a minimum (44px) target. Text underlines on hover, offset by (6px). Close-gallery controls stay transparent. Carousel previous/next buttons are square, outlined (44px × 44px) pale controls over the image.

All keyboard-focusable controls use a green (2px) outline with a (5px) offset. Do not remove it in favour of a subtle colour change.

### Chips

Category and mood choices are text controls rather than pill containers. Unselected category text is muted; selected text is green with an underline. Mood choices include a labelled circular colour sample; selected text is underlined. `aria-pressed` carries the state so colour is not the only signal.

### Cards / Containers

Project entries are flat image-and-caption compositions. Their image area inherits the project's stone, blue-grey or sage field; titles and arrows sit below, aligned to the image. There is no shadow, surrounding border or card padding. Captions begin (20px) below the image on wide screens and (14px) on phones. A fine-pointer hover or keyboard focus clips the bottom (38px) of the image while opening a caption rail over (400ms). The image does not zoom. Index images use a (16:11) landscape window; the full project gallery preserves their proportions.

### Direct contact

The email address is a prominent, wrapping text link with an arrow; telephone and location sit below it. A second column carries simple inquiry guidance and an email action. Contact links use `mailto:mail@iamkhushali.com` and `tel:+4917610813919`; the page has no form or draft-result state. Contact and its footer contain no résumé links. A one-page German résumé is available from About and other eligible footer surfaces. Copy stays simple, human and professional in both languages.

### Navigation

The name and green dot are the home link. The header stays at the top as the page scrolls, with a (2px) reading-progress line along its lower edge. Projects, Plans & sketches, About and Contact remain visible, with the current page underlined through `aria-current`. Wide navigation gaps are (36px); phones use (17px) gaps and (15px) text on their own second row. The footer inverts the text palette and repeats practical links without a decorative overline. Its small closing line contains the copyright; the former 3D-image sentence is removed.

English is the default at `/`; every page has a German equivalent under `/de`. The compact native `details` language menu uses a (16px) authored globe and the visible EN/DE code within a minimum (44px) target, without a large bordered trigger. Its open menu shows English and Deutsch as endonyms; the current language has a sage field. Language-link destinations retain query parameters and the image fragment before ordinary or new-tab navigation. Outside interaction and Escape close the menu; Escape returns focus to its summary. Location and search metadata describe Khushali Jain in Heilbronn, Germany, with canonical, hreflang, schema and sitemap alternatives for the planned `iamkhushali.com` domain; this does not introduce a separate business identity.

Case-study chapters stick beneath the measured header height. Links have a (48px) target, scroll horizontally when needed and underline the current section through `aria-current="location"`. Section scroll offsets account for both navigation rows. Project navigation progressively shares the selected image into the case-study hero through the browser's native view transitions; unsupported browsers retain ordinary navigation.

### Room facets

Room and concept facets use native `details` and checkboxes. On wide screens their bordered options sit beneath the trigger; on phones they open inline at full width. Opening one closes the other; clicking outside closes menus; Escape closes the open menu and returns focus to its summary.

Category, room, concept and mood choices appear only when images match under the other active facets. Values within a facet combine with OR, and facets combine with AND. Unavailable selections and invalid saved combinations normalise to usable matches. Counts, reset, result announcements, query parameters and browser history stay consistent. A room result links to its parent case study at the matching image. Filter changes use scale-based GSAP Flip over (420ms), with a (350ms) partial-mask reveal and a total entering stagger capped at (120ms). Reduced motion applies the same state without movement.

### Project carousel

The carousel presents eight projects through image-overlay previous/next controls, labelled thumbnails, arrow keys, Home/End and swipe. The position count stays in the fixed caption. Its frame and caption geometry are constant. Project titles reserve two lines; wide-screen stories reserve four. These are compact introductions linking to the full project. The thumbnail strip scrolls the current entry into view, and both an outline and `aria-pressed` identify its selection. The opening surface's final three project IDs are `03`, `12` and `01`: position seven is `12`, and position eight is `01`.

Slide changes wait for the incoming image to decode, then coordinate a directional shutter and lateral movement over (700ms), a title reveal over (500ms), and a palette stagger over (400ms). A request guard prevents stale image loads from taking over newer choices. Reduced motion removes movement while retaining the new project. The carousel advances automatically every six seconds. Hover, focus, hidden/offscreen content and reduced motion pause playback. P toggles an explicit pause; there is no visible tour toolbar. Inactive slides remain hidden from focus and assistive technology. The opening scene and room-discovery masks follow scrolling without pinning or adding artificial scroll distance.

### View board and proof table

All project pictures remain visible together by default. Room filters derive from actual image tags; each text action shows its count and uses an underline plus `aria-pressed`. Filtering uses scale-based GSAP Flip over (300ms), while a two-picture result uses a short partial mask over (200ms). Hover or focus opens the existing (34px) caption rail over (350ms); the image does not zoom. The active picture has a green outline. Touch devices use a small authored opening arrow.

The fixed-screen native dialog opens with one focused view and a persistent overview grid. Selecting an overview image changes the focused view. Compare views pins the first picture and uses overview choices to replace only the companion; both pictures remain side by side on phones. Comparison disables still-image zoom and shows panorama entries as image alternatives. The focused still image supports a (2×) zoom toggle, double-click zoom and bounded pointer or arrow-key panning. At fit size, Left/Right select adjacent images with wrapping. Escape closes the table and restores focus to the board opener. Each focused selection records its image fragment; restored fragments or palette links clear the room filter and bring the matching board picture into view.

Supported browsers connect the board image, focused viewer, comparison and return with (420ms) shared-image transitions. Transitions are interruptible, restore focus and release temporary image names after completion. Unsupported browsers retain the (240ms) partial-mask opening; reduced motion applies state directly. Zoom settles over (200ms). Cached previews are replaced only after the higher-resolution image decodes. A request guard prevents stale loads replacing newer choices. Cross-document transition opt-in and cancellation handling live in the document head so fast navigation remains reliable.

### Sketch-to-space sequence

The homepage and projects `10` and `14` use the same sequence component with their own verified sketch, room render and detail view. The image stage has a (16:10) ratio and a maximum (470px) height. Three direct controls remain available alongside scroll-linked masks; selecting one takes over from scrolling. The palette never translates or changes position between stages. No invented plan/render association or private source document is used. Reduced motion keeps the controls and makes stage changes immediate.

### Shared motion

Navigation has a moving position indicator; project chapters underline their active section. Native plan, sketch and career disclosures use (350ms) content-height transitions when supported, with ordinary native disclosure as fallback. Menus open over (200ms), while routine feedback uses the (180ms) quick token. Project hero framing, About portrait framing and footer feedback are bounded scroll effects. No page requires animation to expose its content, and mobile scrolling remains native.

Sketches start closed; career entries share an exclusive native disclosure group and start closed. Career content records Oneiro Interiors from December 2018 to the present, and the tools list includes D5 Render. Both landscape films retain source audio in native controls, play only on user action and use `preload="none"`. The opening name and shared project-image navigation retain their existing bounded reveals. Content never waits for a scroll entrance to become available.

### Panorama view

Only collection `19` carries six self-hosted 360° views. Its still image remains the default and fallback. A visitor explicitly activates exploration; the Pannellum assets load locally on demand, with no external embed or automatic rotation. The viewer uses a bounded landscape stage, a pale action rail, (44px) native zoom buttons and a return-to-image action. Dragging changes the viewpoint; arrow keys adjust yaw and pitch within the active panorama instead of selecting another proof-table image. Zoom changes the field of view between (30°) and (120°). Leaving the visible proof-table media area or returning to the image destroys the active viewer. The scoped panorama stage fills its containing media area with absolute positioning and a (1) layer above the preview, so late vendor CSS cannot move it into the caption. Once ready, the preview is hidden; failed loading retains the image and readable status.

Source-width caps preserve the small studies’ useful detail. The case-study spread is a source-size adaptation, not an instruction to enlarge small files until they fill the viewport. The expanded portfolio contains 28 stories and 187 views; its four added collections are `17`, `19`, `26` and `33`, and the image/story and planning libraries together represent all 33 source folders, including five planning-only folders.

### Plans & sketches collections

Six exclusive native disclosures group 20 anonymised preview sheets, made from 18 PDF first pages and two supplied images. Each summary pairs a contained preview, a serif collection title, a count and an authored disclosure arrow. Wide previews are (160px × 100px), reducing to (82px × 70px) on phones. The expanded sheets sit on white image fields with factual captions and image-only open links. Singular counts read “1 sheet” in English and “1 Plan” in German.

Public previews crop identifying title blocks and mask other client, email and phone text in the pixels. Preserve the originals outside the public export. No plan or project-sketch PDF links, download controls or public PDF copies are part of this component; the résumé remains a separate document.

## Do's and Don'ts

### Do:

- **Do** use actual project imagery and carry its subdued field into adjacent composition.
- **Do** preserve room context, mixed image proportions and aligned factual captions.
- **Do** keep the serif/sans roles and stable green text/control palette across project fields.
- **Do** retain visible focus, native labels, state attributes and comfortable touch targets.
- **Do** preserve two-picture comparisons on phones and keep the focused proof table and its overview visible together.
- **Do** keep carousel geometry stable and preserve source proportions in view boards and proof tables.
- **Do** keep motion bounded, automatic carousel playback pausable and all content available without movement.
- **Do** offer filter choices with matching imagery and keep saved state coherent.
- **Do** keep language destinations coherent with query and image state, and allow German headings to wrap and hyphenate.
- **Do** show anonymised plan previews with image-only links and preserve their originals outside the public export.

### Don't:

- **Don't** surround project entries with rounded card shells or shadows.
- **Don't** turn mood samples into competing brand accents.
- **Don't** promote image-derived project palettes into global brand colours or material specifications.
- **Don't** add decorative kickers, all-caps section labels or unnecessary numbering.
- **Don't** hide information until a scroll animation runs.
- **Don't** use a crop that removes the useful room context or stretch an image out of proportion.
- **Don't** communicate selection through colour alone or remove keyboard outlines.
- **Don't** autoplay films or make their audio part of carousel rotation.
- **Don't** upscale small-source studies to simulate high-resolution imagery or activate 360° exploration without a visitor action.
