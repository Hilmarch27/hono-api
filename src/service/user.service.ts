import { HTTPException } from 'hono/http-exception'
import { prisma } from '../app/database'
import { CookiesRequest, CreateUserRequest, LoginUserRequest, toUserResponse, UserResponse } from '../model/user.model'
import { UserValidation } from '../validation/user.validation'
import { signJWT, verifyJWT } from '../util/jwt.util'
import { JwtPayload } from 'jsonwebtoken'

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    request = UserValidation.REGISTER.parse(request)

    const totalUserWithSameUsername = await prisma.user.count({
      where: {
        email: request.email
      }
    })

    if (totalUserWithSameUsername != 0) {
      throw new HTTPException(400, {
        message: 'Email already exists'
      })
    }

    request.password = await Bun.password.hash(request.password, {
      algorithm: 'bcrypt',
      cost: 10
    })

    const user = await prisma.user.create({
      data: request
    })

    return toUserResponse(user)
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    request = UserValidation.LOGIN.parse(request)

    const user = await prisma.user.findUnique({
      where: {
        email: request.email
      }
    })

    if (!user) {
      throw new HTTPException(401, { message: 'username or Password is wrong' })
    }

    if (!(await Bun.password.verify(request.password, user.password))) {
      throw new HTTPException(401, { message: 'username or Password is wrong' })
    }

    const access_token = signJWT({ id: user.id, role: user.role }, { expiresIn: '4m' })

    const refresh_token = signJWT({ id: user.id, role: user.role }, { expiresIn: '30d' })

    const response = toUserResponse(user)
    response.access_token = access_token
    response.refresh_token = refresh_token

    return response
  }

  static async refresh(request: CookiesRequest): Promise<UserResponse> {
    const refreshToken = request.cookies?.refreshToken

    if (!refreshToken) {
      throw new HTTPException(401, { message: 'Refresh token is missing' })
    }

    const { valid, expired, decoded } = verifyJWT(refreshToken)

    if (!valid || expired || !decoded) {
      throw new HTTPException(401, { message: 'Refresh token is invalid' })
    }

    const user = await prisma.user.findUnique({
      where: { id: (decoded as JwtPayload).id }
    })

    if (!user) {
      throw new HTTPException(401, { message: 'User not found' })
    }

    const access_token = signJWT({ id: user.id, role: user.role }, { expiresIn: '15m' })
    const refresh_token = signJWT({ id: user.id, role: user.role }, { expiresIn: '30d' })

    return toUserResponse(user, access_token, refresh_token)
  }

  static async current(id: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    if (!user) {
      throw new HTTPException(404, { message: 'User not found' })
    }

    return toUserResponse(user)
  }
}
