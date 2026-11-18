import { createFileRoute } from '@tanstack/react-router'
import ClubFormDialog from '#/components/clubs/ClubFormDialog'
import ClubsListTable from '#/components/clubs/ClubsListTable'
import { useDebounce } from '#/hooks/use-debounce'
import { useState } from 'react'
import type { Country } from '#/types/country'

export const Route = createFileRoute('/_app/clubs/')({
  component: ClubsPage,
})

function ClubsPage() {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(10)
  const [search, setSearch] = useState<string>('')
  const [countries, setCountries] = useState<Country[]>([])

  const debouncedSearch = useDebounce(search, 300)

  return (
    <section className="rounded-2xl p-6 sm:p-8">
      <h1 className="mb-3 text-4xl font-bold sm:text-5xl">Clubs</h1>
      <ClubFormDialog
        page={page}
        perPage={perPage}
        search={debouncedSearch}
        countries={countries}
      />
      <ClubsListTable
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        search={search}
        setSearch={setSearch}
        countries={countries}
        setCountries={setCountries}
        debouncedSearch={debouncedSearch}
      />
    </section>
  )
}
