## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.
## 2024-05-24 - Layout Thrashing on Interval Updates
**Learning:** Rebuilding large DOM trees on intervals for minor UI updates (like moving a line indicating the current time) causes significant layout thrashing and high CPU usage in this architecture.
**Action:** Always use targeted DOM updates (`querySelector` or `getElementById` to modify specific nodes) instead of calling full render functions within `setInterval` loops.
