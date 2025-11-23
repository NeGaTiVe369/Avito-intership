import { useEffect, useState } from 'react'
import { getAdById } from '../api/ads'
import type { Advertisement } from '../types/ad'

export const useAdDetails = (idParam: string | undefined) => {
  const adId = Number(idParam)

  const [ad, setAd] = useState<Advertisement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!idParam || Number.isNaN(adId)) {
      setError('Некорректный идентификатор объявления')
      setLoading(false)
      setAd(null)
      return
    }

    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAdById(adId)
        if (!cancelled) {
          setAd(data)
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          setError('Не удалось загрузить объявление')
          setAd(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    // защита от обновления стейта после анмаунта
    return () => {
      cancelled = true
    }
  }, [idParam, adId])

  return { ad, setAd, loading, error, adId }
}
