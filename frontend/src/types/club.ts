export type Country = 'Honduras' | 'Belize' | 'Guatemala'

export interface Club {
  id: string
  name: string
}

export interface ClubListItem {
  id: string
  name: string
  country: Country
}

export interface ClubProfile {
  id: string
  club_id: string
  name: string
  country: Country
  region: string
  location?: string
  instagram: string
  tiktok: string
  x_twitter: string
  facebook: string
  foundation_date: string
  status: 'active' | 'inactive'
  description: string
  logo: string
  sponsor_club: string
}
