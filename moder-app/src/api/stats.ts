import { api } from './http'
import type {
  StatsPeriod,
  StatsSummary,
  ActivityPoint,
  DecisionsData,
  CategoriesData,
} from '../types/stats'

export interface StatsParams {
  period?: StatsPeriod
}

//общая статистика
export async function getStatsSummary(params: StatsParams) {
  const response = await api.get<StatsSummary>('/stats/summary', { params })
  return response.data
}

//график активности
export async function getActivityChart(params: StatsParams) {
  const response = await api.get<ActivityPoint[]>('/stats/chart/activity', {
    params,
  })
  return response.data
}

//график решений
export async function getDecisionsChart(params: StatsParams) {
  const response = await api.get<DecisionsData>('/stats/chart/decisions', {
    params,
  })
  return response.data
}

//график категорий
export async function getCategoriesChart(params: StatsParams) {
  const response = await api.get<CategoriesData>('/stats/chart/categories', {
    params,
  })
  return response.data
}
