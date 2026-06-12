import type { Allergen } from '../allergens'
import type { MealIngredient } from '../ingredients'
import type { Phase } from '../nutrition'

export type MealCategory = 'fruehstueck' | 'mittag' | 'abend' | 'snack' | 'getraenk'

export interface Meal {
  id: string
  name: string
  description: string
  calories: number
  protein: number
  fat: number
  carbs: number
  category: MealCategory
  phases: Phase[]
  tags: string[]
  allergens?: Allergen[]
  ingredients: MealIngredient[]
}
