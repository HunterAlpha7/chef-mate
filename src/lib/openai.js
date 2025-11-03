// Lightweight OpenRouter client using fetch for reliability in the browser
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const APP_URL = typeof window !== 'undefined' ? window.location.origin : ''
const APP_NAME = import.meta.env.VITE_APP_NAME || 'ChefMate'

async function callOpenRouter(messages, options = {}) {
  // Prefer auto-routing to avoid data policy 404s when free models are restricted
  const model = options.model || 'openrouter/auto'
  const temperature = options.temperature ?? 0.7
  const max_tokens = options.max_tokens ?? 1000

  const headers = {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'HTTP-Referer': APP_URL,
    'Referer': APP_URL,
    'X-Title': APP_NAME,
    'Content-Type': 'application/json'
  }

  const body = JSON.stringify({ model, messages, temperature, max_tokens })

  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers,
    body
  })

  if (!res.ok) {
    const text = await res.text()
    // Provide a clearer message for data policy-related 404s
    if (res.status === 404 && /data policy/i.test(text)) {
      throw new Error('OpenRouter data policy prevents access to free models. Update privacy settings or use a non-free model.')
    }
    throw new Error(`OpenRouter error ${res.status}: ${text}`)
  }

  const data = await res.json()
  const choice = data?.choices?.[0]
  const message = choice?.message || { role: 'assistant', content: '' }
  return message
}

export const COOKING_SYSTEM_PROMPT = `You are ChefMate, an expert AI cooking assistant designed to help users with all their culinary needs. You are knowledgeable, friendly, and passionate about food and cooking.

Your primary responsibilities include:
1. **Recipe Recommendations**: Suggest recipes based on available ingredients, dietary restrictions, cooking time, and skill level
2. **Cooking Guidance**: Provide step-by-step cooking instructions, tips, and techniques
3. **Ingredient Substitutions**: Help users find alternatives for missing ingredients
4. **Nutritional Information**: Provide basic nutritional guidance and calorie information
5. **Meal Planning**: Assist with meal planning and preparation strategies
6. **Food Safety**: Share important food safety and storage tips
7. **Culinary Education**: Teach cooking techniques, knife skills, and kitchen basics

Guidelines for responses:
- Always be encouraging and supportive, especially for beginner cooks
- Provide practical, actionable advice
- Consider dietary restrictions and allergies seriously
- Suggest recipes that match the user's skill level
- Include approximate cooking times and serving sizes
- Mention key nutritional benefits when relevant
- Be creative with ingredient substitutions
- Focus on making cooking enjoyable and accessible

When recommending recipes, consider:
- Available ingredients and pantry staples
- Cooking time constraints
- Dietary preferences and restrictions
- Skill level and kitchen equipment
- Seasonal ingredients when possible
- Cultural and regional preferences

Always maintain a warm, helpful tone and remember that cooking should be fun and rewarding!`;

export async function getChatCompletion(messages, context = {}) {
  try {
    const systemMessage = {
      role: 'system',
      content: COOKING_SYSTEM_PROMPT + (context.additionalContext ? `\n\nAdditional Context: ${context.additionalContext}` : '')
    }

    const message = await callOpenRouter([systemMessage, ...messages], {
      // Keep defaults; allow auto model routing and avoid free-model 404s
      temperature: 0.7,
      max_tokens: 1000
    })

    return message
  } catch (error) {
    console.error('OpenRouter API Error:', error)
    throw new Error(error.message || 'Failed to get AI response. Please try again.')
  }
}

export async function getRecipeRecommendations(ingredients, preferences = {}) {
  try {
    const prompt = `Based on these ingredients: ${ingredients.join(', ')}, recommend 3-5 recipes. 
    ${preferences.dietaryRestrictions ? `Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}` : ''}
    ${preferences.cookingTime ? `Maximum cooking time: ${preferences.cookingTime} minutes` : ''}
    ${preferences.difficulty ? `Difficulty level: ${preferences.difficulty}` : ''}
    
    For each recipe, provide:
    1. Recipe name
    2. Brief description
    3. Estimated cooking time
    4. Difficulty level
    5. Key ingredients needed (highlight any missing ones)
    
    Format as a clear, organized list.`

    const message = await callOpenRouter([
      { role: 'system', content: COOKING_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ], { temperature: 0.8, max_tokens: 800 })

    return message.content
  } catch (error) {
    console.error('Recipe recommendation error:', error)
    throw new Error('Failed to get recipe recommendations. Please try again.')
  }
}

export async function getNutritionalAdvice(userProfile, goals) {
  try {
    const prompt = `Provide personalized nutritional advice for a user with the following profile:
    - Age: ${userProfile.age || 'Not specified'}
    - Gender: ${userProfile.gender || 'Not specified'}
    - Activity level: ${userProfile.activityLevel || 'Not specified'}
    - Current weight: ${userProfile.currentWeight || 'Not specified'}
    - Target weight: ${userProfile.targetWeight || 'Not specified'}
    - Dietary restrictions: ${userProfile.dietaryRestrictions?.join(', ') || 'None'}
    - Goals: ${goals}
    
    Provide practical, actionable advice including:
    1. Daily calorie recommendations
    2. Macronutrient distribution
    3. Meal timing suggestions
    4. Healthy recipe ideas
    5. Tips for achieving their goals
    
    Keep advice realistic and sustainable.`

    const message = await callOpenRouter([
      { role: 'system', content: COOKING_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ], { temperature: 0.6, max_tokens: 600 })

    return message.content
  } catch (error) {
    console.error('Nutritional advice error:', error)
    throw new Error('Failed to get nutritional advice. Please try again.')
  }
}
export default {}