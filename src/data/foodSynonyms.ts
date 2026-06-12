/** Maps normalized DE/AT terms to English search hints for online API. */
export const FOOD_SEARCH_HINTS: Record<string, string> = {
  pommes: 'french fries',
  fritten: 'french fries',
  pataten: 'french fries',
  eiernockerl: 'austrian egg dumplings',
  nockerl: 'egg dumplings',
  nockerln: 'egg dumplings',
  spatzle: 'spatzle noodles',
  spaetzle: 'spatzle noodles',
  kaspressknodel: 'cheese dumpling',
  knodel: 'bread dumpling',
  knodeln: 'bread dumpling',
  cordon: 'cordon bleu',
  'cordon bleu': 'cordon bleu',
  'gordon bleu': 'cordon bleu',
  schnitzel: 'breaded pork schnitzel',
  wiener: 'wiener schnitzel',
  backhendl: 'fried chicken austrian',
  leberkas: 'leberkase',
  leberkaese: 'leberkase',
  gulasch: 'goulash',
  kaesespaetzle: 'cheese spaetzle',
  kasespatzle: 'cheese spaetzle',
  bratkartoffeln: 'fried potatoes',
  sauerkraut: 'sauerkraut',
  semmel: 'bread roll',
  butterbrot: 'bread with butter',
  wurstsemmel: 'sausage sandwich',
  leberkassemmel: 'leberkase sandwich',
  kroketten: 'potato croquettes',
  reis: 'cooked rice',
  salat: 'side salad',
  doner: 'doner kebab',
  kebap: 'doner kebab',
  kebab: 'doner kebab',
}

/** Expand query tokens with known synonyms before matching. */
export const FOOD_SYNONYM_GROUPS: string[][] = [
  ['pommes', 'fritten', 'pataten'],
  ['cordon', 'gordon', 'bleu'],
  ['nockerl', 'nockerln', 'eiernockerl'],
  ['spatzle', 'spaetzle'],
  ['knodel', 'knodeln', 'knoedel'],
  ['leberkas', 'leberkaese', 'leberkase'],
  ['doner', 'doener', 'kebap', 'kebab', 'durum', 'dürüm'],
  ['schnitzel', 'wiener'],
  ['gulasch', 'goulash'],
]

export function expandQueryTokens(tokens: string[]): string[] {
  const expanded = new Set(tokens)
  for (const token of tokens) {
    for (const group of FOOD_SYNONYM_GROUPS) {
      if (group.some((g) => g === token || levenshtein(g, token) <= 1)) {
        group.forEach((g) => expanded.add(g))
      }
    }
  }
  return [...expanded]
}

export function resolveSearchHint(query: string): string | undefined {
  const norm = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .trim()

  if (FOOD_SEARCH_HINTS[norm]) return FOOD_SEARCH_HINTS[norm]

  for (const [key, hint] of Object.entries(FOOD_SEARCH_HINTS)) {
    if (norm.includes(key) || key.includes(norm)) return hint
  }
  return undefined
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = i
    for (let j = 1; j <= b.length; j++) {
      const val =
        a[i - 1] === b[j - 1]
          ? row[j - 1]
          : Math.min(row[j - 1], row[j], prev) + 1
      row[j - 1] = prev
      prev = val
    }
    row[b.length] = prev
  }
  return row[b.length]
}

export { levenshtein }
