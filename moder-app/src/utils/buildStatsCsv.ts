import type {
  StatsPeriod,
  StatsSummaryType,
  ActivityPointType,
  DecisionsDataType,
  CategoriesDataType,
} from '../types/stats'

interface BuildStatsCsvArgs {
  period: StatsPeriod
  summary: StatsSummaryType | null
  activity: ActivityPointType[]
  decisions: DecisionsDataType | null
  categories: CategoriesDataType | null
}

const SEP = ','

// делаем значения под CSV
const escapeValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return ''
  const str = String(value)

  // Если есть кавычки, запятые или переносы строки — оборачиваем в ""
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }

  return str
}

export const buildStatsCsv = ({
  period,
  summary,
  activity,
  decisions,
  categories,
}: BuildStatsCsvArgs): string => {
  const rows: string[] = []

  rows.push(`Период${SEP}${escapeValue(period)}`)
  rows.push('')

  rows.push('Общая статистика')
  rows.push(['Метрика', 'значение'].join(SEP))

  if (summary) {
    rows.push(
      ['Всего проверено', summary.totalReviewed].map(escapeValue).join(SEP),
    )
    rows.push(
      ['Всего проверено за сегодня', summary.totalReviewedToday]
        .map(escapeValue)
        .join(SEP),
    )
    rows.push(
      ['Всего проверено за неделю', summary.totalReviewedThisWeek]
        .map(escapeValue)
        .join(SEP),
    )
    rows.push(
      ['Всего проверено за месяц', summary.totalReviewedThisMonth]
        .map(escapeValue)
        .join(SEP),
    )
    rows.push(
      ['Одобрено', summary.approvedPercentage]
        .map(escapeValue)
        .join(SEP),
    )
    rows.push(
      ['Отклонено', summary.rejectedPercentage]
        .map(escapeValue)
        .join(SEP),
    )
    rows.push(
      ['На доработку', summary.requestChangesPercentage]
        .map(escapeValue)
        .join(SEP),
    )
    rows.push(
      ['Среднее время, сек', summary.averageReviewTime]
        .map(escapeValue)
        .join(SEP),
    )
  }

  rows.push('')

  rows.push('Активность по дням')
  rows.push(['Дата', 'Одобрено', 'Отклонено', 'На доработку'].join(SEP))

  activity.forEach((point) => {
    rows.push(
      [
        point.date,
        point.approved,
        point.rejected,
        point.requestChanges,
      ].map(escapeValue).join(SEP),
    )
  })

  rows.push('')

  rows.push('Распределение решений')
  rows.push(['Тип', 'значение'].join(SEP))

  if (decisions) {
    rows.push(['Одобрено', decisions.approved].map(escapeValue).join(SEP))
    rows.push(['Отклонено', decisions.rejected].map(escapeValue).join(SEP))
    rows.push(
      ['На доработку', decisions.requestChanges]
        .map(escapeValue)
        .join(SEP),
    )
  }

  rows.push('')

  rows.push('Распределение по категориям')
  rows.push(['Категория', 'количество'].join(SEP))

  if (categories) {
    Object.entries(categories).forEach(([name, value]) => {
      rows.push([name, value].map(escapeValue).join(SEP))
    })
  }

  // '\uFEFF' нужно для распознования кириллицы
  const csvContent = '\uFEFF' + rows.join('\n')
  return csvContent
}
