import { getFullClubsList } from '#/functions/club.functions'
import { getMembersList } from '#/functions/member.functions'
import { getRoleList } from '#/functions/role.functions'
import { useDebounce } from '#/hooks/use-debounce'
import type { MembershipStatus } from '#/types/member'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { CardContent } from '../ui/card'
import { CircleXIcon } from 'lucide-react'
import { DataTablePagination } from '../ui/data-table/data-table-pagination'
import { DataTable } from '../ui/data-table/data-table'
import { columns } from '../table-columns/member-columns'
import { Button } from '../ui/button'
import { SelectMembershipStatus } from '../SelectMembershipStatus'
import { ComboboxMultiple } from '../ComboboxMultiple'
import { ComboboxMultipleGroupedClubs } from '../ComboboxMultipleGroupedClubs'
import { Input } from '../ui/input'

interface MembersListTableProps {
  clubIds: string[]
  onClubIdsChange: (ids: string[]) => void
  canFilterClubs?: boolean
}

export default function MembersListTable({
  clubIds,
  onClubIdsChange,
  canFilterClubs = true,
}: MembersListTableProps) {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(10)
  const [search, setSearch] = useState<string>('')
  const [roleIds, setRoleIds] = useState<string[]>([])
  const [status, setStatus] = useState<MembershipStatus | null>(null)

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
    setRoleIds([])
    setStatus(null)

    if (canFilterClubs) {
      onClubIdsChange([])
    }
  }

  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      'members',
      {
        page,
        perPage,
        search: debouncedSearch,
        clubIds,
        roleIds,
        membership_status: status,
      },
    ],
    queryFn: () =>
      getMembersList({
        data: {
          page,
          perPage,
          search: debouncedSearch,
          clubIds,
          roleIds,
          membership_status: status,
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
    )
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
          <SelectMembershipStatus
            value={status}
            setValue={(value) => {
              setStatus(value)
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
  )
}
