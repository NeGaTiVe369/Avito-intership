import { useNavigate } from 'react-router-dom'
import type { Advertisement } from '../../types/ad'
import '../../pages/ListPage.css'

const statusLabel: Record<Advertisement['status'], string> = {
  pending: 'На модерации',
  approved: 'Одобрено',
  rejected: 'Отклонено',
  draft: 'Черновик',
}

interface AdCardProps {
  ad: Advertisement
}

const AdCard = ({ ad }: AdCardProps) => {
  const navigate = useNavigate()

  const handleOpen = () => {
    navigate(`/item/${ad.id}`)
  }

  const statusClass =
    ad.status === 'approved'
      ? 'chip-status-approved'
      : ad.status === 'rejected'
        ? 'chip-status-rejected'
        : ad.status === 'draft'
          ? 'chip-status-draft'
          : 'chip-status-pending'

  return (
    <li className="ad-card" onClick={handleOpen}>
      <div className="ad-img">
        <img
          src={ad.images[0] || '/placeholder.png'}
          alt={ad.title}
        />
      </div>

      <div className="ad-content">
        <div className="ad-title-row">
          <span className="ad-title">{ad.title}</span>

          <span className={`chip ${statusClass}`}>
            {statusLabel[ad.status]}
          </span>

          {ad.priority === 'urgent' && (
            <span className="chip chip-priority-urgent">Срочно</span>
          )}
        </div>

        <div className="ad-price">{ad.price} ₽</div>

        <div className="ad-meta">
          <span className="meta-sep">{ad.category}</span>
          <span className="meta-sep">
            Создано:{' '}
            {new Date(ad.createdAt).toLocaleString('ru-RU')}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="ad-open-btn"
        onClick={(e) => {
          e.stopPropagation()
          handleOpen()
        }}
      >
        Открыть
      </button>
    </li>
  )
}

export default AdCard
