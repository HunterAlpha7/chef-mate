import mongoose from 'mongoose'

const savedRecipeSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  recipeId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  sourceUrl: { type: String, default: '' }
}, { timestamps: true })

savedRecipeSchema.index({ userId: 1, recipeId: 1 }, { unique: true })

export default mongoose.models.SavedRecipe || mongoose.model('SavedRecipe', savedRecipeSchema)