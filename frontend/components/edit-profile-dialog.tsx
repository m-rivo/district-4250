"use client";

import { ActionState, updateMemberAction } from "@/app/actions/member-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Member } from "@/interfaces/member";
import { UserPen } from "lucide-react";
import { useActionState, useState } from "react";
import { Spinner } from "./ui/spinner";

export function EditProfileDialog({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);

  const updateMemberWithId = updateMemberAction.bind(null, member.id);

  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState | null, formData: FormData) => {
      const result = await updateMemberWithId(prevState, formData);

      if (result.success) {
        setOpen(false);
      }

      return result;
    },
    null,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <UserPen data-icon="inline-start" /> Edit profile
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          {state?.error && (
            <p className="text-sm font-medium text-destructive">
              {state.error}
            </p>
          )}
          {state?.success && (
            <p className="text-sm font-medium text-emerald-600">
              ¡Socio actualizado con éxito!
            </p>
          )}
          <FieldGroup>
            <Field>
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                name="first_name"
                defaultValue={member.first_name}
              />
            </Field>
            <Field>
              <Label htmlFor="second_name">Second name</Label>
              <Input
                id="second_name"
                name="second_name"
                defaultValue={member.second_name}
              />
            </Field>
            <Field>
              <Label htmlFor="first_surname">First surname</Label>
              <Input
                id="first_surname"
                name="first_surname"
                defaultValue={member.first_surname}
              />
            </Field>
            <Field>
              <Label htmlFor="second_surname">Second surname</Label>
              <Input
                id="second_surname"
                name="second_surname"
                defaultValue={member.second_surname}
              />
            </Field>
            <Field>
              <Label htmlFor="birth_date">Birth date</Label>
              <Input
                id="birth_date"
                name="birth_date"
                defaultValue={member.birth_date}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
