import { getMealIngredients } from '../mealIngredients'
import type { Meal } from './types'

const maintainMealData: Omit<Meal, 'ingredients'>[] = [
  // Frühstück
  { id: 't01', name: 'Haferflocken mit Apfel', description: 'Haferflocken, Apfel, Milch', calories: 380, protein: 12, fat: 10, carbs: 58, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['gluten', 'lactose'] },
  { id: 't02', name: 'Rührei mit Toast', description: '2 Eier, Vollkorntoast, Tomate', calories: 340, protein: 18, fat: 16, carbs: 26, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['eggs', 'gluten'] },
  { id: 't03', name: 'Joghurt mit Müsli', description: 'Naturjoghurt, Müsli, Beeren', calories: 360, protein: 16, fat: 10, carbs: 48, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['lactose', 'gluten', 'nuts'] },
  { id: 't04', name: 'Avocado-Toast', description: 'Vollkornbrot, Avocado, Tomate', calories: 400, protein: 10, fat: 24, carbs: 36, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['gluten'] },
  { id: 't05', name: 'Käse-Omelett', description: '3 Eier, Gouda, Kräuter', calories: 480, protein: 28, fat: 32, carbs: 8, category: 'fruehstueck', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['eggs', 'lactose'] },

  // Mittag
  { id: 't06', name: 'Hähnchensuppe', description: 'Klare Brühe, Hähnchen, Nudeln, Gemüse', calories: 420, protein: 30, fat: 8, carbs: 52, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['gluten', 'celery'] },
  { id: 't07', name: 'Nudeln Bolognese', description: 'Penne, Hackfleischsoße, Parmesan', calories: 580, protein: 30, fat: 18, carbs: 72, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['gluten', 'lactose', 'eggs'] },
  { id: 't08', name: 'Kartoffeln mit Hähnchen', description: 'Salzkartoffeln, Hähnchenbrust, Salat', calories: 520, protein: 36, fat: 12, carbs: 58, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 't09', name: 'Reis mit Gemüse und Hähnchen', description: 'Basmatireis, Hähnchen, Brokkoli, Paprika', calories: 500, protein: 32, fat: 10, carbs: 62, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 't10', name: 'Wrap mit Putenbrust', description: 'Vollkorn-Wrap, Pute, Salat, Joghurtsoße', calories: 480, protein: 32, fat: 14, carbs: 52, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['gluten', 'lactose'] },
  { id: 't11', name: 'Schnitzel mit Salat', description: 'Schweineschnitzel, gemischter Salat, Brot', calories: 620, protein: 38, fat: 28, carbs: 42, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['gluten', 'eggs'] },
  { id: 't12', name: 'Gulasch mit Reis', description: 'Rindergulasch, Basmatireis', calories: 640, protein: 36, fat: 22, carbs: 68, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['celery'] },

  // Abend
  { id: 't13', name: 'Gemüsepfanne mit Reis', description: 'Reis, Gemüse, Hähnchen', calories: 440, protein: 26, fat: 10, carbs: 56, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 't14', name: 'Kartoffelsuppe mit Brot', description: 'Cremige Kartoffelsuppe, Vollkornbrot', calories: 400, protein: 12, fat: 12, carbs: 54, category: 'abend', phases: ['sanfterStart'], tags: ['leicht'], allergens: ['gluten', 'lactose', 'celery'] },
  { id: 't15', name: 'Omelett mit Salat', description: '3-Eier-Omelett, gemischter Salat', calories: 380, protein: 22, fat: 24, carbs: 10, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['eggs'] },
  { id: 't16', name: 'Hackbraten mit Kartoffeln', description: 'Ofenhackbraten, Salzkartoffeln, Erbsen', calories: 580, protein: 34, fat: 22, carbs: 58, category: 'abend', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['eggs', 'gluten'] },
  { id: 't17', name: 'Pasta mit Tomatensoße', description: 'Spaghetti, Tomatensoße, Basilikum, Parmesan', calories: 540, protein: 18, fat: 14, carbs: 78, category: 'abend', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['gluten', 'lactose'] },

  // Snacks
  { id: 't18', name: 'Banane', description: '1 große Banane', calories: 120, protein: 1, fat: 0, carbs: 28, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 't19', name: 'Quark mit Beeren', description: 'Magerquark, frische Beeren', calories: 180, protein: 22, fat: 2, carbs: 18, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['lactose'] },
  { id: 't20', name: 'Käse-Brot', description: 'Vollkornbrot, Gouda', calories: 280, protein: 14, fat: 14, carbs: 24, category: 'snack', phases: ['aufbau', 'deftig'], tags: ['deftig'], allergens: ['gluten', 'lactose'] },
  { id: 't21', name: 'Nuss-Mix', description: 'Handvoll Mandeln und Cashews', calories: 220, protein: 6, fat: 18, carbs: 8, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['nuts'] },

  // Getränke
  { id: 't22', name: 'Vollmilch (0,4 L)', description: 'Natürliche Vollmilch, ungesüßt', calories: 240, protein: 12, fat: 12, carbs: 20, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['lactose'] },
  { id: 't23', name: 'Kefir natur (0,3 L)', description: 'Ungesüßter Kefir', calories: 120, protein: 10, fat: 4, carbs: 12, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['lactose'] },
  { id: 't24', name: 'Protein-Shake', description: 'Milch, Molkepulver, ohne Zucker', calories: 280, protein: 32, fat: 6, carbs: 18, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['lactose'] },
  { id: 't25', name: 'Orangensaft (0,3 L)', description: '100% Orangensaft', calories: 140, protein: 2, fat: 0, carbs: 32, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
]

export function buildMaintainMeals(): Meal[] {
  return maintainMealData.map((m) => ({
    ...m,
    ingredients: getMealIngredients(m.id),
  }))
}
