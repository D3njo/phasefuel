import { COMMON_DISHES, DISH_KIND_LABELS, type DishKind } from '../data/commonDishes'
import type { Allergen } from '../data/allergens'
import type { SavedDish } from '../db/database'
import { expandQueryTokens, levenshtein, resolveSearchHint } from '../data/foodSynonyms'

export type FoodLookupSource = 'local' | 'online' | 'saved'

const CATALOG_MATCH_THRESHOLD = 85

export interface FoodLookupResult {
  name: string
  calories: number
  protein: number
  fat: number
  carbs: number
  source: FoodLookupSource
  kind?: DishKind
  servingNote?: string
}

export function normalizeFoodText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text: string): string[] {
  return normalizeFoodText(text).split(' ').filter(Boolean)
}

function termMatchesToken(term: string, token: string): boolean {
  if (term === token) return true
  if (term.startsWith(token) || token.startsWith(term)) return true
  if (term.includes(token) || token.includes(term)) return true
  if (token.length >= 5 && term.length >= 5 && levenshtein(term, token) <= 2) return true
  return false
}

function scoreDish(
  dish: (typeof COMMON_DISHES)[number],
  queryNorm: string,
  queryTokens: string[],
): number {
  const terms = [dish.name, ...dish.aliases].map(normalizeFoodText)
  let score = 0

  for (const term of terms) {
    if (term === queryNorm) score = Math.max(score, 120)
    else if (term.startsWith(queryNorm)) score = Math.max(score, 100)
    else if (queryNorm.startsWith(term) && term.length >= 4) score = Math.max(score, 90)
    else if (term.includes(queryNorm)) score = Math.max(score, 75)
    else if (queryNorm.includes(term) && term.length >= 4) score = Math.max(score, 60)
  }

  if (queryTokens.length > 0) {
    const allTokensMatch = queryTokens.every((qt) =>
      terms.some((term) => termMatchesToken(term, qt) || tokenize(term).some((tt) => termMatchesToken(tt, qt))),
    )
    if (allTokensMatch) score = Math.max(score, 80 + queryTokens.length * 5)
  }

  // Prefer sides/mains over combos for short single-word queries
  const isShortQuery = queryTokens.length <= 1 && queryNorm.length <= 14
  if (isShortQuery) {
    if (dish.kind === 'side' || dish.kind === 'snack') score += 25
    else if (dish.kind === 'main') score += 15
    else if (dish.kind === 'combo') score -= 15
  }

  // Exact alias word match (e.g. "pommes" alone)
  if (queryTokens.length === 1) {
    const t = queryTokens[0]
    if (dish.aliases.some((a) => normalizeFoodText(a) === t)) score += 30
    if (normalizeFoodText(dish.name) === t) score += 35
  }

  return score
}

export function isDishAllowed(
  dish: (typeof COMMON_DISHES)[number],
  excludedAllergens: Allergen[] = [],
): boolean {
  if (!dish.allergens?.length) return true
  return !dish.allergens.some((a) => excludedAllergens.includes(a))
}

export function getCatalogMatchScore(name: string): number {
  const q = normalizeFoodText(name)
  if (q.length < 2) return 0
  const queryTokens = expandQueryTokens(tokenize(name))
  let best = 0
  for (const dish of COMMON_DISHES) {
    best = Math.max(best, scoreDish(dish, q, queryTokens))
  }
  return best
}

export function matchesCatalogDish(name: string): boolean {
  return getCatalogMatchScore(name) >= CATALOG_MATCH_THRESHOLD
}

function scoreSavedDish(
  dish: SavedDish,
  queryNorm: string,
  queryTokens: string[],
): number {
  const terms = [dish.name, dish.nameKey].map(normalizeFoodText)
  let score = 0

  for (const term of terms) {
    if (term === queryNorm) score = Math.max(score, 130)
    else if (term.startsWith(queryNorm)) score = Math.max(score, 110)
    else if (queryNorm.startsWith(term) && term.length >= 4) score = Math.max(score, 95)
    else if (term.includes(queryNorm)) score = Math.max(score, 80)
    else if (queryNorm.includes(term) && term.length >= 4) score = Math.max(score, 65)
  }

  if (queryTokens.length > 0) {
    const allTokensMatch = queryTokens.every((qt) =>
      terms.some((term) => termMatchesToken(term, qt) || tokenize(term).some((tt) => termMatchesToken(tt, qt))),
    )
    if (allTokensMatch) score = Math.max(score, 85 + queryTokens.length * 5)
  }

  if (queryTokens.length === 1 && normalizeFoodText(dish.name) === queryTokens[0]) {
    score += 40
  }

  // Recency and frequency bonus (max ~25 points)
  const daysSinceUse = (Date.now() - dish.lastUsed) / (1000 * 60 * 60 * 24)
  score += Math.max(0, 15 - daysSinceUse)
  score += Math.min(dish.useCount, 10)

  return score
}

export function searchSavedDishes(
  query: string,
  savedDishes: SavedDish[],
  limit = 5,
): FoodLookupResult[] {
  const q = normalizeFoodText(query)
  if (q.length < 2 || savedDishes.length === 0) return []

  const rawTokens = tokenize(query)
  const queryTokens = expandQueryTokens(rawTokens)

  return savedDishes
    .map((dish) => ({ dish, score: scoreSavedDish(dish, q, queryTokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ dish }) => ({
      name: dish.name,
      calories: dish.calories,
      protein: dish.protein,
      fat: dish.fat,
      carbs: dish.carbs,
      source: 'saved' as const,
    }))
}

export function searchAllDishes(
  query: string,
  savedDishes: SavedDish[],
  limit = 10,
  excludedAllergens: Allergen[] = [],
): FoodLookupResult[] {
  const saved = searchSavedDishes(query, savedDishes, limit)
  const savedKeys = new Set(saved.map((s) => normalizeFoodText(s.name)))

  const catalog = searchLocalDishes(query, limit, excludedAllergens).filter(
    (item) => !savedKeys.has(normalizeFoodText(item.name)),
  )

  return [...saved, ...catalog].slice(0, limit)
}

export function searchLocalDishes(
  query: string,
  limit = 10,
  excludedAllergens: Allergen[] = [],
): FoodLookupResult[] {
  const q = normalizeFoodText(query)
  if (q.length < 2) return []

  const rawTokens = tokenize(query)
  const queryTokens = expandQueryTokens(rawTokens)

  const scored = COMMON_DISHES.filter((dish) => isDishAllowed(dish, excludedAllergens))
    .map((dish) => ({ dish, score: scoreDish(dish, q, queryTokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scored.map(({ dish }) => ({
    name: dish.name,
    calories: dish.calories,
    protein: dish.protein,
    fat: dish.fat ?? 0,
    carbs: dish.carbs ?? 0,
    source: 'local' as const,
    kind: dish.kind,
    servingNote: dish.servingNote,
  }))
}

function buildOnlineQuery(query: string): string {
  const trimmed = query.trim()
  if (!trimmed) return trimmed

  const hint = resolveSearchHint(trimmed)
  const base = hint ?? trimmed

  if (
    !/\d/.test(base) &&
    !/\b(portion|stück|scheibe|slice|bowl|plate|teller|schüssel|serving)\b/i.test(base)
  ) {
    return `1 serving ${base}`
  }
  return base
}

interface CalorieNinjasItem {
  name: string
  calories: number
  protein_g: number
  fat_total_g: number
  carbohydrates_total_g: number
}

export function resolveNutritionApiKey(storedKey?: string): string | undefined {
  const envKey = import.meta.env.VITE_CALORIE_NINJAS_API_KEY
  const key = storedKey?.trim() || envKey?.trim()
  return key || undefined
}

export async function lookupFoodOnline(
  query: string,
  apiKey: string,
  signal?: AbortSignal,
): Promise<FoodLookupResult | null> {
  if (!apiKey || query.trim().length < 2) return null

  const url = `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(buildOnlineQuery(query))}`
  const res = await fetch(url, {
    headers: { 'X-Api-Key': apiKey },
    signal,
  })
  if (!res.ok) return null

  const data = (await res.json()) as { items?: CalorieNinjasItem[] }
  if (!data.items?.length) return null

  const totals = data.items.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein_g || 0),
      fat: acc.fat + (item.fat_total_g || 0),
      carbs: acc.carbs + (item.carbohydrates_total_g || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 },
  )

  if (totals.calories <= 0) return null

  const displayName = data.items.length === 1 ? data.items[0].name : query.trim()

  return {
    name: displayName,
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    fat: Math.round(totals.fat),
    carbs: Math.round(totals.carbs),
    source: 'online',
  }
}

export function mergeLookupResults(
  local: FoodLookupResult[],
  online: FoodLookupResult | null,
): FoodLookupResult[] {
  if (!online) return local

  const onlineNorm = normalizeFoodText(online.name)
  const withoutDuplicate = local.filter((item) => {
    const itemNorm = normalizeFoodText(item.name)
    return itemNorm !== onlineNorm && !onlineNorm.includes(itemNorm) && !itemNorm.includes(onlineNorm)
  })

  return [online, ...withoutDuplicate].slice(0, 10)
}

export function groupSuggestionsByKind(
  suggestions: FoodLookupResult[],
): { label: string; items: FoodLookupResult[] }[] {
  const saved = suggestions.filter((s) => s.source === 'saved')
  const online = suggestions.filter((s) => s.source === 'online')
  const local = suggestions.filter((s) => s.source === 'local')

  const groups: { label: string; items: FoodLookupResult[] }[] = []

  if (saved.length) groups.push({ label: 'Eigene Gerichte', items: saved })

  const kinds: DishKind[] = ['main', 'side', 'snack', 'combo', 'drink']

  for (const kind of kinds) {
    const items = local.filter((s) => s.kind === kind)
    if (items.length) groups.push({ label: DISH_KIND_LABELS[kind], items })
  }

  const unkinded = local.filter((s) => !s.kind)
  if (unkinded.length) groups.push({ label: 'Gerichte', items: unkinded })

  if (online.length) groups.push({ label: 'Online', items: online })

  return groups
}

export type PortionSize = 'small' | 'normal' | 'large'

const PORTION_MULTIPLIERS: Record<PortionSize, number> = {
  small: 0.75,
  normal: 1,
  large: 1.25,
}

export function scaleFoodResult(
  item: FoodLookupResult,
  portion: PortionSize,
): FoodLookupResult {
  const m = PORTION_MULTIPLIERS[portion]
  if (m === 1) return item
  return {
    ...item,
    calories: Math.round(item.calories * m),
    protein: Math.round(item.protein * m),
    fat: Math.round(item.fat * m),
    carbs: Math.round(item.carbs * m),
    servingNote: portion === 'small' ? 'kleine Portion' : portion === 'large' ? 'große Portion' : item.servingNote,
  }
}
