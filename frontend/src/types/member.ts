import type { Role } from './role'
import type { Club } from './club'

export interface Member {
  id: string
  collectionId: string
  collectionName: 'members'

  user: string
  first_name: string
  second_name: string
  first_surname: string
  second_surname: string

  club: string
  roles: string[]
  is_active: boolean

  birth_date: string
  profile_picture: string
  member_since: string

  created: string
  updated: string
}

export interface MemberListItem {
  id: string
  first_name: string
  first_surname: string
  is_active: boolean
  profile_picture: string

  expand?: {
    club?: Club
    roles?: Role[]
  }

  profile_picture_url?: string | null
}
