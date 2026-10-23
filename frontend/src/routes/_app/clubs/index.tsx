import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/clubs/')({
  component: ClubsPage,
})

function ClubsPage() {
  return <h1>Clubs List</h1>
}
