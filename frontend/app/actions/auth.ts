"use server";

import { createServerClient } from "@/lib/pocketbase/server";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;

  const locale = await getLocale();

  const pb = await createServerClient();

  try {
    await pb.collection("users").create({
      email,
      password,
      passwordConfirm,
      emailVisibility: false,
    });
  } catch (error: any) {
    console.error("Error al registrar usuario:", error?.response || error);
    // Aquí puedes retornar un objeto de error para mostrarlo en UI si usas useActionState
    throw new Error("No se pudo crear la cuenta.");
  }

  redirect({ href: "/login", locale });
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const locale = await getLocale();

  const pb = await createServerClient();

  try {
    await pb.collection("users").authWithPassword(email, password);

    const cookieStore = await cookies();
    cookieStore.set(
      "pb_auth",
      pb.authStore.exportToCookie({ httpOnly: false }),
      {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    );
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error?.response || error);
    throw new Error("No se pudo iniciar sesión.");
  }

  redirect({ href: "/dashboard", locale });
}

export async function logoutAction() {
  const locale = await getLocale();
  const pb = await createServerClient();

  pb.authStore.clear();

  redirect({ href: "/login", locale });
}
