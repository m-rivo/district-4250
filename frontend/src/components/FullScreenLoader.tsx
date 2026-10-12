import { createPortal } from 'react-dom'
import { Spinner } from '#/components/ui/spinner'

export default function FullScreenLoader() {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-9999 flex min-h-screen items-center justify-center bg-background">
      <Spinner className="size-8 text-primary" />
    </div>,
    document.body,
  )
}
