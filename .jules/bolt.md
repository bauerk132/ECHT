## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.

## 2026-09-25 - Interval Overlap Detection Optimization
**Learning:** Interval overlap detection (like checking schedule conflicts) can easily become O(N^2) if every interval is checked against every other interval.
**Action:** Use a sweep-line style algorithm. By sorting intervals by start time (O(N log N)) and tracking the maximum end time seen so far, overlap detection can be reduced to O(N) traversal, resulting in significant performance gains for large datasets.
