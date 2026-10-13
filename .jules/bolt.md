## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.

## 2023-10-25 - Avoid Layout Thrashing in Intervals
**Learning:** Calling full re-render functions (like `renderSchedule` and `renderOven`) inside `setInterval` for minor updates like time indicators causes severe layout thrashing and high CPU usage due to hundreds of DOM nodes being recreated every minute.
**Action:** Use surgically targeted DOM updates (e.g., `updateNowLine(grid)`) instead of full DOM re-renders within interval loops.

## 2023-10-26 - O(N^2) Interval Overlap Bottlenecks
**Learning:** Checking for overlapping blocks (tasks, oven) using nested loops inherently becomes an O(N^2) bottleneck and drastically degrades grid rendering performance when element count increases.
**Action:** When validating schedules or extracting conflicts, pre-sort the list sequences by sequential attributes (e.g. `day` then `startSlot`). This converts the outer lookup into O(N log N) and allows the inner loops to safely short-circuit with a `break` once target sequence conditions bounds are exceeded, optimizing the validation close to O(N).
## 2024-05-18 - Optimize nested loops in vanilla JS render loops
**Learning:** In vanilla JS render loops that re-evaluate frequently (e.g., updating category counts on each add/delete/render), using nested O(N) operations like `.filter()` inside `.forEach()` over categories creates an O(C*N) bottleneck. Furthermore, modern JS engines can sometimes execute simple `for` loops faster than higher-order array methods like `.forEach` when dealing with tightly grouped data.
**Action:** When updating lists or counts that depend on mapping state collections to specific categories, pre-aggregate the data into a hash map (object) in a single O(N) pass, then iterate over the categories to perform DOM updates. This changes the complexity from O(C*N) to O(C+N) and reduces main thread blocking during re-renders. Use traditional `for` loops for these aggregation passes to minimize overhead in hot code paths.
