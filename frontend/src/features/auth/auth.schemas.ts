import z from 'zod'

export const SignupFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'First name must contain at least 2 characters.')
      .max(50, 'First name cannot exceed 50 characters.'),

    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must contain at least 2 characters.')
      .max(50, 'Last name cannot exceed 50 characters.'),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email('Please enter a valid email address.')),

    confirmEmail: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email('Please enter a valid email address.')),

    password: z.string().min(8, 'Password must be at least 8 characters.'),

    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Email addresses don't match.",
    path: ['confirmEmail'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export type SignupValues = z.infer<typeof SignupFormSchema>

export const SignupServerSchema = z
  .object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(8).max(128),
    passwordConfirm: z.string().min(1),
    first_name: z.string().trim().min(2).max(50),
    first_surname: z.string().trim().min(2).max(50),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  })
  .strict()
