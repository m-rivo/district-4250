import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { ClubListItem } from '#/types/club'

export const getClubsList = createServerFn({ method: 'GET' }).handler(
  async () => {
    const pb = createServerPocketBase()

    const clubList: ClubListItem[] = await pb
      .collection('clubs')
      .getFullList({ fields: 'id,name,country' })

    return clubList
  },
)
