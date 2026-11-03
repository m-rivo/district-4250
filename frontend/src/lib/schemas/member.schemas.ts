import z from 'zod'

export const UpdateMemberFormSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  first_surname: z.string().trim().min(1, 'Last name is required'),
  birth_date: z.iso.date(),
  profession: z.string(),
  biography: z.string(),
})

export const UpdateMemberSchema = UpdateMemberFormSchema.extend({
  id: z.string().min(1, 'Member ID is required'),
})

export type UpdateMemberSchema = z.infer<typeof UpdateMemberFormSchema>
