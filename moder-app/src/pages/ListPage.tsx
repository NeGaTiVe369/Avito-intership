import { useAdsList } from '../hooks/useAdsList'
import { PiWarningCircleThin } from "react-icons/pi"
import AdsFilters from '../components/ads-list/AdsFilters'
import AdCard from '../components/ads-list/AdCard'
import './ListPage.css'

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
      {loading && !ads.length && (
        <div className="loader">
          <div className="loader-bar">
            <div className="loader-bar-fill" />
          </div>
          <div className="loader-text">Загрузка…</div>
        </div>
      )}

      <ul className="ads-list">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}

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
