## 2024-10-24 - File protocol loading for local vanilla JS tests
**Learning:** Playwright can seamlessly load local HTML files without a web server by using the `file://` protocol and the absolute path from `os.getcwd()`. This eliminates environment setup friction for vanilla JS applications without package managers.
**Action:** Default to `f"file://{os.getcwd()}/index.html"` when verifying local vanilla HTML changes unless a specific server configuration is mandated.
