export enum IssueType {
  TASK = 'task',
  BUG = 'bug',
  STORY = 'story'
}

export enum IssueStatus {
  BACKLOG = 'backlog',
  SELECTED = 'selected',
  INPROGRESS = 'inprogress',
  DONE = 'done'
}

export enum IssuePriority {
  HIGH = '3',
  MEDIUM = '2',
  LOW = '1',
}

export interface Issue {
  id: string
  title: string
  type: IssueType
  status: IssueStatus
  priority: IssuePriority
  listPosition: number
  description: string | null
  createdAt: Date
  updatedAt: Date | null
}

export const IssueStatusCopy = {
  [IssueStatus.BACKLOG]: 'Backlog',
  [IssueStatus.SELECTED]: 'Selected for development',
  [IssueStatus.INPROGRESS]: 'In progress',
  [IssueStatus.DONE]: 'Done'
}

export const IssuePriorityCopy = {
  [IssuePriority.HIGH]: 'High',
  [IssuePriority.MEDIUM]: 'Medium',
  [IssuePriority.LOW]: 'Low',
}

export const IssueTypeCopy = {
  [IssueType.TASK]: 'Task',
  [IssueType.BUG]: 'Bug',
  [IssueType.STORY]: 'Story'
}

export default Issue
