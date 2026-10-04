## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.

## 2023-10-25 - Avoid Layout Thrashing in Intervals
**Learning:** Calling full re-render functions (like `renderSchedule` and `renderOven`) inside `setInterval` for minor updates like time indicators causes severe layout thrashing and high CPU usage due to hundreds of DOM nodes being recreated every minute.
**Action:** Use surgically targeted DOM updates (e.g., `updateNowLine(grid)`) instead of full DOM re-renders within interval loops.

## 2026-10-04 - Pre-Sorting Arrays For Overlap Checks
**Learning:** Checking overlaps using a naive O(N^2) double-loop (checking every event against every other event) creates severe performance bottlenecks (taking >1.9s for 500 items). The problem scales quadratically, making drag-and-drop operations sluggish.
**Action:** Always pre-sort arrays by chronological attributes (e.g., `startSlot` or timestamp) and group by day/category. This turns an O(N^2) operation into O(N log N) + O(N), because the inner loop can be short-circuited with a `break` statement as soon as the chronological check fails.
