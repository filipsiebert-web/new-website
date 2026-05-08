import { Recipe } from './types';

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Classic Margherita Pizza',
    description: 'The quintessential Italian pizza with a crispy crust, fresh mozzarella, and aromatic basil.',
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=800',
    prepTime: '20 min',
    cookTime: '10 min',
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      { item: 'Pizza Dough', amount: '250g' },
      { item: 'Tomato Sauce', amount: '100ml' },
      { item: 'Fresh Mozzarella', amount: '125g' },
      { item: 'Fresh Basil Leaves', amount: 'Handful' },
      { item: 'Extra Virgin Olive Oil', amount: '1 tbsp' }
    ],
    steps: [
      { title: 'Prepare the oven', description: 'Preheat your oven to its highest setting (usually 250-275°C) with a pizza stone inside.' },
      { title: 'Shape the dough', description: 'Stretch the dough into a 12-inch circle on a piece of parchment paper.' },
      { title: 'Add toppings', description: 'Spread tomato sauce evenly, leaving a border. Tear mozzarella into pieces and scatter over sauce.' },
      { title: 'Bake', description: 'Slide the pizza onto the hot stone. Bake for 8-10 minutes until the crust is charred and cheese is bubbly.' },
      { title: 'Garnish', description: 'Add fresh basil leaves and a drizzle of olive oil before serving.' }
    ]
  },
  {
    id: '2',
    name: 'Thai Green Curry',
    description: 'A vibrant, spicy, and creamy curry that brings the street flavors of Bangkok to your kitchen.',
    category: 'Thai',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=800',
    prepTime: '15 min',
    cookTime: '20 min',
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { item: 'Green Curry Paste', amount: '3 tbsp' },
      { item: 'Coconut Milk', amount: '400ml' },
      { item: 'Chicken Breast', amount: '500g, sliced' },
      { item: 'Bamboo Shoots', amount: '200g' },
      { item: 'Fish Sauce', amount: '2 tbsp' },
      { item: 'Palm Sugar', amount: '1 tbsp' },
      { item: 'Thai Basil', amount: 'Handful' }
    ],
    steps: [
      { title: 'Sauté paste', description: 'In a large pan, fry the curry paste in a little oil until fragrant.' },
      { title: 'Simmer coconut milk', description: 'Add half the coconut milk and simmer until the oil starts to separate.' },
      { title: 'Cook chicken', description: 'Add chicken and cook until no longer pink outside.' },
      { title: 'Add vegetables', description: 'Add bamboo shoots, fish sauce, sugar, and remaining coconut milk. Simmer for 10 minutes.' },
      { title: 'Final touch', description: 'Stir in Thai basil leaves and serve with jasmine rice.' }
    ]
  },
  {
    id: '3',
    name: 'Salmon with Lemon Butter',
    description: 'Perfectly pan-seared salmon fillet finished with a silky lemon and flat-leaf parsley butter.',
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
    prepTime: '10 min',
    cookTime: '12 min',
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      { item: 'Salmon Fillets', amount: '2 pieces' },
      { item: 'Unsalted Butter', amount: '50g' },
      { item: 'Lemons', amount: '2 (juice and zest)' },
      { item: 'Fresh Parsley', amount: '2 tbsp chopped' },
      { item: 'Garlic', amount: '2 cloves, minced' }
    ],
    steps: [
      { title: 'Season', description: 'Dry salmon fillets with paper towels and season generously with salt and pepper.' },
      { title: 'Sear', description: 'Place salmon skin-side down in a hot pan with a little oil. Press down for 1 minute for crispy skin.' },
      { title: 'Flip', description: 'Cook for 5 minutes, then flip and cook for another 2-3 minutes.' },
      { title: 'Butter Sauce', description: 'Add butter, garlic, lemon juice, and zest to the pan. Baste the salmon for 1 minute.' },
      { title: 'Serve', description: 'Garnish with parsley and serve immediately.' }
    ]
  }
];
