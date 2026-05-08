export interface Ingredient {
  item: string;
  amount: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  steps: Step[];
}
