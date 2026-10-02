## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.
## 2026-10-02 - Layout Thrashing in `setInterval` Loops
**Learning:** In vanilla JS applications, frequent `setInterval` loops that execute full grid re-renders (like `renderSchedule()` destroying and recreating DOM) cause severe layout thrashing and high CPU usage.
**Action:** When updating minor UI state elements like a "now" line, use surgically targeted DOM updates (e.g., `updateNowLine(grid)`) instead of full re-renders to prevent performance bottlenecks.
