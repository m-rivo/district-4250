"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "es" ? "en" : "es";

    // Usamos startTransition para evitar re-renders abruptos en la hidratación
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLanguage}
      disabled={isPending}
    >
      {locale === "es" ? "EN" : "ES"}
    </Button>
  );
}
