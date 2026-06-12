import { useState } from 'react'
import { MacroDashboard } from '../components/MacroDashboard'
import { DayPlan } from '../components/DayPlan'
import { ManualMealForm } from '../components/ManualMealForm'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { Spinner } from '../components/ui/Spinner'
import { getWeekForDay, getWeekPlan } from '../data/mealPlan'
import { formatDateDE, PHASE_LABELS } from '../data/nutrition'
import {
  useDayPreferenceActions,
  useDaySummary,
  useMealActions,
  useSettings,
} from '../hooks/useNutrition'

interface TodayPageProps {
  onGoShopping?: () => void
}

export function TodayPage({ onGoShopping }: TodayPageProps) {
  const summary = useDaySummary()
  const settings = useSettings()
  const { log, logManual, remove } = useMealActions()
  const { setSkipBreakfast, setMealOverride } = useDayPreferenceActions()
  const [showManual, setShowManual] = useState(false)

  if (!summary) return <Spinner />

  if (summary.planStatus.isBeforeStart) {
    const weekPlan = getWeekPlan(1)
    return (
      <div className="space-y-6">
        <PageHeader title="Heute" subtitle="Noch nicht gestartet" />
        <Card className="text-center !p-6">
          <p className="text-lg font-medium">Dein Plan startet bald</p>
          <p className="text-sm text-text-muted mt-2">
            Dein Plan startet am {formatDateDE(summary.startDate)}.
            {summary.planStatus.daysUntilStart === 1
              ? ' Noch 1 Tag.'
              : ` Noch ${summary.planStatus.daysUntilStart} Tage.`}
          </p>
          <p className="text-sm text-text-muted mt-3">
            Bis dahin kannst du schon die Einkaufsliste für Woche 1 ansehen.
          </p>
        </Card>
        {onGoShopping && weekPlan && (
          <Card onClick={onGoShopping} className="!p-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-text-muted">Wocheneinkauf</p>
              <p className="text-sm font-medium mt-0.5">
                Woche 1 · {weekPlan.shopLabel}
              </p>
            </div>
            <span className="text-accent text-lg">›</span>
          </Card>
        )}
      </div>
    )
  }

  const week = getWeekForDay(summary.dayNumber || 1)
  const weekPlan = getWeekPlan(week)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Heute"
        subtitle={`Tag ${summary.dayNumber} von ${summary.planStatus.planDuration}`}
        badge={PHASE_LABELS[summary.target.phase]}
      />

      {onGoShopping && weekPlan && (
        <Card onClick={onGoShopping} className="!p-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-text-muted">Wocheneinkauf</p>
            <p className="text-sm font-medium mt-0.5">
              Woche {week} · {weekPlan.shopLabel}
            </p>
          </div>
          <span className="text-accent text-lg">›</span>
        </Card>
      )}

      <div className="flex justify-center">
        <MacroDashboard consumed={summary.consumed} target={summary.target} />
      </div>

      <Card className="!p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={summary.skipBreakfast}
            onChange={(e) => setSkipBreakfast(e.target.checked)}
            className="mt-1 rounded border-border accent-accent"
          />
          <div>
            <p className="text-sm font-medium">Heute kein Frühstück</p>
            <p className="text-xs text-text-muted mt-0.5">
              Mittag & Abend sind für heute kräftiger — Kalorienziel bleibt gleich.
            </p>
          </div>
        </label>
      </Card>

      {summary.goalReached ? (
        <Card variant="success" className="text-center !p-4">
          <p className="text-accent font-semibold">Tagesziel erreicht!</p>
          <p className="text-sm text-text-muted mt-1">Weiter so — Muskeln brauchen Konstanz.</p>
        </Card>
      ) : (
        <Card variant="warning" className="text-center !p-4">
          <p className="text-warning font-medium">Noch ~{summary.remaining.calories} kcal</p>
          <p className="text-sm text-text-muted mt-1">
            {summary.remaining.calories <= 550
              ? 'Ein Shake oder Snack reicht oft schon.'
              : 'Versuch die nächste Mahlzeit aus dem Plan.'}
          </p>
          <p className="text-xs text-text-muted mt-2">
            Noch {summary.remaining.protein}g Protein · {summary.remaining.carbs}g KH ·{' '}
            {summary.remaining.fat}g Fett
          </p>
        </Card>
      )}

      {summary.logs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
            Gegessen heute
          </h2>
          <div className="space-y-1.5">
            {summary.logs.map((logEntry) => (
              <div
                key={logEntry.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-surface-raised border border-border/50 text-sm card-shadow"
              >
                <span className="font-medium">{logEntry.mealName}</span>
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-xs">
                    {logEntry.calories} kcal · {logEntry.protein}P · {logEntry.carbs}KH ·{' '}
                    {logEntry.fat}F
                  </span>
                  <button
                    onClick={() => logEntry.id && remove(logEntry.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    aria-label="Eintrag löschen"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <DayPlan
        plan={summary.plan}
        logs={summary.logs}
        mealOverrides={summary.mealOverrides}
        onEat={log}
        onSelectAlternative={setMealOverride}
      />

      <section>
        <Button variant="secondary" fullWidth onClick={() => setShowManual(!showManual)}>
          {showManual ? 'Manuell schließen' : '+ Manuell eintragen'}
        </Button>
        {showManual && (
          <ManualMealForm
            nutritionApiKey={settings?.nutritionApiKey}
            excludedAllergens={settings?.excludedAllergens}
            onSubmit={async (data) => {
              await logManual(data)
            }}
            onClose={() => setShowManual(false)}
          />
        )}
      </section>
    </div>
  )
}
