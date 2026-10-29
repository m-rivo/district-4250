import type { Club } from './club'

export interface Project {
  id: string
  name: string
  description: string
  clubs: Club[]
  start_date: string
  cost: number
}

export interface ProjectListItem {
  id: string
  name: string
  start_date: string

  expand?: {
    clubs?: Club[]
  }
}
