import type { SVGProps } from 'react'

export function TikTokIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M19.6 6.3a5.5 5.5 0 0 1-3.4-1.1 5.6 5.6 0 0 1-1.9-3.2H10v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V8.5a7 7 0 1 0 5.9 6.9V8.7a9.2 9.2 0 0 0 5.7 2V6.3Z" />
    </svg>
  )
}
