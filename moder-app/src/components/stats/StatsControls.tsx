import type { StatsPeriod } from '../../types/stats'
import './StatsControls.css'

interface StatsControlsProps {
  period: StatsPeriod
  onPeriodChange: (value: StatsPeriod) => void
  onExportClick?: () => void
}

const StatsControls = ({ period, onPeriodChange, onExportClick }: StatsControlsProps) => {
  return (
    <div className="stats-header">
      <h1 className="stats-title">Статистика модерации</h1>

      <div className="stats-header-right">
        <div className="period-switcher">
          <button
            className={`period-btn ${period === 'today' ? 'active' : ''}`}
            onClick={() => onPeriodChange('today')}
          >
            Сегодня
          </button>
          <button
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => onPeriodChange('week')}
          >
            7 дней
          </button>
          <button
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => onPeriodChange('month')}
          >
            30 дней
          </button>
        </div>

        {onExportClick && (
          <button className="export-btn" onClick={onExportClick}>
            Экспорт CSV
          </button>
        )}
      </div>
    </div>
  )
}

export default StatsControls
