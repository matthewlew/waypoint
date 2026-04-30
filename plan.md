1. **Refactor Data Model to Multi-Context**:
   - Update `mkItem` to use arrays: `categoryIds`, `bagIds`, `purposeIds`, `dayIds`, `scenarios`.
   - Update `initItems` to pass arrays to `mkItem`.
   - Update `ITEMS.push` in `commitItem` to pass arrays.
   - Update `removeGroup` to filter arrays instead of checking strict equality.
   - Add visual `Saved to Closet` or `Added to Day` toast notification in `commitItem`.
2. **Implement Fallback Cards**:
   - Update `renderByCategory`, `renderByBag`, and `renderByPurpose` to filter using `.includes()`.
   - Display items with empty arrays in 'Uncategorized' or 'Unassigned' fallback cards inside these render functions.
3. **Enhance Mobile Touch Targets**:
   - Update CSS to ensure small interactive elements (`.dest-rm`, `.card-menu-btn`, `.cb`, `.drag-handle`) have at least 44x44px touch targets.
   - Wrap `:hover` states in `@media (hover: hover)`.
4. **Implement Day-First Architecture**:
   - Add a `day-items-list` section in `buildDayCard`.
   - Add a button `+ Add item to day` calling `openAddDayItem(dayId)`.
   - Implement `openAddDayItem` to show the 'Add item' sheet with `aiCtx={type:'day', dayId}`.
   - Render `itemRow`s in the `day-items-list` by checking `item.dayIds.includes(day.id)`.
5. **Eliminate Forced Inputs**:
   - Change `type="date"` and `type="time"` to `type="text"` or allow them to be empty without breaking.
   - Update `buildDays` to handle invalid/empty dates gracefully.
6. **Testing and Verification**:
   - Run `python3 -m http.server 8000` to start a local server.
   - Create and run a Playwright script to navigate the UI, verify the frontend changes visually, and take screenshots/videos.
7. **Complete pre-commit steps**: Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
8. **Submit the change**.
