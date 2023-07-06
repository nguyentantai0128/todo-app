import Color from 'color'
import { IssuePriority, IssueStatus } from '@/types/issue'

export const tuneColor = {
  darken: (colorValue: string, amount: number) =>
    Color(colorValue)
      .darken(amount)
      .string(),
  lighten: (colorValue: string, amount: number) =>
    Color(colorValue)
      .lighten(amount)
      .string()
}

export const buttonVariants = {
  primary: '#0052cc',
  success: '#0B875B',
  danger: '#E13C3C',
  warning: '#F89C1C',
  info: '#0fb9b1',
  secondary: '#F4F5F7',
  default: '#1E2122',
  brand: '#42B884',
  dancer: '#F05B5C'
}

export const issueStatusVariants = {
  [IssueStatus.BACKLOG]: 'secondary',
  [IssueStatus.DONE]: 'success',
  [IssueStatus.SELECTED]: 'secondary',
  [IssueStatus.INPROGRESS]: 'primary'
}

export const issuePriorityColors = {
  [IssuePriority.HIGH]: '#E9494A',
  [IssuePriority.MEDIUM]: '#E97F33',
  [IssuePriority.LOW]: '#2D8738',
}
