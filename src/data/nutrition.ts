import {
  BASE_PLAN_DAYS,
  clampPlanDuration,
  scalePhaseEnd,
  toBasePlanDay,
  type PlanConfig,
  type PlanGoal,
} from './planConfig'

export type Phase = 'sanfterStart' | 'aufbau' | 'deftig'

export const PHASE_LABELS: Record<Phase, string> = {
  sanfterStart: 'Sanfter Start',
  aufbau: 'Aufbau',
  deftig: 'Deftig',
}

export const TOTAL_DAYS = BASE_PLAN_DAYS

const BASE_PHASE_ENDS = { sanfterStart: 10, aufbau: 25, deftig: BASE_PLAN_DAYS }

const MUSCLE_KCAL: Record<Phase, { kcalMin: number; kcalMax: number }> = {
  sanfterStart: { kcalMin: 2000, kcalMax: 2200 },
  aufbau: { kcalMin: 2300, kcalMax: 2600 },
  deftig: { kcalMin: 2600, kcalMax: 3000 },
}

const PROTEIN_PER_KG: Record<PlanGoal, number> = {
  muscle: 1.8,
  gain: 1.8,
  lose: 2.0,
  maintain: 1.6,
}

function lerp(min: number, max: number, t: number): number {
  return Math.round(min + (max - min) * t)
}

function estimateTdee(weightKg: number, heightCm: number, goal: PlanGoal): number {
  // Mifflin-St Jeor, male default (activity factor 1.375 light)
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * 30 + 5
  const tdee = bmr * 1.375
  if (goal === 'lose') return Math.round(tdee - 400)
  if (goal === 'maintain') return Math.round(tdee)
  return Math.round(tdee)
}

export function getPhase(day: number, planDuration: number = BASE_PLAN_DAYS): Phase {
  const d = Math.min(Math.max(day, 1), clampPlanDuration(planDuration))
  const end1 = scalePhaseEnd(BASE_PHASE_ENDS.sanfterStart, planDuration)
  const end2 = scalePhaseEnd(BASE_PHASE_ENDS.aufbau, planDuration)
  if (d <= end1) return 'sanfterStart'
  if (d <= end2) return 'aufbau'
  return 'deftig'
}

export function getPhaseRange(phase: Phase, planDuration: number): { start: number; end: number } {
  const duration = clampPlanDuration(planDuration)
  const end1 = scalePhaseEnd(BASE_PHASE_ENDS.sanfterStart, planDuration)
  const end2 = scalePhaseEnd(BASE_PHASE_ENDS.aufbau, planDuration)
  switch (phase) {
    case 'sanfterStart':
      return { start: 1, end: end1 }
    case 'aufbau':
      return { start: end1 + 1, end: end2 }
    case 'deftig':
      return { start: end2 + 1, end: duration }
  }
}

export function getPhaseDay(day: number, planDuration: number = BASE_PLAN_DAYS): number {
  const phase = getPhase(day, planDuration)
  const range = getPhaseRange(phase, planDuration)
  return day - range.start + 1
}

export function getPhaseLength(phase: Phase, planDuration: number): number {
  const range = getPhaseRange(phase, planDuration)
  return range.end - range.start + 1
}

export interface DailyTarget {
  day: number
  phase: Phase
  calories: number
  protein: number
  carbs: number
  fat: number
}

function getCaloriesForDay(
  day: number,
  phase: Phase,
  planDuration: number,
  goal: PlanGoal,
  weightKg: number,
  heightCm: number,
): number {
  const range = getPhaseRange(phase, planDuration)
  const phaseDay = day - range.start + 1
  const phaseLength = range.end - range.start + 1
  const progress = phaseLength === 1 ? 1 : (phaseDay - 1) / (phaseLength - 1)

  if (goal === 'lose' || goal === 'maintain') {
    const base = estimateTdee(weightKg, heightCm, goal)
    return base
  }

  const muscleRange = MUSCLE_KCAL[phase]
  let calories = lerp(muscleRange.kcalMin, muscleRange.kcalMax, progress)
  if (goal === 'gain') calories += 200
  return calories
}

export function getDailyTarget(day: number, config: PlanConfig): DailyTarget
export function getDailyTarget(day: number, weightKg: number): DailyTarget
export function getDailyTarget(
  day: number,
  configOrWeight: PlanConfig | number,
): DailyTarget {
  const config: PlanConfig =
    typeof configOrWeight === 'number'
      ? {
          goal: 'muscle',
          planDuration: BASE_PLAN_DAYS,
          startWeight: configOrWeight,
          height: 175,
          excludedAllergens: [],
          dislikedMealIds: [],
        }
      : configOrWeight

  const duration = clampPlanDuration(config.planDuration)
  const clampedDay = Math.min(Math.max(day, 1), duration)
  const phase = getPhase(clampedDay, duration)
  const calories = getCaloriesForDay(
    clampedDay,
    phase,
    duration,
    config.goal,
    config.startWeight,
    config.height,
  )
  const protein = Math.round(config.startWeight * PROTEIN_PER_KG[config.goal])
  const proteinKcal = protein * 4
  const remaining = Math.max(0, calories - proteinKcal)

  const carbRatio =
    config.goal === 'lose' ? 0.35 : phase === 'sanfterStart' ? 0.55 : 0.45
  const carbs = Math.round((remaining * carbRatio) / 4)
  const fat = Math.round((remaining * (1 - carbRatio)) / 9)

  return { day: clampedDay, phase, calories, protein, carbs, fat }
}

export function getDayNumber(
  startDate: string,
  date: Date = new Date(),
  planDuration: number = BASE_PLAN_DAYS,
): number {
  const start = new Date(startDate + 'T12:00:00')
  start.setHours(0, 0, 0, 0)
  const current = new Date(date)
  current.setHours(0, 0, 0, 0)
  const diff = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 0
  return Math.min(diff + 1, clampPlanDuration(planDuration))
}

export function getStartDateForDay(
  targetDay: number,
  anchor: Date = new Date(),
  planDuration: number = BASE_PLAN_DAYS,
): string {
  const clamped = Math.min(Math.max(targetDay, 1), clampPlanDuration(planDuration))
  const d = new Date(anchor)
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - (clamped - 1))
  return formatDateKey(d)
}

export interface PlanStatus {
  day: number
  daysUntilStart: number
  isBeforeStart: boolean
  isComplete: boolean
  phase: Phase | null
  planDuration: number
}

export function getPlanStatus(
  startDate: string,
  date: Date = new Date(),
  planDuration: number = BASE_PLAN_DAYS,
): PlanStatus {
  const duration = clampPlanDuration(planDuration)
  const day = getDayNumber(startDate, date, duration)
  const start = new Date(startDate + 'T12:00:00')
  start.setHours(0, 0, 0, 0)
  const current = new Date(date)
  current.setHours(0, 0, 0, 0)
  const diff = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) {
    return {
      day: 0,
      daysUntilStart: -diff,
      isBeforeStart: true,
      isComplete: false,
      phase: null,
      planDuration: duration,
    }
  }

  return {
    day,
    daysUntilStart: 0,
    isBeforeStart: false,
    isComplete: day >= duration && diff >= duration - 1,
    phase: day > 0 ? getPhase(day, duration) : null,
    planDuration: duration,
  }
}

export const PLAN_CHECKPOINTS: { day: number; label: string }[] = [
  { day: 1, label: 'Tag 1 — Woche 1 (Sanfter Start)' },
  { day: 8, label: 'Tag 8 — Woche 2' },
  { day: 11, label: 'Tag 11 — Phase Aufbau' },
  { day: 15, label: 'Tag 15 — Woche 3' },
  { day: 22, label: 'Tag 22 — Woche 4' },
  { day: 26, label: 'Tag 26 — Phase Deftig' },
  { day: 29, label: 'Tag 29 — Woche 5' },
  { day: 36, label: 'Tag 36 — Woche 6' },
  { day: 43, label: 'Tag 43 — Woche 7' },
]

export { toBasePlanDay }

export function formatDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function formatDateDE(dateKey: string): string {
  const [y, m, d] = dateKey.split('-')
  return `${d}.${m}.${y}`
}

export function isGoalReached(consumed: number, target: number): boolean {
  return consumed >= target * 0.8
}
