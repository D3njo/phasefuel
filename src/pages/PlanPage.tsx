import { useState } from 'react'
import { planConfigFromSettings, PLAN_GOAL_LABELS } from '../data/planConfig'
import { getMealById, CATEGORY_LABELS } from '../data/meals'
import { getDayPlan, resolveDayPlan, weekPlans } from '../data/mealPlan'
import { PHASE_LABELS, getDailyTarget } from '../data/nutrition'
import { useHistorySummaries, useSettings } from '../hooks/useNutrition'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

interface PlanPageProps {
  onGoShopping?: () => void
}

const phaseClass: Record<string, string> = {
  sanfterStart: 'phase-sanfterStart',
  aufbau: 'phase-aufbau',
  deftig: 'phase-deftig',
}

export function PlanPage({ onGoShopping }: PlanPageProps) {
  const settings = useSettings()
  const summaries = useHistorySummaries()
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  if (!settings) return null

  const config = planConfigFromSettings(settings)
  const skipBreakfast = settings.skipBreakfastDefault ?? false
  const completedDates = new Set(summaries.filter((s) => s.goalReached).map((s) => s.dayNumber))

  return (
    <div className="space-y-4">
      <PageHeader
        title={`${config.planDuration}-Tage-Plan`}
        subtitle={`${PLAN_GOAL_LABELS[config.goal]} · 7 Wochen`}
      />

      {skipBreakfast && (
        <Card className="!p-3 text-sm text-text-muted">
          Anzeige <strong className="text-text">ohne Frühstück</strong> (Profil-Einstellung). Mittag &
          Abend sind kräftiger.
        </Card>
      )}

      <div className="space-y-3">
        {weekPlans.map((week) => {
          const isWeekExpanded = expandedWeek === week.week
          const completedInWeek = week.days.filter((d) => completedDates.has(d)).length
          const weekComplete = completedInWeek === week.days.length
          const dayRange = `Tag ${week.days[0]}–${week.days[week.days.length - 1]}`

          return (
            <Card
              key={week.week}
              className={`!p-0 overflow-hidden ${phaseClass[week.phase] ?? ''} ${
                weekComplete ? '!border-accent/30' : ''
              }`}
            >
              <button
                onClick={() => setExpandedWeek(isWeekExpanded ? null : week.week)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      Woche {week.week}
                      {weekComplete && <span className="text-accent ml-2">✓</span>}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {dayRange} · {PHASE_LABELS[week.phase]}
                    </p>
                    <p className="text-xs text-accent mt-1">{week.shopLabel}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {completedInWeek}/{week.days.length} Tage geschafft
                    </p>
                  </div>
                  <span className="text-text-muted text-sm">{isWeekExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {isWeekExpanded && (
                <div className="px-4 pb-4 border-t border-border/40">
                  {onGoShopping && (
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={onGoShopping}
                      className="mt-3"
                    >
                      Einkaufsliste für Woche {week.week}
                    </Button>
                  )}

                  <div className="mt-3 space-y-2">
                    {week.days.map((dayNum) => {
                      const day = getDayPlan(dayNum, config.goal, config.planDuration)
                      const resolvedDay = resolveDayPlan(day, { skipBreakfast })
                      const target = getDailyTarget(dayNum, config)
                      const isComplete = completedDates.has(dayNum)
                      const isDayExpanded = expandedDay === dayNum

                      return (
                        <div
                          key={dayNum}
                          className="rounded-xl bg-surface border border-border/40 card-shadow"
                        >
                          <button
                            onClick={() => setExpandedDay(isDayExpanded ? null : dayNum)}
                            className="w-full flex items-center justify-between p-3 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isComplete ? 'bg-accent text-accent-foreground' : 'bg-surface-overlay/60'
                                }`}
                              >
                                {isComplete ? '✓' : dayNum}
                              </span>
                              <div>
                                <p className="text-sm font-medium">Tag {dayNum}</p>
                                <p className="text-xs text-text-muted">
                                  {target.calories} kcal · {target.protein}P · {target.carbs}KH ·{' '}
                                  {target.fat}F
                                </p>
                              </div>
                            </div>
                            <span className="text-text-muted text-xs">{isDayExpanded ? '▲' : '▼'}</span>
                          </button>

                          {isDayExpanded && (
                            <div className="px-3 pb-3 space-y-1 border-t border-border/30 pt-2">
                              {(['fruehstueck', 'mittag', 'abend', 'snack', 'getraenk'] as const).map(
                                (cat) => {
                                  const mealIds = resolvedDay.slots[cat] ?? []
                                  return (
                                    <div key={cat} className="text-xs">
                                      <span className="text-text-muted">{CATEGORY_LABELS[cat]}: </span>
                                      {mealIds
                                        .map((id) => getMealById(id)?.name)
                                        .filter(Boolean)
                                        .join(', ')}
                                    </div>
                                  )
                                },
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
