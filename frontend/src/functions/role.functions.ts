import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { RoleListItem } from '#/types/role'
import { getMyProfile } from './member.functions'

export const getRoleList = createServerFn({ method: 'GET' }).handler(
  async () => {
    const pb = createServerPocketBase()

    const roleList: RoleListItem[] = await pb
      .collection('roles')
      .getFullList({ fields: 'id,name,category' })

    return roleList
  },
)

export const getClubRoles = createServerFn({ method: 'GET' }).handler(
  async () => {
    const pb = createServerPocketBase()

    const list: RoleListItem[] = await pb.collection('roles').getFullList({
      fields: 'id,name,category',
      filter: pb.filter('category = {:board} || category = {:director}', {
        board: 'club_board',
        director: 'club_director',
      }),
      sort: 'name',
    })

    return list
  },
)

export const getMyPermissions = createServerFn({ method: 'GET' }).handler(
  async () => {
    const profile = await getMyProfile()

    if (!profile.expand?.roles?.length) {
      return []
    }

    const pb = createServerPocketBase()

    const roles = await Promise.all(
      profile.expand.roles.map((role) =>
        pb.collection('roles').getOne(role.id, {
          expand: 'permissions',
          fields: 'id,expand.permissions.slug',
        }),
      ),
    )

    const permissions = roles.flatMap((role) => role.expand?.permissions ?? [])

    return [...new Set(permissions.map((permission) => permission.slug))]
  },
)

export async function hasPermission(permissionSlug: string): Promise<boolean> {
  const permissions = await getMyPermissions()

  return permissions.includes(permissionSlug)
}
