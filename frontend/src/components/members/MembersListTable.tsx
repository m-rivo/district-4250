import { getFullClubsList } from '#/functions/club.functions'
import {
  getMembersForExport,
  getPaginatedMembersList,
} from '#/functions/member.functions'
import { getRoleList } from '#/functions/role.functions'
import { useDebounce } from '#/hooks/use-debounce'
import type { MembershipStatus } from '#/types/member'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FunnelXIcon, FileSpreadsheet } from 'lucide-react'
import { DataTablePagination } from '../ui/data-table/data-table-pagination'
import { DataTable } from '../ui/data-table/data-table'
import { columns } from '../table-columns/member-columns'
import { Button } from '../ui/button'
import { SelectMembershipStatus } from './SelectMembershipStatus'
import { ComboboxMultiple } from '../ComboboxMultiple'
import { ComboboxMultipleGroupedClubs } from '../ComboboxMultipleGroupedClubs'
import { Input } from '../ui/input'
import ErrorCard from '../ErrorCard'
import { exportToExcel } from '#/lib/exports/excel'
import { toast } from 'sonner'

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
      getPaginatedMembersList({
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

  const handleExport = async () => {
    const members = await getMembersForExport({
      data: {
        search,
        clubIds,
        roleIds,
        membership_status: status,
      },
    })

    if (!members.length) {
      toast.info('No members found to export.')
      return
    }

    exportToExcel({
      data: members,
      fileName: 'members-district-4250',
      sheetName: 'Members',
      title: 'Member Directory - District 4250',
      columns: [
        { header: 'First Name', key: 'first_name', width: 25 },
        { header: 'Last Name', key: 'last_name', width: 25 },
        { header: 'Club', key: 'club', width: 25 },
        { header: 'Roles', key: 'roles', width: 30 },
        { header: 'Membership Status', key: 'membership_status', width: 22 },
      ],
    })
  }

  if (isError) {
    return <ErrorCard title="Error loading members" message={error.message} />
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
            variant="secondary"
            onClick={handleClearFilters}
            className="w-full"
          >
            <FunnelXIcon /> Clear filters
          </Button>
        </div>
        <div>
          <Button variant="default" onClick={handleExport}>
            <FileSpreadsheet className="size-4" />
            Exportar Excel
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
