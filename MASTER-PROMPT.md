# MASTER PROMPT — SocialTech PREMIUM E-COMMERCE REDESIGN

Act as the Lead Product Designer, Senior UX/UI Designer, Senior Frontend
Engineer, SEO Specialist, Accessibility Engineer, and QA Engineer.

Your job is to improve the existing SocialTech e-commerce website using the
installed Dialog Refero design system without breaking existing functionality.

==================================================
1. DESIGN SYSTEM — NON-NEGOTIABLE
==================================================

The design system is installed at:

.agents/skills/dialog-design-system/

Read:

.agents/skills/dialog-design-system/SKILL.md

Use the relevant references in:

.agents/skills/dialog-design-system/references/

The canonical uploaded source is:

.agents/skills/dialog-design-system/references/refero-source.md

The design system is the visual source of truth.

Do not invent a competing visual language.

Preserve exact source values whenever available:
- colors
- typography
- font weights
- tracking
- spacing
- radius
- shadows
- layout conventions
- component treatment

==================================================
2. VISUAL DIRECTION
==================================================

The target visual language is:

PREMIUM
CALM
NEUTRAL
AIRY
EDITORIAL
IMAGE-LED
MINIMAL
COMMERCE-FOCUSED

Think:

"premium retail showroom with one warm accent."

The interface should not feel:
- loud
- crowded
- overly technical
- neon
- overly animated
- generic SaaS
- template-like

The warm orange accent must remain restrained.
Do not turn the entire website orange.

==================================================
3. DO NOT CLONE THE SOURCE
==================================================

Use the Refero/Dialog system as the visual language.

Do NOT blindly copy:
- source branding
- source content
- source business logic
- source navigation
- source page structure
- unrelated source-specific features

Adapt the system to SocialTech.

The result must feel like:

"SocialTech — a premium e-commerce website using the Dialog visual language."

NOT:

"a clone of the Refero source."

==================================================
4. FIRST RESPONSE — AUDIT ONLY
==================================================

IMPORTANT:

For your FIRST response, DO NOT modify code.

First inspect the entire codebase and produce:

1. Current architecture
2. Current routes/pages
3. Current components
4. Current data/API flow
5. Current shopping flow
6. UX audit
7. UI audit
8. SEO audit
9. Accessibility audit
10. Performance audit
11. Design-system mapping
12. Redesign architecture
13. Component plan
14. Prioritized implementation plan

Then STOP.

Do not implement until the plan is reviewed.

==================================================
5. CODEBASE AUDIT
==================================================

Inspect before changing anything:

- framework
- routing
- components
- state management
- authentication
- product data
- category data
- cart
- checkout
- payment
- images
- API calls
- database integration
- metadata
- sitemap
- robots
- structured data
- responsive implementation

Preserve working business logic unless there is a clear reason to change it.

==================================================
6. UX AUDIT
==================================================

Evaluate:

- information architecture
- navigation
- search
- category discovery
- filters
- sorting
- product comparison
- product detail
- variants
- pricing clarity
- stock/status
- reviews
- trust
- add-to-cart
- cart
- checkout
- account
- order history
- wishlist if present
- loading states
- empty states
- error states

Prioritize the path:

DISCOVER
→ UNDERSTAND
→ TRUST
→ ADD TO CART
→ CHECKOUT

==================================================
7. UI AUDIT
==================================================

Check:

- typography
- tracking
- visual hierarchy
- whitespace
- colors
- cards
- buttons
- forms
- navigation
- product images
- badges
- shadows
- radius
- alignment
- responsive layout
- component consistency

Compare the existing UI against the Dialog design system.

==================================================
8. E-COMMERCE INFORMATION ARCHITECTURE
==================================================

Design an appropriate structure for:

HOME
CATEGORY
PRODUCT LISTING
SEARCH
PRODUCT DETAIL
CART
CHECKOUT
ACCOUNT
ORDER HISTORY
AUTHENTICATION
OTHER EXISTING BUSINESS PAGES

Do not create unnecessary pages.

The architecture must be intuitive and SEO-friendly.

==================================================
9. COMPONENT SYSTEM
==================================================

Create/refactor reusable components for:

- Header
- Navigation
- Search
- Category navigation
- Breadcrumb
- Product Card
- Product Grid
- Product Image
- Price
- Discount
- Rating
- Badge
- CTA
- Input
- Select
- Filter
- Sort
- Pagination
- Quantity selector
- Cart
- Modal
- Toast
- Loading
- Empty state
- Error state
- Footer

Use shared tokens and components.

Avoid duplicated page-specific implementations.

==================================================
10. PRODUCT CARD
==================================================

The product card is a critical component.

It should be:

- image-led
- clean
- spacious
- premium
- easy to scan

Show only useful information:

- product image
- product name
- price
- relevant discount
- rating/reviews when available
- primary action when appropriate

Do not overload the card.

Use the exact source radius, shadow, typography, spacing, and image treatment
where specified.

==================================================
11. PRODUCT DETAIL
==================================================

The product page should prioritize:

1. Product imagery
2. Product name
3. Price
4. Key information
5. Variants/options
6. Availability
7. Primary CTA
8. Trust information
9. Description
10. Reviews/specifications where available

Keep the page calm and spacious.

Do not add information that does not exist in the data.

==================================================
12. SEARCH / CATEGORY / FILTER
==================================================

Search should be easy to discover.

Category pages should provide:

- clear hierarchy
- product grid
- filtering
- sorting
- pagination/infinite loading as appropriate
- useful empty states

Do not make filters visually dominant over products.

The product remains the visual focus.

==================================================
13. MOBILE
==================================================

Mobile is a first-class layout.

Do not simply shrink desktop.

Check:

- header
- search
- navigation
- product grid
- filters
- product detail
- sticky actions if useful
- cart
- checkout
- touch targets
- spacing
- typography

Prevent horizontal overflow.

==================================================
14. SEO
==================================================

Audit and implement:

- semantic HTML
- one useful H1
- logical heading hierarchy
- descriptive URLs
- metadata
- canonical URLs
- robots
- sitemap
- internal linking
- breadcrumbs
- image alt text
- Open Graph
- product structured data
- relevant category structured data

Never fabricate:

- reviews
- ratings
- prices
- stock
- specifications
- brand information

Only use real application data.

==================================================
15. ACCESSIBILITY
==================================================

Ensure:

- keyboard navigation
- visible focus
- semantic HTML
- accessible labels
- useful aria attributes
- sufficient contrast
- accessible forms
- appropriate touch targets

Never remove accessibility for visual styling.

==================================================
16. PERFORMANCE
==================================================

Prefer:

- optimized images
- responsive images
- lazy loading where appropriate
- minimal JavaScript
- efficient rendering
- minimal network requests
- reusable components
- no unnecessary libraries

Avoid performance regressions.

==================================================
17. IMPLEMENTATION ORDER
==================================================

After plan approval, implement incrementally:

1. Design tokens
2. Global typography
3. Global surfaces/backgrounds
4. Header/navigation
5. Search
6. Category navigation
7. Product card
8. Product grid
9. Homepage
10. Category/listing
11. Product detail
12. Cart
13. Checkout
14. Footer
15. Mobile optimization
16. SEO
17. Accessibility
18. Performance

Do not rewrite the entire application blindly.

==================================================
18. BROWSER QA
==================================================

After every major UI phase, inspect the actual rendered page.

Do not rely only on source code.

Check:

- spacing
- alignment
- typography
- tracking
- image crop
- card proportions
- CTA hierarchy
- radius
- shadows
- responsive behavior
- overflow
- visual consistency

If something looks wrong, fix it.

==================================================
19. FINAL DESIGN QA
==================================================

Before completion verify:

VISUAL
✓ neutral premium showroom feeling
✓ restrained warm accent
✓ image-led presentation
✓ correct typography
✓ correct tracking
✓ correct spacing
✓ correct radius
✓ correct shadows

UX
✓ product discovery
✓ search
✓ filtering
✓ product evaluation
✓ clear CTA
✓ simple checkout

MOBILE
✓ responsive
✓ touch-friendly
✓ no overflow

SEO
✓ semantic structure
✓ metadata
✓ internal linking
✓ structured data where appropriate

ACCESSIBILITY
✓ keyboard
✓ focus
✓ labels
✓ contrast

PERFORMANCE
✓ optimized assets
✓ no unnecessary dependencies

==================================================
20. FINAL PRINCIPLE
==================================================

When deciding between visual decoration and usability:

USABILITY WINS.

When deciding between a random implementation and the design system:

DESIGN SYSTEM WINS.

When the design system does not define an e-commerce behavior:

USE A SIMPLE, ACCESSIBLE, FAMILIAR E-COMMERCE PATTERN.

The final website should feel:

PREMIUM
CALM
TRUSTWORTHY
MODERN
PRODUCT-FIRST
EASY TO SHOP

while remaining unmistakably SocialTech.
