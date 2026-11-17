import z from 'zod'
import { paginationSchema } from './pagination.schema'
import { CountrySchema } from './country.schemas'
import { RegionSchema } from './region.schemas'

export const CLUB_STATUSES = ['active', 'inactive']

export const ClubStatusSchema = z.enum(CLUB_STATUSES)

export const ClubsListSchema = paginationSchema.extend({
  search: z.string().default(''),
  countries: z.array(z.string()).default([]),
})

export const CreateClubSchema = z.object({
  club_id: z.string().min(1, 'Rotary ID is required.'),
  name: z.string().min(1, 'Name is required.'),
  foundation_date: z.iso.date(),
  country: CountrySchema,
  status: ClubStatusSchema,
  description: z.string().nullable(),
  region: RegionSchema,
  sponsor_club: z.string().nullable(),
  location: z.url().nullable(),
  instagram: z.url().nullable(),
  tiktok: z.url().nullable(),
  x_twitter: z.url().nullable(),
  facebook: z.url().nullable(),
})

export const UpdateClubSchema = CreateClubSchema.extend({
  id: z.string().min(1, 'Member ID is required'),
})

const optionalUrl = z.union([z.url('Please enter a valid URL.'), z.literal('')])

export const ClubFormSchema = CreateClubSchema.extend({
  description: z.string(),
  sponsor_club: z.string(),
  location: optionalUrl,
  instagram: optionalUrl,
  tiktok: optionalUrl,
  x_twitter: optionalUrl,
  facebook: optionalUrl,
})

export type ClubFormValues = z.infer<typeof ClubFormSchema>
