## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.
## 2026-09-25 - Redundant Array Filtering in computeAll

**Learning:** Redundant array `.filter()` calls inside loops (like iterating over days) in heavy computation functions can cause significant O(N) performance bottlenecks.

**Action:** Pre-bucket arrays by categories (like grouping items by `day` into pre-allocated arrays) outside the loop to change O(N) filtering to O(1) lookups during the main iterative logic.
