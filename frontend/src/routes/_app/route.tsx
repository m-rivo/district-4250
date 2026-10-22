import Footer from '#/components/Footer'
import Header from '#/components/Header'
import { getCurrentUser } from '#/functions/auth/auth.functions'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    const user = await getCurrentUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    return { user }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <>
      <Header />
      <main className="page-wrap px-4 pb-8 pt-14">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
