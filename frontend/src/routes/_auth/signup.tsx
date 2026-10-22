import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { SignupFormSchema } from '#/features/auth/auth.schemas'
import type { SignupValues } from '#/features/auth/auth.schemas'
import { toast } from 'sonner'

import { Button, buttonVariants } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import { signup } from '#/features/auth/auth.functions'
import { useState } from 'react'
import { ArrowLeftIcon, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
})

function SignupPage() {
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
    } satisfies SignupValues,

    validators: {
      onSubmit: SignupFormSchema,
    },

    onSubmit: async ({ value }) => {
      const data = {
        email: value.email.trim().toLowerCase(),
        password: value.password,
        passwordConfirm: value.confirmPassword,
        first_name: value.name.trim(),
        first_surname: value.lastName.trim(),
      }

      setSuccess(false)

      try {
        await signup({ data })

        setSuccess(true)
      } catch (error) {
        console.error('Signup failed:', error)

        toast.error('Unable to create your account', {
          description: 'Please check your information and try again.',
        })
      }
    },
  })

  return success ? (
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 className="size-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Please verify your email
          </h2>
          <p className="text-sm text-muted-foreground">
            An email has been sent to{' '}
            <strong>{form.getFieldValue('email')}</strong>. Click on the link to
            complete your signup.
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
    </Card>
  ) : (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Sign up</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          className="w-full text-center"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const errors = field.state.meta.errors

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>First name</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      autoComplete="given-name"
                      placeholder="Jane"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={errors.length > 0}
                      required
                    />

                    {errors.length > 0 && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors[0]?.message}
                      </p>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="lastName">
              {(field) => {
                const errors = field.state.meta.errors

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Last name</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      autoComplete="family-name"
                      placeholder="Doe"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={errors.length > 0}
                      required
                    />

                    {errors.length > 0 && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors[0]?.message}
                      </p>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                const errors = field.state.meta.errors

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={errors.length > 0}
                      required
                    />

                    {errors.length > 0 && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors[0]?.message}
                      </p>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="confirmEmail">
              {(field) => {
                const errors = field.state.meta.errors

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Confirm email</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      autoComplete="off"
                      placeholder="name@example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={errors.length > 0}
                      required
                    />

                    {errors.length > 0 && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors[0]?.message}
                      </p>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const errors = field.state.meta.errors

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={errors.length > 0}
                      required
                    />

                    {errors.length > 0 && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors[0]?.message}
                      </p>
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => {
                const errors = field.state.meta.errors

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Confirm password
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={errors.length > 0}
                      required
                    />

                    {errors.length > 0 && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors[0]?.message}
                      </p>
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting]) => (
              <Button
                className="mt-6 w-full"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Creating account
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            )}
          </form.Subscribe>

          <Link
            to="/login"
            className={buttonVariants({
              variant: 'link',
              className: 'mt-2 inline-flex items-center gap-2',
            })}
          >
            Already have an account? Login
          </Link>
        </form>
      </CardContent>
    </Card>
  )
}
