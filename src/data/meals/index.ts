import type { Allergen } from '../allergens'
import { getIngredientById } from '../ingredients'
import type { PlanGoal } from '../planConfig'
import type { Phase } from '../nutrition'
import { buildGainMeals } from './gain'
import { buildLoseMeals } from './lose'
import { buildMaintainMeals } from './maintain'
import { buildMuscleMeals } from './muscle'
import type { Meal, MealCategory } from './types'

export type { Meal, MealCategory } from './types'

export const CATEGORY_LABELS: Record<MealCategory, string> = {
  fruehstueck: 'Frühstück',
  mittag: 'Mittag',
  abend: 'Abend',
  snack: 'Snack',
  getraenk: 'Getränk',
}

const muscleMeals = buildMuscleMeals()
const loseMeals = buildLoseMeals()
const gainMeals = buildGainMeals()
const maintainMeals = buildMaintainMeals()

export const meals: Meal[] = [...muscleMeals, ...loseMeals, ...gainMeals, ...maintainMeals]

const mealMap = new Map(meals.map((m) => [m.id, m]))

export function getMealsForGoal(goal: PlanGoal): Meal[] {
  switch (goal) {
    case 'muscle':
      return muscleMeals
    case 'lose':
      return loseMeals
    case 'gain':
      return gainMeals
    case 'maintain':
      return maintainMeals
  }
}

export function getMealById(id: string): Meal | undefined {
  return mealMap.get(id)
}

export function getMealAllergens(meal: Meal): Allergen[] {
  const fromMeal = meal.allergens ?? []
  const fromIngredients = meal.ingredients.flatMap(
    (ing) => getIngredientById(ing.ingredientId)?.allergens ?? [],
  )
  return [...new Set([...fromMeal, ...fromIngredients])]
}

export function getMealsForPhase(phase: Phase): Meal[] {
  return muscleMeals.filter((m) => m.phases.includes(phase))
}

export function getMealsByCategory(category: MealCategory): Meal[] {
  return muscleMeals.filter((m) => m.category === category)
}

export function getMealsForPhaseAndCategory(phase: Phase, category: MealCategory): Meal[] {
  return muscleMeals.filter((m) => m.phases.includes(phase) && m.category === category)
}
