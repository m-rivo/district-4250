import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function Clubs() {
  const t = await getTranslations("Clubs");

  return (
    <Card>
      <h1 className="text-2xl font-bold">Clubs</h1>
    </Card>
  );
}
