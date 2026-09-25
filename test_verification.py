import json
import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000/echt-analytics.html")

        # We inject test data via localStorage
        test_data = {
            "tasks": [
                {"day": 0, "startSlot": 10, "endSlot": 20, "passive": False, "category": "prep", "id": 1, "title": "Prep 1"},
                {"day": 0, "startSlot": 15, "endSlot": 25, "passive": False, "category": "mix", "id": 2, "title": "Prep 2"}
            ],
            "ovenBlocks": [
                {"day": 0, "startSlot": 30, "endSlot": 40, "id": 3},
                {"day": 0, "startSlot": 35, "endSlot": 45, "id": 4}
            ]
        }

        page.evaluate(f"localStorage.setItem('echt_bakery_v2', JSON.stringify({json.dumps(test_data)}));")
        page.reload()

        time.sleep(1) # wait for render

        # Wait for metrics to evaluate
        print(page.evaluate("document.getElementById('conflict-table-wrap').innerText"))

        browser.close()

if __name__ == "__main__":
    run()
