# TUANTHOI — Dialog Visual System

## Source of truth
Use the Dialog Refero design system for all UI work.

Canonical source:
@../../skills/dialog-design-system/references/refero-source.md

Focused references:
- 01-foundation.md — colors, typography, spacing, shapes, shadows, layout
- 02-components.md — component specifications
- 03-guidelines.md — Do/Don't and surfaces
- 04-layout-imagery.md — elevation, imagery/layout guidance
- 05-tokens-css.md — CSS/Tailwind implementation tokens

## Core visual direction
The website should feel like a premium, calm, editorial retail showroom:
- neutral light canvas
- white surfaces
- generous whitespace
- restrained typography
- image-led product presentation
- one warm orange accent for primary actions

Do not invent a competing visual language.

Preserve exact source tokens whenever available. Do not casually change:
- colors
- typography
- tracking
- spacing
- radii
- shadows
- component proportions
- image treatment

Do not add gradients, neon colors, decorative blobs, excessive glassmorphism,
heavy borders, or unnecessary visual effects when they conflict with the source.

## Accent discipline
The warm orange accent is an action/attention color, not a page-wide theme.
Use it deliberately for primary CTA, active state, or equivalent high-priority
interaction. Keep the rest of the interface neutral.

## E-commerce adaptation
The Refero/Dialog system controls visual language.
E-commerce UX controls information architecture and behavior.

Optimize for:
1. Product discovery
2. Search
3. Categories
4. Filtering and sorting
5. Product evaluation
6. Trust
7. Add to cart
8. Checkout
9. Mobile usability
10. Accessibility

Do not clone the source site's business-specific structure, branding,
content, or unrelated components. Adapt its visual system to TUANTHOI.

## Before UI changes
1. Inspect the existing implementation and reusable components.
2. Read the relevant design-system reference.
3. Preserve working business logic.
4. Reuse shared components and tokens.
5. Make the smallest coherent change.

## After UI changes
Check rendered output for:
- visual hierarchy
- typography and tracking
- spacing
- radius and elevation
- image cropping
- CTA clarity
- responsive behavior
- accessibility
- e-commerce usability

For substantial UI work, inspect the rendered page in the browser and fix
visual inconsistencies rather than only reporting them.
