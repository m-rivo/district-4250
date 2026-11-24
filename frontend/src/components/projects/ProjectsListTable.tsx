import { getFullClubsList } from '#/functions/club.functions'
import {
  getPaginatedProjectsList,
  getProjectsForExport,
} from '#/functions/project.functions'
import { useDebounce } from '#/hooks/use-debounce'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import type { Dispatch, SetStateAction } from 'react'
import type { DateRange } from 'react-day-picker'
import { Input } from '../ui/input'
import { ComboboxMultipleGroupedClubs } from '../ComboboxMultipleGroupedClubs'
import { DatePickerWithRange } from '../DatePickerWithRange'
import { Button } from '../ui/button'
import { DataTable } from '../ui/data-table/data-table'
import { columns } from '../table-columns/project-columns'
import { DataTablePagination } from '../ui/data-table/data-table-pagination'
import ErrorCard from '../ErrorCard'
import { FileSpreadsheetIcon, FunnelXIcon } from 'lucide-react'
import { exportToExcel } from '#/lib/exports/excel'
import { toast } from 'sonner'

interface ProjectsListTableProps {
  clubIds: string[]
  onClubIdsChange: (ids: string[]) => void
  canFilterClubs?: boolean
  page: number
  setPage: Dispatch<SetStateAction<number>>
  perPage: number
  setPerPage: Dispatch<SetStateAction<number>>
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  dateRange: DateRange | undefined
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>
}

export default function ProjectsListTable({
  clubIds,
  onClubIdsChange,
  canFilterClubs = true,
  page,
  setPage,
  perPage,
  setPerPage,
  search,
  setSearch,
  dateRange,
  setDateRange,
}: ProjectsListTableProps) {
  const startDateFrom = dateRange?.from
    ? format(dateRange.from, 'yyyy-MM-dd')
    : ''

  const startDateTo = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

  const debouncedSearch = useDebounce(search, 300)

  const handlePerPageChange = (value: number) => {
    setPerPage(value)
    setPage(1)
  }

  const handleClubIdsChange = (ids: string[]) => {
    onClubIdsChange(ids)
    setPage(1)
  }

  const handleClearFilters = () => {
    setPage(1)
    setPerPage(10)
    setSearch('')
    setDateRange(undefined)

    if (canFilterClubs) {
      onClubIdsChange([])
    }
  }

  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      'projects',
      {
        page,
        perPage,
        search: debouncedSearch,
        clubIds,
        startDateTo,
        startDateFrom,
      },
    ],
    queryFn: () =>
      getPaginatedProjectsList({
        data: {
          page,
          perPage,
          search: debouncedSearch,
          clubIds,
          startDateTo,
          startDateFrom,
        },
      }),
  })

  const { data: clubList = [], isPending: isLoadingClubs } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => getFullClubsList(),
  })

  const handleExport = async () => {
    const projects = await getProjectsForExport({
      data: {
        search,
        clubIds,
        startDateFrom,
        startDateTo,
      },
    })

    if (!projects.length) {
      toast.info('No projects found to export.')
      return
    }

    exportToExcel({
      data: projects,
      fileName: 'projects-district-4250',
      sheetName: 'Projects',
      title: 'Project Directory - District 4250',
      columns: [
        { header: 'Title', key: 'title', width: 25 },
        { header: 'Start Date', key: 'start_date', width: 25 },
        { header: 'Clubs', key: 'clubs', width: 25 },
      ],
    })
  }

  if (isError) {
    return <ErrorCard title="Error loading projects" message={error.message} />
  }

  return (
    <div>
      {/* FILTERS */}
      <div className="flex items-center py-4 gap-2 flex-wrap">
        <div className="flex-1">
          <Input
            placeholder="Search by title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="max-w-sm"
          />
        </div>
        {canFilterClubs && (
          <div className="flex-1">
            <ComboboxMultipleGroupedClubs
              data={clubList}
              value={clubIds}
              setValue={handleClubIdsChange}
              isLoading={isLoadingClubs}
            />
          </div>
        )}
        <div>
          <DatePickerWithRange
            value={dateRange}
            onChange={(range) => {
              setDateRange(range)
              setPage(1)
            }}
          />
        </div>
        <div>
          <Button
            variant="secondary"
            onClick={handleClearFilters}
            className="w-full"
          >
            <FunnelXIcon /> Clear filters
          </Button>
        </div>
        <div>
          <Button variant="success" onClick={handleExport}>
            <FileSpreadsheetIcon className="size-4" />
            Export Excel
          </Button>
        </div>
      </div>
      {/* TABLE */}
      <div className="overflow-hidden rounded-md border">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isPending}
        />
      </div>
      {/* PAGINATION */}
      <DataTablePagination
        page={page}
        perPage={perPage}
        totalPages={data?.totalPages ?? 0}
        totalItems={data?.totalItems ?? 0}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
      />
    </div>
  )
}
