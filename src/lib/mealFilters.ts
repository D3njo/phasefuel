import type { Allergen } from '../data/allergens'
import type { PlanConfig } from '../data/planConfig'
import type { Meal } from '../data/meals'
import { getMealAllergens } from '../data/meals'

export function isMealAllowed(
  meal: Meal,
  config: Pick<PlanConfig, 'excludedAllergens' | 'dislikedMealIds'>,
): boolean {
  if (config.dislikedMealIds.includes(meal.id)) return false
  const allergens = getMealAllergens(meal)
  return !allergens.some((a) => config.excludedAllergens.includes(a))
}

export function filterMeals(meals: Meal[], config: PlanConfig): Meal[] {
  return meals.filter((m) => isMealAllowed(m, config))
}

export function substituteIfExcluded(
  mealIds: string[],
  pool: Meal[],
  config: PlanConfig,
): string[] {
  const result: string[] = []
  for (const id of mealIds) {
    const meal = pool.find((m) => m.id === id)
    if (meal && isMealAllowed(meal, config)) {
      result.push(id)
      continue
    }
    const original = meal
    const replacement = pool.find(
      (m) =>
        isMealAllowed(m, config) &&
        m.category === original?.category &&
        !result.includes(m.id),
    )
    if (replacement) result.push(replacement.id)
    else if (meal) result.push(id)
  }
  return result.length ? result : mealIds
}

export function filterSlots(
  slots: Record<string, string[]>,
  pool: Meal[],
  config: PlanConfig,
): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const [cat, ids] of Object.entries(slots)) {
    out[cat] = substituteIfExcluded(ids, pool, config)
  }
  return out
}

export type { Allergen }
