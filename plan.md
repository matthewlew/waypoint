1. **Refactor Core Data Model in `index.html`**
   - Use `run_in_bash_session` with a node script to modify `mkItem` (around line 901) to replace single context assignments with arrays: `dayIds`, `bagIds`, `purposeIds`, `scenarios`.
   - Update `initItems()` (around line 939) using a node script to instantiate items with array contexts instead of scalar values.
   - Run `grep mkItem index.html` to visually verify the replacements.

2. **Add Missing Modules (Locations, Scenarios, Routines)**
   - Use `run_in_bash_session` to run a node replacement script updating the `BAGS` array (around line 915) to include explicit location objects: `Backpack`, `Tote / Purse`, `Luggage`, `Car seat`, and `Car trunk`.
   - Use `run_in_bash_session` with a node script to declare new arrays `let ROUTINES = []; let SCENARIOS = [];` near the `PURPOSES` declaration.
   - Run `grep -A 10 "let BAGS" index.html` and `grep "ROUTINES" index.html` to confirm file changes.

3. **Flexible Inputs**
   - Use `replace_with_git_merge_diff` to modify the `go()` logic (around line 986). Remove defaults like `'08:00'` if not filled, allowing for flexible/partial empty inputs. The date parsing handles undefined gracefully so it just requires not throwing an error.
   - Start a local python server, then optionally trigger frontend verification screenshot to manually ensure the empty setup forms load properly.

4. **Activity-Driven Outfit System & Completeness Feedback**
   - Use `replace_with_git_merge_diff` to modify `buildAlert()` (around line 1189). Read `day.nightText`. If it contains `/dinner|bar|concert|nightlife/` but `!/sleepwear|pyjamas|outfit/` in both day and night, append a soft alert html string `return \`<div class="smart-alert">... No evening outfit or sleepwear added.</div>\`` to the existing return.
   - Run a quick node sanity check to ensure the alert string template doesn't have syntax errors.

5. **Enhance UI and interactions (Toast + Drag n Drop)**
   - Use `replace_with_git_merge_diff` to inject a toast notification element `<div id="toast" class="toast"></div>` inside `index.html` body and add a `showToast(msg)` function script block.
   - Modify `commitItem()` (around line 1824) with `replace_with_git_merge_diff` to add `showToast('Saved to Closet');` directly before `closeAll();Haptic.medium();renderPack();`.
   - Use `replace_with_git_merge_diff` to modify `initDrag` (around line 1010). Add `:scope>.list-row` to the `container.querySelectorAll` string so it supports dragging packing list items, not just cards. The syntax `const rows=()=>[...container.querySelectorAll(':scope>.dest-row,:scope>.et-dest-row,:scope>.card,:scope>.list-row')];` will be used.
   - Run `node -c test.js` (by wrapping html logic) to check for syntax errors.

6. **Tests and Verification**
   - Run the frontend UI verification using `frontend_verification_instructions` and check test logs to confirm UI operates correctly.

7. **Pre Commit Steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

8. **Submit the Code**
   - Submit the branch.
