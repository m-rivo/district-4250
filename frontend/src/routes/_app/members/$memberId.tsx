import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getOneMember,
  uploadProfilePicture,
} from '#/functions/member.functions'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  BriefcaseBusinessIcon,
  SettingsIcon,
  CakeIcon,
  CalendarCheckIcon,
  CircleXIcon,
  UserRoundIcon,
} from 'lucide-react'
import { Skeleton } from '#/components/ui/skeleton'
import { Badge } from '#/components/ui/badge'
import { format, parseISO } from 'date-fns'
import parse from 'html-react-parser'
import DOMPurify from 'dompurify'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Breadcrumbs } from '#/components/Bradcrumbs'
import EditMemberDialog from '#/components/members/EditMemberDialog'
import { ProfilePictureDialog } from '#/components/members/ProfilePictureDialog'
import { toast } from 'sonner'

// FIXME: bug de calendario de birth date
export const Route = createFileRoute('/_app/members/$memberId')({
  component: MemberPage,
})

function MemberPage() {
  const { memberId } = Route.useParams()
  const queryClient = useQueryClient()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['member', { id: memberId }],
    queryFn: () => getOneMember({ data: { id: memberId } }),
  })

  const fullName = `${data?.first_name} ${data?.last_name}`
  const cleanBiography = DOMPurify.sanitize(data?.biography ?? '')

  if (isError) {
    // TODO: hacer un componente reutilizable de este
    return (
      <section className="rounded-2xl p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold sm:text-5xl">Member</h1>

        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <CircleXIcon className="size-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Error loading member with Id: {memberId}
            </h2>
            <p role="alert" className="text-sm text-muted-foreground">
              {error.message}
            </p>
          </div>
        </CardContent>
      </section>
    )
  }

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
            routes={[{ route: '/members', name: 'Members' }]}
            page={fullName}
          />
          {/* Header */}
          <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 sm:flex-row sm:items-center">
            <Avatar className="size-24 rounded-xl">
              <AvatarImage
                src={data.profile_picture ?? undefined}
                alt={fullName}
              />
              <AvatarFallback className="rounded-xl text-2xl">
                {data.first_name[0]}
                {data.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {fullName}
                </h1>

                <Badge variant="green">{data.membership_status}</Badge>
              </div>

              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <SettingsIcon className="size-4" />
                {data.expand?.club?.name ?? 'No club assigned'}
              </p>

              <div className="flex flex-wrap gap-2">
                {data.expand?.roles?.map((role) => (
                  <Badge key={role.id} variant="sky">
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>

            <EditMemberDialog data={data} />
            <ProfilePictureDialog
              onSave={async (file) => {
                await uploadProfilePicture(memberId, file)

                await queryClient.invalidateQueries({
                  queryKey: ['member', { id: memberId }],
                })

                toast.success('Profile picture updated successfully.')
              }}
            />
          </div>

          {/* Biography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRoundIcon className="size-5 text-primary" />
                Biography
              </CardTitle>
            </CardHeader>

            <CardContent>
              {data.biography ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {parse(cleanBiography)}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No biography available.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <SettingsIcon className="size-5 text-primary" />
                  Rotaract club
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {data.expand?.club?.name ?? 'No club assigned'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarCheckIcon className="size-5 text-primary" />
                  Member since
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {data.member_since
                    ? format(parseISO(data.member_since), 'MMMM dd, yyyy')
                    : 'Not provided'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BriefcaseBusinessIcon className="size-5 text-primary" />
                  Professional area
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {data.profession || 'Not provided'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CakeIcon className="size-5 text-primary" />
                  Birth date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {data.birth_date
                    ? format(parseISO(data.birth_date), 'MMMM dd, yyyy')
                    : 'Not provided'}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </section>
  )
}
