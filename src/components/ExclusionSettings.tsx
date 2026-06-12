import { ALLERGENS, ALLERGEN_LABELS, type Allergen } from '../data/allergens'
import { Card } from './ui/Card'

interface ExclusionSettingsProps {
  excludedAllergens: Allergen[]
  onChange: (allergens: Allergen[]) => void
}

export function ExclusionSettings({ excludedAllergens, onChange }: ExclusionSettingsProps) {
  const toggle = (a: Allergen) => {
    onChange(
      excludedAllergens.includes(a)
        ? excludedAllergens.filter((x) => x !== a)
        : [...excludedAllergens, a],
    )
  }

  return (
    <Card className="!p-4">
      <p className="text-sm font-medium mb-3">Ausschlüsse</p>
      <p className="text-xs text-text-muted mb-3">
        Betroffene Gerichte werden im Plan und bei manueller Eingabe ausgeblendet.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {ALLERGENS.map((a) => (
          <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={excludedAllergens.includes(a)}
              onChange={() => toggle(a)}
              className="rounded border-border accent-accent"
            />
            {ALLERGEN_LABELS[a]}
          </label>
        ))}
      </div>
    </Card>
  )
}
