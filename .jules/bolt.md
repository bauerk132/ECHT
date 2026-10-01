## 2026-10-01 - Avoid Layout Thrashing in setInterval
**Learning:** In vanilla JS apps, triggering full DOM re-renders (like `renderSchedule()`) inside interval loops (e.g., every 60s for a time indicator) causes severe layout thrashing and high CPU usage.
**Action:** Use surgically targeted DOM updates (e.g., `updateNowLine(grid)`) to update only the specific elements that change over time, instead of re-rendering the entire container.
