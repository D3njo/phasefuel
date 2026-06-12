import { useState } from 'react'
import { saveSettings, exportData, clearAllData, clearMealLogsOnly } from '../db/database'
import { formatDateKey } from '../data/nutrition'
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

      <form onSubmit={handleSave} className="space-y-4">
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

      <Card>
        <h3 className="font-semibold text-sm mb-2">Ausschlüsse</h3>
        <ul className="text-sm text-text-muted space-y-1">
          <li>✕ Keine Fischgerichte</li>
          <li>✕ Keine Süßigkeiten / Süßspeisen</li>
          <li>✕ Kein Kakao, keine Vanillemilch</li>
          <li>✓ Saft, Cola & Protein-Shake sind im Plan</li>
        </ul>
      </Card>

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
