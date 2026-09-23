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

