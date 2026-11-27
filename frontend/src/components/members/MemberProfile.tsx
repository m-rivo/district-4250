import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getMyProfile,
  getOneMember,
  uploadProfilePicture,
} from '#/functions/member.functions'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  BriefcaseBusinessIcon,
  CakeIcon,
  CalendarCheckIcon,
  UserRoundIcon,
  CogIcon,
} from 'lucide-react'
import { Skeleton } from '#/components/ui/skeleton'
import { Badge } from '#/components/ui/badge'
import { format, parseISO } from 'date-fns'
import parse from 'html-react-parser'
import DOMPurify from 'dompurify'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Breadcrumbs } from '#/components/Bradcrumbs'
import EditMemberDialog from '#/components/members/EditMemberDialog'
import { ImageUpdateDialog } from '#/components/ImageUpdateDialog'
import { toast } from 'sonner'
import ErrorCard from '#/components/ErrorCard'
import { AddMemberToClubDialog } from './AddMemberToClubDialog'
import { getMyPermissions } from '#/functions/role.functions'

interface MemberProfileProps {
  memberId?: string
}

export default function MemberProfile({ memberId }: MemberProfileProps) {
  const queryClient = useQueryClient()

  const isOwnProfile = !memberId

  const {
    data: member,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['member', { id: memberId }],
    queryFn: () =>
      isOwnProfile ? getMyProfile() : getOneMember({ data: { id: memberId } }),
  })

  const fullName = `${member?.first_name} ${member?.last_name}`
  const cleanBiography = DOMPurify.sanitize(member?.biography ?? '')

  const { data: permissions = [] } = useQuery({
    queryKey: ['my-permissions'],
    queryFn: () => getMyPermissions(),
  })

  const canAddMembers = permissions.includes('club.members.add')
  const canRemoveMembers = permissions.includes('club.members.remove')
  const canUpdateMembersRoles = permissions.includes(
    'club.members.roles.update',
  )

  if (isError) {
    return (
      <ErrorCard
        title={`Error loading member with ID: ${memberId}`}
        message={error.message}
      />
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
            routes={
              isOwnProfile ? [] : [{ route: '/members', name: 'Members' }]
            }
            page={isOwnProfile ? 'My profile' : fullName}
          />
          {/* Header */}
          <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 sm:flex-row sm:items-center">
            <Avatar className="size-24 rounded-xl">
              <AvatarImage
                src={member.profile_picture ?? undefined}
                alt={fullName}
              />
              <AvatarFallback className="rounded-xl text-2xl">
                {member.first_name[0]}
                {member.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {fullName}
                </h1>

                <Badge variant="green">{member.membership_status}</Badge>
              </div>

              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                {member.club ? (
                  <>
                    <CogIcon className="size-4 text-yellow-500" />
                    {member.expand?.club?.name}
                  </>
                ) : (
                  'No club assigned'
                )}
              </p>

              <div className="flex flex-wrap gap-2">
                {member.expand?.roles?.map((role) => (
                  <Badge key={role.id} variant="sky">
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>

            {isOwnProfile && (
              <>
                <EditMemberDialog data={member} />
                <ImageUpdateDialog
                  title="profile picture"
                  onSave={async (file) => {
                    await uploadProfilePicture(member.id, file)

                    await queryClient.invalidateQueries({
                      queryKey: ['member', { id: member.id }],
                    })

                    toast.success('Profile picture updated successfully.')
                  }}
                />
              </>
            )}
            {!member.club && canAddMembers && (
              <AddMemberToClubDialog member={member} />
            )}
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
              {member.biography ? (
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
                  <CogIcon className="size-5 text-primary" />
                  Rotaract club
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {member.expand?.club?.name ?? 'No club assigned'}
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
                  {member.member_since
                    ? format(parseISO(member.member_since), 'MMMM dd, yyyy')
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
                  {member.profession || 'Not provided'}
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
                  {member.birth_date
                    ? format(parseISO(member.birth_date), 'MMMM dd, yyyy')
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
