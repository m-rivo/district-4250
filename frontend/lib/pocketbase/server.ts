import PocketBase from "pocketbase";
import { cookies } from "next/headers";

export async function createServerClient() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const cookieStore = await cookies();

  const authCookie = cookieStore.get("pb_auth");

  if (authCookie?.value) {
    try {
      const decodedCookie = decodeURIComponent(authCookie.value);
      pb.authStore.loadFromCookie(decodedCookie);
    } catch (error) {
      console.error("Error al cargar la cookie de PocketBase:", error);
      pb.authStore.clear();
    }
  }

  return pb;
}
