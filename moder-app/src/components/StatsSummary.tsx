import type { StatsSummaryType } from '../types/stats'
import './StatsSummary.css'

interface StatsSummaryProps {
  summary: StatsSummaryType
  round: (value: number) => number
}

const StatsSummary = ({ summary, round }: StatsSummaryProps) => {
  const items = [
    {
      key: 'totalReviewed',
      label: 'Всего проверено',
      value: summary.totalReviewed,
    },
    {
      key: 'today',
      label: 'Сегодня',
      value: summary.totalReviewedToday,
    },
    {
      key: 'week',
      label: 'За неделю',
      value: summary.totalReviewedThisWeek,
    },
    {
      key: 'month',
      label: 'За месяц',
      value: summary.totalReviewedThisMonth,
    },
    {
      key: 'approvedPercentage',
      label: 'Одобрено',
      value: `${round(summary.approvedPercentage)}%`,
    },
    {
      key: 'rejectedPercentage',
      label: 'Отклонено',
      value: `${round(summary.rejectedPercentage)}%`,
    },
    {
      key: 'requestChangesPercentage',
      label: 'На доработку',
      value: `${round(summary.requestChangesPercentage)}%`,
    },
    {
      key: 'avgTime',
      label: 'Среднее время, сек',
      value: summary.averageReviewTime,
    },
  ]

  return (
    <div className="stats-grid">
      {items.map((item) => (
        <div key={item.key} className="stat-card">
          <div className="stat-label">{item.label}</div>
          <div className="stat-value">{item.value}</div>
        </div>
      ))}
    </div>
  )
}

export default StatsSummary
