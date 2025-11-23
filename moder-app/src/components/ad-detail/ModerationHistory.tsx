import { FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi"
import type { ModerationHistoryItem } from "../../types/ad"
import "./ModerationHistory.css"

const actionLabel: Record<ModerationHistoryItem["action"], string> = {
  approved: "Одобрено",
  rejected: "Отклонено",
  requestChanges: "Запрос на доработку",
}

const statusConfig = {
  approved: {
    color: "#00d662",
    icon: FiCheckCircle,
  },
  rejected: {
    color: "#ff4153",
    icon: FiXCircle,
  },
  requestChanges: {
    color: "#8d5ee2",
    icon: FiAlertCircle,
  },
}

interface ModerationHistoryProps {
  history: ModerationHistoryItem[]
}

const ModerationHistory = ({ history }: ModerationHistoryProps) => {
  return (
      <div className="sidebar-card">
        <div className="sidebar-title">История модерации</div>
        {history.length === 0 ? (
          <div className="empty-text">Действий пока не было</div>
        ) : (
          <ul className="history-list">
            {history.map((item) => {
              const config = statusConfig[item.action]
              const IconComponent = config.icon

              return (
                <li key={item.id} className="history-item" style={{ borderLeftColor: config.color }}>
                  <div className="history-header">
                    <IconComponent size={20} color={config.color} style={{ marginRight: "8px", flexShrink: 0 }} />
                    <div className="history-action" style={{ color: config.color }}>
                      {actionLabel[item.action]}
                    </div>
                  </div>
                  {item.reason && <div className="history-reason">Причина: {item.reason}</div>}
                  {item.comment && (
                    <div className="history-comment">
                      КОММЕНТАРИЙ МОДЕРАТОРА:
                      <br />
                      {item.comment}
                    </div>
                  )}
                  <div className="history-meta">
                    <div>Модератор: {item.moderatorName}</div>
                    <div>{new Date(item.timestamp).toLocaleString("ru-RU")}</div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
  )
}

export default ModerationHistory