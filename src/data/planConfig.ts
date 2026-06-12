import type { Allergen } from './allergens'
import { DEFAULT_EXCLUDED_ALLERGENS } from './allergens'

export type PlanGoal = 'muscle' | 'gain' | 'lose' | 'maintain'

export const PLAN_GOAL_LABELS: Record<PlanGoal, string> = {
  muscle: 'Muskelaufbau',
  gain: 'Zunehmen',
  lose: 'Abnehmen',
  maintain: 'Gewicht halten',
}

export const BASE_PLAN_DAYS = 45
export const MIN_PLAN_DURATION = 21
export const MAX_PLAN_DURATION = 90

export interface PlanConfig {
  goal: PlanGoal
  planDuration: number
  startWeight: number
  height: number
  targetWeight?: number
  excludedAllergens: Allergen[]
  dislikedMealIds: string[]
}

export function clampPlanDuration(days: number): number {
  return Math.min(MAX_PLAN_DURATION, Math.max(MIN_PLAN_DURATION, Math.round(days)))
}

export function toBasePlanDay(day: number, planDuration: number): number {
  const duration = clampPlanDuration(planDuration)
  const clamped = Math.min(Math.max(day, 1), duration)
  return Math.min(BASE_PLAN_DAYS, Math.max(1, Math.round((clamped / duration) * BASE_PLAN_DAYS)))
}

export function scalePhaseEnd(baseEnd: number, planDuration: number): number {
  return Math.max(1, Math.round((baseEnd / BASE_PLAN_DAYS) * clampPlanDuration(planDuration)))
}

export function getScaledCheckpoints(planDuration: number): { day: number; label: string }[] {
  const base = [
    { day: 1, label: 'Start' },
    { day: 8, label: 'Woche 2' },
    { day: 11, label: 'Phase Aufbau' },
    { day: 15, label: 'Woche 3' },
    { day: 22, label: 'Woche 4' },
    { day: 26, label: 'Phase Deftig' },
    { day: 29, label: 'Woche 5' },
    { day: 36, label: 'Woche 6' },
    { day: 43, label: 'Woche 7' },
  ]
  const duration = clampPlanDuration(planDuration)
  return base.map((cp) => ({
    day: Math.min(duration, Math.max(1, Math.round((cp.day / BASE_PLAN_DAYS) * duration))),
    label: cp.label,
  }))
}

export function planConfigFromSettings(settings: {
  planGoal?: PlanGoal
  planDuration?: number
  startWeight: number
  height: number
  targetWeight?: number
  excludedAllergens?: Allergen[]
  dislikedMealIds?: string[]
}): PlanConfig {
  return {
    goal: settings.planGoal ?? 'muscle',
    planDuration: clampPlanDuration(settings.planDuration ?? BASE_PLAN_DAYS),
    startWeight: settings.startWeight,
    height: settings.height,
    targetWeight: settings.targetWeight,
    excludedAllergens: settings.excludedAllergens ?? [...DEFAULT_EXCLUDED_ALLERGENS],
    dislikedMealIds: settings.dislikedMealIds ?? [],
  }
}
