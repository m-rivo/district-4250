import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/clubs/$clubId')({
  component: ClubPage,
})

function ClubPage() {
  const { clubId } = Route.useParams()
  return <h1>Club ID: {clubId}</h1>
}
