import { paginationSchema } from './pagination.schema'
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

export const MembershipStatusSchema = z.enum(MEMBERSHIP_STATUSES)

export const MembersFiltersSchema = z.object({
  search: z.string().default(''),
  clubIds: z.array(z.string()).default([]),
  roleIds: z.array(z.string()).default([]),
  membership_status: MembershipStatusSchema.nullable().default(null),
})

export const MembersListSchema = paginationSchema.extend(
  MembersFiltersSchema.shape,
)

export const AddMemberToClubSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  roles: z.array(z.string()).default([]),
  membership_status: MembershipStatusSchema.refine(
    (status) => status !== 'guest',
    { message: 'Membership status cannot be guest.' },
  ),
})

export const AddMemberToClubFormSchema = z.object({
  board_roles: z.array(z.string()),
  director_roles: z.array(z.string()),
  membership_status: MembershipStatusSchema.nullable().refine(
    (status) => status !== null && status !== 'guest',
    { message: 'Please select a valid membership status.' },
  ),
})
