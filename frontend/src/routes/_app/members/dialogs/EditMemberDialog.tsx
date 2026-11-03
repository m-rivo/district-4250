import { PencilIcon, ChevronDownIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '#/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import type { MemberProfile } from '#/types/member'
import { RichTextEditor } from '#/components/RichTextEditor'
import { updateMember } from '#/functions/member.functions'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { UpdateMemberFormSchema } from '#/lib/schemas/member.schemas'
import type { UpdateMemberSchema } from '#/lib/schemas/member.schemas'
import { Spinner } from '#/components/ui/spinner'
import { useQueryClient } from '@tanstack/react-query'

export default function EditMemberDialog({ data }: { data: MemberProfile }) {
  const [date, setDate] = useState<Date | undefined>(
    data.birth_date ? new Date(data.birth_date) : undefined,
  )
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      first_name: data.first_name,
      first_surname: data.first_surname,
      birth_date: data.birth_date.slice(0, 10),
      profession: data.profession || '',
      biography: data.biography || '',
    } satisfies UpdateMemberSchema,

    validators: {
      onSubmit: UpdateMemberFormSchema,
    },

    onSubmit: async ({ value }) => {
      const updateData = {
        id: data.id,
        ...value,
      }

      try {
        await updateMember({ data: updateData })

        await queryClient.invalidateQueries({
          queryKey: ['member', { id: data.id }],
        })

        toast.success('Profile updated successfully.')

        setOpen(false)
      } catch (error) {
        console.error('Update failed:', error)

        toast.error('Unable to update member.', {
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

        if (nextOpen) {
          form.reset()
          setDate(new Date(data.birth_date))
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <PencilIcon className="size-4" />
          Edit profile
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
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <FieldGroup>
              <form.Field name="first_name">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        First name <span className="text-destructive">*</span>
                      </FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="given-name"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={errors.length > 0}
                        required
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
              <form.Field name="first_surname">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Last name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="surname"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={errors.length > 0}
                        required
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
            <FieldGroup>
              <form.Field name="birth_date">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Birthdate <span className="text-destructive">*</span>
                      </FieldLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id={field.name}
                            type="button"
                            variant="outline"
                            className="w-full justify-between font-normal"
                            aria-invalid={errors.length > 0}
                          >
                            {date ? format(date, 'PPP') : 'Pick a date'}
                            <ChevronDownIcon className="size-4" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            defaultMonth={date}
                            onSelect={(selected) => {
                              if (selected) {
                                setDate(selected)
                                field.handleChange(
                                  format(selected, 'yyyy-MM-dd'),
                                )
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      {errors.length > 0 && (
                        <p className="text-sm text-destructive" role="alert">
                          {errors[0]?.message}
                        </p>
                      )}
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="profession">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Profession</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="profession"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )
                }}
              </form.Field>
            </FieldGroup>
          </div>
          <FieldGroup>
            <form.Field name="biography">
              {(field) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="biography">Biography</FieldLabel>
                    <RichTextEditor
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
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
