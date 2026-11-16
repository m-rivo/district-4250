import { REGIONS } from '#/types/region'
import z from 'zod'

export const RegionSchema = z.enum(REGIONS)
