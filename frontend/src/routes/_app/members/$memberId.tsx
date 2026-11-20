import { createFileRoute } from '@tanstack/react-router'
import MemberProfile from '#/components/members/MemberProfile'

export const Route = createFileRoute('/_app/members/$memberId')({
  component: MemberPage,
})

function MemberPage() {
  const { memberId } = Route.useParams()
  return <MemberProfile memberId={memberId} />
}
