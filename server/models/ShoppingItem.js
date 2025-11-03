import mongoose from 'mongoose'

const shoppingItemSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: '' }
}, { timestamps: true })

shoppingItemSchema.index({ userId: 1, name: 1 })

export default mongoose.models.ShoppingItem || mongoose.model('ShoppingItem', shoppingItemSchema)