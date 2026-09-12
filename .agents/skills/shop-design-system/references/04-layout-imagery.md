## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f2f4f5` | Page background — only visible at page edges and behind the sidebar rail |
| 1 | Surface | `#ffffff` | Main content surface for cards, inputs, pills, the sidebar, and the search bar |
| 2 | Elevated Card | `#ffffff` | Hero floating product cards and brand spotlights — same white but lifted by dual-layer soft shadow |
| 3 | Accent Product Image | `#000000` | Dark product imagery that reads as a 'dark mode' surface within the light canvas, holding white overlay text |

## Elevation

- **Hero Product Card:** `rgba(0,0,0,0.1) 0px 4px 6px -1px, rgba(0,0,0,0.1) 0px 2px 4px -2px`
- **Search Submit Button:** `rgba(69,36,219,0.34) 0px 4px 24px 0px`
- **Category Pill:** `rgba(0,0,0,0.06) 0px 2px 8px 0px`
- **Carousel Arrow:** `rgba(0,0,0,0.12) 0px 4px 24px 0px`
- **Cookie Button:** `rgba(0,0,0,0.06) 0px 2px 8px 0px`

## Imagery

Photography is the dominant visual: full-bleed product photography on white, 1:1 crops, and lifestyle imagery with warm earth-tone palettes (tans, terracotta, sage, ivory). Product images carry their own color — the UI stays achromatic so product hues become the visual variety. Brand logos appear as overlay type on dark or light hero images rather than separate badges. The hero composition arranges product cards as a floating, slightly overlapping constellation above the wordmark. Icons are minimal and mono (ink-black outlined strokes), except for category pill icons which use a single brand color each. No illustrations, no 3D, no gradients on product imagery.

## Layout

Max-width 1200px centered on a faint #f2f4f5 canvas, with a persistent 64px-wide left sidebar rail of icon-only navigation. The hero is a full-width band where product cards float above a centered violet 'shop' wordmark, with the pill search bar directly below. Category pills sit in a single centered row beneath the search. Content sections (Women, Men, Beauty, Home, Baby & Toddler) follow as labeled bands, each containing a 4-column card grid of product image tiles or a 2-column hero-and-grid composition. Vertical rhythm is generous: 64–80px between major sections. The footer is a dark band at the page bottom with columnar link groups. Right-side carousel arrows on horizontal product rails indicate scrollable content without pagination dots.

## Agent Prompt Guide

Quick Color Reference:
- Background: #f2f4f5 (canvas), #ffffff (surface)
- Text: #000000 (primary), #787574 (secondary)
- Border: #ebebeb (hairline)
- Accent: #5433eb (Shop violet — wordmark + search submit)
- Shadow tint: rgba(69,36,219,0.34) for the violet button only
- primary action: #5433eb (filled action)

Example Component Prompts:

1. Create the hero search bar: 9999px radius pill, #ffffff fill, 1px border in rgba(5,41,77,0.1). Placeholder 'What are you shopping for today?' in 16px GTStandard-MRegular at #787574. Right-aligned circular submit button in #5433eb with a white right-arrow glyph, 48px diameter, shadow 0 4px 24px rgba(69,36,219,0.34). The input padding is 4px vertical, 20px left, reserving 48px right for the submit.

2. Create a floating brand spotlight card: 28px radius, #ffffff fill, dual shadow (rgba(0,0,0,0.1) 0 4px 6px -1px + rgba(0,0,0,0.1) 0 2px 4px -2px). Top half: 1:1 product image at 20px inner radius filling to the card edges. Below: brand name in 14px GTStandard-MSemibold at #000000 with -0.2px tracking, followed by a 9px star-rating row at -0.5px tracking. No card padding, no border.

3. Create a category pill chip: 9999px radius, #ffffff fill, 1px #ebebeb border, shadow rgba(0,0,0,0.06) 0 2px 8px. Left: 16px circular category icon in its native color. Right: 16px GTStandard-MRegular label in #000000 with -0.5px tracking. Padding 6px vertical, 6px left, 16px right.

4. Create a category section header: 20px GTStandard-MSemibold at -1.0px tracking in #000000, followed by a 16px #000000 right-chevron, left-aligned. 24px bottom margin before the 4-column product grid beneath.

5. Create the left sidebar nav: 64px-wide vertical rail, #ffffff fill, no border. Each item is a 24px #000000 icon centered in a 48px tap target. Active state fills a 20px-radius background of #f2f4f5 behind the icon. Profile avatar at bottom: 32px circle with 1px #ebebeb ring.

## Typography Hierarchy Rules

The GT Standard family carries its entire hierarchy through three grades (Regular, Medium, Semibold) and negative tracking — never through weight contrast alone. Display and heading sizes use aggressive tracking tightening (-1.0px at 20px, -0.5px at 16px), while micro-labels relax to -0.2px. This creates a visual compression effect: big text pulls tight, small text breathes. Always pair size with the correct family grade: 16px body is Regular, 14px subheadings are Semibold, 12px meta is Medium. Never mix grades within a single text run — a label and its value must use the same family grade for visual coherence.

## Product Card Composition

Product cards are image-first: the image defines the card's visual identity, and type is a supporting label beneath or overlaid on the image. White product cards stack the image on top with type below in a 12–16px gap. Dark product cards reverse this — brand name in large display type overlays the image at the top-left in white. The card radius (28px) is always larger than the inner image radius (20px) by ~8px, creating a subtle white frame effect even on white-background product images. Never crop a product image to the card's exact rounded shape — the inner 20px radius provides a visible white border that separates the product from the card edge.

## Similar Brands

- **Instagram Shopping** — Same white-canvas product discovery model with image-first cards and minimal chrome around merchandise
- **Pinterest** — Floating rounded product tiles, soft shadows, and a browseable constellation layout over a centered search affordance
- **SSENSE** — Large-format product imagery in heavily-rounded cards, compact 16px body type, and a single restrained accent color
- **Apple Shop** — Generous 20–28px radii across all interactive surfaces and pill-shaped controls on a white canvas
- **Faire** — Product-first discovery with elevated floating image cards, tight negative tracking on body type, and warm-neutral palette

## Quick Start
