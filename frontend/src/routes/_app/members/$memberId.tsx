import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/members/$memberId')({
  component: MemberPage,
})

function MemberPage() {
  const { memberId } = Route.useParams()
  return <h1>Member ID: {memberId}</h1>
}
