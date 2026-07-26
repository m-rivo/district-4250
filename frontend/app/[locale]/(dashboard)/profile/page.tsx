import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function Profile() {
  const t = await getTranslations("Perfil");

  return (
    <Card>
      <h1 className="text-2xl font-bold">Profile</h1>
    </Card>
  );
}
