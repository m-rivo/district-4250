import { PencilIcon, ChevronDownIcon, PlusIcon } from 'lucide-react'
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
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Spinner } from '#/components/ui/spinner'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Project } from '#/types/project'
import { ProjectFormSchema } from '#/lib/schemas/project.schemas'
import type { ProjectFormValues } from '#/lib/schemas/project.schemas'
import { createProject, updateProject } from '#/functions/project.functions'
import { Textarea } from '../ui/textarea'
import { getFullClubsList } from '#/functions/club.functions'
import { ComboboxMultipleGroupedClubs } from '../ComboboxMultipleGroupedClubs'
import type { DateRange } from 'react-day-picker'

interface ProjectFormDialogProps {
  data?: Project | undefined
  page?: number
  perPage?: number
  search?: string
  clubIds?: string[]
  dateRange?: DateRange
}

export default function ProjectFormDialog({
  data,
  page,
  perPage,
  search,
  clubIds,
  dateRange,
}: ProjectFormDialogProps) {
  const [date, setDate] = useState<Date | undefined>(
    data?.start_date ? new Date(data.start_date) : undefined,
  )
  const [open, setOpen] = useState<boolean>(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const startDateFrom = dateRange?.from
    ? format(dateRange.from, 'yyyy-MM-dd')
    : ''

  const startDateTo = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

  const { data: clubList = [], isPending: isLoadingClubs } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => getFullClubsList(),
  })

  const queryClient = useQueryClient()

  const getInitialValues = (): ProjectFormValues => ({
    title: data?.title ?? '',
    description: data?.description ?? '',
    start_date: data?.start_date.slice(0, 10) ?? '',
    evidence: data?.evidence ?? '',
    cost: data?.cost ?? 0,
    clubs: data?.clubs ?? [],
  })

  const form = useForm({
    defaultValues: getInitialValues(),

    validators: {
      onSubmit: ProjectFormSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        if (data?.id) {
          await updateProject({
            data: {
              id: data.id,
              ...value,
            },
          })

          await queryClient.invalidateQueries({
            queryKey: ['project', { id: data.id }],
          })

          toast.success('Project updated successfully.')
        } else {
          await createProject({ data: value })

          await queryClient.invalidateQueries({
            queryKey: [
              'projects',
              { page, perPage, search, clubIds, startDateFrom, startDateTo },
            ],
          })

          toast.success('Project created successfully.')
        }

        setOpen(false)
      } catch (error) {
        console.error('Project save failed:', error)

        toast.error(
          data?.id ? 'Unable to update project.' : 'Unable to create project.',
          {
            description: 'Please check your information and try again.',
          },
        )
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
          setDate(data?.start_date ? new Date(data.start_date) : undefined)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant={data?.id ? 'outline' : 'default'}>
          {data?.id ? (
            <PencilIcon className="size-4" />
          ) : (
            <PlusIcon className="size-4" />
          )}
          {data?.id ? 'Edit project' : 'Create project'}
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
            <DialogTitle>
              {data?.id ? 'Edit project' : 'Create project'}
            </DialogTitle>
            <DialogDescription>
              {data?.id
                ? 'Make changes to the project here. Click save when you are done.'
                : 'Complete the information to register a new project.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <FieldGroup>
              <form.Field name="title">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Title <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="title"
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
              <form.Field name="evidence">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Evidence <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="evidence"
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
              <form.Field name="cost">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Cost <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min="0"
                        step="any"
                        value={
                          Number.isNaN(field.state.value)
                            ? ''
                            : field.state.value
                        }
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value === ''
                              ? Number.NaN
                              : e.target.valueAsNumber,
                          )
                        }
                        aria-invalid={errors.length > 0}
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
              <form.Field name="clubs">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Clubs <span className="text-destructive">*</span>
                      </FieldLabel>
                      <ComboboxMultipleGroupedClubs
                        data={clubList}
                        value={field.state.value}
                        setValue={(ids) => field.handleChange(ids)}
                        isLoading={isLoadingClubs}
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
              <form.Field name="start_date">
                {(field) => {
                  const errors = field.state.meta.errors

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Start date <span className="text-destructive">*</span>
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
            </FieldGroup>
          </div>
          <FieldGroup>
            <form.Field name="description">
              {(field) => {
                const errors = field.state.meta.errors

                return (
                  <Field>
                    <FieldLabel htmlFor="description">
                      Description <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      autoComplete="description"
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
                  {isSubmitting
                    ? 'Saving...'
                    : data?.id
                      ? 'Save changes'
                      : 'Create project'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
