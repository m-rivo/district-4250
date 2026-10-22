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

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
})

function SignupPage() {
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
      onChange: SignupFormSchema,
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

      try {
        await signup({ data })

        toast.success('Account created', {
          description: 'Check your email to verify your account.',
        })
      } catch (error) {
        console.error('Signup failed:', error)

        toast.error('Unable to create your account', {
          description: 'Please check your information and try again.',
        })
      }
    },
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Sign up</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          className="w-full"
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
