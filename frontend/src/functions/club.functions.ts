import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { ClubListItem } from '#/types/club'
import type { ListResult } from 'pocketbase'
import { paginationSchema } from '#/lib/schemas/pagination'
import z from 'zod'

export const getFullClubsList = createServerFn({ method: 'GET' }).handler(
  async () => {
    const pb = createServerPocketBase()

    const clubList: ClubListItem[] = await pb
      .collection('clubs')
      .getFullList({ fields: 'id,name,country' })

    return clubList
  },
)

export const clubsListSchema = paginationSchema.extend({
  search: z.string().default(''),
  countries: z.array(z.string()).default([]),
})

export const getPaginatedClubsList = createServerFn({ method: 'GET' })
  .validator(clubsListSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()
    const { page, perPage, search, countries } = data

    const conditions: string[] = []
    const params: Record<string, string> = {}

    // Name
    const searchTerms = search.trim().split(/\s+/).filter(Boolean)

    searchTerms.forEach((term, index) => {
      const key = `search${index}`

      conditions.push(`name ~ {:${key}}`)
      params[key] = term
    })

    // Countries
    if (countries.length > 0) {
      const countryConditions = countries.map((country, index) => {
        const key = `country${index}`
        params[key] = country

        return `country = {:${key}}`
      })

      conditions.push(`(${countryConditions.join(' || ')})`)
    }

    const filter =
      conditions.length > 0 ? pb.filter(conditions.join(' && '), params) : ''

    const resultList: ListResult<ClubListItem> = await pb
      .collection('clubs')
      .getList(page, perPage, { fields: 'id,name,country', filter })

    return resultList
  })
