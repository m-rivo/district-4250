import PocketBase from 'pocketbase'
import { createServerFn } from '@tanstack/react-start'
import {
  getRequestHeader,
  setResponseHeader,
} from '@tanstack/react-start/server'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: import.meta.env.PROD,
  sameSite: 'Lax' as const,
  path: '/',
}

function createServerPocketBase() {
  return new PocketBase(import.meta.env.VITE_API_URL)
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
          name: authData.record.name,
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
      const authData = await pb.collection('users').authRefresh()

      setResponseHeader(
        'Set-Cookie',
        pb.authStore.exportToCookie(COOKIE_OPTIONS),
      )

      const member = authData.record.member
      let name: string | null = null

      if (member) {
        const memberData = await pb.collection('members').getOne(member)
        name = memberData.first_name
      }

      return {
        id: authData.record.id,
        email: authData.record.email,
        name: name,
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
