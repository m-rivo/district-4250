import MemberProfile from '#/components/members/MemberProfile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/my-profile')({
  component: MyProfilePage,
})

function MyProfilePage() {
  return <MemberProfile />
}
