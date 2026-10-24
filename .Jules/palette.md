## 2024-10-24 - Semantic Day Selector Component

**Learning:** When building custom grouping components like a horizontal day selector (Mon, Tue, Wed...) from scratch using divs, they lack native keyboard focus, semantic meaning for screen readers, and state announcement. Using `button` for the interactive items and wrapping them with `role="group"` with an `aria-labelledby` linking to a visible label is the correct semantic pattern.
**Action:** Use native `<button type="button">` for interactive group items, reset their CSS styles to maintain custom design, manage their active state using `aria-pressed`, and wrap the container with `role="group"` and `aria-labelledby` referencing an `id` on the group's descriptive label.
