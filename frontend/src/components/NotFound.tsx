import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <section>
      <h1>404</h1>

      <h2>Page not found</h2>

      <p>The page you are looking for doesn't exist or may have been moved.</p>

      <Button asChild>
        <Link to="/">Go back home</Link>
      </Button>
    </section>
  )
}
