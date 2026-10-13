import { Button, buttonVariants } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { confirmResetPassword } from '#/features/auth/auth.functions'
import { ArrowLeftIcon } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_auth/confirm-password-reset')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: ConfirmPasswordResetPage,
})

function ConfirmPasswordResetPage() {
  const { token } = Route.useSearch()

  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setHasError(false)

    if (!token) {
      setHasError(true)
      toast.error('Invalid or missing reset link.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setHasError(true)
      toast.error('Passwords do not match.')
      return
    }

    if (!newPassword || !confirmNewPassword) {
      setHasError(true)
      toast.error('Please fill in both password fields.')
      return
    }

    try {
      setIsLoading(true)

      await confirmResetPassword({
        data: {
          token,
          newPassword,
          confirmNewPassword,
        },
      })

      toast.success('Password reset successfully.')

      await navigate({ to: '/login' })
    } catch (error: any) {
      console.error('Error resetting password:', error)

      setHasError(true)
      toast.error('Unable to reset password', {
        description:
          'The reset link may be invalid or expired. Request a new one and try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Reset your password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newPassword">
                New password <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                aria-invalid={hasError}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmNewPassword">
                Confirm new password <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                aria-invalid={hasError}
                required
              />
            </Field>
          </FieldGroup>

          <Button className="mt-6 w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner data-icon="inline-start" />
                Resetting password
              </>
            ) : (
              'Reset password'
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
