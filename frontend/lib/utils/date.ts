import dayjs from "dayjs";
import "dayjs/locale/es";

export function calculateAge(birthDate?: string | null): number | null {
  if (!birthDate) return null;
  return dayjs().diff(dayjs(birthDate), "year");
}

export function formatDate(
  date?: string | null,
  locale: string = "es",
): string {
  if (!date) return "";
  const formatPattern = locale === "es" ? "D [de] MMMM, YYYY" : "MMMM D, YYYY";
  return dayjs(date).locale(locale).format(formatPattern);
}
