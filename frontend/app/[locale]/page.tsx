// app/[locale]/page.tsx
import { redirect } from "@/i18n/routing";

export default async function IndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Si no está autenticado -> a /login
  // Si está autenticado -> a /dashboard
  redirect({ href: "/login", locale });
}
