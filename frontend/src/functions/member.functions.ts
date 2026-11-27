import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { MemberListItem, MemberProfile } from '#/types/member'
import type { ListResult } from 'pocketbase'
import { z } from 'zod'
import {
  UpdateMemberSchema,
  MembersListSchema,
  MembersFiltersSchema,
  AddMemberToClubSchema,
} from '#/lib/schemas/member.schemas'
import { getRequestHeader } from '@tanstack/react-start/server'
import type { Role } from '#/types/role'
import { getMyPermissions } from './role.functions'

const COLLECTION = 'members'

function buildMembersFilter({
  pb,
  search,
  clubIds,
  roleIds,
  membership_status,
}: {
  pb: ReturnType<typeof createServerPocketBase>
  search: string
  clubIds: string[]
  roleIds: string[]
  membership_status: string | null
}) {
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

  return conditions.length > 0 ? pb.filter(conditions.join(' && '), params) : ''
}

export const getPaginatedMembersList = createServerFn({ method: 'GET' })
  .validator(MembersListSchema)
  .handler(async ({ data }) => {
    const { page, perPage, search, clubIds, roleIds, membership_status } = data

    const pb = createServerPocketBase()

    const filter = buildMembersFilter({
      pb,
      search,
      clubIds,
      roleIds,
      membership_status,
    })

    const resultList: ListResult<MemberListItem> = await pb
      .collection(COLLECTION)
      .getList(page, perPage, {
        filter,
        expand: 'club,roles',
        fields:
          'id,first_name,last_name,membership_status,profile_picture,roles,expand.club.id,expand.club.name,expand.roles.id,expand.roles.name',
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

export const getMembersForExport = createServerFn({
  method: 'GET',
})
  .validator(MembersFiltersSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    const filter = buildMembersFilter({
      pb,
      ...data,
    })

    const members: MemberListItem[] = await pb
      .collection(COLLECTION)
      .getFullList({
        filter,
        expand: 'club,roles',
        fields:
          'id,first_name,last_name,membership_status,expand.club.name,expand.roles.name',
        sort: 'first_name,last_name',
      })

    return members.map((member) => ({
      first_name: member.first_name,
      last_name: member.last_name,
      club: member.expand?.club?.name ?? 'Sin club',
      roles:
        member.expand?.roles?.map((role: Role) => role.name).join(', ') ?? '',
      membership_status: member.membership_status,
    }))
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
        'id,first_name,last_name,profile_picture,club,expand.club.id,expand.club.name,expand.roles.id,expand.roles.name,birth_date,member_since,membership_status,profession,biography',
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

export const getMyProfile = createServerFn({ method: 'GET' }).handler(
  async () => {
    const cookie = getRequestHeader('cookie')

    if (!cookie?.includes('pb_auth=')) {
      throw new Error('Unauthorized')
    }

    const pb = createServerPocketBase()
    pb.authStore.loadFromCookie(cookie)

    if (!pb.authStore.isValid) {
      throw new Error('Unauthorized')
    }

    try {
      const authData = await pb.collection('users').authRefresh()

      const member: MemberProfile = await pb
        .collection(COLLECTION)
        .getFirstListItem(
          pb.filter('user = {:userId}', {
            userId: authData.record.id,
          }),
          {
            expand: 'club,roles',
          },
        )

      return {
        ...member,
        profile_picture: member.profile_picture
          ? `${pb.baseURL}/api/files/members/${member.id}/${encodeURIComponent(member.profile_picture)}`
          : null,
      }
    } catch {
      throw new Error('Unable to retrieve your profile.')
    }
  },
)

export const addMemberToClub = createServerFn({ method: 'POST' })
  .validator(AddMemberToClubSchema)
  .handler(async ({ data }) => {
    const [myProfile, permissions] = await Promise.all([
      getMyProfile(),
      getMyPermissions(),
    ])

    const pb = createServerPocketBase()

    const { memberId, roles, membership_status } = data

    // Validar que el usuario autenticado pertenezca a un club
    if (!myProfile.club) {
      throw new Error('You do not belong to a club.')
    }

    // Verificar permiso
    if (!permissions.includes('club.members.add')) {
      throw new Error('You do not have permission to add members.')
    }

    // Validar que el member no pertenezca ya a un club
    const targetMember = await pb.collection(COLLECTION).getOne(memberId)

    if (targetMember.club) {
      throw new Error('This member already belongs to a club.')
    }

    // Validar que los roles solicitados sean roles de categoría club
    const requestedRoles = await Promise.all(
      roles.map((roleId) => pb.collection('roles').getOne(roleId)),
    )

    const allowedCategories = ['club_board', 'club_director']

    const hasInvalidRoles = requestedRoles.some(
      (role) => !allowedCategories.includes(role.category),
    )

    if (hasInvalidRoles) {
      throw new Error('You cannot assign these roles.')
    }

    // Agregar miembro a club
    return pb.collection(COLLECTION).update(memberId, {
      club: myProfile.club,
      roles,
      membership_status,
    })
  })
