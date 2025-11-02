import mongoose from 'mongoose';

const calorieEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  meals: [{
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    foods: [{
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
        default: 'serving'
      },
      calories: {
        type: Number,
        required: true,
      },
      nutrition: {
        protein: { type: Number, default: 0 }, // grams
        carbs: { type: Number, default: 0 }, // grams
        fat: { type: Number, default: 0 }, // grams
        fiber: { type: Number, default: 0 }, // grams
        sugar: { type: Number, default: 0 }, // grams
        sodium: { type: Number, default: 0 }, // mg
      },
      recipeId: String, // if from a recipe
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }]
  }],
  dailyTotals: {
    calories: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    carbs: {
      type: Number,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
    fiber: {
      type: Number,
      default: 0,
    },
    sugar: {
      type: Number,
      default: 0,
    },
    sodium: {
      type: Number,
      default: 0,
    }
  },
  waterIntake: {
    type: Number,
    default: 0, // in ml
  },
  exercise: [{
    activity: String,
    duration: Number, // in minutes
    caloriesBurned: Number,
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }],
  notes: String,
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'poor', 'terrible']
  },
  weight: Number, // daily weight if logged
}, {
  timestamps: true,
});

// Compound index for efficient date-based queries
calorieEntrySchema.index({ userId: 1, date: -1 });

// Pre-save middleware to calculate daily totals
calorieEntrySchema.pre('save', function(next) {
  const entry = this;
  
  // Reset totals
  entry.dailyTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };

  // Calculate totals from all meals
  entry.meals.forEach(meal => {
    meal.foods.forEach(food => {
      entry.dailyTotals.calories += food.calories || 0;
      entry.dailyTotals.protein += food.nutrition.protein || 0;
      entry.dailyTotals.carbs += food.nutrition.carbs || 0;
      entry.dailyTotals.fat += food.nutrition.fat || 0;
      entry.dailyTotals.fiber += food.nutrition.fiber || 0;
      entry.dailyTotals.sugar += food.nutrition.sugar || 0;
      entry.dailyTotals.sodium += food.nutrition.sodium || 0;
    });
  });

  next();
});

const CalorieEntry = mongoose.models.CalorieEntry || mongoose.model('CalorieEntry', calorieEntrySchema);

export default CalorieEntry;