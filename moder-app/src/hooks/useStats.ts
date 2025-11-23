import { useEffect, useState } from 'react'
import type {
  StatsPeriod,
  StatsSummaryType,
  ActivityPointType,
  DecisionsDataType,
  CategoriesDataType,
} from '../types/stats'
import {
  getStatsSummary,
  getActivityChart,
  getDecisionsChart,
  getCategoriesChart,
} from '../api/stats'

interface UseStatsResult {
  summary: StatsSummaryType | null
  activity: ActivityPointType[]
  decisions: DecisionsDataType | null
  categories: CategoriesDataType | null
  loading: boolean
  error: string | null
}

export const useStats = (period: StatsPeriod): UseStatsResult => {
  const [summary, setSummary] = useState<StatsSummaryType | null>(null)
  const [activity, setActivity] = useState<ActivityPointType[]>([])
  const [decisions, setDecisions] = useState<DecisionsDataType | null>(null)
  const [categories, setCategories] = useState<CategoriesDataType | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = { period }

        const [summaryData, activityData, decisionsData, categoriesData] =
          await Promise.all([
            getStatsSummary(params),
            getActivityChart(params),
            getDecisionsChart(params),
            getCategoriesChart(params),
          ])

        setSummary(summaryData)
        setActivity(activityData)
        setDecisions(decisionsData)
        setCategories(categoriesData)
      } catch (e) {
        console.error(e)
        setError('Не удалось загрузить статистику')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [period])

  return {
    summary,
    activity,
    decisions,
    categories,
    loading,
    error,
  }
}
