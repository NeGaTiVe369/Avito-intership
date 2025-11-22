import { useEffect, useState } from 'react'
import { getAdsList } from '../api/ads'
import type {
  Advertisement,
  Pagination as PaginationType,
  AdStatus,
} from '../types/ad'

export type SortOption =
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'price_asc'
  | 'price_desc'
  | 'priority_desc'
  | 'priority_asc'

export interface FiltersState {
  status: AdStatus[]
  categoryId?: number
  minPrice: string
  maxPrice: string
  search: string
  sort: SortOption
}

export const initialFilters: FiltersState = {
  status: [],
  categoryId: undefined,
  minPrice: '',
  maxPrice: '',
  search: '',
  sort: 'createdAt_desc',
}

export interface CategoryOption {
  id: number
  name: string
}

export function useAdsList() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [pagination, setPagination] = useState<PaginationType | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<FiltersState>(initialFilters)
  const [categories, setCategories] = useState<CategoryOption[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const params: any = {
          page,
          limit: 10,
        }

        if (filters.status.length) {
          params.status = filters.status
        }

        if (filters.categoryId) {
          params.categoryId = filters.categoryId
        }

        const min = Number(filters.minPrice)
        const max = Number(filters.maxPrice)

        if (!Number.isNaN(min) && filters.minPrice !== '') {
          params.minPrice = min
        }
        if (!Number.isNaN(max) && filters.maxPrice !== '') {
          params.maxPrice = max
        }

        if (filters.search.trim()) {
          params.search = filters.search.trim()
        }

        const [sortBy, sortOrder] = filters.sort.split('_') as [
          'createdAt' | 'price' | 'priority',
          'asc' | 'desc',
        ]
        params.sortBy = sortBy
        params.sortOrder = sortOrder

        const data = await getAdsList(params)

        setAds(data.ads)
        setPagination(data.pagination)

        const map = new Map<number, string>()
        data.ads.forEach((ad) => {
          if (!map.has(ad.categoryId)) {
            map.set(ad.categoryId, ad.category)
          }
        })
        setCategories(
          Array.from(map.entries()).map(([id, name]) => ({ id, name })),
        )
      } catch (e) {
        console.error(e)
        setError('Не удалось загрузить объявления')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [page, filters])

  const handlePageChange = (value: number) => {
    setPage(value)
  }

  const toggleStatus = (status: AdStatus) => {
    setPage(1)
    setFilters((prev) => {
      const exists = prev.status.includes(status)
      return {
        ...prev,
        status: exists
          ? prev.status.filter((s) => s !== status)
          : [...prev.status, status],
      }
    })
  }

  const handleCategoryChange = (value: string) => {
    setPage(1)
    setFilters((prev) => ({
      ...prev,
      categoryId: value ? Number(value) : undefined,
    }))
  }

  const handleMinPriceChange = (value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, minPrice: value }))
  }

  const handleMaxPriceChange = (value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, maxPrice: value }))
  }

  const handleSearchChange = (value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, search: value }))
  }

  const handleSortChange = (value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, sort: value as SortOption }))
  }

  const handleResetFilters = () => {
    setPage(1)
    setFilters(initialFilters)
  }

  return {
    ads,
    pagination,
    page,
    loading,
    error,
    filters,
    categories,
    handlePageChange,
    toggleStatus,
    handleCategoryChange,
    handleMinPriceChange,
    handleMaxPriceChange,
    handleSearchChange,
    handleSortChange,
    handleResetFilters,
  }
}
