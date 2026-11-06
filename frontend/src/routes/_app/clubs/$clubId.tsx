import EditMemberDialog from '#/components/members/EditMemberDialog'
import { ProfilePictureDialog } from '#/components/members/ProfilePictureDialog'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  BookOpenIcon,
  CogIcon,
  HandshakeIcon,
  ImageIcon,
  MapPinIcon,
  PencilIcon,
  UsersIcon,
} from 'lucide-react'
import { getOneClub } from '#/functions/club.functions'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import parse from 'html-react-parser'
import DOMPurify from 'dompurify'
import { Breadcrumbs } from '#/components/Bradcrumbs'
import { Skeleton } from '#/components/ui/skeleton'
import { HN, BZ, GT } from 'country-flag-icons/react/3x2'
import { format, parseISO } from 'date-fns'
import { InstagramIcon } from '#/components/icons/instagram.icon'
import { FacebookIcon } from '#/components/icons/FacebookIcon'
import { TikTokIcon } from '#/components/icons/TiktokIcon'
import { XIcon } from '#/components/icons/XIcon'
import MembersListTable from '#/components/members/MembersListTable'
import { useState } from 'react'
import { m } from '#/paraglide/messages'
import ProjectsListTable from '#/components/projects/ProjectsListTable'

// TODO: dialog con form para editar club
// TODO: update de imagen de logo
export const Route = createFileRoute('/_app/clubs/$clubId')({
  component: ClubPage,
})

function ClubPage() {
  const { clubId } = Route.useParams()

  const [clubIds, setClubIds] = useState<string[]>([clubId])

  const {
    data: club,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['club', { id: clubId }],
    queryFn: () => getOneClub({ data: { id: clubId } }),
  })

  const cleanBiography = DOMPurify.sanitize(club?.description ?? '')

  if (isError) return <span>Error: {error.message}</span>

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
            routes={[{ route: '/clubs', name: 'Clubs' }]}
            page={club.name}
          />
          {/* Header */}
          <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 sm:flex-row sm:items-center">
            <Avatar className="size-24 rounded-xl">
              <AvatarImage src={club.logo || ''} alt={club.name} />
              <AvatarFallback className="rounded-xl text-5xl">
                <ImageIcon className="size-10" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {club.name}
                </h1>

                <Badge variant="green">{club.status}</Badge>
              </div>

              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                Foundation date{' '}
                {format(parseISO(club.foundation_date), 'MMMM dd,yyyy')}
              </p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                Sponsor club <CogIcon className="size-5 text-yellow-500" />
                {club.sponsor_club}
              </p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                Club Id {club.club_id}
              </p>

              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>
                  {club.country === 'Honduras' && (
                    <HN title="Honduras" className="w-6 rounded-[2px]" />
                  )}
                  {club.country === 'Belize' && (
                    <BZ title="Belize" className="w-6 rounded-[2px]" />
                  )}
                  {club.country === 'Guatemala' && (
                    <GT title="Guatemala" className="w-6 rounded-[2px]" />
                  )}
                </span>{' '}
                Region {club.region}
              </p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <a
                  href={club.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="size-5"
                >
                  <span className="sr-only">Instagram</span>
                  <InstagramIcon
                    className="size-5"
                    style={{
                      stroke: 'url(#instagram-gradient)',
                    }}
                  />
                </a>
                <a
                  href={club.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="size-5"
                >
                  <span className="sr-only">Facebook</span>
                  <FacebookIcon className="size-5 text-[#1877F2]" />
                </a>
                <a
                  href={club.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:bg-accent dark:hover:bg-input/50 p-1 rounded-[2px] flex items-center justify-center"
                >
                  <span className="sr-only">Tiktok</span>
                  <TikTokIcon className="size-5 text-black dark:text-white" />
                </a>
                <a
                  href={club.x_twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="size-5"
                >
                  <span className="sr-only">X</span>
                  <XIcon className="size-5 text-black dark:text-white" />
                </a>
              </p>
            </div>

            <Button variant="outline">
              <PencilIcon />
              Edit
            </Button>
            <Button variant="outline">
              <ImageIcon />
              Picture
            </Button>
          </div>
          {/* Biography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenIcon className="size-5 text-primary" />
                Biography
              </CardTitle>
            </CardHeader>

            <CardContent>
              {club.description ? (
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
          {club.location && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="size-5 text-primary" /> Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <iframe
                  src={club.location}
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                  title={club.name + ' location map'}
                />
              </CardContent>
            </Card>
          )}
          <h2 className="flex items-center gap-2">
            <UsersIcon className="size-5 text-primary" />
            {m.members()}
          </h2>
          <MembersListTable
            clubIds={clubIds}
            onClubIdsChange={setClubIds}
            canFilterClubs={false}
          />
          <h2 className="flex items-center gap-2">
            <HandshakeIcon className="size-5 text-primary" />
            Projects
          </h2>
          <ProjectsListTable
            clubIds={clubIds}
            onClubIdsChange={setClubIds}
            canFilterClubs={false}
          />
        </>
      )}
    </section>
  )
}
