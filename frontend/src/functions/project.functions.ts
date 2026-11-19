import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { ListResult } from 'pocketbase'
import type { Project, ProjectListItem } from '#/types/project'
import {
  CreateProjectSchema,
  ProjectsListSchema,
  UpdateProjectSchema,
} from '#/lib/schemas/project.schemas'
import z from 'zod'

const COLLECTION = 'projects'

export const getPaginatedProjectsList = createServerFn({ method: 'GET' })
  .validator(ProjectsListSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()
    const { page, perPage, search, clubIds, startDateFrom, startDateTo } = data

    const conditions: string[] = []
    const params: Record<string, string> = {}

    // Title
    const searchTerms = search.trim().split(/\s+/).filter(Boolean)

    searchTerms.forEach((term, index) => {
      const key = `search${index}`

      conditions.push(`title ~ {:${key}}`)
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
        fields: 'id,title,start_date,expand.clubs.id,expand.clubs.name',
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
        'id,title,description,start_date,cost,evidence,expand.clubs.id,expand.clubs.name,expand.clubs.country,clubs',
      expand: 'clubs',
    })

    return project
  })

export const createProject = createServerFn({ method: 'POST' })
  .validator(CreateProjectSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    const result = await pb.collection(COLLECTION).create(data)

    return result
  })

export const updateProject = createServerFn({ method: 'POST' })
  .validator(UpdateProjectSchema)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data

    const pb = createServerPocketBase()

    const result = await pb.collection(COLLECTION).update(id, updateData)

    return result
  })
