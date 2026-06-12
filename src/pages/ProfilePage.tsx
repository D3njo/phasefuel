import { useEffect, useState } from 'react'
import type { Allergen } from '../data/allergens'
import { DEFAULT_EXCLUDED_ALLERGENS } from '../data/allergens'
import {
  MAX_PLAN_DURATION,
  MIN_PLAN_DURATION,
  PLAN_GOAL_LABELS,
  type PlanGoal,
} from '../data/planConfig'
import { saveSettings, exportData, clearAllData, clearMealLogsOnly } from '../db/database'
import { formatDateKey } from '../data/nutrition'
import { ExclusionSettings } from '../components/ExclusionSettings'
import { useSettings } from '../hooks/useNutrition'
import { useTheme } from '../hooks/useTheme'
import { InstallGuide } from '../components/InstallGuide'
import { PlanManager } from '../components/PlanManager'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { SegmentedControl } from '../components/ui/SegmentedControl'

export function ProfilePage() {
  const settings = useSettings()
  const { themeMode, setThemeMode } = useTheme(settings ?? null)
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmClearLogs, setConfirmClearLogs] = useState(false)
  const [excludedAllergens, setExcludedAllergens] = useState<Allergen[]>([
    ...DEFAULT_EXCLUDED_ALLERGENS,
  ])

  useEffect(() => {
    if (settings?.excludedAllergens) {
      setExcludedAllergens(settings.excludedAllergens)
    }
  }, [settings?.excludedAllergens])

  if (!settings) return null

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const sw = parseFloat(String(form.get('startWeight')).replace(',', '.'))
    const tw = parseFloat(String(form.get('targetWeight')).replace(',', '.'))
    const h = parseInt(String(form.get('height')), 10)
    const startDate = String(form.get('startDate'))
    if (isNaN(sw) || isNaN(tw) || isNaN(h)) return

    await saveSettings({
      startWeight: sw,
      targetWeight: tw,
      height: h,
      startDate: startDate || formatDateKey(),
      onboardingComplete: true,
      pwaHintDismissed: settings.pwaHintDismissed,
      themeMode: settings.themeMode ?? 'system',
      skipBreakfastDefault: settings.skipBreakfastDefault ?? false,
      nutritionApiKey: String(form.get('nutritionApiKey') ?? '').trim() || undefined,
      planGoal: (form.get('planGoal') as PlanGoal) || settings.planGoal || 'muscle',
      planDuration: parseInt(String(form.get('planDuration')), 10) || settings.planDuration || 45,
      excludedAllergens,
      dislikedMealIds: settings.dislikedMealIds ?? [],
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = async () => {
    const data = await exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fitagain-backup-${formatDateKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearLogs = async () => {
    if (!confirmClearLogs) {
      setConfirmClearLogs(true)
      return
    }
    await clearMealLogsOnly()
    setConfirmClearLogs(false)
  }

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    await clearAllData()
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profil" subtitle="Deine Einstellungen" />

      <section>
        <h3 className="text-sm font-medium mb-2">Manuelles Eintragen</h3>
        <Card className="!p-4 space-y-3">
          <p className="text-xs text-text-muted">
            Für die automatische Kalorien-Erkennung bei Takeaway & Restaurant-Gerichten (optional).
            Kostenloser Key bei{' '}
            <a
              href="https://calorieninjas.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              CalorieNinjas
            </a>
            .
          </p>
          <Input
            name="nutritionApiKey"
            label="CalorieNinjas API-Key"
            type="password"
            autoComplete="off"
            placeholder="Optional — bleibt nur auf diesem Gerät"
            defaultValue={settings.nutritionApiKey ?? ''}
            form="profile-form"
          />
          <p className="text-xs text-text-muted">Mit „Speichern“ unten übernehmen.</p>
        </Card>
      </section>

      <section>
        <h3 className="text-sm font-medium mb-2">Essgewohnheiten</h3>
        <Card className="!p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.skipBreakfastDefault ?? false}
              onChange={async (e) => {
                await saveSettings({
                  ...settings,
                  skipBreakfastDefault: e.target.checked,
                })
              }}
              className="mt-1 rounded border-border accent-accent"
            />
            <div>
              <p className="text-sm font-medium">Meistens kein Frühstück</p>
              <p className="text-xs text-text-muted mt-0.5">
                Standard für neue Tage. Auf „Heute“ kannst du es täglich ändern.
              </p>
            </div>
          </label>
        </Card>
      </section>

      <section>
        <h3 className="text-sm font-medium mb-2">Erscheinungsbild</h3>
        <SegmentedControl
          options={[
            { value: 'system' as const, label: 'System' },
            { value: 'light' as const, label: 'Hell' },
            { value: 'dark' as const, label: 'Dunkel' },
          ]}
          value={themeMode}
          onChange={setThemeMode}
        />
      </section>

      <section>
        <h3 className="text-sm font-medium mb-2">Plan & Ziel</h3>
        <Card className="!p-4 space-y-3">
          <div>
            <label className="text-sm text-text-muted block mb-1.5">Ziel</label>
            <select
              name="planGoal"
              form="profile-form"
              defaultValue={settings.planGoal ?? 'muscle'}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-border text-text"
            >
              {(Object.keys(PLAN_GOAL_LABELS) as PlanGoal[]).map((g) => (
                <option key={g} value={g}>
                  {PLAN_GOAL_LABELS[g]}
                </option>
              ))}
            </select>
          </div>
          <Input
            name="planDuration"
            label={`Planlänge (${MIN_PLAN_DURATION}–${MAX_PLAN_DURATION} Tage)`}
            type="number"
            min={MIN_PLAN_DURATION}
            max={MAX_PLAN_DURATION}
            defaultValue={settings.planDuration ?? 45}
            form="profile-form"
          />
          <p className="text-xs text-text-muted">
            Änderungen wirken auf neue Tagespläne. Bestehende Logs bleiben erhalten.
          </p>
        </Card>
      </section>

      <ExclusionSettings
        excludedAllergens={excludedAllergens}
        onChange={setExcludedAllergens}
      />

      <form id="profile-form" onSubmit={handleSave} className="space-y-4">
        <Input
          name="startWeight"
          label="Startgewicht (kg)"
          type="text"
          inputMode="decimal"
          defaultValue={settings.startWeight}
        />
        <Input
          name="targetWeight"
          label="Zielgewicht (kg)"
          type="text"
          inputMode="decimal"
          defaultValue={settings.targetWeight}
        />
        <Input
          name="height"
          label="Größe (cm)"
          type="text"
          inputMode="numeric"
          defaultValue={settings.height}
        />
        <Input
          name="startDate"
          label="Startdatum"
          type="date"
          defaultValue={settings.startDate}
        />
        <Button type="submit" fullWidth>
          {saved ? 'Gespeichert ✓' : 'Speichern'}
        </Button>
      </form>

      <InstallGuide />

      <PlanManager settings={settings} />

      <Button variant="secondary" fullWidth onClick={handleExport}>
        Daten exportieren (JSON)
      </Button>

      <Button variant={confirmClearLogs ? 'danger' : 'secondary'} fullWidth onClick={handleClearLogs}>
        {confirmClearLogs ? 'Mahlzeiten-Log wirklich löschen? Nochmal tippen.' : 'Nur Mahlzeiten-Log löschen'}
      </Button>

      <Button variant={confirmReset ? 'danger' : 'secondary'} fullWidth onClick={handleReset}>
        {confirmReset ? 'Wirklich alles löschen? Nochmal tippen.' : 'Alle Daten zurücksetzen'}
      </Button>
    </div>
  )
}
