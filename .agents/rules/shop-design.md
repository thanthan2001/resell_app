---
trigger: always_on
---

# Shop — Style Reference
> Floating shopping constellation on white marble

**Theme:** light

Shop runs on a white-canvas discovery model where products float as large, heavily-rounded image cards instead of grid-locked thumbnails. The entire interface is pillow-soft: 20–28px radii everywhere, pill-shaped controls, a compact 16px GT Standard body with tight negative tracking that pulls text into crisp shapes. A single vivid violet (#5433eb) is the system's only saturated accent — it appears in the wordmark, the circular search submit, and as a tinted shadow on that same button. The rest of the palette is warm-neutral: white surfaces, a faint cool-gray canvas, hairline borders, and near-black text. Density stays compact with 12px gaps, but the hero and category bands breathe through generous 64–80px vertical rhythm, making commerce feel browsable rather than catalog-like.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Mist | `#f2f4f5` | `--color-canvas-mist` | Page background and secondary surface wash behind elevated cards |
| Pure White | `#ffffff` | `--color-pure-white` | Primary surface for cards, input fields, floating brand spotlights, and pill buttons |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, headings, icons, nav symbols, and dark mode product cards |
| Faint Border | `#ebebeb` | `--color-faint-border` | Hairline dividers on cards, input outlines, and pill button borders |
| Muted Gray | `#787574` | `--color-muted-gray` | Secondary text, navigation labels, icon strokes in idle state |
| Cool Stone | `#cccccc` | `--color-cool-stone` | Placeholder fills, disabled states, and inactive icon backgrounds |
| Warm Fog | `#acb0aa` | `--color-warm-fog` | Subtle surface tints for secondary product cards and section backgrounds |
| Shop Violet | `#5433eb` | `--color-shop-violet` | Search submit button, wordmark dot, brand logo — the single accent that makes action and identity pop against the white canvas |
| Violet Wash | `#c0b5f3` | `--color-violet-wash` | Translucent halo behind the violet submit button, extending its glow without changing hue |
| Slate Ink | `#332f2d` | `--color-slate-ink` | Dark product card surfaces and deep-tone overlay text |
| Ash Veil | `#665a54` | `--color-ash-veil` | Warm desaturated gray used in product imagery backdrops, not an active UI token |

## Tokens — Typography

### GT Standard — Primary typeface at all sizes — body and headings alike. GTStandard-MRegular at 16px/-0.031em is the workhorse for body, buttons, and labels. GTStandard-MSemibold at 20px/-0.05em powers the few display-scale headings; GTStandard-MMedium at 11–12px handles micro-labels. Every weight renders at 400 optical weight — the font family carries its hierarchy through subtle grade shifts and tight negative tracking, not bold contrast. This is the signature: Shop doesn't shout with bold, it shapes text with tracking. · `--font-gt-standard`
- **Substitute:** Inter, system-ui, -apple-system
- **Weights:** 400
- **Sizes:** 9px, 11px, 12px, 14px, 16px, 20px
- **Line height:** 1.10–1.38
- **Letter spacing:** -0.05em at 20px, -0.031em at 16px, -0.014em at 14px, -0.017em at 12px, -0.058em at 9px
- **Role:** Primary typeface at all sizes — body and headings alike. GTStandard-MRegular at 16px/-0.031em is the workhorse for body, buttons, and labels. GTStandard-MSemibold at 20px/-0.05em powers the few display-scale headings; GTStandard-MMedium at 11–12px handles micro-labels. Every weight renders at 400 optical weight — the font family carries its hierarchy through subtle grade shifts and tight negative tracking, not bold contrast. This is the signature: Shop doesn't shout with bold, it shapes text with tracking.

### Shopify Sans — Reserved for system-level messaging like the app download banner and cookie consent copy · `--font-shopify-sans`
- **Substitute:** Inter
- **Weights:** 400, 700
- **Sizes:** 10px, 14px
- **Line height:** 1.20–1.71
- **Letter spacing:** -0.0230em
- **Role:** Reserved for system-level messaging like the app download banner and cookie consent copy

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.33 | — | `--text-caption` |
| body-sm | 12px | 1.33 | — | `--text-body-sm` |
| body | 14px | 1.33 | — | `--text-body` |
| body-lg | 16px | 1.33 | — | `--text-body-lg` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 28px |
| chips | 9999px |
| pills | 20px |
| inputs | 9999px |
| search | 9999px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.06) 0px 2px 8px 0px` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm-2` |
| lg | `rgba(0, 0, 0, 0.12) 0px 4px 24px 0px` | `--shadow-lg` |
| lg-2 | `rgba(69, 36, 219, 0.34) 0px 4px 24px 0px` | `--shadow-lg-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 0px
- **Element gap:** 12px

## Components

### Hero Floating Product Card
**Role:** Hero showcase tile hovering above the wordmark

White surface, 28px radius, 2-layer soft shadow (0 4px 6px -1px rgba(0,0,0,0.1) + 0 2px 4px -2px rgba(0,0,0,0.1)). Contains a 1:1 product image with its own 20px radius, brand name in 14px semibold ink-black beneath, and a 5-star rating row in 9px caption. Zero internal padding on the card; the image bleeds to the rounded edge.

### Brand Spotlight Card
**Role:** Elevated product card promoting a featured merchant

White surface, 28px radius, same dual-layer soft shadow. A 1:1 product image fills the upper area with 20px inner radius. Below: brand name in 14px semibold, star rating and review count in 9px caption. No visible border; the shadow alone separates it from the canvas.

### Search Input with Violet Submit
**Role:** Primary navigation and discovery control

Pill-shaped container at 9999px radius, white fill, 1px ink-black border at 0.1 opacity, 4px vertical / 20px left horizontal padding. Right side reserves 48px for a circular violet (#5433eb) submit button with a white arrow glyph. The violet button carries a tinted shadow: 0 4px 24px rgba(69,36,219,0.34). Placeholder text in 16px regular at muted gray.

### Category Pill
**Role:** Top-level category quick-access chip

Pill at 9999px radius, white fill, 1px faint (#ebebeb) border, subtle elevation shadow (0 2px 8px rgba(0,0,0,0.06)). Left side: 16px circular category icon in its native brand color. Right: 16px GTStandard-MRegular label in ink-black. Horizontal padding 6px, vertical 6px.

### Product Image Tile
**Role:** Category-grid product type card with overlay label

Tall or wide image fills the entire card with zero internal padding. The card itself has 0px radius in the grid context (image defines the shape). A semi-transparent white label box sits at the bottom-left with the product type in 14px semibold, 12px internal padding, and 12px radius on the label chip.

### Category Section Header
**Role:** Section title with chevron affordance

Left-aligned 20px GTStandard-MSemibold at -1.0px tracking in ink-black, followed by a 16px ink-black chevron. No background, no border. Sits above a 2-column or 4-column product grid with 24px bottom margin before the grid.

### Sidebar Nav Rail
**Role:** Persistent left-edge navigation

Narrow vertical column (~64px wide), white background, no border. Each nav item is a 24px ink-black icon centered in a 48px square tappable area. Active state fills the icon container with #f2f4f5 at 20px radius. Profile avatar at the bottom is a 32px circle with a 1px #ebebeb ring.

### App Download Banner
**Role:** Top-of-page cross-platform install prompt

Full-width dark band (#000000) at 48px height, 1px radius, white centered text. Contains a 24px rounded app icon, a 14px Shopify Sans link label reading 'Download Shop app', subtext 'Available on iOS & Android' at 10px, and a white right-pointing arrow. Sits flush against the top edge with zero internal margins beyond 12px horizontal.

### Cookie Consent Button
**Role:** Cookie banner action button

Pill at 9999px radius, white fill, 1px #ebebeb border. Black 12px semibold label centered. Padding 6px vertical, 16px horizontal. Shadow: 0 2px 8px rgba(0,0,0,0.06) for subtle lift on the white canvas.

### Category Carousel Arrow
**Role:** Carousel navigation control within product grids

Circular 32px white button with 0 4px 24px rgba(0,0,0,0.12) shadow. Contains a 16px ink-black right-chevron. Sits at the right edge of any horizontal product rail, vertically centered.

### Product Type Hero Image
**Role:** Full-bleed product image with brand name overlay

Large rounded image (28px radius) filling roughly 60% of a category row. Brand name rendered in large white display type directly on the image at the top-left, followed by a star rating and review count in 14px white. No card chrome — the image IS the card.

### Mini Product Thumbnail Strip
**Role:** Horizontal swatch row within a product card

Row of 3–4 small product images at ~48px square with 12px radius each, separated by 2px gaps. Sits at the bottom of a brand card as a quick-browse affordance. No labels, no borders — just the cropped product images.

### Cookie Modal Link
**Role:** Inline text link in cookie consent copy

14px GTStandard-MRegular ink-black, underlined. No background, no border. Sits inline within body copy at standard line height.

## Do's and Don'ts

### Do
- Use 28px radius for all product cards and 9999px for all pills, inputs, and category chips — the generous rounding is the brand signature
- Set the violet (#5433eb) exclusively on the search submit button and the wordmark dot — it is the only saturated color in the system and must stay singular
- Type body text at 16px GTStandard-MRegular with -0.5px tracking, never smaller for primary content — 12px is the floor for secondary labels
- Pair every elevated card with the dual-layer soft shadow (0 4px 6px -1px + 0 2px 4px -2px at 10% black) — never use a single hard shadow
- Separate layers with shadow alone on white surfaces; skip borders on cards and rely on the canvas-to-card color shift
- Maintain 64–80px vertical breathing room between major content sections to preserve the airy, browseable feel
- Tint the search button's shadow with the brand violet (rgba(69,36,219,0.34)) so the accent color is reinforced in the elevation itself

### Don't
- Do not add a second saturated accent color — the system is monochrome with one violet, introducing a second will flatten its impact
- Do not use sharp corners on cards, buttons, or inputs — 0px radius is reserved for image edges only
- Do not use bold (700+) weights — the GTStandard family carries hierarchy through grade and tracking, not weight contrast
- Do not add visible borders to elevated cards — the shadow and white surface against the faint canvas do the separation work
- Do not use colored backgrounds for UI containers — the product photography provides all color in the experience
- Do not break the 9999px pill convention for any control that sits inline with text (search, category chips, cookie buttons)
- Do not set body text below 12px — 9px is reserved exclusively for review counts and brand metadata in tight cards
- Do not add gradients, illustrations, or decorative shapes — the visual language is product photography on white with soft shadows
