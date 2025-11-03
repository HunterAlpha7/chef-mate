# ChefMate — Cooking Companion

ChefMate is a modern, full-stack cooking companion application. The frontend is built with React (Vite) and Material-UI, and the backend is a lightweight Express server. It integrates with TheMealDB for recipe data and includes functional inventory, shopping list, and saved recipes features.

This README is a complete documentation you can use to set up, run, and extend the project.

## Quick Start

- Prerequisites: Node.js 18+ and npm
- Install dependencies: `npm install`
- Start frontend (Vite dev server): `npm run dev` (default `http://localhost:5174/`)
- Start backend (Express server): `npm run server` (default `http://localhost:3001/`)

The backend uses an in-memory store by default. No external databases or authentication are required; data resets when the server restarts.

## Architecture

- Frontend: React (Vite) + Material-UI
  - Pages: Dashboard, Recipes, Recipe Detail, Inventory, Shopping List, Chat, Calorie Tracker, Profile, Landing Page
  - Libraries: `@mui/material`, `lucide-react`
  - API client: `src/lib/api.js`, app helpers in `src/lib/storage.js`

- Backend: Express server
  - In-memory adapter: `server/db/memory.js`
  - Routes: `server/routes/inventory.js`, `server/routes/shopping.js`, `server/routes/saved.js`
  - Entry: `server/index.js`

- External services
  - TheMealDB (`src/lib/mealdb.js`) for recipe data
  - Optional AI chat via OpenRouter (`src/lib/openai.js`)

### Folder Overview

```
server/
  db/memory.js          # In-memory persistence (no DB required)
  index.js              # Express server entry
  routes/
    inventory.js        # Inventory endpoints
    shopping.js         # Shopping list endpoints
    saved.js            # Saved recipes endpoints

src/
  lib/
    api.js              # Fetch wrapper + backend helpers
    storage.js          # App helpers (inventory, shopping, missing ingredients)
    mealdb.js           # TheMealDB integration and formatters
    openai.js           # Optional AI chat client
  pages/                # UI pages
  components/           # Navbar, Sidebar, etc.
```

## Configuration

- Frontend (`.env.local`)
  - `VITE_SERVER_URL` — Backend base URL (default `http://localhost:3001`)
  - `VITE_MEAL_API_KEY` — Optional TheMealDB key
  - `VITE_OPENROUTER_API_KEY` — Optional for AI chat
  - `VITE_APP_URL`, `VITE_APP_NAME` — Optional metadata for AI chat

- Backend (`.env`)
  - `PORT` — Backend port (default `3001`)
  - `CORS_ORIGIN` — Allowed frontend origin (default `http://localhost:5174`)

No database variables are required for the default memory-backed backend.

## User Scoping

- All backend endpoints accept an optional `X-User-Id` header for simple user scoping.
- If omitted, the server defaults to `demo-user`.
- This enables multi-user behavior locally without authentication.

## API Reference

- Base URL: `http://localhost:3001`
- Common headers:
  - `Content-Type: application/json`
  - `X-User-Id: <your-id>` (optional)

### Inventory Endpoints

- `GET /api/inventory` — List items
  - Returns: `[{ _id, userId, name, quantity, unit, expiryDate, createdAt, updatedAt }]`

- `POST /api/inventory` — Add item
  - Body: `{ name: string, quantity?: number, unit?: string, expiryDate?: ISO8601|null }`
  - Returns: created item

- `PATCH /api/inventory/:id` — Update item
  - Body: partial fields, e.g. `{ quantity: 5 }`
  - Returns: updated item

- `DELETE /api/inventory/:id` — Remove item
  - Returns: `{ ok: true }`

Example:

```
curl -X POST http://localhost:3001/api/inventory \
  -H "Content-Type: application/json" \
  -H "X-User-Id: alice" \
  -d '{"name":"Milk","quantity":1,"unit":"L"}'
```

### Shopping List Endpoints

- `GET /api/shopping` — List entries
- `POST /api/shopping` — Add entry `{ name, quantity?, unit? }`
- `PATCH /api/shopping/:id` — Update entry
- `DELETE /api/shopping/:id` — Remove entry
- `DELETE /api/shopping` — Clear all entries for the user

Example:

```
curl -X POST http://localhost:3001/api/shopping \
  -H "Content-Type: application/json" \
  -H "X-User-Id: demo-user" \
  -d '{"name":"Eggs","quantity":12,"unit":"pcs"}'
```

### Saved Recipes Endpoints

- `GET /api/saved` — List saved recipes
- `POST /api/saved` — Save recipe `{ recipeId, title, thumbnail?, sourceUrl? }` (idempotent)
- `DELETE /api/saved/:id` — Remove by document ID
- `DELETE /api/saved/byRecipeId?recipeId=...` — Remove by recipe ID

Example:

```
curl -X POST http://localhost:3001/api/saved \
  -H "Content-Type: application/json" \
  -H "X-User-Id: bob" \
  -d '{"recipeId":"52772","title":"Teriyaki Chicken","thumbnail":"https://...jpg"}'
```

## Data Models

- InventoryItem: `{ _id, userId, name, quantity, unit, expiryDate|null, createdAt, updatedAt }`
- ShoppingItem: `{ _id, userId, name, quantity, unit, createdAt, updatedAt }`
- SavedRecipe: `{ _id, userId, recipeId, title, thumbnail, sourceUrl, createdAt, updatedAt }`

## Frontend Integration

- API client: `src/lib/api.js`
  - Inventory: `fetchInventory`, `createInventoryItem`, `updateInventoryItemApi`, `deleteInventoryItem`
  - Shopping: `fetchShoppingList`, `createShoppingItem`, `updateShoppingItemApi`, `deleteShoppingItem`, `clearShoppingItems`
  - Saved: `fetchSavedRecipes`, `saveRecipe`, `removeSavedRecipeById`, `removeSavedRecipeByRecipeId`

- App helpers: `src/lib/storage.js`
  - Inventory: `getInventory`, `addInventoryItem`, `updateInventoryItem`, `removeInventoryItem`
  - Shopping: `getShoppingList`, `addToShoppingList`, `removeFromShoppingList`, `clearShoppingList`
  - Missing ingredients: `getMissingIngredients(ingredients, inventoryItems)`

Usage:

```js
import { getInventory, addInventoryItem } from '../lib/storage'

const userId = 'demo-user'
const items = await getInventory(userId)
await addInventoryItem(userId, { name: 'Flour', quantity: 2, unit: 'kg' })
```

## Feature Walkthrough

- Inventory: add items with quantity, unit, optional expiry; remove items
- Shopping List: add/remove entries; clear list via API
- Recipes: browse/search via TheMealDB; open to view details, tags, links
- Recipe Detail: compare ingredients with inventory and add missing to shopping list; toggle favorite to save/remove recipes
- Chat (optional): AI cooking chat via OpenRouter if configured

## Development Notes

- Scripts
  - `npm run dev` — frontend
  - `npm run server` — backend
- Styling: Material-UI + `lucide-react`
- Persistence: memory-backed by default; swap `server/db/memory.js` for a real database to persist

## Troubleshooting

- Frontend cannot call backend: ensure `VITE_SERVER_URL` matches backend and CORS origin is correct
- CORS errors: set `CORS_ORIGIN` to `http://localhost:5174` or your actual frontend origin
- TheMealDB rate limits: consider using a key and retry logic
- Data resets on restart: expected with in-memory store

## Roadmap

- Persistent data layer
- Packaging scan via OCR/barcode
- Nutrition computation from ingredients
- Offline caching

## License

See `LICENSE` for details.
