import { paginationSchema } from './pagination'
import z from 'zod'

export const MEMBERSHIP_STATUSES = [
  'guest',
  'prospect',
  'active',
  'on_leave',
  'honorary',
  'inactive',
]

export const UpdateMemberFormSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  birth_date: z.iso.date(),
  profession: z.string(),
  biography: z.string(),
})

export const UpdateMemberSchema = UpdateMemberFormSchema.extend({
  id: z.string().min(1, 'Member ID is required'),
})

export type UpdateMemberSchema = z.infer<typeof UpdateMemberFormSchema>

export const MembershipStatusSchema = z.enum(MEMBERSHIP_STATUSES)

export type MembershipStatus = z.infer<typeof MembershipStatusSchema>

export const MembersListSchema = paginationSchema.extend({
  search: z.string().default(''),
  clubIds: z.array(z.string()).default([]),
  roleIds: z.array(z.string()).default([]),
  membership_status: MembershipStatusSchema.nullable().default(null),
})
