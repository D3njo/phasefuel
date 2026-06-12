import { getMealIngredients } from '../mealIngredients'
import type { Meal } from './types'

const loseMealData: Omit<Meal, 'ingredients'>[] = [
  // Frühstück
  { id: 'l01', name: 'Leichtes Müsli mit Beeren', description: 'Haferflocken, Joghurt light, Beeren', calories: 280, protein: 12, fat: 6, carbs: 42, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['gluten', 'lactose'] },
  { id: 'l02', name: 'Magerquark mit Apfel', description: 'Magerquark, Apfel, Zimt', calories: 220, protein: 24, fat: 2, carbs: 28, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['lactose'] },
  { id: 'l03', name: 'Vollkornbrot mit Frischkäse', description: '1 Scheibe Vollkornbrot, Frischkäse light, Gurke', calories: 250, protein: 12, fat: 8, carbs: 32, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['gluten', 'lactose'] },
  { id: 'l04', name: 'Haferbrei light', description: 'Haferflocken mit Wasser, Apfelstücke', calories: 260, protein: 8, fat: 4, carbs: 48, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['gluten'] },
  { id: 'l05', name: 'Rührei mit Tomate', description: '2 Eier, Tomate, Kräuter', calories: 240, protein: 16, fat: 14, carbs: 6, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['eggs'] },
  { id: 'l06', name: 'Joghurt natur mit Beeren', description: 'Naturjoghurt light, frische Beeren', calories: 200, protein: 14, fat: 4, carbs: 26, category: 'fruehstueck', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['lactose'] },
  { id: 'l07', name: 'Smoothie Bowl klein', description: 'Beeren, Banane, Skyr, wenig Haferflocken', calories: 290, protein: 16, fat: 5, carbs: 44, category: 'fruehstueck', phases: ['aufbau', 'deftig'], tags: ['leicht'], allergens: ['lactose', 'gluten'] },

  // Mittag
  { id: 'l08', name: 'Gemüsesuppe mit Brot', description: 'Klare Gemüsesuppe, 1 Scheibe Vollkornbrot', calories: 320, protein: 10, fat: 6, carbs: 52, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['gluten', 'celery'] },
  { id: 'l09', name: 'Salat mit Hähnchen', description: 'Gemischter Salat, Hähnchenbrust, Joghurt-Dressing', calories: 350, protein: 32, fat: 10, carbs: 18, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['lactose', 'mustard'] },
  { id: 'l10', name: 'Reis mit Gemüse', description: 'Basmatireis, Brokkoli, Karotten, Paprika', calories: 300, protein: 8, fat: 4, carbs: 58, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'l11', name: 'Wrap light mit Hähnchen', description: 'Vollkorn-Wrap, Hähnchen, Salat, Senf', calories: 340, protein: 28, fat: 8, carbs: 38, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['gluten', 'mustard'] },
  { id: 'l12', name: 'Linsensuppe', description: 'Rote Linsen, Karotten, Sellerie, Gewürze', calories: 280, protein: 16, fat: 4, carbs: 42, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['celery'] },
  { id: 'l13', name: 'Nudeln mit Tomatensoße light', description: 'Vollkornnudeln, Tomatensoße, Basilikum', calories: 360, protein: 12, fat: 6, carbs: 64, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['gluten'] },
  { id: 'l14', name: 'Kartoffelsalat mit Ei', description: 'Kartoffeln, 1 Ei, Joghurt statt Mayo', calories: 320, protein: 14, fat: 10, carbs: 44, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['eggs', 'lactose', 'mustard'] },
  { id: 'l15', name: 'Ofengemüse mit Quark', description: 'Zucchini, Paprika, Aubergine, Magerquark', calories: 290, protein: 18, fat: 6, carbs: 32, category: 'mittag', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['lactose'] },
  { id: 'l16', name: 'Hähnchen-Eintopf', description: 'Hähnchen, Karotten, Erbsen, Brühe', calories: 380, protein: 34, fat: 8, carbs: 36, category: 'mittag', phases: ['aufbau', 'deftig'], tags: ['leicht'], allergens: ['celery'] },

  // Abend
  { id: 'l17', name: 'Gemüsepfanne light', description: 'Gemüse, Tofu, wenig Reis', calories: 280, protein: 14, fat: 8, carbs: 36, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['soy'] },
  { id: 'l18', name: 'Omelett mit Salat', description: '2-Eier-Omelett, gemischter Salat', calories: 260, protein: 18, fat: 14, carbs: 8, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['eggs'] },
  { id: 'l19', name: 'Zucchini-Nudeln mit Hack', description: 'Zucchininudeln, mageres Hack, Tomaten', calories: 300, protein: 26, fat: 10, carbs: 18, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'l20', name: 'Kartoffelsuppe', description: 'Leichte Kartoffelsuppe ohne Sahne', calories: 270, protein: 8, fat: 6, carbs: 44, category: 'abend', phases: ['sanfterStart'], tags: ['leicht'], allergens: ['celery'] },
  { id: 'l21', name: 'Reis mit Erbsen', description: 'Basmatireis, Erbsen, Lauch', calories: 290, protein: 10, fat: 4, carbs: 52, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'] },
  { id: 'l22', name: 'Eiersalat mit Blattsalat', description: '2 Eier, Salat, Joghurt-Dressing', calories: 310, protein: 20, fat: 16, carbs: 12, category: 'abend', phases: ['sanfterStart', 'aufbau'], tags: ['leicht'], allergens: ['eggs', 'lactose', 'mustard'] },
  { id: 'l23', name: 'Tomaten-Brot-Auflauf', description: 'Vollkornbrot, Tomaten, Ei, Käse light', calories: 320, protein: 18, fat: 12, carbs: 32, category: 'abend', phases: ['aufbau', 'deftig'], tags: ['leicht'], allergens: ['gluten', 'eggs', 'lactose'] },

  // Snacks
  { id: 'l24', name: 'Apfel', description: '1 mittelgroßer Apfel', calories: 80, protein: 0, fat: 0, carbs: 20, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'l25', name: 'Gurke mit Quark', description: 'Gurkensticks, Magerquark mit Kräutern', calories: 90, protein: 12, fat: 2, carbs: 8, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['lactose'] },
  { id: 'l26', name: 'Möhrensticks mit Hummus', description: 'Karotten, 2 EL Hummus', calories: 120, protein: 4, fat: 6, carbs: 14, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['sesame'] },
  { id: 'l27', name: 'Beeren-Mix', description: '150 g frische Beeren', calories: 70, protein: 1, fat: 0, carbs: 16, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'l28', name: 'Reiswaffeln', description: '2 Reiswaffeln natur', calories: 100, protein: 2, fat: 1, carbs: 22, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'l29', name: 'Skyr mit Zimt', description: 'Skyr natur, Zimt', calories: 110, protein: 18, fat: 0, carbs: 10, category: 'snack', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['lactose'] },

  // Getränke
  { id: 'l30', name: 'Wasser mit Zitrone', description: '0,5 L Wasser, frische Zitrone', calories: 5, protein: 0, fat: 0, carbs: 1, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'l31', name: 'Kräutertee', description: 'Ungesüßter Kräutertee, 0,4 L', calories: 0, protein: 0, fat: 0, carbs: 0, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'l32', name: 'Sprudelwasser', description: '0,5 L ungesüßtes Mineralwasser', calories: 0, protein: 0, fat: 0, carbs: 0, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'l33', name: 'Buttermilch light (0,3 L)', description: 'Fettarme Buttermilch, ungesüßt', calories: 120, protein: 10, fat: 3, carbs: 14, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['lactose'] },
  { id: 'l34', name: 'Tomatensaft light (0,3 L)', description: 'Entsalzter Tomatensaft', calories: 50, protein: 2, fat: 0, carbs: 10, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'] },
  { id: 'l35', name: 'Tee mit Milch', description: 'Schwarztee mit einem Schuss Milch', calories: 30, protein: 1, fat: 1, carbs: 4, category: 'getraenk', phases: ['sanfterStart', 'aufbau', 'deftig'], tags: ['leicht'], allergens: ['lactose'] },
]

export function buildLoseMeals(): Meal[] {
  return loseMealData.map((m) => ({
    ...m,
    ingredients: getMealIngredients(m.id),
  }))
}
