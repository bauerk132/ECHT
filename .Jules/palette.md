## 2024-10-03 - Global focus states and dynamic aria-labels
**Learning:** In vanilla HTML/JS applications, browser default focus styles are often hidden or inconsistent. Explicitly adding a global `:focus-visible` CSS rule ensures a reliable visual indicator for keyboard users across the entire application without needing to style every component individually. Furthermore, when generating HTML dynamically via JS template strings, developers often forget to add accessibility attributes. Always remember to add `aria-label`s directly inside these dynamic template strings (e.g. for icon-only `.block-delete` buttons) to ensure the dynamically created DOM elements remain accessible.
**Action:** Implement global `:focus-visible` styles early in a project's CSS foundation, and explicitly verify that dynamically injected string templates contain the necessary `aria-label` and `role` attributes for interactive elements.

## 2024-05-18 - Clickable Toggle Labels
**Learning:** Custom UI toggle switches often implement their descriptive text alongside the actual input but fail to link them semantically. Using a standard `<label for="[id]">` wrapper around the text ensures it becomes clickable, expanding the hit area and significantly improving accessibility and UX without requiring Javascript event handlers.
**Action:** Always wrap descriptive text for custom checkboxes or toggles in a `<label>` linked by `for` attribute to the input `id`.

## 2024-05-19 - Semantic Form Labels
**Learning:** In vanilla HTML forms, using `<div>` elements for text labels instead of native `<label>` elements reduces accessibility. Without proper `for` association or nesting, screen readers may not announce the field name correctly, and users cannot click the label text to focus the associated input field, reducing usability.
**Action:** Replace `<div>` tags acting as form labels with `<label>` tags linked to the input's `id` attribute. For grouped custom interactive elements (like day selectors), assign an ID to the descriptive text element and use `role="group"` and `aria-labelledby="[label-id]"` on the container instead of wrapping it in a `<label for="...">`.
