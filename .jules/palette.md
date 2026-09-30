## 2026-09-30 - Focus-Visible in Vanilla HTML/CSS
**Learning:** Default browser focus styles are often hidden or overridden, especially in dark mode apps with complex layouts. Using `*:focus-visible` provides a reliable and accessible focus indicator globally without adding custom classes everywhere, and it only appears for keyboard users (not mouse users).
**Action:** When working on keyboard accessibility in vanilla HTML/CSS apps, establish a global `*:focus-visible` rule using existing design tokens (like `--echt-gold` and an `outline-offset`) to ensure a consistent and visible focus state for all interactive elements.

## 2026-09-30 - Dynamic Elements Need ARIA
**Learning:** When HTML elements (like the `.block-delete` button) are generated dynamically inside JavaScript template literals, it's easy to miss accessibility attributes. These elements are just as critical for screen readers as static HTML.
**Action:** Always ensure ARIA attributes (like `aria-label` for icon-only buttons) are explicitly included within the string templates when generating interactive elements dynamically.
