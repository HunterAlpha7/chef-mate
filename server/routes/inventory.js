import { Router } from 'express'
import db from '../db/memory.js'

const router = Router()

// Simple user identification via header; in production use proper auth
function getUserId(req) {
  return req.header('X-User-Id') || 'demo-user'
}

router.get('/', async (req, res) => {
  const userId = getUserId(req)
  const items = db.list('inventory', userId)
  res.json(items)
})

router.post('/', async (req, res) => {
  const userId = getUserId(req)
  const { name, quantity = 0, unit = '', expiryDate = null } = req.body
  if (!name || !String(name).trim()) return res.status(400).json({ error: 'Name is required' })
  const item = db.create('inventory', userId, {
    name: String(name).trim(),
    quantity: Number(quantity) || 0,
    unit: String(unit || '').trim(),
    expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null
  })
  res.status(201).json(item)
})

router.patch('/:id', async (req, res) => {
  const userId = getUserId(req)
  const { id } = req.params
  const updates = req.body
  const item = db.update('inventory', userId, id, updates)
  if (!item) return res.status(404).json({ error: 'Item not found' })
  res.json(item)
})

router.delete('/:id', async (req, res) => {
  const userId = getUserId(req)
  const { id } = req.params
  const deleted = db.deleteOne('inventory', userId, id)
  if (!deleted) return res.status(404).json({ error: 'Item not found' })
  res.json({ ok: true })
})

export default router