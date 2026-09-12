# Shop UI — Antigravity Rule

## Source of truth
The complete Refero source is preserved at:
@../../skills/shop-design-system/references/refero-source.md

The categorized references are in the same skill:
- 01-foundation.md — colors, typography, spacing, shapes, layout
- 02-components.md — component specifications
- 03-guidelines.md — Do/Don't, surfaces, elevation, imagery/layout guidance
- 04-layout-imagery.md — imagery, layout, agent prompt guide, examples
- 05-tokens-css.md — CSS custom properties and Tailwind v4 tokens

For UI work, use the Shop Design System as the visual source of truth.
Do not invent a competing visual language.

## Mandatory visual rules
- Preserve the Shop palette and token values exactly.
- Use #5433eb as the single saturated accent unless the source explicitly permits otherwise.
- Preserve the specified typography, tracking, spacing, radii, and shadows.
- Preserve the image-first, white-canvas, soft-elevation visual language.
- Follow the component specifications in the references.
- Do not introduce gradients, decorative illustrations, or arbitrary colors/radii/shadows when the source disallows them.
- Do not use bold 700+ weights where the source prohibits them.
- Reuse existing components where possible instead of creating visually inconsistent duplicates.

## E-commerce UX
This is a shopping website. Visual fidelity must not reduce usability.
Prioritize:
1. Product discovery
2. Search
3. Category navigation
4. Filtering and sorting
5. Product information and variants
6. Add to cart
7. Checkout
8. Trust and clarity
9. Mobile usability
10. Accessibility and performance

When a requested UX behavior is not specified by the Refero source, choose the simplest accessible e-commerce pattern that preserves the visual language.

## Before changing UI
1. Inspect the existing implementation and reusable components.
2. Read the relevant Shop Design System reference(s).
3. Identify any conflict between the requested change and the source rules.
4. Make the smallest coherent change.
5. Do not redesign unrelated areas without instruction.

## After changing UI
Verify the rendered result for:
- color and typography consistency
- spacing, radius, shadows, and alignment
- product-image treatment
- responsive behavior
- keyboard/focus states and accessibility
- shopping flow clarity
- visual consistency across reused components

If the task is a substantial UI change, inspect the rendered page in the browser before considering the task complete.
