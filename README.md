# ChefMate

ChefMate is a React (Vite) frontend using Material-UI and Clerk for authentication. It integrates with TheMealDB for recipes. This repository currently contains only the frontend app.

## Running the app

- Install dependencies: `npm install`
- Start dev server: `npm run dev`

## MongoDB integration

This repo does not include a Node.js backend. MongoDB connections cannot be made directly from the browser. To use MongoDB:

- Create a backend (Node/Express, Next.js API routes, or serverless functions) that connects to MongoDB using `mongoose`.
- Expose REST endpoints (e.g. `/api/favorites`, `/api/calories`) that the frontend can call.
- Store your database connection string on the server side (never in the browser).

Suggested API routes:

- `POST /api/calories` – log a meal
- `GET /api/calories` – list entries
- `POST /api/favorites` – save a recipe
- `GET /api/favorites` – list saved recipes

Once a backend exists, update frontend calls to use your endpoints and remove any client-side mongoose imports.

## Environment variables

- Clerk keys for auth
- Backend API URL (e.g. `VITE_API_BASE_URL`) used by frontend to call your backend
- OpenRouter API: set `VITE_OPENROUTER_API_KEY`, `VITE_APP_URL`, `VITE_APP_NAME`

Example `.env` (use `.env.local` for local development):

```
VITE_OPENROUTER_API_KEY=your_key_here
VITE_APP_URL=http://localhost:5173/
VITE_APP_NAME=ChefMate
```

## Notes

- The navbar, dashboard cards, and recipes filtering have been updated for consistent Material-UI behavior.
- The landing page is designed for signed-out users; once signed in, the main app layout (Navbar + Sidebar + routed pages) is displayed.

## AI Chat (OpenRouter)

- The AI client uses a fetch-based OpenRouter integration (`src/lib/openai.js`) targeting `https://openrouter.ai/api/v1/chat/completions`.
- The assistant adopts a cooking-focused system prompt but answers any food-related questions: recipes, techniques, substitutions, nutrition, planning, and safety.
- If you run into issues, verify the environment variables are set and the network call succeeds in the browser dev tools.

## Inventory & Shopping List

- Inventory lets you add items with quantity, optional unit, and optional expiry date. Data is persisted in `localStorage`.
- Shopping List allows manual additions and removals, and receives items from Recipe Detail for missing ingredients.
- From Recipe Detail, use the “Add missing to shopping list” button to compare required ingredients against your inventory and auto-add missing items.
- Packaging scan is currently a stub: pressing “Scan packaging” shows an error notification “AI is out-of-credit”. Replace this later with OCR/barcode integration.

### Storage keys

- Inventory: `chefmate_inventory`
- Shopping List: `chefmate_shopping_list`

### Files

- `src/lib/storage.js` – local storage helpers and missing-ingredient logic
- `src/pages/Inventory.jsx` – inventory management UI
- `src/pages/ShoppingList.jsx` – shopping list UI
- `src/pages/RecipeDetail.jsx` – button to add missing ingredients to shopping list
