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

## Notes

- The navbar, dashboard cards, and recipes filtering have been updated for consistent Material-UI behavior.
- The landing page is designed for signed-out users; once signed in, the main app layout (Navbar + Sidebar + routed pages) is displayed.
