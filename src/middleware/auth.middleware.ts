// middleware/auth.middleware.ts
import { MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { ApplicationVariables } from '../model/app.model'
import { User } from '@prisma/client'
import { verifyJWT } from '../util/jwt.util'
import { logger } from '../app/logging'

// Middleware untuk decode token
export const decodedToken: MiddlewareHandler<{ Variables: ApplicationVariables }> = async (c, next) => {
  const accessToken = getCookie(c, 'access_token')
  console.info('accessToken:', accessToken)

  if (!accessToken) {
    return next()
  }

  const token = verifyJWT(accessToken)
  if (token.decoded) {
    c.set('user', token.decoded as User)
    return next()
  }

  if (token.expired) {
    logger.info('Expired token...')
    return next()
  }

  return next()
}

// Middleware untuk mengecek user authentication
export const requireCredentials: MiddlewareHandler<{ Variables: ApplicationVariables }> = async (c, next) => {
  const user = c.get('user')

  if (!user) {
    return c.json({ message: 'Unauthorized' }, 401)
  }

  await next()
}

// Middleware untuk mengecek admin authentication
export const requireAdmin: MiddlewareHandler<{ Variables: ApplicationVariables }> = async (c, next) => {
  const user = c.get('user')

  if (!user || user.role !== 'admin') {
    return c.json({ message: 'Unauthorized - Admin access required' }, 401)
  }

  await next()
}
