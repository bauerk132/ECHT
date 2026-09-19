## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.

## 2024-05-18 - Event Delegation for Dynamic Grid Cells
**Learning:** In the vanilla JS architecture of this application, large DOM structures (like the schedule and oven grids) are entirely recreated on every state change. Attaching individual event listeners inside the render loop (e.g., `grid.querySelectorAll('.time-cell').forEach(...)`) creates O(N) event bindings per render without cleaning up previous ones, leading to severe memory leaks and rendering bottlenecks.
**Action:** Always apply event delegation for dynamic grid elements by attaching a single event listener to the persistent parent container (`#schedule-grid` or `#oven-grid`) during app initialization. Use `e.target.classList.contains('class-name')` to handle delegated events efficiently.
