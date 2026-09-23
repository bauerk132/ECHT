## 2024-05-18 - Missing ARIA labels in dynamic components & reliable focus states

**Learning:** When generating HTML dynamically via JS string literals (e.g., inside `createTaskBlockEl`), developers often forget to include accessibility attributes like `aria-label` for icon-only buttons. Furthermore, relying on default browser focus styles is risky because they are often inconsistent or overridden.

**Action:** Always include `aria-label` inside dynamic string literals when creating icon buttons. Implement a global `*:focus-visible` CSS rule (e.g., using `--echt-gold` and an outline offset) across the app to guarantee that keyboard users always have a clear visual indicator.