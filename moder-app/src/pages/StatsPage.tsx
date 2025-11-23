import { useState } from 'react'
import type { StatsPeriod } from '../types/stats'
import StatsSummary from '../components/stats/StatsSummary'
import ActivityChart from '../components/stats/ActivityChart'
import { DecisionsPieChart } from '../components/stats/DecisionsPieChart'
import CategoriesBarChart from '../components/stats/CategoriesBarChart'
import StatsControls from '../components/stats/StatsControls'
import { useStats } from '../hooks/useStats'
import { buildStatsCsv } from '../utils/buildStatsCsv'
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
  if (
    !summary &&
    activity.length === 0 &&
    !decisions &&
    !categories
  ) {
    alert('Нет данных для экспорта')
    return
  }

  const csvContent = buildStatsCsv({
    period,
    summary,
    activity,
    decisions,
    categories,
  })

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `moderation-stats-${period}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}


  const categoriesEntries = categories
    ? Object.entries(categories).sort((a, b) => b[1] - a[1])
    : []


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

       <section className="stats-section">
        <h2 className="stats-section-title">Активность по дням</h2>
        <ActivityChart data={activity} loading={loading} />
      </section>

      <section className="stats-section">
        <h2 className="stats-section-title">Распределение решений</h2>
        <DecisionsPieChart data={decisions} loading={loading} />
      </section>

     <section className="stats-section">
        <h2 className="stats-section-title">Распределение по категориям</h2>

        {categoriesEntries.length === 0 ? (
          <div>Нет данных</div>
        ) : (
          <CategoriesBarChart
            data={categoriesEntries.map(([name, value]) => ({
              name,
              value,
            }))}
          />
        )}
      </section>
    </div>
  )
}

export default StatsPage
