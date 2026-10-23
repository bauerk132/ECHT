## 2025-02-18 - Avoid array methods chained inside render loops
**Learning:** Chaining array methods like `tasks.filter(...).reduce(...)` inside application render loops (e.g. `renderAnalytics`) creates massive bottlenecks due to multiple O(N) traversals and intermediate array allocations.
**Action:** Consolidate data aggregation into a single O(N) `for` loop with multiple scalar accumulators, bypassing array creation overhead entirely.
