import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { MemberListItem } from '#/types/member'
import type { ListResult } from 'pocketbase'
import { paginationSchema } from '#/lib/schemas/pagination'
import { z } from 'zod'

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

    console.log(filterExpression)

    const resultList: ListResult<MemberListItem> = await pb
      .collection('members')
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
