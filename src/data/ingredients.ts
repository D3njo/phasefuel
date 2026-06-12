import type { Allergen } from './allergens'

export type IngredientCategory = 'protein' | 'milch' | 'getreide' | 'gemuese' | 'obst' | 'vorrat'

export interface Ingredient {
  id: string
  name: string
  category: IngredientCategory
  unit: string
  pantry: boolean
  allergens?: Allergen[]
}

export interface MealIngredient {
  ingredientId: string
  amount: number
}

export const CATEGORY_LABELS_ING: Record<IngredientCategory, string> = {
  protein: 'Fleisch & Protein',
  milch: 'Milchprodukte',
  getreide: 'Brot, Nudeln & Reis',
  gemuese: 'Gemüse & Salat',
  obst: 'Obst',
  vorrat: 'Grundausstattung',
}

export const ingredients: Ingredient[] = [
  // Protein
  { id: 'ei', name: 'Eier', category: 'protein', unit: 'Stück', pantry: false, allergens: ['eggs'] },
  { id: 'haehnchenbrust', name: 'Hähnchenbrust', category: 'protein', unit: 'g', pantry: false },
  { id: 'haehnchenschenkel', name: 'Hähnchenschenkel', category: 'protein', unit: 'g', pantry: false },
  { id: 'rinderhack', name: 'Rinderhack', category: 'protein', unit: 'g', pantry: false },
  { id: 'rindersteak', name: 'Rindersteak', category: 'protein', unit: 'g', pantry: false },
  { id: 'rindergulasch', name: 'Rindergulasch', category: 'protein', unit: 'g', pantry: false },
  { id: 'rinderroulade', name: 'Rinderroulade', category: 'protein', unit: 'g', pantry: false },
  { id: 'schweineschnitzel', name: 'Schweineschnitzel', category: 'protein', unit: 'g', pantry: false },
  { id: 'schweinebraten', name: 'Schweinebraten (Pulled Pork)', category: 'protein', unit: 'g', pantry: false },
  { id: 'schinken', name: 'Schinken', category: 'protein', unit: 'g', pantry: false },
  { id: 'salami', name: 'Salami', category: 'protein', unit: 'g', pantry: false },
  { id: 'speck', name: 'Speck', category: 'protein', unit: 'g', pantry: false },
  { id: 'burgerpatty', name: 'Burger-Patties (Rind)', category: 'protein', unit: 'Stück', pantry: false },

  // Milch
  { id: 'milch', name: 'Vollmilch', category: 'milch', unit: 'ml', pantry: false, allergens: ['lactose'] },
  { id: 'kefir', name: 'Kefir natur', category: 'milch', unit: 'ml', pantry: false },
  { id: 'buttermilch', name: 'Buttermilch', category: 'milch', unit: 'ml', pantry: false },
  { id: 'joghurt', name: 'Griechischer Joghurt', category: 'milch', unit: 'g', pantry: false, allergens: ['lactose'] },
  { id: 'quark', name: 'Magerquark', category: 'milch', unit: 'g', pantry: false, allergens: ['lactose'] },
  { id: 'skyr', name: 'Skyr natur', category: 'milch', unit: 'g', pantry: false, allergens: ['lactose'] },
  { id: 'kaese', name: 'Käse (Gouda/Emmentaler)', category: 'milch', unit: 'g', pantry: false, allergens: ['lactose'] },
  { id: 'parmesan', name: 'Parmesan', category: 'milch', unit: 'g', pantry: false },
  { id: 'sourcream', name: 'Saure Sahne', category: 'milch', unit: 'g', pantry: false },
  { id: 'orangensaft', name: 'Orangensaft', category: 'milch', unit: 'ml', pantry: false },
  { id: 'apfelsaft', name: 'Apfelsaft', category: 'milch', unit: 'ml', pantry: false },
  { id: 'cola', name: 'Cola', category: 'milch', unit: 'ml', pantry: false },
  { id: 'tomatensaft', name: 'Tomatensaft', category: 'milch', unit: 'ml', pantry: false },
  { id: 'multivitaminsaft', name: 'Multivitaminsaft (ACE)', category: 'milch', unit: 'ml', pantry: false },

  // Getreide
  { id: 'haferflocken', name: 'Haferflocken', category: 'getreide', unit: 'g', pantry: true, allergens: ['gluten'] },
  { id: 'reis', name: 'Reis (Basmati/Jasmin)', category: 'getreide', unit: 'g', pantry: true },
  { id: 'nudeln', name: 'Nudeln / Pasta', category: 'getreide', unit: 'g', pantry: true, allergens: ['gluten'] },
  { id: 'brot', name: 'Vollkornbrot', category: 'getreide', unit: 'Scheiben', pantry: false, allergens: ['gluten'] },
  { id: 'tortilla', name: 'Weizentortillas', category: 'getreide', unit: 'Stück', pantry: false },
  { id: 'fladenbrot', name: 'Fladenbrot', category: 'getreide', unit: 'Stück', pantry: false },
  { id: 'broetchen', name: 'Brötchen / Brioche', category: 'getreide', unit: 'Stück', pantry: false },
  { id: 'spaetzle', name: 'Spätzle (frisch)', category: 'getreide', unit: 'g', pantry: false, allergens: ['gluten', 'eggs'] },
  { id: 'knoedel', name: 'Semmelknödel', category: 'getreide', unit: 'Stück', pantry: false, allergens: ['gluten', 'eggs'] },
  { id: 'pizzateig', name: 'Pizzateig (fertig)', category: 'getreide', unit: 'Stück', pantry: false, allergens: ['gluten'] },
  { id: 'croissant', name: 'Croissants', category: 'getreide', unit: 'Stück', pantry: false, allergens: ['gluten', 'lactose'] },
  { id: 'kartoffeln', name: 'Kartoffeln', category: 'getreide', unit: 'g', pantry: false },
  { id: 'pommes', name: 'Pommes frites (TK)', category: 'getreide', unit: 'g', pantry: false },

  // Gemüse
  { id: 'tomate', name: 'Tomaten', category: 'gemuese', unit: 'Stück', pantry: false },
  { id: 'avocado', name: 'Avocado', category: 'gemuese', unit: 'Stück', pantry: false },
  { id: 'brokkoli', name: 'Brokkoli', category: 'gemuese', unit: 'g', pantry: false },
  { id: 'paprika', name: 'Paprika', category: 'gemuese', unit: 'Stück', pantry: false },
  { id: 'zwiebel', name: 'Zwiebeln', category: 'gemuese', unit: 'Stück', pantry: false },
  { id: 'karotte', name: 'Möhren', category: 'gemuese', unit: 'Stück', pantry: false },
  { id: 'salat', name: 'Salat-Mix', category: 'gemuese', unit: 'g', pantry: false },
  { id: 'erbsen', name: 'Erbsen (TK)', category: 'gemuese', unit: 'g', pantry: false },
  { id: 'mais', name: 'Mais (Dose)', category: 'gemuese', unit: 'g', pantry: false },
  { id: 'bohnen', name: 'Bohnen (Dose)', category: 'gemuese', unit: 'g', pantry: false },
  { id: 'rotkohl', name: 'Rotkohl (TK)', category: 'gemuese', unit: 'g', pantry: false },
  { id: 'krautsalat', name: 'Krautsalat', category: 'gemuese', unit: 'g', pantry: false },

  // Obst
  { id: 'banane', name: 'Bananen', category: 'obst', unit: 'Stück', pantry: false },
  { id: 'apfel', name: 'Äpfel', category: 'obst', unit: 'Stück', pantry: false },

  // Vorrat
  { id: 'erdnussbutter', name: 'Erdnussbutter', category: 'vorrat', unit: 'g', pantry: true },
  { id: 'nuesse', name: 'Nuss-Mix', category: 'vorrat', unit: 'g', pantry: true },
  { id: 'granola', name: 'Granola', category: 'vorrat', unit: 'g', pantry: true },
  { id: 'butter', name: 'Butter', category: 'vorrat', unit: 'g', pantry: true },
  { id: 'oel', name: 'Oliven-/Rapsöl', category: 'vorrat', unit: 'ml', pantry: true },
  { id: 'hummus', name: 'Hummus', category: 'vorrat', unit: 'g', pantry: true },
  { id: 'molkepulver', name: 'Molkepulver', category: 'vorrat', unit: 'g', pantry: true },
  { id: 'mayo', name: 'Mayonnaise', category: 'vorrat', unit: 'g', pantry: true },
  { id: 'bruehe', name: 'Gemüse-/Hühnerbrühe', category: 'vorrat', unit: 'ml', pantry: true },
  { id: 'tomatensoße', name: 'Passierte Tomaten / Soße', category: 'vorrat', unit: 'ml', pantry: true },
  { id: 'gewuerze', name: 'Gewürze (Salz, Pfeffer, Curry)', category: 'vorrat', unit: 'Pack', pantry: true },
  { id: 'leinöl', name: 'Leinöl', category: 'vorrat', unit: 'ml', pantry: true },
]

const ingredientMap = new Map(ingredients.map((i) => [i.id, i]))

export function getIngredientById(id: string): Ingredient | undefined {
  return ingredientMap.get(id)
}
