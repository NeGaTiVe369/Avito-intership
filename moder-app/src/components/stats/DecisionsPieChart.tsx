import type { DecisionsDataType } from '../../types/stats'
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './DecisionsPieChart.css'

interface DecisionsPieChartProps {
  data: DecisionsDataType | null
  loading: boolean
}

const COLORS = {
  approved: '#00d662',
  rejected: '#ff4153',
  requestChanges: '#8d5ee2',
}

export const DecisionsPieChart = ({
  data,
  loading,
}: DecisionsPieChartProps) => {
  if (loading) {
    return (
      <div className="stats-card">
        <div className="loader">
          <div className="loader-bar">
            <div className="loader-bar-fill" />
          </div>
          <div className="loader-text">Загрузка…</div>
        </div>
      </div>
    )
  }

  if (
    !data ||
    (data.approved === 0 &&
      data.rejected === 0 &&
      data.requestChanges === 0)
  ) {
    return (
      <div className="stats-card">
        <div className="stats-card-body stats-card-body--centered">
          Пока нет данных для отображения
        </div>
      </div>
    )
  }

  const chartData = [
    {
      name: 'Одобрено',
      key: 'approved',
      value: data.approved,
      color: COLORS.approved,
    },
    {
      name: 'Отклонено',
      key: 'rejected',
      value: data.rejected,
      color: COLORS.rejected,
    },
    {
      name: 'На доработку',
      key: 'requestChanges',
      value: data.requestChanges,
      color: COLORS.requestChanges,
    },
  ]

  const renderLabel = (props: any) => {
    const { percent, name } = props
    return `${name} — ${(percent * 100).toFixed(1)}%`
  }

  return (
    <div className="stats-card">
      <div className="stats-card-body">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Legend />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={45}
              paddingAngle={3}
              labelLine={false}
              label={renderLabel}
            >
              {chartData.map((item) => (
                <Cell key={item.key} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
