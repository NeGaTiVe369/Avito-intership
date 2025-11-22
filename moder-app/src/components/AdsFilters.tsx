import type { AdStatus } from '../types/ad'
import type {
  FiltersState,
  CategoryOption,
} from '../hooks/useAdsList'
import './AdsFilters.css'


interface AdsFiltersProps {
  filters: FiltersState
  categories: CategoryOption[]
  onToggleStatus: (status: AdStatus) => void
  onCategoryChange: (value: string) => void
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onSearchChange: (value: string) => void
  onSortChange: (value: string) => void
  onResetFilters: () => void
}

function AdsFilters({ ...props }: AdsFiltersProps) {
  const {
    filters,
    categories,
    onToggleStatus,
    onCategoryChange,
    onMinPriceChange,
    onMaxPriceChange,
    onSearchChange,
    onSortChange,
    onResetFilters,
  } = props

  return (
    <div className="filters">
      <div className="filters-row">
        <div className="filters-group filters-group--search">
          <label className="filters-label" htmlFor="search-input">
            Поиск по названию
          </label>
          <input
            id="search-input"
            className="filters-input"
            type="text"
            placeholder="Введите текст…"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filters-group filters-group--category">
          <label className="filters-label" htmlFor="category-select">
            Категория
          </label>
          <select
            id="category-select"
            className="filters-select"
            value={filters.categoryId ?? ''}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters-row">
        <div className="filters-group">
          <span className="filters-label">Статус</span>
          <div className="status-options">
            <label className="status-option">
              <input
                type="checkbox"
                checked={filters.status.includes('pending')}
                onChange={() => onToggleStatus('pending')}
              />
              На модерации
            </label>
            <label className="status-option">
              <input
                type="checkbox"
                checked={filters.status.includes('approved')}
                onChange={() => onToggleStatus('approved')}
              />
              Одобрено
            </label>
            <label className="status-option">
              <input
                type="checkbox"
                checked={filters.status.includes('rejected')}
                onChange={() => onToggleStatus('rejected')}
              />
              Отклонено
            </label>
            <label className="status-option">
              <input
                type="checkbox"
                checked={filters.status.includes('draft')}
                onChange={() => onToggleStatus('draft')}
              />
              Черновик
            </label>
          </div>
        </div>

        <div className="filters-group filters-group--price">
          <span className="filters-label">Цена, ₽</span>
          <div className="filters-range">
            <input
              className="filters-input"
              type="number"
              placeholder="от"
              value={filters.minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
            />
            <span>—</span>
            <input
              className="filters-input"
              type="number"
              placeholder="до"
              value={filters.maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="filters-actions">
        <button className="filters-reset" onClick={onResetFilters}>
          Сбросить фильтры
        </button>

        <div className="filters-group">
          <label className="filters-label" htmlFor="sort-select">
            Сортировка
          </label>
          <select
            id="sort-select"
            className="filters-select filters-sort-select"
            value={filters.sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="createdAt_desc">По дате: новые сначала</option>
            <option value="createdAt_asc">По дате: старые сначала</option>
            <option value="price_asc">По цене: сначала дешёвые</option>
            <option value="price_desc">По цене: сначала дорогие</option>
            <option value="priority_desc">По приоритету: срочные выше</option>
            <option value="priority_asc">По приоритету: обычные выше</option>
          </select>
        </div>
      </div>
    </div>
  )
}


export default AdsFilters
