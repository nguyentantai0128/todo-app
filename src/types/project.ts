import { Issue } from './issue'

export enum ProjectCategory {
  SOFTWARE = 'software'
}

export interface Project {
  id: number
  name: string
  description: string | null
  category: ProjectCategory
  createdAt: Date
  updatedAt: Date
  issues: Issue[]
}

export const ProjectCategoryCopy = {
  [ProjectCategory.SOFTWARE]: 'Software'
}

export default Project
