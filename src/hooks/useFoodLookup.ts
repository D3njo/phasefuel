import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState } from 'react'
import type { Allergen } from '../data/allergens'
import { db } from '../db/database'
import {
  lookupFoodOnline,
  mergeLookupResults,
  resolveNutritionApiKey,
  searchAllDishes,
  type FoodLookupResult,
} from '../services/foodLookup'

interface UseFoodLookupOptions {
  query: string
  nutritionApiKey?: string
  excludedAllergens?: Allergen[]
  enabled?: boolean
}

export function useFoodLookup({
  query,
  nutritionApiKey,
  excludedAllergens = [],
  enabled = true,
}: UseFoodLookupOptions) {
  const [suggestions, setSuggestions] = useState<FoodLookupResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasApiKey, setHasApiKey] = useState(false)

  const requestId = useRef(0)
  const exclusionsKey = excludedAllergens.join(',')
  const savedDishes = useLiveQuery(
    () => db.savedDishes.orderBy('lastUsed').reverse().toArray(),
    [],
  )

  useEffect(() => {
    if (!enabled) {
      setSuggestions([])
      setLoading(false)
      setError(null)
      return
    }

    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setSuggestions([])
      setLoading(false)
      setError(null)
      return
    }

    const apiKey = resolveNutritionApiKey(nutritionApiKey)
    setHasApiKey(Boolean(apiKey))

    const local = searchAllDishes(trimmed, savedDishes ?? [], 10, excludedAllergens)
    setSuggestions(local)

    if (!apiKey) {
      setLoading(false)
      setError(null)
      return
    }

    const currentRequest = ++requestId.current
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const timer = window.setTimeout(async () => {
      try {
        const online = await lookupFoodOnline(trimmed, apiKey, controller.signal)
        if (currentRequest !== requestId.current) return
        setSuggestions(mergeLookupResults(local, online))
      } catch (err) {
        if (currentRequest !== requestId.current) return
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError('Online-Suche fehlgeschlagen')
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false)
        }
      }
    }, 450)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query, nutritionApiKey, enabled, exclusionsKey, savedDishes])

  return { suggestions, loading, error, hasApiKey, savedDishes: savedDishes ?? [] }
}
