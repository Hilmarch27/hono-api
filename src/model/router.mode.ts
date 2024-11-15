import { Router, Status } from '@prisma/client'

export type CreateRouterRequest = {
  type_of_uker: string
  router_series: string
  name_uker: string
  kanca: string
  kanwil: string
  ip_uker: string
  sn_device: string
  status: Status
  information: string
  userId: string
}

export type RouterResponse = {
  id: string
  type_of_uker: string
  router_series: string
  name_uker: string
  kanca: string
  kanwil: string
  ip_uker: string
  sn_device: string
  status: Status
  information: string
  created_at?: Date
  updated_at?: Date
  userId: string
}

export type RouterUpdate = {
  id: string
  userId: string
  type_of_uker?: string
  router_series?: string
  name_uker?: string
  kanca?: string
  kanwil?: string
  ip_uker?: string
  sn_device?: string
  status?: Status
  information?: string
}

export type SearchRouterRequest = {
  type_of_uker?: string
  router_series?: string
  name_uker?: string
  kanca?: string
  kanwil?: string
  ip_uker?: string
  sn_device?: string
  status?: Status
  information?: string
  startDate?: Date
  endDate?: Date
  page: number
  size: number
}

export function toRouterResponse(router: Router): RouterResponse {
  return {
    id: router.id,
    type_of_uker: router.type_of_uker,
    router_series: router.router_series,
    name_uker: router.name_uker,
    kanca: router.kanca,
    kanwil: router.kanwil,
    ip_uker: router.ip_uker,
    sn_device: router.sn_device,
    status: router.status,
    information: router.information,
    created_at: router.created_at,
    updated_at: router.updated_at,
    userId: router.userId
  }
}
