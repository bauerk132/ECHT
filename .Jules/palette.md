## 2024-10-03 - Global focus states and dynamic aria-labels
**Learning:** In vanilla HTML/JS applications, browser default focus styles are often hidden or inconsistent. Explicitly adding a global `:focus-visible` CSS rule ensures a reliable visual indicator for keyboard users across the entire application without needing to style every component individually. Furthermore, when generating HTML dynamically via JS template strings, developers often forget to add accessibility attributes. Always remember to add `aria-label`s directly inside these dynamic template strings (e.g. for icon-only `.block-delete` buttons) to ensure the dynamically created DOM elements remain accessible.
**Action:** Implement global `:focus-visible` styles early in a project's CSS foundation, and explicitly verify that dynamically injected string templates contain the necessary `aria-label` and `role` attributes for interactive elements.

## 2024-05-18 - Clickable Toggle Labels
**Learning:** Custom UI toggle switches often implement their descriptive text alongside the actual input but fail to link them semantically. Using a standard `<label for="[id]">` wrapper around the text ensures it becomes clickable, expanding the hit area and significantly improving accessibility and UX without requiring Javascript event handlers.
**Action:** Always wrap descriptive text for custom checkboxes or toggles in a `<label>` linked by `for` attribute to the input `id`.

## 2024-10-24 - Native Button Elements for Accessible Custom UI Selectors
**Learning:** Using generic `<div>` tags with `click` event listeners to create custom UI elements (like day selector toggle buttons) completely bypasses native accessibility. They cannot receive focus or respond to keyboard actions like `Space` or `Enter` by default. Simply adding click handlers is insufficient.
**Action:** Always use semantic `<button>` elements for custom toggles or selectors. Using native `<button type="button">` implicitly provides focusability and keyboard event support out-of-the-box. Furthermore, when creating single-select toggle sets, use `aria-pressed` to announce the toggled state to screen readers.
