import type { Country } from './country'
import type { Region } from './region'

export type ClubStatus = 'active' | 'inactive'

export interface Club {
  id: string
  name: string
}

export interface ClubListItem {
  id: string
  name: string
  country: Country
}

export interface ClubForExport {
  club_id: string
  name: string
  country: Country
}

export interface ClubProfile {
  id: string
  club_id: string
  name: string
  country: Country
  region: Region
  location: string
  instagram: string
  tiktok: string
  x_twitter: string
  facebook: string
  foundation_date: string
  status: ClubStatus
  description: string
  logo?: string | null
  sponsor_club: string
}
