import type { PlanGoal } from '../planConfig'
import type { DayPlan } from '../mealPlan'
import type { MealCategory } from '../meals/types'
import { getMealsForGoal } from '../meals/index'
import { buildMuscleMeals } from '../meals/muscle'

const muscleMeals = buildMuscleMeals()

export function mapMealIdToGoal(muscleMealId: string, goal: PlanGoal): string {
  if (goal === 'muscle') return muscleMealId

  const meal = muscleMeals.find((m) => m.id === muscleMealId)
  if (!meal) return muscleMealId

  const goalMeals = getMealsForGoal(goal)
  const inCategory = goalMeals.filter((m) => m.category === meal.category)
  if (inCategory.length === 0) return muscleMealId

  const phaseMatched = inCategory.filter((m) =>
    meal.phases.some((p) => m.phases.includes(p)),
  )
  const pool = phaseMatched.length > 0 ? phaseMatched : inCategory

  const muscleInCategory = muscleMeals.filter((m) => m.category === meal.category)
  const indexInCategory = muscleInCategory.findIndex((m) => m.id === muscleMealId)
  const targetIndex = indexInCategory >= 0 ? indexInCategory % pool.length : 0
  return pool[targetIndex].id
}

function mapSlots(
  slots: Record<MealCategory, string[]>,
  goal: PlanGoal,
): Record<MealCategory, string[]> {
  const result = {} as Record<MealCategory, string[]>
  for (const [cat, ids] of Object.entries(slots) as [MealCategory, string[]][]) {
    result[cat] = ids.map((id) => mapMealIdToGoal(id, goal))
  }
  return result
}

export function remapDayPlanForGoal(plan: DayPlan, goal: PlanGoal, displayDay: number): DayPlan {
  return {
    ...plan,
    day: displayDay,
    slots: mapSlots(plan.slots, goal),
    noBreakfast: {
      mittag: mapMealIdToGoal(plan.noBreakfast.mittag, goal),
      abend: mapMealIdToGoal(plan.noBreakfast.abend, goal),
      snack: mapMealIdToGoal(plan.noBreakfast.snack, goal),
      getraenk: mapMealIdToGoal(plan.noBreakfast.getraenk, goal),
      ...(plan.noBreakfast.altSnack
        ? { altSnack: mapMealIdToGoal(plan.noBreakfast.altSnack, goal) }
        : {}),
    },
  }
}
