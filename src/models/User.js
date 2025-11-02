import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  preferences: {
    dietaryRestrictions: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'keto', 'paleo', 'low-carb', 'halal', 'kosher']
    }],
    cuisinePreferences: [String],
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'extra-hot'],
      default: 'medium'
    },
    cookingSkillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    allergies: [String],
  },
  favoriteRecipes: [{
    recipeId: String,
    recipeName: String,
    recipeImage: String,
    dateAdded: {
      type: Date,
      default: Date.now
    }
  }],
  cookingStats: {
    totalRecipesCooked: {
      type: Number,
      default: 0
    },
    totalCookingTime: {
      type: Number,
      default: 0 // in minutes
    },
    favoriteCategory: String,
    streakDays: {
      type: Number,
      default: 0
    },
    lastCookingDate: Date,
  },
  calorieTracking: {
    isEnabled: {
      type: Boolean,
      default: false
    },
    dailyCalorieGoal: {
      type: Number,
      default: 2000
    },
    currentWeight: Number,
    targetWeight: Number,
    height: Number,
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extra-active'],
      default: 'moderately-active'
    }
  },
  recentActivity: [{
    type: {
      type: String,
      enum: ['recipe_viewed', 'recipe_cooked', 'chat_session', 'calorie_logged']
    },
    description: String,
    recipeId: String,
    recipeName: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
}, {
  timestamps: true,
});

// Index for better query performance
userSchema.index({ clerkId: 1 });
userSchema.index({ email: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;