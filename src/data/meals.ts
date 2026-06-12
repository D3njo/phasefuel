import type { MealIngredient } from './ingredients'
import { getMealIngredients } from './mealIngredients'
import type { Phase } from './nutrition'

export type MealCategory = 'fruehstueck' | 'mittag' | 'abend' | 'snack' | 'getraenk'

export interface Meal {
  id: string
  name: string
  description: string
  calories: number
  protein: number
  fat: number
  carbs: number
  category: MealCategory
  phases: Phase[]
  tags: string[]
  ingredients: MealIngredient[]
}

export const CATEGORY_LABELS: Record<MealCategory, string> = {
  fruehstueck: 'Frühstück',
  mittag: 'Mittag',
  abend: 'Abend',
  snack: 'Snack',
  getraenk: 'Getränk',
}

const mealData: Omit<Meal, 'ingredients'>[] = [
  // Frühstück — Phase 1
  { id: 'm01', name: 'Haferflocken mit Banane', description: 'Haferflocken, Banane, Milch, Erdnussbutter', calories: 430, protein: 15, fat: 14, carbs: 68, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm02', name: 'Rührei mit Toast', description: '3 Eier, Vollkorntoast, Tomate', calories: 380, protein: 22, fat: 18, carbs: 28, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm03', name: 'Joghurt mit Granola', description: 'Griechischer Joghurt, Granola, Nüsse', calories: 360, protein: 20, fat: 14, carbs: 38, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm04', name: 'Birchermüsli', description: 'Haferflocken über Nacht, Apfel, Nüsse', calories: 400, protein: 12, fat: 14, carbs: 58, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm05', name: 'Avocado-Toast mit Ei', description: 'Vollkornbrot, Avocado, Spiegelei', calories: 450, protein: 16, fat: 28, carbs: 32, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },

  // Frühstück — Phase 2/3
  { id: 'm06', name: 'Power-Omelett', description: '4 Eier, Käse, Schinken, Toast', calories: 580, protein: 38, fat: 32, carbs: 30, category: 'fruehstueck', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm07', name: 'Herzhafte Pfannkuchen', description: '3 Pfannkuchen mit Speck und Kräuterquark', calories: 540, protein: 26, fat: 28, carbs: 48, category: 'fruehstueck', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm08', name: 'Frühstücks-Burrito', description: 'Tortilla, Eier, Bohnen, Käse, Avocado', calories: 620, protein: 28, fat: 30, carbs: 58, category: 'fruehstueck', phases: ['deftig'], tags: ['deftig'] },
  { id: 'm09', name: 'Porridge mit Erdnussbutter', description: 'Haferbrei, Erdnussbutter, Banane, Prise Salz', calories: 540, protein: 18, fat: 22, carbs: 64, category: 'fruehstueck', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm10', name: 'Croissant mit Aufschnitt', description: '2 Croissants, Käse, Salami, Butter', calories: 600, protein: 22, fat: 36, carbs: 48, category: 'fruehstueck', phases: ['deftig'], tags: ['deftig'] },

  // Mittag — Phase 1
  { id: 'm11', name: 'Hähnchensuppe mit Nudeln', description: 'Klare Brühe, Hähnchen, Eiernudeln, Gemüse', calories: 380, protein: 28, fat: 8, carbs: 48, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm12', name: 'Nudeln mit Tomatensoße', description: 'Penne, Hackfleischsoße (kleine Portion)', calories: 480, protein: 24, fat: 14, carbs: 62, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm13', name: 'Kartoffelstampf mit Hähnchen', description: 'Stampfkartoffeln, Hähnchenbruststreifen', calories: 520, protein: 36, fat: 12, carbs: 58, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm14', name: 'Gemüse-Reis mit Hähnchen', description: 'Basmatireis, Hähnchen, Brokkoli, Paprika', calories: 500, protein: 32, fat: 10, carbs: 64, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm15', name: 'Wrap mit Hähnchen', description: 'Weizentortilla, Hähnchen, Salat, Joghurtsoße', calories: 460, protein: 30, fat: 14, carbs: 50, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },

  // Mittag — Phase 2/3
  { id: 'm16', name: 'Spaghetti Bolognese', description: 'Große Portion mit Rinderhack', calories: 750, protein: 38, fat: 24, carbs: 88, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm17', name: 'Schnitzel mit Pommes', description: 'Schweineschnitzel paniert, Pommes, Salat', calories: 820, protein: 42, fat: 38, carbs: 72, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm18', name: 'Gulasch mit Knödel', description: 'Rindergulasch, Semmelknödel', calories: 780, protein: 40, fat: 28, carbs: 78, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm19', name: 'Chili con Carne mit Reis', description: 'Rinderhack-Chili, Basmatireis', calories: 720, protein: 42, fat: 22, carbs: 82, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm20', name: 'Curry-Hähnchen mit Reis', description: 'Cremiges Curry, Hähnchen, Jasminreis', calories: 680, protein: 44, fat: 20, carbs: 76, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm21', name: 'Burger mit Pommes', description: 'Rindfleisch-Burger, Pommes, Coleslaw', calories: 850, protein: 38, fat: 42, carbs: 78, category: 'mittag', phases: ['deftig'], tags: ['deftig'] },
  { id: 'm22', name: 'Lasagne', description: 'Große Portion mit Rinderhack und Béchamel', calories: 780, protein: 36, fat: 32, carbs: 72, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm23', name: 'Käsespätzle', description: 'Spätzle mit Käse und Röstzwiebeln', calories: 720, protein: 28, fat: 34, carbs: 68, category: 'mittag', phases: ['deftig'], tags: ['deftig'] },
  { id: 'm24', name: 'Pulled Pork im Brötchen', description: 'BBQ-Schweinebraten, Brioche, Krautsalat', calories: 760, protein: 40, fat: 30, carbs: 68, category: 'mittag', phases: ['deftig'], tags: ['deftig'] },
  { id: 'm25', name: 'Döner-Teller', description: 'Hähnchen-Döner, Reis, Salat, Soße', calories: 800, protein: 44, fat: 32, carbs: 72, category: 'mittag', phases: ['deftig'], tags: ['deftig'] },

  // Abend — Phase 1
  { id: 'm26', name: 'Gemüsepfanne mit Reis', description: 'Reis, Gemüse, Tofu oder Hähnchen', calories: 420, protein: 22, fat: 10, carbs: 58, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm27', name: 'Kartoffelsuppe mit Brot', description: 'Cremige Kartoffelsuppe, Vollkornbrot', calories: 400, protein: 12, fat: 14, carbs: 56, category: 'abend', phases: ['sanfterStart'], tags: ['leicht'] },
  { id: 'm28', name: 'Omelett mit Salat', description: '3-Eier-Omelett, gemischter Salat, Brot', calories: 380, protein: 24, fat: 18, carbs: 24, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm29', name: 'Reis mit Hähnchen und Erbsen', description: 'Einfache Schüssel, leicht gewürzt', calories: 460, protein: 34, fat: 8, carbs: 58, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm30', name: 'Nudelsalat mit Schinken', description: 'Nudeln, Schinken, Mais, Mayonnaise', calories: 480, protein: 20, fat: 18, carbs: 56, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },

  // Abend — Phase 2/3
  { id: 'm31', name: 'Steak mit Ofenkartoffel', description: 'Rindersteak, Sour Cream, Salat', calories: 720, protein: 48, fat: 32, carbs: 48, category: 'abend', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm32', name: 'Hähnchenschenkel mit Kartoffeln', description: 'Ofenhähnchen, Bratkartoffeln, Gemüse', calories: 680, protein: 42, fat: 28, carbs: 56, category: 'abend', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm33', name: 'Pizza Margherita (groß)', description: 'Große Pizza mit extra Käse', calories: 820, protein: 32, fat: 28, carbs: 96, category: 'abend', phases: ['deftig'], tags: ['deftig'] },
  { id: 'm34', name: 'Hackbraten mit Kartoffelbrei', description: 'Ofenhackbraten, Kartoffelbrei, Erbsen', calories: 700, protein: 38, fat: 26, carbs: 68, category: 'abend', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm35', name: 'Pasta Carbonara', description: 'Spaghetti, Speck, Ei, Parmesan', calories: 760, protein: 30, fat: 36, carbs: 72, category: 'abend', phases: ['deftig'], tags: ['deftig'] },
  { id: 'm36', name: 'Rouladen mit Klößen', description: 'Rinderroulade, Rotkohl, Kartoffelklöße', calories: 780, protein: 44, fat: 30, carbs: 62, category: 'abend', phases: ['deftig'], tags: ['deftig'] },

  // Snacks
  { id: 'm37', name: 'Banane mit Erdnussbutter', description: '1 große Banane, 2 EL Erdnussbutter', calories: 280, protein: 8, fat: 14, carbs: 32, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm38', name: 'Nuss-Mix (Handvoll)', description: 'Mandeln, Cashews, Walnüsse', calories: 250, protein: 8, fat: 20, carbs: 10, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm39', name: 'Quark mit Nüssen', description: 'Magerquark, Walnüsse, Leinöl', calories: 240, protein: 26, fat: 10, carbs: 12, category: 'snack', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm40', name: 'Skyr mit Nüssen', description: 'Skyr natur, Mandeln, Cashews', calories: 230, protein: 24, fat: 10, carbs: 14, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm41', name: 'Käse-Brot', description: 'Vollkornbrot, Gouda, Butter', calories: 320, protein: 14, fat: 18, carbs: 26, category: 'snack', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm42', name: 'Kalorien-Shake', description: 'Milch, Banane, Haferflocken, Erdnussbutter', calories: 540, protein: 22, fat: 18, carbs: 62, category: 'snack', phases: ['aufbau', 'deftig'], tags: ['deftig'] },
  { id: 'm43', name: 'Avocado-Brot mit Ei', description: 'Vollkornbrot, Avocado, 2 Spiegeleier', calories: 430, protein: 18, fat: 26, carbs: 32, category: 'snack', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'm44', name: 'Hummus mit Fladenbrot', description: 'Hummus, Fladenbrot, Olivenöl', calories: 380, protein: 12, fat: 18, carbs: 42, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },

  // Getränke (ungesüßt)
  { id: 'm45', name: 'Vollmilch (0,5 L)', description: 'Natürliche Vollmilch, ungesüßt', calories: 300, protein: 16, fat: 16, carbs: 24, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm46', name: 'Kefir natur (0,4 L)', description: 'Ungesüßter Kefir', calories: 160, protein: 12, fat: 6, carbs: 16, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm47', name: 'Protein-Shake natur', description: 'Milch, Molkepulver, ohne Zucker', calories: 280, protein: 32, fat: 6, carbs: 18, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm48', name: 'Buttermilch (0,5 L)', description: 'Ungesüßte Buttermilch', calories: 220, protein: 14, fat: 8, carbs: 20, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm49', name: 'Orangensaft (0,4 L)', description: '100% Orangensaft', calories: 180, protein: 2, fat: 0, carbs: 42, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm50', name: 'Apfelsaft (0,4 L)', description: '100% Apfelsaft', calories: 190, protein: 0, fat: 0, carbs: 46, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm51', name: 'Cola (0,5 L)', description: 'Cola, zuckerhaltig', calories: 210, protein: 0, fat: 0, carbs: 53, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm52', name: 'Tomatensaft (0,4 L)', description: '100% Tomatensaft', calories: 80, protein: 4, fat: 0, carbs: 16, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'm53', name: 'Multivitaminsaft ACE (0,4 L)', description: 'ACE-Vitaminsaft', calories: 170, protein: 1, fat: 0, carbs: 40, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
]

export const meals: Meal[] = mealData.map((m) => ({
  ...m,
  ingredients: getMealIngredients(m.id),
}))

const mealMap = new Map(meals.map((m) => [m.id, m]))

export function getMealById(id: string): Meal | undefined {
  return mealMap.get(id)
}

export function getMealsForPhase(phase: Phase): Meal[] {
  return meals.filter((m) => m.phases.includes(phase))
}

export function getMealsByCategory(category: MealCategory): Meal[] {
  return meals.filter((m) => m.category === category)
}

export function getMealsForPhaseAndCategory(phase: Phase, category: MealCategory): Meal[] {
  return meals.filter((m) => m.phases.includes(phase) && m.category === category)
}
