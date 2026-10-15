import { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Field, FieldGroup } from './ui/field'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { toast } from 'sonner'
import { MailIcon, UserRoundPlusIcon } from 'lucide-react'
import { Spinner } from './ui/spinner'

export default function InviteMemberDialog() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setHasError(false)

    try {
      setIsLoading(true)
      /*    const result = await login({ data: { email, password } }) */
      toast.success('Invitation sent.', {
        description: 'An invitation email has been sent to the recipient.',
      })
    } catch (error: any) {
      toast.error('Unable to send invitation', {
        description: 'Please check the email address and try again.',
      })
      console.error('Unable to send invitation: ', error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserRoundPlusIcon /> Invite a member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Invite a new member</DialogTitle>
            <DialogDescription>
              Send an email invitation to someone you'd like to add to District
              4250.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={hasError}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Sending invitation
                </>
              ) : (
                <>
                  <MailIcon /> Send invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
