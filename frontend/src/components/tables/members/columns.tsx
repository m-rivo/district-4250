import { createColumnHelper } from '@tanstack/react-table'
import type { MemberListItem } from '#/types/member'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Link } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'

// FIXME: cambiar accessors por display

const columnHelper = createColumnHelper<MemberListItem>()

export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => {
      const member = row.original as MemberListItem
      const fullName = `${member.first_name} ${member.first_surname}`.trim()

      return (
        <Avatar>
          <AvatarImage
            src={member.profile_picture_url ?? undefined}
            alt={fullName}
          />
          <AvatarFallback>
            {member.first_name[0]}
            {member.first_surname[0]}
          </AvatarFallback>
        </Avatar>
      )
    },
  }),

  columnHelper.display({
    id: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const member = row.original as MemberListItem
      const fullName = member.first_name + ' ' + member.first_surname

      return (
        <Link
          to="/members/$memberId"
          params={{ memberId: member.id }}
          className="text-primary underline-offset-4 hover:underline"
        >
          {fullName}
        </Link>
      )
    },
  }),

  columnHelper.accessor(
    (row: MemberListItem) => row.expand?.club?.name ?? 'No club',
    {
      id: 'club',
      header: 'Club',
      cell: ({ row }) => {
        const member = row.original as MemberListItem
        const club = member.expand?.club

        if (!club) return 'No club'

        return (
          <Link
            to="/clubs/$clubId"
            params={{ clubId: club.id }}
            className="text-primary underline-offset-4 hover:underline"
          >
            {club.name}
          </Link>
        )
      },
    },
  ),

  columnHelper.accessor(
    (row: MemberListItem) => (
      <div className="flex gap-1">
        {row.expand?.roles?.map((role) =>
          role.name === 'socio' ? (
            <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              {role.name}
            </Badge>
          ) : (
            <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              {role.name}
            </Badge>
          ),
        ) ?? ''}
      </div>
    ),
    {
      id: 'roles',
      header: 'Roles',
      cell: ({ getValue }) => getValue() || 'No roles',
    },
  ),

  columnHelper.accessor('is_active', {
    header: 'Status',
    cell: ({ getValue }) =>
      getValue() ? (
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
          Active
        </Badge>
      ) : (
        <Badge variant="secondary">Inactive</Badge>
      ),
  }),
])
