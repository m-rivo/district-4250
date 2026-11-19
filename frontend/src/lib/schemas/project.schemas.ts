import { paginationSchema } from '#/lib/schemas/pagination.schema'
import z from 'zod'

export const ProjectsListSchema = paginationSchema.extend({
  search: z.string().default(''),
  clubIds: z.array(z.string()).default([]),
  startDateFrom: z.string().default(''),
  startDateTo: z.string().default(''),
})

export const CreateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  start_date: z.iso.date('Start date is required.'),
  cost: z.number('Cost is required.').nonnegative('Cost cannot be negative.'),
  evidence: z.url('A valid evidence link is required.'),
  clubs: z.array(z.string().min(1)).min(1, 'At least one club is required.'),
})

export const UpdateProjectSchema = CreateProjectSchema.extend({
  id: z.string().min(1, 'Project ID is required'),
})

export const ProjectFormSchema = CreateProjectSchema

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>
