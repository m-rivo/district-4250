import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { ListResult } from 'pocketbase'
import type { Project, ProjectListItem } from '#/types/project'
import { ProjectsListSchema } from '#/lib/schemas/project.schemas'
import z from 'zod'

const COLLECTION = 'projects'

export const getPaginatedProjectsList = createServerFn({ method: 'GET' })
  .validator(ProjectsListSchema)
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
      .collection(COLLECTION)
      .getList(page, perPage, {
        fields: 'id,name,start_date,expand.clubs.id,expand.clubs.name',
        expand: 'clubs',
        filter,
      })

    return resultList
  })

export const getOneProject = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string().min(1, 'Project ID is required.') }))
  .handler(async ({ data }) => {
    const { id } = data

    const pb = createServerPocketBase()

    const project: Project = await pb.collection(COLLECTION).getOne(id, {
      fields:
        'id,name,description,start_date,cost,expand.clubs.id,expand.clubs.name,expand.clubs.country,clubs',
      expand: 'clubs',
    })

    return project
  })
