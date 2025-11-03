const INVENTORY_KEY = 'chefmate_inventory'
const SHOPPING_LIST_KEY = 'chefmate_shopping_list'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Inventory
export function getInventory() {
  return read(INVENTORY_KEY, [])
}

export function setInventory(items) {
  write(INVENTORY_KEY, items)
}

export function addInventoryItem(item) {
  const items = getInventory()
  items.push({
    id: Date.now(),
    name: item.name.trim(),
    quantity: Number(item.quantity) || 0,
    unit: item.unit?.trim() || '',
    expiryDate: item.expiryDate || null
  })
  setInventory(items)
}

export function updateInventoryItem(id, updates) {
  const items = getInventory().map(it => it.id === id ? { ...it, ...updates } : it)
  setInventory(items)
}

export function removeInventoryItem(id) {
  const items = getInventory().filter(it => it.id !== id)
  setInventory(items)
}

export function findInventoryQuantity(name) {
  const items = getInventory()
  const normalized = name.toLowerCase().trim()
  const item = items.find(it => it.name.toLowerCase().trim() === normalized)
  return item ? { quantity: item.quantity, unit: item.unit } : null
}

// Shopping List
export function getShoppingList() {
  return read(SHOPPING_LIST_KEY, [])
}

export function setShoppingList(list) {
  write(SHOPPING_LIST_KEY, list)
}

export function addToShoppingList(entry) {
  const list = getShoppingList()
  list.push({ id: Date.now(), name: entry.name.trim(), quantity: Number(entry.quantity) || 0, unit: entry.unit || '' })
  setShoppingList(list)
}

export function removeFromShoppingList(id) {
  const list = getShoppingList().filter(it => it.id !== id)
  setShoppingList(list)
}

export function clearShoppingList() {
  setShoppingList([])
}

// Helpers
export function getMissingIngredients(ingredients) {
  // ingredients: array of { ingredient, measure }
  // measure parsing is best-effort; fallback to quantity 1
  const parseQty = (measure) => {
    if (!measure) return 1
    const m = String(measure).match(/([\d\.]+)/)
    return m ? Number(m[1]) : 1
  }
  const missing = []
  for (const ing of ingredients) {
    const have = findInventoryQuantity(ing.ingredient)
    const needQty = parseQty(ing.measure)
    if (!have || (have.quantity || 0) < needQty) {
      missing.push({ name: ing.ingredient, quantity: Math.max(needQty - (have?.quantity || 0), needQty), unit: '' })
    }
  }
  return missing
}