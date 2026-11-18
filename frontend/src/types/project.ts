import type { Club, ClubListItem } from './club'

export interface Project {
  id: string
  name: string
  description: string
  start_date: string
  cost: number
  clubs: string[]
  expand?: {
    clubs?: ClubListItem[]
  }
}

export interface ProjectListItem {
  id: string
  name: string
  start_date: string

  expand?: {
    clubs?: Club[]
  }
}
