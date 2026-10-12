import Footer from '#/components/Footer'
import Header from '#/components/Header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
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
