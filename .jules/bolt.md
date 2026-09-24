## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.

## 2023-10-24 - Targeted DOM Updates in setInterval
**Learning:** In vanilla JS applications with large, complex grids, avoid triggering full DOM re-renders within `setInterval` loops for minor UI updates. Calling full render functions like `renderSchedule()` or `renderOven()` every minute just to update a simple "now line" causes severe layout thrashing and high CPU usage.
**Action:** Use surgically targeted DOM updates. Instead of full re-renders, directly call the function responsible for the minor update (e.g., `updateNowLine(document.getElementById('schedule-grid'))`) to prevent severe layout thrashing and high CPU usage.
