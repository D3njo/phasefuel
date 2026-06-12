import type { Meal } from '../data/meals'
import { CATEGORY_LABELS } from '../data/meals'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface MealCardProps {
  meal: Meal
  onEat: (mealId: string) => void
  eaten?: boolean
  compact?: boolean
  actionLabel?: string
}

export function MealCard({ meal, onEat, eaten, compact, actionLabel }: MealCardProps) {
  return (
    <Card className={`${compact ? '!p-3' : ''} ${eaten ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted mb-0.5 uppercase tracking-wide">
            {CATEGORY_LABELS[meal.category]}
          </p>
          <h3
            className={`font-semibold leading-tight ${compact ? 'text-sm' : 'text-base'} ${
              eaten ? 'line-through decoration-accent/50' : ''
            }`}
          >
            {meal.name}
          </h3>
          {!compact && (
            <p className="text-xs text-text-muted mt-1 line-clamp-2">{meal.description}</p>
          )}
          <div className="flex gap-3 mt-2 text-xs text-text-muted">
            <span>{meal.calories} kcal</span>
            <span>{meal.protein}g Protein</span>
          </div>
        </div>
        <Button
          onClick={() => onEat(meal.id)}
          disabled={eaten}
          variant={eaten ? 'secondary' : 'primary'}
          className="shrink-0 !min-h-[44px] !min-w-[88px] !px-3"
        >
          {eaten ? '✓' : (actionLabel ?? 'Gegessen')}
        </Button>
      </div>
    </Card>
  )
}
