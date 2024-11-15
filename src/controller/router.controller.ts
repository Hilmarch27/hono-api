import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { CreateRouterRequest, SearchRouterRequest } from '../model/router.mode'
import { RouterService } from '../service/router.service'
import { requireCredentials } from '../middleware/auth.middleware'
import { Status } from '@prisma/client'

export const routerController = new Hono<{ Variables: ApplicationVariables }>()
routerController.use(requireCredentials)

routerController.post('/api/routers', async (c) => {
  const user = c.get('user')
  const request = (await c.req.json()) as CreateRouterRequest
  const response = await RouterService.create({
    ...request,
    userId: user.id
  })

  return c.json({ result: response }, 201)
})

routerController.get('/api/routers/:id', async (c) => {
  const user = c.get('user')
  const routerId = c.req.param('id')

  const response = await RouterService.get(user, routerId)

  return c.json({ result: response }, 200)
})

routerController.patch('/api/routers/:id', async (c) => {
  const user = c.get('user')
  const routerId = c.req.param('id')
  const request = (await c.req.json()) as CreateRouterRequest

  const response = await RouterService.update(user, { id: routerId, ...request })

  return c.json(
    {
      message: `Router with IP ${response.ip_uker} updated successfully`,
      result: response
    },
    200
  )
})

routerController.delete('/api/routers/:id', async (c) => {
  const user = c.get('user')
  const routerId = c.req.param('id')
  const response = await RouterService.delete(user, routerId)

  return c.json(
    {
      message: `Router with ID ${routerId} updated successfully`,
      result: response
    },
    202
  )
})

routerController.get('/api/routers', async (c) => {
  const request: SearchRouterRequest = {
    type_of_uker: c.req.query('type_of_uker'),
    router_series: c.req.query('router_series'),
    name_uker: c.req.query('name_uker'),
    kanca: c.req.query('kanca'),
    kanwil: c.req.query('kanwil'),
    ip_uker: c.req.query('ip_uker'),
    sn_device: c.req.query('sn_device'),
    status: c.req.query('status') as Status | undefined,
    information: c.req.query('information'),
    startDate: c.req.query('startDate') as Date | undefined,
    endDate: c.req.query('endDate') as Date | undefined,
    page: c.req.query('page') ? Number(c.req.query('page')) : 1,
    size: c.req.query('size') ? Number(c.req.query('size')) : 10
  }
  const response = await RouterService.search(request)
  return c.json(response, 200)
})
