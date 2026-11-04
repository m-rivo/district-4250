import type { Role } from './role'
import type { Club } from './club'

export type MembershipStatus =
  'guest' | 'prospect' | 'active' | 'on_leave' | 'honorary' | 'inactive'

export interface Member {
  id: string
  collectionId: string
  collectionName: 'members'

  user: string
  first_name: string
  last_name: string

  club: string
  roles: string[]
  membership_status: MembershipStatus

  birth_date: string
  profile_picture: string
  member_since: string

  created: string
  updated: string
}

export interface MemberListItem extends Pick<
  Member,
  'id' | 'first_name' | 'last_name' | 'membership_status' | 'profile_picture'
> {
  expand?: {
    club?: Club
    roles?: Role[]
  }
  profile_picture_url?: string | null
}

export interface MemberProfile extends Pick<
  Member,
  | 'id'
  | 'first_name'
  | 'last_name'
  | 'membership_status'
  | 'birth_date'
  | 'member_since'
> {
  profile_picture?: string | null
  profession: string
  biography: string
  expand?: {
    club?: Club
    roles?: Role[]
  }
}
