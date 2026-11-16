import { COUNTRIES } from '#/types/country'
import z from 'zod'

export const CountrySchema = z.enum(COUNTRIES)
