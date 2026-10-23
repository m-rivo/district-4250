import { createServerFn } from '@tanstack/react-start'
import { createServerPocketBase } from '#/lib/pocketbase/server'
import type { MemberListItem } from '#/types/member'
import type { ListResult } from 'pocketbase'
import { paginationSchema } from '#/lib/schemas/pagination'

// TODO: add filters
export const getMembersList = createServerFn({ method: 'GET' })
  .validator(paginationSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    let resultList: ListResult<MemberListItem>

    resultList = await pb
      .collection('members')
      .getList(data.page, data.perPage, {
        fields:
          'id,first_name,first_surname,is_active,profile_picture,expand.club.id,expand.club.name,expand.roles.id,expand.roles.name',
        expand: 'club,roles',
      })

    resultList = {
      ...resultList,
      items: resultList.items.map((member) => ({
        ...member,
        profile_picture_url: member.profile_picture
          ? `${pb.baseURL}/api/files/members/${member.id}/${encodeURIComponent(member.profile_picture)}`
          : null,
      })),
    }

    return resultList
  })
