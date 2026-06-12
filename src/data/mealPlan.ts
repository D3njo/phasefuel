import type { MealCategory } from './meals'
import { getPhase, type Phase } from './nutrition'

export interface NoBreakfastSlots {
  mittag: string
  abend: string
  snack: string
  getraenk: string
  altSnack?: string
}

export interface DayPlan {
  day: number
  phase: Phase
  slots: Record<MealCategory, string[]>
  noBreakfast: NoBreakfastSlots
}

export interface WeekPlan {
  week: number
  days: number[]
  phase: Phase
  shopLabel: string
  proteinFocus: string[]
  carbFocus: string[]
  dayPlans: DayPlan[]
}

type DaySlotsInput = {
  fruehstueck: string
  mittag: string
  abend: string
  snack: string
  getraenk: string
  altSnack?: string
  fruehstueckAlt?: string
  mittagAlt?: string
  abendAlt?: string
  snackAlt?: string
  getraenkAlt?: string
  noBreakfast: NoBreakfastSlots
}

function mk(s: DaySlotsInput): DaySlotsInput {
  return s
}

function slotList(primary: string, alt?: string): string[] {
  return alt ? [primary, alt] : [primary]
}

function buildDayPlan(day: number, slots: DaySlotsInput): DayPlan {
  const phase = getPhase(day)
  const mealSlots: Record<MealCategory, string[]> = {
    fruehstueck: slotList(slots.fruehstueck, slots.fruehstueckAlt),
    mittag: slotList(slots.mittag, slots.mittagAlt),
    abend: slotList(slots.abend, slots.abendAlt),
    snack: slotList(slots.snack, slots.snackAlt),
    getraenk: slotList(slots.getraenk, slots.getraenkAlt),
  }
  if (slots.altSnack && phase !== 'sanfterStart' && !mealSlots.snack.includes(slots.altSnack)) {
    mealSlots.snack.push(slots.altSnack)
  }
  return { day, phase, slots: mealSlots, noBreakfast: slots.noBreakfast }
}

const week1Days: DaySlotsInput[] = [
  mk({ fruehstueck: 'm01', mittag: 'm11', abend: 'm28', snack: 'm37', getraenk: 'm49', fruehstueckAlt: 'm02', mittagAlt: 'm14', abendAlt: 'm29', snackAlt: 'm38', getraenkAlt: 'm50', noBreakfast: { mittag: 'm13', abend: 'm29', snack: 'm43', getraenk: 'm51' } }),
  mk({ fruehstueck: 'm02', mittag: 'm13', abend: 'm29', snack: 'm39', getraenk: 'm45', altSnack: 'm38', fruehstueckAlt: 'm03', mittagAlt: 'm14', abendAlt: 'm28', snackAlt: 'm37', getraenkAlt: 'm52', noBreakfast: { mittag: 'm14', abend: 'm30', snack: 'm44', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm01', mittag: 'm14', abend: 'm26', snack: 'm38', getraenk: 'm50', fruehstueckAlt: 'm04', mittagAlt: 'm15', abendAlt: 'm30', snackAlt: 'm39', getraenkAlt: 'm46', noBreakfast: { mittag: 'm15', abend: 'm29', snack: 'm44', getraenk: 'm49' } }),
  mk({ fruehstueck: 'm02', mittag: 'm15', abend: 'm28', snack: 'm37', getraenk: 'm47', altSnack: 'm39', fruehstueckAlt: 'm05', mittagAlt: 'm11', abendAlt: 'm29', snackAlt: 'm40', getraenkAlt: 'm51', noBreakfast: { mittag: 'm13', abend: 'm30', snack: 'm43', getraenk: 'm45' } }),
  mk({ fruehstueck: 'm04', mittag: 'm11', abend: 'm29', snack: 'm39', getraenk: 'm46', fruehstueckAlt: 'm01', mittagAlt: 'm13', abendAlt: 'm26', snackAlt: 'm38', getraenkAlt: 'm53', noBreakfast: { mittag: 'm14', abend: 'm29', snack: 'm44', getraenk: 'm50' } }),
  mk({ fruehstueck: 'm02', mittag: 'm14', abend: 'm26', snack: 'm38', getraenk: 'm45', altSnack: 'm37', fruehstueckAlt: 'm03', mittagAlt: 'm13', abendAlt: 'm28', snackAlt: 'm39', getraenkAlt: 'm49', noBreakfast: { mittag: 'm15', abend: 'm30', snack: 'm43', getraenk: 'm51' } }),
  mk({ fruehstueck: 'm01', mittag: 'm13', abend: 'm28', snack: 'm40', getraenk: 'm48', fruehstueckAlt: 'm02', mittagAlt: 'm15', abendAlt: 'm29', snackAlt: 'm37', getraenkAlt: 'm52', noBreakfast: { mittag: 'm14', abend: 'm29', snack: 'm44', getraenk: 'm53' } }),
]

const week2Days: DaySlotsInput[] = [
  mk({ fruehstueck: 'm02', mittag: 'm12', abend: 'm27', snack: 'm39', getraenk: 'm49', fruehstueckAlt: 'm03', mittagAlt: 'm34', abendAlt: 'm28', snackAlt: 'm38', getraenkAlt: 'm50', noBreakfast: { mittag: 'm16', abend: 'm30', snack: 'm43', getraenk: 'm51' } }),
  mk({ fruehstueck: 'm03', mittag: 'm12', abend: 'm28', snack: 'm37', getraenk: 'm46', altSnack: 'm38', fruehstueckAlt: 'm04', mittagAlt: 'm13', abendAlt: 'm27', snackAlt: 'm39', getraenkAlt: 'm52', noBreakfast: { mittag: 'm34', abend: 'm29', snack: 'm44', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm02', mittag: 'm34', abend: 'm30', snack: 'm38', getraenk: 'm45', fruehstueckAlt: 'm01', mittagAlt: 'm12', abendAlt: 'm28', snackAlt: 'm37', getraenkAlt: 'm49', noBreakfast: { mittag: 'm16', abend: 'm28', snack: 'm44', getraenk: 'm50' } }),
  mk({ fruehstueck: 'm03', mittag: 'm12', abend: 'm27', snack: 'm40', getraenk: 'm47', altSnack: 'm39', fruehstueckAlt: 'm02', mittagAlt: 'm34', abendAlt: 'm30', snackAlt: 'm38', getraenkAlt: 'm51', noBreakfast: { mittag: 'm19', abend: 'm30', snack: 'm43', getraenk: 'm45' } }),
  mk({ fruehstueck: 'm02', mittag: 'm34', abend: 'm28', snack: 'm37', getraenk: 'm50', fruehstueckAlt: 'm04', mittagAlt: 'm12', abendAlt: 'm27', snackAlt: 'm39', getraenkAlt: 'm46', noBreakfast: { mittag: 'm12', abend: 'm28', snack: 'm44', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm04', mittag: 'm12', abend: 'm30', snack: 'm39', getraenk: 'm45', altSnack: 'm38', fruehstueckAlt: 'm01', mittagAlt: 'm13', abendAlt: 'm28', snackAlt: 'm37', getraenkAlt: 'm52', noBreakfast: { mittag: 'm16', abend: 'm29', snack: 'm43', getraenk: 'm49' } }),
  mk({ fruehstueck: 'm02', mittag: 'm34', abend: 'm27', snack: 'm38', getraenk: 'm48', fruehstueckAlt: 'm03', mittagAlt: 'm12', abendAlt: 'm30', snackAlt: 'm40', getraenkAlt: 'm51', noBreakfast: { mittag: 'm34', abend: 'm28', snack: 'm44', getraenk: 'm50' } }),
]

const week3Days: DaySlotsInput[] = [
  mk({ fruehstueck: 'm02', mittag: 'm20', abend: 'm29', snack: 'm37', getraenk: 'm49', fruehstueckAlt: 'm06', mittagAlt: 'm16', abendAlt: 'm28', snackAlt: 'm38', getraenkAlt: 'm47', noBreakfast: { mittag: 'm18', abend: 'm32', snack: 'm41', getraenk: 'm51' } }),
  mk({ fruehstueck: 'm06', mittag: 'm19', abend: 'm26', snack: 'm39', getraenk: 'm46', altSnack: 'm41', fruehstueckAlt: 'm09', mittagAlt: 'm20', abendAlt: 'm29', snackAlt: 'm37', getraenkAlt: 'm50', noBreakfast: { mittag: 'm22', abend: 'm34', snack: 'm42', getraenk: 'm53', altSnack: 'm43' } }),
  mk({ fruehstueck: 'm02', mittag: 'm16', abend: 'm29', snack: 'm38', getraenk: 'm45', fruehstueckAlt: 'm07', mittagAlt: 'm18', abendAlt: 'm26', snackAlt: 'm39', getraenkAlt: 'm52', noBreakfast: { mittag: 'm20', abend: 'm32', snack: 'm44', getraenk: 'm49' } }),
  mk({ fruehstueck: 'm09', mittag: 'm20', abend: 'm28', snack: 'm37', getraenk: 'm47', altSnack: 'm40', fruehstueckAlt: 'm02', mittagAlt: 'm19', abendAlt: 'm29', snackAlt: 'm38', getraenkAlt: 'm51', noBreakfast: { mittag: 'm16', abend: 'm34', snack: 'm42', getraenk: 'm45' } }),
  mk({ fruehstueck: 'm02', mittag: 'm18', abend: 'm26', snack: 'm40', getraenk: 'm50', fruehstueckAlt: 'm06', mittagAlt: 'm16', abendAlt: 'm29', snackAlt: 'm37', getraenkAlt: 'm46', noBreakfast: { mittag: 'm19', abend: 'm32', snack: 'm41', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm06', mittag: 'm16', abend: 'm29', snack: 'm38', getraenk: 'm45', altSnack: 'm37', fruehstueckAlt: 'm09', mittagAlt: 'm20', abendAlt: 'm28', snackAlt: 'm39', getraenkAlt: 'm49', noBreakfast: { mittag: 'm18', abend: 'm34', snack: 'm43', getraenk: 'm51' } }),
  mk({ fruehstueck: 'm02', mittag: 'm19', abend: 'm28', snack: 'm37', getraenk: 'm48', fruehstueckAlt: 'm07', mittagAlt: 'm18', abendAlt: 'm26', snackAlt: 'm40', getraenkAlt: 'm47', noBreakfast: { mittag: 'm22', abend: 'm32', snack: 'm42', getraenk: 'm50' } }),
]

const week4Days: DaySlotsInput[] = [
  mk({ fruehstueck: 'm02', mittag: 'm17', abend: 'm32', snack: 'm41', getraenk: 'm49', fruehstueckAlt: 'm07', mittagAlt: 'm22', abendAlt: 'm34', snackAlt: 'm37', getraenkAlt: 'm51', noBreakfast: { mittag: 'm18', abend: 'm34', snack: 'm42', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm07', mittag: 'm22', abend: 'm34', snack: 'm37', getraenk: 'm46', altSnack: 'm38', fruehstueckAlt: 'm06', mittagAlt: 'm23', abendAlt: 'm32', snackAlt: 'm41', getraenkAlt: 'm50', noBreakfast: { mittag: 'm16', abend: 'm35', snack: 'm43', getraenk: 'm45', altSnack: 'm42' } }),
  mk({ fruehstueck: 'm06', mittag: 'm17', abend: 'm27', snack: 'm38', getraenk: 'm45', fruehstueckAlt: 'm02', mittagAlt: 'm22', abendAlt: 'm32', snackAlt: 'm37', getraenkAlt: 'm52', noBreakfast: { mittag: 'm19', abend: 'm32', snack: 'm44', getraenk: 'm49' } }),
  mk({ fruehstueck: 'm02', mittag: 'm23', abend: 'm34', snack: 'm41', getraenk: 'm47', altSnack: 'm37', fruehstueckAlt: 'm09', mittagAlt: 'm17', abendAlt: 'm27', snackAlt: 'm38', getraenkAlt: 'm51', noBreakfast: { mittag: 'm22', abend: 'm35', snack: 'm42', getraenk: 'm50' } }),
  mk({ fruehstueck: 'm07', mittag: 'm22', abend: 'm32', snack: 'm37', getraenk: 'm50', fruehstueckAlt: 'm06', mittagAlt: 'm23', abendAlt: 'm34', snackAlt: 'm41', getraenkAlt: 'm46', noBreakfast: { mittag: 'm17', abend: 'm34', snack: 'm43', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm06', mittag: 'm17', abend: 'm27', snack: 'm38', getraenk: 'm45', altSnack: 'm41', fruehstueckAlt: 'm02', mittagAlt: 'm22', abendAlt: 'm32', snackAlt: 'm37', getraenkAlt: 'm49', noBreakfast: { mittag: 'm18', abend: 'm35', snack: 'm42', getraenk: 'm51' } }),
  mk({ fruehstueck: 'm02', mittag: 'm23', abend: 'm34', snack: 'm41', getraenk: 'm48', fruehstueckAlt: 'm07', mittagAlt: 'm17', abendAlt: 'm27', snackAlt: 'm38', getraenkAlt: 'm47', noBreakfast: { mittag: 'm16', abend: 'm32', snack: 'm43', getraenk: 'm50' } }),
]

const week5Days: DaySlotsInput[] = [
  mk({ fruehstueck: 'm06', mittag: 'm31', abend: 'm29', snack: 'm37', getraenk: 'm49', fruehstueckAlt: 'm09', mittagAlt: 'm25', abendAlt: 'm26', snackAlt: 'm38', getraenkAlt: 'm51', noBreakfast: { mittag: 'm31', abend: 'm32', snack: 'm42', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm02', mittag: 'm25', abend: 'm26', snack: 'm39', getraenk: 'm46', altSnack: 'm41', fruehstueckAlt: 'm06', mittagAlt: 'm31', abendAlt: 'm29', snackAlt: 'm37', getraenkAlt: 'm50', noBreakfast: { mittag: 'm25', abend: 'm33', snack: 'm43', getraenk: 'm45', altSnack: 'm42' } }),
  mk({ fruehstueck: 'm09', mittag: 'm31', abend: 'm29', snack: 'm38', getraenk: 'm45', fruehstueckAlt: 'm08', mittagAlt: 'm20', abendAlt: 'm26', snackAlt: 'm39', getraenkAlt: 'm52', noBreakfast: { mittag: 'm20', abend: 'm35', snack: 'm41', getraenk: 'm49' } }),
  mk({ fruehstueck: 'm06', mittag: 'm20', abend: 'm26', snack: 'm41', getraenk: 'm47', altSnack: 'm37', fruehstueckAlt: 'm10', mittagAlt: 'm25', abendAlt: 'm29', snackAlt: 'm38', getraenkAlt: 'm51', noBreakfast: { mittag: 'm31', abend: 'm32', snack: 'm42', getraenk: 'm50' } }),
  mk({ fruehstueck: 'm02', mittag: 'm25', abend: 'm29', snack: 'm37', getraenk: 'm50', fruehstueckAlt: 'm09', mittagAlt: 'm31', abendAlt: 'm26', snackAlt: 'm39', getraenkAlt: 'm46', noBreakfast: { mittag: 'm25', abend: 'm33', snack: 'm43', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm09', mittag: 'm31', abend: 'm26', snack: 'm38', getraenk: 'm45', altSnack: 'm39', fruehstueckAlt: 'm06', mittagAlt: 'm20', abendAlt: 'm29', snackAlt: 'm37', getraenkAlt: 'm49', noBreakfast: { mittag: 'm31', abend: 'm35', snack: 'm42', getraenk: 'm51' } }),
  mk({ fruehstueck: 'm06', mittag: 'm20', abend: 'm29', snack: 'm41', getraenk: 'm48', fruehstueckAlt: 'm08', mittagAlt: 'm25', abendAlt: 'm26', snackAlt: 'm38', getraenkAlt: 'm47', noBreakfast: { mittag: 'm20', abend: 'm32', snack: 'm43', getraenk: 'm50' } }),
]

const week6Days: DaySlotsInput[] = [
  mk({ fruehstueck: 'm08', mittag: 'm21', abend: 'm33', snack: 'm41', getraenk: 'm49', fruehstueckAlt: 'm10', mittagAlt: 'm24', abendAlt: 'm35', snackAlt: 'm37', getraenkAlt: 'm51', noBreakfast: { mittag: 'm21', abend: 'm35', snack: 'm42', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm10', mittag: 'm24', abend: 'm33', snack: 'm37', getraenk: 'm46', altSnack: 'm42', fruehstueckAlt: 'm08', mittagAlt: 'm21', abendAlt: 'm35', snackAlt: 'm41', getraenkAlt: 'm50', noBreakfast: { mittag: 'm24', abend: 'm33', snack: 'm43', getraenk: 'm45', altSnack: 'm42' } }),
  mk({ fruehstueck: 'm08', mittag: 'm21', abend: 'm35', snack: 'm38', getraenk: 'm45', fruehstueckAlt: 'm06', mittagAlt: 'm22', abendAlt: 'm33', snackAlt: 'm37', getraenkAlt: 'm52', noBreakfast: { mittag: 'm21', abend: 'm35', snack: 'm41', getraenk: 'm49' } }),
  mk({ fruehstueck: 'm10', mittag: 'm24', abend: 'm33', snack: 'm41', getraenk: 'm47', altSnack: 'm37', fruehstueckAlt: 'm08', mittagAlt: 'm21', abendAlt: 'm35', snackAlt: 'm38', getraenkAlt: 'm51', noBreakfast: { mittag: 'm24', abend: 'm33', snack: 'm42', getraenk: 'm50' } }),
  mk({ fruehstueck: 'm08', mittag: 'm21', abend: 'm35', snack: 'm37', getraenk: 'm50', fruehstueckAlt: 'm10', mittagAlt: 'm24', abendAlt: 'm33', snackAlt: 'm41', getraenkAlt: 'm46', noBreakfast: { mittag: 'm21', abend: 'm35', snack: 'm43', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm10', mittag: 'm24', abend: 'm33', snack: 'm38', getraenk: 'm45', altSnack: 'm42', fruehstueckAlt: 'm08', mittagAlt: 'm21', abendAlt: 'm35', snackAlt: 'm37', getraenkAlt: 'm49', noBreakfast: { mittag: 'm21', abend: 'm33', snack: 'm41', getraenk: 'm51' } }),
  mk({ fruehstueck: 'm08', mittag: 'm21', abend: 'm35', snack: 'm41', getraenk: 'm48', fruehstueckAlt: 'm10', mittagAlt: 'm24', abendAlt: 'm33', snackAlt: 'm38', getraenkAlt: 'm47', noBreakfast: { mittag: 'm24', abend: 'm35', snack: 'm42', getraenk: 'm50' } }),
]

const week7Days: DaySlotsInput[] = [
  mk({ fruehstueck: 'm02', mittag: 'm22', abend: 'm34', snack: 'm37', getraenk: 'm49', fruehstueckAlt: 'm06', mittagAlt: 'm21', abendAlt: 'm35', snackAlt: 'm41', getraenkAlt: 'm51', noBreakfast: { mittag: 'm16', abend: 'm32', snack: 'm42', getraenk: 'm53' } }),
  mk({ fruehstueck: 'm06', mittag: 'm16', abend: 'm32', snack: 'm38', getraenk: 'm50', altSnack: 'm41', fruehstueckAlt: 'm09', mittagAlt: 'm23', abendAlt: 'm33', snackAlt: 'm37', getraenkAlt: 'm47', noBreakfast: { mittag: 'm20', abend: 'm34', snack: 'm43', getraenk: 'm45', altSnack: 'm42' } }),
  mk({ fruehstueck: 'm02', mittag: 'm19', abend: 'm26', snack: 'm40', getraenk: 'm48', fruehstueckAlt: 'm08', mittagAlt: 'm20', abendAlt: 'm29', snackAlt: 'm38', getraenkAlt: 'm52', noBreakfast: { mittag: 'm22', abend: 'm29', snack: 'm41', getraenk: 'm49' } }),
]

const weekDefinitions: Omit<WeekPlan, 'dayPlans'>[] = [
  { week: 1, days: [1, 2, 3, 4, 5, 6, 7], phase: 'sanfterStart', shopLabel: 'Hähnchen, Eier, Haferflocken & Reis', proteinFocus: ['Hähnchenbrust', 'Eier'], carbFocus: ['Haferflocken', 'Reis'] },
  { week: 2, days: [8, 9, 10, 11, 12, 13, 14], phase: 'sanfterStart', shopLabel: 'Hackfleisch, Eier, Nudeln & Kartoffeln', proteinFocus: ['Rinderhack', 'Eier'], carbFocus: ['Nudeln', 'Kartoffeln'] },
  { week: 3, days: [15, 16, 17, 18, 19, 20, 21], phase: 'aufbau', shopLabel: 'Hähnchen, Rind, Reis & Nudeln', proteinFocus: ['Hähnchenbrust', 'Rind (Hack/Gulasch)'], carbFocus: ['Reis', 'Nudeln'] },
  { week: 4, days: [22, 23, 24, 25, 26, 27, 28], phase: 'aufbau', shopLabel: 'Schwein, Hack, Kartoffeln & Spätzle', proteinFocus: ['Schweineschnitzel', 'Rinderhack'], carbFocus: ['Kartoffeln', 'Spätzle/Nudeln'] },
  { week: 5, days: [29, 30, 31, 32, 33, 34, 35], phase: 'deftig', shopLabel: 'Rind, Hähnchen, Reis & Käse', proteinFocus: ['Rindersteak', 'Hähnchen'], carbFocus: ['Reis', 'Nudeln'] },
  { week: 6, days: [36, 37, 38, 39, 40, 41, 42], phase: 'deftig', shopLabel: 'Burger, Pulled Pork & Pizza', proteinFocus: ['Burger-Patties', 'Schweinebraten'], carbFocus: ['Pizzateig', 'Nudeln'] },
  { week: 7, days: [43, 44, 45], phase: 'deftig', shopLabel: 'Resteverwertung — nur auffüllen', proteinFocus: ['Hack & Hähnchen'], carbFocus: ['Kartoffeln & Reis'] },
]

const weekSlotData = [week1Days, week2Days, week3Days, week4Days, week5Days, week6Days, week7Days]

export const weekPlans: WeekPlan[] = weekDefinitions.map((def, i) => {
  const slots = weekSlotData[i]
  const dayPlans = def.days.map((day, j) => buildDayPlan(day, slots[j]))
  return { ...def, dayPlans }
})

export const mealPlan: DayPlan[] = weekPlans.flatMap((w) => w.dayPlans)

export function getDayPlan(day: number): DayPlan {
  const plan = mealPlan.find((d) => d.day === day)
  if (plan) return plan
  return mealPlan[mealPlan.length - 1]
}

function slotWithAlt(primary: string, sources: string[]): string[] {
  const alt = sources.find((id) => id !== primary)
  return alt ? [primary, alt] : [primary]
}

function buildSlotsFromNoBreakfast(
  plan: DayPlan,
  nb: NoBreakfastSlots,
): Record<MealCategory, string[]> {
  const slots: Record<MealCategory, string[]> = {
    fruehstueck: [],
    mittag: slotWithAlt(nb.mittag, plan.slots.mittag),
    abend: slotWithAlt(nb.abend, plan.slots.abend),
    snack: slotWithAlt(nb.snack, plan.slots.snack),
    getraenk: slotWithAlt(nb.getraenk, plan.slots.getraenk),
  }
  if (nb.altSnack && plan.phase !== 'sanfterStart' && !slots.snack.includes(nb.altSnack)) {
    slots.snack.push(nb.altSnack)
  }
  return slots
}

function applyOverrides(
  slots: Record<MealCategory, string[]>,
  overrides?: Partial<Record<MealCategory, string>>,
): Record<MealCategory, string[]> {
  if (!overrides) return slots

  const result = { ...slots } as Record<MealCategory, string[]>
  for (const [cat, mealId] of Object.entries(overrides) as [MealCategory, string][]) {
    const current = [...(result[cat] ?? [])]
    if (current.includes(mealId)) {
      result[cat] = [mealId, ...current.filter((id) => id !== mealId)]
    } else {
      result[cat] = [mealId, ...current]
    }
  }
  return result
}

export function resolveDayPlan(
  plan: DayPlan,
  options: {
    skipBreakfast: boolean
    overrides?: Partial<Record<MealCategory, string>>
  },
): DayPlan {
  const baseSlots = options.skipBreakfast
    ? buildSlotsFromNoBreakfast(plan, plan.noBreakfast)
    : { ...plan.slots }

  const slots = applyOverrides(baseSlots, options.overrides)
  return { ...plan, slots }
}

export function getWeekForDay(day: number): number {
  const week = weekPlans.find((w) => w.days.includes(day))
  return week?.week ?? 7
}

export function getWeekPlan(week: number): WeekPlan | undefined {
  return weekPlans.find((w) => w.week === week)
}

export const TOTAL_WEEKS = weekPlans.length
