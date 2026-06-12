import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { WeightTracker } from '../components/WeightTracker'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import type { ChartColors } from '../hooks/useTheme'
import { useHistorySummaries, useSettings, useStreak } from '../hooks/useNutrition'

interface HistoryPageProps {
  chartColors: ChartColors
}

export function HistoryPage({ chartColors }: HistoryPageProps) {
  const settings = useSettings()
  const summaries = useHistorySummaries()
  const streak = useStreak()

  if (!settings) return null

  const chartData = summaries.map((s) => ({
    date: s.date.slice(5),
    kalorien: s.consumed.calories,
    ziel: s.target.calories,
    protein: s.consumed.protein,
  }))

  const proteinData = summaries.map((s) => ({
    date: s.date.slice(5),
    protein: s.consumed.protein,
    ziel: s.target.protein,
  }))

  const carbsData = summaries.map((s) => ({
    date: s.date.slice(5),
    kohlenhydrate: s.consumed.carbs,
    ziel: s.target.carbs,
  }))

  const fatData = summaries.map((s) => ({
    date: s.date.slice(5),
    fett: s.consumed.fat,
    ziel: s.target.fat,
  }))

  const completedDays = summaries.filter((s) => s.goalReached).length
  const tooltipStyle = {
    background: chartColors.tooltipBg,
    border: `1px solid ${chartColors.tooltipBorder}`,
    borderRadius: '12px',
    fontSize: '12px',
    color: chartColors.text,
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Verlauf" subtitle="Dein Fortschritt auf einen Blick" />

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold text-accent">{streak}</p>
          <p className="text-xs text-text-muted mt-1">Tage Streak</p>
        </Card>
        <Card className="text-center !p-4">
          <p className="text-2xl font-bold">{completedDays}</p>
          <p className="text-xs text-text-muted mt-1">Ziele erreicht</p>
        </Card>
      </div>

      {chartData.length > 0 ? (
        <>
          <section>
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
              Kalorien pro Tag
            </h2>
            <Card className="!p-2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartColors.text }} />
                  <YAxis tick={{ fontSize: 10, fill: chartColors.text }} width={40} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="kalorien" fill={chartColors.accent} radius={[4, 4, 0, 0]} />
                  <ReferenceLine
                    y={chartData[0]?.ziel}
                    stroke={chartColors.warning}
                    strokeDasharray="4 4"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
              Protein pro Tag
            </h2>
            <Card className="!p-2 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={proteinData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartColors.text }} />
                  <YAxis tick={{ fontSize: 10, fill: chartColors.text }} width={35} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="protein" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <ReferenceLine
                    y={proteinData[0]?.ziel}
                    stroke={chartColors.warning}
                    strokeDasharray="4 4"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
              Kohlenhydrate pro Tag
            </h2>
            <Card className="!p-2 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carbsData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartColors.text }} />
                  <YAxis tick={{ fontSize: 10, fill: chartColors.text }} width={35} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="kohlenhydrate" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
              Fett pro Tag
            </h2>
            <Card className="!p-2 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fatData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartColors.text }} />
                  <YAxis tick={{ fontSize: 10, fill: chartColors.text }} width={35} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="fett" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </section>
        </>
      ) : (
        <EmptyState
          title="Noch keine Einträge"
          description="Logge deine erste Mahlzeit auf der Heute-Seite."
        />
      )}

      <WeightTracker targetWeight={settings.targetWeight} chartColors={chartColors} />
    </div>
  )
}
