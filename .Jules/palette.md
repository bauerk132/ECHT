## 2024-10-03 - Global focus states and dynamic aria-labels
**Learning:** In vanilla HTML/JS applications, browser default focus styles are often hidden or inconsistent. Explicitly adding a global `:focus-visible` CSS rule ensures a reliable visual indicator for keyboard users across the entire application without needing to style every component individually. Furthermore, when generating HTML dynamically via JS template strings, developers often forget to add accessibility attributes. Always remember to add `aria-label`s directly inside these dynamic template strings (e.g. for icon-only `.block-delete` buttons) to ensure the dynamically created DOM elements remain accessible.
**Action:** Implement global `:focus-visible` styles early in a project's CSS foundation, and explicitly verify that dynamically injected string templates contain the necessary `aria-label` and `role` attributes for interactive elements.

## 2024-05-18 - Clickable Toggle Labels
**Learning:** Custom UI toggle switches often implement their descriptive text alongside the actual input but fail to link them semantically. Using a standard `<label for="[id]">` wrapper around the text ensures it becomes clickable, expanding the hit area and significantly improving accessibility and UX without requiring Javascript event handlers.
**Action:** Always wrap descriptive text for custom checkboxes or toggles in a `<label>` linked by `for` attribute to the input `id`.

## 2024-10-09 - Accessible Day Selectors
**Learning:** Custom grouped selectors (like day selectors in a scheduling app) built with `<div>` tags are fundamentally inaccessible via keyboard and screen readers. Replacing them with `<button type="button">` immediately enables Tab focus and Space/Enter interactions. Furthermore, using `aria-pressed="true|false"` dynamically communicates the selected state to assistive technologies, making the component fully semantic.
**Action:** Always use `<button type="button">` for interactive custom controls, and implement `aria-pressed` for toggleable states.
