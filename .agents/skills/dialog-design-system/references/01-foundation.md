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

