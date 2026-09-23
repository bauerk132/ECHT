## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.

## 2023-10-24 - Targeted DOM Updates in setInterval
**Learning:** In vanilla JS applications, triggering full DOM re-renders (like `renderSchedule()` or `renderOven()`) inside frequent `setInterval` loops (e.g., every 60 seconds to update a current time line) causes severe layout thrashing and high CPU usage, especially when grids contain hundreds of nodes.
**Action:** Use surgically targeted DOM updates (e.g., `updateNowLine(grid)`) instead of full rebuilds to prevent memory bloat and performance bottlenecks during background UI refreshes.
