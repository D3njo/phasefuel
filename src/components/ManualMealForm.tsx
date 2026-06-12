import { useEffect, useRef, useState } from 'react'
import { QUICK_PICK_DISHES } from '../data/commonDishes'
import type { Allergen } from '../data/allergens'
import { useFoodLookup } from '../hooks/useFoodLookup'
import {
  groupSuggestionsByKind,
  scaleFoodResult,
  searchAllDishes,
  type FoodLookupResult,
  type PortionSize,
} from '../services/foodLookup'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { SegmentedControl } from './ui/SegmentedControl'

interface ManualMealFormProps {
  nutritionApiKey?: string
  excludedAllergens?: Allergen[]
  onSubmit: (data: {
    name: string
    calories: number
    protein: number
    fat: number
    carbs: number
  }) => Promise<void>
  onClose: () => void
}

function formatMacros(item: FoodLookupResult): string {
  return `${item.calories} kcal · ${item.protein} P · ${item.carbs} KH · ${item.fat} F`
}

export function ManualMealForm({
  nutritionApiKey,
  excludedAllergens = [],
  onSubmit,
  onClose,
}: ManualMealFormProps) {
  const [name, setName] = useState('')
  const [kcal, setKcal] = useState('')
  const [protein, setProtein] = useState('')
  const [fat, setFat] = useState('0')
  const [carbs, setCarbs] = useState('0')
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [portion, setPortion] = useState<PortionSize>('normal')
  const [showMacroDetails, setShowMacroDetails] = useState(false)
  const blurTimer = useRef<number | null>(null)

  const { suggestions, loading, error, hasApiKey, savedDishes } = useFoodLookup({
    query: name,
    nutritionApiKey,
    excludedAllergens,
    enabled: showSuggestions,
  })

  const grouped = groupSuggestionsByKind(suggestions)

  const applySuggestion = (item: FoodLookupResult) => {
    const scaled = scaleFoodResult(item, portion)
    setName(scaled.name)
    setKcal(String(scaled.calories))
    setProtein(String(scaled.protein))
    setFat(String(scaled.fat))
    setCarbs(String(scaled.carbs))
    setSelectedSource(scaled.source)
    setShowSuggestions(false)
  }

  useEffect(() => {
    if (!showSuggestions || suggestions.length !== 1) return
    const only = suggestions[0]
    if (!kcal && !protein) {
      applySuggestion(only)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions, showSuggestions])

  const handleQuickPick = (dishName: string) => {
    const match = searchAllDishes(dishName, savedDishes, 1, excludedAllergens)[0]
    if (match) applySuggestion(match)
    else {
      setName(dishName)
      setShowSuggestions(true)
    }
  }

  const handleNameChange = (value: string) => {
    setName(value)
    setSelectedSource(null)
    setShowSuggestions(true)
    if (!value.trim()) {
      setKcal('')
      setProtein('')
      setFat('0')
      setCarbs('0')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const calories = parseInt(kcal, 10)
    const proteinVal = parseInt(protein, 10) || 0
    const fatVal = parseInt(fat, 10) || 0
    const carbsVal = parseInt(carbs, 10) || 0
    if (!name.trim() || isNaN(calories)) return

    await onSubmit({
      name: name.trim(),
      calories,
      protein: proteinVal,
      fat: fatVal,
      carbs: carbsVal,
    })
    setName('')
    setKcal('')
    setProtein('')
    setFat('0')
    setCarbs('0')
    setSelectedSource(null)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PICK_DISHES.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => handleQuickPick(label)}
            className="text-xs px-2.5 py-1 rounded-full border border-border bg-surface-raised hover:bg-accent/10 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <SegmentedControl
        options={[
          { value: 'small' as const, label: 'Klein' },
          { value: 'normal' as const, label: 'Normal' },
          { value: 'large' as const, label: 'Groß' },
        ]}
        value={portion}
        onChange={setPortion}
      />

      <div className="relative">
        <Input
          placeholder="Was hast du gegessen? z. B. Pommes, Cordon Bleu, Eiernockerl"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => setShowSuggestions(false), 150)
          }}
          autoComplete="off"
        />
        {showSuggestions && (suggestions.length > 0 || loading) && (
          <div
            className="absolute z-20 left-0 right-0 mt-1 rounded-xl border border-border bg-surface-raised card-shadow overflow-hidden max-h-64 overflow-y-auto"
            onMouseDown={(e) => {
              e.preventDefault()
              if (blurTimer.current) window.clearTimeout(blurTimer.current)
            }}
          >
            {loading && (
              <p className="px-4 py-2.5 text-xs text-text-muted">Suche online…</p>
            )}
            {grouped.map((group) => (
              <div key={group.label}>
                <p className="px-4 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wide bg-surface">
                  {group.label}
                </p>
                <ul>
                  {group.items.map((item) => (
                    <li key={`${item.source}-${item.name}`}>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2.5 hover:bg-accent/10 transition-colors"
                        onClick={() => applySuggestion(item)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{item.name}</span>
                          {item.source === 'saved' && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-accent/15 text-accent shrink-0">
                              Eigene
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{formatMacros(item)}</p>
                        <p className="text-xs text-text-muted">
                          {item.source === 'online'
                            ? 'Online-Schätzung'
                            : item.source === 'saved'
                              ? 'Zuletzt verwendet'
                              : 'Typische Portion'}
                          {item.servingNote ? ` · ${item.servingNote}` : ''}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSource && (
        <p className="text-xs text-text-muted -mt-1">
          {selectedSource === 'online'
            ? 'Werte aus Online-Suche übernommen — bei Bedarf anpassen.'
            : selectedSource === 'saved'
              ? 'Aus deinen gespeicherten Gerichten — bei Bedarf anpassen.'
              : 'Werte aus Gerichte-Datenbank — bei Bedarf anpassen.'}
        </p>
      )}

      {!hasApiKey && name.trim().length >= 2 && (
        <p className="text-xs text-text-muted -mt-1">
          Tipp: Im Profil einen kostenlosen CalorieNinjas-API-Key eintragen für mehr Gerichte online.
        </p>
      )}

      {error && <p className="text-xs text-warning">{error}</p>}

      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="kcal"
          value={kcal}
          onChange={(e) => {
            setKcal(e.target.value)
            setSelectedSource(null)
          }}
        />
        <Input
          type="number"
          placeholder="Protein (g)"
          value={protein}
          onChange={(e) => {
            setProtein(e.target.value)
            setSelectedSource(null)
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowMacroDetails(!showMacroDetails)}
        className="text-xs text-accent"
      >
        {showMacroDetails ? 'Makro-Details ausblenden' : 'Kohlenhydrate & Fett bearbeiten'}
      </button>

      {showMacroDetails && (
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="KH (g)"
            value={carbs}
            onChange={(e) => {
              setCarbs(e.target.value)
              setSelectedSource(null)
            }}
          />
          <Input
            type="number"
            placeholder="Fett (g)"
            value={fat}
            onChange={(e) => {
              setFat(e.target.value)
              setSelectedSource(null)
            }}
          />
        </div>
      )}

      <Button type="submit" fullWidth disabled={!name.trim() || !kcal}>
        Eintragen
      </Button>
    </form>
  )
}
