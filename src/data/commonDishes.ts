import type { Allergen } from './allergens'

export type DishKind = 'main' | 'side' | 'combo' | 'snack' | 'drink'

export interface CommonDish {
  name: string
  aliases: string[]
  kind: DishKind
  calories: number
  protein: number
  fat?: number
  carbs?: number
  servingNote?: string
  searchHint?: string
  allergens?: Allergen[]
}

function d(
  name: string,
  kind: DishKind,
  calories: number,
  protein: number,
  aliases: string[] = [],
  opts: Partial<Pick<CommonDish, 'fat' | 'carbs' | 'servingNote' | 'searchHint' | 'allergens'>> = {},
): CommonDish {
  return { name, kind, calories, protein, aliases, ...opts }
}

/** Typical restaurant / home portions (not per 100 g). */
export const COMMON_DISHES: CommonDish[] = [
  // --- Beilagen (einzeln) ---
  d('Pommes', 'side', 320, 4, ['pommes', 'fritten', 'pataten'], {
    fat: 15,
    carbs: 42,
    servingNote: '1 Portion',
    searchHint: 'french fries',
  }),
  d('Kroketten', 'side', 280, 4, ['kroketten'], { fat: 14, carbs: 36, servingNote: '6 Stück' }),
  d('Reis', 'side', 200, 4, ['reis', 'gekochter reis'], { fat: 1, carbs: 44, servingNote: '1 Portion' }),
  d('Spätzle', 'side', 280, 8, ['spätzle', 'spaetzle', 'spatzle'], {
    fat: 6,
    carbs: 48,
    servingNote: '1 Portion',
    allergens: ['gluten', 'eggs'],
  }),
  d('Knödel', 'side', 220, 6, ['knödel', 'knoedel', 'knodel', 'semmelknödel'], {
    fat: 4,
    carbs: 38,
    servingNote: '2 Stück',
    allergens: ['gluten', 'eggs'],
  }),
  d('Bratkartoffeln', 'side', 250, 4, ['bratkartoffeln', 'bratkartoffel'], {
    fat: 12,
    carbs: 32,
    servingNote: '1 Portion',
  }),
  d('Sauerkraut', 'side', 45, 2, ['sauerkraut', 'kraut'], { fat: 0, carbs: 8 }),
  d('Gemischter Salat', 'side', 80, 3, ['salat', 'beilagensalat', 'grüner salat'], {
    fat: 4,
    carbs: 6,
    servingNote: 'klein',
  }),
  d('Preiselbeeren', 'side', 60, 0, ['preiselbeeren', 'preiselbeer'], { fat: 0, carbs: 15 }),

  // --- DE/AT Hauptgerichte ---
  d('Cordon Bleu', 'main', 620, 42, ['cordon bleu', 'gordon bleu', 'schweine cordon bleu'], {
    fat: 32,
    carbs: 28,
    servingNote: '1 Stück',
    searchHint: 'cordon bleu',
    allergens: ['gluten', 'eggs', 'lactose'],
  }),
  d('Wiener Schnitzel', 'main', 450, 32, ['schnitzel', 'wiener schnitzel', 'paniertes schnitzel'], {
    fat: 24,
    carbs: 22,
    servingNote: 'ohne Beilage',
    searchHint: 'wiener schnitzel',
    allergens: ['gluten', 'eggs'],
  }),
  d('Jägerschnitzel', 'main', 520, 34, ['jägerschnitzel', 'jaegerschnitzel'], {
    fat: 26,
    carbs: 28,
    allergens: ['gluten', 'eggs'],
  }),
  d('Eiernockerl', 'main', 480, 18, ['eiernockerl', 'ei nockerl', 'nockerl', 'nockerln'], {
    fat: 18,
    carbs: 58,
    servingNote: '1 Portion',
    searchHint: 'austrian egg dumplings',
    allergens: ['gluten', 'eggs'],
  }),
  d('Käsespätzle', 'main', 580, 22, ['käsespätzle', 'kaesespaetzle', 'kasespatzle'], {
    fat: 28,
    carbs: 52,
    allergens: ['gluten', 'eggs', 'lactose'],
  }),
  d('Kaspressknödel', 'main', 420, 16, ['kaspressknödel', 'kaspressknodel', 'käseknödel'], {
    fat: 18,
    carbs: 42,
    allergens: ['gluten', 'eggs', 'lactose'],
  }),
  d('Gulasch', 'main', 480, 32, ['gulasch', 'rindsgulasch', 'goulash'], {
    fat: 18,
    carbs: 28,
    servingNote: 'mit Semmelknödel',
  }),
  d('Rinderbraten', 'main', 420, 38, ['rinderbraten', 'braten'], { fat: 16, carbs: 12 }),
  d('Backhendl', 'main', 520, 38, ['backhendl', 'back hendl', 'gebackenes huhn'], {
    fat: 28,
    carbs: 22,
    searchHint: 'fried chicken austrian',
  }),
  d('Leberkäse', 'main', 380, 22, ['leberkäse', 'leberkas', 'leberkaese'], {
    fat: 28,
    carbs: 4,
    servingNote: '1 Scheibe',
  }),
  d('Käsekrainer', 'main', 420, 18, ['käsekrainer', 'kaesekrainer', 'krainer'], {
    fat: 32,
    carbs: 4,
    allergens: ['lactose'],
  }),
  d('Linseneintopf', 'main', 320, 18, ['linseneintopf', 'linsensuppe', 'linsengericht'], {
    fat: 6,
    carbs: 42,
  }),
  d('Krautfleckerl', 'main', 380, 12, ['krautfleckerl', 'krautflecker'], {
    fat: 14,
    carbs: 48,
    allergens: ['gluten', 'eggs'],
  }),
  d('Tafelspitz', 'main', 380, 42, ['tafelspitz', 'tafelspitz mit sauce'], {
    fat: 14,
    carbs: 8,
  }),
  d('Frittatensuppe', 'main', 120, 8, ['frittatensuppe', 'rindsuppe'], { fat: 4, carbs: 10 }),
  d('Eintopf', 'main', 350, 20, ['eintopf', 'gemüseeintopf'], { fat: 10, carbs: 38 }),

  // --- Snacks ---
  d('Butterbrot', 'snack', 180, 5, ['butterbrot', 'brot mit butter'], { fat: 8, carbs: 22 }),
  d('Wurstsemmel', 'snack', 320, 14, ['wurstsemmel', 'wurst semmel'], { fat: 14, carbs: 32 }),
  d('Leberkäsesemmel', 'snack', 420, 18, ['leberkäsesemmel', 'leberkas semmel'], {
    fat: 22,
    carbs: 34,
  }),
  d('Apfel', 'snack', 95, 0, ['apfel'], { fat: 0, carbs: 25, servingNote: '1 Stück' }),
  d('Banane', 'snack', 105, 1, ['banane'], { fat: 0, carbs: 27, servingNote: '1 Stück' }),
  d('Müsliriegel', 'snack', 180, 4, ['müsliriegel', 'muesliriegel', 'riegel'], {
    fat: 7,
    carbs: 26,
    allergens: ['gluten', 'nuts'],
  }),

  // --- Kombinationen ---
  d('Schnitzel mit Pommes', 'combo', 780, 38, ['schnitzel pommes', 'schnitzel mit pommes'], {
    fat: 40,
    carbs: 58,
    allergens: ['gluten', 'eggs'],
  }),
  d('Cordon Bleu mit Pommes', 'combo', 900, 44, ['cordon bleu pommes'], {
    fat: 48,
    carbs: 62,
    allergens: ['gluten', 'eggs', 'lactose'],
  }),
  d('Burger mit Pommes', 'combo', 850, 32, ['burger', 'cheeseburger', 'hamburger', 'big mac'], {
    fat: 42,
    carbs: 72,
    allergens: ['gluten', 'eggs'],
  }),
  d('Currywurst mit Pommes', 'combo', 720, 18, ['currywurst', 'curry wurst'], {
    fat: 38,
    carbs: 58,
  }),
  d('Bratwurst mit Kraut', 'combo', 580, 22, ['bratwurst', 'bratwurst mit sauerkraut'], {
    fat: 38,
    carbs: 28,
  }),
  d('Fish & Chips', 'combo', 820, 30, ['fish and chips', 'fisch mit pommes'], {
    fat: 42,
    carbs: 68,
    allergens: ['gluten', 'fish'],
  }),
  d('Döner / Kebab', 'combo', 750, 38, ['doner', 'kebap', 'kebab', 'doener', 'dürüm', 'durum', 'yufka'], {
    fat: 32,
    carbs: 58,
    servingNote: '1 Döner-Teller',
    searchHint: 'doner kebab',
  }),

  // --- International ---
  d('Chicken Tikka Masala', 'main', 680, 35, ['tikka masala', 'chicken tikka'], {
    fat: 28,
    carbs: 52,
    servingNote: 'mit Reis',
  }),
  d('Pho', 'main', 450, 28, ['pho bo', 'pho ga', 'vietnamesische suppe'], {
    fat: 8,
    carbs: 58,
    servingNote: '1 Schüssel',
    searchHint: 'pho soup',
  }),
  d('Ramen', 'main', 550, 22, ['miso ramen', 'shoyu ramen', 'tonkotsu'], {
    fat: 18,
    carbs: 68,
    servingNote: '1 Schüssel',
    searchHint: 'ramen bowl',
  }),
  d('Schinken-Pizza', 'main', 580, 24, ['schinken pizza', 'pizza schinken', 'ham pizza'], {
    fat: 22,
    carbs: 62,
    servingNote: '2 Stück',
    allergens: ['gluten', 'lactose'],
  }),
  d('Pizza Margherita', 'main', 520, 20, ['margherita', 'pizza margherita'], {
    fat: 18,
    carbs: 58,
    servingNote: '2 Stück',
    allergens: ['gluten', 'lactose'],
  }),
  d('Pizza Salami', 'main', 620, 24, ['salami pizza', 'pizza salami'], {
    fat: 26,
    carbs: 60,
    servingNote: '2 Stück',
    allergens: ['gluten', 'lactose'],
  }),
  d('Pad Thai', 'main', 620, 22, ['pad thai', 'thai nudeln'], { fat: 22, carbs: 72 }),
  d('Sushi-Set', 'main', 480, 24, ['sushi', 'maki', 'nigiri'], {
    fat: 12,
    carbs: 62,
    servingNote: '8–10 Stück',
    allergens: ['fish', 'soy'],
  }),
  d('Butter Chicken', 'main', 650, 32, ['butter chicken', 'murgh makhani'], {
    fat: 32,
    carbs: 48,
    servingNote: 'mit Reis',
  }),
  d('Falafel-Teller', 'main', 620, 18, ['falafel', 'falafel teller', 'falafel wrap'], {
    fat: 28,
    carbs: 58,
  }),
  d('Shawarma', 'main', 680, 34, ['shawarma', 'schawarma'], { fat: 28, carbs: 52 }),
  d('Burrito', 'main', 720, 28, ['burrito', 'beef burrito', 'chicken burrito'], {
    fat: 28,
    carbs: 72,
    allergens: ['gluten', 'lactose'],
  }),
  d('Tacos (3 Stück)', 'main', 540, 24, ['tacos', 'taco'], { fat: 22, carbs: 48 }),
  d('Lasagne', 'main', 620, 28, ['lasagne', 'lasagna'], {
    fat: 28,
    carbs: 52,
    allergens: ['gluten', 'lactose', 'eggs'],
  }),
  d('Spaghetti Bolognese', 'main', 580, 26, ['bolognese', 'spaghetti bolognese'], {
    fat: 18,
    carbs: 62,
    allergens: ['gluten'],
  }),
  d('Carbonara', 'main', 650, 24, ['carbonara', 'pasta carbonara'], {
    fat: 32,
    carbs: 58,
    allergens: ['gluten', 'eggs', 'lactose'],
  }),
  d('KFC / Fried Chicken', 'main', 680, 36, ['fried chicken', 'kentucky', 'chicken strips'], {
    fat: 38,
    carbs: 42,
    servingNote: '3–4 Stück',
  }),
  d('Gyros-Teller', 'main', 720, 36, ['gyros', 'gyros teller'], { fat: 32, carbs: 52 }),
  d('Paella', 'main', 580, 28, ['paella'], { fat: 18, carbs: 62 }),
  d('Risotto', 'main', 520, 14, ['risotto', 'pilz risotto'], { fat: 18, carbs: 58 }),
  d('Tom Yum Suppe', 'main', 180, 12, ['tom yum', 'tom yam'], { fat: 6, carbs: 18 }),
  d('Green Curry', 'main', 540, 26, ['green curry', 'grünes curry'], {
    fat: 22,
    carbs: 48,
    servingNote: 'mit Reis',
  }),
  d('Kaiserschmarrn', 'main', 480, 12, ['kaiserschmarrn', 'schmarrn'], {
    fat: 16,
    carbs: 62,
    allergens: ['gluten', 'eggs', 'lactose', 'sweets'],
  }),
  d('Apfelstrudel', 'snack', 380, 5, ['apfelstrudel', 'strudel'], {
    fat: 14,
    carbs: 52,
    servingNote: '1 Stück',
    allergens: ['gluten', 'sweets'],
  }),
]

export const QUICK_PICK_DISHES = ['Pommes', 'Reis', 'Gemischter Salat', 'Spätzle', 'Wurstsemmel']

export const DISH_KIND_LABELS: Record<DishKind, string> = {
  main: 'Gerichte',
  side: 'Beilagen',
  combo: 'Kombinationen',
  snack: 'Snacks',
  drink: 'Getränke',
}
