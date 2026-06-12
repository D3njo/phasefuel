import { useState } from 'react'
import { getScaledCheckpoints } from '../data/planConfig'
import {
  formatDateDE,
  formatDateKey,
  getPlanStatus,
  PHASE_LABELS,
} from '../data/nutrition'
import {
  shiftPlanStart,
  schedulePlanStart,
  startPlanToday,
  type Settings,
} from '../db/database'
import { useLastActiveDay } from '../hooks/useNutrition'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Input } from './ui/Input'

type PendingAction =
  | { type: 'startToday' }
  | { type: 'schedule'; date: string }
  | { type: 'checkpoint'; day: number }

interface PlanManagerProps {
  settings: Settings
}

export function PlanManager({ settings }: PlanManagerProps) {
  const lastActiveDay = useLastActiveDay()
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [keepLogs, setKeepLogs] = useState(true)
  const [scheduleDate, setScheduleDate] = useState(formatDateKey())
  const [busy, setBusy] = useState(false)

  const planDuration = settings.planDuration ?? 45
  const status = getPlanStatus(settings.startDate, new Date(), planDuration)

  const checkpoints = [
    ...getScaledCheckpoints(planDuration).map((cp) => ({
      day: cp.day,
      label: `Tag ${cp.day} — ${cp.label}`,
    })),
    ...(lastActiveDay
      ? [{ day: lastActiveDay, label: `Letzter Eintrag: Tag ${lastActiveDay}` }]
      : []),
  ]

  const statusText = status.isBeforeStart
    ? `Plan startet am ${formatDateDE(settings.startDate)} (in ${status.daysUntilStart} ${status.daysUntilStart === 1 ? 'Tag' : 'Tagen'})`
    : `Tag ${status.day} von ${planDuration} · Phase ${status.phase ? PHASE_LABELS[status.phase] : '—'} · Start war ${formatDateDE(settings.startDate)}`

  const pendingLabel = (() => {
    if (!pending) return ''
    switch (pending.type) {
      case 'startToday':
        return 'Der Plan beginnt heute wieder bei Tag 1.'
      case 'schedule':
        return `Der Plan startet am ${formatDateDE(pending.date)}. Bis dahin siehst du den Vorbereitungsmodus.`
      case 'checkpoint':
        return `Der Plan beginnt heute wieder bei Tag ${pending.day}.`
    }
  })()

  const handleConfirm = async () => {
    if (!pending) return
    setBusy(true)
    try {
      switch (pending.type) {
        case 'startToday':
          await startPlanToday(keepLogs)
          break
        case 'schedule':
          await schedulePlanStart(pending.date, keepLogs)
          break
        case 'checkpoint':
          await shiftPlanStart(pending.day, keepLogs)
          break
      }
      setPending(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <h3 className="font-semibold text-sm mb-1">Plan verwalten</h3>
      <p className="text-sm text-text-muted mb-4">{statusText}</p>

      {pending ? (
        <div className="space-y-3 rounded-xl border border-border/60 bg-surface-overlay/30 p-3">
          <p className="text-sm">{pendingLabel}</p>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={keepLogs}
              onChange={(e) => setKeepLogs(e.target.checked)}
              className="rounded border-border accent-accent"
            />
            Mahlzeiten-Log behalten
          </label>
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setPending(null)} disabled={busy}>
              Abbrechen
            </Button>
            <Button fullWidth onClick={handleConfirm} disabled={busy}>
              {busy ? 'Speichern…' : 'Bestätigen'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
              Schnellaktionen
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" fullWidth onClick={() => setPending({ type: 'startToday' })}>
                Heute mit Tag 1 starten
              </Button>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label="Start auf Datum verschieben"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setPending({ type: 'schedule', date: scheduleDate })}
                  disabled={!scheduleDate}
                >
                  Setzen
                </Button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
              Fortsetzen ab Tag …
            </p>
            <div className="flex flex-col gap-1.5">
              {checkpoints.map((cp) => (
                <Button
                  key={cp.day}
                  variant="ghost"
                  fullWidth
                  className="!justify-start !px-3"
                  onClick={() => setPending({ type: 'checkpoint', day: cp.day })}
                >
                  {cp.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
