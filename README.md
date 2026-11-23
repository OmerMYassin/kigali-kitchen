# Kigali Kitchen

A 30-day meal plan, pantry and grocery app for one person in Kigali, shopping at Simba, Spar and the local markets.

- 3 meals + 2 snacks a day, halal (chicken & beef), no fish, local-first ingredients
- Swap any meal or shuffle a whole day; edit, add or remove recipes; replace an ingredient in every recipe at once
- Pantry stock: goes up when you tick shopping items or save a receipt, down when you tick a meal as cooked; "Finished" puts an item on the next list
- Shopping lists (1 big shop + 3 top-ups) are recalculated from your plan minus what you already have
- Scan receipts on the phone (Tesseract.js) to track spending and update prices
- Works offline and installs to the phone home screen

Plain HTML/CSS/JS, no build step. Base data lives in `data.js`; your changes are saved in the browser.

Recipe photos: [TheMealDB](https://www.themealdb.com) (illustrative). Prices are estimates until you scan receipts.
