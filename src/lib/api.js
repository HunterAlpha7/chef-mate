const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'

async function api(path, { method = 'GET', body, userId } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId || 'demo-user'
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`)
  }
  return res.status === 204 ? null : res.json()
}

// Inventory API
export const fetchInventory = (userId) => api('/api/inventory', { userId })
export const createInventoryItem = (userId, item) => api('/api/inventory', { method: 'POST', body: item, userId })
export const updateInventoryItemApi = (userId, id, updates) => api(`/api/inventory/${id}`, { method: 'PATCH', body: updates, userId })
export const deleteInventoryItem = (userId, id) => api(`/api/inventory/${id}`, { method: 'DELETE', userId })

// Shopping List API
export const fetchShoppingList = (userId) => api('/api/shopping', { userId })
export const createShoppingItem = (userId, item) => api('/api/shopping', { method: 'POST', body: item, userId })
export const updateShoppingItemApi = (userId, id, updates) => api(`/api/shopping/${id}`, { method: 'PATCH', body: updates, userId })
export const deleteShoppingItem = (userId, id) => api(`/api/shopping/${id}`, { method: 'DELETE', userId })
export const clearShoppingItems = (userId) => api('/api/shopping', { method: 'DELETE', userId })

// Saved Recipes API
export const fetchSavedRecipes = (userId) => api('/api/saved', { userId })
export const saveRecipe = (userId, recipe) => api('/api/saved', { method: 'POST', body: recipe, userId })
export const removeSavedRecipeById = (userId, id) => api(`/api/saved/${id}`, { method: 'DELETE', userId })
export const removeSavedRecipeByRecipeId = (userId, recipeId) => api(`/api/saved/byRecipeId?recipeId=${encodeURIComponent(recipeId)}`, { method: 'DELETE', userId })