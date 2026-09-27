## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.

## 2024-05-15 - Surgical DOM Updates vs Full Re-Renders in Intervals
**Learning:** Using full DOM re-renders (like `renderSchedule` or `renderOven`) within `setInterval` loops for minor periodic UI updates (e.g., updating a current time indicator line) causes severe CPU spikes and layout thrashing because it destroys and rebuilds massive numbers of DOM nodes unnecessarily.
**Action:** Always implement surgically targeted DOM updates (e.g., passing the parent grid to an `updateNowLine` function to simply reposition a single element) inside `setInterval` loops instead of re-invoking the full rendering functions.
