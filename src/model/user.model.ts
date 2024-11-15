import { User } from '@prisma/client'

export type UserResponse = {
  id?: string
  name: string
  email: string
  role?: string
  created_at?: Date
  updated_at?: Date
  access_token?: string
  refresh_token?: string
}

export type CreateUserRequest = {
  email: string
  name: string
  password: string
}

export type LoginUserRequest = {
  email: string
  password: string
}

export type CookiesRequest = {
  cookies: {
    refreshToken?: string
    accessToken?: string
  }
}

// transform user to user response
export function toUserResponse(user: User, access_token?: string, refresh_token?: string): UserResponse {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    access_token,
    refresh_token
  }
}
