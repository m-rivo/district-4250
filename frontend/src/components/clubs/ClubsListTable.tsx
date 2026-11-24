import { DataTablePagination } from '#/components/ui/data-table/data-table-pagination'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { ComboboxMultiple } from '#/components/ComboboxMultiple'
import { DataTable } from '#/components/ui/data-table/data-table'
import { columns } from '#/components/table-columns/club-columns.tsx'
import { FileSpreadsheetIcon, FunnelXIcon } from 'lucide-react'
import type { SetStateAction, Dispatch } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getClubsForExport,
  getPaginatedClubsList,
} from '#/functions/club.functions'
import type { Country } from '#/types/country'
import ErrorCard from '../ErrorCard'
import { exportToExcel } from '#/lib/exports/excel'
import { toast } from 'sonner'

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

  const handleExport = async () => {
    const clubs = await getClubsForExport({
      data: {
        search,
        clubIds,
        countries,
      },
    })

    if (!clubs.length) {
      toast.info('No clubs found to export.')
      return
    }

    exportToExcel({
      data: clubs,
      fileName: 'clubs-district-4250',
      sheetName: 'Clubs',
      title: 'Club Directory - District 4250',
      columns: [
        { header: 'Rotary ID', key: 'club_id', width: 25 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Country', key: 'country', width: 25 },
      ],
    })
  }

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
