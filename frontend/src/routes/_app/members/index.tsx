import { m } from '#/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'
import { getMembersList } from '#/functions/members/members.functions'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '#/components/ui/data-table/data-table'
import { columns } from '#/components/tables/members/columns'
import { useState } from 'react'
import { Input } from '#/components/ui/input'
import { DataTablePagination } from '#/components/ui/data-table/data-table-pagination'
import { useDebounce } from '#/hooks/use-debounce'
import { ComboboxMultiple } from '#/components/ComboboxMultiple'
import { Button } from '#/components/ui/button'
import { SelectIsActive } from '#/components/SelectIsActive'
import { CardContent } from '#/components/ui/card'
import { CircleXIcon } from 'lucide-react'
import { getFullClubsList } from '#/functions/club.functions'
import { ComboboxMultipleGroupedClubs } from '#/components/ComboboxMultipleGroupedClubs'
import { getRoleList } from '#/functions/role.functions'

export const Route = createFileRoute('/_app/members/')({
  component: MembersPage,
})

function MembersPage() {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(10)
  const [search, setSearch] = useState<string>('')
  const [clubIds, setClubIds] = useState<string[]>([])
  const [roleIds, setRoleIds] = useState<string[]>([])
  const [isActive, setIsActive] = useState<boolean | null>(null)

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
    setRoleIds([])
    setIsActive(null)
  }

  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      'members',
      { page, perPage, search: debouncedSearch, clubIds, roleIds, isActive },
    ],
    queryFn: () =>
      getMembersList({
        data: {
          page,
          perPage,
          search: debouncedSearch,
          clubIds,
          roleIds,
          isActive,
        },
      }),
  })

  const { data: clubList = [], isPending: isLoadingClubs } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => getFullClubsList(),
  })

  const { data: roleList = [], isPending: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoleList(),
  })

  if (isError) {
    return (
      <section className="rounded-2xl p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{m.members()}</h1>

        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <CircleXIcon className="size-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Error loading members
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
      <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{m.members()}</h1>

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
          <div className="flex-1">
            <ComboboxMultiple
              data={roleList}
              value={roleIds}
              setValue={setRoleIds}
              placeholder="Roles"
              isLoading={isLoadingRoles}
            />
          </div>
          <div>
            <SelectIsActive
              value={isActive}
              setValue={(value) => {
                setIsActive(value)
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
