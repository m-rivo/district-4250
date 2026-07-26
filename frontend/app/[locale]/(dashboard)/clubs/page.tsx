import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/pocketbase/server";
import { Club } from "@/interfaces/club";

export default async function Clubs() {
  const t = await getTranslations("Clubs");

  let clubs: Club[] = [];

  try {
    const pb = createServerClient();

    const records = await (await pb).collection("clubs").getFullList({
      sort: "name",
    });

    clubs = records.map((record) => ({
      id: record.id,
      name: record.name,
    }));
  } catch (error) {
    console.error(error);
  }

  return (
    <Card>
      <h1 className="text-2xl font-bold">Clubs</h1>
      <ul>
        {clubs.map((club) => (
          <li key={club.id}>{club.name}</li>
        ))}
      </ul>
    </Card>
  );
}
