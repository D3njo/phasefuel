import { useState } from 'react'
import { saveSettings } from '../db/database'
import { formatDateKey } from '../data/nutrition'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function OnboardingPage() {
  const [startWeight, setStartWeight] = useState('55')
  const [targetWeight, setTargetWeight] = useState('60')
  const [height, setHeight] = useState('173')
  const [startDate, setStartDate] = useState(formatDateKey())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const sw = parseFloat(startWeight.replace(',', '.'))
    const tw = parseFloat(targetWeight.replace(',', '.'))
    const h = parseInt(height, 10)
    if (isNaN(sw) || isNaN(tw) || isNaN(h)) return

    await saveSettings({
      startWeight: sw,
      targetWeight: tw,
      height: h,
      startDate,
      onboardingComplete: true,
      pwaHintDismissed: false,
      themeMode: 'system',
      skipBreakfastDefault: false,
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
          45 Tage gezielt essen, um Muskeln aufzubauen. Wir starten leicht und steigern uns.
        </p>
        <p className="text-xs text-text-muted mt-3">Schritt 1 von 1 — Profil einrichten</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Card className="!p-4 text-sm text-text-muted">
          <p className="font-medium text-text mb-2">Dein Plan:</p>
          <ul className="space-y-1">
            <li>Tag 1–10: Leichte, ausgewogene Mahlzeiten</li>
            <li>Tag 11–25: Portionsgrößen steigen</li>
            <li>Tag 26–45: Deftige, kaloriendichte Gerichte</li>
          </ul>
          <p className="mt-3 text-xs">
            Kein Fisch, keine Süßspeisen. Kein Kakao, keine Vanillemilch — Saft & Cola sind ok.
          </p>
        </Card>

        <Button type="submit" fullWidth className="!py-4 !text-lg">
          Los geht&apos;s
        </Button>
      </form>
    </div>
  )
}
