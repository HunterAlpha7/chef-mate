import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      recipeRecommendations: [{
        recipeId: String,
        recipeName: String,
        recipeImage: String,
        confidence: Number,
      }],
      ingredients: [String],
      cookingTips: [String],
      nutritionInfo: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
      }
    }
  }],
  context: {
    currentIngredients: [String],
    dietaryRestrictions: [String],
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert']
    },
    cookingTime: Number, // in minutes
    servings: Number,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  summary: String, // AI-generated summary of the conversation
}, {
  timestamps: true,
});

// Indexes for better query performance
chatHistorySchema.index({ userId: 1, createdAt: -1 });
chatHistorySchema.index({ sessionId: 1 });
chatHistorySchema.index({ userId: 1, isActive: 1 });

const ChatHistory = mongoose.models.ChatHistory || mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;