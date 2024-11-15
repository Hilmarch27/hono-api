import { z, ZodType } from 'zod'

export class RouterValidation {
  static readonly CREATE: ZodType = z.object({
    id: z.string().optional(),
    type_of_uker: z.string().min(1),
    router_series: z.string().min(1),
    name_uker: z.string().min(1),
    kanca: z.string().min(1),
    kanwil: z.string().min(1),
    ip_uker: z.string().min(1),
    sn_device: z.string().min(1),
    status: z.enum(['AKTIF', 'TUTUP']),
    information: z.string().min(1),
    userId: z.string().min(1)
  })

  static readonly GET: ZodType = z.string().min(1)
  
  static readonly DELETE: ZodType = z.string().min(1)

  static readonly UPDATE: ZodType = z.object({
    id: z.string().min(1),
    type_of_uker: z.string().optional(),
    router_series: z.string().optional(),
    name_uker: z.string().optional(),
    kanca: z.string().optional(),
    kanwil: z.string().optional(),
    ip_uker: z.string().optional(),
    sn_device: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    information: z.string().optional(),
  })

  static readonly SEARCH: ZodType = z.object({
    type_of_uker: z.string().optional(),
    router_series: z.string().optional(),
    name_uker: z.string().optional(),
    kanca: z.string().optional(),
    kanwil: z.string().optional(),
    ip_uker: z.string().optional(),
    sn_device: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    information: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive()
  })
}