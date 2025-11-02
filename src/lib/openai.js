import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": import.meta.env.VITE_APP_URL,
    "X-Title": import.meta.env.VITE_APP_NAME,
  },
  dangerouslyAllowBrowser: true
});

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
      role: "system",
      content: COOKING_SYSTEM_PROMPT + (context.additionalContext ? `\n\nAdditional Context: ${context.additionalContext}` : '')
    };

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get AI response. Please try again.');
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
    
    Format as a clear, organized list.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [
        { role: "system", content: COOKING_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Recipe recommendation error:', error);
    throw new Error('Failed to get recipe recommendations. Please try again.');
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
    
    Keep advice realistic and sustainable.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [
        { role: "system", content: COOKING_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 600,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Nutritional advice error:', error);
    throw new Error('Failed to get nutritional advice. Please try again.');
  }
}

export default openai;