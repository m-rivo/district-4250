import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/pocketbase/server";
import { Member } from "@/interfaces/member";
import { DataTable as MembersDataTable } from "@/components/members-data-table/data-table";

export default async function Members() {
  const t = await getTranslations("Members");

  let members: Member[] = [];

  try {
    const pb = await createServerClient();

    const records = await pb.collection("members").getFullList({
      sort: "first_name",
      expand: "club,roles",
    });

    members = records.map((record) => ({
      id: record.id,
      first_name: record.first_name,
      second_name: record.second_name,
      first_surname: record.first_surname,
      second_surname: record.second_surname,
      club: record?.expand?.club,
      roles: record?.expand?.roles,
      is_active: record.is_active,
      birth_date: record.birth_date,
      profile_picture: record.profile_picture,
    }));
  } catch (error) {
    console.error(error);
  }

  return (
    <Card>
      <h1 className="text-2xl font-bold">{t("members")}</h1>
      <MembersDataTable data={members} />
    </Card>
  );
}
