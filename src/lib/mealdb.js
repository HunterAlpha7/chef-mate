const MEAL_DB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const API_KEY = import.meta.env.VITE_MEAL_API_KEY;

class MealDBAPI {
  // Search meal by name
  static async searchByName(name) {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error searching meals by name:', error);
      throw new Error('Failed to search recipes');
    }
  }

  // Get meals by first letter
  static async getMealsByLetter(letter) {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/search.php?f=${letter}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error getting meals by letter:', error);
      throw new Error('Failed to get recipes');
    }
  }

  // Get meal details by ID
  static async getMealById(id) {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error('Error getting meal by ID:', error);
      throw new Error('Failed to get recipe details');
    }
  }

  // Get random meal
  static async getRandomMeal() {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/random.php`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error('Error getting random meal:', error);
      throw new Error('Failed to get random recipe');
    }
  }

  // Get all categories
  static async getCategories() {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error getting categories:', error);
      throw new Error('Failed to get categories');
    }
  }

  // Get meals by category
  static async getMealsByCategory(category) {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error getting meals by category:', error);
      throw new Error('Failed to get recipes by category');
    }
  }

  // Get meals by area/country
  static async getMealsByArea(area) {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error getting meals by area:', error);
      throw new Error('Failed to get recipes by area');
    }
  }

  // Get meals by main ingredient
  static async getMealsByIngredient(ingredient) {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error getting meals by ingredient:', error);
      throw new Error('Failed to get recipes by ingredient');
    }
  }

  // Get all areas
  static async getAreas() {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/list.php?a=list`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error getting areas:', error);
      throw new Error('Failed to get areas');
    }
  }

  // Get all ingredients
  static async getIngredients() {
    try {
      const response = await fetch(`${MEAL_DB_BASE_URL}/list.php?i=list`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error getting ingredients:', error);
      throw new Error('Failed to get ingredients');
    }
  }

  // Parse meal data to extract ingredients and measurements
  static parseMealIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : '',
        });
      }
    }
    return ingredients;
  }

  // Format meal data for consistent use
  static formatMeal(meal) {
    if (!meal) return null;

    return {
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      image: meal.strMealThumb,
      tags: meal.strTags ? meal.strTags.split(',').map(tag => tag.trim()) : [],
      youtube: meal.strYoutube,
      source: meal.strSource,
      ingredients: MealDBAPI.parseMealIngredients(meal),
      dateModified: meal.dateModified,
    };
  }

  // Search with multiple filters (enhanced search)
  static async advancedSearch(filters = {}) {
    try {
      let results = [];

      // If searching by name, prioritize that
      if (filters.name) {
        results = await this.searchByName(filters.name);
      }
      // If searching by ingredient, use that
      else if (filters.ingredient) {
        results = await this.getMealsByIngredient(filters.ingredient);
      }
      // If searching by category
      else if (filters.category) {
        results = await this.getMealsByCategory(filters.category);
      }
      // If searching by area
      else if (filters.area) {
        results = await this.getMealsByArea(filters.area);
      }
      // Default to random meals
      else {
        const randomMeal = await this.getRandomMeal();
        results = randomMeal ? [randomMeal] : [];
      }

      // Format all results
      return results.map(meal => this.formatMeal(meal)).filter(Boolean);
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw new Error('Failed to search recipes');
    }
  }

  // Get recipe suggestions based on available ingredients
  static async getRecipeSuggestions(availableIngredients = []) {
    try {
      const suggestions = [];
      
      // Search for recipes using each ingredient
      for (const ingredient of availableIngredients.slice(0, 3)) { // Limit to 3 ingredients to avoid too many requests
        const meals = await this.getMealsByIngredient(ingredient);
        suggestions.push(...meals.slice(0, 5)); // Limit results per ingredient
      }

      // Remove duplicates and format
      const uniqueMeals = suggestions.filter((meal, index, self) => 
        index === self.findIndex(m => m.idMeal === meal.idMeal)
      );

      return uniqueMeals.map(meal => this.formatMeal(meal)).filter(Boolean);
    } catch (error) {
      console.error('Error getting recipe suggestions:', error);
      throw new Error('Failed to get recipe suggestions');
    }
  }
}

export default MealDBAPI;