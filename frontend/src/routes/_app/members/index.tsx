import { m } from '#/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'
import { getMembersList } from '#/functions/members/members.functions'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '#/components/ui/skeleton'
import { DataTable } from '#/components/ui/data-table/data-table'
import { columns } from '#/components/tables/members/columns'

// TODO: add filters

export const Route = createFileRoute('/_app/members/')({
  component: MembersPage,
})

function MembersPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['members', { page: 1, perPage: 10 }],
    queryFn: () =>
      getMembersList({
        data: { page: 1, perPage: 10 },
      }),
  })

  if (isPending) {
    return (
      <section className="rounded-2xl p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{m.members()}</h1>
        <Skeleton className="h-5 w-25" />
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-2xl p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{m.members()}</h1>
        <p role="alert">Error loading members: {error.message}</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl p-6 sm:p-8">
      <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{m.members()}</h1>

      <DataTable columns={columns} data={data.items} />
    </section>
  )
}
