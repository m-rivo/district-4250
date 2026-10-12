import { logout } from '#/features/auth/auth.functions'
import { useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import { useState } from 'react'
import FullScreenLoader from './FullScreenLoader'

export default function LogoutButton() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
      await navigate({ to: '/login' })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        Logout
      </Button>
      {isLoggingOut && <FullScreenLoader />}
    </>
  )
}
