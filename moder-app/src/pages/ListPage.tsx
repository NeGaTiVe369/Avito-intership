import { useNavigate } from 'react-router-dom'
import type { Advertisement } from '../types/ad'
import './ListPage.css'
import { useAdsList } from '../hooks/useAdsList'
import { PiWarningCircleThin } from "react-icons/pi"
import AdsFilters from '../components/AdsFilters'

const statusLabel: Record<Advertisement['status'], string> = {
  pending: 'На модерации',
  approved: 'Одобрено',
  rejected: 'Отклонено',
  draft: 'Черновик',
}

const ListPage = () => {
  const {
    ads,
    pagination,
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
  } = useAdsList()

  const navigate = useNavigate()

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

      <AdsFilters
        filters={filters}
        categories={categories}
        onToggleStatus={toggleStatus}
        onCategoryChange={handleCategoryChange}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
      />

      {error && <div className="error">{error}</div>}
      {loading && !ads.length && <div className="loader">Загрузка…</div>}

      <ul className="ads-list">
        {ads.map((ad) => {
          return (
            <li
              key={ad.id}
              className="ad-card"
              onClick={() => navigate(`/item/${ad.id}`)}
            >
              <div className="ad-img">
                <img
                  src={ad.images[0] || "/placeholder.png"}
                  alt={ad.title}
                />
              </div>

              <div className="ad-content">
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

                <div className="ad-price">
                  {ad.price} ₽
                </div>

                <div className="ad-meta">
                  <span className="meta-sep">{ad.category}</span>
                  <span className="meta-sep">
                    Создано: {new Date(ad.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="ad-open-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/item/${ad.id}`)
                }}
              >
                Открыть
              </button>
            </li>
          )
        })}

        {!ads.length && !loading && !error && (
          <li className="empty-state">
            <div className="empty-state-content">
              <PiWarningCircleThin size={96} className="empty-state-icon" />
              <h3 className="empty-state-title">Объявлений не найдено</h3>
              <p className="empty-state-description">
                Попробуйте изменить фильтры или сбросить их, чтобы увидеть больше результатов
              </p>
            </div>
          </li>
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
