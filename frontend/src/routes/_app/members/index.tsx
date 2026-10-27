import { m } from '#/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'
import { getMembersList } from '#/functions/members/members.functions'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '#/components/ui/data-table/data-table'
import { columns } from '#/components/tables/members/columns'
import { SkeletonTable } from '#/components/SkeletonTable'
import { useState } from 'react'
import { Input } from '#/components/ui/input'
import { DataTablePagination } from '#/components/ui/data-table/data-table-pagination'
import { useDebounce } from '#/hooks/use-debounce'
import { ComboboxMultiple } from '#/components/ComboboxMultiple'
import { Button } from '#/components/ui/button'
import { SelectIsActive } from '#/components/SelectIsActive'

// TODO: add sort

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
  const clubList = [
    { id: 'xkuqfciyyn3e2kf', name: 'Merendón' },
    { id: 'p0dxg2fvdvr7f8a', name: 'Usula' },
  ]
  const roleList = [
    { id: 'bu2rgb7tk0kxe5q', name: 'RDR' },
    { id: 'c4t0of8ip1c3yvb', name: 'Presidente' },
    { id: 'uzmoo4qyokzqaa3', name: 'Socio' },
  ]

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

  if (isPending) {
    return (
      <section className="rounded-2xl p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{m.members()}</h1>
        <SkeletonTable />
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-2xl p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{m.members()}</h1>
        <p role="alert" className="text-destructive">
          Error loading members: {error.message}
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl p-6 sm:p-8">
      <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{m.members()}</h1>

      <div>
        <div className="flex items-center py-4 gap-2">
          <Input
            placeholder="Search by name ..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="max-w-sm"
          />
          <ComboboxMultiple
            data={clubList}
            value={clubIds}
            setValue={setClubIds}
            placeholder="Clubs"
          />
          <ComboboxMultiple
            data={roleList}
            value={roleIds}
            setValue={setRoleIds}
            placeholder="Roles"
          />
          <SelectIsActive
            value={isActive}
            setValue={(value) => {
              setIsActive(value)
              setPage(1)
            }}
          />
          <Button variant="outline" onClick={handleClearFilters}>
            Clear all filters
          </Button>
        </div>
        <div className="overflow-hidden rounded-md border">
          <DataTable columns={columns} data={data.items} />
        </div>
        <DataTablePagination
          page={page}
          perPage={perPage}
          totalPages={data.totalPages}
          onPageChange={setPage}
          onPerPageChange={handlePerPageChange}
        />
      </div>
    </section>
  )
}
