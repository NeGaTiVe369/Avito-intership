import type { ActivityPointType } from '../types/stats'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import './ActivityChart.css'


interface ActivityChartProps {
  data: ActivityPointType[]
  loading: boolean
}

const ActivityChart = ({ data, loading }: ActivityChartProps) => {
  // Подготовка данных
  const preparedData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    }),
    approved: point.approved,
    rejected: point.rejected,
    requestChanges: point.requestChanges,
  }))

  return (
    <div className="activity-chart">
      {loading ? (
        <div style={{ padding: '12px' }}>Загрузка графика…</div>
      ) : !data.length ? (
        <div style={{ padding: '12px' }}>
          Нет данных для выбранного периода
        </div>
      ) : (
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={preparedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'approved') return [value, 'Одобрено']
                if (name === 'rejected') return [value, 'Отклонено']
                if (name === 'requestChanges')
                  return [value, 'На доработку']
                return [value, name]
              }}
              labelFormatter={(label) => `Дата: ${label}`}
            />
            <Legend
              formatter={(value) => {
                if (value === 'approved') return 'Одобрено'
                if (value === 'rejected') return 'Отклонено'
                if (value === 'requestChanges') return 'На доработку'
                return value
              }}
            />
            <Bar
              dataKey="approved"
              fill="#00d662"
              name="approved"
              barSize={60}
            />
            <Bar
              dataKey="rejected"
              fill="#ff4153"
              name="rejected"
              barSize={60}
            />
            <Bar
              dataKey="requestChanges"
              fill="#8d5ee2"
              name="requestChanges"
              barSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default ActivityChart
