import { api } from './http'
import type {
  StatsPeriod,
  StatsSummaryType,
  ActivityPointType,
  DecisionsDataType,
  CategoriesDataType,
} from '../types/stats'

export interface StatsParams {
  period?: StatsPeriod
}

export async function getStatsSummary(params: StatsParams) {
  const response = await api.get<StatsSummaryType>('/stats/summary', { params })
  return response.data
}

export async function getActivityChart(params: StatsParams) {
  const response = await api.get<ActivityPointType[]>('/stats/chart/activity', {
    params,
  })
  
  return response.data
}

export async function getDecisionsChart(params: StatsParams) {
  const response = await api.get<DecisionsDataType>('/stats/chart/decisions', {
    params,
  })
  return response.data
}

export async function getCategoriesChart(params: StatsParams) {
  const response = await api.get<CategoriesDataType>('/stats/chart/categories', {
    params,
  })
  return response.data
}
