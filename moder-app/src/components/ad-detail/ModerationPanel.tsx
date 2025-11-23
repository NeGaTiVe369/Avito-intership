import type { Advertisement, ModerationReason } from '../../types/ad'
import { useState } from 'react'
import { useHotkeys } from '../../hooks/useHotkeys'
import {
    approveAd,
    rejectAd,
    requestChanges,
    type ModerationPayload,
} from '../../api/ads'
import './ModerationPanel.css'

type ModalType = 'reject' | 'requestChanges'

const REASONS: ModerationReason[] = [
    'Запрещенный товар',
    'Неверная категория',
    'Некорректное описание',
    'Проблемы с фото',
    'Подозрение на мошенничество',
    'Другое',
]

interface ModerationPanelProps {
    ad: Advertisement
    onAdUpdate: (ad: Advertisement) => void
}

const ModerationPanel = ({ ad, onAdUpdate }: ModerationPanelProps) => {
    const [modalType, setModalType] = useState<ModalType | null>(null)
    const [reason, setReason] = useState<ModerationReason>('Запрещенный товар')
    const [comment, setComment] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [actionMessage, setActionMessage] = useState<string | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)

    const isPending = ad.status === 'pending'
    const isCommentRequired = reason === 'Другое'
    const isCommentEmpty = comment.trim().length === 0

    const handleApprove = async () => {
        if (!isPending || actionLoading) return

        try {
            setActionLoading(true)
            setActionError(null)
            const updated = await approveAd(ad.id)
            onAdUpdate(updated)
            setActionMessage('Объявление одобрено')
        } catch (e) {
            console.error(e)
            setActionError('Не удалось одобрить объявление')
        } finally {
            setActionLoading(false)
        }
    }

    const openModal = (type: ModalType) => {
        if (!isPending || actionLoading) return

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
        if (!modalType) return

        if (isCommentRequired && isCommentEmpty) {
            setActionError('Для причины «Другое» комментарий обязателен')
            return
        }

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

            onAdUpdate(updated)
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

    useHotkeys(
        {
            a: (event) => {
                event.preventDefault()
                handleApprove()
            },
            A: (event) => {
                event.preventDefault()
                handleApprove()
            },
            d: (event) => {
                event.preventDefault()
                openModal('reject')
            },
            D: (event) => {
                event.preventDefault()
                openModal('reject')
            },
        },
        {
            enabled: isPending && !actionLoading && modalType === null,
            ignoreInputElements: true,
        },
    )

    return (
        <>
            <section className="detail-section actions-section">
                <div className="actions-buttons">
                    <button
                        className="btn-action btn-action-approve"
                        onClick={handleApprove}
                        disabled={!isPending || actionLoading}
                    >
                        Одобрить
                    </button>
                    <button
                        className="btn-action btn-action-reject"
                        onClick={() => openModal('reject')}
                        disabled={!isPending || actionLoading}
                    >
                        Отклонить
                    </button>
                    <button
                        className="btn-action btn-action-changes"
                        onClick={() => openModal('requestChanges')}
                        disabled={!isPending || actionLoading}
                    >
                        Доработка
                    </button>
                </div>

                {actionMessage && (
                    <div className="action-message">{actionMessage}</div>
                )}
                {actionError && <div className="action-error">{actionError}</div>}
                {!isPending && (
                    <p className="actions-note">
                        Объявление уже промодерировано. Повторная модерация недоступна.
                    </p>
                )}
            </section>

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
                                onChange={(e) =>{
                                    setReason(e.target.value as ModerationReason)
                                    setActionError(null)
                                }}
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
                                Комментарий {isCommentRequired ? '(обязательно)' : '(необязательно)'}
                            </label>
                            <textarea
                                className="modal-textarea"
                                value={comment}
                                onChange={(e) => {
                                    setComment(e.target.value) 
                                    setActionError(null)
                                }}
                                placeholder="Добавьте подробный комментарий…"
                            />
                        </div>
                        {actionError && (
                            <div className="modal-error">{actionError}</div>
                        )}

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
                                    (modalType === 'reject'
                                        ? 'btn-reject'
                                        : 'btn-changes')
                                }
                                onClick={handleSubmitModal}
                                disabled={actionLoading || (isCommentRequired && isCommentEmpty)}
                            >
                                Отправить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ModerationPanel
