import { getCurrentUser } from '#/features/auth/auth.functions'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const user = await getCurrentUser()

    if (user) {
      throw redirect({ to: '/' })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <main className="h-screen flex justify-center items-center">
      <Outlet />
    </main>
  )
}
