import { useEffect, useMemo, useState } from 'react'
import { saveSettings, type Settings } from '../db/database'

export type ThemeMode = 'system' | 'light' | 'dark'

export interface ChartColors {
  accent: string
  grid: string
  text: string
  tooltipBg: string
  tooltipBorder: string
  warning: string
}

function getResolvedTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'light') return 'light'
  if (mode === 'dark') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.dataset.theme = resolved
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', resolved === 'light' ? '#f8fafc' : '#0f172a')
  }
}

export function useTheme(settings: Settings | null | undefined) {
  const themeMode: ThemeMode = settings?.themeMode ?? 'system'
  const [resolved, setResolved] = useState<'light' | 'dark'>(() =>
    getResolvedTheme(themeMode),
  )

  useEffect(() => {
    const next = getResolvedTheme(themeMode)
    setResolved(next)
    applyTheme(next)
    localStorage.setItem('phasefuel-theme-cache', themeMode)

    if (themeMode !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const r = getResolvedTheme('system')
      setResolved(r)
      applyTheme(r)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [themeMode])

  const setThemeMode = async (mode: ThemeMode) => {
    if (!settings) return
    await saveSettings({ ...settings, themeMode: mode })
  }

  const chartColors = useMemo((): ChartColors => {
    const style = getComputedStyle(document.documentElement)
    return {
      accent: style.getPropertyValue('--color-accent').trim() || '#16a34a',
      grid: style.getPropertyValue('--color-chart-grid').trim() || '#cbd5e1',
      text: style.getPropertyValue('--color-text-muted').trim() || '#64748b',
      tooltipBg: style.getPropertyValue('--color-chart-tooltip-bg').trim() || '#ffffff',
      tooltipBorder: style.getPropertyValue('--color-chart-tooltip-border').trim() || '#e2e8f0',
      warning: style.getPropertyValue('--color-warning').trim() || '#d97706',
    }
  }, [resolved])

  return { themeMode, resolved, setThemeMode, chartColors }
}

export function initThemeBeforeLoad() {
  const stored =
    localStorage.getItem('phasefuel-theme-cache') ??
    localStorage.getItem('fitagain-theme-cache')
  const mode = (stored as ThemeMode) || 'system'
  applyTheme(getResolvedTheme(mode))
}
