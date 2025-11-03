import { fetchInventory, createInventoryItem, updateInventoryItemApi, deleteInventoryItem, fetchShoppingList, createShoppingItem, deleteShoppingItem, clearShoppingItems } from './api'

// Inventory via backend API
export async function getInventory(userId) {
  return await fetchInventory(userId)
}

export async function addInventoryItem(userId, item) {
  return await createInventoryItem(userId, item)
}

export async function updateInventoryItem(userId, id, updates) {
  return await updateInventoryItemApi(userId, id, updates)
}

export async function removeInventoryItem(userId, id) {
  return await deleteInventoryItem(userId, id)
}

// Shopping List via backend API
export async function getShoppingList(userId) {
  return await fetchShoppingList(userId)
}

export async function addToShoppingList(userId, entry) {
  return await createShoppingItem(userId, entry)
}

export async function removeFromShoppingList(userId, id) {
  return await deleteShoppingItem(userId, id)
}

export async function clearShoppingList(userId) {
  return await clearShoppingItems(userId)
}

// Helpers
export function getMissingIngredients(ingredients, inventoryItems) {
  // ingredients: array of { ingredient, measure }
  // measure parsing is best-effort; fallback to quantity 1
  const parseQty = (measure) => {
    if (!measure) return 1
    const m = String(measure).match(/([\d\.]+)/)
    return m ? Number(m[1]) : 1
  }
  const missing = []
  for (const ing of ingredients) {
    const normalized = ing.ingredient.toLowerCase().trim()
    const haveItem = (inventoryItems || []).find(it => it.name.toLowerCase().trim() === normalized)
    const haveQty = haveItem?.quantity || 0
    const needQty = parseQty(ing.measure)
    if (haveQty < needQty) {
      missing.push({ name: ing.ingredient, quantity: Math.max(needQty - haveQty, needQty), unit: '' })
    }
  }
  return missing
}