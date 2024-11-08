import * as jwt from 'jsonwebtoken'
import CONFIG from '../config/environtment'
import { HTTPException } from 'hono/http-exception'

interface JWTVerifyResult {
  valid: boolean
  expired: boolean
  decoded: jwt.JwtPayload | null
}

export const signJWT = (payload: object, options?: jwt.SignOptions): string => {
  if (!CONFIG.jwt_private) {
    throw new HTTPException(404, {
      message: 'JWT private key is not defined'
    })
  }
  return jwt.sign(payload, CONFIG.jwt_private, {
    ...(options || {}),
    algorithm: 'RS256'
  })
}

export const verifyJWT = (token: string): JWTVerifyResult => {
  if (!CONFIG.jwt_public) {
    throw new HTTPException(404, {
      message: 'JWT public key is not defined'
    })
  }
  try {
    const decoded = jwt.verify(token, CONFIG.jwt_public) as jwt.JwtPayload
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null
    }
  }
}
