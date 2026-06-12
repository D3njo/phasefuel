import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useMemo } from 'react'
import { getDayPlan, resolveDayPlan, type DayPlan } from '../data/mealPlan'
import type { MealCategory } from '../data/meals'
import { getMealById } from '../data/meals'
import {
  formatDateKey,
  getDailyTarget,
  getDayNumber,
  getPlanStatus,
  isGoalReached,
  type DailyTarget,
  type PlanStatus,
} from '../data/nutrition'
import {
  db,
  getSettings,
  logMeal,
  removeMealLog,
  saveDayPreference,
  type DayPreference,
  type MealLog,
  type Settings,
} from '../db/database'

export interface DaySummary {
  date: string
  startDate: string
  dayNumber: number
  planStatus: PlanStatus
  target: DailyTarget
  consumed: { calories: number; protein: number; fat: number; carbs: number }
  remaining: { calories: number; protein: number }
  goalReached: boolean
  logs: MealLog[]
  plan: DayPlan
  skipBreakfast: boolean
  mealOverrides: Partial<Record<MealCategory, string>>
}

/** undefined = loading, null = no settings yet, Settings = loaded */
export function useSettings(): Settings | null | undefined {
  return useLiveQuery(async () => {
    await db.open()
    return (await getSettings()) ?? null
  }, [])
}

export function useDayPreference(date: string = formatDateKey()): DayPreference | undefined | null {
  return useLiveQuery(() => db.dayPreferences.where('date').equals(date).first(), [date])
}

export function useDaySummary(date: string = formatDateKey()): DaySummary | undefined {
  const settings = useSettings()
  const dayPref = useDayPreference(date)
  const logs = useLiveQuery(() => db.mealLogs.where('date').equals(date).toArray(), [date])

  return useMemo(() => {
    if (!settings || logs === undefined || dayPref === undefined) return undefined

    const refDate = new Date(date + 'T12:00:00')
    const planStatus = getPlanStatus(settings.startDate, refDate)
    const dayNumber = planStatus.day
    const effectiveDay = dayNumber > 0 ? dayNumber : 1
    const target = getDailyTarget(effectiveDay, settings.startWeight)
    const skipBreakfast =
      dayPref?.skipBreakfast ?? settings.skipBreakfastDefault ?? false
    const mealOverrides = dayPref?.mealOverrides ?? {}
    const plan = resolveDayPlan(getDayPlan(effectiveDay), {
      skipBreakfast,
      overrides: mealOverrides,
    })

    const consumed = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        fat: acc.fat + log.fat,
        carbs: acc.carbs + log.carbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 },
    )

    return {
      date,
      startDate: settings.startDate,
      dayNumber,
      planStatus,
      target,
      consumed,
      remaining: {
        calories: Math.max(0, target.calories - consumed.calories),
        protein: Math.max(0, target.protein - consumed.protein),
      },
      goalReached: isGoalReached(consumed.calories, target.calories),
      logs,
      plan,
      skipBreakfast,
      mealOverrides,
    }
  }, [settings, dayPref, logs, date])
}

export function useDayPreferenceActions(date: string = formatDateKey()) {
  const settings = useSettings()
  const dayPref = useDayPreference(date)

  const setSkipBreakfast = useCallback(
    async (skip: boolean | null) => {
      await saveDayPreference({
        date,
        skipBreakfast: skip,
        mealOverrides: dayPref?.mealOverrides,
      })
    },
    [date, dayPref?.mealOverrides],
  )

  const setMealOverride = useCallback(
    async (category: MealCategory, mealId: string) => {
      await saveDayPreference({
        date,
        skipBreakfast: dayPref?.skipBreakfast ?? null,
        mealOverrides: { ...dayPref?.mealOverrides, [category]: mealId },
      })
    },
    [date, dayPref],
  )

  const skipBreakfast =
    dayPref === undefined || dayPref === null
      ? (settings?.skipBreakfastDefault ?? false)
      : (dayPref.skipBreakfast ?? settings?.skipBreakfastDefault ?? false)

  return { setSkipBreakfast, setMealOverride, skipBreakfast, dayPref }
}

export function useMealActions() {
  const log = useCallback(async (mealId: string, date: string = formatDateKey()) => {
    const meal = getMealById(mealId)
    if (!meal) return

    await logMeal({
      date,
      mealId: meal.id,
      mealName: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      fat: meal.fat,
      carbs: meal.carbs,
      category: meal.category,
    })
  }, [])

  const logManual = useCallback(
    async (data: {
      name: string
      calories: number
      protein: number
      fat: number
      carbs: number
      date?: string
    }) => {
      await logMeal({
        date: data.date ?? formatDateKey(),
        mealId: 'manual',
        mealName: data.name,
        calories: data.calories,
        protein: data.protein,
        fat: data.fat,
        carbs: data.carbs,
        category: 'snack',
      })
    },
    [],
  )

  const remove = useCallback(async (id: number) => {
    await removeMealLog(id)
  }, [])

  return { log, logManual, remove }
}

export function useHistorySummaries() {
  const settings = useSettings()
  const allLogs = useLiveQuery(() => db.mealLogs.toArray(), [])

  return useMemo(() => {
    if (!settings || allLogs === undefined) return []

    const byDate = new Map<string, MealLog[]>()
    for (const log of allLogs) {
      const existing = byDate.get(log.date) ?? []
      existing.push(log)
      byDate.set(log.date, existing)
    }

    const summaries: DaySummary[] = []
    for (const [date, logs] of byDate) {
      const dayNumber = getDayNumber(settings.startDate, new Date(date + 'T12:00:00'))
      const target = getDailyTarget(dayNumber, settings.startWeight)
      const consumed = logs.reduce(
        (acc, log) => ({
          calories: acc.calories + log.calories,
          protein: acc.protein + log.protein,
          fat: acc.fat + log.fat,
          carbs: acc.carbs + log.carbs,
        }),
        { calories: 0, protein: 0, fat: 0, carbs: 0 },
      )

      const planStatus = getPlanStatus(settings.startDate, new Date(date + 'T12:00:00'))

      summaries.push({
        date,
        startDate: settings.startDate,
        dayNumber,
        planStatus,
        target,
        consumed,
        remaining: {
          calories: Math.max(0, target.calories - consumed.calories),
          protein: Math.max(0, target.protein - consumed.protein),
        },
        goalReached: isGoalReached(consumed.calories, target.calories),
        logs,
        plan: resolveDayPlan(getDayPlan(dayNumber), { skipBreakfast: false }),
        skipBreakfast: false,
        mealOverrides: {},
      })
    }

    return summaries.sort((a, b) => a.date.localeCompare(b.date))
  }, [settings, allLogs])
}

export function useStreak(): number {
  const summaries = useHistorySummaries()
  const today = formatDateKey()

  let streak = 0
  const dates = summaries
    .filter((s) => s.goalReached && s.date <= today)
    .map((s) => s.date)
    .sort((a, b) => b.localeCompare(a))

  if (dates.length === 0) return 0

  let checkDate = new Date(today + 'T12:00:00')
  for (let i = 0; i < 45; i++) {
    const key = formatDateKey(checkDate)
    if (dates.includes(key)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else if (key === today) {
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export function useLastActiveDay(): number | null {
  const settings = useSettings()
  const allLogs = useLiveQuery(() => db.mealLogs.toArray(), [])

  return useMemo(() => {
    if (!settings || allLogs === undefined || allLogs.length === 0) return null

    let maxDay = 0
    for (const log of allLogs) {
      const day = getDayNumber(settings.startDate, new Date(log.date + 'T12:00:00'))
      if (day > 0 && day > maxDay) maxDay = day
    }
    return maxDay > 0 ? maxDay : null
  }, [settings, allLogs])
}
