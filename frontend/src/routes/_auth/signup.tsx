import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
})

function SignupPage() {
  return <h1>Signup</h1>
}
