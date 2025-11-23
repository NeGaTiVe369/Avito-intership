export type StatsPeriod = 'today' | 'week' | 'month'

export interface StatsSummaryType {
  totalReviewed: number
  totalReviewedToday: number
  totalReviewedThisWeek: number
  totalReviewedThisMonth: number
  approvedPercentage: number
  rejectedPercentage: number
  requestChangesPercentage: number
  averageReviewTime: number
}

export interface ActivityPointType {
  date: string
  approved: number
  rejected: number
  requestChanges: number
}

export interface DecisionsDataType {
  approved: number
  rejected: number
  requestChanges: number
}

export type CategoriesDataType = Record<string, number>
