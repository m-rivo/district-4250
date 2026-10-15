import { Button, buttonVariants } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { login } from '#/features/auth/auth.functions'
import { toast } from 'sonner'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setHasError(false)

    try {
      setIsLoading(true)
      const result = await login({ data: { email, password } })
      console.log(result)
      await navigate({ to: '/' })
    } catch (error: any) {
      toast.error('Unable to sign in', {
        description: 'Please check your credentials and try again.',
      })
      console.error('Login error:', error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Login to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={hasError}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={hasError}
                required
              />
            </Field>
          </FieldGroup>

          <Button className="mt-6 w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner data-icon="inline-start" />
                Logging in
              </>
            ) : (
              'Login'
            )}
          </Button>

          <Link
            to="/signup"
            className={buttonVariants({
              variant: 'link',
              className: 'inline-flex items-center gap-2',
            })}
          >
            Don&apos;t have an account? Signup
          </Link>
          <Link
            to="/forgot-password"
            className={buttonVariants({
              variant: 'link',
              className: 'inline-flex items-center gap-2',
            })}
          >
            Forgot password?
          </Link>
        </form>
      </CardContent>
    </Card>
  )
}
