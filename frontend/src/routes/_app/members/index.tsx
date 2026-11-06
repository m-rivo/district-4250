import { m } from '#/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import MembersListTable from '#/components/members/MembersListTable'

export const Route = createFileRoute('/_app/members/')({
  component: MembersPage,
})

function MembersPage() {
  const [clubIds, setClubIds] = useState<string[]>([])

  return (
    <section className="rounded-2xl p-6 sm:p-8">
      <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{m.members()}</h1>

      <MembersListTable
        clubIds={clubIds}
        onClubIdsChange={setClubIds}
        canFilterClubs
      />
    </section>
  )
}
