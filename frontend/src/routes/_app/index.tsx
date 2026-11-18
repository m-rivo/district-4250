import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { getCurrentUser } from '#/functions/auth/auth.functions'
import { m } from '#/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  loader: () => getCurrentUser(),
  component: Homepage,
})

function Homepage() {
  const user = Route.useLoaderData()

  return (
    <Card className="rise-in text-5xl font-bold border-primary">
      <CardHeader>
        <CardTitle>{m.welcome() + ' ' + user?.name || 'User'}!</CardTitle>
        <CardDescription>Welcome to your District 4250 App!</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  )
}
