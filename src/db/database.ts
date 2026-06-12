import Dexie, { type EntityTable } from 'dexie'
import type { MealCategory } from '../data/meals'
import { formatDateKey, getStartDateForDay } from '../data/nutrition'

export interface MealLog {
  id?: number
  date: string
  mealId: string
  mealName: string
  calories: number
  protein: number
  fat: number
  carbs: number
  category: string
  timestamp: number
}

export interface WeightEntry {
  id?: number
  date: string
  weight: number
  timestamp: number
}

export type ThemeMode = 'system' | 'light' | 'dark'

export interface Settings {
  id: number
  startWeight: number
  targetWeight: number
  height: number
  startDate: string
  onboardingComplete: boolean
  pwaHintDismissed: boolean
  themeMode?: ThemeMode
  skipBreakfastDefault?: boolean
}

export interface DayPreference {
  id?: number
  date: string
  skipBreakfast?: boolean | null
  mealOverrides?: Partial<Record<MealCategory, string>>
}

export interface ShoppingCheck {
  id?: number
  week: number
  ingredientId: string
  checked: boolean
}

const db = new Dexie('FitagainDB') as Dexie & {
  mealLogs: EntityTable<MealLog, 'id'>
  weightEntries: EntityTable<WeightEntry, 'id'>
  settings: EntityTable<Settings, 'id'>
  shoppingChecks: EntityTable<ShoppingCheck, 'id'>
  dayPreferences: EntityTable<DayPreference, 'id'>
}

db.version(1).stores({
  mealLogs: '++id, date, mealId, timestamp',
  weightEntries: '++id, date, timestamp',
  settings: 'id',
})

db.version(2).stores({
  mealLogs: '++id, date, mealId, timestamp',
  weightEntries: '++id, date, timestamp',
  settings: 'id',
  shoppingChecks: '++id, week, ingredientId, [week+ingredientId]',
})

db.version(3)
  .stores({
    mealLogs: '++id, date, mealId, timestamp',
    weightEntries: '++id, date, timestamp',
    settings: 'id',
    shoppingChecks: '++id, week, ingredientId, [week+ingredientId]',
  })
  .upgrade(async (tx) => {
    const settings = await tx.table('settings').get(1)
    if (settings && !settings.themeMode) {
      await tx.table('settings').put({ ...settings, themeMode: 'system' })
    }
  })

db.version(4)
  .stores({
    mealLogs: '++id, date, mealId, timestamp',
    weightEntries: '++id, date, timestamp',
    settings: 'id',
    shoppingChecks: '++id, week, ingredientId, [week+ingredientId]',
    dayPreferences: '++id, &date',
  })
  .upgrade(async (tx) => {
    const settings = await tx.table('settings').get(1)
    if (settings && settings.skipBreakfastDefault === undefined) {
      await tx.table('settings').put({ ...settings, skipBreakfastDefault: false })
    }
  })

export { db }

export async function ensureDbOpen(): Promise<void> {
  if (!db.isOpen()) {
    await db.open()
  }
}

export async function getSettings(): Promise<Settings | undefined> {
  return db.settings.get(1)
}

export async function saveSettings(settings: Omit<Settings, 'id'>): Promise<void> {
  await db.settings.put({ ...settings, id: 1 })
}

export async function logMeal(log: Omit<MealLog, 'id' | 'timestamp'>): Promise<number> {
  return (await db.mealLogs.add({ ...log, timestamp: Date.now() })) as number
}

export async function removeMealLog(id: number): Promise<void> {
  await db.mealLogs.delete(id)
}

export async function getLogsForDate(date: string): Promise<MealLog[]> {
  return db.mealLogs.where('date').equals(date).toArray()
}

export async function getAllLogs(): Promise<MealLog[]> {
  return db.mealLogs.orderBy('timestamp').toArray()
}

export async function addWeightEntry(weight: number, date?: string): Promise<number> {
  const dateKey = date ?? new Date().toISOString().slice(0, 10)
  return (await db.weightEntries.add({ date: dateKey, weight, timestamp: Date.now() })) as number
}

export async function getWeightEntries(): Promise<WeightEntry[]> {
  return db.weightEntries.orderBy('timestamp').toArray()
}

export async function getShoppingChecks(week: number): Promise<ShoppingCheck[]> {
  return db.shoppingChecks.where('week').equals(week).toArray()
}

export async function toggleShoppingCheck(
  week: number,
  ingredientId: string,
  checked: boolean,
): Promise<void> {
  const existing = await db.shoppingChecks
    .where({ week, ingredientId })
    .first()

  if (existing?.id) {
    await db.shoppingChecks.update(existing.id, { checked })
  } else {
    await db.shoppingChecks.add({ week, ingredientId, checked })
  }
}

export async function getDayPreference(date: string): Promise<DayPreference | undefined> {
  return db.dayPreferences.where('date').equals(date).first()
}

export async function saveDayPreference(pref: Omit<DayPreference, 'id'>): Promise<void> {
  const existing = await getDayPreference(pref.date)
  if (existing?.id) {
    await db.dayPreferences.put({ ...existing, ...pref, id: existing.id })
  } else {
    await db.dayPreferences.add(pref)
  }
}

export async function exportData(): Promise<string> {
  const [settings, mealLogs, weightEntries, shoppingChecks, dayPreferences] = await Promise.all([
    db.settings.get(1),
    db.mealLogs.toArray(),
    db.weightEntries.toArray(),
    db.shoppingChecks.toArray(),
    db.dayPreferences.toArray(),
  ])
  return JSON.stringify(
    { settings, mealLogs, weightEntries, shoppingChecks, dayPreferences },
    null,
    2,
  )
}

export async function clearMealLogsOnly(): Promise<void> {
  await db.mealLogs.clear()
}

export async function shiftPlanStart(targetDay: number, keepLogs: boolean): Promise<void> {
  const settings = await getSettings()
  if (!settings) return

  const startDate = getStartDateForDay(targetDay)
  await saveSettings({ ...settings, startDate })
  if (!keepLogs) await clearMealLogsOnly()
}

export async function schedulePlanStart(startDate: string, keepLogs: boolean): Promise<void> {
  const settings = await getSettings()
  if (!settings) return

  await saveSettings({ ...settings, startDate })
  if (!keepLogs) await clearMealLogsOnly()
}

export async function startPlanToday(keepLogs: boolean): Promise<void> {
  await schedulePlanStart(formatDateKey(), keepLogs)
}

export async function clearAllData(): Promise<void> {
  await Promise.all([
    db.mealLogs.clear(),
    db.weightEntries.clear(),
    db.settings.clear(),
    db.shoppingChecks.clear(),
    db.dayPreferences.clear(),
  ])
}
