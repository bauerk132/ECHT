## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.
## 2023-10-25 - Avoid Full Re-Renders in `setInterval`
**Learning:** In the vanilla JS application, triggering full DOM re-renders (like `renderSchedule()` and `renderOven()`) inside frequent loops (like a 60s `setInterval`) for minor UI updates causes layout thrashing, UI stuttering, and high CPU usage. It also destroys ephemeral states (like scrolling, dragging, or focus).
**Action:** Use surgically targeted DOM updates (e.g., looking up the specific container element by ID and updating only its child elements or styles) instead of re-building the entire component.
