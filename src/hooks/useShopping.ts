import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useMemo } from 'react'
import { planConfigFromSettings } from '../data/planConfig'
import { CATEGORY_LABELS_ING, type IngredientCategory } from '../data/ingredients'
import { getFreshItems, getPantryItems, type ShoppingItem } from '../data/shopping'
import { db, toggleShoppingCheck } from '../db/database'
import { useSettings } from './useNutrition'

export function useShoppingChecks(week: number) {
  return useLiveQuery(() => db.shoppingChecks.where('week').equals(week).toArray(), [week])
}

export function useShoppingList(week: number) {
  const settings = useSettings()
  const checks = useShoppingChecks(week)
  const config = settings ? planConfigFromSettings(settings) : undefined

  const freshItems = useMemo(() => getFreshItems(week, config), [week, config])
  const pantryItems = useMemo(() => getPantryItems(week, config), [week, config])

  const withChecks = useCallback(
    (items: ShoppingItem[]) => {
      const checkMap = new Map(checks?.map((c) => [c.ingredientId, c.checked]) ?? [])
      return items.map((item) => ({
        ...item,
        checked: checkMap.get(item.ingredient.id) ?? false,
      }))
    },
    [checks],
  )

  const fresh = useMemo(() => withChecks(freshItems), [freshItems, withChecks])
  const pantry = useMemo(() => withChecks(pantryItems), [pantryItems, withChecks])

  const toggle = useCallback(async (ingredientId: string, checked: boolean) => {
    await toggleShoppingCheck(week, ingredientId, checked)
  }, [week])

  const freshChecked = fresh.filter((i) => i.checked).length
  const freshTotal = fresh.length

  return { fresh, pantry, toggle, freshChecked, freshTotal }
}

export function groupByCategory(
  items: (ShoppingItem & { checked: boolean })[],
): Record<IngredientCategory, (ShoppingItem & { checked: boolean })[]> {
  const groups = {} as Record<IngredientCategory, (ShoppingItem & { checked: boolean })[]>
  for (const item of items) {
    const cat = item.ingredient.category
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  }
  return groups
}

export { CATEGORY_LABELS_ING }
