import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { RoleListItem } from '#/types/role'

export const getRoleList = createServerFn({ method: 'GET' }).handler(
  async () => {
    const pb = createServerPocketBase()

    const roleList: RoleListItem[] = await pb
      .collection('roles')
      .getFullList({ fields: 'id,name' })

    return roleList
  },
)
