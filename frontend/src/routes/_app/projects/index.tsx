import { Button } from '#/components/ui/button'
import { CardContent } from '#/components/ui/card'
import { DataTable } from '#/components/ui/data-table/data-table'
import { DataTablePagination } from '#/components/ui/data-table/data-table-pagination'
import { Input } from '#/components/ui/input'
import { useDebounce } from '#/hooks/use-debounce'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CircleXIcon } from 'lucide-react'
import { useState } from 'react'
import { columns } from '#/components/table-columns/project-columns.tsx'
import { getPaginatedProjectsList } from '#/functions/project.functions'
import { ComboboxMultipleGroupedClubs } from '#/components/ComboboxMultipleGroupedClubs'
import { getFullClubsList } from '#/functions/club.functions'
import { DatePickerWithRange } from '#/components/DatePickerWithRange'
import type { DateRange } from 'react-day-picker'
import { format } from 'date-fns/format'

export const Route = createFileRoute('/_app/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(10)
  const [search, setSearch] = useState<string>('')
  const [clubIds, setClubIds] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const startDateFrom = dateRange?.from
    ? format(dateRange.from, 'yyyy-MM-dd')
    : ''

  const startDateTo = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

  const debouncedSearch = useDebounce(search, 300)

  const handlePerPageChange = (value: number) => {
    setPerPage(value)
    setPage(1)
  }

  const handleClearFilters = () => {
    setPage(1)
    setPerPage(10)
    setSearch('')
    setClubIds([])
    setDateRange(undefined)
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

  if (isError) {
    return (
      <section className="rounded-2xl p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold sm:text-5xl">Projects</h1>

        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <CircleXIcon className="size-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Error loading projects
            </h2>
            <p role="alert" className="text-sm text-muted-foreground">
              {error.message}
            </p>
          </div>
        </CardContent>
      </section>
    )
  }

  return (
    <section className="rounded-2xl p-6 sm:p-8">
      <h1 className="mb-3 text-4xl font-bold sm:text-5xl">Projects</h1>
      <div>
        {/* FILTERS */}
        <div className="flex items-center py-4 gap-2 flex-wrap">
          <div className="flex-1">
            <Input
              placeholder="Search by name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="max-w-sm"
            />
          </div>
          <div className="flex-1">
            <ComboboxMultipleGroupedClubs
              data={clubList}
              value={clubIds}
              setValue={setClubIds}
              isLoading={isLoadingClubs}
            />
          </div>
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
              variant="outline"
              onClick={handleClearFilters}
              className="w-full"
            >
              Clear all filters
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
    </section>
  )
}
