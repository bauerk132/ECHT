## 2023-10-24 - DOM Fragment Optimization for Large Grids
**Learning:** In vanilla JS applications with large, complex grids (like 768 elements generated via loop in `buildGrid`), repeatedly calling `.appendChild` directly on the active visible container forces multiple browser repaints and reflows which slows down render time.
**Action:** Use `document.createDocumentFragment()` to batch append all elements in memory, and append the fragment to the active container once at the end. This pattern should be applied when dynamically rendering large lists or grids to prevent layout thrashing.
## 2024-06-25 - Benchmarking Embedded JS

**Learning:** To unit test or benchmark embedded JavaScript in a vanilla HTML application without a browser environment, it is highly effective to extract the JS code via string manipulation (e.g., `html.split('<script>')[1].split('</script>')[0]`), create basic mock `document` and `window` objects, and evaluate the script using `new Function(...)` in a Node.js test script.

**Action:** Whenever performance testing or functionality verification is needed for embedded JS logic, write a custom Node script that extracts and evaluates the code with appropriate mock DOM APIs.
