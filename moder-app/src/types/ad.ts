export type AdStatus = 'pending' | 'approved' | 'rejected' | 'draft'
export type AdPriority = 'normal' | 'urgent'

export interface Seller {
  id: number
  name: string
  rating: string
  totalAds: number
  registeredAt: string
}

export type ModerationActionType = 'approved' | 'rejected' | 'requestChanges'

export type ModerationReason =
  | 'Запрещенный товар'
  | 'Неверная категория'
  | 'Некорректное описание'
  | 'Проблемы с фото'
  | 'Подозрение на мошенничество'
  | 'Другое'

export interface ModerationHistoryItem {
  id: number
  moderatorId: number
  moderatorName: string
  action: ModerationActionType
  reason: string | null
  comment: string
  timestamp: string
}

export interface Advertisement {
  id: number
  title: string
  description: string
  price: number
  category: string
  categoryId: number
  status: AdStatus
  priority: AdPriority
  createdAt: string
  updatedAt: string
  images: string[]
  seller: Seller
  characteristics: Record<string, string>
  moderationHistory: ModerationHistoryItem[]
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface AdsListResponse {
  ads: Advertisement[]
  pagination: Pagination
}

export interface AdsListParams {
  page?: number
  limit?: number
  status?: AdStatus[]
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'createdAt' | 'price' | 'priority'
  sortOrder?: 'asc' | 'desc'
}

export interface ModerationActionResponse {
  message: string
  ad: Advertisement
}
