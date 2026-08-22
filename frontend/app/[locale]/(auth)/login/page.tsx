import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/app/actions/auth";
import { Link } from "@/i18n/routing";

export default async function Login() {
  const t = await getTranslations("Login");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Login to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={loginAction} className="w-full max-w-sm">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="form-email">Email</FieldLabel>
              <Input
                id="form-email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="form-password">Password</FieldLabel>
              <Input
                id="form-password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </Field>
          </FieldGroup>
          <Button className="w-full mt-6" type="submit">
            Login
          </Button>
          <Link href="/signup">
            <Button className="w-full mt-2" variant="link">
              Don&apos;t have an account? Sign up
            </Button>
          </Link>
          <Button className="w-full mt-2" variant="link">
            Forgot password?
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
