import { buttonVariants } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Spinner } from '#/components/ui/spinner'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeftIcon, CheckCircle2, CircleXIcon } from 'lucide-react'
import { toast } from 'sonner'
import { verifyEmail } from '#/features/auth/auth.functions'

export const Route = createFileRoute('/_auth/verify-email')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const { token } = Route.useSearch()

  const [status, setStatus] = useState<'loading' | 'error' | 'success'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false

    async function verify() {
      if (!token.trim()) {
        setStatus('error')
        return
      }

      setStatus('loading')

      try {
        await verifyEmail({ data: { token } })

        if (!cancelled) {
          setStatus('success')
        }
      } catch (error) {
        console.error('Error verifying email:', error)

        if (!cancelled) {
          setStatus('error')
          toast.error('Unable to verify email', {
            description:
              'The verification link may be invalid, expired, or already used.',
          })
        }
      }
    }

    void verify()

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <Card className="w-full max-w-sm">
      {status === 'loading' ? (
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full ">
            <Spinner data-icon="inline-start" className="size-9" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Verifying</h2>
        </CardContent>
      ) : status === 'error' ? (
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <CircleXIcon className="size-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Unable to verify email
            </h2>
            <p className="text-sm text-muted-foreground">
              The verification link may be invalid or expired.
            </p>
          </div>

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
        </CardContent>
      ) : (
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="size-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Verified email
            </h2>
            <p className="text-sm text-muted-foreground">You can now log in.</p>
          </div>

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
        </CardContent>
      )}
    </Card>
  )
}
