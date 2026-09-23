---
name: dialog-design-system
description: Apply the uploaded Refero Dialog/Shop visual reference to the TUANTHOI e-commerce website. Use for UI creation, modification, review, layout, components, styling, product cards, navigation, responsive behavior, and design tokens.
---

# TUANTHOI Dialog Design System

Use this skill for visual/UI work.

## Canonical source
`references/refero-source.md` is the complete uploaded source and must remain unchanged.

## Reference map
- `01-foundation.md`: colors, typography, type scale, spacing, radius, shadows, layout
- `02-components.md`: component specifications
- `03-guidelines.md`: Do/Don't and surfaces
- `04-layout-imagery.md`: elevation and layout/imagery guidance
- `05-tokens-css.md`: CSS/Tailwind implementation tokens

## Reading order
For a UI task:
1. Read `01-foundation.md`.
2. If changing a component, read `02-components.md`.
3. If reviewing visual consistency, read `03-guidelines.md`.
4. If changing imagery/layout/elevation, read `04-layout-imagery.md`.
5. If implementing tokens, read `05-tokens-css.md`.
6. Consult `refero-source.md` whenever any detail is ambiguous.

## Adaptation rule
Use the source as a visual system, not as a requirement to clone the original
site's business logic or information architecture.

The target is a TUANTHOI premium e-commerce showroom:
- calm
- neutral
- airy
- editorial
- image-led
- minimal
- commerce-focused

E-commerce functionality may require patterns not present in the source.
When that happens, choose a familiar accessible pattern while preserving the
source's visual language.

## Component discipline
Prefer reusable components and shared tokens. Avoid one-off styles that create
visual drift between pages.

Do not silently change source token values.
Do not invent arbitrary colors, gradients, radii, shadows, or typography.

## Quality gate
Before completing substantial UI work:
- inspect the rendered result
- check desktop and mobile
- verify typography/tracking
- verify spacing and alignment
- verify product image treatment
- verify CTA hierarchy
- verify keyboard/focus accessibility
- verify the shopping flow remains clear
