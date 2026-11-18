import { paginationSchema } from '#/lib/schemas/pagination.schema'
import z from 'zod'

export const ProjectsListSchema = paginationSchema.extend({
  search: z.string().default(''),
  clubIds: z.array(z.string()).default([]),
  startDateFrom: z.string().default(''),
  startDateTo: z.string().default(''),
})
