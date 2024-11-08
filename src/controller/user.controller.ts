import { Hono } from 'hono'
import { CreateUserRequest, LoginUserRequest } from '../model/user.model'
import { UserService } from '../service/user.service'
import { ApplicationVariables } from '../model/app.model'
import { getCookie, setCookie } from 'hono/cookie'
import { requireCredentials } from '../middleware/auth.middleware'

export const userController = new Hono<{ Variables: ApplicationVariables }>()

userController.post('/api/users/register', async (c) => {
  const request = (await c.req.json()) as CreateUserRequest

  const response = await UserService.register(request)

  return c.json(
    {
      data: response
    },
    201
  )
})

userController.post('/api/users/login', async (c) => {
  const request = (await c.req.json()) as LoginUserRequest

  const response = await UserService.login(request)

  setCookie(c, 'access_token', response.access_token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict',
    maxAge: 4 * 60 * 1000 // 4 minutes
  })

  setCookie(c, 'refresh_token', response.refresh_token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 // 1 month (2592000 seconds)
  })

  return c.json(
    {
      message: 'Login successfully!',
      data: response.email
    },
    200
  )
})

userController.post('/api/users/refresh', async (c) => {
  const request = getCookie(c, 'refresh_token')

  if (!request) {
    // Handle the case where the cookie is not set
    return c.json({ error: 'Refresh token is missing' }, 401)
  }

  const response = await UserService.refresh({ cookies: { refreshToken: request } })

  setCookie(c, 'access_token', response.access_token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  })

  setCookie(c, 'refresh_token', response.refresh_token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 // 1 month (2592000 seconds)
  })

  return c.json(
    {
      message: 'Refresh token successfully refreshed',
      data: response.email
    },
    201
  )
})

userController.get('/api/users/current', requireCredentials, async (c) => {
  const user = c.get('user')
  console.info('user:', user)
  const response = await UserService.current(user.id)

  return c.json(
    {
      data: response
    },
    200
  )
})
