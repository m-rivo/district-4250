import ProjectsListTable from '#/components/projects/ProjectsListTable'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_app/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const [clubIds, setClubIds] = useState<string[]>([])

  return (
    <section className="rounded-2xl p-6 sm:p-8">
      <h1 className="mb-3 text-4xl font-bold sm:text-5xl">Projects</h1>
      <ProjectsListTable
        clubIds={clubIds}
        onClubIdsChange={setClubIds}
        canFilterClubs
      />
    </section>
  )
}
