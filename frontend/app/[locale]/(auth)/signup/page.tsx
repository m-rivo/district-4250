import { signupAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function Signup() {
  const t = await getTranslations("Signup");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Signup</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={signupAction} className="w-full max-w-sm">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="passwordConfirm">
                Confirm Password
              </FieldLabel>
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                placeholder="••••••••"
                required
              />
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full mt-6">
            Submit
          </Button>
          <Link href="/login">
            <Button className="w-full mt-2" variant="link">
              Already have an account? Login
            </Button>
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
