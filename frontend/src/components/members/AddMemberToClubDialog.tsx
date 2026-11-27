import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { UserPlus2Icon } from 'lucide-react'
import { ComboboxMultiple } from '../ComboboxMultiple'
import { SelectMembershipStatus } from './SelectMembershipStatus'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getClubRoles } from '#/functions/role.functions'
import { useState } from 'react'
import type { MembershipStatus } from '#/types/member'
import { toast } from 'sonner'
import { useForm } from '@tanstack/react-form'
import { addMemberToClub } from '#/functions/member.functions'
import { Spinner } from '../ui/spinner'
import { AddMemberToClubFormSchema } from '#/lib/schemas/member.schemas'

export function AddMemberToClubDialog({
  member,
}: {
  member: { id: string; first_name: string; last_name: string }
}) {
  const [open, setOpen] = useState(false)

  const { data: roleList = [], isPending: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getClubRoles(),
  })

  const clubBoardRoles = roleList.filter(
    (role) => role.category === 'club_board',
  )

  const clubDirectorRoles = roleList.filter(
    (role) => role.category === 'club_director',
  )

  const fullName = member.first_name + ' ' + member.last_name

  const queryClient = useQueryClient()

  type AddMemberToClubForm = {
    board_roles: string[]
    director_roles: string[]
    membership_status: MembershipStatus | null
  }

  const form = useForm({
    defaultValues: {
      board_roles: [],
      director_roles: [],
      membership_status: null,
    } satisfies AddMemberToClubForm,

    validators: {
      onSubmit: AddMemberToClubFormSchema,
    },

    onSubmit: async ({ value }) => {
      const updateData = {
        memberId: member.id,
        roles: [...value.board_roles, ...value.director_roles],
        membership_status: value.membership_status!,
      }

      try {
        await addMemberToClub({ data: updateData })

        await queryClient.invalidateQueries({
          queryKey: ['member', { id: member.id }],
        })

        toast.success('Member was added to club successfully.')

        setOpen(false)
      } catch (error) {
        console.error('Add failed:', error)

        toast.error('Unable to add member.', {
          description: 'Please check your information and try again.',
        })
      }
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">
          <UserPlus2Icon /> Add to club
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>Add {fullName} to your club</DialogTitle>
            <DialogDescription>
              Select a status. You can optionally add roles. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <form.Field name="membership_status">
              {(field) => {
                const errors = field.state.meta.errors

                return (
                  <Field>
                    <FieldLabel>
                      Membership status
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <SelectMembershipStatus
                      value={field.state.value}
                      setValue={field.handleChange}
                    />

                    {errors.length > 0 && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors[0]?.message}
                      </p>
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="board_roles">
              {(field) => {
                const errors = field.state.meta.errors

                return (
                  <Field>
                    <FieldLabel>Club board roles</FieldLabel>

                    <ComboboxMultiple
                      data={clubBoardRoles}
                      value={field.state.value}
                      setValue={field.handleChange}
                      placeholder="(optional)"
                      isLoading={isLoadingRoles}
                    />

                    {errors.length > 0 && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors[0]?.message}
                      </p>
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="director_roles">
              {(field) => {
                const errors = field.state.meta.errors

                return (
                  <Field>
                    <FieldLabel>Club director roles</FieldLabel>

                    <ComboboxMultiple
                      data={clubDirectorRoles}
                      value={field.state.value}
                      setValue={field.handleChange}
                      placeholder="(optional)"
                      isLoading={isLoadingRoles}
                    />

                    {errors.length > 0 && (
                      <p className="text-sm text-destructive" role="alert">
                        {errors[0]?.message}
                      </p>
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <form.Subscribe
              selector={(state) => [state.isSubmitting, state.canSubmit]}
            >
              {([isSubmitting, canSubmit]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting && <Spinner data-icon="inline-start" />}
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
