import { Router } from 'express'
import db from '../db/memory.js'

const router = Router()

function getUserId(req) {
  return req.header('X-User-Id') || 'demo-user'
}

// List saved recipes for user
router.get('/', async (req, res) => {
  const userId = getUserId(req)
  const items = db.list('saved', userId)
  res.json(items)
})

// Save a recipe for user
router.post('/', async (req, res) => {
  const userId = getUserId(req)
  const { recipeId, title, thumbnail = '', sourceUrl = '' } = req.body
  if (!recipeId || !title) return res.status(400).json({ error: 'recipeId and title are required' })
  const existing = db.list('saved', userId).find(r => String(r.recipeId) === String(recipeId))
  if (existing) return res.status(200).json(existing)
  const item = db.create('saved', userId, {
    recipeId: String(recipeId),
    title: String(title),
    thumbnail: String(thumbnail || ''),
    sourceUrl: String(sourceUrl || '')
  })
  res.status(201).json(item)
})

// Remove a saved recipe (by document id)
router.delete('/:id', async (req, res) => {
  const userId = getUserId(req)
  const { id } = req.params
  const deleted = db.deleteOne('saved', userId, id)
  if (!deleted) return res.status(404).json({ error: 'Saved recipe not found' })
  res.json({ ok: true })
})

// Remove by recipeId via query: /api/saved/byRecipeId?recipeId=123
router.delete('/byRecipeId', async (req, res) => {
  const userId = getUserId(req)
  const { recipeId } = req.query
  if (!recipeId) return res.status(400).json({ error: 'recipeId is required' })
  const deleted = db.deleteSavedByRecipeId(userId, recipeId)
  if (!deleted) return res.status(404).json({ error: 'Saved recipe not found' })
  res.json({ ok: true })
})

export default router