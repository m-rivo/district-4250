import { DataTablePagination } from '#/components/ui/data-table/data-table-pagination'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { ComboboxMultiple } from '#/components/ComboboxMultiple'
import { DataTable } from '#/components/ui/data-table/data-table'
import { columns } from '#/components/table-columns/club-columns.tsx'
import { FunnelXIcon } from 'lucide-react'
import type { SetStateAction, Dispatch } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPaginatedClubsList } from '#/functions/club.functions'

import type { Country } from '#/types/country'
import ErrorCard from '../ErrorCard'

interface ClubsListTableProps {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  perPage: number
  setPerPage: Dispatch<SetStateAction<number>>
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  countries: Country[]
  setCountries: Dispatch<SetStateAction<Country[]>>
  debouncedSearch: string
  canFilterCountries?: boolean
  clubIds?: string[]
}

export default function ClubsListTable({
  page,
  setPage,
  perPage,
  setPerPage,
  search,
  setSearch,
  countries,
  setCountries,
  debouncedSearch,
  canFilterCountries = true,
  clubIds,
}: ClubsListTableProps) {
  const handlePerPageChange = (value: number) => {
    setPerPage(value)
    setPage(1)
  }

  const handleClearFilters = () => {
    setPage(1)
    setPerPage(10)
    setSearch('')
    setCountries([])
  }

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['clubs', { page, perPage, search: debouncedSearch, countries }],
    queryFn: () =>
      getPaginatedClubsList({
        data: {
          page,
          perPage,
          search: debouncedSearch,
          countries,
          clubIds,
        },
      }),
  })

  if (isError) {
    return <ErrorCard title="Error loading clubs" message={error.message} />
  }

  return (
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
        {canFilterCountries && (
          <div className="flex-1">
            <ComboboxMultiple
              data={[
                { id: 'Honduras', name: 'Honduras' },
                { id: 'Guatemala', name: 'Guatemala' },
                { id: 'Belize', name: 'Belize' },
              ]}
              value={countries}
              setValue={(value) => {
                setCountries(value as Country[])
                setPage(1)
              }}
              placeholder="Countries"
            />
          </div>
        )}
        <div>
          <Button
            variant="secondary"
            onClick={handleClearFilters}
            className="w-full"
          >
            <FunnelXIcon />
            Clear all filters
          </Button>
        </div>
      </div>
      {/* TABLE */}
      <div className="overflow-hidden rounded-md border">
        <DataTable
          columns={columns}
          data={data?.items || []}
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
