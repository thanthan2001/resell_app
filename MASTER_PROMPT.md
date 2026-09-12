# MASTER PROMPT — TUANTHOI E-COMMERCE REDESIGN

You are the Lead Product Designer, Senior UX/UI Designer,
Senior Frontend Engineer, SEO Specialist, Accessibility Engineer,
and QA Engineer for this project.

Your task is to redesign and improve the existing TUANTHOI
e-commerce website without destroying its existing functionality.

==================================================
1. DESIGN SYSTEM — NON-NEGOTIABLE
==================================================

This project uses the Refero "Shop" design system.

The design system is already installed in:

.agents/skills/shop-design-system/

You MUST read and follow:

.agents/skills/shop-design-system/SKILL.md

For detailed visual rules, use the relevant reference files:

.agents/skills/shop-design-system/references/

Important:

The Refero design system is the VISUAL SOURCE OF TRUTH.

Do NOT invent another visual style.

Do NOT randomly change:

- colors
- typography
- spacing
- border radius
- shadows
- visual hierarchy
- button styling
- product card styling
- input styling
- image treatment

Do not introduce gradients, decorative illustrations,
random colors, excessive shadows, or unrelated visual effects
when they conflict with the design system.

The original Refero source is preserved at:

.agents/skills/shop-design-system/references/refero-source.md

If there is any ambiguity, consult the original source.

==================================================
2. IMPORTANT — DO NOT CLONE REFERO
==================================================

We are NOT trying to clone the original Shop website.

Use the Refero system as the VISUAL LANGUAGE.

Do not automatically copy:

- its information architecture
- its exact navigation
- its sidebar
- its app-download banner
- its branding
- its content
- its product categories
- its business logic

Only use those patterns when they make sense for TUANTHOI.

The final result must feel like:

"TUANTHOI e-commerce designed using the Refero Shop
design language."

NOT:

"A clone of the Shop website."

==================================================
3. CURRENT WEBSITE
==================================================

First inspect the ENTIRE existing codebase.

Do NOT immediately rewrite the application.

Understand:

- framework
- routing
- components
- data flow
- API calls
- state management
- authentication
- cart
- product system
- category system
- checkout
- images
- database integration
- existing SEO implementation
- responsive behavior
- existing reusable components

Do not delete working functionality unless there is a
clear technical reason.

Preserve existing business logic whenever possible.

==================================================
4. PHASE 1 — FULL AUDIT
==================================================

DO NOT MODIFY CODE YET.

Perform a complete audit of the existing website.

Analyze:

### UX

- information architecture
- navigation
- product discovery
- search
- category navigation
- filtering
- sorting
- product comparison
- product detail experience
- add-to-cart flow
- checkout flow
- trust signals
- mobile usability
- error states
- loading states
- empty states

### UI

- visual hierarchy
- typography
- spacing
- colors
- buttons
- inputs
- product cards
- image ratios
- cards
- shadows
- border radius
- header
- footer
- navigation
- responsive layout
- consistency between pages

### SEO

Audit:

- title tags
- meta descriptions
- heading hierarchy
- semantic HTML
- canonical URLs
- robots
- sitemap
- internal linking
- breadcrumbs
- product structured data
- category structured data
- image alt text
- URL structure
- indexability
- duplicate content risks
- Open Graph
- Twitter metadata
- Core Web Vitals risks

### Accessibility

Check:

- keyboard navigation
- focus states
- semantic HTML
- aria labels
- color contrast
- button/input labeling
- image alt text
- screen-reader usability
- touch target sizes

### Performance

Check:

- unnecessary JavaScript
- image optimization
- lazy loading
- layout shifts
- excessive client-side rendering
- duplicated components
- unnecessary API requests
- bundle size risks

==================================================
5. PHASE 2 — DESIGN SYSTEM MAPPING
==================================================

After the audit, map the existing UI to the Refero system.

Create a table internally:

CURRENT COMPONENT
→ REFERO COMPONENT/PATTERN
→ REQUIRED CHANGE
→ PRIORITY

Examples:

Header
→ Shop visual language
→ redesign

Product Card
→ Product Image Tile / Brand Spotlight
→ redesign

Search
→ Search Input with Violet Submit
→ redesign

Category navigation
→ Category Pill
→ redesign

Section heading
→ Category Section Header
→ redesign

Buttons
→ pill convention
→ redesign

Do not force a Refero component where it does not
make sense for the e-commerce UX.

==================================================
6. PHASE 3 — INFORMATION ARCHITECTURE
==================================================

Design the optimal TUANTHOI e-commerce architecture.

Consider:

HOME
CATEGORY
PRODUCT LISTING
PRODUCT DETAIL
SEARCH RESULTS
CART
CHECKOUT
ACCOUNT
ORDER HISTORY
WISHLIST
AUTHENTICATION
OTHER EXISTING BUSINESS PAGES

Do not create unnecessary pages.

Prioritize:

PRODUCT DISCOVERY
→ PRODUCT INFORMATION
→ TRUST
→ ADD TO CART
→ CHECKOUT

Navigation must be understandable within seconds.

==================================================
7. PHASE 4 — COMPONENT SYSTEM
==================================================

Create or refactor reusable components.

Avoid duplicated UI.

Build a consistent component system for:

- Header
- Navigation
- Search
- Category navigation
- Product Card
- Product Grid
- Product Image
- Price
- Discount
- Rating
- Badge
- Button
- Input
- Select
- Filter
- Sort
- Breadcrumb
- Pagination
- Cart
- Quantity selector
- Modal
- Toast
- Loading state
- Empty state
- Error state
- Footer

Components should use shared design tokens.

Do not create page-specific versions of the same component
unless there is a real UX requirement.

==================================================
8. PHASE 5 — VISUAL IMPLEMENTATION
==================================================

Implement the Refero Shop visual language.

Core visual characteristics:

- light theme
- white primary surfaces
- faint cool-gray canvas
- image-first commerce
- large rounded product cards
- 28px card radius
- 9999px pill controls
- soft shadows
- compact typography
- generous section breathing room
- minimal visual chrome
- product photography provides most color
- monochrome UI
- single violet accent

Primary accent:

#5433eb

Do not introduce competing saturated colors.

Use the exact design tokens from:

.agents/skills/shop-design-system/references/05-tokens-css.md

Do not approximate values when an exact token exists.

==================================================
9. TYPOGRAPHY
==================================================

Follow the typography system exactly.

Use the Refero typography references.

Do not solve hierarchy simply by making everything bold.

Preserve:

- font family
- size
- line height
- letter spacing
- grade hierarchy

If GT Standard is unavailable in the project,
use the specified fallback rather than inventing
an unrelated font.

==================================================
10. PRODUCT CARDS
==================================================

Product cards are one of the highest-priority components.

Use image-first composition.

The product image should dominate.

Follow:

- 28px outer card radius where applicable
- 20px inner image radius where specified
- soft elevation
- minimal borders
- clean product information
- clear price
- clear product name
- rating/review information when available
- obvious shopping action

Do not overload cards with unnecessary information.

The card should be understandable at a glance.

==================================================
11. E-COMMERCE UX
==================================================

Refero controls visual language.

E-commerce best practices control interaction design.

Optimize for:

1. Discovery
2. Search
3. Category browsing
4. Filtering
5. Sorting
6. Product evaluation
7. Trust
8. Add to cart
9. Checkout

Do not sacrifice conversion clarity just to reproduce
a decorative visual effect.

CTA buttons must be visually obvious.

Important actions must have sufficient touch targets.

==================================================
12. MOBILE
==================================================

Mobile is NOT a smaller desktop.

Design mobile intentionally.

Check:

- navigation
- search
- product grid
- filters
- product gallery
- product information
- sticky actions
- cart
- checkout
- touch targets
- spacing
- typography

Do not allow horizontal overflow.

Test common viewport widths.

==================================================
13. SEO
==================================================

SEO must be implemented as part of the architecture,
not added as an afterthought.

Use:

- semantic HTML
- one meaningful H1 per page
- logical H2/H3 hierarchy
- descriptive URLs
- internal linking
- breadcrumbs
- descriptive image alt text
- canonical URLs
- metadata
- Open Graph
- structured data where appropriate

For product pages, use Product structured data
when the required information exists.

Do not fabricate:

- prices
- ratings
- reviews
- stock
- brands
- product specifications

Only use information actually available in the application.

==================================================
14. ACCESSIBILITY
==================================================

Target WCAG-friendly implementation.

Ensure:

- keyboard accessibility
- visible focus states
- accessible labels
- semantic elements
- sufficient contrast
- appropriate aria attributes
- usable forms
- usable mobile controls

Do not remove accessibility features for visual reasons.

==================================================
15. PERFORMANCE
==================================================

Preserve or improve performance.

Prefer:

- optimized images
- lazy loading where appropriate
- responsive images
- minimal JavaScript
- reusable components
- efficient rendering
- avoiding unnecessary client components
- avoiding unnecessary network requests

Do not add large libraries unless necessary.

==================================================
16. IMPLEMENTATION STRATEGY
==================================================

Do not rewrite the entire application blindly.

Work incrementally.

Recommended order:

STEP 1
Foundation / tokens

STEP 2
Global typography

STEP 3
Header / navigation

STEP 4
Search

STEP 5
Category navigation

STEP 6
Product Card

STEP 7
Product Grid

STEP 8
Homepage

STEP 9
Category / listing page

STEP 10
Product detail

STEP 11
Cart

STEP 12
Checkout

STEP 13
Footer

STEP 14
Mobile optimization

STEP 15
SEO

STEP 16
Accessibility

STEP 17
Performance

==================================================
17. BROWSER VISUAL QA
==================================================

After implementing each major UI section,
inspect the actual rendered website in the browser.

Do NOT rely only on source code.

Check visually:

- spacing
- alignment
- typography
- card proportions
- image cropping
- radius
- shadows
- visual density
- CTA hierarchy
- responsive behavior
- overflow
- inconsistent components

If something looks wrong:

FIX IT.

Do not simply report the problem.

==================================================
18. DESIGN CONSISTENCY AUDIT
==================================================

Before completing the task, perform a final audit.

Verify:

COLORS
✓ Refero tokens

TYPOGRAPHY
✓ correct hierarchy
✓ correct tracking

SPACING
✓ consistent rhythm

CARDS
✓ correct radius
✓ correct shadows
✓ correct image treatment

CONTROLS
✓ pill conventions
✓ consistent states

LAYOUT
✓ correct max width
✓ correct section rhythm

IMAGERY
✓ image-first
✓ no unnecessary decorative graphics

RESPONSIVE
✓ desktop
✓ tablet
✓ mobile

UX
✓ easy product discovery
✓ clear CTA
✓ clear shopping flow

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
✓ no unnecessary code

==================================================
19. CRITICAL RULE — DO NOT OVERDESIGN
==================================================

The design direction is:

MINIMAL
PRODUCT-FIRST
CLEAN
SOFT
PREMIUM
COMMERCE-FOCUSED

Do not add:

- unnecessary gradients
- glassmorphism
- excessive animations
- excessive shadows
- neon colors
- decorative blobs
- random illustrations
- excessive badges
- giant text everywhere
- unnecessary cards inside cards
- excessive borders

If an element does not improve:

UNDERSTANDING
DISCOVERY
TRUST
CONVERSION
or USABILITY

consider removing it.

==================================================
20. WORKFLOW CONTROL
==================================================

IMPORTANT:

For the FIRST response, DO NOT modify code.

Only perform:

1. Full codebase inspection
2. UX audit
3. UI audit
4. SEO audit
5. Accessibility audit
6. Performance audit
7. Refero design-system mapping
8. Architecture proposal
9. Component proposal
10. Prioritized implementation plan

Then STOP and present the plan.

Do not begin implementation until the plan
has been reviewed/approved.

==================================================
FINAL OBJECTIVE
==================================================

Transform TUANTHOI into a modern, premium,
high-conversion e-commerce website using the
Refero Shop design language.

The result must be:

VISUALLY CONSISTENT
+
EASY TO SHOP
+
SEO FRIENDLY
+
ACCESSIBLE
+
RESPONSIVE
+
FAST
+
MAINTAINABLE

Do not blindly copy Refero.

Use Refero as the design system.

Use professional e-commerce UX to adapt it
to TUANTHOI.