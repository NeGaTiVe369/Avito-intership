import { useState } from 'react'
import type { StatsPeriod } from '../types/stats'
import StatsSummary from '../components/StatsSummary'
import StatsControls from '../components/StatsControls'
import { useStats } from '../hooks/useStats'
import './StatsPage.css'


const StatsPage = () => {
  const [period, setPeriod] = useState<StatsPeriod>('today')

  const {
    summary,
    activity,
    decisions,
    categories,
    loading,
    error,
  } = useStats(period)

  const handlePeriodChange = (value: StatsPeriod) => {
    setPeriod(value)
  }

  const handleExport = () => {
    console.log('Export stats clicked')
  }


  const round = (n: number) => Math.round(n * 10) / 10

  return (
    <div className="stats-page">
      <StatsControls
        period={period}
        onPeriodChange={handlePeriodChange}
        onExportClick={handleExport}
      />

      {error && <div className="stats-error">{error}</div>}
      {loading && <div className="stats-loader">Загрузка…</div>}

      {summary && <StatsSummary summary={summary} round={round} />}

    </div>
  )
}

export default StatsPage
