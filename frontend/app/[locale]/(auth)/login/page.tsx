import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function Login() {
  const t = await getTranslations("Login");

  return (
    <Card>
      <h1 className="text-2xl font-bold">Login</h1>
    </Card>
  );
}
