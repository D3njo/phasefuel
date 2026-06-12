import { getMealIngredients } from '../mealIngredients'
import type { Meal } from './types'

const gainMealData: Omit<Meal, 'ingredients'>[] = [
  // Frühstück
  { id: 'g01', name: 'Doppel-Porridge mit Nüssen', description: 'Großer Haferbrei, Erdnussbutter, Banane, Nüsse', calories: 650, protein: 20, fat: 28, carbs: 82, category: 'fruehstueck', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['gluten', 'lactose', 'nuts'] },
  { id: 'g02', name: 'Mega-Omelett mit Käse', description: '5 Eier, Gouda, Schinken, Toast', calories: 620, protein: 42, fat: 38, carbs: 28, category: 'fruehstueck', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['eggs', 'lactose', 'gluten'] },
  { id: 'g03', name: 'French Toast Stack', description: '4 Scheiben Vollkornbrot, Eier, Butter, Ahornsirup', calories: 680, protein: 24, fat: 32, carbs: 76, category: 'fruehstueck', phases: ['deftig'], tags: ['deftig'], allergens: ['gluten', 'eggs', 'lactose', 'sweets'] },
  { id: 'g04', name: 'Protein-Pfannkuchen XL', description: '4 große Pfannkuchen, Quark, Beeren, Honig', calories: 700, protein: 32, fat: 26, carbs: 84, category: 'fruehstueck', phases: ['deftig'], tags: ['deftig'], allergens: ['gluten', 'eggs', 'lactose', 'sweets'] },

  // Mittag
  { id: 'g05', name: 'Doppel-Burger mit Pommes', description: '2 Rindfleisch-Patties, Brioche, Pommes, Käse', calories: 1100, protein: 48, fat: 56, carbs: 98, category: 'mittag', phases: ['deftig'], tags: ['deftig'], allergens: ['gluten', 'lactose', 'eggs', 'mustard'] },
  { id: 'g06', name: 'Riesen-Lasagne', description: 'Extra große Portion mit Rinderhack und Béchamel', calories: 950, protein: 42, fat: 40, carbs: 88, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['gluten', 'lactose', 'eggs'] },
  { id: 'g07', name: 'Schnitzel XXL mit Pommes', description: 'Doppeltes Schnitzel, große Pommes, Salat', calories: 1050, protein: 52, fat: 48, carbs: 88, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['gluten', 'eggs'] },
  { id: 'g08', name: 'Massen-Gulasch mit Knödel', description: 'Große Portion Rindergulasch, 3 Semmelknödel', calories: 980, protein: 46, fat: 34, carbs: 102, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['gluten', 'celery'] },
  { id: 'g09', name: 'Pasta mit extra Hack', description: 'Spaghetti, doppelte Hackfleischsoße, Parmesan', calories: 920, protein: 44, fat: 28, carbs: 108, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['gluten', 'lactose', 'eggs'] },
  { id: 'g10', name: 'Döner Mega-Teller', description: 'Extra Hähnchen-Döner, Reis, Salat, Soße, Fladenbrot', calories: 1000, protein: 52, fat: 38, carbs: 96, category: 'mittag', phases: ['deftig'], tags: ['deftig'], allergens: ['gluten', 'lactose'] },

  // Abend
  { id: 'g11', name: 'Rumpsteak mit Kartoffeln', description: '300 g Rumpsteak, Bratkartoffeln, Kräuterbutter', calories: 900, protein: 56, fat: 42, carbs: 58, category: 'abend', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['lactose'] },
  { id: 'g12', name: 'Pizza Doppel-Käse', description: 'Große Pizza mit extra Mozzarella und Gouda', calories: 950, protein: 38, fat: 36, carbs: 108, category: 'abend', phases: ['deftig'], tags: ['deftig'], allergens: ['gluten', 'lactose'] },
  { id: 'g13', name: 'Carbonara groß', description: 'Große Portion Spaghetti Carbonara mit extra Speck', calories: 880, protein: 34, fat: 42, carbs: 84, category: 'abend', phases: ['deftig'], tags: ['deftig'], allergens: ['gluten', 'eggs', 'lactose'] },
  { id: 'g14', name: 'Hackauflauf mit Kartoffeln', description: 'Hackfleisch, Kartoffelscheiben, Käse, Sahne', calories: 850, protein: 40, fat: 38, carbs: 78, category: 'abend', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['lactose', 'eggs', 'gluten'] },

  // Snacks
  { id: 'g15', name: 'Massen-Shake', description: 'Vollmilch, Banane, Haferflocken, Erdnussbutter, Molke', calories: 650, protein: 32, fat: 24, carbs: 78, category: 'snack', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['lactose', 'nuts', 'gluten'] },
  { id: 'g16', name: 'Nuss-Butter-Brot Doppel', description: '4 Scheiben Vollkornbrot, Erdnussbutter, Honig', calories: 520, protein: 16, fat: 28, carbs: 52, category: 'snack', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['gluten', 'nuts', 'sweets'] },
  { id: 'g17', name: 'Quark mit Nüssen und Honig', description: 'Magerquark, Walnüsse, Cashews, Honig', calories: 480, protein: 32, fat: 22, carbs: 38, category: 'snack', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['lactose', 'nuts', 'sweets'] },

  // Getränke
  { id: 'g18', name: 'Vollmilch (0,7 L)', description: 'Natürliche Vollmilch, ungesüßt', calories: 420, protein: 22, fat: 22, carbs: 34, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['deftig'], allergens: ['lactose'] },
  { id: 'g19', name: 'Protein-Shake doppelt', description: 'Vollmilch, doppelte Portion Molkepulver', calories: 520, protein: 56, fat: 12, carbs: 36, category: 'getraenk', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['lactose'] },
  { id: 'g20', name: 'Kakao mit Sahne', description: 'Vollmilch, Kakao, Sahnehaube', calories: 380, protein: 12, fat: 22, carbs: 34, category: 'getraenk', phases: ['deftig'], tags: ['deftig'], allergens: ['lactose', 'cocoa'] },
]

export function buildGainMeals(): Meal[] {
  return gainMealData.map((m) => ({
    ...m,
    ingredients: getMealIngredients(m.id),
  }))
}
