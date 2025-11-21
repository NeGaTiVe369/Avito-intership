import { api } from './http'
import type { AdsListParams, AdsListResponse } from '../types/ad'

export async function getAdsList(params: AdsListParams = {}) {
  const response = await api.get<AdsListResponse>('/ads', { params })
  return response.data
}
