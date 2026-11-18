import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getOneProject } from '#/functions/project.functions'
import ClubsListTable from '#/components/clubs/ClubsListTable'
import ErrorCard from '#/components/ErrorCard'
import { useState } from 'react'
import { useDebounce } from '#/hooks/use-debounce'
import type { Country } from '#/types/country'
import { format, parseISO } from 'date-fns'
import { Breadcrumbs } from '#/components/Bradcrumbs'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { CogIcon, HandshakeIcon, NotebookTextIcon } from 'lucide-react'
import parse from 'html-react-parser'
import DOMPurify from 'dompurify'
import { Skeleton } from '#/components/ui/skeleton'

export const Route = createFileRoute('/_app/projects/$projectId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()

  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(10)
  const [search, setSearch] = useState<string>('')
  const [countries, setCountries] = useState<Country[]>([])

  const debouncedSearch = useDebounce(search, 300)

  const {
    data: project,
    error,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['project', { id: projectId }],
    queryFn: () => getOneProject({ data: { id: projectId } }),
  })

  const cleanBiography = DOMPurify.sanitize(project?.description || '')

  if (isError)
    return <ErrorCard title="Error loading project" message={error.message} />

  return (
    <section className="space-y-6 p-6">
      {isPending ? (
        <>
          <Skeleton className="h-8 w-full" />
          Loading...
        </>
      ) : (
        <>
          <Breadcrumbs
            routes={[{ route: '/projects', name: 'Projects' }]}
            page={project.name}
          />
          {/* Header */}
          <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 sm:flex-row sm:items-center">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className="text-3xl font-bold tracking-tight flex items-center
                gap-2"
                >
                  <HandshakeIcon className="size-8 text-primary" />
                  {project.name}
                </h1>
              </div>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                Start date:{' '}
                {format(parseISO(project.start_date), 'MMMM dd,yyyy')}
              </p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                Cost:{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(project.cost)}
              </p>
            </div>

            {/* <EditMemberDialog data={data} />
        <ImageUpdateDialog
          title="profile picture"
          onSave={async (file) => {
            await uploadProfilePicture(memberId, file)

            await queryClient.invalidateQueries({
              queryKey: ['member', { id: memberId }],
            })

            toast.success('Profile picture updated successfully.')
          }}
        /> */}
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NotebookTextIcon className="size-5 text-primary" />
                Description
              </CardTitle>
            </CardHeader>

            <CardContent>
              {project.description ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {parse(cleanBiography)}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No description available.
                </p>
              )}
            </CardContent>
          </Card>

          <h2 className="flex items-center gap-2">
            <CogIcon className="size-5 text-primary" /> Clubs participantes
          </h2>
          <ClubsListTable
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            search={search}
            setSearch={setSearch}
            countries={countries}
            setCountries={setCountries}
            debouncedSearch={debouncedSearch}
            canFilterCountries={false}
            clubIds={project.clubs}
          />
        </>
      )}
    </section>
  )
}
