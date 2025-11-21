import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdsList } from '../api/ads'
import type { Advertisement, Pagination as PaginationType } from '../types/ad'
import './ListPage.css'

const statusLabel: Record<Advertisement['status'], string> = {
  pending: 'На модерации',
  approved: 'Одобрено',
  rejected: 'Отклонено',
  draft: 'Черновик',
}

const ListPage = () => {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [pagination, setPagination] = useState<PaginationType | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const loadAds = async (pageToLoad: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAdsList({ page: pageToLoad, limit: 10 })
      setAds(data.ads)
      setPagination(data.pagination)
    } catch (e) {
      console.error(e)
      setError('Не удалось загрузить объявления')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAds(page)
  }, [page])

  const handlePageChange = (value: number) => {
    setPage(value)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Список объявлений</h1>
        {pagination && (
          <span className="page-total">
            Всего объявлений: {pagination.totalItems}
          </span>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      {loading && !ads.length && <div className="loader">Загрузка…</div>}

      <ul className="ads-list">
        {ads.map((ad) => (
          <li
            key={ad.id}
            className="ad-card"
            onClick={() => navigate(`/item/${ad.id}`)}
          >
            <div className="ad-title-row">
              <span className="ad-title">{ad.title}</span>

              <span
                className={
                  'chip ' +
                  (ad.status === 'approved'
                    ? 'chip-status-approved'
                    : ad.status === 'rejected'
                    ? 'chip-status-rejected'
                    : ad.status === 'draft'
                    ? 'chip-status-draft'
                    : 'chip-status-pending')
                }
              >
                {statusLabel[ad.status]}
              </span>

              {ad.priority === 'urgent' && (
                <span className="chip chip-priority-urgent">Срочно</span>
              )}
            </div>

            <div className="ad-meta">
              <span>{ad.price} ₽</span>
              <span className="meta-sep">{ad.category}</span>
              <span className="meta-sep">
                Создано: {new Date(ad.createdAt).toLocaleString()}
              </span>
            </div>
          </li>
        ))}

        {!ads.length && !loading && !error && (
          <li>Объявлений нет.</li>
        )}
      </ul>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: pagination.totalPages }).map((_, index) => {
            const pageNumber = index + 1
            const isActive = pageNumber === pagination.currentPage

            return (
              <button
                key={pageNumber}
                className={`page-btn ${isActive ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ListPage
