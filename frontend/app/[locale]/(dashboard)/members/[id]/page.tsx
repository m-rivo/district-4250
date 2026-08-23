import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/pocketbase/server";
import { Member } from "@/interfaces/member";
import { ProfilePageProps } from "@/interfaces/profile-page-props";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateAge, formatDate } from "@/lib/utils/date";
import { CakeIcon } from "lucide-react";

export default async function MemberProfile({ params }: ProfilePageProps) {
  const { id, locale } = await params;
  const t = await getTranslations("Profile");

  const pb = await createServerClient();

  let member: Member | null = null;

  try {
    const record = await pb.collection("members").getOne(id, {
      expand: "club,roles",
    });

    member = {
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
    };
  } catch (error) {
    console.error(error);
  }

  if (!member) {
    return <p>NO MEMBER FOUND</p>;
  }

  const formattedBirthDate = formatDate(member.birth_date, locale);
  const age = calculateAge(member.birth_date);

  return (
    <Card>
      <h1 className="text-2xl font-bold">{t("profile")}</h1>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>
          {(
            member.first_name.charAt(0) + member.first_surname.charAt(0)
          ).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-bold">
        {member.first_name + " " + member.first_surname}
      </h2>
      <p>Club: {member.club.name}</p>
      <p>Roles:</p>
      <div className="flex w-full flex-wrap gap-2">
        {member.roles.map((role) => (
          <Badge key={role.id}>{role.name}</Badge>
        ))}
      </div>

      <p className="flex items-center gap-2">
        <CakeIcon /> {t("birth_date")}: {formattedBirthDate}
      </p>
      <p>
        {t("age")}: {age}
      </p>
    </Card>
  );
}
