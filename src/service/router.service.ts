import { HTTPException } from 'hono/http-exception'
import { prisma } from '../app/database'
import {
  CreateRouterRequest,
  RouterResponse,
  RouterUpdate,
  SearchRouterRequest,
  toRouterResponse
} from '../model/router.mode'
import { RouterValidation } from '../validation/router.validation'
import { Router, User } from '@prisma/client'
import { Pageable } from '../model/page.model'

export class RouterService {
  static async create(request: CreateRouterRequest): Promise<RouterResponse> {
    request = RouterValidation.CREATE.parse(request)

    const totalRouterWithSameIp = await prisma.router.count({
      where: {
        ip_uker: request.ip_uker
      }
    })

    if (totalRouterWithSameIp != 0) {
      throw new HTTPException(409, {
        message: 'IP Router already exists'
      })
    }

    const router = await prisma.router.create({
      data: request
    })

    return toRouterResponse(router)
  }

  static async get(user: User, routerId: string): Promise<RouterResponse> {
    routerId = RouterValidation.GET.parse(routerId)
    const router = await RouterService.routerMustExists(user, routerId)
    return toRouterResponse(router)
  }

  static async update(user: User, request: RouterUpdate): Promise<RouterResponse> {
    request = RouterValidation.UPDATE.parse(request)
    await this.routerMustExists(user, request.id)

    const router = await prisma.router.update({
      where: {
        id: request.id
      },
      data: request
    })

    return toRouterResponse(router)
  }

  static async delete(user: User, routerId: string): Promise<boolean> {
    routerId = RouterValidation.DELETE.parse(routerId)
    await this.routerMustExists(user, routerId)

    await prisma.router.delete({
      where: {
        id: routerId
      }
    })

    return true
  }

  static async routerMustExists(user: User, routerId: string): Promise<Router> {
    const router = await prisma.router.findFirst({
      where: {
        id: routerId,
        userId: user.id
      }
    })

    if (!router) {
      throw new HTTPException(404, {
        message: 'Router is not found'
      })
    }

    return router
  }

  static async search(request: SearchRouterRequest): Promise<Pageable<RouterResponse>> {
    request = RouterValidation.SEARCH.parse(request)

    const filters: any[] = []
    // Add filters for each possible field
    if (request.type_of_uker) {
      filters.push({
        type_of_uker: {
          contains: request.type_of_uker,
          mode: 'insensitive' // Case insensitive search
        }
      })
    }

    if (request.router_series) {
      filters.push({
        router_series: {
          contains: request.router_series,
          mode: 'insensitive'
        }
      })
    }

    if (request.name_uker) {
      filters.push({
        name_uker: {
          contains: request.name_uker,
          mode: 'insensitive'
        }
      })
    }

    if (request.kanca) {
      filters.push({
        kanca: {
          contains: request.kanca,
          mode: 'insensitive'
        }
      })
    }

    if (request.kanwil) {
      filters.push({
        kanwil: {
          contains: request.kanwil,
          mode: 'insensitive'
        }
      })
    }

    if (request.ip_uker) {
      filters.push({
        ip_uker: {
          contains: request.ip_uker,
          mode: 'insensitive'
        }
      })
    }

    if (request.sn_device) {
      filters.push({
        sn_device: {
          contains: request.sn_device,
          mode: 'insensitive'
        }
      })
    }

    if (request.status) {
      filters.push({
        status: request.status
      })
    }

    if (request.information) {
      filters.push({
        information: {
          contains: request.information,
          mode: 'insensitive'
        }
      })
    }

    // Date range filter
    if (request.startDate || request.endDate) {
      filters.push({
        created_at: {
          ...(request.startDate && { gte: request.startDate }),
          ...(request.endDate && { lte: request.endDate })
        }
      })
    }

    const skip = (request.page - 1) * request.size

    // Build where clause
    const whereClause = filters.length > 0 ? { AND: filters } : {}

    // Get filtered data
    const routers = await prisma.router.findMany({
      where: whereClause,
      take: request.size,
      skip: skip,
      orderBy: {
        created_at: 'desc' // Add default sorting
      }
    })

    // Get total count for pagination
    const total = await prisma.router.count({
      where: whereClause
    })

    // Transform and return results
    return {
      data: routers.map((router) => toRouterResponse(router)),
      paging: {
        current_page: request.page,
        size: request.size,
        total_page: Math.ceil(total / request.size),
        total_items: total
      }
    }
  }
}
