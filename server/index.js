import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import inventoryRoutes from './routes/inventory.js'
import shoppingRoutes from './routes/shopping.js'
import savedRoutes from './routes/saved.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: false
}))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

// Routes
app.use('/api/inventory', inventoryRoutes)
app.use('/api/shopping', shoppingRoutes)
app.use('/api/saved', savedRoutes)

// Start server (memory-backed)
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))