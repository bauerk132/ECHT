## 2024-11-07 - [Accessible Tabs]
**Learning:** When replacing `<div>` based tabs with semantic `<button type="button" role="tab">` elements for accessibility, explicitly add CSS resets (e.g., `appearance: none; background: transparent; border: none;`) to prevent default browser button styling. Ensure the JS event listener synchronizes the `aria-selected` attribute correctly.
**Action:** Always include button CSS resets and `aria-selected` synchronization when refactoring custom tabs.
