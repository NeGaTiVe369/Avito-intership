import { api } from './http'
import type {
  AdsListParams,
  AdsListResponse,
  Advertisement,
  ModerationActionResponse,
  ModerationReason,
} from '../types/ad'

// список объявлений
export async function getAdsList(params: AdsListParams = {}) {
  const response = await api.get<AdsListResponse>('/ads', { params })
  return response.data
}

// детальное объявление по id
export async function getAdById(id: number) {
  const response = await api.get<Advertisement>(`/ads/${id}`)
  return response.data
}

// одобрить объявление
export async function approveAd(id: number) {
  const response = await api.post<ModerationActionResponse>(`/ads/${id}/approve`)
  return response.data.ad
}

export interface ModerationPayload {
  reason: ModerationReason
  comment?: string
}

// отклонить объявление
export async function rejectAd(id: number, payload: ModerationPayload) {
  const response = await api.post<ModerationActionResponse>(
    `/ads/${id}/reject`,
    payload,
  )
  return response.data.ad
}

// запросить доработку
export async function requestChanges(id: number, payload: ModerationPayload) {
  const response = await api.post<ModerationActionResponse>(
    `/ads/${id}/request-changes`,
    payload,
  )
  return response.data.ad
}
