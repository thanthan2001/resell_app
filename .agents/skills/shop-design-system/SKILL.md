---
name: shop-design-system
description: Apply the Refero Shop visual system to the TUANTHOI e-commerce website. Use this skill whenever creating, modifying, reviewing, or refactoring UI, layout, styling, components, product cards, navigation, search, responsive behavior, or design tokens.
---

# Shop Design System

Use this skill for all visual/UI work on the e-commerce website.

## Authority
The canonical, unmodified Refero source is:
`references/refero-source.md`

The source has also been organized into focused references so the agent can load only what the task needs.

## Reference map
- `references/01-foundation.md`
  - Source lines 1–100
  - Theme, visual concept, colors, typography, type scale, spacing, radius, shadows, layout.
- `references/02-components.md`
  - Source lines 101–166
  - Component-by-component visual specifications.
- `references/03-guidelines.md`
  - Source lines 168–238
  - Do/Don't rules, surfaces, elevation, imagery, and typography hierarchy.
- `references/04-layout-imagery.md`
  - Source lines 189–252
  - Layout, imagery, Agent Prompt Guide, example component prompts, typography/product-card guidance, similar brands, quick-start context.
- `references/05-tokens-css.md`
  - Source lines 254–409
  - CSS custom properties and Tailwind v4 tokens.

## How to use references
1. For any UI task, start with `01-foundation.md`.
2. If changing or creating a component, also read `02-components.md`.
3. If checking visual consistency, read `03-guidelines.md`.
4. If changing page composition, imagery, or layout, read `04-layout-imagery.md`.
5. If implementing tokens in CSS/Tailwind, read `05-tokens-css.md`.
6. If there is any ambiguity, consult `refero-source.md` as the canonical source.

## Implementation principles
- Do not silently alter source token values.
- Do not invent a second visual system.
- Keep the Shop visual signature: light white-canvas discovery, image-first product presentation, generous rounding, pill controls, compact typography, restrained warm-neutral UI, and a single violet accent.
- Treat the Refero source as visual guidance, not as a requirement to reproduce an unrelated site's information architecture.
- For e-commerce-specific functionality not defined by Refero, use accessible, familiar shopping UX while preserving the visual system.
- Prefer reusable design-system components and shared tokens over page-specific styling.
- Before declaring a substantial UI task complete, inspect the rendered result and correct inconsistencies.

## Important source note
The Refero source contains some intentionally source-specific elements (for example, a Shop app-download banner and a persistent sidebar). Do not automatically add those elements to the TUANTHOI site unless the product requirements call for them. Preserve their styling specifications if they are used.

## Verification checklist
- Tokens match the source.
- Typography hierarchy and tracking are consistent.
- Product cards follow the image-first composition.
- Controls use the specified pill/radius conventions.
- Shadows and elevation match the source.
- No prohibited gradients/decorative UI have been introduced.
- Desktop and mobile both preserve the design language.
- Shopping interactions remain clear and accessible.
