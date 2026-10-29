import { createColumnHelper } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import type { ProjectListItem } from '#/types/project'
import type { features } from '../ui/data-table/data-table-features'
import { format } from 'date-fns'

const columnHelper = createColumnHelper<typeof features, ProjectListItem>()

export const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ row }) => {
      const project = row.original

      return (
        <Link
          to="/projects/$projectId"
          params={{ projectId: project.id }}
          className="text-primary underline-offset-4 hover:underline"
        >
          {project.name}
        </Link>
      )
    },
  }),

  columnHelper.display({
    id: 'clubs',
    header: 'Clubs',
    cell: ({ row }) => {
      const project = row.original
      const clubs = project.expand?.clubs ?? []

      if (clubs.length === 0) return ''

      return (
        <div className="flex gap-1">
          {clubs.map((club) => (
            <Link
              key={club.id}
              to="/clubs/$clubId"
              params={{ clubId: club.id }}
              className="text-primary underline-offset-4 hover:underline"
            >
              {club.name}
            </Link>
          ))}
        </div>
      )
    },
  }),

  columnHelper.accessor('start_date', {
    header: 'Start date',
    cell: ({ row }) => {
      const project = row.original

      return format(project.start_date, 'MMMM d, yyyy')
    },
  }),
]
