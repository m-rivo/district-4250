import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { ClubListItem, ClubProfile } from '#/types/club'
import type { ListResult } from 'pocketbase'
import { paginationSchema } from '#/lib/schemas/pagination.schema'
import z from 'zod'

const COLLECTION = 'clubs'

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
      .collection(COLLECTION)
      .getList(page, perPage, { fields: 'id,name,country', filter })

    return resultList
  })

export const getOneClub = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string().min(1, 'Club ID is required.') }))
  .handler(async ({ data }) => {
    const { id } = data

    const pb = createServerPocketBase()

    const club: ClubProfile = await pb.collection(COLLECTION).getOne(id, {
      fields:
        'id,club_id,name,country,region,location,instagram,tiktok,foundation_date,logo,description,status,facebook,sponsor_club,x_twitter',
    })

    console.log(club)

    return {
      ...club,
      logo: club.logo
        ? `${pb.baseURL}/api/files/clubs/${club.id}/${encodeURIComponent(club.logo)}?thumb=300x300`
        : null,
    }
  })
