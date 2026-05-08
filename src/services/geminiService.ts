import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const generateRecipe = async (dishName: string): Promise<Recipe | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a detailed cooking recipe for: ${dishName}. Provide it as a JSON object that matches the following structure. 
      Use high-quality instructions and realistic measurements. 
      The image should be a relevant Unsplash URL or just leave it empty.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            image: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            cookTime: { type: Type.STRING },
            servings: { type: Type.NUMBER },
            difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  amount: { type: Type.STRING }
                },
                required: ['item', 'amount']
              }
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['title', 'description']
              }
            }
          },
          required: ['name', 'description', 'category', 'prepTime', 'cookTime', 'servings', 'difficulty', 'ingredients', 'steps']
        }
      }
    });

    const recipe = JSON.parse(response.text || '{}');
    // Ensure ID and fallback image
    return {
      ...recipe,
      id: recipe.id || Math.random().toString(36).substr(2, 9),
      image: recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800'
    };
  } catch (error) {
    console.error("Error generating recipe:", error);
    return null;
  }
};
