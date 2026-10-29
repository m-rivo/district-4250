import { createColumnHelper } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import type { ClubListItem } from '#/types/club'
import type { features } from '../ui/data-table/data-table-features'

const columnHelper = createColumnHelper<typeof features, ClubListItem>()

export const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ row }) => {
      const club = row.original

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
  }),

  columnHelper.accessor('country', {
    header: 'Country',
    cell: ({ getValue }) => getValue(),
  }),
]
