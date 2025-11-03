import mongoose from 'mongoose'

const inventoryItemSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: '' },
  expiryDate: { type: Date, default: null }
}, { timestamps: true })

inventoryItemSchema.index({ userId: 1, name: 1 })

export default mongoose.models.InventoryItem || mongoose.model('InventoryItem', inventoryItemSchema)