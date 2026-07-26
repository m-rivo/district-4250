import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function Members() {
  const t = await getTranslations("Members");

  return (
    <Card>
      <h1 className="text-2xl font-bold">Members</h1>
    </Card>
  );
}
