import { createColumnHelper } from '@tanstack/react-table'
import type { MemberListItem } from '#/types/member'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Link } from '@tanstack/react-router'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import type { features } from '#/components/ui/data-table/data-table-features'

const columnHelper = createColumnHelper<typeof features, MemberListItem>()

export const columns = columnHelper.columns([
  columnHelper.accessor(
    (row: MemberListItem) => `${row.first_name} ${row.last_name}`,
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const member = row.original
        const fullName = `${member.first_name} ${member.last_name}`

        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={member.profile_picture_url ?? undefined}
                alt={fullName}
              />
              <AvatarFallback>
                {member.first_name[0]}
                {member.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <Link
              to="/members/$memberId"
              params={{ memberId: member.id }}
              className="text-primary underline-offset-4 hover:underline"
            >
              {fullName}
            </Link>
          </div>
        )
      },
    },
  ),

  columnHelper.accessor(
    (row: MemberListItem) => row.expand?.club?.name ?? 'No club',
    {
      id: 'club',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Club
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const member = row.original
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

  columnHelper.display({
    id: 'roles',
    header: 'Roles',
    cell: ({ row }) => {
      const member = row.original
      const roles = member.expand?.roles ?? []

      return (
        <div className="flex gap-1">
          {roles.map((role) => (
            <Badge
              key={role.id}
              variant={role.name === 'socio' ? 'purple' : 'sky'}
            >
              {role.name}
            </Badge>
          ))}
        </div>
      )
    },
  }),

  columnHelper.accessor('membership_status', {
    header: 'Status',
    cell: ({ getValue }) => <Badge variant="green">{getValue()}</Badge>,
  }),

  columnHelper.accessor(
    (row: MemberListItem) =>
      `${row.first_name} ${row.last_name} ${row.expand?.club?.name ?? ''}`,
    {
      id: 'search',
      enableHiding: true,
      header: () => null,
      cell: () => null,
      enableSorting: false,
      filterFn: 'includesString',
    },
  ),
])
