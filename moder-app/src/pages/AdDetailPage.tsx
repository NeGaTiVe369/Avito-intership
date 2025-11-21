import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getAdById,
  approveAd,
  rejectAd,
  requestChanges,
  type ModerationPayload,
} from '../api/ads'
import type {
  Advertisement,
  ModerationHistoryItem,
  ModerationReason,
} from '../types/ad'
import './AdDetailPage.css'

type ModalType = 'reject' | 'requestChanges'

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

const actionLabel: Record<ModerationHistoryItem['action'], string> = {
  approved: 'Одобрено',
  rejected: 'Отклонено',
  requestChanges: 'Запрос на доработку',
}

const REASONS: ModerationReason[] = [
  'Запрещенный товар',
  'Неверная категория',
  'Некорректное описание',
  'Проблемы с фото',
  'Подозрение на мошенничество',
  'Другое',
]

const AdDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const adId = Number(id)

  const [ad, setAd] = useState<Advertisement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalType, setModalType] = useState<ModalType | null>(null)
  const [reason, setReason] = useState<ModerationReason>('Запрещенный товар')
  const [comment, setComment] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    if (!adId || Number.isNaN(adId)) {
      setError('Некорректный идентификатор объявления')
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAdById(adId)
        setAd(data)
      } catch (e) {
        console.error(e)
        setError('Не удалось загрузить объявление')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [adId])

  const handleApprove = async () => {
    if (!ad) return

    try {
      setActionLoading(true)
      setActionError(null)
      const updated = await approveAd(ad.id)
      setAd(updated)
      setActionMessage('Объявление одобрено')
    } catch (e) {
      console.error(e)
      setActionError('Не удалось одобрить объявление')
    } finally {
      setActionLoading(false)
    }
  }

  const openModal = (type: ModalType) => {
    setModalType(type)
    setReason('Запрещенный товар')
    setComment('')
    setActionMessage(null)
    setActionError(null)
  }

  const closeModal = () => {
    if (actionLoading) return
    setModalType(null)
  }

  const handleSubmitModal = async () => {
    if (!ad || !modalType) return

    const payload: ModerationPayload = {
      reason,
      comment: comment.trim() || undefined,
    }

    try {
      setActionLoading(true)
      setActionError(null)

      const updated =
        modalType === 'reject'
          ? await rejectAd(ad.id, payload)
          : await requestChanges(ad.id, payload)

      setAd(updated)
      setModalType(null)
      setActionMessage(
        modalType === 'reject'
          ? 'Объявление отклонено'
          : 'Запрос на доработку отправлен',
      )
    } catch (e) {
      console.error(e)
      setActionError('Не удалось выполнить действие')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <div className="detail-page">Загрузка…</div>
  }

  if (error || !ad) {
    return <div className="detail-page">Ошибка: {error ?? 'Нет данных'}</div>
  }

  return (
    <div className="detail-page">
      <button className="detail-back" onClick={() => navigate('/list')}>
        ← Назад к списку
      </button>

      <div className="detail-header">
        <div className="detail-title-block">
          <h1 className="detail-title">{ad.title}</h1>
          <div className="detail-tags">
            <span className={statusClass[ad.status]}>
              {statusLabel[ad.status]}
            </span>
            {ad.priority === 'urgent' && (
              <span className="priority-badge">Срочно</span>
            )}
            <span>{ad.category}</span>
            <span>
              Создано: {new Date(ad.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="detail-price">{ad.price} ₽</div>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="section">
            <h2 className="section-title">Галерея</h2>
            {ad.images && ad.images.length > 0 ? (
              <div className="gallery">
                {ad.images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`${ad.title} ${index + 1}`}
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.visibility =
                        'hidden'
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="gallery-empty">Изображения отсутствуют</div>
            )}
          </section>

          <section className="section">
            <h2 className="section-title">Описание</h2>
            <p>{ad.description}</p>
          </section>

          <section className="section">
            <h2 className="section-title">Характеристики</h2>
            {ad.characteristics && Object.keys(ad.characteristics).length ? (
              <table className="characteristics-table">
                <tbody>
                  {Object.entries(ad.characteristics).map(([key, value]) => (
                    <tr key={key}>
                      <th>{key}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>Характеристики не указаны</div>
            )}
          </section>
        </div>

        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">Продавец</div>
            <div className="sidebar-row">
              <span className="sidebar-label">Имя</span>
              <span className="sidebar-value">{ad.seller.name}</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-label">Рейтинг</span>
              <span className="sidebar-value">{ad.seller.rating}</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-label">Объявлений</span>
              <span className="sidebar-value">{ad.seller.totalAds}</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-label">На сайте с</span>
              <span className="sidebar-value">
                {new Date(ad.seller.registeredAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">История модерации</div>
            {ad.moderationHistory.length === 0 ? (
              <div>Действий пока не было</div>
            ) : (
              <ul className="history-list">
                {ad.moderationHistory.map((item) => (
                  <li key={item.id} className="history-item">
                    <div>
                      <strong>{actionLabel[item.action]}</strong>{' '}
                      {item.reason && `· ${item.reason}`}
                    </div>
                    {item.comment && (
                      <div className="history-comment">{item.comment}</div>
                    )}
                    <div className="history-meta">
                      Модератор: {item.moderatorName} ·{' '}
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">Действия модератора</div>
            <div className="actions-buttons">
              <button
                className="btn btn-approve"
                onClick={handleApprove}
                disabled={actionLoading}
              >
                Одобрить
              </button>
              <button
                className="btn btn-reject"
                onClick={() => openModal('reject')}
                disabled={actionLoading}
              >
                Отклонить
              </button>
              <button
                className="btn btn-changes"
                onClick={() => openModal('requestChanges')}
                disabled={actionLoading}
              >
                На доработку
              </button>
            </div>

            {actionMessage && (
              <div className="action-message">{actionMessage}</div>
            )}
            {actionError && (
              <div className="action-error">{actionError}</div>
            )}
          </div>
        </aside>
      </div>

      {modalType && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <div className="modal-title">
              {modalType === 'reject'
                ? 'Отклонить объявление'
                : 'Отправить на доработку'}
            </div>

            <div className="modal-field">
              <label className="modal-label">Причина</label>
              <select
                className="modal-select"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value as ModerationReason)
                }
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">
                Комментарий (необязательно)
              </label>
              <textarea
                className="modal-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={closeModal}
                disabled={actionLoading}
              >
                Отмена
              </button>
              <button
                className={
                  'btn ' +
                  (modalType === 'reject' ? 'btn-reject' : 'btn-changes')
                }
                onClick={handleSubmitModal}
                disabled={actionLoading}
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdDetailPage
