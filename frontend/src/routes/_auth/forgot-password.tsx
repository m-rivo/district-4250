import { createFileRoute, Link } from '@tanstack/react-router'
import { Button, buttonVariants } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import { useState } from 'react'
import { ArrowLeftIcon, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { sendResetEmail } from '#/functions/auth/auth.functions'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setHasError(false)

    try {
      setIsLoading(true)
      await sendResetEmail({ data: { email } })
      setSuccess(true)
    } catch (error: any) {
      console.error('Unable to send reset link:', error?.response || error)
      toast.error('Error', {
        description: 'Unable to send reset link.',
      })
      setHasError(true)
      setSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return success ? (
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 className="size-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Check your email
          </h2>
          <p className="text-sm text-muted-foreground">
            If an account exists with that email, you will receive a password
            reset link shortly.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setSuccess(false)
            setEmail('')
          }}
        >
          Try another email
        </Button>
      </CardContent>
    </Card>
  ) : (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Forgot you password?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldDescription>
                Please enter the email you use to sign in.
              </FieldDescription>
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
          </FieldGroup>

          <Button className="mt-6 w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner data-icon="inline-start" />
                Sending link
              </>
            ) : (
              'Send reset link'
            )}
          </Button>

          <Link
            to="/login"
            className={buttonVariants({
              variant: 'link',
              className: 'inline-flex items-center gap-2',
            })}
          >
            <ArrowLeftIcon />
            Back to login
          </Link>
        </form>
      </CardContent>
    </Card>
  )
}
