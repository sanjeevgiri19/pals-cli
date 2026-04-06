# Design System Document: High-End Developer Editorial

## 1. Overview & Creative North Star

### Creative North Star: "The Neon Monolith"
This design system is built for the high-performance developer who demands both technical precision and aesthetic soul. We are moving away from the "standard SaaS dashboard" and toward an editorial, immersive experience. The "Neon Monolith" concept pairs a dense, obsidian-like depth with sharp, electric accents, mimicking the focus and clarity of a late-night terminal session.

By leveraging intentional asymmetry, expansive negative space, and deep tonal layering, we create a UI that feels less like a website and more like a premium hardware interface. We reject the "flat" web; we embrace depth, glass-like textures, and high-contrast typography to drive a narrative of speed and power.

---

## 2. Colors

The palette is anchored in a deep charcoal base (`#0e0e0e`) to maintain developer-friendly low-light comfort, while utilizing a vibrant electric purple (`primary`) as a high-energy focal point.

- **Primary (`#b6a0ff`) & Secondary (`#bc8df9`):** These are our "neon" highlights. Use them sparingly to guide the eye toward critical actions or status indicators.
- **Surface Hierarchy:** Instead of borders, we define space through the `surface-container` scale.
    - **Base:** `surface` (#0e0e0e)
    - **Inlaid Depth:** `surface-container-low` (#131313) for large content sections.
    - **Floating Elevation:** `surface-container-highest` (#262626) for interactive cards and popovers.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off content. Sectioning must be achieved through background shifts. A card should be distinguishable from the background because it uses `surface-container-highest` against a `surface` background, not because it has an outline.

### Glassmorphism & Signatures
To elevate the premium feel, use "Glassmorphism" for floating overlays (like Tooltips or Navigation). Combine a semi-transparent `surface-container` with a `backdrop-blur(12px)`. MAIN CTAs should utilize a subtle linear gradient from `primary` to `primary_dim` to provide a "lit from within" effect.

---

## 3. Typography

The system utilizes a dual-font approach to balance human-centric UI with technical precision.

- **UI & Editorial (Inter):** Used for all navigation, headlines, and descriptive text. Inter’s tall x-height and clean geometry provide a modern, authoritative voice.
- **Terminal & Code (JetBrains Mono):** Reserved for CLI commands, snippets, and data-heavy labels. Its crisp, ligated design ensures high legibility for technical strings.

### Hierarchy Patterns
- **Display-LG (3.5rem):** Reserved for Hero statements. Use tight letter-spacing (-0.02em) for a sophisticated, editorial look.
- **Title-SM (1rem):** Default for UI labels. Pair with `on_surface_variant` for secondary information to create tonal depth.
- **Label-SM (0.6875rem):** Used for micro-copy and tags. Always uppercase with increased letter-spacing (+0.05em) when used in headers.

---

## 4. Elevation & Depth

We eschew traditional drop shadows for **Tonal Layering**.

- **The Layering Principle:** Depth is "stacked." 
    - Layer 0: `surface` (The infinite void)
    - Layer 1: `surface-container-low` (Content troughs)
    - Layer 2: `surface-container-highest` (Interactive units)
- **Ambient Shadows:** If an element must "float" (e.g., a modal), use a highly diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The color should be a tinted dark purple rather than pure black to keep the palette cohesive.
- **The "Ghost Border":** For accessibility in high-density areas, use a "Ghost Border"—the `outline_variant` token set to 15% opacity. This provides a tactile edge without adding visual noise.

---

## 5. Components

### Buttons
- **Primary:** Background: Gradient `primary` to `primary_dim`. Text: `on_primary_fixed`. Radius: `full`.
- **Secondary:** Background: `surface-container-highest`. Text: `primary`. Hover: Subtle `surface_bright` shift.
- **Tertiary:** No background. Text: `primary`. Horizontal padding: 0.

### Cards & Code Blocks
Cards must use `md` (0.75rem) or `lg` (1rem) corner radii. **Never use dividers.** Use vertical white space (32px+) or a shift to `surface-container-low` to separate sections within a card. Code blocks should use `surface_container_lowest` (#000000) for a "true terminal" feel.

### Input Fields
- **Container:** `surface-container-highest`.
- **Active State:** Change "Ghost Border" from 15% to 100% opacity using `primary` token.
- **Text:** `body-md` in JetBrains Mono for the input itself.

### Signature Component: The "Command Chip"
A specialized chip for CLI flags. 
- **Background:** `secondary_container` at 30% opacity. 
- **Border:** Ghost border of `secondary`. 
- **Font:** `label-md` JetBrains Mono.

---

## 6. Do's and Don'ts

### Do
- **DO** use asymmetry. Place a terminal preview slightly offset to the right to break the "center-aligned" template monotony.
- **DO** use `primary` for focus. In a sea of charcoal, a single electric purple dot or line is an incredibly powerful signifier.
- **DO** maximize "Breathing Room." High-end design lives in the margins. Double your standard padding values.

### Don't
- **DON'T** use pure white (#FFFFFF) for body text. Use `on_surface_variant` (#adaaaa) for long-form reading to reduce eye strain, reserving pure white for `Headline` tokens.
- **DON'T** use 100% opaque borders. They create "grid-lock" and make the UI feel cramped and "template-y."
- **DON'T** mix roundedness. If you use `full` (9999px) for buttons, ensure your tags and chips follow suit. Keep container corners at `lg` (1rem) for a grounded feel.

### Accessibility Note
While we prioritize a high-contrast dark theme, ensure that all `on_surface` text against `surface` containers maintains at least a 4.5:1 contrast ratio. Use the `primary_dim` and `secondary_dim` tokens for decorative elements that do not require high legibility.