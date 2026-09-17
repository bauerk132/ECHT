## 2024-09-16 - Semantic Labels for Better Accessibility
**Learning:** This app frequently used `div` tags styled as visual labels (e.g. `<div class="form-label">`). These lack semantic meaning and do not associate properly with the corresponding inputs.
**Action:** Replaced these tags with proper semantic `<label>` elements mapped with the `for="..."` attribute. This drastically improves screen reader compatibility and provides a better UX for mouse users since clicking the label correctly focuses the input element.
