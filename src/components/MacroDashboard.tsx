interface MacroDashboardProps {
  consumed: { calories: number; protein: number; carbs: number; fat: number }
  target: { calories: number; protein: number; carbs: number; fat: number }
}

function MacroBar({
  label,
  consumed,
  target,
  colorClass,
}: {
  label: string
  consumed: number
  target: number
  colorClass: string
}) {
  const progress = target > 0 ? Math.min(consumed / target, 1) : 0
  return (
    <div>
      <div className="flex justify-between text-xs text-text-muted mb-1">
        <span>{label}</span>
        <span>
          {consumed}g / {target}g
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-ring-bg)] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}

export function MacroDashboard({ consumed, target }: MacroDashboardProps) {
  const calorieProgress = target.calories > 0 ? Math.min(consumed.calories / target.calories, 1) : 0
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const calorieOffset = circumference * (1 - calorieProgress)

  return (
    <div className="flex flex-col items-center py-2">
      <div className="relative">
        <svg width="150" height="150" className="-rotate-90">
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="var(--color-ring-bg)"
            strokeWidth="11"
          />
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={calorieOffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight">{consumed.calories}</span>
          <span className="text-xs text-text-muted mt-0.5">/ {target.calories} kcal</span>
        </div>
      </div>

      <div className="mt-4 w-full max-w-[260px] space-y-2.5">
        <MacroBar
          label="Protein"
          consumed={consumed.protein}
          target={target.protein}
          colorClass="bg-accent"
        />
        <MacroBar
          label="Kohlenhydrate"
          consumed={consumed.carbs}
          target={target.carbs}
          colorClass="bg-blue-500"
        />
        <MacroBar
          label="Fett"
          consumed={consumed.fat}
          target={target.fat}
          colorClass="bg-amber-500"
        />
      </div>
    </div>
  )
}
