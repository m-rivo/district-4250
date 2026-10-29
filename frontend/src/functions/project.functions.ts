import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { ListResult } from 'pocketbase'
import { paginationSchema } from '#/lib/schemas/pagination'
import type { ProjectListItem } from '#/types/project'
import z from 'zod'

export const projectsListSchema = paginationSchema.extend({
  search: z.string().default(''),
  clubIds: z.array(z.string()).default([]),
  startDateFrom: z.string().default(''),
  startDateTo: z.string().default(''),
})

export const getPaginatedProjectsList = createServerFn({ method: 'GET' })
  .validator(projectsListSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()
    const { page, perPage, search, clubIds, startDateFrom, startDateTo } = data

    const conditions: string[] = []
    const params: Record<string, string> = {}

    // Name
    const searchTerms = search.trim().split(/\s+/).filter(Boolean)

    searchTerms.forEach((term, index) => {
      const key = `search${index}`

      conditions.push(`name ~ {:${key}}`)
      params[key] = term
    })

    // Clubs
    if (clubIds.length > 0) {
      const clubConditions = clubIds.map((id, index) => {
        const key = `club${index}`
        params[key] = id
        return `clubs ~ {:${key}}`
      })

      conditions.push(`(${clubConditions.join(' || ')})`)
    }

    // Date range
    if (startDateFrom) {
      conditions.push('start_date >= {:startDateFrom}')
      params.startDateFrom = startDateFrom
    }

    if (startDateTo) {
      conditions.push('start_date <= {:startDateTo}')
      params.startDateTo = startDateTo
    }

    const filter =
      conditions.length > 0 ? pb.filter(conditions.join(' && '), params) : ''

    const resultList: ListResult<ProjectListItem> = await pb
      .collection('projects')
      .getList(page, perPage, {
        fields: 'id,name,start_date,expand.clubs.id,expand.clubs.name',
        expand: 'clubs',
        filter,
      })

    return resultList
  })
