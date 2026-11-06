import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { MemberListItem, MemberProfile } from '#/types/member'
import type { ListResult } from 'pocketbase'
import { z } from 'zod'
import {
  UpdateMemberSchema,
  MembersListSchema,
} from '#/lib/schemas/member.schemas'

const COLLECTION = 'members'

export const getMembersList = createServerFn({ method: 'GET' })
  .validator(MembersListSchema)
  .handler(async ({ data }) => {
    const { page, perPage, search, clubIds, roleIds, membership_status } = data

    const pb = createServerPocketBase()

    const conditions: string[] = []
    const params: Record<string, string> = {}

    // Names
    const searchTerms = search.trim().split(/\s+/).filter(Boolean)

    searchTerms.forEach((term, index) => {
      const key = `search${index}`

      conditions.push(`(first_name ~ {:${key}} || last_name ~ {:${key}})`)

      params[key] = term
    })

    // Clubs
    if (clubIds.length > 0) {
      const clubConditions = clubIds.map((id, index) => {
        const key = `club${index}`
        params[key] = id
        return `club = {:${key}}`
      })

      conditions.push(`(${clubConditions.join(' || ')})`)
    }

    // Roles
    if (roleIds.length > 0) {
      const roleConditions = roleIds.map((id, index) => {
        const key = `role${index}`
        params[key] = id
        return `roles ~ {:${key}}`
      })

      conditions.push(`(${roleConditions.join(' || ')})`)
    }

    // Membership status
    if (membership_status !== null) {
      conditions.push(`membership_status = '${membership_status}'`)
    }

    const filterExpression = conditions.join(' && ')

    const resultList: ListResult<MemberListItem> = await pb
      .collection(COLLECTION)
      .getList(page, perPage, {
        fields:
          'id,first_name,last_name,membership_status,profile_picture,roles,expand.club.id,expand.club.name,expand.roles.id,expand.roles.name',
        expand: 'club,roles',
        ...(filterExpression
          ? { filter: pb.filter(filterExpression, params) }
          : {}),
      })

    return {
      ...resultList,
      items: resultList.items.map((member) => ({
        ...member,
        profile_picture_url: member.profile_picture
          ? `${pb.baseURL}/api/files/members/${member.id}/${encodeURIComponent(member.profile_picture)}?thumb=100x100`
          : null,
      })),
    }
  })

export const getOneMember = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      id: z.string().min(1, 'Member ID is required'),
    }),
  )
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    const { id } = data

    const member: MemberProfile = await pb.collection(COLLECTION).getOne(id, {
      fields:
        'id,first_name,last_name,profile_picture,expand.club.id,expand.club.name,expand.roles.id,expand.roles.name,birth_date,member_since,membership_status,profession,biography',
      expand: 'club,roles',
    })

    return {
      ...member,
      profile_picture: member.profile_picture
        ? `${pb.baseURL}/api/files/members/${member.id}/${encodeURIComponent(member.profile_picture)}?thumb=300x300`
        : null,
    }
  })

export const updateMember = createServerFn({ method: 'POST' })
  .validator(UpdateMemberSchema)
  .handler(async ({ data }) => {
    const { id, first_name, last_name, birth_date, profession, biography } =
      data

    const pb = createServerPocketBase()

    const result = await pb.collection(COLLECTION).update(id, {
      first_name,
      last_name,
      birth_date,
      profession,
      biography,
    })

    return result
  })

export async function uploadProfilePicture(id: string, file: File) {
  const formData = new FormData()

  formData.append('id', id)
  formData.append('profile_picture', file)

  const response = await fetch('/members/profile-picture', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error ?? 'Upload failed')
  }

  return result
}
