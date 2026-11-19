import ProjectFormDialog from '#/components/projects/ProjectFormDialog'
import ProjectsListTable from '#/components/projects/ProjectsListTable'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

export const Route = createFileRoute('/_app/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const [clubIds, setClubIds] = useState<string[]>([])
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(10)
  const [search, setSearch] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  return (
    <section className="rounded-2xl p-6 sm:p-8">
      <h1 className="mb-3 text-4xl font-bold sm:text-5xl">Projects</h1>
      <ProjectFormDialog
        page={page}
        perPage={perPage}
        search={search}
        clubIds={clubIds}
        dateRange={dateRange}
      />
      <ProjectsListTable
        clubIds={clubIds}
        onClubIdsChange={setClubIds}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        search={search}
        setSearch={setSearch}
        dateRange={dateRange}
        setDateRange={setDateRange}
        canFilterClubs
      />
    </section>
  )
}
