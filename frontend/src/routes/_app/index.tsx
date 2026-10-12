import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: Homepage,
})

function Homepage() {
  return (
    <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-14">
      <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
      <p className="island-kicker mb-3">District 4250</p>
      <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-(--sea-ink) sm:text-6xl">
        Welcome User!
      </h1>
      <p className="mb-8 max-w-2xl text-base text-(--sea-ink-soft) sm:text-lg">
        Welcome to your District 4250 App!
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="/about"
          className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
        >
          About This Starter
        </a>
      </div>
    </section>
  )
}
