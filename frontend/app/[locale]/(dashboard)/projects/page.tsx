import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function Projects() {
  const t = await getTranslations("Projects");

  return (
    <Card>
      <h1 className="text-2xl font-bold">Projects</h1>
    </Card>
  );
}
