type AppLogoProps = {
  className?: string
  priority?: boolean
}

export function AppLogo({ className = '', priority = false }: AppLogoProps) {
  return (
    <img
      src="/images/rotaract_logo_long_cranberry.png"
      alt="Rotaract District 4250"
      width={320}
      height={120}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`h-auto w-48 object-contain ${className}`}
    />
  )
}
