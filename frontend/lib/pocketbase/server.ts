import PocketBase from "pocketbase";
import { cookies } from "next/headers";

export async function createServerClient() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const cookieStore = await cookies();

  // Cargar la sesión guardada en la cookie
  const authCookie = cookieStore.get("pb_auth");
  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }

  // Escucha los cambios de autenticación para sincronizar la cookie con Next.js
  pb.authStore.onChange(() => {
    cookieStore.set(
      "pb_auth",
      pb.authStore.exportToCookie({ httpOnly: false }),
      {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    );
  });

  return pb;
}
