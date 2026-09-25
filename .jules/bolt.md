## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.
## 2026-09-25 - Sweep-line Algorithm for Conflict Detection
**Learning:** The nested loop $O(N^2)$ algorithm previously used for overlap detection on scheduled blocks drastically impacted performance for larger datasets (e.g., 5000 intervals).
**Action:** Implemented a sweep-line style interval overlap detection logic with $O(N \log N)$ complexity. By sorting intervals by `day` and `startSlot` first, tracking the `maxEnd`, we avoided $O(N^2)$ overhead and sped up the checks ~30x.
