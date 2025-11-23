import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import './DecisionsPieChart.css';

interface CategoriesBarChartProps {
  data: { name: string; value: number }[]
}

const CategoriesBarChart = ({ data }: CategoriesBarChartProps) => {
  const prepared = [...data].sort((a, b) => b.value - a.value)

  return (
    <div className="stats-card">
      <div className="stats-card-body">
        <ResponsiveContainer width="100%" height={Math.max(200, prepared.length * 36)}>
          <BarChart
            data={prepared}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 60, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              interval={0}
            />
            <Tooltip
              formatter={(value) => [`${value}`, 'Количество объявлений']}
              labelFormatter={(label) => `Категория: ${label}`}
            />
            <Bar
              dataKey="value"
              fill="#049ffe"
              barSize={20}
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CategoriesBarChart
