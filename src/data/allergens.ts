export const ALLERGENS = [
  'gluten',
  'lactose',
  'nuts',
  'eggs',
  'fish',
  'shellfish',
  'soy',
  'celery',
  'mustard',
  'sesame',
  'sweets',
  'cocoa',
] as const

export type Allergen = (typeof ALLERGENS)[number]

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: 'Gluten',
  lactose: 'Laktose / Milch',
  nuts: 'Nüsse',
  eggs: 'Eier',
  fish: 'Fisch',
  shellfish: 'Schalentiere',
  soy: 'Soja',
  celery: 'Sellerie',
  mustard: 'Senf',
  sesame: 'Sesam',
  sweets: 'Süßes / Desserts',
  cocoa: 'Kakao',
}

/** Default exclusions matching original app rules. */
export const DEFAULT_EXCLUDED_ALLERGENS: Allergen[] = ['fish', 'sweets', 'cocoa']
