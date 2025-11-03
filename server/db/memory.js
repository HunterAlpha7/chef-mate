import { randomUUID } from 'crypto'

const db = {
  inventory: new Map(),
  shopping: new Map(),
  saved: new Map()
}

function ensureArr(collection, userId) {
  if (!db[collection].has(userId)) db[collection].set(userId, [])
  return db[collection].get(userId)
}

function list(collection, userId) {
  const arr = ensureArr(collection, userId)
  return arr.slice().sort((a, b) => b.createdAt - a.createdAt)
}

function create(collection, userId, item) {
  const arr = ensureArr(collection, userId)
  const doc = {
    ...item,
    _id: randomUUID(),
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  arr.push(doc)
  return doc
}

function update(collection, userId, id, updates) {
  const arr = ensureArr(collection, userId)
  const idx = arr.findIndex(d => d._id === id)
  if (idx === -1) return null
  arr[idx] = { ...arr[idx], ...updates, updatedAt: Date.now() }
  return arr[idx]
}

function deleteOne(collection, userId, id) {
  const arr = ensureArr(collection, userId)
  const before = arr.length
  const next = arr.filter(d => d._id !== id)
  db[collection].set(userId, next)
  return next.length !== before
}

function clear(collection, userId) {
  db[collection].set(userId, [])
  return true
}

function deleteSavedByRecipeId(userId, recipeId) {
  const arr = ensureArr('saved', userId)
  const before = arr.length
  const next = arr.filter(d => String(d.recipeId) !== String(recipeId))
  db.saved.set(userId, next)
  return next.length !== before
}

export default {
  list,
  create,
  update,
  deleteOne,
  clear,
  deleteSavedByRecipeId
}