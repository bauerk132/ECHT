1. **Change `.form-label` to semantic `<label>` elements**
   - In `index.html`, replace all instances of `<div class="form-label">` with `<label class="form-label" for="...">`, ensuring the `for` attribute correctly targets the corresponding input/select/textarea `id`.
   - Update `day-selector` sections: use `id` for the label and `role="group" aria-labelledby="..."` on the `.day-selector` containers, rather than `<label for="...">`.
2. **Review toggles**
   - Check if toggles have `<label for="...">` as noted in the memory. They seem to already have it, but verify.
3. **Add journal entry**
   - Write a journal entry about semantic forms and accessible wrappers to `.Jules/palette.md`.
4. **Pre-commit checks**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
