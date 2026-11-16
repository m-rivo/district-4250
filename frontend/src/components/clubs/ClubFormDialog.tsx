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
import { RichTextEditor } from '#/components/RichTextEditor'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Spinner } from '#/components/ui/spinner'
import { useQueryClient } from '@tanstack/react-query'
import type { ClubProfile } from '#/types/club'
import { updateClub } from '#/functions/club.functions'
import { UpdateClubFormSchema } from '#/lib/schemas/club.schemas'
import type { UpdateClubSchema } from '#/lib/schemas/club.schemas'
import { SelectClubStatus } from './SelectClubStatus'
import { SelectOneCountry } from './SelectOneCountry'
import { SelectRegion } from './SelectRegion'

export default function ClubFormDialog({ data }: { data: ClubProfile }) {
  const [date, setDate] = useState<Date | undefined>(
    data.foundation_date ? new Date(data.foundation_date) : undefined,
  )
  const [open, setOpen] = useState<boolean>(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      club_id: data.club_id,
      name: data.name,
      foundation_date: data.foundation_date.slice(0, 10),
      country: data.country,
      status: data.status,
      description: data.description || '',
      region: data.region || '',
      sponsor_club: data.sponsor_club || '',
      location: data.location || '',
      instagram: data.instagram || '',
      tiktok: data.tiktok || '',
      x_twitter: data.x_twitter || '',
      facebook: data.facebook || '',
    } satisfies UpdateClubSchema,

    validators: {
      onSubmit: UpdateClubFormSchema,
    },

    onSubmit: async ({ value }) => {
      const updateData = {
        id: data.id,
        ...value,
      }

      try {
        await updateClub({ data: updateData })

        await queryClient.invalidateQueries({
          queryKey: ['club', { id: data.id }],
        })

        toast.success('Club updated successfully.')

        setOpen(false)
      } catch (error) {
        console.error('Update failed:', error)

        toast.error('Unable to update club.', {
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
          setDate(new Date(data.foundation_date))
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <PencilIcon className="size-4" />
          Edit club
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit club</DialogTitle>
            <DialogDescription>
              Make changes to the club here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <FieldGroup>
              <form.Field name="club_id">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Rotary ID <span className="text-destructive">*</span>
                      </FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="rotary-id"
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
              <form.Field name="name">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="name"
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
              <form.Field name="status">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel>
                        Status <span className="text-destructive">*</span>
                      </FieldLabel>

                      <SelectClubStatus
                        value={field.state.value}
                        setValue={field.handleChange}
                        onBlur={field.handleBlur}
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
              <form.Field name="country">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel>
                        Country <span className="text-destructive">*</span>
                      </FieldLabel>

                      <SelectOneCountry
                        value={field.state.value}
                        setValue={field.handleChange}
                        onBlur={field.handleBlur}
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
              <form.Field name="region">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Region</FieldLabel>
                      <SelectRegion
                        value={field.state.value}
                        setValue={field.handleChange}
                        onBlur={field.handleBlur}
                      />
                    </Field>
                  )
                }}
              </form.Field>
              <form.Field name="sponsor_club">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Sponsor club</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="sponsor_club"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )
                }}
              </form.Field>
            </FieldGroup>
            <FieldGroup>
              <form.Field name="foundation_date">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Foundation date{' '}
                        <span className="text-destructive">*</span>
                      </FieldLabel>

                      <Popover
                        open={calendarOpen}
                        onOpenChange={setCalendarOpen}
                      >
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
                            captionLayout="dropdown"
                            onSelect={(selected) => {
                              if (selected) {
                                setDate(selected)
                                setCalendarOpen(false)
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

              <form.Field name="location">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="location"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )
                }}
              </form.Field>
              <form.Field name="instagram">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Instagram</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="instagram"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )
                }}
              </form.Field>
              <form.Field name="tiktok">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Tiktok</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="tiktok"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )
                }}
              </form.Field>
              <form.Field name="x_twitter">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>X (Twitter)</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="x_twitter"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )
                }}
              </form.Field>
              <form.Field name="facebook">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Facebook</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="facebook"
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
            <form.Field name="description">
              {(field) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
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
