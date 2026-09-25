## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.

## 2026-09-25 - Interval Overlap Complexity Reduction
**Learning:** Checking for overlaps between intervals across all days can trigger an O(N^2) bottleneck (layout thrashing) in single-threaded JS UI environments if many blocks are present.
**Action:** When evaluating block overlap across numerous elements (like tasks or oven blocks), pre-sort the list by sequential grouping (e.g., `day` then `startSlot`). This sorting enables safe short-circuiting (`break`) out of the O(N^2) inner loops when intervals can definitively no longer overlap.
