import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { ClubForExport, ClubListItem, ClubProfile } from '#/types/club'
import type { ListResult } from 'pocketbase'
import z from 'zod'
import {
  ClubsListSchema,
  UpdateClubSchema,
  CreateClubSchema,
  ClubsFiltersSchema,
} from '#/lib/schemas/club.schemas'

const COLLECTION = 'clubs'

function buildClubsFilter({
  pb,
  search,
  countries,
  clubIds,
}: {
  pb: ReturnType<typeof createServerPocketBase>
  search: string
  countries: string[]
  clubIds: string[]
}) {
  const conditions: string[] = []
  const params: Record<string, string> = {}

  // Names
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

  // Club Ids
  if (clubIds.length > 0) {
    const clubConditions = clubIds.map((clubId, index) => {
      const key = `club${index}`
      params[key] = clubId

      return `id = {:${key}}`
    })

    conditions.push(`(${clubConditions.join(' || ')})`)
  }

  return conditions.length > 0 ? pb.filter(conditions.join(' && '), params) : ''
}

export const getFullClubsList = createServerFn({ method: 'GET' }).handler(
  async () => {
    const pb = createServerPocketBase()

    const clubList: ClubListItem[] = await pb
      .collection(COLLECTION)
      .getFullList({ fields: 'id,name,country' })

    return clubList
  },
)

export const getPaginatedClubsList = createServerFn({ method: 'GET' })
  .validator(ClubsListSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()
    const { page, perPage, search, countries, clubIds } = data

    const filter = buildClubsFilter({ pb, search, countries, clubIds })

    const resultList: ListResult<ClubListItem> = await pb
      .collection(COLLECTION)
      .getList(page, perPage, { fields: 'id,name,country', filter })

    return resultList
  })

export const getClubsForExport = createServerFn({
  method: 'GET',
})
  .validator(ClubsFiltersSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    const filter = buildClubsFilter({
      pb,
      ...data,
    })

    const clubs: ClubForExport[] = await pb.collection(COLLECTION).getFullList({
      filter,
      fields: 'club_id,name,country',
      sort: 'country',
    })

    return clubs.map((club) => ({
      club_id: club.club_id,
      name: club.name,
      country: club.country,
    }))
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

    return {
      ...club,
      logo: club.logo
        ? `${pb.baseURL}/api/files/clubs/${club.id}/${encodeURIComponent(club.logo)}?thumb=300x300`
        : null,
    }
  })

export const updateClub = createServerFn({ method: 'POST' })
  .validator(UpdateClubSchema)
  .handler(async ({ data }) => {
    const {
      id,
      club_id,
      name,
      country,
      region,
      location,
      instagram,
      tiktok,
      foundation_date,
      description,
      status,
      facebook,
      sponsor_club,
      x_twitter,
    } = data

    const pb = createServerPocketBase()

    const result = await pb.collection(COLLECTION).update(id, {
      club_id,
      name,
      country,
      region,
      location,
      instagram,
      tiktok,
      foundation_date,
      description,
      status,
      facebook,
      sponsor_club,
      x_twitter,
    })

    return result
  })

export async function uploadLogo(id: string, file: File) {
  const formData = new FormData()

  formData.append('id', id)
  formData.append('logo', file)

  const response = await fetch('/clubs/logo', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error ?? 'Upload failed')
  }

  return result
}

export const createClub = createServerFn({ method: 'POST' })
  .validator(CreateClubSchema)
  .handler(async ({ data }) => {
    const {
      club_id,
      name,
      country,
      region,
      location,
      instagram,
      tiktok,
      foundation_date,
      description,
      status,
      facebook,
      sponsor_club,
      x_twitter,
    } = data

    const pb = createServerPocketBase()

    const result = await pb.collection(COLLECTION).create({
      club_id,
      name,
      country,
      region,
      location,
      instagram,
      tiktok,
      foundation_date,
      description,
      status,
      facebook,
      sponsor_club,
      x_twitter,
    })

    return result
  })
