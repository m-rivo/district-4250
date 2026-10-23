import { Link } from '@tanstack/react-router'
import ParaglideLocaleSwitcher from './LocaleSwitcher.tsx'
import ThemeToggle from './ThemeToggle'
import { m } from '#/paraglide/messages.js'
import { InstagramIcon } from './icons/instagram.icon.tsx'
import LogoutButton from './LogoutButton.tsx'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm text-(--sea-ink) no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            District 4250
          </Link>
        </h2>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-0 sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            {m.home_page()}
          </Link>
          <Link
            to="/members"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            {m.members()}
          </Link>
          <Link
            to="/clubs"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Clubs
          </Link>
          <Link
            to="/profile"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            {m.my_profile()}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LogoutButton />
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl p-2 text-(--sea-ink-soft) transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink) sm:block"
          >
            <span className="sr-only">Go to District 4250 Instagram</span>
            <InstagramIcon className="h-6 w-6" />
          </a>
          <ParaglideLocaleSwitcher />

          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
