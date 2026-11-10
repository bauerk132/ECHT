## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.

## 2023-10-25 - Avoid Layout Thrashing in Intervals
**Learning:** Calling full re-render functions (like `renderSchedule` and `renderOven`) inside `setInterval` for minor updates like time indicators causes severe layout thrashing and high CPU usage due to hundreds of DOM nodes being recreated every minute.
**Action:** Use surgically targeted DOM updates (e.g., `updateNowLine(grid)`) instead of full DOM re-renders within interval loops.

## 2023-10-26 - O(N^2) Interval Overlap Bottlenecks
**Learning:** Checking for overlapping blocks (tasks, oven) using nested loops inherently becomes an O(N^2) bottleneck and drastically degrades grid rendering performance when element count increases.
**Action:** When validating schedules or extracting conflicts, pre-sort the list sequences by sequential attributes (e.g. `day` then `startSlot`). This converts the outer lookup into O(N log N) and allows the inner loops to safely short-circuit with a `break` once target sequence conditions bounds are exceeded, optimizing the validation close to O(N).

## 2024-03-XX - O(N) Array Calculation Optimization
**Learning:** Using chained array methods like `.filter().reduce()` in vanilla JS render loops (e.g., in `computeAll` and `renderAnalytics`) creates redundant array traversals and intermediate memory allocations, causing performance bottlenecks for large task collections.
**Action:** Replace chained `.filter().reduce()` calls with single-pass `for` loops using scalar accumulators to prevent unnecessary memory allocation and reduce array traversals to O(N).
