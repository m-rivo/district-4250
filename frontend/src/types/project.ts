import type { Club, ClubListItem } from './club'

export interface Project {
  id: string
  title: string
  description: string
  start_date: string
  cost: number
  clubs: string[]
  evidence: string
  expand?: {
    clubs?: ClubListItem[]
  }
}

export interface ProjectListItem {
  id: string
  title: string
  start_date: string

  expand?: {
    clubs?: Club[]
  }
}
