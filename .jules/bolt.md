## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.
## 2026-09-29 - Prevent layout thrashing on timer interval
**Learning:** Triggering full DOM re-renders (like `renderSchedule` or `renderOven`) inside a `setInterval` loop for minor UI updates like a 'now-line' causes severe layout thrashing and high CPU usage.
**Action:** Always use surgically targeted DOM updates (e.g., passing a specific grid to `updateNowLine`) instead of rebuilding the entire DOM tree when dealing with frequent, minor visual updates in vanilla JS.
