import type { PlanConfig } from './planConfig'
import { getIngredientById, type Ingredient } from './ingredients'
import { getMealById, getMealsForGoal } from './meals'
import { getDayPlan, getWeekPlan, resolveDayPlan, type DayPlan, type WeekPlan } from './mealPlan'
import { filterSlots } from '../lib/mealFilters'

export interface ShoppingItem {
  ingredient: Ingredient
  totalAmount: number
  displayAmount: string
  usedInMeals: string[]
  pantry: boolean
}

function formatKg(grams: number): string {
  const rounded = Math.ceil(grams / 100) * 100
  const kg = rounded / 1000
  return kg >= 1 ? `~${kg.toFixed(1).replace('.0', '')} kg` : `~${rounded} g`
}

function roundAmount(_id: string, amount: number, unit: string): string {
  if (unit === 'Stück' || unit === 'Scheiben' || unit === 'Pack') {
    return `~${Math.ceil(amount)} ${unit}`
  }
  if (unit === 'ml') {
    if (amount >= 1000) {
      const liters = Math.ceil(amount / 100) / 10
      return `~${liters.toFixed(1).replace('.0', '')} L`
    }
    return `~${Math.ceil(amount / 250) * 250} ml`
  }
  if (unit === 'g') {
    return formatKg(amount)
  }
  return `~${Math.round(amount)} ${unit}`
}

function collectMealIdsForShopping(dayPlan: DayPlan): string[] {
  const ids = new Set<string>()
  for (const mealIds of Object.values(dayPlan.slots)) {
    for (const id of mealIds) ids.add(id)
  }
  const nb = dayPlan.noBreakfast
  ids.add(nb.mittag)
  ids.add(nb.abend)
  ids.add(nb.snack)
  ids.add(nb.getraenk)
  if (nb.altSnack) ids.add(nb.altSnack)
  return [...ids]
}

export function getShoppingList(week: number, config?: PlanConfig): ShoppingItem[] {
  const weekPlan = getWeekPlan(week)
  if (!weekPlan) return []

  const aggregated = new Map<string, { amount: number; meals: Set<string> }>()

  for (const dayNum of weekPlan.days) {
    const baseDay = config
      ? getDayPlan(dayNum, config.goal, config.planDuration)
      : getDayPlan(dayNum)
    const pool = config ? getMealsForGoal(config.goal) : []
    const filtered = config
      ? {
          ...baseDay,
          slots: filterSlots(baseDay.slots, pool, config) as DayPlan['slots'],
        }
      : baseDay
    const dayPlan = resolveDayPlan(filtered, { skipBreakfast: false })

    for (const mealId of collectMealIdsForShopping(dayPlan)) {
      const meal = getMealById(mealId)
      if (!meal) continue

      for (const { ingredientId, amount } of meal.ingredients) {
        const existing = aggregated.get(ingredientId) ?? { amount: 0, meals: new Set<string>() }
        existing.amount += amount
        existing.meals.add(meal.name)
        aggregated.set(ingredientId, existing)
      }
    }
  }

  const items: ShoppingItem[] = []

  for (const [ingredientId, { amount, meals }] of aggregated) {
    const ingredient = getIngredientById(ingredientId)
    if (!ingredient) continue

    items.push({
      ingredient,
      totalAmount: amount,
      displayAmount: roundAmount(ingredientId, amount, ingredient.unit),
      usedInMeals: [...meals],
      pantry: ingredient.pantry,
    })
  }

  const categoryOrder: Record<string, number> = {
    protein: 0,
    milch: 1,
    getreide: 2,
    gemuese: 3,
    obst: 4,
    vorrat: 5,
  }

  return items.sort((a, b) => {
    const catDiff = categoryOrder[a.ingredient.category] - categoryOrder[b.ingredient.category]
    if (catDiff !== 0) return catDiff
    return a.ingredient.name.localeCompare(b.ingredient.name, 'de')
  })
}

export function getFreshItems(week: number, config?: PlanConfig): ShoppingItem[] {
  return getShoppingList(week, config).filter((i) => !i.pantry)
}

export function getPantryItems(week: number, config?: PlanConfig): ShoppingItem[] {
  return getShoppingList(week, config).filter((i) => i.pantry)
}

export function getWeekSummary(weekPlan: WeekPlan): string {
  return weekPlan.shopLabel
}
