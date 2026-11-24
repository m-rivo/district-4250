import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { ListResult } from 'pocketbase'
import type { Project, ProjectListItem } from '#/types/project'
import {
  CreateProjectSchema,
  ProjectsFiltersSchema,
  ProjectsListSchema,
  UpdateProjectSchema,
} from '#/lib/schemas/project.schemas'
import z from 'zod'
import type { Club } from '#/types/club'
import { parseISO } from 'date-fns'

const COLLECTION = 'projects'

function buildProjectsFilter({
  pb,
  search,
  clubIds,
  startDateFrom,
  startDateTo,
}: {
  pb: ReturnType<typeof createServerPocketBase>
  search: string
  clubIds: string[]
  startDateFrom: string
  startDateTo: string
}) {
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

  return conditions.length > 0 ? pb.filter(conditions.join(' && '), params) : ''
}

export const getPaginatedProjectsList = createServerFn({ method: 'GET' })
  .validator(ProjectsListSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()
    const { page, perPage, search, clubIds, startDateFrom, startDateTo } = data

    const filter = buildProjectsFilter({
      pb,
      search,
      clubIds,
      startDateFrom,
      startDateTo,
    })

    const resultList: ListResult<ProjectListItem> = await pb
      .collection(COLLECTION)
      .getList(page, perPage, {
        fields: 'id,title,start_date,expand.clubs.id,expand.clubs.name',
        expand: 'clubs',
        filter,
      })

    return resultList
  })

export const getProjectsForExport = createServerFn({
  method: 'GET',
})
  .validator(ProjectsFiltersSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    const filter = buildProjectsFilter({
      pb,
      ...data,
    })

    const projects: ProjectListItem[] = await pb
      .collection(COLLECTION)
      .getFullList({
        filter,
        expand: 'clubs',
        fields: 'id,title,start_date,expand.clubs.id,expand.clubs.name',
        sort: 'clubs',
      })

    return projects.map((project) => ({
      title: project.title,
      start_date: parseISO(project.start_date),
      clubs:
        project.expand?.clubs?.map((club: Club) => club.name).join(', ') ?? '',
    }))
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
