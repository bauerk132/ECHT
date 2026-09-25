## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.

## 2024-05-20 - O(N log N) Conflict Detection

**Learning:** When detecting overlaps between intervals, an O(N^2) comparison loop can be heavily optimized by first sorting the array by the primary grouping key (e.g., day) and then the starting interval. This allows for early termination of the inner loop (when the inner item is on a different day, or when its start time is later than the outer item's end time), drastically reducing the search space.

**Action:** Whenever implementing `activeConflicts` or similar overlap detection across large time-series arrays, pre-sort the array and utilize `break` conditions to achieve O(N log N) time complexity instead of O(N^2).
