import { useState } from 'react'
import { ALLERGENS, ALLERGEN_LABELS, DEFAULT_EXCLUDED_ALLERGENS, type Allergen } from '../data/allergens'
import {
  MAX_PLAN_DURATION,
  MIN_PLAN_DURATION,
  PLAN_GOAL_LABELS,
  type PlanGoal,
} from '../data/planConfig'
import { saveSettings } from '../db/database'
import { formatDateKey } from '../data/nutrition'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { SegmentedControl } from '../components/ui/SegmentedControl'

export function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [startWeight, setStartWeight] = useState('55')
  const [targetWeight, setTargetWeight] = useState('60')
  const [height, setHeight] = useState('173')
  const [startDate, setStartDate] = useState(formatDateKey())
  const [planGoal, setPlanGoal] = useState<PlanGoal>('muscle')
  const [planDuration, setPlanDuration] = useState('45')
  const [excludedAllergens, setExcludedAllergens] = useState<Allergen[]>([
    ...DEFAULT_EXCLUDED_ALLERGENS,
  ])

  const toggleAllergen = (a: Allergen) => {
    setExcludedAllergens((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    )
  }

  const handleSubmit = async () => {
    const sw = parseFloat(startWeight.replace(',', '.'))
    const tw = parseFloat(targetWeight.replace(',', '.'))
    const h = parseInt(height, 10)
    const duration = parseInt(planDuration, 10)
    if (isNaN(sw) || isNaN(tw) || isNaN(h) || isNaN(duration)) return

    await saveSettings({
      startWeight: sw,
      targetWeight: tw,
      height: h,
      startDate,
      onboardingComplete: true,
      pwaHintDismissed: false,
      themeMode: 'system',
      skipBreakfastDefault: false,
      planGoal,
      planDuration: duration,
      excludedAllergens,
      dislikedMealIds: [],
    })
  }

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 py-12 max-w-lg mx-auto bg-surface">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 text-accent flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          F
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Fitagain</h1>
        <p className="text-text-muted mt-2 max-w-sm mx-auto">
          {step === 0 && 'Körperdaten für deinen persönlichen Plan.'}
          {step === 1 && 'Ziel und Planlänge wählen.'}
          {step === 2 && 'Ausschlüsse festlegen — jederzeit änderbar.'}
        </p>
        <p className="text-xs text-text-muted mt-3">Schritt {step + 1} von 3</p>
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <Input
            label="Aktuelles Gewicht (kg)"
            type="text"
            inputMode="decimal"
            value={startWeight}
            onChange={(e) => setStartWeight(e.target.value)}
            required
          />
          <Input
            label="Zielgewicht (kg)"
            type="text"
            inputMode="decimal"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            required
          />
          <Input
            label="Größe (cm)"
            type="text"
            inputMode="numeric"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
          <Input
            label="Startdatum"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Button type="button" fullWidth onClick={() => setStep(1)}>
            Weiter
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-text-muted mb-2">Dein Ziel</p>
            <SegmentedControl
              options={(
                ['muscle', 'gain', 'lose', 'maintain'] as const
              ).map((g) => ({ value: g, label: PLAN_GOAL_LABELS[g] }))}
              value={planGoal}
              onChange={setPlanGoal}
            />
          </div>
          <Input
            label={`Planlänge (Tage, ${MIN_PLAN_DURATION}–${MAX_PLAN_DURATION})`}
            type="number"
            inputMode="numeric"
            min={MIN_PLAN_DURATION}
            max={MAX_PLAN_DURATION}
            value={planDuration}
            onChange={(e) => setPlanDuration(e.target.value)}
          />
          <Card className="!p-4 text-sm text-text-muted">
            <p>
              Der Essensplan wird auf <strong className="text-text">{planDuration} Tage</strong>{' '}
              skaliert — gleiche Struktur, angepasstes Tempo.
            </p>
          </Card>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setStep(0)}>
              Zurück
            </Button>
            <Button type="button" fullWidth onClick={() => setStep(2)}>
              Weiter
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Card className="!p-4">
            <p className="text-sm font-medium mb-3">Allergene & Unverträglichkeiten</p>
            <div className="grid grid-cols-2 gap-2">
              {ALLERGENS.map((a) => (
                <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludedAllergens.includes(a)}
                    onChange={() => toggleAllergen(a)}
                    className="rounded border-border accent-accent"
                  />
                  {ALLERGEN_LABELS[a]}
                </label>
              ))}
            </div>
          </Card>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setStep(1)}>
              Zurück
            </Button>
            <Button type="button" fullWidth className="!py-4" onClick={handleSubmit}>
              Los geht&apos;s
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
