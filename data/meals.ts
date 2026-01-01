import { IconName } from '../components/Icon';

interface MealVersion {
  ingredients: string[];
  costPerServing: number;
  swaps: string[];
}

export interface BlueprintMeal {
  id: string;
  name: string;
  icon: IconName;
  calories: number;
  protein: number;
  prepTime: number; // minutes
  bryansVersion: MealVersion;
  budgetVersion: MealVersion;
}

export const BLUEPRINT_MEALS: BlueprintMeal[] = [
  {
    id: 'super-veggie',
    name: 'Super Veggie',
    icon: 'salad',
    calories: 450,
    protein: 25,
    prepTime: 15,
    bryansVersion: {
      ingredients: [
        'Black lentils',
        'Broccoli (organic)',
        'Cauliflower (organic)',
        'Shiitake mushrooms',
        'Garlic',
        'Extra virgin olive oil',
        'Hemp seeds',
      ],
      costPerServing: 8.5,
      swaps: [],
    },
    budgetVersion: {
      ingredients: [
        'Green lentils',
        'Frozen broccoli',
        'Frozen cauliflower',
        'Button mushrooms',
        'Garlic',
        'Olive oil',
        'Sunflower seeds',
      ],
      costPerServing: 2.5,
      swaps: [
        'Green lentils instead of black (same nutrition)',
        'Frozen veggies are flash-frozen at peak nutrition',
        'Button mushrooms have similar benefits',
      ],
    },
  },
  {
    id: 'nutty-pudding',
    name: 'Nutty Pudding',
    icon: 'salad',
    calories: 500,
    protein: 30,
    prepTime: 10,
    bryansVersion: {
      ingredients: [
        'Macadamia nut milk',
        'Ground macadamia nuts',
        'Walnuts',
        'Chia seeds',
        'Flax seeds',
        'Blueberries (organic)',
        'Pomegranate seeds',
      ],
      costPerServing: 12,
      swaps: [],
    },
    budgetVersion: {
      ingredients: [
        'Unsweetened almond milk',
        'Peanut butter',
        'Walnuts',
        'Chia seeds',
        'Ground flax',
        'Frozen blueberries',
        'Banana',
      ],
      costPerServing: 3,
      swaps: [
        'Almond milk + peanut butter for macadamia',
        'Frozen berries are just as nutritious',
        'Banana for natural sweetness + potassium',
      ],
    },
  },
  {
    id: 'green-smoothie',
    name: 'Green Giant Smoothie',
    icon: 'salad',
    calories: 350,
    protein: 20,
    prepTime: 5,
    bryansVersion: {
      ingredients: [
        'Collagen peptides',
        'Spirulina',
        'Chlorella',
        'Spinach (organic)',
        'Kale (organic)',
        'Coconut water',
        'MCT oil',
      ],
      costPerServing: 10,
      swaps: [],
    },
    budgetVersion: {
      ingredients: [
        'Unflavored protein powder',
        'Frozen spinach',
        'Banana',
        'Peanut butter',
        'Water',
        'Cinnamon',
      ],
      costPerServing: 2,
      swaps: [
        'Skip expensive superfoods - spinach has similar benefits',
        'Protein powder instead of collagen',
        'Water instead of coconut water',
      ],
    },
  },
];

export const MEAL_COST_SUMMARY = {
  bryansDaily: 30.5,
  budgetDaily: 7.5,
  bryansMonthly: 915,
  budgetMonthly: 225,
  savingsMonthly: 690,
  savingsYearly: 8280,
};
