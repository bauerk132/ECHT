from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    filepath = f"file://{os.getcwd()}/index.html"
    page.goto(filepath)
    page.wait_for_timeout(1000)

    # Inject a couple tasks and ovenblocks directly into localStorage for testing empty states
    # Wait, the app seeds default data! (seedData function). Let's use that.

    # We should see some numbers in the categories in the sidebar.
    # E.g. "Croissant" should have > 0
    # Let's take a screenshot of the initial load, showing the sidebar counts.

    # Wait for the counts to update
    page.wait_for_timeout(500)

    # Take screenshot at the key moment
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)  # Hold final state for the video

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()  # MUST close context to save the video
            browser.close()