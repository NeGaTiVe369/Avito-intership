import { useState } from 'react'
import type { StatsPeriod } from '../types/stats'
import StatsSummary from '../components/StatsSummary'
import ActivityChart from '../components/ActivityChart'
import { DecisionsPieChart } from '../components/DecisionsPieChart'
import CategoriesBarChart from '../components/CategoriesBarChart'
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
