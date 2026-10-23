import { m } from '#/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return <h1>{m.my_profile()}</h1>
}
