import type { SVGProps } from 'react'

export function XIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-5-7.2L5.7 22H2.5l7.3-8.4L1.9 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z" />
    </svg>
  )
}
