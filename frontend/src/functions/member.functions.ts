import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { MemberListItem, MemberProfile } from '#/types/member'
import type { ListResult } from 'pocketbase'
import { paginationSchema } from '#/lib/schemas/pagination'
import { z } from 'zod'
import { UpdateMemberSchema } from '#/lib/schemas/member.schemas'

// FIXME: add try catch ??

const COLLECTION = 'members'

export const membersListSchema = paginationSchema.extend({
  search: z.string().default(''),
  clubIds: z.array(z.string()).default([]),
  roleIds: z.array(z.string()).default([]),
  isActive: z.boolean().nullable().default(null),
})

export const getMembersList = createServerFn({ method: 'GET' })
  .validator(membersListSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    const conditions: string[] = []
    const params: Record<string, string> = {}

    // Names
    const searchTerms = data.search.trim().split(/\s+/).filter(Boolean)

    searchTerms.forEach((term, index) => {
      const key = `search${index}`

      conditions.push(`(first_name ~ {:${key}} || first_surname ~ {:${key}})`)

      params[key] = term
    })

    // Clubs
    if (data.clubIds.length > 0) {
      const clubConditions = data.clubIds.map((id, index) => {
        const key = `club${index}`
        params[key] = id
        return `club = {:${key}}`
      })

      conditions.push(`(${clubConditions.join(' || ')})`)
    }

    // Roles
    if (data.roleIds.length > 0) {
      const roleConditions = data.roleIds.map((id, index) => {
        const key = `role${index}`
        params[key] = id
        return `roles ~ {:${key}}`
      })

      conditions.push(`(${roleConditions.join(' || ')})`)
    }

    // Active status
    if (data.isActive !== null) {
      conditions.push(`is_active = ${data.isActive}`)
    }

    const filterExpression = conditions.join(' && ')

    const resultList: ListResult<MemberListItem> = await pb
      .collection(COLLECTION)
      .getList(data.page, data.perPage, {
        fields:
          'id,first_name,first_surname,is_active,profile_picture,roles,expand.club.id,expand.club.name,expand.roles.id,expand.roles.name',
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
          ? `${pb.baseURL}/api/files/members/${member.id}/${encodeURIComponent(member.profile_picture)}`
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
        'id,first_name,first_surname,profile_picture,expand.club.id,expand.club.name,expand.roles.id,expand.roles.name,birth_date,member_since,is_active,profession,biography',
      expand: 'club,roles',
    })

    return {
      ...member,
      profile_picture: member.profile_picture
        ? `${pb.baseURL}/api/files/members/${member.id}/${encodeURIComponent(member.profile_picture)}`
        : null,
    }
  })

export const updateMember = createServerFn({ method: 'POST' })
  .validator(UpdateMemberSchema)
  .handler(async ({ data }) => {
    const { id, first_name, first_surname, birth_date, profession, biography } =
      data

    const pb = createServerPocketBase()

    const result = await pb.collection(COLLECTION).update(id, {
      first_name,
      first_surname,
      birth_date,
      profession,
      biography,
    })

    console.log(result)

    return result
  })

/* export const updateProfilePicture = createServerFn({
  method: 'POST',
})
  .validator(
    z.object({
      id: z.string().min(1, 'Member ID is required'),
      profile_picture: z.instanceof(File),
    }),
  )
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    return await pb.collection(COLLECTION).update(data.id, {
      profile_picture: data.profile_picture,
    })
  }) */

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
