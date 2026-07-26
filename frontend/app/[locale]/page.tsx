import { Card } from "@/components/ui/card";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "@/components/language-toggle";

export default async function Home() {
  const t = await getTranslations("Index");

  return (
    <main className="p-8">
      <Card>
        <ThemeModeToggle />
        <LanguageToggle />
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-gray-500">{t("description")}</p>
      </Card>
    </main>
  );
}
