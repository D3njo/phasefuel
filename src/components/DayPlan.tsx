import { useState } from 'react'
import { planConfigFromSettings } from '../data/planConfig'
import type { MealCategory } from '../data/meals'
import { CATEGORY_LABELS, getMealById, getMealsForGoal } from '../data/meals'
import type { DayPlan as DayPlanType } from '../data/mealPlan'
import type { MealLog } from '../db/database'
import { useSettings } from '../hooks/useNutrition'
import { filterMeals } from '../lib/mealFilters'
import { Badge } from './ui/Badge'
import { MealCard } from './MealCard'

interface DayPlanProps {
  plan: DayPlanType
  logs: MealLog[]
  mealOverrides?: Partial<Record<MealCategory, string>>
  onEat: (mealId: string) => void
  onSelectAlternative?: (category: MealCategory, mealId: string) => void
}

const SLOT_ORDER: MealCategory[] = ['fruehstueck', 'mittag', 'abend', 'snack', 'getraenk']

const CATEGORY_ICONS: Record<MealCategory, string> = {
  fruehstueck: '☀',
  mittag: '◑',
  abend: '☽',
  snack: '•',
  getraenk: '◦',
}

export function DayPlan({
  plan,
  logs,
  mealOverrides = {},
  onEat,
  onSelectAlternative,
}: DayPlanProps) {
  const settings = useSettings()
  const [showPicker, setShowPicker] = useState<MealCategory | null>(null)
  const eatenMealIds = new Set(logs.map((l) => l.mealId))
  const config = settings ? planConfigFromSettings(settings) : null
  const goalMeals = config ? filterMeals(getMealsForGoal(config.goal), config) : []

  return (
    <div className="space-y-5">
      {SLOT_ORDER.map((category) => {
        const mealIds = plan.slots[category] ?? []
        if (mealIds.length === 0) return null

        const selectedId = mealOverrides[category]
        const orderedIds = selectedId
          ? [selectedId, ...mealIds.filter((id) => id !== selectedId)]
          : mealIds

        return (
          <section key={category} className="border-t border-border/40 pt-4 first:border-0 first:pt-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs">
                  {CATEGORY_ICONS[category]}
                </span>
                {CATEGORY_LABELS[category]}
              </h2>
              <button
                onClick={() => setShowPicker(showPicker === category ? null : category)}
                className="text-xs text-accent font-medium px-2 py-1 rounded-lg hover:bg-accent/10 transition-colors"
              >
                {showPicker === category ? 'Schließen' : '+ Andere'}
              </button>
            </div>
            <div className="space-y-2">
              {orderedIds.map((mealId, index) => {
                const meal = getMealById(mealId)
                if (!meal) return null
                const isPrimary = index === 0
                const label =
                  isPrimary && orderedIds.length > 1
                    ? selectedId
                      ? 'Gewählt'
                      : 'Vorschlag'
                    : 'Alternative'

                return (
                  <div key={meal.id} className="space-y-1">
                    {orderedIds.length > 1 && (
                      <Badge variant={isPrimary ? 'accent' : 'default'}>{label}</Badge>
                    )}
                    <MealCard
                      meal={meal}
                      onEat={
                        isPrimary
                          ? onEat
                          : () => onSelectAlternative?.(category, meal.id)
                      }
                      eaten={eatenMealIds.has(meal.id)}
                      actionLabel={isPrimary ? undefined : 'Wählen'}
                    />
                  </div>
                )
              })}
            </div>
            {showPicker === category && (
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {goalMeals
                  .filter((m) => m.category === category)
                  .map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onEat={(id) => {
                        onSelectAlternative?.(category, id)
                        setShowPicker(null)
                      }}
                      eaten={eatenMealIds.has(meal.id)}
                      compact
                      actionLabel="Wählen"
                    />
                  ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
