import { createServerPocketBase } from '#/lib/pocketbase/server'
import { createServerFn } from '@tanstack/react-start'
import {
  getRequestHeader,
  setResponseHeader,
} from '@tanstack/react-start/server'
import { SignupServerSchema } from './auth.schemas'
import z from 'zod'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: import.meta.env.PROD,
  sameSite: 'Lax' as const,
  path: '/',
}

function clearAuthCookie() {
  const secure = import.meta.env.PROD ? ' Secure;' : ''

  setResponseHeader(
    'Set-Cookie',
    `pb_auth=; HttpOnly;${secure} SameSite=Lax; Path=/; Max-Age=0`,
  )
}

export const login = createServerFn({ method: 'POST' })
  .validator((data: { email: string; password: string }) => {
    if (
      typeof data.email !== 'string' ||
      typeof data.password !== 'string' ||
      !data.email.trim() ||
      !data.password
    ) {
      throw new Error('Debes ingresar el correo y la contraseña.')
    }

    return data
  })
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    try {
      const authData = await pb
        .collection('users')
        .authWithPassword(data.email, data.password)

      setResponseHeader(
        'Set-Cookie',
        pb.authStore.exportToCookie(COOKIE_OPTIONS),
      )

      return {
        user: {
          id: authData.record.id,
          email: authData.record.email,
        },
      }
    } catch {
      throw new Error('Correo o contraseña incorrectos.')
    }
  })

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const cookie = getRequestHeader('cookie')

    if (!cookie?.includes('pb_auth=')) {
      return null
    }

    const pb = createServerPocketBase()
    pb.authStore.loadFromCookie(cookie)

    if (!pb.authStore.isValid) {
      clearAuthCookie()
      return null
    }

    try {
      const user = await pb.collection('users').authRefresh()

      setResponseHeader(
        'Set-Cookie',
        pb.authStore.exportToCookie(COOKIE_OPTIONS),
      )

      const member = await pb
        .collection('members')
        .getFirstListItem(`user = "${user.record.id}"`)

      return {
        id: user.record.id,
        email: user.record.email,
        name: member.first_name,
      }
    } catch {
      pb.authStore.clear()
      clearAuthCookie()
      return null
    }
  },
)

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  clearAuthCookie()
  return { success: true }
})

export const sendResetEmail = createServerFn({ method: 'POST' })
  .validator((data: { email: string }) => {
    const email = data.email.trim().toLowerCase()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Enter a valid email.')
    }

    return { email }
  })
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    await pb.collection('users').requestPasswordReset(data.email)

    return { success: true }
  })

export const confirmResetPassword = createServerFn({ method: 'POST' })
  .validator(
    (data: {
      token: string
      newPassword: string
      confirmNewPassword: string
    }) => {
      const token = data.token.trim()

      return {
        token,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      }
    },
  )
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    await pb
      .collection('users')
      .confirmPasswordReset(
        data.token,
        data.newPassword,
        data.confirmNewPassword,
      )

    return { success: true }
  })

export const signup = createServerFn({ method: 'POST' })
  .validator(SignupServerSchema)
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()
    console.log('[signup] Validated server data')

    const user = await pb.collection('users').create({
      email: data.email,
      emailVisibility: false,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    })
    console.log('[signup] User created:', user.id)

    const member = await pb.collection('members').create({
      user: user.id,
      first_name: data.first_name,
      first_surname: data.first_surname,
      is_active: true,
    })
    console.log('[signup] Member created:', member.id)

    try {
      await pb.collection('users').requestVerification(data.email)
      console.log('[signup] Verification requested')
    } catch (error: any) {
      console.error('[signup] Verification error:', {
        message: error.message,
        status: error.status,
        response: error.response,
        data: error.data,
      })
    }

    return { success: true }
  })

export const verifyEmail = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      token: z.string().trim().min(1).max(4096),
    }),
  )
  .handler(async ({ data }) => {
    const pb = createServerPocketBase()

    await pb.collection('users').confirmVerification(data.token)

    return { success: true }
  })
