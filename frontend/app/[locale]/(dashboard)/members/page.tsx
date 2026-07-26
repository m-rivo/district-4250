import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/pocketbase/server";
import { Member } from "@/interfaces/member";

export default async function Members() {
  const t = await getTranslations("Members");
  const pb = await createServerClient();

  const records = await pb.collection("members").getFullList({
    sort: "first_name",
  });

  const members: Member[] = records.map((record) => ({
    id: record.id,
    first_name: record.first_name,
    first_surname: record.first_surname,
  }));

  return (
    <Card>
      <h1 className="text-2xl font-bold">Members</h1>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.first_name + " " + member.first_surname}
          </li>
        ))}
      </ul>
    </Card>
  );
}
