import type { Advertisement } from '../types/ad'
import { useNavigate, useParams } from 'react-router-dom'
import ModerationPanel from '../components/ModerationPanel'
import ModerationHistory from '../components/ModerationHistory'
import AdGallery from '../components/AdGallery'
import { useAdDetails } from '../hooks/useAdDetails'
import './AdDetailPage.css'

const statusLabel: Record<Advertisement['status'], string> = {
  pending: 'На модерации',
  approved: 'Одобрено',
  rejected: 'Отклонено',
  draft: 'Черновик',
}

const statusClass: Record<Advertisement['status'], string> = {
  pending: 'status-badge status-pending',
  approved: 'status-badge status-approved',
  rejected: 'status-badge status-rejected',
  draft: 'status-badge status-draft',
}

const AdDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { ad, setAd, loading, error, adId } = useAdDetails(id)

  if (loading) {
    return <div className="detail-page">Загрузка…</div>
  }

  if (error || !ad) {
    return <div className="detail-page">Ошибка: {error ?? 'Нет данных'}</div>
  }

  return (
    <div className="detail-page">
      <div className="detail-header">
        <h1 className="detail-title">{ad.title}</h1>
        <div className="detail-badges">
          <span className={statusClass[ad.status]}>
            {statusLabel[ad.status]}
          </span>
          {ad.priority === 'urgent' && (
            <span className="priority-badge">Срочно</span>
          )}
        </div>
      </div>

      <div className="gallery-history-row">
        <AdGallery images={ad.images} title={ad.title} />
        <ModerationHistory history={ad.moderationHistory} />
      </div>

      <section className="detail-section">
        <div className="detail-section-title">Описание</div>
        <p className="detail-description">{ad.description}</p>
        <div className="detail-meta">
          <span> Цена: <strong>{ad.price} ₽</strong> </span>
          <span> Категория: <strong>{ad.category}</strong> </span>
          <span>
            Дата создания: <strong>{new Date(ad.createdAt).toLocaleDateString('ru-RU')}</strong>
          </span>
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-section-title">Характеристики</div>
        {ad.characteristics && Object.keys(ad.characteristics).length ? (
          <table className="characteristics-table">
            <tbody>
              {Object.entries(ad.characteristics).map(
                ([key, value]) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{value}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        ) : (
          <div className="empty-text">Характеристики не указаны</div>
        )}
      </section>

      <section className="detail-section">
        <div className="detail-section-title">Продавец</div>
        <div className="seller-info">
          <div className="seller-row">
            <span className="seller-label">Имя:</span>
            <span className="seller-value">{ad.seller.name}</span>
          </div>
          <div className="seller-row">
            <span className="seller-label">Рейтинг:</span>
            <span className="seller-value">{ad.seller.rating}</span>
          </div>
          <div className="seller-row">
            <span className="seller-label">Объявлений:</span>
            <span className="seller-value">
              {ad.seller.totalAds}
            </span>
          </div>
          <div className="seller-row">
            <span className="seller-label">На сайте с:</span>
            <span className="seller-value">
              {new Date(
                ad.seller.registeredAt,
              ).toLocaleDateString("ru-RU")}
            </span>
          </div>
        </div>
      </section>

      <ModerationPanel ad={ad} onAdUpdate={setAd} />

      <div className="detail-navigation">
        <button className="nav-btn" onClick={() => navigate('/list')}>
          Назад к списку
        </button>
        <div className="nav-controls">
          <button className="nav-btn" onClick={() => navigate(`/item/${adId - 1}`)} disabled={adId <= 1}>
            Пред
          </button>
          <button className="nav-btn" onClick={() => navigate(`/item/${adId + 1}`)} disabled={adId >= 150}>
            След
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdDetailPage
