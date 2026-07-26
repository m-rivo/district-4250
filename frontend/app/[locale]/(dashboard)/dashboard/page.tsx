import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function Dashboard() {
  const t = await getTranslations("Index");

  return (
    <Card>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-gray-500">{t("description")}</p>
    </Card>
  );
}
